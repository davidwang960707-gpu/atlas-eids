import { Fragment, createContext, useContext, useEffect, useId, useMemo, useRef, useState, type ButtonHTMLAttributes, type CSSProperties, type FormEvent, type HTMLAttributes, type InputHTMLAttributes, type KeyboardEvent as ReactKeyboardEvent, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { createAtlasDataGridModel, filterAtlasMCPTools, filterAtlasOptions, flattenAtlasTree, moveAtlasActiveIndex, normalizeAtlasUploadFiles, validateAtlasDateRange, validateAtlasForm, validateAtlasGenUISchema, type AtlasAIArtifactContract, type AtlasAIProvenanceContract, type AtlasAIStructuredFieldContract, type AtlasCrossPageStepContract, type AtlasDataGridColumn as AtlasCoreDataGridColumn, type AtlasDateRangeValue, type AtlasFieldValue, type AtlasFormRule, type AtlasGenUINodeContract, type AtlasMCPToolContract, type AtlasNotificationContract, type AtlasTreeNodeContract, type AtlasUploadFileContract } from '@atlas-eids/core'
import type { AtlasAIAttachmentItemContract, AtlasAICitationItemContract, AtlasAIHistoryItemContract, AtlasAIPromptItemContract, AtlasDensity, AtlasDropdownItemContract, AtlasExecutionStepContract, AtlasKnowledgeSourceItemContract, AtlasLocale, AtlasMCPServerItemContract, AtlasOptionContract, AtlasRetrievalStepContract, AtlasRowActionContract, AtlasSemanticTone, AtlasSortDirection, AtlasStepContract, AtlasTableColumn as AtlasCoreTableColumn, AtlasTableLabels, AtlasToolCallItemContract } from '@atlas-eids/core'

const cx = (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(' ')
const focusableSelector = 'button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

function useAtlasOverlay(open: boolean, root: React.RefObject<HTMLElement | null>, onClose: () => void) {
  const previousFocus = useRef<HTMLElement | null>(null)
  useEffect(() => {
    if (!open || !root.current) return
    previousFocus.current = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const elements = () => [...root.current!.querySelectorAll<HTMLElement>(focusableSelector)].filter((element) => element.offsetParent !== null)
    elements()[0]?.focus()
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return }
      if (event.key !== 'Tab') return
      const items = elements()
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', keydown)
    return () => {
      document.removeEventListener('keydown', keydown)
      document.body.style.overflow = previousOverflow
      previousFocus.current?.focus()
    }
  }, [open, onClose, root])
}

export interface AtlasProviderProps {
  theme?: 'light' | 'dark'
  density?: AtlasDensity
  locale?: AtlasLocale
  children: ReactNode
}

const AtlasConfigContext = createContext<{ theme: 'light' | 'dark'; density: AtlasDensity; locale: AtlasLocale }>({ theme: 'light', density: 'standard', locale: 'zh-CN' })

export function AtlasProvider({ theme = 'light', density = 'standard', locale = 'zh-CN', children }: AtlasProviderProps) {
  return <AtlasConfigContext.Provider value={{ theme, density, locale }}><div className="atlas-root" data-atlas-theme={theme} data-atlas-density={density} data-atlas-locale={locale} lang={locale}>{children}</div></AtlasConfigContext.Provider>
}

export interface AtlasButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  intent?: 'neutral' | 'primary' | 'danger'
  size?: 'compact' | 'default' | 'comfortable'
  loading?: boolean
}

export function AtlasButton({ intent = 'neutral', size = 'default', loading = false, className, children, disabled, ...props }: AtlasButtonProps) {
  return <button className={cx('atlas-button', `is-${intent}`, `is-${size}`, className)} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
    {loading && <span className="atlas-spinner" aria-hidden="true" />}
    <span>{children}</span>
  </button>
}

export interface AtlasInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export function AtlasInput({ label, hint, error, className, id, ...props }: AtlasInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const descriptionId = `${inputId}-description`
  return <label className={cx('atlas-field', error && 'has-error', className)} htmlFor={inputId}>
    {label && <span className="atlas-field-label">{label}</span>}
    <input id={inputId} className="atlas-input" aria-invalid={Boolean(error) || undefined} aria-describedby={(hint || error) ? descriptionId : undefined} {...props} />
    {(hint || error) && <small id={descriptionId}>{error ?? hint}</small>}
  </label>
}

export interface AtlasFormProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  schema?: Record<string, AtlasFormRule[]>
  errors?: Record<string, string>
  busy?: boolean
  onSubmit: (values: Record<string, AtlasFieldValue>) => void | Promise<void>
  children: ReactNode
}

export function AtlasForm({ schema = {}, errors: externalErrors, busy = false, onSubmit, children, className, ...props }: AtlasFormProps) {
  const [internalErrors, setInternalErrors] = useState<Record<string, string>>({})
  const errors = externalErrors ?? internalErrors
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<string, AtlasFieldValue>
    const nextErrors = validateAtlasForm(values, schema)
    if (!externalErrors) setInternalErrors(nextErrors)
    const first = Object.keys(nextErrors)[0]
    if (first) { event.currentTarget.querySelector<HTMLElement>(`[name="${CSS.escape(first)}"]`)?.focus(); return }
    await onSubmit(values)
  }
  return <form className={cx('atlas-form', className)} aria-busy={busy || undefined} noValidate onSubmit={submit} {...props}>
    {Object.keys(errors).length > 0 && <div className="atlas-form-summary" role="alert" tabIndex={-1}><strong>请检查以下字段</strong><ul>{Object.entries(errors).map(([name, message]) => <li key={name}><button type="button" onClick={(event) => event.currentTarget.form?.querySelector<HTMLElement>(`[name="${CSS.escape(name)}"]`)?.focus()}>{message}</button></li>)}</ul></div>}
    <fieldset disabled={busy}>{children}</fieldset>
  </form>
}

export interface AtlasCardProps extends HTMLAttributes<HTMLElement> {
  title?: string
  description?: string
  selected?: boolean
  actions?: ReactNode
}

export function AtlasCard({ title, description, selected, actions, children, className, ...props }: AtlasCardProps) {
  return <article className={cx('atlas-card', selected && 'is-selected', className)} {...props}>
    {(title || description || actions) && <header><div>{title && <h3>{title}</h3>}{description && <p>{description}</p>}</div>{actions}</header>}
    {children && <div className="atlas-card-body">{children}</div>}
  </article>
}

export interface AtlasOrbProps extends HTMLAttributes<HTMLSpanElement> {
  state?: 'idle' | 'thinking' | 'running' | 'error'
  size?: number
  label?: string
  showRing?: boolean
}

export function AtlasOrb({ state = 'idle', size = 48, label = 'Atlas AI', showRing = true, className, style, ...props }: AtlasOrbProps) {
  const orbStyle = { width: size, height: size, '--atlas-orb-size': `${size}px`, ...style } as CSSProperties
  return <span className={cx('atlas-living-orb', `state-${state}`, className)} style={orbStyle} role="img" aria-label={`${label}，${state}`} {...props}>
    <span className="atlas-living-orb-atmosphere" />
    {showRing && <><span className="atlas-living-orb-ring primary" /><span className="atlas-living-orb-ring secondary" /></>}
    <span className="atlas-living-orb-core"><span className="depth" /><span className="caustic" /><span className="liquid" /><span className="specular" /></span>
  </span>
}

export interface AtlasTab {
  id: string
  label: string
  count?: number
  disabled?: boolean
}

export function AtlasTabs({ items, value, onChange, label = '页面标签' }: { items: AtlasTab[]; value: string; onChange: (id: string) => void; label?: string }) {
  return <div className="atlas-tabs" role="tablist" aria-label={label}>{items.map((item) => <button key={item.id} role="tab" aria-selected={item.id === value} disabled={item.disabled} onClick={() => onChange(item.id)}>{item.label}{item.count !== undefined && <b>{item.count}</b>}</button>)}</div>
}

export function AtlasDialog({ open, title, children, onClose, footer, closeOnBackdrop = true }: { open: boolean; title: string; children: ReactNode; onClose: () => void; footer?: ReactNode; closeOnBackdrop?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  useAtlasOverlay(open, ref, onClose)
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])
  return <dialog ref={ref} className="atlas-dialog" aria-labelledby={titleId} onCancel={(event) => event.preventDefault()} onClick={(event) => { if (closeOnBackdrop && event.target === ref.current) onClose() }}>
    <header><h2 id={titleId}>{title}</h2><button onClick={onClose} aria-label="关闭">×</button></header>
    <div className="atlas-dialog-body">{children}</div>
    {footer && <footer>{footer}</footer>}
  </dialog>
}

