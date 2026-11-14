# Plan 001: The skills read cut results and compact answers as Ayda core 2.6.1 sends them

> **Record**: DONE and merged. This is history, not live work: read the outcome in the code, the evals and `CONTRIBUTING.md`, and open a new issue for new work. The index is [README](README.md).

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat 66cac1d..HEAD -- plugin/skills/ayda-guide plugin/skills/ayda-daily-brief plugin/skills/ayda-loop-sweep plugin/skills/ayda-decision-trace evals/cut-day evals/mocks/ayda/today.md`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live files before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `66cac1d`, 2026-11-12

## Why this matters

This repository holds skills: Markdown files that tell an agent how to use a
company's Ayda MCP server. The server lives in another repository ("core").
Core release 2.6.1 (2026-11-11) changed two things, and four skills still
teach the old behaviour:

1. `today` and `open_loops` now continue a cut result with `next_cursor`.
   The skills tell the agent to call `timeline` instead, or to only state
   that the result is cut. A live `today` call on 2026-11-12 came back cut
   after five records, so this happens on ordinary days: the daily brief
   drops records that one more call returns.
2. `ask` now answers in a compact form by default. The compact form removes
   most `temporal_assertions`. The decision-trace skill reads those fields
   to follow a replaced decision, so its first step finds nothing.

One eval case (`cut-day`) rewards the old behaviour. After this plan, the
skills, the mocks and that case agree with core 2.6.1.

## Current state

### Files

- `plugin/skills/ayda-guide/SKILL.md` — shared reference for the other
  skills. Holds the stale section "Read a cut day" (lines 92–104) and the
  temporal-field rules (lines 78–90).
- `plugin/skills/ayda-daily-brief/SKILL.md` — steps 2, 3, 5 and 6 hold the
  stale cut procedure.
- `plugin/skills/ayda-loop-sweep/SKILL.md` — step 1 states a cut and does
  not read the next page.
- `plugin/skills/ayda-decision-trace/SKILL.md` — step 1 reads fields that a
  compact answer removes.
- `plugin/skills/<name>/VERSION` — one line, a semantic version.
- `evals/cut-day/` — eval case: `prompt.md`, `graders/names-missing.md`,
  `graders/reads-rest.md`, `mocks/ayda/today.md`, `mocks/ayda/timeline.md`.
- `evals/mocks/ayda/today.md` — the default `today` mock for all cases.
- `evals/mocks/ayda/_tools.json` — copy of the live tool descriptions.
  Already current. Do not edit it.

### What core 2.6.1 does (verified in core's code and on a live server)

`today`:

- The tool description says: "When truncated is true, call again with
  next_cursor for the day's next records until it is absent; a continued
  page lists records only, and its counts cover that page."
- `next_cursor` is set whenever records remain. `size_limited: true` only
  says that the 16 KB size limit, and not the 200-record limit, ended the
  page.
- A live result has these top-level keys, in this order: `query_id`,
  `date`, `timezone`, `range_start`, `range_end`, `records`, `by_person`,
  `sources`, `loops`, `truncated`, `size_limited`, `next_cursor` (only when
  records remain), `approximate_dates`, `approximate_dates_scope`,
  `approximate_dates_records`, `approximate_dates_method`,
  `redaction_notice`.
- Each record also has `"timestamp_basis": "record_metadata"`.
- `approximate_dates` counts the records that share one minute with four or
  more other records. `approximate_dates_records` is the number of records
  that were examined. Core's own text for it: "this may be a bulk import,
  not an established chronology". `approximate_dates_method` is the fixed
  string `"five_or_more_records_in_one_minute; not proof of ingest time"`,
  and `approximate_dates_scope` is `"returned_page"`.

`open_loops`:

- The tool description says: "One page holds up to limit loops per group
  (default 20, at most 50) within a 16 KB result: about 18 typical loops.
  When next_cursor is present, call again with cursor set to it and the
  same filter and since, until it is absent".

`ask` and `research_brief`:

- Input `response_mode` is `compact` (the default) or `detail`.
- In `compact`, a citation keeps its `temporal_assertions` only when one of
  them has a `conflict_status`, or Ayda marked one for review. For every
  other citation, core removes `temporal_assertions`, adds
  `assertions_left_out` (a count) to the citation, and adds the string
  `"temporal_assertions"` to the top-level list `detail_omitted`.
- Result: `authority_conflict` is still visible in a compact answer.
  `evidence_status` `source_changed`, `replaces_decision_id` and
  `superseded_by` are usually not.

### Stale text, as it is today

`plugin/skills/ayda-guide/SKILL.md:92-104`:

```markdown
## Read a cut day

