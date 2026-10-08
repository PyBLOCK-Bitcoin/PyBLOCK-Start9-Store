import { utils } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { defaultPasswordSpec } from '../utils'

/**
 * Create store.json on install, and generate a dashboard password whenever none
 * was ever set. An empty string means the user turned the admin pages off and
 * is kept.
 */
export const seedFiles = sdk.setupOnInit(async (effects, kind) => {
  if (kind === 'install') {
    await storeJson.merge(effects, {})
  }
  const current = await storeJson.read((s) => s.adminPassword).once()
  if (current === undefined || current === null) {
    await storeJson.merge(effects, {
      adminPassword: utils.getDefaultString(defaultPasswordSpec),
    })
  }
})
