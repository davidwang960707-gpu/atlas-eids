import type { AtlasOptionContract } from './contracts.js'
import { validateAtlasForm, type AtlasFieldValue, type AtlasFormRule } from './headless.js'

export type AtlasAIArtifactType = 'text' | 'markdown' | 'code' | 'table' | 'chart' | 'file' | 'json'
export interface AtlasAIArtifactContract {
  id: string
  type: AtlasAIArtifactType
  title?: string
  description?: string
  content?: string
  language?: string
  columns?: Array<{ key: string; title: string }>
  rows?: Array<Record<string, string | number | boolean | null>>
  values?: Array<{ label: string; value: number }>
  file?: { name: string; url: string; mediaType?: string; size?: number }
}

export interface AtlasAIStructuredFieldContract {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'boolean' | 'date' | 'number'
  description?: string
  placeholder?: string
  options?: AtlasOptionContract[]
  rules?: AtlasFormRule[]
}

export interface AtlasAIProvenanceContract {
  model: string
  provider?: string
  generatedAt: string
  traceId: string
  sourceIds?: string[]
  policyIds?: string[]
  confidence?: number
  cost?: { inputTokens?: number; outputTokens?: number; amount?: number; currency?: string }
  reviewedBy?: string
}

export type AtlasGenUINodeType = 'stack' | 'panel' | 'text' | 'metric' | 'action' | 'table' | 'artifact'
export interface AtlasGenUINodeContract {
  id: string
  type: AtlasGenUINodeType
  title?: string
  text?: string
  value?: string | number
  suffix?: string
  actionId?: string
  actionLabel?: string
  artifact?: AtlasAIArtifactContract
  children?: AtlasGenUINodeContract[]
}

export interface AtlasMCPToolContract {
  id: string
  serverId: string
  name: string
  description?: string
  permission: 'read' | 'write' | 'high-risk'
  status?: 'available' | 'running' | 'approval' | 'disabled' | 'error'
  inputSchema?: Record<string, unknown>
}

export interface AtlasCrossPageStepContract {
  id: string
  title: string
  route?: string
  detail?: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'approval'
}

export function validateAtlasStructuredInput(fields: AtlasAIStructuredFieldContract[], values: Record<string, AtlasFieldValue>) {
  return validateAtlasForm(values, Object.fromEntries(fields.map((field) => [field.name, field.rules ?? []])))
}

const genUIAllowlist = new Set<AtlasGenUINodeType>(['stack', 'panel', 'text', 'metric', 'action', 'table', 'artifact'])
export function validateAtlasGenUISchema(root: AtlasGenUINodeContract, options: { maxDepth?: number; maxNodes?: number } = {}) {
  const issues: string[] = []
  const ids = new Set<string>()
  const maxDepth = options.maxDepth ?? 8
  const maxNodes = options.maxNodes ?? 100
  let count = 0
  const visit = (node: AtlasGenUINodeContract, depth: number) => {
    count += 1
    if (count > maxNodes) return
    if (depth > maxDepth) issues.push(`节点 ${node.id} 超过最大深度 ${maxDepth}`)
    if (!genUIAllowlist.has(node.type)) issues.push(`节点 ${node.id} 使用了未授权类型`)
    if (ids.has(node.id)) issues.push(`节点 ID 重复：${node.id}`)
    ids.add(node.id)
    if (node.type === 'action' && (!node.actionId || !node.actionLabel)) issues.push(`操作节点 ${node.id} 缺少 actionId 或 actionLabel`)
    if ((node.type === 'table' || node.type === 'artifact') && !node.artifact) issues.push(`节点 ${node.id} 缺少 Artifact`)
    node.children?.forEach((child) => visit(child, depth + 1))
  }
  visit(root, 0)
  if (count > maxNodes) issues.push(`Schema 节点数超过 ${maxNodes}`)
  return { valid: issues.length === 0, issues, nodeCount: count }
}

export function filterAtlasMCPTools(tools: AtlasMCPToolContract[], query: string, permission?: AtlasMCPToolContract['permission']) {
  const normalized = query.trim().toLocaleLowerCase()
  return tools.filter((tool) => (!permission || tool.permission === permission) && (!normalized || `${tool.name} ${tool.description ?? ''} ${tool.serverId}`.toLocaleLowerCase().includes(normalized)))
}
