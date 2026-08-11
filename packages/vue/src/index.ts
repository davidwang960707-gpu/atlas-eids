import { defineComponent, h, ref, watch, type PropType } from 'vue'

export const AtlasProvider = defineComponent({
  name: 'AtlasProvider',
  props: { theme: { type: String, default: 'light' }, density: { type: String, default: 'standard' }, locale: { type: String, default: 'zh-CN' } },
  setup(props, { slots }) {
    return () => h('div', { class: 'atlas-root', 'data-atlas-theme': props.theme, 'data-atlas-density': props.density, 'data-atlas-locale': props.locale, lang: props.locale }, slots.default?.())
  }
})

export const AtlasButton = defineComponent({
  name: 'AtlasButton',
  emits: ['click'],
  props: { intent: { type: String, default: 'neutral' }, size: { type: String, default: 'default' }, loading: Boolean, disabled: Boolean, type: { type: String, default: 'button' } },
  setup(props, { slots, emit, attrs }) {
    return () => h('button', { ...attrs, type: props.type, class: ['atlas-button', `is-${props.intent}`, `is-${props.size}`], disabled: props.disabled || props.loading, 'aria-busy': props.loading || undefined, onClick: (event: MouseEvent) => emit('click', event) }, [props.loading ? h('span', { class: 'atlas-spinner', 'aria-hidden': 'true' }) : null, h('span', slots.default?.())])
  }
})

export const AtlasInput = defineComponent({
  name: 'AtlasInput',
  inheritAttrs: false,
  emits: ['update:modelValue'],
  props: { modelValue: { type: String, default: '' }, label: String, hint: String, error: String },
  setup(props, { emit, attrs }) {
    return () => h('label', { class: ['atlas-field', props.error && 'has-error'] }, [props.label ? h('span', { class: 'atlas-field-label' }, props.label) : null, h('input', { ...attrs, class: 'atlas-input', value: props.modelValue, 'aria-invalid': Boolean(props.error) || undefined, onInput: (event: Event) => emit('update:modelValue', (event.target as HTMLInputElement).value) }), props.hint || props.error ? h('small', props.error ?? props.hint) : null])
  }
})

export const AtlasCard = defineComponent({
  name: 'AtlasCard',
  props: { title: String, description: String, selected: Boolean },
  setup(props, { slots, attrs }) {
    return () => h('article', { ...attrs, class: ['atlas-card', props.selected && 'is-selected'] }, [(props.title || props.description || slots.actions) ? h('header', [h('div', [props.title ? h('h3', props.title) : null, props.description ? h('p', props.description) : null]), slots.actions?.()]) : null, slots.default ? h('div', { class: 'atlas-card-body' }, slots.default()) : null])
  }
})

export const AtlasOrb = defineComponent({
  name: 'AtlasOrb',
  props: { state: { type: String, default: 'idle' }, size: { type: Number, default: 48 }, label: { type: String, default: 'Atlas AI' }, showRing: { type: Boolean, default: true } },
  setup(props, { attrs }) {
    return () => h('span', { ...attrs, class: ['atlas-living-orb', `state-${props.state}`], style: { width: `${props.size}px`, height: `${props.size}px` }, role: 'img', 'aria-label': `${props.label}，${props.state}` }, [h('span', { class: 'atlas-living-orb-atmosphere' }), props.showRing ? [h('span', { class: 'atlas-living-orb-ring primary' }), h('span', { class: 'atlas-living-orb-ring secondary' })] : null, h('span', { class: 'atlas-living-orb-core' }, [h('span', { class: 'depth' }), h('span', { class: 'liquid' }), h('span', { class: 'specular' })])])
  }
})

export interface AtlasVueTab { id: string; label: string; count?: number; disabled?: boolean }

export const AtlasTabs = defineComponent({
  name: 'AtlasTabs',
  emits: ['update:modelValue'],
  props: { modelValue: { type: String, required: true }, items: { type: Array as PropType<AtlasVueTab[]>, required: true }, label: { type: String, default: '页面标签' } },
  setup(props, { emit }) {
    return () => h('div', { class: 'atlas-tabs', role: 'tablist', 'aria-label': props.label }, props.items.map((item) => h('button', { role: 'tab', 'aria-selected': item.id === props.modelValue, disabled: item.disabled, onClick: () => emit('update:modelValue', item.id) }, [item.label, item.count !== undefined ? h('b', item.count) : null])))
  }
})

