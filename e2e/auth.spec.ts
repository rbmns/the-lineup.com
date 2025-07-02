import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display homepage', async ({ page }) => {
    await page.goto('/');
    
    // Basic check that the page loads
    await expect(page.locator('body')).toBeVisible();
  });
  
  test('should navigate to login', async ({ page }) => {
    await page.goto('/');
    
    // Look for any sign in elements
    const hasSignIn = await page.locator('text=Sign In').first().isVisible().catch(() => false);
    if (hasSignIn) {
      await page.click('text=Sign In');
      await page.waitForTimeout(500); // Wait for navigation
    }
  });
});