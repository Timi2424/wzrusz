---
change_id: inquiry-submit-and-admin-inbox
title: Inquiry submit and admin inbox
status: archived
created: 2026-06-12
updated: 2026-06-18
archived_at: 2026-06-18T20:15:17Z
---

## Notes

**Roadmap:** S-05 (Stream A)  
**PRD:** FR-011, FR-012, US-01

### Shipped

- **API:** `POST /api/inquiries` — transaction save inquiry + line items; SES notify admin (staging).
- **API:** `GET /api/inquiries` — admin-only (`AdminAuthGuard`).
- **Web:** submit on review, success screen, Dekolista cleared after success.

### Key paths

- `apps/api/src/inquiry/`
- `apps/web/src/app/core/inquiry/inquiry-api.service.ts`
- `apps/web/src/app/feature/inquiry/inquiry-form.ts`

**Email:** działa na staging w sandboxie SES (admin notify). Maile do klientów poza sandboxem → F-04 + domena.
