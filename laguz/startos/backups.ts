import { sdk } from './sdk'

// The hub's own state: its database (hub account, NWC connections, app
// permissions) and config. The Lightning funds are not here: they are
// recovered from Lightning Fork's seed and channel backup, in Lightning Fork.
// The credential copies under lnd/ are rewritten at every start.
export const { createBackup, restoreInit } = sdk.setupBackups(async () =>
  sdk.Backups.ofVolumes('main').setOptions({
    exclude: ['lnd/'],
  }),
)
