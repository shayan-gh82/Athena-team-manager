import { Outlet } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import Sidebar from './Sidebar'
import Header from './Header'
import MobileNav from './MobileNav'
import CommandPalette from '@/components/shared/CommandPalette'
import TaskDrawer from '@/components/task/TaskDrawer'
import ReminderEngine from '@/components/shared/ReminderEngine'
import ToastHost from '@/components/shared/ToastHost'
import { useI18n } from '@/i18n'

export default function AppShell() {
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed)
  const { language } = useI18n()
  const spacing = collapsed ? 78 : 252

  return (
    <div className="min-h-screen">
      <Sidebar/>
      <div
        className="min-h-screen transition-[padding] duration-200"
        style={language === 'fa' ? { paddingRight: `var(--desktop-sidebar-space, ${spacing}px)` } : { paddingLeft: `var(--desktop-sidebar-space, ${spacing}px)` }}
      >
        <style>{`@media (max-width: 767px){:root{--desktop-sidebar-space:0px}}@media (min-width:768px){:root{--desktop-sidebar-space:${spacing}px}}`}</style>
        <Header/>
        <main className="pb-20 md:pb-0"><Outlet/></main>
      </div>
      <MobileNav/>
      <CommandPalette/>
      <TaskDrawer/>
      <ReminderEngine/>
      <ToastHost/>
    </div>
  )
}
