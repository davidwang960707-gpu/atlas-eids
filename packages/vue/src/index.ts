import { computed, defineComponent, h, inject, nextTick, onBeforeUnmount, onMounted, provide, ref, watch, type PropType } from 'vue'
import { createAtlasDataGridModel, filterAtlasMCPTools, filterAtlasOptions, flattenAtlasTree, moveAtlasActiveIndex, normalizeAtlasUploadFiles, validateAtlasDateRange, validateAtlasForm, validateAtlasGenUISchema, type AtlasAIArtifactContract, type AtlasAIProvenanceContract, type AtlasAIStructuredFieldContract, type AtlasCrossPageStepContract, type AtlasDataGridColumn, type AtlasDateRangeValue, type AtlasFieldValue, type AtlasFormRule, type AtlasGenUINodeContract, type AtlasMCPToolContract, type AtlasNotificationContract, type AtlasTreeNodeContract, type AtlasUploadFileContract } from '@atlas-eids/core'
import type { AtlasAIAttachmentItemContract, AtlasAICitationItemContract, AtlasAIHistoryItemContract, AtlasAIPromptItemContract, AtlasBreadcrumbItemContract, AtlasDropdownItemContract, AtlasExecutionStepContract, AtlasKnowledgeSourceItemContract, AtlasMCPServerItemContract, AtlasOptionContract, AtlasRetrievalStepContract, AtlasRowActionContract, AtlasSemanticTone, AtlasSortDirection, AtlasStepContract, AtlasTableColumn, AtlasTableLabels, AtlasToolCallItemContract } from '@atlas-eids/core'

const atlasConfigKey = Symbol('atlas-config')
const focusableSelector = 'button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

