// seed: risk-tied exemplar for generated Playwright tests (test-plan §6.4)
import { test, expect } from '@playwright/test';

test('home hero exposes catalog entry point for guest flows', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('home-hero')).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Przeglądaj katalog' }),
  ).toBeVisible();
});
