#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { planAtlasPage, queryAtlasComponents, queryAtlasPatterns, validateAtlasPagePipeline } from '@atlas-eids/agent-kit'
import { createProject, generatePage, listApplicationLayouts, listPagePatterns, upgradeProject } from './generator.mjs'
import { validateRenderedPage } from './runtime-validator.mjs'

const args = process.argv.slice(2)
const valueAfter = (name, fallback) => {
  const index = args.indexOf(name)
  return index >= 0 ? args[index + 1] : fallback
}

function validateOptions(valueOptions = [], flags = []) {
  const values = new Set(valueOptions)
  const booleans = new Set(flags)
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    if (!argument.startsWith('--')) continue
    if (!values.has(argument) && !booleans.has(argument)) throw new Error(`Unknown option: ${argument}`)
    if (values.has(argument)) {
      const value = args[index + 1]
      if (!value || value.startsWith('--')) throw new Error(`Option requires a value: ${argument}`)
      index += 1
    }
  }
}

async function main() {
  const [command, subject, name] = args
  if (command === 'create' && subject) {
    validateOptions(['--framework', '--backend', '--template', '--framework-layout', '--density', '--locale', '--adapter'], ['--local'])
    const result = await createProject({
      name: subject,
      framework: valueAfter('--framework', 'react'),
      backend: valueAfter('--backend', 'none'),
      template: valueAfter('--template', 'workbench'),
      frameworkLayout: valueAfter('--framework-layout', 'sidebar'),
      density: valueAfter('--density', 'standard'),
      locale: valueAfter('--locale', 'zh-CN'),
      adapter: valueAfter('--adapter', 'native'),
      packageSource: args.includes('--local') ? 'workspace' : 'registry'
    })
    console.log(`Created ${result.framework} ${result.frameworkLayout} / ${result.template} project at ${result.target}${result.backend === 'java' ? ' with Spring Boot backend' : ''}`)
    return
  }
  if (command === 'generate' && subject === 'page' && name) {
    validateOptions(['--framework', '--out'])
    const target = await generatePage({ pattern: name, framework: valueAfter('--framework', 'react'), output: valueAfter('--out') })
    console.log(`Generated runnable page source at ${target}`)
    return
  }
  if (command === 'list' && subject === 'pages') {
    listPagePatterns().forEach((pattern) => console.log(`${pattern.id}\t${pattern.regions.join(' + ')}`))
    return
  }
  if (command === 'list' && subject === 'layouts') {
    listApplicationLayouts().forEach((layout) => console.log(`${layout.id}\t${layout.title}\t${layout.regions.join(' + ')}`))
    return
  }
  if (command === 'upgrade') {
    validateOptions(['--framework-layout', '--density', '--locale', '--adapter'], ['--dry-run', '--force'])
    const result = await upgradeProject({
      target: subject && !subject.startsWith('--') ? subject : '.',
      dryRun: args.includes('--dry-run'),
      force: args.includes('--force'),
      frameworkLayout: valueAfter('--framework-layout'),
      density: valueAfter('--density'),
      locale: valueAfter('--locale'),
      adapter: valueAfter('--adapter')
    })
    result.changes.forEach((change) => console.log(`${change.status}\t${change.file}`))
    if (result.conflicts.length) console.log(`Conflicts: ${result.conflicts.length}. Re-run with --force only after reviewing the diff.`)
    return
  }
  if (command === 'knowledge' && subject === 'components') {
    validateOptions(['--category'])
    queryAtlasComponents(name ?? '', valueAfter('--category')).forEach((component) => console.log(`${component.name}\t${component.category}\t${component.summary}`))
    return
  }
  if (command === 'knowledge' && subject === 'contract' && name) {
    validateOptions([])
    const component = queryAtlasComponents(name).find((candidate) => candidate.name.toLowerCase() === name.toLowerCase())
    if (!component) throw new Error(`Unknown Atlas component: ${name}`)
    console.log(JSON.stringify(component, null, 2))
    return
  }
  if (command === 'knowledge' && subject === 'patterns') {
    validateOptions([])
    queryAtlasPatterns(name ?? '').forEach((pattern) => console.log(`${pattern.id}\t${pattern.title}\t${pattern.regions.join(' + ')}`))
    return
  }
  if (command === 'agent' && subject === 'plan' && name) {
    validateOptions(['--framework', '--pattern', '--density', '--locale'], ['--json'])
    const plan = planAtlasPage({ intent: name, framework: valueAfter('--framework', 'react'), pattern: valueAfter('--pattern'), density: valueAfter('--density', 'standard'), locale: valueAfter('--locale', 'zh-CN') })
    if (args.includes('--json')) console.log(JSON.stringify(plan, null, 2))
    else {
      console.log(`${plan.pattern.id}\t${plan.pattern.title}\t${plan.framework}`)
      plan.instructions.forEach((instruction) => console.log(`- ${instruction}`))
      console.log(`Components: ${plan.components.map((component) => component.name).join(', ')}`)
    }
    return
  }
  if (command === 'validate' && subject) {
    validateOptions(['--framework', '--url', '--baseline', '--report'], ['--ai', '--json'])
    const target = resolve(subject)
    const source = await readFile(target, 'utf8')
    const runtime = valueAfter('--url') ? await validateRenderedPage(valueAfter('--url'), { sourcePath: target, baseline: valueAfter('--baseline'), reportDirectory: valueAfter('--report') }) : undefined
    const result = validateAtlasPagePipeline({ source, fileName: target, framework: valueAfter('--framework'), aiPage: args.includes('--ai'), dom: runtime?.dom, visual: runtime?.visual })
    if (args.includes('--json')) console.log(JSON.stringify({ path: target, ...result }, null, 2))
    else {
      result.issues.forEach((issue) => console.log(`${issue.severity}\t${issue.code}\t${issue.line ?? '-'}\t${issue.message}`))
      console.log(result.valid ? 'Atlas page validation passed.' : 'Atlas page validation failed.')
    }
    if (!result.valid) process.exitCode = 1
    return
  }
  console.log(`Atlas EIDS CLI\n\nCommands:\n  atlas-eids create <name> [--framework react|vue] [--template pattern] [--framework-layout sidebar|top|hybrid|workbench|tabs|fullscreen|tenant] [--density compact|standard|comfortable] [--locale zh-CN|en-US] [--adapter native|antd|tdesign|opentiny] [--backend none|java] [--local]\n  atlas-eids generate page <pattern> [--framework react|vue] [--out file]\n  atlas-eids agent plan <intent> [--framework react|vue] [--pattern id] [--density value] [--locale value] [--json]\n  atlas-eids validate <file> [--framework react|vue] [--ai] [--url http://...] [--baseline image.png] [--report directory] [--json]\n  atlas-eids knowledge components [query] [--category foundation|input|navigation|display|feedback|composition|ai]\n  atlas-eids knowledge contract <AtlasComponentName>\n  atlas-eids knowledge patterns [query]\n  atlas-eids upgrade [path] [--dry-run] [--force] [configuration options]\n  atlas-eids list pages\n  atlas-eids list layouts`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
