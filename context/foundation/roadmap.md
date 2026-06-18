---
project: "Wzrusz"
version: 1
status: draft
created: 2026-05-25
updated: 2026-06-18
prd_version: 1
main_goal: learn
top_blocker: content
---

# Roadmap: Wzrusz

> Derived from `context/foundation/prd.md` (v1) + auto-researched codebase baseline.
> Edit-in-place; archive when superseded.
> Slices below are listed in dependency order. The "At a glance" table is the index.

## Vision recap

Właściciel firmy dekoracyjnej traci czas, gdy zapytania o dekoracje na termin żyją poza jednym systemem — Excel nie pokazuje stanu magazynowego i dostępności w jednym miejscu. Produkt to katalog z orientacyjnym stanem plus ścieżka zapytania i ręcznego zatwierdzenia (scheduler → zatwierdzenie → obniżenie stanu), nie sklep e-commerce.

Rdzeń wartości — to, co odróżnia produkt od „kolejnego formularza kontaktowego” — to spięcie zapytania klienta z oceną dostępności na termin i aktualizacją magazynu po decyzji admina.

## North star

**S-10: admin-approve-reservation** — **admin może zatwierdzić zapytanie po sprawdzeniu dostępności, a stan magazynowy maleje zgodnie z zatwierdzeniem** — to jest moment, w którym hipoteza produktu („zamiast Excela”) jest naprawdę sprawdzona; powiązane z `main_goal: learn` (TypeORM, reguły dostępności, panel admina) i z wybranym przez Ciebie celem jakości (bezpieczna logika magazynu, testowalność).

> **Gwiazda przewodnia** — najmniejszy sensowny przebieg end-to-end, który dowodzi, że produkt działa; tutaj w dwóch fazach zgodnie z Twoim wyborem: **faza A (S-05)** dowodzi US-01 (gość → zapytanie w panelu); **faza B (S-10)** domyka US-02 (zatwierdzenie + magazyn). S-10 stoi jak najwcześniej pozwala graf zależności — nie odkładamy go za „ładniejszy katalog”.

## At a glance

| ID | Change ID | Outcome (user can …) | Prerequisites | PRD refs | Status |
|---|---|---|---|---|---|
| F-01 | minimal-data-persistence | (foundation) persistence layer wired; core entities migratable | — | NFR (dane kontaktowe), Business Logic | done |
| F-02 | admin-auth-scaffold | (foundation) admin can authenticate; admin-only routes enforced | F-01 | FR-013, FR-014, FR-015, Access Control | done |
| F-03 | media-storage-enabler | (foundation) decoration images storable and servable via object storage | F-01 | FR-005, FR-018 | done |
| F-04 | ses-notifications-enabler | (foundation) SES production access for client emails | — | FR-011, FR-026, lessons (SES) | partial |
| S-01 | public-shell-and-home | navigate public site with header, sticky nav, footer, hero | — | FR-001, FR-002, FR-003 | done |
| S-02 | catalog-browse | browse categories and see decoration cards with stock | F-01, S-01 | FR-004, FR-005 | done |
| S-03 | dekolista | add decorations to Dekolista and review before form | S-02 | FR-006, FR-007 | done |
| S-04 | inquiry-form-and-preview | fill inquiry form and preview auto-message | S-03 | FR-008, FR-009, FR-010 | done |
| S-05 | inquiry-submit-and-admin-inbox | submit inquiry; admin gets email + panel entry | S-04, F-01, F-04 | FR-011, FR-012, US-01 | done |
| S-06 | admin-login-and-shell | admin logs in; non-admin blocked from panel | F-02, S-01 | FR-013, FR-014, FR-015 | done |
| S-07 | admin-catalog-and-stock | CRUD decorations/categories and set stock | S-06, F-01, F-03 | FR-018, FR-019, FR-020 | done |
| S-08 | admin-inquiry-detail | filter inquiries by date and open details | S-06, S-05 | FR-016, FR-017 | done |
| S-09 | admin-scheduler-view | view scheduler; hover shows occupied decorations | S-07, S-08 | FR-021, FR-022 | done |
| S-10 | admin-approve-reservation | check availability, adjust qty, approve, stock down | S-09 | FR-023, FR-024, FR-025, US-02 | done |
| S-11 | admin-success-email-action | send success email to client via button | S-10, F-04 | FR-026 | done |

## Streams

Navigation aid — groups items that share a Prerequisites chain. Canonical ordering still lives in the dependency graph below.

