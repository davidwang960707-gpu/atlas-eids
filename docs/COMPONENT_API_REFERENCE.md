# Component API Reference

此文档由 React / Vue TypeScript 导出自动生成。组件说明来自设计系统清单，属性签名以当前源码类型为准，请勿手工编辑。

| Component | Category | React | Vue | Typed Props |
| --- | --- | --- | --- | ---: |
| `AtlasProvider` | 基础 | Yes | Yes | 4 |
| `AtlasButton` | 操作与输入 | Yes | Yes | 48 |
| `AtlasInput` | 操作与输入 | Yes | Yes | 48 |
| `AtlasTextarea` | 操作与输入 | Yes | Yes | 48 |
| `AtlasSelect` | 操作与输入 | Yes | Yes | 48 |
| `AtlasCheckbox` | 操作与输入 | Yes | Yes | 5 |
| `AtlasRadioGroup` | 操作与输入 | Yes | Yes | 5 |
| `AtlasSwitch` | 操作与输入 | Yes | Yes | 4 |
| `AtlasDateInput` | 操作与输入 | Yes | Yes | 48 |
| `AtlasSearchInput` | 操作与输入 | Yes | Yes | 5 |
| `AtlasSegmentedControl` | 操作与输入 | Yes | Yes | 4 |
| `AtlasTabs` | 导航 | Yes | Yes | 4 |
| `AtlasBreadcrumb` | 导航 | Yes | Yes | 2 |
| `AtlasPagination` | 导航 | Yes | Yes | 4 |
| `AtlasSteps` | 导航 | Yes | Yes | 2 |
| `AtlasDropdown` | 导航 | Yes | Yes | 3 |
| `AtlasCard` | 数据展示 | Yes | Yes | 48 |
| `AtlasTable` | 数据展示 | Yes | Yes | 5 |
| `AtlasTag` | 数据展示 | Yes | Yes | 4 |
| `AtlasBadge` | 数据展示 | Yes | Yes | 4 |
| `AtlasAvatar` | 数据展示 | Yes | Yes | 3 |
| `AtlasStatistic` | 数据展示 | Yes | Yes | 5 |
| `AtlasProgress` | 数据展示 | Yes | Yes | 3 |
| `AtlasAlert` | 反馈与浮层 | Yes | Yes | 5 |
| `AtlasTooltip` | 反馈与浮层 | Yes | Yes | 2 |
| `AtlasEmpty` | 反馈与浮层 | Yes | Yes | 3 |
| `AtlasSkeleton` | 反馈与浮层 | Yes | Yes | 2 |
| `AtlasDialog` | 反馈与浮层 | Yes | Yes | 5 |
| `AtlasDrawer` | 反馈与浮层 | Yes | Yes | 6 |
| `AtlasOrb` | AI 原生 | Yes | Yes | 48 |
| `AtlasAIComposer` | AI 原生 | Yes | Yes | 7 |
| `AtlasExecutionPlan` | AI 原生 | Yes | Yes | 4 |

## AtlasProvider

为组件树提供主题、密度与语言上下文。

| Prop | Type | Optional |
| --- | --- | --- |
| `theme` | `"light" \| "dark"` | Yes |
| `density` | `"compact" \| "standard" \| "comfortable"` | Yes |
| `locale` | `"zh-CN" \| "en-US"` | Yes |
| `children` | `ReactNode` | No |

## AtlasButton

企业级命令按钮，支持意图、尺寸和加载状态。

