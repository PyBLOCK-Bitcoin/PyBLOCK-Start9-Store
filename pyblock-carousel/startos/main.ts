import { FileHelper } from '@start9labs/start-sdk'
import { datumConfigJson } from './fileModels/datumConfig'
import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import {
  apiPort,
  coinbaseTagPrimary,
  defaultCoinbaseTagSecondary,
  poolHost,
  poolName,
  poolPort,
  poolPubkey,
  stratumPort,
} from './pool'
import { sdk } from './sdk'
import {
  appGid,
  appUid,
  configPath,
  dataDir,
  gatewayBin,
  knotsCookieFile,
  knotsMnt,
  knotsPackageId,
  knotsRpcHostId,
  knotsRpcPort,
  knotsVolumeId,
} from './utils'

/**
 * Run the gateway as a child of a shell rather than as PID 1: datum_gateway
 * installs no SIGTERM handler, and PID 1 does not get the default action for an
 * unhandled signal, so a stop would wait out the grace period and be killed.
 * The shell forwards TERM/INT and waits until the gateway has really exited.
 * The file limit matches the Umbrel app and Debian's DATUM unit (65535), as far
 * as the hard limit allows.
 */
const launcher = `ulimit -n 65535 2>/dev/null || ulimit -n "$(ulimit -Hn)" 2>/dev/null || true
${gatewayBin} --config=${configPath} &
pid=$!
trap 'kill -TERM "$pid" 2>/dev/null || true' TERM INT
rc=0
wait "$pid" || rc=$?
while [ "$rc" -gt 128 ] && kill -0 "$pid" 2>/dev/null; do
  rc=0
  wait "$pid" || rc=$?
done
exit "$rc"`

