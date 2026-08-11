import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import ts from 'typescript'

const root = resolve(import.meta.dirname, '..')
const reactPath = resolve(root, 'packages/react/src/index.tsx')
const vuePath = resolve(root, 'packages/vue/src/index.ts')
const sourceApiPath = resolve(root, 'docs/component-api.json')
const jsonTarget = resolve(root, 'docs/component-api.generated.json')
const markdownTarget = resolve(root, 'docs/COMPONENT_API_REFERENCE.md')
const check = process.argv.includes('--check')

const program = ts.createProgram([reactPath, vuePath], {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  skipLibCheck: true
})
const checker = program.getTypeChecker()
const sourceApi = JSON.parse(await readFile(sourceApiPath, 'utf8'))

function moduleExports(path) {
  const source = program.getSourceFile(path)
  const symbol = source && checker.getSymbolAtLocation(source)
  return new Map((symbol ? checker.getExportsOfModule(symbol) : []).map((entry) => [entry.name, entry]))
}

const reactExports = moduleExports(reactPath)
const vueExports = moduleExports(vuePath)

function reactProps(name) {
  const symbol = reactExports.get(name)
  const declaration = symbol?.valueDeclaration ?? symbol?.declarations?.[0]
  if (!declaration) return []
  const signatures = checker.getTypeOfSymbolAtLocation(symbol, declaration).getCallSignatures()
  const parameter = signatures[0]?.parameters[0]
  if (!parameter) return []
  const parameterDeclaration = parameter.valueDeclaration ?? declaration
  return checker.getTypeOfSymbolAtLocation(parameter, parameterDeclaration).getProperties().map((property) => {
    const propertyDeclaration = property.valueDeclaration ?? property.declarations?.[0] ?? parameterDeclaration
    return {
      name: property.name,
      type: checker.typeToString(checker.getTypeOfSymbolAtLocation(property, propertyDeclaration), propertyDeclaration, ts.TypeFormatFlags.NoTruncation),
      optional: Boolean(property.flags & ts.SymbolFlags.Optional)
    }
  }).filter((property) => !property.name.startsWith('aria-') && !property.name.startsWith('onAnimation')).slice(0, 48)
}

const generated = sourceApi.map((component) => ({
  name: component.name,
  category: component.category,
  summary: component.summary,
  frameworks: {
    react: reactExports.has(component.name),
    vue: vueExports.has(component.name)
  },
  props: reactProps(component.name),
  documentedProps: component.props.map(([name, type, defaultValue, description]) => ({ name, type, default: defaultValue, description }))
}))

const json = JSON.stringify(generated, null, 2) + '\n'
const markdown = `# Component API Reference

此文档由 React / Vue TypeScript 导出自动生成。组件说明来自设计系统清单，属性签名以当前源码类型为准，请勿手工编辑。

| Component | Category | React | Vue | Typed Props |
| --- | --- | --- | --- | ---: |
${generated.map((item) => `| \`${item.name}\` | ${item.category} | ${item.frameworks.react ? 'Yes' : 'No'} | ${item.frameworks.vue ? 'Yes' : 'No'} | ${item.props.length} |`).join('\n')}

${generated.map((item) => `## ${item.name}

${item.summary}

| Prop | Type | Optional |
| --- | --- | --- |
${item.props.length ? item.props.map((prop) => `| \`${prop.name}\` | \`${prop.type.replaceAll('|', '\\|')}\` | ${prop.optional ? 'Yes' : 'No'} |`).join('\n') : '| - | Framework declaration | - |'}
`).join('\n')}`

if (check) {
  const currentJson = await readFile(jsonTarget, 'utf8').catch(() => '')
  const currentMarkdown = await readFile(markdownTarget, 'utf8').catch(() => '')
  if (currentJson !== json || currentMarkdown !== markdown) throw new Error('Generated component API docs are stale. Run npm run docs:api.')
} else {
  await writeFile(jsonTarget, json)
  await writeFile(markdownTarget, markdown)
}

console.log(`Generated component API docs for ${generated.length} components`)
