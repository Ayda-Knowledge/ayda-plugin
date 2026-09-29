---
expect:
  canonical_id: string
---

{
  "found": true,
  "record": {
    "id": "slack:C0EVENTS:1790590000.200",
    "title": "Re: revised venue quote",
    "source": "slack",
    "channel": "#events",
    "author": "Bob Venter",
    "created_at": "2026-09-25T14:40:00Z",
    "url": "https://example.invalid/slack/C0EVENTS/1790590000.200"
  },
  "text": "Bob Venter: Thanks Thandi, got the revised venue quote this morning. The new rate works for us, I'll sign off on Monday.",
  "truncated": false,
  "backlinks": [
    {
      "id": "action:slack:C0EVENTS:1790410000.100:send-revised-venue-quote",
      "relationship": "resolves"
    }
  ],
  "redaction_notice": "Ayda masks credentials and identity numbers it recognises before storage; a number it cannot verify is stored as written. Other sensitive content stays unchanged."
}
