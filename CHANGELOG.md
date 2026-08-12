# 变更日志

这里记录 Atlas EIDS 的重要变化。

格式参考 Keep a Changelog。项目在首次公开发布后会逐步遵循 Semantic Versioning。

## [Unreleased]

### Added

- 建立 npm Workspace 与 Tokens、Core、Plugin SDK、Adapters、AI Runtime、Web Agent、CLI、React、Vue packages
- 增加结构化 Token 单一数据源及 CSS / JSON / TypeScript 生成流程
- 增加 Ant Design、TDesign、OpenTiny 的 Token 与组件元数据适配器
- 增加 Provider-neutral AI 流式运行时、Tool Call 与高风险审批机制
- 增加权限化网页 Agent 工具和 Model Context Bridge
- 增加 React / Vue 正式组件包，以及 React / Vue / Spring Boot 源码生成 CLI
- CI 扩展为全 Workspace 构建、包级测试和生成项目构建验证
- 新增根目录开源文档集
- 新增 React 与 Vue 3 的 AgentOrb、AgentCard、NeuralInput、StreamBlock 示例
- 新增液态金属 Orb 视觉语言和状态动效
- 新增品牌化图表色彩 tokens
- 新增 Dark / Light Theme 的 token 结构
- 新增应用框架与页面模板库文档（包含导航框架、布局、业务模板与 AI 交互组件）
- 新增 Pattern Lab，可视化覆盖 7 种应用框架、13 种基础布局、72 个页面模板和 34 个 AI 交互组件
- React 与 Vue 示例新增应用框架 Gallery 和 AI 可信执行面板
- Pattern Lab 的 126 个条目可展开为按类型生成的真实交互 Demo
- React / Vue 正式包扩展到各 50 个 UI 组件与 `AtlasProvider`，并建立双框架 Storybook
- 新增 16 个独立路由运行的企业与 AI 页面模板
- 新增 Ant Design、TDesign、OpenTiny 核心运行时 Wrapper
- 新增 Playwright E2E、Axe A11y 与 macOS 视觉回归基线
- Java 模板升级到 Java 21，新增 JWT、RBAC、租户隔离、JPA 审计及接口测试
- CLI 新增 `--template`，可创建或单独生成 15 类 React / Vue 可编译页面源码
- 新增 Changesets、手动 Beta 发布 Workflow、npm Provenance、14 包发布元数据与 `npm pack --dry-run` 预检
- 新增组件文档导出与 React Props Type 契约检查
- Plugin SDK 新增权限、依赖、API 版本、注册项隔离、自动卸载与失败回滚
- AI Runtime 新增会话 Store、Provider Router、失败重试、Token Usage 与运行遥测
- Web Agent 新增高风险 Execution ID、审批、History 与只读 Replay
- Java 模板新增外部 OIDC、PostgreSQL Production Profile、Flyway、OpenAI-compatible Provider 和持久化 Agent 审批回放
- CLI 新增 7 种应用框架、三档密度、中英文、第三方 Adapter、权限导航、Java API Client 与模板升级差异预览
- React / Vue 50 个 UI 组件补齐 Story 状态矩阵、交互测试和自动 TypeScript API 文档
- 新增 PostgreSQL、Keycloak 与 Java Server Docker Compose，并通过 Testcontainers 验证 Flyway、OIDC Claims、RBAC 与租户隔离
- AI Runtime 新增附件、引用、持久化会话、预算预警、成本遥测、运行 Trace 与失败恢复
- Plugin SDK 新增 ECDSA Manifest 签名、HTTPS 插件索引与 Worker/iframe 沙箱
- Web Agent 新增服务端 Replay Store、跨页面执行、WebMCP Draft Bridge 与工具契约检查
- Vue Storybook 新增与 React 对齐的 AI 原生组件分组
- React / Vue Storybook 的 Button、Living Orb、AI Composer 新增可调 Controls
- Storybook A11y 从代表性组件抽检扩展为 React / Vue 各 50 个 UI 组件逐项检查
- CLI 的 7 种应用框架升级为可运行应用运行时，包含 Hash 路由、权限化菜单、主题状态、租户会话、系统子页面和类型化 Java API Client
- React / Vue AI 组件扩展到会话、消息、流式文本、Prompt、附件、历史、反馈、MCP、引用、知识源、检索轨迹与工具调用组件
- 新增 Agent Kit，统一组件知识、15 种 AI 页面模式、页面规划、源码校验与生成修复循环
- 新增标准 MCP package，提供 stdio / Streamable HTTP Server、Client、9 类 Resources、Prompt 和 10 个页面开发工具
- 新增 7 个渐进式 Skills，并为 CLI 增加组件/模式查询、Agent 页面规划和源码校验命令
- AI Runtime 新增权限感知 Knowledge Provider、引用和检索 Trace；Web Agent 新增路由感知 WebSkills 与 Java Remote Client
- 页面模板新增 AI 知识工作台，完整展示知识源、MCP、检索轨迹、引用和工具审批

### Changed

- React / Vue 示例升级到 Vite 8.2.1，依赖审计为 0 漏洞
- 文档增加架构、工程、插件、AI Runtime、Java 后端与 OpenTiny 对标路线图
- 优化主展示页视觉层级
- 更新 React 与 Vue 3 示例，使其与主展示页的 Orb 和 AI 输入体验保持一致
- 更新设计系统参考文档，补充当前图表色板和 Orb 行为说明
- 重构官网、React 与 Vue 的 Living Orb 材质、轨道距离和生命体动效
- 统一三端主题与品牌色职责，同时保留官网、模板中心和开发者示例各自的视觉密度
- React 与 Vue 的 FrameworkGallery 升级为可筛选、可选中、可切换租户和可操作画布的真实工作区
- 统一 Pattern Lab 与主展示页的卡片、列表、表单、状态标签、Orb 和明暗主题视觉语言
- 以企业级 Color Token、Typography、Button 和 Layout 基线重构 Pattern Lab，并统一复用 Living Orb 组件结构
- 明确 Living Orb 的 AI 语义边界：普通列表和普通卡片移除 Orb，仅在 Agent 实体、AI 入口与运行状态中使用
- 组件 Provider 统一支持 `compact`、`standard`、`comfortable` 密度及 `zh-CN`、`en-US` 语言基线
- Java AI Provider 增加超时、重试、限流、Usage 与成本统计，会话、附件和审批记录进入持久化模型
- 正式 React / Vue 组件包的 Living Orb 补齐动态双轨、呼吸形变、深度、碰撞焦散、液态流动与高光层
- Storybook 管理器统一为 Atlas 企业级主题，并关闭默认 onboarding 与更新提示
- Playwright 改用独立测试端口并禁止复用已有服务，避免端口冲突导致误测其他本地项目
- 修复 AI 审计治理页策略版本标签被圆形图标选择器误伤的问题
- 修复 `AtlasBadge` 状态点使用不允许的 ARIA 属性问题
- 校准 CLI Java Client 的租户与审计接口路径，多租户框架使用可访问多个租户的本地 Demo 身份，并拒绝未知 CLI 参数
- 文档与质量门槛统一更新到 14 个公开 packages、50 个双端 UI 组件、1 个 Provider 和 16 个独立页面路由

### Notes

- 当前仍处于首次公开发布前阶段，公开 API 后续仍可能调整。
