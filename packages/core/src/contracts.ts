export type AtlasSize = 'compact' | 'default' | 'comfortable'
export type AtlasIntent = 'neutral' | 'primary' | 'success' | 'warning' | 'danger'
export type AtlasStatus = 'idle' | 'loading' | 'success' | 'warning' | 'error' | 'disabled'
export type AtlasTheme = 'light' | 'dark' | 'auto'
export type AtlasDensity = 'compact' | 'standard' | 'comfortable'
export type AtlasLocale = 'zh-CN' | 'en-US'
export type AtlasSortDirection = 'ascending' | 'descending'
export type AtlasSemanticTone = 'neutral' | 'primary' | 'info' | 'success' | 'warning' | 'danger'

export interface AtlasCommonProps {
  id?: string
  className?: string
  disabled?: boolean
  ariaLabel?: string
  testId?: string
}

export interface AtlasButtonContract extends AtlasCommonProps {
  intent?: AtlasIntent
  size?: AtlasSize
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export interface AtlasInputContract extends AtlasCommonProps {
  value?: string
  defaultValue?: string
  placeholder?: string
  status?: Exclude<AtlasStatus, 'loading' | 'success'>
  clearable?: boolean
}

export interface AtlasCardContract extends AtlasCommonProps {
  title?: string
  description?: string
  selected?: boolean
  interactive?: boolean
}

export interface AtlasDialogContract extends AtlasCommonProps {
  open: boolean
  title: string
  closeOnEscape?: boolean
  closeOnBackdrop?: boolean
}

export interface AtlasTabItem {
  id: string
  label: string
  disabled?: boolean
  count?: number
}

export interface AtlasTableColumn<Row extends object> {
  key: keyof Row | string
  title: string
  width?: number | string
  align?: 'start' | 'center' | 'end'
  sortable?: boolean
}

export interface AtlasTableLabels {
  selectAll: string
  selectRow: string
  emptyTitle: string
  emptyDescription: string
  sortAscending: string
  sortDescending: string
}

export interface AtlasTableContract<Row extends { id: string | number }> {
  columns: AtlasTableColumn<Row>[]
  rows: Row[]
  caption: string
  selectedIds?: Array<string | number>
  loading?: boolean
  sortKey?: keyof Row | string
  sortDirection?: AtlasSortDirection
  labels?: Partial<AtlasTableLabels>
}

export interface AtlasRowActionContract {
  id: string
  label: string
  disabled?: boolean
  danger?: boolean
}

export interface AtlasOptionContract { label: string; value: string; disabled?: boolean }
export interface AtlasExecutionStepContract { id: string; title: string; description?: string; status: 'pending' | 'running' | 'completed' | 'failed' | 'approval' }
export interface AtlasStepContract { id: string; title: string; description?: string; status?: 'pending' | 'current' | 'completed' | 'error' }
export interface AtlasBreadcrumbItemContract { label: string; href?: string }
export interface AtlasDropdownItemContract { id: string; label: string; disabled?: boolean; danger?: boolean }
export interface AtlasAICitationItemContract { id: string; title: string; source?: string; url?: string; excerpt?: string; confidence?: number }
export interface AtlasAIPromptItemContract { id: string; label: string; description?: string; category?: string }
export interface AtlasAIAttachmentItemContract { id: string; name: string; mediaType: string; size?: number; status?: 'ready' | 'uploading' | 'failed' }
export interface AtlasAIHistoryItemContract { id: string; title: string; preview?: string; updatedAt?: string; pinned?: boolean }
export interface AtlasMCPServerItemContract { id: string; name: string; description?: string; status: 'connected' | 'disconnected' | 'error'; toolCount?: number; transport?: 'stdio' | 'http' | 'webmcp' }
export interface AtlasKnowledgeSourceItemContract { id: string; name: string; type: 'document' | 'database' | 'website' | 'api'; status?: 'ready' | 'syncing' | 'error'; count?: number; scope?: string }
export interface AtlasRetrievalStepContract { id: string; title: string; detail?: string; status: 'pending' | 'running' | 'completed' | 'failed'; durationMs?: number }
export interface AtlasToolCallItemContract { id: string; name: string; description?: string; permission: 'read' | 'write' | 'high-risk'; status: 'queued' | 'running' | 'approval' | 'completed' | 'failed'; durationMs?: number; input?: unknown; result?: unknown }

export interface AtlasPagePattern {
  id: string
  category: 'framework' | 'layout' | 'common' | 'business' | 'ai-page'
  name: string
  regions: string[]
  requiredActions: string[]
  aiCapabilities?: string[]
}
