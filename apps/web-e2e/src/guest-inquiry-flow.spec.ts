// Risk: test-plan #6 — critical guest path (catalog → dekolista → inquiry → confirmation)
// seed: apps/web-e2e/src/seed.spec.ts
import { test, expect } from '@playwright/test';
import { pickDateTimeField, uniqueGuestContact, expectCatalogReady, futureEventRange } from './e2e-helpers';

test('guest completes inquiry from catalog through confirmation', async ({ page }) => {
  test.setTimeout(60_000);

  const guest = uniqueGuestContact();
  const eventRange = futureEventRange();

  // Catalog — pick category and add decoration to Dekolista
  await page.goto('/katalog');
  await expectCatalogReady(page);
  await page.getByRole('link', { name: /Balony i girlandy/i }).click();
  await expect(page.getByRole('heading', { name: 'Balony i girlandy' })).toBeVisible();

  const addButton = page.getByRole('button', { name: 'Dodaj do Dekolisty' }).first();
  await expect(addButton).toBeVisible();
  await addButton.click();

  // Dekolista — proceed to inquiry form
  await page.getByRole('link', { name: 'Dekolista' }).click();
  await expect(page.getByTestId('dekolista-page')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Girlanda z balonów pastel' })).toBeVisible();
  await page.getByTestId('dekolista-to-inquiry').click();

  // Inquiry form — contact, term, transport
  await expect(page.getByTestId('inquiry-page')).toBeVisible();
  await page.getByRole('textbox', { name: 'Imię i nazwisko *' }).fill(guest.fullName);
  await page.getByRole('textbox', { name: 'E-mail *' }).fill(guest.email);
  await pickDateTimeField(page, 0, eventRange.start);
  await pickDateTimeField(page, 1, eventRange.end);
  await page.getByRole('textbox', { name: 'Adres transportu / montażu *' }).fill('Poznań, ul. Testowa 1');

  await page.getByRole('button', { name: 'Przejdź do podsumowania' }).click();
  await expect(page.getByTestId('inquiry-review')).toBeVisible();
  await expect(page.getByTestId('inquiry-review')).toContainText('Girlanda z balonów pastel');

  const submitPromise = page.waitForResponse(
    (response) =>
      response.url().includes('/api/inquiries') && response.request().method() === 'POST',
  );

  await page.getByTestId('inquiry-submit').click();
  const submitResponse = await submitPromise;
  expect(submitResponse.ok()).toBe(true);

  // Confirmation — business outcome visible to guest
  await expect(page.getByTestId('inquiry-success')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Zapytanie wysłane' })).toBeVisible();
  await expect(page.getByText(/Numer zapytania:/)).toBeVisible();
});
