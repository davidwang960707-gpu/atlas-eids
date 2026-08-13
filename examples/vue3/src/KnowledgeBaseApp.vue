<template>
  <AtlasProvider :theme="theme" density="standard" locale="zh-CN">
    <div class="knowledge-app">
      <div class="knowledge-shell">
        <aside class="knowledge-sidebar">
          <div class="knowledge-brand"><span class="knowledge-brand-mark"><Database :size="17" /></span><span><strong>Atlas Knowledge</strong><small>企业知识中枢</small></span></div>
          <nav class="knowledge-nav" aria-label="知识库导航">
            <span class="knowledge-nav-label">工作区</span>
            <button class="is-active" type="button"><BookOpen :size="16" /><span>知识库管理</span></button>
            <button type="button"><Layers3 :size="16" /><span>数据源连接</span><b>2</b></button>
            <button type="button"><Sparkles :size="16" /><span>AI 检索测试</span></button>
            <button type="button"><ShieldCheck :size="16" /><span>权限与审计</span></button>
          </nav>
          <div class="knowledge-spaces">
            <div class="knowledge-space-label">知识空间</div>
            <button type="button" :class="['knowledge-space-item', { 'is-active': activeSpace === 'all' }]" @click="activeSpace = 'all'"><span class="knowledge-space-icon"><HardDrive :size="15" /></span><span><strong>全部知识</strong><small>跨空间统一管理</small></span><em>5.8k</em></button>
            <button v-for="space in knowledgeSpaces" :key="space.id" type="button" :class="['knowledge-space-item', { 'is-active': activeSpace === space.id }]" @click="activeSpace = space.id">
              <span class="knowledge-space-icon"><ShieldCheck v-if="space.icon === 'policy'" :size="15" /><Box v-else-if="space.icon === 'product'" :size="15" /><Headphones v-else-if="space.icon === 'support'" :size="15" /><Briefcase v-else :size="15" /></span>
              <span><strong>{{ space.name }}</strong><small>{{ space.description }}</small></span><em>{{ space.count }}</em>
            </button>
          </div>
          <div class="knowledge-sidebar-footer"><div class="knowledge-user"><AtlasAvatar name="王六" :size="30" /><span><strong>王六</strong><small>知识管理员</small></span><Settings :size="15" /></div></div>
        </aside>

        <section class="knowledge-stage">
          <header class="knowledge-topbar"><nav class="knowledge-topbar-path" aria-label="当前应用"><Database :size="14" /><span>Atlas Workspace /</span><strong>企业知识库</strong></nav><div class="knowledge-topbar-actions"><button type="button" class="knowledge-icon-button" :aria-label="theme === 'light' ? '切换深色主题' : '切换浅色主题'" title="切换主题" @click="theme = theme === 'light' ? 'dark' : 'light'"><Moon v-if="theme === 'light'" :size="15" /><Sun v-else :size="15" /></button><button type="button" class="knowledge-icon-button" aria-label="通知" title="通知"><Bell :size="15" /></button></div></header>

          <main class="knowledge-page">
            <AtlasPageHeader class="knowledge-page-header" eyebrow="Knowledge Operations" title="知识库管理" description="统一管理企业文档、索引质量、访问边界和 AI 检索可用性。" :breadcrumbs="[{ label: '工作台', href: '#' }, { label: '知识与数据' }, { label: '知识库管理' }]">
              <template #actions><AtlasButton :loading="syncing" @click="syncKnowledge"><RefreshCw v-if="!syncing" :size="14" /> 同步知识源</AtlasButton><AtlasButton intent="primary" @click="dialogOpen = true"><Upload :size="14" /> 导入文档</AtlasButton></template>
              <template #meta><AtlasStatusTag tone="success">4 个数据源在线</AtlasStatusTag><span>上次同步：12 分钟前</span></template>
            </AtlasPageHeader>

            <div v-if="notice" class="knowledge-sync-alert"><AtlasAlert :title="syncing ? '正在同步' : '操作已完成'" :description="notice" :intent="syncing ? 'info' : 'success'" :closable="!syncing" @close="notice = null" /></div>

            <section class="knowledge-metrics" aria-label="知识库指标">
              <div class="knowledge-metric"><span><FileText :size="14" />知识文档</span><strong>5,861</strong><small class="is-success">本月新增 284</small></div>
              <div class="knowledge-metric"><span><Layers3 :size="14" />可检索分块</span><strong>42.8k</strong><small class="is-info">索引覆盖 96.8%</small></div>
              <div class="knowledge-metric"><span><Users :size="14" />授权用户</span><strong>1,248</strong><small>12 个权限组</small></div>
              <div class="knowledge-metric"><span><Clock3 :size="14" />待处理任务</span><strong>7</strong><small class="is-warning">2 项需要人工复核</small></div>
            </section>

            <h2 class="sr-only">知识资产工作区</h2>
            <div class="knowledge-main-grid">
              <section class="knowledge-content">
                <div class="knowledge-tabs-row"><AtlasTabs v-model="activeStatus" label="索引状态" :items="statusItems" /><span class="knowledge-view-note">当前显示 {{ filteredDocuments.length }} 个文档</span></div>
                <AtlasDataTable v-model:selected-ids="selectedIds" class="knowledge-table" title="知识文档" description="内容资产与索引状态" caption="企业知识文档列表" :columns="columns" :rows="filteredDocuments" selectable :sort-key="sortKey" :sort-direction="sortDirection" @sort="handleSort">
                  <template #toolbar>
                    <AtlasTableToolbar>
                      <template #search><AtlasSearchInput v-model="query" placeholder="搜索文档、标签或负责人" label="搜索知识文档" @search="query = $event" /></template>
                      <template #filters><AtlasTag :intent="activeSpace === 'all' ? 'neutral' : 'primary'">{{ activeSpaceLabel }}</AtlasTag></template>
                      <template #selection><span v-if="selectedIds.length" class="knowledge-selection">已选择 {{ selectedIds.length }} 项</span></template>
                      <template #actions><AtlasButton size="compact" :disabled="!selectedIds.length">批量设置权限</AtlasButton></template>
                    </AtlasTableToolbar>
                  </template>
                  <template #cell-name="{ row }"><AtlasObjectCell interactive :title="row.name" :meta="`${row.extension} · ${row.id}`" :tone="row.status === 'failed' ? 'danger' : row.status === 'indexed' ? 'success' : 'primary'" @click="openDocument(row)"><template #icon><FileText :size="16" /></template></AtlasObjectCell></template>
                  <template #cell-category="{ row }">{{ row.category }}</template>
                  <template #cell-status="{ row }"><AtlasStatusTag :tone="statusTone(row.status)">{{ statusLabel(row.status) }}</AtlasStatusTag></template>
                  <template #cell-actions="{ row }"><AtlasRowActions :items="rowActions" :max-visible="2" @action="handleRowAction($event, row)"><template #action-open><Eye :size="15" /></template><template #action-download><Download :size="15" /></template><template #action-delete><Trash2 :size="15" /></template></AtlasRowActions></template>
                  <template #footer><div class="knowledge-table-footer"><span>{{ filteredDocuments.length ? '已索引 3 · 同步中 1 · 待复核 1 · 失败 1' : '当前条件下没有匹配文档' }}</span><span>{{ filteredDocuments.length ? `1–${filteredDocuments.length} / ${filteredDocuments.length}` : '0 / 0' }}</span></div></template>
                </AtlasDataTable>
              </section>

              <aside class="knowledge-rail">
                <AtlasPanel title="文档详情" description="当前知识资产">
                  <template v-if="currentDocument"><div class="knowledge-detail-title"><span><FileText :size="17" /></span><div><h3>{{ currentDocument.name }}</h3><p>{{ currentDocument.extension }} · {{ currentDocument.id }}</p></div></div><p class="knowledge-summary">{{ currentDocument.summary }}</p><AtlasProgress :value="currentDocument.coverage" label="索引覆盖率" :intent="currentDocument.status === 'failed' ? 'danger' : currentDocument.coverage < 90 ? 'warning' : 'success'" /><dl class="knowledge-meta-list"><div><dt>版本</dt><dd>{{ currentDocument.version }}</dd></div><div><dt>文件大小</dt><dd>{{ currentDocument.size }}</dd></div><div><dt>负责人</dt><dd>{{ currentDocument.owner }}</dd></div><div><dt>文本分块</dt><dd>{{ currentDocument.chunks }}</dd></div></dl><AtlasStatusTag :tone="statusMeta[currentDocument.status].tone">{{ statusMeta[currentDocument.status].label }}</AtlasStatusTag><div class="knowledge-tags"><AtlasTag v-for="tag in currentDocument.tags" :key="tag">{{ tag }}</AtlasTag></div><div class="knowledge-rail-actions"><AtlasButton size="compact"><ExternalLink :size="13" /> 打开</AtlasButton><AtlasButton size="compact">版本记录</AtlasButton></div></template>
                  <AtlasEmpty v-else title="没有可查看的文档" description="调整搜索词或筛选条件后再选择知识文档。" />
                </AtlasPanel>

                <AtlasPanel class="knowledge-ai-panel">
                  <template #title><span class="knowledge-ai-heading"><AtlasOrb :state="aiBusy ? 'thinking' : 'idle'" :size="34" /><span><strong>知识助手</strong><small>基于当前授权范围</small></span></span></template>
                  <template v-if="currentDocument"><AtlasAIMessageBubble role="assistant" name="Atlas Knowledge" :streaming="aiBusy" :content="aiBusy ? '正在检索知识范围、应用权限过滤并核对引用...' : undefined" :citations="aiBusy ? [] : citations"><template v-if="!aiBusy"><strong>关于“{{ askedQuestion }}”：</strong><br />命中 3 份治理知识。高风险写入必须经过具名审批，并保留服务端审计记录。</template></AtlasAIMessageBubble><AtlasAIComposer v-model="question" :busy="aiBusy" :contexts="['4 个知识空间', '已应用权限过滤']" :suggestions="['哪些文档待复核？', '解释跨租户访问规则']" placeholder="向企业知识提问..." @submit="askKnowledge" /></template>
                  <AtlasEmpty v-else title="暂无检索上下文" description="当前筛选没有文档，AI 回答与引用已清理。" />
                </AtlasPanel>
              </aside>
            </div>
          </main>
        </section>
      </div>

      <AtlasDialog v-model:open="dialogOpen" title="导入知识文档">
        <div class="knowledge-dialog-form"><button class="knowledge-upload-zone" type="button" @click="selectFile"><Upload :size="24" /><strong>{{ pendingFile ? '企业知识文档.pdf' : '选择文件或拖拽到这里' }}</strong><small>支持 PDF、DOCX、Markdown 与 XLSX，单文件不超过 50 MB</small></button><AtlasInput v-model="importName" label="知识名称" placeholder="输入可检索的知识名称" /><AtlasAlert title="权限继承" description="新文档将继承当前知识空间的访问权限，发布前可再次调整。" intent="info" /></div>
        <template #footer><div class="knowledge-dialog-footer"><AtlasButton @click="dialogOpen = false">取消</AtlasButton><AtlasButton intent="primary" :disabled="!pendingFile" @click="submitImport">开始解析</AtlasButton></div></template>
      </AtlasDialog>
    </div>
  </AtlasProvider>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  AtlasAIComposer, AtlasAIMessageBubble, AtlasAlert, AtlasAvatar, AtlasButton, AtlasDataTable, AtlasDialog, AtlasEmpty, AtlasInput,
  AtlasObjectCell, AtlasOrb, AtlasPageHeader, AtlasPanel, AtlasProgress, AtlasProvider, AtlasRowActions, AtlasSearchInput,
  AtlasStatusTag, AtlasTableToolbar, AtlasTabs, AtlasTag,
} from '@atlas-eids/vue'
import {
  Bell, BookOpen, Box, Briefcase, Clock3, Database, Download, ExternalLink, Eye, FileText, HardDrive, Headphones,
  Layers3, Moon, RefreshCw, Settings, ShieldCheck, Sparkles, Sun, Trash2, Upload, Users,
} from '@lucide/vue'
import { knowledgeDocuments, knowledgeSpaces, statusMeta, type KnowledgeDocument, type KnowledgeStatus } from '../../shared/knowledge-model'

