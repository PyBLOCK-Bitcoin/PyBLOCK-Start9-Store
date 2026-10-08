/**
 * Everything that makes this package CHIRP rather than another PyBLØCK pool.
 *
 * The three DATUM gateway packages in this repository (pyblock-chirp,
 * pyblock-wavicles, pyblock-carousel) share every other file under startos/
 * except manifest/i18n.ts (the store descriptions). `make check-sync` at the
 * repository root fails if they drift apart.
 *
 * Pool values are copied from the published PyBLØCK pool configuration (the
 * same values the PyBLØCK Umbrel app and the pool's own web page ship). The
 * pool public key authenticates the DATUM Prime server to this gateway: if it
 * is wrong the handshake cannot complete and, with pooled_mining_only, the
 * gateway refuses miners rather than mining solo.
 */

export const packageId = 'pyblock-chirp'
export const packageTitle = 'PyBLØCK CHIRP'

/** Short pool name, used in log lines and the default coinbase tag. */
export const poolName = 'CHIRP'

/** The DATUM Prime server of the pool. */
export const poolHost = 'b.pyblock.xyz'
export const poolPort = 28917
export const poolPubkey =
  'cf995bb5b975ef4b90932f0608c98a033679092e976982621243cd1226803c6417442870dff8372b11363d8f80665b1f298cc23132bf2dab23958a4bcc7d4f72'

/**
 * Ports. Internal and preferred external port are the same number, and they
 * differ between the three packages so all three can be installed side by side
 * (and beside the official Datum Gateway, 23334/7152, and Datum Gateway
 * (BLAKE2b) Companion, 23336/7153).
 */
export const stratumPort = 23339
export const apiPort = 21009

/** Text DATUM writes in the coinbase when it is not pooled (the pool overrides it). */
export const coinbaseTagPrimary = 'PyBLOCK CHIRP'
/** Default secondary (miner) tag. The user can set their own name. */
export const defaultCoinbaseTagSecondary = 'PyBLOCK CHIRP'

/** The pool's page, for the marketing link. */
export const poolPage = 'https://b.pyblock.xyz:8443/chirp.php'