| Stream | Theme | Chain | Note |
|---|---|---|---|
| A | Ścieżka gościa (US-01) | `F-01` → `S-01` → `S-02` → `S-03` → `S-04` → `S-05` | Faza A gwiazdy; `S-01` może startować równolegle z `F-01` (layout bez DB) |
| B | Panel admina — katalog i zapytania | `F-02` → `S-06` → `S-07` → `S-08` | `F-03` wchodzi przed pełnym CRUD zdjęć (`S-07`) |
| C | Scheduler i zatwierdzenie (US-02) | `S-09` → `S-10` → `S-11` | Dołącza do B po `S-08`; `S-10` blocked do czasu reguł schedulera |
| D | Infra produktowa (email, media) | `F-04` / `F-03` | `F-04` przed `S-05`; `F-03` przed realnym uploadem w `S-07` |

## Baseline

What's already in place in the codebase as of `2026-05-25` (auto-researched + user-confirmed).
Foundations below assume these are present and do NOT re-scaffold them.

- **Frontend:** present — Angular 21 + PrimeNG + SSR; public shell, katalog, Dekolista, formularz zapytania, admin panel (katalog CRUD, zapytania, scheduler, zatwierdzanie), brand WebP + SEO meta (2026-06-18)
- **Backend / API:** present — NestJS + TypeORM; catalog, inquiry, auth JWT, media S3/stub, email SES/stub, scheduler, approval
- **Data:** present — RDS staging, migracje EB postdeploy, seed katalogu + scheduler
- **Auth:** present — JWT admin, `AdminAuthGuard`, seed `admin@wzrusz.local`
- **Deploy / infra:** present — EB web+api staging, GitHub Actions, S3 media, SES sandbox
- **Observability:** absent — tylko health endpoint

## Foundations

### F-01: Minimal data persistence

- **Outcome:** (foundation) persistence layer is wired to RDS; migrations run in CI/deploy path; core entities exist for categories, decorations, inquiries (minimal fields for downstream slices).
- **Change ID:** minimal-data-persistence
- **PRD refs:** Business Logic, NFR (dane kontaktowe tylko dla admina)
- **Unlocks:** S-02, S-05, S-07, S-08, S-09, S-10
- **Prerequisites:** —
- **Parallel with:** S-01
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Bez tego każdy slice katalogu/zapytań byłby mockiem — ale foundation ograniczamy do minimalnego kontraktu, nie „całej warstwy danych”.
- **Status:** done

### F-02: Admin auth scaffold

- **Outcome:** (foundation) internal user can log in with email/password; role `admin` gates admin UI/API; role `user` exists in model (szczegóły uprawnień — Open Question).
- **Change ID:** admin-auth-scaffold
- **PRD refs:** FR-013, FR-014, FR-015, Access Control
- **Unlocks:** S-06, S-07, S-08, S-09, S-10, S-11
- **Prerequisites:** F-01
- **Parallel with:** F-03, F-04
- **Blockers:** —
- **Unknowns:**
  - Jakie uprawnienia ma rola `user` w MVP? — Owner: user. Block: no (admin-only panel wystarczy na start).
- **Risk:** Jakość i nauka — auth warto zrobić wcześnie, żeby panel nie był „otwarty na stagingu”.
- **Status:** done

### F-03: Media storage enabler

- **Outcome:** (foundation) admin-uploaded decoration images land in object storage and are referenced by API (jedno zdjęcie na kartę w v1).
- **Change ID:** media-storage-enabler
- **PRD refs:** FR-005, FR-018
- **Unlocks:** S-07 (pełny CRUD z prawdziwym zdjęciem)
- **Prerequisites:** F-01
- **Parallel with:** F-02, F-04, S-01
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Można tymczasowo seedować URL-e w `S-02`, ale bez F-03 admin CRUD zdjęć nie jest prawdziwy E2E.
- **Status:** done

### F-04: SES notifications enabler

- **Outcome:** (foundation) verified sending domain / SES production access; aplikacja może wysłać mail transakcyjny na dowolny adres klienta i admina.
- **Change ID:** ses-notifications-enabler
- **PRD refs:** FR-011, FR-026
- **Unlocks:** S-05, S-11
- **Prerequisites:** —
- **Parallel with:** F-01, S-01
- **Blockers:** external — brak domeny → SES production access
- **Unknowns:** —
- **Risk:** Kod + sandbox staging OK; maile do klientów wymagają domeny lub ręcznej weryfikacji odbiorcy w sandboxie.
- **Status:** partial

## Slices

### S-01: Public shell and home

- **Outcome:** user can navigate public pages with consistent header, sticky menu (hide on scroll down, show on scroll up), footer, and see a hero explaining the service.
- **Change ID:** public-shell-and-home
- **PRD refs:** FR-001, FR-002, FR-003
- **Prerequisites:** —
- **Parallel with:** F-01, F-04
- **Blockers:** —
- **Unknowns:**
  - Jakie sekcje w footerze na MVP (kontakt, regulamin, social)? — Owner: user. Block: no.
- **Risk:** SSR na EB już działa — ten slice ćwiczy layout bez blokowania na DB; dobry start przy `learn`.
- **Status:** done

