import { lstat, readFile, readdir, realpath } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const skillsRoot = resolve(root, 'skills')
const failures = []

const fail = (message) => failures.push(message)
const exists = async (path) => lstat(path).then(() => true, () => false)
const filesUnder = async (directory) => {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) files.push(...await filesUnder(path))
    else if (entry.isFile()) files.push(path)
  }
  return files
}

const directories = (await readdir(skillsRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()

const agentKitSource = await readFile(resolve(root, 'packages/agent-kit/src/index.ts'), 'utf8')
const registered = [...agentKitSource.matchAll(/path: 'skills\/([^/]+)\/SKILL\.md'/g)].map((match) => match[1]).sort()

if (JSON.stringify(directories) !== JSON.stringify(registered)) {
  fail(`Skill 目录与 Agent Kit 注册不一致：目录=${directories.join(', ')}；注册=${registered.join(', ')}`)
}

for (const name of directories) {
  const directory = resolve(skillsRoot, name)
  const skillPath = resolve(directory, 'SKILL.md')
  const metadataPath = resolve(directory, 'agents/openai.yaml')
  if (!(await exists(skillPath))) { fail(`${name}: 缺少 SKILL.md`); continue }
  if (!(await exists(metadataPath))) { fail(`${name}: 缺少 agents/openai.yaml`); continue }

  const source = await readFile(skillPath, 'utf8')
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n/)
  if (!frontmatter) {
    fail(`${name}: SKILL.md 缺少 YAML frontmatter`)
  } else {
    const declaredName = frontmatter[1].match(/^name:\s*(.+)$/m)?.[1]?.trim()
    const description = frontmatter[1].match(/^description:\s*(.+)$/m)?.[1]?.trim()
    if (declaredName !== name) fail(`${name}: frontmatter name 必须与目录名一致`)
    if (!description || description.length < 30) fail(`${name}: description 需要明确能力和触发场景`)
  }

  if (source.split('\n').length > 500) fail(`${name}: SKILL.md 超过 500 行，应拆到 references/`)
  if (/\b(?:Use|使用)\s+-[a-z]/i.test(source)) fail(`${name}: 使用了无效的 -skill 调用形式`)
  for (const path of await filesUnder(directory)) {
    if (!/\.(?:md|yaml|yml|json|txt)$/i.test(path)) continue
    const content = await readFile(path, 'utf8')
    if (/(?:ghp|github_pat)_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9]{20,}|BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/.test(content)) {
      fail(`${name}: ${relative(directory, path)} 疑似包含敏感凭证`)
    }
  }

  const links = [...source.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((match) => match[1].split('#')[0])
  for (const link of links) {
    if (!link || /^(?:https?:|mailto:)/.test(link)) continue
    const target = resolve(dirname(skillPath), decodeURIComponent(link))
    if (!(await exists(target))) fail(`${name}: 相对链接不存在 ${link}`)
  }

  const metadata = await readFile(metadataPath, 'utf8')
  if (!metadata.includes(`$${name}`)) fail(`${name}: default_prompt 必须显式包含 $${name}`)
  if (!/^\s*short_description:\s*".{25,64}"\s*$/m.test(metadata)) fail(`${name}: short_description 应为 25-64 个字符并使用双引号`)
  if (!/^\s*brand_color:\s*"#7B61FF"\s*$/m.test(metadata)) fail(`${name}: brand_color 应使用 Atlas 品牌主色`)
  if (!/^\s*allow_implicit_invocation:\s*true\s*$/m.test(metadata)) fail(`${name}: 需要声明允许隐式调用`)
}

for (const obsolete of ['skills/atlas-eids-design-system/QUICK-REFERENCE.md', 'skills/atlas-eids-design-system/CHARTS.md']) {
  if (await exists(resolve(root, obsolete))) fail(`旧参考文件仍存在：${obsolete}`)
}

const skillLink = resolve(root, '.agents/skills')
if (!(await exists(skillLink))) {
  fail('缺少 .agents/skills 自动发现入口')
} else if (await realpath(skillLink) !== await realpath(skillsRoot)) {
  fail('.agents/skills 未指向根目录 skills/')
}

const requiredSkillMarkers = {
  'atlas-eids-design-system': ['atlas_get_visual_contract', 'atlas://contracts/visual-rules', 'tests/storybook/parity.spec.ts'],
  'atlas-react': ['knowledge contract AtlasDataTable', 'manifests/component-manifest.json', 'tests/storybook/parity.spec.ts'],
  'atlas-vue': ['knowledge contract <组件名>', '<AtlasProvider', 'tests/storybook/parity.spec.ts'],
  'atlas-tokens': ['manifests/token-contract.json', 'examples/shared/tokens.css', 'test:design-contract']
}
for (const [name, markers] of Object.entries(requiredSkillMarkers)) {
  const source = await readFile(resolve(skillsRoot, name, 'SKILL.md'), 'utf8')
  for (const marker of markers) if (!source.includes(marker)) fail(`${name}: 缺少设计契约入口 ${marker}`)
}

const workspaceVersion = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8')).version
for (const name of ['component-manifest.json', 'page-recipes.json', 'token-contract.json', 'visual-rules.json']) {
  const path = resolve(root, 'manifests', name)
  if (!(await exists(path))) { fail(`缺少 Machine Manifest: ${name}`); continue }
  const manifest = JSON.parse(await readFile(path, 'utf8'))
  if (manifest.version !== workspaceVersion) fail(`${name}: 版本与 Workspace 不一致`)
}

if (failures.length) {
  console.error(`Atlas Skills 检查失败（${failures.length} 项）`)
  failures.forEach((message) => console.error(`- ${message}`))
  process.exit(1)
}

console.log(`Atlas Skills 检查通过：${directories.length} 个 Skill，注册、Machine Manifest、元数据、引用和敏感信息规则一致。`)
