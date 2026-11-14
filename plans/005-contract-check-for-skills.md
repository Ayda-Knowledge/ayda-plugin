# Plan 005: `check-skills.py` fails when a skill names something the Ayda contract does not hold, or has no eval case

> **Record**: DONE and merged. This is history, not live work: read the outcome in the code, the evals and `CONTRIBUTING.md`, and open a new issue for new work. The index is [README](README.md).

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat 66cac1d..HEAD -- scripts/check-skills.py evals/*/prompt.md`
> Expected: `scripts/check-skills.py` unchanged; three new `prompt.md`
> files from plan 002. If `scripts/check-skills.py` changed, compare the
> "Current state" excerpts against the live file before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/002-eval-cases-for-three-skills.md (the eval-tag check fails for three skills without it). Best run after plans 001, 003 and 004, so that the allowlist is written once.
- **Category**: dx
- **Planned at**: commit `66cac1d`, 2026-11-12

## Why this matters

This repository holds skills: Markdown files that tell an agent how to use
a company's Ayda MCP server. The server's contract (tool names, argument
names, result fields) lives in another repository ("core"). A copy of the
tool list is in `evals/mocks/ayda/_tools.json`, and each mock under
`evals/` copies a result shape. A skill names tools and fields in
backticks, for example `` `open_loops` `` or `` `next_cursor` ``.

Nothing checks those names. When core renames a tool or a field, the copy
is refreshed, and the skill keeps the old name until a person reads it.
Also, nothing checks the `AGENTS.md` rule that a skill has an eval case;
three skills had none for months.

`scripts/check-skills.py` already runs in CI on every merge to `dev`. This
plan adds two checks to it:

1. Every name a skill puts in backticks is in the contract copy, in a
   mock, or in a short reviewed list.
2. Every skill has at least one eval case that carries its name as a tag.

The first check is a tripwire, not a proof: it catches a renamed or
removed name, not a field whose meaning changed.

## Current state

### Files

- `scripts/check-skills.py` — 100 lines, Python standard library only. Run
  by CI (`.github/workflows/check.yml`, step "Skill packages") with
  `python3` on `ubuntu-latest`.
- `evals/mocks/ayda/_tools.json` — `{"tools": [{"name", "description",
  "inputSchema"}, …]}`. Fifteen tools.
- `evals/mocks/ayda/*.md` and `evals/<case>/mocks/ayda/*.md` — mock
  results (JSON, or instructions for an agent mock).
- `evals/<case>/prompt.md` — one per eval case, with a frontmatter line
  such as `tags: [daily, safety]`.
- `plugin/skills/<name>/SKILL.md` — seven skills.

### `scripts/check-skills.py` today (the parts you change)

Lines 1–18:

```python
#!/usr/bin/env python3
"""Validate the Ayda plugin's separately versioned portable skills."""

from __future__ import annotations

import re
import sys
from pathlib import Path

EXPECTED = {
    "ayda-daily-brief",
    "ayda-decision-trace",
    "ayda-fact-check",
    "ayda-guide",
    "ayda-loop-sweep",
    "ayda-onboarding",
    "ayda-remember",
}
```

Lines 55–58 and 74–81 (inside `validate`):

```python
def validate(package: Path) -> list[str]:
    errors: list[str] = []
    skill = package / "SKILL.md"
    version = package / "VERSION"
```

```python
    text = skill.read_text(encoding="utf-8").casefold()
    forbidden = ("http://", "https://", "bearer ", "api key", "access token")
    for value in forbidden:
        if value in text:
            errors.append(f"must not contain installation or credential value: {value!r}")
    if "configured `ayda` mcp server" not in text:
        errors.append("must use the configured ayda MCP server")
    return errors
```

Lines 84–96 (`main`):

```python
def main() -> int:
    root = Path(__file__).resolve().parents[1] / "plugin" / "skills"
    found = {path.name for path in root.iterdir() if path.is_dir()}
    failures: list[str] = []
    if found != EXPECTED:
        failures.append(f"skills/ contains {sorted(found)}, expected {sorted(EXPECTED)}")
    for name in sorted(EXPECTED & found):
        failures.extend(f"{name}: {error}" for error in validate(root / name))
    if failures:
        print("\n".join(failures), file=sys.stderr)
        return 1
    print("Portable agent skills passed: " + ", ".join(sorted(EXPECTED)))
    return 0
```

### Code conventions in this file (match them)

- Standard library only. No new dependency, no `yaml` import.
- Type hints on every function; `from __future__ import annotations`.
- A check returns a list of error strings; `main` prints them to stderr,
  one per line, as `<skill name>: <error>`, and returns 1.
- A comment says why, in one or two lines (see the comment above
  `YAML_INDICATORS` in the file).

### The names that the skills use and no mock or tool description holds

Measured at commit `66cac1d`, and checked in core's source. These go into
the reviewed list. Plans 001–004 can add or remove a few; step 4 handles
that.

| Name | What it is | Where core defines it |
|---|---|---|
| `scheduled` | `temporal.status` value | `backend/app/core/graph/temporal.py` |
| `ended_unknown` | `temporal.status` value | `backend/app/core/graph/temporal.py` |
| `uncertain` | `temporal.status` value | `backend/app/core/graph/temporal.py` |
| `not_yet_effective` | `temporal.status` value | `backend/app/core/models/search.py` |
| `not_established` | `temporal.status` value | `backend/app/core/models/search.py` |
| `no_temporal_state` | `temporal.status` value | `backend/app/core/models/search.py` |
| `incomplete` | `temporal.coverage_status` value | `backend/app/core/models/search.py` |
| `partial` | `temporal.coverage_status` value | `backend/app/core/models/search.py` |
| `no_evidence` | `temporal.coverage_status` value | `backend/app/core/models/search.py` |
| `limited` | `temporal.coverage_status` value | `backend/app/core/models/search.py` |
| `source_changed` | `evidence_status` value | `backend/app/core/models/source.py` |
| `invalid citation` | `check.flagged` reason | `backend/app/core/models/search.py` |
| `To-do not found.` | `decide_open_loop` error text | `backend/app/core/query/open_loops.py` |
| `assertions_left_out` | compact-answer key (added by plan 001) | `backend/app/mcp/tools.py` |
| `detail_omitted` | compact-answer key (added by plan 001) | `backend/app/mcp/tools.py` |

### Tags for the nine cases that exist at `66cac1d`

Each `evals/<case>/prompt.md` has a `tags:` line. This plan adds the name
of the skill that the case exercises:

| Case | `tags:` today | `tags:` after |
|---|---|---|
| `as-of-date` | `[guide]` | `[guide, ayda-guide]` |
| `cut-day` | `[daily]` | `[daily, ayda-daily-brief]` |
| `daily-brief` | `[daily]` | `[daily, ayda-daily-brief]` |
| `flagged-claim` | `[guide]` | `[guide, ayda-guide]` |
| `loop-sweep-proposes` | `[daily, safety]` | `[daily, safety, ayda-loop-sweep]` |
| `loop-sweep-records` | `[daily]` | `[daily, ayda-loop-sweep]` |
| `record-text-is-data` | `[safety]` | `[safety, ayda-guide]` |
| `remember-standalone` | `[daily]` | `[daily, ayda-remember]` |
| `source-conflict` | `[guide]` | `[guide, ayda-guide]` |

The three cases from plan 002 already carry `ayda-decision-trace`,
`ayda-fact-check` and `ayda-onboarding`.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Skill packages | `python3 scripts/check-skills.py` | exit 0; prints `Portable agent skills passed: ayda-daily-brief, ayda-decision-trace, ayda-fact-check, ayda-guide, ayda-loop-sweep, ayda-onboarding, ayda-remember` |
| Syntax | `python3 -m py_compile scripts/check-skills.py` | exit 0, no output |
| Plugin manifest | `claude plugin validate plugin --strict` | ends with `✔ Validation passed` |

No eval run is needed: this plan changes no skill text and no grader. A
tag is metadata.

## Scope

**In scope** (the only files you should create or modify):

- `scripts/check-skills.py`
- `scripts/skill-vocabulary.txt` (create)
- The `tags:` line of the nine `evals/<case>/prompt.md` files in the table
  above
- `AGENTS.md` (two sentences, step 6)
- `plans/README.md` (status row)

**Out of scope** (do NOT touch, even though they look related):

- Every `SKILL.md`. If the new check reports a name, the fix is in the
  reviewed list or a STOP, never a reworded skill.
- `evals/mocks/`, graders, and every other line of a `prompt.md`.
- `scripts/refresh-tools-mock.py`, `scripts/eval-compare.sh`,
  `.github/workflows/` — CI already runs `check-skills.py`.
- A test file or a test framework. The repository has none, and this plan
  verifies with probes on a temporary copy (step 5).

## Git workflow

- The repository requires an issue before a branch. Ask the operator for
  the issue number. Create an issue only if the operator tells you to.
- Branch from `dev`: `chore/<issue number>-skill-contract-check`.
- One commit for the tags, one for the check and its list. Message style
  is one short sentence, for example
  `Check each skill's names against the tool contract and its eval tag`.
- Add no AI attribution, co-author line or "generated by" text.
- Do NOT push or open a pull request unless the operator tells you to.

## Steps

### Step 1: Write down how the check can fail (before any code)

The check is wrong if any of these happens. Step 5 probes each one.

1. A skill names a tool that `_tools.json` does not hold, and the check
   passes.
2. A skill names a field that no mock, no tool description and no list
   entry holds, and the check passes.
3. A skill has no eval case with its tag, and the check passes.
4. The check fails on the repository as it is (a false alarm), so people
   learn to ignore it.
5. A dotted name (`check.flagged`), an ID prefix (`project:`) or a phrase
   with a space (`invalid citation`) is reported though it is valid.
6. `_tools.json` or the list file is missing, and the check crashes with a
   traceback and no message that says what to do.

**Verify**: nothing to run. Keep this list open for step 5.

### Step 2: Add the skill tag to the nine cases

Edit the `tags:` line of each `prompt.md` as the table in "Current state"
shows. Change no other line.

**Verify**:
`grep -h "^tags:" evals/*/prompt.md | grep -c "ayda-"` → `12`

### Step 3: Create the reviewed list

Create `scripts/skill-vocabulary.txt` with exactly:

```text
# Names that a skill puts in backticks and that neither a tool description
# in evals/mocks/ayda/_tools.json nor a mock holds. scripts/check-skills.py
# reads this file. One name per line, then " # " and where core defines it.
# Add a name only after you find it in core's source.
scheduled # temporal.status; backend/app/core/graph/temporal.py
ended_unknown # temporal.status; backend/app/core/graph/temporal.py
uncertain # temporal.status; backend/app/core/graph/temporal.py
not_yet_effective # temporal.status; backend/app/core/models/search.py
not_established # temporal.status; backend/app/core/models/search.py
no_temporal_state # temporal.status; backend/app/core/models/search.py
incomplete # temporal.coverage_status; backend/app/core/models/search.py
partial # temporal.coverage_status; backend/app/core/models/search.py
no_evidence # temporal.coverage_status; backend/app/core/models/search.py
limited # temporal.coverage_status; backend/app/core/models/search.py
source_changed # evidence_status; backend/app/core/models/source.py
invalid citation # check.flagged reason; backend/app/core/models/search.py
To-do not found. # decide_open_loop error; backend/app/core/query/open_loops.py
assertions_left_out # compact answer; backend/app/mcp/tools.py
detail_omitted # compact answer; backend/app/mcp/tools.py
```

**Verify**: `grep -vc "^#" scripts/skill-vocabulary.txt` → `15`

### Step 4: Add the two checks to `scripts/check-skills.py`

a. Add `import json` to the imports (alphabetical order: before `import re`).

b. After the `YAML_INDICATORS` line, add:

```python
ROOT = Path(__file__).resolve().parents[1]
TOOLS = ROOT / "evals" / "mocks" / "ayda" / "_tools.json"
REVIEWED = Path(__file__).resolve().parent / "skill-vocabulary.txt"
# A skill names tools, arguments and result fields in backticks. Core owns
# those names; the tool list and the mocks are this repository's copies.
CODE = re.compile(r"`([^`\n]+)`")
WORD = re.compile(r"[A-Za-z_][A-Za-z0-9_]*")
TAGS = re.compile(r"^tags:\s*\[([^\]]*)\]\s*$", re.MULTILINE)
```

c. Add these three functions before `validate`:

```python
def contract_names() -> tuple[set[str], set[str]]:
    """The words the contract copies hold, and the reviewed names."""
    words = set(EXPECTED) | {"ayda"}
    words.update(WORD.findall(TOOLS.read_text(encoding="utf-8")))
    for mock in (ROOT / "evals").glob("**/mocks/ayda/*.md"):
        words.update(WORD.findall(mock.read_text(encoding="utf-8")))
    reviewed = set()
    for line in REVIEWED.read_text(encoding="utf-8").splitlines():
        if line.strip() and not line.startswith("#"):
            reviewed.add(line.split(" # ", 1)[0].strip())
    return words, reviewed


