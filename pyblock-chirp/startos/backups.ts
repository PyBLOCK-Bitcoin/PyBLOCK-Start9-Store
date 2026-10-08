import { sdk } from './sdk'
import { configFileName } from './utils'

// store.json: payout address, coinbase tag, dashboard password. The generated
// gateway config is left out: it is rebuilt on every start and holds the
// node's RPC cookie, which is only valid until the node restarts.
export const { createBackup, restoreInit } = sdk.setupBackups(async () =>
  sdk.Backups.ofVolumes('main').setOptions({
    exclude: [configFileName],
  }),
)
