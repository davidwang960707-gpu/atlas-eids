import { gzipSync } from 'node:zlib'
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const budgets = JSON.parse(await readFile(resolve(root, 'budgets/bundle-budgets.json'), 'utf8'))
const extensions = /\.(?:js|mjs|css)$/
async function collect(directory) {
  const chunks = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) chunks.push(...await collect(path))
    else if (extensions.test(entry.name)) chunks.push(await readFile(path))
  }
  return chunks
}

const packages = []
for (const budget of budgets.packages) {
  const chunks = await collect(resolve(root, budget.path))
  const bundle = Buffer.concat(chunks)
  const result = { ...budget, rawBytes: bundle.byteLength, gzipBytes: gzipSync(bundle).byteLength }
  result.withinBudget = result.rawBytes <= budget.maxRawBytes && result.gzipBytes <= budget.maxGzipBytes
  packages.push(result)
}
await mkdir(resolve(root, 'reports'), { recursive: true })
await writeFile(resolve(root, 'reports/bundle-size.json'), `${JSON.stringify({ version: budgets.version, packages }, null, 2)}\n`)
const failures = packages.filter((item) => !item.withinBudget)
if (failures.length) throw new Error(`Bundle budget exceeded: ${failures.map((item) => item.name).join(', ')}`)
console.log(`Bundle budgets verified for ${packages.length} public packages. Largest gzip: ${Math.max(...packages.map((item) => item.gzipBytes))} bytes.`)
