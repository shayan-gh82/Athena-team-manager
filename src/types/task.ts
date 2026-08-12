export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'
export type TaskRecurrence = 'none' | 'daily' | 'weekly' | 'monthly'

export interface Task {
  id: string
  projectId: string
  columnId: string
  title: string
  description: string
  priority: TaskPriority
  assigneeId?: string
  startDate?: string
  dueDate?: string
  labelIds: string[]
  order: number
  isArchived: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  estimateMinutes?: number
  recurrence?: TaskRecurrence
}

export interface TaskFormData {
  title: string
  description: string
  priority: TaskPriority
  columnId: string
  assigneeId?: string
  startDate?: string
  dueDate?: string
  labelIds: string[]
  estimateMinutes?: number
  recurrence?: TaskRecurrence
}
