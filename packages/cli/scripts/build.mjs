import { chmod, cp, mkdir, rm } from 'node:fs/promises'
import { basename, dirname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
await rm(resolve(root, 'dist'), { recursive: true, force: true })
await mkdir(resolve(root, 'dist'), { recursive: true })
await cp(resolve(root, 'src'), resolve(root, 'dist'), { recursive: true })
await cp(resolve(root, 'templates'), resolve(root, 'dist/templates'), {
  recursive: true,
  filter: (source) => {
    const segments = source.split(sep)
    return basename(source) !== '.DS_Store' && !segments.includes('target')
  }
})
await chmod(resolve(root, 'dist/cli.mjs'), 0o755)
