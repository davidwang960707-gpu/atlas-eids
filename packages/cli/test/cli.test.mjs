import assert from 'node:assert/strict'
import { execFile as execFileCallback } from 'node:child_process'
import { access, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { createProject, generatePage, listApplicationLayouts, listPagePatterns, upgradeProject } from '../src/generator.mjs'

const execFile = promisify(execFileCallback)
const cliPath = fileURLToPath(new URL('../src/cli.mjs', import.meta.url))

test('CLI creates a Vue project with selected page and Java backend source', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'atlas-cli-'))
  const result = await createProject({ name: 'atlas-demo', framework: 'vue', backend: 'java', template: 'ai-governance', packageSource: 'workspace', cwd })
  await access(join(result.target, 'src/App.vue'))
  assert.match(await readFile(join(result.target, 'src/GeneratedPage.vue'), 'utf8'), /AI 审计治理页/)
  await access(join(result.target, 'server/pom.xml'))
  const pom = await readFile(join(result.target, 'server/pom.xml'), 'utf8')
  assert.match(pom, /spring-boot-starter-parent/)
  assert.match(pom, /<java.version>21<\/java.version>/)
  assert.match(pom, /spring-boot-starter-oauth2-resource-server/)
  await access(join(result.target, 'server/src/main/java/design/atlas/eids/tenant/TenantFilter.java'))
  await access(join(result.target, 'server/src/main/java/design/atlas/eids/audit/AuditEvent.java'))
  await assert.rejects(access(join(result.target, 'server/target')), { code: 'ENOENT' })
  const packageJson = JSON.parse(await readFile(join(result.target, 'package.json'), 'utf8'))
  const vueDependency = packageJson.dependencies['@atlas-eids/vue'].replace(/^file:/, '')
  await access(resolve(result.target, vueDependency, 'package.json'))
  const apiClient = await readFile(join(result.target, 'src/atlas-api.ts'), 'utf8')
  assert.match(apiClient, /\/api\/v1\/auth\/token/)
  assert.match(apiClient, /\/api\/v1\/tenant\/current/)
  assert.match(apiClient, /\/api\/v1\/audit\/events/)
  assert.match(apiClient, /atlasRequest<T>/)
  assert.match(apiClient, /X-Atlas-Tenant/)
})

test('built CLI resolves bundled Java templates from its distribution directory', async () => {
  const { createProject: createBuiltProject } = await import('../dist/generator.mjs')
  const cwd = await mkdtemp(join(tmpdir(), 'atlas-cli-dist-'))
  const result = await createBuiltProject({
    name: 'atlas-dist-demo',
    framework: 'react',
    backend: 'java',
    packageSource: 'registry',
    cwd
  })
  await access(join(result.target, 'server/pom.xml'))
  await access(join(result.target, 'server/src/main/java/design/atlas/eids/AtlasEidsApplication.java'))
})

test('registry projects follow the installed CLI package version', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'atlas-registry-'))
  const result = await createProject({ name: 'atlas-registry', framework: 'react', packageSource: 'registry', cwd })
  const packageJson = JSON.parse(await readFile(join(result.target, 'package.json'), 'utf8'))
  const cliPackage = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
  assert.equal(packageJson.dependencies['@atlas-eids/react'], `^${cliPackage.version}`)
  assert.equal(packageJson.dependencies['@atlas-eids/tokens'], `^${cliPackage.version}`)
  const metadata = JSON.parse(await readFile(join(result.target, '.atlas-eids.json'), 'utf8'))
  assert.equal(metadata.generatorVersion, cliPackage.version)
})

test('CLI generates runnable React and Vue sources for all 15 page templates', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'atlas-page-'))
  const patterns = listPagePatterns()
  assert.equal(patterns.length, 15)
  for (const pattern of patterns) {
    const reactTarget = await generatePage({ pattern: pattern.id, framework: 'react', cwd })
    const vueTarget = await generatePage({ pattern: pattern.id, framework: 'vue', cwd })
    assert.match(await readFile(reactTarget, 'utf8'), /export function GeneratedPage/)
    assert.match(await readFile(vueTarget, 'utf8'), /<template>/)
  }
})

test('CLI rejects unknown templates before creating a project', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'atlas-invalid-'))
  await assert.rejects(
    createProject({ name: 'atlas-demo', template: 'unknown', cwd }),
    /Unknown page template/
  )
})

