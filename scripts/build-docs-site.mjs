import { readFile, writeFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import { marked } from 'marked'

const root = resolve(import.meta.dirname, '..')

const documents = [
  { id: 'getting-started', title: '快速开始', group: '开始', file: 'docs/GETTING_STARTED.md' },
  { id: 'package-status', title: 'Packages 发布状态', group: '开始', file: 'docs/PACKAGE_STATUS.md' },
  { id: 'design-tokens', title: 'Design Tokens', group: '设计系统', file: 'docs/DESIGN_TOKENS.md' },
  { id: 'components', title: '组件说明', group: '设计系统', file: 'docs/COMPONENTS.md' },
  { id: 'app-frameworks', title: '应用框架与页面模板', group: '设计系统', file: 'docs/APP_FRAMEWORK_LIBRARY.md' },
  { id: 'architecture', title: '工程架构', group: '工程', file: 'docs/ARCHITECTURE.md' },
  { id: 'engineering', title: '工程化与质量基线', group: '工程', file: 'docs/ENGINEERING.md' },
  { id: 'plugin-development', title: '插件与第三方组件', group: '工程', file: 'docs/PLUGIN_DEVELOPMENT.md' },
  { id: 'ai-runtime', title: 'AI Runtime 与 Web Agent', group: 'AI 与后端', file: 'docs/AI_RUNTIME.md' },
  { id: 'java-backend', title: 'Java 后端', group: 'AI 与后端', file: 'docs/JAVA_BACKEND.md' },
  { id: 'roadmap', title: '路线图', group: '维护', file: 'docs/ROADMAP.md' },
  { id: 'opentiny-roadmap', title: 'OpenTiny 对标路线图', group: '维护', file: 'docs/OPENTINY_PARITY_ROADMAP.md' },
  { id: 'open-source-checklist', title: '开源检查清单', group: '维护', file: 'docs/OPEN_SOURCE_CHECKLIST.md' },
  { id: 'contributing', title: '贡献指南', group: '维护', file: 'CONTRIBUTING.md' },
  { id: 'security', title: '安全策略', group: '维护', file: 'SECURITY.md' }
]

const routeByFile = new Map(documents.map((doc) => [basename(doc.file).toLowerCase(), doc.id]))

function stripMarkdown(value) {
  return value.replace(/[`*_\[\]<>]/g, '').replace(/\s+/g, ' ').trim()
}

function headingId(label, index) {
  const ascii = label.toLowerCase().replace(/<[^>]*>/g, '').replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-').replace(/^-|-$/g, '')
  return ascii || `section-${index + 1}`
}

function rewriteMarkdownLinks(html) {
  return html.replace(/href="([^"]+\.md)(#[^"]*)?"/gi, (match, target, hash = '') => {
    const route = routeByFile.get(basename(target).toLowerCase())
    return route ? `href="#/${route}${hash}"` : match
  })
}

async function compileDocument(document) {
  const markdown = await readFile(resolve(root, document.file), 'utf8')
  const headings = [...markdown.matchAll(/^(#{2,4})\s+(.+)$/gm)].map((match, index) => ({
    level: match[1].length,
    label: stripMarkdown(match[2]),
    id: headingId(stripMarkdown(match[2]), index)
  }))
  let headingIndex = 0
  let html = marked.parse(markdown, { gfm: true })
  html = html.replace(/<h([2-4])>([\s\S]*?)<\/h\1>/g, (match, level, contents) => {
    const heading = headings[headingIndex++]
    return `<h${level} id="${heading?.id ?? `section-${headingIndex}`}">${contents}</h${level}>`
  })
  html = rewriteMarkdownLinks(html)
  const searchText = stripMarkdown(markdown.replace(/```[\s\S]*?```/g, ' '))
  return { ...document, html, headings, searchText }
}

const compiled = await Promise.all(documents.map(compileDocument))
const components = JSON.parse(await readFile(resolve(root, 'docs/component-api.json'), 'utf8')).map((component) => ({
  ...component,
  frameworks: ['React', 'Vue 3'],
  props: component.props.map(([name, type, defaultValue, description]) => ({ name, type, defaultValue, description }))
}))

const data = {
  version: '0.2.0-dev',
  generatedAt: new Date().toISOString(),
  documents: compiled,
  components,
  groups: [...new Set(documents.map((document) => document.group))]
}

const serialized = JSON.stringify(data).replaceAll('</script>', '<\\/script>')
await writeFile(resolve(root, 'js/docs-content.js'), `window.ATLAS_DOCS_DATA = ${serialized};\n`)
console.log(`Built browser documentation: ${compiled.length} documents, ${components.length} component APIs`)
