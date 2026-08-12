# @atlas-eids/cli

生成 React / Vue 应用、7 种企业应用框架、15 类可运行页面源码和 Spring Boot Java 后端源码。

```bash
atlas-eids create atlas-workspace --framework react --template agent-task --framework-layout tenant --density compact --locale zh-CN --adapter antd --backend java
atlas-eids create atlas-vue-workspace --framework vue --template analytics --framework-layout hybrid --adapter tdesign
atlas-eids list layouts
atlas-eids list pages
atlas-eids generate page agent-task --framework react
atlas-eids generate page analytics --framework vue --out src/pages/AnalyticsPage.vue
atlas-eids upgrade atlas-workspace --dry-run
```

`--template` 支持 `workbench`、`data-list`、`card-list`、`detail`、`form`、`analytics`、`settings`、`approval`、`kanban`、`calendar`、`files`、`ai-chat`、`agent-task`、`ai-review`、`ai-governance`。

`--framework-layout` 支持 `sidebar`、`top`、`hybrid`、`workbench`、`tabs`、`fullscreen`、`tenant`；`--density` 支持 `compact`、`standard`、`comfortable`；`--locale` 支持 `zh-CN`、`en-US`。React 可选 `native` / `antd` Adapter，Vue 可选 `native` / `tdesign` / `opentiny`。

生成项目包含应用 Shell、可运行 Hash 路由、权限化菜单、Light / Dark 主题、租户会话、类型化 Java API Client、三个系统子页面和 `.atlas-eids.json` 管理清单。`upgrade --dry-run` 会输出 `create`、`update`、`conflict`、`unchanged` 差异；检测到用户修改时默认不覆盖，必须审核后显式使用 `--force`。

| Framework Layout | 生成结构 | 运行能力 |
| --- | --- | --- |
| `sidebar` | 顶部品牌栏 + 左侧菜单 + 内容区 | 权限菜单、路由、主题 |
| `top` | 顶部一级导航 + 通栏内容区 | 一级路由、主题 |
| `hybrid` | 顶部产品导航 + 左侧业务导航 | 产品 / 业务分层、权限菜单 |
| `workbench` | 应用启动区 + 工作台内容 | 应用入口、角色工作台 |
| `tabs` | 左侧导航 + 页面标签栏 + 内容区 | 多任务路由、权限菜单 |
| `fullscreen` | 紧凑工具栏 + 全屏工作区 | 工具栏路由、沉浸内容 |
| `tenant` | 租户切换 + 左侧导航 + 租户内容 | 多租户会话、租户 Header、Java Tenant 校验 |

全部框架都会生成 `navigation.ts`、`router.ts`、`auth.ts`、`theme.ts` 和 `atlas-api.ts`。多租户框架的本地 Java Demo 默认使用 `admin` 账号，其余框架使用最小权限的 `analyst` 账号。

在 Atlas 仓库内部开发时增加 `--local`。npm Registry 正式可见前也需要 Clone 仓库并使用该选项；GitHub Beta Release 同时提供可审计的 package tarball。
