import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const manifest = JSON.parse(await readFile(resolve(root, 'manifests/component-manifest.json'), 'utf8'))
const variables = JSON.parse(await readFile(resolve(root, 'figma/atlas-eids.variables.json'), 'utf8'))

const mapping = {
  schemaVersion: '1.0.0',
  designSystem: 'Atlas EIDS',
  version: manifest.version,
  variableSource: 'figma/atlas-eids.variables.json',
  connectionPolicy: {
    publishedLibraryRequired: true,
    fakeNodeIdsForbidden: true,
    supportedFrameworks: ['react', 'vue'],
    instructions: 'Fill figmaNodeUrl only after the matching component is published in an editable Figma library, then generate framework Code Connect files.'
  },
  components: manifest.components.map((component) => ({
    name: component.name,
    category: component.category,
    figmaComponentName: component.name.replace(/^Atlas/, 'Atlas/'),
    figmaNodeUrl: null,
    status: 'awaiting-published-node',
    properties: component.documentedProps.map((property) => property.name),
    implementations: {
      react: { package: '@atlas-eids/react', export: component.name },
      vue: { package: '@atlas-eids/vue', export: component.name }
    }
  }))
}

const handoff = {
  version: manifest.version,
  collections: Object.fromEntries(variables.collections.map((collection) => [collection.name, {
    modes: collection.modes,
    variableCount: collection.variables.length
  }])),
  componentCount: mapping.components.length,
  linkedNodeCount: mapping.components.filter((component) => component.figmaNodeUrl).length,
  accountGate: 'Live Variables, Team Library publication and Code Connect require an editable Figma library and eligible plan.'
}

await mkdir(resolve(root, 'figma/code-connect'), { recursive: true })
await writeFile(resolve(root, 'figma/code-connect/component-mapping.json'), `${JSON.stringify(mapping, null, 2)}\n`)
await writeFile(resolve(root, 'reports/figma-handoff.json'), `${JSON.stringify(handoff, null, 2)}\n`)
console.log(`Built Figma handoff: ${variables.collections.length} variable collections and ${mapping.components.length} component mappings.`)
