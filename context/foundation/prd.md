---
project: "Wzrusz"
version: 1
status: draft
created: 2026-05-25
context_type: greenfield
product_type: web-app
target_scale:
  users: small
  qps: low
  data_volume: small
timeline_budget:
  mvp_weeks: 3
  hard_deadline: null
  after_hours_only: true
---

## Vision & Problem Statement

Właściciel firmy dekoracyjnej traci czas i kontrolę, gdy klient pisze, że potrzebuje dekoracji z katalogu na konkretny termin. Zapytanie trafia poza jednym systemem (Excel), stan magazynowy i dostępność na datę nie są widoczne w jednym miejscu, a domknięcie rezerwacji wymaga ręcznej pracy zamiast przejrzystego przepływu zatwierdzenia.

Produkt nie jest sklepem e-commerce na start — to katalog z widocznym stanem magazynowym plus ścieżka zapytania i ręcznego zatwierdzenia przez właściciela (scheduler → zatwierdzenie → obniżenie stanu). Automatyzuje usługę rezerwacji i prezentację danych dekoracji bez wystawiania pełnego sklepu.

## User & Persona

### Primary persona — klient (osoba prywatna)

Osoba prywatna planująca event (np. wesele, urodziny), która przegląda katalog dekoracji, widzi orientacyjny stan/dostępność i wysyła zapytanie o zestaw na dany termin przez formularz (bez zakupu online w MVP).

### Secondary persona — właściciel firmy dekoracyjnej

Właściciel/operator firmy dekoracyjnej: odbiera zapytania w panelu admina, w schedulerze przypisuje ilości dekoracji na termin, zatwierdza rezerwację i spodziewa się automatycznej aktualizacji stanu magazynowego po zatwierdzeniu.

## Success Criteria

### Primary

- Gość bez konta przechodzi ścieżkę: katalog → Dekolista (dowolna liczba pozycji) → formularz zapytania → potwierdzenie wysłania; admin otrzymuje email-notyfikację i wpis zapytania w panelu.
- Admin zatwierdza zapytanie po widocznej ocenie dostępności dekoracji na termin z zapytania; po zatwierdzeniu stan magazynowy odpowiada zatwierdzonym ilościom (bez wartości ujemnych).

### Secondary

- Klient widzi orientacyjny stan magazynowy przy dekoracjach w katalogu (bez gwarancji rezerwacji do momentu zatwierdzenia przez admina).
- Email do admina służy głównie jako notyfikacja „wejdź do panelu”, nie jako miejsce obsługi rezerwacji.

### Guardrails

- Klient nigdy nie widzi panelu admina.
- Zatwierdzenie rezerwacji nie może obniżyć stanu magazynowego poniżej zera; konflikt dostępności musi być widoczny przed zatwierdzeniem.
- Zakres dat z formularza klienta musi być czytelny dla admina nawet bez automatycznego spięcia terminu formularza ze schedulerem w MVP.
- Długa Dekolista nie może blokować wysłania zapytania ani ukrywać kluczowych pól formularza.

## User Stories

### US-01: Klient składa zapytanie przez katalog i Dekolistę

- **Given** gość na stronie publicznej bez konta
- **When** przegląda kategorie, dodaje wybrane dekoracje do Dekolisty (bez limitu liczby pozycji), zatwierdza listę, wypełnia formularz (termin, transport, faktura) i wysyła zapytanie
- **Then** widzi potwierdzenie wysłania, a admin otrzymuje email-notyfikację i wpis zapytania w panelu

#### Acceptance Criteria

- Dekolista przyjmuje dowolną liczbę pozycji; podsumowanie pozostaje czytelne (przewijanie / skrót listy)
- Podgląd wiadomości odzwierciedla dane z formularza i pełną listę z Dekolisty
- Sticky menu: ukryte przy scroll w dół, widoczne przy scroll w górę

### US-02: Admin zatwierdza rezerwację z schedulera

- **Given** zalogowany admin z dostępem do panelu
- **When** otwiera zapytanie, sprawdza dostępność dekoracji na termin z zapytania w schedulerze, ewentualnie koryguje ilości i zatwierdza rezerwację
- **Then** stan magazynowy maleje zgodnie z zatwierdzeniem, a admin może wysłać email z potwierdzeniem sukcesu do klienta (przycisk)

#### Acceptance Criteria

- Przed zatwierdzeniem widoczny wynik sprawdzenia dostępności (można zatwierdzić / konflikt)
- Po zatwierdzeniu admin ma akcję wysłania maila sukcesu do klienta (nie w pełni automatycznie w MVP)

## Functional Requirements

### Layout i nawigacja (strony publiczne)

- FR-001: Gość widzi na stronach publicznych spójny nagłówek z menu nawigacji i stopkę (footer). Priority: must-have
- FR-002: Gość widzi menu nawigacji w trybie sticky: ukryte przy scroll w dół, widoczne przy scroll w górę; dostęp do Dekolisty z paska. Priority: must-have
  > Socrates: Counter: „zbędna animacja na mobile”. Resolution: kept — szybki powrót do nawigacji i Dekolisty ważniejszy niż minimal UI.

### Katalog i zapytanie (gość)

