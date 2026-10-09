import React, { useState, useId } from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { cn } from '../../utils/formatters'

export const Input = React.forwardRef(({
  className, label, error, hint, leftIcon, rightIcon,
  type = 'text', required, id, ...props
}, ref) => {
  const [showPass, setShowPass] = useState(false)
  const autoId = useId()
  const inputId = id || autoId
  const errorId = `${inputId}-error`
  const hintId = `${inputId}-hint`

  const isPassword = type === 'password'
  const inputType = isPassword ? (showPass ? 'text' : 'password') : type

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-[var(--color-text-primary)]">
          {label}
          {required && <span className="text-[var(--color-danger)] ml-0.5" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--color-text-muted)]" aria-hidden="true">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          required={required}
          aria-required={required ? 'true' : undefined}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
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
            aria-label={showPass ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-3 flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] rounded"
          >
            {showPass ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
          </button>
        )}
        {rightIcon && !isPassword && (
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[var(--color-text-muted)]" aria-hidden="true">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p id={errorId} role="alert" className="flex items-center gap-1 text-xs text-[var(--color-danger)]">
          <AlertCircle size={12} aria-hidden="true" /> {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className="text-xs text-[var(--color-text-muted)]">{hint}</p>
      )}
    </div>
  )
})
Input.displayName = 'Input'

export const Textarea = React.forwardRef(({ className, label, error, hint, required, id, ...props }, ref) => {
  const autoId = useId()
  const textareaId = id || autoId
  const errorId = `${textareaId}-error`
  const hintId = `${textareaId}-hint`

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-[var(--color-text-primary)]">
          {label}{required && <span className="text-[var(--color-danger)] ml-0.5" aria-hidden="true">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        required={required}
        aria-required={required ? 'true' : undefined}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={cn(
          'flex w-full rounded-lg border px-3 py-2 text-sm min-h-[100px] resize-y transition-all duration-150',
          'bg-[var(--color-surface)] text-slate-900 dark:text-white placeholder:text-[var(--color-text-muted)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]',
          error ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
          className
        )}
        {...props}
      />
      {error && <p id={errorId} role="alert" className="text-xs text-[var(--color-danger)]">{error}</p>}
      {hint && !error && <p id={hintId} className="text-xs text-[var(--color-text-muted)]">{hint}</p>}
    </div>
  )
})
Textarea.displayName = 'Textarea'

export const Select = React.forwardRef(({ className, label, error, required, id, children, ...props }, ref) => {
  const autoId = useId()
  const selectId = id || autoId
  const errorId = `${selectId}-error`

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-[var(--color-text-primary)]">
          {label}{required && <span className="text-[var(--color-danger)] ml-0.5" aria-hidden="true">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        required={required}
        aria-required={required ? 'true' : undefined}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
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
      {error && <p id={errorId} role="alert" className="text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  )
})
Select.displayName = 'Select'