export interface AtlasAIComposerProps {
  value?: string
  placeholder?: string
  suggestions?: string[]
  busy?: boolean
  contexts?: string[]
  onChange?: (value: string) => void
  onSubmit: (value: string) => void
}

export function AtlasAIComposer({ value, placeholder = '描述目标、输出形式和约束条件...', suggestions = [], busy, contexts = [], onChange, onSubmit }: AtlasAIComposerProps) {
  const [internalValue, setInternalValue] = useState(value ?? '')
  const currentValue = value ?? internalValue
  const update = (next: string) => { if (value === undefined) setInternalValue(next); onChange?.(next) }
  const submit = () => { if (!busy && currentValue.trim()) onSubmit(currentValue.trim()) }
  return <section className="atlas-ai-composer">
    {contexts.length > 0 && <div className="atlas-contexts">{contexts.map((context) => <span key={context}>{context}</span>)}</div>}
    <textarea value={currentValue} placeholder={placeholder} onChange={(event) => update(event.target.value)} onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') submit() }} />
    {suggestions.length > 0 && <div className="atlas-suggestions">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => update(suggestion)}>{suggestion}</button>)}</div>}
    <footer><span>Atlas Reasoner</span><AtlasButton intent="primary" loading={busy} onClick={submit}>发送</AtlasButton></footer>
  </section>
}

export interface AtlasExecutionStep extends AtlasExecutionStepContract {}

export function AtlasExecutionPlan({ title = '执行计划', steps, onStop, onApprove }: { title?: string; steps: AtlasExecutionStep[]; onStop?: () => void; onApprove?: (id: string) => void }) {
  return <section className="atlas-execution-plan"><header><div><span>Agent Execution</span><h3>{title}</h3></div>{onStop && <AtlasButton onClick={onStop}>停止</AtlasButton>}</header><ol>{steps.map((step, index) => <li key={step.id} className={`is-${step.status}`}><i>{step.status === 'completed' ? '✓' : index + 1}</i><div><strong>{step.title}</strong>{step.description && <span>{step.description}</span>}</div>{step.status === 'approval' && onApprove && <AtlasButton intent="primary" size="compact" onClick={() => onApprove(step.id)}>批准</AtlasButton>}</li>)}</ol></section>
}

export interface AtlasOption extends AtlasOptionContract {}

export interface AtlasSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  hint?: string
  options: AtlasOption[]
}

export function AtlasSelect({ label, hint, options, className, id, ...props }: AtlasSelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  return <label className={cx('atlas-field', className)} htmlFor={selectId}>{label && <span className="atlas-field-label">{label}</span>}<select id={selectId} className="atlas-select" {...props}>{options.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}</select>{hint && <small>{hint}</small>}</label>
}

export interface AtlasComboboxProps {
  label: string
  options: AtlasOption[]
  value?: string
  query?: string
  placeholder?: string
  loading?: boolean
  error?: string
  disabled?: boolean
  onQueryChange?: (query: string) => void
  onChange: (value: string) => void
}

export function AtlasCombobox({ label, options, value, query, placeholder = '搜索或选择', loading, error, disabled, onQueryChange, onChange }: AtlasComboboxProps) {
  const id = useId()
  const [internalQuery, setInternalQuery] = useState(() => options.find((option) => option.value === value)?.label ?? '')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const currentQuery = query ?? internalQuery
  const filtered = useMemo(() => filterAtlasOptions(options, currentQuery), [options, currentQuery])
  const disabledIndexes = useMemo(() => new Set(filtered.map((option, index) => option.disabled ? index : -1).filter((index) => index >= 0)), [filtered])
  const updateQuery = (next: string) => { if (query === undefined) setInternalQuery(next); onQueryChange?.(next); setOpen(true); setActive(-1) }
  const select = (option: AtlasOption) => { if (option.disabled) return; updateQuery(option.label); onChange(option.value); setOpen(false) }
  const keydown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setOpen(true); setActive((current) => moveAtlasActiveIndex(current, event.key === 'ArrowDown' ? 1 : -1, filtered.length, disabledIndexes)) }
    if (event.key === 'Enter' && open && active >= 0) { event.preventDefault(); select(filtered[active]) }
    if (event.key === 'Escape') setOpen(false)
  }
  return <label className={cx('atlas-field', 'atlas-combobox', error && 'has-error')} htmlFor={id}><span className="atlas-field-label">{label}</span><div><input id={id} role="combobox" aria-expanded={open} aria-controls={`${id}-listbox`} aria-activedescendant={active >= 0 ? `${id}-option-${active}` : undefined} aria-autocomplete="list" value={currentQuery} placeholder={placeholder} disabled={disabled} onChange={(event) => updateQuery(event.target.value)} onFocus={() => setOpen(true)} onKeyDown={keydown}/><button type="button" aria-label={open ? '关闭选项' : '打开选项'} disabled={disabled} onClick={() => setOpen((current) => !current)}>⌄</button></div>{open && <ul id={`${id}-listbox`} role="listbox">{loading ? <li role="option" aria-disabled="true">加载中...</li> : filtered.length ? filtered.map((option, index) => <li id={`${id}-option-${index}`} role="option" aria-selected={option.value === value} aria-disabled={option.disabled || undefined} className={cx(index === active && 'is-active', option.value === value && 'is-selected')} key={option.value} onMouseDown={(event) => event.preventDefault()} onClick={() => select(option)}>{option.label}</li>) : <li role="option" aria-disabled="true">没有匹配项</li>}</ul>}{error && <small>{error}</small>}</label>
}

export interface AtlasTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> { label?: string; hint?: string; error?: string }

export function AtlasTextarea({ label, hint, error, className, id, ...props }: AtlasTextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId
  return <label className={cx('atlas-field', error && 'has-error', className)} htmlFor={textareaId}>{label && <span className="atlas-field-label">{label}</span>}<textarea id={textareaId} className="atlas-textarea" aria-invalid={Boolean(error) || undefined} {...props} />{(hint || error) && <small>{error ?? hint}</small>}</label>
}

export function AtlasCheckbox({ checked, indeterminate, label, hideLabel = false, onChange, disabled, name, value }: { checked: boolean; indeterminate?: boolean; label: ReactNode; hideLabel?: boolean; onChange: (checked: boolean) => void; disabled?: boolean; name?: string; value?: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { if (inputRef.current) inputRef.current.indeterminate = Boolean(indeterminate) }, [indeterminate])
  return <label className="atlas-check"><input ref={inputRef} type="checkbox" name={name} value={value} checked={checked} aria-checked={indeterminate ? 'mixed' : checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} /><span aria-hidden="true" /><b className={hideLabel ? 'sr-only' : undefined}>{label}</b></label>
}

export function AtlasRadioGroup({ label, options, value, onChange, disabled }: { label: string; options: AtlasOption[]; value: string; onChange: (value: string) => void; disabled?: boolean }) {
  const name = useId()
  return <fieldset className="atlas-radio-group" disabled={disabled}><legend>{label}</legend>{options.map((option) => <label key={option.value}><input type="radio" name={name} value={option.value} checked={option.value === value} disabled={option.disabled} onChange={() => onChange(option.value)} /><span />{option.label}</label>)}</fieldset>
}

export function AtlasSwitch({ checked, onChange, label, disabled }: { checked: boolean; onChange: (checked: boolean) => void; label: string; disabled?: boolean }) {
  return <label className="atlas-switch"><button type="button" role="switch" aria-checked={checked} disabled={disabled} onClick={() => onChange(!checked)}><i /></button><span>{label}</span></label>
}

export function AtlasDateInput(props: Omit<AtlasInputProps, 'type'>) {
  return <AtlasInput type="date" {...props} />
}