### S-02: Catalog browse

- **Outcome:** user can browse decoration categories and open a category page with cards (one image, description, orientacyjny stan magazynowy).
- **Change ID:** catalog-browse
- **PRD refs:** FR-004, FR-005
- **Prerequisites:** F-01, S-01
- **Parallel with:** F-02
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Wymaga seeded catalog data lub minimalnego admin seed — planowane w `/10x-plan`, nie osobny „DB slice”.
- **Status:** done

### S-03: Dekolista

- **Outcome:** user can add any number of decorations to Dekolista and review the list before the inquiry form (readable summary for long lists).
- **Change ID:** dekolista
- **PRD refs:** FR-006, FR-007
- **Prerequisites:** S-02
- **Parallel with:** F-02
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Stan listy client-side w MVP — integracja z API dopiero przy submit (`S-05`).
- **Status:** done

### S-04: Inquiry form and preview

- **Outcome:** user can fill the inquiry form (dates/times, transport, invoice), see auto-generated message preview from form fields, and proceed to send.
- **Change ID:** inquiry-form-and-preview
- **PRD refs:** FR-008, FR-009, FR-010
- **Prerequisites:** S-03
- **Parallel with:** F-02
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Walidacja dat i UX długiej Dekolisty — jakość formularza przed podłączeniem emaili.
- **Status:** done

### S-05: Inquiry submit and admin inbox

- **Outcome:** user can submit an inquiry and see confirmation; admin receives email notification and sees the inquiry entry in the admin panel list.
- **Change ID:** inquiry-submit-and-admin-inbox
- **PRD refs:** FR-011, FR-012, US-01
- **Prerequisites:** S-04, F-01, F-04
- **Parallel with:** S-06
- **Blockers:** —
- **Unknowns:** —
- **Risk:** **Faza A gwiazdy przewodniej** — pierwszy dowód, że gość → panel admina działa.
- **Status:** done

### S-06: Admin login and shell

- **Outcome:** admin can log in with email/password and reach an admin shell; non-admin users cannot access admin routes.
- **Change ID:** admin-login-and-shell
- **PRD refs:** FR-013, FR-014, FR-015
- **Prerequisites:** F-02, S-01
- **Parallel with:** S-05
- **Blockers:** —
- **Unknowns:**
  - Uprawnienia roli `user` w MVP? — Owner: user. Block: no dla samego logowania admina.
- **Risk:** Admin routes `Client` SSR per deploy-plan — spójność z auth guard.
- **Status:** done

### S-07: Admin catalog and stock

- **Outcome:** admin can create, edit, delete decorations and categories and set/update stock levels shown in the public catalog.
- **Change ID:** admin-catalog-and-stock
- **PRD refs:** FR-018, FR-019, FR-020
- **Prerequisites:** S-06, F-01, F-03
- **Parallel with:** S-08
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Bez F-03 zdjęcia mogą być placeholder — upload WebP cropper wdrożony (F-03 done).
- **Status:** done

### S-08: Admin inquiry detail

- **Outcome:** admin can filter inquiries by date and open inquiry details (client data, Dekolista items, dates, transport, invoice).
- **Change ID:** admin-inquiry-detail
- **PRD refs:** FR-016, FR-017
- **Prerequisites:** S-06, S-05
- **Parallel with:** S-07
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Długa Dekolista w widoku admina — czytelność jak w PRD (scroll/skrót).
- **Status:** done

### S-09: Admin scheduler view

- **Outcome:** admin can view a scheduler of terms/events and on hover see which decorations are occupied for a term.
- **Change ID:** admin-scheduler-view
- **PRD refs:** FR-021, FR-022
- **Prerequisites:** S-07, S-08
- **Parallel with:** —
- **Blockers:** —
- **Unknowns:**
  - Czy termin z formularza klienta jest tylko widoczny tekstowo w MVP (bez auto-sync ze schedulerem)? — Owner: user. Block: no (zgodne z Non-Goals PRD).
- **Risk:** UI schedulera (PrimeNG) — duży obszar nauki; oddzielony od reguł zatwierdzenia.
- **Status:** done

### S-10: Admin approve reservation

- **Outcome:** admin can see availability check result for inquiry decorations on the inquiry date, adjust quantities, approve reservation, and stock decreases without going negative.
- **Change ID:** admin-approve-reservation
- **PRD refs:** FR-023, FR-024, FR-025, US-02
- **Prerequisites:** S-09
- **Parallel with:** —
- **Blockers:** —
- **Unknowns:**
  - Reguły dostępności schedulera (częściowe ilości, wiele eventów, montaż/demontaż)? — Owner: user. Block: no (MVP reguły wdrożone; dopracowanie później).
- **Risk:** **Faza B gwiazdy przewodniej** — rdzeń Business Logic; MVP availability + approve + stock decrement shipped.
- **Status:** done

