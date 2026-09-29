---
expect:
  item_id: /^action:/
  status: [open, done, dismissed]
---

{"query_id":"eval-decide","item":{"id":"{{input.item_id}}","status":"{{input.status}}","note":null,"decided_at":"2026-09-29T06:05:00Z"}}
