#!/usr/bin/env node
import { createProject, generatePage, listApplicationLayouts, listPagePatterns, upgradeProject } from './generator.mjs'

const args = process.argv.slice(2)
const valueAfter = (name, fallback) => {
  const index = args.indexOf(name)
  return index >= 0 ? args[index + 1] : fallback
}

async function main() {
  const [command, subject, name] = args
  if (command === 'create' && subject) {
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
  console.log(`Atlas EIDS CLI\n\nCommands:\n  atlas-eids create <name> [--framework react|vue] [--template pattern] [--framework-layout sidebar|top|hybrid|workbench|tabs|fullscreen|tenant] [--density compact|standard|comfortable] [--locale zh-CN|en-US] [--adapter native|antd|tdesign|opentiny] [--backend none|java] [--local]\n  atlas-eids generate page <pattern> [--framework react|vue] [--out file]\n  atlas-eids upgrade [path] [--dry-run] [--force] [configuration options]\n  atlas-eids list pages\n  atlas-eids list layouts`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
