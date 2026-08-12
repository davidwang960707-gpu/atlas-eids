import { cp, mkdir, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const workspaceRoot = resolve(packageRoot, '../..')
const target = resolve(packageRoot, 'dist/skills')
const manifestTarget = resolve(packageRoot, 'dist/manifests')

await rm(target, { recursive: true, force: true })
await rm(manifestTarget, { recursive: true, force: true })
await mkdir(target, { recursive: true })
await mkdir(manifestTarget, { recursive: true })
await cp(resolve(workspaceRoot, 'skills'), target, {
  recursive: true,
  filter: (source) => !source.endsWith('/README.md')
})
await cp(resolve(workspaceRoot, 'manifests'), manifestTarget, { recursive: true })
