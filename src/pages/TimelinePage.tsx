import { useMemo } from 'react'
import { Diamond, Link2 } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { openTaskDrawer } from '@/store/uiSlice'
import TaskFilters from '@/components/task/TaskFilters'
import { applyTaskFilters } from '@/utils/taskFilter'
import { useI18n } from '@/i18n'

const DAY = 86_400_000

export default function TimelinePage() {
  const { t, locale } = useI18n()
  const { projectId = '' } = useParams()
  const dispatch = useAppDispatch()
  const project = useAppSelector((s) => s.project.projects.find((p) => p.id === projectId))
  const tasks = useAppSelector((s) => s.task.tasks.filter((task) => task.projectId === projectId && !task.isArchived))
  const users = useAppSelector((s) => s.users.users)
  const dependencies = useAppSelector((s) => s.collaboration.dependencies)
  const milestones = useAppSelector((s) => s.collaboration.milestones.filter((m) => m.projectId === projectId))
  const filters = useAppSelector((s) => s.taskFilter)
  const visible = useMemo(() => applyTaskFilters(tasks, filters), [tasks, filters])

  const dates = [...visible.flatMap((task) => [task.startDate, task.dueDate]), ...milestones.map((m) => m.dueDate)].filter(Boolean) as string[]
  const fallback = new Date().toISOString().slice(0, 10)
  const sortedDates = [...dates].sort()
  const start = new Date(`${project?.startDate ?? sortedDates[0] ?? fallback}T00:00:00`).getTime()
  const rawEnd = new Date(`${project?.dueDate ?? sortedDates.at(-1) ?? fallback}T00:00:00`).getTime()
  const end = Math.max(start + DAY * 6, rawEnd)
  const totalDays = Math.min(60, Math.max(7, Math.ceil((end - start) / DAY) + 1))
  const labels = Array.from({ length: totalDays }, (_, i) => new Date(start + i * DAY))
  const dayOffset = (date: string) => Math.max(0, Math.min(totalDays - 1, Math.floor((new Date(`${date}T00:00:00`).getTime() - start) / DAY)))

  return <div>
    <div className="mb-4"><h2 className="text-xl font-bold">{t('Timeline')}</h2><p className="text-xs" style={{ color: 'rgb(var(--muted))' }}>{t('Gantt-style scheduling with milestones and dependency context.')}</p></div>
    <TaskFilters projectId={projectId} />
    <div className="app-card overflow-x-auto scrollbar-thin" dir="ltr"><div className="min-w-[1000px]">
      <div className="grid border-b" style={{ gridTemplateColumns: '230px 1fr', borderColor: 'rgb(var(--border))' }}>
        <div className="p-3 text-xs font-semibold" dir="auto">{t('Task')}</div>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${totalDays},minmax(28px,1fr))` }}>{labels.map((date, i) => <div key={i} className="border-l p-2 text-center text-[9px]" style={{ borderColor: 'rgb(var(--border))', color: 'rgb(var(--muted))' }}>{new Intl.NumberFormat(locale).format(date.getDate())}</div>)}</div>
      </div>

      {milestones.length > 0 && <div className="grid border-b bg-[rgb(var(--surface-alt))]" style={{ gridTemplateColumns: '230px 1fr', borderColor: 'rgb(var(--border))' }}>
        <div className="p-3 text-xs font-semibold" dir="auto">{t('Milestones')}</div>
        <div className="relative grid min-h-12" style={{ gridTemplateColumns: `repeat(${totalDays},minmax(28px,1fr))` }}>
          {labels.map((_, i) => <div key={i} className="border-l" style={{ borderColor: 'rgb(var(--border))' }} />)}
          {milestones.map((m) => <div key={m.id} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `calc((${dayOffset(m.dueDate)} + .5) * (100% / ${totalDays}))` }} title={`${m.title} · ${m.dueDate}`}><Diamond size={19} fill={m.completed ? '#10B981' : '#F59E0B'} color={m.completed ? '#10B981' : '#F59E0B'} /></div>)}
        </div>
      </div>}

      {visible.map((task) => {
        const taskStart = new Date(`${task.startDate ?? task.dueDate ?? fallback}T00:00:00`).getTime()
        const taskEnd = new Date(`${task.dueDate ?? task.startDate ?? fallback}T00:00:00`).getTime()
        const left = Math.max(0, Math.floor((taskStart - start) / DAY))
        const span = Math.max(1, Math.floor((taskEnd - taskStart) / DAY) + 1)
        const user = users.find((u) => u.id === task.assigneeId)
        const blockedBy = dependencies.filter((dependency) => dependency.taskId === task.id).length
        return <div key={task.id} className="grid border-b last:border-b-0" style={{ gridTemplateColumns: '230px 1fr', borderColor: 'rgb(var(--border))' }}>
          <button className="p-3 text-left" dir="auto" onClick={() => dispatch(openTaskDrawer(task.id))}><div className="truncate text-xs font-semibold">{task.title}</div><div className="mt-1 flex items-center gap-2 text-[10px]" style={{ color: 'rgb(var(--muted))' }}><span>{user?.name ?? t('Unassigned')}</span>{blockedBy > 0 && <span className="flex items-center gap-1"><Link2 size={11} />{t('Blocked by')} {blockedBy}</span>}</div></button>
          <div className="relative grid min-h-14" style={{ gridTemplateColumns: `repeat(${totalDays},minmax(28px,1fr))` }}>{labels.map((_, i) => <div key={i} className="border-l" style={{ borderColor: 'rgb(var(--border))' }} />)}<button onClick={() => dispatch(openTaskDrawer(task.id))} className="absolute top-1/2 h-7 -translate-y-1/2 rounded-lg px-2 text-left text-[10px] font-semibold text-white shadow" style={{ left: `calc(${left} * (100% / ${totalDays}) + 3px)`, width: `calc(${Math.min(span, totalDays - left)} * (100% / ${totalDays}) - 6px)`, background: 'linear-gradient(90deg,#7C6CFF,#38BDF8)' }}>{task.title}</button></div>
        </div>
      })}
    </div></div>
  </div>
}
