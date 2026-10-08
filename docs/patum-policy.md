# PyBLØCK recommended node policy (PATUM) for knots-blake2b

PATUM is PyBLØCK's node-runner setup: your own Bitcoin Knots (BLAKE2b) node plus
your own DATUM gateway. On StartOS the node is paulscode's **Bitcoin Knots
(BLAKE2b) Companion** (`knots-blake2b`, registry `https://start9.paulscode.com`).
This repository does **not** ship a second Knots package; it recommends the
following settings for that one.

| Option | Recommended | Knots default | Why |
| --- | --- | --- | --- |
| `blockreservedweight` | `60000` | `8000` | PyBLØCK pools pay many miners directly in the coinbase. A big coinbase on top of a full template can push the block over the weight limit, and the network rejects it. Reserving 60,000 WU keeps room for it. |
| `permitbaremultisig` | `0` | `0` | No bare multisig relay (data stuffing). |
| `datacarrier` | `0` | `1` | Do not relay or mine OP_RETURN data transactions. |
| `datacarriersize` | `0` | `83` | Belt and braces with `datacarrier=0`. |
| `rejecttokens` | `1` | `0` | Reject token (runes) transactions. |
| `rejectparasites` | `1` | `1` | Reject parasite transactions. |

These are mempool and block-template policy settings: they decide which
transactions your node relays and puts in the blocks your gateway builds. They do
not affect the coinbase outputs and commitments the pool adds.

## Setting them in StartOS

Checked against `knots-blake2b` 1.0.0:35 (source) and 1.0.0:37 (the build on
paulscode's registry): both expose the same forms.

Open **Bitcoin Knots (BLAKE2b) Companion → Actions → Configuration → Mempool
Settings**, then set:

| Option | Field in Mempool Settings | Value |
| --- | --- | --- |
| `permitbaremultisig=0` | **Permit Bare Multisig** | False |
| `datacarrier=0` | **Relay OP_RETURN Transactions** | False |
| `datacarriersize=0` | **Max OP_RETURN Size** | 0 |
| `rejecttokens=1` | **Reject Tokens** | True |
| `rejectparasites=1` | **Reject Parasites** | True |

Save, and let the node restart.

### `blockreservedweight` is not exposed

None of the companion's actions (Mempool Settings, Other Settings, RPC, Peers,
the hidden Auto-Configure for dependents) has a `blockreservedweight` field, and
the package's `bitcoin.conf` file model does not know the key. A line added to
`bitcoin.conf` by hand is dropped the next time any setting is saved, because
the package parses the file against its own schema and writes it back.
**Suggest to paulscode that he expose `blockreservedweight`** (for example in
Other Settings → Template Construction, next to Max Block Weight).

Until then, the same transaction headroom can be had with a setting the
package does expose: **Other Settings → Template Construction → Max Block
Weight = 3,948,000**. Bitcoin Knots 29 fills a template up to
`blockmaxweight − blockreservedweight`, so 3,948,000 with the default 8,000
reserved leaves 3,940,000 WU for transactions, exactly what
`blockreservedweight=60000` leaves under the 4,000,000 WU limit. (Despite its
"vBytes" label, the field is passed to `blockmaxweight`, which is in weight
units.) Also check **Max Block Size**: if it is set low it caps templates
before weight does.

## Elsewhere (plain bitcoin.conf)

```ini
blockreservedweight=60000
permitbaremultisig=0
datacarrier=0
datacarriersize=0
rejecttokens=1
rejectparasites=1
```
