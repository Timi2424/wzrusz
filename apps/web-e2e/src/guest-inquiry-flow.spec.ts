// Risk: test-plan #6 — critical guest path (catalog → dekolista → inquiry → confirmation)
// seed: apps/web-e2e/src/seed.spec.ts
import { test, expect } from '@playwright/test';
import { completeGuestInquiry } from './e2e-helpers';

test('guest completes inquiry from catalog through confirmation', async ({ page }) => {
  const { guest } = await completeGuestInquiry(page);

  await expect(page.getByRole('heading', { name: 'Zapytanie wysłane' })).toBeVisible();
  await expect(page.getByText(/Numer zapytania:/)).toBeVisible();
  await expect(page.getByTestId('inquiry-review')).toBeHidden();
  expect(guest.fullName.length).toBeGreaterThan(0);
});
