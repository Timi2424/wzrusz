# Public static assets

Served at site root (`/brand/...`, `/fonts/...`) via `apps/web/project.json` → `assets`.

## Brand (`brand/`)

| File | Replace when |
|------|----------------|
| `logo.png` | Wavy wordmark z `wip/logo_bez_tla.png` |
| `favicon.png` | Z `wip/logo_okragle.png` (32px) |
| `favicon-180.png` | Apple touch icon |
| `logo-avatar.png` | Okrągłe logo (social) |

## Decor (`decor/`)

| File | Source |
|------|--------|
| `fala.png` | `wip/fala.png` — tło wycięte |
| `iskierki.png` | `wip/iskierki.png` — tło wycięte |

Ścieżki w kodzie: `features/public/brand.ts`.

## Fonts (`fonts/`)

Wrzuć pliki WOFF2 po zakupie licencji TanType:

- `TAN-Grandeur.woff2`
- `TAN-Buster.woff2`
- `TAN-Garland.woff2`

Po dodaniu odkomentuj `@font-face` w `src/styles.scss`.

## WIP (`wip/`)

Materiały źródłowe marki (logo, fala, iskierki, wizytówki). Zobacz `wip/README.md` i `context/foundation/design-brief.md`.

## Zdjęcia dekoracji

Nie tutaj — produkcyjnie S3 (F-03). Na dev seed w API (S-02).
