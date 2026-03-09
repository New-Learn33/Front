import type { Project } from './project'

export interface DashboardStat {
  icon: string
  label: string
  value: number
  suffix?: string
  change: string
}

export interface DashboardStats {
  stats: DashboardStat[]
  recent_projects: Project[]
}
