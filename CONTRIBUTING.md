# Contributing

Thank you for helping Ayda's skills get better. This file tells you how to
propose a change and what a change must pass.

## Propose a change

- **A new skill:** open an issue with the **Skill idea** form first. Say what
  the member asks for, which Ayda tools the skill combines, and why one tool
  call is not enough.
- **A fix:** open a pull request. Say which skill it changes and show the
  behaviour before and after, for example a short transcript.

## Pull requests and issues from the command line

The local template owns a record's sections:
[`.github/pull_request_template.md`](.github/pull_request_template.md) for a
pull request, the matching form in [`.github/ISSUE_TEMPLATE/`](.github/ISSUE_TEMPLATE/)
for an issue. GitHub applies a template only in the browser. `gh` and the API
apply none, so the author fills it in.

1. Read the template. For an issue form, write each field `label` as a `##`
   heading, in the form's order, and pass the form's `labels` with `--label`.
2. Write the body to a temporary file outside the checkout. Fill each section
   with what happened: the commands that ran, their results, and each check
   that did not run. A section with nothing to report says `None`. This
   repository is public: remove company data first.
3. Create or edit the record from that file, with an explicit repository and
   base:

   ```bash
   gh pr create -R Ayda-Knowledge/ayda-plugin --base main --title "<title>" --body-file <path>
   gh pr edit <number> -R Ayda-Knowledge/ayda-plugin --body-file <path>
   gh issue create -R Ayda-Knowledge/ayda-plugin --title "<title>" --label <label> --body-file <path>
   ```

4. Read the record back:

   ```bash
   gh pr view <number> -R Ayda-Knowledge/ayda-plugin --json title,body,baseRefName,url
   gh issue view <number> -R Ayda-Knowledge/ayda-plugin --json title,body,labels,url
   ```

**Done:** the readback shows the intended repository and base, every template
section, and evidence in place of each template comment.

## Write a skill

[AGENTS.md](AGENTS.md) holds the rules for a skill in this repository. In
short:

- One folder per skill under `plugin/skills/`, with a `SKILL.md` and a `VERSION`.
- The frontmatter holds only `name` (the folder name) and `description`.
- A skill names the configured `ayda` MCP server and holds no installation
  URL, company name or credential.
- Each step ends on a clear completion criterion.
- A skill writes to Ayda only on the member's own words.

## Check your change

```bash
python3 scripts/check-skills.py
claude plugin validate plugin --strict
claude plugin validate . --strict
```

CI runs the package and manifest checks when a PR is ready for review, and
on later updates to that ready PR. Draft updates start no runner. A newer
PR run cancels the older run. The main-branch check remains the release
validation for the complete plugin; model evaluations stay outside routine CI.

Run the relevant local check while you edit and record its result in the PR.
Do not repeat all checks for each checkpoint push. Group related completed
changes into one plugin release; a merge alone does not require a version bump.


A change to a skill's behaviour also needs its eval. Add or update a case
under `evals/` (a `prompt.md` and its `graders/`), then run the comparison.
It calls the model with your own Claude credentials:

```bash
scripts/eval-compare.sh            # RUNS=3 and MODEL=claude-sonnet-5-5 by default
```

Commit the updated `evals/RESULTS.md` with the change.

## Release

Raise the skill's `VERSION` when its behaviour changes, raise `version` in
`plugin/.claude-plugin/plugin.json`, and add an entry to [CHANGELOG.md](CHANGELOG.md).
