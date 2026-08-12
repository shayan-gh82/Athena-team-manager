export default function Avatar({ name, src, size = 36 }: { name: string; src?: string; size?: number }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((x) => x[0]?.toUpperCase()).join('')
  return src ? <img src={src} alt={name} className="rounded-full object-cover" style={{ width: size, height: size }} /> : (
    <span className="inline-flex shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ width: size, height: size, background: 'linear-gradient(135deg,#635BFF,#38BDF8)' }}>{initials || '?'}</span>
  )
}
