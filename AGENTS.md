# Repository Guidelines

Wzrusz is an Nx monorepo for a decoration rental inquiry platform: Angular 21 (`apps/web`) + NestJS 11 (`apps/api`). Product scope and FRs live in `@../context/foundation/prd.md`.

## Hard rules

- **Angular SSR** — public routes use `RenderMode.Server` (`@apps/web/src/app/app.routes.server.ts`); admin is `Client`. Deploy web to **EB Node** (`node server/server.mjs`), not S3/Amplify static. SEO meta via `Title`/`Meta` on catalog routes (implement with features).
- **PrimeNG + SCSS only** — no Tailwind. `@apps/web/src/app/app.config.ts`: `provideAnimationsAsync`, Aura, `provideClientHydration`. `@angular/animations` required. `npm ci --legacy-peer-deps`.
- Do **not** re-scaffold with the course Nx **react-monorepo** preset. Stack hand-off: `@../context/foundation/brand-and-scaffold.md`.
- Nest global prefix is `api` (`@apps/api/src/main.ts`). Dev proxy: `@apps/web/proxy.conf.json` maps `/api` → `http://localhost:3000`.
- Never commit secrets (`.env`, AWS keys, JWT). Use environment variables; default API port is `3000`.
- Honor `@nx/enforce-module-boundaries` in `@eslint.config.mjs` when adding `libs/`.

## Project structure

- `apps/web` — standalone Angular components; target modules: public catalog + lazy `/admin`.
- `apps/api` — Nest modules: auth, decorations, inquiries, reservations, scheduler, mail.
- `apps/web-e2e` — Playwright; `apps/api-e2e` — API e2e.
- Foundation contracts (PRD, stack, brand, infra): `@../context/foundation/`.
- Recurring pitfalls from past work: `@../context/foundation/lessons.md` (append via `/10x-lesson`).

## Build, test, and dev

- `npm start` — `web:serve` on `:4200` (SSR dev + `api:serve` on `:3000` via `@apps/web/project.json` `dependsOn`).
- Prod web: `node dist/apps/web/server/server.mjs` (EB, `PORT=8080`, `HOST=0.0.0.0`).
- `npm run build` — production builds for `web` and `api`.
- `npx nx lint web` / `npx nx lint api` — ESLint (flat config at `@eslint.config.mjs`).
- `npx nx test api` — Jest; `npx nx test web` — Vitest Angular.
- `npx nx e2e web-e2e` — Playwright (`@apps/web-e2e/playwright.config.ts` reuses running dev server).

## Coding style

- TypeScript ~5.9, Prettier single quotes (`@.prettierrc`).
- Angular: standalone components with explicit `imports`; SCSS per component; import PrimeNG pieces from `primeng/*` (not NgModules). Public pages: `PageSeoService` + constants in `@apps/web/src/app/core/seo/` (SSR-safe `Title`/`Meta`).
- Nest: modules under `apps/api/src/app/`; webpack build via `@apps/api/project.json`. Prod: `HOST=0.0.0.0`, `CORS_ORIGIN` = web EB URL. Health: `GET /api/health`.
- API URL in Angular: `@apps/web/src/app/core/api/api-config.ts`; prod browser bundle via `npm run write-api-url` + `NX_API_URL`.

## Testing

- Unit tests: `*.spec.ts` next to source. API = Jest; web = Vitest.
- E2E specs in `apps/web-e2e/src/` and `apps/api-e2e/src/`.

## Commits and PRs

No git history yet — use Conventional Commits (`feat:`, `fix:`, `chore:`). Planned CI: GitHub Actions per `@../context/foundation/tech-stack.md`. Run `npx nx run-many -t lint,test,build -p web,api` before opening a PR once tests exist.
