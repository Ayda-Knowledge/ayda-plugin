{
  "query_id": "eval-graph",
  "records": [
    {
      "id": "slack:C0EVENTS:1790410000.100",
      "title": "Offsite venue thread",
      "source": "slack",
      "channel": "#events",
      "author": "Thandi Mokoena",
      "url": "https://example.invalid/slack/C0EVENTS/1790410000.100",
      "started_at": "2026-09-22T09:12:00Z"
    },
    {
      "id": "slack:C0EVENTS:1790590000.200",
      "title": "Re: revised venue quote",
      "source": "slack",
      "channel": "#events",
      "author": "Bob Venter",
      "url": "https://example.invalid/slack/C0EVENTS/1790590000.200",
      "started_at": "2026-09-25T14:40:00Z"
    }
  ],
  "concepts": [
    {
      "id": "project:october-offsite",
      "name": "October offsite"
    }
  ],
  "references": [
    {
      "source_id": "slack:C0EVENTS:1790410000.100",
      "target_id": "project:october-offsite",
      "depth": 1,
      "relationship": "about",
      "outgoing": true
    }
  ],
  "truncated": false,
  "redaction_notice": "Ayda redacts each record once, for secrets and identity numbers, before storage; Google Drive files are stored as written."
}
