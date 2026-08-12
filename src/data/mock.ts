import type {
  Activity,
  AutomationRule,
  BoardColumn,
  ChecklistItem,
  Comment,
  Label,
  Milestone,
  Project,
  Subtask,
  Task,
  TimeEntry,
  User,
} from '@/types'

const demoHash = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'
const now = new Date().toISOString()
const today = new Date()
const isoPlus = (days: number) => {
  const d = new Date(today)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export const mockUsers: User[] = [
  { id: 'u-manager', name: 'Demo Manager', email: 'manager@aurora.local', passwordHash: demoHash, role: 'manager', isActive: true, createdAt: now, updatedAt: now },
  { id: 'u-sara', name: 'Sara Rahimi', email: 'sara@aurora.local', passwordHash: demoHash, role: 'member', isActive: true, createdAt: now, updatedAt: now },
  { id: 'u-ali', name: 'Ali Moradi', email: 'ali@aurora.local', passwordHash: demoHash, role: 'member', isActive: true, createdAt: now, updatedAt: now },
]

export const mockProjects: Project[] = [
  {
    id: 'p-web', title: 'Website Redesign', description: 'Redesign the product website with a modern responsive experience.',
    ownerId: 'u-manager', memberIds: ['u-manager', 'u-sara', 'u-ali'], status: 'active', color: '#635BFF', icon: 'globe',
    startDate: isoPlus(-10), dueDate: isoPlus(18), isFavorite: true, isArchived: false, createdAt: now, updatedAt: now,
  },
  {
    id: 'p-mobile', title: 'Mobile App Launch', description: 'Prepare the product launch plan, assets, and QA checklist.',
    ownerId: 'u-manager', memberIds: ['u-manager', 'u-sara'], status: 'planning', color: '#06B6D4', icon: 'mobile',
    startDate: isoPlus(-4), dueDate: isoPlus(28), isFavorite: false, isArchived: false, createdAt: now, updatedAt: now,
  },
]

export const mockColumns: BoardColumn[] = [
  { id: 'c-web-backlog', projectId: 'p-web', title: 'Backlog', order: 0, color: '#94A3B8', isCompletedColumn: false },
  { id: 'c-web-todo', projectId: 'p-web', title: 'To Do', order: 1, color: '#3B82F6', isCompletedColumn: false },
  { id: 'c-web-progress', projectId: 'p-web', title: 'In Progress', order: 2, color: '#8B5CF6', isCompletedColumn: false },
  { id: 'c-web-review', projectId: 'p-web', title: 'Review', order: 3, color: '#F59E0B', isCompletedColumn: false },
  { id: 'c-web-done', projectId: 'p-web', title: 'Done', order: 4, color: '#10B981', isCompletedColumn: true },
  { id: 'c-mobile-todo', projectId: 'p-mobile', title: 'To Do', order: 0, color: '#3B82F6', isCompletedColumn: false },
  { id: 'c-mobile-progress', projectId: 'p-mobile', title: 'In Progress', order: 1, color: '#8B5CF6', isCompletedColumn: false },
  { id: 'c-mobile-done', projectId: 'p-mobile', title: 'Done', order: 2, color: '#10B981', isCompletedColumn: true },
]

export const mockLabels: Label[] = [
  { id: 'l-front', projectId: 'p-web', name: 'Frontend', color: '#635BFF' },
  { id: 'l-design', projectId: 'p-web', name: 'Design', color: '#EC4899' },
  { id: 'l-urgent', projectId: 'p-web', name: 'Urgent', color: '#F43F5E' },
  { id: 'l-launch', projectId: 'p-mobile', name: 'Launch', color: '#06B6D4' },
]

export const mockTasks: Task[] = [
  { id: 't-1', projectId: 'p-web', columnId: 'c-web-progress', title: 'Build analytics dashboard', description: 'Create responsive KPI cards and charts.', priority: 'high', assigneeId: 'u-manager', startDate: isoPlus(-1), dueDate: isoPlus(2), labelIds: ['l-front'], order: 0, isArchived: false, createdBy: 'u-manager', createdAt: now, updatedAt: now, estimateMinutes: 360, recurrence: 'none' },
  { id: 't-2', projectId: 'p-web', columnId: 'c-web-todo', title: 'Finalize navigation system', description: 'Define desktop and mobile navigation interactions.', priority: 'medium', assigneeId: 'u-sara', startDate: isoPlus(0), dueDate: isoPlus(5), labelIds: ['l-design'], order: 0, isArchived: false, createdBy: 'u-manager', createdAt: now, updatedAt: now, estimateMinutes: 180, recurrence: 'none' },
  { id: 't-3', projectId: 'p-web', columnId: 'c-web-review', title: 'Review responsive states', description: 'QA mobile, tablet and desktop layouts.', priority: 'critical', assigneeId: 'u-ali', startDate: isoPlus(-2), dueDate: isoPlus(1), labelIds: ['l-urgent'], order: 0, isArchived: false, createdBy: 'u-manager', createdAt: now, updatedAt: now, estimateMinutes: 120, recurrence: 'none' },
  { id: 't-4', projectId: 'p-web', columnId: 'c-web-done', title: 'Set up Vite and TypeScript', description: 'Base project setup.', priority: 'low', assigneeId: 'u-manager', startDate: isoPlus(-10), dueDate: isoPlus(-8), labelIds: ['l-front'], order: 0, isArchived: false, createdBy: 'u-manager', createdAt: now, updatedAt: now, estimateMinutes: 60, recurrence: 'none' },
  { id: 't-5', projectId: 'p-mobile', columnId: 'c-mobile-progress', title: 'Prepare launch checklist', description: 'Coordinate release checklist with the team.', priority: 'high', assigneeId: 'u-sara', startDate: isoPlus(0), dueDate: isoPlus(7), labelIds: ['l-launch'], order: 0, isArchived: false, createdBy: 'u-manager', createdAt: now, updatedAt: now, estimateMinutes: 240, recurrence: 'weekly' },
]

export const mockChecklist: ChecklistItem[] = [
  { id: 'cl-1', taskId: 't-1', title: 'KPI cards', completed: true, order: 0, createdAt: now },
  { id: 'cl-2', taskId: 't-1', title: 'Status chart', completed: true, order: 1, createdAt: now },
  { id: 'cl-3', taskId: 't-1', title: 'Responsive polish', completed: false, order: 2, createdAt: now },
]

export const mockSubtasks: Subtask[] = [
  { id: 'st-1', taskId: 't-3', title: 'Test iPhone width', completed: true, assigneeId: 'u-ali', createdAt: now },
  { id: 'st-2', taskId: 't-3', title: 'Test tablet width', completed: false, assigneeId: 'u-ali', createdAt: now },
]

export const mockComments: Comment[] = [
  { id: 'cm-1', taskId: 't-1', authorId: 'u-sara', content: 'Dashboard direction looks good. @Demo Manager please review the mobile spacing.', createdAt: now },
]

export const mockActivities: Activity[] = [
  { id: 'a-1', projectId: 'p-web', taskId: 't-1', userId: 'u-manager', type: 'task-updated', message: 'updated Build analytics dashboard', createdAt: now },
  { id: 'a-2', projectId: 'p-web', userId: 'u-sara', type: 'comment-added', message: 'commented on Build analytics dashboard', createdAt: now },
]

export const mockMilestones: Milestone[] = [
  { id: 'm-1', projectId: 'p-web', title: 'Design sign-off', dueDate: isoPlus(4), completed: false, createdAt: now },
  { id: 'm-2', projectId: 'p-web', title: 'Production-ready UI', dueDate: isoPlus(16), completed: false, createdAt: now },
]

export const mockTimeEntries: TimeEntry[] = [
  { id: 'te-1', taskId: 't-1', userId: 'u-manager', minutes: 95, note: 'Dashboard cards and chart layout', createdAt: now },
]

export const mockAutomationRules: AutomationRule[] = [
  { id: 'r-1', name: 'Notify assignee when due tomorrow', trigger: 'due_tomorrow', action: 'notify_assignee', enabled: true, createdAt: now },
  { id: 'r-2', name: 'Notify manager when a task is completed', trigger: 'task_completed', action: 'notify_manager', enabled: true, createdAt: now },
]
