// Store descriptions for PyBLØCK CHIRP. This file and ../pool.ts are the only
// files under startos/ that differ between the three PyBLØCK DATUM packages.

const shortEn =
  'Your own DATUM gateway for CHIRP, the PyBLØCK XBT mining syndicate · 0% fee'
const shortEs =
  'Tu propio gateway DATUM para CHIRP, el sindicato de minería XBT de PyBLØCK · 0% de comisión'

export const short = {
  en_US: shortEn,
  es_ES: shortEs,
  de_DE: shortEn,
  pl_PL: shortEn,
  fr_FR: shortEn,
}

const longEn = `PyBLØCK CHIRP is a shared-reward mining syndicate on XBT, the Bitcoin BLAKE2b chain. This package runs your own DATUM gateway, preconfigured for CHIRP.

Your node builds the block and you publish it: your Bitcoin Knots (BLAKE2b) Companion supplies the template, so PyBLØCK never sees or chooses your transactions. PyBLØCK's CHIRP-PRIME server only sets the coinbase: 100% to the syndicate, 0% pool fee, nothing else off the top.

Every block found by any member is split among all eligible members by standing (tenure plus 24-hour power), not by who found it, and paid directly in that block's coinbase. Eligibility takes 7 days of active tenure with a minimum power. Non-custodial: PyBLØCK never holds a sat.

Set your XBT payout address, then point your BLAKE2b miners (Sia ASICs, GPUs) at this gateway's Stratum address, port 23339, with their XBT address as the username. The gateway's dashboard shows the pool connection, miners and hashrate.

Requires Bitcoin Knots (BLAKE2b) Companion, synced. Live stats: b.pyblock.xyz:8443/chirp.php`

const longEs = `PyBLØCK CHIRP es un sindicato de minería con recompensa compartida en XBT, la cadena Bitcoin BLAKE2b. Este paquete corre tu propio gateway DATUM, ya configurado para CHIRP.

Tu nodo arma el bloque y vos lo publicás: tu Bitcoin Knots (BLAKE2b) Companion entrega la plantilla, así que PyBLØCK nunca ve ni elige tus transacciones. El servidor CHIRP-PRIME de PyBLØCK solo fija la coinbase: 100% al sindicato, 0% de comisión del pool, nada más se descuenta.

Cada bloque que encuentra cualquier miembro se reparte entre todos los miembros elegibles según su posición (antigüedad más potencia de 24 horas), no según quién lo encontró, y se paga directo en la coinbase de ese bloque. Para ser elegible hacen falta 7 días de antigüedad activa con una potencia mínima. Sin custodia: PyBLØCK nunca guarda un sat.

Configurá tu dirección XBT de cobro y apuntá tus mineros BLAKE2b (ASICs de Sia, GPUs) a la dirección Stratum de este gateway, puerto 23339, con su dirección XBT como usuario. El panel del gateway muestra la conexión al pool, los mineros y el hashrate.

Requiere Bitcoin Knots (BLAKE2b) Companion sincronizado. Estadísticas en vivo: b.pyblock.xyz:8443/chirp.php`

export const long = {
  en_US: longEn,
  es_ES: longEs,
  de_DE: longEn,
  pl_PL: longEn,
  fr_FR: longEn,
}

const depKnotsEn =
  'The BLAKE2b node this gateway builds blocks from: block templates and block submission over RPC, authenticated with its RPC cookie.'
const depKnotsEs =
  'El nodo BLAKE2b del que este gateway arma los bloques: plantillas y envío de bloques por RPC, autenticado con su cookie RPC.'

export const depKnotsDescription = {
  en_US: depKnotsEn,
  es_ES: depKnotsEs,
  de_DE: depKnotsEn,
  pl_PL: depKnotsEn,
  fr_FR: depKnotsEn,
}
