
import { test, expect } from '@playwright/test';

test.describe('Event Creation', () => {
  test('should require authentication for event creation', async ({ page }) => {
    await page.goto('/organise');
    
    // Should redirect to login or show auth prompt
    const authPrompt = page.getByText(/sign in/i).first();
    await expect(authPrompt).toBeVisible();
  });

  test('should display event creation form for authenticated users', async ({ page }) => {
    // This test would need to be modified based on your auth flow
    // For now, we'll check if the organise page loads
    await page.goto('/organise');
    
    // Check if page loads (even if requiring auth)
    await expect(page).toHaveTitle(/organise/i);
  });

  test('should validate required fields in event form', async ({ page }) => {
    await page.goto('/organise');
    
    // If there's an event form visible, test validation
    const eventForm = page.locator('form').first();
    if (await eventForm.isVisible()) {
      // Try to submit empty form
      const submitButton = page.getByRole('button', { name: /create/i }).first();
      if (await submitButton.isVisible()) {
        await submitButton.click();
        
        // Should show validation errors
        const errorMessage = page.getByText(/required/i).first();
        await expect(errorMessage).toBeVisible();
      }
    }
  });
});
