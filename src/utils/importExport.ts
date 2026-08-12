import type { BoardColumn, Project, Task, TaskPriority, User } from '@/types'

const escapeHtml = (value: string) => value.replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch] ?? ch)

export function openPrintableWorkspaceReport(data: { projects: Project[]; tasks: Task[]; users: User[]; columns: BoardColumn[] }) {
  const win = window.open('', '_blank')
  if (!win) {
    window.alert('Please allow pop-ups to export the printable PDF report.')
    return
  }
  try { win.opener = null } catch { /* browser may block opener assignment */ }
  const completed = new Set(data.columns.filter((c) => c.isCompletedColumn).map((c) => c.id))
  const rows = data.projects.map((project) => {
    const tasks = data.tasks.filter((task) => task.projectId === project.id)
    const done = tasks.filter((task) => completed.has(task.columnId)).length
    const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0
    return `<tr><td>${escapeHtml(project.title)}</td><td>${escapeHtml(project.status)}</td><td>${tasks.length}</td><td>${progress}%</td><td>${escapeHtml(project.dueDate ?? '—')}</td></tr>`
  }).join('')
  win.document.write(`<!doctype html><html><head><title>Athena Workspace Report</title><style>body{font-family:Arial,sans-serif;padding:32px;color:#111}h1{margin:0 0 8px}.muted{color:#666;margin-bottom:24px}table{width:100%;border-collapse:collapse}th,td{padding:10px;border:1px solid #ddd;text-align:left}th{background:#f5f5f7}.footer{margin-top:24px;font-size:12px;color:#777}@media print{button{display:none}}</style></head><body><h1>Athena Workspace Report</h1><div class="muted">Generated ${new Date().toLocaleString()} · ${data.users.length} team members</div><table><thead><tr><th>Project</th><th>Status</th><th>Tasks</th><th>Progress</th><th>Due</th></tr></thead><tbody>${rows}</tbody></table><div class="footer">Use your browser's “Save as PDF” option in the print dialog.</div><script>window.onload=()=>setTimeout(()=>window.print(),250)</script></body></html>`)
  win.document.close()
}

function parseCsvLine(line: string) {
  const out: string[] = []
  let current = ''
  let quoted = false
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') { current += '"'; i += 1 }
      else quoted = !quoted
    } else if (ch === ',' && !quoted) { out.push(current); current = '' }
    else current += ch
  }
  out.push(current)
  return out
}

export type ImportedTaskRow = {
  title: string
  priority: TaskPriority
  projectId: string
  columnId: string
  assigneeId?: string
  startDate?: string
  dueDate?: string
}

export function parseTasksCsv(text: string): ImportedTaskRow[] {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return []
  const header = parseCsvLine(lines[0]!).map((x) => x.trim().toLowerCase())
  const idx = (name: string) => header.indexOf(name.toLowerCase())
  const titleIndex = idx('title')
  const priorityIndex = idx('priority')
  const projectIndex = idx('project id')
  const columnIndex = idx('column id')
  if ([titleIndex, priorityIndex, projectIndex, columnIndex].some((x) => x < 0)) throw new Error('CSV headers do not match the Athena task export format.')
  return lines.slice(1).map(parseCsvLine).map((cells) => {
    const rawPriority = cells[priorityIndex]?.trim().toLowerCase()
    const priority: TaskPriority = rawPriority === 'critical' || rawPriority === 'high' || rawPriority === 'low' ? rawPriority : 'medium'
    return {
      title: cells[titleIndex]?.trim() ?? '',
      priority,
      projectId: cells[projectIndex]?.trim() ?? '',
      columnId: cells[columnIndex]?.trim() ?? '',
      assigneeId: cells[idx('assignee id')]?.trim() || undefined,
      startDate: cells[idx('start date')]?.trim() || undefined,
      dueDate: cells[idx('due date')]?.trim() || undefined,
    }
  }).filter((row) => row.title && row.projectId && row.columnId)
}
