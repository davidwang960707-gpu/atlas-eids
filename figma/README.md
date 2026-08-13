# Figma 交付资产

本目录把 Atlas EIDS 的 DTCG Tokens、组件视觉契约与 Figma 组件节点连接成一条可审计链路。代码仓库仍是事实源，Figma 不维护第二套颜色、间距或组件命名。

## 已交付

- `atlas-eids.variables.json`：由 DTCG 2025.10 Token 源自动生成，包含 Global、Semantic、Component、State 四个 Collection。
- `COMPONENT_LIBRARY_SPEC.md`：Figma Variables、组件集、Variant、Auto Layout 和主题模式规范。
- `code-connect/component-mapping.json`：React/Vue 组件与 Figma 组件名的一对一映射清单。
- `figma.config.json`：Code Connect CLI 扫描配置。

```bash
npm run build:figma
npm run test:figma
```

## 发布边界

正式 Variables、Team Library 和 Code Connect 发布必须满足两个外部条件：当前账号对目标 Figma 文件具有编辑权限；订阅计划支持发布组件库与 Code Connect。没有真实 `node-id` 时，仓库明确保留 `figmaNodeUrl: null`，禁止写入伪造 URL。

具备权限后按以下顺序执行：

1. 将 `atlas-eids.variables.json` 同步到 Figma Variables，建立 Light/Dark Modes。
2. 按 `COMPONENT_LIBRARY_SPEC.md` 建立 Foundations、Core、Enterprise、AI 四组组件页并发布 Library。
3. 将发布后的组件 URL 写入 `code-connect/component-mapping.json`。
4. 基于真实 URL 生成 `.figma.tsx`，执行 `npx figma connect publish`。
5. 运行 `npm run test:figma`，确保连接数量、组件名和代码导出仍一致。
