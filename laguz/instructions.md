# ᛚ Laguz Hub

Laguz Hub is a web wallet and app hub for **XBT**, the Bitcoin BLAKE2b chain. It
drives the **Lightning Fork** node on this server. Your seed, on-chain wallet and
channels stay in Lightning Fork: Laguz holds none of them.

## Before you start

1. Install **Bitcoin Knots (BLAKE2b) Companion** and let it sync past the BLAKE2b
   activation (its *Chain* health check turns green).
2. Install **Lightning Fork**, select the companion as its node, and create its
   wallet. **Write down Lightning Fork's seed.** Laguz starts once Lightning Fork's
   wallet is unlocked.

## First visit: create the hub account

Open **Web UI**. The first unlock creates the hub account: choose a strong
password. It protects the hub (connections, app permissions); it is not your
Lightning seed and cannot recover funds. Laguz does not create or unlock
Lightning Fork's wallet; it only connects to it.

## Channels

Fund the on-chain wallet from the hub, then open channels under
**Node → Open Channel**. Amounts are shown in sats (ᛒ). Channels opened here are
Lightning Fork's channels, and show in Lightning Fork's own dashboard too.

## Connect the PyBLØCK app

In the hub, go to **Connections → Connect PyBLØCK app** and scan the code with
the PyBLØCK app. The app then pays and receives through your own node, using
Nostr Wallet Connect (NWC) over the PyBLØCK relay `wss://nostr.pyblock.xyz:8443`.
Revoke a connection at any time from the same page.

## No Alby services

The hub is built from Alby Hub, with every Alby service turned off: no Alby
account link, no event reporting, no hosted node or swaps.

## Backups and recovery

- **Your funds are recovered in Lightning Fork, not here:** Lightning Fork's
  seed plus its channel backup (`channel.backup`, see Lightning Fork's channel
  backup settings). Keep both.
- The StartOS backup of Laguz holds the hub account, its connections and app
  permissions. Restoring it brings those back; it does not restore funds.
- After restoring Lightning Fork from its seed and channel backup, its channels
  are closed and funds return on-chain (minus fees), as with any LND recovery.

## Troubleshooting

- *Waiting for Lightning Fork*: Lightning Fork is stopped, or its wallet has not
  been created or unlocked yet.
- *Waiting for Bitcoin Knots (BLAKE2b)*: the companion is stopped, or has not
  written its RPC cookie yet.
- Fees or on-chain transactions missing in the hub: check the *Mempool shim*
  health check. Explorer links open https://b.pyblock.xyz:8443.
