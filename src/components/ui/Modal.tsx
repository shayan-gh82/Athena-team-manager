import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useI18n } from '@/i18n'

export default function Modal({ isOpen, onClose, title, children, width = 'md' }: { isOpen: boolean; onClose: () => void; title?: string; children: ReactNode; width?: 'sm' | 'md' | 'lg' }) {
  const { t } = useI18n()
  if (!isOpen) return null
  const widthClass = width === 'sm' ? 'max-w-[420px]' : width === 'lg' ? 'max-w-[760px]' : 'max-w-[580px]'
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 backdrop-blur-[2px] sm:p-4" onMouseDown={onClose}>
      <div className={`app-card animate-fade-in max-h-[92vh] w-full ${widthClass} overflow-auto p-4 shadow-2xl sm:p-5`} onMouseDown={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between gap-4">
          {title ? <h2 className="text-lg font-semibold">{title}</h2> : <span />}
          <button className="icon-action btn-ghost shrink-0" onClick={onClose} aria-label={t('Close')}><X size={21} /></button>
        </div>
        {children}
      </div>
    </div>, document.body,
  )
}