| Prop | Type | Optional |
| --- | --- | --- |
| `intent` | `"neutral" \| "primary" \| "danger"` | Yes |
| `size` | `"compact" \| "comfortable" \| "default"` | Yes |
| `loading` | `boolean` | Yes |
| `disabled` | `boolean` | Yes |
| `form` | `string` | Yes |
| `formAction` | `string \| ((formData: FormData) => void \| Promise<void>)` | Yes |
| `formEncType` | `string` | Yes |
| `formMethod` | `string` | Yes |
| `formNoValidate` | `boolean` | Yes |
| `formTarget` | `string` | Yes |
| `name` | `string` | Yes |
| `type` | `"submit" \| "reset" \| "button"` | Yes |
| `value` | `string \| number \| readonly string[]` | Yes |
| `defaultChecked` | `boolean` | Yes |
| `defaultValue` | `string \| number \| readonly string[]` | Yes |
| `suppressContentEditableWarning` | `boolean` | Yes |
| `suppressHydrationWarning` | `boolean` | Yes |
| `accessKey` | `string` | Yes |
| `autoCapitalize` | `"off" \| "none" \| "on" \| "sentences" \| "words" \| "characters" \| (string & {})` | Yes |
| `autoFocus` | `boolean` | Yes |
| `className` | `string` | Yes |
| `contentEditable` | `Booleanish \| "inherit" \| "plaintext-only"` | Yes |
| `contextMenu` | `string` | Yes |
| `dir` | `string` | Yes |
| `draggable` | `Booleanish` | Yes |
| `enterKeyHint` | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send"` | Yes |
| `hidden` | `boolean` | Yes |
| `id` | `string` | Yes |
| `lang` | `string` | Yes |
| `nonce` | `string` | Yes |
| `slot` | `string` | Yes |
| `spellCheck` | `Booleanish` | Yes |
| `style` | `CSSProperties` | Yes |
| `tabIndex` | `number` | Yes |
| `title` | `string` | Yes |
| `translate` | `"yes" \| "no"` | Yes |
| `radioGroup` | `string` | Yes |
| `role` | `AriaRole` | Yes |
| `about` | `string` | Yes |
| `content` | `string` | Yes |
| `datatype` | `string` | Yes |
| `inlist` | `any` | Yes |
| `prefix` | `string` | Yes |
| `property` | `string` | Yes |
| `rel` | `string` | Yes |
| `resource` | `string` | Yes |
| `rev` | `string` | Yes |
| `typeof` | `string` | Yes |

## AtlasInput

带标签、辅助信息和校验反馈的文本输入。

| Prop | Type | Optional |
| --- | --- | --- |
| `label` | `string` | Yes |
| `hint` | `string` | Yes |
| `error` | `string` | Yes |
| `accept` | `string` | Yes |
| `alt` | `string` | Yes |
| `autoComplete` | `HTMLInputAutoCompleteAttribute` | Yes |
| `capture` | `boolean \| "user" \| "environment"` | Yes |
| `checked` | `boolean` | Yes |
| `disabled` | `boolean` | Yes |
| `form` | `string` | Yes |
| `formAction` | `string \| ((formData: FormData) => void \| Promise<void>)` | Yes |
| `formEncType` | `string` | Yes |
| `formMethod` | `string` | Yes |
| `formNoValidate` | `boolean` | Yes |
| `formTarget` | `string` | Yes |
| `height` | `string \| number` | Yes |
| `list` | `string` | Yes |
| `max` | `string \| number` | Yes |
| `maxLength` | `number` | Yes |
| `min` | `string \| number` | Yes |
| `minLength` | `number` | Yes |
| `multiple` | `boolean` | Yes |
| `name` | `string` | Yes |
| `pattern` | `string` | Yes |
| `placeholder` | `string` | Yes |
| `readOnly` | `boolean` | Yes |
| `required` | `boolean` | Yes |
| `size` | `number` | Yes |
| `src` | `string` | Yes |
| `step` | `string \| number` | Yes |
| `type` | `HTMLInputTypeAttribute` | Yes |
| `value` | `string \| number \| readonly string[]` | Yes |
| `width` | `string \| number` | Yes |
| `onChange` | `ChangeEventHandler<HTMLInputElement, HTMLInputElement>` | Yes |
| `defaultChecked` | `boolean` | Yes |
| `defaultValue` | `string \| number \| readonly string[]` | Yes |
| `suppressContentEditableWarning` | `boolean` | Yes |
| `suppressHydrationWarning` | `boolean` | Yes |
| `accessKey` | `string` | Yes |
| `autoCapitalize` | `"off" \| "none" \| "on" \| "sentences" \| "words" \| "characters" \| (string & {})` | Yes |
| `autoFocus` | `boolean` | Yes |
| `className` | `string` | Yes |
| `contentEditable` | `Booleanish \| "inherit" \| "plaintext-only"` | Yes |
| `contextMenu` | `string` | Yes |
| `dir` | `string` | Yes |
| `draggable` | `Booleanish` | Yes |
| `enterKeyHint` | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send"` | Yes |
| `hidden` | `boolean` | Yes |

