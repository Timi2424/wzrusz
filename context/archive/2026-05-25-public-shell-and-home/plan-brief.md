# Public shell and home — Plan Brief

> Full plan: `context/changes/public-shell-and-home/plan.md`
> Roadmap: S-01 in `context/foundation/roadmap.md`

## What & Why

Gość widzi dziś gołą stronę Home bez spójnego layoutu. S-01 dodaje publiczny shell (header + sticky nav + footer) i sekcję hero na stronie głównej — fundament pod katalog (S-02) bez blokowania na API/DB.

## Starting Point

- `apps/web`: Angular 21 + PrimeNG + SSR; jedna trasa `Home`; `PageSeoService` działa.
- Brak layoutu, headera, footera, scroll behavior.
- Kolory/fonty w `styles.scss` (`--wzrusz-*`).

## Desired End State

Wszystkie publiczne trasy renderują się w `PublicShellLayout` z nagłówkiem i stopką. Menu sticky: ukryte przy scroll w dół, widoczne przy scroll w górę; link Dekolisty w pasku. Home ma sekcję hero z celem serwisu. Build/test/SSR przechodzą; staging deploy bez regresji.

## Key Decisions

| Decision | Choice | Why |
| --- | --- | --- |
| Layout | Parent route + `router-outlet` | Jedna definicja header/footer dla przyszłych stron |
| Sticky nav | Scroll controller + CSS transform | FR-002 bez ciężkiej biblioteki |
| Placeholder routes | `/katalog`, `/dekolista` → ComingSoon | Nawigacja działa bez 404 przed S-02/S-03 |
| Footer MVP | Kontakt + copyright | OQ #6 nierozstrzygnięte — minimalna treść |

## Phases

| Phase | Delivers |
| --- | --- |
| 1. Shell components | Header, footer, layout, routing |
| 2. Sticky scroll | FR-002 behavior + testy |
| 3. Hero + polish | FR-003 hero, SEO, manual SSR/staging |
