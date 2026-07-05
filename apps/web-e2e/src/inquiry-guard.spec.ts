// Risk: test-plan #6 — inquiry form requires non-empty Dekolista
import { test, expect } from '@playwright/test';
import { clearDekolista } from './e2e-helpers';

test('redirects to dekolista when inquiry form opened with empty list', async ({ page }) => {
  await clearDekolista(page);
  await page.goto('/zapytanie');

  await expect(page).toHaveURL(/\/dekolista/);
  await expect(page.getByTestId('dekolista-page')).toBeVisible();
});
