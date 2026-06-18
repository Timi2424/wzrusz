# Public Shell and Home (S-01) Implementation Plan

## Overview

Roadmap slice **S-01** delivers the public layout shell (header, sticky navigation, footer) and a hero section on the home page. No catalog API or Dekolista state — placeholder routes until S-02/S-03.

## Desired End State

1. All public routes render inside `PublicShell` with shared header and footer.
2. Header hides on scroll down, reappears on scroll up (FR-002).
3. Nav includes Dekolista link (FR-002).
4. Home shows hero explaining the service (FR-003).
5. `nx run web:test` and `web:build` pass; SSR staging unchanged.

## What We're NOT Doing

- Catalog API or category pages (S-02).
- Dekolista client state (S-03).
- Admin shell (S-06).
- Footer legal pages beyond minimal contact (OQ #6).

## Progress

### Phase 1: Shell components

#### Automated

- [x] 1.1 `npx nx run web:test`
- [x] 1.2 `npx nx run web:build --configuration=production`

#### Manual

- [x] 1.3 Local browse: header/footer visible on `/`, `/katalog`, `/dekolista`

### Phase 2: Sticky scroll

#### Automated

- [x] 2.1 `resolveStickyHeaderVisibility` unit tests
- [x] 2.2 `npx nx run web:test`

#### Manual

- [x] 2.3 Scroll down/up on home — header hides/shows

### Phase 3: Hero + staging verify

#### Automated

- [x] 3.1 Home hero renders in unit test (SSR marker)
- [x] 3.2 `npx nx run web:build --configuration=production`

#### Manual

- [ ] 3.3 Staging web: header, hero, footer; `verify-deploy.sh` step 5 improves (after push)
