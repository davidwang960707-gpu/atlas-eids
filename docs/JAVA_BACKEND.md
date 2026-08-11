# Java 后端与接口契约

Atlas CLI 可以生成 Spring Boot 4.1 / Java 21 示例后端：

```bash
npm run atlas -- create atlas-workspace --framework react --template agent-task --backend java --local
cd atlas-workspace/server
mvn test
mvn spring-boot:run
```

仓库根目录还提供 PostgreSQL 17、Keycloak 26.7 和 Java Server 的真实联调环境：

```bash
docker compose up --build
```

默认地址为 Java `http://localhost:8080`、Keycloak `http://localhost:8180`、PostgreSQL `localhost:5432`。Realm、角色、`roles` / `tenants` Claims 和 Demo 用户由 `infra/keycloak/atlas-eids-realm.json` 导入。所有凭证只用于本地联调，生产环境必须替换。

## 安全与租户模型

模板提供两种身份模式：默认 `local` 使用 HMAC JWT 与内存 Demo 账号；`oidc` 使用外部 Identity Provider 的 Issuer Discovery 与 JWK。两种模式都通过 `roles` 与 `tenants` Claims 建立 RBAC 和租户授权。除本地登录与健康检查外，请求必须同时携带：

```http
Authorization: Bearer <access-token>
X-Atlas-Tenant: atlas-cn
```

`X-Atlas-Tenant` 必须存在于 JWT 的 `tenants` Claim 中，否则返回 `403 tenant_forbidden`；缺少 Header 返回 `400 missing_tenant`。审计接口额外要求 `ADMIN` 角色。

本地 Demo 账号为 `admin` 与 `analyst`，密码默认是 `atlas-local-only`，可通过 `ATLAS_DEMO_PASSWORD` 覆盖。`admin` 可访问三个示例租户，`analyst` 仅可访问 `atlas-cn`。

```bash
export ATLAS_JWT_SECRET='replace-with-at-least-32-random-bytes'

curl -X POST http://localhost:8080/api/v1/auth/token \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"atlas-local-only","tenant":"atlas-cn"}'
```

未设置 `ATLAS_JWT_SECRET` 时，服务会在每次启动时随机生成临时签名密钥，因此重启后旧 Token 自动失效。生产环境启用 OIDC 后，本地 Token Controller、内存用户、HMAC Encoder 都不会创建：

```bash
export SPRING_PROFILES_ACTIVE=production
export ATLAS_OIDC_ISSUER_URI='https://id.example.com/realms/atlas'
export ATLAS_OIDC_JWK_SET_URI='https://id.example.com/realms/atlas/protocol/openid-connect/certs'
export ATLAS_DATABASE_URL='jdbc:postgresql://localhost:5432/atlas'
export ATLAS_DATABASE_USER='atlas'
export ATLAS_DATABASE_PASSWORD='replace-me'
```

外部 IdP 需要签发 `roles` 与 `tenants` Claims。不同 IdP 的 Realm Role 或 Group 映射应在部署层转换成这两个稳定 Claims。

`ATLAS_OIDC_JWK_SET_URI` 是可选配置。通常只设置 Issuer 并使用 Discovery；当浏览器公开 Issuer 与容器内部 JWK 地址不同，可显式设置 JWK URI，同时仍严格校验 Token 的公开 Issuer。

## AI Provider

默认 `demo` Provider 完全离线，只用于本地联调。生产 Profile 使用 OpenAI-compatible Chat Completions 接口：

```bash
export ATLAS_AI_PROVIDER=openai-compatible
export ATLAS_AI_BASE_URL='https://provider.example.com/v1'
export ATLAS_AI_API_KEY='replace-me'
export ATLAS_AI_MODEL='your-model'
```

API Key 只在服务端读取，不进入前端源码或审计记录。Provider 已实现连接/读取超时、瞬时错误与 `429` / `5xx` 重试、每分钟请求限流、Token Usage 解析和成本估算。当前仍把上游完整响应转换为 SSE Delta；上游原生流式转发和分布式限流属于后续能力。

## 接口

