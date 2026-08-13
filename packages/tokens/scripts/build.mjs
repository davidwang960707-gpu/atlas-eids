import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const workspaceRoot = resolve(root, '../..')
const document = JSON.parse(await readFile(resolve(root, 'src/tokens.json'), 'utf8'))
const dist = resolve(root, 'dist')

const isToken = (value) => value && typeof value === 'object' && '$value' in value
const joinPath = (path) => path.join('.')
const tokensByPath = new Map()

const walk = (node, path = [], inheritedType) => {
  if (!node || typeof node !== 'object') return
  const type = node.$type ?? inheritedType
  if (isToken(node)) {
    tokensByPath.set(joinPath(path), { ...node, $type: node.$type ?? type })
    return
  }
  for (const [name, value] of Object.entries(node)) {
    if (name.startsWith('$')) continue
    walk(value, [...path, name], type)
  }
}
walk(document)

const aliasPattern = /^\{([^}]+)\}$/
const resolveToken = (path, stack = []) => {
  if (stack.includes(path)) throw new Error(`Circular token alias: ${[...stack, path].join(' -> ')}`)
  const token = tokensByPath.get(path)
  if (!token) throw new Error(`Unknown token alias: ${path}`)
  const alias = typeof token.$value === 'string' && token.$value.match(aliasPattern)
  if (!alias) return token
  const target = resolveToken(alias[1], [...stack, path])
  return { ...target, ...token, $value: target.$value, $type: token.$type ?? target.$type, $extensions: token.$extensions ?? target.$extensions }
}

const dimension = (value) => `${value.value}${value.unit}`
const color = (value) => value.hex ?? `color(${value.colorSpace} ${value.components.join(' ')}${value.alpha === undefined || value.alpha === 1 ? '' : ` / ${value.alpha}`})`
const shadow = (value) => `${dimension(value.offsetX)} ${dimension(value.offsetY)} ${dimension(value.blur)} ${dimension(value.spread)} ${color(value.color)}`
const cssValue = (token) => {
  if (token.$extensions?.['com.atlas.css']) return token.$extensions['com.atlas.css']
  const value = token.$value
  switch (token.$type) {
    case 'color': return color(value)
    case 'dimension': return dimension(value)
    case 'fontFamily': return value.join(', ')
    case 'transition': return `${dimension(value.duration)} cubic-bezier(${value.timingFunction.join(', ')})`
    case 'shadow': return Array.isArray(value) ? value.map(shadow).join(', ') : shadow(value)
    default: return String(value)
  }
}

const flattened = Object.fromEntries([...tokensByPath.keys()].map((path) => [path, cssValue(resolveToken(path))]))
const stripLayer = (path) => {
  const parts = path.split('.')
  if (parts[0] === 'global') return parts.slice(1).join('.')
  if (parts[0] === 'semantic') return parts.slice(2).join('.')
  if (['component', 'state'].includes(parts[0])) return [parts[0], ...parts.slice(2)].join('.')
  return path
}
const entriesFor = (layer, mode) => Object.fromEntries(Object.entries(flattened)
  .filter(([path]) => path.startsWith(`global.`) || path.startsWith(`${layer}.${mode}.`) || path.startsWith('component.shared.') || path.startsWith('state.shared.'))
  .map(([path, value]) => [stripLayer(path), value]))

const light = { ...entriesFor('semantic', 'light'), ...entriesFor('component', 'light'), ...entriesFor('state', 'light') }
const dark = { ...entriesFor('semantic', 'dark'), ...entriesFor('component', 'dark'), ...entriesFor('state', 'dark') }
const toCssName = (key) => `--atlas-${key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replaceAll('.', '-').toLowerCase()}`
const cssBlock = (selector, values) => `${selector} {\n${Object.entries(values).map(([key, value]) => `  ${toCssName(key)}: ${value};`).join('\n')}\n}`
const css = [
  '/* Generated from DTCG 2025.10 src/tokens.json. Do not edit directly. */',
  cssBlock(':root, [data-atlas-theme="light"], [data-theme="light"]', light),
  cssBlock('[data-atlas-theme="dark"], [data-theme="dark"]', dark),
  '@media (prefers-reduced-motion: reduce) {\n  :root { --atlas-motion-fast: 1ms linear; --atlas-motion-base: 1ms linear; --atlas-motion-living: 1ms linear; }\n}'
].join('\n\n') + '\n'

