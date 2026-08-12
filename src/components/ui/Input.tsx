import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn('app-input', className)} {...props} />
))
Input.displayName = 'Input'
export default Input
