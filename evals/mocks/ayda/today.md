---
expect:
  timezone: string
---

{
  "query_id": "eval-today",
  "date": "{{input.date}}",
  "timezone": "{{input.timezone}}",
  "records": [
    {
      "id": "slack:C0EVENTS:1790590000.200",
      "title": "Re: revised venue quote",
      "source": "slack",
      "channel": "#events",
      "author": "Bob Venter",
      "created_at": "2026-09-25T14:40:00Z",
      "url": "https://example.invalid/slack/C0EVENTS/1790590000.200",
      "occurred_at": "2026-09-25T14:40:00Z"
    },
    {
      "id": "github:harbour/site:pr:41",
      "title": "Fix booking form timezone",
      "source": "github",
      "channel": null,
      "author": "Sipho Dlamini",
      "created_at": "2026-09-28T10:02:00Z",
      "url": "https://example.invalid/github/harbour/site/pr/41",
      "occurred_at": "2026-09-28T10:02:00Z"
    },
    {
      "id": "slack:C0SALES:1790670000.300",
      "title": "Blue Crane renewal call notes",
      "source": "slack",
      "channel": "#sales",
      "author": "Liesel Bester",
      "created_at": "2026-09-28T13:30:00Z",
      "url": "https://example.invalid/slack/C0SALES/1790670000.300",
      "occurred_at": "2026-09-28T13:30:00Z"
    }
  ],
  "by_person": [
    {
      "name": "Liesel Bester",
      "records": [
        {
          "id": "slack:C0SALES:1790670000.300",
          "title": "Blue Crane renewal call notes",
          "source": "slack",
          "channel": "#sales",
          "author": "Liesel Bester",
          "created_at": "2026-09-28T13:30:00Z",
          "url": "https://example.invalid/slack/C0SALES/1790670000.300",
          "occurred_at": "2026-09-28T13:30:00Z"
        }
      ]
    },
    {
      "name": "Sipho Dlamini",
      "records": [
        {
          "id": "github:harbour/site:pr:41",
          "title": "Fix booking form timezone",
          "source": "github",
          "channel": null,
          "author": "Sipho Dlamini",
          "created_at": "2026-09-28T10:02:00Z",
          "url": "https://example.invalid/github/harbour/site/pr/41",
          "occurred_at": "2026-09-28T10:02:00Z"
        }
      ]
    },
    {
      "name": "Bob Venter",
      "records": [
        {
          "id": "slack:C0EVENTS:1790590000.200",
          "title": "Re: revised venue quote",
          "source": "slack",
          "channel": "#events",
          "author": "Bob Venter",
          "created_at": "2026-09-25T14:40:00Z",
          "url": "https://example.invalid/slack/C0EVENTS/1790590000.200",
          "occurred_at": "2026-09-25T14:40:00Z"
        }
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
  "loops_raised": [],
  "loops_closed": [],
  "truncated": false,
  "approximate_dates": 0,
  "redaction_notice": "Ayda masks credentials and identity numbers it recognises before storage; a number it cannot verify is stored as written. Other sensitive content stays unchanged."
}
