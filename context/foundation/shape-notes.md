---
project: "Wzrusz"
context_type: greenfield
created: 2026-05-25
updated: 2026-05-25
product_type: web-app
target_scale:
  users: small
  qps: low
  data_volume: small
timeline_budget:
  mvp_weeks: 3
  hard_deadline: null
  after_hours_only: true
checkpoint:
  current_phase: 8
  phases_completed: [1, 2, 3, 4, 5, 6, 7]
  gray_areas_resolved:
    - topic: "pain category"
      decision: "Koordynacja rezerwacji na termin + workflow admina (zapytanie → scheduler → zatwierdzenie) + prezentacja danych zamiast Excela"
    - topic: "primary persona scope"
      decision: "Klienci zewnętrzni (osoby prywatne) składają zapytania; właściciel firmy dekoracyjnej jako operator w panelu admina"
    - topic: "auth strategy"
      decision: "Klient bez konta (formularz publiczny). Admin: login wymagany; role admin i user w modelu dostępu; panel admina widoczny tylko dla admina"
    - topic: "inquiry delivery"
      decision: "Formularz wysyła zapytanie na email oraz zapisuje w aplikacji (panel admina)"
    - topic: "mvp scope"
      decision: "Scope-down na ~3 tyg. after-hours; v2: galeria wielu zdjęć + lightbox; v1: jedno zdjęcie na kartę, scheduler z auto-dostępnością i reszta głównego flow"
    - topic: "sticky navigation"
      decision: "Menu chowa się przy scroll w dół; pojawia się sticky przy scroll w górę"
    - topic: "selection list naming"
      decision: "Dekolista (zamiast koszyka) — nazwa UX listy wyboru dekoracji"
    - topic: "dekolista size limit"
      decision: "Brak twardego limitu — klient może dodać dowolną liczbę dekoracji do Dekolisty"
  frs_drafted: 27
  quality_check_status: accepted
---

## Vision & Problem Statement

Właściciel firmy dekoracyjnej traci czas i kontrolę, gdy klient pisze, że potrzebuje dekoracji z katalogu na konkretny termin. Zapytanie trafia poza jednym systemem (Excel), stan magazynowy i dostępność na datę nie są widoczne w jednym miejscu, a domknięcie rezerwacji wymaga ręcznej pracy zamiast przejrzystego przepływu zatwierdzenia.

Insight: produkt nie jest sklepem e-commerce na start — to katalog z widocznym stanem magazynowym plus ścieżka zapytania i ręcznego zatwierdzenia przez właściciela (scheduler → zatwierdzenie → obniżenie stanu). Automatyzuje usługę rezerwacji i prezentację danych dekoracji bez wystawiania pełnego sklepu.

## User & Persona

### Primary persona — klient (osoba prywatna)

Osoba prywatna planująca event (np. wesele, urodziny), która przegląda katalog dekoracji, widzi orientacyjny stan/dostępność i wysyła zapytanie o zestaw na dany termin przez formularz (bez zakupu online w MVP).

### Secondary persona — właściciel firmy dekoracyjnej

Właściciel/operator firmy dekoracyjnej: odbiera zapytania w panelu admina, w schedulerze przypisuje ilości dekoracji na termin, zatwierdza rezerwację i spodziewa się automatycznej aktualizacji stanu magazynowego.

## Access Control

### Klient (publiczny)

- Brak konta i logowania w MVP.
- Dostęp: publiczny katalog dekoracji (ze stanem magazynowym / dostępnością) + formularz zapytania.
- Formularz po wysłaniu: powiadomienie email do firmy oraz zapis zapytania w aplikacji (widoczne w panelu admina).

### Admin / użytkownicy wewnętrzni

