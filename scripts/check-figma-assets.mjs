import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const variables = JSON.parse(await readFile(resolve(root, 'figma/atlas-eids.variables.json'), 'utf8'))
const components = JSON.parse(await readFile(resolve(root, 'manifests/component-manifest.json'), 'utf8'))
const mapping = JSON.parse(await readFile(resolve(root, 'figma/code-connect/component-mapping.json'), 'utf8'))

assert.equal(variables.sourceFormat, 'DTCG 2025.10')
assert.deepEqual(variables.collections.map((collection) => collection.name), ['Global', 'Semantic', 'Component', 'State'])
assert.ok(variables.collections.every((collection) => collection.variables.length > 0), 'Every Figma collection must contain variables')
assert.equal(mapping.components.length, components.components.length, 'Every component needs a Code Connect mapping record')
assert.deepEqual(mapping.components.map((component) => component.name), components.components.map((component) => component.name))

for (const component of mapping.components) {
  assert.equal(component.implementations.react.export, component.name)
  assert.equal(component.implementations.vue.export, component.name)
  if (component.figmaNodeUrl !== null) assert.match(component.figmaNodeUrl, /^https:\/\/www\.figma\.com\/design\/[^?]+\?node-id=\d+-\d+/)
  if (component.status === 'connected') assert.ok(component.figmaNodeUrl, `${component.name} is connected without a Figma node URL`)
}

console.log(`Figma assets verified: 4 collections and ${mapping.components.length} component mapping records; live node links remain explicitly gated.`)
