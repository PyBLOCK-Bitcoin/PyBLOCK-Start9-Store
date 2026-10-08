# PyBLØCK packages for StartOS

StartOS 0.4 packages for mining and using **XBT**, the Bitcoin BLAKE2b chain,
with PyBLØCK. One folder per package; all are built with start-sdk 2.0.9 for
StartOS `0.4.0-beta.10` and later, for x86_64 and aarch64.

| Folder / id | Title | Version | What it is | License |
| --- | --- | --- | --- | --- |
| [`laguz`](laguz/) | Laguz Hub | 0.1.1:0 | ᛚ Self-custodial Lightning hub (web wallet + NWC for the PyBLØCK app) driving your Lightning Fork node | Apache-2.0 |
| [`pyblock-chirp`](pyblock-chirp/) | PyBLØCK CHIRP | 1.0.0:0 | Your own DATUM gateway for **CHIRP**: shared-reward syndicate, 100% to eligible members, 0% fee | MIT |
| [`pyblock-wavicles`](pyblock-wavicles/) | PyBLØCK WAVICLES | 1.0.0:0 | Your own DATUM gateway for **WAVICLES**: paid by work in the window, 0% fee | MIT |
| [`pyblock-carousel`](pyblock-carousel/) | PyBLØCK CAROUSEL | 1.0.0:0 | Your own DATUM gateway for **CAROUSEL**: rotating template-supplier pool; through your own node 99% for you · 1% pool fee | MIT |

### The DATUM gateway packages

Each runs the DATUM gateway `ghcr.io/retropex/datum:v1.14-blake2b-4` (the same
image as the PyBLØCK Umbrel apps, pinned by digest) against your own
**Bitcoin Knots (BLAKE2b) Companion**: your node builds the block, and the
pool's DATUM Prime server only sets the coinbase split. Payouts are written into
the block's coinbase, straight to the miners' addresses; nothing is custodial.

| Package | Pool (DATUM Prime) | Stratum (LAN) | Dashboard | Pool fee |
| --- | --- | --- | --- | --- |
| `pyblock-chirp` | `b.pyblock.xyz:28917` | 23339 | 21009 | 0% |
| `pyblock-wavicles` | `b.pyblock.xyz:28915` | 23340 | 21010 | 0% |
| `pyblock-carousel` | `b.pyblock.xyz:28916` | 23338 | 21008 | 1% |

Ids and ports are distinct, so the three can be installed side by side (and
beside the official Datum Gateway and Datum Gateway (BLAKE2b) Companion). Each
asks for an XBT payout address (`bc1…`, `1…` or `3…`) before it starts, and
optionally your name for the coinbase tag. Point miners at the package's
**Stratum** interface with their XBT address as the username.

## Install

1. In StartOS, open **Marketplace → Change registry → Add custom registry** and
   add **`https://start9.paulscode.com`** (paulscode's registry). Install the
   prerequisites from there:
   - **Bitcoin Knots (BLAKE2b) Companion** (`knots-blake2b`): required by every
     package here. Let it sync.
   - **Lightning Fork** (`lightning-fork`): required by Laguz Hub only.
2. Add the PyBLØCK registry the same way: **`https://start9.pyblock.xyz`**, and
   install the packages you want from it.

Recommended: apply the PyBLØCK node policy to the companion (next section).

## PyBLØCK recommended node policy (PATUM)

This repository does not package a second Knots: use `knots-blake2b` and set

```ini
blockreservedweight=60000
permitbaremultisig=0
datacarrier=0
datacarriersize=0
rejecttokens=1
rejectparasites=1
```

In StartOS: **Bitcoin Knots (BLAKE2b) Companion → Actions → Configuration →
Mempool Settings** exposes all of them except one: *Permit Bare Multisig* =
False, *Relay OP_RETURN Transactions* = False, *Max OP_RETURN Size* = 0,
*Reject Tokens* = True, *Reject Parasites* = True.

**`blockreservedweight` is not exposed** by knots-blake2b (checked on 1.0.0:35
source and the 1.0.0:37 registry build), and a hand edit to `bitcoin.conf` is
dropped the next time any setting is saved. We are asking paulscode to expose it.
Until then, **Other Settings → Template Construction → Max Block Weight =
3,948,000** leaves the same room for the coinbase. Details:
[docs/patum-policy.md](docs/patum-policy.md).

## Build

Toolchain:

- Node.js 22 and npm
- Podman: start-cli pulls the images with it (the Makefile sets
  `STARTOS_USE_PODMAN=1`). The DATUM image is pinned by its multi-arch index
  digest, which Docker's classic image store cannot hold for two platforms;
  with Docker's containerd store you can use Docker instead (`PACK_ENV=`)
- Docker with buildx, only for `make verify-images`
- `jq`
- `tar2sqfs` from squashfs-tools-ng (start-cli runs it to turn each image into
  a squashfs; package `squashfs-tools-ng`)
- [`start-cli` 2.3.0](https://github.com/Start9Labs/start-technologies/releases/tag/start-cli/v2.3.0)

`start-cli` and `tar2sqfs` can live in `./bin` (gitignored); the Makefile puts
it first on `PATH`.

```sh
npm install                  # one workspace for all packages
make check                   # DATUM packages in sync + tsc --noEmit + SDK lint
make                         # every package into out/
make pyblock-chirp           # one package: out/pyblock-chirp.s9pk (x86_64 + aarch64),
                             #   out/pyblock-chirp_x86_64.s9pk, out/pyblock-chirp_aarch64.s9pk
make out/laguz_aarch64.s9pk  # one package, one architecture
make inspect                 # manifest summary of every s9pk in out/
make verify-images           # image tags still resolve to the pinned digests
```

Signing: start-cli signs with `.startos/build.key.pem` at the repository root
(gitignored, never committed). `make key` creates one if it is missing; a
package published on a registry must be signed with the key that registry has
authorised for it. Build from a commit so start-cli records it in the manifest
(`gitHash`).

The three DATUM packages share all their code: only `startos/pool.ts` (pool
constants) and `startos/manifest/i18n.ts` (store descriptions) differ, plus the
docs and icon. `make check-sync` fails if the rest drifts apart; change all
three together.

## Layout

```
laguz/                 Laguz Hub package
pyblock-chirp/         DATUM gateway for CHIRP
pyblock-wavicles/      DATUM gateway for WAVICLES
pyblock-carousel/      DATUM gateway for CAROUSEL
  startos/pool.ts        pool host/port/key, ports, tags (per package)
  startos/main.ts        node wiring, generated gateway config, health checks
  startos/actions/       payout address, coinbase tag, dashboard password
docs/patum-policy.md   recommended knots-blake2b policy
scripts/               check-datum-sync.sh
Makefile               build all or one package into out/
```

## Licenses

- `laguz/`: Apache-2.0 (Laguz Hub is built from Alby Hub, Apache-2.0).
- `pyblock-chirp/`, `pyblock-wavicles/`, `pyblock-carousel/`: MIT (DATUM
  Gateway is MIT).
- Repository-level files: MIT.

© PyBLØCK. Thanks to paulscode for the BLAKE2b StartOS packages these depend on
and build upon (knots-blake2b, lightning-fork, datum-blake2b).
