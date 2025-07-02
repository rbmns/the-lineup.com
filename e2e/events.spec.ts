
import { test, expect } from '@playwright/test';

test.describe('Events Page', () => {
  test('should load events page', async ({ page }) => {
    await page.goto('/events');
    
    // Basic check that the page loads
    await expect(page.locator('body')).toBeVisible();
  });
  
  test('should show events or empty state', async ({ page }) => {
    await page.goto('/events');
    
    // Should show either events or an empty state
    const hasEvents = await page.locator('[data-testid="event-card"]').first().isVisible().catch(() => false);
    const hasEmptyState = await page.locator('text=No events found').isVisible().catch(() => false);
    
    expect(hasEvents || hasEmptyState).toBe(true);
  });
});
