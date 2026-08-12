import { CalendarDays, CheckSquare, MessageSquare, Paperclip } from 'lucide-react'
import type { Task } from '@/types'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { openTaskDrawer } from '@/store/uiSlice'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import { formatLocalizedDate, useI18n } from '@/i18n'

const priorityColor={low:'#64748B',medium:'#3B82F6',high:'#F59E0B',critical:'#F43F5E'}
export default function KanbanTaskCard({task,onDragStart,canDrag=true}:{task:Task;onDragStart:(taskId:string)=>void;canDrag?:boolean}){
  const { language,t }=useI18n();const dispatch=useAppDispatch();const user=useAppSelector((s)=>s.users.users.find((u)=>u.id===task.assigneeId));const labels=useAppSelector((s)=>s.collaboration.labels.filter((l)=>task.labelIds.includes(l.id)));const checklist=useAppSelector((s)=>s.collaboration.checklistItems.filter((x)=>x.taskId===task.id));const comments=useAppSelector((s)=>s.collaboration.comments.filter((x)=>x.taskId===task.id));const attachments=useAppSelector((s)=>s.collaboration.attachments.filter((x)=>x.taskId===task.id));const complete=checklist.filter((x)=>x.completed).length
  return <article draggable={canDrag} onDragStart={(e)=>{if(!canDrag){e.preventDefault();return}e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/task-id',task.id);onDragStart(task.id)}} onClick={()=>dispatch(openTaskDrawer(task.id))} className="app-card app-card-interactive cursor-grab p-3 active:cursor-grabbing"><div className="mb-2 flex flex-wrap gap-1">{labels.slice(0,3).map((l)=><span key={l.id} className="h-1.5 w-9 rounded-full" title={l.name} style={{background:l.color}}/> )}</div><h4 className="font-semibold leading-5">{task.title}</h4><div className="mt-3 flex items-center justify-between"><Badge color={priorityColor[task.priority]}>{t(task.priority)}</Badge>{user&&<Avatar name={user.name} src={user.avatar} size={28}/>}</div><div className="mt-3 flex flex-wrap items-center gap-3 text-[11px]" style={{color:'rgb(var(--muted))'}}>{checklist.length>0&&<span className="flex items-center gap-1"><CheckSquare size={15}/>{complete}/{checklist.length}</span>}{comments.length>0&&<span className="flex items-center gap-1"><MessageSquare size={15}/>{comments.length}</span>}{attachments.length>0&&<span className="flex items-center gap-1"><Paperclip size={15}/>{attachments.length}</span>}{task.dueDate&&<span className="ms-auto flex items-center gap-1"><CalendarDays size={15}/>{formatLocalizedDate(task.dueDate,language)}</span>}</div></article>
}
