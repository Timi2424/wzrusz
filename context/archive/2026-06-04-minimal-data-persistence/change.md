---
change_id: minimal-data-persistence
title: Minimal data persistence
status: archived
created: 2026-06-04
updated: 2026-06-18
archived_at: 2026-06-18T20:15:17Z
---

## Notes

**Env:** lokalnie `.env` + Docker (5433). **Staging DB:** migracje w EB `postdeploy` (nie CI — RDS w VPC). **TLS:** AWS RDS CA w `apps/api/src/certs/` + `rejectUnauthorized: true`. **EB:** `DATABASE_URL` ze `sslmode=require` bez zmian. **Health:** `{"status":"ok","database":"up"}` lokalnie i na staging.
