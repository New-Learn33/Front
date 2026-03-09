import api from './client'
import type { Project, ProjectListResponse } from '@/types/project'

export const projectsApi = {
  list: (params?: { status?: string; search?: string }) =>
    api.get<ProjectListResponse>('/projects', { params }),

  get: (id: number) =>
    api.get<Project>(`/projects/${id}`),

  create: (data: Partial<Project>) =>
    api.post<Project>('/projects', data),

  update: (id: number, data: Partial<Project>) =>
    api.patch<Project>(`/projects/${id}`, data),

  delete: (id: number) =>
    api.delete(`/projects/${id}`),
}