const legacyAliases = {
  '--atlas-violet': '--atlas-color-brand-primary', '--deep-neural': '--atlas-color-brand-strong', '--cognitive-glow': '--atlas-color-brand-soft',
  '--atlas-purple': '--atlas-color-brand-primary', '--atlas-blue': '--atlas-color-status-info', '--atlas-cyan': '--atlas-color-accent-cyan',
  '--atlas-green': '--atlas-color-accent-green', '--atlas-orange': '--atlas-color-accent-amber', '--atlas-pink': '--atlas-color-accent-rose',
  '--chart-primary': '--atlas-color-chart-primary', '--chart-secondary': '--atlas-color-chart-secondary', '--chart-teal': '--atlas-color-chart-teal',
  '--chart-mint': '--atlas-color-chart-mint', '--chart-amber': '--atlas-color-chart-amber', '--chart-rose': '--atlas-color-chart-rose',
  '--chart-ink': '--atlas-color-chart-ink', '--chart-grid': '--atlas-color-chart-grid', '--chart-surface': '--atlas-color-chart-surface',
  '--success': '--atlas-color-status-success', '--warning': '--atlas-color-status-warning', '--danger': '--atlas-color-status-error', '--info': '--atlas-color-status-info',
  '--font-en': '--atlas-font-family-sans', '--font-cn': '--atlas-font-family-sans', '--font-mono': '--atlas-font-family-mono',
  '--space-xs': '--atlas-space-1', '--space-sm': '--atlas-space-2', '--space-md': '--atlas-space-4', '--space-lg': '--atlas-space-6', '--space-xl': '--atlas-space-8', '--space-2xl': '--atlas-space-12',
  '--radius-sm': '--atlas-radius-control', '--radius-md': '--atlas-radius-panel', '--radius-lg': '--atlas-radius-overlay', '--radius-xl': '--atlas-radius-overlay', '--radius-full': '--atlas-radius-round',
  '--transition-fast': '--atlas-motion-fast', '--transition-base': '--atlas-motion-base', '--transition-smooth': '--atlas-motion-base', '--transition-slow': '--atlas-motion-living',
  '--z-dropdown': '--atlas-z-dropdown', '--z-sticky': '--atlas-z-overlay', '--z-tooltip': '--atlas-z-toast'
}
const compatibilityCss = ['/* Generated compatibility aliases. New code must use --atlas-* semantic tokens. */', ':root {', ...Object.entries(legacyAliases).map(([alias, target]) => `  ${alias}: var(${target});`), '}'].join('\n') + '\n'

const compatibility = {
  global: Object.fromEntries(Object.entries(flattened).filter(([path]) => path.startsWith('global.')).map(([path, value]) => [path.slice(7), value])),
  themes: {
    light: Object.fromEntries(Object.entries(flattened).filter(([path]) => path.startsWith('semantic.light.')).map(([path, value]) => [path.slice(15), value])),
    dark: Object.fromEntries(Object.entries(flattened).filter(([path]) => path.startsWith('semantic.dark.')).map(([path, value]) => [path.slice(14), value]))
  }
}
const moduleSource = `// Generated from DTCG 2025.10 src/tokens.json.\nexport const atlasTokenDocument = ${JSON.stringify(document, null, 2)};\nexport const atlasTokens = ${JSON.stringify(compatibility, null, 2)};\nexport const lightTheme = ${JSON.stringify(light, null, 2)};\nexport const darkTheme = ${JSON.stringify(dark, null, 2)};\nexport const cssVariable = (token) => \`var(--atlas-\${token.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replaceAll('.', '-').toLowerCase()})\`;\n`

const figmaCollectionFor = (path) => {
  const parts = path.split('.')
  const layer = parts[0]
  if (layer === 'global') return { collection: 'Global', mode: 'Value', name: parts.slice(1).join('/') }
  if (layer === 'semantic') return { collection: 'Semantic', mode: parts[1] === 'dark' ? 'Dark' : 'Light', name: parts.slice(2).join('/') }
  if (layer === 'component') return { collection: 'Component', mode: parts[1] === 'dark' ? 'Dark' : parts[1] === 'light' ? 'Light' : 'Shared', name: parts.slice(2).join('/') }
  if (layer === 'state') return { collection: 'State', mode: parts[1] === 'dark' ? 'Dark' : parts[1] === 'light' ? 'Light' : 'Shared', name: parts.slice(2).join('/') }
  throw new Error(`Unsupported Figma token layer: ${path}`)
}

