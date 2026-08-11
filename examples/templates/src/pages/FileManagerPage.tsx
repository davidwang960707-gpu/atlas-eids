import { useState } from 'react'
import { AtlasButton, AtlasDrawer, AtlasDropdown, AtlasSearchInput, AtlasTag } from '@atlas-eids/react'
import { Download, FileCode2, FileText, Folder, FolderOpen, Grid2X2, List, MoreHorizontal, Upload } from 'lucide-react'
import { PageHeader, Panel } from '../components/Page'

const files = [
  { id: 'f1', name: '企业智能设计规范.pdf', type: 'PDF', size: '8.6 MB', updated: '今天 10:42', owner: '王六', status: '已发布' },
  { id: 'f2', name: 'Agent 安全策略.md', type: 'Markdown', size: '42 KB', updated: '昨天 16:28', owner: '林可', status: '草稿' },
  { id: 'f3', name: 'Design Tokens v2.json', type: 'JSON', size: '18 KB', updated: '8 月 9 日', owner: '周宁', status: '已发布' },
  { id: 'f4', name: '多租户接入说明.docx', type: 'Word', size: '1.2 MB', updated: '8 月 8 日', owner: '吴越', status: '待复核' }
]

export function FileManagerPage() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<(typeof files)[number] | null>(files[0])
  const [preview, setPreview] = useState(false)
  const visible = files.filter((file) => file.name.toLowerCase().includes(query.toLowerCase()))
  return <>
    <PageHeader eyebrow="业务场景" title="文件管理页" description="目录、文件列表与预览保持清晰主从关系，覆盖检索、上传和版本操作。" primary="上传文件" />
    <div className="file-layout">
      <aside className="file-tree"><h2>全部文件</h2><nav><button className="active"><FolderOpen size={16}/>团队空间</button><button><Folder size={16}/>产品设计</button><button><Folder size={16}/>技术架构</button><button><Folder size={16}/>交付资料</button><button><Folder size={16}/>安全合规</button></nav><div className="storage"><span>存储空间</span><progress value="68" max="100">68%</progress><small>68 GB / 100 GB</small></div></aside>
      <Panel className="file-panel">
        <div className="file-toolbar"><AtlasSearchInput value={query} onChange={setQuery} onSearch={setQuery} placeholder="搜索当前目录"/><div><AtlasButton><Upload size={15}/>上传</AtlasButton><AtlasButton aria-label="列表视图"><List size={16}/></AtlasButton><AtlasButton aria-label="网格视图"><Grid2X2 size={16}/></AtlasButton></div></div>
        <table className="file-table"><thead><tr><th>名称</th><th>所有者</th><th>更新时间</th><th>大小</th><th>状态</th><th><span className="sr-only">操作</span></th></tr></thead><tbody>{visible.map((file) => <tr key={file.id} className={selected?.id === file.id ? 'selected' : ''} onClick={() => setSelected(file)}><td><span className="file-name">{file.type === 'JSON' ? <FileCode2 size={18}/> : <FileText size={18}/>}<button onClick={(event) => { event.stopPropagation(); setSelected(file); setPreview(true) }}>{file.name}</button></span></td><td>{file.owner}</td><td>{file.updated}</td><td>{file.size}</td><td><AtlasTag intent={file.status === '已发布' ? 'success' : file.status === '待复核' ? 'warning' : 'neutral'}>{file.status}</AtlasTag></td><td><AtlasDropdown label={<MoreHorizontal size={15}/>} items={[{ id: 'preview', label: '预览' }, { id: 'download', label: '下载' }, { id: 'delete', label: '移入回收站', danger: true }]} onSelect={(action) => action === 'preview' && setPreview(true)}/></td></tr>)}</tbody></table>
        <div className="table-footer"><span>{visible.length} 个文件</span><span>已启用版本历史与操作审计</span></div>
      </Panel>
    </div>
    <AtlasDrawer open={preview} title="文件预览" onClose={() => setPreview(false)} width={520} footer={<><AtlasButton><Download size={15}/>下载</AtlasButton><AtlasButton intent="primary">打开文件</AtlasButton></>}><div className="document-preview"><span>ATLAS EIDS</span><h2>{selected?.name}</h2><p>此预览展示文件的阅读模式。文件内容、版本和权限由当前租户空间统一管理。</p><h3>内容摘要</h3><p>建立面向 AI 原生企业应用的基础视觉语言、组件语义、页面模式和可信执行边界。</p><h3>当前版本</h3><dl><div><dt>版本号</dt><dd>v0.2.0</dd></div><div><dt>更新人</dt><dd>{selected?.owner}</dd></div><div><dt>更新时间</dt><dd>{selected?.updated}</dd></div></dl></div></AtlasDrawer>
  </>
}