A `today` result holds at most 16 KB and at most 200 records.

- `size_limited` true: Ayda dropped the oldest records to fit the size.
  `timeline` with `start` set to `range_start` and `end` set to
  `range_end` returns them, newest first and without author, at 50 a page.
- `truncated` true with `size_limited` false: the day holds more records
  than `today` reads. A new `timeline` call returns the same newest records,
  so state the cut instead.
- `approximate_dates` counts the records whose time is when Ayda first read
  them, not when the event happened. When it is close to the number of
  records, present them as "seen that day", not as a sequence.
```

`plugin/skills/ayda-guide/SKILL.md:3` (frontmatter description):

```
description: Combine Ayda's company-knowledge tools with the fewest calls and read their results correctly. Use before a multi-call Ayda task, when an answer depends on a past date or on which source is current, when an answer carries flagged claims, or when an Ayda call timed out, came back cut short, or was refused.
```

`plugin/skills/ayda-guide/SKILL.md:78-79`:

```markdown
Each citation's `temporal_assertions` holds the states and decisions that
record supports:
```

`plugin/skills/ayda-daily-brief/SKILL.md:17-28`:

```markdown
2. **Read the day.** Call `today` with that date and zone. Each entry of
   `by_person` lists `record_ids`; read the title, author and link of each
   from `records`. When `size_limited` is true, Ayda dropped the day's
   oldest records: call `timeline` with `start` set to `range_start`, `end`
   set to `range_end` and `limit` 50, follow `next_cursor` for at most two more pages, and add the
   records that `today` did not hold. When only `truncated` is true, the day
   holds more records than `today` reads; note the cut. Done when you hold
   the day's records and know whether any are still missing.
3. **Read the loops.** Call `open_loops` with `filter` `all`. A loop that
   has `status` `looks_done`, or an `ayda_confident` claim, looks done. One
   ID can sit in two groups; list it once, under `your_move`. Done when you
   hold `your_move`, `waiting`, the loops that look done, and `counts`.
```

`plugin/skills/ayda-daily-brief/SKILL.md:33-40` (step 5):

```markdown
5. **Choose what matters.** Keep a record from step 2 when the member wrote
   it or its title names them, when it touches a loop from step 3, or when
   it belongs to a project an agenda meeting covers. A `timeline` record has
   no author, so judge it by its title. Call `get_record` or `ask` for at
   most three kept records whose meaning the title does not carry.
   `by_person` groups by the author text each source sent, so one person
   can appear twice; merge them only when the name makes it plain. Done
   when each record is kept or dropped.
```

`plugin/skills/ayda-daily-brief/SKILL.md:50-54`:

```markdown
   State the loop counts the tool returned, and say when the day or a loop
   group is still cut. When `approximate_dates` is close to the number of
   records, say that their times are when Ayda read them, and order **What
   changed** by project, not by time. Close by offering to record verdicts
   on the loops (the `ayda-loop-sweep` skill does this).
```

`plugin/skills/ayda-loop-sweep/SKILL.md:12-19`:

```markdown
1. **Load the queue.** Call `open_loops` with `filter` `all` and `limit` 50,
   plus `since` when the member names a start date. A loop looks done when
   its `status` is `looks_done` or it carries an `ayda_confident` claim. One
   ID can sit in two groups; queue it once. Order the queue: loops that look
   done first, then `your_move` by due date and age, then `waiting` loops
   older than a week. Leave `done` loops out. Done when the
   queue is ordered and you have stated the `counts`, and any cut that
   `truncated` or `size_limited` reports.
