# pyblock-chirp

**PyBLØCK CHIRP** for StartOS 0.4: a DATUM gateway preconfigured for the
PyBLØCK CHIRP pool (shared-reward syndicate, 100% to eligible members, 0% fee),
mining XBT (Bitcoin BLAKE2b) from your own Bitcoin Knots (BLAKE2b) Companion.

| | |
| --- | --- |
| Package id | `pyblock-chirp` |
| Version | `1.0.0:0` |
| Image | `ghcr.io/retropex/datum:v1.14-blake2b-4` pinned by index digest `sha256:1b2e8ecb…148910b` (x86_64, aarch64) |
| Pool (DATUM Prime) | `b.pyblock.xyz:28917`, pooled-only |
| Stratum | TCP 23339 (LAN, `stratum+tcp`) |
| Dashboard / API | HTTP 21009 (`ui` interface) |
| Dependency | `knots-blake2b` `>=1.0.0:36`, running, health check `node` |
| License | MIT |

## How it is wired

- **Node RPC**: `sdk.host.getBridgeAddress` for `knots-blake2b`, host `rpc`,
  internal port 18443 (`http://10.0.3.1:<port>` over the StartOS bridge).
- **Credentials**: the companion's `main` volume is mounted read-only at
  `/mnt/knots`; its `.cookie` is read under a watch, so a node restart (new
  cookie) restarts the gateway with fresh credentials. No RPC user is created.
- **Block notifications**: no blocknotify hook (one node may serve several
  gateways); the gateway polls (`notify_fallback: true`,
  `work_update_seconds: 5`), as Datum Gateway (BLAKE2b) Companion does.
- **Config**: `/data/datum_gateway_config.json`, regenerated on every start from
  `store.json` (payout address, secondary coinbase tag, dashboard password) plus
  the fixed pool values in `startos/pool.ts`; owner-only (holds the cookie).
  `modify_conf` is false: settings live in the StartOS actions.
- **Stratum** is bound with `secure: { ssl: false }` so StartOS exposes it on
  the LAN, preferred external port 23339.

## Actions

- **Set Payout Address** (critical task until set): `bc1…`, `1…` or `3…`;
  test-network prefixes are refused.
- **Coinbase Tag**: DATUM's secondary tag (default `PyBLOCK CHIRP`), up to 32
  of `A-Z a-z 0-9 space . _ -`.
- **Dashboard Password**: generated on install; show, regenerate or clear.

## Health checks

`gateway` (dashboard port), `pool-connection` (dashboard status is
"Connected and Ready"), `stratum-interface`, `stratum-clients-connected`,
`estimated-hashrate`.

Build from the repository root: `make pyblock-chirp`.
