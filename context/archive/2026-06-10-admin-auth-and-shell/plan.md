# Plan: admin auth + panel shell (F-02 + S-06)

Roadmap: **F-02** `admin-auth-scaffold` + **S-06** `admin-login-and-shell`.

## Scope

1. **API** — `users` table + seed admin; `POST /api/auth/login`, `GET /api/auth/me`; JWT; `AdminAuthGuard` on `GET /api/inquiries`.
2. **Web** — `/admin/login`, `/admin` shell (CSR), guards, Bearer interceptor, lista zapytań (read-only, bez S-08 detail).

## Out of scope

- SES (F-04), szczegóły zapytania (S-08), CRUD katalogu (S-07).
- Uprawnienia roli `user` poza modelem DB.

## Verify

- `npm run db:migrate`
- `nx test api web`
- Lokalnie: login `admin@wzrusz.local` / `changeme` → `/admin/zapytania` pokazuje listę.

## Staging

- Ustaw `JWT_SECRET` w EB env API przed deployem (wymagane poza `APP_ENV=local`).
