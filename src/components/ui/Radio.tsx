import type { InputHTMLAttributes } from 'react'
export default function Radio({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="radio" className="h-4 w-4 accent-[rgb(var(--primary))]" {...props}/><span>{label}</span></label>
}
