import { useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'

const cx = (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(' ')

export interface AtlasProviderProps {
  theme?: 'light' | 'dark'
  density?: 'compact' | 'standard' | 'comfortable'
  locale?: 'zh-CN' | 'en-US'
  children: ReactNode
}

export function AtlasProvider({ theme = 'light', density = 'standard', locale = 'zh-CN', children }: AtlasProviderProps) {
  return <div className="atlas-root" data-atlas-theme={theme} data-atlas-density={density} data-atlas-locale={locale} lang={locale}>{children}</div>
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
  return <span className={cx('atlas-living-orb', `state-${state}`, className)} style={{ width: size, height: size, ...style }} role="img" aria-label={`${label}，${state}`} {...props}>
    <span className="atlas-living-orb-atmosphere" />
    {showRing && <><span className="atlas-living-orb-ring primary" /><span className="atlas-living-orb-ring secondary" /></>}
    <span className="atlas-living-orb-core"><span className="depth" /><span className="liquid" /><span className="specular" /></span>
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

export function AtlasDialog({ open, title, children, onClose, footer }: { open: boolean; title: string; children: ReactNode; onClose: () => void; footer?: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])
  return <dialog ref={ref} className="atlas-dialog" aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); onClose() }} onClose={onClose}>
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

export interface AtlasExecutionStep {
  id: string
  title: string
  description?: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'approval'
}

export function AtlasExecutionPlan({ title = '执行计划', steps, onStop, onApprove }: { title?: string; steps: AtlasExecutionStep[]; onStop?: () => void; onApprove?: (id: string) => void }) {
  return <section className="atlas-execution-plan"><header><div><span>Agent Execution</span><h3>{title}</h3></div>{onStop && <AtlasButton onClick={onStop}>停止</AtlasButton>}</header><ol>{steps.map((step, index) => <li key={step.id} className={`is-${step.status}`}><i>{step.status === 'completed' ? '✓' : index + 1}</i><div><strong>{step.title}</strong>{step.description && <span>{step.description}</span>}</div>{step.status === 'approval' && onApprove && <AtlasButton intent="primary" size="compact" onClick={() => onApprove(step.id)}>批准</AtlasButton>}</li>)}</ol></section>
}

export interface AtlasOption { label: string; value: string; disabled?: boolean }

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

export interface AtlasTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> { label?: string; hint?: string; error?: string }

export function AtlasTextarea({ label, hint, error, className, id, ...props }: AtlasTextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId
  return <label className={cx('atlas-field', error && 'has-error', className)} htmlFor={textareaId}>{label && <span className="atlas-field-label">{label}</span>}<textarea id={textareaId} className="atlas-textarea" aria-invalid={Boolean(error) || undefined} {...props} />{(hint || error) && <small>{error ?? hint}</small>}</label>
}

export function AtlasCheckbox({ checked, indeterminate, label, onChange, disabled }: { checked: boolean; indeterminate?: boolean; label: ReactNode; onChange: (checked: boolean) => void; disabled?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { if (inputRef.current) inputRef.current.indeterminate = Boolean(indeterminate) }, [indeterminate])
  return <label className="atlas-check"><input ref={inputRef} type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} /><span aria-hidden="true" /><b>{label}</b></label>
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

export interface AtlasStep { id: string; title: string; description?: string; status?: 'pending' | 'current' | 'completed' | 'error' }

export function AtlasSteps({ items, label = '流程步骤' }: { items: AtlasStep[]; label?: string }) {
  return <ol className="atlas-steps" aria-label={label}>{items.map((item, index) => <li key={item.id} className={`is-${item.status ?? 'pending'}`} aria-current={item.status === 'current' ? 'step' : undefined}><i>{item.status === 'completed' ? '✓' : index + 1}</i><div><strong>{item.title}</strong>{item.description && <span>{item.description}</span>}</div></li>)}</ol>
}

