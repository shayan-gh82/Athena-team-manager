import type { BoardColumn, Task } from '@/types'

export const calcProjectProgress = (tasks: Task[], columns: BoardColumn[]) => {
  if (tasks.length === 0) return 0
  const completedIds = new Set(columns.filter((c) => c.isCompletedColumn).map((c) => c.id))
  const done = tasks.filter((task) => completedIds.has(task.columnId)).length
  return Math.round((done / tasks.length) * 100)
}
