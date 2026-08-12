import { Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
export default function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <div className="app-card premium-empty-state relative flex min-h-56 flex-col items-center justify-center gap-3 overflow-hidden p-8 text-center"><div className="empty-state-glow" aria-hidden="true"/><div className="relative flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg" style={{ background: 'linear-gradient(135deg,rgb(var(--primary) / .22),rgb(var(--info) / .14))', color: 'rgb(var(--primary))', border: '1px solid rgb(var(--primary) / .18)' }}><Sparkles size={24}/></div><h3 className="relative text-base font-semibold">{title}</h3>{description && <p className="relative max-w-md text-sm leading-6" style={{ color: 'rgb(var(--muted))' }}>{description}</p>}<div className="relative">{action}</div></div>
}