export const AtlasDialog = defineComponent({
  name: 'AtlasDialog',
  emits: ['update:open'],
  props: { open: Boolean, title: { type: String, required: true } },
  setup(props, { slots, emit }) {
    const dialog = ref<HTMLDialogElement>()
    const titleId = `atlas-dialog-${Math.random().toString(36).slice(2)}`
    watch(() => props.open, (open) => { if (open && !dialog.value?.open) dialog.value?.showModal(); if (!open && dialog.value?.open) dialog.value.close() }, { immediate: true, flush: 'post' })
    return () => h('dialog', { ref: dialog, class: 'atlas-dialog', 'aria-labelledby': titleId, onCancel: (event: Event) => { event.preventDefault(); emit('update:open', false) }, onClose: () => emit('update:open', false) }, [h('header', [h('h2', { id: titleId }, props.title), h('button', { 'aria-label': '关闭', onClick: () => emit('update:open', false) }, '×')]), h('div', { class: 'atlas-dialog-body' }, slots.default?.()), slots.footer ? h('footer', slots.footer()) : null])
  }
})

export const AtlasAIComposer = defineComponent({
  name: 'AtlasAIComposer',
  emits: ['update:modelValue', 'submit'],
  props: { modelValue: { type: String, default: '' }, placeholder: { type: String, default: '描述目标、输出形式和约束条件...' }, suggestions: { type: Array as PropType<string[]>, default: () => [] }, contexts: { type: Array as PropType<string[]>, default: () => [] }, busy: Boolean },
  setup(props, { emit }) {
    const submit = () => { if (!props.busy && props.modelValue.trim()) emit('submit', props.modelValue.trim()) }
    return () => h('section', { class: 'atlas-ai-composer' }, [props.contexts.length ? h('div', { class: 'atlas-contexts' }, props.contexts.map((context) => h('span', context))) : null, h('textarea', { value: props.modelValue, placeholder: props.placeholder, onInput: (event: Event) => emit('update:modelValue', (event.target as HTMLTextAreaElement).value), onKeydown: (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') submit() } }), props.suggestions.length ? h('div', { class: 'atlas-suggestions' }, props.suggestions.map((suggestion) => h('button', { onClick: () => emit('update:modelValue', suggestion) }, suggestion))) : null, h('footer', [h('span', 'Atlas Reasoner'), h(AtlasButton, { intent: 'primary', loading: props.busy, onClick: submit }, () => '发送')])])
  }
})

export interface AtlasVueExecutionStep { id: string; title: string; description?: string; status: 'pending' | 'running' | 'completed' | 'failed' | 'approval' }

export const AtlasExecutionPlan = defineComponent({
  name: 'AtlasExecutionPlan',
  emits: ['stop', 'approve'],
  props: { title: { type: String, default: '执行计划' }, steps: { type: Array as PropType<AtlasVueExecutionStep[]>, required: true }, stoppable: Boolean },
  setup(props, { emit }) {
    return () => h('section', { class: 'atlas-execution-plan' }, [h('header', [h('div', [h('span', 'Agent Execution'), h('h3', props.title)]), props.stoppable ? h(AtlasButton, { onClick: () => emit('stop') }, () => '停止') : null]), h('ol', props.steps.map((step, index) => h('li', { class: `is-${step.status}` }, [h('i', step.status === 'completed' ? '✓' : String(index + 1)), h('div', [h('strong', step.title), step.description ? h('span', step.description) : null]), step.status === 'approval' ? h(AtlasButton, { intent: 'primary', size: 'compact', onClick: () => emit('approve', step.id) }, () => '批准') : null])))])
  }
})

export interface AtlasVueOption { label: string; value: string; disabled?: boolean }

export const AtlasSelect = defineComponent({
  name: 'AtlasSelect',
  inheritAttrs: false,
  emits: ['update:modelValue'],
  props: { modelValue: { type: String, default: '' }, label: String, hint: String, options: { type: Array as PropType<AtlasVueOption[]>, required: true } },
  setup(props, { emit, attrs }) {
    return () => h('label', { class: 'atlas-field' }, [props.label ? h('span', { class: 'atlas-field-label' }, props.label) : null, h('select', { ...attrs, class: 'atlas-select', value: props.modelValue, onChange: (event: Event) => emit('update:modelValue', (event.target as HTMLSelectElement).value) }, props.options.map((option) => h('option', { value: option.value, disabled: option.disabled }, option.label))), props.hint ? h('small', props.hint) : null])
  }
})

export const AtlasTextarea = defineComponent({
  name: 'AtlasTextarea',
  inheritAttrs: false,
  emits: ['update:modelValue'],
  props: { modelValue: { type: String, default: '' }, label: String, hint: String, error: String },
  setup(props, { emit, attrs }) {
    return () => h('label', { class: ['atlas-field', props.error && 'has-error'] }, [props.label ? h('span', { class: 'atlas-field-label' }, props.label) : null, h('textarea', { ...attrs, class: 'atlas-textarea', value: props.modelValue, 'aria-invalid': Boolean(props.error) || undefined, onInput: (event: Event) => emit('update:modelValue', (event.target as HTMLTextAreaElement).value) }), props.hint || props.error ? h('small', props.error ?? props.hint) : null])
  }
})

export const AtlasCheckbox = defineComponent({
  name: 'AtlasCheckbox',
  emits: ['update:modelValue'],
  props: { modelValue: Boolean, indeterminate: Boolean, label: { type: String, required: true }, disabled: Boolean },
  setup(props, { emit }) {
    const input = ref<HTMLInputElement>()
    watch(() => props.indeterminate, (value) => { if (input.value) input.value.indeterminate = value }, { immediate: true, flush: 'post' })
    return () => h('label', { class: 'atlas-check' }, [h('input', { ref: input, type: 'checkbox', checked: props.modelValue, disabled: props.disabled, onChange: (event: Event) => emit('update:modelValue', (event.target as HTMLInputElement).checked) }), h('span', { 'aria-hidden': 'true' }), h('b', props.label)])
  }
})

export const AtlasRadioGroup = defineComponent({
  name: 'AtlasRadioGroup',
  emits: ['update:modelValue'],
  props: { modelValue: { type: String, required: true }, label: { type: String, required: true }, options: { type: Array as PropType<AtlasVueOption[]>, required: true }, disabled: Boolean },
  setup(props, { emit }) {
    const name = `atlas-radio-${Math.random().toString(36).slice(2)}`
    return () => h('fieldset', { class: 'atlas-radio-group', disabled: props.disabled }, [h('legend', props.label), ...props.options.map((option) => h('label', [h('input', { type: 'radio', name, value: option.value, checked: option.value === props.modelValue, disabled: option.disabled, onChange: () => emit('update:modelValue', option.value) }), h('span'), option.label]))])
  }
})

export const AtlasSwitch = defineComponent({
  name: 'AtlasSwitch',
  emits: ['update:modelValue'],
  props: { modelValue: Boolean, label: { type: String, required: true }, disabled: Boolean },
  setup(props, { emit }) {
    return () => h('label', { class: 'atlas-switch' }, [h('button', { type: 'button', role: 'switch', 'aria-checked': props.modelValue, disabled: props.disabled, onClick: () => emit('update:modelValue', !props.modelValue) }, [h('i')]), h('span', props.label)])
  }
})

export const AtlasDateInput = defineComponent({
  name: 'AtlasDateInput',
  emits: ['update:modelValue'],
  props: { modelValue: { type: String, default: '' }, label: String, hint: String, error: String },
  setup(props, { emit, attrs }) {
    return () => h(AtlasInput, { ...attrs, type: 'date', modelValue: props.modelValue, label: props.label, hint: props.hint, error: props.error, 'onUpdate:modelValue': (value: string) => emit('update:modelValue', value) })
  }
})

export const AtlasSearchInput = defineComponent({
  name: 'AtlasSearchInput',
  emits: ['update:modelValue', 'search'],
  props: { modelValue: { type: String, default: '' }, placeholder: { type: String, default: '搜索' }, label: { type: String, default: '搜索' } },
  setup(props, { emit }) {
    return () => h('form', { class: 'atlas-search', role: 'search', onSubmit: (event: Event) => { event.preventDefault(); emit('search', props.modelValue) } }, [h('input', { 'aria-label': props.label, value: props.modelValue, placeholder: props.placeholder, onInput: (event: Event) => emit('update:modelValue', (event.target as HTMLInputElement).value) }), h('button', { type: 'submit', 'aria-label': '提交搜索' }, '⌕')])
  }
})

export const AtlasSegmentedControl = defineComponent({
  name: 'AtlasSegmentedControl',
  emits: ['update:modelValue'],
  props: { modelValue: { type: String, required: true }, label: { type: String, required: true }, items: { type: Array as PropType<AtlasVueOption[]>, required: true } },
  setup(props, { emit }) {
    return () => h('div', { class: 'atlas-segmented', role: 'group', 'aria-label': props.label }, props.items.map((item) => h('button', { type: 'button', 'aria-pressed': item.value === props.modelValue, disabled: item.disabled, onClick: () => emit('update:modelValue', item.value) }, item.label)))
  }
})

export interface AtlasVueBreadcrumbItem { label: string; href?: string }

export const AtlasBreadcrumb = defineComponent({
  name: 'AtlasBreadcrumb',
  props: { items: { type: Array as PropType<AtlasVueBreadcrumbItem[]>, required: true }, label: { type: String, default: '面包屑' } },
  setup(props) {
    return () => h('nav', { class: 'atlas-breadcrumb', 'aria-label': props.label }, [
      h('ol', props.items.map((item, index) => h('li', [
        index < props.items.length - 1
          ? (item.href ? h('a', { href: item.href }, item.label) : h('span', item.label))
          : h('span', { 'aria-current': 'page' }, item.label)
      ])))
    ])
  }
})

export const AtlasPagination = defineComponent({
  name: 'AtlasPagination',
  emits: ['update:modelValue'],
  props: { modelValue: { type: Number, required: true }, pageCount: { type: Number, required: true }, label: { type: String, default: '分页' } },
  setup(props, { emit }) {
    return () => {
      const pages = Array.from({ length: props.pageCount }, (_, index) => index + 1).filter((item) => props.pageCount <= 7 || item === 1 || item === props.pageCount || Math.abs(item - props.modelValue) <= 1)
      return h('nav', { class: 'atlas-pagination', 'aria-label': props.label }, [h('button', { type: 'button', disabled: props.modelValue <= 1, 'aria-label': '上一页', onClick: () => emit('update:modelValue', props.modelValue - 1) }, '‹'), ...pages.flatMap((item, index) => [index > 0 && item - pages[index - 1] > 1 ? h('i', '…') : null, h('button', { type: 'button', 'aria-current': item === props.modelValue ? 'page' : undefined, onClick: () => emit('update:modelValue', item) }, item)]), h('button', { type: 'button', disabled: props.modelValue >= props.pageCount, 'aria-label': '下一页', onClick: () => emit('update:modelValue', props.modelValue + 1) }, '›')])
    }
  }
})

export interface AtlasVueStep { id: string; title: string; description?: string; status?: 'pending' | 'current' | 'completed' | 'error' }

export const AtlasSteps = defineComponent({
  name: 'AtlasSteps',
  props: { items: { type: Array as PropType<AtlasVueStep[]>, required: true }, label: { type: String, default: '流程步骤' } },
  setup(props) {
    return () => h('ol', { class: 'atlas-steps', 'aria-label': props.label }, props.items.map((item, index) => h('li', {
      class: `is-${item.status ?? 'pending'}`,
      'aria-current': item.status === 'current' ? 'step' : undefined
    }, [
      h('i', item.status === 'completed' ? '✓' : index + 1),
      h('div', [h('strong', item.title), item.description ? h('span', item.description) : null])
    ])))
  }
})

export interface AtlasVueTableColumn { key: string; title: string; align?: 'start' | 'center' | 'end' }

export const AtlasTable = defineComponent({
  name: 'AtlasTable',
  emits: ['update:selectedIds'],
  props: { columns: { type: Array as PropType<AtlasVueTableColumn[]>, required: true }, rows: { type: Array as PropType<Array<Record<string, unknown> & { id: string | number }>>, required: true }, caption: { type: String, required: true }, selectedIds: { type: Array as PropType<Array<string | number>>, default: () => [] }, selectable: Boolean },
  setup(props, { emit, slots }) {
    const toggle = (id: string | number) => emit('update:selectedIds', props.selectedIds.includes(id) ? props.selectedIds.filter((item) => item !== id) : [...props.selectedIds, id])
    return () => h('div', { class: 'atlas-table-wrap' }, [h('table', { class: 'atlas-table' }, [h('caption', props.caption), h('thead', [h('tr', [props.selectable ? h('th', { class: 'selection' }, [h(AtlasCheckbox, { modelValue: props.rows.length > 0 && props.rows.every((row) => props.selectedIds.includes(row.id)), indeterminate: props.selectedIds.length > 0 && !props.rows.every((row) => props.selectedIds.includes(row.id)), label: '选择全部', 'onUpdate:modelValue': (checked: boolean) => emit('update:selectedIds', checked ? props.rows.map((row) => row.id) : []) })]) : null, ...props.columns.map((column) => h('th', { style: { textAlign: column.align } }, column.title))])]), h('tbody', props.rows.map((row) => h('tr', { class: props.selectedIds.includes(row.id) ? 'is-selected' : undefined }, [props.selectable ? h('td', { class: 'selection' }, [h(AtlasCheckbox, { modelValue: props.selectedIds.includes(row.id), label: '选择当前行', 'onUpdate:modelValue': () => toggle(row.id) })]) : null, ...props.columns.map((column) => h('td', { style: { textAlign: column.align } }, slots[`cell-${column.key}`]?.({ row }) ?? String(row[column.key] ?? '')))])))]), props.rows.length === 0 ? h(AtlasEmpty, { title: '暂无数据', description: '调整筛选条件后重试。' }) : null])
  }
})

export const AtlasTag = defineComponent({
  name: 'AtlasTag',
  emits: ['remove'],
  props: { intent: { type: String, default: 'neutral' }, removable: Boolean },
  setup(props, { slots, emit }) {
    return () => h('span', { class: ['atlas-tag', `is-${props.intent}`] }, [slots.default?.(), props.removable ? h('button', { type: 'button', 'aria-label': '移除', onClick: () => emit('remove') }, '×') : null])
  }
})

export const AtlasBadge = defineComponent({
  name: 'AtlasBadge',
  props: { count: Number, dot: Boolean, intent: { type: String, default: 'danger' } },
  setup(props, { slots }) {
    return () => h('span', { class: 'atlas-badge' }, [slots.default?.(), h('sup', { class: `is-${props.intent}`, 'aria-label': props.dot ? '有新状态' : `${props.count ?? 0} 条` }, props.dot ? '' : props.count && props.count > 99 ? '99+' : props.count)])
  }
})

export const AtlasAvatar = defineComponent({
  name: 'AtlasAvatar',
  props: { name: { type: String, required: true }, src: String, size: { type: Number, default: 32 } },
  setup(props) {
    return () => h('span', { class: 'atlas-avatar', style: { width: `${props.size}px`, height: `${props.size}px` }, 'aria-label': props.name }, props.src ? [h('img', { src: props.src, alt: '' })] : props.name.trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase())
  }
})

export const AtlasStatistic = defineComponent({
  name: 'AtlasStatistic',
  props: { label: { type: String, required: true }, value: { type: [String, Number], required: true }, suffix: String, trend: { type: String, default: 'flat' }, trendLabel: String },
  setup(props) {
    return () => h('section', { class: 'atlas-statistic' }, [h('span', props.label), h('strong', [String(props.value), props.suffix ? h('small', props.suffix) : null]), props.trendLabel ? h('em', { class: `is-${props.trend}` }, `${props.trend === 'up' ? '↑' : props.trend === 'down' ? '↓' : '–'} ${props.trendLabel}`) : null])
  }
})

export const AtlasProgress = defineComponent({
  name: 'AtlasProgress',
  props: { value: { type: Number, required: true }, label: { type: String, required: true }, intent: { type: String, default: 'primary' } },
  setup(props) {
    return () => { const normalized = Math.max(0, Math.min(100, props.value)); return h('div', { class: ['atlas-progress', `is-${props.intent}`] }, [h('div', [h('span', props.label), h('b', `${normalized}%`)]), h('progress', { value: normalized, max: 100 }, `${normalized}%`)]) }
  }
})

export const AtlasAlert = defineComponent({
  name: 'AtlasAlert',
  emits: ['close'],
  props: { title: { type: String, required: true }, description: String, intent: { type: String, default: 'info' }, closable: Boolean },
  setup(props, { emit }) {
    return () => h('div', { class: ['atlas-alert', `is-${props.intent}`], role: props.intent === 'danger' ? 'alert' : 'status' }, [h('i', { 'aria-hidden': 'true' }, props.intent === 'success' ? '✓' : props.intent === 'warning' || props.intent === 'danger' ? '!' : 'i'), h('div', [h('strong', props.title), props.description ? h('p', props.description) : null]), props.closable ? h('button', { type: 'button', 'aria-label': '关闭提示', onClick: () => emit('close') }, '×') : null])
  }
})

export const AtlasTooltip = defineComponent({
  name: 'AtlasTooltip',
  props: { content: { type: String, required: true } },
  setup(props, { slots }) {
    const id = `atlas-tooltip-${Math.random().toString(36).slice(2)}`
    return () => h('span', { class: 'atlas-tooltip', 'aria-describedby': id }, [slots.default?.(), h('span', { role: 'tooltip', id }, props.content)])
  }
})

export const AtlasEmpty = defineComponent({
  name: 'AtlasEmpty',
  props: { title: { type: String, required: true }, description: String },
  setup(props, { slots }) {
    return () => h('section', { class: 'atlas-empty' }, [h('i', { 'aria-hidden': 'true' }, '□'), h('strong', props.title), props.description ? h('p', props.description) : null, slots.action?.()])
  }
})

export const AtlasSkeleton = defineComponent({
  name: 'AtlasSkeleton',
  props: { lines: { type: Number, default: 3 }, label: { type: String, default: '内容加载中' } },
  setup(props) {
    return () => h('div', { class: 'atlas-skeleton', role: 'status', 'aria-label': props.label }, Array.from({ length: props.lines }, (_, index) => h('span', { style: { width: `${100 - index * 12}%` } })))
  }
})

export const AtlasDrawer = defineComponent({
  name: 'AtlasDrawer',
  emits: ['update:open'],
  props: { open: Boolean, title: { type: String, required: true }, width: { type: Number, default: 420 } },
  setup(props, { emit, slots }) {
    return () => h('div', { class: ['atlas-drawer-layer', props.open && 'is-open'], 'aria-hidden': !props.open }, [h('button', { class: 'atlas-drawer-mask', type: 'button', 'aria-label': '关闭抽屉', tabindex: props.open ? 0 : -1, onClick: () => emit('update:open', false) }), h('aside', { class: 'atlas-drawer', role: 'dialog', 'aria-modal': 'true', 'aria-label': props.title, style: { width: `${props.width}px` } }, [h('header', [h('h2', props.title), h('button', { type: 'button', 'aria-label': '关闭', onClick: () => emit('update:open', false) }, '×')]), h('div', { class: 'atlas-drawer-body' }, slots.default?.()), slots.footer ? h('footer', slots.footer()) : null])])
  }
})

export interface AtlasVueDropdownItem { id: string; label: string; disabled?: boolean; danger?: boolean }

export const AtlasDropdown = defineComponent({
  name: 'AtlasDropdown',
  emits: ['select'],
  props: { label: { type: String, required: true }, items: { type: Array as PropType<AtlasVueDropdownItem[]>, required: true } },
  setup(props, { emit }) {
    const details = ref<HTMLDetailsElement>()
    return () => h('details', { ref: details, class: 'atlas-dropdown' }, [h('summary', [props.label, h('span', { 'aria-hidden': 'true' }, '⌄')]), h('div', { role: 'menu' }, props.items.map((item) => h('button', { type: 'button', role: 'menuitem', disabled: item.disabled, class: item.danger ? 'is-danger' : undefined, onClick: () => { emit('select', item.id); details.value?.removeAttribute('open') } }, item.label)))])
  }
})

export const AtlasEIDS = {
  install(app: { component(name: string, component: unknown): void }) {
    for (const component of [AtlasProvider, AtlasButton, AtlasInput, AtlasSelect, AtlasTextarea, AtlasCheckbox, AtlasRadioGroup, AtlasSwitch, AtlasDateInput, AtlasSearchInput, AtlasCard, AtlasTabs, AtlasSegmentedControl, AtlasBreadcrumb, AtlasPagination, AtlasSteps, AtlasTable, AtlasTag, AtlasBadge, AtlasAvatar, AtlasStatistic, AtlasProgress, AtlasAlert, AtlasTooltip, AtlasEmpty, AtlasSkeleton, AtlasDialog, AtlasDrawer, AtlasDropdown, AtlasOrb, AtlasAIComposer, AtlasExecutionPlan]) app.component(component.name!, component)
  }
}
