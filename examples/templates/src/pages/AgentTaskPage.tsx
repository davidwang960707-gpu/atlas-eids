import { useState } from 'react'
import { AtlasAlert, AtlasButton, AtlasExecutionPlan, AtlasOrb, AtlasProgress, AtlasTag, type AtlasExecutionStep } from '@atlas-eids/react'
import { CheckCircle2, Clock3, FileText, ShieldCheck, StopCircle } from 'lucide-react'
import { PageHeader, Panel, StatusDot } from '../components/Page'

const initialSteps: AtlasExecutionStep[] = [
  { id: 'scope', title: '确认数据范围', description: '已锁定华东区公开经营数据', status: 'completed' },
  { id: 'query', title: '读取经营指标', description: '查询收入、毛利与客户健康度', status: 'completed' },
  { id: 'reason', title: '识别异常与关联原因', description: '正在对比环比、同比与经营目标', status: 'running' },
  { id: 'write', title: '写入任务结论', description: '需要人工确认后更新经营周报', status: 'approval' },
  { id: 'notify', title: '通知责任团队', status: 'pending' }
]

export function AgentTaskPage() {
  const [steps, setSteps] = useState(initialSteps)
  const [stopped, setStopped] = useState(false)
  const approve = (id: string) => setSteps(steps.map((step) => step.id === id ? { ...step, status: 'completed', description: '已由王六批准并写入审计日志' } : step.status === 'pending' ? { ...step, status: 'running' } : step))
  const completed = steps.filter((step) => step.status === 'completed').length
  return <>
    <PageHeader eyebrow="AI 原生" title="Agent 任务工作台" description="目标、计划、工具调用和人工审批贯穿同一条可审计执行链路。" primary="复制任务" />
    {stopped && <AtlasAlert title="任务已停止" description="当前步骤已安全终止，已完成结果仍可查看。" intent="warning"/>}
    <section className="agent-task-hero"><div className="agent-identity"><AtlasOrb size={78} state={stopped ? 'error' : 'running'}/><span><AtlasTag intent={stopped ? 'danger' : 'success'}>{stopped ? '已停止' : '运行中'}</AtlasTag><h2>生成华东区经营异常报告</h2><p>由 Atlas Analyst 执行 · 任务 ID AG-20260811-028</p></span></div><div className="agent-runtime"><span><Clock3 size={15}/>已运行 02:18</span><span><ShieldCheck size={15}/>受控执行</span><AtlasButton intent="danger" onClick={() => setStopped(true)} disabled={stopped}><StopCircle size={15}/>停止</AtlasButton></div></section>
    <div className="agent-task-grid">
      <div><AtlasExecutionPlan title="执行计划" steps={steps} onStop={() => setStopped(true)} onApprove={approve}/><Panel title="工具调用" description="仅展示必要参数摘要，不暴露凭证"><div className="tool-log"><div><i className="done"><CheckCircle2 size={14}/></i><span><strong>query_metrics</strong><small>tenant=atlas-cn · region=east · 486 ms</small></span><time>10:42:18</time></div><div><i className="done"><CheckCircle2 size={14}/></i><span><strong>search_customer_activity</strong><small>12 个关联客户 · 928 ms</small></span><time>10:42:22</time></div><div><i className="running"><Clock3 size={14}/></i><span><strong>reason_over_variance</strong><small>正在聚合 8 个指标维度</small></span><time>10:42:27</time></div></div></Panel></div>
      <aside><Panel title="任务进度"><AtlasProgress label="总体完成度" value={Math.round(completed / steps.length * 100)}/><dl className="agent-facts"><div><dt>已完成步骤</dt><dd>{completed} / {steps.length}</dd></div><div><dt>工具调用</dt><dd>3 次</dd></div><div><dt>输入 Token</dt><dd>4,286</dd></div><div><dt>预计成本</dt><dd>¥ 0.18</dd></div></dl></Panel><Panel title="执行边界"><div className="boundary-list"><StatusDot>仅读取当前租户数据</StatusDot><StatusDot>写入前需要审批</StatusDot><StatusDot>完整记录工具调用</StatusDot></div></Panel><Panel title="中间产物"><button className="artifact-row"><FileText size={17}/><span><strong>经营异常分析草稿</strong><small>Markdown · 刚刚更新</small></span></button></Panel></aside>
    </div>
  </>
}
