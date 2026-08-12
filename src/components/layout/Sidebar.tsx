import { Archive, BarChart3, CheckSquare, FolderKanban, Home, Settings, Users, Zap } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleSidebar } from '@/store/uiSlice'
import { cn } from '@/utils/cn'
import Tooltip from '@/components/ui/Tooltip'
import { useI18n } from '@/i18n'

const commonNav = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/my-tasks', label: 'My Tasks', icon: CheckSquare },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/team', label: 'Team', icon: Users },
  { to: '/activity', label: 'Activity', icon: BarChart3 },
]
const managerNav = [
  { to: '/automations', label: 'Automations', icon: Zap },
  { to: '/archive', label: 'Archive', icon: Archive },
]

export default function Sidebar() {
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed)
  const userId = useAppSelector((s) => s.auth.currentUserId)
  const isManager = useAppSelector((s) => s.users.users.find((u) => u.id === userId)?.role === 'manager')
  const dispatch = useAppDispatch()
  const { language, t } = useI18n()
  const nav = [...commonNav, ...(isManager ? managerNav : []), { to: '/settings', label: 'Settings', icon: Settings }]

  return (
    <aside
      className={cn(
        'premium-surface fixed inset-y-0 z-40 hidden md:flex md:flex-col transition-[width] duration-200',
        language === 'fa' ? 'right-0 border-l border-r-0' : 'left-0 border-r',
        collapsed ? 'w-[78px]' : 'w-[252px]',
      )}
      style={{ borderColor: 'rgb(var(--border) / .82)' }}
    >
      <div className="flex h-[68px] items-center gap-3 px-4">
        <button
          type="button"
          className="group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-white/10 bg-[#17162d] shadow-[0_8px_24px_rgba(91,108,255,.28)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(91,108,255,.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--surface))]"
          onClick={() => dispatch(toggleSidebar())}
          aria-label={collapsed ? t('Expand sidebar') : t('Collapse sidebar')}
          aria-expanded={!collapsed}
          title={collapsed ? t('Expand sidebar') : t('Collapse sidebar')}
        >
          <img src="/athena-logo.png" alt="" className="h-10 w-10 object-contain transition duration-200 group-hover:scale-105"/>
        </button>
        {!collapsed && <div><div className="font-bold tracking-tight">Athena</div><div className="text-[11px]" style={{ color: 'rgb(var(--muted))' }}>{t('Team Workspace')}</div></div>}
      </div>

      <nav className="flex-1 space-y-1.5 px-3 py-4">
        {nav.map(({ to, label, icon: Icon }) => {
          const link = (
            <NavLink
              key={to}
              to={to}
              aria-label={t(label)}
              className={({ isActive }) => cn(
                'flex h-11 items-center gap-3 rounded-xl px-3 font-medium transition',
                isActive ? 'nav-active text-[rgb(var(--primary))]' : 'hover:bg-[rgb(var(--surface-alt))]',
              )}
            >
              <Icon size={21} strokeWidth={1.9} className="shrink-0"/>
              {!collapsed && <span>{t(label)}</span>}
            </NavLink>
          )
          return collapsed ? <Tooltip key={to} content={t(label)} side="bottom">{link}</Tooltip> : link
        })}
      </nav>

    </aside>
  )
}
