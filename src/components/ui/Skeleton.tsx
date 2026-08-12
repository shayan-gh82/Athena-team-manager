import { cn } from '@/utils/cn'
import { useI18n } from '@/i18n'

export default function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={cn('skeleton', className)} />
}

export function PageSkeleton() {
  const { t } = useI18n()
  return <div className="page-container animate-fade-in" aria-label={t('Loading page')}>
    <div className="mb-6 space-y-3"><Skeleton className="h-3 w-24"/><Skeleton className="h-9 w-64 max-w-full"/><Skeleton className="h-4 w-80 max-w-full"/></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({length:4}).map((_,i)=><div key={i} className="app-card p-5"><Skeleton className="h-4 w-24"/><Skeleton className="mt-5 h-9 w-16"/><Skeleton className="mt-3 h-3 w-28"/></div>)}</div>
    <div className="mt-4 grid gap-4 lg:grid-cols-2"><div className="app-card p-5"><Skeleton className="h-5 w-36"/><Skeleton className="mt-5 h-56 w-full"/></div><div className="app-card p-5"><Skeleton className="h-5 w-32"/><div className="mt-5 space-y-3">{Array.from({length:5}).map((_,i)=><Skeleton key={i} className="h-12 w-full"/>)}</div></div></div>
  </div>
}
