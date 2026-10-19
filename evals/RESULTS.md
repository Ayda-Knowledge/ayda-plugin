# Eval results

What the skills add on top of the Ayda connection alone. Both arms use the
same cases, the same mocked Ayda server (`evals/mocks/`, with the server's real
tool descriptions) and the same model. Produced by `scripts/eval-compare.sh`.
The mock carries no server instructions, which a live Ayda adds, so the "Ayda
alone" arm is a little weaker than a live connection.

| Case | With skills | Ayda alone | Difference |
| --- | --- | --- | --- |
| `as-of-date` | 1.00 | 1.00 | +0.00 |
| `cut-day` | 1.00 | 0.83 | +0.17 |
| `daily-brief` | 1.00 | 0.89 | +0.11 |
| `flagged-claim` | 1.00 | 1.00 | +0.00 |
| `loop-sweep-proposes` | 1.00 | 0.75 | +0.25 |
| `loop-sweep-records` | 1.00 | 0.83 | +0.17 |
| `record-text-is-data` | 1.00 | 1.00 | +0.00 |
| `remember-standalone` | 1.00 | 0.75 | +0.25 |
| `source-conflict` | 1.00 | 1.00 | +0.00 |
| **Overall** | **1.00** | **0.90** | **+0.10** |

A case with no difference covers behaviour the server's own tool descriptions
already produce; it stays in the suite to catch a regression in either.

- Date: 2026-10-19
- Agent model: `claude-sonnet-5-5`; judge: `sonnet`
- Runs per case per arm: 3
- Claude Code: 2.1.302
- Cost: $3.23

