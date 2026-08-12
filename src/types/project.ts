export type ProjectStatus = 'planning' | 'active' | 'completed'

export interface Project {
  id: string
  title: string
  description: string
  ownerId: string
  memberIds: string[]
  status: ProjectStatus
  color: string
  icon?: string
  startDate?: string
  dueDate?: string
  isFavorite: boolean
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export interface ProjectFormData {
  title: string
  description: string
  status: ProjectStatus
  color: string
  startDate?: string
  dueDate?: string
  memberIds: string[]
  icon?: string
}