## AtlasTextarea

支持校验反馈的多行文本输入。

| Prop | Type | Optional |
| --- | --- | --- |
| `label` | `string` | Yes |
| `hint` | `string` | Yes |
| `error` | `string` | Yes |
| `autoComplete` | `string` | Yes |
| `cols` | `number` | Yes |
| `dirName` | `string` | Yes |
| `disabled` | `boolean` | Yes |
| `form` | `string` | Yes |
| `maxLength` | `number` | Yes |
| `minLength` | `number` | Yes |
| `name` | `string` | Yes |
| `placeholder` | `string` | Yes |
| `readOnly` | `boolean` | Yes |
| `required` | `boolean` | Yes |
| `rows` | `number` | Yes |
| `value` | `string \| number \| readonly string[]` | Yes |
| `wrap` | `string` | Yes |
| `onChange` | `ChangeEventHandler<HTMLTextAreaElement, HTMLTextAreaElement>` | Yes |
| `defaultChecked` | `boolean` | Yes |
| `defaultValue` | `string \| number \| readonly string[]` | Yes |
| `suppressContentEditableWarning` | `boolean` | Yes |
| `suppressHydrationWarning` | `boolean` | Yes |
| `accessKey` | `string` | Yes |
| `autoCapitalize` | `"off" \| "none" \| "on" \| "sentences" \| "words" \| "characters" \| (string & {})` | Yes |
| `autoFocus` | `boolean` | Yes |
| `className` | `string` | Yes |
| `contentEditable` | `Booleanish \| "inherit" \| "plaintext-only"` | Yes |
| `contextMenu` | `string` | Yes |
| `dir` | `string` | Yes |
| `draggable` | `Booleanish` | Yes |
| `enterKeyHint` | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send"` | Yes |
| `hidden` | `boolean` | Yes |
| `id` | `string` | Yes |
| `lang` | `string` | Yes |
| `nonce` | `string` | Yes |
| `slot` | `string` | Yes |
| `spellCheck` | `Booleanish` | Yes |
| `style` | `CSSProperties` | Yes |
| `tabIndex` | `number` | Yes |
| `title` | `string` | Yes |
| `translate` | `"yes" \| "no"` | Yes |
| `radioGroup` | `string` | Yes |
| `role` | `AriaRole` | Yes |
| `about` | `string` | Yes |
| `content` | `string` | Yes |
| `datatype` | `string` | Yes |
| `inlist` | `any` | Yes |
| `prefix` | `string` | Yes |

## AtlasSelect

带标签和辅助信息的选择控件。

