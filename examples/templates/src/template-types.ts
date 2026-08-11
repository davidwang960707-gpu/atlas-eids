import type { ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'

export interface TemplateRoute {
  id: string
  group: '通用页面' | '业务场景' | 'AI 原生'
  label: string
  description: string
  icon: LucideIcon
  component: ComponentType
}