```

`plugin/skills/ayda-decision-trace/SKILL.md:12-19`:

```markdown
1. Open with one `ask` for the current decision and its stated reason; its
   citations seed the trace. When the question is how the decision changed,
   ask again with `effective_at` set before the change and compare. A
   citation's `temporal_assertions` can name the decision it replaced
   (`replaces_decision_id`) and the one that replaced it (`superseded_by`):
   follow that chain as `ayda-guide` says before you search. Done when you
   hold the current decision, its citations, and each earlier version the
   chain names.
```

`evals/cut-day/graders/reads-rest.md` (whole file):

```markdown
---
type: tool_used
tool: mcp__ayda__timeline
---
```

`evals/cut-day/mocks/ayda/today.md` ends with:

```
  "loops": [],
  "truncated": true,
  "size_limited": true,
  "approximate_dates": 0,
  "redaction_notice": "Ayda redacts each record once, for secrets and identity numbers, before storage; Google Drive files are stored as written."
}
```

### Repository rules that apply (from `AGENTS.md` and `CONTRIBUTING.md`)

- "A skill caches what the Ayda tool descriptions leave out: cost, how tools
  combine, how to read results, and trust. Routing a question to a tool is
  the descriptions' job; a skill that repeats them drifts when they change."
  So the new text points to the tool description for the cursor mechanics
  and adds only the page budget and the reading rules.
- "Every step ends on a completion criterion." Each numbered step keeps a
  sentence that starts with "Done when".
- Frontmatter holds only `name` and `description`. The description is a
  plain YAML scalar on one line: it must not contain `: ` (colon then
  space) or ` #`, and must not start with a punctuation mark.
  `scripts/check-skills.py` enforces this.
- "Bump a skill's `VERSION` when its behaviour changes."
- Prose style: Simplified Technical English. Short sentences, active
  voice, present tense, one word for one meaning. The person who uses Ayda
  is "the member". Wrap lines at about 78 characters, as the files do now.
- The repository is public. A mock holds only the fictional company
  Harbour & Finch (people: Thandi Mokoena, Bob Venter, Liesel Bester, Sipho
  Dlamini; client: Blue Crane) and URLs on `https://example.invalid/`.
- Do not change `plugin/.claude-plugin/plugin.json` or `CHANGELOG.md`. The
  release step owns them (`CONTRIBUTING.md`, "Release"): they change in a
  separate pull request before a promotion to `main`.

### Eval mock format (from the Claude Code plugin-evals documentation)

- A mock file is `evals/<case>/mocks/ayda/<tool>.md` (one case) or
  `evals/mocks/ayda/<tool>.md` (default for all cases). A case mock
  replaces the default mock for that tool.
- Frontmatter keys: `type` (`fixed`, the default, or `agent`), `expect`
  (argument name → type; a call that breaks it aborts the run with score
  0), `error` (fixed only), `abort_when` (agent only).
- A `fixed` mock returns its body for every call. It cannot return a
  different body for a call that has a `cursor`. `{{input.<argument>}}` in
  the body is replaced by the call's argument.
- A `type: agent` mock has instructions as its body. The judge model plays
  the server and sees the earlier calls of the run.
