import { useMemo, useState } from 'react'
import {
  AtlasAIComposer,
  AtlasAIMessageBubble,
  AtlasAlert,
  AtlasAvatar,
  AtlasButton,
  AtlasDataTable,
  AtlasDialog,
  AtlasEmpty,
  AtlasInput,
  AtlasObjectCell,
  AtlasOrb,
  AtlasPageHeader,
  AtlasPanel,
  AtlasProgress,
  AtlasProvider,
  AtlasRowActions,
  AtlasSearchInput,
  AtlasStatusTag,
  AtlasTableToolbar,
  AtlasTabs,
  AtlasTag,
  type AtlasTableColumn,
} from '@atlas-eids/react'
import {
  Bell,
  BookOpen,
  Box,
  Briefcase,
  Clock3,
  Database,
  Download,
  ExternalLink,
  Eye,
  FileText,
  HardDrive,
  Headphones,
  Layers3,
  Moon,
  RefreshCw,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Trash2,
  Upload,
  Users,
} from 'lucide-react'
import { knowledgeDocuments, knowledgeSpaces, statusMeta, type KnowledgeDocument, type KnowledgeSpace, type KnowledgeStatus } from '../../shared/knowledge-model'

type StatusFilter = 'all' | KnowledgeStatus

const statusTabs: Array<{ id: StatusFilter; label: string }> = [
  { id: 'all', label: '全部' },
  { id: 'indexed', label: '已索引' },
  { id: 'syncing', label: '同步中' },
  { id: 'review', label: '待复核' },
  { id: 'failed', label: '失败' },
]

function SpaceIcon({ type, size = 15 }: { type: KnowledgeSpace['icon']; size?: number }) {
  if (type === 'policy') return <ShieldCheck size={size}/>
  if (type === 'product') return <Box size={size}/>
  if (type === 'support') return <Headphones size={size}/>
  return <Briefcase size={size}/>
}