export function AtlasDateRange({ value, onChange, label = '日期范围', min, max, disabled }: { value: AtlasDateRangeValue; onChange: (value: AtlasDateRangeValue) => void; label?: string; min?: string; max?: string; disabled?: boolean }) {
  const error = validateAtlasDateRange(value, min, max)
  return <fieldset className={cx('atlas-date-range', error && 'has-error')} disabled={disabled}><legend>{label}</legend><AtlasDateInput label="开始日期" value={value.start ?? ''} min={min} max={value.end ?? max} onChange={(event) => onChange({ ...value, start: event.target.value })}/><span aria-hidden="true">至</span><AtlasDateInput label="结束日期" value={value.end ?? ''} min={value.start ?? min} max={max} onChange={(event) => onChange({ ...value, end: event.target.value })}/>{error && <small role="alert">{error}</small>}</fieldset>
}

export function AtlasUpload({ files = [], accept, maxSize, multiple = true, disabled, onAdd, onRemove, onRetry, label = '上传文件' }: { files?: AtlasUploadFileContract[]; accept?: string[]; maxSize?: number; multiple?: boolean; disabled?: boolean; onAdd: (files: AtlasUploadFileContract[], nativeFiles: File[]) => void; onRemove?: (id: string) => void; onRetry?: (id: string) => void; label?: string }) {
  const input = useRef<HTMLInputElement>(null)
  const add = (nativeFiles: File[]) => nativeFiles.length && onAdd(normalizeAtlasUploadFiles(nativeFiles, { accept, maxSize }), nativeFiles)
  return <section className={cx('atlas-upload', disabled && 'is-disabled')} aria-label={label}><input ref={input} className="sr-only" type="file" multiple={multiple} accept={accept?.join(',')} disabled={disabled} onChange={(event) => add([...event.target.files ?? []])}/><button type="button" className="atlas-upload-dropzone" disabled={disabled} onClick={() => input.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); if (!disabled) add([...event.dataTransfer.files]) }}><strong>{label}</strong><span>拖放文件到这里，或点击选择</span>{maxSize && <small>单个文件不超过 {Math.round(maxSize / 1024 / 1024)} MB</small>}</button>{files.length > 0 && <ul>{files.map((file) => <li key={file.id} className={`is-${file.status}`}><span><strong>{file.name}</strong><small>{file.error ?? `${Math.ceil(file.size / 1024)} KB`}</small></span><progress value={file.progress} max="100">{file.progress}%</progress>{file.status === 'failed' && onRetry && <AtlasButton size="compact" onClick={() => onRetry(file.id)}>重试</AtlasButton>}{onRemove && <button type="button" aria-label={`移除 ${file.name}`} onClick={() => onRemove(file.id)}>×</button>}</li>)}</ul>}</section>
}

export function AtlasSearchInput({ value, onChange, onSearch, placeholder = '搜索', label = '搜索' }: { value: string; onChange: (value: string) => void; onSearch: (value: string) => void; placeholder?: string; label?: string }) {
  return <form className="atlas-search" role="search" onSubmit={(event) => { event.preventDefault(); onSearch(value) }}><input aria-label={label} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /><button type="submit" aria-label="提交搜索">⌕</button></form>
}

export function AtlasSegmentedControl({ label, items, value, onChange }: { label: string; items: AtlasOption[]; value: string; onChange: (value: string) => void }) {
  return <div className="atlas-segmented" role="group" aria-label={label}>{items.map((item) => <button key={item.value} type="button" aria-pressed={item.value === value} disabled={item.disabled} onClick={() => onChange(item.value)}>{item.label}</button>)}</div>
}

export interface AtlasBreadcrumbItem { label: string; href?: string; onClick?: () => void }

export function AtlasBreadcrumb({ items, label = '面包屑' }: { items: AtlasBreadcrumbItem[]; label?: string }) {
  return <nav className="atlas-breadcrumb" aria-label={label}><ol>{items.map((item, index) => <li key={`${item.label}-${index}`}>{index < items.length - 1 ? (item.href ? <a href={item.href}>{item.label}</a> : <button type="button" onClick={item.onClick}>{item.label}</button>) : <span aria-current="page">{item.label}</span>}</li>)}</ol></nav>
}

export function AtlasPagination({ page, pageCount, onChange, label = '分页' }: { page: number; pageCount: number; onChange: (page: number) => void; label?: string }) {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1).filter((item) => pageCount <= 7 || item === 1 || item === pageCount || Math.abs(item - page) <= 1)
  return <nav className="atlas-pagination" aria-label={label}><button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="上一页">‹</button>{pages.map((item, index) => <span key={item}>{index > 0 && item - pages[index - 1] > 1 && <i>…</i>}<button type="button" aria-current={item === page ? 'page' : undefined} onClick={() => onChange(item)}>{item}</button></span>)}<button type="button" disabled={page >= pageCount} onClick={() => onChange(page + 1)} aria-label="下一页">›</button></nav>
}

export interface AtlasStep extends AtlasStepContract {}

export function AtlasSteps({ items, label = '流程步骤' }: { items: AtlasStep[]; label?: string }) {
  return <ol className="atlas-steps" aria-label={label}>{items.map((item, index) => <li key={item.id} className={`is-${item.status ?? 'pending'}`} aria-current={item.status === 'current' ? 'step' : undefined}><i>{item.status === 'completed' ? '✓' : index + 1}</i><div><strong>{item.title}</strong>{item.description && <span>{item.description}</span>}</div></li>)}</ol>
}

export interface AtlasTableColumn<Row extends object> extends AtlasCoreTableColumn<Row> { render?: (row: Row) => ReactNode }
export interface AtlasTableProps<Row extends { id: string | number }> { columns: AtlasTableColumn<Row>[]; rows: Row[]; caption: string; selectedIds?: Array<string | number>; onSelect?: (ids: Array<string | number>) => void; loading?: boolean; sortKey?: keyof Row | string; sortDirection?: AtlasSortDirection; onSort?: (key: keyof Row | string, direction: AtlasSortDirection) => void; labels?: Partial<AtlasTableLabels> }

const tableLabels: Record<AtlasLocale, AtlasTableLabels> = {
  'zh-CN': { selectAll: '选择全部', selectRow: '选择当前行', emptyTitle: '暂无数据', emptyDescription: '调整筛选条件后重试。', sortAscending: '升序排列', sortDescending: '降序排列' },
  'en-US': { selectAll: 'Select all', selectRow: 'Select row', emptyTitle: 'No data', emptyDescription: 'Adjust the filters and try again.', sortAscending: 'Sorted ascending', sortDescending: 'Sorted descending' }
}

export function AtlasTable<Row extends { id: string | number }>({ columns, rows, caption, selectedIds = [], onSelect, loading = false, sortKey, sortDirection, onSort, labels: labelOverrides }: AtlasTableProps<Row>) {
  const { locale } = useContext(AtlasConfigContext)
  const labels = { ...tableLabels[locale], ...labelOverrides }
  const allSelected = rows.length > 0 && rows.every((row) => selectedIds.includes(row.id))
  const toggle = (id: string | number) => onSelect?.(selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id])
  const nextSort = (column: AtlasTableColumn<Row>) => onSort?.(column.key, sortKey === column.key && sortDirection === 'ascending' ? 'descending' : 'ascending')
  return <div className={cx('atlas-table-wrap', loading && 'is-loading')} aria-busy={loading || undefined}><table className="atlas-table"><caption>{caption}</caption><thead><tr>{onSelect && <th className="selection"><AtlasCheckbox checked={allSelected} indeterminate={!allSelected && selectedIds.length > 0} label={labels.selectAll} hideLabel onChange={(checked) => onSelect(checked ? rows.map((row) => row.id) : [])} /></th>}{columns.map((column) => { const activeSort = sortKey === column.key ? sortDirection : undefined; return <th key={String(column.key)} style={{ textAlign: column.align, width: column.width }} aria-sort={column.sortable ? activeSort ?? 'none' : undefined}>{column.sortable ? <button type="button" className="atlas-table-sort" onClick={() => nextSort(column)}>{column.title}<span aria-hidden="true">{activeSort === 'ascending' ? '↑' : activeSort === 'descending' ? '↓' : '↕'}</span><span className="sr-only">{activeSort === 'ascending' ? labels.sortAscending : activeSort === 'descending' ? labels.sortDescending : ''}</span></button> : column.title}</th> })}</tr></thead><tbody>{rows.map((row) => <tr key={row.id} className={selectedIds.includes(row.id) ? 'is-selected' : undefined} aria-selected={selectedIds.includes(row.id) || undefined}>{onSelect && <td className="selection"><AtlasCheckbox checked={selectedIds.includes(row.id)} label={labels.selectRow} hideLabel onChange={() => toggle(row.id)} /></td>}{columns.map((column) => <td key={String(column.key)} style={{ textAlign: column.align, width: column.width }}>{column.render ? column.render(row) : String(row[column.key as keyof Row] ?? '')}</td>)}</tr>)}</tbody></table>{rows.length === 0 && !loading && <AtlasEmpty title={labels.emptyTitle} description={labels.emptyDescription} />}{loading && <div className="atlas-table-loading"><AtlasSkeleton lines={3}/></div>}</div>
}

