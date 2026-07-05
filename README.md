# Wzrusz

Platforma do zapytań o wypożyczenie dekoracji eventowych (Poznań i okolice). Gość przegląda katalog, zbiera Dekolistę i wysyła zapytanie; właściciel obsługuje rezerwacje w panelu admina (scheduler, zatwierdzenie, stan magazynowy).

To nie jest sklep e-commerce — rezerwacja wymaga ręcznego potwierdzenia terminu.

## Stack

| Warstwa | Technologia |
|---------|-------------|
| Frontend | Angular 21, PrimeNG, SSR (`apps/web`) |
| Backend | NestJS 11, TypeORM (`apps/api`) |
| Baza | PostgreSQL |
| Monorepo | Nx |

Szczegóły produktu i wymagań: [`context/foundation/prd.md`](context/foundation/prd.md).  
Roadmapa i stan slice’ów: [`context/foundation/roadmap.md`](context/foundation/roadmap.md).

## Wymagania

- Node.js 20+ (zob. `package.json` → `engines`)
- Docker (lokalny Postgres)

## Uruchomienie lokalne

```sh
cp .env.example .env
npm ci --legacy-peer-deps
npm run db:up
npm run db:migrate
```

W dwóch terminalach:

```sh
npm run serve:api   # API :3000
npm run serve:web   # Angular SSR :4200, proxy /api → API
```

Panel admina: `http://localhost:4200/admin`  
Konto seed (dev): `admin@wzrusz.local` / `changeme` (patrz `.env.example`).

## Testy

```sh
npx nx test api
npx nx test web
npx nx e2e web-e2e -- --project=chromium
```

Plan testów i ryzyka: [`context/foundation/test-plan.md`](context/foundation/test-plan.md).

## Struktura

```
apps/web          — strona publiczna + panel admina (Angular SSR)
apps/api          — REST API (prefiks /api)
apps/web-e2e      — Playwright
context/foundation/ — PRD, roadmap, test-plan, infra
context/changes/    — aktywne change’y implementacyjne
```

Więcej dla agentów i contributorów: [`AGENTS.md`](AGENTS.md).

## Deploy

Staging na AWS Elastic Beanstalk (web + api), RDS, S3 (media), SES (email).  
Szczegóły: [`context/deployment/deploy-plan.md`](context/deployment/deploy-plan.md).
