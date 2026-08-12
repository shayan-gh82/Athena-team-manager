import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useI18n } from '@/i18n'

export default function Drawer({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title?: string; children: ReactNode }) {
  const { language, t } = useI18n()
  if (!isOpen) return null
  return createPortal(
    <div className="fixed inset-0 z-[90] bg-black/45 backdrop-blur-[1px]" onMouseDown={onClose}>
      <aside className={`absolute inset-y-0 w-full max-w-[640px] overflow-y-auto p-4 shadow-2xl sm:p-5 md:w-[620px] ${language === 'fa' ? 'left-0 border-r' : 'right-0 border-l'}`} style={{ background: 'rgb(var(--surface) / .985)', borderColor: 'rgb(var(--border))' }} onMouseDown={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button className="icon-action btn-ghost shrink-0" onClick={onClose} aria-label={t('Close')}><X size={21}/></button>
        </div>
        {children}
      </aside>
    </div>, document.body,
  )
}
