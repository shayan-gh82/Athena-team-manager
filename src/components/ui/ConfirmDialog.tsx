import { useI18n } from '@/i18n'
import Button from './Button'
import Modal from './Modal'

export default function ConfirmDialog({ open, onClose, onConfirm, title, description }: { open: boolean; onClose: () => void; onConfirm: () => void; title: string; description: string }) {
  const { t } = useI18n()
  return <Modal isOpen={open} onClose={onClose} title={title} width="sm"><p className="mb-6 text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>{description}</p><div className="flex justify-end gap-2"><Button variant="secondary" onClick={onClose}>{t('Cancel')}</Button><Button variant="danger" onClick={onConfirm}>{t('Delete')}</Button></div></Modal>
}
