---
name: ayda-decision-trace
description: Reconstruct a company decision from cited Ayda evidence. Use when asked why a decision was made, how it changed, who contributed, or which implementation followed it.
---

# Trace a decision with Ayda

Use the configured `ayda` MCP server, and the `ayda-guide` skill for the
time fields and the answer check. The signed-in member's access controls
the evidence. An empty result does not prove that no other evidence exists.

1. Open with one `ask` for the current decision and its stated reason; its
   citations seed the trace. When the question is how the decision changed,
   ask again with `effective_at` set before the change and compare. A
   citation's `temporal_assertions` can name the decision it replaced
   (`replaces_decision_id`) and the one that replaced it (`superseded_by`):
   follow that chain as `ayda-guide` says before you search. Done when you
   hold the current decision, its citations, and each earlier version the
   chain names.
2. Search for the alternatives and the decision's other names. Use no more
   than four focused searches.
3. Use `timeline` for the smallest date range that can establish sequence.
4. Use `explore_graph` only from a cited record, or from a `project:` or
   `topic:` ID in its backlinks, to find related records. Keep its default
   bounded traversal unless one additional hop is necessary. Done when each
   related record you keep is cited or dropped.
5. Use `get_record` for no more than four records needed to verify decisive
   wording or implementation detail.
6. Write the trace in time order. Separate proposal, discussion, decision,
   implementation, and later revision. Name any `authority_conflict` the
   citations carry, and verify or leave out each sentence that `ask` put in
   `check.flagged`. Cite each material statement with its Ayda record ID or
   returned source link. Done when every statement in the trace has a
   citation or is marked as inference.

Preserve disagreement and uncertainty. If the budget omits useful evidence,
state that the trace is truncated. Do not infer hidden evidence, expand a
person's access, or describe no visible evidence as proof of absence.

Complete when each conclusion has a citation and the trace states any material
gap or conflict in the visible evidence.
