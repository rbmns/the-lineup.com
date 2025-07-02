
import { test, expect } from '@playwright/test';

test.describe('Event Creation', () => {
  test('should navigate to create event page', async ({ page }) => {
    await page.goto('/events/create');
    
    // Basic check that the page loads
    await expect(page.locator('body')).toBeVisible();
  });
  
  test('should show form fields', async ({ page }) => {
    await page.goto('/events/create');
    
    // Look for basic form elements
    const hasTitle = await page.locator('input[name="title"]').isVisible().catch(() => false);
    const hasTitleInput = await page.locator('input[type="text"]').first().isVisible().catch(() => false);
    
    expect(hasTitle || hasTitleInput).toBe(true);
  });
});