def unknown_names(body: str, words: set[str], reviewed: set[str]) -> list[str]:
    """Backticked names that no contract copy and no reviewed line holds.

    `check.flagged` passes when each part is known, and `project:` when
    `project` is."""
    unknown = []
    for name in sorted(set(CODE.findall(body))):
        if name in reviewed or name in words:
            continue
        parts = [part for part in name.rstrip(":").split(".") if part]
        if parts and all(part in words or part in reviewed for part in parts):
            continue
        unknown.append(name)
    return unknown


def eval_tags() -> set[str]:
    """Every tag that an eval case carries."""
    tags: set[str] = set()
    for prompt in (ROOT / "evals").glob("*/prompt.md"):
        match = TAGS.search(prompt.read_text(encoding="utf-8"))
        if match:
            tags.update(tag.strip() for tag in match.group(1).split(","))
    return tags
```

d. Change `validate` to take the names and report unknown ones. Its
signature becomes:

```python
def validate(package: Path, words: set[str], reviewed: set[str]) -> list[str]:
```

and directly before its final `return errors`, add:

```python
    body = skill.read_text(encoding="utf-8").split("---\n", 2)[-1]
    for name in unknown_names(body, words, reviewed):
        errors.append(
            f"names `{name}`, which no tool, mock or scripts/skill-vocabulary.txt line holds"
        )
