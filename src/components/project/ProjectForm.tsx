import { useForm } from 'react-hook-form'
import type { Project, ProjectFormData } from '@/types'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addProject, updateProject } from '@/store/projectSlice'
import { addActivity } from '@/store/collaborationSlice'
import { addNotification } from '@/store/notificationsSlice'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import ProjectIcon, { projectIconOptions } from './ProjectIcon'
import { useI18n } from '@/i18n'

export default function ProjectForm({ project, onClose }: { project?: Project; onClose: () => void }) {
  const { t }=useI18n();const dispatch = useAppDispatch();const currentUserId = useAppSelector((s) => s.auth.currentUserId)!;const users = useAppSelector((s) => s.users.users.filter((u) => u.isActive))
  const { register, handleSubmit, watch, setValue, getValues, formState: { errors } } = useForm<ProjectFormData>({
    defaultValues: project
      ? { title: project.title, description: project.description, status: project.status, color: project.color, startDate: project.startDate, dueDate: project.dueDate, memberIds: project.memberIds, icon: project.icon ?? 'rocket' }
      : { title: '', description: '', status: 'active', color: '#635BFF', startDate: '', dueDate: '', memberIds: [currentUserId], icon: 'rocket' },
  })
  const selectedIcon = watch('icon') ?? 'rocket'
  const submit = (data: ProjectFormData) => {
    if (project) {dispatch(updateProject({ id: project.id, data }));dispatch(addActivity({ projectId: project.id, userId: currentUserId, type: 'project-updated', message: `updated ${data.title}` }));dispatch(addNotification({ userId: currentUserId, title: 'Project updated', message: `${data.title} was updated successfully.`, type: 'success', projectId: project.id }))}
    else {const action = dispatch(addProject({ data, ownerId: currentUserId }));dispatch(addActivity({ projectId: action.payload.id, userId: currentUserId, type: 'project-created', message: `created ${action.payload.title}` }));dispatch(addNotification({ userId: currentUserId, title: 'Project created', message: `${action.payload.title} is ready.`, type: 'success', projectId: action.payload.id }))}
    onClose()
  }
  return <form onSubmit={handleSubmit(submit)} className="space-y-4">
    <label className="block"><span className="mb-1.5 block text-xs font-semibold">{t('Project title')}</span><Input {...register('title', { required: true, minLength: 2 })} placeholder={t('Website Redesign')} />{errors.title && <span className="mt-1 block text-xs text-red-500">{t('Title is required.')}</span>}</label>
    <label className="block"><span className="mb-1.5 block text-xs font-semibold">{t('Description')}</span><Textarea {...register('description', { required: true })} placeholder={t('What is this project about?')} /></label>
    <div><span className="mb-2 block text-xs font-semibold">{t('Project icon')}</span><div className="grid grid-cols-4 gap-2 sm:grid-cols-8">{projectIconOptions.map((option)=><button key={option.key} type="button" title={t(option.label)} aria-label={t(option.label)} onClick={()=>setValue('icon', option.key, { shouldDirty: true })} className={`flex h-12 items-center justify-center rounded-xl border transition ${selectedIcon===option.key?'border-[rgb(var(--primary))] bg-[rgb(var(--primary-soft))] text-[rgb(var(--primary))]':'hover:bg-[rgb(var(--surface-alt))]'}`} style={selectedIcon===option.key?undefined:{borderColor:'rgb(var(--border))'}}><ProjectIcon iconKey={option.key} size={20}/></button>)}</div><input type="hidden" {...register('icon')}/></div>
    <div className="grid gap-3 sm:grid-cols-2"><label><span className="mb-1.5 block text-xs font-semibold">{t('Status')}</span><Select {...register('status')}><option value="planning">{t('Planning')}</option><option value="active">{t('Active')}</option><option value="completed">{t('Completed')}</option></Select></label><label><span className="mb-1.5 block text-xs font-semibold">{t('Accent color')}</span><Input type="color" className="p-1" {...register('color')} /></label></div>
    <div className="grid gap-3 sm:grid-cols-2"><label><span className="mb-1.5 block text-xs font-semibold">{t('Start date')}</span><Input type="date" {...register('startDate')} /></label><label><span className="mb-1.5 block text-xs font-semibold">{t('Due date')}</span><Input type="date" {...register('dueDate', { validate: (value) => !value || !getValues('startDate') || value >= (getValues('startDate') ?? '') || t('Due date must be on or after the start date.') })} />{errors.dueDate&&<span className="mt-1 block text-xs text-red-500">{String(errors.dueDate.message)}</span>}</label></div>
    <fieldset><legend className="mb-2 text-xs font-semibold">{t('Members')}</legend><div className="grid gap-2 sm:grid-cols-2">{users.map((user) => <label key={user.id} className="flex items-center gap-2 rounded-xl border p-2.5" style={{ borderColor: 'rgb(var(--border))' }}><input type="checkbox" value={user.id} {...register('memberIds')} /><span>{user.name}</span><span className="ms-auto text-[10px] capitalize" style={{ color: 'rgb(var(--muted))' }}>{t(user.role)}</span></label>)}</div></fieldset>
    <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="secondary" onClick={onClose}>{t('Cancel')}</Button><Button type="submit">{project ? t('Save changes') : t('Create project')}</Button></div>
  </form>
}
