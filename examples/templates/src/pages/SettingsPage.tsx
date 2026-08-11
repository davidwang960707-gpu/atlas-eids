import { useState } from 'react'
import { AtlasAlert, AtlasButton, AtlasInput, AtlasSelect, AtlasSwitch, AtlasTabs, AtlasTextarea } from '@atlas-eids/react'
import { Save } from 'lucide-react'
import { PageHeader, Panel } from '../components/Page'

export function SettingsPage() {
  const [tab, setTab] = useState('general')
  const [saved, setSaved] = useState(false)
  const [audit, setAudit] = useState(true)
  const [approval, setApproval] = useState(true)
  const [digest, setDigest] = useState(false)
  return <>
    <PageHeader eyebrow="配置与管理" title="系统设置页" description="将组织级配置按职责分组，明确生效范围、风险与保存反馈。" primary="保存更改" onPrimary={() => setSaved(true)} />
    {saved && <AtlasAlert title="设置已保存" description="变更将在 1 分钟内同步到当前租户。" intent="success" closable onClose={() => setSaved(false)}/>} 
    <div className="settings-layout">
      <aside className="settings-nav" aria-label="设置分类"><button className="active">工作空间</button><button>成员与角色</button><button>安全策略</button><button>集成连接</button><button>账单与配额</button></aside>
      <Panel className="settings-panel">
        <AtlasTabs value={tab} onChange={setTab} items={[{ id: 'general', label: '基本信息' }, { id: 'policy', label: '执行策略' }, { id: 'notification', label: '通知' }]}/>
        {tab === 'general' && <div className="settings-form"><section><h2>工作空间信息</h2><p>用于导航、通知与审计记录中的组织识别。</p><div className="form-grid"><AtlasInput label="工作空间名称" defaultValue="Atlas 企业智能工作台"/><AtlasInput label="空间标识" defaultValue="atlas-enterprise" hint="创建后不可修改" disabled/><AtlasSelect label="默认语言" defaultValue="zh" options={[{ label: '简体中文', value: 'zh' }, { label: 'English', value: 'en' }]}/><AtlasSelect label="默认时区" defaultValue="shanghai" options={[{ label: 'Asia/Shanghai', value: 'shanghai' }, { label: 'UTC', value: 'utc' }]}/><AtlasTextarea className="form-span" label="空间说明" defaultValue="面向集团业务团队的 AI 原生协同空间。" rows={3}/></div></section></div>}
        {tab === 'policy' && <div className="settings-form"><section><h2>Agent 执行边界</h2><p>高风险操作必须在服务端再次验证，不依赖前端状态。</p><div className="switch-settings"><AtlasSwitch checked={approval} onChange={setApproval} label="生产写入需要人工审批"/><span>删除、发布和跨租户操作会在执行前暂停。</span><AtlasSwitch checked={audit} onChange={setAudit} label="记录完整工具调用"/><span>保留输入摘要、工具、耗时、操作者和结果。</span></div></section></div>}
        {tab === 'notification' && <div className="settings-form"><section><h2>通知偏好</h2><p>控制工作空间级消息，不影响个人订阅。</p><div className="switch-settings"><AtlasSwitch checked={true} onChange={() => undefined} label="高风险任务通知" disabled/><span>安全相关通知始终开启。</span><AtlasSwitch checked={digest} onChange={setDigest} label="每日运行摘要"/><span>每天 18:00 汇总任务运行与异常。</span></div></section></div>}
        <footer className="settings-footer"><span>上次保存：今天 09:42，由管理员王六更新</span><AtlasButton intent="primary" onClick={() => setSaved(true)}><Save size={15}/>保存设置</AtlasButton></footer>
      </Panel>
    </div>
  </>
}
