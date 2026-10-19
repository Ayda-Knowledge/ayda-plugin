---
name: ayda-daily-brief
description: Brief the member on their day from Ayda: what changed since they last worked, what they owe, what others owe them, and which loops look done. Use when the member starts their day, asks to catch up, or asks what they missed.
---

# Brief the member's day

Use the configured `ayda` MCP server, and the `ayda-guide` skill for call
cost and cut results. The brief is a triage, not a digest:
every line either needs the member or explains something that does.

1. **Fix the member, the day and the zone.** Call `whoami` for the member's
   name. The day to read is the member's last working day (Friday when today
   is Monday) unless they name another. The zone is their IANA zone; ask once
   if the conversation does not show it. Done when you hold the member's
   name, one date and one zone.
2. **Read the day.** Call `today` with that date and zone. A busy day runs to
   tens of thousands of characters, and some hosts save it to a file; then
   read `by_person`, `sources`, `range_start`, `range_end`, `truncated`,
   `size_limited` and `approximate_dates` from the file, and skip `records`
   and the loop lists, which repeat `by_person` and step 3. When `truncated`
   or `size_limited` is true, the rundown is cut: call `timeline` from
   `range_start` to `range_end` with `limit` 50, and follow `next_cursor`
   for at most two more pages. Done when you hold the day's records and
   know whether any are still missing.
3. **Read the loops.** Call `open_loops` with `filter` `all`. A loop that
   has `status` `looks_done`, or an `ayda_confident` claim, looks done. One
   ID can sit in two groups; list it once, under `your_move`. Done when you
   hold `your_move`, `waiting`, the loops that look done, and `counts`.
4. **Read the agenda.** When the host has a calendar tool, read today's
   meetings from it. Otherwise call `ask` once: "Which meetings are scheduled
   for <today's date>, and who attends?". Skip this step when neither returns
   anything useful.
5. **Choose what matters.** Keep a record from step 2 when the member
   wrote it or it names them, touches a loop from step 3, or belongs to a
   project an agenda meeting covers. Call `get_record` or `ask` for at most three kept records
   whose meaning the title does not carry. `by_person` groups by the author
   string each source sent, so one person can appear twice; merge them only
   when the name makes it plain.
6. **Write the brief** in this order, one line per item, each cited with its
   record title and link or ID:
   - **Needs you**: `your_move` loops, overdue first, then by due date.
   - **Looks done, confirm?**: each loop that looks done, with the record
     that suggests it closed.
   - **Waiting on others**: `waiting` loops, oldest first, with the age.
   - **What changed**: the kept records, grouped by project or person.
   - **Today**: the meetings from step 4.

   State the loop counts the tool returned, and say when the day or a loop
   group is still cut. When `approximate_dates` is close to the number of
   records, say that their times are when Ayda read them, and order **What
   changed** by project, not by time. Close by offering to record verdicts
   on the loops
   (the `ayda-loop-sweep` skill does this).

The brief is done when every `your_move` loop and every loop that looks done
appears or its truncation is stated, and every line carries a citation.
