import type { Project, Task } from '@/types'

const download = (content: BlobPart, type: string, filename: string) => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export const exportTasksCsv = (tasks: Task[]) => {
  const rows = [
    ['Title', 'Priority', 'Project ID', 'Column ID', 'Assignee ID', 'Start Date', 'Due Date'],
    ...tasks.map((task) => [
      task.title,
      task.priority,
      task.projectId,
      task.columnId,
      task.assigneeId ?? '',
      task.startDate ?? '',
      task.dueDate ?? '',
    ]),
  ]
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n')
  download(csv, 'text/csv;charset=utf-8', 'athena-tasks.csv')
}

export const exportProjectsCsv = (projects: Project[]) => {
  const rows = [
    ['Title', 'Status', 'Start Date', 'Due Date', 'Members'],
    ...projects.map((project) => [project.title, project.status, project.startDate ?? '', project.dueDate ?? '', project.memberIds.join('|')]),
  ]
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n')
  download(csv, 'text/csv;charset=utf-8', 'athena-projects.csv')
}

export const exportBackup = (state: unknown) => {
  download(JSON.stringify(state, null, 2), 'application/json', 'athena-backup.json')
}