function useAtlasOverlay(open: () => boolean, root: { value?: HTMLElement }, close: () => void) {
  let previousFocus: HTMLElement | null = null
  let previousOverflow = ''
  const keydown = (event: KeyboardEvent) => {
    if (!open() || !root.value) return
    if (event.key === 'Escape') { event.preventDefault(); close(); return }
    if (event.key !== 'Tab') return
    const items = [...root.value.querySelectorAll<HTMLElement>(focusableSelector)].filter((element) => element.offsetParent !== null)
    if (!items.length) return
    const first = items[0]
    const last = items[items.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
  }
  watch(open, async (value) => {
    if (value) {
      previousFocus = document.activeElement as HTMLElement | null
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', keydown)
      await nextTick()
      root.value?.querySelector<HTMLElement>(focusableSelector)?.focus()
    } else {
      document.removeEventListener('keydown', keydown)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, { flush: 'post' })
  onBeforeUnmount(() => { document.removeEventListener('keydown', keydown); document.body.style.overflow = previousOverflow })
}

export const AtlasProvider = defineComponent({
  name: 'AtlasProvider',
  props: { theme: { type: String, default: 'light' }, density: { type: String, default: 'standard' }, locale: { type: String, default: 'zh-CN' } },
  setup(props, { slots }) {
    provide(atlasConfigKey, props)
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

export const AtlasForm = defineComponent({
  name: 'AtlasForm',
  emits: ['submit'],
  props: { schema: { type: Object as PropType<Record<string, AtlasFormRule[]>>, default: () => ({}) }, errors: { type: Object as PropType<Record<string, string>>, default: undefined }, busy: Boolean },
  setup(props, { emit, slots, attrs }) {
    const internalErrors = ref<Record<string, string>>({})
    const errors = computed(() => props.errors ?? internalErrors.value)
    const submit = (event: Event) => {
      event.preventDefault()
      const form = event.currentTarget as HTMLFormElement
      const values = Object.fromEntries(new FormData(form).entries()) as Record<string, AtlasFieldValue>
      const nextErrors = validateAtlasForm(values, props.schema)
      if (!props.errors) internalErrors.value = nextErrors
      const first = Object.keys(nextErrors)[0]
      if (first) { form.querySelector<HTMLElement>(`[name="${CSS.escape(first)}"]`)?.focus(); return }
      emit('submit', values)
    }
    return () => h('form', { ...attrs, class: 'atlas-form', 'aria-busy': props.busy || undefined, novalidate: true, onSubmit: submit }, [Object.keys(errors.value).length ? h('div', { class: 'atlas-form-summary', role: 'alert', tabindex: -1 }, [h('strong', '请检查以下字段'), h('ul', Object.entries(errors.value).map(([name, message]) => h('li', [h('button', { type: 'button', onClick: (event: Event) => (event.currentTarget as HTMLButtonElement).form?.querySelector<HTMLElement>(`[name="${CSS.escape(name)}"]`)?.focus() }, message)])))]) : null, h('fieldset', { disabled: props.busy }, slots.default?.())])
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
    return () => h('span', { ...attrs, class: ['atlas-living-orb', `state-${props.state}`], style: { width: `${props.size}px`, height: `${props.size}px`, '--atlas-orb-size': `${props.size}px` }, role: 'img', 'aria-label': `${props.label}，${props.state}` }, [h('span', { class: 'atlas-living-orb-atmosphere' }), props.showRing ? [h('span', { class: 'atlas-living-orb-ring primary' }), h('span', { class: 'atlas-living-orb-ring secondary' })] : null, h('span', { class: 'atlas-living-orb-core' }, [h('span', { class: 'depth' }), h('span', { class: 'caustic' }), h('span', { class: 'liquid' }), h('span', { class: 'specular' })])])
  }
})

export interface AtlasVueTab { id: string; label: string; count?: number; disabled?: boolean }

export const AtlasTabs = defineComponent({
  name: 'AtlasTabs',
  emits: ['update:modelValue'],
  props: { modelValue: { type: String, required: true }, items: { type: Array as PropType<AtlasVueTab[]>, required: true }, label: { type: String, default: '页面标签' } },
  setup(props, { emit, attrs }) {
    return () => h('div', { class: 'atlas-tabs', role: 'tablist', 'aria-label': props.label }, props.items.map((item) => h('button', { role: 'tab', 'aria-selected': item.id === props.modelValue, disabled: item.disabled, onClick: () => emit('update:modelValue', item.id) }, [item.label, item.count !== undefined ? h('b', item.count) : null])))
  }
})

export const AtlasDialog = defineComponent({
  name: 'AtlasDialog',
  emits: ['update:open'],
  props: { open: Boolean, title: { type: String, required: true }, closeOnBackdrop: { type: Boolean, default: true } },
  setup(props, { slots, emit }) {
    const dialog = ref<HTMLDialogElement>()
    const titleId = `atlas-dialog-${Math.random().toString(36).slice(2)}`
    useAtlasOverlay(() => props.open, dialog, () => emit('update:open', false))
    watch(() => props.open, (open) => { if (open && !dialog.value?.open) dialog.value?.showModal(); if (!open && dialog.value?.open) dialog.value.close() }, { immediate: true, flush: 'post' })
    return () => h('dialog', { ref: dialog, class: 'atlas-dialog', 'aria-labelledby': titleId, onCancel: (event: Event) => event.preventDefault(), onClick: (event: Event) => { if (props.closeOnBackdrop && event.target === dialog.value) emit('update:open', false) } }, [h('header', [h('h2', { id: titleId }, props.title), h('button', { 'aria-label': '关闭', onClick: () => emit('update:open', false) }, '×')]), h('div', { class: 'atlas-dialog-body' }, slots.default?.()), slots.footer ? h('footer', slots.footer()) : null])
  }
})

export const AtlasAIComposer = defineComponent({
  name: 'AtlasAIComposer',
  emits: ['update:modelValue', 'submit'],
  props: { modelValue: { type: String, default: '' }, placeholder: { type: String, default: '描述目标、输出形式和约束条件...' }, suggestions: { type: Array as PropType<string[]>, default: () => [] }, contexts: { type: Array as PropType<string[]>, default: () => [] }, busy: Boolean },
  setup(props, { emit, attrs }) {
    const submit = () => { if (!props.busy && props.modelValue.trim()) emit('submit', props.modelValue.trim()) }
    return () => h('section', { class: 'atlas-ai-composer' }, [props.contexts.length ? h('div', { class: 'atlas-contexts' }, props.contexts.map((context) => h('span', context))) : null, h('textarea', { value: props.modelValue, placeholder: props.placeholder, onInput: (event: Event) => emit('update:modelValue', (event.target as HTMLTextAreaElement).value), onKeydown: (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') submit() } }), props.suggestions.length ? h('div', { class: 'atlas-suggestions' }, props.suggestions.map((suggestion) => h('button', { onClick: () => emit('update:modelValue', suggestion) }, suggestion))) : null, h('footer', [h('span', 'Atlas Reasoner'), h(AtlasButton, { intent: 'primary', loading: props.busy, onClick: submit }, () => '发送')])])
  }
})

export interface AtlasVueExecutionStep extends AtlasExecutionStepContract {}

export const AtlasExecutionPlan = defineComponent({
  name: 'AtlasExecutionPlan',
  emits: ['stop', 'approve'],
  props: { title: { type: String, default: '执行计划' }, steps: { type: Array as PropType<AtlasVueExecutionStep[]>, required: true }, stoppable: Boolean },
  setup(props, { emit }) {
    return () => h('section', { class: 'atlas-execution-plan' }, [h('header', [h('div', [h('span', 'Agent Execution'), h('h3', props.title)]), props.stoppable ? h(AtlasButton, { onClick: () => emit('stop') }, () => '停止') : null]), h('ol', props.steps.map((step, index) => h('li', { class: `is-${step.status}` }, [h('i', step.status === 'completed' ? '✓' : String(index + 1)), h('div', [h('strong', step.title), step.description ? h('span', step.description) : null]), step.status === 'approval' ? h(AtlasButton, { intent: 'primary', size: 'compact', onClick: () => emit('approve', step.id) }, () => '批准') : null])))])
  }
})

export interface AtlasVueOption extends AtlasOptionContract {}

export const AtlasSelect = defineComponent({
  name: 'AtlasSelect',
  inheritAttrs: false,
  emits: ['update:modelValue'],
  props: { modelValue: { type: String, default: '' }, label: String, hint: String, options: { type: Array as PropType<AtlasVueOption[]>, required: true } },
  setup(props, { emit, attrs }) {
    return () => h('label', { class: 'atlas-field' }, [props.label ? h('span', { class: 'atlas-field-label' }, props.label) : null, h('select', { ...attrs, class: 'atlas-select', value: props.modelValue, onChange: (event: Event) => emit('update:modelValue', (event.target as HTMLSelectElement).value) }, props.options.map((option) => h('option', { value: option.value, disabled: option.disabled }, option.label))), props.hint ? h('small', props.hint) : null])
  }
})

export const AtlasCombobox = defineComponent({
  name: 'AtlasCombobox',
  emits: ['update:modelValue', 'update:query'],
  props: { modelValue: String, query: String, label: { type: String, required: true }, options: { type: Array as PropType<AtlasVueOption[]>, required: true }, placeholder: { type: String, default: '搜索或选择' }, loading: Boolean, error: String, disabled: Boolean },
  setup(props, { emit }) {
    const id = `atlas-combobox-${Math.random().toString(36).slice(2)}`
    const internalQuery = ref(props.options.find((option) => option.value === props.modelValue)?.label ?? '')
    const open = ref(false)
    const active = ref(-1)
    const currentQuery = computed(() => props.query ?? internalQuery.value)
    const filtered = computed(() => filterAtlasOptions(props.options, currentQuery.value))
    const disabledIndexes = computed(() => new Set(filtered.value.map((option, index) => option.disabled ? index : -1).filter((index) => index >= 0)))
    const updateQuery = (value: string) => { if (props.query === undefined) internalQuery.value = value; emit('update:query', value); open.value = true; active.value = -1 }
    const select = (option: AtlasVueOption) => { if (option.disabled) return; updateQuery(option.label); emit('update:modelValue', option.value); open.value = false }
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); open.value = true; active.value = moveAtlasActiveIndex(active.value, event.key === 'ArrowDown' ? 1 : -1, filtered.value.length, disabledIndexes.value) }
      if (event.key === 'Enter' && open.value && active.value >= 0) { event.preventDefault(); select(filtered.value[active.value]) }
      if (event.key === 'Escape') open.value = false
    }
    return () => h('label', { class: ['atlas-field', 'atlas-combobox', props.error && 'has-error'] }, [h('span', { class: 'atlas-field-label' }, props.label), h('div', [h('input', { id, role: 'combobox', 'aria-expanded': open.value, 'aria-controls': `${id}-listbox`, 'aria-activedescendant': active.value >= 0 ? `${id}-option-${active.value}` : undefined, 'aria-autocomplete': 'list', value: currentQuery.value, placeholder: props.placeholder, disabled: props.disabled, onInput: (event: Event) => updateQuery((event.target as HTMLInputElement).value), onFocus: () => { open.value = true }, onKeydown: keydown }), h('button', { type: 'button', 'aria-label': open.value ? '关闭选项' : '打开选项', disabled: props.disabled, onClick: () => { open.value = !open.value } }, '⌄')]), open.value ? h('ul', { id: `${id}-listbox`, role: 'listbox' }, props.loading ? [h('li', { role: 'option', 'aria-disabled': 'true' }, '加载中...')] : filtered.value.length ? filtered.value.map((option, index) => h('li', { id: `${id}-option-${index}`, role: 'option', 'aria-selected': option.value === props.modelValue, 'aria-disabled': option.disabled || undefined, class: [index === active.value && 'is-active', option.value === props.modelValue && 'is-selected'], onMousedown: (event: Event) => event.preventDefault(), onClick: () => select(option) }, option.label)) : [h('li', { role: 'option', 'aria-disabled': 'true' }, '没有匹配项')]) : null, props.error ? h('small', props.error) : null])
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
  props: { modelValue: Boolean, indeterminate: Boolean, label: { type: String, required: true }, hideLabel: Boolean, disabled: Boolean },
  setup(props, { emit, attrs }) {
    const input = ref<HTMLInputElement>()
    const syncIndeterminate = () => { if (input.value) input.value.indeterminate = props.indeterminate }
    onMounted(syncIndeterminate)
    watch(() => props.indeterminate, syncIndeterminate, { flush: 'post' })
    return () => h('label', { class: 'atlas-check' }, [h('input', { ...attrs, ref: input, type: 'checkbox', checked: props.modelValue, 'aria-checked': props.indeterminate ? 'mixed' : props.modelValue, disabled: props.disabled, onChange: (event: Event) => emit('update:modelValue', (event.target as HTMLInputElement).checked) }), h('span', { 'aria-hidden': 'true' }), h('b', { class: props.hideLabel ? 'sr-only' : undefined }, props.label)])
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

export const AtlasDateRange = defineComponent({
  name: 'AtlasDateRange',
  emits: ['update:modelValue'],
  props: { modelValue: { type: Object as PropType<AtlasDateRangeValue>, required: true }, label: { type: String, default: '日期范围' }, min: String, max: String, disabled: Boolean },
  setup(props, { emit }) {
    const error = computed(() => validateAtlasDateRange(props.modelValue, props.min, props.max))
    return () => h('fieldset', { class: ['atlas-date-range', error.value && 'has-error'], disabled: props.disabled }, [h('legend', props.label), h(AtlasDateInput, { label: '开始日期', modelValue: props.modelValue.start ?? '', min: props.min, max: props.modelValue.end ?? props.max, 'onUpdate:modelValue': (start: string) => emit('update:modelValue', { ...props.modelValue, start }) }), h('span', { 'aria-hidden': 'true' }, '至'), h(AtlasDateInput, { label: '结束日期', modelValue: props.modelValue.end ?? '', min: props.modelValue.start ?? props.min, max: props.max, 'onUpdate:modelValue': (end: string) => emit('update:modelValue', { ...props.modelValue, end }) }), error.value ? h('small', { role: 'alert' }, error.value) : null])
  }
})

export const AtlasUpload = defineComponent({
  name: 'AtlasUpload',
  emits: ['add', 'remove', 'retry'],
  props: { files: { type: Array as PropType<AtlasUploadFileContract[]>, default: () => [] }, accept: { type: Array as PropType<string[]>, default: () => [] }, maxSize: Number, multiple: { type: Boolean, default: true }, disabled: Boolean, label: { type: String, default: '上传文件' } },
  setup(props, { emit }) {
    const input = ref<HTMLInputElement>()
    const add = (nativeFiles: File[]) => { if (nativeFiles.length) emit('add', normalizeAtlasUploadFiles(nativeFiles, { accept: props.accept, maxSize: props.maxSize }), nativeFiles) }
    return () => h('section', { class: ['atlas-upload', props.disabled && 'is-disabled'], 'aria-label': props.label }, [h('input', { ref: input, class: 'sr-only', type: 'file', multiple: props.multiple, accept: props.accept.join(','), disabled: props.disabled, onChange: (event: Event) => add([...(event.target as HTMLInputElement).files ?? []]) }), h('button', { type: 'button', class: 'atlas-upload-dropzone', disabled: props.disabled, onClick: () => input.value?.click(), onDragover: (event: DragEvent) => event.preventDefault(), onDrop: (event: DragEvent) => { event.preventDefault(); if (!props.disabled) add([...event.dataTransfer?.files ?? []]) } }, [h('strong', props.label), h('span', '拖放文件到这里，或点击选择'), props.maxSize ? h('small', `单个文件不超过 ${Math.round(props.maxSize / 1024 / 1024)} MB`) : null]), props.files.length ? h('ul', props.files.map((file) => h('li', { class: `is-${file.status}` }, [h('span', [h('strong', file.name), h('small', file.error ?? `${Math.ceil(file.size / 1024)} KB`)]), h('progress', { value: file.progress, max: 100 }, `${file.progress}%`), file.status === 'failed' ? h(AtlasButton, { size: 'compact', onClick: () => emit('retry', file.id) }, () => '重试') : null, h('button', { type: 'button', 'aria-label': `移除 ${file.name}`, onClick: () => emit('remove', file.id) }, '×')]))) : null])
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

export interface AtlasVueBreadcrumbItem extends AtlasBreadcrumbItemContract { onClick?: () => void }

export const AtlasBreadcrumb = defineComponent({
  name: 'AtlasBreadcrumb',
  props: { items: { type: Array as PropType<AtlasVueBreadcrumbItem[]>, required: true }, label: { type: String, default: '面包屑' } },
  setup(props) {
    return () => h('nav', { class: 'atlas-breadcrumb', 'aria-label': props.label }, [
      h('ol', props.items.map((item, index) => h('li', [
        index < props.items.length - 1
          ? (item.href ? h('a', { href: item.href }, item.label) : h('button', { type: 'button', onClick: item.onClick }, item.label))
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

export interface AtlasVueStep extends AtlasStepContract {}

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

export interface AtlasVueTableColumn extends AtlasTableColumn<Record<string, unknown>> { key: string }

const tableLabels: Record<string, AtlasTableLabels> = {
  'zh-CN': { selectAll: '选择全部', selectRow: '选择当前行', emptyTitle: '暂无数据', emptyDescription: '调整筛选条件后重试。', sortAscending: '升序排列', sortDescending: '降序排列' },
  'en-US': { selectAll: 'Select all', selectRow: 'Select row', emptyTitle: 'No data', emptyDescription: 'Adjust the filters and try again.', sortAscending: 'Sorted ascending', sortDescending: 'Sorted descending' }
}

export const AtlasTable = defineComponent({
  name: 'AtlasTable',
  emits: ['update:selectedIds', 'sort'],
  props: { columns: { type: Array as PropType<AtlasVueTableColumn[]>, required: true }, rows: { type: Array as PropType<Array<Record<string, unknown> & { id: string | number }>>, required: true }, caption: { type: String, required: true }, selectedIds: { type: Array as PropType<Array<string | number>>, default: () => [] }, selectable: Boolean, loading: Boolean, sortKey: String, sortDirection: String as PropType<AtlasSortDirection>, labels: { type: Object as PropType<Partial<AtlasTableLabels>>, default: () => ({}) } },
  setup(props, { emit, slots }) {
    const config = inject<{ locale: string }>(atlasConfigKey, { locale: 'zh-CN' })
    const toggle = (id: string | number) => emit('update:selectedIds', props.selectedIds.includes(id) ? props.selectedIds.filter((item) => item !== id) : [...props.selectedIds, id])
    return () => {
      const labels = { ...(tableLabels[config.locale] ?? tableLabels['zh-CN']), ...props.labels }
      return h('div', { class: ['atlas-table-wrap', props.loading && 'is-loading'], 'aria-busy': props.loading || undefined }, [h('table', { class: 'atlas-table' }, [h('caption', props.caption), h('thead', [h('tr', [props.selectable ? h('th', { class: 'selection' }, [h(AtlasCheckbox, { modelValue: props.rows.length > 0 && props.rows.every((row) => props.selectedIds.includes(row.id)), indeterminate: props.selectedIds.length > 0 && !props.rows.every((row) => props.selectedIds.includes(row.id)), label: labels.selectAll, hideLabel: true, 'onUpdate:modelValue': (checked: boolean) => emit('update:selectedIds', checked ? props.rows.map((row) => row.id) : []) })]) : null, ...props.columns.map((column) => {
        const activeSort = props.sortKey === column.key ? props.sortDirection : undefined
        const content = column.sortable ? h('button', { type: 'button', class: 'atlas-table-sort', onClick: () => emit('sort', { key: column.key, direction: activeSort === 'ascending' ? 'descending' : 'ascending' }) }, [column.title, h('span', { 'aria-hidden': 'true' }, activeSort === 'ascending' ? '↑' : activeSort === 'descending' ? '↓' : '↕'), h('span', { class: 'sr-only' }, activeSort === 'ascending' ? labels.sortAscending : activeSort === 'descending' ? labels.sortDescending : '')]) : column.title
        return h('th', { style: { textAlign: column.align, width: typeof column.width === 'number' ? `${column.width}px` : column.width }, 'aria-sort': column.sortable ? activeSort ?? 'none' : undefined }, content)
      })])]), h('tbody', props.rows.map((row) => h('tr', { class: props.selectedIds.includes(row.id) ? 'is-selected' : undefined, 'aria-selected': props.selectedIds.includes(row.id) || undefined }, [props.selectable ? h('td', { class: 'selection' }, [h(AtlasCheckbox, { modelValue: props.selectedIds.includes(row.id), label: labels.selectRow, hideLabel: true, 'onUpdate:modelValue': () => toggle(row.id) })]) : null, ...props.columns.map((column) => h('td', { style: { textAlign: column.align, width: typeof column.width === 'number' ? `${column.width}px` : column.width } }, slots[`cell-${column.key}`]?.({ row }) ?? String(row[column.key] ?? '')))])))]), props.rows.length === 0 && !props.loading ? h(AtlasEmpty, { title: labels.emptyTitle, description: labels.emptyDescription }) : null, props.loading ? h('div', { class: 'atlas-table-loading' }, [h(AtlasSkeleton, { lines: 3 })]) : null])
    }
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
    return () => h('span', { class: 'atlas-badge' }, [slots.default?.(), props.dot || props.count !== undefined ? h('sup', { class: `is-${props.intent}`, 'aria-hidden': props.dot || undefined }, props.dot ? '' : props.count && props.count > 99 ? '99+' : props.count) : null, props.dot ? h('span', { class: 'sr-only' }, '有新状态') : null])
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
  props: { open: Boolean, title: { type: String, required: true }, width: { type: Number, default: 420 }, closeOnBackdrop: { type: Boolean, default: true } },
  setup(props, { emit, slots }) {
    const drawer = ref<HTMLElement>()
    useAtlasOverlay(() => props.open, drawer, () => emit('update:open', false))
    return () => h('div', { class: ['atlas-drawer-layer', props.open && 'is-open'], 'aria-hidden': !props.open }, [h('button', { class: 'atlas-drawer-mask', type: 'button', 'aria-label': '关闭抽屉', tabindex: props.open ? 0 : -1, onClick: () => { if (props.closeOnBackdrop) emit('update:open', false) } }), h('aside', { ref: drawer, class: 'atlas-drawer', role: 'dialog', 'aria-modal': 'true', 'aria-label': props.title, style: { width: `${props.width}px` } }, [h('header', [h('h2', props.title), h('button', { type: 'button', 'aria-label': '关闭', onClick: () => emit('update:open', false) }, '×')]), h('div', { class: 'atlas-drawer-body' }, slots.default?.()), slots.footer ? h('footer', slots.footer()) : null])])
  }
})

export interface AtlasVueDropdownItem extends AtlasDropdownItemContract {}

export const AtlasDropdown = defineComponent({
  name: 'AtlasDropdown',
  emits: ['select'],
  props: { label: { type: String, required: true }, items: { type: Array as PropType<AtlasVueDropdownItem[]>, required: true } },
  setup(props, { emit }) {
    const details = ref<HTMLDetailsElement>()
    return () => h('details', { ref: details, class: 'atlas-dropdown' }, [h('summary', [props.label, h('span', { 'aria-hidden': 'true' }, '⌄')]), h('div', { role: 'menu' }, props.items.map((item) => h('button', { type: 'button', role: 'menuitem', disabled: item.disabled, class: item.danger ? 'is-danger' : undefined, onClick: () => { emit('select', item.id); details.value?.removeAttribute('open') } }, item.label)))])
  }
})

export const AtlasMenu = defineComponent({
  name: 'AtlasMenu',
  emits: ['select'],
  props: { items: { type: Array as PropType<AtlasVueDropdownItem[]>, required: true }, activeId: String, label: { type: String, default: '操作菜单' }, orientation: { type: String as PropType<'vertical' | 'horizontal'>, default: 'vertical' } },
  setup(props, { emit }) {
    const refs: Array<HTMLButtonElement | null> = []
    const keydown = (event: KeyboardEvent, index: number) => {
      const previous = props.orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
      const next = props.orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight'
      if (![previous, next, 'Home', 'End'].includes(event.key)) return
      event.preventDefault()
      const disabled = new Set(props.items.map((item, itemIndex) => item.disabled ? itemIndex : -1).filter((itemIndex) => itemIndex >= 0))
      const target = event.key === 'Home' ? 0 : event.key === 'End' ? props.items.length - 1 : moveAtlasActiveIndex(index, event.key === next ? 1 : -1, props.items.length, disabled)
      refs[target]?.focus()
    }
    return () => h('div', { class: ['atlas-menu', `is-${props.orientation}`], role: 'menu', 'aria-label': props.label, 'aria-orientation': props.orientation }, props.items.map((item, index) => h('button', { ref: ((element: Element | null) => { refs[index] = element as HTMLButtonElement | null }) as never, type: 'button', role: 'menuitem', tabindex: item.id === props.activeId || (!props.activeId && index === 0) ? 0 : -1, 'aria-current': item.id === props.activeId ? 'page' : undefined, disabled: item.disabled, class: item.danger ? 'is-danger' : undefined, onKeydown: (event: KeyboardEvent) => keydown(event, index), onClick: () => emit('select', item.id) }, item.label)))
  }
})

export const AtlasObjectCell = defineComponent({
  name: 'AtlasObjectCell',
  props: { title: { type: String, required: true }, meta: String, description: String, tone: { type: String as PropType<AtlasSemanticTone>, default: 'neutral' }, interactive: Boolean },
  setup(props, { slots, attrs }) {
    return () => h('div', { ...attrs, class: ['atlas-object-cell', `is-${props.tone}`, props.interactive && 'is-interactive'] }, [slots.icon ? h('span', { class: 'atlas-object-cell-icon', 'aria-hidden': 'true' }, slots.icon()) : null, h('span', { class: 'atlas-object-cell-copy' }, [h('strong', slots.title?.() ?? props.title), props.meta ? h('small', props.meta) : null, props.description ? h('span', props.description) : null])])
  }
})

export const AtlasStatusTag = defineComponent({
  name: 'AtlasStatusTag',
  props: { tone: { type: String as PropType<AtlasSemanticTone>, default: 'neutral' } },
  setup(props, { slots, attrs }) {
    return () => h('span', { ...attrs, class: ['atlas-status-tag', `is-${props.tone}`] }, slots.default?.())
  }
})

export interface AtlasVueRowAction extends AtlasRowActionContract { icon?: string }

export const AtlasRowActions = defineComponent({
  name: 'AtlasRowActions',
  emits: ['action'],
  props: { items: { type: Array as PropType<AtlasVueRowAction[]>, required: true }, maxVisible: { type: Number, default: 3 }, label: { type: String, default: '行操作' } },
  setup(props, { emit, slots }) {
    return () => {
      const visible = props.items.slice(0, Math.max(0, props.maxVisible))
      const overflow = props.items.slice(Math.max(0, props.maxVisible))
      return h('div', { class: 'atlas-row-actions', role: 'group', 'aria-label': props.label }, [...visible.map((item) => h('button', { type: 'button', class: item.danger ? 'is-danger' : undefined, disabled: item.disabled, 'aria-label': item.label, title: item.label, onClick: () => emit('action', item.id) }, slots[`action-${item.id}`]?.() ?? item.icon ?? item.label)), overflow.length ? h(AtlasDropdown, { label: '•••', items: overflow, onSelect: (id: string) => emit('action', id) }) : null])
    }
  }
})

export const AtlasTableToolbar = defineComponent({
  name: 'AtlasTableToolbar',
  setup(_, { slots, attrs }) {
    return () => h('div', { ...attrs, class: 'atlas-table-toolbar' }, [h('div', { class: 'atlas-table-toolbar-primary' }, [slots.search?.(), slots.filters?.()]), h('div', { class: 'atlas-table-toolbar-secondary' }, [slots.selection?.(), slots.actions?.()])])
  }
})

export const AtlasDataTable = defineComponent({
  name: 'AtlasDataTable',
  emits: ['update:selectedIds', 'sort'],
  props: { title: String, description: String, columns: { type: Array as PropType<AtlasVueTableColumn[]>, required: true }, rows: { type: Array as PropType<Array<Record<string, unknown> & { id: string | number }>>, required: true }, caption: { type: String, required: true }, selectedIds: { type: Array as PropType<Array<string | number>>, default: () => [] }, selectable: Boolean, loading: Boolean, sortKey: String, sortDirection: String as PropType<AtlasSortDirection>, labels: { type: Object as PropType<Partial<AtlasTableLabels>>, default: () => ({}) } },
  setup(props, { emit, slots, attrs }) {
    return () => h('section', { ...attrs, class: 'atlas-data-table' }, [props.title || props.description ? h('header', [h('div', [props.description ? h('span', props.description) : null, props.title ? h('h3', props.title) : null])]) : null, slots.toolbar?.(), h(AtlasTable, { columns: props.columns, rows: props.rows, caption: props.caption, selectedIds: props.selectedIds, selectable: props.selectable, loading: props.loading, sortKey: props.sortKey, sortDirection: props.sortDirection, labels: props.labels, 'onUpdate:selectedIds': (ids: Array<string | number>) => emit('update:selectedIds', ids), onSort: (value: { key: string; direction: AtlasSortDirection }) => emit('sort', value) }, slots), slots.footer ? h('footer', slots.footer()) : null])
  }
})

export const AtlasDataGrid = defineComponent({
  name: 'AtlasDataGrid',
  emits: ['update:selectedIds', 'update:query', 'update:page', 'sort'],
  props: { columns: { type: Array as PropType<Array<AtlasDataGridColumn<Record<string, unknown>> & { key: string }>>, required: true }, rows: { type: Array as PropType<Array<Record<string, unknown> & { id: string | number }>>, required: true }, caption: { type: String, required: true }, selectedIds: { type: Array as PropType<Array<string | number>>, default: () => [] }, selectable: Boolean, loading: Boolean, sortKey: String, sortDirection: String as PropType<AtlasSortDirection>, query: { type: String, default: '' }, page: { type: Number, default: 1 }, pageSize: { type: Number, default: 50 }, totalRows: Number, virtualize: Boolean, viewportHeight: { type: Number, default: 420 } },
  setup(props, { emit, slots }) {
    const config = inject<{ density: string }>(atlasConfigKey, { density: 'standard' })
    const scrollTop = ref(0)
    return () => {
      const rowHeight = config.density === 'compact' ? 36 : config.density === 'comfortable' ? 50 : 42
      const windowSize = props.virtualize ? Math.ceil(props.viewportHeight / rowHeight) + 4 : props.pageSize
      const offset = props.virtualize ? Math.max(0, Math.floor(scrollTop.value / rowHeight) - 2) : (Math.max(1, props.page) - 1) * props.pageSize
      const model = createAtlasDataGridModel({ rows: props.rows, columns: props.columns, query: props.query, sortKey: props.sortKey, sortDirection: props.sortDirection, offset, limit: windowSize })
      const table = h(AtlasTable, { columns: model.visibleColumns, rows: model.visibleRows, caption: props.caption, selectedIds: props.selectedIds, selectable: props.selectable, loading: props.loading, sortKey: props.sortKey, sortDirection: props.sortDirection, 'onUpdate:selectedIds': (ids: Array<string | number>) => emit('update:selectedIds', ids), onSort: (value: unknown) => emit('sort', value) }, slots)
      const pageCount = Math.max(1, Math.ceil((props.totalRows ?? model.totalRows) / props.pageSize))
      return h('section', { class: 'atlas-data-grid', 'data-atlas-critical': '' }, [h('div', { class: 'atlas-data-grid-controls' }, [h(AtlasSearchInput, { modelValue: props.query, placeholder: '筛选数据', 'onUpdate:modelValue': (value: string) => emit('update:query', value), onSearch: (value: string) => emit('update:query', value) }), h('span', { role: 'status' }, `${props.totalRows ?? model.totalRows} 项`)]), props.virtualize ? h('div', { class: 'atlas-data-grid-viewport', style: { height: `${props.viewportHeight}px` }, onScroll: (event: Event) => { scrollTop.value = (event.currentTarget as HTMLElement).scrollTop } }, [h('div', { style: { paddingTop: `${offset * rowHeight}px`, paddingBottom: `${Math.max(0, (model.totalRows - offset - model.visibleRows.length) * rowHeight)}px` } }, [table])]) : table, !props.virtualize && pageCount > 1 ? h('footer', [h(AtlasPagination, { modelValue: props.page, pageCount, 'onUpdate:modelValue': (page: number) => emit('update:page', page) })]) : null])
    }
  }
})

export const AtlasTree = defineComponent({
  name: 'AtlasTree',
  emits: ['update:expandedIds', 'update:selectedId'],
  props: { nodes: { type: Array as PropType<AtlasTreeNodeContract[]>, required: true }, expandedIds: { type: Array as PropType<string[]>, default: () => [] }, selectedId: String, label: { type: String, default: '树形导航' } },
  setup(props, { emit }) {
    const refs = new Map<string, HTMLButtonElement>()
    const flat = computed(() => flattenAtlasTree(props.nodes, props.expandedIds))
    const activate = (index: number) => refs.get(flat.value[index]?.id)?.focus()
    const keydown = (event: KeyboardEvent, index: number) => {
      const node = flat.value[index]
      if (event.key === 'ArrowDown') { event.preventDefault(); activate(Math.min(flat.value.length - 1, index + 1)) }
      if (event.key === 'ArrowUp') { event.preventDefault(); activate(Math.max(0, index - 1)) }
      if (event.key === 'ArrowRight' && node.hasChildren) { event.preventDefault(); if (!props.expandedIds.includes(node.id)) emit('update:expandedIds', [...props.expandedIds, node.id]); else activate(index + 1) }
      if (event.key === 'ArrowLeft') { event.preventDefault(); if (props.expandedIds.includes(node.id)) emit('update:expandedIds', props.expandedIds.filter((id) => id !== node.id)); else if (node.parentId) refs.get(node.parentId)?.focus() }
      if (event.key === 'Home') { event.preventDefault(); activate(0) }
      if (event.key === 'End') { event.preventDefault(); activate(flat.value.length - 1) }
    }
    return () => h('div', { class: 'atlas-tree', role: 'tree', 'aria-label': props.label }, flat.value.map((node, index) => {
      const expanded = props.expandedIds.includes(node.id)
      return h('div', { role: 'treeitem', 'aria-level': node.depth + 1, 'aria-expanded': node.hasChildren ? expanded : undefined, 'aria-selected': node.id === props.selectedId, 'aria-disabled': node.disabled || undefined, style: { '--atlas-tree-depth': node.depth } }, [
        node.hasChildren ? h('button', { type: 'button', class: 'atlas-tree-expander', 'aria-label': expanded ? `收起 ${node.label}` : `展开 ${node.label}`, disabled: node.disabled, onClick: () => emit('update:expandedIds', expanded ? props.expandedIds.filter((id) => id !== node.id) : [...props.expandedIds, node.id]) }, expanded ? '⌄' : '›') : h('span', { class: 'atlas-tree-expander is-placeholder', 'aria-hidden': 'true' }, '›'),
        h('button', { ref: ((element: Element | null) => { if (element) refs.set(node.id, element as HTMLButtonElement); else refs.delete(node.id) }) as never, class: 'atlas-tree-selector', type: 'button', tabindex: node.id === props.selectedId || (!props.selectedId && index === 0) ? 0 : -1, disabled: node.disabled, onKeydown: (event: KeyboardEvent) => keydown(event, index), onClick: () => emit('update:selectedId', node.id) }, [h('strong', node.label)])
      ])
    }))
  }
})

export const AtlasPageHeader = defineComponent({
  name: 'AtlasPageHeader',
  props: { title: { type: String, required: true }, description: String, eyebrow: String, breadcrumbs: { type: Array as PropType<AtlasVueBreadcrumbItem[]>, default: () => [] } },
  setup(props, { slots, attrs }) {
    return () => {
      const { class: inheritedClass, ...restAttrs } = attrs
      return h('header', { ...restAttrs, class: ['atlas-page-header', inheritedClass] }, [h('div', { class: 'atlas-page-header-copy' }, [props.breadcrumbs.length ? h(AtlasBreadcrumb, { items: props.breadcrumbs }) : null, props.eyebrow ? h('span', { class: 'atlas-page-header-eyebrow' }, props.eyebrow) : null, h('h1', slots.title?.() ?? props.title), props.description ? h('p', props.description) : null, slots.meta ? h('div', { class: 'atlas-page-header-meta' }, slots.meta()) : null]), slots.actions ? h('div', { class: 'atlas-page-header-actions' }, slots.actions()) : null])
    }
  }
})

export const AtlasPanel = defineComponent({
  name: 'AtlasPanel',
  props: { title: String, description: String },
  setup(props, { slots, attrs }) {
    return () => {
      const { class: inheritedClass, ...restAttrs } = attrs
      const hasHeader = props.title || props.description || slots.title || slots.description || slots.actions
      return h('section', { ...restAttrs, class: ['atlas-panel', inheritedClass] }, [hasHeader ? h('header', [h('div', [props.title || slots.title ? h('h2', slots.title?.() ?? props.title) : null, props.description || slots.description ? h('p', slots.description?.() ?? props.description) : null]), slots.actions?.()]) : null, h('div', { class: 'atlas-panel-body' }, slots.default?.()), slots.footer ? h('footer', slots.footer()) : null])
    }
  }
})

export const AtlasAppLayout = defineComponent({
  name: 'AtlasAppLayout',
  emits: ['update:mobileNavigationOpen'],
  props: { collapsed: Boolean, mobileNavigationOpen: Boolean },
  setup(props, { slots, emit }) {
    return () => h('div', { class: ['atlas-app-layout', props.collapsed && 'is-collapsed', props.mobileNavigationOpen && 'is-mobile-open'] }, [h('header', { class: 'atlas-app-layout-header' }, [h('button', { type: 'button', class: 'atlas-app-layout-toggle', 'aria-label': props.mobileNavigationOpen ? '关闭导航' : '打开导航', 'aria-expanded': props.mobileNavigationOpen, onClick: () => emit('update:mobileNavigationOpen', !props.mobileNavigationOpen) }, '☰'), slots.brand?.(), h('div', slots.topbar?.())]), h('aside', { class: 'atlas-app-layout-nav', 'aria-label': '主导航' }, slots.navigation?.()), props.mobileNavigationOpen ? h('button', { type: 'button', class: 'atlas-app-layout-mask', 'aria-label': '关闭导航', onClick: () => emit('update:mobileNavigationOpen', false) }) : null, h('main', { class: 'atlas-app-layout-main' }, slots.default?.()), slots.aside ? h('aside', { class: 'atlas-app-layout-aside' }, slots.aside()) : null])
  }
})

export const AtlasNotification = defineComponent({
  name: 'AtlasNotification',
  emits: ['dismiss'],
  props: { notification: { type: Object as PropType<AtlasNotificationContract>, required: true } },
  setup(props, { emit }) {
    let timer: number | undefined
    onMounted(() => { if (props.notification.duration) timer = window.setTimeout(() => emit('dismiss', props.notification.id), props.notification.duration) })
    onBeforeUnmount(() => { if (timer) window.clearTimeout(timer) })
    return () => h('article', { class: ['atlas-notification', `is-${props.notification.intent ?? 'info'}`], role: props.notification.intent === 'danger' ? 'alert' : 'status' }, [h('i', { 'aria-hidden': 'true' }, props.notification.intent === 'success' ? '✓' : props.notification.intent === 'warning' || props.notification.intent === 'danger' ? '!' : 'i'), h('div', [h('strong', props.notification.title), props.notification.description ? h('p', props.notification.description) : null]), h('button', { type: 'button', 'aria-label': `关闭 ${props.notification.title}`, onClick: () => emit('dismiss', props.notification.id) }, '×')])
  }
})

export const AtlasNotificationCenter = defineComponent({
  name: 'AtlasNotificationCenter',
  emits: ['dismiss'],
  props: { items: { type: Array as PropType<AtlasNotificationContract[]>, required: true }, label: { type: String, default: '通知' } },
  setup(props, { emit }) { return () => h('section', { class: 'atlas-notification-center', 'aria-label': props.label, 'aria-live': 'polite' }, props.items.map((item) => h(AtlasNotification, { notification: item, onDismiss: (id: string) => emit('dismiss', id) }))) }
})

export interface AtlasVueAICitationItem extends AtlasAICitationItemContract {}
export interface AtlasVueAIPromptItem extends AtlasAIPromptItemContract {}
export interface AtlasVueAIAttachmentItem extends AtlasAIAttachmentItemContract {}
export interface AtlasVueAIHistoryItem extends AtlasAIHistoryItemContract {}
export interface AtlasVueMCPServerItem extends AtlasMCPServerItemContract {}
export interface AtlasVueKnowledgeSourceItem extends AtlasKnowledgeSourceItemContract {}
export interface AtlasVueRetrievalStep extends AtlasRetrievalStepContract {}
export interface AtlasVueToolCallItem extends AtlasToolCallItemContract {}

export const AtlasAIConversation = defineComponent({
  name: 'AtlasAIConversation',
  props: { title: { type: String, required: true }, subtitle: String, status: { type: String, default: 'idle' } },
  setup(props, { slots, attrs }) {
    return () => h('section', { ...attrs, class: ['atlas-ai-conversation', slots.history && 'has-history'] }, [slots.history ? h('aside', { class: 'atlas-ai-conversation-history' }, slots.history()) : null, h('div', { class: 'atlas-ai-conversation-main' }, [h('header', [h('span', { class: 'atlas-ai-identity' }, [h(AtlasOrb, { state: props.status, size: 34 }), h('span', [h('strong', props.title), props.subtitle ? h('small', props.subtitle) : null])]), slots.toolbar?.()]), h('div', { class: 'atlas-ai-message-stream', role: 'log', 'aria-live': 'polite' }, slots.default?.()), slots.composer ? h('footer', slots.composer()) : null])])
  }
})

export const AtlasAIMessageBubble = defineComponent({
  name: 'AtlasAIMessageBubble',
  props: { role: { type: String, required: true }, name: String, timestamp: String, content: String, streaming: Boolean, citations: { type: Array as PropType<AtlasVueAICitationItem[]>, default: () => [] } },
  setup(props, { slots, attrs }) {
    const displayName = () => props.name ?? (props.role === 'assistant' ? 'Atlas Reasoner' : props.role === 'user' ? '你' : props.role === 'tool' ? 'Tool' : 'System')
    return () => h('article', { ...attrs, class: ['atlas-ai-message', `is-${props.role}`, props.streaming && 'is-streaming'] }, [h('div', { class: 'atlas-ai-message-avatar' }, props.role === 'assistant' ? [h(AtlasOrb, { state: props.streaming ? 'thinking' : 'idle', size: 28, showRing: false })] : props.role === 'user' ? '你' : props.role === 'tool' ? 'T' : 'S'), h('div', { class: 'atlas-ai-message-content' }, [h('header', [h('strong', displayName()), props.timestamp ? h('time', props.timestamp) : null]), h('div', slots.default?.() ?? props.content), props.citations.length ? h(AtlasCitationList, { items: props.citations }) : null, slots.actions ? h('footer', slots.actions()) : null])])
  }
})

export const AtlasAIStreamingText = defineComponent({
  name: 'AtlasAIStreamingText',
  props: { text: { type: String, required: true }, status: { type: String, default: 'streaming' }, label: { type: String, default: 'AI 正在生成' } },
  setup(props) { return () => h('span', { class: ['atlas-ai-streaming', `is-${props.status}`], role: 'status', 'aria-label': props.status === 'streaming' ? props.label : undefined }, [props.text, props.status === 'streaming' ? h('i', { 'aria-hidden': 'true' }) : null]) }
})

export const AtlasAIPrompts = defineComponent({
  name: 'AtlasAIPrompts',
  emits: ['select'],
  props: { items: { type: Array as PropType<AtlasVueAIPromptItem[]>, required: true }, label: { type: String, default: '推荐问题' } },
  setup(props, { emit }) { return () => h('section', { class: 'atlas-ai-prompts', 'aria-label': props.label }, props.items.map((item) => h('button', { type: 'button', onClick: () => emit('select', item) }, [h('span', [item.category ? h('small', item.category) : null, h('strong', item.label), item.description ? h('em', item.description) : null]), h('i', { 'aria-hidden': 'true' }, '›')]))) }
})

export const AtlasAIAttachmentList = defineComponent({
  name: 'AtlasAIAttachmentList',
  emits: ['remove', 'retry'],
  props: { items: { type: Array as PropType<AtlasVueAIAttachmentItem[]>, required: true }, label: { type: String, default: '附件' }, removable: Boolean },
  setup(props, { emit }) {
    const size = (bytes?: number) => bytes === undefined ? '' : bytes < 1024 * 1024 ? `${Math.ceil(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`
    return () => h('ul', { class: 'atlas-ai-attachments', 'aria-label': props.label }, props.items.map((item) => h('li', { class: `is-${item.status ?? 'ready'}` }, [h('i', { 'aria-hidden': 'true' }, item.mediaType.includes('image') ? 'IMG' : item.mediaType.includes('pdf') ? 'PDF' : 'FILE'), h('span', [h('strong', item.name), h('small', item.status === 'uploading' ? '上传中' : item.status === 'failed' ? '上传失败' : size(item.size))]), item.status === 'failed' ? h('button', { type: 'button', onClick: () => emit('retry', item.id) }, '重试') : null, props.removable ? h('button', { type: 'button', 'aria-label': `移除 ${item.name}`, onClick: () => emit('remove', item.id) }, '×') : null])))
  }
})

export const AtlasAIConversationHistory = defineComponent({
  name: 'AtlasAIConversationHistory',
  emits: ['update:activeId', 'create'],
  props: { items: { type: Array as PropType<AtlasVueAIHistoryItem[]>, required: true }, activeId: String, label: { type: String, default: '会话历史' }, creatable: Boolean },
  setup(props, { emit }) { return () => h('nav', { class: 'atlas-ai-history', 'aria-label': props.label }, [props.creatable ? h(AtlasButton, { intent: 'primary', size: 'compact', onClick: () => emit('create') }, () => '新建会话') : null, h('div', props.items.map((item) => h('button', { type: 'button', class: item.id === props.activeId ? 'is-active' : undefined, 'aria-current': item.id === props.activeId ? 'page' : undefined, onClick: () => emit('update:activeId', item.id) }, [h('span', [h('strong', [item.pinned ? h('i', { role: 'img', 'aria-label': '已置顶' }, '·') : null, item.title]), item.preview ? h('small', item.preview) : null]), item.updatedAt ? h('time', item.updatedAt) : null])))]) }
})

export const AtlasAIFeedback = defineComponent({
  name: 'AtlasAIFeedback',
  emits: ['update:modelValue', 'report'],
  props: { modelValue: { type: String, default: null }, label: { type: String, default: '评价此回答' }, reportable: Boolean },
  setup(props, { emit }) { return () => h('div', { class: 'atlas-ai-feedback', role: 'group', 'aria-label': props.label }, [h('button', { type: 'button', 'aria-pressed': props.modelValue === 'helpful', onClick: () => emit('update:modelValue', 'helpful') }, '有帮助'), h('button', { type: 'button', 'aria-pressed': props.modelValue === 'unhelpful', onClick: () => emit('update:modelValue', 'unhelpful') }, '需改进'), props.reportable ? h('button', { type: 'button', onClick: () => emit('report') }, '反馈问题') : null]) }
})

export const AtlasMCPServerPicker = defineComponent({
  name: 'AtlasMCPServerPicker',
  emits: ['update:modelValue', 'add'],
  props: { servers: { type: Array as PropType<AtlasVueMCPServerItem[]>, required: true }, modelValue: { type: Array as PropType<string[]>, default: () => [] }, label: { type: String, default: 'MCP Servers' }, addable: Boolean },
  setup(props, { emit }) {
    const toggle = (id: string) => emit('update:modelValue', props.modelValue.includes(id) ? props.modelValue.filter((item) => item !== id) : [...props.modelValue, id])
    return () => h('section', { class: 'atlas-mcp-picker', 'aria-label': props.label }, [h('header', [h('div', [h('strong', props.label), h('small', `${props.modelValue.length} 个已授权`)]), props.addable ? h(AtlasButton, { size: 'compact', onClick: () => emit('add') }, () => '添加') : null]), h('div', props.servers.map((server) => h('label', { class: `is-${server.status}` }, [h('input', { type: 'checkbox', checked: props.modelValue.includes(server.id), disabled: server.status !== 'connected', onChange: () => toggle(server.id) }), h('span', [h('strong', server.name), h('small', server.description ?? `${server.toolCount ?? 0} 个工具`)]), h('em', server.transport ?? 'stdio'), h('i', { role: 'img', 'aria-label': `连接状态：${server.status === 'connected' ? '已连接' : server.status === 'error' ? '异常' : '未连接'}` })])))])
  }
})

export const AtlasCitationList = defineComponent({
  name: 'AtlasCitationList',
  emits: ['open'],
  props: { items: { type: Array as PropType<AtlasVueAICitationItem[]>, required: true }, label: { type: String, default: '引用来源' }, interactive: Boolean },
  setup(props, { emit }) {
    return () => h('ol', { class: 'atlas-citation-list', 'aria-label': props.label }, props.items.map((item, index) =>
      h('li', [h('button', { type: 'button', disabled: !props.interactive && !item.url, onClick: () => emit('open', item) }, [
        h('b', index + 1),
        h('span', [h('strong', item.title), h('small', `${item.source ?? ''}${item.confidence !== undefined ? ` · 相关度 ${Math.round(item.confidence * 100)}%` : ''}`), item.excerpt ? h('em', item.excerpt) : null])
      ])])
    ))
  }
})

export const AtlasKnowledgeSourcePicker = defineComponent({
  name: 'AtlasKnowledgeSourcePicker',
  emits: ['update:modelValue'],
  props: { sources: { type: Array as PropType<AtlasVueKnowledgeSourceItem[]>, required: true }, modelValue: { type: Array as PropType<string[]>, default: () => [] }, label: { type: String, default: '知识来源' } },
  setup(props, { emit }) {
    const toggle = (id: string) => emit('update:modelValue', props.modelValue.includes(id) ? props.modelValue.filter((item) => item !== id) : [...props.modelValue, id])
    return () => h('fieldset', { class: 'atlas-knowledge-sources' }, [h('legend', [props.label, h('small', `${props.modelValue.length} / ${props.sources.length}`)]), ...props.sources.map((source) => h('label', { class: `is-${source.status ?? 'ready'}` }, [h('input', { type: 'checkbox', checked: props.modelValue.includes(source.id), disabled: source.status === 'error', onChange: () => toggle(source.id) }), h('i', { 'aria-hidden': 'true' }, source.type.slice(0, 1).toUpperCase()), h('span', [h('strong', source.name), h('small', `${source.scope ?? source.type}${source.count !== undefined ? ` · ${source.count} 项` : ''}`)]), h('em', source.status === 'syncing' ? '同步中' : source.status === 'error' ? '异常' : '就绪')]))])
  }
})

export const AtlasRetrievalTrace = defineComponent({
  name: 'AtlasRetrievalTrace',
  props: { steps: { type: Array as PropType<AtlasVueRetrievalStep[]>, required: true }, title: { type: String, default: '检索轨迹' } },
  setup(props) { return () => h('section', { class: 'atlas-retrieval-trace' }, [h('header', [h('strong', props.title), h('small', `${props.steps.filter((step) => step.status === 'completed').length} / ${props.steps.length} 完成`)]), h('ol', props.steps.map((step, index) => h('li', { class: `is-${step.status}` }, [h('i', step.status === 'completed' ? '✓' : index + 1), h('span', [h('strong', step.title), step.detail ? h('small', step.detail) : null]), step.durationMs !== undefined ? h('time', `${step.durationMs} ms`) : null])))]) }
})

export const AtlasToolCallCard = defineComponent({
  name: 'AtlasToolCallCard',
  emits: ['approve', 'reject', 'retry'],
  props: { call: { type: Object as PropType<AtlasVueToolCallItem>, required: true } },
  setup(props, { emit }) {
    const expanded = ref(false)
    return () => h('article', { class: ['atlas-tool-call', `is-${props.call.status}`] }, [h('header', [h('i', { 'aria-hidden': 'true' }, props.call.status === 'completed' ? '✓' : props.call.status === 'failed' ? '!' : props.call.permission === 'read' ? 'R' : 'T'), h('span', [h('strong', props.call.name), props.call.description ? h('small', props.call.description) : null]), h(AtlasTag, { intent: props.call.permission === 'high-risk' ? 'warning' : props.call.permission === 'write' ? 'primary' : 'neutral' }, () => props.call.permission)]), props.call.input !== undefined || props.call.result !== undefined ? [h('button', { type: 'button', class: 'atlas-tool-details-toggle', 'aria-expanded': expanded.value, onClick: () => { expanded.value = !expanded.value } }, expanded.value ? '收起详情' : '查看输入与结果'), expanded.value ? h('pre', JSON.stringify({ input: props.call.input, result: props.call.result }, null, 2)) : null] : null, props.call.status === 'approval' ? h('footer', [h(AtlasButton, { size: 'compact', onClick: () => emit('reject', props.call.id) }, () => '拒绝'), h(AtlasButton, { size: 'compact', intent: 'primary', onClick: () => emit('approve', props.call.id) }, () => '批准执行')]) : null, props.call.status === 'failed' ? h('footer', [h(AtlasButton, { size: 'compact', onClick: () => emit('retry', props.call.id) }, () => '重试')]) : null, props.call.durationMs !== undefined ? h('time', `${props.call.durationMs} ms`) : null])
  }
})

export const AtlasAIArtifactRenderer = defineComponent({
  name: 'AtlasAIArtifactRenderer',
  props: { artifact: { type: Object as PropType<AtlasAIArtifactContract>, required: true }, renderers: { type: Object as PropType<Partial<Record<AtlasAIArtifactContract['type'], (artifact: AtlasAIArtifactContract) => unknown>>>, default: () => ({}) } },
  setup(props, { slots }) {
    return () => {
      const artifact = props.artifact
      const rows = (artifact.rows ?? []).map((row, index) => ({ ...row, id: String(row.id ?? `${artifact.id}-${index}`) }))
      const columns = (artifact.columns ?? Object.keys(rows[0] ?? {}).filter((key) => key !== 'id').map((key) => ({ key, title: key }))).map((column) => ({ key: column.key, title: column.title }))
      let content = props.renderers[artifact.type]?.(artifact) ?? slots.default?.({ artifact })
      if (!content && artifact.type === 'code') content = h('pre', [h('code', { 'data-language': artifact.language }, artifact.content ?? '')])
      if (!content && artifact.type === 'json') content = h('pre', [h('code', artifact.content ?? '{}')])
      if (!content && (artifact.type === 'text' || artifact.type === 'markdown')) content = h('div', { class: 'atlas-ai-artifact-text' }, (artifact.content ?? '').split(/\n{2,}/).map((paragraph) => h('p', paragraph)))
      if (!content && artifact.type === 'table') content = h(AtlasTable, { caption: artifact.title ?? 'AI 生成表格', columns, rows })
      if (!content && artifact.type === 'chart') {
        const max = Math.max(1, ...(artifact.values ?? []).map((item) => item.value))
        content = h('div', { class: 'atlas-ai-artifact-chart', role: 'img', 'aria-label': artifact.title ?? 'AI 生成图表' }, artifact.values?.map((item) => h('div', [h('span', item.label), h('i', { style: { '--atlas-artifact-value': `${Math.max(0, item.value) / max * 100}%` } }), h('b', item.value)])))
      }
      if (!content && artifact.type === 'file' && artifact.file) content = h('a', { class: 'atlas-ai-artifact-file', href: artifact.file.url, download: artifact.file.name }, [h('strong', artifact.file.name), h('span', `${artifact.file.mediaType ?? '文件'}${artifact.file.size ? ` · ${Math.ceil(artifact.file.size / 1024)} KB` : ''}`)])
      return h('article', { class: ['atlas-ai-artifact', `is-${artifact.type}`] }, [h('header', [h('div', [h('small', `AI Artifact · ${artifact.type}`), artifact.title ? h('h3', artifact.title) : null, artifact.description ? h('p', artifact.description) : null]), slots.actions?.()]), h('div', { class: 'atlas-ai-artifact-body' }, content as never)])
    }
  }
})

export const AtlasAIStructuredInput = defineComponent({
  name: 'AtlasAIStructuredInput',
  emits: ['update:modelValue', 'submit'],
  props: { fields: { type: Array as PropType<AtlasAIStructuredFieldContract[]>, required: true }, modelValue: { type: Object as PropType<Record<string, AtlasFieldValue>>, required: true }, busy: Boolean, submitLabel: { type: String, default: '生成' } },
  setup(props, { emit }) {
    const update = (name: string, value: AtlasFieldValue) => emit('update:modelValue', { ...props.modelValue, [name]: value })
    return () => h(AtlasForm, { class: 'atlas-ai-structured-input', schema: Object.fromEntries(props.fields.map((field) => [field.name, field.rules ?? []])), busy: props.busy, onSubmit: () => emit('submit', props.modelValue) }, () => [
      ...props.fields.map((field) => {
        if (field.type === 'textarea') return h(AtlasTextarea, { name: field.name, label: field.label, hint: field.description, placeholder: field.placeholder, modelValue: String(props.modelValue[field.name] ?? ''), 'onUpdate:modelValue': (value: string) => update(field.name, value) })
        if (field.type === 'select') return h(AtlasSelect, { name: field.name, label: field.label, hint: field.description, options: field.options ?? [], modelValue: String(props.modelValue[field.name] ?? ''), 'onUpdate:modelValue': (value: string) => update(field.name, value) })
        if (field.type === 'boolean') return h(AtlasCheckbox, { name: field.name, label: field.label, modelValue: Boolean(props.modelValue[field.name]), 'onUpdate:modelValue': (value: boolean) => update(field.name, value) })
        if (field.type === 'date') return h(AtlasDateInput, { name: field.name, label: field.label, hint: field.description, modelValue: String(props.modelValue[field.name] ?? ''), 'onUpdate:modelValue': (value: string) => update(field.name, value) })
        return h(AtlasInput, { name: field.name, type: field.type === 'number' ? 'number' : 'text', label: field.label, hint: field.description, placeholder: field.placeholder, modelValue: String(props.modelValue[field.name] ?? ''), 'onUpdate:modelValue': (value: string) => update(field.name, field.type === 'number' ? Number(value) : value) })
      }),
      h('footer', [h(AtlasButton, { type: 'submit', intent: 'primary', loading: props.busy }, () => props.submitLabel)])
    ])
  }
})

export const AtlasAIProvenance = defineComponent({
  name: 'AtlasAIProvenance',
  props: { provenance: { type: Object as PropType<AtlasAIProvenanceContract>, required: true }, defaultOpen: Boolean },
  setup(props) {
    return () => h('details', { class: 'atlas-ai-provenance', open: props.defaultOpen }, [h('summary', [h('span', [h('strong', 'AI 生成依据'), h('small', `${props.provenance.provider ? `${props.provenance.provider} / ` : ''}${props.provenance.model}`)]), props.provenance.confidence !== undefined ? h(AtlasStatusTag, { tone: props.provenance.confidence >= .8 ? 'success' : props.provenance.confidence >= .6 ? 'warning' : 'danger' }, () => `${Math.round(props.provenance.confidence! * 100)}% 置信度`) : null]), h('dl', [h('div', [h('dt', '生成时间'), h('dd', props.provenance.generatedAt)]), h('div', [h('dt', 'Trace ID'), h('dd', [h('code', props.provenance.traceId)])]), h('div', [h('dt', '引用来源'), h('dd', props.provenance.sourceIds?.join('、') || '无外部来源')]), h('div', [h('dt', '策略'), h('dd', props.provenance.policyIds?.join('、') || '默认策略')]), props.provenance.cost ? h('div', [h('dt', '成本'), h('dd', `${props.provenance.cost.inputTokens ?? 0} + ${props.provenance.cost.outputTokens ?? 0} tokens${props.provenance.cost.amount !== undefined ? ` · ${props.provenance.cost.currency ?? 'USD'} ${props.provenance.cost.amount.toFixed(4)}` : ''}`)]) : null, props.provenance.reviewedBy ? h('div', [h('dt', '人工复核'), h('dd', props.provenance.reviewedBy)]) : null])])
  }
})

export const AtlasGenUIRenderer = defineComponent({
  name: 'AtlasGenUIRenderer',
  emits: ['action'],
  props: { schema: { type: Object as PropType<AtlasGenUINodeContract>, required: true } },
  setup(props, { emit }) {
    const renderNode = (node: AtlasGenUINodeContract): unknown => {
      const children = node.children?.map(renderNode) as never
      if (node.type === 'stack') return h('section', { class: 'atlas-genui-stack', 'data-genui-id': node.id }, children)
      if (node.type === 'panel') return h(AtlasPanel, { title: node.title }, () => [node.text ? h('p', node.text) : null, children])
      if (node.type === 'text') return h('p', { class: 'atlas-genui-text' }, node.text)
      if (node.type === 'metric') return h(AtlasStatistic, { label: node.title ?? '', value: node.value ?? '-', suffix: node.suffix })
      if (node.type === 'action') return h(AtlasButton, { intent: 'primary', onClick: () => node.actionId && emit('action', node.actionId, node) }, () => node.actionLabel)
      if ((node.type === 'table' || node.type === 'artifact') && node.artifact) return h(AtlasAIArtifactRenderer, { artifact: node.artifact })
      return null
    }
    return () => {
      const validation = validateAtlasGenUISchema(props.schema)
      return validation.valid ? h('section', { class: 'atlas-genui', 'aria-label': 'AI 生成界面', 'data-node-count': validation.nodeCount }, renderNode(props.schema) as never) : h(AtlasAlert, { intent: 'danger', title: '生成式 UI 未通过安全校验', description: validation.issues.join('；') })
    }
  }
})

export const AtlasMCPToolPanel = defineComponent({
  name: 'AtlasMCPToolPanel',
  emits: ['update:modelValue', 'approve'],
  props: { tools: { type: Array as PropType<AtlasMCPToolContract[]>, required: true }, modelValue: { type: Array as PropType<string[]>, default: () => [] }, label: { type: String, default: 'MCP 工具' } },
  setup(props, { emit }) {
    const query = ref('')
    const permission = ref<AtlasMCPToolContract['permission'] | ''>('')
    const visible = computed(() => filterAtlasMCPTools(props.tools, query.value, permission.value || undefined))
    const toggle = (id: string) => emit('update:modelValue', props.modelValue.includes(id) ? props.modelValue.filter((item) => item !== id) : [...props.modelValue, id])
    return () => h('section', { class: 'atlas-mcp-tool-panel', 'aria-label': props.label }, [
      h('header', [h('div', [h('strong', props.label), h('small', `${props.modelValue.length} 个已授权`)]), h(AtlasStatusTag, { tone: 'primary' }, () => `${props.tools.length} tools`)]),
      h('div', { class: 'atlas-mcp-tool-filters' }, [
        h(AtlasSearchInput, { modelValue: query.value, placeholder: '搜索工具', 'onUpdate:modelValue': (value: string) => { query.value = value }, onSearch: (value: string) => { query.value = value } }),
        h(AtlasSelect, { 'aria-label': '权限筛选', modelValue: permission.value, options: [{ label: '全部权限', value: '' }, { label: '只读', value: 'read' }, { label: '写入', value: 'write' }, { label: '高风险', value: 'high-risk' }], 'onUpdate:modelValue': (value: AtlasMCPToolContract['permission'] | '') => { permission.value = value } })
      ]),
      h('ul', visible.value.map((tool) => h('li', { class: `is-${tool.status ?? 'available'}` }, [
        h(AtlasCheckbox, { label: tool.name, modelValue: props.modelValue.includes(tool.id), disabled: tool.status === 'disabled' || tool.status === 'error', 'onUpdate:modelValue': () => toggle(tool.id) }),
        h('span', [h('small', tool.serverId), tool.description ? h('p', tool.description) : null]),
        h(AtlasStatusTag, { tone: tool.permission === 'high-risk' ? 'warning' : tool.permission === 'write' ? 'primary' : 'neutral' }, () => tool.permission),
        tool.status === 'approval' ? h(AtlasButton, { size: 'compact', intent: 'primary', onClick: () => emit('approve', tool.id) }, () => '审批') : null
      ]))),
      visible.value.length === 0 ? h(AtlasEmpty, { title: '没有匹配的工具', description: '调整搜索词或权限范围。' }) : null
    ])
  }
})

export const AtlasCrossPageAgent = defineComponent({
  name: 'AtlasCrossPageAgent',
  emits: ['navigate', 'approve', 'stop'],
  props: { goal: { type: String, required: true }, currentRoute: { type: String, required: true }, routes: { type: Array as PropType<Array<{ path: string; label: string }>>, required: true }, steps: { type: Array as PropType<AtlasCrossPageStepContract[]>, required: true }, status: { type: String, default: 'running' }, stoppable: Boolean },
  setup(props, { emit }) {
    return () => h('section', { class: 'atlas-cross-page-agent' }, [h('header', [h('span', [h(AtlasOrb, { state: props.status, size: 42 }), h('span', [h('small', '跨页面 Agent'), h('strong', props.goal)])]), props.stoppable ? h(AtlasButton, { size: 'compact', onClick: () => emit('stop') }, () => '停止') : null]), h('nav', { 'aria-label': 'Agent 页面路径' }, props.routes.map((route) => h('button', { type: 'button', 'aria-current': route.path === props.currentRoute ? 'page' : undefined, onClick: () => emit('navigate', route.path) }, [h('span', route.label), h('code', route.path)]))), h(AtlasExecutionPlan, { title: '跨页面执行计划', steps: props.steps, onApprove: (id: string) => emit('approve', id), onStop: props.stoppable ? () => emit('stop') : undefined })])
  }
})

export const AtlasEIDS = {
  install(app: { component(name: string, component: unknown): void }) {
    for (const component of [AtlasProvider, AtlasButton, AtlasInput, AtlasForm, AtlasSelect, AtlasCombobox, AtlasTextarea, AtlasCheckbox, AtlasRadioGroup, AtlasSwitch, AtlasDateInput, AtlasDateRange, AtlasUpload, AtlasSearchInput, AtlasCard, AtlasTabs, AtlasSegmentedControl, AtlasBreadcrumb, AtlasPagination, AtlasSteps, AtlasTable, AtlasDataGrid, AtlasTree, AtlasTag, AtlasObjectCell, AtlasStatusTag, AtlasRowActions, AtlasTableToolbar, AtlasDataTable, AtlasPageHeader, AtlasPanel, AtlasAppLayout, AtlasBadge, AtlasAvatar, AtlasStatistic, AtlasProgress, AtlasAlert, AtlasNotification, AtlasNotificationCenter, AtlasTooltip, AtlasEmpty, AtlasSkeleton, AtlasDialog, AtlasDrawer, AtlasDropdown, AtlasMenu, AtlasOrb, AtlasAIComposer, AtlasExecutionPlan, AtlasAIConversation, AtlasAIMessageBubble, AtlasAIStreamingText, AtlasAIPrompts, AtlasAIAttachmentList, AtlasAIConversationHistory, AtlasAIFeedback, AtlasMCPServerPicker, AtlasCitationList, AtlasKnowledgeSourcePicker, AtlasRetrievalTrace, AtlasToolCallCard, AtlasAIArtifactRenderer, AtlasAIStructuredInput, AtlasAIProvenance, AtlasGenUIRenderer, AtlasMCPToolPanel, AtlasCrossPageAgent]) app.component(component.name!, component)
  }
}
