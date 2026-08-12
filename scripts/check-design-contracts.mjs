import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import ts from 'typescript'

const root = resolve(import.meta.dirname, '..')
const tokenPath = resolve(root, 'packages/tokens/src/tokens.json')
const tokens = JSON.parse(await readFile(tokenPath, 'utf8'))
const requiredTokens = [
  'radius.control', 'radius.panel', 'control.height.compact', 'control.height.default', 'control.height.comfortable',
  'table.rowHeight.compact', 'table.rowHeight.default', 'table.rowHeight.comfortable', 'font.family.sans', 'font.size.body'
]
const requiredThemeTokens = [
  'color.bg.canvas', 'color.bg.surface', 'color.bg.subtle', 'color.text.primary', 'color.text.secondary',
  'color.border.default', 'color.action.primary', 'color.action.soft', 'color.focus.ring',
  'color.status.success', 'color.status.successSoft', 'color.status.warning', 'color.status.warningSoft',
  'color.status.error', 'color.status.errorSoft', 'shadow.surface', 'shadow.overlay', 'shadow.orb'
]

for (const name of requiredTokens) if (!(name in tokens.global)) throw new Error(`Missing global semantic token: ${name}`)
for (const theme of ['light', 'dark']) for (const name of requiredThemeTokens) if (!(name in tokens.themes[theme])) throw new Error(`Missing ${theme} semantic token: ${name}`)
if (tokens.global['radius.panel'] !== '8px') throw new Error('Enterprise panel radius must remain 8px')
if (tokens.global['table.rowHeight.default'] !== '42px') throw new Error('Standard table row height must remain 42px')
if (tokens.meta.version !== JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8')).version) throw new Error('Token metadata version must match workspace version')

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

const sharedShowcaseTokens = await readFile(resolve(root, 'examples/shared/tokens.css'), 'utf8')
if (!sharedShowcaseTokens.includes("@import '@atlas-eids/tokens/tokens.css'")) throw new Error('Framework showcases must consume the canonical token package')
if (!sharedShowcaseTokens.includes("@import '@atlas-eids/tokens/compatibility.css'")) throw new Error('Framework showcases must consume the generated compatibility layer')
if (/#[\da-f]{3,8}\b/i.test(sharedShowcaseTokens)) throw new Error('Shared showcase token aliases cannot contain raw colors')
for (const framework of ['react', 'vue3']) {
  const entry = await readFile(resolve(root, `examples/${framework}/src/main.${framework === 'react' ? 'tsx' : 'ts'}`), 'utf8')
  if (!entry.includes("../../shared/tokens.css")) throw new Error(`${framework} showcase must import the shared token entry`)
}

const core = await import(resolve(root, 'packages/core/dist/index.js'))
const contractNames = core.atlasComponentContracts.map((contract) => contract.name).sort()
const expectedContracts = [...reactComponents].sort()
if (JSON.stringify(contractNames) !== JSON.stringify(expectedContracts)) throw new Error('Core visual contracts must cover every React/Vue component export')
const manifest = JSON.parse(await readFile(resolve(root, 'manifests/component-manifest.json'), 'utf8'))
if (manifest.version !== tokens.meta.version || manifest.components.length !== contractNames.length) throw new Error('Machine-readable component manifest is stale')
if (manifest.componentCount !== 50 || manifest.providerCount !== 1) throw new Error('Component manifest counts are invalid')

console.log(`Design contract verified: ${requiredTokens.length + requiredThemeTokens.length * 2} token requirements and ${reactComponents.length} cross-framework components with machine manifests.`)