test('CLI generates all seven application framework shells for React and Vue', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'atlas-layouts-'))
  const layouts = listApplicationLayouts()
  assert.equal(layouts.length, 7)
  for (const [index, layout] of layouts.entries()) {
    const react = await createProject({
      name: `react-${layout.id}`,
      framework: 'react',
      frameworkLayout: layout.id,
      density: index % 2 ? 'compact' : 'comfortable',
      locale: index % 2 ? 'en-US' : 'zh-CN',
      adapter: 'native',
      packageSource: 'workspace',
      cwd
    })
    const vue = await createProject({
      name: `vue-${layout.id}`,
      framework: 'vue',
      frameworkLayout: layout.id,
      adapter: 'native',
      packageSource: 'workspace',
      cwd
    })
    assert.match(await readFile(join(react.target, 'src/AppShell.tsx'), 'utf8'), new RegExp(layout.title))
    assert.match(await readFile(join(vue.target, 'src/AppShell.vue'), 'utf8'), new RegExp(layout.title))
    const configuration = await readFile(join(react.target, 'src/atlas-config.ts'), 'utf8')
    const reactShell = await readFile(join(react.target, 'src/AppShell.tsx'), 'utf8')
    const vueShell = await readFile(join(vue.target, 'src/AppShell.vue'), 'utf8')
    const auth = await readFile(join(react.target, 'src/auth.ts'), 'utf8')
    const router = await readFile(join(react.target, 'src/router.ts'), 'utf8')
    const apiClient = await readFile(join(react.target, 'src/atlas-api.ts'), 'utf8')
    assert.match(configuration, new RegExp(layout.capabilities[0]))
    assert.match(reactShell, /navigateAtlas|toggleAtlasTheme/)
    assert.match(vueShell, /navigateAtlas|toggleAtlasTheme/)
    assert.match(auth, /setActiveTenant|canAccess/)
    assert.match(router, /subscribeAtlasRoute|resolveAtlasRoute/)
    assert.match(apiClient, /atlasRequest<T>|X-Atlas-Tenant/)
    await access(join(react.target, 'src/SystemPage.tsx'))
    await access(join(react.target, 'src/theme.ts'))
    await access(join(vue.target, 'src/SystemPage.vue'))
    await access(join(vue.target, 'src/theme.ts'))
    if (layout.id === 'tenant') {
      assert.match(auth, /actor: 'admin'/)
      assert.match(auth, /east-retail/)
      assert.match(reactShell, /tenant-switcher/)
    }
  }
})

test('CLI rejects unknown options instead of silently generating in the wrong directory', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'atlas-options-'))
  await assert.rejects(
    execFile(process.execPath, [cliPath, 'create', 'atlas-demo', '--output', cwd]),
    /Unknown option: --output/
  )
})

test('upgrade previews configuration changes and protects edited generated files', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'atlas-upgrade-'))
  const created = await createProject({ name: 'upgrade-demo', framework: 'react', packageSource: 'workspace', cwd })
  const preview = await upgradeProject({ target: created.target, density: 'compact', dryRun: true })
  assert.ok(preview.changes.some((change) => change.file === 'src/atlas-config.ts' && change.status === 'update'))

  const navigationPath = join(created.target, 'src/navigation.ts')
  await writeFile(navigationPath, (await readFile(navigationPath, 'utf8')) + '\n// project-owned change\n')
  const conflict = await upgradeProject({ target: created.target, locale: 'en-US', dryRun: true })
  assert.ok(conflict.conflicts.some((change) => change.file === 'src/navigation.ts'))

  const unchangedBefore = await readFile(navigationPath, 'utf8')
  await upgradeProject({ target: created.target, locale: 'en-US' })
  assert.equal(await readFile(navigationPath, 'utf8'), unchangedBefore)
})

test('CLI exposes agent planning, design knowledge and source validation', async () => {
  const knowledge = await execFile(process.execPath, [cliPath, 'knowledge', 'components', 'MCP'])
  assert.match(knowledge.stdout, /AtlasMCPServerPicker/)
  const plan = await execFile(process.execPath, [cliPath, 'agent', 'plan', '知识库检索与引用页面', '--framework', 'vue', '--json'])
  assert.equal(JSON.parse(plan.stdout).pattern.id, 'ai-knowledge')
  const contract = await execFile(process.execPath, [cliPath, 'knowledge', 'contract', 'AtlasDataTable'])
  const parsedContract = JSON.parse(contract.stdout)
  assert.equal(parsedContract.category, 'composition')
  assert.ok(parsedContract.tokens.includes('table.rowHeight.*'))
  const root = await mkdtemp(join(tmpdir(), 'atlas-eids-validation-'))
  const source = join(root, 'Page.tsx')
  await writeFile(source, "import { AtlasCitationList } from '@atlas-eids/react'; export const Page=()=> <main><h1>AI 知识</h1><AtlasCitationList items={[]}/></main>")
  const validation = await execFile(process.execPath, [cliPath, 'validate', source, '--framework', 'react', '--ai', '--json'])
  const parsedValidation = JSON.parse(validation.stdout)
  assert.equal(parsedValidation.valid, true)
  assert.deepEqual(parsedValidation.stages.map((stage) => stage.name), ['source', 'ast', 'type', 'dom', 'visual'])
  assert.equal(parsedValidation.stages[3].status, 'skipped')
  await rm(root, { recursive: true, force: true })
})
