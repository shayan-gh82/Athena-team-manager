import { ArchiveRestore } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleArchive } from '@/store/projectSlice'
import { toggleTaskArchive } from '@/store/taskSlice'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { useI18n } from '@/i18n'

export default function ArchivePage(){
  const { t }=useI18n();const dispatch=useAppDispatch();const projects=useAppSelector((s)=>s.project.projects.filter((p)=>p.isArchived));const tasks=useAppSelector((s)=>s.task.tasks.filter((t)=>t.isArchived))
  return <div className="page-container"><div className="mb-6"><div className="text-xs font-bold uppercase tracking-[.18em]" style={{color:'rgb(var(--primary))'}}>{t('Storage')}</div><h1 className="mt-1 text-3xl font-bold">{t('Archive')}</h1><p className="mt-2" style={{color:'rgb(var(--muted))'}}>{t('Restore archived projects and tasks.')}</p></div>{!projects.length&&!tasks.length?<EmptyState title={t('Archive is empty')} description={t('Archived work will appear here.')}/>:<div className="grid gap-5 lg:grid-cols-2"><section className="app-card p-5"><h2 className="mb-4 font-semibold">{t('Projects')}</h2><div className="space-y-2">{projects.map((p)=><div key={p.id} className="flex items-center justify-between rounded-xl bg-[rgb(var(--surface-alt))] p-3"><div><div className="font-medium">{p.title}</div><div className="text-xs" style={{color:'rgb(var(--muted))'}}>{p.description}</div></div><Button variant="secondary" onClick={()=>dispatch(toggleArchive(p.id))} aria-label={t('Restore archived projects and tasks.')}><ArchiveRestore size={19}/></Button></div>)}</div></section><section className="app-card p-5"><h2 className="mb-4 font-semibold">{t('Tasks')}</h2><div className="space-y-2">{tasks.map((task)=><div key={task.id} className="flex items-center justify-between rounded-xl bg-[rgb(var(--surface-alt))] p-3"><div><div className="font-medium">{task.title}</div><div className="text-xs capitalize" style={{color:'rgb(var(--muted))'}}>{t(task.priority)}</div></div><Button variant="secondary" onClick={()=>dispatch(toggleTaskArchive(task.id))}><ArchiveRestore size={19}/></Button></div>)}</div></section></div>}</div>
}