/** One value off the gateway's status page (no password needed), tags stripped. */
async function scrape(
  sub: { exec: (cmd: string[]) => Promise<{ stdout: unknown }> },
  label: string,
): Promise<string> {
  try {
    const { stdout } = await sub.exec([
      'sh',
      '-c',
      `curl -s -m 3 http://127.0.0.1:${apiPort}/ | grep -A1 'class="label">${label}:<' | tail -n 1 | sed -e 's/<[^>]*>//g' -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'`,
    ])
    return String(stdout).trim()
  } catch {
    return ''
  }
}

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(`Starting PyBLØCK ${poolName} DATUM gateway`)

  const waitingFor = (display: string, message: string) => ({
    display,
    fn: () => ({ result: 'waiting' as const, message }),
  })
  const knotsDisplay = i18n('Bitcoin Knots (BLAKE2b)')
  const knotsWaiting = i18n(
    'Waiting for Bitcoin Knots (BLAKE2b) Companion to run and write its RPC cookie.',
  )

  // The node's RPC over the StartOS bridge, from its binding's own address
  // list. Watched: installing, starting or re-binding the node re-runs main.
  const rpc = await sdk.host
    .getBridgeAddress(effects, {
      packageId: knotsPackageId,
      hostId: knotsRpcHostId,
      internalPort: knotsRpcPort,
      ssl: false,
    })
    .const()
  if (!rpc) {
    return sdk.Daemons.of(effects).addHealthCheck('knots', {
      ready: waitingFor(knotsDisplay, knotsWaiting),
      requires: [],
    })
  }

  // Watched: any settings change re-runs main, which restarts the gateway
  // with a regenerated config.
  const store = await storeJson.read().const(effects)
  if (!store?.poolAddress) {
    // The critical task from init/watchPayoutAddress normally prevents this.
    return sdk.Daemons.of(effects).addHealthCheck('payout-address', {
      ready: waitingFor(
        i18n('Payout Address'),
        i18n('Set a payout address before mining'),
      ),
      requires: [],
    })
  }

  // Our volume read-write, the node's volume read-only, purely for its RPC
  // cookie: no RPC secret is generated, stored or handed around.
  const subcontainer = await sdk.SubContainer.eager(
    effects,
    { imageId: 'datum' },
    sdk.Mounts.of()
      .mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: dataDir,
        readonly: false,
      })
      .mountDependency({
        dependencyId: knotsPackageId,
        volumeId: knotsVolumeId,
        subpath: null,
        mountpoint: knotsMnt,
        readonly: true,
      }),
    'datum',
  )
  const rootfs = await subcontainer.rootfs

  // bitcoind rewrites its cookie on every start: a new one re-runs main with
  // fresh credentials. React to a replacement, not to the gap while the node
  // is down (it removes the cookie on shutdown).
  const cookie =
    (
      await FileHelper.string(`${rootfs}${knotsMnt}/${knotsCookieFile}`)
        .read(
          (c) => c,
          (prev, next) => next === null || prev === next,
        )
        .const(effects)
    )?.trim() ?? null
  const colon = cookie ? cookie.indexOf(':') : -1

  if (!cookie || colon < 1) {
    // Keep the subcontainer (and so the watch on the cookie) alive.
    return sdk.Daemons.of(effects)
      .addDaemon('deps', {
        subcontainer,
        exec: { command: ['sleep', 'infinity'] },
        ready: {
          display: null,
          fn: () => ({ result: 'success' as const, message: null }),
        },
        requires: [],
      })
      .addHealthCheck('knots', {
        ready: waitingFor(knotsDisplay, knotsWaiting),
        requires: [],
      })
  }

  // The gateway config, regenerated on every start. Values match the PyBLØCK
  // Umbrel app and the pool's published config, except:
  //  - modify_conf is false: this file is an output of the package settings,
  //    so dashboard edits would be lost on the next start;
  //  - work_update_seconds 5 + notify_fallback: there is no blocknotify hook
  //    into the node on StartOS (one node, several gateways), so the gateway
  //    polls the node for new blocks, as Datum Gateway (BLAKE2b) Companion does.
  await datumConfigJson.write(effects, {
    bitcoind: {
      rpcuser: cookie.slice(0, colon),
      rpcpassword: cookie.slice(colon + 1),
      rpcurl: `http://${rpc}`,
      work_update_seconds: 5,
      notify_fallback: true,
    },
    api: {
      listen_port: apiPort,
      modify_conf: false,
      admin_password: store.adminPassword ?? '',
    },
    mining: {
      pool_address: store.poolAddress,
      coinbase_tag_primary: coinbaseTagPrimary,
      coinbase_tag_secondary:
        store.coinbaseTagSecondary || defaultCoinbaseTagSecondary,
      pow_algorithm: 'blake2b',
    },
    stratum: {
      listen_port: stratumPort,
      vardiff_min: 1,
      vardiff_target_shares_min: 8,
    },
    logger: {
      log_to_console: true,
      log_level_console: 2,
    },
    datum: {
      pool_host: poolHost,
      pool_port: poolPort,
      pool_pubkey: poolPubkey,
      pool_pass_workers: true,
      pool_pass_full_users: true,
      pooled_mining_only: true,
    },
  })

  return (
    sdk.Daemons.of(effects)
      // StartOS mounts volumes root-owned and the image runs as `datum`
      // (1000:1000). The config holds the RPC cookie: owner-only.
      .addOneshot('chown', {
        subcontainer,
        exec: {
          command: [
            'sh',
            '-c',
            `chown -R ${appUid}:${appGid} ${dataDir} && chmod 600 ${configPath}`,
          ],
          user: 'root',
        },
        requires: [],
      })
      // Ready when the dashboard answers. Not the stratum port: DATUM only
      // opens it once it has a first job, which takes a synced node.
      .addDaemon('gateway', {
        subcontainer,
        exec: { command: ['bash', '-c', launcher], user: 'datum' },
        ready: {
          display: i18n('Web Interface'),
          fn: () =>
            sdk.healthCheck.checkPortListening(effects, apiPort, {
              successMessage: i18n('The DATUM gateway dashboard is ready'),
              errorMessage: i18n('The DATUM gateway dashboard is not ready'),
            }),
        },
        requires: ['chown'],
      })
      // Whether the pool handshake completed. pooled_mining_only means miners
      // are refused while this is not "Connected and Ready".
      .addHealthCheck('pool-connection', {
        requires: ['gateway'],
        ready: {
          display: i18n('Pool Connection'),
          trigger: sdk.trigger.cooldownTrigger(15000),
          fn: async () => {
            const status = await scrape(subcontainer, 'Status')
            if (/connected and ready/i.test(status)) {
              return {
                result: 'success' as const,
                message: `${poolHost}:${poolPort} · ${status}`,
              }
            }
            return {
              result: 'waiting' as const,
              message: status
                ? `${poolHost}:${poolPort} · ${status}`
                : i18n('Connecting to the pool'),
            }
          },
        },
      })
      // Same id as the official Datum Gateway package, so anything written
      // against it can require this check. `waiting` while closed: the
      // gateway is fine, it is waiting for its first template.
      .addHealthCheck('stratum-interface', {
        requires: ['gateway'],
        ready: {
          display: i18n('Stratum Interface'),
          fn: async () => {
            const res = await sdk.healthCheck.checkPortListening(
              effects,
              stratumPort,
              {
                timeout: 1000,
                successMessage: i18n('Miners can connect'),
                errorMessage: i18n('The gateway is not serving work yet'),
              },
            )
            if (res.result === 'success') return res
            return {
              result: 'waiting' as const,
              message: i18n(
                'Waiting for the node and the pool. The stratum port opens once the gateway has its first block template, which needs a synced node.',
              ),
            }
          },
        },
      })
      .addHealthCheck('stratum-clients-connected', {
        requires: ['gateway'],
        ready: {
          display: i18n('Number of Stratum Clients Connected'),
          trigger: sdk.trigger.cooldownTrigger(10000),
          fn: async () => {
            const num = await scrape(subcontainer, 'Total Work Subscriptions')
            return {
              result: 'success' as const,
              message: num || i18n('Could not read the number of miners'),
            }
          },
        },
      })
      .addHealthCheck('estimated-hashrate', {
        requires: ['gateway'],
        ready: {
          display: i18n('Estimated Hashrate'),
          trigger: sdk.trigger.cooldownTrigger(10000),
          fn: async () => {
            const rate = await scrape(subcontainer, 'Estimated Hashrate')
            return {
              result: 'success' as const,
              message: rate || i18n('Could not read the hashrate'),
            }
          },
        },
      })
  )
})
