# Minimal Data Persistence (F-01) Implementation Plan

## Overview

Roadmap foundation **F-01** wires the Nest API to RDS PostgreSQL with TypeORM, introduces a minimal entity model for categories, decorations, and inquiries (plus line items), and establishes a repeatable migration path for local development and staging CI. No public catalog or inquiry HTTP APIs in this change — only persistence infrastructure downstream slices consume.

## Current State Analysis

- **API** (`apps/api/src/app/app.module.ts`): `AppController`, `AppService`, `HealthController` only; no database imports.
- **Dependencies** (`wzrusz/package.json`): Nest 11 present; no `typeorm`, `pg`, or `@nestjs/typeorm`.
- **Deploy** (`.github/workflows/deploy-api.yml`): build → zip `dist/apps/api` → EB; no migration step.
- **Infra**: RDS PostgreSQL 16 staging exists; conversation baseline reports `DATABASE_URL` on API EB with `sslmode=require`.
- **Health** (`apps/api/src/app/health.controller.ts`): returns `{ status: 'ok' }` without DB probe.

### Key Discoveries:

- API uses webpack via `NxAppWebpackPlugin` (`apps/api/webpack.config.js`) — migration CLI must run from TypeScript source (ts-node / dedicated data-source), not from bundled `main.js`.
- Global prefix `api` (`apps/api/src/main.ts`) — health lives at `/api/health`.
- Lessons: Nx output paths and deploy artifact layout are pinned (`dist/apps/api`) — migration scripts stay at repo root / `apps/api`, not inside deploy zip logic beyond copying migration files if needed.

## Desired End State

After all phases:

1. `TypeOrmModule` loads from `DATABASE_URL` with `synchronize: false`.
2. Tables exist for `categories`, `decorations`, `inquiries`, `inquiry_line_items` (exact table names per migration).
3. `npm run db:migrate` (root script) applies pending migrations locally and in CI.
4. `GET /api/health` returns `{ status: 'ok', database: 'up' }` when Postgres answers, `'down'` otherwise (HTTP 200 with degraded flag, or 503 — implementer picks one pattern and documents in health controller).
5. Staging deploy workflow runs migrations before uploading EB bundle when `DATABASE_URL` secret is set.

### Verification

- Automated: `nx run api:build`, `nx run api:test`, migration dry-run or `up` against test DB.
- Manual: curl staging `/api/health` after deploy; confirm tables in RDS (psql or admin).

## What We're NOT Doing

- Admin auth / users tables (F-02 `admin-auth-scaffold`).
- Scheduler events, reservations, stock ledger (S-09, S-10).
- REST endpoints for catalog, dekolista, or inquiry submit (S-02, S-05).
- S3 upload or real image pipeline (F-03) — `Decoration.imageUrl` is nullable string placeholder.
- Data seed / demo content (defer to `catalog-browse` or optional follow-up).
- TypeORM `synchronize: true` anywhere.
- Running migrations automatically on every EB instance boot (explicit CI step instead).

## Implementation Approach

Add database layer under `apps/api/src/database/`: `database.module.ts`, `typeorm.config.ts` (or `data-source.ts` for CLI), `entities/`, `migrations/`. Register `DatabaseModule` in `AppModule`. Extend health check with `DataSource` ping. Root `package.json` scripts delegate to TypeORM CLI with path to data-source. CI job step uses same script with GitHub environment secret.

## Critical Implementation Details

**Migration timing on EB:** Run migrations from GitHub Actions (network to RDS), not from EB instances, unless RDS SG is opened to GitHub-hosted runners — if migrate fails in CI, confirm RDS is reachable from Actions IP or use a self-hosted runner / manual migrate once; document outcome in `## Progress` manual step.

**SSL:** Production `DATABASE_URL` includes `sslmode=require`; local Docker Postgres often does not — use separate `.env` values, do not weaken production config.

## Phase 1: Wire TypeORM and configuration

### Overview

Install dependencies and connect Nest to Postgres without entities yet (or with empty entity array) to validate configuration and build pipeline.

### Changes Required:

#### 1. Dependencies

**File**: `wzrusz/package.json`

**Intent**: Add runtime and dev tooling for Postgres + TypeORM + Nest integration.

**Contract**: Dependencies `@nestjs/typeorm`, `typeorm`, `pg`; devDependency `@types/pg` if needed. Root scripts placeholder `db:migrate` may stub until Phase 2.

#### 2. Database module

**File**: `apps/api/src/database/database.module.ts` (new)

**Intent**: Centralize TypeORM async root config reading `process.env.DATABASE_URL`.

**Contract**: `TypeOrmModule.forRootAsync` with `type: 'postgres'`, `url: process.env.DATABASE_URL`, `autoLoadEntities: true`, `synchronize: false`, `ssl` enabled when URL contains `sslmode=require` (or `rejectUnauthorized: false` only for RDS — match Nest/TypeORM docs for URL-based SSL).