### S-11: Admin success email action

- **Outcome:** admin can send a success confirmation email to the client via button after approval (not fully automatic in MVP).
- **Change ID:** admin-success-email-action
- **PRD refs:** FR-026
- **Prerequisites:** S-10, F-04
- **Parallel with:** —
- **Blockers:** external — SES production (F-04 partial) dla maili na dowolne adresy; sandbox + weryfikacja odbiorcy OK
- **Unknowns:**
  - Szablon treści maila sukcesu (język, pola)? — Owner: user. Block: no.
- **Risk:** Przycisk + stamp w DB działają; pełna produkcja maili czeka na domenę.
- **Status:** done

## Backlog Handoff

| Roadmap ID | Change ID | Status | Notes |
|---|---|---|---|
| F-01 | minimal-data-persistence | done | archived |
| F-02 | admin-auth-scaffold | done | archived (`admin-auth-and-shell`) |
| F-03 | media-storage-enabler | done | archived |
| F-04 | ses-notifications-enabler | **partial** | aktywny w `context/changes/` — czeka na domenę |
| S-01 … S-11 | (patrz At a glance) | done | kod na staging; treści produktowe odkładane |

**Aktywny change:** tylko `ses-notifications-enabler` (F-04 partial).

**Następne (poza kodem):** zdjęcia katalogu, FAQ/regulamin, domena + SES production access.

## Open Roadmap Questions

1. **Rola `user`** — jakie dokładnie uprawnienia w MVP (tylko odczyt zapytań, edycja katalogu, brak zatwierdzania)? Owner: user. Block: `S-06`, `S-07` (częściowo).
2. **Spięcie terminu** — kiedy zakres dat/godzin z formularza łączy się ze schedulerem automatycznie? Owner: user. Block: roadmap-wide (MVP: tekstowo w zapytaniu).
3. **Mapa transportu** — integracja mapy vs pole tekstowe (v2)? Owner: user. Block: `—` (parked).
4. **Scheduler — reguły dostępności** — jak liczyć konflikt przy częściowych ilościach, wielu eventach, montażu/demontażu? Owner: user. Block: **`S-10`**.
5. **Email do klienta po sukcesie** — szablon treści, język, automatyzacja w przyszłości? Owner: user. Block: `S-11` (no).
6. **Footer — treść** — jakie sekcje na MVP? Owner: user. Block: **resolved** (`design-brief.md` locked 2026-06-18).

## Parked

- **Pełny sklep e-commerce, płatności, konto klienta** — Why parked: PRD §Non-Goals.
- **Galeria wielu zdjęć + lightbox (FR-027)** — Why parked: v2 nice-to-have.
- **Mapa adresu transportu** — Why parked: PRD §Non-Goals v1.
- **Automatyczny mail sukcesu bez akcji admina** — Why parked: PRD §Non-Goals.
- **Multi-tenant / wiele firm** — Why parked: PRD §Non-Goals.
- **Auto-sync formularz ↔ scheduler** — Why parked: PRD §Non-Goals MVP.
- **HTTPS / własna domena** — Why parked: brak domeny; blokuje SES production access i profesjonalny FROM.
- **Treść katalogu (zdjęcia dekoracji)** — Why parked: decyzja właściciela; upload technicznie gotowy (F-03).
- **FAQ / regulamin / polityka prywatności** — Why parked: strony Coming soon; treść później.
- **Hero copy, NIP, Facebook** — Why parked: decyzje produktowe (`design-brief.md` §Otwarte).
- **Pełne SSR body w View Source** — Why parked: znany WARN w `verify-deploy.sh`; nie blokuje roadmapy produktowej.

## Done

MVP techniczne zamknięte 2026-06-18. Change foldery zarchiwizowane w `context/archive/`.

- **F-01: Minimal data persistence** — TypeORM + RDS + migracje EB.
- **F-02: Admin auth scaffold** — JWT + `AdminAuthGuard`.
- **F-03: Media storage enabler** — S3 staging + cropper WebP + local stub.
- **S-01 … S-04** — public shell, katalog, Dekolista, formularz zapytania.
- **S-05: Inquiry submit + admin inbox** — persist + notify (SES sandbox).
- **S-06: Admin login and shell** — panel admina.
- **S-07: Admin catalog and stock** — CRUD + upload zdjęć.
- **S-08: Admin inquiry detail** — filtr + szczegóły + availability.
- **S-09: Admin scheduler view** — kalendarz + hover zajętych dekoracji.
- **S-10: Admin approve reservation** — zatwierdzenie + obniżenie stanu (MVP reguły).
- **S-11: Admin success email** — przycisk + stamp; pełna produkcja maili → F-04.

**Otwarte:** F-04 partial (`ses-notifications-enabler`) — production access po zakupie domeny.
