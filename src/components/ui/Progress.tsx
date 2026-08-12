export default function Progress({ value, color = 'rgb(var(--primary))' }: { value: number; color?: string }) {
  return <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: 'rgb(var(--surface-alt))' }}><div className="h-full rounded-full transition-all duration-300" style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }} /></div>
}
