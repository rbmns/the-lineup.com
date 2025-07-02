import { test, expect } from '@playwright/test';

test('simple smoke test', async ({ page }) => {
  await page.goto('/');
  
  // Just verify the page loads
  await expect(page).toHaveTitle(/.*/);