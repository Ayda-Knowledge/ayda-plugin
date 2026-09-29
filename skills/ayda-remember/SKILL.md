---
name: ayda-remember
description: Save decisions, commitments and facts from this conversation to the member's Ayda memory. Use when the member says remember this, keep this or note this in Ayda, or wraps up a session and wants what was decided kept.
---

# Keep what the member wants remembered

Use the configured `ayda` MCP server. A memory is a proposal: Ayda stores the
sentence at once, and the decisions and loops it reads from it wait until the
member confirms them in Ayda.

1. **Collect the candidates.** When the member names one thing, that is the
   only candidate. When they wrap up a session, draw from this conversation
   the decisions made, the commitments with an owner, and the facts the member
   stated. Done when you hold a numbered list.
2. **Write each candidate as a standalone sentence** that a reader will
   understand a year from now, with no access to this conversation:
   - Name who, what, and the project; give an absolute date ("on 2026-09-29"),
     never "today" or "this".
   - Give the reason when the member gave one.
   - One decision, commitment, or fact per sentence, in the member's terms.
   - Keep to work facts. Leave out credentials, account numbers and other
     people's personal details; Ayda masks some of these, not all.

   Example: "On 2026-09-29 Thandi agreed to send the revised venue quote to
   Bob by 2026-10-03 for the October offsite."
3. **Get the member's approval.** Show the drafted sentences and let the
   member pick, edit or drop each one.
4. **Store each approved sentence** with one `remember` call. Every call
   stores a new record, so call once per sentence and retry only a call that
   failed.
5. **Report back**: each saved sentence with its `record_id`, the pending
   items Ayda read from it, and that those wait for the member's confirmation
   in Ayda before they count.

The work is done when every approved sentence has a `record_id` or a reported
failure.
