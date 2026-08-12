# 工程化与质量基线

## GitHub Pages 产物

```bash
npm run build:pages
```

该命令会构建 packages、示例、16 个页面路由、浏览器文档索引和双框架 Storybook，再由 `scripts/build-pages.mjs` 装配到 `.pages/`。GitHub Actions 使用同一命令发布站点，避免本地路径与公开路径分叉。

## 本地检查

```bash
npm install
npm run check
```

`npm run check` 会依次完成：

- 构建 14 个 Workspace packages
- 构建 React、Vue、16 个页面路由与双框架 Storybook
- 执行 Tokens、Core、Plugin、Adapter、AI Runtime、Web Agent、Agent Kit、MCP、CLI、React、Vue 测试
- 校验 51 个文档条目在 React / Vue 中的导出，核对 React Props Type，并检查 50 + 50 个 Story 状态矩阵
- 从 React / Vue TypeScript 源码生成浏览器可搜索的组件 API 文档
- 从 Core Contract、组件 API 和 Tokens 生成 4 份 Machine Manifest，并检查名称、版本与数量不漂移
- 对 14 个公开 package 执行 `npm pack --dry-run`，检查导出、包体积与禁止文件
- 使用 Java 21 / Maven 执行本地 JWT、OIDC、Flyway、Provider、租户、审批与审计测试

浏览器质量检查独立执行：

```bash
npm run test:e2e
npm run test:a11y
npm run test:visual
npm run test:storybook
```

Playwright 使用 `4273–4276` 作为 Portal、React、Vue 和模板的专用测试端口，Storybook 静态测试使用 `6216–6217`。所有测试服务都禁用 `reuseExistingServer`：端口冲突时直接失败，避免误把其他本地项目当成 Atlas EIDS 进行断言。端口可通过 `ATLAS_EIDS_TEST_*_PORT` 环境变量覆盖。

`test:storybook` 会逐一检查 React / Vue 的 50 个 UI 组件，并额外验证三档密度、双语言、双主题、数据组合组件的跨框架像素差，以及 Living Orb 的动态轨道、呼吸 Core、碰撞焦散层和 AI Composer 的焦点行为。

## CI

`.github/workflows/ci.yml` 在 `main` 分支 Push 和 Pull Request 时执行：

1. `npm ci`
2. 构建全部 packages 与示例
3. 运行包级测试
4. 构建 React / Vue Storybook
5. 执行 Playwright E2E 与 Axe A11y
6. 使用 CLI 生成 Tenant + Ant Design React/Java 项目和 Hybrid + TDesign Vue 项目，执行升级差异预览并构建两个前端
7. 使用 Temurin Java 21 / Maven 测试生成后的 Spring Boot 后端
8. 检查生产依赖漏洞

Java 日常检查执行 `mvn test`；GitHub Actions 额外执行 `mvn -Pintegration test`，通过 Testcontainers 启动 PostgreSQL 与 Keycloak。这样本地检查不依赖容器 Registry，CI 仍强制执行完整集成验证。

`.github/workflows/release.yml` 是手动触发的 Beta 发布流程。默认只验证；只有维护者勾选 Publish 且 `npm-release` Environment 已配置 Trusted Publishing 或 `NPM_TOKEN` 时才会执行 `changeset publish --tag beta`。

macOS 独立 Job 使用仓库基线执行首屏视觉回归，失败时上传 Playwright 报告和差异图。

## 发布门槛

- npm audit 不存在 High / Critical 漏洞
- React / Vue 公共 API 对齐
- 公共组件具备键盘行为、ARIA 和 Reduced Motion 处理
- Breaking Change 进入 Changelog，并按 SemVer 发布
- 面向用户的 package 变更附带 Changeset
- `npm pack --dry-run` 不包含 Maven `target`、测试目录、`.DS_Store` 或超过 5 MB 的意外产物
- 至少完成单元测试、生成项目构建和核心页面视觉回归
- 文档必须标明 Stable、Beta、Experimental 或 Planned

## 分支与提交

- 功能分支使用短小、可追踪的改动范围。
- 不提交 `node_modules`、`dist`、密钥、内部接口地址或真实业务数据。
- 组件行为变更同时更新 React、Vue、组件文档和 Changelog。
- Token 变更只修改 JSON 源文件，并重新执行构建；生成 CSS 和 `manifests/token-contract.json` 不手工维护。
