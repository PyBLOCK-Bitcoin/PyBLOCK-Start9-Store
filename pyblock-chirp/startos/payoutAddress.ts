/**
 * What counts as a payout address.
 *
 * The rules are DATUM's: datum_utils.c decodes bech32 only for the `bc` (and
 * `tb`) prefixes and falls back to base58 for the rest. XBT, the Bitcoin
 * BLAKE2b chain, uses mainnet address formats, so a valid address starts with
 * bc1, 1 or 3. Test-network prefixes are refused: DATUM's parser is agnostic
 * about networks and would build a valid mainnet output for a test key.
 *
 * One module because the action's form pattern and the action's own check must
 * agree (the form pattern is not enforced on every path, the handler check is).
 */
export const PATTERN_SOURCE =
  '^(bc1[a-z0-9]{25,87}|[13][a-km-zA-HJ-NP-Z1-9]{25,39})$'
const PATTERN = new RegExp(PATTERN_SOURCE)

export const EXPECTED = 'an address starting with bc1, 1 or 3'

export function isValidAddress(address: string): boolean {
  return PATTERN.test(address.trim())
}

export function isTestnetAddress(address: string): boolean {
  return /^(bcrt1|tb1|[mn2])/.test(address.trim())
}

/**
 * The secondary coinbase tag (your name on-chain). Same rule as PyBLØCK's own
 * gateway installer: up to 32 of A-Z a-z 0-9 space . _ -. DATUM budgets both
 * tags together and the pool's own tag takes part of that budget.
 */
export const TAG_PATTERN_SOURCE = '^[A-Za-z0-9 ._-]{1,32}$'
const TAG_PATTERN = new RegExp(TAG_PATTERN_SOURCE)

export function isValidTag(tag: string): boolean {
  return TAG_PATTERN.test(tag)
}
