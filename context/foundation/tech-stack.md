---
starter_id: nx
package_manager: npm
project_name: wzrusz
hints:
  language_family: js
  team_size: solo
  deployment_target: aws
  ci_provider: github-actions
  ci_default_flow: auto-deploy-on-merge
  bootstrapper_confidence: verified
  path_taken: custom
  quality_override: false
  self_check_answers:
    typed: true
    from_official_starter: true
    conventions: true
    docs_current: true
    can_judge_agent: true
  has_auth: true
  has_payments: false
  has_realtime: false
  has_ai: false
  has_background_jobs: false
  ui_approach: primeng
  ui_library: primeng
  css_approach: scss-theme
  backend: nestjs
  frontend: angular
  monorepo: nx
---

## Why this stack

Świadomy wybór poza domyślnym starterem kursu: **Nx monorepo** z **Angular** (katalog publiczny + panel admina) i **NestJS** (zapytania, magazyn, scheduler, emaile). UI w całej aplikacji: **PrimeNG + SCSS** — jedna biblioteka komponentów (katalog, formularze, tabele, kalendarz schedulera), **bez Tailwind**. Marka **Wzrusz**: kolory i fonty TAN przez globalny theme (`styles.scss` / CSS variables), nadpisania PrimeNG w SCSS. Deploy docelowo **AWS** (S3+CloudFront, Nest na EB/ECS, RDS PostgreSQL, SES, S3 na zdjęcia). Auth admin email/hasło w Nest. Scaffold ręcznie według `context/foundation/brand-and-scaffold.md` (nie preset `react-monorepo` z rejestru nx).

## Angular version policy

**Pinned:** Angular **21.2** (`apps/web`, root `package.json`). Canonical docs: [angular.dev](https://angular.dev) for v21. Do not introduce v22-only APIs without an explicit version bump and changelog entry here.

**New code (v21):**

- Standalone components, `inject()`, **signals-first** for component state (`signal`, `computed`; prefer `input()` / `output()` for bindings).
- No new `NgModule`s. PrimeNG imports per component from `primeng/*`.
- Async data: `subscribe` in `ngOnInit` is acceptable on v21; prefer moving loaders to `httpResource()` / `resource()` when touching a file (prepares v22 without a big-bang refactor).
- Forms: **Reactive Forms** for inquiry (`feature/inquiry/inquiry-form.ts`); do not mix Signal Forms in the same feature. No new `ReactiveFormsModule` elsewhere unless PrimeNG blocks Signal Forms.

**Forward-compatible (v22 horizon):**

| Area | Now (21) | After bump to 22 |
|------|----------|------------------|
| Component state | `signal()` | unchanged |
| Catalog / API pages | `CatalogApiService` + signals | swap loaders to stable `httpResource()` in same components |
| Inquiry form (S-04) | one chosen pattern above | migrate to **stable** Signal Forms if not already |
| SSR / SEO | `PageSeoService`, `RenderMode.Server` on public routes | unchanged |
| Admin (CSR) | lazy `/admin`, PrimeNG tables | review PrimeNG + Signal Forms bindings |

**Reference implementations** (agent: extend these, do not invent parallel patterns):

- Public list + API: `apps/web/src/app/feature/catalog/catalog-list.ts`
- Public detail: `apps/web/src/app/feature/catalog/category-detail.ts`
- SEO: `apps/web/src/app/feature/home/home.ts`
- Folder layout (Angular Enterprise): `core/`, `layout/`, `feature/*`, `ui/`, `pattern/` under `apps/web/src/app/`
- Architecture lint: `apps/web/eslint.boundaries.config.mjs` (`eslint-plugin-boundaries` strict) — run `nx run web:lint`
- Dekolista store: `apps/web/src/app/core/dekolista/dekolista.store.ts`
- Dekolista page: `apps/web/src/app/feature/dekolista/dekolista.ts`
- Inquiry form: `apps/web/src/app/feature/inquiry/` + `apps/web/src/app/core/inquiry/`
- Shared UI lib: `libs/ui` (`@wzrusz/ui`) — `WzCheckbox`, `WzDateTimePicker` (PrimeNG + `minDate` / no past dates)

**v22 migration checklist** (run when upgrading `package.json`):

1. Bump `@angular/*` to v22; `npm ci --legacy-peer-deps`; fix breaking changes from release notes.
2. Replace catalog/inquiry `subscribe` loaders with `httpResource()` using existing `CatalogApiService` URLs.
3. Stabilize inquiry on Signal Forms if it was experimental on v21.
4. Re-run `nx run web:test`, `web:build`, SSR smoke on EB.
5. Update this section: pinned version → 22.x, trim experimental notes.
