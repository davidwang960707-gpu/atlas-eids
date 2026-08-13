import type { AtlasOptionContract, AtlasSortDirection, AtlasTableColumn } from './contracts.js'

export type AtlasFieldValue = string | number | boolean | null | undefined
export interface AtlasFormRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  validate?: (value: AtlasFieldValue, values: Record<string, AtlasFieldValue>) => string | undefined
  message?: string
}

export function validateAtlasForm(values: Record<string, AtlasFieldValue>, schema: Record<string, AtlasFormRule[]>) {
  const errors: Record<string, string> = {}
  for (const [name, rules] of Object.entries(schema)) {
    const value = values[name]
    for (const rule of rules) {
      const text = String(value ?? '')
      const message = rule.message ?? '字段值无效'
      if (rule.required && (value === undefined || value === null || text.trim() === '')) errors[name] = message
      else if (rule.minLength !== undefined && text.length < rule.minLength) errors[name] = message
      else if (rule.maxLength !== undefined && text.length > rule.maxLength) errors[name] = message
      else if (rule.pattern && !rule.pattern.test(text)) errors[name] = message
      else if (rule.validate) errors[name] = rule.validate(value, values) ?? ''
      if (errors[name]) break
      delete errors[name]
    }
  }
  return errors
}

export function moveAtlasActiveIndex(current: number, direction: 1 | -1, count: number, disabled: Set<number> = new Set()) {
  if (count <= 0) return -1
  let next = current < 0 ? (direction === 1 ? 0 : count - 1) : current
  for (let attempt = 0; attempt < count; attempt += 1) {
    next = (next + direction + count) % count
    if (!disabled.has(next)) return next
  }
  return -1
}

export function filterAtlasOptions(options: AtlasOptionContract[], query: string) {
  const normalized = query.trim().toLocaleLowerCase()
  return normalized ? options.filter((option) => `${option.label} ${option.value}`.toLocaleLowerCase().includes(normalized)) : options
}

export interface AtlasTreeNodeContract {
  id: string
  label: string
  disabled?: boolean
  children?: AtlasTreeNodeContract[]
}
export interface AtlasFlatTreeNode extends AtlasTreeNodeContract { depth: number; parentId?: string; hasChildren: boolean }

export function flattenAtlasTree(nodes: AtlasTreeNodeContract[], expandedIds: string[], depth = 0, parentId?: string): AtlasFlatTreeNode[] {
  return nodes.flatMap((node) => {
    const flat: AtlasFlatTreeNode = { ...node, depth, parentId, hasChildren: Boolean(node.children?.length) }
    return [flat, ...(node.children && expandedIds.includes(node.id) ? flattenAtlasTree(node.children, expandedIds, depth + 1, node.id) : [])]
  })
}

export interface AtlasDataGridColumn<Row extends object> extends AtlasTableColumn<Row> {
  hidden?: boolean
  pinned?: 'start' | 'end'
  priority?: number
  minWidth?: number
  maxWidth?: number
  filter?: (row: Row, query: string) => boolean
}
export interface AtlasDataGridInput<Row extends { id: string | number }> {
  rows: Row[]
  columns: AtlasDataGridColumn<Row>[]
  query?: string
  sortKey?: keyof Row | string
  sortDirection?: AtlasSortDirection
  offset?: number
  limit?: number
}

export function createAtlasDataGridModel<Row extends { id: string | number }>(input: AtlasDataGridInput<Row>) {
  const visibleColumns = input.columns.filter((column) => !column.hidden).sort((left, right) => {
    const pin = (column: AtlasDataGridColumn<Row>) => column.pinned === 'start' ? -1 : column.pinned === 'end' ? 1 : 0
    return pin(left) - pin(right) || (left.priority ?? 0) - (right.priority ?? 0)
  })
  const query = input.query?.trim().toLocaleLowerCase() ?? ''
  const filteredRows = query ? input.rows.filter((row) => visibleColumns.some((column) => column.filter ? column.filter(row, query) : String(row[column.key as keyof Row] ?? '').toLocaleLowerCase().includes(query))) : [...input.rows]
  if (input.sortKey && input.sortDirection) filteredRows.sort((left, right) => {
    const a = left[input.sortKey as keyof Row]
    const b = right[input.sortKey as keyof Row]
    const compared = String(a ?? '').localeCompare(String(b ?? ''), undefined, { numeric: true })
    return input.sortDirection === 'ascending' ? compared : -compared
  })
  const offset = Math.max(0, input.offset ?? 0)
  const limit = Math.max(1, input.limit ?? (filteredRows.length || 1))
  return { visibleColumns, filteredRows, visibleRows: filteredRows.slice(offset, offset + limit), totalRows: filteredRows.length, offset, limit }
}

export function toggleAtlasSelection<Id extends string | number>(selected: Id[], id: Id, mode: 'single' | 'multiple' = 'multiple') {
  if (mode === 'single') return selected.includes(id) ? [] : [id]
  return selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]
}

export interface AtlasDateRangeValue { start?: string; end?: string }
export function validateAtlasDateRange(value: AtlasDateRangeValue, min?: string, max?: string) {
  if (value.start && value.end && value.start > value.end) return '结束日期不能早于开始日期'
  if (min && value.start && value.start < min) return `开始日期不能早于 ${min}`
  if (max && value.end && value.end > max) return `结束日期不能晚于 ${max}`
  return undefined
}

export interface AtlasUploadFileContract { id: string; name: string; size: number; type: string; status: 'queued' | 'uploading' | 'completed' | 'failed'; progress: number; error?: string }
export function normalizeAtlasUploadFiles(files: ArrayLike<Pick<File, 'name' | 'size' | 'type'>>, options: { accept?: string[]; maxSize?: number } = {}) {
  return Array.from(files).map((file, index): AtlasUploadFileContract => {
    const rejectedType = options.accept?.length && !options.accept.some((accept) => file.type === accept || file.name.toLowerCase().endsWith(accept.replace('*', '').toLowerCase()))
    const rejectedSize = options.maxSize !== undefined && file.size > options.maxSize
    const error = rejectedType ? '不支持此文件类型' : rejectedSize ? '文件超过大小限制' : undefined
    return { id: `${Date.now()}-${index}-${file.name}`, name: file.name, size: file.size, type: file.type, status: error ? 'failed' : 'queued', progress: 0, error }
  })
}

export interface AtlasNotificationContract { id: string; title: string; description?: string; intent?: 'info' | 'success' | 'warning' | 'danger'; duration?: number; createdAt?: number }
export function createAtlasNotificationStore(initial: AtlasNotificationContract[] = []) {
  let items = [...initial]
  const listeners = new Set<(notifications: AtlasNotificationContract[]) => void>()
  const notify = () => listeners.forEach((listener) => listener([...items]))
  return {
    get: () => [...items],
    push(notification: AtlasNotificationContract) { items = [...items.filter((item) => item.id !== notification.id), { ...notification, createdAt: notification.createdAt ?? Date.now() }]; notify() },
    dismiss(id: string) { items = items.filter((item) => item.id !== id); notify() },
    clear() { items = []; notify() },
    subscribe(listener: (notifications: AtlasNotificationContract[]) => void) { listeners.add(listener); return () => listeners.delete(listener) }
  }
}

export function isAtlasActivationKey(key: string) { return key === 'Enter' || key === ' ' }
export function isAtlasEscapeKey(key: string) { return key === 'Escape' }
