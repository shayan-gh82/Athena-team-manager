import { useRef, useState } from 'react'
import { Archive, Check, Clock3, Link2, MessageSquare, Paperclip, Plus, Reply, Trash2 } from 'lucide-react'
import type { Comment, CustomFieldDefinition, User } from '@/types'
import Drawer from '@/components/ui/Drawer'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import Progress from '@/components/ui/Progress'
import Avatar from '@/components/ui/Avatar'
import Modal from '@/components/ui/Modal'
import TaskForm from './TaskForm'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { closeTaskDrawer } from '@/store/uiSlice'
import { addTask, toggleTaskArchive, updateTask } from '@/store/taskSlice'
import {
  addActivity, addAttachment, addChecklistItem, addComment, addCustomField, addDependency, addSubtask, addTimeEntry,
  removeAttachment, removeChecklistItem, removeComment, removeCustomField, removeDependency, removeSubtask, setCustomFieldValue,
  toggleChecklistItem, toggleSubtask,
} from '@/store/collaborationSlice'
import { addNotification } from '@/store/notificationsSlice'
import { addDays, addMonths } from '@/utils/date'
import { useI18n } from '@/i18n'

const priorityColor = { low: '#64748B', medium: '#3B82F6', high: '#F59E0B', critical: '#F43F5E' }

type ThreadProps = {
  comment: Comment
  comments: Comment[]
  users: User[]
  currentUserId: string
  isManager: boolean
  replyTo: string | null
  replyText: string
  onReplyStart: (id:string)=>void
  onReplyText: (value:string)=>void
  onReplySend: (parentId:string)=>void
  onReplyCancel: ()=>void
  onRemove: (id:string)=>void
  depth?: number
}

function CommentThread({ comment, comments, users, currentUserId, isManager, replyTo, replyText, onReplyStart, onReplyText, onReplySend, onReplyCancel, onRemove, depth=0 }: ThreadProps) {
  const { language, t, locale } = useI18n()
  const author=users.find((u)=>u.id===comment.authorId)
  const children=comments.filter((item)=>item.parentId===comment.id).sort((a,b)=>a.createdAt.localeCompare(b.createdAt))
  const canDelete=isManager||comment.authorId===currentUserId
  return <div className={depth ? (language==='fa' ? 'mr-5 border-r pr-3' : 'ml-5 border-l pl-3') : ''} style={depth?{borderColor:'rgb(var(--border))'}:undefined}>
    <div className="flex gap-3"><Avatar name={author?.name??t('User')} src={author?.avatar} size={32}/><div className="min-w-0 flex-1 rounded-xl bg-[rgb(var(--surface-alt))] p-3"><div className="flex items-start justify-between gap-3"><div><div className="text-xs font-semibold">{author?.name??t('Unknown')}</div><div className="text-[10px]" style={{color:'rgb(var(--muted))'}}>{new Date(comment.createdAt).toLocaleString(locale)}</div></div><div className="flex items-center gap-1"><button className="btn btn-ghost min-h-7 px-2 text-[11px]" onClick={()=>onReplyStart(comment.id)}><Reply size={14}/>{t('Reply')}</button>{canDelete&&<button className="btn btn-ghost min-h-7 w-7 p-0 text-red-500" title={t('Delete comment and replies')} onClick={()=>onRemove(comment.id)}><Trash2 size={16}/></button>}</div></div><p className="mt-2 whitespace-pre-wrap text-sm">{comment.content}</p>{replyTo===comment.id&&<div className="mt-3 flex flex-col gap-2 sm:flex-row"><Input autoFocus value={replyText} onChange={(e)=>onReplyText(e.target.value)} placeholder={language==='fa'?`پاسخ به ${author?.name??'نظر'}…`:`Reply to ${author?.name??'comment'}…`}/><div className="flex gap-2"><Button size="sm" onClick={()=>onReplySend(comment.id)}>{t('Reply')}</Button><Button size="sm" variant="secondary" onClick={onReplyCancel}>{t('Cancel')}</Button></div></div>}</div></div>
    {children.length>0&&<div className="mt-3 space-y-3">{children.map((child)=><CommentThread key={child.id} comment={child} comments={comments} users={users} currentUserId={currentUserId} isManager={isManager} replyTo={replyTo} replyText={replyText} onReplyStart={onReplyStart} onReplyText={onReplyText} onReplySend={onReplySend} onReplyCancel={onReplyCancel} onRemove={onRemove} depth={depth+1}/>)}</div>}
  </div>
}

