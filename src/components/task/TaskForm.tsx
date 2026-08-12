import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Sparkles } from 'lucide-react'
import type { Task, TaskFormData } from '@/types'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addTask, updateTask } from '@/store/taskSlice'
import { addActivity } from '@/store/collaborationSlice'
import { addNotification } from '@/store/notificationsSlice'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { useI18n } from '@/i18n'

export default function TaskForm({ projectId, task, onClose }: { projectId: string; task?: Task; onClose: () => void }) {
  const { language,t }=useI18n()
  const dispatch = useAppDispatch()
  const currentUserId = useAppSelector((s) => s.auth.currentUserId)!
  const project = useAppSelector((s) => s.project.projects.find((p) => p.id === projectId))
  const automationRules = useAppSelector((s) => s.automation.rules)
  const templates = useAppSelector((s)=>s.taskTemplates.templates)
  const allUsers = useAppSelector((s) => s.users.users)
  const projectTasks = useAppSelector((s) => s.task.tasks.filter((item) => item.projectId === projectId))
  const columns = useAppSelector((s) => s.board.columns.filter((c) => c.projectId === projectId).sort((a, b) => a.order - b.order))
  const labels = useAppSelector((s) => s.collaboration.labels.filter((l) => l.projectId === projectId))
  const users = useAppSelector((s) => s.users.users.filter((u) => u.isActive && project?.memberIds.includes(u.id)))
  const [templateId,setTemplateId]=useState('')

  const defaults: TaskFormData = task
    ? { title: task.title, description: task.description, priority: task.priority, columnId: task.columnId, assigneeId: task.assigneeId, startDate: task.startDate, dueDate: task.dueDate, labelIds: task.labelIds, estimateMinutes: task.estimateMinutes, recurrence: task.recurrence ?? 'none' }
    : { title: '', description: '', priority: 'medium', columnId: columns[0]?.id ?? '', assigneeId: currentUserId, startDate: '', dueDate: '', labelIds: [], estimateMinutes: 60, recurrence: 'none' }
  const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm<TaskFormData>({ defaultValues: defaults })

  const applyTemplate=()=>{const template=templates.find((item)=>item.id===templateId);if(!template)return;const current=getValues();reset({...current,title:template.title,description:template.description,priority:template.priority,estimateMinutes:template.estimateMinutes,recurrence:template.recurrence})}

  const submit = (data: TaskFormData) => {
    if (task) {
      const assigneeChanged = data.assigneeId && data.assigneeId !== task.assigneeId
      dispatch(updateTask({ id: task.id, data }))
      dispatch(addActivity({ projectId, taskId: task.id, userId: currentUserId, type: 'task-updated', message: `updated ${data.title}` }))
      dispatch(addNotification({ userId: currentUserId, title: 'Task updated', message: `${data.title} was updated successfully.`, type: 'success', taskId: task.id, projectId }))
      if (assigneeChanged) {
        dispatch(addActivity({ projectId, taskId: task.id, userId: currentUserId, type: 'task-assigned', message: `assigned ${data.title}` }))
        dispatch(addNotification({ userId: data.assigneeId!, title: 'Task assigned to you', message: `${data.title} was assigned to you.`, type: 'info', taskId: task.id, projectId }))
      }
    } else {
      const order = projectTasks.filter((item) => item.columnId === data.columnId).length
      const action = dispatch(addTask({ projectId, data, createdBy: currentUserId, order }))
      dispatch(addActivity({ projectId, taskId: action.payload.id, userId: currentUserId, type: 'task-created', message: `created ${action.payload.title}` }))
      dispatch(addNotification({ userId: currentUserId, title: 'Task created', message: `${action.payload.title} was added successfully.`, type: 'success', taskId: action.payload.id, projectId }))
      if (data.assigneeId && data.assigneeId !== currentUserId) dispatch(addNotification({ userId: data.assigneeId, title: 'New task assigned', message: `${data.title} was assigned to you.`, type: 'info', taskId: action.payload.id, projectId }))
      if (data.priority === 'high' || data.priority === 'critical') automationRules.filter((r) => r.enabled && r.trigger === 'high_priority_created' && (!r.projectId || r.projectId === projectId)).forEach((rule) => {
        const targets = rule.action === 'notify_assignee' ? allUsers.filter((u) => u.id === data.assigneeId) : allUsers.filter((u) => u.role === 'manager' && u.isActive)
        targets.forEach((target) => dispatch(addNotification({ userId: target.id, title: 'High-priority task created', message: `${data.title} was added with ${data.priority} priority.`, type: 'warning', taskId: action.payload.id, projectId, signature: `high:${rule.id}:${action.payload.id}` })))
      })
    }
    onClose()
  }

  return <form onSubmit={handleSubmit(submit)} className="space-y-4">
    {!task&&<div className="rounded-2xl border p-3" style={{borderColor:'rgb(var(--border))',background:'rgb(var(--surface-alt))'}}><div className="mb-2 flex items-center gap-2 text-xs font-semibold"><Sparkles size={17} style={{color:'rgb(var(--primary))'}}/>{t('Start from a task template')}</div><div className="flex flex-col gap-2 sm:flex-row"><Select value={templateId} onChange={(e)=>setTemplateId(e.target.value)}><option value="">{t('Choose a template…')}</option>{templates.map((template)=><option key={template.id} value={template.id}>{template.name}</option>)}</Select><Button type="button" variant="secondary" disabled={!templateId} onClick={applyTemplate}>{t('Apply')}</Button></div></div>}
    <label className="block"><span className="mb-1.5 block text-xs font-semibold">{t('Task title')}</span><Input {...register('title', { required: true })} placeholder={t('Build analytics dashboard')} />{errors.title && <span className="text-xs text-red-500">{t('Title is required.')}</span>}</label>
    <label className="block"><span className="mb-1.5 block text-xs font-semibold">{t('Description')}</span><Textarea {...register('description')} /></label>
    <div className="grid gap-3 sm:grid-cols-2"><label><span className="mb-1.5 block text-xs font-semibold">{t('Column')}</span><Select {...register('columnId', { required: true })}>{columns.map((c) => <option key={c.id} value={c.id}>{t(c.title)}</option>)}</Select></label><label><span className="mb-1.5 block text-xs font-semibold">{t('Priority')}</span><Select {...register('priority')}><option value="low">{t('Low')}</option><option value="medium">{t('Medium')}</option><option value="high">{t('High')}</option><option value="critical">{t('Critical')}</option></Select></label></div>
    <div className="grid gap-3 sm:grid-cols-2"><label><span className="mb-1.5 block text-xs font-semibold">{t('Assignee')}</span><Select {...register('assigneeId', { required: true })}><option value="">{t('Select a member…')}</option>{users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</Select>{errors.assigneeId&&<span className="mt-1 block text-xs text-red-500">{t('Assignee is required.')}</span>}</label><label><span className="mb-1.5 block text-xs font-semibold">{t('Estimate (minutes)')}</span><Input type="number" min="0" {...register('estimateMinutes', { valueAsNumber: true, min: 0 })} /></label></div>
    <div className="grid gap-3 sm:grid-cols-2"><label><span className="mb-1.5 block text-xs font-semibold">{t('Start date')}</span><Input type="date" {...register('startDate')} /></label><label><span className="mb-1.5 block text-xs font-semibold">{t('Due date')}</span><Input type="date" {...register('dueDate', { required: true, validate: (value) => !getValues('startDate') || !value || value >= (getValues('startDate') ?? '') || t('Due date must be on or after the start date.') })} />{errors.dueDate&&<span className="mt-1 block text-xs text-red-500">{String(errors.dueDate.message || t('Due date is required.'))}</span>}</label></div>
    <label className="block"><span className="mb-1.5 block text-xs font-semibold">{t('Recurrence')}</span><Select {...register('recurrence')}><option value="none">{t('No recurrence')}</option><option value="daily">{t('Daily')}</option><option value="weekly">{t('Weekly')}</option><option value="monthly">{t('Monthly')}</option></Select></label>
    {labels.length > 0 && <fieldset><legend className="mb-2 text-xs font-semibold">{t('Labels')}</legend><div className="flex flex-wrap gap-2">{labels.map((label) => <label key={label.id} className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs" style={{ borderColor: label.color }}><input type="checkbox" value={label.id} {...register('labelIds')} />{label.name}</label>)}</div></fieldset>}
    <div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={onClose}>{t('Cancel')}</Button><Button type="submit">{task ? t('Save task') : t('Add task')}</Button></div>
    {language==='fa'&&<p className="sr-only">فرم مدیریت تسک</p>}
  </form>
}
