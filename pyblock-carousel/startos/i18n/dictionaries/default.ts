export const DEFAULT_LANG = 'en_US'

const dict = {
  'Coinbase Tag': 1,
  'Your name on-chain: DATUM’s secondary coinbase tag, written into every block this gateway builds (the pool sets the primary tag). Up to 32 of A-Z a-z 0-9 space . _ -. Leave empty for the package default.': 2,
  'Up to 32 of A-Z a-z 0-9 space . _ -': 3,
  'Set your name in the coinbase of the blocks this gateway builds (optional).': 4,
  'The gateway restarts with this tag if it is running.': 5,
  'Dashboard Password': 6,
  'Password for the dashboard’s admin pages (username “admin”). Keep it, Generate a new one, or clear it to turn the admin pages off.': 7,
  'Show or change the password for the dashboard’s admin pages, where connected miners are listed.': 8,
  'The dashboard’s admin pages are on. Sign in with these credentials.': 9,
  'The dashboard’s admin pages are off.': 10,
  Username: 11,
  Password: 12,
  '(admin pages disabled)': 13,
  'Payout Address': 14,
  'Your XBT (Bitcoin BLAKE2b) address, starting with bc1, 1 or 3, from a wallet whose keys you hold. It is the gateway’s payout address (DATUM mining.pool_address): the gateway does not start without one.': 15,
  'An address starting with bc1, 1 or 3': 16,
  'Set Payout Address': 17,
  'Choose the XBT address your share of each block is paid to. The gateway will not mine until this is set.': 18,
  'Payout Address Set': 19,
  'The gateway restarts with this address if it is running.': 20,
  'Set a payout address before mining': 21,
  Stratum: 22,
  'Point your BLAKE2b miners here, with their XBT address as the username': 23,
  'Web UI': 24,
  'The DATUM gateway dashboard: pool connection, miners and hashrate': 25,
  'Bitcoin Knots (BLAKE2b)': 26,
  'Waiting for Bitcoin Knots (BLAKE2b) Companion to run and write its RPC cookie.': 27,
  'Web Interface': 28,
  'The DATUM gateway dashboard is ready': 29,
  'The DATUM gateway dashboard is not ready': 30,
  'Pool Connection': 31,
  'Connecting to the pool': 32,
  'Stratum Interface': 33,
  'Miners can connect': 34,
  'The gateway is not serving work yet': 35,
  'Waiting for the node and the pool. The stratum port opens once the gateway has its first block template, which needs a synced node.': 36,
  'Number of Stratum Clients Connected': 37,
  'Could not read the number of miners': 38,
  'Estimated Hashrate': 39,
  'Could not read the hashrate': 40,
} as const

/**
 * Indices are the join key for translations.ts: append, never renumber.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
