# 路线图

这份 Roadmap 会随着真实使用情况持续调整。

## Beta 后计划

- 给 README 增加截图或 GIF
- 扩大 Testing Library 与跨浏览器覆盖并建立 API 稳定性报告
- 为第三方 Wrapper 补充复杂表单、虚拟列表和高级事件桥接
- 在生产级外部 IdP、托管 PostgreSQL 和密钥服务环境执行部署联调

## 已完成基线

- 建立 7 种应用框架与 13 种基础页面布局
- 建立 39 种通用页面、18 种业务场景和 15 种 AI 原生页面目录
- 建立 34 项 AI 交互组件目录
- 为全部 126 个条目提供可筛选、可展开的 Pattern Lab 视觉示例
- React / Vue 共享 Living Orb、框架 Gallery 与 AI 可信执行组件的视觉契约
- 建立 npm Workspace 和 12 个可独立构建的工程 packages
- 建立 Plugin SDK、第三方 Token Adapter、AI Runtime 和 Web Agent 工具层
- 建立 React / Vue 正式组件包与源码生成 CLI
- React / Vue 各提供 31 个 UI 组件与 `AtlasProvider`
- 建立 15 个独立路由、可运行、可交互的企业与 AI 页面模板
- 建立 Ant Design、TDesign、OpenTiny 运行时 Wrapper
- 建立 React / Vue Storybook
- 建立 Spring Boot 4.1 / Java 21 示例后端，包含 JWT、RBAC、多租户与审计
- CLI 可通过 `--template` 生成 15 类可编译 React / Vue 页面源码
- AI Runtime 建立会话 Store、Provider 路由、失败重试和 Usage 遥测
- Plugin SDK 建立权限、依赖、API 版本、注册隔离与失败回滚
- Java 后端建立本地 JWT / 外部 OIDC 双模式、Flyway / PostgreSQL、AI Provider 与 Agent 审批回放
- 建立 Changesets、npm Provenance Workflow、包体和组件 API/Type 发布预检
- 包级测试、Axe、E2E、视觉回归、Maven 测试和 npm audit 已进入检查流程
- CLI 生成 7 种应用框架，并支持密度、语言、第三方 Adapter、权限导航、Java API Client 和升级差异预览
- React / Vue 的 31 个组件均建立 Story 状态矩阵，并自动从类型源生成 API 文档
- 建立 PostgreSQL + Keycloak + Java Docker Compose，以及 Flyway、OIDC Claims、RBAC、Token 过期与租户隔离 Testcontainers 测试
- AI Runtime 支持附件、引用、持久化会话、预算、成本、Trace 和失败恢复
- Plugin SDK 支持 ECDSA Manifest、HTTPS 索引、Worker/iframe 沙箱；Web Agent 支持 WebMCP Draft 和跨页面执行

## 组件方向

- 稳定 31 个组件的公共 API 与受控输入行为
- 扩展 Storybook 到全部状态、密度、主题和第三方 Wrapper
- 为复合控件增加组件级键盘与无障碍测试

## 设计系统方向

- 增加 Figma token mapping
- 扩展图表示例
- 补充 Light Mode / Dark Mode 对比度规则
- 增加适合企业 Dashboard 的 compact density 变体

## 发布方向

- 维护首个 GitHub Beta Release 与安装验证资产
- 发布首批 npm Beta packages
- 使用现有 Changesets、自动 Changelog 和 npm Provenance 完成首次 Beta 发布
- 建立 Stable / Beta / Experimental 兼容策略

完整阶段与验收门槛见 [OpenTiny 能力对标路线图](OPENTINY_PARITY_ROADMAP.md)。
