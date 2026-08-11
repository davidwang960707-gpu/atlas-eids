import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = resolve(import.meta.dirname, '..')
const api = JSON.parse(await readFile(resolve(root, 'docs/component-api.json'), 'utf8'))
const names = api.map((component) => component.name)
const duplicates = names.filter((name, index) => names.indexOf(name) !== index)

if (duplicates.length > 0) {
  throw new Error(`组件 API 文档存在重复项: ${[...new Set(duplicates)].join(', ')}`)
}

const [react, vue] = await Promise.all([
  import(pathToFileURL(resolve(root, 'packages/react/dist/index.js'))),
  import(pathToFileURL(resolve(root, 'packages/vue/dist/index.js')))
])

for (const name of names) {
  if (!(name in react)) throw new Error(`React 缺少文档组件导出: ${name}`)
  if (!(name in vue)) throw new Error(`Vue 缺少文档组件导出: ${name}`)
}

const documentedUi = names.filter((name) => name !== 'AtlasProvider')
if (documentedUi.length !== 31) {
  throw new Error(`组件 API 文档应包含 31 个 UI 组件，当前为 ${documentedUi.length}`)
}

console.log(`Component API contract verified: ${names.length} documented exports across React and Vue.`)
