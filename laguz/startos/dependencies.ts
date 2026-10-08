import { sdk } from './sdk'

// Health check ids are those the dependencies declare in their own main.ts.
//  - lightning-fork: `lnd` (the daemon) and `wallet-unlock` (the wallet exists
//    and is unlocked, so admin.macaroon and the gRPC interface exist). Not
//    `sync-progress`: the hub is usable, and says so, while LND catches up.
//  - knots-blake2b: `node` and `chain`, the pair its other dependents
//    (electrs-pruned, mempool-pruned, lightning-fork) require.
export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  return {
    'lightning-fork': {
      kind: 'running',
      versionRange: '>=0.21.3-beta.17:0',
      healthChecks: ['lnd', 'wallet-unlock'],
    },
    'knots-blake2b': {
      kind: 'running',
      versionRange: '>=1.0.0:34',
      healthChecks: ['node', 'chain'],
    },
  }
})
