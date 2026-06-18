---
project: Wzrusz
status: draft
owner: user
updated: 2026-06-18
---

# Design brief — decyzje kreatywne (Ty)

> Źródła robocze: `apps/web/public/wip/`. Produkcja: `brand/`, `decor/`. Ścieżki w `core/brand.ts`.

## Paleta (wyekstrahowana z wip)

| Token | HEX | Użycie |
|-------|-----|--------|
| Krem (baza) | `#FFFAD7` | header, przyciski secondary |
| Błękit (baza) | `#B0E0F0` | tło strony / hero |
| Akcent | `#F06000` | CTA, logo, iskry, fala |
| Ink (tekst / ciemne) | `#01468e` | body, nagłówki, footer tło |
| Ink muted | `#3D5F73` | rezerwa na drugorzędny tekst |

**Vibe:** krem + błękit + granat zamiast czerni; pomarańcz jako akcent (wizytówka + `post.jpg`).

## Assety brand (produkcja)

| Plik | Rola | Status |
|------|------|--------|
| `brand/logo.webp` + `logo.png` | Header wordmark | **locked** — WebP primary, PNG fallback |
| `brand/logo-footer.webp` | Rezerwa (mniejszy wordmark) | wygenerowany, **nie używany w UI** |
| `brand/og-image.webp` + `og-image.png` | Open Graph / Twitter | **locked** (1200×1200 z `wip/logo_kwadratowe.png`) |
| `brand/favicon.png` | Favicon 32px | **locked** |
| `brand/favicon-180.png` | Apple touch | **locked** |
| `brand/logo-avatar.png` | Placeholder katalog / avatar | używany |
| `decor/fala.png`, `decor/iskierki.png` | Akcenty hero | **locked** |

## Logo

| Decyzja | Status |
|---------|--------|
| Wordmark w headerze | **OK** — bez zmiany grafiki |
| Format | **WebP** + PNG fallback (`<picture>`) |
| Pisownia w PNG | Akceptowana w obecnym pliku |
| Panel admina | Bez wordmarku — **OK** |

## SEO / Open Graph

| Element | Implementacja |
|---------|----------------|
| `index.html` | domyślne `description`, `og:*`, `twitter:*` |
| Strona główna | `PageSeoService` + `WZRUSZ_HOME_SEO` |
| `og:image` | `/brand/og-image.webp` (absolutny URL na SSR z nagłówka `Host`) |
| Favicon | bez zmian |

## Footer — **locked** (2026-06-18)

| Sekcja | Treść |
|--------|--------|
| Logo w footerze | **brak** — wordmark tylko w headerze |
| Region | Poznań i okolice |
| Tagline | Dekorowanie wydarzeń · wypożyczalnia dekoracji · dekoracje na zamówienie |
| Telefon | +48 695 707 288 |
| Email | wzrusz.poznan@gmail.com |
| Instagram | [instagram.com/wzrusz.poznan](https://www.instagram.com/wzrusz.poznan/) — aktywny link |
| TikTok | [tiktok.com/@wzrusz.poznan](https://www.tiktok.com/@wzrusz.poznan) — aktywny link |
| Facebook | **wkrótce** (ikona nieaktywna) |
| NIP / dane firmowe | **pominięte** na MVP |
| FAQ / regulamin / polityka | linki → strony Coming soon (treść później) |

## Fonty (TanType)

| Font | Token | Użycie |
|------|-------|--------|
| TAN Garland | `--font-serif` | nagłówki, footer, admin „Wzrusz — panel” |
| TAN Grandeur | `--font-display` | sporadycznie |
| TAN Buster | `--font-logo` | opcjonalnie |
| Wordmark | grafika `logo.webp` | header — **nie font** |

## Otwarte (później)

- Treść FAQ, regulaminu, polityki prywatności
- Link Facebook gdy profil gotowy
- NIP / dane firmowe w footerze
- Własna domena → absolutne URL w OG bez polegania na EB hostname
- Hero copy — dopracowanie tekstu

## Jak aktualizować

1. Nowe wersje grafik → `public/wip/`, potem export do `brand/`.
2. WebP: `logo.webp`, `og-image.webp` (+ PNG fallback). `logo-footer.webp` — opcjonalna rezerwa.
3. Social / kontakt → `core/brand.ts` (`WZRUSZ_SOCIAL`) + `site-footer.ts`.
4. SEO per strona → `core/seo/page-seo.model.ts` + `PageSeoService`.
