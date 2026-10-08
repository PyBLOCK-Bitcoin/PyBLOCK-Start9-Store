import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { dashboardUser, defaultPasswordSpec } from '../utils'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  password: Value.text({
    name: i18n('Dashboard Password'),
    description: i18n(
      'Password for the dashboard’s admin pages (username “admin”). Keep it, Generate a new one, or clear it to turn the admin pages off.',
    ),
    required: false,
    default: null,
    masked: true,
    generate: defaultPasswordSpec,
  }),
})

/**
 * DATUM's dashboard admin password. Without one, /clients (the list of
 * connected miners) is refused and /config is read-only. Generated on install;
 * this action shows, changes or clears it. DATUM keeps it in its own config and
 * checks it with HTTP digest auth.
 */
export const setDashboardPassword = sdk.Action.withInput(
  'set-dashboard-password',

  async () => ({
    name: i18n('Dashboard Password'),
    description: i18n(
      'Show or change the password for the dashboard’s admin pages, where connected miners are listed.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async () => ({
    password: (await storeJson.read((s) => s.adminPassword).once()) ?? '',
  }),

  async ({ effects, input }) => {
    const password = (input.password ?? '').trim()
    await storeJson.merge(effects, { adminPassword: password })

    return {
      version: '1' as const,
      title: i18n('Dashboard Password'),
      message: password
        ? i18n(
            'The dashboard’s admin pages are on. Sign in with these credentials.',
          )
        : i18n('The dashboard’s admin pages are off.'),
      result: {
        type: 'group' as const,
        name: i18n('Dashboard Password'),
        description: null,
        value: [
          {
            type: 'single' as const,
            name: i18n('Username'),
            description: null,
            value: dashboardUser,
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single' as const,
            name: i18n('Password'),
            description: null,
            value: password || i18n('(admin pages disabled)'),
            masked: !!password,
            copyable: !!password,
            qr: false,
          },
        ],
      },
    }
  },
)
