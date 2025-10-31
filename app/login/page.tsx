'use client'

import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showRefreshButton, setShowRefreshButton] = useState(false)

  const handleSocialLogin = async (provider: 'google') => {
    try {
      setLoading(provider)
      setError(null)

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
        setLoading(null)
      }
    } catch (err) {
      setError('An unexpected error occurred')
      setLoading(null)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      setLoading('email')
      setError(null)

      if (authMode === 'signup') {
        const { data: signUpData, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (error) {
          setError(error.message)
          setLoading(null)
          return
        }

        // Create initial user profile immediately after signup
        if (signUpData.user) {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: signUpData.user.id,
              onboarding_completed: false,
            })

          if (profileError) {
            console.error('Failed to create profile:', profileError)
            // Continue anyway - the profile will be created during onboarding
          }
        }

        // Sign up successful - redirect and let middleware handle onboarding
        // Set a timeout to handle slow navigation
        const navigationTimeout = setTimeout(() => {
          setLoading(null)
          setShowRefreshButton(true)
          setError('Sign up successful! If the page doesn\'t redirect automatically, please click the refresh button below.')
        }, 15000) // 15 second timeout

        try {
          router.push('/')
          router.refresh()
          // If navigation succeeds quickly, clear the timeout
          clearTimeout(navigationTimeout)
        } catch (navError) {
          clearTimeout(navigationTimeout)
          setError('Navigation failed. Please click the refresh button to continue.')
          setLoading(null)
          setShowRefreshButton(true)
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          setError(error.message)
          setLoading(null)
          return
        }

        // Sign in successful - redirect and let middleware handle routing
        // Set a timeout to handle slow navigation
        const navigationTimeout = setTimeout(() => {
          setLoading(null)
          setShowRefreshButton(true)
          setError('Login successful! If the page doesn\'t redirect automatically, please click the refresh button below.')
        }, 15000) // 15 second timeout

        try {
          router.push('/')
          router.refresh()
          // If navigation succeeds quickly, clear the timeout
          clearTimeout(navigationTimeout)
        } catch (navError) {
          clearTimeout(navigationTimeout)
          setError('Navigation failed. Please click the refresh button to continue.')
          setLoading(null)
          setShowRefreshButton(true)
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome
            </h1>
            <p className="text-gray-600">
              {authMode === 'signin'
                ? 'Sign in to get started with your onboarding journey'
                : 'Create an account to begin your journey'}
            </p>
          </div>

          {/* Tab Toggle */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-6">
            <button
              onClick={() => {
                setAuthMode('signin')
                setError(null)
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                authMode === 'signin'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode('signup')
                setError(null)
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                authMode === 'signup'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className={`mb-6 p-4 border rounded-lg ${
              showRefreshButton
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <p className={`text-sm ${showRefreshButton ? 'text-yellow-700' : 'text-red-700'}`}>
                {error}
              </p>
              {showRefreshButton && (
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all"
                >
                  Refresh Page
                </button>
              )}
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading !== null}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={authMode === 'signup' ? 'At least 6 characters' : 'Your password'}
                disabled={loading !== null}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading !== null}
              className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading === 'email' ? (
                <>
                  <div className="w-5 h-5 border-2 border-indigo-200 border-t-white rounded-full animate-spin" />
                  <span>Logging you in... this may take a moment</span>
                </>
              ) : (
                authMode === 'signin' ? 'Sign In' : 'Sign Up'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'google' ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              Google
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            By {authMode === 'signin' ? 'signing in' : 'signing up'}, you agree to our terms of service and privacy policy
          </p>
        </div>
      </div>
    </div>
  )
}
