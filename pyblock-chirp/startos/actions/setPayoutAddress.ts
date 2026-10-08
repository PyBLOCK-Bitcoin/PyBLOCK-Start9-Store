import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import {
  EXPECTED,
  isTestnetAddress,
  isValidAddress,
  PATTERN_SOURCE,
} from '../payoutAddress'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  poolAddress: Value.text({
    name: i18n('Payout Address'),
    description: i18n(
      'Your XBT (Bitcoin BLAKE2b) address, starting with bc1, 1 or 3, from a wallet whose keys you hold. It is the gateway’s payout address (DATUM mining.pool_address): the gateway does not start without one.',
    ),
    required: true,
    default: null,
    patterns: [
      {
        regex: PATTERN_SOURCE,
        description: i18n('An address starting with bc1, 1 or 3'),
      },
    ],
  }),
})

export const setPayoutAddress = sdk.Action.withInput(
  'set-payout-address',

  async () => ({
    name: i18n('Set Payout Address'),
    description: i18n(
      'Choose the XBT address your share of each block is paid to. The gateway will not mine until this is set.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async () => {
    const current = await storeJson.read((s) => s.poolAddress).once()
    return current ? { poolAddress: current } : {}
  },

  async ({ effects, input }) => {
    // Checked here as well as in `patterns`: the form pattern is not enforced
    // on every path (e.g. `start-cli package action run`), a throw is.
    const addr = input.poolAddress.trim()
    if (isTestnetAddress(addr)) {
      throw new Error(
        `${addr} is a test-network address. This gateway mines XBT on mainnet; use ${EXPECTED}.`,
      )
    }
    if (!isValidAddress(addr)) {
      throw new Error(
        `${addr} is not an address DATUM can pay to. Use ${EXPECTED}.`,
      )
    }

    await storeJson.merge(effects, { poolAddress: addr })

    return {
      version: '1' as const,
      title: i18n('Payout Address Set'),
      message: i18n('The gateway restarts with this address if it is running.'),
      result: {
        type: 'single' as const,
        name: i18n('Payout Address'),
        description: null,
        value: addr,
        masked: false,
        copyable: true,
        qr: true,
      },
    }
  },
)
