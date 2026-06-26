import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hoverable?: boolean
}

export function Card({ children, className, hoverable, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[#E5E5EA] bg-white p-6 shadow-card',
        hoverable && 'transition-all duration-200 hover:shadow-card-hover cursor-pointer',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
