import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const workspaceRoot = resolve(root, '../..')
const source = JSON.parse(await readFile(resolve(root, 'src/tokens.json'), 'utf8'))
const dist = resolve(root, 'dist')

const toCssName = (key) => `--atlas-${key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replaceAll('.', '-').toLowerCase()}`
const cssBlock = (selector, values) => `${selector} {\n${Object.entries(values).map(([key, value]) => `  ${toCssName(key)}: ${value};`).join('\n')}\n}`

const css = [
  '/* Generated from src/tokens.json. Do not edit directly. */',
  cssBlock(':root, [data-atlas-theme="light"], [data-theme="light"]', { ...source.global, ...source.themes.light }),
  cssBlock('[data-atlas-theme="dark"], [data-theme="dark"]', { ...source.global, ...source.themes.dark })
].join('\n\n') + '\n'

const legacyAliases = {
  '--atlas-violet': '--atlas-color-brand-primary',
  '--deep-neural': '--atlas-color-brand-strong',
  '--cognitive-glow': '--atlas-color-brand-soft',
  '--atlas-purple': '--atlas-color-brand-primary',
  '--atlas-blue': '--atlas-color-status-info',
  '--atlas-cyan': '--atlas-color-accent-cyan',
  '--atlas-green': '--atlas-color-accent-green',
  '--atlas-orange': '--atlas-color-accent-amber',
  '--atlas-pink': '--atlas-color-accent-rose',
  '--chart-primary': '--atlas-color-chart-primary',
  '--chart-secondary': '--atlas-color-chart-secondary',
  '--chart-teal': '--atlas-color-chart-teal',
  '--chart-mint': '--atlas-color-chart-mint',
  '--chart-amber': '--atlas-color-chart-amber',
  '--chart-rose': '--atlas-color-chart-rose',
  '--chart-ink': '--atlas-color-chart-ink',
  '--chart-grid': '--atlas-color-chart-grid',
  '--chart-surface': '--atlas-color-chart-surface',
  '--success': '--atlas-color-status-success',
  '--warning': '--atlas-color-status-warning',
  '--danger': '--atlas-color-status-error',
  '--info': '--atlas-color-status-info',
  '--font-en': '--atlas-font-family-sans',
  '--font-cn': '--atlas-font-family-sans',
  '--font-mono': '--atlas-font-family-mono',
  '--space-xs': '--atlas-space-1',
  '--space-sm': '--atlas-space-2',
  '--space-md': '--atlas-space-4',
  '--space-lg': '--atlas-space-6',
  '--space-xl': '--atlas-space-8',
  '--space-2xl': '--atlas-space-12',
  '--radius-sm': '--atlas-radius-control',
  '--radius-md': '--atlas-radius-panel',
  '--radius-lg': '--atlas-radius-overlay',
  '--radius-xl': '--atlas-radius-overlay',
  '--radius-full': '--atlas-radius-round',
  '--transition-fast': '--atlas-motion-fast',
  '--transition-base': '--atlas-motion-base',
  '--transition-smooth': '--atlas-motion-base',
  '--transition-slow': '--atlas-motion-living',
  '--z-dropdown': '--atlas-z-dropdown',
  '--z-sticky': '--atlas-z-overlay',
  '--z-tooltip': '--atlas-z-toast'
}

const compatibilityCss = [
  '/* Generated compatibility aliases. New code must use --atlas-* semantic tokens. */',
  ':root {',
  ...Object.entries(legacyAliases).map(([alias, target]) => `  ${alias}: var(${target});`),
  '}'
].join('\n') + '\n'

const moduleSource = `// Generated from src/tokens.json.\nexport const atlasTokens = ${JSON.stringify(source, null, 2)};\nexport const lightTheme = { ...atlasTokens.global, ...atlasTokens.themes.light };\nexport const darkTheme = { ...atlasTokens.global, ...atlasTokens.themes.dark };\nexport const cssVariable = (token) => \`var(--atlas-\${token.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replaceAll('.', '-').toLowerCase()})\`;\n`

await mkdir(dist, { recursive: true })
await writeFile(resolve(dist, 'tokens.css'), css)
await writeFile(resolve(dist, 'compatibility.css'), compatibilityCss)
await writeFile(resolve(workspaceRoot, 'css/atlas-tokens.generated.css'), css)
await writeFile(resolve(workspaceRoot, 'css/atlas-token-compatibility.generated.css'), compatibilityCss)
await writeFile(resolve(dist, 'tokens.json'), `${JSON.stringify(source, null, 2)}\n`)
await writeFile(resolve(dist, 'index.js'), moduleSource)
await writeFile(resolve(dist, 'index.d.ts'), `export interface AtlasTokenSource { meta: { name: string; version: string }; global: Record<string, string>; themes: { light: Record<string, string>; dark: Record<string, string> } }\nexport declare const atlasTokens: AtlasTokenSource;\nexport declare const lightTheme: Record<string, string>;\nexport declare const darkTheme: Record<string, string>;\nexport declare const cssVariable: (token: string) => string;\n`)