type StatusFilter = 'all' | KnowledgeStatus

const theme = ref<'light' | 'dark'>('light')
const activeSpace = ref('all')
const activeStatus = ref<StatusFilter>('all')
const query = ref('')
const documents = ref<KnowledgeDocument[]>(knowledgeDocuments.map((item) => ({ ...item })))
const selectedIds = ref<Array<string | number>>([])
const activeDocumentId = ref(knowledgeDocuments[0].id)
const sortKey = ref('updatedAt')
const sortDirection = ref<'ascending' | 'descending'>('descending')
const syncing = ref(false)
const notice = ref<string | null>(null)
const dialogOpen = ref(false)
const importName = ref('')
const pendingFile = ref(false)
const question = ref('哪些知识涉及高风险 Agent 工具审批？')
const askedQuestion = ref('哪些知识涉及高风险 Agent 工具审批？')
const aiBusy = ref(false)

const columns = [
  { key: 'name', title: '知识文档', width: '34%', sortable: true },
  { key: 'category', title: '分类', width: '15%' },
  { key: 'status', title: '索引状态', width: 92 },
  { key: 'chunks', title: '分块', width: 70, align: 'end' as const, sortable: true },
  { key: 'owner', title: '负责人', width: 88 },
  { key: 'updatedAt', title: '更新时间', width: 102, sortable: true },
  { key: 'actions', title: '操作', width: 104, align: 'end' as const },
]
const rowActions = [
  { id: 'open', label: '查看详情' },
  { id: 'download', label: '下载' },
  { id: 'delete', label: '删除', danger: true },
]
const citations = [
  { id: 'c1', title: 'Agent 工具审批规范', source: '制度与治理', excerpt: '高风险工具必须进入 Approval。', confidence: .98 },
  { id: 'c2', title: '多租户数据隔离手册', source: '制度与治理', excerpt: '执行前再次校验租户上下文。', confidence: .94 },
]

