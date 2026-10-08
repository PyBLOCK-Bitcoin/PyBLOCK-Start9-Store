/**
 * Where everything Laguz reads from its two dependencies lives. Every value
 * here is part of a dependency's own contract with its dependents, taken from
 * its source (paulscode/lightning-fork-startos startos/interfaces.ts and
 * startos/utils.ts; paulscode/knots-blake2b-startos startos/utils.ts). They are
 * written out rather than imported to keep this package's build free of git
 * dependencies; check them when either package changes its major version.
 */

// ---- Lightning Fork (package id `lightning-fork`) ----
export const lfPackageId = 'lightning-fork'
/** Host id of LND's gRPC binding (TLS passthrough, LND's own tls.cert). */
export const lfGrpcHostId = 'grpc'
export const lfGrpcPort = 10009
/** Host id of LND's REST binding (re-wrapped by the StartOS TLS proxy). */
export const lfRestHostId = 'control'
export const lfRestPort = 8080
/**
 * Lightning Fork's `main` volume is LND's data dir (/root/.lnd). tls.cert sits
 * at its root (full chain: leaf, StartOS intermediate, StartOS root CA) and the
 * macaroons under data/chain/bitcoin/mainnet/.
 */
export const lfVolumeId = 'main'
export const lfMacaroonDir = 'data/chain/bitcoin/mainnet'

// ---- Bitcoin Knots (BLAKE2b) Companion (package id `knots-blake2b`) ----
export const knotsPackageId = 'knots-blake2b'
export const knotsRpcHostId = 'rpc'
/** The companion keeps bitcoind's regtest-default ports on purpose. */
export const knotsRpcPort = 18443
export const knotsVolumeId = 'main'
/** bitcoind writes `.cookie` at the root of its `main` volume. */
export const knotsCookieFile = '.cookie'

// ---- inside our own subcontainers ----
/** Read-only mounts of the dependencies, in the `deps` subcontainer only. */
export const lfMnt = '/mnt/lightning-fork'
export const knotsMnt = '/mnt/knots'
/** Our `main` volume, the hub's WORK_DIR. */
export const dataDir = '/data'
/** Host path of our `main` volume, from the JavaScript runtime. */
export const mainVolumeHost = '/media/startos/volumes/main'
/** Credential copies, inside our volume. */
export const credsSubdir = 'lnd'
export const credsHostDir = `${mainVolumeHost}/${credsSubdir}`
/** Where the shim mounts the credential copies. */
export const shimCredsDir = '/lnd'

/** The hub image runs as this uid/gid (USER 1000:1000), and so does the shim. */
export const appUid = 1000
export const appGid = 1000

export const uiPort = 8080
export const mempoolPort = 8032

export const relayUrl = 'wss://nostr.pyblock.xyz:8443'
export const explorerUrl = 'https://b.pyblock.xyz:8443'
