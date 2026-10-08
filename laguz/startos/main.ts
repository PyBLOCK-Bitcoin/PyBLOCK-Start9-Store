import { FileHelper } from '@start9labs/start-sdk'
import { chown, mkdir, readFile, rename, rm, writeFile } from 'fs/promises'
import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  appGid,
  appUid,
  credsHostDir,
  credsSubdir,
  dataDir,
  explorerUrl,
  knotsCookieFile,
  knotsMnt,
  knotsPackageId,
  knotsRpcHostId,
  knotsRpcPort,
  knotsVolumeId,
  lfGrpcHostId,
  lfGrpcPort,
  lfMacaroonDir,
  lfMnt,
  lfPackageId,
  lfRestHostId,
  lfRestPort,
  lfVolumeId,
  mainVolumeHost,
  mempoolPort,
  relayUrl,
  shimCredsDir,
  uiPort,
} from './utils'

/**
 * Two processes, from two published images:
 *
 *  - `mempool`: laguz/mempool, a read-only mempool.space-style API (fees,
 *    blocks, wallet UTXOs and transactions) answered from Bitcoin Knots
 *    (BLAKE2b) over RPC and from Lightning Fork's REST API with its readonly
 *    macaroon. Listens on 8032 inside this service only; nothing exports it.
 *  - `hub`: laguz/hub, the web UI on 8080, driving Lightning Fork over gRPC
 *    with its admin macaroon, and reading the shim over the loopback the
 *    subcontainers share.
 *
 * Neither process mounts anything of its dependencies. A third subcontainer,
 * `deps`, holds read-only mounts of Lightning Fork's and the companion's
 * `main` volumes; this script reads tls.cert, the two macaroons and the RPC
 * cookie through it, copies the Lightning files into our own volume (owned by
 * the image's uid 1000, which cannot read LND's root-owned 0600 macaroons)
 * and passes the cookie to the shim. The volume of Lightning Fork also holds
 * its wallet password and wallet database: keeping those out of the
 * long-running, network-facing processes is the point of the extra
 * subcontainer. Each source file is read under a `.const` watch, so a
 * macaroon rotation (Lightning Fork's Revoke Macaroons) or a new cookie (the
 * node restarted) re-runs main with fresh copies.
 */
