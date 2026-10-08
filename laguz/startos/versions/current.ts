import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

const notesEn =
  'First release: Laguz Hub 0.1.1 on Lightning Fork, with the built-in mempool shim 0.1.0 reading Bitcoin Knots (BLAKE2b) Companion.'
const notesEs =
  'Primera versión: Laguz Hub 0.1.1 sobre Lightning Fork, con el shim de mempool 0.1.0 integrado que lee Bitcoin Knots (BLAKE2b) Companion.'

export const current = VersionInfo.of({
  version: '0.1.1:0',
  releaseNotes: {
    en_US: notesEn,
    es_ES: notesEs,
    de_DE: notesEn,
    pl_PL: notesEn,
    fr_FR: notesEn,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
