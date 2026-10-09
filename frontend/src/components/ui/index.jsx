import { useRef } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { cn } from '../../utils/formatters'

// Premium Clinical 3D StatCard
export function StatCard({ icon, label, value, trend, trendLabel, color = 'primary', className, onClick }) {
  const cardRef = useRef(null)
  
  // 3D Hover tilt calculations
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-100, 100], [5, -5])
  const rotateY = useTransform(x, [-100, 100], [-5, 5])

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left - width / 2
    const mouseY = e.clientY - rect.top - height / 2
    x.set(mouseX)
    y.set(mouseY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const colorMap = {
    primary: { 
      bg: 'bg-blue-50/90 dark:bg-blue-500/15', 
      icon: 'text-blue-600 dark:text-blue-400', 
      text: 'text-blue-600 dark:text-blue-400', 
      glow: 'hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.16)] hover:border-blue-500/40',
      pill: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
    },
    success: { 
      bg: 'bg-teal-50/90 dark:bg-teal-500/15', 
      icon: 'text-teal-600 dark:text-teal-400', 
      text: 'text-teal-600 dark:text-teal-400', 
      glow: 'hover:shadow-[0_16px_36px_-6px_rgba(13,148,136,0.16)] hover:border-teal-500/40',
      pill: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
    },
    warning: { 
      bg: 'bg-amber-50/90 dark:bg-amber-500/15',  
      icon: 'text-amber-600 dark:text-amber-400',  
      text: 'text-amber-600 dark:text-amber-400', 
      glow: 'hover:shadow-[0_16px_36px_-6px_rgba(245,158,11,0.16)] hover:border-amber-500/40',
      pill: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
    },
    danger:  { 
      bg: 'bg-red-50/90 dark:bg-red-500/15',    
      icon: 'text-red-600 dark:text-red-400',    
      text: 'text-red-600 dark:text-red-400', 
      glow: 'hover:shadow-[0_16px_36px_-6px_rgba(239,68,68,0.16)] hover:border-red-500/40',
      pill: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
    },
    purple:  { 
      bg: 'bg-purple-50/90 dark:bg-purple-500/15', 
      icon: 'text-purple-600 dark:text-purple-400', 
      text: 'text-purple-600 dark:text-purple-400', 
      glow: 'hover:shadow-[0_16px_36px_-6px_rgba(168,85,247,0.16)] hover:border-purple-500/40',
      pill: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
    },
    orange:  { 
      bg: 'bg-orange-50/90 dark:bg-orange-500/15', 
      icon: 'text-orange-600 dark:text-orange-400', 
      text: 'text-orange-600 dark:text-orange-400', 
      glow: 'hover:shadow-[0_16px_36px_-6px_rgba(249,115,22,0.16)] hover:border-orange-500/40',
      pill: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300'
    },
  }
  const c = colorMap[color] || colorMap.primary

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      whileHover={{
        scale: 1.02,
        y: -3,
        z: 12,
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={cn(
        'rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl p-5 cursor-pointer shadow-[0_4px_24px_-2px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.7)] dark:shadow-[0_4px_24px_-2px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.05)] relative overflow-hidden transition-all duration-300',
        c.glow,
        className
      )}
    >
      {/* Specular clinical top-edge reflection */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-transparent dark:from-white/10 pointer-events-none" 
        style={{ transform: 'translateZ(3px)' }}
      />
      
      <div className="relative z-10 flex flex-col justify-between h-full" style={{ transform: 'translateZ(15px)' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</span>
          <motion.div 
            whileHover={{ scale: 1.08 }}
            className={cn('p-2.5 rounded-xl shadow-sm border border-black/5 dark:border-white/5 relative', c.bg)}
          >
            <span className={cn('block w-5 h-5 flex items-center justify-center', c.icon)}>{icon}</span>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-current opacity-70 animate-ping" />
          </motion.div>
        </div>
        <div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-black text-slate-900 dark:text-white font-data tracking-tight"
          >
            {value}
          </motion.div>
          {(trendLabel || trend) && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold', c.pill)}>
                {trendLabel || trend}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Progress bar
export function ProgressBar({ value = 0, max = 100, color = 'primary', size = 'md', label, showPercent = false, className }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))
  const colorMap = {
    primary: 'bg-[var(--color-primary)]',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger:  'bg-red-500',
  }
  const sizeMap = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' }

  return (
    <div className={className}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs text-[var(--color-text-secondary)]">{label}</span>}
          {showPercent && <span className="text-xs font-medium text-[var(--color-text-primary)]">{Math.round(percent)}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-[var(--color-surface-2)] rounded-full overflow-hidden', sizeMap[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn('h-full rounded-full', colorMap[color] || colorMap.primary)}
        />
      </div>
    </div>
  )
}

// Empty State
export function EmptyState({ icon, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface-2)] flex items-center justify-center mb-4 text-[var(--color-text-muted)]">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">{title}</h3>
      {description && <p className="text-sm text-[var(--color-text-secondary)] mb-6 max-w-xs">{description}</p>}
      {action}
    </div>
  )
}

// Avatar
export function Avatar({ src, name = '', size = 'md', className }) {
  const sizeMap = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-base', xl: 'w-20 h-20 text-2xl' }
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className={cn('rounded-full bg-gradient-to-br from-[var(--color-primary)] to-purple-600 flex items-center justify-center font-semibold text-white flex-shrink-0 overflow-hidden', sizeMap[size], className)}>
      {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : <span>{initials}</span>}
    </div>
  )
}

// Spinner
export function Spinner({ size = 'md', color = 'primary', className }) {
  const sizeMap = { xs: 'w-3 h-3', sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8', xl: 'w-12 h-12' }
  const colorMap = { primary: 'border-[var(--color-primary)]', white: 'border-white', muted: 'border-[var(--color-text-muted)]' }
  return (
    <div className={cn('rounded-full border-2 border-transparent animate-spin', sizeMap[size], colorMap[color], className)}
      style={{ borderTopColor: 'currentColor' }}
    />
  )
}

// Alert
export function Alert({ type = 'info', title, children, className }) {
  const styles = {
    info:    'bg-blue-50 border-blue-200 text-blue-900',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    danger:  'bg-red-50 border-red-200 text-red-900',
  }
  return (
    <div className={cn('rounded-xl border p-4', styles[type] || styles.info, className)}>
      {title && <p className="font-semibold mb-1">{title}</p>}
      <div className="text-sm">{children}</div>
    </div>
  )
}

// Divider
export function Divider({ className, label }) {
  if (label) return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex-1 h-px bg-[var(--color-border)]" />
      <span className="text-xs text-[var(--color-text-muted)] font-medium">{label}</span>
      <div className="flex-1 h-px bg-[var(--color-border)]" />
    </div>
  )
  return <div className={cn('h-px bg-[var(--color-border)] my-4', className)} />
}

// Tab Bar
export function Tabs({ tabs, active, onChange, className }) {
  return (
    <div className={cn('flex gap-1 p-1 rounded-xl bg-[var(--color-surface-2)]', className)}>
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'flex-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-150',
            active === tab.value
              ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-sm'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export * from './Button';
export * from './Input';
export * from './Card';
export * from './Badge';
export * from './ClinicalChart';
