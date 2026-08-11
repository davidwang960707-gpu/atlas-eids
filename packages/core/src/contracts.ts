export type AtlasSize = 'compact' | 'default' | 'comfortable'
export type AtlasIntent = 'neutral' | 'primary' | 'success' | 'warning' | 'danger'
export type AtlasStatus = 'idle' | 'loading' | 'success' | 'warning' | 'error' | 'disabled'
export type AtlasTheme = 'light' | 'dark' | 'auto'
export type AtlasDensity = 'compact' | 'standard' | 'comfortable'

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

export interface AtlasPagePattern {
  id: string
  category: 'framework' | 'layout' | 'common' | 'business' | 'ai-page'
  name: string
  regions: string[]
  requiredActions: string[]
  aiCapabilities?: string[]
}
