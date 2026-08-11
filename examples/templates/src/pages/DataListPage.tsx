import { useMemo, useState } from 'react'
import { AtlasButton, AtlasDrawer, AtlasInput, AtlasPagination, AtlasSelect, AtlasTable, AtlasTag, type AtlasTableColumn } from '@atlas-eids/react'
import { Filter, SlidersHorizontal, Trash2 } from 'lucide-react'
import { ExportButton, PageHeader, Panel, StatusDot } from '../components/Page'

interface Order { id: string; name: string; customer: string; amount: string; status: '运行中' | '待复核' | '已完成'; updated: string }
const orders: Order[] = [
  { id: 'AT-1048', name: '内容质量检查', customer: '华东零售事业群', amount: '¥ 86,400', status: '运行中', updated: '10 分钟前' },
  { id: 'AT-1047', name: '知识索引更新', customer: '供应链中心', amount: '¥ 42,800', status: '待复核', updated: '35 分钟前' },
  { id: 'AT-1046', name: '数据异常识别', customer: '财务共享中心', amount: '¥ 128,600', status: '已完成', updated: '1 小时前' },
  { id: 'AT-1045', name: '周报摘要生成', customer: '经营管理部', amount: '¥ 18,900', status: '已完成', updated: '2 小时前' },
  { id: 'AT-1044', name: '合同条款比对', customer: '法务与合规部', amount: '¥ 66,700', status: '待复核', updated: '昨天 16:32' }
]

export function DataListPage() {
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('全部')
  const [selected, setSelected] = useState<Array<string | number>>([])
  const [active, setActive] = useState<Order | null>(null)
  const [page, setPage] = useState(1)
  const rows = useMemo(() => orders.filter((order) => (status === '全部' || order.status === status) && `${order.name}${order.customer}${order.id}`.includes(keyword)), [keyword, status])
  const columns: AtlasTableColumn<Order>[] = [
    { key: 'id', title: '编号' }, { key: 'name', title: '任务名称', render: (row) => <button className="table-link" onClick={() => setActive(row)}>{row.name}</button> },
    { key: 'customer', title: '所属组织' }, { key: 'amount', title: '预算', align: 'end' },
    { key: 'status', title: '状态', render: (row) => <StatusDot tone={row.status === '待复核' ? 'warning' : 'success'}>{row.status}</StatusDot> }, { key: 'updated', title: '更新时间' }
  ]
  return <>
    <PageHeader eyebrow="列表与数据管理" title="数据列表页" description="查询、选择、批量操作与对象详情保持在稳定的信息层级中。" primary="新建任务" />
    <Panel className="data-table-panel">
      <div className="filter-bar">
        <AtlasInput aria-label="搜索任务" placeholder="搜索编号、任务或组织" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
        <AtlasSelect aria-label="任务状态" value={status} onChange={(event) => setStatus(event.target.value)} options={[{ label: '全部状态', value: '全部' }, { label: '运行中', value: '运行中' }, { label: '待复核', value: '待复核' }, { label: '已完成', value: '已完成' }]} />
        <AtlasButton><Filter size={15}/>高级筛选</AtlasButton>
        <div className="filter-spacer"/>
        <ExportButton/><AtlasButton aria-label="表格设置" title="表格设置"><SlidersHorizontal size={16}/></AtlasButton>
      </div>
      {selected.length > 0 && <div className="selection-bar"><span>已选择 <b>{selected.length}</b> 项</span><AtlasButton intent="danger" size="compact" onClick={() => setSelected([])}><Trash2 size={14}/>批量移除</AtlasButton></div>}
      <AtlasTable caption="企业任务列表" columns={columns} rows={rows} selectedIds={selected} onSelect={setSelected}/>
      <div className="table-footer"><span>共 128 条记录</span><AtlasPagination page={page} pageCount={8} onChange={setPage}/></div>
    </Panel>
    <AtlasDrawer open={Boolean(active)} title="任务详情" onClose={() => setActive(null)} footer={<><AtlasButton onClick={() => setActive(null)}>关闭</AtlasButton><AtlasButton intent="primary">进入任务</AtlasButton></>}>
      {active && <div className="drawer-detail"><AtlasTag intent={active.status === '待复核' ? 'warning' : 'success'}>{active.status}</AtlasTag><h2>{active.name}</h2><p>{active.id} · {active.customer}</p><dl><div><dt>预算金额</dt><dd>{active.amount}</dd></div><div><dt>最后更新</dt><dd>{active.updated}</dd></div><div><dt>责任人</dt><dd>王六 / 数据运营</dd></div></dl></div>}
    </AtlasDrawer>
  </>
}
