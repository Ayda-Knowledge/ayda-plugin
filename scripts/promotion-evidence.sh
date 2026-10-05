#!/usr/bin/env bash
# Prove that a candidate commit may be promoted into main.
#
#   REPO=<owner>/<name> GH_TOKEN=... promotion-evidence.sh <candidate-sha> <main-sha>
#
# It reads Git objects and the GitHub API only, so it never runs candidate
# code. The caller fetches origin/dev and both commits first. The Promotion
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

git merge-base --is-ancestor "$candidate" origin/dev ||
  refuse "candidate ${candidate:0:8} is not on dev."
git merge-base --is-ancestor "$main" "$candidate" ||
  refuse "main ${main:0:8} is not an ancestor of the candidate. Merge main back into dev, wait for its full validation, and promote that commit."

tree=$(git rev-parse "$candidate^{tree}")
merged=$(git merge-tree --write-tree "$main" "$candidate") ||
  refuse "the candidate does not merge cleanly into main."
[ "$merged" = "$tree" ] ||
  refuse "the merge into main gives tree ${merged:0:8}, not the tested tree ${tree:0:8}."

# A full validation is a Check run on dev for exactly this commit, started by a
# push or a dispatch, in which every required job itself succeeded. A skipped,
# cancelled or missing job is not a success.
runs=$(gh api "repos/$REPO/actions/workflows/check.yml/runs?head_sha=$candidate&branch=dev&status=success&per_page=100" |
  jq -r --arg sha "$candidate" --arg repo "$REPO" '.workflow_runs[]
    | select(.head_sha == $sha and .head_branch == "dev" and .conclusion == "success")
    | select(.event == "push" or .event == "workflow_dispatch")
    | select(.head_repository.full_name == $repo and .path == ".github/workflows/check.yml")
    | .id')
for run in $runs; do
  missing=$(gh api "repos/$REPO/actions/runs/$run/jobs?filter=latest&per_page=100" |
    jq -r --argjson required "$required" \
      '$required - [.jobs[] | select(.conclusion == "success") | .name] | join(", ")')
  if [ -z "$missing" ]; then
    printf 'Promotion evidence\n\n'
    printf -- '- Candidate: %s\n- Candidate tree: %s\n- Main: %s\n- Full validation: https://github.com/%s/actions/runs/%s\n' \
      "$candidate" "$tree" "$main" "$REPO" "$run"
    exit 0
  fi
done
refuse "no full validation on dev succeeded for candidate ${candidate:0:8}. Each of these jobs must succeed in one Check run started by a push or a dispatch on dev: $(jq -r 'join(", ")' <<<"$required")."
