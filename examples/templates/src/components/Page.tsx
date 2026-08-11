import type { ReactNode } from 'react'
import { AtlasBreadcrumb, AtlasButton } from '@atlas-eids/react'
import { Download, Plus, RefreshCw } from 'lucide-react'

export function PageHeader({ eyebrow, title, description, primary = '新建', onPrimary, secondary = '刷新' }: { eyebrow: string; title: string; description: string; primary?: string; onPrimary?: () => void; secondary?: string }) {
  return <header className="page-header">
    <div>
      <AtlasBreadcrumb items={[{ label: '工作台', href: '#/workbench' }, { label: eyebrow }]} />
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
    <div className="page-actions">
      <AtlasButton onClick={() => window.location.reload()}><RefreshCw size={15} />{secondary}</AtlasButton>
      <AtlasButton intent="primary" onClick={onPrimary}><Plus size={15} />{primary}</AtlasButton>
    </div>
  </header>
}

export function Panel({ title, description, action, children, className = '' }: { title?: string; description?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`page-panel ${className}`}>
    {(title || description || action) && <header className="panel-header"><div>{title && <h2>{title}</h2>}{description && <p>{description}</p>}</div>{action}</header>}
    <div className="panel-body">{children}</div>
  </section>
}

export function StatusDot({ tone = 'success', children }: { tone?: 'success' | 'warning' | 'danger' | 'neutral'; children: ReactNode }) {
  return <span className={`status-dot is-${tone}`}><i />{children}</span>
}

export function ExportButton() {
  return <AtlasButton><Download size={15} />导出</AtlasButton>
}

export function MiniBars({ values }: { values: number[] }) {
  return <span className="mini-bars" aria-label={`趋势数据：${values.join('、')}`}>{values.map((value, index) => <i key={index} style={{ height: `${value}%` }} />)}</span>
}
