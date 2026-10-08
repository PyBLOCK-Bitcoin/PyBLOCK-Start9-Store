/**
 * Values taken from Bitcoin Knots (BLAKE2b) Companion's own contract with its
 * dependents (paulscode/knots-blake2b-startos, startos/utils.ts). Written out
 * rather than imported so the build has no git dependency; check them when that
 * package changes its major version.
 */
export const knotsPackageId = 'knots-blake2b'
/** Host id of the node's JSON-RPC binding. */
export const knotsRpcHostId = 'rpc'
/** The companion keeps bitcoind's regtest-default RPC port on purpose. */
export const knotsRpcPort = 18443
/** bitcoind writes `.cookie` at the root of the companion's `main` volume. */
export const knotsVolumeId = 'main'
export const knotsCookieFile = '.cookie'

/** Inside our subcontainer. */
export const dataDir = '/data'
export const knotsMnt = '/mnt/knots'

/** The config file this package generates on every start, in our volume. */
export const configFileName = 'datum_gateway_config.json'
export const configPath = `${dataDir}/${configFileName}`

/** ghcr.io/retropex/datum runs as `datum`, uid/gid 1000, binary at /app. */
export const appUser = 'datum'
export const appUid = 1000
export const appGid = 1000
export const gatewayBin = '/app/datum_gateway'

/**
 * DATUM's dashboard admin user is fixed: datum_conf.c documents admin_password
 * as "username 'admin'".
 */
export const dashboardUser = 'admin'

/** Generated dashboard password: alphanumeric, typed into an HTTP-auth prompt. */
export const defaultPasswordSpec = { charset: 'a-z,A-Z,0-9', len: 24 } as const
