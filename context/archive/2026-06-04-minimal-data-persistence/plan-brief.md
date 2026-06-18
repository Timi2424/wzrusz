# Minimal data persistence — Plan Brief

> Full plan: `context/changes/minimal-data-persistence/plan.md`
> Roadmap: F-01 in `context/foundation/roadmap.md`

## What & Why

Wzrusz ma live API i pustą RDS, ale zero persistence w kodzie — katalog i zapytania nie mogą iść dalej na mockach. Ta zmiana podłącza NestJS do PostgreSQL przez TypeORM, dodaje minimalny model danych (kategorie, dekoracje, zapytania + pozycje) i ścieżkę migracji lokalnie oraz na staging.

## Starting Point

- `apps/api`: Nest 11, `AppModule` bez DB, `/api/health` zwraca `{ status: 'ok' }`.
- RDS `wzrusz-staging` provisioned; `DATABASE_URL` na EB API (sslmode=require).
- Deploy: `deploy-api.yml` buduje `dist/apps/api`, zip, EB — bez kroku migracji.

## Desired End State

API startuje z połączeniem do Postgres; pierwsza migracja tworzy tabele pod downstream slice’y; `/api/health` sygnalizuje stan DB; staging dostaje migracje z CI przed deployem; lokalnie dev uruchamia migracje z `.env`. Brak publicznych endpointów katalogu/zapytań — to F-01 foundation, nie S-02/S-05.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) | Source |
| --- | --- | --- | --- |
| ORM | TypeORM + `@nestjs/typeorm` + `pg` | Standard dla Nest w stacku; dobrze współgra z migracjami i encjami. | Plan |
| Schema scope | Category, Decoration, Inquiry, InquiryLineItem | Pokrywa FR-004–012 bez schedulera/rezerwacji (S-09/S-10 później). | Roadmap / PRD |
| `synchronize` | `false` | Bezpieczne na staging/prod; tylko migracje. | Plan |
| Connection config | `DATABASE_URL` env | Już na EB; jeden string dla lokal + CI. | Baseline deploy |
| Migracje na staging | GitHub Actions przed EB deploy | Jawny krok; bez auto-run przy starcie aplikacji na prod. | Plan |
| Seed danych | Poza tym change | S-02/catalog może dodać seed; F-01 = kontrakt + tabele. | Roadmap cap |
| Public API | Brak w F-01 | Foundation bez user-visible outcome; CRUD w S-07/S-05. | Roadmap |

## Scope

**In scope:** zależności TypeORM, moduł DB, encje minimalne, pierwsza migracja, skrypty `db:migrate`, rozszerzony health, `.env.example`, krok migracji w `deploy-api.yml`, test połączenia lokalnie.

**Out of scope:** auth/users (F-02), SES (F-04), S3 URLs pipeline (F-03), scheduler/reservation/stock-mutation logic, endpointy REST katalogu/formularza, seed produkcyjny, rollback automatyczny RDS.

## Architecture / Approach

```
DATABASE_URL → TypeOrmModule (AppModule) → entities
                    ↓
              migrations (CLI / npm run db:migrate)
                    ↓
         GET /api/health → { status, database }
```

Encje w `apps/api/src/database/`; migracje wersjonowane w repo; webpack build bez `synchronize`.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. Wire TypeORM | Moduł + config + build przechodzi | Zły URL/ssl lokalnie |
| 2. Schema + migration | Tabele + migracja w repo | Relacje FK / nazwy kolumn |
| 3. Health + verify local | Health z DB + smoke lokalny | Pool timeout na EB SG |
| 4. CI migrate staging | Migracje przed deploy na EB | Secret DATABASE_URL w GH env |

**Prerequisites:** Postgres dostępny lokalnie (Docker) lub tunnel do RDS tylko do testów; `DATABASE_URL` w GitHub environment `wzrusz`.
**Estimated effort:** ~2–3 sesje after-hours, 4 fazy.

## Open Risks & Assumptions

- Zakładamy, że `DATABASE_URL` na EB jest poprawny i SG pozwala EB → RDS (zweryfikowane health bez TypeORM wcześniej).
- Lokalny dev bez Docker Postgres — Phase 3 manual skip do czasu lokalnej DB.
- Rollback migracji = ręczny revert migration lub snapshot RDS (poza tym planem).

## Success Criteria (Summary)

- `nx run api:build` i `api:test` zielone po zmianach.
- Migracja `up` działa lokalnie i na staging przed kolejnym deployem API.
- `/api/health` raportuje `database: up` gdy RDS reachable.
- Downstream S-02 może planować read-only katalog bez nowego „DB slice”.
