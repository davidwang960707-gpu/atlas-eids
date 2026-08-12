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
- 建立 npm Workspace 和 14 个可独立构建的工程 packages
- 建立 Plugin SDK、第三方 Token Adapter、AI Runtime 和 Web Agent 工具层
- 建立 React / Vue 正式组件包与源码生成 CLI
- React / Vue 各提供 50 个 UI 组件与 `AtlasProvider`，其中 7 个为企业组合组件、15 个为 AI 原生组件
- 建立 16 个独立路由、可运行、可交互的企业与 AI 页面模板
- 建立 Ant Design、TDesign、OpenTiny 运行时 Wrapper
- 建立 React / Vue Storybook
- 建立 Spring Boot 4.1 / Java 21 示例后端，包含 JWT、RBAC、多租户与审计
- CLI 可通过 `--template` 生成 15 类可编译 React / Vue 页面源码
- AI Runtime 建立会话 Store、Provider 路由、失败重试和 Usage 遥测
- Plugin SDK 建立权限、依赖、API 版本、注册隔离与失败回滚
- Java 后端建立本地 JWT / 外部 OIDC 双模式、Flyway / PostgreSQL、AI Provider 与 Agent 审批回放
- 建立 Changesets、npm Provenance Workflow、包体和组件 API/Type 发布预检
- 包级测试、Axe、E2E、视觉回归、Maven 测试和 npm audit 已进入检查流程
- CLI 生成 7 种完整应用框架，并支持可运行路由、产品 / 业务分层菜单、角色权限、Light / Dark 主题、多租户会话、类型化 Java API Client、密度、语言、第三方 Adapter 和升级差异预览
- React / Vue 的 50 个 UI 组件均建立 Story 状态矩阵，并自动从类型源生成 API 文档
- React / Vue Storybook 使用统一 Atlas Provider，补齐 Controls、三档密度、双语言、双主题和 50 × 2 逐组件 Axe 检查
- Living Orb 在正式组件包中补齐动态轨道、呼吸形变、深度、碰撞焦散、液态流动和高光层，普通业务列表不再使用 Orb
- 16 个页面路由增加根布局溢出检查，AI 审计治理页的策略版本标签完成桌面与移动端约束
- 建立 PostgreSQL + Keycloak + Java Docker Compose，以及 Flyway、OIDC Claims、RBAC、Token 过期与租户隔离 Testcontainers 测试
- AI Runtime 支持附件、引用、持久化会话、预算、成本、Trace 和失败恢复
- Plugin SDK 支持 ECDSA Manifest、HTTPS 索引、Worker/iframe 沙箱；Web Agent 支持 WebMCP Draft、路由感知 WebSkills、跨页面执行和 Java Remote Client
- Agent Kit 提供组件知识、页面规划、源码校验和生成修复循环，7 个 Skills 与 4 份 Machine Manifest 形成渐进式设计知识层
- 标准 MCP 提供 stdio 与 Streamable HTTP Server/Client、9 类资源、Prompt 和 10 个页面开发工具
- AI Runtime 建立权限感知 Knowledge Provider、引用和检索 Trace，AI 知识工作台完成组件到页面的闭环示例

## 组件方向

- 稳定 50 个 UI 组件的公共 API、视觉契约与受控输入行为
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

## AI 平台下一阶段

- 为 PostgreSQL / pgvector、Elasticsearch 和企业文档库提供生产 Knowledge Provider Adapter。
- 为 MCP Streamable HTTP 增加 OIDC、限流、会话持久化、部署模板和远程兼容测试。
- 建立 Agent 生成页面评测集，以 TypeScript、Axe、Playwright、截图差异和 Token 合规率联合验收。
- 增加截图到页面蓝图的多模态 Adapter，以及针对已有项目的结构化局部修改能力。

完整阶段与验收门槛见 [OpenTiny 能力对标路线图](OPENTINY_PARITY_ROADMAP.md)。
