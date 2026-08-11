import { useMemo, useState } from 'react'
import { AtlasAlert, AtlasButton, AtlasInput, AtlasSelect, AtlasStatistic, AtlasTable, AtlasTag, type AtlasTableColumn } from '@atlas-eids/react'
import { Eye, ShieldAlert } from 'lucide-react'
import { ExportButton, PageHeader, Panel, StatusDot } from '../components/Page'

interface AuditRow { id: string; agent: string; action: string; tenant: string; risk: '低' | '中' | '高'; result: string; time: string }
const logs: AuditRow[] = [
  { id: 'AU-88642', agent: 'Atlas Analyst', action: '读取经营指标', tenant: 'atlas-cn', risk: '低', result: '成功', time: '10:42:18' },
  { id: 'AU-88641', agent: 'Contract Reviewer', action: '申请写入审阅结果', tenant: 'atlas-cn', risk: '中', result: '等待审批', time: '10:38:06' },
  { id: 'AU-88640', agent: 'Knowledge Curator', action: '跨空间读取文档', tenant: 'east-retail', risk: '高', result: '已阻断', time: '10:31:54' },
  { id: 'AU-88639', agent: 'Ops Copilot', action: '查询服务状态', tenant: 'atlas-cn', risk: '低', result: '成功', time: '10:26:11' },
  { id: 'AU-88638', agent: 'Atlas Writer', action: '生成周报草稿', tenant: 'south-sales', risk: '低', result: '成功', time: '10:18:32' }
]

export function AIGovernancePage() {
  const [risk, setRisk] = useState('全部')
  const [query, setQuery] = useState('')
  const rows = useMemo(() => logs.filter((log) => (risk === '全部' || log.risk === risk) && `${log.agent}${log.action}${log.tenant}`.includes(query)), [risk, query])
  const columns: AtlasTableColumn<AuditRow>[] = [
    { key: 'id', title: '审计 ID' }, { key: 'agent', title: '智能体' }, { key: 'action', title: '操作' }, { key: 'tenant', title: '租户' },
    { key: 'risk', title: '风险', render: (row) => <AtlasTag intent={row.risk === '高' ? 'danger' : row.risk === '中' ? 'warning' : 'neutral'}>{row.risk}</AtlasTag> },
    { key: 'result', title: '结果', render: (row) => <StatusDot tone={row.result === '已阻断' ? 'danger' : row.result === '等待审批' ? 'warning' : 'success'}>{row.result}</StatusDot> },
    { key: 'time', title: '时间' }, { key: 'detail', title: '', align: 'end', render: () => <AtlasButton size="compact" aria-label="查看审计详情"><Eye size={14}/></AtlasButton> }
  ]
  return <>
    <PageHeader eyebrow="AI 原生" title="AI 审计治理页" description="统一查看输入、输出、工具调用、租户边界和人工审批记录。" primary="配置策略" />
    <div className="governance-banner"><span><ShieldAlert size={20}/></span><div><strong>治理策略运行正常</strong><p>过去 24 小时已检查 12,846 次调用，阻断 18 次越权请求。</p></div><AtlasTag intent="success">策略版本 v2.8</AtlasTag></div>
    <div className="stat-grid"><AtlasStatistic label="今日调用量" value="12,846" trend="up" trendLabel="较昨日 +8.2%"/><AtlasStatistic label="策略命中" value={286} trend="up" trendLabel="22 条高风险"/><AtlasStatistic label="人工审批" value={34} trend="flat" trendLabel="平均 8.6 分钟"/><AtlasStatistic label="越权阻断" value={18} trend="down" trendLabel="较上周 -12%"/></div>
    <Panel className="audit-panel">
      <div className="filter-bar"><AtlasInput aria-label="搜索审计日志" placeholder="搜索智能体、操作或租户" value={query} onChange={(event) => setQuery(event.target.value)}/><AtlasSelect aria-label="风险等级" value={risk} onChange={(event) => setRisk(event.target.value)} options={[{ label: '全部风险', value: '全部' }, { label: '高风险', value: '高' }, { label: '中风险', value: '中' }, { label: '低风险', value: '低' }]}/><div className="filter-spacer"/><ExportButton/></div>
      {risk === '高' && <AtlasAlert title="正在查看高风险操作" description="高风险记录会保留完整审批链路和策略命中详情。" intent="warning"/>}
      <AtlasTable caption="AI 工具调用审计日志" columns={columns} rows={rows}/>
      <div className="table-footer"><span>日志保留 180 天 · 所有时间均为 Asia/Shanghai</span><AtlasButton>加载更多</AtlasButton></div>
    </Panel>
  </>
}