function CustomFieldInput({ field, value, disabled, onChange }: { field: CustomFieldDefinition; value: string; disabled: boolean; onChange:(value:string)=>void }) {
  const { t } = useI18n()
  if(field.type==='select') return <Select value={value} disabled={disabled} onChange={(e)=>onChange(e.target.value)}><option value="">{t('Select…')}</option>{(field.options??[]).map((option)=><option key={option} value={option}>{option}</option>)}</Select>
  return <Input disabled={disabled} type={field.type==='number'?'number':field.type==='date'?'date':'text'} value={value} onChange={(e)=>onChange(e.target.value)}/>
}

export default function TaskDrawer() {
  const { language, t } = useI18n()
  const dispatch = useAppDispatch()
  const taskId = useAppSelector((s) => s.ui.taskDrawerId)
  const currentUserId = useAppSelector((s) => s.auth.currentUserId)
  const task = useAppSelector((s) => s.task.tasks.find((t) => t.id === taskId))
  const users = useAppSelector((s) => s.users.users)
  const tasks = useAppSelector((s) => s.task.tasks)
  const columns = useAppSelector((s) => s.board.columns.filter((c) => c.projectId === task?.projectId).sort((a,b)=>a.order-b.order))
  const labels = useAppSelector((s) => s.collaboration.labels.filter((l) => task?.labelIds.includes(l.id)))
  const checklist = useAppSelector((s) => s.collaboration.checklistItems.filter((x) => x.taskId === taskId))
  const subtasks = useAppSelector((s) => s.collaboration.subtasks.filter((x) => x.taskId === taskId))
  const comments = useAppSelector((s) => s.collaboration.comments.filter((x) => x.taskId === taskId))
  const dependencies = useAppSelector((s) => s.collaboration.dependencies.filter((x) => x.taskId === taskId))
  const timeEntries = useAppSelector((s) => s.collaboration.timeEntries.filter((x) => x.taskId === taskId))
  const attachments = useAppSelector((s) => s.collaboration.attachments.filter((x) => x.taskId === taskId))
  const customFields = useAppSelector((s) => s.collaboration.customFields.filter((x) => x.projectId === task?.projectId))
  const customValues = useAppSelector((s) => s.collaboration.customFieldValues.filter((x) => x.taskId === taskId))
  const automationRules = useAppSelector((s) => s.automation.rules)
  const [editOpen, setEditOpen] = useState(false)
  const [checkText, setCheckText] = useState('')
  const [subText, setSubText] = useState('')
  const [comment, setComment] = useState('')
  const [replyTo,setReplyTo]=useState<string|null>(null)
  const [replyText,setReplyText]=useState('')
  const [minutes, setMinutes] = useState('30')
  const [fieldName, setFieldName] = useState('')
  const [fieldType,setFieldType]=useState<CustomFieldDefinition['type']>('text')
  const [fieldOptions,setFieldOptions]=useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const checklistProgress = checklist.length ? Math.round((checklist.filter((x) => x.completed).length / checklist.length) * 100) : 0
  const totalMinutes = timeEntries.reduce((sum, x) => sum + x.minutes, 0)

  if (!task || !currentUserId) return <Drawer isOpen={false} onClose={() => undefined}>{null}</Drawer>
  const currentUser = users.find((u) => u.id === currentUserId)
  const canEdit = currentUser?.role === 'manager' || task.assigneeId === currentUserId
  const isManager = currentUser?.role === 'manager'
  const assignee = users.find((u) => u.id === task.assigneeId)
  const roots=comments.filter((item)=>!item.parentId).sort((a,b)=>b.createdAt.localeCompare(a.createdAt))

  const changeColumn = (columnId: string) => {
    if(!canEdit)return
    const previousColumn = columns.find((c) => c.id === task.columnId)
    const next = columns.find((c) => c.id === columnId)
    dispatch(updateTask({ id: task.id, data: { columnId } }))
    dispatch(addActivity({ projectId: task.projectId, taskId: task.id, userId: currentUserId, type: next?.isCompletedColumn ? 'task-completed' : 'task-moved', message: `moved ${task.title} to ${next?.title ?? t('another column')}` }))
    if (next?.isCompletedColumn && !previousColumn?.isCompletedColumn) {
      const managers = users.filter((u) => u.role === 'manager' && u.isActive)
      automationRules.filter((r) => r.enabled && r.trigger === 'task_completed' && (!r.projectId || r.projectId === task.projectId)).forEach((rule) => {
        const targets = rule.action === 'notify_assignee' ? users.filter((u) => u.id === task.assigneeId) : managers
        targets.forEach((target) => dispatch(addNotification({ userId: target.id, title: 'Task completed', message: `${task.title} was completed.`, type: 'success', taskId: task.id, projectId: task.projectId, signature: `completed:${rule.id}:${task.id}:${new Date().toISOString().slice(0,10)}` })))
      })
      if (task.recurrence && task.recurrence !== 'none' && task.dueDate) {
        const nextDue = task.recurrence === 'daily' ? addDays(task.dueDate, 1) : task.recurrence === 'weekly' ? addDays(task.dueDate, 7) : addMonths(task.dueDate, 1)
        const firstActiveColumn = columns.find((c) => !c.isCompletedColumn) ?? next
        if (firstActiveColumn) dispatch(addTask({ projectId: task.projectId, createdBy: currentUserId, data: { title: task.title, description: task.description, priority: task.priority, columnId: firstActiveColumn.id, assigneeId: task.assigneeId, startDate: nextDue, dueDate: nextDue, labelIds: task.labelIds, estimateMinutes: task.estimateMinutes, recurrence: task.recurrence } }))
      }
    }
  }

  const upload = async (file?: File) => {
    if (!file || !canEdit) return
    if (file.size > 1_000_000) { window.alert(t('For this frontend-only demo, local attachments are limited to 1 MB each.')); return }
    const reader = new FileReader()
    reader.onload = () => dispatch(addAttachment({ taskId: task.id, name: file.name, type: file.type, size: file.size, dataUrl: String(reader.result), uploadedBy: currentUserId }))
    reader.readAsDataURL(file)
  }

  const notifyMentions=(content:string)=>{const lower=content.toLowerCase();users.filter((u)=>u.id!==currentUserId).filter((u)=>lower.includes(`@${u.name.toLowerCase()}`)||lower.includes(`@${u.name.split(' ')[0]?.toLowerCase()}`)).forEach((u)=>dispatch(addNotification({userId:u.id,title:'You were mentioned',message:`You were mentioned in ${task.title}.`,type:'info',taskId:task.id,projectId:task.projectId})))}
  const sendComment=(content:string,parentId?:string)=>{const text=content.trim();if(!text)return;dispatch(addComment({taskId:task.id,authorId:currentUserId,content:text,parentId}));dispatch(addActivity({projectId:task.projectId,taskId:task.id,userId:currentUserId,type:'comment-added',message:parentId?`replied on ${task.title}`:`commented on ${task.title}`}));notifyMentions(text);if(parentId){const parent=comments.find((item)=>item.id===parentId);if(parent&&parent.authorId!==currentUserId)dispatch(addNotification({userId:parent.authorId,title:'New reply',message:`Someone replied to your comment on ${task.title}.`,type:'info',taskId:task.id,projectId:task.projectId}))}}

  return <>
    <Drawer isOpen={Boolean(taskId)} onClose={() => dispatch(closeTaskDrawer())} title={t('Task details')}>
      <div className="space-y-6">
        <section><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="mb-2 flex flex-wrap gap-2">{labels.map((l) => <Badge key={l.id} color={l.color}>{l.name}</Badge>)}<Badge color={priorityColor[task.priority]}>{t(task.priority)}</Badge></div><h1 className="text-2xl font-bold">{task.title}</h1><p className="mt-2 max-w-xl leading-6" style={{ color: 'rgb(var(--text-secondary))' }}>{task.description || t('No description yet.')}</p></div>{canEdit&&<div className="flex gap-2"><Button variant="secondary" onClick={() => setEditOpen(true)}>{t('Edit')}</Button>{isManager&&<Button variant="secondary" icon={Archive} onClick={()=>{dispatch(toggleTaskArchive(task.id));dispatch(addActivity({projectId:task.projectId,taskId:task.id,userId:currentUserId,type:'task-updated',message:`archived ${task.title}`}));dispatch(closeTaskDrawer())}}>{t('Archive')}</Button>}</div>}</div></section>

        <section className="app-card grid gap-3 p-4 sm:grid-cols-2"><label><span className="mb-1 block text-xs font-semibold">{t('Status / Column')}</span><Select disabled={!canEdit} value={task.columnId} onChange={(e) => changeColumn(e.target.value)}>{columns.map((c)=><option key={c.id} value={c.id}>{t(c.title)}</option>)}</Select></label><div><span className="mb-1 block text-xs font-semibold">{t('Assignee')}</span><div className="flex h-[42px] items-center gap-2 rounded-xl border px-3" style={{ borderColor: 'rgb(var(--border))' }}>{assignee ? <><Avatar name={assignee.name} src={assignee.avatar} size={26}/><span>{assignee.name}</span></> : <span style={{color:'rgb(var(--muted))'}}>{t('Unassigned')}</span>}</div></div><div><span className="text-xs font-semibold">{t('Start date')}</span><div className="mt-1">{task.startDate || '—'}</div></div><div><span className="text-xs font-semibold">{t('Due date')}</span><div className="mt-1">{task.dueDate || '—'}</div></div></section>

        <section><div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">{t('Checklist')}</h3><span className="text-xs" style={{color:'rgb(var(--muted))'}}>{checklistProgress}%</span></div><Progress value={checklistProgress}/><div className="mt-3 space-y-2">{checklist.map((item)=><div key={item.id} className="flex items-center gap-2"><button disabled={!canEdit} onClick={()=>dispatch(toggleChecklistItem(item.id))} className="flex h-5 w-5 items-center justify-center rounded-md border disabled:opacity-50" style={{background:item.completed?'rgb(var(--success))':'transparent',borderColor:item.completed?'rgb(var(--success))':'rgb(var(--border))',color:'white'}}>{item.completed&&<Check size={14}/>}</button><span className={item.completed?'line-through opacity-60':''}>{item.title}</span>{canEdit&&<button className="ms-auto opacity-50 hover:opacity-100" onClick={()=>dispatch(removeChecklistItem(item.id))}><Trash2 size={16}/></button>}</div>)}</div>{canEdit&&<div className="mt-3 flex gap-2"><Input value={checkText} onChange={(e)=>setCheckText(e.target.value)} placeholder={t('Add checklist item')}/><Button variant="secondary" onClick={()=>{if(checkText.trim()){dispatch(addChecklistItem({taskId:task.id,title:checkText.trim()}));setCheckText('')}}}><Plus size={18}/></Button></div>}</section>

        <section><h3 className="mb-3 font-semibold">{t('Subtasks')}</h3><div className="space-y-2">{subtasks.map((item)=><div key={item.id} className="flex items-center gap-2 rounded-xl border p-2.5" style={{borderColor:'rgb(var(--border))'}}><input type="checkbox" disabled={!canEdit} checked={item.completed} onChange={()=>dispatch(toggleSubtask(item.id))}/><span className={item.completed?'line-through opacity-60':''}>{item.title}</span>{canEdit&&<button className="ms-auto opacity-50" onClick={()=>dispatch(removeSubtask(item.id))}><Trash2 size={16}/></button>}</div>)}</div>{canEdit&&<div className="mt-3 flex gap-2"><Input value={subText} onChange={(e)=>setSubText(e.target.value)} placeholder={t('Add subtask')}/><Button variant="secondary" onClick={()=>{if(subText.trim()){dispatch(addSubtask({taskId:task.id,title:subText.trim(),assigneeId:task.assigneeId}));setSubText('')}}}><Plus size={18}/></Button></div>}</section>

        <section><h3 className="mb-3 flex items-center gap-2 font-semibold"><Link2 size={18}/>{t('Dependencies')}</h3><div className="space-y-2">{dependencies.map((dep)=>{const depTask=tasks.find((x)=>x.id===dep.dependsOnTaskId);return <div key={dep.id} className="flex items-center gap-2 rounded-xl bg-[rgb(var(--surface-alt))] p-2.5"><span className="text-xs">{t('Blocked by')}</span><span className="font-medium">{depTask?.title ?? t('Unknown task')}</span>{canEdit&&<button className="ms-auto" onClick={()=>dispatch(removeDependency(dep.id))}><Trash2 size={16}/></button>}</div>})}</div>{canEdit&&<Select className="mt-3" defaultValue="" onChange={(e)=>{if(e.target.value) dispatch(addDependency({taskId:task.id,dependsOnTaskId:e.target.value}));e.currentTarget.value='' }}><option value="">{t('Add dependency…')}</option>{tasks.filter((x)=>x.projectId===task.projectId&&x.id!==task.id&&!dependencies.some((d)=>d.dependsOnTaskId===x.id)).map((x)=><option key={x.id} value={x.id}>{x.title}</option>)}</Select>}</section>

        <section><h3 className="mb-3 flex items-center gap-2 font-semibold"><Clock3 size={18}/>{t('Time tracking')}</h3><div className="app-card flex items-center justify-between p-3"><span>{t('Total logged')}</span><strong>{Math.floor(totalMinutes/60)}h {totalMinutes%60}m</strong></div>{canEdit&&<div className="mt-3 flex gap-2"><Input type="number" min="1" value={minutes} onChange={(e)=>setMinutes(e.target.value)}/><Button variant="secondary" onClick={()=>{const m=Number(minutes);if(m>0)dispatch(addTimeEntry({taskId:task.id,userId:currentUserId,minutes:m}))}}>{t('Log time')}</Button></div>}</section>

        <section><h3 className="mb-3 flex items-center gap-2 font-semibold"><Paperclip size={18}/>{t('Attachments')}</h3>{canEdit&&<><input ref={fileRef} className="hidden" type="file" onChange={(e)=>upload(e.target.files?.[0])}/><Button variant="secondary" onClick={()=>fileRef.current?.click()}>{t('Add local attachment')}</Button></>}<div className="mt-3 space-y-2">{attachments.map((a)=><div key={a.id} className="flex items-center gap-2 rounded-xl border p-2.5" style={{borderColor:'rgb(var(--border))'}}><a className="min-w-0 flex-1 truncate text-sm font-medium" href={a.dataUrl} download={a.name}>{a.name}</a><span className="text-[10px]" style={{color:'rgb(var(--muted))'}}>{Math.round(a.size/1024)} KB</span>{canEdit&&<button onClick={()=>dispatch(removeAttachment(a.id))}><Trash2 size={16}/></button>}</div>)}</div><p className="mt-2 text-[11px]" style={{color:'rgb(var(--muted))'}}>{t('Stored locally in this browser. 1 MB limit per attachment.')}</p></section>

        <section><h3 className="mb-3 font-semibold">{t('Custom fields')}</h3><div className="space-y-3">{customFields.map((field)=>{const value=customValues.find((x)=>x.fieldId===field.id)?.value??'';return <div key={field.id} className="grid gap-2 sm:grid-cols-[1fr_auto]"><label><span className="mb-1 block text-xs">{field.name} <span className="capitalize" style={{color:'rgb(var(--muted))'}}>· {field.type}</span></span><CustomFieldInput field={field} value={value} disabled={!canEdit} onChange={(next)=>dispatch(setCustomFieldValue({taskId:task.id,fieldId:field.id,value:next}))}/></label>{isManager&&<button className="btn btn-ghost mt-5 min-h-10 w-10 p-0 text-red-500" title={t('Delete field from project')} onClick={()=>dispatch(removeCustomField(field.id))}><Trash2 size={15}/></button>}</div>})}</div>{isManager&&<div className="mt-4 rounded-2xl border p-3" style={{borderColor:'rgb(var(--border))'}}><div className="mb-2 text-xs font-semibold">{t('Create project field')}</div><div className="grid gap-2 sm:grid-cols-2"><Input value={fieldName} onChange={(e)=>setFieldName(e.target.value)} placeholder={t('Field name')}/><Select value={fieldType} onChange={(e)=>setFieldType(e.target.value as CustomFieldDefinition['type'])}><option value="text">{t('Text')}</option><option value="number">{t('Number')}</option><option value="date">{t('Date')}</option><option value="select">{t('Select')}</option></Select></div>{fieldType==='select'&&<Input className="mt-2" value={fieldOptions} onChange={(e)=>setFieldOptions(e.target.value)} placeholder={t('Options separated by commas (e.g. UX, Frontend, QA)')}/>}<div className="mt-2 flex justify-end"><Button variant="secondary" onClick={()=>{const options=fieldType==='select'?fieldOptions.split(',').map((x)=>x.trim()).filter(Boolean):undefined;if(fieldName.trim()&&(fieldType!=='select'||(options?.length??0)>0)){dispatch(addCustomField({projectId:task.projectId,name:fieldName.trim(),type:fieldType,options}));setFieldName('');setFieldType('text');setFieldOptions('')}}}>{t('Add field')}</Button></div></div>}</section>

        <section><h3 className="mb-3 flex items-center gap-2 font-semibold"><MessageSquare size={18}/>{t('Comments')}</h3><div className="flex gap-2"><Input value={comment} onChange={(e)=>setComment(e.target.value)} placeholder={t('Write a comment or @mention someone')}/><Button onClick={()=>{sendComment(comment);setComment('')}}>{t('Send')}</Button></div><div className="mt-4 space-y-4">{roots.map((root)=><CommentThread key={root.id} comment={root} comments={comments} users={users} currentUserId={currentUserId} isManager={isManager} replyTo={replyTo} replyText={replyText} onReplyStart={(id)=>{setReplyTo(id);setReplyText('')}} onReplyText={setReplyText} onReplySend={(parentId)=>{sendComment(replyText,parentId);setReplyTo(null);setReplyText('')}} onReplyCancel={()=>{setReplyTo(null);setReplyText('')}} onRemove={(id)=>dispatch(removeComment(id))}/>)}</div></section>
      </div>
    </Drawer>
    <Modal isOpen={editOpen} onClose={()=>setEditOpen(false)} title={t('Edit task')}><TaskForm projectId={task.projectId} task={task} onClose={()=>setEditOpen(false)}/></Modal>
  </>
}
