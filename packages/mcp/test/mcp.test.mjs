import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createAtlasMCPService, createAtlasMcpServer } from '../dist/index.js'

test('MCP service exposes design resources, progressive skills and AI page planning', async () => {
  const service = createAtlasMCPService({ workspaceRoot: process.cwd() })
  assert.equal(service.resources.components.length, 51)
  assert.equal(service.resources.patterns.filter((pattern) => pattern.group === 'ai').length, 15)
  assert.equal(service.planPage({ intent: '知识库 RAG 检索页面' }).pattern.id, 'ai-knowledge')
  const skill = await service.getSkill('atlas-eids-design-system')
  assert.match(skill.source, /必须遵循的闭环/)
  assert.ok(skill.references.some((path) => path.endsWith('visual-quality.md')))
  const visualReference = await service.getSkill('atlas-eids-design-system', 'visual-quality.md')
  assert.match(visualReference.reference.source, /42px/)
  const componentManifest = JSON.parse(await service.readDesignManifest('component-manifest.json'))
  assert.equal(componentManifest.componentCount, 50)
  assert.ok(componentManifest.components.some((component) => component.name === 'AtlasDataTable' && component.states.includes('loading')))
  await assert.rejects(() => service.getSkill('atlas-eids-design-system', '../secret.md'), /Unknown reference/)
  const { server } = createAtlasMcpServer({ service })
  assert.equal(typeof server.connect, 'function')
})

test('MCP validation reads workspace files and blocks path traversal', async () => {
  const root = await mkdtemp(join(tmpdir(), 'atlas-mcp-'))
  await writeFile(join(root, 'page.tsx'), "import { AtlasCitationList } from '@atlas-eids/react'; export const Page=()=> <main><h1>AI 知识</h1><AtlasCitationList items={[]}/></main>")
  const service = createAtlasMCPService({ workspaceRoot: root })
  assert.equal((await service.validateSource({ path: 'page.tsx', framework: 'react', aiPage: true })).valid, true)
  assert.throws(() => service.validateSource({ path: '../secret.txt' }), /outside/)
  const bundledSkill = await service.getSkill('atlas-ai')
  assert.match(bundledSkill.source, /Living Orb/)
  const bundledManifest = JSON.parse(await service.readDesignManifest('visual-rules.json'))
  assert.equal(bundledManifest.rules.maxContentRadius, 8)
  await rm(root, { recursive: true, force: true })
})
