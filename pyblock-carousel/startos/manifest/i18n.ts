// Store descriptions for PyBLØCK CAROUSEL. This file and ../pool.ts are the only
// files under startos/ that differ between the three PyBLØCK DATUM packages.

const shortEn =
  'Your own DATUM gateway for CAROUSEL, the PyBLØCK XBT rotating-template pool · 99% for you · fee 1%'
const shortEs =
  'Tu propio gateway DATUM para CAROUSEL, el pool XBT de plantillas rotativas de PyBLØCK · 99% para vos · comisión 1%'

export const short = {
  en_US: shortEn,
  es_ES: shortEs,
  de_DE: shortEn,
  pl_PL: shortEn,
  fr_FR: shortEn,
}

const longEn = `PyBLØCK CAROUSEL is PyBLØCK's rotating-template pool on XBT, the Bitcoin BLAKE2b chain: on its public side it rotates clean block templates from independent template suppliers. This package runs your own DATUM gateway, preconfigured for CAROUSEL, so your own node is the template.

Your node builds the block and you publish it: your Bitcoin Knots (BLAKE2b) Companion supplies the template, so PyBLØCK never sees or chooses your transactions, and there is no template supplier cut. The pool's CAROUSEL-PRIME server only sets the coinbase: a block your gateway builds pays whoever mines through it, 99% for you · 1% pool fee, nothing else off the top, paid directly in that block's coinbase. It pays when your gateway finds the block. Non-custodial: PyBLØCK never holds a sat.

Set your XBT payout address, then point your BLAKE2b miners (Sia ASICs, GPUs) at this gateway's Stratum address, port 23338, with their XBT address as the username. The gateway's dashboard shows the pool connection, miners and hashrate.

Requires Bitcoin Knots (BLAKE2b) Companion, synced. Live stats: b.pyblock.xyz:8443/carousel.php`

const longEs = `PyBLØCK CAROUSEL es el pool de plantillas rotativas de PyBLØCK en XBT, la cadena Bitcoin BLAKE2b: en su lado público rota plantillas de bloque limpias de proveedores de plantillas independientes. Este paquete corre tu propio gateway DATUM, ya configurado para CAROUSEL, así que la plantilla es tu propio nodo.

Tu nodo arma el bloque y vos lo publicás: tu Bitcoin Knots (BLAKE2b) Companion entrega la plantilla, así que PyBLØCK nunca ve ni elige tus transacciones y no hay parte para un proveedor de plantillas. El servidor CAROUSEL-PRIME del pool solo fija la coinbase: un bloque que arma tu gateway le paga a quien mina a través de él, 99% para vos · comisión del pool 1%, nada más se descuenta, pagado directo en la coinbase de ese bloque. Paga cuando tu gateway encuentra el bloque. Sin custodia: PyBLØCK nunca guarda un sat.

Configurá tu dirección XBT de cobro y apuntá tus mineros BLAKE2b (ASICs de Sia, GPUs) a la dirección Stratum de este gateway, puerto 23338, con su dirección XBT como usuario. El panel del gateway muestra la conexión al pool, los mineros y el hashrate.

Requiere Bitcoin Knots (BLAKE2b) Companion sincronizado. Estadísticas en vivo: b.pyblock.xyz:8443/carousel.php`

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
