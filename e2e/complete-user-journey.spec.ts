import { test, expect } from '@playwright/test';

test.describe('Complete User Journey', () => {
  test('should complete full user flow: signup → login → create event → discover events', async ({ page }) => {
    // Step 1: Navigate to signup
    await page.goto('/');
    await page.click('text=Sign Up');
    
    // Step 2: Complete registration
    const email = `test-${Date.now()}@example.com`;
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Sign Up")');
    
    // Wait for success or redirect
    await expect(page).toHaveURL(/\/(home|events|dashboard)/);
    
    // Step 3: Navigate to create event
    await page.click('text=Create Event');
    await expect(page).toHaveURL('/events/create');
    
    // Step 4: Fill out event creation form
    await page.fill('input[name="title"]', 'Test E2E Event');
    await page.fill('textarea[name="description"]', 'A test event created by E2E testing');
    await page.fill('input[name="city"]', 'Amsterdam');
    await page.fill('input[name="venueName"]', 'Test Venue');
    
    // Set date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    await page.fill('input[type="date"]', dateString);
    
    // Set time
    await page.fill('input[name="startTime"]', '19:00');
    await page.fill('input[name="endTime"]', '22:00');
    
    // Select category and vibe
    await page.click('select[name="eventCategory"]');
    await page.selectOption('select[name="eventCategory"]', 'Social');
    
    await page.click('select[name="vibe"]');
    await page.selectOption('select[name="vibe"]', 'Chill');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for success (either redirect or success message)
    await expect(page.locator('text=Event created successfully').or(page.locator('text=Test E2E Event'))).toBeVisible({ timeout: 10000 });
    
    // Step 5: Navigate to events page
    await page.goto('/events');
    
    // Step 6: Test filtering
    await page.click('text=Categories');
    await page.click('text=Social');
    
    // Should see our created event
    await expect(page.locator('text=Test E2E Event')).toBeVisible({ timeout: 5000 });
    
    // Step 7: Test event detail view
    await page.click('text=Test E2E Event');
    await expect(page.locator('text=Test Venue')).toBeVisible();
    await expect(page.locator('text=Amsterdam')).toBeVisible();
    
    // Step 8: Test RSVP functionality
    await page.click('text=Going');
    await expect(page.locator('text=You\'re going').or(page.locator('.rsvp-success'))).toBeVisible({ timeout: 5000 });
  });

  test('should handle timezone conversion correctly', async ({ page }) => {
    await page.goto('/events/create');
    
    // Set timezone to different zone
    await page.selectOption('select[name="timezone"]', 'America/New_York');
    
    // Fill required fields
    await page.fill('input[name="title"]', 'Timezone Test Event');
    await page.fill('input[name="city"]', 'New York');
    await page.fill('input[name="startTime"]', '15:00'); // 3 PM EDT
    await page.fill('input[name="endTime"]', '18:00');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.fill('input[type="date"]', tomorrow.toISOString().split('T')[0]);
    
    await page.click('button[type="submit"]');
    
    // Verify event shows correct timezone info
    await page.goto('/events');
    await page.click('text=Timezone Test Event');
    
    // Should display time in user's local timezone with indication
    await expect(page.locator('text=EDT').or(page.locator('text=EST')).or(page.locator('text=New York'))).toBeVisible();
  });

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Mobile navigation should work
    await page.click('[aria-label="Menu"]');
    await expect(page.locator('nav')).toBeVisible();
    
    // Navigate to events
    await page.click('text=Events');
    await expect(page).toHaveURL('/events');
    
    // Mobile filters should work
    await page.click('text=Filters');
    await expect(page.locator('[role="dialog"]').or(page.locator('.filter-panel'))).toBeVisible();
    
    // Close filter
    await page.click('text=Close').first();
    
    // Event cards should be mobile-friendly
    const eventCards = page.locator('.event-card').or(page.locator('[data-testid="event-card"]'));
    if (await eventCards.count() > 0) {
      await expect(eventCards.first()).toBeVisible();
      
      // Tap on event card
      await eventCards.first().click();
      
      // Should navigate to event detail
      await expect(page).toHaveURL(/\/events\/[^\/]+$/);
    }
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Test network error handling
    await page.route('**/rest/v1/events*', route => route.abort());
    
    await page.goto('/events');
    
    // Should show error state
    await expect(page.locator('text=Error loading events').or(page.locator('text=Something went wrong'))).toBeVisible({ timeout: 5000 });
    
    // Test form validation
    await page.goto('/events/create');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('text=Title is required').or(page.locator('.error-message'))).toBeVisible();
    
    // Test invalid email on signup
    await page.goto('/signup');
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Should show email validation error
    await expect(page.locator('text=Please enter a valid email').or(page.locator('text=Invalid email'))).toBeVisible();
  });

  test('should persist user session across page refreshes', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for login success
    await expect(page).toHaveURL(/\/(home|events|dashboard)/);
    
    // Refresh page
    await page.reload();
    
    // Should still be logged in
    await expect(page.locator('text=Create Event').or(page.locator('[data-testid="user-menu"]'))).toBeVisible({ timeout: 5000 });
    
    // Navigate to profile - should not redirect to login
    await page.goto('/profile');
    await expect(page).not.toHaveURL('/login');
  });
});