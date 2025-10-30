'use client'

import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import 'highlight.js/styles/github-dark.css'

interface TOCItem {
  id: string
  text: string
  level: number
}

export default function DocumentationContent({ markdown }: { markdown: string }) {
  const [activeSection, setActiveSection] = useState<string>('')
  const [toc, setToc] = useState<TOCItem[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Extract table of contents from markdown
  useEffect(() => {
    const headings = markdown.match(/^#{1,3}\s+.+$/gm) || []
    const tocItems: TOCItem[] = headings
      .map(heading => {
        const level = heading.match(/^#+/)?.[0].length || 0
        const text = heading.replace(/^#+\s+/, '')
        const id = text
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove accents
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
        return { id, text, level }
      })
      .filter(item => item.level <= 3) // Only h1, h2, h3

    setToc(tocItems)
  }, [markdown])

  // Intersection Observer for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -80% 0px' }
    )

    // Observe all headings
    const headings = document.querySelectorAll('h1[id], h2[id], h3[id]')
    headings.forEach(heading => observer.observe(heading))

    return () => observer.disconnect()
  }, [markdown])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <div className="flex max-w-screen-2xl mx-auto">
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Toggle navigation"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Table of Contents - Sidebar */}
      <aside className={`
        lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:overflow-y-auto
        fixed inset-0 z-40 bg-white lg:bg-transparent
        transform transition-transform duration-300 lg:transform-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:w-64 lg:flex-shrink-0 p-6 lg:p-0 lg:pr-8
      `}>
        <div className="lg:hidden flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Índice</h3>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="space-y-1">
          <h3 className="hidden lg:block font-bold text-sm text-gray-900 mb-4">Contenido</h3>
          {toc.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`
                block w-full text-left text-sm py-1.5 px-3 rounded transition-colors
                ${item.level === 1 ? 'font-semibold' : item.level === 2 ? 'pl-6' : 'pl-9 text-xs'}
                ${activeSection === item.id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              {item.text}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 px-6 lg:px-12 pb-24">
        <article className="prose prose-slate prose-lg max-w-none
          prose-headings:scroll-mt-20
          prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-4 prose-h1:mt-8
          prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-3 prose-h2:mt-8 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-200
          prose-h3:text-2xl prose-h3:font-semibold prose-h3:mb-2 prose-h3:mt-6
          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-4
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
          prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
          prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
          prose-li:text-gray-700 prose-li:my-1
          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
          prose-strong:text-gray-900 prose-strong:font-semibold
        ">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              rehypeHighlight,
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: 'wrap' }]
            ]}
          >
            {markdown}
          </ReactMarkdown>
        </article>
      </main>
    </div>
  )
}
