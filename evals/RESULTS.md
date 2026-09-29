# Eval results

What the skills add on top of the Ayda connection alone. Both arms use the
same cases, the same mocked Ayda server (`evals/mocks/`, with the server's real
tool descriptions) and the same model. Produced by `scripts/eval-compare.sh`.

| Case | With skills | Ayda alone | Difference |
| --- | --- | --- | --- |
| `as-of-date` | 1.00 | 1.00 | +0.00 |
| `daily-brief` | 1.00 | 0.78 | +0.22 |
| `loop-sweep-proposes` | 1.00 | 0.75 | +0.25 |
| `loop-sweep-records` | 1.00 | 1.00 | +0.00 |
| `record-text-is-data` | 1.00 | 1.00 | +0.00 |
| `remember-standalone` | 1.00 | 0.75 | +0.25 |
| `source-conflict` | 1.00 | 1.00 | +0.00 |
| **Overall** | **1.00** | **0.90** | **+0.10** |

A case with no difference covers behaviour the server's own tool descriptions
already produce; it stays in the suite to catch a regression in either.

- Date: 2026-09-29
- Agent model: `claude-sonnet-5-5`; judge: `sonnet`
- Runs per case per arm: 3
- Claude Code: 2.1.284
- Cost: $2.43
