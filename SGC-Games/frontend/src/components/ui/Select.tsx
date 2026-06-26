import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-[#1D1D1F]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full rounded-xl border border-[#E5E5EA] bg-white px-4 py-2.5 text-sm text-[#1D1D1F]',
            'transition-colors duration-200 focus:border-[#3B4ED8] focus:outline-none focus:ring-2 focus:ring-[#3B4ED8]/15',
            error && 'border-[#FF3B30]',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs text-[#FF3B30]">{error}</p>}
      </div>
    )
  },
)

Select.displayName = 'Select'
