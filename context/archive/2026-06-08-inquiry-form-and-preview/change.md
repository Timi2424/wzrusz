---
change_id: inquiry-form-and-preview
title: Inquiry form and preview
status: archived
created: 2026-06-08
updated: 2026-06-18
archived_at: 2026-06-18T20:15:17Z
---

## Notes

**Roadmap:** S-04 (Stream A)  
**PRD:** FR-008, FR-009, FR-010

Reactive inquiry form at `/zapytanie`: contact, event datetime range, transport/invoice, live `buildInquiryPreview()`, review step. Route guarded — requires confirmed Dekolista. Submit wired in S-05.

### Key paths

- `apps/web/src/app/core/inquiry/`
- `apps/web/src/app/feature/inquiry/inquiry-form.ts`
