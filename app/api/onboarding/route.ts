import { createServerSupabaseClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { question1, question2, question3 } = body

    // Validate required fields
    if (!question1 || !question2 || !question3) {
      return NextResponse.json(
        { error: 'All questions must be answered' },
        { status: 400 }
      )
    }

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

    if (error) {
      console.error('Error saving onboarding data:', error)
      return NextResponse.json(
        { error: 'Failed to save onboarding data' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Onboarding completed successfully', data },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error in onboarding API:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
