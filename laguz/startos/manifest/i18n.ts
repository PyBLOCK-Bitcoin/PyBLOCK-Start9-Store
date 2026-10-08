const shortEn =
  'Self-custodial Lightning hub for XBT (Bitcoin BLAKE2b) on Lightning Fork'
const shortEs =
  'Hub Lightning autocustodiado para XBT (Bitcoin BLAKE2b) sobre Lightning Fork'

export const short = {
  en_US: shortEn,
  es_ES: shortEs,
  de_DE: shortEn,
  pl_PL: shortEn,
  fr_FR: shortEn,
}

const longEn = `ᛚ Laguz Hub is PyBLØCK's self-custodial Lightning hub for XBT, the Bitcoin BLAKE2b chain. It is a web wallet and app hub that drives the Lightning Fork node already running on this server: your keys, your channels and your funds stay in Lightning Fork, and Laguz never holds a seed of its own.

Connect the PyBLØCK app with Nostr Wallet Connect (NWC): Connections → Connect PyBLØCK app shows a connection secret the app scans, so the app can pay and receive over your own node through the PyBLØCK Nostr relay. Amounts are shown in sats (ᛒ). Open and manage channels under Node → Open Channel.

No Alby services are used: no Alby account link, no event reporting, no hosted node. Fee rates and on-chain lookups come from a small built-in mempool shim that reads your Bitcoin Knots (BLAKE2b) Companion and your Lightning Fork wallet; explorer links open b.pyblock.xyz.

Requires Lightning Fork (the BLAKE2b LND) and Bitcoin Knots (BLAKE2b) Companion.`

const longEs = `ᛚ Laguz Hub es el hub Lightning autocustodiado de PyBLØCK para XBT, la cadena Bitcoin BLAKE2b. Es una billetera web y hub de apps que maneja el nodo Lightning Fork que ya corre en este servidor: tus llaves, tus canales y tus fondos quedan en Lightning Fork, y Laguz nunca guarda una semilla propia.

Conectá la app PyBLØCK con Nostr Wallet Connect (NWC): Connections → Connect PyBLØCK app muestra un secreto de conexión que la app escanea, para pagar y cobrar con tu propio nodo a través del relay Nostr de PyBLØCK. Los montos se muestran en sats (ᛒ). Abrí y administrá canales en Node → Open Channel.

No usa servicios de Alby: sin vínculo a cuenta Alby, sin envío de eventos, sin nodo hospedado. Las tarifas y consultas on-chain salen de un pequeño shim de mempool integrado que lee tu Bitcoin Knots (BLAKE2b) Companion y la billetera de Lightning Fork; los enlaces del explorador abren b.pyblock.xyz.

Requiere Lightning Fork (el LND BLAKE2b) y Bitcoin Knots (BLAKE2b) Companion.`

export const long = {
  en_US: longEn,
  es_ES: longEs,
  de_DE: longEn,
  pl_PL: longEn,
  fr_FR: longEn,
}

const depLightningEn =
  'The Lightning node Laguz drives: its gRPC and REST APIs, TLS certificate and macaroons. Your seed, wallet and channels live here.'
const depLightningEs =
  'El nodo Lightning que maneja Laguz: sus APIs gRPC y REST, certificado TLS y macaroons. Tu semilla, billetera y canales viven acá.'

export const depLightningDescription = {
  en_US: depLightningEn,
  es_ES: depLightningEs,
  de_DE: depLightningEn,
  pl_PL: depLightningEn,
  fr_FR: depLightningEn,
}

const depKnotsEn =
  "Read over RPC by Laguz's mempool shim for fee estimates, recent blocks and mempool transactions on the BLAKE2b chain."
const depKnotsEs =
  'El shim de mempool de Laguz lo lee por RPC para estimar tarifas, ver bloques recientes y transacciones del mempool en la cadena BLAKE2b.'

export const depKnotsDescription = {
  en_US: depKnotsEn,
  es_ES: depKnotsEs,
  de_DE: depKnotsEn,
  pl_PL: depKnotsEn,
  fr_FR: depKnotsEn,
}
