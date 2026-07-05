// Risk: test-plan #1 / #7 — admin approves inquiry and event appears in scheduler
import { test, expect } from '@playwright/test';
import {
  createInquiryViaApi,
  loginAsAdmin,
  navigateSchedulerToMonth,
} from './e2e-helpers';

test('admin approves inquiry and sees reservation in scheduler', async ({ page, request }) => {
  const { guest, inquiryId, decorationName, eventRange } = await createInquiryViaApi(request);
  const eventTitle = `${guest.fullName} — rezerwacja`;

  await loginAsAdmin(page);
  await page.goto(`/admin/zapytania/${inquiryId}`);
  await expect(page.getByRole('heading', { name: `Zapytanie ${inquiryId}` })).toBeVisible();

  await expect(
    page.locator('tr').filter({ hasText: decorationName }).getByText('OK'),
  ).toBeVisible();

  const approveButton = page.getByRole('button', { name: 'Zatwierdź rezerwację' });
  await expect(approveButton).toBeEnabled();
  await approveButton.click();
  await expect(
    page.getByRole('button', { name: 'Wyślij mail potwierdzający' }),
  ).toBeVisible();

  await page.goto('/admin/scheduler');
  await navigateSchedulerToMonth(page, eventRange.start);

  const eventBar = page.getByRole('button', { name: eventTitle }).first();
  await expect(eventBar).toBeVisible();
  await eventBar.hover();
  await expect(page.getByText('Zajęte dekoracje')).toBeVisible();
});
