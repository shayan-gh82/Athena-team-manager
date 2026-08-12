import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, Plus, Settings2, Trash2 } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addColumn, removeColumn, updateColumn } from '@/store/boardSlice'
import { addTask, moveTask } from '@/store/taskSlice'
import { addActivity } from '@/store/collaborationSlice'
import { addNotification } from '@/store/notificationsSlice'
import { addDays, addMonths } from '@/utils/date'
import TaskFilters from '@/components/task/TaskFilters'
import KanbanTaskCard from '@/components/task/KanbanTaskCard'
import TaskForm from '@/components/task/TaskForm'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { applyTaskFilters } from '@/utils/taskFilter'
import { useI18n } from '@/i18n'

export default function BoardPage() {
  const { language, t } = useI18n()
  const { projectId = '' } = useParams()
  const dispatch = useAppDispatch()
  const currentUserId = useAppSelector((s) => s.auth.currentUserId)!
  const currentUser = useAppSelector((s) => s.users.users.find((u) => u.id === currentUserId))
  const canManage = currentUser?.role === 'manager'
  const users = useAppSelector((s) => s.users.users)
  const automationRules = useAppSelector((s) => s.automation.rules)
  const columns = useAppSelector((s) => s.board.columns.filter((c) => c.projectId === projectId).sort((a, b) => a.order - b.order))
  const tasks = useAppSelector((s) => s.task.tasks.filter((task) => task.projectId === projectId && !task.isArchived))
  const filters = useAppSelector((s) => s.taskFilter)
  const visible = useMemo(() => applyTaskFilters(tasks, filters), [tasks, filters])
  const [taskOpen, setTaskOpen] = useState(false)
  const [columnOpen, setColumnOpen] = useState(false)
  const [columnTitle, setColumnTitle] = useState('')
  const [dragging, setDragging] = useState<string | null>(null)

  const drop = (columnId: string) => {
    if (!dragging) return
    const targetTasks = tasks.filter((task) => task.columnId === columnId)
    const task = tasks.find((item) => item.id === dragging)
    const nextColumn = columns.find((column) => column.id === columnId)
    const previousColumn = columns.find((column) => column.id === task?.columnId)
    dispatch(moveTask({ taskId: dragging, columnId, order: targetTasks.length }))

    if (task) {
      dispatch(addActivity({
        projectId,
        taskId: task.id,
        userId: currentUserId,
        type: nextColumn?.isCompletedColumn ? 'task-completed' : 'task-moved',
        message: `moved ${task.title} to ${nextColumn?.title ?? 'column'}`,
      }))

      if (nextColumn?.isCompletedColumn && !previousColumn?.isCompletedColumn) {
        const managers = users.filter((user) => user.role === 'manager' && user.isActive)
        automationRules
          .filter((rule) => rule.enabled && rule.trigger === 'task_completed' && (!rule.projectId || rule.projectId === projectId))
          .forEach((rule) => {
            const targets = rule.action === 'notify_assignee' ? users.filter((user) => user.id === task.assigneeId) : managers
            targets.forEach((target) => dispatch(addNotification({
              userId: target.id,
              title: 'Task completed',
              message: `${task.title} was completed.`,
              type: 'success',
              taskId: task.id,
              projectId,
              signature: `completed:${rule.id}:${task.id}:${new Date().toISOString().slice(0, 10)}`,
            })))
          })

        if (task.recurrence && task.recurrence !== 'none' && task.dueDate) {
          const nextDue = task.recurrence === 'daily'
            ? addDays(task.dueDate, 1)
            : task.recurrence === 'weekly'
              ? addDays(task.dueDate, 7)
              : addMonths(task.dueDate, 1)
          const active = columns.find((column) => !column.isCompletedColumn)
          if (active) {
            dispatch(addTask({
              projectId,
              createdBy: currentUserId,
              data: {
                title: task.title,
                description: task.description,
                priority: task.priority,
                columnId: active.id,
                assigneeId: task.assigneeId,
                startDate: nextDue,
                dueDate: nextDue,
                labelIds: task.labelIds,
                estimateMinutes: task.estimateMinutes,
                recurrence: task.recurrence,
              },
            }))
          }
        }
      }
    }
    setDragging(null)
  }

  const moveColumn = (index: number, delta: -1 | 1) => {
    const targetIndex = index + delta
    if (targetIndex < 0 || targetIndex >= columns.length) return
    const current = columns[index]
    const target = columns[targetIndex]
    if (!current || !target) return
    dispatch(updateColumn({ id: current.id, changes: { order: target.order } }))
    dispatch(updateColumn({ id: target.id, changes: { order: current.order } }))
  }

  const PreviousIcon = language === 'fa' ? ArrowRight : ArrowLeft
  const NextIcon = language === 'fa' ? ArrowLeft : ArrowRight

  return <div>
    <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div><h2 className="text-xl font-bold">{t('Board')}</h2><p className="text-xs" style={{ color: 'rgb(var(--muted))' }}>{t('Drag tasks between customizable columns.')}</p></div>
      {canManage && <div className="flex flex-wrap gap-2"><Button variant="secondary" icon={Settings2} onClick={() => setColumnOpen(true)}>{t('Columns')}</Button><Button icon={Plus} onClick={() => setTaskOpen(true)}>{t('Add task')}</Button></div>}
    </div>
    <TaskFilters projectId={projectId} />
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
      {columns.map((column) => <section key={column.id} className="w-[310px] shrink-0 rounded-2xl border p-3" style={{ background: 'rgb(var(--surface-alt) / .84)', borderColor: 'rgb(var(--border) / .72)' }} onDragOver={(e) => e.preventDefault()} onDrop={() => drop(column.id)}>
        <div className="mb-3 flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full shadow-sm" style={{ background: column.color }} /><h3 className="font-semibold">{t(column.title)}</h3><span className="rounded-full bg-[rgb(var(--surface))] px-2 py-0.5 text-[10px]">{visible.filter((task) => task.columnId === column.id).length}</span>{column.isCompletedColumn && <CheckCircle2 className="ms-auto" size={18} style={{ color: 'rgb(var(--success))' }} />}</div>
        <div className="min-h-24 space-y-3">{visible.filter((task) => task.columnId === column.id).sort((a, b) => a.order - b.order).map((task) => <KanbanTaskCard key={task.id} task={task} onDragStart={setDragging} canDrag={Boolean(canManage || task.assigneeId === currentUserId)} />)}</div>
        {canManage && <button className={`mt-3 flex w-full items-center gap-2 rounded-xl p-2 text-xs hover:bg-[rgb(var(--surface))] ${language==='fa'?'text-right':'text-left'}`} onClick={() => setTaskOpen(true)}><Plus size={17} />{t('Add task')}</button>}
      </section>)}
    </div>

    <Modal isOpen={taskOpen} onClose={() => setTaskOpen(false)} title={t('Add task')}><TaskForm projectId={projectId} onClose={() => setTaskOpen(false)} /></Modal>
    <Modal isOpen={columnOpen} onClose={() => setColumnOpen(false)} title={t('Manage columns')}>
      <div className="space-y-3">
        {columns.map((column, index) => {
          const hasTasks = tasks.some((task) => task.columnId === column.id)
          return <div key={column.id} className="flex flex-wrap items-center gap-2 rounded-xl border p-2" style={{ borderColor: 'rgb(var(--border))' }}>
            <div className="flex gap-1"><button className="btn btn-ghost min-h-9 w-9 p-0" disabled={index === 0} title={t('Move left')} onClick={() => moveColumn(index, -1)}><PreviousIcon size={17} /></button><button className="btn btn-ghost min-h-9 w-9 p-0" disabled={index === columns.length - 1} title={t('Move right')} onClick={() => moveColumn(index, 1)}><NextIcon size={17} /></button></div>
            <input type="color" value={column.color ?? '#7C6CFF'} onChange={(e) => dispatch(updateColumn({ id: column.id, changes: { color: e.target.value } }))} className="h-9 w-9 rounded-lg" />
            <div className="min-w-40 flex-1"><Input value={column.title} onChange={(e) => dispatch(updateColumn({ id: column.id, changes: { title: e.target.value } }))} /></div>
            <label className="flex shrink-0 items-center gap-1.5 text-[11px]"><input type="checkbox" checked={column.isCompletedColumn} onChange={(e) => dispatch(updateColumn({ id: column.id, changes: { isCompletedColumn: e.target.checked } }))} />{t('Completed')}</label>
            <button className="btn btn-ghost min-h-10 w-10 p-0 text-red-500" disabled={hasTasks} title={hasTasks ? t('Move tasks before deleting this column') : t('Delete column')} onClick={() => dispatch(removeColumn(column.id))}><Trash2 size={18} /></button>
          </div>
        })}
        <div className="flex gap-2 border-t pt-3" style={{ borderColor: 'rgb(var(--border))' }}><Input value={columnTitle} onChange={(e) => setColumnTitle(e.target.value)} placeholder={t('New column name')} /><Button onClick={() => { if (columnTitle.trim()) { dispatch(addColumn({ projectId, title: columnTitle.trim(), order: columns.length, color: '#64748B' })); setColumnTitle('') } }}>{t('Add')}</Button></div>
        <p className="text-[11px] leading-5" style={{ color: 'rgb(var(--muted))' }}>{t('Rename, recolor and reorder columns here. A column with tasks cannot be deleted. Mark one or more columns as completed to include their tasks in project progress.')}</p>
      </div>
    </Modal>
  </div>
}
