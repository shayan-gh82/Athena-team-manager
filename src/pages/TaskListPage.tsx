import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import TaskFilters from '@/components/task/TaskFilters'
import TaskRow from '@/components/task/TaskRow'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import TaskForm from '@/components/task/TaskForm'
import EmptyState from '@/components/ui/EmptyState'
import { applyTaskFilters } from '@/utils/taskFilter'
import { useI18n } from '@/i18n'

const PAGE_SIZE = 8

export default function TaskListPage() {
  const { language, t }=useI18n();const { projectId = '' } = useParams()
  const currentUserId = useAppSelector((s) => s.auth.currentUserId)
  const canManage = useAppSelector((s) => s.users.users.find((u) => u.id === currentUserId)?.role === 'manager')
  const tasks = useAppSelector((s) => s.task.tasks.filter((task) => task.projectId === projectId && !task.isArchived))
  const filters = useAppSelector((s) => s.taskFilter)
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)
  const visible = useMemo(() => applyTaskFilters(tasks, filters), [tasks, filters])
  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))
  const paged = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const PreviousIcon=language==='fa'?ChevronRight:ChevronLeft
  const NextIcon=language==='fa'?ChevronLeft:ChevronRight

  useEffect(() => setPage(1), [filters.search, filters.priority, filters.columnId, filters.assigneeId, filters.dueDateFrom, filters.dueDateTo, filters.sortBy, projectId])
  useEffect(() => { if (page > totalPages) setPage(totalPages) }, [page, totalPages])

  return <div>
    <div className="mb-4 flex items-center justify-between gap-3">
      <div><h2 className="text-xl font-bold">{t('Task list')}</h2><p className="text-xs" style={{ color: 'rgb(var(--muted))' }}>{visible.length} {t('of')} {tasks.length} {t('Tasks')}</p></div>
      {canManage && <Button icon={Plus} onClick={() => setOpen(true)}>{t('Add task')}</Button>}
    </div>
    <TaskFilters projectId={projectId} />
    {visible.length ? <>
      <div className="app-card hidden overflow-hidden md:block"><div className="overflow-x-auto"><table className={`w-full min-w-[760px] text-sm ${language==='fa'?'text-right':'text-left'}`}><thead className="bg-[rgb(var(--surface-alt))] text-xs" style={{ color: 'rgb(var(--muted))' }}><tr><th className="px-4 py-3">{t('Task')}</th><th className="px-4 py-3">{t('Status')}</th><th className="px-4 py-3">{t('Priority')}</th><th className="px-4 py-3">{t('Assignee')}</th><th className="px-4 py-3">{t('Due')}</th><th className="px-4 py-3">{t('Actions')}</th></tr></thead><tbody>{paged.map((task) => <TaskRow key={task.id} task={task} />)}</tbody></table></div></div>
      <div className="space-y-3 md:hidden">{paged.map((task) => <TaskRow key={task.id} task={task} mode="card" />)}</div>
      {totalPages > 1 && <div className="mt-4 flex items-center justify-between gap-3"><span className="text-xs" style={{ color: 'rgb(var(--muted))' }}>{t('Page')} {page} {t('of')} {totalPages}</span><div className="flex gap-2"><Button size="sm" variant="secondary" disabled={page === 1} onClick={() => setPage((x) => Math.max(1, x - 1))}><PreviousIcon size={17} /> {t('Previous')}</Button><Button size="sm" variant="secondary" disabled={page === totalPages} onClick={() => setPage((x) => Math.min(totalPages, x + 1))}>{t('Next')} <NextIcon size={17} /></Button></div></div>}
    </> : <EmptyState title={t('No matching tasks')} description={t('Create a task or change your filters.')} action={canManage ? <Button onClick={() => setOpen(true)}>{t('Add task')}</Button> : undefined} />}
    <Modal isOpen={open} onClose={() => setOpen(false)} title={t('Add task')}><TaskForm projectId={projectId} onClose={() => setOpen(false)} /></Modal>
  </div>
}
