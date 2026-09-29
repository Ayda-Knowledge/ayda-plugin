{
  "query_id": "eval-ask-conflict",
  "answer": "The nightly hotel limit for client travel is R1,800 [1], although the finance handbook still states R1,500 [2].",
  "citations": [
    {
      "id": "slack:C0OPS:1790300000.400",
      "title": "Travel limit update",
      "source": "slack",
      "channel": "#ops",
      "author": "Liesel Bester",
      "started_at": "2026-09-01T09:00:00Z",
      "url": "https://example.invalid/slack/C0OPS/1790300000.400",
      "snippet": "From 1 September the nightly hotel limit for client travel is R1,800.",
      "score": 0.86,
      "temporal_assertions": [
        {
          "subject": "client travel hotel limit",
          "object_value": "R1,800 per night",
          "valid_from": "2026-09-01",
          "status": "active",
          "conflict_status": "authority_conflict",
          "evidence_status": "verified"
        }
      ]
    },
    {
      "id": "doc:gdoc:finance-handbook",
      "title": "Finance handbook 2026",
      "source": "drive",
      "channel": null,
      "author": "Finance",
      "started_at": "2026-01-15T08:00:00Z",
      "url": "https://example.invalid/doc/gdoc/finance-handbook",
      "snippet": "Hotel stays for client travel are capped at R1,500 per night.",
      "score": 0.81,
      "temporal_assertions": [
        {
          "subject": "client travel hotel limit",
          "object_value": "R1,500 per night",
          "valid_from": "2026-01-15",
          "status": "active",
          "conflict_status": "authority_conflict",
          "evidence_status": "verified"
        }
      ]
    }
  ],
  "temporal": {
    "status": "active",
    "requested": false
  },
  "latency_ms": 1100
}
