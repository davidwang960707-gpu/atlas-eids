import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = resolve(import.meta.dirname, '..')
const output = resolve(root, 'manifests')
const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'))
const tokens = JSON.parse(await readFile(resolve(root, 'packages/tokens/src/tokens.json'), 'utf8'))
const componentApi = JSON.parse(await readFile(resolve(root, 'docs/component-api.generated.json'), 'utf8'))
const agentKit = await import(pathToFileURL(resolve(root, 'packages/agent-kit/dist/index.js')))

await mkdir(output, { recursive: true })

const apiByName = new Map(componentApi.map((component) => [component.name, component]))
const components = agentKit.atlasComponents.map((component) => ({
  ...component,
  api: apiByName.get(component.name)?.props ?? [],
  documentedProps: apiByName.get(component.name)?.documentedProps ?? []
}))

if (components.length !== componentApi.length) {
  throw new Error(`Component manifest drift: contracts=${components.length}, api=${componentApi.length}`)
}

const files = {
  'component-manifest.json': {
    schemaVersion: 1,
    designSystem: 'Atlas EIDS',
    version: packageJson.version,
    componentCount: components.length - 1,
    providerCount: 1,
    frameworks: ['react', 'vue'],
    components
  },
  'page-recipes.json': {
    schemaVersion: 1,
    designSystem: 'Atlas EIDS',
    version: packageJson.version,
    patterns: agentKit.atlasPagePatterns
  },
  'token-contract.json': {
    schemaVersion: 1,
    designSystem: 'Atlas EIDS',
    version: packageJson.version,
    source: 'packages/tokens/src/tokens.json',
    tokens
  },
  'visual-rules.json': {
    schemaVersion: 1,
    designSystem: 'Atlas EIDS',
    version: packageJson.version,
    rules: agentKit.atlasDesignManifest.visualRules,
    principles: agentKit.atlasDesignManifest.principles
  }
}

for (const [name, content] of Object.entries(files)) {
  await writeFile(resolve(output, name), `${JSON.stringify(content, null, 2)}\n`)
}

console.log(`Generated ${Object.keys(files).length} design manifests for ${components.length - 1} UI components and AtlasProvider.`)
