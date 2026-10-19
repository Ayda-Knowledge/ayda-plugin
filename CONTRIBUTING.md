# Contributing

Thank you for helping Ayda's skills get better. This file tells you how to
propose a change and what a change must pass.

## Propose a change

Each defect and each planned change has an issue before its branch. Open the
issue also when you fix the defect at once, and when you find it during other
work.

| You have | Use the form | Say |
| :-- | :-- | :-- |
| A defect: a skill did the wrong thing, or the agent did not use it | **Skill problem** | What you asked, the expected and the actual behaviour, and the shortest steps that show it |
| A change to a skill that exists, or to the mod | **Change request** | The problem, the desired outcome, and acceptance criteria that a reader can check |
| A new skill | **Skill idea** | What the member asks for, which Ayda tools the skill combines, and why one tool call is not enough |

Then open a pull request against `dev` ("Branches" below). Its Related work
section links the issue with `Closes #<number>`.

These pull requests need no issue: a promotion, a back-merge, a Dependabot
update, and a correction to a document. Such a pull request says
`No issue: <reason>` in Related work.

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
   gh pr create -R Ayda-Knowledge/ayda-plugin --base dev --title "<title>" --body-file <path>
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

A pull request starts no CI run. CI runs the package and manifest checks on
`dev` after each merge, and `main` takes only a commit whose run passed
("Branches" below). Model evaluations stay outside routine CI.

Run the relevant local check while you edit and record its result in the PR.
Do not repeat all checks for each checkpoint push.

A change to a skill's behaviour also needs its eval. Add or update a case
under `evals/` (a `prompt.md` and its `graders/`), then run the comparison.
It calls the model with your own Claude credentials:

```bash
scripts/eval-compare.sh            # RUNS=3 and MODEL=claude-sonnet-5-5 by default
```

Commit the updated `evals/RESULTS.md` with the change.

## Branches

Work merges into `dev` through a pull request from a short branch. No person
pushes to `dev` or `main`: GitHub refuses the push. One branch holds one
related change, starts from `dev`, and has one of these prefixes:

| Prefix | Use |
| :-- | :-- |
| `feature/` | New behaviour |
| `bugfix/` | A defect fix |
| `docs/` | Documents and records |
| `chore/` | Maintenance with no behaviour change, for example a back-merge |
| `promotion/` | A frozen `dev` commit on its way to `main` |
| `hotfix/` | One urgent fix from `main`'s head |

A pull request starts no CI run: record the checks you ran in it. It needs no
approval: its author merges it when its checks pass, the template holds the
evidence, and it has no conflict. Merge with a merge commit. GitHub refuses a
squash merge and a rebase merge, and deletes the merged branch: delete your
local branch too.

```bash
gh pr merge <number> -R Ayda-Knowledge/ayda-plugin --merge
```

The default branch is `main`, so `Closes #<number>` does not close the issue
at a merge into `dev`. The person who merges closes the issue with a link to
the pull request:

```bash
gh issue close <issue> -R Ayda-Knowledge/ayda-plugin --comment "Merged into dev: <pull request URL>"
```

The Check workflow runs on `dev` after each merge. Read the run for your merge;
whoever merged the cause of a red run fixes or reverts it through a pull
request.

`main` is the released branch. It takes a commit of `dev` by promotion, or one urgent
fix by a hotfix ("Hotfixes" below). The required **Promotion evidence**
check proves a promoted commit: it is on `dev`, `main` is its ancestor, and
its Check run passed.

An install reads `main`, so in this repository the promotion is the release:
"Release" below says what a promotion needs on `dev` first.

1. Read the run for the commit you will promote. The script prints the
   candidate, its tree, `main` and the run URL when the commit can be promoted:

   ```bash
   git fetch origin
   sha=$(git rev-parse origin/dev)
   REPO=Ayda-Knowledge/ayda-plugin bash scripts/promotion-evidence.sh "$sha" origin/main
   ```

2. Freeze the commit on a branch and open the pull request into `main`. Put
   the script's lines in its Verification section:

   ```bash
   git push origin "${sha}:refs/heads/promotion/${sha:0:8}"
   gh pr create -R Ayda-Knowledge/ayda-plugin --base main --head "promotion/${sha:0:8}" \
     --title "Promote ${sha:0:8} to main" --body-file <path>
   gh pr checks <number> -R Ayda-Knowledge/ayda-plugin --required --watch
   gh pr merge <number> -R Ayda-Knowledge/ayda-plugin --merge
   ```

3. Merge `main` back into `dev` through a pull request from a
   `chore/back-merge-<short sha>` branch, named for `main`'s new head. The
   promotion's merge commit exists only on `main`, and the next promotion is
   refused until `dev` contains it:

   ```bash
   git fetch origin
   main_sha=$(git rev-parse origin/main)
   git switch -c "chore/back-merge-${main_sha:0:8}" origin/dev
   git merge --no-ff origin/main
   git push -u origin "chore/back-merge-${main_sha:0:8}"
   gh pr create -R Ayda-Knowledge/ayda-plugin --base dev --title "Merge main back into dev" --body-file <path>
   ```

**Done:** `main`'s tree equals the promoted commit's tree, and `dev` contains
`main`.

## Hotfixes

Use a hotfix when a fix must reach `main` without the unreleased work on
`dev`. The Promotion evidence check accepts a commit that is not on `dev`
when the Check run passed for it on a `hotfix/` branch. A fix that can wait
goes through `dev` and a promotion.

1. Branch from `main`'s head and make the fix. A hotfix has no pull request
   into `dev` first, so the same branch holds the release changes ("Release"
   below). Then push:

   ```bash
   git fetch origin
   git switch -c hotfix/<name> origin/main
   git push -u origin hotfix/<name>
   ```

2. A pull request starts no run, so dispatch the check on the branch and wait
   for it to pass. A later commit needs a new run:

   ```bash
   gh workflow run check.yml -R Ayda-Knowledge/ayda-plugin --ref hotfix/<name>
   gh run watch -R Ayda-Knowledge/ayda-plugin
   ```

3. Open the pull request into `main`, wait for Promotion evidence, and merge:

   ```bash
   gh pr create -R Ayda-Knowledge/ayda-plugin --base main --head hotfix/<name> \
     --title "<title>" --body-file <path>
   gh pr checks <number> -R Ayda-Knowledge/ayda-plugin --required --watch
   gh pr merge <number> -R Ayda-Knowledge/ayda-plugin --merge
   ```

4. Merge `main` back into `dev` through a pull request from a
   `chore/back-merge-<short sha>` branch, as in step 3 of "Branches".

**Done:** the fix is on `main`, and `dev` contains `main`.

## Release

Raise a skill's `VERSION` in the pull request that changes its behaviour.

A promotion or a hotfix that changes a file under `plugin/` changes what an
install gets. It needs two changes:

- a higher `version` in `plugin/.claude-plugin/plugin.json`;
- an entry in [CHANGELOG.md](CHANGELOG.md) for that version, with its date and
  what changes for a person who installs the plugin.

For a promotion, make them in one pull request into `dev` before step 1 of
"Branches", and promote a commit that contains it. Group related completed
changes into one release: a merge into `dev` alone needs no version change.
For a hotfix, make them on the `hotfix/` branch with the fix. A promotion that
changes only files outside `plugin/` needs neither.

**Done:** when `plugin/` changed, `version` on `main` is higher than before,
and `CHANGELOG.md` on `main` has its entry.
