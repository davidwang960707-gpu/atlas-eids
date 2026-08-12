import type { ReactNode } from 'react'
import { AtlasButton, AtlasPageHeader, AtlasPanel } from '@atlas-eids/react'
import { Download, Plus, RefreshCw } from 'lucide-react'

export function PageHeader({ eyebrow, title, description, primary = '新建', onPrimary, secondary = '刷新' }: { eyebrow: string; title: string; description: string; primary?: string; onPrimary?: () => void; secondary?: string }) {
  return <AtlasPageHeader className="page-header" title={title} description={description} breadcrumbs={[{ label: '工作台', href: '#/workbench' }, { label: eyebrow }]} actions={<div className="page-actions">
      <AtlasButton onClick={() => window.location.reload()}><RefreshCw size={15} />{secondary}</AtlasButton>
      <AtlasButton intent="primary" onClick={onPrimary}><Plus size={15} />{primary}</AtlasButton>
    </div>} />
}

export function Panel({ title, description, action, children, className = '' }: { title?: string; description?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <AtlasPanel className={`page-panel ${className}`} title={title} description={description} actions={action}>{children}</AtlasPanel>
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
