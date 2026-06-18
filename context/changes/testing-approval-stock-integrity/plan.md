# Plan: testing-approval-stock-integrity (test-plan Phase 1)

**Risk #1:** zatwierdzenie nie obniża stanu poniżej zera; shortage blokuje approve.

**Research:** `research.md` — brak harnessu Postgres; wzmacniamy testy serwisu z mockiem transakcji odzwierciedlającym decrement.

## Scope

Rozszerzyć `apps/api/src/inquiry/inquiry-approval.service.spec.ts` o scenariusze behawioralne (patrz research). Bez nowego pliku integration z DB.

## Out of scope

- Testcontainers / docker Postgres w CI
- E2E Playwright admin approve (Phase 4 test-plan)
- HTTP supertest approve endpoint (Phase 2 test-plan)

## Verify

- `npx nx test api -- inquiry-approval.service.spec`
- `npx nx test api`

## Progress

### Phase 1: Approval stock behavioral tests

#### Automated
- [x] 1.1 Availability shortage when schedule overlap consumes stock
- [x] 1.2 Availability `canApprove: false` for non-submitted inquiry
- [x] 1.3 Approve decrements decoration stock inside transaction mock
- [x] 1.4 Approve throws when transaction stock would go negative (inner guard)
- [x] 1.5 Approve rejects already-processed inquiry
- [x] 1.6 `nx test api` green

#### Manual
- [x] 1.7 Review: each test names regression it catches (no oracle mirror)

### Phase 2: Cookbook + test-plan status

#### Automated
- [x] 2.1 Update `test-plan.md` §6.3 integration notes + Phase 1 status `complete`
- [x] 2.2 Update `test-plan.md` §6.6 phase note

#### Manual
- [ ] 2.3 Claim M3L1 badge if not yet (Mission Log)
