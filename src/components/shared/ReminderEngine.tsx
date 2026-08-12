import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addNotification } from '@/store/notificationsSlice'
import { daysUntil, todayIso } from '@/utils/date'

export default function ReminderEngine() {
  const dispatch = useAppDispatch()
  const currentUserId = useAppSelector((s) => s.auth.currentUserId)
  const tasks = useAppSelector((s) => s.task.tasks)
  const columns = useAppSelector((s) => s.board.columns)
  const users = useAppSelector((s) => s.users.users)
  const rules = useAppSelector((s) => s.automation.rules)

  useEffect(() => {
    if (!currentUserId) return
    const completed = new Set(columns.filter((c) => c.isCompletedColumn).map((c) => c.id))
    const today = todayIso()
    const managers = users.filter((u) => u.role === 'manager' && u.isActive)

    tasks.forEach((task) => {
      if (!task.dueDate || completed.has(task.columnId)) return
      const days = daysUntil(task.dueDate)

      // Required built-in reminders for the assignee.
      if (task.assigneeId && days < 0) {
        dispatch(addNotification({ userId: task.assigneeId, title: 'Overdue task', message: `${task.title} is overdue.`, type: 'danger', taskId: task.id, projectId: task.projectId, signature: `overdue:${task.id}:${today}` }))
      } else if (task.assigneeId && days === 0) {
        dispatch(addNotification({ userId: task.assigneeId, title: 'Due today', message: `${task.title} is due today.`, type: 'warning', taskId: task.id, projectId: task.projectId, signature: `today:${task.id}:${today}` }))
      } else if (task.assigneeId && days > 0 && days <= 2) {
        dispatch(addNotification({ userId: task.assigneeId, title: 'Due soon', message: `${task.title} is due in ${days} day${days === 1 ? '' : 's'}.`, type: 'info', taskId: task.id, projectId: task.projectId, signature: `due-soon:${task.id}:${today}` }))
      }

      if (days === 1) {
        rules.filter((r) => r.enabled && r.trigger === 'due_tomorrow' && (!r.projectId || r.projectId === task.projectId)).forEach((rule) => {
          const targets = rule.action === 'notify_assignee'
            ? users.filter((u) => u.id === task.assigneeId)
            : managers
          targets.forEach((target) => dispatch(addNotification({ userId: target.id, title: 'Due tomorrow', message: `${task.title} is due tomorrow.`, type: 'info', taskId: task.id, projectId: task.projectId, signature: `rule:${rule.id}:${task.id}:${today}` })))
        })
      }
    })
  }, [currentUserId, tasks, columns, users, rules, dispatch])
  return null
}
