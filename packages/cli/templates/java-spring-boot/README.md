# Atlas EIDS Java Backend

Spring Boot 4.1 / Java 21 企业集成模板，内置本地 JWT / 外部 OIDC、RBAC、租户校验、Flyway、PostgreSQL Profile、AI 会话/附件/Usage 持久化、Provider 超时重试与成本统计、持久化 Agent 审批和审计回放。

```bash
mvn test
mvn -Pintegration test
mvn spring-boot:run
```

本地 Demo 账号：

| 用户 | 默认密码 | 角色 | 租户 |
| --- | --- | --- | --- |
| `admin` | `atlas-local-only` | `ADMIN`、`USER` | `atlas-cn`、`east-retail`、`south-sales` |
| `analyst` | `atlas-local-only` | `USER` | `atlas-cn` |

通过 `ATLAS_DEMO_PASSWORD` 覆盖密码，通过至少 32 字节的 `ATLAS_JWT_SECRET` 注入签名密钥。未配置签名密钥时每次启动会随机生成临时值。除登录和健康检查外，请求都需要 Bearer Token 与 `X-Atlas-Tenant` Header。

- `POST /api/v1/auth/token`
- `GET /api/v1/system/health`
- `GET /api/v1/tenant/current`
- `POST /api/v1/ai/chat/stream`
- `GET /api/v1/ai/conversations`
- `GET /api/v1/ai/conversations/{id}`
- `POST /api/v1/ai/attachments`
- `GET /api/v1/ai/usage`（仅管理员）
- `GET /api/v1/agent/tools`
- `POST /api/v1/agent/tools/execute`
- `GET /api/v1/agent/executions`
- `GET /api/v1/agent/executions/{id}`
- `POST /api/v1/agent/executions/{id}/approve`（仅管理员）
- `GET /api/v1/agent/executions/{id}/replay`（仅管理员）
- `GET /api/v1/audit/events`（仅管理员）

默认账号、Token 签发、Demo Provider 与 H2 只用于本地开发。生产配置示例：

```bash
export SPRING_PROFILES_ACTIVE=production
export ATLAS_OIDC_ISSUER_URI='https://id.example.com/realms/atlas'
export ATLAS_OIDC_JWK_SET_URI='https://id.example.com/realms/atlas/protocol/openid-connect/certs'
export ATLAS_DATABASE_URL='jdbc:postgresql://localhost:5432/atlas'
export ATLAS_DATABASE_USER='atlas'
export ATLAS_DATABASE_PASSWORD='replace-me'
export ATLAS_AI_API_KEY='replace-me'
mvn spring-boot:run
```

外部 IdP Token 需要提供 `roles` 与 `tenants` Claims。`ATLAS_OIDC_JWK_SET_URI` 仅在公开 Issuer 与后端访问地址不同的容器网络中需要。生产环境还应接入密钥托管、共享限流、可观测性和审计保留策略。
