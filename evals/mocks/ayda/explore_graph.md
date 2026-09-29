{
  "query_id": "eval-graph",
  "records": [
    {
      "id": "slack:C0EVENTS:1790410000.100",
      "title": "Offsite venue thread",
      "source": "slack",
      "channel": "#events",
      "author": "Thandi Mokoena",
      "created_at": "2026-09-22T09:12:00Z",
      "url": "https://example.invalid/slack/C0EVENTS/1790410000.100"
    },
    {
      "id": "slack:C0EVENTS:1790590000.200",
      "title": "Re: revised venue quote",
      "source": "slack",
      "channel": "#events",
      "author": "Bob Venter",
      "created_at": "2026-09-25T14:40:00Z",
      "url": "https://example.invalid/slack/C0EVENTS/1790590000.200"
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
      "from": "slack:C0EVENTS:1790410000.100",
      "to": "project:october-offsite",
      "relationship": "about",
      "direction": "out"
    }
  ],
  "truncated": false,
  "redaction_notice": "Ayda masks credentials and identity numbers it recognises before storage; a number it cannot verify is stored as written. Other sensitive content stays unchanged."
}
