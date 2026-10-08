import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

/**
 * The only settings this package owns. Everything else in the gateway's config
 * (pool host, port and key, pooled-only mode, ports, share difficulty) is fixed
 * by the package, because pointing this gateway at the right PyBLØCK pool is
 * what it is for.
 */
const shape = z.object({
  // Where your share of every block is paid, in the coinbase. No default: an
  // address invented here would pay someone else, so empty means the critical
  // task asks for one and the service does not start.
  poolAddress: z.string().catch(''),

  // DATUM's secondary coinbase tag: your name on-chain. Optional; unset means
  // the package default from pool.ts.
  coinbaseTagSecondary: z.string().optional().catch(undefined),

  // Dashboard admin password. Undefined = never set (generated on init); an
  // empty string = the user turned the admin pages off, and is kept.
  adminPassword: z.string().optional().catch(undefined),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: './store.json' },
  shape,
)
