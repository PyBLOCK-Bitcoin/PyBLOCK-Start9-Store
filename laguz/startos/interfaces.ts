import { i18n } from './i18n'
import { sdk } from './sdk'
import { uiPort } from './utils'

export const uiHostId = 'ui'
export const uiInterfaceId = 'ui'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const multi = sdk.MultiHost.of(effects, uiHostId)
  const origin = await multi.bindPort(uiPort, {
    protocol: 'http',
  })
  const ui = sdk.createInterface(effects, {
    name: i18n('Web UI'),
    id: uiInterfaceId,
    description: i18n(
      'The Laguz Hub web wallet and app hub. Create the hub account on first visit.',
    ),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  return [await origin.export([ui])]
})
