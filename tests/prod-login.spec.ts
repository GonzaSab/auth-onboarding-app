import { test, expect } from '@playwright/test'

/**
 * Production Login Test
 *
 * This test is specifically designed for production environment
 * where login may take 15-20 seconds to complete due to:
 * - Middleware checking user profiles
 * - Database queries
 * - Network latency
 */

test.describe('Production Login Flow', () => {
  test('should successfully login with admin credentials', async ({ page }) => {
    const prodUrl = 'https://auth-onboarding-app-production.up.railway.app/login'
    const testEmail = 'admin@gmail.com'
    const testPassword = 'Admin.123'

    console.log('🔐 Testing production login flow...')

    // Navigate to login page
    await page.goto(prodUrl, { waitUntil: 'networkidle' })
    await expect(page.locator('h1')).toContainText('Welcome')

    // Fill in credentials
    await page.locator('input[type="email"]').fill(testEmail)
    await page.locator('input[type="password"]').fill(testPassword)

    console.log('✓ Credentials filled')

    // Submit the form
    await page.locator('form button[type="submit"]').click()

    console.log('⏳ Waiting for login to complete (may take up to 20 seconds)...')

    // Wait for navigation with generous timeout (20 seconds)
    // Production middleware can be slow due to database queries
    try {
      await page.waitForURL(url => !url.includes('/login'), { timeout: 20000 })
      console.log('✅ Successfully redirected!')
    } catch (error) {
      // Check if the refresh button appeared (our new feature)
      const refreshButton = page.getByText('Refresh Page')
      const isRefreshButtonVisible = await refreshButton.isVisible().catch(() => false)

      if (isRefreshButtonVisible) {
        console.log('⚠️  Navigation timed out, but refresh button appeared (expected behavior)')
        console.log('🔄 Clicking refresh button...')

        await refreshButton.click()
        await page.waitForLoadState('networkidle')

        const finalUrl = page.url()
        if (!finalUrl.includes('/login')) {
          console.log('✅ Refresh button worked! Now on:', finalUrl)
        } else {
          throw new Error('Still on login page even after refresh')
        }
      } else {
        throw new Error('Login did not complete and no refresh button appeared')
      }
    }

    // Verify we're on either home page or onboarding page
    const finalUrl = page.url()
    const isOnHome = finalUrl === prodUrl.replace('/login', '/')
    const isOnOnboarding = finalUrl.includes('/onboarding')

    expect(isOnHome || isOnOnboarding).toBeTruthy()

    if (isOnHome) {
      console.log('✅ Logged in and reached home page')
    } else if (isOnOnboarding) {
      console.log('✅ Logged in and redirected to onboarding')
    }
  })

  test('should show helpful message after slow navigation', async ({ page }) => {
    const prodUrl = 'https://auth-onboarding-app-production.up.railway.app/login'
    const testEmail = 'admin@gmail.com'
    const testPassword = 'Admin.123'

    console.log('🔐 Testing slow navigation handling...')

    await page.goto(prodUrl, { waitUntil: 'networkidle' })

    // Fill and submit
    await page.locator('input[type="email"]').fill(testEmail)
    await page.locator('input[type="password"]').fill(testPassword)
    await page.locator('form button[type="submit"]').click()

    // Wait for 16 seconds to trigger the timeout message
    console.log('⏳ Waiting 16 seconds for timeout message to appear...')
    await page.waitForTimeout(16000)

    // Check if we either:
    // 1. Successfully navigated (fast response)
    // 2. Timeout message appeared (expected slow response)
    const currentUrl = page.url()
    const isStillOnLogin = currentUrl.includes('/login')

    if (isStillOnLogin) {
      // Should show timeout message and refresh button
      const timeoutMessage = await page.locator('text=/Login successful!/').isVisible().catch(() => false)
      const refreshButton = await page.getByText('Refresh Page').isVisible().catch(() => false)

      console.log('Timeout message visible:', timeoutMessage)
      console.log('Refresh button visible:', refreshButton)

      // At least one should be true (either message or button)
      expect(timeoutMessage || refreshButton).toBeTruthy()

      if (refreshButton) {
        console.log('✅ Refresh button appeared as expected for slow navigation')
      }
    } else {
      console.log('✅ Navigation completed before timeout (under 15 seconds)')
    }
  })
})