export function AtlasTag({ children, intent = 'neutral', removable, onRemove }: { children: ReactNode; intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger'; removable?: boolean; onRemove?: () => void }) {
  return <span className={`atlas-tag is-${intent}`}>{children}{removable && <button type="button" aria-label="移除" onClick={onRemove}>×</button>}</span>
}

export interface AtlasObjectCellProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode
  meta?: ReactNode
  description?: ReactNode
  icon?: ReactNode
  tone?: AtlasSemanticTone
  interactive?: boolean
}

export function AtlasObjectCell({ title, meta, description, icon, tone = 'neutral', interactive = false, className, ...props }: AtlasObjectCellProps) {
  return <div className={cx('atlas-object-cell', `is-${tone}`, interactive && 'is-interactive', className)} {...props}>
    {icon && <span className="atlas-object-cell-icon" aria-hidden="true">{icon}</span>}
    <span className="atlas-object-cell-copy"><strong>{title}</strong>{meta && <small>{meta}</small>}{description && <span>{description}</span>}</span>
  </div>
}

export interface AtlasStatusTagProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: AtlasSemanticTone
  children: ReactNode
}

export function AtlasStatusTag({ tone = 'neutral', children, className, ...props }: AtlasStatusTagProps) {
  return <span className={cx('atlas-status-tag', `is-${tone}`, className)} {...props}>{children}</span>
}

export interface AtlasRowAction extends AtlasRowActionContract { icon?: ReactNode }

export function AtlasRowActions({ items, onAction, maxVisible = 3, label = '行操作' }: { items: AtlasRowAction[]; onAction: (id: string) => void; maxVisible?: number; label?: string }) {
  const visible = items.slice(0, Math.max(0, maxVisible))
  const overflow = items.slice(Math.max(0, maxVisible))
  return <div className="atlas-row-actions" role="group" aria-label={label}>
    {visible.map((item) => <button key={item.id} type="button" className={item.danger ? 'is-danger' : undefined} disabled={item.disabled} aria-label={item.label} title={item.label} onClick={() => onAction(item.id)}>{item.icon ?? item.label}</button>)}
    {overflow.length > 0 && (
      <AtlasDropdown
        label={<span className="atlas-row-actions-more" aria-label="更多操作">•••</span>}
        items={overflow}
        onSelect={onAction}
      />
    )}
  </div>
}

export interface AtlasTableToolbarProps extends HTMLAttributes<HTMLDivElement> {
  search?: ReactNode
  filters?: ReactNode
  selection?: ReactNode
  actions?: ReactNode
}

export function AtlasTableToolbar({ search, filters, selection, actions, className, ...props }: AtlasTableToolbarProps) {
  return <div className={cx('atlas-table-toolbar', className)} {...props}><div className="atlas-table-toolbar-primary">{search}{filters}</div><div className="atlas-table-toolbar-secondary">{selection}{actions}</div></div>
}

export interface AtlasDataTableProps<Row extends { id: string | number }> extends AtlasTableProps<Row>, Omit<HTMLAttributes<HTMLElement>, 'title' | 'onSelect'> {
  title?: ReactNode
  description?: ReactNode
  toolbar?: ReactNode
  footer?: ReactNode
}

export function AtlasDataTable<Row extends { id: string | number }>({ title, description, toolbar, footer, className, ...tableProps }: AtlasDataTableProps<Row>) {
  return <section className={cx('atlas-data-table', className)}>{(title || description) && <header><div>{description && <span>{description}</span>}{title && <h3>{title}</h3>}</div></header>}{toolbar}<AtlasTable {...tableProps}/>{footer && <footer>{footer}</footer>}</section>
}

export interface AtlasDataGridColumn<Row extends object> extends AtlasTableColumn<Row>, Omit<AtlasCoreDataGridColumn<Row>, 'render'> {}
export interface AtlasDataGridProps<Row extends { id: string | number }> extends Omit<AtlasTableProps<Row>, 'columns' | 'rows'> {
  columns: AtlasDataGridColumn<Row>[]
  rows: Row[]
  query?: string
  page?: number
  pageSize?: number
  totalRows?: number
  virtualize?: boolean
  viewportHeight?: number
  onPageChange?: (page: number) => void
  onQueryChange?: (query: string) => void
}

export function AtlasDataGrid<Row extends { id: string | number }>({ columns, rows, query = '', page = 1, pageSize = 50, totalRows, virtualize = false, viewportHeight = 420, onPageChange, onQueryChange, ...tableProps }: AtlasDataGridProps<Row>) {
  const { density } = useContext(AtlasConfigContext)
  const rowHeight = density === 'compact' ? 36 : density === 'comfortable' ? 50 : 42
  const [scrollTop, setScrollTop] = useState(0)
  const windowSize = virtualize ? Math.ceil(viewportHeight / rowHeight) + 4 : pageSize
  const offset = virtualize ? Math.max(0, Math.floor(scrollTop / rowHeight) - 2) : (Math.max(1, page) - 1) * pageSize
  const model = createAtlasDataGridModel({ rows, columns, query, sortKey: tableProps.sortKey, sortDirection: tableProps.sortDirection, offset, limit: windowSize })
  const pageCount = Math.max(1, Math.ceil((totalRows ?? model.totalRows) / pageSize))
  const body = <AtlasTable {...tableProps} columns={model.visibleColumns} rows={model.visibleRows} />
  return <section className="atlas-data-grid" data-atlas-critical>
    <div className="atlas-data-grid-controls"><AtlasSearchInput value={query} onChange={(value) => onQueryChange?.(value)} onSearch={(value) => onQueryChange?.(value)} placeholder="筛选数据"/><span role="status">{totalRows ?? model.totalRows} 项</span></div>
    {virtualize ? <div className="atlas-data-grid-viewport" style={{ height: viewportHeight }} onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}><div style={{ paddingTop: offset * rowHeight, paddingBottom: Math.max(0, (model.totalRows - offset - model.visibleRows.length) * rowHeight) }}>{body}</div></div> : body}
    {!virtualize && pageCount > 1 && <footer><AtlasPagination page={page} pageCount={pageCount} onChange={(next) => onPageChange?.(next)}/></footer>}
  </section>
}

export function AtlasTree({ nodes, expandedIds, selectedId, onExpandedChange, onSelect, label = '树形导航' }: { nodes: AtlasTreeNodeContract[]; expandedIds: string[]; selectedId?: string; onExpandedChange: (ids: string[]) => void; onSelect: (id: string) => void; label?: string }) {
  const flat = useMemo(() => flattenAtlasTree(nodes, expandedIds), [nodes, expandedIds])
  const refs = useRef(new Map<string, HTMLButtonElement>())
  const activate = (index: number) => refs.current.get(flat[index]?.id)?.focus()
  const keydown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    const node = flat[index]
    if (event.key === 'ArrowDown') { event.preventDefault(); activate(Math.min(flat.length - 1, index + 1)) }
    if (event.key === 'ArrowUp') { event.preventDefault(); activate(Math.max(0, index - 1)) }
    if (event.key === 'ArrowRight' && node.hasChildren) { event.preventDefault(); if (!expandedIds.includes(node.id)) onExpandedChange([...expandedIds, node.id]); else activate(index + 1) }
    if (event.key === 'ArrowLeft') { event.preventDefault(); if (expandedIds.includes(node.id)) onExpandedChange(expandedIds.filter((id) => id !== node.id)); else if (node.parentId) refs.current.get(node.parentId)?.focus() }
    if (event.key === 'Home') { event.preventDefault(); activate(0) }
    if (event.key === 'End') { event.preventDefault(); activate(flat.length - 1) }
  }
  return <div className="atlas-tree" role="tree" aria-label={label}>{flat.map((node, index) => {
    const expanded = expandedIds.includes(node.id)
    return <div role="treeitem" aria-level={node.depth + 1} aria-expanded={node.hasChildren ? expanded : undefined} aria-selected={node.id === selectedId} aria-disabled={node.disabled || undefined} key={node.id} style={{ '--atlas-tree-depth': node.depth } as CSSProperties}>
      {node.hasChildren ? <button type="button" className="atlas-tree-expander" aria-label={expanded ? `收起 ${node.label}` : `展开 ${node.label}`} disabled={node.disabled} onClick={() => onExpandedChange(expanded ? expandedIds.filter((id) => id !== node.id) : [...expandedIds, node.id])}>{expanded ? '⌄' : '›'}</button> : <span className="atlas-tree-expander is-placeholder" aria-hidden="true">›</span>}
      <button ref={(element) => { if (element) refs.current.set(node.id, element); else refs.current.delete(node.id) }} className="atlas-tree-selector" type="button" tabIndex={node.id === selectedId || (!selectedId && index === 0) ? 0 : -1} disabled={node.disabled} onKeyDown={(event) => keydown(event, index)} onClick={() => onSelect(node.id)}><strong>{node.label}</strong></button>
    </div>
  })}</div>
}

