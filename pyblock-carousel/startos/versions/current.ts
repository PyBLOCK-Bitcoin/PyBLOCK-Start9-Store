import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

const notesEn =
  'First release: DATUM gateway v1.14-blake2b-4, preconfigured for this PyBLØCK pool and wired to Bitcoin Knots (BLAKE2b) Companion.'
const notesEs =
  'Primera versión: gateway DATUM v1.14-blake2b-4, ya configurado para este pool de PyBLØCK y conectado a Bitcoin Knots (BLAKE2b) Companion.'

export const current = VersionInfo.of({
  version: '1.0.0:0',
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
