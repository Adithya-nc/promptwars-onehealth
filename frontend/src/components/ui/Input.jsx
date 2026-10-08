import React, { useState } from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { cn } from '../../utils/formatters'

export const Input = React.forwardRef(({
  className, label, error, hint, leftIcon, rightIcon,
  type = 'text', required, id, ...props
}, ref) => {
  const [showPass, setShowPass] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPass ? 'text' : 'password') : type

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-[var(--color-text-primary)]">
          {label}
          {required && <span className="text-[var(--color-danger)] ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--color-text-muted)]">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          type={inputType}
          className={cn(
            'flex h-10 w-full rounded-lg border text-sm transition-all duration-150',
            'bg-[var(--color-surface)] text-slate-900 dark:text-white',
            'placeholder:text-[var(--color-text-muted)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]',
            error
              ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]'
              : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
            leftIcon  ? 'pl-9'  : 'pl-3',
            (rightIcon || isPassword) ? 'pr-9' : 'pr-3',
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPass(s => !s)}
            className="absolute inset-y-0 right-3 flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
        {rightIcon && !isPassword && (
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[var(--color-text-muted)]">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs text-[var(--color-danger)]">
          <AlertCircle size={12} /> {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>
      )}
    </div>
  )
})
Input.displayName = 'Input'

export const Textarea = React.forwardRef(({ className, label, error, hint, required, id, ...props }, ref) => (
  <div className="w-full space-y-1.5">
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-[var(--color-text-primary)]">
        {label}{required && <span className="text-[var(--color-danger)] ml-0.5">*</span>}
      </label>
    )}
    <textarea
      ref={ref}
      id={id}
      className={cn(
        'flex w-full rounded-lg border px-3 py-2 text-sm min-h-[100px] resize-y transition-all duration-150',
        'bg-[var(--color-surface)] text-slate-900 dark:text-white placeholder:text-[var(--color-text-muted)]',
        'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]',
        error ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
        className
      )}
      {...props}
    />
    {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
    {hint && !error && <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>}
  </div>
))
Textarea.displayName = 'Textarea'

export const Select = React.forwardRef(({ className, label, error, required, id, children, ...props }, ref) => (
  <div className="w-full space-y-1.5">
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-[var(--color-text-primary)]">
        {label}{required && <span className="text-[var(--color-danger)] ml-0.5">*</span>}
      </label>
    )}
    <select
      ref={ref}
      id={id}
      className={cn(
        'flex h-10 w-full rounded-lg border px-3 text-sm appearance-none cursor-pointer transition-all duration-150',
        'bg-[var(--color-surface)] text-[var(--color-text-primary)] [&>option]:text-black [&>option]:bg-white dark:[&>option]:text-white dark:[&>option]:bg-slate-900',
        'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]',
        error ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
        className
      )}
      {...props}
    >
      {children}
    </select>
    {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
  </div>
))
Select.displayName = 'Select'