| Prop | Type | Optional |
| --- | --- | --- |
| `label` | `string` | Yes |
| `hint` | `string` | Yes |
| `options` | `AtlasOption[]` | No |
| `autoComplete` | `string` | Yes |
| `disabled` | `boolean` | Yes |
| `form` | `string` | Yes |
| `multiple` | `boolean` | Yes |
| `name` | `string` | Yes |
| `required` | `boolean` | Yes |
| `size` | `number` | Yes |
| `value` | `string \| number \| readonly string[]` | Yes |
| `onChange` | `ChangeEventHandler<HTMLSelectElement, HTMLSelectElement>` | Yes |
| `defaultChecked` | `boolean` | Yes |
| `defaultValue` | `string \| number \| readonly string[]` | Yes |
| `suppressContentEditableWarning` | `boolean` | Yes |
| `suppressHydrationWarning` | `boolean` | Yes |
| `accessKey` | `string` | Yes |
| `autoCapitalize` | `"off" \| "none" \| "on" \| "sentences" \| "words" \| "characters" \| (string & {})` | Yes |
| `autoFocus` | `boolean` | Yes |
| `className` | `string` | Yes |
| `contentEditable` | `Booleanish \| "inherit" \| "plaintext-only"` | Yes |
| `contextMenu` | `string` | Yes |
| `dir` | `string` | Yes |
| `draggable` | `Booleanish` | Yes |
| `enterKeyHint` | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send"` | Yes |
| `hidden` | `boolean` | Yes |
| `id` | `string` | Yes |
| `lang` | `string` | Yes |
| `nonce` | `string` | Yes |
| `slot` | `string` | Yes |
| `spellCheck` | `Booleanish` | Yes |
| `style` | `CSSProperties` | Yes |
| `tabIndex` | `number` | Yes |
| `title` | `string` | Yes |
| `translate` | `"yes" \| "no"` | Yes |
| `radioGroup` | `string` | Yes |
| `role` | `AriaRole` | Yes |
| `about` | `string` | Yes |
| `content` | `string` | Yes |
| `datatype` | `string` | Yes |
| `inlist` | `any` | Yes |
| `prefix` | `string` | Yes |
| `property` | `string` | Yes |
| `rel` | `string` | Yes |
| `resource` | `string` | Yes |
| `rev` | `string` | Yes |
| `typeof` | `string` | Yes |
| `vocab` | `string` | Yes |

## AtlasCheckbox

支持半选状态的复选控件。

| Prop | Type | Optional |
| --- | --- | --- |
| `checked` | `boolean` | No |
| `indeterminate` | `boolean` | Yes |
| `label` | `ReactNode` | No |
| `onChange` | `(checked: boolean) => void` | No |
| `disabled` | `boolean` | Yes |

## AtlasRadioGroup

在一组选项中进行单选。

| Prop | Type | Optional |
| --- | --- | --- |
| `label` | `string` | No |
| `options` | `AtlasOption[]` | No |
| `value` | `string` | No |
| `onChange` | `(value: string) => void` | No |
| `disabled` | `boolean` | Yes |

## AtlasSwitch

用于即时启用或关闭设置。

| Prop | Type | Optional |
| --- | --- | --- |
| `checked` | `boolean` | No |
| `onChange` | `(checked: boolean) => void` | No |
| `label` | `string` | No |
| `disabled` | `boolean` | Yes |

## AtlasDateInput

使用 AtlasInput 语义的日期输入。

| Prop | Type | Optional |
| --- | --- | --- |
| `form` | `string` | Yes |
| `list` | `string` | Yes |
| `hint` | `string` | Yes |
| `step` | `string \| number` | Yes |
| `name` | `string` | Yes |
| `color` | `string` | Yes |
| `hidden` | `boolean` | Yes |
| `label` | `string` | Yes |
| `error` | `string` | Yes |
| `accept` | `string` | Yes |
| `alt` | `string` | Yes |
| `autoComplete` | `HTMLInputAutoCompleteAttribute` | Yes |
| `capture` | `boolean \| "user" \| "environment"` | Yes |
| `checked` | `boolean` | Yes |
| `disabled` | `boolean` | Yes |
| `formAction` | `string \| ((formData: FormData) => void \| Promise<void>)` | Yes |
| `formEncType` | `string` | Yes |
| `formMethod` | `string` | Yes |
| `formNoValidate` | `boolean` | Yes |
| `formTarget` | `string` | Yes |
| `height` | `string \| number` | Yes |
| `max` | `string \| number` | Yes |
| `maxLength` | `number` | Yes |
| `min` | `string \| number` | Yes |
| `minLength` | `number` | Yes |
| `multiple` | `boolean` | Yes |
| `pattern` | `string` | Yes |
| `placeholder` | `string` | Yes |
| `readOnly` | `boolean` | Yes |
| `required` | `boolean` | Yes |
| `size` | `number` | Yes |
| `src` | `string` | Yes |
| `value` | `string \| number \| readonly string[]` | Yes |
| `width` | `string \| number` | Yes |
| `onChange` | `ChangeEventHandler<HTMLInputElement, HTMLInputElement>` | Yes |
| `defaultChecked` | `boolean` | Yes |
| `defaultValue` | `string \| number \| readonly string[]` | Yes |
| `suppressContentEditableWarning` | `boolean` | Yes |
| `suppressHydrationWarning` | `boolean` | Yes |
| `accessKey` | `string` | Yes |
| `autoCapitalize` | `"off" \| "none" \| "on" \| "sentences" \| "words" \| "characters" \| (string & {})` | Yes |
| `autoFocus` | `boolean` | Yes |
| `className` | `string` | Yes |
| `contentEditable` | `Booleanish \| "inherit" \| "plaintext-only"` | Yes |
| `contextMenu` | `string` | Yes |
| `dir` | `string` | Yes |
| `draggable` | `Booleanish` | Yes |
| `enterKeyHint` | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send"` | Yes |

