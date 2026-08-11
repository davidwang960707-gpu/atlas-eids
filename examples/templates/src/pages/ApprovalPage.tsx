import { useState } from 'react'
import { AtlasAlert, AtlasAvatar, AtlasButton, AtlasTag, AtlasTextarea } from '@atlas-eids/react'
import { Check, Download, X } from 'lucide-react'
import { PageHeader, Panel, StatusDot } from '../components/Page'

export function ApprovalPage() {
  const [decision, setDecision] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [comment, setComment] = useState('')
  return <>
    <PageHeader eyebrow="业务场景" title="审批详情页" description="业务信息、风险提示、审批记录与决策操作在同一上下文中完成。" primary="下载附件" onPrimary={() => undefined}/>
    {decision !== 'pending' && <AtlasAlert title={decision === 'approved' ? '审批已通过' : '申请已驳回'} description="决策已写入审计日志，并通知申请人与抄送人。" intent={decision === 'approved' ? 'success' : 'danger'}/>} 
    <section className="approval-summary"><div><span>采购申请 · PR-202608-0142</span><h2>华东区算力扩容采购</h2><p>申请人：林可 · 提交于 2026-08-10 16:28</p></div><AtlasTag intent={decision === 'pending' ? 'warning' : decision === 'approved' ? 'success' : 'danger'}>{decision === 'pending' ? '待审批' : decision === 'approved' ? '已通过' : '已驳回'}</AtlasTag><strong>¥ 286,400</strong></section>
    <div className="approval-grid">
      <div className="approval-main">
        <Panel title="申请信息"><dl className="info-grid"><div><dt>采购类型</dt><dd>云资源扩容</dd></div><div><dt>费用归属</dt><dd>华东数字化项目组</dd></div><div><dt>使用周期</dt><dd>2026-09 至 2027-08</dd></div><div><dt>供应商</dt><dd>Atlas Cloud Partner</dd></div></dl><div className="reason-block"><span>申请说明</span><p>为支持新上线的知识检索与 Agent 批处理任务，现有计算配额预计在 9 月达到 92%。本次扩容覆盖推理、向量检索和日志归档。</p></div></Panel>
        <Panel title="费用明细"><table className="compact-table"><thead><tr><th>资源项</th><th>规格</th><th>周期</th><th>金额</th></tr></thead><tbody><tr><td>推理计算资源</td><td>8 × L40S</td><td>12 个月</td><td>¥ 192,000</td></tr><tr><td>向量数据库</td><td>2 TB 高可用</td><td>12 个月</td><td>¥ 62,400</td></tr><tr><td>日志归档</td><td>10 TB</td><td>12 个月</td><td>¥ 32,000</td></tr></tbody></table></Panel>
        <Panel title="附件"><button className="attachment-row"><span><Download size={16}/><b>华东区算力扩容报价单.pdf</b></span><small>2.4 MB · 已完成病毒扫描</small></button></Panel>
      </div>
      <aside className="approval-side">
        <Panel title="AI 风险检查"><div className="risk-score"><strong>低风险</strong><span>86 / 100</span></div><ul className="check-list"><li><Check size={14}/>预算额度内</li><li><Check size={14}/>供应商在合格名单</li><li><Check size={14}/>价格低于同类采购均值 4.8%</li></ul><AtlasAlert title="需确认资源利用率" description="建议审批后设置 90 天使用率复核。" intent="warning"/></Panel>
        <Panel title="审批记录"><ol className="approval-flow"><li><AtlasAvatar name="林可"/><span><strong>林可提交申请</strong><small>8 月 10 日 16:28</small></span><StatusDot>已提交</StatusDot></li><li><AtlasAvatar name="周宁"/><span><strong>周宁完成部门审批</strong><small>8 月 11 日 09:16</small></span><StatusDot>已通过</StatusDot></li><li><AtlasAvatar name="王六"/><span><strong>等待财务审批</strong><small>当前节点</small></span><StatusDot tone="warning">待处理</StatusDot></li></ol></Panel>
      </aside>
    </div>
    {decision === 'pending' && <div className="approval-dock"><AtlasTextarea aria-label="审批意见" placeholder="填写审批意见（驳回时必填）" value={comment} onChange={(event) => setComment(event.target.value)} rows={2}/><div><AtlasButton intent="danger" disabled={!comment.trim()} onClick={() => setDecision('rejected')}><X size={15}/>驳回</AtlasButton><AtlasButton intent="primary" onClick={() => setDecision('approved')}><Check size={15}/>同意</AtlasButton></div></div>}
  </>
}
