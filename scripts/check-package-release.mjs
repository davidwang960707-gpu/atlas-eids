import { access, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const root = resolve(import.meta.dirname, '..')
const workspacePackages = [
  'tokens', 'core', 'plugin-sdk', 'adapters', 'adapter-antd-react',
  'adapter-tdesign-vue', 'adapter-opentiny-vue', 'ai-runtime',
  'web-agent', 'agent-kit', 'mcp', 'cli', 'react', 'vue'
]
const expectedRepository = 'https://github.com/davidwang960707-gpu/atlas-eids.git'

for (const directory of workspacePackages) {
  const packageRoot = resolve(root, 'packages', directory)
  const path = resolve(packageRoot, 'package.json')
  const packageJson = JSON.parse(await readFile(path, 'utf8'))
  const missing = ['name', 'version', 'description', 'license', 'files', 'exports']
    .filter((field) => packageJson[field] === undefined)
  if (missing.length > 0) {
    throw new Error(`${packageJson.name ?? directory} 缺少发布字段: ${missing.join(', ')}`)
  }
  if (packageJson.private) throw new Error(`${packageJson.name} 不应标记为 private`)
  if (packageJson.publishConfig?.access !== 'public') {
    throw new Error(`${packageJson.name} 必须设置 publishConfig.access=public`)
  }
  if (packageJson.repository?.url !== expectedRepository) {
    throw new Error(`${packageJson.name} 缺少统一 repository.url`)
  }

  const exportTargets = []
  const collectTargets = (value) => {
    if (typeof value === 'string' && value.startsWith('./')) exportTargets.push(value)
    else if (value && typeof value === 'object') Object.values(value).forEach(collectTargets)
  }
  collectTargets(packageJson.exports)
  for (const target of exportTargets) await access(resolve(packageRoot, target))

  const packed = spawnSync('npm', ['pack', '--dry-run', '--json'], {
    cwd: packageRoot,
    encoding: 'utf8',
    env: { ...process.env, npm_config_loglevel: 'silent' }
  })
  if (packed.status !== 0) throw new Error(`${packageJson.name} npm pack 失败: ${packed.stderr.trim()}`)
  const manifest = JSON.parse(packed.stdout)[0]
  const paths = manifest.files.map((file) => file.path)
  const forbidden = paths.filter((file) => file.includes('/target/') || file.includes('.DS_Store') || file.startsWith('test/'))
  if (forbidden.length > 0) throw new Error(`${packageJson.name} 发布包包含禁止文件: ${forbidden.join(', ')}`)
  if (manifest.unpackedSize > 5_000_000) throw new Error(`${packageJson.name} 发布包解压体积超过 5 MB`)
}

console.log(`Release metadata verified for ${workspacePackages.length} public packages.`)