## AtlasSearchInput

带提交行为的紧凑搜索输入。

| Prop | Type | Optional |
| --- | --- | --- |
| `value` | `string` | No |
| `onChange` | `(value: string) => void` | No |
| `onSearch` | `(value: string) => void` | No |
| `placeholder` | `string` | Yes |
| `label` | `string` | Yes |

## AtlasSegmentedControl

在少量互斥模式间快速切换。

| Prop | Type | Optional |
| --- | --- | --- |
| `label` | `string` | No |
| `items` | `AtlasOption[]` | No |
| `value` | `string` | No |
| `onChange` | `(value: string) => void` | No |

## AtlasTabs

用于同一上下文内的视图切换。

| Prop | Type | Optional |
| --- | --- | --- |
| `items` | `AtlasTab[]` | No |
| `value` | `string` | No |
| `onChange` | `(id: string) => void` | No |
| `label` | `string` | Yes |

## AtlasBreadcrumb

表达页面层级并返回上级。

| Prop | Type | Optional |
| --- | --- | --- |
| `items` | `AtlasBreadcrumbItem[]` | No |
| `label` | `string` | Yes |

## AtlasPagination

用于长列表和表格的分页导航。

| Prop | Type | Optional |
| --- | --- | --- |
| `page` | `number` | No |
| `pageCount` | `number` | No |
| `onChange` | `(page: number) => void` | No |
| `label` | `string` | Yes |

## AtlasSteps

展示多步骤任务的进度和状态。

| Prop | Type | Optional |
| --- | --- | --- |
| `items` | `AtlasStep[]` | No |
| `label` | `string` | Yes |

## AtlasDropdown

在按钮后提供一组低频命令。

| Prop | Type | Optional |
| --- | --- | --- |
| `label` | `ReactNode` | No |
| `items` | `AtlasDropdownItem[]` | No |
| `onSelect` | `(id: string) => void` | No |

## AtlasCard

承载一个独立对象或一组紧密相关信息。

