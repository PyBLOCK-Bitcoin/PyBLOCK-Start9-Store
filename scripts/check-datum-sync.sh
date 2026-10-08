#!/bin/sh
# The three PyBLØCK DATUM gateway packages share all their code. Only
# startos/pool.ts (pool constants) and startos/manifest/i18n.ts (store
# descriptions) may differ, plus the per-package docs, icon and package.json name.
# Fails if any other file under startos/ differs between them.
set -eu
cd "$(dirname "$0")/.."
ref=pyblock-chirp
status=0
for pkg in pyblock-wavicles pyblock-carousel; do
	if ! diff -r -q \
		-x pool.ts -x i18n.ts \
		"$ref/startos" "$pkg/startos"; then
		echo "check-sync: $pkg/startos drifted from $ref/startos" >&2
		status=1
	fi
	for f in LICENSE tsconfig.json; do
		cmp -s "$ref/$f" "$pkg/$f" || { echo "check-sync: $pkg/$f differs" >&2; status=1; }
	done
done
# manifest/i18n.ts is excluded by name above, which also excludes
# startos/i18n/index.ts; compare that one explicitly.
for pkg in pyblock-wavicles pyblock-carousel; do
	cmp -s "$ref/startos/i18n/index.ts" "$pkg/startos/i18n/index.ts" \
		|| { echo "check-sync: $pkg/startos/i18n/index.ts differs" >&2; status=1; }
done
[ "$status" -eq 0 ] && echo "check-sync: DATUM packages in sync"
exit "$status"
