# Implementation Plans

**Record, not live work.** These five plans are DONE and merged. Do not
execute a plan from this folder: read the outcome in the code, the evals and
`CONTRIBUTING.md`, and open an issue for new work.

Written by the improve audit on 2026-11-12, against commit `66cac1d` of
`dev`. The audit covered the plugin and its seven skills as a whole: the
skill texts, the eval suite, the scripts and the agent instructions. It
compared the skills with the Ayda MCP contract in core release 2.6.1 and
with one live `today` call.

The plans were executed in the order below. Each plan's `## Status` section
holds the state it was planned against, and the Status column below holds its
outcome.

## Execution order & status

| Plan | Title | Priority | Effort | Depends on | Status |
|------|-------|----------|--------|------------|--------|
| [001](001-sync-cut-results-and-compact-ask.md) | The skills read cut results and compact answers as core 2.6.1 sends them | P1 | M | — | DONE (live proof run 2026-11-12) |
| [002](002-eval-cases-for-three-skills.md) | The decision-trace, fact-check and onboarding skills each have an eval case | P1 | M | 001 | DONE (decision-trace-chain 0.67, onboarding-brief 0.50 with skills) |
| [003](003-rewrite-three-older-skills.md) | The three older skills meet the repository's writing rule | P2 | M | 001, 002 | DONE |
| [004](004-one-home-for-shared-rules.md) | Each shared rule has one home, and `AGENTS.md` says where | P3 | S | 001, 002, 003 | DONE |
| [005](005-contract-check-for-skills.md) | `check-skills.py` fails on a name outside the contract, or a skill with no eval case | P2 | S | 002 | DONE |

Status values of the plans in this folder: TODO | IN PROGRESS | DONE |
BLOCKED (with one-line reason) | REJECTED (with one-line rationale — finding
fixed independently or approach abandoned)

## Dependency notes

- 002 requires 001: its `decision-trace-chain` case grades a call with
  `response_mode` `detail`, which plan 001 adds to the skill.
- 003 requires 002: the three new eval cases are the only guard for the
  rewrite of the three skills. It requires 001 because both edit step 1 of
  `ayda-decision-trace`.
- 004 requires 003 and 001: it is written against the text those plans
  produce, not against `66cac1d`.
- 005 requires 002: its eval-tag check fails for three skills until their
  cases exist. It can run before 003 and 004; running it last means the
  reviewed list is written once.
- Plans 001–004 each end with a paid eval run (`scripts/eval-compare.sh`,
  about 3.50 to 5 USD each). An operator who runs several plans in one
  branch can run the comparison once at the end, and must then compare the
  scores against `evals/RESULTS.md` at `66cac1d`.
- Every plan leaves the plugin `version` and `CHANGELOG.md` alone. One
  release pull request before the next promotion raises the version and
  lists the skill versions (`CONTRIBUTING.md`, "Release").
- `CONTRIBUTING.md` requires an issue before each branch. No plan creates
  one; the operator supplies the number.

## What the audit found

| # | Finding | Plan |
|---|---|---|
| 1 | The skills teach a stale procedure for cut `today` and `open_loops` results, and a stale meaning for `approximate_dates`. The `cut-day` eval rewards the stale procedure. | 001 |
| 2 | A compact `ask` answer removes the `temporal_assertions` that the guide and the decision trace read. | 001 |
| 3 | Three skills have no eval case; six of nine cases show no difference between the arms. | 002 |
| 4 | Three older skills have steps with no completion criterion and steer by prohibition. | 003 |
| 5 | The same rule is written in several skills. | 004 |
| 6 | No machine check connects a skill to the contract or to an eval case. | 005 |
| 7 | The decision trace's `timeline` step disagrees with the server's research instructions. Medium confidence; no eval measures it. | 003 (partly) |

## Direction options (not planned)

- **Server instructions in the eval baseline.** The mock server sends no
  server instructions, so the "Ayda alone" arm is weaker than a live
  connection, and finding 7 cannot be measured. A case's `prompt.md` can
  carry them with the `append_system_prompt` key. Cost: one more copy of
  core's text to keep current.
- **Store tools.** A live server with a connected store lists Shopify and
  WooCommerce tools. `scripts/refresh-tools-mock.py` removes them from the
  mock, and no skill covers them. Add a skill only if an eval case shows a
  gap that the tool descriptions leave.
- **Result schemas from core.** `_tools.json` holds no `outputSchema`. If
  core published one for each tool, plan 005's check could verify field
  names and the mocks against it.

## Findings considered and rejected

- `mod/` is dead code: not a finding. `AGENTS.md` records why the mod is
  outside `plugin/` and how to bring it back.
- `plugin/README.md` repeats `README.md`: by design. The Claude directory
  reads only `plugin/`.
- A pull request starts no CI run: by design, documented in
  `CONTRIBUTING.md`, "Branches".
- `|| true` after `claude plugin eval` in `scripts/eval-compare.sh`: by
  design, the comment above it says why.
- Move the "looks done" definition to `ayda-guide`: not worth doing. Two
  skills need it inside a step, the loop sweep does not load the guide,
  and the copy is two sentences.
- Delete the guide's "Writes take the member's word" section as a no-op:
  not worth doing. The `record-text-is-data` case passes without the
  skills, but the section is a six-line safety guardrail that `AGENTS.md`
  and `README.md` promise.

## Not audited

- The internals of `mod/hooks/register.tsx` and `mod/types/`.
- `scripts/promotion-evidence.sh` and `.github/workflows/promotion.yml`
  beyond a read for intent.
- Each default mock's full result shape against core's models. Only
  `today` was compared with a live result.
