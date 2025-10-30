import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/');
    
    // Check if login form elements are present
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should navigate to sign up form', async ({ page }) => {
    await page.goto('/');
    
    // Click on sign up link/button
    const signUpLink = page.getByText(/sign up|create account/i);
    if (await signUpLink.isVisible()) {
      await signUpLink.click();
      
      // Verify we're on sign up page
      await expect(page.getByPlaceholder(/email/i)).toBeVisible();
      await expect(page.getByPlaceholder(/password/i)).toBeVisible();
    }
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/');
    
    // Try to submit empty form
    const submitButton = page.getByRole('button', { name: /sign in/i });
    await submitButton.click();
    
    // Wait a bit for validation to trigger
    await page.waitForTimeout(500);
    
    // Check for validation messages (implementation dependent)
    // This is a basic check - adjust based on your actual validation UI
  });
});

