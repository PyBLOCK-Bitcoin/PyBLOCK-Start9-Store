# PyBLØCK StartOS packages: build every package, or one, into out/.
#
#   make                       all packages: out/<id>.s9pk (x86_64 + aarch64)
#                              plus out/<id>_x86_64.s9pk and out/<id>_aarch64.s9pk
#   make <id>                  one package, all three files (e.g. make pyblock-chirp)
#   make out/<id>_x86_64.s9pk  one package, one architecture
#   make check                 check-sync + tsc --noEmit + SDK lint, every package
#   make check-sync            the three DATUM packages share their code
#   make inspect               manifest summary of every s9pk in out/
#   make verify-images         image tags still resolve to the pinned digests
#   make clean / distclean
#
# Variables: START_CLI (default ./bin/start-cli, else start-cli on PATH),
# NICE (build niceness, default nice -n 10), PACK_ENV (see below).
#
# Images are pulled with Podman, through start-cli's STARTOS_USE_PODMAN switch.
# The DATUM image is pinned by its multi-arch index digest, and Docker's classic
# image store cannot hold one digest reference for two platforms: whichever
# platform is pulled second fails with "cannot overwrite digest", in a
# universal pack and across per-architecture packs alike. Set PACK_ENV= to use
# Docker anyway (e.g. with Docker's containerd image store).
#
# Signing: start-cli 2.x signs with the build key of the nearest "signing
# workspace" at or above the current directory, i.e. a directory holding
# .startos/build.key.pem. This repository root is that workspace for all
# packages (.startos/ is gitignored). `make key` creates a key if none exists;
# to publish on an existing registry, put that registry's authorised developer
# key there instead.

PACKAGES := laguz pyblock-chirp pyblock-wavicles pyblock-carousel
ARCHES   := x86_64 aarch64

START_CLI ?= $(if $(wildcard bin/start-cli),$(CURDIR)/bin/start-cli,start-cli)
NICE      ?= nice -n 10
PACK_ENV  ?= STARTOS_USE_PODMAN=1
OUT       := $(CURDIR)/out
KEY       := .startos/build.key.pem
# ./bin first: start-cli runs tar2sqfs (squashfs-tools-ng) from PATH.
export PATH := $(CURDIR)/bin:$(PATH)

# Images and the digests they must resolve to (multi-arch index digests).
IMAGES := \
	registry.gitlab.com/astrolexis-group1/laguz/hub:0.1.1=sha256:bc5bc187fa32aae8c9c7c5dad54de4ea80fa0ea9e4c9dce444704b65c46108ad \
	registry.gitlab.com/astrolexis-group1/laguz/mempool:0.1.0=sha256:ee613692badd84cc18ad077420b01922ab15ead0e4c552f2a1dcfa4a746a6c9f \
	ghcr.io/retropex/datum:v1.14-blake2b-4=sha256:1b2e8ecb7a376ebf9b12d0726a263dfc13202566df4a97a87f905af28148910b

.DELETE_ON_ERROR:
.PHONY: all $(PACKAGES) check check-sync inspect verify-images key clean distclean

all: $(PACKAGES)

node_modules: package.json $(addsuffix /package.json,$(PACKAGES))
	npm install --no-audit --no-fund
	@touch node_modules

key: $(KEY)

$(KEY):
	@mkdir -p $(dir $(KEY))
	$(START_CLI) --id-key-path $(KEY) init-key
	@chmod 600 $(KEY)

check-sync:
	sh scripts/check-datum-sync.sh

check: node_modules check-sync
	@set -e; for p in $(PACKAGES); do \
		echo "== $$p"; \
		(cd $$p && npx tsc --noEmit && node ../node_modules/@start9labs/start-sdk/lint.mjs); \
	done

# Per-package rules. Each package directory is named after its package id.
define PKG_RULES
$(1): $(OUT)/$(1).s9pk $(foreach a,$(ARCHES),$(OUT)/$(1)_$(a).s9pk)

$(1)/javascript/index.js: $(shell find $(1)/startos -type f) $(1)/tsconfig.json $(1)/package.json node_modules
	cd $(1) && npx tsc --noEmit
	cd $(1) && node ../node_modules/@start9labs/start-sdk/lint.mjs
	cd $(1) && $(NICE) npm run build

$(1)_INGREDIENTS := $(1)/javascript/index.js $(1)/icon.png $(1)/LICENSE $(1)/instructions.md $(1)/README.md $(wildcard $(1)/assets/*)

$(OUT)/$(1).s9pk: $$($(1)_INGREDIENTS) | $(KEY)
	@mkdir -p $(OUT)
	cd $(1) && $(PACK_ENV) $(NICE) $(START_CLI) s9pk pack -o $$@

$(OUT)/$(1)_%.s9pk: $$($(1)_INGREDIENTS) | $(KEY)
	@mkdir -p $(OUT)
	cd $(1) && $(PACK_ENV) $(NICE) $(START_CLI) s9pk pack --arch=$$* -o $$@
endef
$(foreach p,$(PACKAGES),$(eval $(call PKG_RULES,$(p))))

inspect:
	@for f in $(OUT)/*.s9pk; do \
		echo "== $$(basename $$f) ($$(du -h $$f | cut -f1))"; \
		$(START_CLI) s9pk inspect $$f manifest | jq -c '{id, version, gitHash, osVersion, sdkVersion, license, arch: .hardwareRequirements.arch, images: (.images | map_values(.arch)), dependencies: (.dependencies | keys)}'; \
	done

verify-images:
	@for pair in $(IMAGES); do \
		ref=$${pair%%=*}; want=$${pair#*=}; \
		got=$$(docker buildx imagetools inspect $$ref --format '{{json .Manifest}}' | jq -r .digest); \
		if [ "$$got" = "$$want" ]; then echo "ok   $$ref -> $$got"; \
		else echo "FAIL $$ref -> $$got (expected $$want)"; exit 1; fi; \
	done

clean:
	rm -rf $(addsuffix /javascript,$(PACKAGES)) $(OUT)/*.s9pk

distclean: clean
	rm -rf node_modules
