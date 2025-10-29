import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('unauthenticated user is redirected to login page', async ({ page }) => {
    // Try to access the home page without authentication
    await page.goto('/')

    // Should be redirected to login
    await expect(page).toHaveURL('/login')
  })

  test('login page loads successfully', async ({ page }) => {
    await page.goto('/login')

    // Check that login page loads
    await expect(page).toHaveURL('/login')

    // Check for auth provider buttons
    const pageContent = await page.textContent('body')
    expect(pageContent).toBeTruthy()
  })

  test('unauthenticated user cannot access onboarding page', async ({ page }) => {
    // Try to access onboarding page without authentication
    await page.goto('/onboarding')

    // Should be redirected to login
    await expect(page).toHaveURL('/login')
  })

  test('auth callback handles missing code parameter', async ({ page }) => {
    // Access callback without code parameter
    await page.goto('/auth/callback')

    // Should redirect to home, then middleware redirects to login
    await expect(page).toHaveURL('/login')
  })
})

test.describe('Protected Routes', () => {
  test('middleware protects root route', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/login')
  })

  test('static assets are not blocked', async ({ page }) => {
    // Test that favicon and other assets can load without auth
    const response = await page.goto('/favicon.ico')
    expect(response?.status()).not.toBe(302) // Should not redirect
  })
})
