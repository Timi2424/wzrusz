import { APIRequestContext, Page, expect } from '@playwright/test';

export const DEKOLISTA_STORAGE_KEY = 'wzrusz-dekolista-v1';

export const ADMIN_CREDENTIALS = {
  email: 'admin@wzrusz.local',
  password: 'changeme',
} as const;

const API_BASE = 'http://localhost:3000';
const DEFAULT_DECORATION_SLUG = 'girlanda-balonow-pastel';
const DEFAULT_DECORATION_NAME = 'Girlanda z balonów pastel';

export function uniqueGuestContact(suffix = Date.now()) {
  return {
    fullName: `E2E Gość ${suffix}`,
    email: `e2e-guest-${suffix}@example.com`,
  };
}

export function futureEventRange(daysAhead = 7): { start: Date; end: Date } {
  const start = new Date();
  start.setDate(start.getDate() + daysAhead);
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

export async function clearDekolista(page: Page): Promise<void> {
  await page.goto('/');
  await page.evaluate((key) => localStorage.removeItem(key), DEKOLISTA_STORAGE_KEY);
}

export interface CompletedGuestInquiry {
  guest: ReturnType<typeof uniqueGuestContact>;
  inquiryId: string;
  eventRange: ReturnType<typeof futureEventRange>;
  decorationName: string;
}

/** Guest path: catalog → dekolista → inquiry submit → success screen. */
export async function completeGuestInquiry(
  page: Page,
  options?: { eventRange?: { start: Date; end: Date } },
): Promise<CompletedGuestInquiry> {
  const guest = uniqueGuestContact();
  const eventRange = options?.eventRange ?? futureEventRange();

  await page.goto('/katalog');
  await expectCatalogReady(page);
  await page.getByRole('link', { name: /Balony i girlandy/i }).click();
  await expect(page.getByRole('heading', { name: 'Balony i girlandy' })).toBeVisible();

  const addButton = page
    .getByRole('button', { name: 'Dodaj do Dekolisty' })
    .first();
  await addButton.click();

  await page.getByRole('link', { name: 'Dekolista' }).click();
  await expect(page.getByTestId('dekolista-page')).toBeVisible();
  await expect(page.getByText(DEFAULT_DECORATION_NAME)).toBeVisible();

  await page.getByTestId('dekolista-to-inquiry').click();
  await expect(page.getByTestId('inquiry-page')).toBeVisible();
  await page.getByRole('textbox', { name: 'Imię i nazwisko *' }).fill(guest.fullName);
  await page.getByRole('textbox', { name: 'E-mail *' }).fill(guest.email);
  await pickDateTimeField(page, 0, eventRange.start);
  await pickDateTimeField(page, 1, eventRange.end);
  await page.getByRole('textbox', { name: 'Adres transportu / montażu *' }).fill('Poznań, ul. Testowa 1');

  await page.getByRole('button', { name: 'Przejdź do podsumowania' }).click();
  await expect(page.getByTestId('inquiry-review')).toBeVisible();

  const submitPromise = page.waitForResponse(
    (response) =>
      response.url().includes('/api/inquiries') && response.request().method() === 'POST',
  );

  await page.getByTestId('inquiry-submit').click();
  expect((await submitPromise).ok()).toBe(true);

  await expect(page.getByTestId('inquiry-success')).toBeVisible();
  const reference = page.getByText(/Numer zapytania:/);
  await expect(reference).toBeVisible();
  const inquiryId = (await reference.textContent())?.match(/Numer zapytania:\s*(\S+)/)?.[1];
  expect(inquiryId).toBeTruthy();

  return {
    guest,
    inquiryId: inquiryId!,
    eventRange,
    decorationName: DEFAULT_DECORATION_NAME,
  };
}

export async function loginAsAdmin(page: Page): Promise<void> {
  await page.goto('/admin/login');
  await page.getByRole('textbox', { name: 'Email' }).fill(ADMIN_CREDENTIALS.email);
  await page.getByRole('textbox', { name: 'Hasło' }).fill(ADMIN_CREDENTIALS.password);
  await page.getByRole('button', { name: 'Zaloguj się' }).click();
  await expect(page).not.toHaveURL(/\/admin\/login/);
}

async function defaultDecoration(
  request: APIRequestContext,
): Promise<{ id: string; name: string }> {
  const categoryRes = await request.get(
    `${API_BASE}/api/catalog/categories/balony-i-girlandy`,
  );
  expect(categoryRes.ok()).toBeTruthy();
  const category = (await categoryRes.json()) as {
    decorations: { id: string; slug: string; name: string }[];
  };
  const decoration = category.decorations.find((item) => item.slug === DEFAULT_DECORATION_SLUG);
  expect(decoration).toBeTruthy();
  return decoration!;
}

/** Fast path for admin flows — inquiry created via API. */
export async function createInquiryViaApi(
  request: APIRequestContext,
  options?: {
    eventRange?: { start: Date; end: Date };
    guest?: ReturnType<typeof uniqueGuestContact>;
  },
): Promise<CompletedGuestInquiry> {
  const guest = options?.guest ?? uniqueGuestContact();
  const eventRange = options?.eventRange ?? futureEventRange(5);
  const decoration = await defaultDecoration(request);

  const inquiryRes = await request.post(`${API_BASE}/api/inquiries`, {
    data: {
      fullName: guest.fullName,
      email: guest.email,
      eventStart: eventRange.start.toISOString(),
      eventEnd: eventRange.end.toISOString(),
      transportAddress: 'Poznań, ul. Testowa 1',
      needsInvoice: false,
      lineItems: [{ decorationId: decoration.id, quantity: 1 }],
    },
  });
  expect(inquiryRes.ok()).toBeTruthy();
  const body = (await inquiryRes.json()) as { id: string };

  return {
    guest,
    inquiryId: body.id,
    eventRange,
    decorationName: decoration.name,
  };
}

export async function navigateSchedulerToMonth(page: Page, target: Date): Promise<void> {
  const now = new Date();
  const monthDelta =
    (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());

  const steps = Math.abs(monthDelta);
  const direction = monthDelta >= 0 ? '→' : '←';

  for (let step = 0; step < steps; step++) {
    await page.getByRole('button', { name: direction }).click();
  }
}
