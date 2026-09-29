![Ayda for Claude: your company's own knowledge, with a citation on every answer](assets/social-preview.png)

# Ayda for Claude

[![Licence: MIT](https://img.shields.io/badge/licence-MIT-6A00E9)](LICENSE)
[![Plugin version](https://img.shields.io/badge/plugin-1.0.0-6A00E9)](CHANGELOG.md)
[![Skills](https://img.shields.io/badge/skills-7-2AB7FF)](#skills)

[Ayda](https://aydahq.com) is company memory that your company owns and runs.
It reads the sources your company connects, such as Slack, Google Drive,
Gmail and GitHub, and answers with a citation for each statement.

This plugin connects Claude to your company's own Ayda installation. It also
adds skills that make Claude use Ayda well: fewer calls, a citation on each
statement, and the correct date for each fact.

## Skills

**Every day**

| Skill | What it does |
| --- | --- |
| `ayda-daily-brief` | Starts your day: what changed, what you owe, what others owe you, and what looks done. |
| `ayda-loop-sweep` | Goes through your open loops in small batches and records your verdict on each. |
| `ayda-remember` | Keeps the decisions and commitments from a conversation as your own Ayda memories. |

**When you need an answer you can trust**

| Skill | What it does |
| --- | --- |
| `ayda-decision-trace` | Shows how and why a decision was made, and how it changed, with citations. |
| `ayda-fact-check` | Checks a plan, document or change against recorded company facts. |
| `ayda-onboarding` | Writes a cited brief on a role, team or project, with a reading list. |
| `ayda-guide` | Holds the rules the other skills use: call cost, dates, conflicts between sources, and citations. |

Claude selects a skill when your request fits it. In Claude Code you can also
start one by name, for example `/ayda:ayda-daily-brief`.

## Try it

- "Catch me up on what I missed yesterday."
- "Which of my open loops look done? Let's clear them."
- "Why did we change payment providers, and when did that happen?"
- "Check this proposal against what we agreed with the client."
- "Remember that we chose the Q4 pricing on the 12 October call."

## How it works

```mermaid
flowchart LR
  you([You]) --> claude[Claude + Ayda skills]
  claude -->|MCP, signed in as you| ayda[Your Ayda installation]
  ayda --> sources[(Slack, Drive, Gmail, GitHub and more)]
```

- Ayda runs in your company's own environment. The plugin connects to the
  host you give it and to nothing else.
- You sign in with your company account. Ayda answers as you and shows only
  the records you have access to.
- Each answer comes with its sources, so you can open the record behind each
  statement.

## Install

You need a company Ayda installation with **Agent access** switched on by an
admin, and its host name, for example `ayda.example.com`. If you do not know
the host name, ask your Ayda admin.

**Claude Code**

```text
/plugin marketplace add Ayda-Knowledge/ayda-plugin
/plugin install ayda@ayda
```

Enter your installation's host name when the plugin asks for it. Claude opens
a sign-in page the first time it calls Ayda.

**Other agents**

The skills are plain `SKILL.md` folders. Copy the folders under
[`skills/`](skills/) to your agent's skills directory, then connect your Ayda
MCP server in that agent. Ayda's **Connect Your Agent** page shows how for
each agent.

## Data and privacy

The plugin sends your questions to your company's own Ayda installation, at
the host you enter. It sends nothing to Ubundi or to any other service.

Ayda can change only two things, and only after you say so:

- `ayda-loop-sweep` records your verdict (open, done or dismissed) on one of
  your own open loops.
- `ayda-remember` stores a sentence you approve as your own memory record.
  Ayda keeps the decisions it reads from that sentence pending until you
  confirm them in Ayda.

No skill writes to Slack, Google Drive, Gmail, GitHub or another source.

## Contributing

Ideas for new skills and fixes are welcome. Read
[CONTRIBUTING.md](CONTRIBUTING.md) first. To report a security problem, read
[SECURITY.md](SECURITY.md).

## Licence

[MIT](LICENSE) © 2026 Ubundi
