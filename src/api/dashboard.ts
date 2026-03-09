import api from './client'
import type { DashboardStats } from '@/types/dashboard'

export const dashboardApi = {
  stats: () =>
    api.get<DashboardStats>('/dashboard/stats'),
}
