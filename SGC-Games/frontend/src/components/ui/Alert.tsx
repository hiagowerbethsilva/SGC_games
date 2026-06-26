import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface AlertProps {
  children: ReactNode
  variant?: 'error' | 'info' | 'warning'
  className?: string
}

const variants = {
  error: 'bg-[#FFEBEA] border-[#FFB4B0] text-[#C41E16]',
  info: 'bg-[#F2F2F7] border-[#E5E5EA] text-[#1D1D1F]',
  warning: 'bg-[#FFF4E5] border-[#FFD699] text-[#B25000]',
}

export function Alert({ children, variant = 'info', className }: AlertProps) {
  return (
    <div className={cn('rounded-xl border px-4 py-3 text-sm', variants[variant], className)}>
      {children}
    </div>
  )
}
