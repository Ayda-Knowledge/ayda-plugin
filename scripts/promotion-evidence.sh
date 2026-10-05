#!/usr/bin/env bash
# Prove that a candidate commit may be promoted into main.
#
#   REPO=<owner>/<name> GH_TOKEN=... promotion-evidence.sh <candidate-sha> <main-sha>
#
# The candidate is a commit of dev whose Check run passed, or a hotfix: a
# commit on main's head whose run passed on its hotfix/ branch. It reads Git
# objects and the GitHub API only, so it never runs candidate code. The caller
# fetches origin/dev and both commits first. The Promotion
# workflow runs this file from main, the pull request base.
set -euo pipefail

candidate=${1:?usage: promotion-evidence.sh <candidate-sha> <main-sha>}
main=${2:?usage: promotion-evidence.sh <candidate-sha> <main-sha>}
: "${REPO:?set REPO to <owner>/<name>}"
required='["check"]'

refuse() { echo "Promotion refused: $*" >&2; exit 1; }

git cat-file -e "$candidate^{commit}" 2>/dev/null || refuse "$candidate is not a commit in this repository."
git cat-file -e "$main^{commit}" 2>/dev/null || refuse "$main is not a commit in this repository."
candidate=$(git rev-parse "$candidate^{commit}")
main=$(git rev-parse "$main^{commit}")

git merge-base --is-ancestor "$main" "$candidate" ||
  refuse "main ${main:0:8} is not an ancestor of the candidate. From dev: merge main back into dev, wait for its full validation, and promote that commit. For a hotfix: branch from main's head."

tree=$(git rev-parse "$candidate^{tree}")
merged=$(git merge-tree --write-tree "$main" "$candidate") ||
  refuse "the candidate does not merge cleanly into main."
[ "$merged" = "$tree" ] ||
  refuse "the merge into main gives tree ${merged:0:8}, not the tested tree ${tree:0:8}."

# A full validation is a Check run for exactly this commit in which every
# required job itself succeeded. A skipped, cancelled or missing job is not a
# success. Two sources count:
#   - dev: a run on dev started by a push or a dispatch, for a commit of dev.
#   - a hotfix: a dispatched run on a hotfix/ branch. The commit need not be
#     on dev, so one fix can reach main without the unreleased work there.
on_dev=false
git merge-base --is-ancestor "$candidate" origin/dev && on_dev=true
runs=$(gh api "repos/$REPO/actions/workflows/check.yml/runs?head_sha=$candidate&status=success&per_page=100" |
  jq -r --arg sha "$candidate" --arg repo "$REPO" '.workflow_runs[]
    | select(.head_sha == $sha and .conclusion == "success")
    | select(.head_repository.full_name == $repo and .path == ".github/workflows/check.yml")
    | select((.head_branch == "dev" and (.event == "push" or .event == "workflow_dispatch"))
             or ((.head_branch | startswith("hotfix/")) and .event == "workflow_dispatch"))
    | "\(.id) \(.head_branch)"')
while read -r run branch; do
  [ -n "$run" ] || continue
  if [ "$branch" = dev ] && [ "$on_dev" = false ]; then continue; fi
  missing=$(gh api "repos/$REPO/actions/runs/$run/jobs?filter=latest&per_page=100" |
    jq -r --argjson required "$required" \
      '$required - [.jobs[] | select(.conclusion == "success") | .name] | join(", ")')
  if [ -z "$missing" ]; then
    printf 'Promotion evidence\n\n'
    printf -- '- Candidate: %s\n- Candidate tree: %s\n- Main: %s\n- Validated on: %s\n- Full validation: https://github.com/%s/actions/runs/%s\n' \
      "$candidate" "$tree" "$main" "$branch" "$REPO" "$run"
    exit 0
  fi
done <<<"$runs"
jobs=$(jq -r 'join(", ")' <<<"$required")
if [ "$on_dev" = true ]; then
  refuse "no full validation on dev succeeded for candidate ${candidate:0:8}. Each of these jobs must succeed in one Check run started by a push or a dispatch on dev: $jobs."
fi
refuse "candidate ${candidate:0:8} is not on dev and has no hotfix validation. A hotfix needs a dispatched Check run on its hotfix/ branch in which each of these jobs succeeds: $jobs."
