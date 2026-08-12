import { Briefcase, GraduationCap, Rocket } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addProject } from '@/store/projectSlice'
import { addActivity } from '@/store/collaborationSlice'
import { addNotification } from '@/store/notificationsSlice'
import { useI18n } from '@/i18n'

const templates=[
  {name:'Software Sprint',description:'A focused product sprint with planning, implementation, review and delivery.',color:'#7C6CFF',iconComponent:Rocket,icon:'rocket',duration:14},
  {name:'University Project',description:'Plan research, implementation, documentation and presentation work.',color:'#F59E0B',iconComponent:GraduationCap,icon:'university',duration:30},
  {name:'Client Project',description:'Manage client deliverables, review cycles and launch activities.',color:'#06B6D4',iconComponent:Briefcase,icon:'business',duration:21},
]
const iso=(days:number)=>{const d=new Date();d.setDate(d.getDate()+days);return d.toISOString().slice(0,10)}
export default function ProjectTemplatePicker({onDone}:{onDone:()=>void}){
  const { language,t }=useI18n();const dispatch=useAppDispatch();const userId=useAppSelector((s)=>s.auth.currentUserId)!;const users=useAppSelector((s)=>s.users.users.filter((u)=>u.isActive))
  return <div className="grid gap-3">{templates.map((template)=>{const Icon=template.iconComponent;return <button key={template.name} className={`app-card app-card-interactive flex items-start gap-4 p-4 ${language==='fa'?'text-right':'text-left'}`} onClick={()=>{const action=dispatch(addProject({ownerId:userId,data:{title:template.name,description:template.description,status:'active',color:template.color,icon:template.icon,startDate:iso(0),dueDate:iso(template.duration),memberIds:users.slice(0,3).map((u)=>u.id)}}));dispatch(addActivity({projectId:action.payload.id,userId,type:'project-created',message:`created ${template.name} from a template`}));dispatch(addNotification({userId,title:'Project created',message:`${template.name} was created from a template.`,type:'success',projectId:action.payload.id}));onDone()}}><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white" style={{background:template.color}}><Icon size={22}/></span><div><h3 className="font-semibold">{t(template.name)}</h3><p className="mt-1 text-xs leading-5" style={{color:'rgb(var(--muted))'}}>{t(template.description)}</p></div></button>})}</div>
}