| Prop | Type | Optional |
| --- | --- | --- |
| `title` | `string` | Yes |
| `description` | `string` | Yes |
| `selected` | `boolean` | Yes |
| `actions` | `ReactNode` | Yes |
| `defaultChecked` | `boolean` | Yes |
| `defaultValue` | `string \| number \| readonly string[]` | Yes |
| `suppressContentEditableWarning` | `boolean` | Yes |
| `suppressHydrationWarning` | `boolean` | Yes |
| `accessKey` | `string` | Yes |
| `autoCapitalize` | `"off" \| "none" \| "on" \| "sentences" \| "words" \| "characters" \| (string & {})` | Yes |
| `autoFocus` | `boolean` | Yes |
| `className` | `string` | Yes |
| `contentEditable` | `Booleanish \| "inherit" \| "plaintext-only"` | Yes |
| `contextMenu` | `string` | Yes |
| `dir` | `string` | Yes |
| `draggable` | `Booleanish` | Yes |
| `enterKeyHint` | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send"` | Yes |
| `hidden` | `boolean` | Yes |
| `id` | `string` | Yes |
| `lang` | `string` | Yes |
| `nonce` | `string` | Yes |
| `slot` | `string` | Yes |
| `spellCheck` | `Booleanish` | Yes |
| `style` | `CSSProperties` | Yes |
| `tabIndex` | `number` | Yes |
| `translate` | `"yes" \| "no"` | Yes |
| `radioGroup` | `string` | Yes |
| `role` | `AriaRole` | Yes |
| `about` | `string` | Yes |
| `content` | `string` | Yes |
| `datatype` | `string` | Yes |
| `inlist` | `any` | Yes |
| `prefix` | `string` | Yes |
| `property` | `string` | Yes |
| `rel` | `string` | Yes |
| `resource` | `string` | Yes |
| `rev` | `string` | Yes |
| `typeof` | `string` | Yes |
| `vocab` | `string` | Yes |
| `autoCorrect` | `string` | Yes |
| `autoSave` | `string` | Yes |
| `color` | `string` | Yes |
| `itemProp` | `string` | Yes |
| `itemScope` | `boolean` | Yes |
| `itemType` | `string` | Yes |
| `itemID` | `string` | Yes |
| `itemRef` | `string` | Yes |
| `results` | `number` | Yes |

## AtlasTable

支持选择的数据表格。

| Prop | Type | Optional |
| --- | --- | --- |
| `columns` | `AtlasTableColumn<Row>[]` | No |
| `rows` | `Row[]` | No |
| `caption` | `string` | No |
| `selectedIds` | `(string \| number)[]` | Yes |
| `onSelect` | `(ids: Array<string \| number>) => void` | Yes |

## AtlasTag

表达分类、状态或可移除条件。

| Prop | Type | Optional |
| --- | --- | --- |
| `children` | `ReactNode` | No |
| `intent` | `"neutral" \| "primary" \| "danger" \| "success" \| "warning"` | Yes |
| `removable` | `boolean` | Yes |
| `onRemove` | `() => void` | Yes |

## AtlasBadge

在对象旁表达数量或提醒状态。

| Prop | Type | Optional |
| --- | --- | --- |
| `children` | `ReactNode` | No |
| `count` | `number` | Yes |
| `dot` | `boolean` | Yes |
| `intent` | `"primary" \| "danger" \| "success" \| "warning"` | Yes |

## AtlasAvatar

以图片或姓名首字展示人员身份。

| Prop | Type | Optional |
| --- | --- | --- |
| `name` | `string` | No |
| `src` | `string` | Yes |
| `size` | `number` | Yes |

## AtlasStatistic

展示关键指标和趋势变化。

| Prop | Type | Optional |
| --- | --- | --- |
| `label` | `string` | No |
| `value` | `string \| number` | No |
| `suffix` | `string` | Yes |
| `trend` | `"up" \| "down" \| "flat"` | Yes |
| `trendLabel` | `string` | Yes |

## AtlasProgress

展示可量化任务的完成进度。

| Prop | Type | Optional |
| --- | --- | --- |
| `value` | `number` | No |
| `label` | `string` | No |
| `intent` | `"primary" \| "danger" \| "success" \| "warning"` | Yes |

## AtlasAlert

显示需要用户注意的状态反馈。

| Prop | Type | Optional |
| --- | --- | --- |
| `title` | `string` | No |
| `description` | `string` | Yes |
| `intent` | `"danger" \| "success" \| "warning" \| "info"` | Yes |
| `closable` | `boolean` | Yes |
| `onClose` | `() => void` | Yes |

## AtlasTooltip

在悬停或聚焦时解释陌生控件。

| Prop | Type | Optional |
| --- | --- | --- |
| `content` | `string` | No |
| `children` | `ReactNode` | No |

## AtlasEmpty

为空数据或无结果状态提供下一步。

| Prop | Type | Optional |
| --- | --- | --- |
| `title` | `string` | No |
| `description` | `string` | Yes |
| `action` | `ReactNode` | Yes |

## AtlasSkeleton

在内容加载期间保持布局稳定。

