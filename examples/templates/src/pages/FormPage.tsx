import { useState } from 'react'
import { AtlasAlert, AtlasButton, AtlasCheckbox, AtlasDateInput, AtlasInput, AtlasRadioGroup, AtlasSelect, AtlasSteps, AtlasSwitch, AtlasTextarea } from '@atlas-eids/react'
import { Save } from 'lucide-react'
import { PageHeader, Panel } from '../components/Page'

export function FormPage() {
  const [step, setStep] = useState(0)
  const [notify, setNotify] = useState(true)
  const [agreed, setAgreed] = useState(false)
  const [priority, setPriority] = useState('normal')
  const [saved, setSaved] = useState(false)
  const steps = ['基础信息', '范围与权限', '确认提交']
  return <>
    <PageHeader eyebrow="详情与表单" title="分步表单页" description="将高认知负担的配置拆成可校验步骤，始终保留当前进度与提交边界。" primary="保存草稿" onPrimary={() => setSaved(true)} />
    {saved && <AtlasAlert title="草稿已保存" description="可以稍后从任务中心继续编辑。" intent="success" closable onClose={() => setSaved(false)}/>} 
    <Panel className="form-shell">
      <AtlasSteps items={steps.map((title, index) => ({ id: title, title, status: index < step ? 'completed' : index === step ? 'current' : 'pending' }))}/>
      <form onSubmit={(event) => { event.preventDefault(); if (step < 2) setStep(step + 1); else setSaved(true) }}>
        {step === 0 && <fieldset className="form-section"><legend>任务基础信息</legend><div className="form-grid"><AtlasInput label="任务名称" defaultValue="企业知识库更新" required/><AtlasSelect label="所属空间" defaultValue="ops" options={[{ label: '数据运营空间', value: 'ops' }, { label: '客户成功空间', value: 'success' }]}/><AtlasDateInput label="计划完成日期" defaultValue="2026-08-18"/><AtlasSelect label="责任团队" defaultValue="knowledge" options={[{ label: '知识工程组', value: 'knowledge' }, { label: '平台研发组', value: 'platform' }]}/><AtlasTextarea className="form-span" label="任务说明" defaultValue="同步近 30 日发布的制度文档，并完成敏感字段检查。" rows={4}/></div></fieldset>}
        {step === 1 && <fieldset className="form-section"><legend>执行范围与权限</legend><div className="form-grid"><AtlasRadioGroup label="执行优先级" value={priority} onChange={setPriority} options={[{ label: '普通', value: 'normal' }, { label: '高优先级', value: 'high' }, { label: '紧急', value: 'urgent' }]}/><div className="switch-stack"><AtlasSwitch checked={notify} onChange={setNotify} label="完成后通知责任人"/><AtlasSwitch checked={true} onChange={() => undefined} label="记录工具调用与审计日志" disabled/></div><AtlasTextarea className="form-span" label="允许访问的数据范围" defaultValue="制度中心 / 已发布文档 / 华东区组织" rows={4} hint="禁止包含个人敏感信息与未发布合同。"/></div></fieldset>}
        {step === 2 && <fieldset className="form-section"><legend>确认提交</legend><div className="review-block"><dl><div><dt>任务</dt><dd>企业知识库更新</dd></div><div><dt>责任团队</dt><dd>知识工程组</dd></div><div><dt>执行策略</dt><dd>{priority === 'normal' ? '普通' : priority === 'high' ? '高优先级' : '紧急'} / 保留审计</dd></div><div><dt>通知</dt><dd>{notify ? '完成后通知' : '不通知'}</dd></div></dl><AtlasAlert title="提交后将创建可追踪的执行计划" description="涉及生产写入的步骤仍需人工批准。" intent="info"/><AtlasCheckbox checked={agreed} onChange={setAgreed} label="我已确认数据范围和执行边界"/></div></fieldset>}
        <footer className="form-actions"><AtlasButton type="button" disabled={step === 0} onClick={() => setStep(step - 1)}>上一步</AtlasButton><AtlasButton type="submit" intent="primary" disabled={step === 2 && !agreed}>{step === 2 ? <><Save size={15}/>确认提交</> : '下一步'}</AtlasButton></footer>
      </form>
    </Panel>
  </>
}
