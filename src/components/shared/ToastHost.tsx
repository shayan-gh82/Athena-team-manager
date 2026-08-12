import { useEffect, useState } from 'react'
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import { useAppSelector } from '@/store/hooks'
import { useI18n } from '@/i18n'

export default function ToastHost(){
  const {t,language}=useI18n()
  const userId=useAppSelector((s)=>s.auth.currentUserId)
  const latest=useAppSelector((s)=>s.notifications.notifications.find((n)=>n.userId===userId&&!n.isRead))
  const[visible,setVisible]=useState(false)
  useEffect(()=>{if(!latest)return;setVisible(true);const timer=window.setTimeout(()=>setVisible(false),4500);return()=>window.clearTimeout(timer)},[latest?.id])
  if(!latest||!visible)return null
  const Icon=latest.type==='success'?CheckCircle2:latest.type==='warning'||latest.type==='danger'?TriangleAlert:Info
  const color=latest.type==='success'?'rgb(var(--success))':latest.type==='danger'?'rgb(var(--danger))':latest.type==='warning'?'rgb(var(--warning))':'rgb(var(--info))'
  const message=language==='fa'
    ? latest.message.replace(/^(.*) is overdue\.$/,'$1 از موعد گذشته است.').replace(/^(.*) is due today\.$/,'موعد $1 امروز است.').replace(/^(.*) is due tomorrow\.$/,'موعد $1 فردا است.').replace(/^(.*) is due in (\d+) days?\.$/,'$1 تا $2 روز دیگر سررسید می‌شود.')
    : latest.message
  return <div className={`app-card fixed bottom-20 z-[130] w-[min(380px,calc(100vw-24px))] animate-fade-in p-4 shadow-2xl md:bottom-6 ${language==='fa'?'left-3 md:left-6':'right-3 md:right-6'}`}><div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{background:`color-mix(in srgb, ${color} 12%, transparent)`,color}}><Icon size={21}/></span><div className="min-w-0 flex-1"><div className="font-semibold">{t(latest.title)}</div><p className="mt-1 text-xs leading-5" style={{color:'rgb(var(--text-secondary))'}}>{t(message)}</p></div><button className="icon-action btn-ghost !h-9 !min-h-9 !w-9 !min-w-9" aria-label={t('Close')} onClick={()=>setVisible(false)}><X size={19}/></button></div></div>
}
