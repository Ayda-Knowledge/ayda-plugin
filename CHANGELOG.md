# Changelog

## 1.2.0 — unreleased

- A Claude Code mod (`plugin/hooks/`). Claude Code does not show Ayda's MCP
  Apps, so the mod draws two of them from the same tool results:
  - a row above the prompt with your open loop counts, and a pane
    (`/ayda-loops`) with Done, Dismiss, Not done and Reopen buttons;
  - a source card under each `ask` and `research_brief` result, with the
    temporal status and a warning when sources disagree or a quote is stale.
- The mod adds your own time zone to a `today` call that has none.

## 1.1.1 — 2026-09-29

- The plugin now lives in `plugin/`, apart from the repository tooling and
  the eval suite, and
  carries the Ayda icon and a privacy statement for the Claude directory.
- Install steps for the Claude apps.

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
