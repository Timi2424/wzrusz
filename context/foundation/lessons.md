# Lessons Learned

> Append-only register of recurring rules and patterns. Re-read at start by /10x-frame, /10x-research, /10x-plan, /10x-plan-review, /10x-implement, /10x-impl-review.

## Never use course nx preset for Wzrusz scaffold

- **Context**: Greenfield bootstrap in `10xdev/` — `/10x-bootstrapper`, `create-nx-workspace`, or any step reading `starter_id: nx` from `tech-stack.md`.
- **Problem**: Course registry `starter_id: nx` maps to **react-monorepo**, not Angular + Nest. Agent or human runs the wrong template and the monorepo stack diverges from PRD and `brand-and-scaffold.md`.
- **Rule**: Scaffold with `angular-monorepo` + `npx nx add @nx/nest` per `@context/foundation/brand-and-scaffold.md`. Treat course `/10x-bootstrapper` default `nx` preset as forbidden for this project.
- **Applies to**: implement, plan, bootstrapper

## Install @angular/animations with PrimeNG async animations

- **Context**: `apps/web/src/app/app.config.ts` — `provideAnimationsAsync()` + `providePrimeNG()`.
- **Problem**: `nx build web` fails with `Could not resolve "@angular/animations/browser"` because the Angular monorepo preset does not include `@angular/animations` by default.
- **Rule**: Add `@angular/animations` to root `package.json` before declaring PrimeNG wired; verify with `nx run web:build`.
- **Applies to**: implement

## Exit SES sandbox before testing client emails

- **Context**: AWS deploy per `@context/foundation/infrastructure.md`; admin manual success email (FR-026) and inquiry notifications (FR-011).
- **Problem**: Fresh AWS accounts keep SES in sandbox — mail to unverified client addresses fails and looks like an application bug. Since ~2024 AWS also **requires a verified sending domain** before granting production access (verified Gmail alone is not enough).
- **Rule**: Treat sandbox as expected until you own a domain: verify the domain in SES (DKIM DNS), request production access, then E2E client emails. Until then, admin notify to verified Gmail works; client emails need per-recipient verification in sandbox or stub locally.
- **Applies to**: implement, plan, research

## Pin Nx build output paths in CI and Amplify

- **Context**: Deploy pipelines for `wzrusz/` — Amplify (front), Elastic Beanstalk or CI (API); see `@context/foundation/infrastructure.md` Getting Started.
- **Problem**: Default framework detectors assume `dist/<app-name>/` at repo root; Wzrusz outputs `dist/apps/web/browser` and `dist/apps/api` — empty or broken deploys.
- **Rule**: Every deploy config must name explicit Nx artifact paths (`dist/apps/web/browser`, pruned `dist/apps/api`); never rely on starter-default `baseDirectory`.
- **Applies to**: implement, plan

## SEO requires SSR host, not S3 static front

- **Context**: Public catalog on production; `@context/deployment/deploy-plan.md` front layer.
- **Problem**: CSR + S3/Amplify static serves empty `index.html` to crawlers until JS runs; product owner expects Google indexing of decoration pages.
- **Rule**: Enable `@angular/ssr` with `RenderMode.Server` on public routes; deploy `dist/apps/web/` (server + browser) to **EB Node**, not Amplify static-only. S3 remains for **media uploads**, not HTML hosting.
- **Applies to**: implement, plan, architecture
