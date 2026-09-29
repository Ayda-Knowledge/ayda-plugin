---
name: ayda-loop-sweep
description: Work through the member's Ayda open loops and record their verdicts. Use when the member wants to clear, triage or review their to-dos, or to confirm the loops Ayda marks as looks done.
---

# Sweep the member's open loops

Use the configured `ayda` MCP server. Ayda proposes; the member decides. Each
verdict you record is the member's own word, so the sweep moves at the pace
of their answers.

1. **Load the queue.** Call `open_loops` with `filter` `all` and `limit` 50,
   plus `since` when the member names a start date. A loop looks done when
   its `status` is `looks_done` or it carries an `ayda_confident` claim. One
   ID can sit in two groups; queue it once. Order the queue: loops that look
   done first, then `your_move` by due date and age, then `waiting` loops
   older than a week. Leave `done` loops out. Done when the
   queue is ordered and you have stated the `counts` and any truncation.
2. **Prepare a batch of up to five.** For each loop give the ask, the
   counterpart, the record that raised it, the due date, and a proposal:
   - Looks done: read the record in the loop's `resolution` or
     `ayda_confident` claim with `get_record` and quote the line that shows
     it closed. Propose `done`, or `open` when the quote
     falls short.
   - `your_move`: propose nothing; ask whether it is done, still open, or
     not the member's to carry (`dismissed`).
   - `waiting`: offer one line the member could send as a nudge. The loop
     stays open unless the member says otherwise.
3. **Take the member's verdicts.** Wait for them to name each loop and its
   verdict. A blanket answer ("all done") covers only the batch in front of
   them.
4. **Record each verdict** with `decide_open_loop`: the `item_id`, the
   `status`, the member's `note` when they gave one, and a `rationale` in
   their own words when they said why. Ayda quotes a rationale back the next
   time the same loop surfaces, so their words beat a paraphrase.
   `To-do not found.` means the loop is hidden or not theirs; report it and
   move on.
5. **Repeat** steps 2–4 until the queue is empty or the member stops.

Keep `get_record` to the loops that look done, and to at most ten per sweep.

The sweep is done when every loop in the queue has a recorded verdict, was
left open by the member, or was skipped at their word; then report what
changed and what remains open.
