import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request)

  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession()

  const isLoginPage = request.nextUrl.pathname === '/login'
  const isOnboardingPage = request.nextUrl.pathname === '/onboarding'

  // If user is not authenticated and not on login page, redirect to login
  if (!session && !isLoginPage) {
    const redirectUrl = new URL('/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated
  if (session) {
    // Check if onboarding is completed
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('onboarding_completed')
      .eq('id', session.user.id)
      .single()

    const hasCompletedOnboarding = profile?.onboarding_completed === true

    // If on login page and authenticated, redirect based on onboarding status
    if (isLoginPage) {
      const redirectUrl = hasCompletedOnboarding
        ? new URL('/', request.url)
        : new URL('/onboarding', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // If onboarding not completed and not on onboarding page, redirect to onboarding
    if (!hasCompletedOnboarding && !isOnboardingPage) {
      const redirectUrl = new URL('/onboarding', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // If onboarding completed and on onboarding page, redirect to home
    if (hasCompletedOnboarding && isOnboardingPage) {
      const redirectUrl = new URL('/', request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
