import { setupManifest } from '@start9labs/start-sdk'
import { packageId, packageTitle, poolPage } from '../pool'
import { depKnotsDescription, long, short } from './i18n'

/**
 * The gateway image, the same one the PyBLØCK Umbrel apps run: retropex's
 * DATUM gateway build with BLAKE2b support, v1.14-blake2b-4.
 *
 * Pinned by the multi-arch index digest. The tag is kept in front of it only
 * so the reference reads well; the digest is what Docker resolves, so a moved
 * tag cannot change what is packed. Per-platform manifests behind this index:
 *   linux/amd64  sha256:49cb41105a7a476edba30a6a46a4f876a219dba97efcade62508c7f312034582
 *   linux/arm64  sha256:0956e04f4b754ab66063d09436b770fb206e1fc9951d943e1ee7e6da817425cd
 * (`make verify-images` at the repository root checks the index digest.)
 */
export const datumImage =
  'ghcr.io/retropex/datum:v1.14-blake2b-4@sha256:1b2e8ecb7a376ebf9b12d0726a263dfc13202566df4a97a87f905af28148910b'

export const manifest = setupManifest({
  id: packageId,
  title: packageTitle,
  license: 'MIT',
  packageRepo: 'https://github.com/PyBLOCK-Bitcoin/START-9',
  upstreamRepo: 'https://github.com/retropex/datum-docker',
  marketingUrl: poolPage,
  donationUrl: null,
  description: { short, long },
  // `main` holds store.json (payout address, coinbase tag, dashboard password)
  // and the gateway config generated from it on every start.
  volumes: ['main'],
  images: {
    datum: {
      source: { dockerTag: datumImage },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {
    // The BLAKE2b node, never the official `bitcoind`/`bitcoinknots`: those
    // follow the SHA256d chain and would hand this gateway templates for the
    // wrong chain.
    'knots-blake2b': {
      description: depKnotsDescription,
      optional: false,
      metadata: {
        title: 'Bitcoin Knots (BLAKE2b) Companion',
        icon: 'https://raw.githubusercontent.com/paulscode/knots-blake2b-startos/10b54ce45e84026fe2d81731ad4741bd9c9814c9/dep-icon.png',
      },
    },
  },
})
