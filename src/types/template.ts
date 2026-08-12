import type { TaskPriority, TaskRecurrence } from './task'

export interface TaskTemplate {
  id: string
  name: string
  title: string
  description: string
  priority: TaskPriority
  estimateMinutes?: number
  recurrence: TaskRecurrence
  isBuiltIn: boolean
  createdBy?: string
  createdAt: string
}
