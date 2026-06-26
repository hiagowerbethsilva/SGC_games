import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'
import { Spinner } from './Spinner'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  loading?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-[#3B4ED8] text-white hover:bg-[#2F3EB5] focus-visible:ring-[#3B4ED8]/30 shadow-sm shadow-[#3B4ED8]/20',
  secondary:
    'bg-white text-[#1D1D1F] hover:bg-[#F5F5F7] border border-[#E5E5EA] focus-visible:ring-[#3B4ED8]/20',
  danger:
    'bg-[#FF3B30] text-white hover:bg-[#E0352B] focus-visible:ring-[#FF3B30]/30 shadow-sm',
  ghost: 'bg-transparent text-[#86868B] hover:bg-[#F2F2F7] hover:text-[#1D1D1F] focus-visible:ring-[#3B4ED8]/20',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-normal transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        className,
      )}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  ),
)

Button.displayName = 'Button'
