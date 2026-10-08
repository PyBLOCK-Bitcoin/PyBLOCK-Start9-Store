export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Laguz Hub': 1,
  'Lightning Fork': 2,
  'Waiting for Lightning Fork: install it, start it and create or unlock its wallet.': 3,
  'Bitcoin Knots (BLAKE2b)': 4,
  'Waiting for Bitcoin Knots (BLAKE2b) Companion to run and write its RPC cookie.': 5,
  'Mempool shim': 9,
  'The mempool shim is answering': 10,
  'The mempool shim is not answering yet': 11,
  'Web Interface': 12,
  'Laguz Hub is ready': 13,
  'Laguz Hub is not ready': 14,
  // interfaces.ts
  'Web UI': 100,
  'The Laguz Hub web wallet and app hub. Create the hub account on first visit.': 101,
} as const

/**
 * Indices are the join key for translations.ts: append, never renumber.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
