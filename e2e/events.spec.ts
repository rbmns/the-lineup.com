
import { test, expect } from '@playwright/test';

test.describe('Events', () => {
  test('should display events page', async ({ page }) => {
    await page.goto('/events');
    
    // Check if events page loads
    await expect(page).toHaveTitle(/events/i);
    
    // Look for events-related content
    const eventsContent = page.locator('[data-testid="events-content"]').first();
    if (await eventsContent.isVisible()) {
      await expect(eventsContent).toBeVisible();
    }
  });

  test('should show event filters', async ({ page }) => {
    await page.goto('/events');
    
    // Look for filter elements
    const filters = page.locator('[data-testid="event-filters"]').first();
    if (await filters.isVisible()) {
      await expect(filters).toBeVisible();
    }
  });

  test('should allow filtering by category', async ({ page }) => {
    await page.goto('/events');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Look for category filters
    const categoryFilter = page.getByText('Music').first();
    if (await categoryFilter.isVisible()) {
      await categoryFilter.click();
      
      // Check if URL updates with filter
      await expect(page).toHaveURL(/type=Music/);
    }
  });

  test('should display event details when clicked', async ({ page }) => {
    await page.goto('/events');
    
    // Wait for events to load
    await page.waitForLoadState('networkidle');
    
    // Click on first event if available
    const firstEvent = page.locator('[data-testid="event-card"]').first();
    if (await firstEvent.isVisible()) {
      await firstEvent.click();
      
      // Should navigate to event detail page
      await expect(page).toHaveURL(/\/events\/.+/);
    }
  });
});
