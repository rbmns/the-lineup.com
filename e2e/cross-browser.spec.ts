import { test, expect } from '@playwright/test';

test.describe('Cross-Browser Compatibility', () => {
  test('should work consistently across browsers', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Basic functionality should work in all browsers
    await expect(page.locator('h1')).toBeVisible();
    
    // Navigation should work
    await page.click('text=Events');
    await expect(page).toHaveURL('/events');
    
    // JavaScript functionality should work
    const filterButtons = page.locator('button:has-text("Categories")').or(page.locator('[data-testid="category-filter"]'));
    if (await filterButtons.count() > 0) {
      await filterButtons.first().click();
      // Some kind of response should happen (dropdown, modal, etc.)
      await page.waitForTimeout(500); // Allow time for interaction
    }
    
    // Forms should work
    await page.goto('/events/create');
    await page.fill('input[name="title"]', `${browserName} Test Event`);
    await expect(page.locator('input[name="title"]')).toHaveValue(`${browserName} Test Event`);
    
    // Date/time inputs should work (browser-specific)
    const dateInput = page.locator('input[type="date"]');
    if (await dateInput.isVisible()) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      await dateInput.fill(tomorrow.toISOString().split('T')[0]);
      
      // Verify date was set (format might vary by browser)
      const value = await dateInput.inputValue();
      expect(value).toBeTruthy();
    }
    
    // Select dropdowns should work
    const categorySelect = page.locator('select[name="eventCategory"]');
    if (await categorySelect.isVisible()) {
      await categorySelect.selectOption('Social');
      expect(await categorySelect.inputValue()).toBe('Social');
    }
  });

  test('should handle CSS features consistently', async ({ page, browserName }) => {
    await page.goto('/events');
    
    // Check for CSS Grid/Flexbox support
    const eventGrid = page.locator('.event-grid').or(page.locator('[data-testid="events-list"]'));
    if (await eventGrid.isVisible()) {
      const styles = await eventGrid.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          gridTemplateColumns: computed.gridTemplateColumns,
          flexDirection: computed.flexDirection,
        };
      });
      
      // Should use modern layout methods
      expect(['grid', 'flex'].some(method => styles.display.includes(method))).toBe(true);
    }
    
    // Check for modern CSS features
    const cards = page.locator('.event-card').or(page.locator('[data-testid="event-card"]'));
    if (await cards.count() > 0) {
      const cardStyles = await cards.first().evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          borderRadius: computed.borderRadius,
          boxShadow: computed.boxShadow,
          transform: computed.transform,
        };
      });
      
      // Modern CSS should be applied
      expect(cardStyles.borderRadius).not.toBe('0px');
    }
  });

  test('should handle JavaScript APIs consistently', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Local Storage should work
    await page.evaluate(() => {
      localStorage.setItem('test-key', 'test-value');
    });
    
    const storedValue = await page.evaluate(() => {
      return localStorage.getItem('test-key');
    });
    expect(storedValue).toBe('test-value');
    
    // Clean up
    await page.evaluate(() => {
      localStorage.removeItem('test-key');
    });
    
    // Fetch API should work (for Supabase calls)
    const fetchSupported = await page.evaluate(() => {
      return typeof fetch !== 'undefined';
    });
    expect(fetchSupported).toBe(true);
    
    // Modern JavaScript features should work
    const jsFeatures = await page.evaluate(() => {
      // Test async/await, destructuring, arrow functions
      const testAsync = async () => {
        const obj = { a: 1, b: 2 };
        const { a, b } = obj;
        return [a, b].map(x => x * 2);
      };
      
      return testAsync().then(result => result);
    });
    expect(jsFeatures).toEqual([2, 4]);
  });

  // Test specific browser quirks
  test('should handle browser-specific behaviors', async ({ page, browserName }) => {
    await page.goto('/events/create');
    
    if (browserName === 'webkit') {
      // Safari-specific tests
      // Test date input behavior in Safari
      const dateInput = page.locator('input[type="date"]');
      if (await dateInput.isVisible()) {
        // Safari might have different date input behavior
        await dateInput.click();
        // Just verify it doesn't crash
        await page.waitForTimeout(100);
      }
    } else if (browserName === 'firefox') {
      // Firefox-specific tests
      // Test file input behavior in Firefox
      const fileInputs = page.locator('input[type="file"]');
      if (await fileInputs.count() > 0) {
        // Just verify file inputs are accessible
        await expect(fileInputs.first()).toBeVisible();
      }
    } else if (browserName === 'chromium') {
      // Chrome-specific tests
      // Test modern web APIs that might be Chrome-first
      const webApiSupport = await page.evaluate(() => {
        return {
          intersectionObserver: typeof IntersectionObserver !== 'undefined',
          resizeObserver: typeof ResizeObserver !== 'undefined',
        };
      });
      
      // These should be available in modern Chrome
      expect(webApiSupport.intersectionObserver).toBe(true);
      expect(webApiSupport.resizeObserver).toBe(true);
    }
  });
});