# @atlas-eids/mcp

让 Codex、Claude、Cursor、VS Code 和其他 MCP Host 渐进读取 Atlas Skills，查询组件、Tokens、页面模式，并执行页面规划、CLI 生成与规范校验。

## stdio

```json
{
  "mcpServers": {
    "atlas-eids": {
      "command": "npx",
      "args": ["-y", "@atlas-eids/mcp"]
    }
  }
}
```

本仓库开发环境可运行：

```bash
npm run build -w @atlas-eids/mcp
npm run atlas:mcp
```

Server 暴露组件、页面模式、Skills、Tokens 与四份 Machine Manifest。`atlas_get_skill` 可先读取 Skill，再按需读取 `visual-quality.md` 或 `charts.md` Reference；`atlas_get_visual_contract` 返回组件 Anatomy、States、Density、语义和 Token 依赖，其余工具提供查询、规划、生成、升级预览和源码校验。创建与写入操作会限制在配置的工作区根目录内。

发布包内携带 7 个 Skills；当工作区存在根目录 `skills/` 时优先读取工作区版本，外部项目则回退到包内版本。
