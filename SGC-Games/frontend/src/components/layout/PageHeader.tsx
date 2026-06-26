import type { ReactNode } from 'react'
import { Button } from '../ui/Button'

interface PageHeaderProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  children?: ReactNode
}

export function PageHeader({
  title,
  description,
  actionLabel,
  onAction,
  children,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-[#1D1D1F] lg:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-[#86868B]">{description}</p>}
      </div>
      <div className="flex items-center gap-3">
        {children}
        {actionLabel && onAction && <Button onClick={onAction}>{actionLabel}</Button>}
      </div>
    </div>
  )
}
