---
name: ayda-decision-trace
description: Reconstruct a company decision from cited Ayda evidence. Use when asked why a decision was made, how it changed, who contributed, or which implementation followed it.
---

# Trace a decision with Ayda

Use the configured `ayda` MCP server, and the `ayda-guide` skill for the
time fields and the answer check. The trace is a chronology: each event has
a date, a source, and a place in the order.

1. **Find the decision.** Open with one `ask` for the current decision and
   its stated reason, with `response_mode` `detail`: a compact answer
   leaves out the `temporal_assertions` that name a replaced decision. Its
   citations seed the trace. When the question is how the decision changed,
   ask again with `effective_at` set before the change and compare. A
   citation's `temporal_assertions` can name the decision it replaced
   (`replaces_decision_id`) and the one that replaced it (`superseded_by`):
   follow that chain as `ayda-guide` says before you search. Done when you
   hold the current decision, its citations, and each earlier version the
   chain names.
2. **Find the alternatives.** `search` for the options that lost and for
   the decision's other names, in at most four searches. Done when a
   search adds no new record, or the four are spent.
3. **Fix the order.** When the citations leave the order of two events
   open, call `timeline` for the period between them. Done when each event
   has a date, or you have named the events whose order no record fixes.
4. **Find related records.** Call `explore_graph` only from a cited record,
   or from a `project:` or `topic:` ID in its backlinks, with its default
   bounds. Add one hop only when a cited record points at a record that
   the default does not reach. Done when each related record you keep is
   cited or dropped.
5. **Verify the wording.** Read with `get_record` the records, at most
   four, whose exact words decide the trace. Done when each decisive
   statement comes from a record you read.
6. **Write the trace** in time order, with these parts where the evidence
   has them: proposal, discussion, decision, implementation, later
   revision. Give each disagreement between people or sources as the
   records state it. Name any `authority_conflict` the citations carry,
   and verify or leave out each sentence that `ask` put in
   `check.flagged`. Cite each statement with its Ayda record ID or
   returned source link, and mark each inference as inference.

The trace is done when every statement has a citation or is marked as
inference, and it states each gap: an event that no visible record covers,
a conflict between sources, and evidence that a budget above left unread.
