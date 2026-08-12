import { CheckSquare, FolderKanban, Home, MoreHorizontal, Plus } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useI18n } from '@/i18n'

export default function MobileNav() {
  const navigate = useNavigate()
  const { t } = useI18n()
  const items = [
    { to: '/dashboard', label: 'Home', icon: Home },
    { to: '/my-tasks', label: 'Tasks', icon: CheckSquare },
    { to: '/projects', label: 'Projects', icon: FolderKanban },
    { to: '/settings', label: 'More', icon: MoreHorizontal },
  ]

  const itemClass = ({ isActive }: { isActive: boolean }) => `flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition ${isActive ? 'text-[rgb(var(--primary))]' : 'text-[rgb(var(--text-secondary))]'}`

  return (
    <div className="glass fixed inset-x-0 bottom-0 z-50 grid h-[70px] grid-cols-5 border-t md:hidden" style={{ borderColor: 'rgb(var(--border))' }}>
      {items.slice(0,2).map(({to,label,icon:Icon}) => <NavLink key={to} to={to} className={itemClass}><Icon size={22} strokeWidth={1.9}/>{t(label)}</NavLink>)}
      <button onClick={() => navigate('/projects')} className="flex items-center justify-center" aria-label={t('Create')}>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg" style={{ background: 'linear-gradient(135deg,rgb(var(--primary)),rgb(var(--info)))', boxShadow: '0 10px 28px rgb(var(--primary) / .28)' }}><Plus size={25}/></span>
      </button>
      {items.slice(2).map(({to,label,icon:Icon}) => <NavLink key={to} to={to} className={itemClass}><Icon size={22} strokeWidth={1.9}/>{t(label)}</NavLink>)}
    </div>
  )
}
