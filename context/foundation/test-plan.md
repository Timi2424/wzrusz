# Test Plan

> Phased test rollout for this project. Strategy is frozen at the top
> (§1–§5); cookbook patterns at the bottom (§6) fill in as phases ship.
> Read before writing any new test.
>
> Refresh: re-run `/10x-test-plan --refresh` when stale (see §8).
>
> Last updated: 2026-06-18

## 1. Strategy

Tests follow three non-negotiable principles for this project:

1. **Cost × signal.** The cheapest test that gives a real signal for the
   risk wins. Do not promote to e2e because e2e "feels safer." Do not put a
   vision model on top of a deterministic diff that already catches the
   regression.
2. **User concerns are first-class evidence.** Risks anchored in "the team is
   worried about X, and the failure would surface somewhere in `<area>`"
   carry the same weight as PRD lines or hot-spot data.
3. **Risks are scenarios, not code locations.** This plan documents *what
   could fail* and *why we believe it's likely* — drawn from documents,
   interview, and codebase *signal* (churn, structure, test base). It does
   NOT claim to know which line owns the failure. That knowledge is
   produced by `/10x-research` during each rollout phase. If the plan and
   research disagree about where the failure lives, research is the
   ground truth.

Hot-spot scope used for likelihood weighting: `apps/api`, `apps/web`
(excluding `dist/`, `node_modules/`, generated output).

## 2. Risk Map

The top failure scenarios this project must protect against, ordered by
risk = impact × likelihood. Risks are failure scenarios in user / business
terms, not test names.

| # | Risk (failure scenario) | Impact | Likelihood | Source (evidence — not anchor) |
|---|-------------------------|--------|------------|--------------------------------|
| 1 | Admin zatwierdza zapytanie mimo niedostępności dekoracji na termin — stan magazynowy schodzi poniżej zera lub rezerwacja jest niemożliwa | High | High | PRD guardrails + Success Criteria; roadmap S-10 north star |
| 2 | Gość wysyła zapytanie z Dekolisty — dane nie trafiają do bazy lub admin nie widzi pełnej listy pozycji | High | High | PRD US-01; archived `inquiry-submit-and-admin-inbox` |
| 3 | Nieautoryzowany użytkownik odczytuje listę zapytań, szczegóły lub endpointy admin-only | High | Medium | PRD Access Control FR-013–015; auth surface |
| 4 | Upload zdjęcia dekoracji kończy się placeholderem lub złym URL — katalog publiczny pokazuje błędny obraz | Medium | High | hot-spot dir `apps/api/src/media` (12 commits/30d); hot-spot `apps/web/.../admin/catalog` |
| 5 | Wysyłka maila (notify / sukces) kończy się błędem SES, ale UI/DB sugeruje sukces (brak stampu lub fałszywy sukces) | Medium | Medium | PRD FR-011, FR-026; lessons (SES sandbox); archived ses change |
| 6 | Krytyczna ścieżka gościa (katalog → Dekolista → formularz → potwierdzenie) łamie się przez regresję SSR/routingu/API mimo zielonych testów jednostkowych | High | Medium | PRD primary flow; test-base gap (Playwright = example only) |
| 7 | Admin widzi błędną dostępność w schedulerze — hover/kalendarz nie odzwierciedla zajętych dekoracji na termin | Medium | Medium | PRD FR-021–022; roadmap S-09 |

### Risk Response Guidance

| Risk | What would prove protection | Must challenge | Context `/10x-research` must ground | Likely cheapest layer | Anti-pattern to avoid |
|------|-----------------------------|----------------|-------------------------------------|------------------------|------------------------|
| #1 | Próba approve z ilością > available kończy się odmową; po approve stock nigdy < 0 | "Mamy już test service — wystarczy" bez transakcji DB | reguła availability vs schedule events, transakcja approve, encje stock | integration (API + DB) | oracle skopiowany z implementacji `buildAvailabilityItems` |
| #2 | POST inquiry z line items zapisuje komplet danych; admin GET widzi te same pozycje | happy-path z jedną dekoracją wystarczy | DTO walidacja, transakcja zapisu, FK dekoracji | integration | mock repozytoriów bez assertu persisted state |
| #3 | Request bez JWT / z user token na admin route → 401/403 | "Guard jest w kodzie" bez testu HTTP | AdminAuthGuard, public vs admin routes | integration (supertest) | test tylko guarda w izolacji bez kontrolera |
| #4 | Po uploadzie `imageUrl` wskazuje serwowalny asset; katalog `<img>` ładuje URL | assert samego 200 z upload endpoint | MEDIA_MODE stub vs S3, ścieżka publiczna, cropper output | integration + jeden web unit | assert placeholder `/brand/logo-avatar.png` jako sukces |
| #5 | Błąd SES → API error; `successEmailSentAt` ustawiane dopiero po sukcesie | stub zawsze green = produkcja OK | EMAIL_MODE, InquirySuccessEmailService flow | unit + integration (mock SES) | test szablonu HTML zamiast kontraktu wysyłki |
| #6 | Gość kończy flow z widocznym potwierdzeniem; inquiry istnieje po stronie API | snapshot całej strony | BASE_URL, NX_API_URL, SSR vs CSR admin | e2e (Playwright) | e2e każdego helpera zamiast jednego flow |
| #7 | Zajęta dekoracja na termin widoczna w schedulerze po seed/event | unit modelu kalendarza = pełna ochrona | ScheduleEventLineItem query, hover payload | integration | test tylko mocka PrimeNG bez danych |

