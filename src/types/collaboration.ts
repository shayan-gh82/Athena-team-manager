export interface Label {
  id: string
  projectId: string
  name: string
  color: string
}

export interface ChecklistItem {
  id: string
  taskId: string
  title: string
  completed: boolean
  order: number
  createdAt: string
}

export interface Subtask {
  id: string
  taskId: string
  title: string
  completed: boolean
  assigneeId?: string
  dueDate?: string
  createdAt: string
}

export interface Comment {
  id: string
  taskId: string
  authorId: string
  parentId?: string
  content: string
  createdAt: string
  updatedAt?: string
}

export type ActivityType =
  | 'project-created'
  | 'project-updated'
  | 'task-created'
  | 'task-updated'
  | 'task-moved'
  | 'task-assigned'
  | 'task-completed'
  | 'comment-added'
  | 'member-added'

export interface Activity {
  id: string
  projectId?: string
  taskId?: string
  userId: string
  type: ActivityType
  message: string
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'danger'
  isRead: boolean
  taskId?: string
  projectId?: string
  signature?: string
  createdAt: string
}

export interface TaskDependency {
  id: string
  taskId: string
  dependsOnTaskId: string
  createdAt: string
}

export interface Milestone {
  id: string
  projectId: string
  title: string
  dueDate: string
  completed: boolean
  createdAt: string
}

export interface TimeEntry {
  id: string
  taskId: string
  userId: string
  minutes: number
  note?: string
  createdAt: string
}

export interface Attachment {
  id: string
  taskId: string
  name: string
  type: string
  size: number
  dataUrl: string
  uploadedBy: string
  createdAt: string
}

export interface CustomFieldDefinition {
  id: string
  projectId: string
  name: string
  type: 'text' | 'number' | 'date' | 'select'
  options?: string[]
}

export interface CustomFieldValue {
  id: string
  taskId: string
  fieldId: string
  value: string
}
