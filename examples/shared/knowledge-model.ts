export type KnowledgeStatus = 'indexed' | 'syncing' | 'review' | 'failed'

export interface KnowledgeSpace {
  id: string
  name: string
  description: string
  count: number
  icon: 'policy' | 'product' | 'support' | 'sales'
}

export interface KnowledgeDocument {
  id: string
  name: string
  extension: 'PDF' | 'DOCX' | 'MD' | 'XLSX'
  spaceId: string
  category: string
  owner: string
  updatedAt: string
  status: KnowledgeStatus
  chunks: number
  coverage: number
  version: string
  size: string
  tags: string[]
  summary: string
}

export const knowledgeSpaces: KnowledgeSpace[] = [
  { id: 'policy', name: '制度与治理', description: '权限、审计与合规规范', count: 1832, icon: 'policy' },
  { id: 'product', name: '产品与设计', description: '产品手册与设计系统', count: 946, icon: 'product' },
  { id: 'support', name: '客户与服务', description: 'FAQ、工单与服务案例', count: 2471, icon: 'support' },
  { id: 'sales', name: '销售赋能', description: '方案、行业与竞品资料', count: 612, icon: 'sales' }
]

export const knowledgeDocuments: KnowledgeDocument[] = [
  {
    id: 'KB-2408', name: 'Agent 工具审批规范', extension: 'PDF', spaceId: 'policy', category: '治理策略', owner: '王六', updatedAt: '今天 09:42', status: 'indexed', chunks: 128, coverage: 98, version: 'v2.8', size: '4.8 MB', tags: ['Agent', '审批', '高风险'],
    summary: '定义 Agent 读取、写入与高风险工具的授权边界、具名审批流程和服务端审计要求。'
  },
  {
    id: 'KB-2396', name: '多租户数据隔离手册', extension: 'DOCX', spaceId: 'policy', category: '安全规范', owner: '林可', updatedAt: '昨天 17:18', status: 'indexed', chunks: 84, coverage: 96, version: 'v1.6', size: '2.1 MB', tags: ['多租户', 'RBAC', '数据边界'],
    summary: '说明租户上下文透传、数据查询过滤、跨租户攻击防护以及异常访问审计。'
  },
  {
    id: 'KB-2381', name: 'Atlas EIDS 组件使用指南', extension: 'MD', spaceId: 'product', category: '设计系统', owner: '陈默', updatedAt: '昨天 14:06', status: 'syncing', chunks: 216, coverage: 72, version: 'v0.2', size: '1.6 MB', tags: ['React', 'Vue', 'Tokens'],
    summary: '覆盖 Atlas Design Tokens、企业组件、AI 原生组件、页面组合方式与跨框架契约。'
  },
  {
    id: 'KB-2358', name: '智能客服高频问题集', extension: 'XLSX', spaceId: 'support', category: '客户服务', owner: '李宁', updatedAt: '8 月 10 日', status: 'review', chunks: 342, coverage: 88, version: 'v4.2', size: '8.3 MB', tags: ['FAQ', '客服', '待复核'],
    summary: '汇总近 90 天客户咨询主题、标准答复、升级条件和关联工单处理建议。'
  },
  {
    id: 'KB-2327', name: '金融行业解决方案', extension: 'PDF', spaceId: 'sales', category: '行业方案', owner: '周岚', updatedAt: '8 月 9 日', status: 'indexed', chunks: 156, coverage: 94, version: 'v3.1', size: '12.4 MB', tags: ['金融', '方案', '合规'],
    summary: '面向银行与保险客户的智能知识、Agent 工作流和企业治理解决方案。'
  },
  {
    id: 'KB-2294', name: '历史工单知识抽取批次 07', extension: 'XLSX', spaceId: 'support', category: '工单沉淀', owner: '系统任务', updatedAt: '8 月 8 日', status: 'failed', chunks: 0, coverage: 0, version: 'batch-07', size: '24.7 MB', tags: ['工单', '批处理', '解析失败'],
    summary: '从已关闭工单中抽取问题、诊断步骤和最终解决方案，当前因字段映射异常未完成。'
  }
]

export const statusMeta: Record<KnowledgeStatus, { label: string; tone: 'success' | 'info' | 'warning' | 'danger' }> = {
  indexed: { label: '已索引', tone: 'success' },
  syncing: { label: '同步中', tone: 'info' },
  review: { label: '待复核', tone: 'warning' },
  failed: { label: '失败', tone: 'danger' }
}
