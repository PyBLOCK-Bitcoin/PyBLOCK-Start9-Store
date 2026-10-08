import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { isValidTag, TAG_PATTERN_SOURCE } from '../payoutAddress'
import { defaultCoinbaseTagSecondary } from '../pool'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  tag: Value.text({
    name: i18n('Coinbase Tag'),
    description: i18n(
      'Your name on-chain: DATUM’s secondary coinbase tag, written into every block this gateway builds (the pool sets the primary tag). Up to 32 of A-Z a-z 0-9 space . _ -. Leave empty for the package default.',
    ),
    required: false,
    default: null,
    patterns: [
      {
        regex: TAG_PATTERN_SOURCE,
        description: i18n('Up to 32 of A-Z a-z 0-9 space . _ -'),
      },
    ],
  }),
})

export const setCoinbaseTag = sdk.Action.withInput(
  'set-coinbase-tag',

  async () => ({
    name: i18n('Coinbase Tag'),
    description: i18n(
      'Set your name in the coinbase of the blocks this gateway builds (optional).',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async () => {
    const current = await storeJson.read((s) => s.coinbaseTagSecondary).once()
    return { tag: current ?? defaultCoinbaseTagSecondary }
  },

  async ({ effects, input }) => {
    const tag = (input.tag ?? '').trim()
    if (tag && !isValidTag(tag)) {
      throw new Error(
        `"${tag}" is not a valid coinbase tag: use up to 32 of A-Z a-z 0-9 space . _ -`,
      )
    }
    await storeJson.merge(effects, {
      coinbaseTagSecondary: tag || defaultCoinbaseTagSecondary,
    })
    return {
      version: '1' as const,
      title: i18n('Coinbase Tag'),
      message: i18n('The gateway restarts with this tag if it is running.'),
      result: {
        type: 'single' as const,
        name: i18n('Coinbase Tag'),
        description: null,
        value: tag || defaultCoinbaseTagSecondary,
        masked: false,
        copyable: true,
        qr: false,
      },
    }
  },
)
