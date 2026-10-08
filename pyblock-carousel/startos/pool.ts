/**
 * Everything that makes this package CAROUSEL rather than another PyBLØCK pool.
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

export const packageId = 'pyblock-carousel'
export const packageTitle = 'PyBLØCK CAROUSEL'

/** Short pool name, used in log lines and the default coinbase tag. */
export const poolName = 'CAROUSEL'

/** The DATUM Prime server of the pool. */
export const poolHost = 'b.pyblock.xyz'
export const poolPort = 28916
export const poolPubkey =
  '36f94e73ae4c9b9c479c544f035bc9e69565e9d882112031cb27032ecbac818e35a7976501d5cd0453f9fc3e9823127839225e89c45a2cc80902ba0a7e09577b'

/**
 * Ports. Internal and preferred external port are the same number, and they
 * differ between the three packages so all three can be installed side by side
 * (and beside the official Datum Gateway, 23334/7152, and Datum Gateway
 * (BLAKE2b) Companion, 23336/7153).
 */
export const stratumPort = 23338
export const apiPort = 21008

/** Text DATUM writes in the coinbase when it is not pooled (the pool overrides it). */
export const coinbaseTagPrimary = 'PyBLOCK CAROUSEL'
/** Default secondary (miner) tag. The user can set their own name. */
export const defaultCoinbaseTagSecondary = 'PyBLOCK CAROUSEL'

/** The pool's page, for the marketing link. */
export const poolPage = 'https://b.pyblock.xyz:8443/carousel.php'
