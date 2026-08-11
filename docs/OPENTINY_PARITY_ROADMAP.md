# OpenTiny 能力对标路线图

目标是让 Atlas EIDS 在工程可靠性上达到成熟企业级开源项目水平，同时保留 AI 原生交互和 Living Orb 的独立方向。这里的“对标”是能力和质量对标，不复制 OpenTiny 的产品边界或源码。

## 当前阶段

| 能力 | 已实现 | 下一验收门槛 |
| --- | --- | --- |
| Design Tokens | JSON 单一源，生成 CSS/JSON/TS，亮暗主题 | DTCG 完整类型、Figma 同步、主题兼容测试 |
| 基础组件 | React/Vue 各 31 个 UI 组件和 Provider，完整 Story 状态矩阵、A11y、视觉与 API/Type 契约基线 | 扩大复杂键盘交互和跨浏览器矩阵 |
| 页面模板 | 126 个 Pattern Lab Demo，15 个独立路由运行模板，7 种可生成应用框架 | 生产数据契约、SSR 与微前端组合 |
| 插件扩展 | 生命周期、依赖、权限、失败回滚、Worker/iframe 沙箱、Manifest 签名与 HTTPS 索引 | 插件撤销、CSP 模板与公开市场服务 |
| 第三方接入 | Ant/TDesign/OpenTiny Token、元数据与核心运行时 Wrapper | 高级表单、虚拟列表、事件桥接与版本兼容矩阵 |
| 源码生成 | React/Vue 项目、15 类页面、7 种框架、密度/语言/Adapter、Java 后端、差异预览升级器 | AST 级三方合并与部署平台 Preset |
| Java 后端 | Java 21、OIDC、RBAC、多租户、Flyway/PostgreSQL、AI Usage、审批审计、Compose/Testcontainers | 密钥托管、分布式限流与全链路可观测性 |
| AI 对话 | 流式 Provider、Tool、审批、附件/引用、持久化 Store、预算、Trace 与失败恢复 | 服务端 Trace 聚合、评测集与多模态传输 |
| 网页 Agent | 权限 DOM 工具、服务端 Replay、跨页面 Agent、WebMCP Draft Bridge 与契约检查 | 浏览器兼容矩阵、远程会话和端到端治理 |
| 工程化 | Workspace、双 Storybook 全组件矩阵、CI、Axe、E2E、视觉回归、Maven、Changesets、包体预检 | Coverage 门槛、跨浏览器矩阵和 Stable 发布 |

## 里程碑

### M1 · 可发布组件系统

- [x] 完成 30 个以上基础/企业组件
- [x] 建立 React / Vue Storybook
- [x] 增加包级测试、Axe 和 Playwright
- [x] 建立 Changesets、Provenance Workflow 与 npm pack 预检
- [ ] 发布 Tokens、Core、React、Vue Beta packages

### M2 · 可运行页面与适配层

- [x] 将 15 个高价值 Pattern 转成真实应用模板
- [x] 完成 Ant Design、TDesign、OpenTiny 核心运行时适配器
- [x] 支持紧凑、标准、舒适三种密度及中英文基线

### M3 · AI 原生工程能力

- [x] 完成流式对话、Tool Call、审批和执行记录基线
- [x] 完成 Provider 路由、会话 Store、失败重试和 Usage 遥测
- [x] 完成浏览器 Agent 审批 ID、History 与只读 Replay
- [x] 完成引用、附件、持久化会话、WebMCP Draft 契约与跨页面执行基线

### M4 · 企业应用生成与 Java 平台

- [x] CLI 生成 React / Vue 前端、15 类页面源码和 Java 后端
- [x] CLI 生成 7 种完整应用框架
- [x] Java 后端加入 Demo 认证、多租户、RBAC 和审计
- [x] 建立外部 OIDC、PostgreSQL Profile、Flyway 和 OpenAI-compatible Provider 基线
- [x] 建立持久化高风险审批、跨租户隔离和只读回放
- [x] 建立 PostgreSQL/Keycloak Compose、Testcontainers、插件索引和模板差异升级基线
- [ ] 完成生产 IdP、密钥托管、长期支持与 Stable 策略

达到 OpenTiny 的成熟度需要持续多个 Release，而不是一次提交。每个里程碑必须以可安装包、自动测试、真实 Demo 和发布记录验收。
