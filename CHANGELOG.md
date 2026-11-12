# Changelog

## 1.4.0 — 2026-11-12

The skills now read results as Ayda core 2.6.1 sends them. Install this
release with a core at 2.6.1 or later.

- `ayda-daily-brief` 1.2.1 and `ayda-loop-sweep` 1.2.0: a cut `today` or
  `open_loops` result is read to its next page with `next_cursor`, up to a
  stated page limit, and the brief or sweep says what a remaining cut hides.
  Before, the daily brief missed records that one more call returns.
- `ayda-guide` 1.3.0: it explains a cut result, the `approximate_dates`
  count, and the compact `ask` answer, which leaves out most
  `temporal_assertions`. It also holds the rules to cite every statement and
  to report an empty result as "no visible evidence".
- `ayda-decision-trace` 1.4.1: it asks for the detail answer, so it can
  follow a replaced decision to its record. Each step ends on a stated
  completion criterion.
- `ayda-fact-check` 1.3.1: each step ends on a stated completion criterion.
- `ayda-onboarding` 1.3.0: each step ends on a stated completion criterion,
  and the brief looks up each named person before it states a role.

## 1.3.1 — 2026-11-02

- `ayda-daily-brief` 1.1.1: its description is now valid YAML. The colon in
  "from Ayda: what changed" stopped the Claude directory from reading the
  skill, so it held every update after 1.1.1 for review. Directory installs
  now get the skills-only plugin, without the connector that did not work.
- The plugin still declares no MCP server, hooks or commands. Connect your
  own Ayda once, as the README says.

## 1.3.0 — 2026-10-19

The skills now read the fields that Ayda core 1.3.0 and later sends, and
leave the routing rules to Ayda's own tool descriptions. On an earlier core,
`ayda-daily-brief` calls `whoami`, which that core does not have.

- `ayda-guide` 1.1.0: a sentence that Ayda's answer check flags is verified
  against its record or left out. It reads every temporal status, the
  coverage of an answer, and the chain of replaced decisions. A long record
  takes several `get_record` calls, and a cut day is read to the end.
- `ayda-daily-brief` 1.1.0: the brief knows who you are (`whoami`). When the
  day is too large for one result, it reads the rest with `timeline`, and it
  tells you when the record times are only when Ayda first read them.
- `ayda-decision-trace` 1.2.0: it follows the decision that replaced another,
  and no longer asks the graph for decisions, which it does not hold.
- `ayda-fact-check` 1.2.0: a flagged sentence in an Ayda answer is not
  evidence for a verdict.
- `ayda-loop-sweep` 1.1.0: one verdict covers the same loop raised in other
  records.

## 1.2.2 — 2026-10-05

- The plugin no longer declares the Ayda connector. The Claude apps cannot
  ask for your installation's host name, so the connector showed
  **Not added** and **Connect** did nothing. The plugin now holds the skills
  only, and you connect your installation once: a custom connector in the
  Claude apps, or `claude mcp add` in Claude Code. The README has the steps.
- If you used the plugin's connector in Claude Code, add it again:
  `claude mcp add --transport http --scope user ayda https://<your Ayda host>/mcp`.

## 1.2.1 — 2026-10-04

- The Claude Code mod is removed from the plugin for now: the open loops row
  and pane, `/ayda-loops`, the source cards and the time zone on `today`.
  Auto mode refuses a call that the mod makes itself. The code stays in
  `mod/` in the repository and is not installed.

## 1.2.0 — 2026-10-03

- A Claude Code mod (`plugin/hooks/`). Claude Code does not show Ayda's MCP
  Apps, so the mod draws two of them from the same tool results:
  - a row above the prompt with your open loop counts, and a pane
    (`/ayda-loops`) with Done, Dismiss, Not done and Reopen buttons;
  - a source card under each `ask` and `research_brief` result, with the
    temporal status and a warning when sources disagree or a quote is stale.
- The mod adds your own time zone to a `today` call that has none.
- Limits: the pane shows the first five loops of each group, and a session
  in auto mode must allow the `open_loops` and `decide_open_loop` tools
  before the mod can call them.

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
