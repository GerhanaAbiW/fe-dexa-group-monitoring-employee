import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  leadingIcon?: ReactNode
  trailingAction?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, id, label, error, leadingIcon, trailingAction, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const errorId = `${inputId}-error`

    return (
      <div className={cn('flex min-w-0 flex-col gap-2', className)}>
        <label className="text-sm font-semibold text-[#3d3e44]" htmlFor={inputId}>{label}</label>
        <div className="relative flex items-center">
          {leadingIcon ? <span className="pointer-events-none absolute left-4 z-10 flex text-[#9698a1]">{leadingIcon}</span> : null}
          <input
            className={cn(
              'h-[50px] w-full rounded-xl border border-[#dcdde2] bg-white px-11 text-[#26272b] outline-none transition placeholder:text-[#aaacb3] focus:border-[#c53a33] focus:ring-4 focus:ring-[rgba(181,34,27,.09)]',
              error && 'border-[#cf3f37]',
            )}
            id={inputId}
            ref={ref}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            {...props}
          />
          {trailingAction ? <span className="absolute right-3 flex [&_button]:grid [&_button]:size-8 [&_button]:place-items-center [&_button]:border-0 [&_button]:bg-transparent [&_button]:p-0 [&_button]:text-[#858891]">{trailingAction}</span> : null}
        </div>
        {error ? <span className="text-xs text-brand" id={errorId}>{error}</span> : null}
      </div>
    )
  },
)

Input.displayName = 'Input'
