---
name: ayda-onboarding
description: Build a bounded role or project onboarding brief from cited Ayda evidence. Use when a person needs context on a team, role, project, current work, or important prior decisions.
---

# Build an onboarding brief with Ayda

Use the configured `ayda` MCP server, and the `ayda-guide` skill for call
cost and how to cite. The brief covers one scope: one role, team or
project, over one period. Ask for the scope or the period when the
request gives neither.

1. **Open the scope.** Call `research_brief` once on the scope. When the
   project has its own folder, pass `folder_contains` to every later call.
   Done when you hold the brief's summary and its citations.
2. **Fill the thin parts.** `search` for whichever of these the brief
   leaves thin: goals, vocabulary, current work, key decisions. Use at most
   four searches. Done when each of the four has evidence or is marked as
   not found.
3. **Name the people.** Call `find_person` for each collaborator or role
   holder that the evidence names, at most five. Give a person only the
   role or responsibility that a record states. Done when each person has
   a stated role with its record, or is listed by name only.
4. **Fix the current state.** When current milestones matter, call
   `timeline` for the last two weeks of the period. Read with `get_record`
   the records, at most three, that a newcomer must read first. Build the
   reading list from the cited records, or with `list_records` when the
   project has its own folder. Done when you hold the latest dated events
   and a reading list of at most seven records.
5. **Write the brief**, compact, with these parts: purpose, current state,
   key decisions, people, unresolved work, reading list. Cite each
   material statement. Put each open question and each disagreement under
   unresolved work, as the records state it.

The brief is done when it stays inside the scope, each material fact has a
citation, and each unresolved question stands apart from the confirmed
facts.
