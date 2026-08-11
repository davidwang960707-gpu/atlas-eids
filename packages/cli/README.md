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

生成项目包含应用 Shell、导航、权限样例、路由配置、主题 Provider、Java API Client 和 `.atlas-eids.json` 管理清单。`upgrade --dry-run` 会输出 `create`、`update`、`conflict`、`unchanged` 差异；检测到用户修改时默认不覆盖，必须审核后显式使用 `--force`。

在 Atlas 仓库内部开发时增加 `--local`，组件包正式发布前也需要 Clone 仓库并使用该选项。