const figmaType = (token) => {
  switch (token.$type) {
    case 'color': return 'COLOR'
    case 'dimension':
    case 'duration':
    case 'number': return 'FLOAT'
    case 'boolean': return 'BOOLEAN'
    default: return 'STRING'
  }
}

const resolvedFigmaValue = (token) => {
  const value = token.$value
  if (token.$type === 'color') return color(value)
  if (token.$type === 'dimension' || token.$type === 'duration') return value.value
  if (token.$type === 'fontFamily') return value.join(', ')
  if (token.$type === 'transition' || token.$type === 'shadow') return cssValue(token)
  return value
}

const figmaReference = (path) => {
  const mapped = figmaCollectionFor(path)
  return `${mapped.collection}/${mapped.name}`
}

const figmaVariables = new Map()
for (const [path, sourceToken] of tokensByPath) {
  const mapped = figmaCollectionFor(path)
  const key = `${mapped.collection}:${mapped.name}`
  const resolved = resolveToken(path)
  const alias = typeof sourceToken.$value === 'string' && sourceToken.$value.match(aliasPattern)
  const value = alias ? { $alias: figmaReference(alias[1]) } : resolvedFigmaValue(resolved)
  const record = figmaVariables.get(key) ?? {
    name: mapped.name,
    type: figmaType(resolved),
    description: sourceToken.$description ?? '',
    codeSyntax: { CSS: toCssName(stripLayer(path)) },
    values: {},
    resolvedValues: {}
  }
  const modes = mapped.mode === 'Shared' ? ['Light', 'Dark'] : [mapped.mode]
  for (const mode of modes) {
    record.values[mode] = value
    record.resolvedValues[mode] = resolvedFigmaValue(resolved)
  }
  figmaVariables.set(key, record)
}

const figmaManifest = {
  $schema: 'https://atlas-eids.dev/schemas/figma-variables-handoff-1.0.json',
  name: 'Atlas EIDS Variables',
  source: 'packages/tokens/src/tokens.json',
  sourceFormat: 'DTCG 2025.10',
  note: 'Use values for alias-preserving import and resolvedValues for REST or Plugin API synchronization.',
  collections: ['Global', 'Semantic', 'Component', 'State'].map((name) => ({
    name,
    modes: name === 'Global' ? ['Value'] : ['Light', 'Dark'],
    variables: [...figmaVariables.entries()]
      .filter(([key]) => key.startsWith(`${name}:`))
      .map(([, variable]) => variable)
      .sort((left, right) => left.name.localeCompare(right.name))
  }))
}

await mkdir(dist, { recursive: true })
await mkdir(resolve(workspaceRoot, 'figma'), { recursive: true })
await writeFile(resolve(dist, 'tokens.css'), css)
await writeFile(resolve(dist, 'compatibility.css'), compatibilityCss)
await writeFile(resolve(workspaceRoot, 'css/atlas-tokens.generated.css'), css)
await writeFile(resolve(workspaceRoot, 'css/atlas-token-compatibility.generated.css'), compatibilityCss)
await writeFile(resolve(dist, 'tokens.json'), `${JSON.stringify(document, null, 2)}\n`)
await writeFile(resolve(dist, 'figma-variables.json'), `${JSON.stringify(figmaManifest, null, 2)}\n`)
await writeFile(resolve(workspaceRoot, 'figma/atlas-eids.variables.json'), `${JSON.stringify(figmaManifest, null, 2)}\n`)
await writeFile(resolve(dist, 'index.js'), moduleSource)
await writeFile(resolve(dist, 'index.d.ts'), `export interface DTCGToken { $type?: string; $value: unknown; $description?: string; $extensions?: Record<string, unknown> }\nexport interface AtlasTokenDocument { $schema: string; $extensions: Record<string, unknown>; global: Record<string, unknown>; semantic: Record<'light' | 'dark', Record<string, unknown>>; component: Record<string, unknown>; state: Record<string, unknown> }\nexport declare const atlasTokenDocument: AtlasTokenDocument;\nexport declare const atlasTokens: { global: Record<string, string>; themes: { light: Record<string, string>; dark: Record<string, string> } };\nexport declare const lightTheme: Record<string, string>;\nexport declare const darkTheme: Record<string, string>;\nexport declare const cssVariable: (token: string) => string;\n`)
