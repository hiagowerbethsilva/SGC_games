import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-[#1D1D1F]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full rounded-xl border border-[#E5E5EA] bg-white px-4 py-2.5 text-sm text-[#1D1D1F] min-h-[100px]',
            'placeholder:text-[#86868B] transition-colors duration-200 resize-y',
            'focus:border-[#3B4ED8] focus:outline-none focus:ring-2 focus:ring-[#3B4ED8]/15',
            error && 'border-[#FF3B30]',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#FF3B30]">{error}</p>}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
