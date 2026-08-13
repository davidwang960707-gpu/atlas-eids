# Code Connect

`component-mapping.json` 是 Code Connect 的连接登记表，不是假装已发布的连接文件。它保证 67 个公共导出在 React、Vue 与 Figma 组件命名之间有唯一映射。

当 Figma Library 已发布后，为每个组件填写真实 `figmaNodeUrl`，把 `status` 改为 `connected`，再生成 `.figma.tsx`。连接文件应：

- 从 `@atlas-eids/react` 或 `@atlas-eids/vue` 导入公共组件。
- 使用 Figma Variant Property 映射公开 Props，避免映射内部实现类名。
- 用真实组件 URL，不使用占位 file key 或 node id。
- React 与 Vue 示例保持相同语义和默认状态。

当前 Figma Starter/View 账号不能完成 Library 与 Code Connect 发布；仓库侧 Variables、组件规范和映射契约已就绪，外部发布状态保留为 `awaiting-published-node`。