- Wymagany login (email + hasło) dla użytkowników wewnętrznych.
- Role w modelu dostępu:
  - **admin** — pełny dostęp do panelu admina (zapytania, scheduler, zatwierdzanie, magazyn).
  - **user** — rola wewnętrzna zdefiniowana w produkcie (szczegóły uprawnień do doprecyzowania w Fazie 4/FR; na MVP zakładamy istnienie roli, nie pełny RBAC dla wielu pracowników).
- Panel admina: widoczny i dostępny **tylko** dla roli **admin** (klient nigdy nie widzi panelu).

## Success Criteria

### Primary — end-to-end MVP flow

**Klient (publiczny, bez konta)**

1. Strony publiczne: stałe menu nawigacji + **footer**; menu **chowa się przy scroll w dół**, **sticky wraca przy scroll w górę**.
2. Strona główna: hero z informacją o celu serwisu.
3. Katalog z kategoriami dekoracji → przejście do strony kategorii.
4. Strona kategorii: karty dekoracji (**jedno zdjęcie** na kartę + krótki opis + orientacyjny stan magazynowy). *v2: galeria wielu zdjęć, przewijanie, lightbox.*
5. Klient dodaje **dowolną liczbę** dekoracji do **Dekolisty** („Dodaj do Dekolisty”) → podgląd Dekolisty → zatwierdzenie listy → formularz zapytania:
   - dane: imię, nazwisko, telefon, email;
   - termin: zakres daty i godziny (na MVP **nie** spięty automatycznie ze schedulerem admina);
   - transport: tak/nie; jeśli tak — **adres tekstowy** (mapa → v2);
   - faktura: tak/nie; jeśli tak — dane do faktury;
   - pod formularzem: generowany placeholder wiadomości (np. „Cześć, jestem X i chciałabym wypożyczyć \<lista\> na termin od … do …”) na podstawie wpisanych danych.
6. Wysłanie formularza → komunikat dla klienta „wysłano”. Admin: email-notyfikacja (wejście do panelu) + wpis zapytania w panelu.

**Admin (rola admin)**

8. Logowanie → lista zapytań o dekoracje z filtrowaniem po dacie.
9. CRUD: admin może dodawać/edytować dekoracje widoczne w katalogu publicznym.
10. Otwarcie zapytania → **scheduler**: widok terminów; po najechaniu widać już zajęte dekoracje; system **automatycznie sprawdza**, czy dekoracje z zapytania są dostępne w wybranym terminie zapytania.
11. Jeśli dostępne: admin zatwierdza event/rezerwację → **spadek stanu magazynowego**; możliwe **ręczne poprawki** przed/po zatwierdzeniu.
12. Po zatwierdzeniu: admin ma **przycisk** do wysłania emaila do klienta z informacją o powodzeniu (email do klienta niekoniecznie w pełni automatyczny — świadome wysłanie przez admina).

### Secondary

- Klient widzi orientacyjny stan magazynowy przy dekoracjach w katalogu (bez gwarancji rezerwacji do momentu zatwierdzenia przez admina).
- Email do admina służy głównie jako notyfikacja „wejdź do panelu”, nie jako miejsce obsługi rezerwacji.

### Guardrails

- Klient nigdy nie widzi panelu admina.
- Zatwierdzenie rezerwacji nie może obniżyć stanu magazynowego poniżej zera (konflikt dostępności musi być widoczny przed zatwierdzeniem).
- Zakres dat z formularza klienta musi być czytelny dla admina nawet bez automatycznego spięcia z schedulerem w MVP.
- Długa Dekolista nie może blokować wysłania zapytania ani ukrywać kluczowych pól formularza (guardrail UX).

## Open Questions

