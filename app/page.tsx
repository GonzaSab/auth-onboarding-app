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
      {/* YouTube Video Section */}
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 pt-12 pb-8">
        <div className="aspect-video w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/UZ5De45XZRU"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
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
