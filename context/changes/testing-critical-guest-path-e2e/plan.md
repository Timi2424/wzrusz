# Plan: testing-critical-guest-path-e2e

## Progress

### Phase 1: E2E levers + guest flow
- [x] 1.1 `seed.spec.ts` + `E2E-RULES.md`
- [x] 1.2 Playwright starts API + web (`webServer` array)
- [x] 1.3 `guest-inquiry-flow.spec.ts` — catalog → dekolista → submit → success
- [x] 1.4 `npx nx e2e web-e2e -- --project=chromium` green
- [x] 1.5 Deliberate-break check on success assertion
