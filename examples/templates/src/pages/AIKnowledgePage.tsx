import { useState } from 'react'
import { AtlasAIComposer, AtlasAIMessageBubble, AtlasAlert, AtlasButton, AtlasCitationList, AtlasKnowledgeSourcePicker, AtlasMCPServerPicker, AtlasRetrievalTrace, AtlasStatistic, AtlasTag, AtlasToolCallCard, type AtlasKnowledgeSourceItem, type AtlasMCPServerItem, type AtlasRetrievalStep, type AtlasToolCallItem } from '@atlas-eids/react'
import { Database, RefreshCw, ShieldCheck } from 'lucide-react'
import { PageHeader, Panel } from '../components/Page'

const knowledgeSources: AtlasKnowledgeSourceItem[] = [
  { id: 'product', name: 'Atlas 产品文档', type: 'document', status: 'ready', count: 286, scope: '当前租户' },
  { id: 'policy', name: '企业权限与审批策略', type: 'database', status: 'ready', count: 84, scope: '角色过滤' },
  { id: 'support', name: '客户支持知识库', type: 'website', status: 'syncing', count: 1240, scope: '内部公开' },
  { id: 'legacy', name: '历史实施手册', type: 'api', status: 'error', count: 0, scope: '连接异常' }
]

const mcpServers: AtlasMCPServerItem[] = [
  { id: 'page-tools', name: 'Atlas Page Tools', description: '页面读取、筛选和导航', status: 'connected', toolCount: 12, transport: 'webmcp' },
  { id: 'java-audit', name: 'Java Audit Service', description: '审批、租户与审计回放', status: 'connected', toolCount: 6, transport: 'http' },
  { id: 'legacy-api', name: 'Legacy Knowledge API', description: '等待重新授权', status: 'error', toolCount: 4, transport: 'http' }
]

const initialTrace: AtlasRetrievalStep[] = [
  { id: 'scope', title: '解析租户与知识范围', detail: 'atlas-cn · USER / ANALYST', status: 'completed', durationMs: 18 },
  { id: 'retrieve', title: '混合检索授权知识源', detail: '向量、关键词与元数据', status: 'completed', durationMs: 84 },
  { id: 'rerank', title: '权限过滤与重排', detail: '返回 3 个可信引用', status: 'completed', durationMs: 22 }
]

export function AIKnowledgePage() {
  const [selectedSources, setSelectedSources] = useState(['product', 'policy'])
  const [selectedServers, setSelectedServers] = useState(['page-tools', 'java-audit'])
  const [busy, setBusy] = useState(false)
  const [question, setQuestion] = useState('高风险页面发布需要经过哪些控制？')
  const [trace, setTrace] = useState(initialTrace)
  const [toolCall, setToolCall] = useState<AtlasToolCallItem>({ id: 'tool-1', name: 'knowledge.search', description: '在授权知识范围内检索审批与发布策略', permission: 'read', status: 'completed', durationMs: 124, input: { query: question, tenant: 'atlas-cn' }, result: { citations: 3 } })

  const search = (value: string) => {
    setQuestion(value)
    setBusy(true)
    setTrace(initialTrace.map((step, index) => ({ ...step, status: index === 0 ? 'completed' : index === 1 ? 'running' : 'pending', durationMs: index === 0 ? 14 : undefined })))
    window.setTimeout(() => {
      setTrace(initialTrace)
      setToolCall((call) => ({ ...call, status: 'completed', input: { query: value, tenant: 'atlas-cn', sourceIds: selectedSources } }))
      setBusy(false)
    }, 700)
  }

  return <>
    <PageHeader eyebrow="AI 原生" title="AI 知识工作台" description="把知识范围、检索过程、引用来源、MCP 工具和企业权限放在同一条可信链路中。" primary="新建知识源"/>
    <div className="stat-grid">
      <AtlasStatistic label="知识文档" value="1,610" trend="up" trendLabel="今日新增 24"/>
      <AtlasStatistic label="检索成功率" value="98.6" suffix="%" trend="up" trendLabel="+0.8%"/>
      <AtlasStatistic label="平均检索耗时" value="124" suffix="ms" trend="down" trendLabel="-18 ms"/>
      <AtlasStatistic label="权限拦截" value="17" trend="flat" trendLabel="全部已审计"/>
    </div>
    <AtlasAlert title="权限感知检索已启用" description="查询只会使用当前租户、当前角色和已选择知识源允许访问的内容。" intent="success"/>
    <div className="knowledge-workbench">
      <aside>
        <AtlasKnowledgeSourcePicker sources={knowledgeSources} selectedIds={selectedSources} onChange={setSelectedSources}/>
        <AtlasMCPServerPicker servers={mcpServers} selectedIds={selectedServers} onChange={setSelectedServers}/>
      </aside>
      <main>
        <Panel title="可信回答" description="回答、依据和检索过程可同时复核" action={<AtlasTag intent="success">已权限过滤</AtlasTag>}>
          <div className="knowledge-answer">
            <AtlasAIMessageBubble role="user" content={question}/>
            <AtlasAIMessageBubble role="assistant" name="Atlas Knowledge" streaming={busy} content={busy ? '正在检索授权知识并验证引用...' : <div><p>高风险页面发布需要经过三层控制：操作人权限校验、显式人工审批，以及不可变的服务端审计记录。跨租户写入必须在执行前拒绝。</p><div className="knowledge-decision"><ShieldCheck size={17}/><span><strong>结论可信度 96%</strong><small>3 个来源一致，未发现冲突策略</small></span></div></div>}/>
            {!busy && (
              <AtlasCitationList items={[
                { id: 'c1', title: '企业权限策略 v2.8', source: '权限与审批策略', excerpt: '高风险写入必须经过具名审批。', confidence: .98 },
                { id: 'c2', title: 'Agent 工具治理规范', source: 'Atlas 产品文档', excerpt: '客户端确认不能替代服务端审计。', confidence: .95 },
                { id: 'c3', title: '多租户数据边界', source: 'Atlas 产品文档', excerpt: '所有请求必须携带并校验租户上下文。', confidence: .93 }
              ]}/>
            )}
          </div>
        </Panel>
        <AtlasAIComposer value={question} placeholder="向授权知识源提问..." contexts={[`${selectedSources.length} 个知识源`, `${selectedServers.length} 个 MCP Server`, '租户 atlas-cn']} suggestions={['解释引用冲突', '生成审批检查清单', '查看权限边界']} busy={busy} onChange={setQuestion} onSubmit={search}/>
      </main>
      <aside>
        <AtlasRetrievalTrace steps={trace}/>
        <AtlasToolCallCard call={toolCall}/>
        <Panel title="索引状态" description="最近一次增量同步">
          <div className="knowledge-index-status"><Database size={18}/><span><strong>1,610 / 1,634</strong><small>24 个文档等待解析</small></span><AtlasButton size="compact" aria-label="刷新索引"><RefreshCw size={14}/></AtlasButton></div>
        </Panel>
      </aside>
    </div>
  </>
}
