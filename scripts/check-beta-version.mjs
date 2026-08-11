import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const packages = [
  'tokens', 'core', 'plugin-sdk', 'adapters', 'adapter-antd-react',
  'adapter-tdesign-vue', 'adapter-opentiny-vue', 'ai-runtime',
  'web-agent', 'cli', 'react', 'vue'
]

for (const directory of packages) {
  const packageJson = JSON.parse(await readFile(resolve(root, 'packages', directory, 'package.json'), 'utf8'))
  if (!/^\d+\.\d+\.\d+-beta\.\d+$/.test(packageJson.version)) {
    throw new Error(`${packageJson.name} 不是可发布的 Beta 版本: ${packageJson.version}`)
  }
}

console.log(`Beta versions verified for ${packages.length} packages.`)