- FR-003: Gość widzi stronę główną z sekcją hero (cel serwisu). Priority: must-have
- FR-004: Gość przegląda kategorie dekoracji i przechodzi do strony kategorii. Priority: must-have
- FR-005: Gość na stronie kategorii widzi karty dekoracji (jedno zdjęcie, opis, orientacyjny stan magazynowy). Priority: must-have
- FR-006: Gość dodaje do Dekolisty dowolną liczbę dekoracji (bez twardego limitu ilości pozycji). Priority: must-have
  > Socrates: Counter: „duża lista utrudnia adminowi i schedulerowi”. Resolution: brak limitu — pełna swoboda wyboru; UI podsumowania i panel admina muszą obsłużyć długą listę (scroll, czytelny skrót).
- FR-007: Gość przegląda i zatwierdza Dekolistę przed formularzem zapytania. Priority: must-have
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
  > Socrates: Counter: „za dużo logiki na MVP”. Resolution: kept — rdzeń wartości vs Excel; szczegóły reguł w Open Questions.
- FR-024: Admin ręcznie koryguje ilości rezerwacji przed zatwierdzeniem. Priority: must-have
- FR-025: Admin zatwierdza rezerwację i system obniża stan magazynowy. Priority: must-have
- FR-026: Admin wysyła email z potwierdzeniem sukcesu do klienta (akcja przyciskiem). Priority: must-have

### Później (v2)

- FR-027: Gość przegląda galerię wielu zdjęć na karcie dekoracji z lightboxem. Priority: nice-to-have

## Non-Functional Requirements

- Strony katalogu ładują się z odczuwalną responsywnością na typowym łączu domowym (bez formalnego SLA w MVP).
- Dane kontaktowe z formularza zapytania są dostępne wyłącznie zalogowanemu adminowi w panelu (nie dla anonimowego gościa ani innych ról bez uprawnień).
- Interfejs publiczny pozostaje używalny w aktualnych wersjach Chrome i Safari na desktopie i urządzeniach mobilnych.

## Business Logic

Przed zatwierdzeniem rezerwacji produkt ocenia, czy dekoracje z zapytania klienta są dostępne w podanym terminie, na podstawie bieżącego stanu magazynowego i istniejących zajęć w kalendarzu; po zatwierdzeniu przez admina zmniejsza stan magazynowy o zatwierdzone ilości i nie dopuszcza stanu poniżej zera.

Wejścia widoczne dla użytkownika: wybór dekoracji i termin z formularza, zajęcia w kalendarzu, bieżący stan magazynowy. Wyjście: decyzja „można zatwierdzić / konflikt” oraz zaktualizowany stan po zatwierdzeniu. Admin może ręcznie skorygować ilości przed zatwierdzeniem.

## Access Control

### Klient (publiczny)

- Brak konta i logowania w MVP.
- Dostęp: publiczny katalog dekoracji (ze stanem magazynowym / dostępnością) + formularz zapytania.
- Formularz po wysłaniu: powiadomienie email do firmy oraz zapis zapytania w aplikacji (widoczne w panelu admina).

### Admin / użytkownicy wewnętrzni

- Wymagany login (email + hasło) dla użytkowników wewnętrznych.
- Role:
  - **admin** — pełny dostęp do panelu admina (zapytania, scheduler, zatwierdzanie, magazyn, CRUD katalogu).
  - **user** — rola wewnętrzna w modelu; szczegóły uprawnień w Open Questions.
- Panel admina: widoczny i dostępny tylko dla roli **admin** (klient nigdy nie widzi panelu).

## Non-Goals

- Pełny sklep e-commerce, płatności online, konto i logowanie klienta — zapytanie zamiast zakupu.
- Galeria wielu zdjęć i lightbox na karcie dekoracji w v1 (planowane w v2; FR-027 nice-to-have).
- Mapa do wyboru adresu transportu w v1 (v1: pole tekstowe adresu).
- Automatyczne wysłanie maila sukcesu do klienta bez akcji admina (MVP: przycisk po zatwierdzeniu).
- Platforma multi-tenant / wiele niezależnych firm dekoracyjnych w jednej instancji.
- Automatyczne spięcie zakresu dat/godzin z formularza ze schedulerem w MVP (termin widoczny dla admina; pełna synchronizacja → później).

## Open Questions

1. **Rola `user`** — jakie dokładnie uprawnienia w MVP (tylko odczyt zapytań, edycja katalogu, brak zatwierdzania)? Owner: user. Block: częściowa (FR-015 wymaga modelu ról).
2. **Spięcie terminu** — kiedy zakres dat/godzin z formularza łączy się ze schedulerem automatycznie (post-MVP vs częściowe w MVP)? Owner: user.
3. **Mapa transportu** — integracja mapy vs wyłącznie pole tekstowe adresu (v2)? Owner: user.
4. **Scheduler — reguły dostępności** — jak liczyć konflikt przy częściowych ilościach, wielu eventach w tym samym dniu, czasie montażu/demontażu? Owner: user. Block: częściowa (FR-023 bez pełnej specyfikacji reguł).
5. **Email do klienta po sukcesie** — szablon treści, język, czy w przyszłości w pełni automatyczny po zatwierdzeniu? Owner: user.
6. **Footer — treść** — jakie sekcje w statycznym footerze na MVP (kontakt, regulamin, social)? Owner: user.
