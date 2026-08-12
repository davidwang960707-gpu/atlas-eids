# Packages 发布状态

## 当前状态

Atlas EIDS 当前发布候选为 `0.2.0-beta.2`。Monorepo 内 12 个公开 packages 已完成构建、测试、包体预检和 Changesets 发布准备；GitHub Beta Release 与 npm Registry 是两条独立发布链路。

在 npm Beta 包确认可见前，不要直接执行 `npm install @atlas-eids/react` 或 `npm install @atlas-eids/vue`。请先 Clone 仓库，并通过 CLI 的 `--local` 参数生成使用本地 `file:` 依赖的项目。

```bash
git clone https://github.com/davidwang960707-gpu/atlas-eids.git
cd atlas-eids
npm install
npm run atlas -- create atlas-workspace --framework react --template workbench --framework-layout tenant --density compact --adapter antd --backend java --local
```

Vue 项目使用：

```bash
npm run atlas -- create atlas-vue-workspace --framework vue --template data-list --backend none --local
```

## 为什么必须使用 `--local`

`--local` 会把生成项目中的 `@atlas-eids/tokens`、`@atlas-eids/react` 或 `@atlas-eids/vue` 指向当前 Workspace 的 package 目录。这样可以在发布 npm packages 之前完成组件、模板和 Java 后端的联调。

npm Beta 发布并完成全新目录安装验证后，CLI 默认会使用 Registry Beta 版本，届时可以移除 `--local`。在此之前，GitHub Release 中的源码和 tarball 资产不代表 npm Registry 已发布。

## 本地开发入口

| 能力 | 命令 | 默认地址 |
| --- | --- | --- |
| 15 个页面模板 | `npm run dev:templates` | `http://127.0.0.1:5176` |
| React Storybook | `npm run dev:storybook:react` | `http://127.0.0.1:6006` |
| Vue Storybook | `npm run dev:storybook:vue` | `http://127.0.0.1:6007` |
| React 示例 | `npm run dev:react` | Vite 提示的本地地址 |
| Vue 示例 | `npm run dev:vue` | Vite 提示的本地地址 |

## 已完成的发布准备

- Changesets 版本与 Changelog 流程。
- 手动触发的 Beta 发布 Workflow，并支持 npm Provenance。
- 12 个公开 package 的统一 Repository、Homepage、License、Exports 和 Public Access 元数据。
- `npm pack --dry-run` 包体、导出文件、体积和禁止文件检查。
- React / Vue 文档导出一致性与 React TypeScript Props 契约检查。
- React / Vue 31 个组件的 Story 状态矩阵、交互和 Axe A11y 检查。
- 全新目录生成 React/Ant Design、Vue/TDesign 项目并执行生产构建。
- 7 种应用框架与模板升级冲突保护测试。

## 正式发布前仍需完成

- 在 npm 配置 Trusted Publishing 或仓库环境中的 `NPM_TOKEN`。
- 完成一次不勾选 Publish 的 Release Workflow 预演，再由维护者手动确认发布。
- 在 npm Registry 发布后重新执行无 `--local` 的安装、CLI 创建与双端构建验证。