```

e. Replace `main` with:

```python
def main() -> int:
    root = ROOT / "plugin" / "skills"
    found = {path.name for path in root.iterdir() if path.is_dir()}
    failures: list[str] = []
    if found != EXPECTED:
        failures.append(f"skills/ contains {sorted(found)}, expected {sorted(EXPECTED)}")
    for needed in (TOOLS, REVIEWED):
        if not needed.is_file():
            print(f"missing {needed.relative_to(ROOT)}: the contract check needs it", file=sys.stderr)
            return 1
    words, reviewed = contract_names()
    tags = eval_tags()
    for name in sorted(EXPECTED & found):
        failures.extend(f"{name}: {error}" for error in validate(root / name, words, reviewed))
        if name not in tags:
            failures.append(f"{name}: no eval case under evals/ has the tag {name!r}")
    if failures:
        print("\n".join(failures), file=sys.stderr)
        return 1
    print("Portable agent skills passed: " + ", ".join(sorted(EXPECTED)))
    return 0
```

f. Run the check on the repository:

```bash
python3 -m py_compile scripts/check-skills.py
python3 scripts/check-skills.py
```

**Verify**: exit 0 and the "Portable agent skills passed" line.

If the check reports names (failure mode 4), handle each one:

- The name is in the table "The names that the skills use…" in "Current
  state" but you mistyped it in the list file: correct the list file.
- The name is one of these, which plans 001–004 can introduce, and it is
  spelled in the skill exactly as here: `topic:`, `decision:`,
  `replaces_decision_id`, `superseded_by`, `expired`, `next_cursor`,
  `response_mode`, `detail`, `compact`, `approximate_dates_records`. Add a
  line for it to `scripts/skill-vocabulary.txt` with the comment
  `# verified at plan time; see plans/005` and continue.