export interface AtlasPageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode
  description?: ReactNode
  eyebrow?: ReactNode
  breadcrumbs?: AtlasBreadcrumbItem[]
  actions?: ReactNode
  meta?: ReactNode
}

export function AtlasPageHeader({ title, description, eyebrow, breadcrumbs, actions, meta, className, ...props }: AtlasPageHeaderProps) {
  return <header className={cx('atlas-page-header', className)} {...props}><div className="atlas-page-header-copy">{breadcrumbs && <AtlasBreadcrumb items={breadcrumbs}/>} {eyebrow && <span className="atlas-page-header-eyebrow">{eyebrow}</span>}<h1>{title}</h1>{description && <p>{description}</p>}{meta && <div className="atlas-page-header-meta">{meta}</div>}</div>{actions && <div className="atlas-page-header-actions">{actions}</div>}</header>
}

export interface AtlasPanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
  footer?: ReactNode
  children?: ReactNode
}

export function AtlasPanel({ title, description, actions, footer, children, className, ...props }: AtlasPanelProps) {
  return <section className={cx('atlas-panel', className)} {...props}>{(title || description || actions) && <header><div>{title && <h2>{title}</h2>}{description && <p>{description}</p>}</div>{actions}</header>}<div className="atlas-panel-body">{children}</div>{footer && <footer>{footer}</footer>}</section>
}

export function AtlasAppLayout({ brand, navigation, topbar, children, aside, collapsed = false, mobileNavigationOpen = false, onNavigationToggle }: { brand: ReactNode; navigation: ReactNode; topbar?: ReactNode; children: ReactNode; aside?: ReactNode; collapsed?: boolean; mobileNavigationOpen?: boolean; onNavigationToggle?: (open: boolean) => void }) {
  return <div className={cx('atlas-app-layout', collapsed && 'is-collapsed', mobileNavigationOpen && 'is-mobile-open')}><header className="atlas-app-layout-header"><button type="button" className="atlas-app-layout-toggle" aria-label={mobileNavigationOpen ? '关闭导航' : '打开导航'} aria-expanded={mobileNavigationOpen} onClick={() => onNavigationToggle?.(!mobileNavigationOpen)}>☰</button>{brand}<div>{topbar}</div></header><aside className="atlas-app-layout-nav" aria-label="主导航">{navigation}</aside>{mobileNavigationOpen && <button type="button" className="atlas-app-layout-mask" aria-label="关闭导航" onClick={() => onNavigationToggle?.(false)}/>}<main className="atlas-app-layout-main">{children}</main>{aside && <aside className="atlas-app-layout-aside">{aside}</aside>}</div>
}

export function AtlasNotification({ notification, onDismiss }: { notification: AtlasNotificationContract; onDismiss?: (id: string) => void }) {
  useEffect(() => { if (!notification.duration || !onDismiss) return; const timer = window.setTimeout(() => onDismiss(notification.id), notification.duration); return () => window.clearTimeout(timer) }, [notification, onDismiss])
  return <article className={`atlas-notification is-${notification.intent ?? 'info'}`} role={notification.intent === 'danger' ? 'alert' : 'status'}><i aria-hidden="true">{notification.intent === 'success' ? '✓' : notification.intent === 'warning' || notification.intent === 'danger' ? '!' : 'i'}</i><div><strong>{notification.title}</strong>{notification.description && <p>{notification.description}</p>}</div>{onDismiss && <button type="button" aria-label={`关闭 ${notification.title}`} onClick={() => onDismiss(notification.id)}>×</button>}</article>
}

export function AtlasNotificationCenter({ items, onDismiss, label = '通知' }: { items: AtlasNotificationContract[]; onDismiss?: (id: string) => void; label?: string }) {
  return <section className="atlas-notification-center" aria-label={label} aria-live="polite">{items.map((item) => <AtlasNotification key={item.id} notification={item} onDismiss={onDismiss}/>)}</section>
}

export function AtlasBadge({ children, count, dot = false, intent = 'danger' }: { children: ReactNode; count?: number; dot?: boolean; intent?: 'primary' | 'success' | 'warning' | 'danger' }) {
  return <span className="atlas-badge">{children}{(dot || count !== undefined) && <><sup className={`is-${intent}`} aria-hidden={dot || undefined}>{dot ? '' : (count && count > 99 ? '99+' : count)}</sup>{dot && <span className="sr-only">有新状态</span>}</>}</span>
}

export function AtlasAvatar({ name, src, size = 32 }: { name: string; src?: string; size?: number }) {
  const initials = name.trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
  return <span className="atlas-avatar" style={{ width: size, height: size }} aria-label={name}>{src ? <img src={src} alt="" /> : initials}</span>
}

export function AtlasStatistic({ label, value, suffix, trend, trendLabel }: { label: string; value: string | number; suffix?: string; trend?: 'up' | 'down' | 'flat'; trendLabel?: string }) {
  return <section className="atlas-statistic"><span>{label}</span><strong>{value}{suffix && <small>{suffix}</small>}</strong>{trendLabel && <em className={`is-${trend ?? 'flat'}`}>{trend === 'up' ? '↑' : trend === 'down' ? '↓' : '–'} {trendLabel}</em>}</section>
}

export function AtlasProgress({ value, label, intent = 'primary' }: { value: number; label: string; intent?: 'primary' | 'success' | 'warning' | 'danger' }) {
  const normalized = Math.max(0, Math.min(100, value))
  return <div className={`atlas-progress is-${intent}`}><div><span>{label}</span><b>{normalized}%</b></div><progress value={normalized} max="100">{normalized}%</progress></div>
}

export function AtlasAlert({ title, description, intent = 'info', closable, onClose }: { title: string; description?: string; intent?: 'info' | 'success' | 'warning' | 'danger'; closable?: boolean; onClose?: () => void }) {
  return <div className={`atlas-alert is-${intent}`} role={intent === 'danger' ? 'alert' : 'status'}><i aria-hidden="true">{intent === 'success' ? '✓' : intent === 'warning' || intent === 'danger' ? '!' : 'i'}</i><div><strong>{title}</strong>{description && <p>{description}</p>}</div>{closable && <button type="button" aria-label="关闭提示" onClick={onClose}>×</button>}</div>
}

export function AtlasTooltip({ content, children }: { content: string; children: ReactNode }) {
  const id = useId()
  return <span className="atlas-tooltip" aria-describedby={id}>{children}<span role="tooltip" id={id}>{content}</span></span>
}

