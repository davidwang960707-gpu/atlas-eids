import { useState } from 'react'
import { AtlasAvatar, AtlasButton, AtlasProgress, AtlasTabs, AtlasTag } from '@atlas-eids/react'
import { Archive, Edit3, Link2, MoreHorizontal } from 'lucide-react'
import { PageHeader, Panel, StatusDot } from '../components/Page'

export function DetailPage() {
  const [tab, setTab] = useState('overview')
  return <>
    <PageHeader eyebrow="详情与表单" title="客户详情页" description="摘要、状态、关系与活动记录围绕单一业务对象组织。" primary="编辑客户" />
    <section className="object-hero">
      <div className="object-avatar">HX</div>
      <div><span className="object-type">企业客户 · C-20918</span><h2>华星智造集团</h2><div className="object-meta"><StatusDot>合作中</StatusDot><span>制造业</span><span>华东区</span></div></div>
      <div className="object-score"><span>客户健康度</span><strong>86</strong><small>/ 100</small></div>
      <div className="object-actions"><AtlasButton><Link2 size={15}/>复制链接</AtlasButton><AtlasButton aria-label="更多操作"><MoreHorizontal size={16}/></AtlasButton></div>
    </section>
    <AtlasTabs items={[{ id: 'overview', label: '概览' }, { id: 'contacts', label: '联系人', count: 8 }, { id: 'opportunities', label: '商机', count: 4 }, { id: 'activities', label: '活动记录', count: 28 }]} value={tab} onChange={setTab}/>
    {tab === 'overview' ? <div className="detail-grid">
      <Panel title="基本信息" action={<AtlasButton size="compact"><Edit3 size={14}/>编辑</AtlasButton>}><dl className="info-grid"><div><dt>客户等级</dt><dd><AtlasTag intent="primary">战略客户</AtlasTag></dd></div><div><dt>所属行业</dt><dd>工业装备制造</dd></div><div><dt>客户来源</dt><dd>行业峰会</dd></div><div><dt>年度合同额</dt><dd>¥ 2,860,000</dd></div><div><dt>签约日期</dt><dd>2025-08-16</dd></div><div><dt>下次续约</dt><dd>2026-09-01</dd></div></dl></Panel>
      <Panel title="关系团队"><div className="people-list">{['王六', '林可', '周宁'].map((name, index) => <div key={name}><AtlasAvatar name={name}/><span><strong>{name}</strong><small>{index === 0 ? '客户成功经理' : index === 1 ? '解决方案架构师' : '商务负责人'}</small></span></div>)}</div></Panel>
      <Panel title="客户目标"><div className="progress-list"><AtlasProgress label="数字化工厂一期" value={78}/><AtlasProgress label="知识管理平台" value={52} intent="warning"/><AtlasProgress label="经营驾驶舱" value={91} intent="success"/></div></Panel>
      <Panel title="近期动态"><ol className="timeline"><li><i/><div><strong>完成二期方案复核</strong><p>客户确认能力范围与项目里程碑。</p><time>今天 10:18</time></div></li><li><i/><div><strong>更新重点联系人</strong><p>新增集团数据平台主管。</p><time>昨天 16:42</time></div></li><li><i/><div><strong>合同附件已归档</strong><p>归档至法务与合规目录。</p><time>8 月 6 日</time></div></li></ol></Panel>
    </div> : <Panel><div className="tab-placeholder"><Archive size={24}/><strong>{tab === 'contacts' ? '联系人' : tab === 'opportunities' ? '商机' : '活动记录'}</strong><p>这里展示独立对象列表，可继续下钻到详情。</p></div></Panel>}
  </>
}
