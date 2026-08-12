import { useState, type ReactNode } from 'react'

export default function Tooltip({ content, children, side = 'top' }: { content: ReactNode; children: ReactNode; side?: 'top' | 'bottom' }) {
  const [open, setOpen] = useState(false)
  return <span className="relative inline-flex" onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)} onFocus={()=>setOpen(true)} onBlur={()=>setOpen(false)}>
    {children}
    {open && <span role="tooltip" className={`pointer-events-none absolute left-1/2 z-[140] -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-950 px-2 py-1 text-[11px] font-medium text-white shadow-lg ${side==='top'?'bottom-[calc(100%+7px)]':'top-[calc(100%+7px)]'}`}>{content}</span>}
  </span>
}
