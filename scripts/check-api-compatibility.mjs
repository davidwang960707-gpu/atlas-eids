import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { execFileSync } from 'node:child_process'

const root = resolve(import.meta.dirname, '..')
const current = JSON.parse(await readFile(resolve(root, 'docs/component-api.generated.json'), 'utf8'))
const packageVersion = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8')).version
const baselinePath = resolve(root, 'manifests/api-baseline.json')
const reportPath = resolve(root, 'reports/api-compatibility.json')
const createSnapshot = (version, components) => ({
  version,
  components: components.map((component) => ({ name: component.name, props: component.props.map(({ name, type, optional }) => ({ name, type, optional })) }))
})
const snapshot = createSnapshot(packageVersion, current)

if (process.argv.includes('--update')) {
  const refIndex = process.argv.indexOf('--ref')
  let ref = refIndex >= 0 ? process.argv[refIndex + 1] : undefined
  if (ref === 'latest') ref = execFileSync('git', ['describe', '--tags', '--abbrev=0'], { cwd: root, encoding: 'utf8' }).trim()
  const baselineSnapshot = ref
    ? createSnapshot(
      JSON.parse(execFileSync('git', ['show', `${ref}:package.json`], { cwd: root, encoding: 'utf8' })).version,
      JSON.parse(execFileSync('git', ['show', `${ref}:docs/component-api.generated.json`], { cwd: root, encoding: 'utf8' }))
    )
    : snapshot
  await writeFile(baselinePath, `${JSON.stringify(baselineSnapshot, null, 2)}\n`)
  console.log(`API baseline updated: ${baselineSnapshot.components.length} components at ${baselineSnapshot.version}${ref ? ` from ${ref}` : ''}`)
  process.exit(0)
}

const baseline = JSON.parse(await readFile(baselinePath, 'utf8'))
const currentByName = new Map(snapshot.components.map((component) => [component.name, component]))
const breaking = []
const changed = []
for (const component of baseline.components) {
  const next = currentByName.get(component.name)
  if (!next) { breaking.push({ component: component.name, reason: 'component-removed' }); continue }
  const nextProps = new Map(next.props.map((prop) => [prop.name, prop]))
  for (const prop of component.props) {
    const nextProp = nextProps.get(prop.name)
    if (!nextProp) breaking.push({ component: component.name, prop: prop.name, reason: 'prop-removed' })
    else {
      if (prop.optional && !nextProp.optional) breaking.push({ component: component.name, prop: prop.name, reason: 'optional-prop-became-required' })
      if (prop.type !== nextProp.type) changed.push({ component: component.name, prop: prop.name, before: prop.type, after: nextProp.type })
    }
  }
}
const additions = snapshot.components.filter((component) => !baseline.components.some((item) => item.name === component.name)).map((component) => component.name)
const report = { baselineVersion: baseline.version, currentVersion: packageVersion, compatible: breaking.length === 0, breaking, changed, additions }
await mkdir(resolve(root, 'reports'), { recursive: true })
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`)
if (breaking.length) throw new Error(`Public API compatibility failed with ${breaking.length} breaking change(s). See reports/api-compatibility.json.`)
console.log(`API compatible with ${baseline.version}: ${additions.length} component addition(s), ${changed.length} type change(s), no removals or required-prop tightening.`)
