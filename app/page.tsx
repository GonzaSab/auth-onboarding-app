import { createServerSupabaseClient } from '@/lib/supabase'
import { promises as fs } from 'fs'
import path from 'path'
import DocumentationContent from './components/DocumentationContent'

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Load markdown documentation
  const markdownPath = path.join(process.cwd(), 'public', 'docs', 'mcps-documentation.md')
  const markdownContent = await fs.readFile(markdownPath, 'utf-8')

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <div className="max-w-4xl">
            {user?.email && (
              <div className="inline-block bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                👋 Hola, {user.email}
              </div>
            )}

            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              MCPS & Agents con Claude Code
            </h1>

            <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed max-w-3xl">
              Documentación completa sobre Multi-Context Processing Systems, Agents, instalación y configuración de Claude Code, comandos importantes y buenas prácticas.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#introducción"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
              >
                Comenzar
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>

              <a
                href="#configuración-inicial-de-claude"
                className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border-2 border-white/20"
              >
                Configuración Inicial
              </a>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-2xl">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">14</div>
                <div className="text-sm text-blue-200">Secciones</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">400+</div>
                <div className="text-sm text-blue-200">Líneas de Doc</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">∞</div>
                <div className="text-sm text-blue-200">Posibilidades</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="relative">
          <svg className="w-full h-12 lg:h-16 text-white" viewBox="0 0 1440 48" fill="currentColor" preserveAspectRatio="none">
            <path d="M0,32L120,37.3C240,43,480,53,720,48C960,43,1200,21,1320,10.7L1440,0L1440,48L1320,48C1200,48,960,48,720,48C480,48,240,48,120,48L0,48Z" />
          </svg>
        </div>
      </div>

      {/* Documentation Content */}
      <div className="py-12">
        <DocumentationContent markdown={markdownContent} />
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © 2025 MCPS & Claude Code Documentation. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <a href="https://docs.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                Anthropic Docs
              </a>
              <a href="https://github.com/GonzaSab/auth-onboarding-app" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
