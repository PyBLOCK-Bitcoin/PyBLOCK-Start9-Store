// Store descriptions for PyBLØCK WAVICLES. This file and ../pool.ts are the only
// files under startos/ that differ between the three PyBLØCK DATUM packages.

const shortEn =
  'Your own DATUM gateway for WAVICLES, the PyBLØCK XBT work-window pool · 0% fee'
const shortEs =
  'Tu propio gateway DATUM para WAVICLES, el pool XBT de ventana de trabajo de PyBLØCK · 0% de comisión'

export const short = {
  en_US: shortEn,
  es_ES: shortEs,
  de_DE: shortEn,
  pl_PL: shortEn,
  fr_FR: shortEn,
}

const longEn = `PyBLØCK WAVICLES is a bring-your-own-node mining pool on XBT, the Bitcoin BLAKE2b chain, paid by work in a window. This package runs your own DATUM gateway, preconfigured for WAVICLES.

Your node builds the block: your Bitcoin Knots (BLAKE2b) Companion supplies the template, so PyBLØCK never sees or chooses your transactions. The pool's DATUM Prime server only sets the split: everyone with work in the window, by work, paid directly in that block's coinbase. Pool fee 0%: blocks carry no pool output. Below the 1,000-sat minimum per miner, a share goes to the other miners in the window, never to the pool. Non-custodial: the pool never holds a sat.

Set your XBT payout address, then point your BLAKE2b miners (Sia ASICs, GPUs, CPUs) at this gateway's Stratum address, port 23340, with their XBT address as the username. The gateway's dashboard shows the pool connection, miners and hashrate.

Requires Bitcoin Knots (BLAKE2b) Companion, synced. Live stats: b.pyblock.xyz:8443/wavicles.php`

const longEs = `PyBLØCK WAVICLES es un pool de minería con nodo propio en XBT, la cadena Bitcoin BLAKE2b, que paga por trabajo dentro de una ventana. Este paquete corre tu propio gateway DATUM, ya configurado para WAVICLES.

Tu nodo arma el bloque: tu Bitcoin Knots (BLAKE2b) Companion entrega la plantilla, así que PyBLØCK nunca ve ni elige tus transacciones. El servidor DATUM Prime del pool solo fija el reparto: todos los que tienen trabajo en la ventana, según su trabajo, pagado directo en la coinbase de ese bloque. Comisión del pool 0%: los bloques no llevan salida para el pool. Por debajo del mínimo de 1.000 sats por minero, esa parte va a los demás mineros de la ventana, nunca al pool. Sin custodia: el pool nunca guarda un sat.

Configurá tu dirección XBT de cobro y apuntá tus mineros BLAKE2b (ASICs de Sia, GPUs, CPUs) a la dirección Stratum de este gateway, puerto 23340, con su dirección XBT como usuario. El panel del gateway muestra la conexión al pool, los mineros y el hashrate.

Requiere Bitcoin Knots (BLAKE2b) Companion sincronizado. Estadísticas en vivo: b.pyblock.xyz:8443/wavicles.php`

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
