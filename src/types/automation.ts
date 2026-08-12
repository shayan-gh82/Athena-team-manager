export type AutomationTrigger = 'task_completed' | 'due_tomorrow' | 'high_priority_created'
export type AutomationAction = 'notify_assignee' | 'notify_manager'

export interface AutomationRule {
  id: string
  name: string
  projectId?: string
  trigger: AutomationTrigger
  action: AutomationAction
  enabled: boolean
  createdAt: string
}
