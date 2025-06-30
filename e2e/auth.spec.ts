
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/');
    
    // Look for login-related elements
    const loginButton = page.getByRole('button', { name: /sign in/i }).first();
    if (await loginButton.isVisible()) {
      await loginButton.click();
    }
    
    // Check if login form appears
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test('should show validation errors for empty login form', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to login form
    const loginButton = page.getByRole('button', { name: /sign in/i }).first();
    if (await loginButton.isVisible()) {
      await loginButton.click();
    }
    
    // Try to submit empty form
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Check for validation errors
    await expect(page.getByText(/email is required/i)).toBeVisible();
  });

  test('should navigate to signup from login', async ({ page }) => {
    await page.goto('/');
    
    // Look for signup link or button
    const signupLink = page.getByText(/sign up/i).first();
    if (await signupLink.isVisible()) {
      await signupLink.click();
      
      // Should see signup form
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
    }
  });
});
