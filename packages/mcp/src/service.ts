import { execFile } from 'node:child_process'
import { access, readFile, readdir } from 'node:fs/promises'
import { constants } from 'node:fs'
import { dirname, isAbsolute, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { atlasComponents, atlasDesignManifest, atlasPagePatterns, atlasSkills, planAtlasPage, queryAtlasComponents, queryAtlasPatterns, validateAtlasPageSource, type AtlasAgentFramework, type AtlasComponentKnowledge } from '@atlas-eids/agent-kit'

const execFileAsync = promisify(execFile)
const bundledSkillsRoot = resolve(dirname(fileURLToPath(import.meta.url)), 'skills')
const bundledManifestsRoot = resolve(dirname(fileURLToPath(import.meta.url)), 'manifests')
const designManifestFiles = ['component-manifest.json', 'page-recipes.json', 'token-contract.json', 'visual-rules.json'] as const
export type AtlasDesignManifestFile = typeof designManifestFiles[number]

export interface AtlasMCPServiceOptions {
  workspaceRoot?: string
  nodePath?: string
  cliPath?: string
}

function inside(root: string, candidate: string) {
  const result = relative(root, candidate)
  return result === '' || (!result.startsWith('..') && !isAbsolute(result))
}

async function exists(path: string) {
  try { await access(path, constants.F_OK); return true } catch { return false }
}

export function createAtlasMCPService(options: AtlasMCPServiceOptions = {}) {
  const workspaceRoot = resolve(options.workspaceRoot ?? process.cwd())
  const cliPath = resolve(options.cliPath ?? resolve(workspaceRoot, 'packages/cli/src/cli.mjs'))
  const nodePath = options.nodePath ?? process.execPath

  const safePath = (path = '.') => {
    const target = resolve(workspaceRoot, path)
    if (!inside(workspaceRoot, target)) throw new Error('Atlas MCP refuses paths outside the configured workspace root')
    return target
  }

  const skillRoot = async (skillId: string) => {
    const workspacePath = safePath(`skills/${skillId}`)
    if (await exists(workspacePath)) return workspacePath
    const bundledPath = resolve(bundledSkillsRoot, skillId)
    if (!inside(bundledSkillsRoot, bundledPath)) throw new Error('Atlas MCP refuses paths outside the bundled Skill root')
    return bundledPath
  }

  const runCli = async (args: string[]) => {
    if (!(await exists(cliPath))) throw new Error(`Atlas CLI was not found at ${cliPath}`)
    const result = await execFileAsync(nodePath, [cliPath, ...args], { cwd: workspaceRoot, maxBuffer: 2_000_000 })
    return { stdout: result.stdout.trim(), stderr: result.stderr.trim() }
  }

  return {
    workspaceRoot,
    manifest: atlasDesignManifest,
    listComponents(query = '', category?: AtlasComponentKnowledge['category']) {
      return queryAtlasComponents(query, category)
    },
    getComponent(name: string) {
      const component = atlasComponents.find((candidate) => candidate.name.toLowerCase() === name.toLowerCase())
      if (!component) throw new Error(`Unknown Atlas component: ${name}`)
      return component
    },
    listPatterns(query = '') { return queryAtlasPatterns(query) },
    async getSkill(id: string, reference?: string) {
      const skill = atlasSkills.find((candidate) => candidate.id.toLowerCase() === id.toLowerCase())
      if (!skill) throw new Error(`Unknown Atlas skill: ${id}`)
      const root = await skillRoot(skill.id)
      const source = await readFile(resolve(root, 'SKILL.md'), 'utf8')
      const referencesRoot = resolve(root, 'references')
      const references = await exists(referencesRoot)
        ? (await readdir(referencesRoot)).filter((entry) => entry.endsWith('.md')).sort()
        : []
      if (reference && !references.includes(reference)) throw new Error(`Unknown reference for ${skill.id}: ${reference}`)
      return {
        ...skill,
        source,
        references: references.map((name) => `skills/${skill.id}/references/${name}`),
        reference: reference ? { name: reference, source: await readFile(resolve(referencesRoot, reference), 'utf8') } : undefined
      }
    },
    planPage(input: { intent: string; framework?: AtlasAgentFramework; density?: 'compact' | 'standard' | 'comfortable'; locale?: 'zh-CN' | 'en-US'; pattern?: string }) {
      return planAtlasPage(input)
    },
    validateSource(input: { source?: string; path?: string; framework?: AtlasAgentFramework; aiPage?: boolean }) {
      if (!input.source && !input.path) throw new Error('source or path is required')
      return input.source
        ? Promise.resolve(validateAtlasPageSource(input.source, input))
        : readFile(safePath(input.path), 'utf8').then((source) => validateAtlasPageSource(source, input))
    },
    async createApp(input: { name: string; framework?: AtlasAgentFramework; template?: string; layout?: string; density?: string; locale?: string; adapter?: string; backend?: 'none' | 'java'; local?: boolean }) {
      const target = safePath(input.name)
      if (await exists(target)) throw new Error(`Target already exists: ${target}`)
      const args = ['create', input.name, '--framework', input.framework ?? 'react', '--template', input.template ?? 'workbench', '--framework-layout', input.layout ?? 'sidebar', '--density', input.density ?? 'standard', '--locale', input.locale ?? 'zh-CN', '--adapter', input.adapter ?? 'native', '--backend', input.backend ?? 'none']
      if (input.local ?? true) args.push('--local')
      return { target, ...(await runCli(args)) }
    },
    async generatePage(input: { pattern: string; framework?: AtlasAgentFramework; output: string; overwrite?: boolean }) {
      const output = safePath(input.output)
      if (!input.overwrite && await exists(output)) throw new Error(`Output already exists: ${output}`)
      return { output, ...(await runCli(['generate', 'page', input.pattern, '--framework', input.framework ?? 'react', '--out', output])) }
    },
    async previewUpgrade(input: { target?: string; layout?: string; density?: string; locale?: string; adapter?: string }) {
      const target = safePath(input.target ?? '.')
      const args = ['upgrade', target, '--dry-run']
      if (input.layout) args.push('--framework-layout', input.layout)
      if (input.density) args.push('--density', input.density)
      if (input.locale) args.push('--locale', input.locale)
      if (input.adapter) args.push('--adapter', input.adapter)
      return { target, ...(await runCli(args)) }
    },
    async readWorkspaceResource(path: string, fallback: unknown) {
      const target = safePath(path)
      return await exists(target) ? readFile(target, 'utf8') : JSON.stringify(fallback, null, 2)
    },
    async readDesignManifest(name: AtlasDesignManifestFile) {
      if (!designManifestFiles.includes(name)) throw new Error(`Unknown Atlas design manifest: ${name}`)
      const workspacePath = safePath(`manifests/${name}`)
      const target = await exists(workspacePath) ? workspacePath : resolve(bundledManifestsRoot, name)
      return readFile(target, 'utf8')
    },
    resources: {
      components: atlasComponents,
      patterns: atlasPagePatterns,
      skills: atlasSkills,
      manifest: atlasDesignManifest,
      visualRules: atlasDesignManifest.visualRules
    }
  }
}

export type AtlasMCPService = ReturnType<typeof createAtlasMCPService>
