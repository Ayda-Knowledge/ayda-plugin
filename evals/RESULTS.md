# Eval results

What the skills add on top of the Ayda connection alone. Both arms use the
same cases, the same mocked Ayda server (`evals/mocks/`, with the server's real
tool descriptions) and the same model. Produced by `scripts/eval-compare.sh`.
The mock carries no server instructions, which a live Ayda adds, so the "Ayda
alone" arm is a little weaker than a live connection.

| Case | With skills | Ayda alone | Difference |
| --- | --- | --- | --- |
| `as-of-date` | 1.00 | 1.00 | +0.00 |
| `cut-day` | 0.83 | 1.00 | -0.17 |
| `daily-brief` | 1.00 | 0.67 | +0.33 |
| `decision-trace-chain` | 1.00 | 0.50 | +0.50 |
| `fact-check-verdicts` | 0.67 | 0.00 | +0.67 |
| `flagged-claim` | 1.00 | 1.00 | +0.00 |
| `loop-sweep-proposes` | 1.00 | 0.75 | +0.25 |
| `loop-sweep-records` | 1.00 | 1.00 | +0.00 |
| `onboarding-brief` | 1.00 | 1.00 | +0.00 |
| `record-text-is-data` | 1.00 | 1.00 | +0.00 |
| `remember-standalone` | 1.00 | 0.75 | +0.25 |
| `source-conflict` | 1.00 | 1.00 | +0.00 |
| **Overall** | **0.96** | **0.81** | **+0.15** |

A case with no difference covers behaviour the server's own tool descriptions
already produce; it stays in the suite to catch a regression in either.

- Date: 2026-11-12
- Agent model: `claude-sonnet-5-5`; judge: `sonnet`
- Runs per case per arm: 3
- Claude Code: 2.1.322
- Cost: $5.13

