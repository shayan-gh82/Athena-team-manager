import type { ReactNode } from 'react'

export default function Badge({ children, color = '#635BFF' }: { children: ReactNode; color?: string }) {
  return <span className="badge" style={{ color, backgroundColor: `${color}16`, borderColor: `${color}30` }}>{children}</span>
}