export interface AtlasTableColumn<Row> { key: keyof Row | string; title: string; align?: 'start' | 'center' | 'end'; render?: (row: Row) => ReactNode }

export function AtlasTable<Row extends { id: string | number }>({ columns, rows, caption, selectedIds = [], onSelect }: { columns: AtlasTableColumn<Row>[]; rows: Row[]; caption: string; selectedIds?: Array<string | number>; onSelect?: (ids: Array<string | number>) => void }) {
  const allSelected = rows.length > 0 && rows.every((row) => selectedIds.includes(row.id))
  const toggle = (id: string | number) => onSelect?.(selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id])
  return <div className="atlas-table-wrap"><table className="atlas-table"><caption>{caption}</caption><thead><tr>{onSelect && <th className="selection"><AtlasCheckbox checked={allSelected} indeterminate={!allSelected && selectedIds.length > 0} label={<span className="sr-only">选择全部</span>} onChange={(checked) => onSelect(checked ? rows.map((row) => row.id) : [])} /></th>}{columns.map((column) => <th key={String(column.key)} style={{ textAlign: column.align }}>{column.title}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.id} className={selectedIds.includes(row.id) ? 'is-selected' : undefined}>{onSelect && <td className="selection"><AtlasCheckbox checked={selectedIds.includes(row.id)} label={<span className="sr-only">选择当前行</span>} onChange={() => toggle(row.id)} /></td>}{columns.map((column) => <td key={String(column.key)} style={{ textAlign: column.align }}>{column.render ? column.render(row) : String(row[column.key as keyof Row] ?? '')}</td>)}</tr>)}</tbody></table>{rows.length === 0 && <AtlasEmpty title="暂无数据" description="调整筛选条件后重试。" />}</div>
}

export function AtlasTag({ children, intent = 'neutral', removable, onRemove }: { children: ReactNode; intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger'; removable?: boolean; onRemove?: () => void }) {
  return <span className={`atlas-tag is-${intent}`}>{children}{removable && <button type="button" aria-label="移除" onClick={onRemove}>×</button>}</span>
}

export function AtlasBadge({ children, count, dot = false, intent = 'danger' }: { children: ReactNode; count?: number; dot?: boolean; intent?: 'primary' | 'success' | 'warning' | 'danger' }) {
  return <span className="atlas-badge">{children}<sup className={`is-${intent}`} aria-label={dot ? '有新状态' : `${count ?? 0} 条`}>{dot ? '' : (count && count > 99 ? '99+' : count)}</sup></span>
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

export function AtlasDrawer({ open, title, children, onClose, width = 420, footer }: { open: boolean; title: string; children: ReactNode; onClose: () => void; width?: number; footer?: ReactNode }) {
  return <div className={cx('atlas-drawer-layer', open && 'is-open')} aria-hidden={!open}><button className="atlas-drawer-mask" type="button" onClick={onClose} aria-label="关闭抽屉" tabIndex={open ? 0 : -1} /><aside className="atlas-drawer" role="dialog" aria-modal="true" aria-label={title} style={{ width }}><header><h2>{title}</h2><button type="button" onClick={onClose} aria-label="关闭">×</button></header><div className="atlas-drawer-body">{children}</div>{footer && <footer>{footer}</footer>}</aside></div>
}

export interface AtlasDropdownItem { id: string; label: string; disabled?: boolean; danger?: boolean }

export function AtlasDropdown({ label, items, onSelect }: { label: ReactNode; items: AtlasDropdownItem[]; onSelect: (id: string) => void }) {
  return <details className="atlas-dropdown"><summary>{label}<span aria-hidden="true">⌄</span></summary><div role="menu">{items.map((item) => <button key={item.id} type="button" role="menuitem" disabled={item.disabled} className={item.danger ? 'is-danger' : undefined} onClick={(event) => { onSelect(item.id); event.currentTarget.closest('details')?.removeAttribute('open') }}>{item.label}</button>)}</div></details>
}