#### 3. App module import

**File**: `apps/api/src/app/app.module.ts`

**Intent**: Import `DatabaseModule` so API boots with DB connection when `DATABASE_URL` is set.

**Contract**: `AppModule.imports` includes `DatabaseModule`; app must fail fast at startup if `DATABASE_URL` missing in production, or log warning in development — choose fail-fast for staging parity.

#### 4. Environment template

**File**: `wzrusz/.env.example` (new or extend)

**Intent**: Document required `DATABASE_URL` for local dev without committing secrets.

**Contract**: Example `DATABASE_URL=postgresql://user:pass@localhost:5432/wzrusz_dev` and note EB uses ssl URL.

### Success Criteria:

#### Automated Verification:

- `cd wzrusz && npx nx run api:build --configuration=production`
- `cd wzrusz && npx nx run api:test`

#### Manual Verification:

- With local `DATABASE_URL` set, `nx serve api` starts without TypeORM connection errors
- Without `DATABASE_URL`, behavior matches chosen dev policy (fail or skip — document in change notes)

**Implementation Note**: Pause for human confirmation after manual verification before Phase 2.

---

## Phase 2: Entities and initial migration

### Overview

Define minimal entities aligned with PRD catalog + inquiry flow; generate and commit first migration.

### Changes Required:

#### 1. Entities

**Files**: `apps/api/src/database/entities/*.entity.ts` (new)

**Intent**: Persist catalog and inquiry payload for downstream slices.

**Contract** (fields may use TypeORM decorators; names stable for API later):

- **Category**: `id` (uuid), `name`, `slug` (unique), `sortOrder` (int, default 0), timestamps.
- **Decoration**: `id`, `categoryId` (FK), `name`, `slug` (unique per category or global — pick global unique slug), `description` (text), `imageUrl` (nullable varchar), `stockQuantity` (int, default 0, check >= 0 at app layer later), timestamps.
- **Inquiry**: `id`, client `fullName`, `email`, `phone` (nullable), `eventStart` / `eventEnd` (timestamptz or date — store as timestamptz for admin filter FR-016), `transportAddress` (text), `needsInvoice` (boolean), `invoiceNotes` (nullable text), `status` (enum: `submitted` default for MVP path), `createdAt`.
- **InquiryLineItem**: `id`, `inquiryId` (FK), `decorationId` (FK), `quantity` (int > 0), optional `sortOrder`.

Relations: Category 1—N Decoration; Inquiry 1—N InquiryLineItem; Decoration 1—N InquiryLineItem.

#### 2. TypeORM CLI data source

**File**: `apps/api/src/database/typeorm.data-source.ts` (new)

**Intent**: Single entry for `typeorm migration:generate|run` from monorepo root.

**Contract**: Exports `DataSource` with same connection options as `DatabaseModule`; `entities` and `migrations` paths explicit; `migrationsTableName` e.g. `typeorm_migrations`.

#### 3. Initial migration

**File**: `apps/api/src/database/migrations/<timestamp>-InitialSchema.ts` (new)

**Intent**: Create all tables, FKs, indexes on `slug`, `inquiry.createdAt`, FK columns.

**Contract**: Migration is reversible (`down` drops tables in safe order). No seed data in migration.

#### 4. Migrate script

**File**: `wzrusz/package.json`

**Intent**: One command for humans and CI.

**Contract**: `"db:migrate": "typeorm-ts-node-commonjs migration:run -d apps/api/src/database/typeorm.data-source.ts"` (or equivalent working command in this repo after dependency install).

### Success Criteria:

#### Automated Verification:

- `cd wzrusz && npm run db:migrate` succeeds against local Postgres with empty DB
- `cd wzrusz && npx nx run api:build --configuration=production`
- `cd wzrusz && npx nx run api:test`

#### Manual Verification:

- `\dt` in psql shows four tables with expected columns
- Re-running `db:migrate` is idempotent (no pending migrations)

**Implementation Note**: Pause for human confirmation before Phase 3.

---

## Phase 3: Health check and local integration test

### Overview

Expose DB connectivity via health endpoint; add a minimal automated test that mocks or uses test DB.

### Changes Required:

#### 1. Health controller

**File**: `apps/api/src/app/health.controller.ts`

**Intent**: Operators and `verify-deploy.sh` can detect DB outages.

**Contract**: Inject `DataSource` (or health indicator); `GET /health` returns `status` and `database: 'up' | 'down'` based on `SELECT 1` or `dataSource.query('SELECT 1')`.

#### 2. Health test

**File**: `apps/api/src/app/health.controller.spec.ts` (new or extend)

**Intent**: Prevent regression on health shape.

