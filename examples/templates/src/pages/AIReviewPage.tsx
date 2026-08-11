import { useState } from 'react'
import { AtlasAlert, AtlasButton, AtlasCheckbox, AtlasSegmentedControl, AtlasTag } from '@atlas-eids/react'
import { Check, RotateCcw, X } from 'lucide-react'
import { PageHeader, Panel } from '../components/Page'

const changes = [
  { id: 'intro', title: '背景说明', before: '本项目用于优化企业知识库，计划在本季度完成。', after: '本项目面向集团知识资产治理，计划于本季度完成首期上线，并建立可持续更新机制。' },
  { id: 'scope', title: '实施范围', before: '接入现有文档并提供搜索。', after: '首期接入制度、流程与产品文档，提供权限感知检索、引用追踪和内容反馈闭环。' },
  { id: 'risk', title: '风险控制', before: '', after: '涉及个人信息与合同内容的数据源默认不纳入索引，新增数据源需通过安全审批。' }
]

export function AIReviewPage() {
  const [mode, setMode] = useState('split')
  const [accepted, setAccepted] = useState<string[]>(['intro'])
  const [finished, setFinished] = useState(false)
  const toggle = (id: string) => setAccepted(accepted.includes(id) ? accepted.filter((item) => item !== id) : [...accepted, id])
  return <>
    <PageHeader eyebrow="AI 原生" title="AI 生成审阅页" description="将生成结果拆成可比较、可局部接受和可撤销的明确变更。" primary="保存审阅" onPrimary={() => setFinished(true)} />
    {finished && <AtlasAlert title="审阅结果已保存" description={`已接受 ${accepted.length} 项修改，其余内容保持原样。`} intent="success" closable onClose={() => setFinished(false)}/>} 
    <div className="review-toolbar"><div><AtlasTag intent="primary">Atlas Writer</AtlasTag><span>基于《知识治理项目说明 v2》完成结构化改写</span></div><AtlasSegmentedControl label="对比模式" value={mode} onChange={setMode} items={[{ label: '并排', value: 'split' }, { label: '逐项', value: 'inline' }]}/></div>
    <Panel className={`review-panel mode-${mode}`}>
      <div className="review-head"><div><span>原始内容</span><small>246 字</small></div><div><span>AI 建议</span><small>382 字 · 3 项变更</small></div></div>
      <div className="review-changes">{changes.map((change) => <article key={change.id} className={accepted.includes(change.id) ? 'accepted' : ''}><header><AtlasCheckbox checked={accepted.includes(change.id)} onChange={() => toggle(change.id)} label={change.title}/><AtlasTag intent={change.before ? 'primary' : 'success'}>{change.before ? '改写' : '新增'}</AtlasTag></header><div className="diff-columns"><p className="before">{change.before || '原文无此段落'}</p><p className="after">{change.after}</p></div><footer><AtlasButton size="compact" onClick={() => setAccepted(accepted.filter((id) => id !== change.id))}><X size={14}/>拒绝</AtlasButton><AtlasButton size="compact" intent="primary" onClick={() => setAccepted([...new Set([...accepted, change.id])])}><Check size={14}/>接受</AtlasButton></footer></article>)}</div>
      <footer className="review-actions"><AtlasButton onClick={() => setAccepted([])}><RotateCcw size={15}/>全部撤销</AtlasButton><span>已接受 {accepted.length} / {changes.length} 项</span><AtlasButton intent="primary" onClick={() => setFinished(true)}>应用所选修改</AtlasButton></footer>
    </Panel>
  </>
}
