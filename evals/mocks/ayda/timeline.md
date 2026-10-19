---
expect:
  start: string
  end: string
---

{
  "query_id": "eval-timeline",
  "events": [
    {
      "id": "slack:C0EVENTS:1790590000.200",
      "title": "Re: revised venue quote",
      "source": "slack",
      "occurred_at": "2026-09-25T14:40:00Z",
      "url": "https://example.invalid/slack/C0EVENTS/1790590000.200"
    },
    {
      "id": "github:harbour/site:pr:41",
      "title": "Fix booking form timezone",
      "source": "github",
      "occurred_at": "2026-09-28T10:02:00Z",
      "url": "https://example.invalid/github/harbour/site/pr/41"
    },
    {
      "id": "slack:C0SALES:1790670000.300",
      "title": "Blue Crane renewal call notes",
      "source": "slack",
      "occurred_at": "2026-09-28T13:30:00Z",
      "url": "https://example.invalid/slack/C0SALES/1790670000.300"
    }
  ],
  "scanned": 3,
  "truncated": false,
  "scan_complete": true,
  "range_start": "{{input.start}}",
  "range_end": "{{input.end}}",
  "redaction_notice": "Ayda redacts each record once, for secrets and identity numbers, before storage; Google Drive files are stored as written."
}
