/**
 * Everything that makes this package WAVICLES rather than another PyBLØCK pool.
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

export const packageId = 'pyblock-wavicles'
export const packageTitle = 'PyBLØCK WAVICLES'

/** Short pool name, used in log lines and the default coinbase tag. */
export const poolName = 'WAVICLES'

/** The DATUM Prime server of the pool. */
export const poolHost = 'b.pyblock.xyz'
export const poolPort = 28915
export const poolPubkey =
  'b5e0b0326b964a92f3046c73a76b9e98173e0c3ea0e0ca771f4e6a3dd92e2935b2caad2a088fdd7bf0a48fc0c41776a9abb13c7d4c6964b53a9ceee4c775e036'

/**
 * Ports. Internal and preferred external port are the same number, and they
 * differ between the three packages so all three can be installed side by side
 * (and beside the official Datum Gateway, 23334/7152, and Datum Gateway
 * (BLAKE2b) Companion, 23336/7153).
 */
export const stratumPort = 23340
export const apiPort = 21010

/** Text DATUM writes in the coinbase when it is not pooled (the pool overrides it). */
export const coinbaseTagPrimary = 'PyBLOCK WAVICLES'
/** Default secondary (miner) tag. The user can set their own name. */
export const defaultCoinbaseTagSecondary = 'PyBLOCK WAVICLES'

/** The pool's page, for the marketing link. */
export const poolPage = 'https://b.pyblock.xyz:8443/wavicles.php'
