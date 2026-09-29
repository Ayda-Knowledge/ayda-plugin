# Ayda plugin

Ayda is company memory that your company owns and runs. This plugin connects
Claude to your company's own Ayda installation and adds skills that make an
agent use it well: fewer calls, correct citations, and correct dates.

## What you need

- A company Ayda installation with **Agent access** switched on by an admin.
- The installation's host name, for example `ayda.example.com`. The plugin
  asks for it when you install it.

When you first use the plugin, you sign in with your company account. Ayda
answers as you: it shows only the records you have access to.

## Skills

| Skill | Use it to |
| --- | --- |
| `ayda-guide` | Combine Ayda's tools with few calls and read dates, conflicts and citations correctly. The other skills rely on it. |
| `ayda-daily-brief` | Start the day: what changed, what you owe, what others owe you, and what looks done. |
| `ayda-loop-sweep` | Go through your open loops and record your verdict on each. |
| `ayda-remember` | Keep decisions and commitments from a conversation as your own Ayda memories. |
| `ayda-decision-trace` | Show how and why a company decision was made, with citations. |
| `ayda-fact-check` | Check a plan, document or change against recorded company facts. |
| `ayda-onboarding` | Get a cited brief on a role, team or project. |

## What data the plugin sends

The plugin sends your questions to your company's own Ayda installation, at
the host you enter. It sends nothing to Ubundi. Ayda sends back records from
your company's connected sources that you have access to.

Two skills can write, and only after you say so:

- `ayda-loop-sweep` records your verdict (open, done, dismissed) on one of
  your own open loops.
- `ayda-remember` stores a sentence you approve as your own memory record.
  Ayda keeps the decisions it reads from that sentence pending until you
  confirm them in Ayda.

Neither skill writes to Slack, Google Drive, Gmail, GitHub or another source.

## Install

In Claude Code:

```text
/plugin marketplace add Ayda-Knowledge/ayda-plugin
/plugin install ayda@ayda
```

Enter your installation's host name when the plugin asks for it, then sign
in when Claude first calls Ayda.

The skills also work in other agents that read `SKILL.md` folders. Copy the
folders under `skills/` and connect your Ayda MCP server in that agent.

## Versions

Each skill has its own `VERSION` file. The plugin version is in
`.claude-plugin/plugin.json`. `python3 scripts/check-skills.py` audits every
skill.
