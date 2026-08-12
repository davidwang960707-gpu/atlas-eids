---
name: atlas-cli
description: 使用 Atlas CLI 创建或升级 React/Vue 企业应用、生成页面、规划 Agent 页面、查询设计知识并校验源码；涉及 7 种应用框架、第三方 Adapter、Java Client 或模板差异预览时使用。
---

# Atlas CLI

## 创建应用

```bash
npm run atlas -- create atlas-console \
  --framework react \
  --framework-layout tenant \
  --template workbench \
  --density standard \
  --locale zh-CN \
  --adapter native \
  --backend java
```

npm packages 尚未发布到 Registry 时，在仓库中追加 `--local`，让生成项目使用本地 `file:` 依赖。不要向用户提供当前不可安装的 `npm install @atlas-eids/*` 命令。

支持 7 种框架、React/Vue、权限菜单、主题、多租户和 Java API Client。Adapter 组合为：React 支持 `native|antd`，Vue 支持 `native|tdesign|opentiny`；不要生成不兼容的框架/Adapter 组合。

`create --template` 和 `generate page` 当前支持 15 个 Blueprint；先运行 `npm run atlas -- list pages` 获取真实列表。`examples/templates` 中额外的完整页面不自动等于 CLI Blueprint。

## Agent 开发闭环

```bash
npm run atlas -- agent plan "带权限范围和检索轨迹的知识库页面" --framework react --json
npm run atlas -- generate page ai-chat --framework react --out src/pages/KnowledgePage.tsx
npm run atlas -- validate src/pages/KnowledgePage.tsx --framework react --ai
```

如果规划结果不是当前 Blueprint，选择最接近的可生成模式作为骨架，再按规划结果实现业务区域；不要把不存在的模板 ID 传给生成命令。

## 知识查询

```bash
npm run atlas -- knowledge components ToolCall
npm run atlas -- knowledge patterns Agent
```

## 升级

先执行 `npm run atlas -- upgrade . --dry-run` 查看 `create`、`update`、`conflict`、`unchanged` 差异。CLI 会保护已被项目修改的生成文件；只有审核每个冲突后才使用 `--force`。

## 完成定义

- 生成应用包含可运行路由、菜单权限、主题、租户上下文和所选 Adapter；选择 Java 时验证类型化 Client 与认证请求。
- 生成页面接入真实数据契约，并补齐 Loading、Empty、Error、Disabled、权限和响应式状态。
- 运行 `atlas_validate_page` 或 CLI `validate`，修复所有 error。
- 继续执行目标项目构建、交互测试、A11y、E2E 和桌面/移动视觉检查；视觉规则读取 `../atlas-eids-design-system/references/visual-quality.md`。
