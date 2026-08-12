# @atlas-eids/ai-runtime

Provider-neutral AI 流式运行时，包含 OpenAI-compatible Provider、Provider Router、附件与引用、持久化会话 Store、预算预警、失败恢复、运行 Trace、Usage/成本遥测、Tool Registry、高风险人工审批，以及权限感知 Knowledge Provider、引用与检索轨迹。

状态：Beta。内存 Knowledge Provider 用于 Demo；生产 RAG 需要服务端 Adapter、字段权限和可信租户上下文。安全边界与用法见 [`docs/AI_RUNTIME.md`](../../docs/AI_RUNTIME.md)。
