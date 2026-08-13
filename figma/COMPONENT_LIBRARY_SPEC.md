# Atlas EIDS Figma 组件库规范

## 文件结构

| 页面 | 内容 | 规则 |
| --- | --- | --- |
| `00 Foundations` | Color、Typography、Spacing、Radius、Elevation、Motion | 只绑定 Variables 或 Styles |
| `01 Core` | Button、Input、Select、Form、Combobox、Tree、Upload、DateRange、Menu | Variant 名与代码 Props 对齐 |
| `02 Enterprise` | DataTable、DataGrid、AppLayout、Dialog、Drawer、Notification | 使用 Auto Layout 和内容约束 |
| `03 AI Native` | Living Orb、Composer、Artifact、Provenance、GenUI、MCP、Cross-page Agent | Orb 只表达 AI 身份与运行状态 |
| `04 Patterns` | 26 个 Recipe 的关键页面区域 | 组合组件，不复制内部组件 |

## Variables

- Collection 固定为 Global、Semantic、Component、State。
- Semantic、Component、State 使用 Light/Dark 两种 Mode；Global 使用 Value Mode。
- 颜色和数值使用 Variable；Shadow、Typography、Motion 使用对应 Style 或字符串交接值。
- Variable 名使用 `/` 分层，Code Syntax 使用生成的 `--atlas-*` CSS Variable。

## Component Set

- 基础组件至少覆盖 Size、State、Intent、Density、Theme；AI 组件额外覆盖 AI State。
- 控件圆角默认 `6px`，Panel `8px`，Overlay `10px`，不在实例内任意修改。
- 所有文本、图标、容器使用 Auto Layout；表格、导航和工作区使用固定轨道或 Min/Max 约束。
- 组件描述必须写清任务、语义边界、禁用场景和无障碍要求。
- React/Vue 不同的事件名称不映射成视觉 Variant，只记录在 Code Connect 示例中。

## 发布门槛

- 组件名覆盖 `component-mapping.json` 的全部条目。
- 关键状态含 Default、Hover、Focus、Active、Disabled、Loading、Error、Empty。
- Light/Dark、Compact/Standard/Comfortable 与中英文均完成抽样检查。
- Code Connect 只能使用已发布组件的真实 URL 和 `node-id`。