| Prop | Type | Optional |
| --- | --- | --- |
| `lines` | `number` | Yes |
| `label` | `string` | Yes |

## AtlasDialog

用于需要集中决策的模态任务。

| Prop | Type | Optional |
| --- | --- | --- |
| `open` | `boolean` | No |
| `title` | `string` | No |
| `children` | `ReactNode` | No |
| `onClose` | `() => void` | No |
| `footer` | `ReactNode` | Yes |

## AtlasDrawer

在保留主页面上下文时查看或编辑详情。

| Prop | Type | Optional |
| --- | --- | --- |
| `open` | `boolean` | No |
| `title` | `string` | No |
| `children` | `ReactNode` | No |
| `onClose` | `() => void` | No |
| `width` | `number` | Yes |
| `footer` | `ReactNode` | Yes |

## AtlasOrb

表达 AI 存在感、状态与执行节奏的液态生命体。

| Prop | Type | Optional |
| --- | --- | --- |
| `state` | `"error" \| "idle" \| "thinking" \| "running"` | Yes |
| `size` | `number` | Yes |
| `label` | `string` | Yes |
| `showRing` | `boolean` | Yes |
| `defaultChecked` | `boolean` | Yes |
| `defaultValue` | `string \| number \| readonly string[]` | Yes |
| `suppressContentEditableWarning` | `boolean` | Yes |
| `suppressHydrationWarning` | `boolean` | Yes |
| `accessKey` | `string` | Yes |
| `autoCapitalize` | `"off" \| "none" \| "on" \| "sentences" \| "words" \| "characters" \| (string & {})` | Yes |
| `autoFocus` | `boolean` | Yes |
| `className` | `string` | Yes |
| `contentEditable` | `Booleanish \| "inherit" \| "plaintext-only"` | Yes |
| `contextMenu` | `string` | Yes |
| `dir` | `string` | Yes |
| `draggable` | `Booleanish` | Yes |
| `enterKeyHint` | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send"` | Yes |
| `hidden` | `boolean` | Yes |
| `id` | `string` | Yes |
| `lang` | `string` | Yes |
| `nonce` | `string` | Yes |
| `slot` | `string` | Yes |
| `spellCheck` | `Booleanish` | Yes |
| `style` | `CSSProperties` | Yes |
| `tabIndex` | `number` | Yes |
| `title` | `string` | Yes |
| `translate` | `"yes" \| "no"` | Yes |
| `radioGroup` | `string` | Yes |
| `role` | `AriaRole` | Yes |
| `about` | `string` | Yes |
| `content` | `string` | Yes |
| `datatype` | `string` | Yes |
| `inlist` | `any` | Yes |
| `prefix` | `string` | Yes |
| `property` | `string` | Yes |
| `rel` | `string` | Yes |
| `resource` | `string` | Yes |
| `rev` | `string` | Yes |
| `typeof` | `string` | Yes |
| `vocab` | `string` | Yes |
| `autoCorrect` | `string` | Yes |
| `autoSave` | `string` | Yes |
| `color` | `string` | Yes |
| `itemProp` | `string` | Yes |
| `itemScope` | `boolean` | Yes |
| `itemType` | `string` | Yes |
| `itemID` | `string` | Yes |
| `itemRef` | `string` | Yes |

## AtlasAIComposer

集上下文、推荐问题和提交于一体的 AI 输入。

| Prop | Type | Optional |
| --- | --- | --- |
| `value` | `string` | Yes |
| `placeholder` | `string` | Yes |
| `suggestions` | `string[]` | Yes |
| `busy` | `boolean` | Yes |
| `contexts` | `string[]` | Yes |
| `onChange` | `(value: string) => void` | Yes |
| `onSubmit` | `(value: string) => void` | No |

## AtlasExecutionPlan

展示 Agent 计划、步骤状态与人工审批。

| Prop | Type | Optional |
| --- | --- | --- |
| `title` | `string` | Yes |
| `steps` | `AtlasExecutionStep[]` | No |
| `onStop` | `() => void` | Yes |
| `onApprove` | `(id: string) => void` | Yes |
