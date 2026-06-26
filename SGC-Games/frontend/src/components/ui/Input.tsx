import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#1D1D1F]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-xl border border-[#E5E5EA] bg-white px-4 py-2.5 text-sm text-[#1D1D1F]',
            'placeholder:text-[#86868B] transition-colors duration-200',
            'focus:border-[#3B4ED8] focus:outline-none focus:ring-2 focus:ring-[#3B4ED8]/15',
            error && 'border-[#FF3B30] focus:border-[#FF3B30] focus:ring-[#FF3B30]/15',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#FF3B30]">{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'
