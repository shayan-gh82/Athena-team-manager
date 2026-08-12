import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outlineDanger'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  children?: ReactNode
}

export default function Button({ variant = 'primary', size = 'md', icon: Icon, className, children, ...props }: Props) {
  const variantClass = {
    primary: 'btn-primary', secondary: 'btn-secondary', ghost: 'btn-ghost', danger: 'btn-danger', outlineDanger: 'btn-outline-danger',
  }[variant]
  const sizeClass = size === 'sm' ? 'min-h-8 px-3 text-xs' : size === 'lg' ? 'min-h-11 px-5' : ''
  return <button className={cn('btn', variantClass, sizeClass, className)} {...props}>{Icon && <Icon size={18} />}{children}</button>
}
