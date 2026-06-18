# Catalog Browse (S-02) Implementation Plan

## Overview

Read-only Nest catalog endpoints, seed migration, Angular `/katalog` + `/katalog/:slug` with decoration cards and orientacyjny stan magazynowy.

## Desired End State

1. `GET /api/catalog/categories` and `GET /api/catalog/categories/:slug` return JSON from RDS.
2. Seed migration populates demo categories and decorations.
3. `/katalog` lists categories; `/katalog/:slug` shows decoration cards.
4. `nx run api:test`, `nx run web:test`, `web:build` pass.

## Progress

### Phase 1: API + seed

#### Automated

- [x] 1.1 Catalog module, service, controller
- [x] 1.2 Seed migration `CatalogSeed`
- [x] 1.3 `npm run db:migrate` (local)
- [x] 1.4 `nx run api:test`

### Phase 2: Web catalog pages

#### Automated

- [x] 2.1 `CatalogApiService` + models
- [x] 2.2 Catalog list + category detail components
- [x] 2.3 Routes replace ComingSoon on `/katalog`
- [x] 2.4 `nx run web:test`
- [x] 2.5 `nx run web:build --configuration=production`

#### Manual

- [x] 2.6 Local browse: `/katalog`, category slug, stock labels
