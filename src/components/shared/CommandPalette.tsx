import { Search, FolderKanban, CheckSquare, User } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { openTaskDrawer, setCommandPaletteOpen } from '@/store/uiSlice'
import { useI18n } from '@/i18n'
import Input from '@/components/ui/Input'

export default function CommandPalette() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { t, language } = useI18n()
  const [query, setQuery] = useState('')
  const open = useAppSelector((s) => s.ui.commandPaletteOpen)
  const userId = useAppSelector((s) => s.auth.currentUserId)
  const current = useAppSelector((s) => s.users.users.find((u) => u.id === userId))
  const allProjects = useAppSelector((s) => s.project.projects)
  const allTasks = useAppSelector((s) => s.task.tasks)
  const users = useAppSelector((s) => s.users.users)
  const projects = useMemo(() => allProjects.filter((p) => current?.role === 'manager' || Boolean(userId && p.memberIds.includes(userId))), [allProjects, current, userId])
  const allowedIds = useMemo(() => new Set(projects.map((p) => p.id)), [projects])
  const tasks = useMemo(() => allTasks.filter((task) => allowedIds.has(task.projectId)), [allTasks, allowedIds])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        dispatch(setCommandPaletteOpen(true))
      }
      if (event.key === 'Escape') dispatch(setCommandPaletteOpen(false))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [dispatch])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return [
      ...projects.filter((p) => p.title.toLowerCase().includes(q)).slice(0, 4).map((p) => ({ id: p.id, label: p.title, meta: 'Project', icon: FolderKanban, run: () => navigate(`/projects/${p.id}/list`) })),
      ...tasks.filter((task) => task.title.toLowerCase().includes(q)).slice(0, 6).map((task) => ({ id: task.id, label: task.title, meta: 'Task', icon: CheckSquare, run: () => { navigate(`/projects/${task.projectId}/list`); dispatch(openTaskDrawer(task.id)) } })),
      ...users.filter((user) => user.name.toLowerCase().includes(q)).slice(0, 3).map((user) => ({ id: user.id, label: user.name, meta: user.role, icon: User, run: () => navigate('/team') })),
    ]
  }, [query, projects, tasks, users, navigate, dispatch])

  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-[120] bg-black/50 p-4 pt-[10vh] backdrop-blur-[2px]" onMouseDown={() => dispatch(setCommandPaletteOpen(false))}>
      <div className="app-card mx-auto max-w-2xl overflow-hidden shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-center gap-3 border-b p-3" style={{ borderColor: 'rgb(var(--border))' }}>
          <Search size={21} style={{ color: 'rgb(var(--muted))' }} />
          <Input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('Search projects, tasks, or people...')} className="border-0 !shadow-none" />
        </div>
        <div className="max-h-[430px] overflow-auto p-2">
          {query && results.length === 0 && <div className="p-8 text-center text-sm" style={{ color: 'rgb(var(--muted))' }}>{t('No results found')}</div>}
          {!query && <div className="p-8 text-center text-sm" style={{ color: 'rgb(var(--muted))' }}>{t('Start typing to search your workspace.')}</div>}
          {results.map((item) => (
            <button key={`${item.meta}-${item.id}`} className={`flex w-full items-center gap-3 rounded-xl p-3 hover:bg-[rgb(var(--surface-alt))] ${language === 'fa' ? 'text-right' : 'text-left'}`} onClick={() => { item.run(); dispatch(setCommandPaletteOpen(false)); setQuery('') }}>
              <item.icon size={20} style={{ color: 'rgb(var(--primary))' }} />
              <div><div className="font-medium">{item.label}</div><div className="text-xs capitalize" style={{ color: 'rgb(var(--muted))' }}>{t(item.meta)}</div></div>
            </button>
          ))}
        </div>
      </div>
    </div>, document.body,
  )
}
