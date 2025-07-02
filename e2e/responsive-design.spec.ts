import { test, expect } from '@playwright/test';

test.describe('Responsive Design Tests', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1440, height: 900 },
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`should display correctly on ${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');

      // Homepage should be responsive
      await expect(page.locator('h1')).toBeVisible();
      
      // Navigation should work on all devices
      if (width < 768) {
        // Mobile: hamburger menu
        const menuButton = page.locator('[aria-label="Menu"]').or(page.locator('button:has-text("Menu")'));
        if (await menuButton.isVisible()) {
          await menuButton.click();
          await expect(page.locator('nav')).toBeVisible();
        }
      } else {
        // Desktop/Tablet: direct navigation
        await expect(page.locator('nav a')).toBeVisible();
      }

      // Events page responsiveness
      await page.goto('/events');
      
      // Event grid should adapt to viewport
      const eventContainer = page.locator('.event-grid').or(page.locator('[data-testid="events-list"]'));
      if (await eventContainer.isVisible()) {
        await expect(eventContainer).toBeVisible();
        
        // Check if events are displayed appropriately for viewport
        if (width >= 1440) {
          // Desktop: multiple columns
          const eventCards = page.locator('.event-card').or(page.locator('[data-testid="event-card"]'));
          const count = await eventCards.count();
          if (count > 0) {
            const boundingBox = await eventCards.first().boundingBox();
            expect(boundingBox?.width).toBeLessThan(width / 2); // Should not take full width
          }
        } else if (width < 768) {
          // Mobile: stacked layout
          const eventCards = page.locator('.event-card').or(page.locator('[data-testid="event-card"]'));
          const count = await eventCards.count();
          if (count > 0) {
            const boundingBox = await eventCards.first().boundingBox();
            expect(boundingBox?.width).toBeGreaterThan(width * 0.8); // Should take most of width
          }
        }
      }

      // Filters should be responsive
      if (width < 768) {
        // Mobile: drawer/modal filters
        const filterButton = page.locator('text=Filters').or(page.locator('[aria-label="Open filters"]'));
        if (await filterButton.isVisible()) {
          await filterButton.click();
          await expect(page.locator('[role="dialog"]').or(page.locator('.filter-modal'))).toBeVisible();
        }
      } else {
        // Desktop: sidebar filters
        const filterSection = page.locator('.filters-sidebar').or(page.locator('[data-testid="filters"]'));
        if (await filterSection.isVisible()) {
          await expect(filterSection).toBeVisible();
        }
      }
    });
  });

  test('should handle touch interactions on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/events');

    // Test swipe gestures if implemented
    const eventCards = page.locator('.event-card').or(page.locator('[data-testid="event-card"]'));
    const count = await eventCards.count();
    
    if (count > 0) {
      // Test tap to open event
      await eventCards.first().tap();
      await expect(page).toHaveURL(/\/events\/[^\/]+$/);
      
      // Test back navigation
      await page.goBack();
      await expect(page).toHaveURL('/events');
    }

    // Test form interactions on mobile
    await page.goto('/events/create');
    
    // Form fields should be properly sized for mobile
    const titleInput = page.locator('input[name="title"]');
    if (await titleInput.isVisible()) {
      const boundingBox = await titleInput.boundingBox();
      expect(boundingBox?.width).toBeGreaterThan(200); // Minimum touch target size
      
      // Test touch input
      await titleInput.tap();
      await titleInput.fill('Mobile Test Event');
      
      // Verify input works
      await expect(titleInput).toHaveValue('Mobile Test Event');
    }
  });

  test('should maintain readability across all viewport sizes', async ({ page }) => {
    for (const { name, width, height } of viewports) {
      await page.setViewportSize({ width, height });
      await page.goto('/events');

      // Text should be readable
      const headings = page.locator('h1, h2, h3');
      const count = await headings.count();
      
      for (let i = 0; i < Math.min(count, 3); i++) {
        const heading = headings.nth(i);
        if (await heading.isVisible()) {
          const styles = await heading.evaluate((el) => {
            const computed = window.getComputedStyle(el);
            return {
              fontSize: computed.fontSize,
              lineHeight: computed.lineHeight,
            };
          });
          
          // Font size should be appropriate for viewport
          const fontSize = parseInt(styles.fontSize);
          if (width < 768) {
            expect(fontSize).toBeGreaterThanOrEqual(16); // Minimum mobile font size
          } else {
            expect(fontSize).toBeGreaterThanOrEqual(14); // Minimum desktop font size
          }
        }
      }

      // Interactive elements should have proper touch targets on mobile
      if (width < 768) {
        const buttons = page.locator('button');
        const buttonCount = await buttons.count();
        
        for (let i = 0; i < Math.min(buttonCount, 3); i++) {
          const button = buttons.nth(i);
          if (await button.isVisible()) {
            const boundingBox = await button.boundingBox();
            if (boundingBox) {
              expect(Math.min(boundingBox.width, boundingBox.height)).toBeGreaterThanOrEqual(44); // WCAG touch target
            }
          }
        }
      }
    }
  });
});