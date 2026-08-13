import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const workspace = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))
const packageDirectories = [
  'tokens', 'core', 'plugin-sdk', 'adapters', 'adapter-antd-react',
  'adapter-tdesign-vue', 'adapter-opentiny-vue', 'ai-runtime',
  'web-agent', 'agent-kit', 'mcp', 'cli', 'react', 'vue'
]
const temporaryRoot = mkdtempSync(join(tmpdir(), 'atlas-eids-release-'))
const tarballs = resolve(temporaryRoot, 'tarballs')
const probe = resolve(temporaryRoot, 'probe')
const apps = resolve(temporaryRoot, 'apps')
mkdirSync(tarballs)
mkdirSync(probe)
mkdirSync(apps)

function run(command, args, cwd, options = {}) {
  execFileSync(command, args, { cwd, stdio: 'inherit', env: { ...process.env, npm_config_audit: 'false', npm_config_fund: 'false' }, ...options })
}

function usePackedDependencies(appRoot) {
  const manifestPath = resolve(appRoot, 'package.json')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  for (const name of Object.keys(manifest.dependencies ?? {})) {
    if (!name.startsWith('@atlas-eids/')) continue
    const directory = packageDirectories.find((candidate) => {
      const packageJson = JSON.parse(readFileSync(resolve(root, 'packages', candidate, 'package.json'), 'utf8'))
      return packageJson.name === name
    })
    if (!directory) throw new Error(`Cannot locate packed dependency ${name}`)
    const packageJson = JSON.parse(readFileSync(resolve(root, 'packages', directory, 'package.json'), 'utf8'))
    const archive = `${name.slice(1).replace('/', '-')}-${packageJson.version}.tgz`
    manifest.dependencies[name] = `file:${resolve(tarballs, archive)}`
  }
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
}

try {
  for (const directory of packageDirectories) {
    run('npm', ['pack', '--pack-destination', tarballs, '--silent'], resolve(root, 'packages', directory))
  }
  const archives = readdirSync(tarballs).filter((file) => file.endsWith('.tgz')).sort()
  if (archives.length !== packageDirectories.length) throw new Error(`Expected ${packageDirectories.length} tarballs, received ${archives.length}`)

  run('npm', ['init', '-y'], probe, { stdio: 'ignore' })
  run('npm', ['install', ...archives.map((file) => resolve(tarballs, file)), 'react@19', 'react-dom@19', 'vue@3', '--ignore-scripts'], probe)
  run('node', ['--input-type=module', '-e', "await import('@atlas-eids/core'); await import('@atlas-eids/react'); await import('@atlas-eids/vue'); await import('@atlas-eids/agent-kit'); await import('@atlas-eids/mcp'); console.log('Fresh package imports passed.')"], probe)

  const cli = resolve(probe, 'node_modules/@atlas-eids/cli/dist/cli.mjs')
  run('node', [cli, 'create', 'atlas-react-enterprise', '--framework', 'react', '--template', 'agent-task', '--framework-layout', 'tenant', '--density', 'compact', '--locale', 'zh-CN', '--adapter', 'native', '--backend', 'java'], apps)
  run('node', [cli, 'create', 'atlas-vue-enterprise', '--framework', 'vue', '--template', 'data-list', '--framework-layout', 'hybrid', '--density', 'standard', '--locale', 'en-US', '--adapter', 'native', '--backend', 'none'], apps)

  const reactApp = resolve(apps, 'atlas-react-enterprise')
  const vueApp = resolve(apps, 'atlas-vue-enterprise')
  usePackedDependencies(reactApp)
  usePackedDependencies(vueApp)
  const packedBatch = archives.map((file) => resolve(tarballs, file))
  run('npm', ['install', ...packedBatch], reactApp)
  run('npm', ['run', 'build'], reactApp)
  run('npm', ['install', ...packedBatch], vueApp)
  run('npm', ['run', 'build'], vueApp)
  run('mvn', ['--batch-mode', '-q', '-f', resolve(reactApp, 'server/pom.xml'), 'test'], reactApp)

  const requiredFiles = [
    resolve(reactApp, 'dist/index.html'),
    resolve(vueApp, 'dist/index.html'),
    resolve(reactApp, 'src/atlas-api.ts'),
    resolve(reactApp, 'src/auth.ts'),
    resolve(reactApp, 'src/navigation.ts'),
    resolve(reactApp, 'server/pom.xml'),
    resolve(vueApp, 'src/atlas-api.ts')
  ]
  for (const file of requiredFiles) if (!existsSync(file)) throw new Error(`Missing generated artifact: ${file}`)
  const reactClient = readFileSync(resolve(reactApp, 'src/atlas-api.ts'), 'utf8')
  const vueClient = readFileSync(resolve(vueApp, 'src/atlas-api.ts'), 'utf8')
  for (const symbol of ['getAtlasTenantContext', 'listAtlasAuditRecords', 'X-Atlas-Tenant']) {
    if (!reactClient.includes(symbol)) throw new Error(`React Java API Client is missing ${symbol}`)
  }
  if (!vueClient.includes('listAtlasAuditRecords')) throw new Error('Vue Java API Client is missing audit support')

  const report = {
    version: workspace.version,
    status: 'passed',
    packageCount: archives.length,
    packageArchives: archives,
    applications: [
      { framework: 'react', layout: 'tenant', template: 'agent-task', backend: 'java', build: 'passed', javaClient: 'passed' },
      { framework: 'vue', layout: 'hybrid', template: 'data-list', backend: 'none', build: 'passed', javaClient: 'passed' }
    ]
  }
  writeFileSync(resolve(root, 'reports/release-candidate.json'), `${JSON.stringify(report, null, 2)}\n`)
  console.log(`Fresh install verified for ${archives.length} packages, React, Vue and Java Client.`)
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true })
}
