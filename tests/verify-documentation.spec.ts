import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

test.describe('Documentation Implementation Verification', () => {
  test('verify markdown file exists and has content', async () => {
    const markdownPath = path.join(process.cwd(), 'public', 'docs', 'mcps-documentation.md')

    // Check file exists
    expect(fs.existsSync(markdownPath)).toBe(true)

    // Read content
    const content = fs.readFileSync(markdownPath, 'utf-8')

    // Verify it has substantial content
    expect(content.length).toBeGreaterThan(1000)

    // Verify key sections exist
    expect(content).toContain('Introducción')
    expect(content).toContain('MCPS')
    expect(content).toContain('Claude')

    console.log(`✅ Markdown file verified: ${content.length} characters, ${content.split('\n').length} lines`)
  })

  test('verify DocumentationContent component exists', async () => {
    const componentPath = path.join(process.cwd(), 'app', 'components', 'DocumentationContent.tsx')

    expect(fs.existsSync(componentPath)).toBe(true)

    const content = fs.readFileSync(componentPath, 'utf-8')

    // Verify key features are implemented
    expect(content).toContain('ReactMarkdown')
    expect(content).toContain('rehypeHighlight')
    expect(content).toContain('IntersectionObserver')
    expect(content).toContain('setActiveSection')
    expect(content).toContain('table of contents')

    console.log('✅ DocumentationContent component verified with all required features')
  })

  test('verify page.tsx loads markdown and passes to component', async () => {
    const pagePath = path.join(process.cwd(), 'app', 'page.tsx')

    expect(fs.existsSync(pagePath)).toBe(true)

    const content = fs.readFileSync(pagePath, 'utf-8')

    // Verify it loads markdown
    expect(content).toContain('mcps-documentation.md')
    expect(content).toContain('fs.readFile')
    expect(content).toContain('DocumentationContent')
    expect(content).toContain('markdown={markdownContent}')

    // Verify hero section
    expect(content).toContain('MCPS & Agents con Claude Code')
    expect(content).toContain('gradient')

    console.log('✅ Page.tsx verified with markdown loading and hero section')
  })

  test('verify package.json has required dependencies', async () => {
    const packagePath = path.join(process.cwd(), 'package.json')
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))

    const requiredDeps = [
      'react-markdown',
      'remark-gfm',
      'rehype-highlight',
      'rehype-slug',
      'rehype-autolink-headings'
    ]

    for (const dep of requiredDeps) {
      expect(packageJson.dependencies[dep]).toBeDefined()
      console.log(`✅ Found dependency: ${dep}@${packageJson.dependencies[dep]}`)
    }
  })
})
