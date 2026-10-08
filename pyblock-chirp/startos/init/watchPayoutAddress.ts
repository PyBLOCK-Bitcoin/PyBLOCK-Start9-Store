import { setPayoutAddress } from '../actions/setPayoutAddress'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

/**
 * A critical task while no payout address is set: it keeps the service from
 * starting, and tells the user why, instead of a gateway that exits on start.
 */
export const watchPayoutAddress = sdk.setupOnInit(async (effects) => {
  const store = await storeJson.read().const(effects)
  if (!store?.poolAddress) {
    await sdk.action.createOwnTask(effects, setPayoutAddress, 'critical', {
      reason: i18n('Set a payout address before mining'),
    })
  }
})