| Endpoint | 权限 | 用途 |
| --- | --- | --- |
| `POST /api/v1/auth/token` | 公开 | 本地 Demo Token 签发 |
| `GET /api/v1/system/health` | 公开 | 前后端连接与健康状态 |
| `GET /api/v1/tenant/current` | 登录 + 租户 | 当前租户、用户与可用租户 |
| `POST /api/v1/ai/chat/stream` | 登录 + 租户 | SSE AI 流式输出示例 |
| `GET /api/v1/ai/conversations` | 登录 + 租户 | 当前租户会话列表 |
| `GET /api/v1/ai/conversations/{id}` | 登录 + 租户 | 会话及消息历史 |
| `POST /api/v1/ai/attachments` | 登录 + 租户 | 登记附件元数据 |
| `GET /api/v1/ai/usage` | `ADMIN` + 租户 | 调用量、Token 与成本统计 |
| `GET /api/v1/agent/tools` | 登录 + 租户 | 获取允许调用的工具 |
| `POST /api/v1/agent/tools/execute` | 登录 + 租户 | 执行工具，高风险动作要求批准 |
| `GET /api/v1/agent/executions` | 登录 + 租户 | 当前租户最近 50 条 Agent 执行 |
| `GET /api/v1/agent/executions/{id}` | 登录 + 租户 | 查询租户内执行记录 |
| `POST /api/v1/agent/executions/{id}/approve` | `ADMIN` + 租户 | 批准并执行高风险动作 |
| `GET /api/v1/agent/executions/{id}/replay` | `ADMIN` + 租户 | 只读回放输入、结果和审批信息 |
| `GET /api/v1/audit/events` | `ADMIN` + 租户 | 当前租户最近 100 条审计事件 |

高风险请求即使携带客户端 `approved: true` 也不能绕过服务端审批；服务先持久化为 `approval-required`，再由管理员调用审批接口。执行查询和回放始终附带当前租户条件，跨租户 ID 返回 `404`。

Demo 会保存 Tool 输入和结果用于审批与回放；生产实现需要按数据级别增加字段脱敏、加密、保留期限和删除流程，不能把敏感 Payload 无限期明文保存。

审计记录包含租户、操作人、动作、资源、结果、Correlation ID 和时间，只记录最小必要元数据。AI 消息原文与 Tool 输入不会写入审计详情，响应会通过 `X-Request-Id` 返回关联标识。

## 数据与生产边界

模板默认使用 H2 内存数据库方便 Demo，并由 Flyway V1/V2 Migration 建立 Agent、审计、AI 会话、消息、附件与 Usage 表，Hibernate `validate` 校验结构；`production` Profile 已提供 PostgreSQL 配置。V2 对应回滚脚本位于 `db/rollback/U2__ai_usage_and_conversations.sql`，回滚前仍需完成备份并由维护者审核。

测试分为两层：`mvn test` 覆盖 JWT、Token 过期、RBAC、租户、Provider 超时/重试/限流和接口行为；`mvn -Pintegration test` 通过 Testcontainers 额外启动 PostgreSQL 与真实 Keycloak，验证 Flyway、OIDC Claims 和跨租户攻击。进入真实生产前仍应至少完成：

- 在目标 PostgreSQL 版本上执行迁移演练、备份和回滚验证。
- 完成外部 IdP Claims 映射、细粒度资源权限和 Token 撤销策略。
- 将租户字段纳入所有业务表、唯一约束、查询条件和缓存 Key。
- 将单实例内存限流替换为网关或共享存储限流，并增加幂等、输入校验、Prompt 防护、敏感字段脱敏和审计保留策略。
- 将模型调用、Tool 执行和数据库写入置于服务端权限校验之后。

本仓库已在 Java 21 / Maven 3.9 下执行本地 JWT、OIDC Discovery、Flyway Schema、Provider、租户隔离、RBAC、高风险审批、会话持久化、回放和审计接口测试。容器测试使用独立 `integration` Profile，不让日常检查依赖外部 Registry；CI 的 Docker 环境负责强制运行完整容器集成测试。
