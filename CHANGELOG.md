# Changelog

## 1.1.0 — 2026-09-29

- Eval suite: seven cases against a mocked Ayda server with the real tool
  descriptions, and `scripts/eval-compare.sh`, which scores the skills
  against the Ayda connection alone.
- `ayda-remember` 1.1.0: a single thing the member names is stored at once;
  only candidates drawn from the conversation wait for approval.

## 1.0.0 — 2026-09-29

First public release.

- New skills: `ayda-guide`, `ayda-daily-brief`, `ayda-loop-sweep` and
  `ayda-remember`.
- `ayda-decision-trace`, `ayda-fact-check` and `ayda-onboarding` 1.1.0: use
  `ask`, `effective_at`, `research_brief`, `list_records` and
  `folder_contains`, and report conflicts between sources.
- Plugin manifest with the Ayda MCP server; the installation host is asked
  for at install time.
