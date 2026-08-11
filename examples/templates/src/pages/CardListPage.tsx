import { useState } from 'react'
import { AtlasButton, AtlasProgress, AtlasSearchInput, AtlasSegmentedControl, AtlasTag } from '@atlas-eids/react'
import { ArrowUpRight, Bot, Database, FileCheck2, Workflow } from 'lucide-react'
import { PageHeader, Panel, StatusDot } from '../components/Page'

const apps = [
  { id: 'agent', type: '智能体', icon: Bot, title: 'Atlas Insight Agent', description: '聚合经营数据、识别风险并输出可追溯结论。', owner: '数据智能组', progress: 86, status: '运行中' },
  { id: 'flow', type: '流程', icon: Workflow, title: '供应链异常处理', description: '连接采购、仓储与运输节点，自动分派异常。', owner: '供应链中心', progress: 72, status: '运行中' },
  { id: 'knowledge', type: '知识库', icon: Database, title: '企业制度知识库', description: '统一索引制度、流程与常见问题，保留来源。', owner: '人力运营组', progress: 94, status: '已发布' },
  { id: 'review', type: '智能体', icon: FileCheck2, title: '合同审阅助手', description: '提取风险条款并生成修改建议，需法务确认。', owner: '法务与合规部', progress: 58, status: '配置中' }
]

export function CardListPage() {
  const [type, setType] = useState('全部')
  const [query, setQuery] = useState('')
  const shown = apps.filter((app) => (type === '全部' || app.type === type) && `${app.title}${app.description}`.includes(query))
  return <>
    <PageHeader eyebrow="列表与数据管理" title="卡片列表页" description="用于需要快速识别能力、状态和归属的应用与智能体目录。" primary="创建应用" />
    <Panel className="catalog-panel">
      <div className="catalog-tools"><AtlasSegmentedControl label="对象类型" value={type} onChange={setType} items={[{ label: '全部', value: '全部' }, { label: '智能体', value: '智能体' }, { label: '流程', value: '流程' }, { label: '知识库', value: '知识库' }]}/><AtlasSearchInput value={query} onChange={setQuery} onSearch={setQuery} placeholder="搜索应用"/></div>
      <div className="catalog-grid">{shown.map((app) => { const Icon = app.icon; return <article className="catalog-card" key={app.id}><header><span className="catalog-icon"><Icon size={20}/></span><StatusDot tone={app.status === '配置中' ? 'warning' : 'success'}>{app.status}</StatusDot></header><div><span className="card-kicker">{app.type}</span><h2>{app.title}</h2><p>{app.description}</p></div><AtlasProgress label="能力配置完整度" value={app.progress} intent={app.progress < 60 ? 'warning' : 'primary'}/><footer><span>{app.owner}</span><AtlasButton size="compact" aria-label={`打开${app.title}`}><ArrowUpRight size={14}/></AtlasButton></footer></article> })}</div>
      {shown.length === 0 && <div className="no-result">没有符合条件的应用。</div>}
    </Panel>
  </>
}
