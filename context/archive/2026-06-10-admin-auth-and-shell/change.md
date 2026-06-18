---
change_id: admin-auth-and-shell
title: Admin auth and panel shell
status: archived
created: 2026-06-10
updated: 2026-06-18
archived_at: 2026-06-18T20:15:17Z
---

## Notes

**Roadmap:** F-02 + S-06  
**PRD:** FR-013, FR-014, FR-015

### Shipped

- **API:** User entity, migration + seed admin, AuthModule (JWT login), `AdminAuthGuard` on admin routes.
- **Web:** `/admin/login`, admin shell, session + interceptor, protected admin routes.

### Dev credentials

- Email: `admin@wzrusz.local`
- Password: `changeme` (rotate on staging/production)

### Key paths

- `apps/api/src/auth/`
- `apps/web/src/app/feature/admin/`
