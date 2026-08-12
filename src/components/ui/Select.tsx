import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(({ className, ...props }, ref) => (
  <select ref={ref} className={cn('app-input pr-8', className)} {...props} />
))
Select.displayName = 'Select'
export default Select
