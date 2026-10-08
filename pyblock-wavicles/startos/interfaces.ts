import { i18n } from './i18n'
import { apiPort, stratumPort } from './pool'
import { sdk } from './sdk'

export const stratumHostId = 'stratum'
export const uiHostId = 'ui'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  // What miners connect to. Plain TCP (Stratum v1, no TLS). Declaring the
  // protocol as plaintext with `secure: { ssl: false }` is what gets a
  // LAN-reachable listener; `secure: null` would only be reachable over the
  // StartOS bridge, where no miner can see it. Same binding as Datum Gateway
  // (BLAKE2b) Companion's stratum.
  const stratumMulti = sdk.MultiHost.of(effects, stratumHostId)
  const stratumOrigin = await stratumMulti.bindPort(stratumPort, {
    protocol: null,
    addSsl: null,
    preferredExternalPort: stratumPort,
    secure: { ssl: false },
  })
  const stratum = sdk.createInterface(effects, {
    name: i18n('Stratum'),
    id: 'stratum',
    description: i18n(
      'Point your BLAKE2b miners here, with their XBT address as the username',
    ),
    type: 'p2p',
    masked: false,
    schemeOverride: { ssl: null, noSsl: 'stratum+tcp' },
    username: null,
    path: '',
    query: {},
  })

  // The gateway's own web dashboard and API. Status pages need no password;
  // the admin pages (clients, threads, config) use user `admin` and the
  // dashboard password (see the Dashboard Password action).
  const uiMulti = sdk.MultiHost.of(effects, uiHostId)
  const uiOrigin = await uiMulti.bindPort(apiPort, {
    protocol: 'http',
    preferredExternalPort: apiPort,
  })
  const ui = sdk.createInterface(effects, {
    name: i18n('Web UI'),
    id: 'ui',
    description: i18n(
      'The DATUM gateway dashboard: pool connection, miners and hashrate',
    ),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  return [await stratumOrigin.export([stratum]), await uiOrigin.export([ui])]
})
