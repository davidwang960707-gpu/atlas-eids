import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import ts from 'typescript'

const root = resolve(import.meta.dirname, '..')
const tokenPath = resolve(root, 'packages/tokens/src/tokens.json')
const tokenDocument = JSON.parse(await readFile(tokenPath, 'utf8'))
const tokenRuntime = await import(resolve(root, 'packages/tokens/dist/index.js'))
const tokens = tokenRuntime.atlasTokens
const requiredTokens = [
  'radius.control', 'radius.panel', 'control.height.compact', 'control.height.default', 'control.height.comfortable',
  'table.rowHeight.compact', 'table.rowHeight.default', 'table.rowHeight.comfortable', 'font.family.sans',
  'font.size.micro', 'font.size.caption', 'font.size.body', 'font.size.headingSm', 'font.size.headingMd',
  'font.size.headingLg', 'font.size.metric', 'line.height.tight', 'line.height.heading', 'line.height.body',
  'space.1', 'space.2', 'space.3', 'space.4', 'space.5', 'space.6', 'space.8', 'space.12'
]
const requiredThemeTokens = [
  'color.bg.canvas', 'color.bg.surface', 'color.bg.subtle', 'color.text.primary', 'color.text.secondary',
  'color.border.default', 'color.action.primary', 'color.action.soft', 'color.focus.ring',
  'color.status.success', 'color.status.successSoft', 'color.status.warning', 'color.status.warningSoft',
  'color.status.error', 'color.status.errorSoft', 'shadow.surface', 'shadow.overlay', 'shadow.orb'
]

