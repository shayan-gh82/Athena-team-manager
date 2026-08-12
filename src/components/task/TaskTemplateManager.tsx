import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { TaskPriority, TaskRecurrence } from '@/types'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addTaskTemplate, removeTaskTemplate } from '@/store/taskTemplatesSlice'
import { useI18n } from '@/i18n'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Modal from '@/components/ui/Modal'

export default function TaskTemplateManager() {
  const { t } = useI18n()
  const dispatch = useAppDispatch()
  const templates = useAppSelector((s) => s.taskTemplates.templates)
  const userId = useAppSelector((s) => s.auth.currentUserId)!
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [estimate, setEstimate] = useState('60')
  const [recurrence, setRecurrence] = useState<TaskRecurrence>('none')
  const add = () => {
    if (!name.trim() || !title.trim()) return
    dispatch(addTaskTemplate({ name: name.trim(), title: title.trim(), description: description.trim(), priority, estimateMinutes: Math.max(0, Number(estimate) || 0), recurrence, createdBy: userId }))
    setOpen(false); setName(''); setTitle(''); setDescription(''); setPriority('medium'); setEstimate('60'); setRecurrence('none')
  }
  return <section className="app-card p-5 lg:col-span-2">
    <div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="font-semibold">{t('Task templates')}</h2><p className="mt-1 text-xs" style={{ color: 'rgb(var(--muted))' }}>{t('Reusable starting points for common tasks. Built-in templates are read-only.')}</p></div><Button icon={Plus} onClick={() => setOpen(true)}>{t('New template')}</Button></div>
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{templates.map((template) => <article key={template.id} className="rounded-2xl border p-4" style={{ borderColor: 'rgb(var(--border))' }}><div className="flex items-start justify-between gap-2"><div><h3 className="font-semibold">{template.name}</h3><div className="mt-1 text-[11px] capitalize" style={{ color: 'rgb(var(--muted))' }}>{t(template.priority)} · {template.estimateMinutes ?? 0} {t('min')}</div></div>{!template.isBuiltIn && <button className="btn btn-ghost min-h-10 w-10 p-0 text-red-500" onClick={() => dispatch(removeTaskTemplate(template.id))} title={t('Delete template')}><Trash2 size={18}/></button>}</div><p className="mt-3 line-clamp-3 text-xs leading-5" style={{ color: 'rgb(var(--text-secondary))' }}>{template.description}</p></article>)}</div>
    <Modal isOpen={open} onClose={() => setOpen(false)} title={t('Create task template')}><div className="space-y-4"><label><span className="mb-1 block text-xs font-semibold">{t('Template name')}</span><Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('QA checklist')}/></label><label><span className="mb-1 block text-xs font-semibold">{t('Default task title')}</span><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('Test feature')}/></label><label><span className="mb-1 block text-xs font-semibold">{t('Description')}</span><Textarea value={description} onChange={(e) => setDescription(e.target.value)}/></label><div className="grid gap-3 sm:grid-cols-2"><label><span className="mb-1 block text-xs font-semibold">{t('Priority')}</span><Select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}><option value="low">{t('Low')}</option><option value="medium">{t('Medium')}</option><option value="high">{t('High')}</option><option value="critical">{t('Critical')}</option></Select></label><label><span className="mb-1 block text-xs font-semibold">{t('Estimate (minutes)')}</span><Input type="number" min="0" value={estimate} onChange={(e) => setEstimate(e.target.value)}/></label></div><label><span className="mb-1 block text-xs font-semibold">{t('Recurrence')}</span><Select value={recurrence} onChange={(e) => setRecurrence(e.target.value as TaskRecurrence)}><option value="none">{t('No recurrence')}</option><option value="daily">{t('Daily')}</option><option value="weekly">{t('Weekly')}</option><option value="monthly">{t('Monthly')}</option></Select></label><div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => setOpen(false)}>{t('Cancel')}</Button><Button onClick={add}>{t('Save template')}</Button></div></div></Modal>
  </section>
}
