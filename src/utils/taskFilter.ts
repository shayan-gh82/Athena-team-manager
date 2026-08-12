import type { Task } from '@/types'
import type { PriorityFilter, SortOption } from '@/store/taskFilterSlice'

export type TaskFilterValues = {
  search: string
  priority: PriorityFilter
  columnId: string
  assigneeId: string
  dueDateFrom: string
  dueDateTo: string
  sortBy: SortOption
}

const priorityRank = { critical: 4, high: 3, medium: 2, low: 1 }

export function applyTaskFilters(tasks: Task[], filters: TaskFilterValues) {
  const searched = tasks.filter((task) => task.title.toLowerCase().includes(filters.search.trim().toLowerCase()))
  const filtered = searched.filter((task) => {
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false
    if (filters.columnId !== 'all' && task.columnId !== filters.columnId) return false
    if (filters.assigneeId !== 'all' && task.assigneeId !== filters.assigneeId) return false
    if (filters.dueDateFrom && (!task.dueDate || task.dueDate < filters.dueDateFrom)) return false
    if (filters.dueDateTo && (!task.dueDate || task.dueDate > filters.dueDateTo)) return false
    return true
  })
  return [...filtered].sort((a, b) => {
    switch (filters.sortBy) {
      case 'dueDateAsc': return (a.dueDate ?? '9999-12-31').localeCompare(b.dueDate ?? '9999-12-31')
      case 'dueDateDesc': return (b.dueDate ?? '').localeCompare(a.dueDate ?? '')
      case 'priority': return priorityRank[b.priority] - priorityRank[a.priority]
      case 'title': return a.title.localeCompare(b.title)
      default: return a.order - b.order
    }
  })
}