1. **Rola `user`** — jakie dokładnie uprawnienia w MVP (tylko odczyt zapytań, edycja katalogu, brak zatwierdzania)?
2. **Spięcie terminu** — kiedy formularz (zakres dat/godzin) łączy się ze schedulerem automatycznie (post-MVP vs częściowe w MVP)?
3. **Mapa transportu** — wybór dostawcy (Google Maps, OpenStreetMap, tylko pole tekstowe adresu).
4. **Scheduler — reguły dostępności** — jak liczyć konflikt przy częściowych ilościach, wielu eventach w tym samym dniu, czasie montażu/demontażu?
5. **Email do klienta po sukcesie** — szablon, język, czy w przyszłości w pełni automatyczny po zatwierdzeniu.
6. **Footer — treść** — jakie sekcje w statycznym footerze na MVP (kontakt, regulamin, social)?

## Functional Requirements

### Layout i nawigacja (strony publiczne)

- FR-001: Gość widzi na stronach publicznych spójny nagłówek z menu nawigacji i stopkę (footer). Priority: must-have
- FR-002: Gość widzi menu nawigacji w trybie sticky: **ukryte przy scroll w dół**, **widoczne przy scroll w górę**; dostęp do Dekolisty z paska. Priority: must-have
  > Socrates: Counter: „zbędna animacja na mobile”. Resolution: kept — szybki powrót do nawigacji i Dekolisty ważniejszy niż minimal UI.

### Katalog i zapytanie (gość)

- FR-003: Gość widzi stronę główną z sekcją hero (cel serwisu). Priority: must-have
- FR-004: Gość przegląda kategorie dekoracji i przechodzi do strony kategorii. Priority: must-have
- FR-005: Gość na stronie kategorii widzi karty dekoracji (jedno zdjęcie, opis, orientacyjny stan magazynowy). Priority: must-have
- FR-006: Gość dodaje do **Dekolisty** dowolną liczbę dekoracji (bez twardego limitu ilości pozycji). Priority: must-have
  > Socrates: Counter: „duża lista utrudnia adminowi i schedulerowi”. Resolution: brak limitu — właściciel chce pełną swobodę wyboru; UI podsumowania i panel admina muszą obsłużyć długą listę (scroll, czytelny skrót).
- FR-007: Gość przegląda i zatwierdza **Dekolistę** przed formularzem zapytania. Priority: must-have
- FR-008: Gość wypełnia formularz zapytania (dane osobowe, zakres dat/godzin, transport, faktura). Priority: must-have
- FR-009: Gość widzi podgląd auto-wiadomości generowanej z pól formularza. Priority: must-have
- FR-010: Gość wysyła zapytanie i widzi potwierdzenie wysłania. Priority: must-have
- FR-011: System wysyła email-notyfikację do admina o nowym zapytaniu. Priority: must-have
- FR-012: System zapisuje zapytanie widoczne w panelu admina. Priority: must-have

### Panel admina

- FR-013: Admin loguje się przez email i hasło. Priority: must-have
- FR-014: Tylko użytkownik z rolą admin ma dostęp do panelu admina. Priority: must-have
- FR-015: System przechowuje role wewnętrzne admin i user (uprawnienia user — Open Questions). Priority: must-have
- FR-016: Admin filtruje listę zapytań po dacie. Priority: must-have
- FR-017: Admin otwiera szczegóły zapytania (dane klienta, wybrane dekoracje, termin, transport, faktura). Priority: must-have
- FR-018: Admin tworzy, edytuje i usuwa dekoracje w katalogu publicznym. Priority: must-have
- FR-019: Admin zarządza kategoriami dekoracji. Priority: must-have
- FR-020: Admin ustawia i aktualizuje stan magazynowy dekoracji. Priority: must-have
- FR-021: Admin widzi scheduler terminów i eventów. Priority: must-have
- FR-022: Admin po najechaniu na termin w schedulerze widzi zajęte dekoracje. Priority: must-have
- FR-023: System sprawdza dostępność dekoracji z zapytania na termin podany w zapytaniu. Priority: must-have
  > Socrates: Counter: „za dużo logiki na MVP”. Resolution: kept — to rdzeń wartości vs Excel; szczegóły reguł w Open Questions.
