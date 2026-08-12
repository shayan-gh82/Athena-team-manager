import { useEffect, useRef, useState, type ReactNode } from 'react'

export default function Dropdown({ trigger, children, align = 'right' }: { trigger: ReactNode; children: ReactNode; align?: 'left' | 'right' }) {
  const [open,setOpen]=useState(false);const ref=useRef<HTMLDivElement>(null)
  useEffect(()=>{const close=(event:MouseEvent)=>{if(ref.current&&!ref.current.contains(event.target as Node))setOpen(false)};document.addEventListener('mousedown',close);return()=>document.removeEventListener('mousedown',close)},[])
  return <div ref={ref} className="relative inline-block"><span onClick={()=>setOpen((x)=>!x)}>{trigger}</span>{open&&<div className={`absolute top-[calc(100%+6px)] z-[110] min-w-40 rounded-xl border p-1.5 shadow-xl ${align==='right'?'end-0':'start-0'}`} style={{background:'rgb(var(--surface))',borderColor:'rgb(var(--border))'}} onClick={()=>setOpen(false)}>{children}</div>}</div>
}