export default function KnowledgeBaseApp() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [activeSpace, setActiveSpace] = useState('all')
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('all')
  const [query, setQuery] = useState('')
  const [documents, setDocuments] = useState(knowledgeDocuments)
  const [selectedIds, setSelectedIds] = useState<Array<string | number>>([])
  const [activeDocumentId, setActiveDocumentId] = useState(knowledgeDocuments[0].id)
  const [sortKey, setSortKey] = useState<string>('updatedAt')
  const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('descending')
  const [syncing, setSyncing] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [importName, setImportName] = useState('')
  const [pendingFile, setPendingFile] = useState(false)
  const [question, setQuestion] = useState('哪些知识涉及高风险 Agent 工具审批？')
  const [askedQuestion, setAskedQuestion] = useState('哪些知识涉及高风险 Agent 工具审批？')
  const [aiBusy, setAiBusy] = useState(false)

  const filteredDocuments = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const rows = documents.filter((item) =>
      (activeSpace === 'all' || item.spaceId === activeSpace) &&
      (activeStatus === 'all' || item.status === activeStatus) &&
      (!normalized || [item.name, item.id, item.category, item.owner, ...item.tags].join(' ').toLowerCase().includes(normalized)),
    )
    return [...rows].sort((a, b) => {
      const aValue = String(a[sortKey as keyof KnowledgeDocument] ?? '')
      const bValue = String(b[sortKey as keyof KnowledgeDocument] ?? '')
      return aValue.localeCompare(bValue, 'zh-CN') * (sortDirection === 'ascending' ? 1 : -1)
    })
  }, [activeSpace, activeStatus, documents, query, sortDirection, sortKey])
  const currentDocument = filteredDocuments.find((item) => item.id === activeDocumentId) ?? filteredDocuments[0]

  const statusItems = statusTabs.map((item) => ({
    ...item,
    count: item.id === 'all' ? documents.length : documents.filter((document) => document.status === item.id).length,
  }))

  const openDocument = (document: KnowledgeDocument) => setActiveDocumentId(document.id)
  const rowActions = () => [
    { id: 'open', label: '查看详情', icon: <Eye size={15}/> },
    { id: 'download', label: '下载', icon: <Download size={15}/> },
    { id: 'delete', label: '删除', icon: <Trash2 size={15}/>, danger: true },
  ]

  const handleRowAction = (action: string, document: KnowledgeDocument) => {
    if (action === 'open') openDocument(document)
    if (action === 'download') setNotice(`已准备下载：${document.name}`)
    if (action === 'delete') setNotice(`“${document.name}”需要管理员审批后才能删除。`)
  }

  const syncKnowledge = () => {
    if (syncing) return
    setSyncing(true)
    setNotice('正在检查 4 个知识源的增量更新...')
    window.setTimeout(() => {
      setDocuments((items) => items.map((item) => item.status === 'syncing' ? { ...item, status: 'indexed', coverage: 100, updatedAt: '刚刚' } : item))
      setSyncing(false)
      setNotice('同步完成：新增 28 个分块，1 个文档索引已更新。')
    }, 900)
  }

  const submitImport = () => {
    if (!pendingFile) return
    setDialogOpen(false)
    setNotice(`“${importName || '新知识文档'}”已进入解析队列。`)
    setPendingFile(false)
    setImportName('')
  }

  const askKnowledge = (value: string) => {
    setQuestion(value)
    setAskedQuestion(value)
    setAiBusy(true)
    window.setTimeout(() => setAiBusy(false), 720)
  }

  const columns: AtlasTableColumn<KnowledgeDocument>[] = [
    {
      key: 'name', title: '知识文档', width: '34%', sortable: true,
      render: (document) => <AtlasObjectCell interactive title={document.name} meta={`${document.extension} · ${document.id}`} icon={<FileText/>} tone={document.status === 'failed' ? 'danger' : document.status === 'indexed' ? 'success' : 'primary'} onClick={() => openDocument(document)}/>,
    },
    { key: 'category', title: '分类', width: '15%', render: (document) => <span>{document.category}</span> },
    { key: 'status', title: '索引状态', width: 92, render: (document) => <AtlasStatusTag tone={statusMeta[document.status].tone}>{statusMeta[document.status].label}</AtlasStatusTag> },
    { key: 'chunks', title: '分块', width: 70, align: 'end', sortable: true },
    { key: 'owner', title: '负责人', width: 88 },
    { key: 'updatedAt', title: '更新时间', width: 102, sortable: true },
    {
      key: 'actions', title: '操作', width: 104, align: 'end',
      render: (document) => <AtlasRowActions items={rowActions()} maxVisible={2} onAction={(action) => handleRowAction(action, document)}/>,
    },
  ]

  return (
    <AtlasProvider theme={theme} density="standard" locale="zh-CN">
      <div className="knowledge-app">
        <div className="knowledge-shell">
          <aside className="knowledge-sidebar">
            <div className="knowledge-brand"><span className="knowledge-brand-mark"><Database size={17}/></span><span><strong>Atlas Knowledge</strong><small>企业知识中枢</small></span></div>
            <nav className="knowledge-nav" aria-label="知识库导航">
              <span className="knowledge-nav-label">工作区</span>
              <button className="is-active" type="button"><BookOpen size={16}/><span>知识库管理</span></button>
              <button type="button"><Layers3 size={16}/><span>数据源连接</span><b>2</b></button>
              <button type="button"><Sparkles size={16}/><span>AI 检索测试</span></button>
              <button type="button"><ShieldCheck size={16}/><span>权限与审计</span></button>
            </nav>
            <div className="knowledge-spaces">
              <div className="knowledge-space-label">知识空间</div>
              <button type="button" className={`knowledge-space-item ${activeSpace === 'all' ? 'is-active' : ''}`} onClick={() => setActiveSpace('all')}><span className="knowledge-space-icon"><HardDrive size={15}/></span><span><strong>全部知识</strong><small>跨空间统一管理</small></span><em>5.8k</em></button>
              {knowledgeSpaces.map((space) => <button type="button" key={space.id} className={`knowledge-space-item ${activeSpace === space.id ? 'is-active' : ''}`} onClick={() => setActiveSpace(space.id)}><span className="knowledge-space-icon"><SpaceIcon type={space.icon}/></span><span><strong>{space.name}</strong><small>{space.description}</small></span><em>{space.count}</em></button>)}
            </div>
            <div className="knowledge-sidebar-footer"><div className="knowledge-user"><AtlasAvatar name="王六" size={30}/><span><strong>王六</strong><small>知识管理员</small></span><Settings size={15}/></div></div>
          </aside>

          <section className="knowledge-stage">
            <header className="knowledge-topbar"><nav className="knowledge-topbar-path" aria-label="当前应用"><Database size={14}/><span>Atlas Workspace /</span><strong>企业知识库</strong></nav><div className="knowledge-topbar-actions"><button type="button" className="knowledge-icon-button" aria-label={theme === 'light' ? '切换深色主题' : '切换浅色主题'} title="切换主题" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? <Moon size={15}/> : <Sun size={15}/>}</button><button type="button" className="knowledge-icon-button" aria-label="通知" title="通知"><Bell size={15}/></button></div></header>

            <main className="knowledge-page">
              <AtlasPageHeader className="knowledge-page-header" eyebrow="Knowledge Operations" title="知识库管理" description="统一管理企业文档、索引质量、访问边界和 AI 检索可用性。" breadcrumbs={[{ label: '工作台', href: '#' }, { label: '知识与数据' }, { label: '知识库管理' }]} actions={<><AtlasButton onClick={syncKnowledge} loading={syncing}>{!syncing && <RefreshCw size={14}/>} 同步知识源</AtlasButton><AtlasButton intent="primary" onClick={() => setDialogOpen(true)}><Upload size={14}/> 导入文档</AtlasButton></>} meta={<><AtlasStatusTag tone="success">4 个数据源在线</AtlasStatusTag><span>上次同步：12 分钟前</span></>}/>

              {notice && <div className="knowledge-sync-alert"><AtlasAlert title={syncing ? '正在同步' : '操作已完成'} description={notice} intent={syncing ? 'info' : 'success'} closable={!syncing} onClose={() => setNotice(null)}/></div>}

              <section className="knowledge-metrics" aria-label="知识库指标">
                <div className="knowledge-metric"><span><FileText size={14}/>知识文档</span><strong>5,861</strong><small className="is-success">本月新增 284</small></div>
                <div className="knowledge-metric"><span><Layers3 size={14}/>可检索分块</span><strong>42.8k</strong><small className="is-info">索引覆盖 96.8%</small></div>
                <div className="knowledge-metric"><span><Users size={14}/>授权用户</span><strong>1,248</strong><small>12 个权限组</small></div>
                <div className="knowledge-metric"><span><Clock3 size={14}/>待处理任务</span><strong>7</strong><small className="is-warning">2 项需要人工复核</small></div>
              </section>

              <h2 className="sr-only">知识资产工作区</h2>
              <div className="knowledge-main-grid">
                <section className="knowledge-content">
                  <div className="knowledge-tabs-row"><AtlasTabs label="索引状态" items={statusItems} value={activeStatus} onChange={(value) => setActiveStatus(value as StatusFilter)}/><span className="knowledge-view-note">当前显示 {filteredDocuments.length} 个文档</span></div>
                  <AtlasDataTable className="knowledge-table" title="知识文档" description="内容资产与索引状态" caption="企业知识文档列表" columns={columns} rows={filteredDocuments} selectedIds={selectedIds} onSelect={setSelectedIds} sortKey={sortKey} sortDirection={sortDirection} onSort={(key, direction) => { setSortKey(String(key)); setSortDirection(direction) }} toolbar={<AtlasTableToolbar search={<AtlasSearchInput value={query} onChange={setQuery} onSearch={setQuery} placeholder="搜索文档、标签或负责人" label="搜索知识文档"/>} filters={<AtlasTag intent={activeSpace === 'all' ? 'neutral' : 'primary'}>{activeSpace === 'all' ? '全部空间' : knowledgeSpaces.find((space) => space.id === activeSpace)?.name}</AtlasTag>} selection={selectedIds.length ? <span className="knowledge-selection">已选择 {selectedIds.length} 项</span> : undefined} actions={<AtlasButton size="compact" disabled={!selectedIds.length}>批量设置权限</AtlasButton>}/>} footer={<div className="knowledge-table-footer"><span>{filteredDocuments.length ? '已索引 3 · 同步中 1 · 待复核 1 · 失败 1' : '当前条件下没有匹配文档'}</span><span>{filteredDocuments.length ? `1–${filteredDocuments.length} / ${filteredDocuments.length}` : '0 / 0'}</span></div>}/>
                </section>

                <aside className="knowledge-rail">
                  <AtlasPanel title="文档详情" description="当前知识资产">
                    {currentDocument ? <><div className="knowledge-detail-title"><span><FileText size={17}/></span><div><h3>{currentDocument.name}</h3><p>{currentDocument.extension} · {currentDocument.id}</p></div></div><p className="knowledge-summary">{currentDocument.summary}</p><AtlasProgress value={currentDocument.coverage} label="索引覆盖率" intent={currentDocument.status === 'failed' ? 'danger' : currentDocument.coverage < 90 ? 'warning' : 'success'}/><dl className="knowledge-meta-list"><div><dt>版本</dt><dd>{currentDocument.version}</dd></div><div><dt>文件大小</dt><dd>{currentDocument.size}</dd></div><div><dt>负责人</dt><dd>{currentDocument.owner}</dd></div><div><dt>文本分块</dt><dd>{currentDocument.chunks}</dd></div></dl><AtlasStatusTag tone={statusMeta[currentDocument.status].tone}>{statusMeta[currentDocument.status].label}</AtlasStatusTag><div className="knowledge-tags">{currentDocument.tags.map((tag) => <AtlasTag key={tag}>{tag}</AtlasTag>)}</div><div className="knowledge-rail-actions"><AtlasButton size="compact"><ExternalLink size={13}/> 打开</AtlasButton><AtlasButton size="compact">版本记录</AtlasButton></div></> : <AtlasEmpty title="没有可查看的文档" description="调整搜索词或筛选条件后再选择知识文档。"/>}
                  </AtlasPanel>

                  <AtlasPanel className="knowledge-ai-panel" title={<span className="knowledge-ai-heading"><AtlasOrb state={aiBusy ? 'thinking' : 'idle'} size={34}/><span><strong>知识助手</strong><small>基于当前授权范围</small></span></span>}>
                    {currentDocument ? <><AtlasAIMessageBubble role="assistant" name="Atlas Knowledge" streaming={aiBusy} content={aiBusy ? '正在检索知识范围、应用权限过滤并核对引用...' : <span><strong>关于“{askedQuestion}”：</strong><br/>命中 3 份治理知识。高风险写入必须经过具名审批，并保留服务端审计记录。</span>} citations={aiBusy ? [] : [{ id: 'c1', title: 'Agent 工具审批规范', source: '制度与治理', excerpt: '高风险工具必须进入 Approval。', confidence: .98 }, { id: 'c2', title: '多租户数据隔离手册', source: '制度与治理', excerpt: '执行前再次校验租户上下文。', confidence: .94 }]}/><AtlasAIComposer value={question} onChange={setQuestion} onSubmit={askKnowledge} busy={aiBusy} contexts={['4 个知识空间', '已应用权限过滤']} suggestions={['哪些文档待复核？', '解释跨租户访问规则']} placeholder="向企业知识提问..."/></> : <AtlasEmpty title="暂无检索上下文" description="当前筛选没有文档，AI 回答与引用已清理。"/>}
                  </AtlasPanel>
                </aside>
              </div>
            </main>
          </section>
        </div>

        <AtlasDialog open={dialogOpen} title="导入知识文档" onClose={() => setDialogOpen(false)} footer={<div className="knowledge-dialog-footer"><AtlasButton onClick={() => setDialogOpen(false)}>取消</AtlasButton><AtlasButton intent="primary" disabled={!pendingFile} onClick={submitImport}>开始解析</AtlasButton></div>}>
          <div className="knowledge-dialog-form"><button className="knowledge-upload-zone" type="button" onClick={() => { setPendingFile(true); if (!importName) setImportName('企业知识文档.pdf') }}><Upload size={24}/><strong>{pendingFile ? '企业知识文档.pdf' : '选择文件或拖拽到这里'}</strong><small>支持 PDF、DOCX、Markdown 与 XLSX，单文件不超过 50 MB</small></button><AtlasInput label="知识名称" value={importName} onChange={(event) => setImportName(event.target.value)} placeholder="输入可检索的知识名称"/><AtlasAlert title="权限继承" description="新文档将继承当前知识空间的访问权限，发布前可再次调整。" intent="info"/></div>
        </AtlasDialog>
      </div>
    </AtlasProvider>
  )
}
