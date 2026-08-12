import { Bell, Command, Languages, LogOut, Moon, Search, Sun } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/authSlice'
import { setCommandPaletteOpen, setTheme } from '@/store/uiSlice'
import Avatar from '@/components/ui/Avatar'
import NotificationPanel from '@/components/shared/NotificationPanel'
import { useState } from 'react'
import { useI18n } from '@/i18n'

const pathTitle = (pathname: string) => {
  if (pathname.startsWith('/projects/') && !pathname.endsWith('/projects')) return 'Project workspace'
  const first = pathname.split('/')[1]
  if (!first || first === 'dashboard') return 'Dashboard'
  const labels: Record<string, string> = {
    projects: 'Projects',
    'my-tasks': 'My Tasks',
    team: 'Team',
    activity: 'Activity',
    automations: 'Automations',
    archive: 'Archive',
    settings: 'Settings',
  }
  return labels[first] ?? first.replaceAll('-', ' ')
}

export default function Header() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { language, t, toggleLanguage } = useI18n()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const userId = useAppSelector((s) => s.auth.currentUserId)
  const user = useAppSelector((s) => s.users.users.find((u) => u.id === userId))
  const theme = useAppSelector((s) => s.ui.theme)
  const unread = useAppSelector((s) => s.notifications.notifications.filter((n) => n.userId === userId && !n.isRead).length)
  const title = pathTitle(location.pathname)
  const toggleTheme = () => dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'))

  return (
    <header className="glass sticky top-0 z-30 flex h-[68px] items-center justify-between border-b px-3 sm:px-4 md:px-6" style={{ borderColor: 'rgb(var(--border) / .82)' }}>
      <div className="min-w-0">
        <div className="text-[11px] sm:text-xs" style={{ color: 'rgb(var(--muted))' }}>Athena / {t(title)}</div>
        <div className="truncate text-sm font-semibold sm:text-[15px]">{t(title)}</div>
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
        <button
          onClick={() => dispatch(setCommandPaletteOpen(true))}
          className="hidden h-11 min-w-56 items-center justify-between rounded-xl border px-3.5 transition hover:bg-[rgb(var(--surface-alt))] lg:flex"
          style={{ borderColor: 'rgb(var(--border))', color: 'rgb(var(--muted))' }}
          aria-label={t('Search')}
        >
          <span className="flex items-center gap-2.5"><Search size={19}/>{t('Search anything...')}</span>
          <span className="flex items-center gap-1 text-[11px]"><Command size={15}/>K</span>
        </button>

        <button className="btn btn-ghost icon-action lg:hidden" onClick={() => dispatch(setCommandPaletteOpen(true))} aria-label={t('Search')}>
          <Search size={21}/>
        </button>

        <button className="btn btn-ghost h-11 min-h-11 px-2.5" onClick={toggleLanguage} title={language === 'en' ? 'فارسی' : 'English'} aria-label={t('Language')}>
          <Languages size={21}/>
          <span className="hidden text-[11px] font-bold sm:inline">{language === 'en' ? 'FA' : 'EN'}</span>
        </button>

        <button className="btn btn-ghost icon-action" onClick={toggleTheme} aria-label={t('Theme')}>
          {theme === 'dark' ? <Sun size={21}/> : <Moon size={21}/>} 
        </button>

        <div className="relative">
          <button className="btn btn-ghost icon-action relative" onClick={() => setNotificationsOpen((x) => !x)} aria-label={t('Notifications')}>
            <Bell size={21}/>
            {unread > 0 && (
              <span
                className="absolute top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white shadow-sm"
                style={{ background: 'rgb(var(--danger))', [language === 'fa' ? 'left' : 'right']: '2px' }}
              >{unread}</span>
            )}
          </button>
          {notificationsOpen && <NotificationPanel onClose={() => setNotificationsOpen(false)} />}
        </div>

        {user && (
          <button className="flex min-h-11 items-center gap-2 rounded-xl px-1.5 py-1 transition hover:bg-[rgb(var(--surface-alt))] sm:px-2" onClick={() => navigate('/settings')}>
            <Avatar name={user.name} src={user.avatar} size={36}/>
            <span className="hidden xl:block" style={{ textAlign: language === 'fa' ? 'right' : 'left' }}>
              <span className="block text-xs font-semibold">{user.name}</span>
              <span className="block text-[10px] capitalize" style={{ color: 'rgb(var(--muted))' }}>{t(user.role)}</span>
            </span>
          </button>
        )}

        <button
          className="btn btn-ghost icon-action"
          title={t('Log out')}
          aria-label={t('Log out')}
          onClick={() => { dispatch(logout()); navigate('/login') }}
        >
          <LogOut size={20} className={language === 'fa' ? 'rotate-180' : ''}/>
        </button>
      </div>
    </header>
  )
}
