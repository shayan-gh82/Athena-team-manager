import { useEffect, useRef, useState, type ReactNode } from 'react'
export default function Popover({ trigger, children }: { trigger: ReactNode; children: ReactNode }) {
  const [open,setOpen]=useState(false);const ref=useRef<HTMLDivElement>(null)
  useEffect(()=>{const close=(event:MouseEvent)=>{if(ref.current&&!ref.current.contains(event.target as Node))setOpen(false)};document.addEventListener('mousedown',close);return()=>document.removeEventListener('mousedown',close)},[])
  return <div ref={ref} className="relative inline-block"><span onClick={()=>setOpen((x)=>!x)}>{trigger}</span>{open&&<div className="absolute end-0 top-[calc(100%+8px)] z-[110] w-72 rounded-2xl border p-4 shadow-2xl" style={{background:'rgb(var(--surface))',borderColor:'rgb(var(--border))'}}>{children}</div>}</div>
}
