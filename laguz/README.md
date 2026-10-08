# laguz

[ᛚ Laguz Hub](https://b.pyblock.xyz:8443/laguz.php), PyBLØCK's
self-custodial Lightning hub for XBT (the Bitcoin BLAKE2b chain), packaged for
StartOS 0.4.0.x (start-sdk 2.0.9, `osVersion` 0.4.0-beta.10, the same SDK as
Lightning Fork).

Laguz Hub is a web wallet and app hub built from Alby Hub with every Alby
service off. It drives an existing **Lightning Fork** node over gRPC: the seed,
on-chain wallet and channels belong to Lightning Fork. The PyBLØCK app connects
to it with Nostr Wallet Connect through `wss://nostr.pyblock.xyz:8443`.

## What it runs

Two published, multi-arch (amd64 + arm64) images, pulled by tag at pack time
(index digests recorded in `startos/manifest/index.ts`, checked by
`make verify-images`):

| Image | Role |
| --- | --- |
| `registry.gitlab.com/astrolexis-group1/laguz/hub:0.1.1` | Web UI on 8080 (the `ui` interface), uid 1000, `WORK_DIR=/data` on the `main` volume |
| `registry.gitlab.com/astrolexis-group1/laguz/mempool:0.1.0` | mempool.space-style API on 127.0.0.1:8032 for the hub (fees, blocks, wallet UTXOs/txs), not exported |

Health checks: *Mempool shim* (`GET /api/v1/fees/recommended`) and *Web
Interface* (`GET /api/info`, which answers without a session; `/api/health`
needs one).

## Dependencies

Both are required (`kind: running`) and both are paulscode's packages,
unmodified:

| Package id | Range | Health checks required | Used for |
| --- | --- | --- | --- |
| `lightning-fork` ([repo](https://github.com/paulscode/lightning-fork-startos), registry `https://start9.paulscode.com`) | `>=0.21.3-beta.17:0` | `lnd`, `wallet-unlock` | gRPC (hub), REST (shim), `tls.cert`, `admin.macaroon`, `readonly.macaroon` |
| `knots-blake2b` ([repo](https://github.com/paulscode/knots-blake2b-startos)) | `>=1.0.0:34` | `node`, `chain` | JSON-RPC for the shim (RPC cookie) |

### How Laguz reaches them

Lightning Fork exports no dependent-facing credentials (no action, no exported
file): its `grpc` and `lnd-connect-rest` interfaces are `lndconnect` URIs for
external wallets. Dependents use the same mechanism its own code uses for
`bitcoind`: bridge addresses plus a read-only mount of the dependency's volume.

- **Addresses** (`sdk.host.getBridgeAddress`, `10.0.3.1:<port>`):
  - LND gRPC: host `grpc`, internal port 10009. TLS passthrough to LND, whose
    `tls.cert` carries the OS IP as a SAN. Only bound once `admin.macaroon`
    exists (wallet created).
  - LND REST: host `control`, internal port 8080. Re-wrapped by the StartOS TLS
    proxy, which (no SNI, dialed by IP) presents a certificate for the dialed
    address signed by the server root CA.
  - Knots RPC: host `rpc`, internal port 18443 (`ssl: false`).
- **Files** (`mountDependency`, read-only, `subpath: null`), mounted only into a
  `deps` subcontainer that runs `sleep infinity`:
  - `lightning-fork` volume `main` (LND's `/root/.lnd`) at `/mnt/lightning-fork`:
    `tls.cert` (leaf + StartOS intermediate + StartOS root CA) and
    `data/chain/bitcoin/mainnet/{admin,readonly}.macaroon`.
  - `knots-blake2b` volume `main` at `/mnt/knots`: `.cookie`.

`main` reads those files under `.const` watches (a macaroon rotation or a new
cookie re-runs it), copies `tls.cert` and both macaroons into our volume at
`lnd/` (0600, uid 1000, since LND's macaroons are root-owned 0600), and passes
the cookie to the shim as `LAGUZ_BTC_RPC_USER/PASS`. The hub and shim never
mount Lightning Fork's volume, which also holds its wallet password and wallet
database.

Hub environment: `NETWORK=bitcoin LN_BACKEND_TYPE=LND LND_ADDRESS=<grpc bridge>
LND_CERT_FILE=/data/lnd/tls.cert LND_MACAROON_FILE=/data/lnd/admin.macaroon
MEMPOOL_API=http://127.0.0.1:8032/api RELAY=wss://nostr.pyblock.xyz:8443
AUTO_LINK_ALBY_ACCOUNT=false SEND_EVENTS_TO_ALBY=false LOG_LEVEL=4`, and no
`LND_WALLET_PASSWORD_FILE` (Lightning Fork owns its wallet).

Shim environment: `LAGUZ_BTC_RPC_URL=http://<rpc bridge>`,
`LAGUZ_LND_REST=https://<rest bridge>`, `LAGUZ_LND_TLS_CERT=/lnd/tls.cert`,
`LAGUZ_LND_MACAROON=/lnd/readonly.macaroon`, `LAGUZ_MEMPOOL_BIND=0.0.0.0`,
`LAGUZ_MEMPOOL_PORT=8032`, `LAGUZ_EXPLORER=https://b.pyblock.xyz:8443`.

## Building

Built from the repository root (one npm workspace and one signing key for all
packages; see the root README for the toolchain):

```sh
npm install
make check                # tsc --noEmit + SDK lint, every package
make laguz                # out/laguz.s9pk (universal), out/laguz_x86_64.s9pk, out/laguz_aarch64.s9pk
make verify-images        # tags still resolve to the pinned index digests
make inspect              # manifest summary of every s9pk in out/
```

Install on a StartOS server (sideload): **System → Sideload**, or
`start-cli -H https://<server>.local package install -s out/laguz.s9pk`.
Install Bitcoin Knots (BLAKE2b) Companion and Lightning Fork first.

## Registry

Lightning Fork and the companion come from paulscode's registry:
**Marketplace → Change → Add custom registry** → `https://start9.paulscode.com`.
Laguz Hub is on the PyBLØCK registry, added the same way:
`https://start9.pyblock.xyz`.

## Layout

```
startos/manifest/   id, images, dependencies, descriptions (en_US, es_ES)
startos/main.ts     dependency wiring, credential copies, the two daemons
startos/interfaces.ts  the `ui` interface on 8080
startos/dependencies.ts  lightning-fork + knots-blake2b requirements
startos/backups.ts  the `main` volume (hub database), without lnd/
startos/utils.ts    every port/host id/path taken from the dependencies
instructions.md     shown to the user in StartOS
icon.png            ᛚ mark, 512x512 RGBA
assets/             packed as assets.squashfs (nothing used yet)
```

## License

Apache-2.0. © PyBLØCK.
