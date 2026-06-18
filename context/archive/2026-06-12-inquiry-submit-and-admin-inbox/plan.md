# Plan: inquiry-submit-and-admin-inbox (S-05)

Roadmap slice **S-05** (Stream A). Guest submits inquiry → API persists inquiry + line items → confirmation UI. Email stub until F-04; admin UI until S-06.

## Scope

1. **API** `POST /api/inquiries` — validate payload, transaction save, decoration FK check.
2. **API** `GET /api/inquiries` — summary list **tymczasowo publiczny** (staging: weryfikacja zapisu). **S-06:** ten sam endpoint za `AdminAuthGuard` — nie usuwamy, tylko zamykamy.
3. **Web** — enable submit on review step, success screen, clear Dekolista.
4. **Notification** — `InquiryNotificationService` logs stub (F-04 SES later).

## Out of scope

- Admin panel UI (S-06/S-08)
- Real SES email (F-04)
- Auth guard na `GET /api/inquiries` → **S-06** (`admin-login-and-shell` + Nest guard)

## Verification

- `nx run api:test`, `nx run web:test`
- Manual: dekolista → form → review → submit → success; row in DB
