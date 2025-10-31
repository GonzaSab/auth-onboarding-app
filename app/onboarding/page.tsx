'use client'

import { createClient } from '@/lib/supabase'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    question1: '',
    question2: '',
    question3: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log('Starting onboarding submission...')

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        console.error('No user found')
        setError('You must be logged in to complete onboarding')
        setLoading(false)
        return
      }

      console.log('User authenticated, submitting to API...')

      // Submit onboarding data to API
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          question1: formData.question1,
          question2: formData.question2,
          question3: formData.question3,
        }),
      })

      console.log('API response status:', response.status)

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('API error:', data)
        throw new Error(data.error || 'Failed to submit onboarding')
      }

      console.log('API request successful, redirecting...')

      // Wait a brief moment to ensure database write is committed
      await new Promise(resolve => setTimeout(resolve, 500))

      // Refresh the router cache to ensure middleware gets fresh data
      router.refresh()

      // Wait another brief moment for cache refresh
      await new Promise(resolve => setTimeout(resolve, 300))

      // Now redirect to home
      router.push('/')
    } catch (err) {
      console.error('Submission error:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isFormValid = formData.question1.trim() && formData.question2.trim() && formData.question3.trim()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Bienvenido!
            </h1>
            <p className="text-gray-600">
              Estas preguntas me ayudan a crear mejor contenido y videos para vos. Respondelas con la mayor honestidad posible, así puedo entender mejor qué es lo que necesitás.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="question1" className="block text-sm font-medium text-gray-700 mb-2">
                1. Contame un poco sobre vos
              </label>
              <textarea
                id="question1"
                rows={4}
                value={formData.question1}
                onChange={(e) => handleChange('question1', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Tu edad, a qué te dedicás, qué experiencia tenés con programación o IA..."
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="question2" className="block text-sm font-medium text-gray-700 mb-2">
                2. ¿Qué te trae por acá?
              </label>
              <textarea
                id="question2"
                rows={4}
                value={formData.question2}
                onChange={(e) => handleChange('question2', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="¿Querés aprender a programar? ¿Construir algo específico? ¿Automatizar tu trabajo? ¿Independencia financiera? Contame..."
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="question3" className="block text-sm font-medium text-gray-700 mb-2">
                3. ¿Qué te gustaría ver en futuros videos?
              </label>
              <textarea
                id="question3"
                rows={4}
                value={formData.question3}
                onChange={(e) => handleChange('question3', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Temas relacionados con IA, automatización, herramientas como Cursor, Claude Code, Bolt.new, etc..."
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </span>
              ) : (
                'Completar'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
