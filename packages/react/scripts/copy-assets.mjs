import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
await mkdir(resolve(root, 'dist'), { recursive: true })
await copyFile(resolve(root, 'src/styles.css'), resolve(root, 'dist/styles.css'))

const workspaceRoot = resolve(root, '../..')
const siteCss = (await readFile(resolve(root, 'src/styles.css'), 'utf8')).replace(/^@import[^\n]+\n/, '')
await writeFile(resolve(workspaceRoot, 'css/atlas-components.generated.css'), `/* Generated from @atlas-eids/react. Do not edit directly. */\n${siteCss}`)
