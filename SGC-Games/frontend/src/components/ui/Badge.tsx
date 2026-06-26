import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'primary'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-[#F2F2F7] text-[#1D1D1F] border-[#E5E5EA]',
  success: 'bg-[#E8F8EF] text-[#1B7D46] border-[#B8E6CC]',
  warning: 'bg-[#FFF4E5] text-[#B25000] border-[#FFD699]',
  danger: 'bg-[#FFEBEA] text-[#C41E16] border-[#FFB4B0]',
  primary: 'bg-[#EEF0FD] text-[#3B4ED8] border-[#C5CCF5]',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-normal',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