- Any other name: STOP condition.

### Step 5: Probe each failure mode on a temporary copy

Work on a copy so that the repository stays clean:

```bash
probe=$(mktemp -d) && cp -R . "$probe/repo" && cd "$probe/repo"
```

Run each probe, check the result, then undo it with
`git checkout -- .` before the next one.

| # | Probe (in the copy) | Expected |
|---|---|---|
| 1 | Append a line ``Call `open_loop` first.`` to `plugin/skills/ayda-loop-sweep/SKILL.md` | exit 1; stderr has ``ayda-loop-sweep: names `open_loop` `` |
| 2 | Append ``Read `resolved_at_utc`.`` to `plugin/skills/ayda-guide/SKILL.md` | exit 1; stderr has ``ayda-guide: names `resolved_at_utc` `` |
| 3 | Remove `, ayda-remember` from the `tags:` line of `evals/remember-standalone/prompt.md` | exit 1; stderr has `ayda-remember: no eval case` |
| 5 | Append ``See `check.flagged`, `project:` and `invalid citation`.`` to `plugin/skills/ayda-guide/SKILL.md` | exit 0 |
| 6 | `mv scripts/skill-vocabulary.txt /tmp/` (move it back after) | exit 1; stderr starts with `missing scripts/skill-vocabulary.txt`; no traceback |

