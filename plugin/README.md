# Ayda for Claude

Ayda is company memory that your company owns and runs. It reads the sources
your company connects, such as Slack, Google Drive, Gmail and GitHub, and
answers with a citation for each statement. This plugin connects Claude to
your company's own Ayda installation and adds skills that make Claude use it
well: fewer calls, a citation on each statement, and the correct date for each
fact.

## Skills

- `ayda-daily-brief`: starts your day with what changed, what you owe, what
  others owe you, and what looks done.
- `ayda-loop-sweep`: goes through your open loops and records your verdict on
  each.
- `ayda-remember`: keeps a decision or commitment as your own Ayda memory.
- `ayda-decision-trace`: shows how and why a decision was made, with
  citations.
- `ayda-fact-check`: checks a plan or document against recorded company
  facts.
- `ayda-onboarding`: writes a cited brief on a role, team or project.
- `ayda-guide`: the rules the other skills use for cost, dates, conflicts
  between sources, and citations.

## Use it

Your company needs an Ayda installation with **Agent access** switched on.
In Claude Code, the plugin asks for your installation's host name. In the
Claude apps, use your organisation's Ayda connector, or connect the plugin's
connector and replace the part in braces with your host. Then ask, for
example, "Catch me up on what I missed yesterday."

## Data

The plugin sends your questions only to your company's own Ayda installation,
signed in as you. It sends nothing to Ubundi or any other service. It writes
only your own open-loop verdicts and the memory sentences you approve.
[PRIVACY.md](https://github.com/Ayda-Knowledge/ayda-plugin/blob/main/PRIVACY.md)
has the details.
