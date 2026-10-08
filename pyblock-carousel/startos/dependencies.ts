import { sdk } from './sdk'
import { knotsPackageId } from './utils'

export const setDependencies = sdk.setupDependencies(async () => {
  return {
    // 'running', not 'exists': the gateway needs live block templates. The
    // range follows Datum Gateway (BLAKE2b) Companion: the gateway takes its
    // transactions verbatim from the node's getblocktemplate, so a node
    // without the long coinbase maturity rule (1.0.0:36) would hand it
    // transactions that are invalid since height 973440. `node` is the health
    // check id the companion declares for bitcoind itself.
    [knotsPackageId]: {
      kind: 'running',
      versionRange: '>=1.0.0:36',
      healthChecks: ['node'],
    },
  }
})
