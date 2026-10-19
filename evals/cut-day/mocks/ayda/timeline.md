---
expect:
  start: string
  end: string
---

{
  "query_id": "eval-timeline-cut",
  "events": [
    {
      "id": "slack:C0EVENTS:1790590000.200",
      "title": "Re: revised venue quote",
      "source": "slack",
      "occurred_at": "2026-09-25T14:40:00Z",
      "url": "https://example.invalid/slack/C0EVENTS/1790590000.200"
    },
    {
      "id": "github:harbour/site:pr:39",
      "title": "Update footer links",
      "source": "github",
      "occurred_at": "2026-09-25T09:10:00Z",
      "url": "https://example.invalid/github/harbour/site/pr/39"
    },
    {
      "id": "slack:C0SALES:1790600000.300",
      "title": "Blue Crane signed the renewal contract",
      "source": "slack",
      "occurred_at": "2026-09-25T07:05:00Z",
      "url": "https://example.invalid/slack/C0SALES/1790600000.300"
    },
    {
      "id": "slack:C0EVENTS:1790560000.100",
      "title": "Thandi, can you confirm the catering headcount by Monday?",
      "source": "slack",
      "occurred_at": "2026-09-25T06:20:00Z",
      "url": "https://example.invalid/slack/C0EVENTS/1790560000.100"
    }
  ],
  "scanned": 4,
  "truncated": false,
  "scan_complete": true,
  "range_start": "{{input.start}}",
  "range_end": "{{input.end}}",
  "redaction_notice": "Ayda redacts each record once, for secrets and identity numbers, before storage; Google Drive files are stored as written.",
  "approximate_dates": 0
}
