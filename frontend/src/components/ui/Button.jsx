import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/formatters'

const variants = {
  default:     'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-sm',
  secondary:   'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] shadow-sm',
  destructive: 'bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger-hover)] shadow-sm',
  outline:     'border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]',
  ghost:       'text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]',
  link:        'text-[var(--color-primary)] underline-offset-4 hover:underline p-0 h-auto',
  danger_outline: 'border border-[var(--color-danger)] text-[var(--color-danger)] bg-transparent hover:bg-[var(--color-danger-bg)]',
}

const sizes = {
  xs:   'h-7 px-2.5 text-xs rounded-md',
  sm:   'h-8 px-3 text-sm rounded-md',
  default: 'h-10 px-4 text-sm rounded-lg',
  lg:   'h-12 px-6 text-base rounded-lg',
  xl:   'h-14 px-8 text-lg rounded-xl',
  icon: 'h-10 w-10 rounded-lg',
  icon_sm: 'h-8 w-8 rounded-md',
}

export const Button = React.forwardRef(({
  className, variant = 'default', size = 'default',
  isLoading = false, leftIcon, rightIcon, children, disabled, ...props
}, ref) => {
  const base = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none'

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      disabled={disabled || isLoading}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : leftIcon ? (
        <span className="flex-shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {rightIcon && !isLoading && <span className="flex-shrink-0">{rightIcon}</span>}
    </motion.button>
  )
})
Button.displayName = 'Button'