export function AtlasEmpty({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <section className="atlas-empty"><i aria-hidden="true">□</i><strong>{title}</strong>{description && <p>{description}</p>}{action}</section>
}

export function AtlasSkeleton({ lines = 3, label = '内容加载中' }: { lines?: number; label?: string }) {
  return <div className="atlas-skeleton" role="status" aria-label={label}>{Array.from({ length: lines }, (_, index) => <span key={index} style={{ width: `${100 - index * 12}%` }} />)}</div>
}

export function AtlasDrawer({ open, title, children, onClose, width = 420, footer, closeOnBackdrop = true }: { open: boolean; title: string; children: ReactNode; onClose: () => void; width?: number; footer?: ReactNode; closeOnBackdrop?: boolean }) {
  const ref = useRef<HTMLElement>(null)
  useAtlasOverlay(open, ref, onClose)
  return <div className={cx('atlas-drawer-layer', open && 'is-open')} aria-hidden={!open}><button className="atlas-drawer-mask" type="button" onClick={() => closeOnBackdrop && onClose()} aria-label="关闭抽屉" tabIndex={open ? 0 : -1} /><aside ref={ref} className="atlas-drawer" role="dialog" aria-modal="true" aria-label={title} style={{ width }}><header><h2>{title}</h2><button type="button" onClick={onClose} aria-label="关闭">×</button></header><div className="atlas-drawer-body">{children}</div>{footer && <footer>{footer}</footer>}</aside></div>
}

export interface AtlasDropdownItem extends AtlasDropdownItemContract {}

export function AtlasDropdown({ label, items, onSelect }: { label: ReactNode; items: AtlasDropdownItem[]; onSelect: (id: string) => void }) {
  return <details className="atlas-dropdown"><summary>{label}<span aria-hidden="true">⌄</span></summary><div role="menu">{items.map((item) => <button key={item.id} type="button" role="menuitem" disabled={item.disabled} className={item.danger ? 'is-danger' : undefined} onClick={(event) => { onSelect(item.id); event.currentTarget.closest('details')?.removeAttribute('open') }}>{item.label}</button>)}</div></details>
}

export function AtlasMenu({ items, activeId, onSelect, label = '操作菜单', orientation = 'vertical' }: { items: AtlasDropdownItem[]; activeId?: string; onSelect: (id: string) => void; label?: string; orientation?: 'vertical' | 'horizontal' }) {
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  const disabled = useMemo(() => new Set(items.map((item, index) => item.disabled ? index : -1).filter((index) => index >= 0)), [items])
  const keydown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    const previous = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
    const next = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight'
    if (event.key !== previous && event.key !== next && event.key !== 'Home' && event.key !== 'End') return
    event.preventDefault()
    const target = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : moveAtlasActiveIndex(index, event.key === next ? 1 : -1, items.length, disabled)
    refs.current[target]?.focus()
  }
  return <div className={cx('atlas-menu', `is-${orientation}`)} role="menu" aria-label={label} aria-orientation={orientation}>{items.map((item, index) => <button ref={(element) => { refs.current[index] = element }} key={item.id} type="button" role="menuitem" tabIndex={item.id === activeId || (!activeId && index === 0) ? 0 : -1} aria-current={item.id === activeId ? 'page' : undefined} disabled={item.disabled} className={item.danger ? 'is-danger' : undefined} onKeyDown={(event) => keydown(event, index)} onClick={() => onSelect(item.id)}>{item.label}</button>)}</div>
}

export type AtlasAIMessageRole = 'user' | 'assistant' | 'system' | 'tool'

export interface AtlasAIConversationProps extends HTMLAttributes<HTMLElement> {
  title: string
  subtitle?: string
  status?: 'idle' | 'thinking' | 'running' | 'error'
  history?: ReactNode
  toolbar?: ReactNode
  composer?: ReactNode
  children: ReactNode
}

export function AtlasAIConversation({ title, subtitle, status = 'idle', history, toolbar, composer, children, className, ...props }: AtlasAIConversationProps) {
  return <section className={cx('atlas-ai-conversation', Boolean(history) && 'has-history', className)} {...props}>
    {history && <aside className="atlas-ai-conversation-history">{history}</aside>}
    <div className="atlas-ai-conversation-main">
      <header><span className="atlas-ai-identity"><AtlasOrb state={status} size={34}/><span><strong>{title}</strong>{subtitle && <small>{subtitle}</small>}</span></span>{toolbar}</header>
      <div className="atlas-ai-message-stream" role="log" aria-live="polite">{children}</div>
      {composer && <footer>{composer}</footer>}
    </div>
  </section>
}

export interface AtlasAICitationItem extends AtlasAICitationItemContract {}

export interface AtlasAIMessageBubbleProps extends Omit<HTMLAttributes<HTMLElement>, 'content'> {
  role: AtlasAIMessageRole
  content: ReactNode
  name?: string
  timestamp?: string
  streaming?: boolean
  citations?: AtlasAICitationItem[]
  actions?: ReactNode
}

export function AtlasAIMessageBubble({ role, content, name, timestamp, streaming, citations = [], actions, className, ...props }: AtlasAIMessageBubbleProps) {
  const displayName = name ?? (role === 'assistant' ? 'Atlas Reasoner' : role === 'user' ? '你' : role === 'tool' ? 'Tool' : 'System')
  return <article className={cx('atlas-ai-message', `is-${role}`, streaming && 'is-streaming', className)} {...props}>
    <div className="atlas-ai-message-avatar">{role === 'assistant' ? <AtlasOrb state={streaming ? 'thinking' : 'idle'} size={28} showRing={false}/> : role === 'user' ? '你' : role === 'tool' ? 'T' : 'S'}</div>
    <div className="atlas-ai-message-content"><header><strong>{displayName}</strong>{timestamp && <time>{timestamp}</time>}</header><div>{content}</div>{citations.length > 0 && <AtlasCitationList items={citations}/>} {actions && <footer>{actions}</footer>}</div>
  </article>
}

export function AtlasAIStreamingText({ text, status = 'streaming', label = 'AI 正在生成' }: { text: string; status?: 'streaming' | 'complete' | 'stopped' | 'error'; label?: string }) {
  return <span className={`atlas-ai-streaming is-${status}`} role="status" aria-label={status === 'streaming' ? label : undefined}>{text}{status === 'streaming' && <i aria-hidden="true"/>}</span>
}

export interface AtlasAIPromptItem extends AtlasAIPromptItemContract {}

export function AtlasAIPrompts({ items, onSelect, label = '推荐问题' }: { items: AtlasAIPromptItem[]; onSelect: (item: AtlasAIPromptItem) => void; label?: string }) {
  return <section className="atlas-ai-prompts" aria-label={label}>{items.map((item) => <button type="button" key={item.id} onClick={() => onSelect(item)}><span>{item.category && <small>{item.category}</small>}<strong>{item.label}</strong>{item.description && <em>{item.description}</em>}</span><i aria-hidden="true">›</i></button>)}</section>
}

export interface AtlasAIAttachmentItem extends AtlasAIAttachmentItemContract {}

