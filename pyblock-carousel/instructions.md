# PyBLØCK CAROUSEL

Your own DATUM gateway for **CAROUSEL**, PyBLØCK's rotating-template pool on
XBT (the Bitcoin BLAKE2b chain). Through this gateway your own node is the
template, so there is no template-supplier cut; the pool's CAROUSEL-PRIME server
only sets the coinbase: a block your gateway builds pays whoever mines through
it, **99% for you · 1% pool fee**, in that block's coinbase. PyBLØCK never holds
funds.

## Before you start

1. Install **Bitcoin Knots (BLAKE2b) Companion** (from the registry
   `https://start9.paulscode.com`) and let it sync. The gateway gets its block
   templates from it and authenticates with its RPC cookie; nothing to configure.
2. Optional, recommended: apply the PyBLØCK node policy to the companion
   (see the package repository, `docs/patum-policy.md`).

## Setup

1. Run **Set Payout Address** with an XBT address that starts with `bc1`, `1` or
   `3`, from a wallet whose keys you hold. The service does not start without it.
2. Optional: **Coinbase Tag** puts your name in the coinbase of the blocks this
   gateway builds.
3. Start the service. The **Pool Connection** health check turns green when the
   gateway has completed the handshake with `b.pyblock.xyz:28916`.

## Point your miners here

Open the **Stratum** interface for the address, for example
`stratum+tcp://<your-server-lan-ip>:23338`. Use each miner's **XBT address as
the username** (`address.worker` also works); any password.

The stratum port opens only once the gateway has its first block template, so
it stays closed while the node is still syncing (the *Stratum Interface* check
says *waiting*). The gateway runs in pooled-only mode: while the pool is not
connected it refuses miners instead of mining solo.

## Dashboard

**Web UI** opens the gateway's dashboard (pool status, miners, hashrate). The
pages listing connected miners ask for user `admin` and the password shown by the
**Dashboard Password** action.

## Fixed by the package

Pool host, port and public key, pooled-only mode, ports (stratum 23338,
dashboard 21008) and share difficulty (vardiff_min 1, 8 shares/min) are set by
the package so the gateway always talks to the right pool. Live pool stats:
https://b.pyblock.xyz:8443/carousel.php

## Backups

The backup holds the payout address, coinbase tag and dashboard password. The
gateway config is rebuilt on every start.
