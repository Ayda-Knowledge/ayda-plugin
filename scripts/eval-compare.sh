#!/usr/bin/env bash
# Score the eval suite twice against the same mocked Ayda server: once with the
# plugin's skills, once with only its MCP connection. The difference is what
# the skills add. Writes plugin/evals/RESULTS.md.
#
# The built-in no-plugin baseline cannot measure this: without the plugin there
# is no Ayda server at all, so every case fails for a reason the skills do not
# cause.
set -euo pipefail

root=$(cd "$(dirname "$0")/../plugin" && pwd)
runs=${RUNS:-3}
model=${MODEL:-claude-sonnet-5-5}
# The default small judge misreads long, nuanced replies; the docs advise a stronger one.
judge=${JUDGE:-sonnet}
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

mkdir -p "$work/ayda"
cp -R "$root/.claude-plugin" "$root/evals" "$work/ayda/"
rm -rf "$work/ayda/evals/results"

score() {
  # A case below threshold exits 1; the scores are the point, so carry on.
  claude plugin eval "$1" --ablation none --runs "$runs" --model "$model" --judge-model "$judge" \
    -j 4 --trust-plugin --no-publish --json "$2" || true
}

score "$root" "$work/with.json"
score "$work/ayda" "$work/without.json"

python3 - "$work/with.json" "$work/without.json" "$root/evals/RESULTS.md" "$model" "$runs" "$judge" <<'PY'
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
