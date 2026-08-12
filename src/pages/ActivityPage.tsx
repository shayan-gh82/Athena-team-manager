import { useMemo } from 'react'
import { useAppSelector } from '@/store/hooks'
import Avatar from '@/components/ui/Avatar'
import { useI18n } from '@/i18n'

export default function ActivityPage(){
  const { language, t, locale } = useI18n()
  const userId=useAppSelector((s)=>s.auth.currentUserId)!
  const current=useAppSelector((s)=>s.users.users.find((u)=>u.id===userId))
  const allActivities=useAppSelector((s)=>s.collaboration.activities)
  const users=useAppSelector((s)=>s.users.users)
  const projects=useAppSelector((s)=>s.project.projects)
  const allowedIds=useMemo(()=>new Set(projects.filter((p)=>current?.role==='manager'||p.memberIds.includes(userId)).map((p)=>p.id)),[projects,current,userId])
  const activities=useMemo(()=>allActivities.filter((a)=>current?.role==='manager'||Boolean(a.projectId&&allowedIds.has(a.projectId))),[allActivities,current,allowedIds])
  return <div className="page-container"><div className="mb-6"><div className="text-xs font-bold uppercase tracking-[.18em]" style={{color:'rgb(var(--primary))'}}>{t('History')}</div><h1 className="mt-1 text-3xl font-bold">{t('Activity')}</h1><p className="mt-2" style={{color:'rgb(var(--muted))'}}>{t('A local audit trail for projects you can access.')}</p></div><div className="app-card overflow-hidden">{activities.length?activities.map((a)=>{const user=users.find((u)=>u.id===a.userId);const project=projects.find((p)=>p.id===a.projectId);return <div key={a.id} className="flex gap-3 border-b p-4 last:border-0" style={{borderColor:'rgb(var(--border))'}}><Avatar name={user?.name??t('User')} src={user?.avatar} size={38}/><div className="min-w-0"><div className="text-sm"><strong>{user?.name??t('User')}</strong> {a.message}</div><div className="mt-1 text-xs" style={{color:'rgb(var(--muted))'}}>{project?.title??t('Workspace')} · {new Date(a.createdAt).toLocaleString(locale)}</div></div></div>}):<div className="p-10 text-center" style={{color:'rgb(var(--muted))'}}>{t('No activity recorded yet.')}</div>}</div></div>
}