- FR-024: Admin ręcznie koryguje ilości rezerwacji przed zatwierdzeniem. Priority: must-have
- FR-025: Admin zatwierdza rezerwację i system obniża stan magazynowy. Priority: must-have
- FR-026: Admin wysyła email z potwierdzeniem sukcesu do klienta (akcja przyciskiem). Priority: must-have

### Później (v2)

- FR-027: Gość przegląda galerię wielu zdjęć na karcie dekoracji z lightboxem. Priority: nice-to-have

## MVP scope — v1 vs v2

| v1 (MVP, ~3 tyg.) | v2 (później) |
|-------------------|--------------|
| Jedno zdjęcie na kartę dekoracji | Galeria wielu zdjęć, ręczne przewijanie, lightbox / podgląd HQ |
| Adres transportu — pole tekstowe | Mapa (wybór punktu / integracja) |
| Termin z formularza widoczny dla admina; scheduler z auto-sprawdzaniem dostępności przy zatwierdzaniu | Pełne spięcie terminu formularz ↔ scheduler |
| Reszta Primary flow (hero, kategorie, Dekolista bez limitu, formularz, panel, CRUD, magazyn, emaile) | — |

## User Stories

### US-01: Klient składa zapytanie przez katalog i Dekolistę

- **Given** gość na stronie publicznej bez konta
- **When** przegląda kategorie, dodaje wybrane dekoracje do Dekolisty (bez limitu liczby pozycji), zatwierdza listę, wypełnia formularz (termin, transport, faktura) i wysyła zapytanie
- **Then** widzi potwierdzenie wysłania, a admin otrzymuje email-notyfikację i wpis zapytania w panelu

#### Acceptance Criteria

- Dekolista przyjmuje dowolną liczbę pozycji; podsumowanie pozostaje czytelne (przewijanie / skrót listy)
- Podgląd wiadomości odzwierciedla dane z formularza i pełną listę z Dekolisty
- Sticky menu: ukryte przy scroll w dół, widoczne przy scroll w górę

## Business Logic

System na podstawie stanu magazynowego i istniejących rezerwacji w schedulerze ocenia, czy dekoracje z zapytania klienta są dostępne w podanym terminie, zanim admin zatwierdzi event — admin widzi wynik i może skorygować ilości ręcznie; po zatwierdzeniu stan magazynowy maleje o zatwierdzone ilości (nie poniżej zera).

Wejścia widoczne dla użytkownika: wybór dekoracji i termin z formularza, zajęcia w kalendarzu, bieżący stan magazynowy. Wyjście: decyzja „można zatwierdzić / konflikt” oraz zaktualizowany stan po zatwierdzeniu.

## Non-Functional Requirements

- Strony katalogu ładują się z odczuwalną responsywnością na typowym łączu domowym (bez formalnego SLA w MVP).
- Dane kontaktowe w formularzu zapytania są przechowywane i widoczne tylko dla zalogowanego admina (nie w publicznym API).
- Interfejs publiczny działa w aktualnych wersjach Chrome i Safari (desktop + mobile).

## Non-Goals

- Unikamy: pełnego sklepu e-commerce, płatności online, konta i logowania klienta.
- Unikamy: galerii wielu zdjęć i lightboxa w v1 (→ v2).
- Unikamy: mapy do wyboru adresu transportu w v1 (→ v2; v1: pole tekstowe).
- Unikamy: automatycznego wysyłania maila sukcesu do klienta bez akcji admina (MVP: przycisk).
- Unikamy: platformy multi-tenant / wielu firm dekoracyjnych w jednej instancji.

## Quality cross-check

- Access Control: present
- Business Logic (one-sentence rule): present
- Project artifacts: present
- Timeline-cost ack: present (`mvp_weeks: 3`, scope-down)
- Non-Goals: present
- Preserved behavior: n/a (greenfield)

Otwarte punkty (rola `user`, reguły schedulera, footer CMS) przechodzą do PRD `## Open Questions` — nie blokują `/10x-prd`.
