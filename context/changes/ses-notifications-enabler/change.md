---
change_id: ses-notifications-enabler
title: SES domain and production access
status: partial
created: 2026-06-16
updated: 2026-06-18
archived_at: null
---

## Notes

**Roadmap:** F-04 (Stream D)  
**PRD:** FR-011, FR-026  
**Odblokowuje:** maile transakcyjne na **dowolne** adresy klientów (poza sandboxem)

### Kod — done

- `apps/api/src/email/` — `EMAIL_MODE=stub|ses`, `StubEmailSender`, `SesEmailSender`.
- `InquiryNotificationService`, `InquirySuccessEmailService` + szablony PL.
- Stamp `successEmailSentAt` dopiero po udanym wysłaniu.

### AWS staging — done (sandbox)

- [x] `wzrusz.poznan@gmail.com` zweryfikowany (FROM + ADMIN).
- [x] IAM `WzruszEbSesS3` na roli EB.
- [x] EB env: `EMAIL_MODE=ses`, `SES_FROM_EMAIL`, `ADMIN_NOTIFY_EMAIL`, `AWS_REGION`.
- [x] E2E staging: notify admin + mail sukcesu (odbiorca zweryfikowany w sandboxie).

### Zablokowane — brak domeny (świadomie odkładane)

- [ ] Zweryfikowana **domena wysyłkowa** — AWS wymaga tego przed **Request production access**.
- [ ] Production access → maile na dowolne adresy klientów z formularza.
- [ ] Opcjonalnie: FROM typu `kontakt@domena.pl`.

**Workaround sandbox:** SES → Verified identities → dodaj email testowy klienta ręcznie.

### Deploy

Staging działa. Lokalnie `main` może być ahead of `origin` (brand/SEO footer) — push gdy gotowy.

**Next:** zakup domeny → weryfikacja w SES → production access. Do tego czasu aplikacja jest gotowa.
