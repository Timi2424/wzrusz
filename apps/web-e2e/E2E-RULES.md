# E2E Testing Rules (Wzrusz / Playwright)

- Use `getByRole`, `getByLabel`, `getByText` as primary locators.
  Fall back to `getByTestId` only when accessibility attributes are ambiguous.
- Never use CSS selectors, XPath, or DOM structure for locating elements.
- Each test must be independently runnable — no shared state between tests.
- Never use `page.waitForTimeout()`. Wait for specific conditions:
  `toBeVisible()`, `waitForURL()`, `waitForResponse()`.
- Assert the business outcome, not implementation details.
- Use unique identifiers (timestamp suffix) for guest contact data
  to avoid collisions in parallel runs.
- Guest flows use real API + Postgres via dev proxy; mock only external SES/S3.
- Use `storageState` for admin authentication — never log in through UI in individual tests.

Reference seed: `apps/web-e2e/src/seed.spec.ts`