const activeSpaceLabel = computed(() => activeSpace.value === 'all' ? '全部空间' : knowledgeSpaces.find((space) => space.id === activeSpace.value)?.name ?? '全部空间')
const filteredDocuments = computed(() => {
  const normalized = query.value.trim().toLowerCase()
  const rows = documents.value.filter((item) =>
    (activeSpace.value === 'all' || item.spaceId === activeSpace.value) &&
    (activeStatus.value === 'all' || item.status === activeStatus.value) &&
    (!normalized || [item.name, item.id, item.category, item.owner, ...item.tags].join(' ').toLowerCase().includes(normalized)),
  )
  return [...rows].sort((a, b) => {
    const aValue = String(a[sortKey.value as keyof KnowledgeDocument] ?? '')
    const bValue = String(b[sortKey.value as keyof KnowledgeDocument] ?? '')
    return aValue.localeCompare(bValue, 'zh-CN') * (sortDirection.value === 'ascending' ? 1 : -1)
  })
})
const currentDocument = computed(() => filteredDocuments.value.find((item) => item.id === activeDocumentId.value) ?? filteredDocuments.value[0])
const statusItems = computed(() => [
  { id: 'all', label: '全部', count: documents.value.length },
  ...(['indexed', 'syncing', 'review', 'failed'] as KnowledgeStatus[]).map((id) => ({ id, label: statusMeta[id].label, count: documents.value.filter((item) => item.status === id).length })),
])

