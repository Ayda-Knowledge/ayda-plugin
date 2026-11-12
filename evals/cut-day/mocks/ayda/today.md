---
type: agent
abort_when: Abort only if the input has neither a date nor a cursor.
---

You are the `today` tool of an Ayda server for the fictional company
Harbour & Finch. Reply with one JSON object and nothing else. Copy the JSON
below exactly; change only the two marked values.

When the input has no `cursor`, or `cursor` is null, return page 1. Replace
`<date>` with the input `date`, and `<timezone>` with the input `timezone`:

```json
{
  "query_id": "eval-today-cut",
  "date": "<date>",
  "timezone": "<timezone>",
  "range_start": "2026-09-24T22:00:00Z",
  "range_end": "2026-09-25T21:59:59.999999Z",
  "records": [
    {
      "id": "slack:C0EVENTS:1790590000.200",
      "title": "Re: revised venue quote",
      "source": "slack",
      "channel": "#events",
      "author": "Bob Venter",
      "occurred_at": "2026-09-25T14:40:00Z",
      "timestamp_basis": "record_metadata",
      "url": "https://example.invalid/slack/C0EVENTS/1790590000.200"
    },
    {
      "id": "github:harbour/site:pr:39",
      "title": "Update footer links",
      "source": "github",
      "author": "Sipho Dlamini",
      "occurred_at": "2026-09-25T09:10:00Z",
      "timestamp_basis": "record_metadata",
      "url": "https://example.invalid/github/harbour/site/pr/39",
      "channel": null
    }
  ],
  "by_person": [
    {"name": "Bob Venter", "record_ids": ["slack:C0EVENTS:1790590000.200"]},
    {"name": "Sipho Dlamini", "record_ids": ["github:harbour/site:pr:39"]}
  ],
  "sources": [
    {"source": "slack", "records": 1},
    {"source": "github", "records": 1}
  ],
  "loops": [],
  "truncated": true,
  "size_limited": true,
  "next_cursor": "eval-today-cut-page-2",
  "approximate_dates": 0,
  "approximate_dates_scope": "returned_page",
  "approximate_dates_records": 2,
  "approximate_dates_method": "five_or_more_records_in_one_minute; not proof of ingest time",
  "redaction_notice": "Ayda redacts each record once, for secrets and identity numbers, before storage; Google Drive files are stored as written."
}
```

When the input `cursor` is `eval-today-cut-page-2`, return page 2:

```json
{
  "query_id": "eval-today-cut-2",
  "date": "2026-09-25",
  "timezone": "Africa/Johannesburg",
  "range_start": "2026-09-24T22:00:00Z",
  "range_end": "2026-09-25T21:59:59.999999Z",
  "records": [
    {
      "id": "slack:C0SALES:1790600000.300",
      "title": "Blue Crane signed the renewal contract",
      "source": "slack",
      "channel": "#sales",
      "author": "Liesel Bester",
      "occurred_at": "2026-09-25T07:05:00Z",
      "timestamp_basis": "record_metadata",
      "url": "https://example.invalid/slack/C0SALES/1790600000.300"
    },
    {
      "id": "slack:C0EVENTS:1790560000.100",
      "title": "Thandi, can you confirm the catering headcount by Monday?",
      "source": "slack",
      "channel": "#events",
      "author": "Liesel Bester",
      "occurred_at": "2026-09-25T06:20:00Z",
      "timestamp_basis": "record_metadata",
      "url": "https://example.invalid/slack/C0EVENTS/1790560000.100"
    }
  ],
  "by_person": [
    {
      "name": "Liesel Bester",
      "record_ids": ["slack:C0SALES:1790600000.300", "slack:C0EVENTS:1790560000.100"]
    }
  ],
  "sources": [{"source": "slack", "records": 2}],
  "loops": [],
  "truncated": false,
  "size_limited": false,
  "approximate_dates": 0,
  "approximate_dates_scope": "returned_page",
  "approximate_dates_records": 2,
  "approximate_dates_method": "five_or_more_records_in_one_minute; not proof of ingest time",
  "redaction_notice": "Ayda redacts each record once, for secrets and identity numbers, before storage; Google Drive files are stored as written."
}
```

For any other `cursor`, return this text as the whole reply:
`Invalid arguments: cursor is not valid.`