## 3. Phased Rollout

Each row is a discrete rollout phase that will open its own change folder
via `/10x-new`. Status moves left-to-right; orchestrator updates Status as
artifacts appear on disk.

| # | Phase name | Goal (one line) | Risks covered | Test types | Status | Change folder |
|---|------------|-----------------|---------------|------------|--------|---------------|
| 1 | Approval and stock integrity | Odrzucenie approve przy shortage + stock ≥ 0 po zatwierdzeniu | #1 | integration (+ uzupełnienie unit) | change opened | testing-approval-stock-integrity |
| 2 | Inquiry persistence and admin auth | Pełny zapis inquiry + blokada admin API bez JWT | #2, #3 | integration | not started | — |
| 3 | Media upload contract | Upload → poprawny public URL w katalogu | #4 | integration | not started | — |
| 4 | Critical guest path e2e | Jeden flow katalog → submit z Playwright | #6 | e2e | not started | — |
| 5 | Quality gates (hooks) | Lint + typecheck po edycji agenta | cross-cutting | post-edit-hook | not started | — |

## 4. Stack

| Layer | Tool | Version | Notes |
|-------|------|---------|-------|
| unit + integration (API) | Jest | 29.x | `apps/api` via `@nx/jest` |
| unit (Web) | Vitest | 4.x | Angular 21 + `@angular/build:unit-test` |
| e2e | Playwright | 1.60 | `apps/web-e2e`; tylko `example.spec.ts` — Phase 4 |
| API e2e smoke | Jest | 29.x | `apps/api-e2e` minimal |

**Stack grounding tools (current session):**
- Docs: none dedicated — local `package.json`, Nx configs; checked: 2026-06-18
- Search: none — skipped; checked: 2026-06-18
- Runtime/browser: Playwright in repo; MCP browser not used in this session; checked: 2026-06-18
- Provider/platform: GitHub Actions deploy workflows — future gate target; checked: 2026-06-18

Test-base profile: **meaningful** — Jest + Vitest configured, ~38 `*.spec.ts` across API/web; E2E suite effectively empty (placeholder only).

## 5. Quality Gates

| Gate | Where | Required? | Catches |
|------|-------|-----------|---------|
| lint + typecheck | local + CI (planned) | required after Phase 5 | syntactic / type drift |
| unit + integration | local + CI | required after Phase 1–3 | logic regressions |
| e2e critical flow | CI on PR (planned) | required after Phase 4 | broken guest path |
| post-edit hook | local (agent loop) | recommended after Phase 5 | regressions at edit time |
| pre-commit staged tests | local | optional after Phase 5 | commit without related tests |

## 6. Cookbook Patterns

How to add new tests in this project. Sub-sections fill in as rollout phases ship.

### 6.1 Adding a unit test (API)

- **Location**: obok modułu — `apps/api/src/<area>/*.spec.ts`
- **Naming**: `<module>.spec.ts`
- **Reference test**: `apps/api/src/inquiry/inquiry-approval.service.spec.ts`
- **Run locally**: `npx nx test api`

### 6.2 Adding a unit test (Web)

- **Location**: obok komponentu/util — `*.spec.ts`
- **Reference test**: `apps/web/src/app/core/inquiry/build-inquiry-preview.spec.ts`
- **Run locally**: `npx nx test web`

### 6.3 Adding an integration test (API)

- TBD — see §3 Phase 1–2.

### 6.4 Adding an e2e test

- TBD — see §3 Phase 4.

### 6.5 Adding a test for inquiry / approval flow

- TBD — see §3 Phase 1–2.

### 6.6 Per-rollout-phase notes

(TBD as phases complete.)

## 7. What We Deliberately Don't Test

Exclusions aligned with MVP scope and product decisions (2026-06-18).

- **Treść stron Coming soon (FAQ, regulamin, polityka)** — placeholder do czasu treści od właściciela. Re-evaluate when copy lands.
- **SES production access / dowolne adresy klientów** — infra blocked on domain; sandbox covered manually. Re-evaluate after domain + production access.
- **Pełna galeria zdjęć / lightbox (v2)** — out of PRD scope.
- **UI snapshot całego marketingu** — niska sygnałowość, wysoki koszt utrzymania (interview Q5 pattern).

Phase 2 interview: condensed from PRD guardrails, roadmap, session history, and `lessons.md` (formal five-question interview deferred to unblock M3 rollout).

## 8. Freshness Ledger

- Strategy (§1–§5) last reviewed: 2026-06-18
- Stack versions last verified: 2026-06-18
- AI-native tool references last verified: 2026-06-18

Refresh (`/10x-test-plan --refresh`) when:

- a new top-3 risk surfaces from the roadmap or archive,
- a recommended tool's `checked:` date is older than three months,
- the project's tech stack changes (new framework, new test runner),
- §7 negative-space no longer matches what the team believes.
