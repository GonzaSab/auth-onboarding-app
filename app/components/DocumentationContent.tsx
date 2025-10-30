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
    <div className="max-w-screen-2xl mx-auto bg-white min-h-screen">
      {/* Main Content */}
      <main className="w-full px-6 lg:px-12 pb-24 bg-white">
        <article className="prose prose-slate prose-lg max-w-5xl mx-auto">
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
