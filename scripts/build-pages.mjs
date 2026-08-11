import { cp, mkdir, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const output = resolve(root, '.pages')

await rm(output, { recursive: true, force: true })
await mkdir(output, { recursive: true })

const rootFiles = [
  'index.html',
  'launcher.html',
  'patterns.html',
  'docs-site.html',
  'README.md',
  'CONTRIBUTING.md',
  'SECURITY.md',
  'CHANGELOG.md',
  'LICENSE'
]

for (const file of rootFiles) await cp(resolve(root, file), resolve(output, file))

for (const directory of ['css', 'js', 'docs', 'examples/shared']) {
  await cp(resolve(root, directory), resolve(output, directory), { recursive: true })
}

await cp(resolve(root, 'examples/templates/dist'), resolve(output, 'templates'), { recursive: true })
await cp(resolve(root, 'apps/storybook/storybook-static'), resolve(output, 'storybook/react'), { recursive: true })
await cp(resolve(root, 'apps/storybook-vue/storybook-static'), resolve(output, 'storybook/vue'), { recursive: true })
await writeFile(resolve(output, '.nojekyll'), '')

console.log('Assembled GitHub Pages artifact in .pages')
