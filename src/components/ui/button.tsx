import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { LoaderCircle } from 'lucide-react'
import { cn } from '../../lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'border-transparent bg-linear-to-br from-[#c82c22] to-[#a71d17] text-white shadow-[0_10px_24px_rgba(181,34,27,.22)] hover:shadow-[0_14px_28px_rgba(181,34,27,.3)]',
  secondary: 'border-[#dfe0e4] bg-white text-[#393a40] shadow-[0_5px_14px_rgba(30,31,34,.05)]',
  ghost: 'border-transparent bg-transparent text-[#4a4c54]',
  danger: 'border-transparent bg-brand-soft text-brand',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading = false, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border px-5 font-bold no-underline transition duration-200 enabled:hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none',
        variantClasses[variant],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <LoaderCircle aria-hidden="true" className="animate-spin" size={18} /> : null}
      {children}
    </button>
  ),
)

Button.displayName = 'Button'