const openDocument = (document: KnowledgeDocument) => { activeDocumentId.value = document.id }
const statusTone = (status: KnowledgeStatus) => statusMeta[status].tone
const statusLabel = (status: KnowledgeStatus) => statusMeta[status].label
const handleSort = (value: { key: string; direction: 'ascending' | 'descending' }) => { sortKey.value = value.key; sortDirection.value = value.direction }
const handleRowAction = (action: string, document: KnowledgeDocument) => {
  if (action === 'open') openDocument(document)
  if (action === 'download') notice.value = `已准备下载：${document.name}`
  if (action === 'delete') notice.value = `“${document.name}”需要管理员审批后才能删除。`
}
const syncKnowledge = () => {
  if (syncing.value) return
  syncing.value = true
  notice.value = '正在检查 4 个知识源的增量更新...'
  window.setTimeout(() => {
    documents.value = documents.value.map((item) => item.status === 'syncing' ? { ...item, status: 'indexed', coverage: 100, updatedAt: '刚刚' } : item)
    syncing.value = false
    notice.value = '同步完成：新增 28 个分块，1 个文档索引已更新。'
  }, 900)
}
const selectFile = () => { pendingFile.value = true; if (!importName.value) importName.value = '企业知识文档.pdf' }
const submitImport = () => {
  if (!pendingFile.value) return
  dialogOpen.value = false
  notice.value = `“${importName.value || '新知识文档'}”已进入解析队列。`
  pendingFile.value = false
  importName.value = ''
}
const askKnowledge = (value: string) => {
  question.value = value
  askedQuestion.value = value
  aiBusy.value = true
  window.setTimeout(() => { aiBusy.value = false }, 720)
}
</script>
