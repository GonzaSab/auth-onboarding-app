import { createServerSupabaseClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('========================================')
  console.log('[API] POST /api/onboarding called')
  console.log('========================================')

  try {
    console.log('[API] Onboarding submission started')
    const supabase = await createServerSupabaseClient()

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('[API] Auth error:', authError)
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('[API] User authenticated:', user.id)

    // Parse request body
    const body = await request.json()
    const { question1, question2, question3 } = body

    // Validate required fields
    if (!question1 || !question2 || !question3) {
      console.error('[API] Validation failed: missing answers')
      return NextResponse.json(
        { error: 'All questions must be answered' },
        { status: 400 }
      )
    }

    console.log('[API] Upserting user profile for user ID:', user.id)

    // Insert or update user profile with onboarding data
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: user.id,
        question_1_answer: question1.trim(),
        question_2_answer: question2.trim(),
        question_3_answer: question3.trim(),
        onboarding_completed: true,
      })
      .select()
      .single()

    console.log('[API] Upsert result - data:', data, 'error:', error)

    if (error) {
      console.error('[API] Database error:', error)
      console.error('[API] Error code:', error.code)
      console.error('[API] Error details:', error.details)
      console.error('[API] Error hint:', error.hint)
      return NextResponse.json(
        { error: 'Failed to save onboarding data', details: error.message },
        { status: 500 }
      )
    }

    if (!data) {
      console.error('[API] No data returned from upsert - possible RLS issue')
      return NextResponse.json(
        { error: 'Failed to save onboarding data - no data returned' },
        { status: 500 }
      )
    }

    console.log('[API] Onboarding data saved successfully:', data)

    // Create response with cache-busting headers
    const successResponse = NextResponse.json(
      { message: 'Onboarding completed successfully', data },
      { status: 200 }
    )

    // Add headers to prevent caching of user profile data
    successResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    successResponse.headers.set('Pragma', 'no-cache')
    successResponse.headers.set('Expires', '0')

    return successResponse
  } catch (error) {
    console.error('[API] Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}