if (tokenDocument.$schema !== 'https://www.designtokens.org/schemas/2025.10/format.json') throw new Error('Token source must target DTCG 2025.10')
for (const layer of ['global', 'semantic', 'component', 'state']) if (!tokenDocument[layer]) throw new Error(`Missing DTCG layer: ${layer}`)
const inspectDtcg = (node, inheritedType, path = []) => {
  const type = node?.$type ?? inheritedType
  if (node && typeof node === 'object' && '$value' in node) {
    if (!type) throw new Error(`DTCG token is missing $type: ${path.join('.')}`)
    return
  }
  for (const [name, value] of Object.entries(node ?? {})) {
    if (name.startsWith('$')) continue
    if (name.includes('.')) throw new Error(`DTCG group names cannot contain periods: ${[...path, name].join('.')}`)
    inspectDtcg(value, type, [...path, name])
  }
}
inspectDtcg(tokenDocument)
for (const name of requiredTokens) if (!(name in tokens.global)) throw new Error(`Missing global semantic token: ${name}`)
for (const theme of ['light', 'dark']) for (const name of requiredThemeTokens) if (!(name in tokens.themes[theme])) throw new Error(`Missing ${theme} semantic token: ${name}`)
if (tokens.global['radius.panel'] !== '8px') throw new Error('Enterprise panel radius must remain 8px')
if (tokens.global['table.rowHeight.default'] !== '42px') throw new Error('Standard table row height must remain 42px')
if (tokenDocument.$extensions['com.atlas.meta'].version !== JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8')).version) throw new Error('Token metadata version must match workspace version')

const reactPath = resolve(root, 'packages/react/src/index.tsx')
const vuePath = resolve(root, 'packages/vue/src/index.ts')
const program = ts.createProgram([reactPath, vuePath], { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, jsx: ts.JsxEmit.ReactJSX, skipLibCheck: true })
const checker = program.getTypeChecker()
const moduleExports = (path) => {
  const source = program.getSourceFile(path)
  const symbol = source && checker.getSymbolAtLocation(source)
  return new Map((symbol ? checker.getExportsOfModule(symbol) : []).map((entry) => [entry.name, entry]))
}
const reactExports = moduleExports(reactPath)
const vueExports = moduleExports(vuePath)
const ignored = new Set(['AtlasEIDS'])
const reactComponents = [...reactExports]
  .filter(([name, symbol]) => name.startsWith('Atlas') && !ignored.has(name) && (symbol.flags & ts.SymbolFlags.Value) !== 0)
  .map(([name]) => name)
for (const name of reactComponents) if (!vueExports.has(name)) throw new Error(`Vue component parity missing: ${name}`)

const reactSource = await readFile(reactPath, 'utf8')
const vueSource = await readFile(vuePath, 'utf8')
for (const marker of ['hideLabel', 'sortDirection', 'loading', 'AtlasTableLabels']) {
  if (!reactSource.includes(marker)) throw new Error(`React contract marker missing: ${marker}`)
  if (!vueSource.includes(marker)) throw new Error(`Vue contract marker missing: ${marker}`)
}
if (!/label=\{labels\.selectAll\} hideLabel/.test(reactSource)) throw new Error('React table selection label must be visually hidden')
if (!/label: labels\.selectAll, hideLabel: true/.test(vueSource)) throw new Error('Vue table selection label must be visually hidden')

const packageCss = await readFile(resolve(root, 'packages/react/src/styles.css'), 'utf8')
if (!packageCss.includes('.atlas-root, .atlas-root *')) throw new Error('Component CSS must define a stable border-box boundary')
if (!packageCss.includes('var(--atlas-table-row-height-default)')) throw new Error('Table geometry must use semantic row-height tokens')
const toCssName = (key) => `--atlas-${key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replaceAll('.', '-').toLowerCase()}`
const canonicalTokenCss = await readFile(resolve(root, 'packages/tokens/dist/tokens.css'), 'utf8')
const canonicalCssVariables = new Set([
  ...Object.keys(tokens.global),
  ...Object.keys(tokens.themes.light),
  ...Object.keys(tokens.themes.dark)
].map(toCssName).concat([...canonicalTokenCss.matchAll(/(--atlas-[\w-]+)\s*:/g)].map((match) => match[1])))
const locallyDeclaredCssVariables = new Set([...packageCss.matchAll(/(--atlas-[\w-]+)\s*:/g)].map((match) => match[1]))
const referencedCssVariables = new Set([...packageCss.matchAll(/var\((--atlas-[\w-]+)/g)].map((match) => match[1]))
const unknownCssVariables = [...referencedCssVariables].filter((name) => !canonicalCssVariables.has(name) && !locallyDeclaredCssVariables.has(name))
if (unknownCssVariables.length) throw new Error(`Component CSS references unknown Atlas tokens: ${unknownCssVariables.join(', ')}`)

const sharedShowcaseTokens = await readFile(resolve(root, 'examples/shared/tokens.css'), 'utf8')
if (!sharedShowcaseTokens.includes("@import '@atlas-eids/tokens/tokens.css'")) throw new Error('Framework showcases must consume the canonical token package')
if (!sharedShowcaseTokens.includes("@import '@atlas-eids/tokens/compatibility.css'")) throw new Error('Framework showcases must consume the generated compatibility layer')
if (/#[\da-f]{3,8}\b/i.test(sharedShowcaseTokens)) throw new Error('Shared showcase token aliases cannot contain raw colors')
for (const framework of ['react', 'vue3']) {
  const entry = await readFile(resolve(root, `examples/${framework}/src/main.${framework === 'react' ? 'tsx' : 'ts'}`), 'utf8')
  if (!entry.includes("../../shared/tokens.css")) throw new Error(`${framework} showcase must import the shared token entry`)
}

const core = await import(resolve(root, 'packages/core/dist/index.js'))
if (core.atlasVisualRules.typography.headingLg !== 20 || core.atlasVisualRules.typography.minimumReadable !== 12) throw new Error('Typography visual rules are stale')
if (core.atlasVisualRules.pageComposition.maxPrimaryActionsPerRegion !== 1) throw new Error('Page composition primary-action rule is stale')
const contractNames = core.atlasComponentContracts.map((contract) => contract.name).sort()
const expectedContracts = [...reactComponents].sort()
if (JSON.stringify(contractNames) !== JSON.stringify(expectedContracts)) throw new Error('Core visual contracts must cover every React/Vue component export')
const manifest = JSON.parse(await readFile(resolve(root, 'manifests/component-manifest.json'), 'utf8'))
if (manifest.version !== tokenDocument.$extensions['com.atlas.meta'].version || manifest.components.length !== contractNames.length) throw new Error('Machine-readable component manifest is stale')
if (manifest.componentCount !== 66 || manifest.providerCount !== 1) throw new Error('Component manifest counts are invalid')
const recipes = JSON.parse(await readFile(resolve(root, 'manifests/page-recipes.json'), 'utf8'))
if (recipes.patterns.length !== 26) throw new Error('Page recipe manifest must cover 26 production patterns')
for (const pattern of recipes.patterns) {
  for (const field of ['primaryTask', 'primaryAction', 'secondaryRegions', 'requiredStates', 'responsiveContract', 'informationPriority', 'completionCriteria']) {
    if (!pattern[field] || pattern[field].length === 0) throw new Error(`Page recipe ${pattern.id} is missing ${field}`)
  }
}

console.log(`Design contract verified: DTCG four-layer tokens, ${reactComponents.length} cross-framework components and ${recipes.patterns.length} production page recipes.`)