export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Laguz Hub'))

  // Bridge addresses (10.0.3.1:<port>) of the dependencies' bindings. Each is
  // watched: an install, uninstall or port change re-runs main.
  //
  // gRPC is a TLS passthrough: the hub talks to LND itself, whose tls.cert
  // carries the OS IP among its SANs. Lightning Fork only binds it once
  // admin.macaroon exists, i.e. once its wallet has been created.
  const grpc = await sdk.host
    .getBridgeAddress(effects, {
      packageId: lfPackageId,
      hostId: lfGrpcHostId,
      internalPort: lfGrpcPort,
    })
    .const()
  // REST is re-wrapped by the StartOS TLS proxy, which, dialed by IP without
  // SNI, presents a certificate for the dialed address signed by the server's
  // root CA. tls.cert ends with that root CA, so the shim verifies it with
  // tls.cert as its CA file.
  const rest = await sdk.host
    .getBridgeAddress(effects, {
      packageId: lfPackageId,
      hostId: lfRestHostId,
      internalPort: lfRestPort,
    })
    .const()
  const rpc = await sdk.host
    .getBridgeAddress(effects, {
      packageId: knotsPackageId,
      hostId: knotsRpcHostId,
      internalPort: knotsRpcPort,
      ssl: false,
    })
    .const()

  const waitingForLightning = () => ({
    display: i18n('Lightning Fork'),
    fn: () => ({
      result: 'waiting' as const,
      message: i18n(
        'Waiting for Lightning Fork: install it, start it and create or unlock its wallet.',
      ),
    }),
  })
  const waitingForKnots = () => ({
    display: i18n('Bitcoin Knots (BLAKE2b)'),
    fn: () => ({
      result: 'waiting' as const,
      message: i18n(
        'Waiting for Bitcoin Knots (BLAKE2b) Companion to run and write its RPC cookie.',
      ),
    }),
  })

  if (!grpc || !rest || !rpc) {
    let waiting = sdk.Daemons.of(effects)
    if (!grpc || !rest)
      return !rpc
        ? waiting
            .addHealthCheck('lightning-fork', {
              ready: waitingForLightning(),
              requires: [],
            })
            .addHealthCheck('knots', { ready: waitingForKnots(), requires: [] })
        : waiting.addHealthCheck('lightning-fork', {
            ready: waitingForLightning(),
            requires: [],
          })
    return waiting.addHealthCheck('knots', {
      ready: waitingForKnots(),
      requires: [],
    })
  }

  // ---- read the dependencies' files through read-only mounts ----
  const deps = sdk.SubContainer.of(
    effects,
    { imageId: 'mempool' },
    sdk.Mounts.of()
      .mountDependency({
        dependencyId: lfPackageId,
        volumeId: lfVolumeId,
        subpath: null,
        mountpoint: lfMnt,
        readonly: true,
      })
      .mountDependency({
        dependencyId: knotsPackageId,
        volumeId: knotsVolumeId,
        subpath: null,
        mountpoint: knotsMnt,
        readonly: true,
      }),
    'deps',
  )
  const depsRoot = await deps.rootfs

  // React to a replacement, never to the gap: a macaroon root-key rotation
  // deletes the file before re-baking it, and bitcoind removes its cookie
  // while it is down.
  const watched = (path: string) =>
    FileHelper.string(`${depsRoot}${path}`)
      .read(
        (s) => s,
        (prev, next) => next === null || prev === next,
      )
      .const(effects)

  const adminMacPath = `${lfMnt}/${lfMacaroonDir}/admin.macaroon`
  const readonlyMacPath = `${lfMnt}/${lfMacaroonDir}/readonly.macaroon`
  const certPath = `${lfMnt}/tls.cert`
  const cookiePath = `${knotsMnt}/${knotsCookieFile}`

  const adminMacOk = (await watched(adminMacPath)) !== null
  const readonlyMacOk = (await watched(readonlyMacPath)) !== null
  const cert = await watched(certPath)
  const cookie = (await watched(cookiePath))?.trim() ?? null
  const colon = cookie ? cookie.indexOf(':') : -1

  // `deps` only has to exist for the watches above; it runs nothing but a
  // sleep, as the image's unprivileged user.
  let chain = sdk.Daemons.of(effects).addDaemon('deps', {
    subcontainer: deps,
    exec: { command: ['sleep', 'infinity'] },
    ready: {
      display: null,
      fn: () => ({ result: 'success' as const, message: null }),
    },
    requires: [],
  })

  if (!adminMacOk || !readonlyMacOk || !cert) {
    return chain.addHealthCheck('lightning-fork', {
      ready: waitingForLightning(),
      requires: [],
    })
  }
  if (!cookie || colon < 1) {
    return chain.addHealthCheck('knots', {
      ready: waitingForKnots(),
      requires: [],
    })
  }

  // ---- copy the Lightning credentials into our volume, for uid 1000 ----
  await mkdir(credsHostDir, { recursive: true })
  await chown(mainVolumeHost, appUid, appGid)
  await chown(credsHostDir, appUid, appGid)
  const copies: Array<[string, string]> = [
    [certPath, 'tls.cert'],
    [adminMacPath, 'admin.macaroon'],
    [readonlyMacPath, 'readonly.macaroon'],
  ]
  for (const [from, name] of copies) {
    const to = `${credsHostDir}/${name}`
    const bytes = await readFile(`${depsRoot}${from}`)
    // Never through whatever is at the .tmp path: removed, then created
    // afresh (wx fails rather than follow a link left there).
    await rm(`${to}.tmp`, { force: true })
    await writeFile(`${to}.tmp`, bytes, { mode: 0o600, flag: 'wx' })
    await chown(`${to}.tmp`, appUid, appGid)
    await rename(`${to}.tmp`, to)
  }

  const rpcUser = cookie.slice(0, colon)
  const rpcPass = cookie.slice(colon + 1)

  return chain
    .addDaemon('mempool', {
      subcontainer: sdk.SubContainer.of(
        effects,
        { imageId: 'mempool' },
        sdk.Mounts.of().mountVolume({
          volumeId: 'main',
          subpath: credsSubdir,
          mountpoint: shimCredsDir,
          readonly: true,
        }),
        'mempool',
      ),
      exec: {
        command: ['python3', '/app/shim.py'],
        env: {
          LAGUZ_BTC_RPC_URL: `http://${rpc}`,
          LAGUZ_BTC_RPC_USER: rpcUser,
          LAGUZ_BTC_RPC_PASS: rpcPass,
          LAGUZ_LND_REST: `https://${rest}`,
          LAGUZ_LND_TLS_CERT: `${shimCredsDir}/tls.cert`,
          LAGUZ_LND_MACAROON: `${shimCredsDir}/readonly.macaroon`,
          // Reached by the hub over the shared loopback; no binding exports
          // it, so 0.0.0.0 stays inside this service's container.
          LAGUZ_MEMPOOL_BIND: '0.0.0.0',
          LAGUZ_MEMPOOL_PORT: String(mempoolPort),
          LAGUZ_EXPLORER: explorerUrl,
        },
      },
      ready: {
        display: i18n('Mempool shim'),
        fn: () =>
          sdk.healthCheck.checkWebUrl(
            effects,
            `http://127.0.0.1:${mempoolPort}/api/v1/fees/recommended`,
            {
              successMessage: i18n('The mempool shim is answering'),
              errorMessage: i18n('The mempool shim is not answering yet'),
            },
          ),
      },
      requires: ['deps'],
    })
    .addDaemon('hub', {
      subcontainer: sdk.SubContainer.of(
        effects,
        { imageId: 'hub' },
        sdk.Mounts.of().mountVolume({
          volumeId: 'main',
          subpath: null,
          mountpoint: dataDir,
          readonly: false,
        }),
        'hub',
      ),
      exec: {
        command: ['/usr/local/bin/laguz-hub'],
        env: {
          WORK_DIR: dataDir,
          PORT: String(uiPort),
          BIND_ADDRESS: '0.0.0.0',
          NETWORK: 'bitcoin',
          LN_BACKEND_TYPE: 'LND',
          LND_ADDRESS: grpc,
          LND_CERT_FILE: `${dataDir}/${credsSubdir}/tls.cert`,
          LND_MACAROON_FILE: `${dataDir}/${credsSubdir}/admin.macaroon`,
          // No LND_WALLET_PASSWORD_FILE: Lightning Fork owns its wallet and
          // seed; the hub never creates or unlocks it.
          MEMPOOL_API: `http://127.0.0.1:${mempoolPort}/api`,
          RELAY: relayUrl,
          AUTO_LINK_ALBY_ACCOUNT: 'false',
          SEND_EVENTS_TO_ALBY: 'false',
          LOG_LEVEL: '4',
        },
      },
      ready: {
        display: i18n('Web Interface'),
        gracePeriod: 60_000,
        // /api/info answers without a session; /api/health needs one.
        fn: () =>
          sdk.healthCheck.checkWebUrl(
            effects,
            `http://127.0.0.1:${uiPort}/api/info`,
            {
              successMessage: i18n('Laguz Hub is ready'),
              errorMessage: i18n('Laguz Hub is not ready'),
            },
          ),
      },
      requires: ['mempool'],
    })
})