**Contract**: Unit test with mocked `DataSource` asserting `database` field present; optional e2e skipped if no test DB in CI yet.

#### 3. Optional dev guard

**File**: `apps/api/src/main.ts` or database module

**Intent**: Clear log when connected to which DB host (redact password).

**Contract**: Log hostname only, never credentials.

### Success Criteria:

#### Automated Verification:

- `cd wzrusz && npx nx run api:test`
- `cd wzrusz && npx nx run api:build --configuration=production`

#### Manual Verification:

- `curl http://localhost:3000/api/health` shows `database: up` with local Postgres running
- Stop Postgres → health shows `database: down` (or app fails startup — consistent with chosen design)

**Implementation Note**: Pause for human confirmation before Phase 4.

---

## Phase 4: Staging migration in deploy pipeline

### Overview

Run migrations against staging RDS from GitHub Actions before EB deploy.

### Changes Required:

#### 1. Workflow step

**File**: `wzrusz/.github/workflows/deploy-api.yml`

**Intent**: Staging schema always applied before new API version ships.

**Contract**: After `npm ci`, before or after `nx run api:build`, step `Run database migrations` with `env: DATABASE_URL: ${{ secrets.DATABASE_URL }}` and `run: npm run db:migrate` in `wzrusz/`. Document requirement: secret must exist in environment `wzrusz`. If migrate cannot reach RDS from GitHub, document fallback manual migrate in Progress manual step.

#### 2. Verify deploy script (optional touch)

**File**: `wzrusz/scripts/verify-deploy.sh`

**Intent**: Smoke test includes DB health when available.

**Contract**: Parse `/api/health` JSON for `database == up` (warn if down, do not fail entire script if unrelated).

### Success Criteria:

#### Automated Verification:

- Workflow YAML valid (no syntax errors)
- `cd wzrusz && npx nx run api:build --configuration=production`

#### Manual Verification:

- After merge to `main` (or `workflow_dispatch`), migration step green on GitHub Actions
- `curl` staging `/api/health` shows `database: up`
- `scripts/verify-deploy.sh` passes or shows expected WARN only for SSR body

**Implementation Note**: Final human sign-off before `/10x-archive` or next change.

---

## Testing Strategy

### Unit Tests:

- Health controller with mocked `DataSource` (up/down).
- Optional: entity metadata smoke test (load entities array length === 4).

### Integration Tests:

- Deferred full e2e with real Postgres to Module 3 / separate change unless CI service container added later.

### Manual Testing Steps:

1. Start local Postgres; copy `.env.example` → `.env`; run `db:migrate` and `nx serve api`.
2. Hit `/api/health` and confirm `database: up`.
3. Inspect tables and insert one row via psql (sanity).
4. Run staging workflow or manual `db:migrate` with production URL from secure store (once).
5. Re-run `verify-deploy.sh` against staging URLs.

## Performance Considerations

Minimal schema; no N+1 concerns until read APIs land. Connection pool defaults from TypeORM are sufficient for MVP traffic.

## Migration Notes

- First deploy to non-empty RDS: if tables were created manually, migration may conflict — start from empty RDS as per L5 baseline.
- Rollback: run TypeORM `migration:revert` locally; staging revert requires care — prefer RDS snapshot before first production migration (infra lesson).

## References

- Roadmap F-01: `context/foundation/roadmap.md`
- PRD Business Logic + FR-004–012, FR-016–017: `context/foundation/prd.md`
- Deploy: `wzrusz/.github/workflows/deploy-api.yml`
- Lessons (Nx paths, RDS): `context/foundation/lessons.md`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: Wire TypeORM and configuration

#### Automated

- [x] 1.1 `npx nx run api:build --configuration=production`
- [x] 1.2 `npx nx run api:test`

#### Manual

- [x] 1.3 API starts with valid local `DATABASE_URL` without TypeORM errors

### Phase 2: Entities and initial migration

#### Automated

- [x] 2.1 `npm run db:migrate` succeeds on empty local database
- [x] 2.2 `npx nx run api:build --configuration=production`
- [x] 2.3 `npx nx run api:test`

#### Manual

- [x] 2.4 psql shows four tables; second migrate run is no-op

### Phase 3: Health check and local integration test

#### Automated

- [x] 3.1 `npx nx run api:test`
- [x] 3.2 `npx nx run api:build --configuration=production`

#### Manual

- [x] 3.3 Local `curl /api/health` reports `database: up` with Postgres running

### Phase 4: Staging migration in deploy pipeline

#### Automated

- [x] 4.1 `npx nx run api:build --configuration=production`

#### Manual

- [x] 4.2 EB postdeploy migration succeeds on staging (not CI — RDS in VPC)
- [x] 4.3 Staging `/api/health` reports `database: up` (after deploy with phase 3)
- [x] 4.4 `verify-deploy.sh` updated check behaves as expected
