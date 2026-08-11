import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import ts from 'typescript'

const root = resolve(import.meta.dirname, '..')
const declarationPath = resolve(root, 'packages/react/dist/index.d.ts')
const api = JSON.parse(await readFile(resolve(root, 'docs/component-api.json'), 'utf8'))
const program = ts.createProgram([declarationPath], {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  skipLibCheck: true
})
const checker = program.getTypeChecker()
const source = program.getSourceFile(declarationPath)
if (!source) throw new Error('React declaration file is missing; run build:packages first')
const moduleSymbol = checker.getSymbolAtLocation(source)
if (!moduleSymbol) throw new Error('Cannot inspect React component declarations')
const exports = new Map(checker.getExportsOfModule(moduleSymbol).map((symbol) => [symbol.name, symbol]))

for (const component of api) {
  const symbol = exports.get(component.name)
  if (!symbol) throw new Error(`React 类型声明缺少组件: ${component.name}`)
  const type = checker.getTypeOfSymbolAtLocation(symbol, source)
  const signature = type.getCallSignatures()[0]
  if (!signature) throw new Error(`React 组件没有可调用签名: ${component.name}`)
  const parameter = signature.getParameters()[0]
  if (!parameter) continue
  const propsType = checker.getTypeOfSymbolAtLocation(parameter, parameter.valueDeclaration ?? source)
  const actualProps = new Set(checker.getPropertiesOfType(propsType).map((prop) => prop.name))
  const undocumented = component.props
    .map(([name]) => name)
    .filter((name) => !actualProps.has(name))
  if (undocumented.length > 0) {
    throw new Error(`${component.name} 文档属性未出现在 React 类型中: ${undocumented.join(', ')}`)
  }
}

console.log(`Component type contract verified for ${api.length} documented components.`)
