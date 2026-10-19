---
expect:
  timezone: string
---

{
  "query_id": "eval-today-cut",
  "date": "{{input.date}}",
  "timezone": "{{input.timezone}}",
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
      "url": "https://example.invalid/slack/C0EVENTS/1790590000.200"
    },
    {
      "id": "github:harbour/site:pr:39",
      "title": "Update footer links",
      "source": "github",
      "author": "Sipho Dlamini",
      "occurred_at": "2026-09-25T09:10:00Z",
      "url": "https://example.invalid/github/harbour/site/pr/39",
      "channel": null
    }
  ],
  "by_person": [
    {
      "name": "Bob Venter",
      "record_ids": [
        "slack:C0EVENTS:1790590000.200"
      ]
    },
    {
      "name": "Sipho Dlamini",
      "record_ids": [
        "github:harbour/site:pr:39"
      ]
    }
  ],
  "sources": [
    {
      "source": "slack",
      "records": 1
    },
    {
      "source": "github",
      "records": 1
    }
  ],
  "loops": [],
  "truncated": true,
  "size_limited": true,
  "approximate_dates": 0,
  "redaction_notice": "Ayda redacts each record once, for secrets and identity numbers, before storage; Google Drive files are stored as written."
}
