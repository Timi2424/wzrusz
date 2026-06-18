# Plan: inquiry-form-and-preview (S-04)

Roadmap slice **S-04** (Stream A). Reactive inquiry form at `/zapytanie` with live message preview from form fields + confirmed Dekolista. Review step before send; HTTP submit deferred to S-05.

## Scope

1. `core/inquiry/` — `InquiryFormValue`, `buildInquiryPreview()`, date formatting.
2. `feature/inquiry/` — Reactive form page, `eventRangeValidator`, route guard (confirmed Dekolista required).
3. Two-step UX: form + live preview → review summary; submit button disabled until S-05.
4. Wire `/zapytanie` lazy route (replace ComingSoon placeholder).

## Out of scope

- API POST, SES email, admin inbox (S-05).
- Persisting draft form values (optional later).

## Verification

- `nx run web:test`, `nx run web:lint`
- Manual: confirm Dekolista → `/zapytanie` → fill form → preview updates → review step
