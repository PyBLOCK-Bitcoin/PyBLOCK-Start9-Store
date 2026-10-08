import { setupManifest } from '@start9labs/start-sdk'
import {
  depKnotsDescription,
  depLightningDescription,
  long,
  short,
} from './i18n'

export const manifest = setupManifest({
  id: 'laguz',
  title: 'Laguz Hub',
  license: 'Apache-2.0',
  packageRepo: 'https://github.com/PyBLOCK-Bitcoin/START-9',
  upstreamRepo: 'https://b.pyblock.xyz:8443/laguz.php',
  marketingUrl: 'https://b.pyblock.xyz:8443',
  donationUrl: 'https://b.pyblock.xyz:8443',
  description: { short, long },
  // `main` is the hub's WORK_DIR (/data): its database and config, plus
  // copies of the Lightning Fork credentials it uses (lnd/).
  volumes: ['main'],
  images: {
    // Pulled by tag, not digest: a universal pack pulls both architectures
    // and Docker cannot hold one digest reference for two platforms. The tags
    // are never moved once published. Index digests they resolved to at
    // release (checked by `make verify-images`):
    //   hub     sha256:bc5bc187fa32aae8c9c7c5dad54de4ea80fa0ea9e4c9dce444704b65c46108ad
    //   mempool sha256:ee613692badd84cc18ad077420b01922ab15ead0e4c552f2a1dcfa4a746a6c9f
    hub: {
      source: {
        dockerTag: 'registry.gitlab.com/astrolexis-group1/laguz/hub:0.1.1',
      },
      arch: ['x86_64', 'aarch64'],
    },
    mempool: {
      source: {
        dockerTag: 'registry.gitlab.com/astrolexis-group1/laguz/mempool:0.1.0',
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {
    'lightning-fork': {
      description: depLightningDescription,
      optional: false,
      metadata: {
        title: 'Lightning Fork',
        icon: 'https://raw.githubusercontent.com/paulscode/lightning-fork-startos/b72573667c9867faf86ee8505132d0dd4ef80926/icon.png',
      },
    },
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
