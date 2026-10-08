import { sdk } from '../sdk'
import { setCoinbaseTag } from './setCoinbaseTag'
import { setDashboardPassword } from './setDashboardPassword'
import { setPayoutAddress } from './setPayoutAddress'

export const actions = sdk.Actions.of()
  .addAction(setPayoutAddress)
  .addAction(setCoinbaseTag)
  .addAction(setDashboardPassword)
