# WIP — materiały źródłowe marki

Pliki robocze do analizy kolorów i kompozycji. **Nie kasuj** — agent może z nich wycinać/optymalizować wersje do `brand/` lub `decor/`.

## Pliki

| Plik | Rola | Użycie na stronie |
|------|------|-------------------|
| `logo_bez_tla.png` | Logo pełne (oko + słowo), przezroczyste tło | Header — skopiowane do `brand/logo.png` |
| `logo_okragle.png` | Logo w kole na błękicie | Social / avatar — `brand/logo-avatar.png` |
| `logo_kwadratowe.png` | Wersja kwadratowa | Open Graph / share image (później) |
| `logo_kwadrat.jpg` | Wersja JPG | Archiwum / print |
| `fala.png` | Motyw fal (linie) | Akcent dekoracyjny — dół hero, separatory sekcji |
| `iskierki.png` | Para iskier | Akcenty w rogach hero / przy CTA |
| `post.jpg` | Kompozycja referencyjna | Paleta + układ (oko, fale, iskry) — **nie** asset bezpośredni |
| `wizytówka_przód.jpg` | Wizytówka | Potwierdza parę kolorów: błękit + pomarańcz |
| `wizytówka_tył.png` | Wizytówka tył | Kontakt / druga strona |

## Uwaga: nazwa w grafikach

W plikach widać czasem **WERUSZ** / **WARUSZ** — produkt i domena to **Wzrusz**. Przy finalnym eksporcie logo ujednolić pisownię (decyzja w `design-brief.md`).

## Pipeline

1. Edytujesz tutaj (lub dostarczasz nowe pliki).
2. Agent optymalizuje → `public/brand/` lub `public/decor/` (WebP/SVG, mniejszy rozmiar).
3. Kod importuje ścieżki z `core/brand.ts`.
