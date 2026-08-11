import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = JSON.parse(await readFile(resolve(root, 'src/tokens.json'), 'utf8'))
const dist = resolve(root, 'dist')

const toCssName = (key) => `--atlas-${key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replaceAll('.', '-').toLowerCase()}`
const cssBlock = (selector, values) => `${selector} {\n${Object.entries(values).map(([key, value]) => `  ${toCssName(key)}: ${value};`).join('\n')}\n}`

const css = [
  '/* Generated from src/tokens.json. Do not edit directly. */',
  cssBlock(':root, [data-atlas-theme="light"]', { ...source.global, ...source.themes.light }),
  cssBlock('[data-atlas-theme="dark"]', { ...source.global, ...source.themes.dark })
].join('\n\n') + '\n'

const moduleSource = `// Generated from src/tokens.json.\nexport const atlasTokens = ${JSON.stringify(source, null, 2)};\nexport const lightTheme = { ...atlasTokens.global, ...atlasTokens.themes.light };\nexport const darkTheme = { ...atlasTokens.global, ...atlasTokens.themes.dark };\nexport const cssVariable = (token) => \`var(--atlas-\${token.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replaceAll('.', '-').toLowerCase()})\`;\n`

await mkdir(dist, { recursive: true })
await writeFile(resolve(dist, 'tokens.css'), css)
await writeFile(resolve(dist, 'tokens.json'), `${JSON.stringify(source, null, 2)}\n`)
await writeFile(resolve(dist, 'index.js'), moduleSource)
await writeFile(resolve(dist, 'index.d.ts'), `export interface AtlasTokenSource { meta: { name: string; version: string }; global: Record<string, string>; themes: { light: Record<string, string>; dark: Record<string, string> } }\nexport declare const atlasTokens: AtlasTokenSource;\nexport declare const lightTheme: Record<string, string>;\nexport declare const darkTheme: Record<string, string>;\nexport declare const cssVariable: (token: string) => string;\n`)
