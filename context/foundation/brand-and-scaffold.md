# Wzrusz — marka, UI, AWS, scaffold Nx

Dokument pomocniczy (poza schematem PRD). Agent i bootstrap czytają razem z `tech-stack.md`.

## Marka (z logo)

| Token | Wartość robocza | Użycie |
|-------|-----------------|--------|
| Tło strony | jasny błękit (~`#B8D4E8`) | tło publiczne, hero |
| Akcent / logo | pomarańcz vermillion (~`#E85D04`) | CTA, logo, linki aktywne |
| Tekst | ciemny granat/czarny (~`#1a1a2e`) | body |
| Logo | oko + słowo **Wzrusz** łukiem | header, favicon, footer |

Plik logo w workspace: `.cursor/projects/.../assets/image-b8c02591-683e-48ae-b8f9-36bfb72d801e.png` — skopiuj do `apps/web/public/brand/` po scaffoldzie.

## Czcionki TAN (TanType)

| Font | Rola w UI |
|------|-----------|
| **TAN Grandeur** | Nagłówki hero, duże tytuły kategorii |
| **TAN Buster** | Logo wordmark, krótkie hasła |
| **TAN Garland** | Podtytuły, opisy dekoracji |

**Licencja:** produkcja wymaga licencji komercyjnej + webfont (WOFF2) u TanType. MVP: licencja web albo fallback systemowy do czasu zakupu.

**Globalnie w `apps/web/src/styles.scss`:**

```scss
@font-face {
  font-family: "TAN Grandeur";
  src: url("/fonts/TAN-Grandeur.woff2") format("woff2");
  font-display: swap;
}
/* powtórz dla Buster, Garland */

:root {
  --wzrusz-bg: #b8d4e8;
  --wzrusz-accent: #e85d04;
  --wzrusz-text: #1a1a2e;
  --font-display: "TAN Grandeur", Georgia, serif;
  --font-logo: "TAN Buster", Georgia, serif;
  --font-serif: "TAN Garland", Georgia, serif;
  --font-ui: system-ui, sans-serif;
}
```

Formularze i tabele admina: `--font-ui`. Hero i katalog: fonty TAN.

## UI — PrimeNG wszędzie (bez Tailwind)

**Decyzja:** jedna biblioteka na cały front — katalog publiczny i panel admina. **Tailwind nie wchodzi do projektu.**

| Obszar | PrimeNG |
|--------|---------|
| Katalog / karty dekoracji | `p-card`, `p-galleria` (v1: jedno zdjęcie), `p-button` |
| Dekolista | `p-dataview` lub lista `p-card` + `p-badge` |
| Formularz zapytania | `p-inputtext`, `p-calendar` (zakres dat), `p-checkbox`, `p-textarea` |
| Sticky menu / layout | `p-menubar`, `p-toolbar`; footer własny SCSS |
| Panel admin — zapytania | `p-table`, filtry `p-datepicker` |
| Scheduler | `p-fullCalendar` / `p-datepicker` + custom widok zajętości (FR-021–023) |
| CRUD dekoracji | `p-table`, `p-dialog`, `p-fileupload` (zdjęcia → S3 przez API) |
| Toast / potwierdzenia | `p-toast`, `p-confirmDialog` |

**Stylowanie:** wyłącznie **SCSS** — globalny `theme/wzrusz-theme.scss` nadpisuje design tokens PrimeNG (kolory, radius, font-family). W komponentach feature: `component.scss` + klasy semantyczne, **bez** utility classes w HTML.

**Instalacja (po scaffoldzie Angular):**

```bash
cd apps/web
npm install primeng @primeng/themes primeicons
```

W `app.config.ts`: `provideAnimationsAsync()`, import presetu PrimeNG (Aura lub własny preset oparty o tokeny Wzrusz).

**Angular Material:** nie dodawać — unikamy dwóch systemów komponentów.

## AWS — architektura MVP

```
[Użytkownik] → CloudFront → S3 (Angular build)
              → ALB → ECS Fargate / Elastic Beanstalk (Nest API)
              → RDS PostgreSQL
              → SES (email admin + klient)
              → S3 (zdjęcia dekoracji, osobny bucket)
```

| Usługa | Rola |
|--------|------|
| **S3 + CloudFront** | Hosting SPA Angular (`apps/web`) |
| **ECS Fargate** lub **Elastic Beanstalk** | Nest API — EB prostsze na solo MVP |
| **RDS PostgreSQL** | katalog, zapytania, rezerwacje, magazyn |
| **SES** | FR-011, FR-026 (notyfikacje) |
| **S3** | upload zdjęć dekoracji (admin CRUD) |
| **Secrets Manager** | DB URL, JWT secret, SES |

**Uproszczenie na ~3 tyg. (zaktualiz. 2026-05-31):** Angular **SSR** na EB (`wzrusz-web`) + Nest na EB (`wzrusz-api`) + RDS. **Nie** Amplify static — SEO wymaga Node SSR. S3 osobno na **zdjęcia dekoracji** (admin upload), nie na hosting SPA/SSR.

CI: GitHub Actions → build Nx → deploy front (S3) + API (EB).

## Scaffold Nx + Angular + Nest (nie preset React!)

Rejestr kursu ma `starter_id: nx` z **react-monorepo** — **odrzuć** ten template.

### Krok 1 — workspace Angular (sam Nest **nie** powstaje)

```bash
npx create-nx-workspace@latest wzrusz \
  --preset=angular-monorepo \
  --appName=web \
  --style=scss \
  --routing=true \
  --ssr=true \
  --pm=npm \
  --nxCloud=skip \
  --interactive=false
```

Wynik kroku 1: **Nx monorepo + Angular** (`apps/web`). **Bez Nest** — to normalne.

### Krok 2 — Nest w tym samym repo (obowiązkowy — krok 1 daje tylko Angular)

```bash
cd wzrusz
npx nx add @nx/nest
npx g @nx/nest:application apps/api \
  --frontendProject=web \
  --strict=true \
  --unitTestRunner=jest
```

Po kroku 2 w repo są **dwa projekty Nx**: `web` (Angular) i `api` (Nest) w układzie `apps/web` + `apps/api`.

### Krok 3 — PrimeNG + theme Wzrusz

```bash
npm install primeng @primeng/themes primeicons @angular/animations
```

W `app.config.ts`: `provideAnimationsAsync()` + `providePrimeNG({ theme: { preset: Aura } })`.  
Tokeny marki w `apps/web/src/styles.scss` (`--wzrusz-bg`, `--wzrusz-accent`). Skopiuj logo i fonty do `apps/web/public/brand/`.

### Krok 4 — struktura logiczna (docelowo)

- `apps/web` — moduły: `public` (katalog, Dekolista, formularz), `admin` (lazy `/admin`)
- `apps/api` — moduły Nest: auth, decorations, inquiries, reservations, scheduler, mail
- `libs/shared/types` — współdzielone typy/DTO (opcjonalnie)

Po scaffoldzie: **nie** uruchamiaj `/10x-bootstrapper` z domyślnym presetem `nx` (React) — użyj komend powyżej.
