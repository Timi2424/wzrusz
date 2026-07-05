// Risk: test-plan #2 — submitted inquiry appears in admin inbox
import { test, expect } from '@playwright/test';
import { createInquiryViaApi, loginAsAdmin } from './e2e-helpers';

test('admin sees guest inquiry in inbox after submission', async ({ page, request }) => {
  const { guest } = await createInquiryViaApi(request);
  await loginAsAdmin(page);

  await page.goto('/admin/zapytania');
  await expect(page.getByRole('heading', { name: 'Zapytania' })).toBeVisible();
  await expect(page.getByText(guest.fullName)).toBeVisible();
  await expect(page.getByText(guest.email)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Szczegóły' }).first()).toBeVisible();
});
