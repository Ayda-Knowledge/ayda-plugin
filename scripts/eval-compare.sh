#!/usr/bin/env bash
# Score the eval suite twice against the same mocked Ayda server: once with the
# plugin's skills, once with the Ayda connection alone. The difference is what
# the skills add. Writes evals/RESULTS.md.
#
# The mock stands in for the member's own `ayda` server, which the plugin does
# not declare, so both arms get it and graders name its tools `mcp__ayda__*`.
set -euo pipefail

repo=$(cd "$(dirname "$0")/.." && pwd)
runs=${RUNS:-3}
model=${MODEL:-claude-sonnet-5-5}
# The default small judge misreads long, nuanced replies; the docs advise a stronger one.
judge=${JUDGE:-sonnet}
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

# The suite lives outside plugin/ so the Claude directory never scans its
# fixtures; each arm gets its own plugin copy with the suite inside.
for arm in with without; do
  mkdir -p "$work/$arm"
  cp -R "$repo/plugin/." "$work/$arm/"
  cp -R "$repo/evals" "$work/$arm/evals"
  rm -rf "$work/$arm/evals/results"
done
rm -rf "$work/without/skills"

score() {
  # A case below threshold exits 1; the scores are the point, so carry on.
  claude plugin eval "$1" --ablation none --runs "$runs" --model "$model" --judge-model "$judge" \
    -j 4 --trust-plugin --no-publish --json "$2" || true
}

score "$work/with" "$work/with.json"
score "$work/without" "$work/without.json"
mkdir -p "$repo/evals/results"
cp -R "$work/with/evals/results/." "$repo/evals/results/" 2>/dev/null || true

python3 - "$work/with.json" "$work/without.json" "$repo/evals/RESULTS.md" "$model" "$runs" "$judge" <<'PY'
import json, sys
from datetime import date

with_, without, out, model, runs, judge = sys.argv[1:]
a, b = json.load(open(with_)), json.load(open(without))
base = {c["name"]: c["aggregates"]["score"] for c in b["cases"]}
rows = [
    f"| `{c['name']}` | {c['aggregates']['score']:.2f} | {base.get(c['name'], 0):.2f} "
    f"| {c['aggregates']['score'] - base.get(c['name'], 0):+.2f} |"
    for c in a["cases"]
]
sa, sb = a["aggregates"]["overallScore"], b["aggregates"]["overallScore"]
text = f"""# Eval results

What the skills add on top of the Ayda connection alone. Both arms use the
same cases, the same mocked Ayda server (`evals/mocks/`, with the server's real
tool descriptions) and the same model. Produced by `scripts/eval-compare.sh`.

| Case | With skills | Ayda alone | Difference |
| --- | --- | --- | --- |
{chr(10).join(rows)}
| **Overall** | **{sa:.2f}** | **{sb:.2f}** | **{sa - sb:+.2f}** |

A case with no difference covers behaviour the server's own tool descriptions
already produce; it stays in the suite to catch a regression in either.

- Date: {date.today().isoformat()}
- Agent model: `{model}`; judge: `{judge}`
- Runs per case per arm: {runs}
- Claude Code: {a.get("claudeVersion", "unknown")}
- Cost: ${a["costUsd"] + b["costUsd"]:.2f}
{"- **Partial run:** a cost or credential limit stopped it early." if a.get("partial") or b.get("partial") else ""}
"""
open(out, "w").write(text)
print(text)
PY
