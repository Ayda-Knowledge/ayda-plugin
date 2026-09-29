# Contributing

Thank you for helping Ayda's skills get better. This file tells you how to
propose a change and what a change must pass.

## Propose a change

- **A new skill:** open an issue with the **Skill idea** form first. Say what
  the member asks for, which Ayda tools the skill combines, and why one tool
  call is not enough.
- **A fix:** open a pull request. Say which skill it changes and show the
  behaviour before and after, for example a short transcript.

## Write a skill

[AGENTS.md](AGENTS.md) holds the rules for a skill in this repository. In
short:

- One folder per skill under `skills/`, with a `SKILL.md` and a `VERSION`.
- The frontmatter holds only `name` (the folder name) and `description`.
- A skill names the configured `ayda` MCP server and holds no installation
  URL, company name or credential.
- Each step ends on a clear completion criterion.
- A skill writes to Ayda only on the member's own words.

## Check your change

```bash
python3 scripts/check-skills.py
claude plugin validate . --strict
```

CI runs the same two checks on every pull request.

A change to a skill's behaviour also needs its eval. Add or update a case
under `evals/` (a `prompt.md` and its `graders/`), then run the comparison.
It calls the model with your own Claude credentials:

```bash
scripts/eval-compare.sh            # RUNS=3 and MODEL=claude-sonnet-5-5 by default
```

Commit the updated `evals/RESULTS.md` with the change.

## Release

Raise the skill's `VERSION` when its behaviour changes, raise `version` in
`.claude-plugin/plugin.json`, and add an entry to [CHANGELOG.md](CHANGELOG.md).
