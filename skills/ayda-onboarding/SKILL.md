---
name: ayda-onboarding
description: Build a bounded role or project onboarding brief from cited Ayda evidence. Use when a person needs context on a team, role, project, current work, or important prior decisions.
---

# Build an onboarding brief with Ayda

Use the configured `ayda` MCP server. Ask for one role, team, or project and a
useful time horizon when the request does not supply them.

1. Open with one `research_brief` on the scope. Use `search` for the goals,
   vocabulary, current work, and key decisions the brief leaves thin. When the
   project has its own folder, pass `folder_contains` to every call and build
   the reading list with `list_records`.
2. Use `find_person` only for named collaborators or role holders. Do not infer
   expertise, influence, or reporting lines from co-occurrence.
3. Use `timeline` for a bounded recent window when current milestones matter.
   Use `get_record` for the few records that anchor essential context.
4. Write a compact brief with purpose, current state, key decisions, people,
   unresolved work, and a short reading list. Cite each material statement
   with its Ayda record ID or returned source link.

Preserve uncertainty and disagreement. An empty result does not prove absence.
Do not mention or infer evidence outside the signed-in member's access.

Complete when the brief stays within the requested scope, each material fact
has a citation, and unresolved questions are distinct from confirmed facts.
