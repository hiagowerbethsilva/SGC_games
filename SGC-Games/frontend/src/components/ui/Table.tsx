import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface TableProps {
  children: ReactNode
  className?: string
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#E5E5EA] bg-white shadow-card">
      <table className={cn('w-full min-w-[640px] text-left text-sm', className)}>
        {children}
      </table>
    </div>
  )
}

export function TableHead({ children }: { children: ReactNode }) {
  return (
    <thead className="border-b border-[#E5E5EA] bg-[#F9F9FB]">
      <tr>{children}</tr>
    </thead>
  )
}

export function TableHeaderCell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <th className={cn('px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#86868B]', className)}>
      {children}
    </th>
  )
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-[#E5E5EA]">{children}</tbody>
}

export function TableRow({
  children,
  onClick,
}: {
  children: ReactNode
  onClick?: () => void
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'transition-colors duration-150',
        onClick && 'cursor-pointer hover:bg-[#F5F5F7]',
      )}
    >
      {children}
    </tr>
  )
}

export function TableCell({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn('px-4 py-3 font-medium text-[#1D1D1F]', className)}>{children}</td>
}
