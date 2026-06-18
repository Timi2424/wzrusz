---
topic: Test rollout Phase 1 — approval and stock integrity (Risk #1)
researcher: agent
created: 2026-06-18
sources:
  - context/foundation/test-plan.md
  - context/foundation/prd.md
  - apps/api/src/inquiry/inquiry-approval.service.ts
---

# Research: approval and stock integrity

## Question

Where does Risk #1 (approve must not drive stock below zero; shortage must block approve) flow through the code, what is already tested, and what is the cheapest layer that catches real regressions?

## Code path (grounded)

| Step | Location | Behavior |
|------|----------|----------|
| Availability | `InquiryApprovalService.getAvailability` | Loads inquiry + line items; `buildAvailabilityItems` compares `requestedQuantity` vs `stock - occupied` on overlapping schedule events |
| Occupied load | `loadOccupiedQuantities` | SQL sum of `ScheduleEventLineItem` for events overlapping inquiry date range |
| Approve gate | `approve` L57–59 | Rejects with `ConflictException` if any item `status === 'shortage'` |
| Transaction | `approve` L61–94 | Creates `ScheduleEvent` + line items; loads `Decoration`, decrements `stockQuantity`; throws if `< 0` after decrement |
| HTTP | `InquiryController` `POST :id/approve` | Admin-only; delegates to service |

## Existing tests

`apps/api/src/inquiry/inquiry-approval.service.spec.ts` (3 cases):

- Happy availability + approve with mocked transaction
- Reject approve when requested qty (8) > stock (5) on inquiry line decoration

**Gaps (oracle / coverage holes):**

1. **`loadOccupiedQuantities` never exercised** — mock always returns `[]`; availability ignores scheduler overlap.
2. **Transaction stock decrement not asserted** — `findOneByOrFail` returns static `{ stockQuantity: 5 }`; no check that saved decoration has lower stock.
3. **Inner guard `Stock cannot go below zero` untested** — defense when DB row differs from inquiry relation snapshot (concurrency / stale read).
4. **`getAvailability` shortage UI signal untested** — `canApprove: false` when overlap consumes stock.
5. **No real Postgres integration** — project has Jest unit tests only; `apps/api-e2e` is axios smoke. Docker Postgres available locally but not wired in test CI for this change.

## Risk response verification

| Guidance | Verdict |
|----------|---------|
| Prove shortage blocks approve | Partially covered (qty 8 > 5); add occupied overlap case |
| Prove stock ≥ 0 after approve | **Not covered** — need transaction mock with mutable decoration |
| Challenge "mocked repo enough" | **Valid** — current mocks hide decrement path |
| Cheapest layer | **Enhanced service unit tests** with realistic transaction manager mock; Postgres integration = Phase 2+ when harness exists |
| Anti-pattern to avoid | Asserting same numbers as `buildAvailabilityItems` logic duplicated in test |

## Recommendation

Extend `inquiry-approval.service.spec.ts` with behavioral cases (no new infra):

1. Availability shows `shortage` + `canApprove: false` when occupied + stock insufficient.
2. Approve succeeds and persisted decoration in transaction has decremented stock.
3. Approve throws `Stock cannot go below zero` when transaction-loaded stock lower than availability snapshot (inner guard).
4. Approve rejects already-processed inquiry.
5. Availability returns `canApprove: false` for non-`submitted` inquiry.

Update §6 cookbook in `test-plan.md` after ship (reference test file + `nx test api`).

## Speculative risks dropped

- Full concurrent double-approve race — requires DB integration; note in plan as out of scope for Phase 1.
