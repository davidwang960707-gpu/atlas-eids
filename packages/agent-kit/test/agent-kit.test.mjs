import assert from 'node:assert/strict'
import test from 'node:test'
import { atlasComponents, atlasPagePatterns, atlasSkills, createAtlasAgentDevelopmentLoop, planAtlasPage, queryAtlasComponents, validateAtlasPagePipeline, validateAtlasPageSource } from '../dist/index.js'

test('agent knowledge exposes cross-framework components, AI patterns and progressive skills', () => {
  assert.equal(atlasComponents.length, 67)
  assert.equal(atlasComponents.find((component) => component.name === 'AtlasDataTable').category, 'composition')
  assert.equal(atlasPagePatterns.filter((pattern) => pattern.group === 'ai').length, 15)
  assert.equal(atlasSkills.length, 7)
  assert.equal(queryAtlasComponents('MCP')[0].name, 'AtlasMCPServerPicker')
})

test('all page recipes expose executable composition contracts', () => {
  assert.equal(atlasPagePatterns.length, 26)
  for (const pattern of atlasPagePatterns) {
    assert.ok(pattern.primaryTask, `${pattern.id} primaryTask`)
    assert.ok(pattern.primaryAction, `${pattern.id} primaryAction`)
    assert.ok(pattern.secondaryRegions.length > 0, `${pattern.id} secondaryRegions`)
    assert.ok(pattern.requiredStates.includes('loading'), `${pattern.id} loading state`)
    assert.ok(pattern.requiredStates.includes('permission-denied'), `${pattern.id} permission state`)
    assert.ok(pattern.responsiveContract.length >= 3, `${pattern.id} responsive contract`)
    assert.ok(pattern.informationPriority.length >= 4, `${pattern.id} information priority`)
    assert.ok(pattern.completionCriteria.length >= 2, `${pattern.id} completion criteria`)
  }
})

test('page planner maps intent to an Atlas pattern and component contract', () => {
  const plan = planAtlasPage({ intent: '创建一个有知识源、检索轨迹和引用的 RAG 知识库页面', framework: 'vue' })
  assert.equal(plan.pattern.id, 'ai-knowledge')
  assert.equal(plan.framework, 'vue')
  assert.ok(plan.components.some((component) => component.name === 'AtlasKnowledgeSourcePicker'))
  assert.ok(plan.components.some((component) => component.name === 'AtlasDataTable'))
  assert.ok(plan.instructions.some((instruction) => instruction.includes('42px')))
  assert.ok(plan.instructions.some((instruction) => instruction.includes('导入知识源')))
  assert.ok(plan.instructions.some((instruction) => instruction.includes('空筛选结果')))
  assert.equal(planAtlasPage({ intent: '权限感知的知识检索页面' }).pattern.id, 'ai-knowledge')
})

test('source validator protects Orb semantics and high-risk AI actions', () => {
  const invalid = validateAtlasPageSource('<main><AtlasOrb/><button>批量发布</button></main>', { aiPage: true })
  assert.equal(invalid.valid, false)
  assert.ok(invalid.issues.some((issue) => issue.code === 'orb-semantic-misuse'))
  assert.ok(invalid.issues.some((issue) => issue.code === 'missing-human-control'))
  const valid = validateAtlasPageSource("import { AtlasCitationList, AtlasDialog } from '@atlas-eids/react'; export const Page=()=> <main><h1>AI 审批</h1><AtlasCitationList items={[]}/><AtlasDialog open={false} title='确认发布' onClose={()=>{}}>审批</AtlasDialog></main>", { aiPage: true, framework: 'react' })
  assert.equal(valid.valid, true)
})

test('source validator protects formal table and surface composition contracts', () => {
  const nativeTable = validateAtlasPageSource('<main><h1>任务</h1><table><tbody><tr><td>AT-1</td></tr></tbody></table></main>')
  assert.equal(nativeTable.valid, false)
  assert.ok(nativeTable.issues.some((issue) => issue.code === 'native-table-bypass'))
  const orbRow = validateAtlasPageSource("import { AtlasTable, AtlasOrb } from '@atlas-eids/react'; const columns=[{key:'name',title:'任务',render:()=> <AtlasOrb/>}]; export const Page=()=> <main><h1>任务</h1><AtlasTable columns={columns} rows={[]}/></main>", { framework: 'react' })
  assert.equal(orbRow.valid, false)
  assert.ok(orbRow.issues.some((issue) => issue.code === 'orb-in-data-row'))
})

test('source validator understands the AtlasPageHeader heading contract', () => {
  const reactPage = validateAtlasPageSource("import { AtlasPageHeader } from '@atlas-eids/react'; export const Page=()=> <main><AtlasPageHeader title='知识库管理'/></main>", { framework: 'react' })
  const vuePage = validateAtlasPageSource("<template><main><AtlasPageHeader title='知识库管理' /></main></template><script setup>import { AtlasPageHeader } from '@atlas-eids/vue'</script>", { framework: 'vue' })
  assert.equal(reactPage.issues.some((issue) => issue.code === 'missing-page-heading'), false)
  assert.equal(vuePage.issues.some((issue) => issue.code === 'missing-page-heading'), false)
})

test('source validator reports typography, spacing and primary-action drift', () => {
  const source = "/* .page { padding: 15px; font-size: 11px; } */ import { AtlasButton, AtlasPageHeader } from '@atlas-eids/react'; export const Page=()=> <main><AtlasPageHeader title='知识库'/><AtlasButton intent='primary'>导入</AtlasButton><AtlasButton intent='primary'>新建</AtlasButton></main>"
  const result = validateAtlasPageSource(source, { framework: 'react' })
  assert.ok(result.issues.some((issue) => issue.code === 'undersized-readable-text'))
  assert.ok(result.issues.some((issue) => issue.code === 'off-scale-spacing'))
  assert.ok(result.issues.some((issue) => issue.code === 'competing-primary-actions'))
})

test('validation pipeline reports AST, type, DOM and visual stages', () => {
  const result = validateAtlasPagePipeline({
    source: "import { AtlasPageHeader } from '@atlas-eids/react'; export const Page=()=> <main><AtlasPageHeader title='任务'/></main>",
    framework: 'react',
    dom: { headingCount: 1, duplicateIds: [], unlabeledControls: [], horizontalOverflow: [], clippedContent: [], undersizedTargets: [], primaryActionsByRegion: [1] },
    visual: { desktopScreenshot: 'desktop.png', mobileScreenshot: 'mobile.png', diffPixelRatio: 0.01, maxDiffPixelRatio: 0.04 }
  })
  assert.equal(result.valid, true)
  assert.deepEqual(result.stages.map((stage) => stage.name), ['source', 'ast', 'type', 'dom', 'visual'])
  assert.ok(result.stages.every((stage) => stage.status === 'passed'))
})

test('development loop verifies and repairs generated pages', async () => {
  let repaired = false
  const loop = createAtlasAgentDevelopmentLoop({
    generate: async () => '<main><h1>AI 对话</h1></main>',
    verify: async () => ({ ok: repaired, diagnostics: repaired ? [] : ['missing component'] }),
    repair: async () => { repaired = true; return "import { AtlasCitationList } from '@atlas-eids/react'; export const Page=()=> <main><h1>AI 对话</h1><AtlasCitationList items={[]}/></main>" }
  })
  const result = await loop.run({ intent: 'AI 对话' })
  assert.equal(result.status, 'completed')
  assert.equal(result.attempts.length, 2)
})
