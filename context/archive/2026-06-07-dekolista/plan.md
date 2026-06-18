# Dekolista (S-03) Implementation Plan

## Overview

Roadmap slice **S-03** (Stream A). Client-side Dekolista with `localStorage`, add from catalog category pages, review quantities, then link directly to inquiry form (`/zapytanie`, S-04).

## Desired End State

1. User adds decorations from `/katalog/:slug` to Dekolista (FR-006).
2. `/dekolista` shows readable list with qty edit, remove, clear, confirm (FR-007).
3. Header badge shows total quantity when list is non-empty.
4. CTA links directly to `/zapytanie` when list is non-empty.
5. `nx run web:test`, `web:lint`, `web:build` pass.

## What We're NOT Doing

- Persisting Dekolista to API (S-05 submit).
- Inquiry form fields (S-04).
- Admin view of Dekolista (S-08).

## Progress

### Phase 1: Store + core

#### Automated

- [x] 1.1 `DekolistaStore` in `core/dekolista/` (signals + `localStorage` `wzrusz-dekolista-v1`)
- [x] 1.2 `dekolista.store.spec.ts` — add, persist, confirm reset

### Phase 2: Dekolista page

#### Automated

- [x] 2.1 `feature/dekolista/` lazy route `/dekolista`
- [x] 2.2 Empty state, list, qty, confirm, link to `/zapytanie`
- [x] 2.3 `dekolista.spec.ts` — empty + confirm flow
- [x] 2.4 `nx run web:test`

### Phase 3: Catalog integration + header

#### Automated

- [x] 3.1 Add button on `category-detail` → `DekolistaStore.addDecoration`
- [x] 3.2 Header badge `totalQuantity()` in `layout/header/site-header`
- [x] 3.3 `nx run web:lint` (boundaries OK)

#### Manual

- [x] 3.4 Local browse: katalog → dodaj → badge w menu → dekolista → zatwierdź → link do `/zapytanie`

### Phase 4: Verify

#### Automated

- [x] 4.1 `nx run web:build --configuration=production`