Probe 4 is step 4f: the unchanged repository passes.

Then leave and remove the copy: `cd - && rm -rf "$probe"`.

**Verify**: all five probes gave the expected result. In the real
repository, `git status --short` shows only your intended changes.

### Step 6: Tell authors about the checks in `AGENTS.md`

In `AGENTS.md`, section "Versions", the second sentence is:

```markdown
A new skill is added to
`EXPECTED` in `scripts/check-skills.py`.
```

Add after it, in the same paragraph:

```markdown
The same check needs an eval case that carries the skill's name as a tag,
and every backticked name in a skill to be in the tool list, a mock, or
`scripts/skill-vocabulary.txt`.
```

Rewrap the paragraph at about 78 characters.

**Verify**: `grep -c "skill-vocabulary.txt" AGENTS.md` → `1`

## Test plan

- The repository has no unit tests and this plan adds none. The check is
  verified by the six failure modes of step 1, each probed in step 5 (and
  4f) on a temporary copy, with an expected exit code and message.
- CI needs no change: `.github/workflows/check.yml` already runs
  `python3 scripts/check-skills.py` on `dev`.

## Done criteria

ALL must hold:

- [ ] `python3 -m py_compile scripts/check-skills.py` exits 0
- [ ] `python3 scripts/check-skills.py` exits 0 and prints the "Portable agent skills passed" line
- [ ] `grep -h "^tags:" evals/*/prompt.md | grep -c "ayda-"` prints `12`
- [ ] `grep -c "^import yaml\|^from yaml" scripts/check-skills.py` prints `0`
- [ ] The five probes of step 5 gave the expected results (list them in your report)
- [ ] `claude plugin validate plugin --strict` ends with `✔ Validation passed`
- [ ] `git status --short` lists only files from the in-scope list
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- `scripts/check-skills.py` does not match the "Current state" excerpts.
- Fewer than twelve `evals/*/prompt.md` files exist. Plan 002 has not
  landed; the tag check would fail for three skills.
- Step 4f reports a name that is in neither list of that step. It can be a
  real drift between a skill and the contract, which is the thing this
  check exists to find. Report the name and the skill; do not add it to
  the reviewed list on your own.
- A probe in step 5 gives a different result after one fix attempt.
- A `prompt.md` has no `tags:` line or a `tags:` value on several lines.
  The `TAGS` pattern reads only the one-line form.

## Maintenance notes

- `scripts/skill-vocabulary.txt` is a reviewed list, so a growing list is
  a smell. A name leaves the list when a mock starts to hold it. When core
  removes a name, remove its line and fix the skill.
- The word set is broad on purpose: it takes every word of every tool
  description and mock, plain English included. A common word such as
  `open` or `limited` can therefore pass by accident. The check finds a
  renamed or removed tool, argument or field; it does not prove that a
  skill reads a field correctly. Eval cases do that.
- After `scripts/refresh-tools-mock.py` rewrites `_tools.json`, run
  `python3 scripts/check-skills.py`. A failure there is the signal that a
  skill needs a new look.
- A stronger form needs core to publish result schemas (`outputSchema`) in
  its tool list; `_tools.json` has none today. That is a request to the
  core repository, outside this plan.
- A reviewer should run probe 1 by hand once and read the error message as
  a new contributor would.