- Grader `type: tool_used` has `tool`, `input_match` (a regular expression
  on the call's JSON input), `min` (default 1) and `max`.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Skill packages | `python3 scripts/check-skills.py` | exit 0; prints `Portable agent skills passed: ayda-daily-brief, ayda-decision-trace, ayda-fact-check, ayda-guide, ayda-loop-sweep, ayda-onboarding, ayda-remember` |
| Plugin manifest | `claude plugin validate plugin --strict` | ends with `✔ Validation passed` (one README notice about an install line is normal) |
| Marketplace manifest | `claude plugin validate . --strict` | ends with `✔ Validation passed` |
| One eval case | see below | the case scores 1.00 |
| Full comparison | `scripts/eval-compare.sh` | prints a table and rewrites `evals/RESULTS.md`; costs about 3.50 USD of model use on your own Claude credentials |

One eval case, with the skills (this form comes from
`scripts/eval-compare.sh`; it was not run while this plan was written):

```bash
work=$(mktemp -d)
cp -R plugin/. "$work/" && cp -R evals "$work/evals" && rm -rf "$work/evals/results"
claude plugin eval "$work" --ablation none --runs 3 --model claude-sonnet-5-5 \
  --judge-model sonnet --case 'cut-day' --trust-plugin --no-publish
rm -rf "$work"
```

## Scope

**In scope** (the only files you should modify):

- `plugin/skills/ayda-guide/SKILL.md` and `plugin/skills/ayda-guide/VERSION`
- `plugin/skills/ayda-daily-brief/SKILL.md` and its `VERSION`
- `plugin/skills/ayda-loop-sweep/SKILL.md` and its `VERSION`
- `plugin/skills/ayda-decision-trace/SKILL.md` and its `VERSION`
- `evals/cut-day/mocks/ayda/today.md`
- `evals/cut-day/graders/reads-rest.md` (delete)
- `evals/cut-day/graders/reads-next-page.md` (create)
- `evals/mocks/ayda/today.md`
- `evals/RESULTS.md` (only through `scripts/eval-compare.sh`)
- `plans/README.md` (status row)

**Out of scope** (do NOT touch, even though they look related):

- `evals/mocks/ayda/_tools.json` — already equal to core; a script owns it.
- `evals/cut-day/mocks/ayda/timeline.md` — keep it. An agent without the
  skills can still call `timeline`, and the mock must answer for that day.
- `plugin/skills/ayda-fact-check/`, `ayda-onboarding/`, `ayda-remember/` —
  the fields they read are still present in a compact answer.
- `plugin/.claude-plugin/plugin.json`, `CHANGELOG.md`, `README.md`,
  `plugin/README.md` — the release step owns them.
- `mod/` — a Claude Code mod that is not installed.
- Any other rewording of the four skills. Plans 003 and 004 own that.

## Git workflow

- The repository requires an issue before a branch (`CONTRIBUTING.md`,
  "Propose a change"). Ask the operator for the issue number. Create an
  issue only if the operator tells you to.
- Branch from `dev`: `bugfix/<issue number>-cut-results-compact-ask`.
- Commit per logical unit. Message style is one short sentence that says
  what changed, for example
  `Make the daily brief frontmatter valid YAML and check it`.
- Add no AI attribution, co-author line or "generated by" text to a commit,
  pull request or file.
- Do NOT push or open a pull request unless the operator tells you to. A
  pull request targets `dev`, uses the sections of
  `.github/pull_request_template.md`, and records the check results.

## Steps

### Step 1: Replace the guide's "Read a cut day" section

In `plugin/skills/ayda-guide/SKILL.md`, replace lines 92–104 (the heading
`## Read a cut day` through the bullet that ends `not as a sequence.`) with
exactly:

```markdown
## Read a cut result

`today` and `open_loops` send at most 16 KB a page, and `today` at most 200
records. Their descriptions say how `next_cursor` continues a page.

- Count each page against the budget. When you stop while `next_cursor` is
  still present, state the cut.
- A later `today` page holds records only. Take `loops` from the first
  page.
- `approximate_dates` counts the records that share one minute with four or
  more others, out of `approximate_dates_records`. That is the mark of a
  bulk import, so those times prove no order. When most records are
  counted, present them as "dated that day", not as a sequence.
```

**Verify**: `grep -c "Read a cut day\|size_limited\|seen that day" plugin/skills/ayda-guide/SKILL.md` → `0`

### Step 2: Tell the guide's reader about compact answers

In the same file, find the paragraph at lines 78–79 that starts
"Each citation's `temporal_assertions` holds the states and decisions".
Insert this paragraph, and one blank line, directly BEFORE it:

```markdown
`ask` and `research_brief` answer in `response_mode` `compact` unless the
call passes `detail`. A compact answer keeps a citation's
`temporal_assertions` only for a conflict or an item Ayda marks for review.
For each other citation it leaves a count in `assertions_left_out` and
names `temporal_assertions` in `detail_omitted`. When the task needs a
decision's history or the age of a quote, make the call with
`response_mode` `detail`.
```

**Verify**: `grep -c "assertions_left_out" plugin/skills/ayda-guide/SKILL.md` → `1`

### Step 3: Raise the guide's version

Leave the frontmatter description (line 3) as it is: its phrase
`came back cut short` still fits the new section.
Change `plugin/skills/ayda-guide/VERSION` from `1.1.1` to `1.2.0`.

**Verify**: `cat plugin/skills/ayda-guide/VERSION` → `1.2.0`;
`python3 scripts/check-skills.py` → exit 0.

### Step 4: Update the daily brief

In `plugin/skills/ayda-daily-brief/SKILL.md`:

a. Replace step 2 and step 3 (lines 17–28) with exactly:

```markdown
2. **Read the day.** Call `today` with that date and zone. Each entry of
   `by_person` lists `record_ids`; read the title, author and link of each
   from `records`. While `next_cursor` is present, call `today` again with
   `cursor` set to it, for at most three more pages. Done when
   `next_cursor` is absent, or you hold four pages and have noted that the
   day is cut.
3. **Read the loops.** Call `open_loops` with `filter` `all`. While
   `next_cursor` is present, call again with it and the same `filter`, for
   at most two more pages. A loop that has `status` `looks_done`, or an
   `ayda_confident` claim, looks done. One ID can sit in two groups; list
   it once, under `your_move`. Done when you hold `your_move`, `waiting`,
   the loops that look done, and `counts`, and know whether a group is
   still cut.
```

b. In step 5, delete the sentence
"A `timeline` record has no author, so judge it by its title." and rewrap
the paragraph so that no line is longer than 78 characters.

c. In step 6, replace the sentence that starts "When `approximate_dates` is
close to the number of records" (through "not by time.") with exactly:

```markdown
   When `approximate_dates` is close to `approximate_dates_records`,
   say that the record times can come from a bulk import, and order **What
   changed** by project, not by time.
```

d. The first paragraph (line 8–10) says "the `ayda-guide` skill for call
cost and cut results". Leave it.

e. Change `plugin/skills/ayda-daily-brief/VERSION` from `1.1.2` to `1.2.0`.

**Verify**:
`grep -c "timeline\|size_limited\|when Ayda read them" plugin/skills/ayda-daily-brief/SKILL.md` → `0`;
`grep -c "Done when" plugin/skills/ayda-daily-brief/SKILL.md` → `4` or more.

### Step 5: Update the loop sweep

In `plugin/skills/ayda-loop-sweep/SKILL.md`, replace step 1 (lines 12–19)
with exactly:

```markdown
1. **Load the queue.** Call `open_loops` with `filter` `all` and `limit` 50,
   plus `since` when the member names a start date. While `next_cursor` is
   present, call again with it and the same `filter` and `since`, for at
   most four more pages. A loop looks done when its `status` is
   `looks_done` or it carries an `ayda_confident` claim. One ID can sit in
   two groups; queue it once. Order the queue: loops that look done first,
   then `your_move` by due date and age, then `waiting` loops older than a
   week. Leave `done` loops out. Done when the queue is ordered and you
   have stated the `counts`, and how many loops the queue does not hold
   when `next_cursor` is still present.
```

Change `plugin/skills/ayda-loop-sweep/VERSION` from `1.1.0` to `1.2.0`.

**Verify**: `grep -c "size_limited" plugin/skills/ayda-loop-sweep/SKILL.md` → `0`;
`grep -c "next_cursor" plugin/skills/ayda-loop-sweep/SKILL.md` → `2`.

### Step 6: Update the decision trace

In `plugin/skills/ayda-decision-trace/SKILL.md`, replace step 1
(lines 12–19) with exactly:

```markdown
1. Open with one `ask` for the current decision and its stated reason, with
   `response_mode` `detail`: a compact answer leaves out the
   `temporal_assertions` that name a replaced decision. Its citations seed
   the trace. When the question is how the decision changed, ask again
   with `effective_at` set before the change and compare. A citation's
   `temporal_assertions` can name the decision it replaced
   (`replaces_decision_id`) and the one that replaced it (`superseded_by`):
   follow that chain as `ayda-guide` says before you search. Done when you
   hold the current decision, its citations, and each earlier version the
   chain names.
```

Change `plugin/skills/ayda-decision-trace/VERSION` from `1.2.0` to `1.3.0`.

**Verify**: `grep -c "response_mode" plugin/skills/ayda-decision-trace/SKILL.md` → `1`;
`python3 scripts/check-skills.py` → exit 0.

### Step 7: Bring the default `today` mock to the live shape

In `evals/mocks/ayda/today.md`:

a. Add `"timestamp_basis": "record_metadata"` to each of the three objects
in `records`, directly after the `occurred_at` line.

b. Replace the line `"approximate_dates": 0,` with these four lines:

```
  "approximate_dates": 0,
  "approximate_dates_scope": "returned_page",
  "approximate_dates_records": 3,
  "approximate_dates_method": "five_or_more_records_in_one_minute; not proof of ingest time",
```

Keep `"truncated": false` and `"size_limited": false`. Add no
`next_cursor` key: the day is complete.

**Verify**:
`python3 -c "import json,sys; t=open('evals/mocks/ayda/today.md').read().split('---\n',2)[2]; json.loads(t.replace('{{input.date}}','2026-09-28').replace('{{input.timezone}}','UTC')); print('ok')"` → `ok`

### Step 8: Make the `cut-day` case page through `today`

a. Replace the whole of `evals/cut-day/mocks/ayda/today.md` with an agent
mock. A fixed mock cannot return a second page, so the judge model plays
the server here:

````markdown
---
type: agent
abort_when: Abort only if the input has neither a date nor a cursor.
---

You are the `today` tool of an Ayda server for the fictional company
Harbour & Finch. Reply with one JSON object and nothing else. Copy the JSON
below exactly; change only the two marked values.

When the input has no `cursor`, or `cursor` is null, return page 1. Replace
`<date>` with the input `date`, and `<timezone>` with the input `timezone`:

```json
{
  "query_id": "eval-today-cut",
  "date": "<date>",
  "timezone": "<timezone>",
  "range_start": "2026-09-24T22:00:00Z",
  "range_end": "2026-09-25T21:59:59.999999Z",
  "records": [
    {
      "id": "slack:C0EVENTS:1790590000.200",
      "title": "Re: revised venue quote",
      "source": "slack",
      "channel": "#events",
      "author": "Bob Venter",
      "occurred_at": "2026-09-25T14:40:00Z",
      "timestamp_basis": "record_metadata",
      "url": "https://example.invalid/slack/C0EVENTS/1790590000.200"
    },
    {
      "id": "github:harbour/site:pr:39",
      "title": "Update footer links",
      "source": "github",
      "author": "Sipho Dlamini",
      "occurred_at": "2026-09-25T09:10:00Z",
      "timestamp_basis": "record_metadata",
      "url": "https://example.invalid/github/harbour/site/pr/39",
      "channel": null
    }
  ],
  "by_person": [
    {"name": "Bob Venter", "record_ids": ["slack:C0EVENTS:1790590000.200"]},
    {"name": "Sipho Dlamini", "record_ids": ["github:harbour/site:pr:39"]}
  ],
  "sources": [
    {"source": "slack", "records": 1},
    {"source": "github", "records": 1}
  ],
  "loops": [],
  "truncated": true,
  "size_limited": true,
  "next_cursor": "eval-today-cut-page-2",
  "approximate_dates": 0,
  "approximate_dates_scope": "returned_page",
  "approximate_dates_records": 2,
  "approximate_dates_method": "five_or_more_records_in_one_minute; not proof of ingest time",
  "redaction_notice": "Ayda redacts each record once, for secrets and identity numbers, before storage; Google Drive files are stored as written."
}
```

When the input `cursor` is `eval-today-cut-page-2`, return page 2:

```json
{
  "query_id": "eval-today-cut-2",
  "date": "2026-09-25",
  "timezone": "Africa/Johannesburg",
  "range_start": "2026-09-24T22:00:00Z",
  "range_end": "2026-09-25T21:59:59.999999Z",
  "records": [
    {
      "id": "slack:C0SALES:1790600000.300",
      "title": "Blue Crane signed the renewal contract",
      "source": "slack",
      "channel": "#sales",
      "author": "Liesel Bester",
      "occurred_at": "2026-09-25T07:05:00Z",
      "timestamp_basis": "record_metadata",
      "url": "https://example.invalid/slack/C0SALES/1790600000.300"
    },
    {
      "id": "slack:C0EVENTS:1790560000.100",
      "title": "Thandi, can you confirm the catering headcount by Monday?",
      "source": "slack",
      "channel": "#events",
      "author": "Liesel Bester",
      "occurred_at": "2026-09-25T06:20:00Z",
      "timestamp_basis": "record_metadata",
      "url": "https://example.invalid/slack/C0EVENTS/1790560000.100"
    }
  ],
  "by_person": [
    {
      "name": "Liesel Bester",
      "record_ids": ["slack:C0SALES:1790600000.300", "slack:C0EVENTS:1790560000.100"]
    }
  ],
  "sources": [{"source": "slack", "records": 2}],
  "loops": [],
  "truncated": false,
  "size_limited": false,
  "approximate_dates": 0,
  "approximate_dates_scope": "returned_page",
  "approximate_dates_records": 2,
  "approximate_dates_method": "five_or_more_records_in_one_minute; not proof of ingest time",
  "redaction_notice": "Ayda redacts each record once, for secrets and identity numbers, before storage; Google Drive files are stored as written."
}
```

For any other `cursor`, return this text as the whole reply:
`Invalid arguments: cursor is not valid.`
````

The two page-2 records have the same IDs, titles and times as the last two
events in `evals/cut-day/mocks/ayda/timeline.md`. Do not change them.

b. Delete `evals/cut-day/graders/reads-rest.md`.

c. Create `evals/cut-day/graders/reads-next-page.md` with exactly:

```markdown
---
type: tool_used
tool: mcp__ayda__today
input_match: '"cursor"\s*:\s*"eval-today-cut-page-2"'
---
```

d. Leave `evals/cut-day/graders/names-missing.md` and
`evals/cut-day/prompt.md` unchanged.

**Verify**: `ls evals/cut-day/graders` → `names-missing.md` and
`reads-next-page.md` only.

### Step 9: Run the `cut-day` case

Run the "One eval case" command from "Commands you will need" with
`--case 'cut-day'`.

**Verify**: the case scores 1.00 with the skills, in 3 of 3 runs.

If the score is lower, read the run report in the printed results folder.
If the mock returned something other than the two pages above, that is a
STOP condition (see below). If the agent did not call `today` with the
cursor, check your edits from steps 1 and 4 against this plan once, fix a
copy error, and run again.

### Step 10: Run all checks and the full comparison

```bash
python3 scripts/check-skills.py
claude plugin validate plugin --strict
claude plugin validate . --strict
scripts/eval-compare.sh
```

**Verify**: the three checks pass as the commands table says.
`evals/RESULTS.md` has today's date, and in the "With skills" column each
of the nine cases scores at least what the table below shows (the scores
before this plan):

| Case | With skills before |
|---|---|
| `as-of-date` | 1.00 |
| `cut-day` | 1.00 |
| `daily-brief` | 1.00 |
| `flagged-claim` | 1.00 |
| `loop-sweep-proposes` | 1.00 |
| `loop-sweep-records` | 1.00 |
| `record-text-is-data` | 1.00 |
| `remember-standalone` | 1.00 |
| `source-conflict` | 1.00 |

### Step 11: Live proof (operator step)

`AGENTS.md` says: "Prove a new step against a live Ayda before shipping it:
the tool's real result shape beats its documentation."

If your session has a configured `ayda` MCP server, do this and record
only field names and counts, never record text (the repository is public):

1. Call `today` for yesterday with the member's zone. If `next_cursor` is
   present, call `today` again with `cursor` set to it. Record: page 1 had
   `next_cursor`; page 2 returned records; page 2 `loops` is empty.
2. Call `ask` once with any question about a past decision and no
   `response_mode`. Record whether `detail_omitted` is present and whether
   any citation has `assertions_left_out`.

If your session has no `ayda` server, write "Live proof not run: no Ayda
server in this session" in your report. The operator then runs it. This is
not a STOP condition.

## Test plan

- No unit tests. The repository tests skill behaviour with eval cases.
- Changed case: `cut-day` now passes only when the agent reads the second
  `today` page (grader `reads-next-page.md`) and reports the Blue Crane
  record or the cut (grader `names-missing.md`).
- Regression: the full comparison in step 10 must keep the other eight
  cases at their earlier "With skills" score.
- No new case for the compact answer. Plan 002 adds a decision-trace case
  that covers it.

## Done criteria

ALL must hold:

- [ ] `python3 scripts/check-skills.py` exits 0
- [ ] `claude plugin validate plugin --strict` and `claude plugin validate . --strict` end with `✔ Validation passed`
- [ ] `grep -rn "Read a cut day\|when Ayda first read\|when Ayda read them" plugin/skills` returns no match
- [ ] `grep -rln "size_limited" plugin/skills` returns no file
- [ ] `grep -c "response_mode" plugin/skills/ayda-guide/SKILL.md plugin/skills/ayda-decision-trace/SKILL.md` shows at least 1 for each file
- [ ] `cat plugin/skills/ayda-guide/VERSION plugin/skills/ayda-daily-brief/VERSION plugin/skills/ayda-loop-sweep/VERSION plugin/skills/ayda-decision-trace/VERSION` prints `1.2.0`, `1.2.0`, `1.2.0`, `1.3.0`
- [ ] `evals/cut-day/graders/reads-rest.md` does not exist; `reads-next-page.md` exists
- [ ] `evals/RESULTS.md` is from today's run and `cut-day` scores 1.00 with the skills
- [ ] `git status --short` lists only files from the in-scope list
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- A file at a location in "Current state" does not match its excerpt.
- The `cut-day` agent mock returns pages that differ from the JSON in step
  8 in two or more of three runs, or the run aborts on the mock. Report the
  mock output. The operator then chooses between a recorded replay
  (`mocks/.replay/`, see the plugin-evals documentation) and a different
  case design.
- `claude plugin eval` rejects `type: agent` or `abort_when` in a mock.
- A case that scored 1.00 with the skills scores lower after your change,
  in two full runs.
- A step's verification fails twice after one fix attempt.
- The fix seems to need a change to an out-of-scope file.
- You do not have Claude credentials that can pay for the eval run. Report
  that steps 9 and 10 did not run; do not write `evals/RESULTS.md` by hand.

## Maintenance notes

- Core owns the contract. When core changes `today`, `open_loops` or the
  compact answer again, the same four skills and the two `today` mocks need
  a new look. `scripts/refresh-tools-mock.py --check` (run from a core
  backend checkout; its docstring has the command) shows a description
  change.
- The page limits (three more pages for the brief, four for the sweep) are
  a judgment, not a core limit. Raise them if members with long days report
  cut briefs.
- The `cut-day` mock is the only agent mock in the suite. If its score
  becomes unstable, replace it with a recorded replay.
- The cut-result rules now sit in `ayda-guide` and in two task skills.
  Plan 004 decides the single home for them.
- A reviewer should compare each replaced paragraph with the tool
  descriptions in `evals/mocks/ayda/_tools.json` (`today`, `open_loops`,
  `ask`) and confirm that the skill does not contradict them.
- At the next promotion, the release pull request must raise the plugin
  `version` and add a `CHANGELOG.md` entry that names the four skill
  versions.
