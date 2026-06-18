# Research: inquiry persistence and admin auth

## Risk #2 — inquiry persistence

**Path:** `InquiryService.create` → validate → `decorations.find` → transaction saves `Inquiry` + `InquiryLineItem[]` → async notify.

**Existing:** `inquiry.service.spec.ts` — happy path single item, empty lineItems reject.

**Gaps:**
- Multi-item payload: assert all line items saved with `sortOrder`
- Unknown `decorationId` → `NotFoundException`
- `getDetail` maps sorted line items (no tests)
- `listSummaries` untested (lower priority)

## Risk #3 — admin auth

**Path:** `AdminAuthGuard.handleRequest` — no user → `UnauthorizedException`; non-admin role → `ForbiddenException`.

**Existing:** `auth.service.spec.ts` login only; **no guard spec**.

**Cheapest layer:** unit test `admin-auth.guard.spec.ts` on `handleRequest` (no supertest harness).

## Out of scope

HTTP e2e on `/api/inquiries` with JWT header — deferred until supertest module exists.
