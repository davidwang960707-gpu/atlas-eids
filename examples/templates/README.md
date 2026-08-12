# Atlas EIDS 页面模板

16 个独立路由运行的企业与 AI 页面 Demo，统一使用 `@atlas-eids/react` 与 Atlas Design Tokens。CLI 保持 15 类核心页面模板，额外的 `ai-knowledge` 路由用于验证知识源、MCP、检索轨迹、引用和工具调用闭环。

```bash
npm run dev -w atlas-eids-templates
```

入口为 `/#/workbench`。侧边导航可切换全部模板，也可以直接打开 `/#/data-list`、`/#/approval`、`/#/ai-chat`、`/#/agent-task` 等路由。

页面包含真实筛选、表格选择、抽屉、表单步骤、审批、状态流转、AI 引用和人工确认，不使用行业私有数据。
