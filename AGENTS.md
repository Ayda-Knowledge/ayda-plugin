# AGENTS.md

This repository is the Ayda plugin: portable skills that teach an agent to use
a company's Ayda MCP server well, plus the plugin and marketplace manifests
that connect that server. `plugin/` holds only what Claude installs;
repository tooling stays outside it, because the Claude directory scans every
file in the plugin folder. The server itself, its tools and their contracts
live in the Ayda product repository; this repository only instructs agents.

## Writing a skill

- A skill caches what the Ayda tool descriptions leave out: cost, how tools
  combine, how to read results, and trust. Routing a question to a tool is
  the descriptions' job; a skill that repeats them drifts when they change.
- Every skill runs at any company, in any harness. It names the configured
  `ayda` MCP server and holds no installation URL, company value or
  credential.
- Frontmatter holds `name` (the folder name) and `description`, nothing else,
  so the skill loads in harnesses beyond Claude.
- Every step ends on a completion criterion. The two writes,
  `decide_open_loop` and `remember`, run only on the member's own words.
- Prove a new step against a live Ayda before shipping it: the tool's real
  result shape beats its documentation. Then give it an eval case under
  `plugin/evals/`, with fixtures from a fictional company: this repository is
  public, so no real record goes into a mock.
- Grade behaviour, not skill invocation: `scripts/eval-compare.sh` scores the
  same cases without the skills, and only behaviour graders compare fairly.

## Versions

Bump a skill's `VERSION` when its behaviour changes, and the plugin
`version` in `plugin/.claude-plugin/plugin.json` on every release. A new skill is
added to `EXPECTED` in `scripts/check-skills.py`.

## Check

```bash
python3 scripts/check-skills.py
claude plugin validate plugin --strict
claude plugin validate . --strict
```
