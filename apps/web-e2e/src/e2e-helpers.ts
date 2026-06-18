import { Page, expect } from '@playwright/test';

export function uniqueGuestContact(suffix = Date.now()) {
  return {
    fullName: `E2E Gość ${suffix}`,
    email: `e2e-guest-${suffix}@example.com`,
  };
}

export function futureEventRange(): { start: Date; end: Date } {
  const start = new Date();
  start.setDate(start.getDate() + 7);
  start.setHours(10, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  end.setHours(18, 0, 0, 0);

  return { start, end };
}

function primeDataDate(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

const FIELD_LABELS = ['Początek *', 'Koniec *'] as const;

/** PrimeNG datepicker — open via Choose Date and pick an enabled day. */
export async function pickDateTimeField(
  page: Page,
  fieldIndex: 0 | 1,
  date: Date,
): Promise<void> {
  await page.getByRole('button', { name: 'Choose Date' }).nth(fieldIndex).click();

  const panel = page.locator('.p-datepicker-panel').last();
  await expect(panel).toBeVisible();

  const targetDay = primeDataDate(date);

  for (let month = 0; month < 24; month++) {
    const day = panel.locator(`[data-date="${targetDay}"]:not(.p-disabled)`);
    if (await day.count()) {
      await day.first().click();
      break;
    }
    await panel.getByRole('button', { name: 'Next Month' }).click();
  }

  await page.getByRole('heading', { name: 'Termin wydarzenia' }).click();
  await expect(panel).toBeHidden();
  await expect(page.getByRole('combobox', { name: FIELD_LABELS[fieldIndex] })).not.toHaveValue('');
}

export async function expectCatalogReady(page: Page): Promise<void> {
  await expect(page.getByTestId('catalog-list')).toBeVisible();
  await expect(page.getByRole('link', { name: /Balony i girlandy/i })).toBeVisible();
}
