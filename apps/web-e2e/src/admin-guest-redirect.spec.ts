// Risk: test-plan #3 — unauthenticated user cannot reach admin routes (UI layer)
import { test, expect } from '@playwright/test';

test('redirects unauthenticated user to admin login', async ({ page }) => {
  await page.goto('/admin/zapytania');

  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByRole('heading', { name: 'Logowanie do panelu' })).toBeVisible();
});
