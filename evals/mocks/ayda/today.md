---
expect:
  timezone: string
---

{
  "query_id": "eval-today",
  "date": "{{input.date}}",
  "timezone": "{{input.timezone}}",
  "range_start": "{{input.date}}T00:00:00+02:00",
  "range_end": "{{input.date}}T23:59:59+02:00",
  "records": [
    {
      "id": "slack:C0SALES:1790670000.300",
      "title": "Blue Crane renewal call notes",
      "source": "slack",
      "channel": "#sales",
      "author": "Liesel Bester",
      "occurred_at": "2026-09-28T13:30:00Z",
      "url": "https://example.invalid/slack/C0SALES/1790670000.300"
    },
    {
      "id": "github:harbour/site:pr:41",
      "title": "Fix booking form timezone",
      "source": "github",
      "author": "Sipho Dlamini",
      "occurred_at": "2026-09-28T10:02:00Z",
      "url": "https://example.invalid/github/harbour/site/pr/41",
      "channel": null
    },
    {
      "id": "slack:C0EVENTS:1790590000.200",
      "title": "Re: revised venue quote",
      "source": "slack",
      "channel": "#events",
      "author": "Bob Venter",
      "occurred_at": "2026-09-25T14:40:00Z",
      "url": "https://example.invalid/slack/C0EVENTS/1790590000.200"
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
      "name": "Liesel Bester",
      "record_ids": [
        "slack:C0SALES:1790670000.300"
      ]
    },
    {
      "name": "Sipho Dlamini",
      "record_ids": [
        "github:harbour/site:pr:41"
      ]
    }
  ],
  "sources": [
    {
      "source": "slack",
      "records": 2
    },
    {
      "source": "github",
      "records": 1
    }
  ],
  "loops": [],
  "truncated": false,
  "size_limited": false,
  "approximate_dates": 0,
  "redaction_notice": "Ayda redacts each record once, for secrets and identity numbers, before storage; Google Drive files are stored as written."
}