export function AtlasAIAttachmentList({ items, onRemove, onRetry, label = '附件' }: { items: AtlasAIAttachmentItem[]; onRemove?: (id: string) => void; onRetry?: (id: string) => void; label?: string }) {
  const size = (bytes?: number) => bytes === undefined ? '' : bytes < 1024 * 1024 ? `${Math.ceil(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return <ul className="atlas-ai-attachments" aria-label={label}>{items.map((item) => <li key={item.id} className={`is-${item.status ?? 'ready'}`}><i aria-hidden="true">{item.mediaType.includes('image') ? 'IMG' : item.mediaType.includes('pdf') ? 'PDF' : 'FILE'}</i><span><strong>{item.name}</strong><small>{item.status === 'uploading' ? '上传中' : item.status === 'failed' ? '上传失败' : size(item.size)}</small></span>{item.status === 'failed' && onRetry && <button type="button" onClick={() => onRetry(item.id)}>重试</button>}{onRemove && <button type="button" aria-label={`移除 ${item.name}`} onClick={() => onRemove(item.id)}>×</button>}</li>)}</ul>
}

export interface AtlasAIConversationHistoryItem extends AtlasAIHistoryItemContract {}

export function AtlasAIConversationHistory({ items, activeId, onSelect, onCreate, label = '会话历史' }: { items: AtlasAIConversationHistoryItem[]; activeId?: string; onSelect: (id: string) => void; onCreate?: () => void; label?: string }) {
  return <nav className="atlas-ai-history" aria-label={label}>{onCreate && <AtlasButton intent="primary" size="compact" onClick={onCreate}>新建会话</AtlasButton>}<div>{items.map((item) => <button type="button" key={item.id} className={item.id === activeId ? 'is-active' : undefined} aria-current={item.id === activeId ? 'page' : undefined} onClick={() => onSelect(item.id)}><span><strong>{item.pinned && <i role="img" aria-label="已置顶">·</i>}{item.title}</strong>{item.preview && <small>{item.preview}</small>}</span>{item.updatedAt && <time>{item.updatedAt}</time>}</button>)}</div></nav>
}

export type AtlasAIFeedbackValue = 'helpful' | 'unhelpful' | null

export function AtlasAIFeedback({ value = null, onChange, onReport, label = '评价此回答' }: { value?: AtlasAIFeedbackValue; onChange: (value: Exclude<AtlasAIFeedbackValue, null>) => void; onReport?: () => void; label?: string }) {
  return <div className="atlas-ai-feedback" role="group" aria-label={label}><button type="button" aria-pressed={value === 'helpful'} onClick={() => onChange('helpful')}>有帮助</button><button type="button" aria-pressed={value === 'unhelpful'} onClick={() => onChange('unhelpful')}>需改进</button>{onReport && <button type="button" onClick={onReport}>反馈问题</button>}</div>
}

export interface AtlasMCPServerItem extends AtlasMCPServerItemContract {}

export function AtlasMCPServerPicker({ servers, selectedIds, onChange, onAdd, label = 'MCP Servers' }: { servers: AtlasMCPServerItem[]; selectedIds: string[]; onChange: (ids: string[]) => void; onAdd?: () => void; label?: string }) {
  const toggle = (id: string) => onChange(selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id])
  return <section className="atlas-mcp-picker" aria-label={label}><header><div><strong>{label}</strong><small>{selectedIds.length} 个已授权</small></div>{onAdd && <AtlasButton size="compact" onClick={onAdd}>添加</AtlasButton>}</header><div>{servers.map((server) => <label key={server.id} className={`is-${server.status}`}><input type="checkbox" checked={selectedIds.includes(server.id)} disabled={server.status !== 'connected'} onChange={() => toggle(server.id)}/><span><strong>{server.name}</strong><small>{server.description ?? `${server.toolCount ?? 0} 个工具`}</small></span><em>{server.transport ?? 'stdio'}</em><i role="img" aria-label={`连接状态：${server.status === 'connected' ? '已连接' : server.status === 'error' ? '异常' : '未连接'}`}/></label>)}</div></section>
}

export function AtlasCitationList({ items, onOpen, label = '引用来源' }: { items: AtlasAICitationItem[]; onOpen?: (item: AtlasAICitationItem) => void; label?: string }) {
  return <ol className="atlas-citation-list" aria-label={label}>{items.map((item, index) => <li key={item.id}><button type="button" onClick={() => onOpen?.(item)} disabled={!onOpen && !item.url}><b>{index + 1}</b><span><strong>{item.title}</strong><small>{item.source}{item.confidence !== undefined && ` · 相关度 ${Math.round(item.confidence * 100)}%`}</small>{item.excerpt && <em>{item.excerpt}</em>}</span></button></li>)}</ol>
}

export interface AtlasKnowledgeSourceItem extends AtlasKnowledgeSourceItemContract {}

export function AtlasKnowledgeSourcePicker({ sources, selectedIds, onChange, label = '知识来源' }: { sources: AtlasKnowledgeSourceItem[]; selectedIds: string[]; onChange: (ids: string[]) => void; label?: string }) {
  const toggle = (id: string) => onChange(selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id])
  return <fieldset className="atlas-knowledge-sources"><legend>{label}<small>{selectedIds.length} / {sources.length}</small></legend>{sources.map((source) => <label key={source.id} className={`is-${source.status ?? 'ready'}`}><input type="checkbox" checked={selectedIds.includes(source.id)} disabled={source.status === 'error'} onChange={() => toggle(source.id)}/><i aria-hidden="true">{source.type.slice(0, 1).toUpperCase()}</i><span><strong>{source.name}</strong><small>{source.scope ?? source.type}{source.count !== undefined && ` · ${source.count} 项`}</small></span><em>{source.status === 'syncing' ? '同步中' : source.status === 'error' ? '异常' : '就绪'}</em></label>)}</fieldset>
}

export interface AtlasRetrievalStep extends AtlasRetrievalStepContract {}

export function AtlasRetrievalTrace({ steps, title = '检索轨迹' }: { steps: AtlasRetrievalStep[]; title?: string }) {
  return <section className="atlas-retrieval-trace"><header><strong>{title}</strong><small>{steps.filter((step) => step.status === 'completed').length} / {steps.length} 完成</small></header><ol>{steps.map((step, index) => <li key={step.id} className={`is-${step.status}`}><i>{step.status === 'completed' ? '✓' : index + 1}</i><span><strong>{step.title}</strong>{step.detail && <small>{step.detail}</small>}</span>{step.durationMs !== undefined && <time>{step.durationMs} ms</time>}</li>)}</ol></section>
}

export interface AtlasToolCallItem extends AtlasToolCallItemContract {}

export function AtlasToolCallCard({ call, onApprove, onReject, onRetry }: { call: AtlasToolCallItem; onApprove?: (id: string) => void; onReject?: (id: string) => void; onRetry?: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  return <article className={`atlas-tool-call is-${call.status}`}><header><i aria-hidden="true">{call.status === 'completed' ? '✓' : call.status === 'failed' ? '!' : call.permission === 'read' ? 'R' : 'T'}</i><span><strong>{call.name}</strong>{call.description && <small>{call.description}</small>}</span><AtlasTag intent={call.permission === 'high-risk' ? 'warning' : call.permission === 'write' ? 'primary' : 'neutral'}>{call.permission}</AtlasTag></header>{(call.input !== undefined || call.result !== undefined) && <><button type="button" className="atlas-tool-details-toggle" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? '收起详情' : '查看输入与结果'}</button>{expanded && <pre>{JSON.stringify({ input: call.input, result: call.result }, null, 2)}</pre>}</>}{call.status === 'approval' && <footer>{onReject && <AtlasButton size="compact" onClick={() => onReject(call.id)}>拒绝</AtlasButton>}{onApprove && <AtlasButton size="compact" intent="primary" onClick={() => onApprove(call.id)}>批准执行</AtlasButton>}</footer>}{call.status === 'failed' && onRetry && <footer><AtlasButton size="compact" onClick={() => onRetry(call.id)}>重试</AtlasButton></footer>}{call.durationMs !== undefined && <time>{call.durationMs} ms</time>}</article>
}

export function AtlasAIArtifactRenderer({ artifact, renderers = {}, actions }: { artifact: AtlasAIArtifactContract; renderers?: Partial<Record<AtlasAIArtifactContract['type'], (artifact: AtlasAIArtifactContract) => ReactNode>>; actions?: ReactNode }) {
  const custom = renderers[artifact.type]?.(artifact)
  const rows = (artifact.rows ?? []).map((row, index) => ({ ...row, id: String(row.id ?? `${artifact.id}-${index}`) }))
  const columns: AtlasTableColumn<(typeof rows)[number]>[] = (artifact.columns ?? Object.keys(rows[0] ?? {}).filter((key) => key !== 'id').map((key) => ({ key, title: key }))).map((column) => ({ key: column.key, title: column.title }))
  let content: ReactNode = custom
  if (!content && artifact.type === 'code') content = <pre><code data-language={artifact.language}>{artifact.content ?? ''}</code></pre>
  if (!content && artifact.type === 'json') content = <pre><code>{artifact.content ?? '{}'}</code></pre>
  if (!content && (artifact.type === 'text' || artifact.type === 'markdown')) content = <div className="atlas-ai-artifact-text">{(artifact.content ?? '').split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
  if (!content && artifact.type === 'table') content = <AtlasTable caption={artifact.title ?? 'AI 生成表格'} columns={columns} rows={rows}/>
  if (!content && artifact.type === 'chart') {
    const max = Math.max(1, ...(artifact.values ?? []).map((item) => item.value))
    content = <div className="atlas-ai-artifact-chart" role="img" aria-label={artifact.title ?? 'AI 生成图表'}>{artifact.values?.map((item) => <div key={item.label}><span>{item.label}</span><i style={{ '--atlas-artifact-value': `${Math.max(0, item.value) / max * 100}%` } as CSSProperties}/><b>{item.value}</b></div>)}</div>
  }
  if (!content && artifact.type === 'file' && artifact.file) content = <a className="atlas-ai-artifact-file" href={artifact.file.url} download={artifact.file.name}><strong>{artifact.file.name}</strong><span>{artifact.file.mediaType ?? '文件'}{artifact.file.size ? ` · ${Math.ceil(artifact.file.size / 1024)} KB` : ''}</span></a>
  return <article className={`atlas-ai-artifact is-${artifact.type}`}><header><div><small>AI Artifact · {artifact.type}</small>{artifact.title && <h3>{artifact.title}</h3>}{artifact.description && <p>{artifact.description}</p>}</div>{actions}</header><div className="atlas-ai-artifact-body">{content}</div></article>
}

export function AtlasAIStructuredInput({ fields, values, onChange, onSubmit, busy = false, submitLabel = '生成' }: { fields: AtlasAIStructuredFieldContract[]; values: Record<string, AtlasFieldValue>; onChange: (values: Record<string, AtlasFieldValue>) => void; onSubmit: (values: Record<string, AtlasFieldValue>) => void; busy?: boolean; submitLabel?: string }) {
  const update = (name: string, value: AtlasFieldValue) => onChange({ ...values, [name]: value })
  return <AtlasForm className="atlas-ai-structured-input" schema={Object.fromEntries(fields.map((field) => [field.name, field.rules ?? []]))} busy={busy} onSubmit={() => onSubmit(values)}>{fields.map((field) => {
    if (field.type === 'textarea') return <AtlasTextarea key={field.name} name={field.name} label={field.label} hint={field.description} placeholder={field.placeholder} value={String(values[field.name] ?? '')} onChange={(event) => update(field.name, event.target.value)}/>
    if (field.type === 'select') return <AtlasSelect key={field.name} name={field.name} label={field.label} hint={field.description} options={field.options ?? []} value={String(values[field.name] ?? '')} onChange={(event) => update(field.name, event.target.value)}/>
    if (field.type === 'boolean') return <AtlasCheckbox key={field.name} name={field.name} label={field.label} checked={Boolean(values[field.name])} onChange={(value) => update(field.name, value)}/>
    if (field.type === 'date') return <AtlasDateInput key={field.name} name={field.name} label={field.label} hint={field.description} value={String(values[field.name] ?? '')} onChange={(event) => update(field.name, event.target.value)}/>
    return <AtlasInput key={field.name} name={field.name} type={field.type === 'number' ? 'number' : 'text'} label={field.label} hint={field.description} placeholder={field.placeholder} value={String(values[field.name] ?? '')} onChange={(event) => update(field.name, field.type === 'number' ? Number(event.target.value) : event.target.value)}/>
  })}<footer><AtlasButton type="submit" intent="primary" loading={busy}>{submitLabel}</AtlasButton></footer></AtlasForm>
}

export function AtlasAIProvenance({ provenance, defaultOpen = false }: { provenance: AtlasAIProvenanceContract; defaultOpen?: boolean }) {
  return <details className="atlas-ai-provenance" open={defaultOpen}><summary><span><strong>AI 生成依据</strong><small>{provenance.provider ? `${provenance.provider} / ` : ''}{provenance.model}</small></span>{provenance.confidence !== undefined && <AtlasStatusTag tone={provenance.confidence >= .8 ? 'success' : provenance.confidence >= .6 ? 'warning' : 'danger'}>{Math.round(provenance.confidence * 100)}% 置信度</AtlasStatusTag>}</summary><dl><div><dt>生成时间</dt><dd>{provenance.generatedAt}</dd></div><div><dt>Trace ID</dt><dd><code>{provenance.traceId}</code></dd></div><div><dt>引用来源</dt><dd>{provenance.sourceIds?.join('、') || '无外部来源'}</dd></div><div><dt>策略</dt><dd>{provenance.policyIds?.join('、') || '默认策略'}</dd></div>{provenance.cost && <div><dt>成本</dt><dd>{provenance.cost.inputTokens ?? 0} + {provenance.cost.outputTokens ?? 0} tokens{provenance.cost.amount !== undefined && ` · ${provenance.cost.currency ?? 'USD'} ${provenance.cost.amount.toFixed(4)}`}</dd></div>}{provenance.reviewedBy && <div><dt>人工复核</dt><dd>{provenance.reviewedBy}</dd></div>}</dl></details>
}

export function AtlasGenUIRenderer({ schema, onAction }: { schema: AtlasGenUINodeContract; onAction?: (actionId: string, node: AtlasGenUINodeContract) => void }) {
  const validation = validateAtlasGenUISchema(schema)
  if (!validation.valid) return <AtlasAlert intent="danger" title="生成式 UI 未通过安全校验" description={validation.issues.join('；')}/>
  const render = (node: AtlasGenUINodeContract): ReactNode => {
    const children = node.children?.map((child) => <Fragment key={child.id}>{render(child)}</Fragment>)
    if (node.type === 'stack') return <section className="atlas-genui-stack" data-genui-id={node.id}>{children}</section>
    if (node.type === 'panel') return <AtlasPanel title={node.title}>{node.text && <p>{node.text}</p>}{children}</AtlasPanel>
    if (node.type === 'text') return <p className="atlas-genui-text">{node.text}</p>
    if (node.type === 'metric') return <AtlasStatistic label={node.title ?? ''} value={node.value ?? '-'} suffix={node.suffix}/>
    if (node.type === 'action') return <AtlasButton intent="primary" onClick={() => node.actionId && onAction?.(node.actionId, node)}>{node.actionLabel}</AtlasButton>
    if ((node.type === 'table' || node.type === 'artifact') && node.artifact) return <AtlasAIArtifactRenderer artifact={node.artifact}/>
    return null
  }
  return <section className="atlas-genui" aria-label="AI 生成界面" data-node-count={validation.nodeCount}>{render(schema)}</section>
}

export function AtlasMCPToolPanel({ tools, selectedIds, onChange, onApprove, label = 'MCP 工具' }: { tools: AtlasMCPToolContract[]; selectedIds: string[]; onChange: (ids: string[]) => void; onApprove?: (id: string) => void; label?: string }) {
  const [query, setQuery] = useState('')
  const [permission, setPermission] = useState<AtlasMCPToolContract['permission'] | ''>('')
  const visible = filterAtlasMCPTools(tools, query, permission || undefined)
  const toggle = (id: string) => onChange(selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id])
  return <section className="atlas-mcp-tool-panel" aria-label={label}><header><div><strong>{label}</strong><small>{selectedIds.length} 个已授权</small></div><AtlasStatusTag tone="primary">{tools.length} tools</AtlasStatusTag></header><div className="atlas-mcp-tool-filters"><AtlasSearchInput value={query} onChange={setQuery} onSearch={setQuery} placeholder="搜索工具"/><AtlasSelect aria-label="权限筛选" value={permission} options={[{ label: '全部权限', value: '' }, { label: '只读', value: 'read' }, { label: '写入', value: 'write' }, { label: '高风险', value: 'high-risk' }]} onChange={(event) => setPermission(event.target.value as AtlasMCPToolContract['permission'] | '')}/></div><ul>{visible.map((tool) => <li key={tool.id} className={`is-${tool.status ?? 'available'}`}><AtlasCheckbox label={tool.name} checked={selectedIds.includes(tool.id)} disabled={tool.status === 'disabled' || tool.status === 'error'} onChange={() => toggle(tool.id)}/><span><small>{tool.serverId}</small>{tool.description && <p>{tool.description}</p>}</span><AtlasStatusTag tone={tool.permission === 'high-risk' ? 'warning' : tool.permission === 'write' ? 'primary' : 'neutral'}>{tool.permission}</AtlasStatusTag>{tool.status === 'approval' && onApprove && <AtlasButton size="compact" intent="primary" onClick={() => onApprove(tool.id)}>审批</AtlasButton>}</li>)}</ul>{visible.length === 0 && <AtlasEmpty title="没有匹配的工具" description="调整搜索词或权限范围。"/>}</section>
}

export function AtlasCrossPageAgent({ goal, currentRoute, routes, steps, status = 'running', onNavigate, onApprove, onStop }: { goal: string; currentRoute: string; routes: Array<{ path: string; label: string }>; steps: AtlasCrossPageStepContract[]; status?: 'idle' | 'thinking' | 'running' | 'error'; onNavigate: (path: string) => void; onApprove?: (id: string) => void; onStop?: () => void }) {
  return <section className="atlas-cross-page-agent"><header><span><AtlasOrb state={status} size={42}/><span><small>跨页面 Agent</small><strong>{goal}</strong></span></span>{onStop && <AtlasButton size="compact" onClick={onStop}>停止</AtlasButton>}</header><nav aria-label="Agent 页面路径">{routes.map((route) => <button type="button" key={route.path} aria-current={route.path === currentRoute ? 'page' : undefined} onClick={() => onNavigate(route.path)}><span>{route.label}</span><code>{route.path}</code></button>)}</nav><AtlasExecutionPlan title="跨页面执行计划" steps={steps} onApprove={onApprove} onStop={onStop}/></section>
}
