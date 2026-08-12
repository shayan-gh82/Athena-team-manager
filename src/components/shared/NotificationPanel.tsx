import { CheckCheck, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearNotifications, markAllNotificationsRead, markNotificationRead } from '@/store/notificationsSlice'
import { openTaskDrawer } from '@/store/uiSlice'
import { useI18n } from '@/i18n'
import Button from '@/components/ui/Button'

export default function NotificationPanel({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { t, language } = useI18n()
  const userId = useAppSelector((s) => s.auth.currentUserId)
  const items = useAppSelector((s) => s.notifications.notifications.filter((notification) => notification.userId === userId))
  if (!userId) return null

  const localizeMessage = (message: string) => {
    if (language !== 'fa') return message
    const overdue = message.match(/^(.*) is overdue\.$/)
    if (overdue) return `${overdue[1]} از موعد گذشته است.`
    const today = message.match(/^(.*) is due today\.$/)
    if (today) return `موعد ${today[1]} امروز است.`
    const tomorrow = message.match(/^(.*) is due tomorrow\.$/)
    if (tomorrow) return `موعد ${tomorrow[1]} فردا است.`
    const days = message.match(/^(.*) is due in (\d+) days?\.$/)
    if (days) return `${days[1]} تا ${days[2]} روز دیگر سررسید می‌شود.`
    return t(message)
  }

  return <div className={`app-card absolute top-14 z-50 w-[min(390px,calc(100vw-24px))] overflow-hidden shadow-2xl ${language === 'fa' ? 'left-0' : 'right-0'}`}>
    <div className="flex items-center justify-between border-b p-4" style={{ borderColor: 'rgb(var(--border))' }}>
      <div><h3 className="font-semibold">{t('Notifications')}</h3><p className="text-xs" style={{ color: 'rgb(var(--muted))' }}>{items.filter((item) => !item.isRead).length} {t('unread')}</p></div>
      <div className="flex gap-1"><Button size="sm" variant="ghost" onClick={() => dispatch(markAllNotificationsRead(userId))} title={t('Mark all read')}><CheckCheck size={18}/></Button><Button size="sm" variant="ghost" onClick={() => dispatch(clearNotifications(userId))} title={t('Clear')}><Trash2 size={18}/></Button></div>
    </div>
    <div className="max-h-[420px] overflow-y-auto p-2 scrollbar-thin">
      {items.length === 0 ? <div className="p-8 text-center text-sm" style={{ color: 'rgb(var(--muted))' }}>{t("You're all caught up.")}</div> : items.map((notification) => <button key={notification.id} className={`mb-1 w-full rounded-xl p-3 hover:bg-[rgb(var(--surface-alt))] ${language === 'fa' ? 'text-right' : 'text-left'}`} style={!notification.isRead ? { background: 'rgb(var(--primary-soft))' } : undefined} onClick={() => { dispatch(markNotificationRead(notification.id)); if (notification.projectId) navigate(`/projects/${notification.projectId}/list`); if (notification.taskId) dispatch(openTaskDrawer(notification.taskId)); onClose() }}><div className="flex items-start gap-3"><span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: notification.type === 'danger' ? 'rgb(var(--danger))' : notification.type === 'warning' ? 'rgb(var(--warning))' : notification.type === 'success' ? 'rgb(var(--success))' : 'rgb(var(--info))' }}/><div><div className="text-sm font-semibold">{t(notification.title)}</div><div className="mt-1 text-xs leading-5" style={{ color: 'rgb(var(--text-secondary))' }}>{localizeMessage(notification.message)}</div></div></div></button>)}
    </div>
  </div>
}
