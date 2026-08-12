import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { openTaskDrawer } from '@/store/uiSlice'
import Button from '@/components/ui/Button'
import TaskFilters from '@/components/task/TaskFilters'
import { applyTaskFilters } from '@/utils/taskFilter'
import { useI18n } from '@/i18n'

export default function CalendarPage(){
  const { language, t, locale }=useI18n();const {projectId=''}=useParams();const dispatch=useAppDispatch();const tasks=useAppSelector((s)=>s.task.tasks.filter((task)=>task.projectId===projectId&&!task.isArchived));const filters=useAppSelector((s)=>s.taskFilter);const visible=useMemo(()=>applyTaskFilters(tasks,filters),[tasks,filters]);const[cursor,setCursor]=useState(()=>{const date=new Date();date.setDate(1);return date})
  const year=cursor.getFullYear(),month=cursor.getMonth();const jsFirstDay=new Date(year,month,1).getDay();const firstDay=language==='fa'?(jsFirstDay+1)%7:jsFirstDay;const days=new Date(year,month+1,0).getDate();const cells=Array.from({length:firstDay+days},(_,index)=>index<firstDay?null:index-firstDay+1)
  const change=(amount:number)=>{const date=new Date(cursor);date.setMonth(date.getMonth()+amount);setCursor(date)}
  const PrevIcon=language==='fa'?ChevronRight:ChevronLeft;const NextIcon=language==='fa'?ChevronLeft:ChevronRight
  const monthName=new Intl.DateTimeFormat(locale,{month:'long',year:'numeric'}).format(cursor)
  return <div><div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="text-xl font-bold">{t('Calendar')}</h2><p className="text-xs" style={{color:'rgb(var(--muted))'}}>{t('Tasks are placed by due date.')}</p></div><div className="flex items-center gap-2"><Button variant="secondary" onClick={()=>change(-1)} aria-label={t('Previous month')}><PrevIcon size={19}/></Button><strong className="min-w-36 text-center">{monthName}</strong><Button variant="secondary" onClick={()=>change(1)} aria-label={t('Next month')}><NextIcon size={19}/></Button></div></div><TaskFilters projectId={projectId}/><div className="app-card overflow-hidden"><div className="grid grid-cols-7 bg-[rgb(var(--surface-alt))] text-center text-xs font-semibold" style={{color:'rgb(var(--muted))'}}>{(language==='fa'?['Sat','Sun','Mon','Tue','Wed','Thu','Fri']:['Sun','Mon','Tue','Wed','Thu','Fri','Sat']).map((day)=><div key={day} className="p-2">{t(day)}</div>)}</div><div className="grid grid-cols-7">{cells.map((day,index)=>{const date=day?`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`:'';const dayTasks=visible.filter((task)=>task.dueDate===date);return <div key={index} className="min-h-28 border-r border-t p-1.5 last:border-r-0" style={{borderColor:'rgb(var(--border))'}}>{day&&<><div className="mb-1 text-xs font-semibold">{new Intl.NumberFormat(locale).format(day)}</div><div className="space-y-1">{dayTasks.slice(0,4).map((task)=><button key={task.id} onClick={()=>dispatch(openTaskDrawer(task.id))} className={`w-full truncate rounded-md px-2 py-1 text-[10px] font-medium ${language==='fa'?'text-right':'text-left'}`} style={{background:'rgb(var(--primary-soft))',color:'rgb(var(--primary))'}}>{task.title}</button>)}{dayTasks.length>4&&<div className="text-[10px]" style={{color:'rgb(var(--muted))'}}>+{dayTasks.length-4} {t('more')}</div>}</div></>}</div>})}</div></div></div>
}
