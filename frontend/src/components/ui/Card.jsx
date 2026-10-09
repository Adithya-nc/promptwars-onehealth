import { forwardRef, useRef } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { cn } from '../../utils/formatters'

export const Card = forwardRef(({ className, hover = false, glass = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-2xl border bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border-slate-200/80 dark:border-slate-800/80 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.3)] transition-all duration-200 relative overflow-hidden',
      hover && 'hover:shadow-[0_12px_32px_-4px_rgba(13,148,136,0.12)] hover:border-teal-500/30 hover:-translate-y-0.5 cursor-pointer',
      glass && 'glass',
      className
    )}
    {...props}
  />
))
Card.displayName = 'Card'

export const GlassCard = forwardRef(({ className, children, hoverGlow = true, ...props }, ref) => {
  const localRef = useRef(null)
  const activeRef = ref || localRef

  // Mouse hover 3D tilt metrics
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-200, 200], [6, -6])
  const rotateY = useTransform(x, [-200, 200], [-6, 6])

  const handleMouseMove = (e) => {
    if (!activeRef.current) return
    const rect = activeRef.current.getBoundingClientRect()
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

  return (
    <motion.div
      ref={activeRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      whileHover={{
        scale: 1.015,
        translateY: -3,
        z: 15,
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={cn(
        'rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.25)] relative overflow-hidden transition-all duration-300 hover:border-teal-500/40 dark:hover:border-teal-400/30',
        hoverGlow && 'hover:shadow-[0_16px_40px_-6px_rgba(13,148,136,0.14),0_0_0_1px_rgba(13,148,136,0.15)]',
        className
      )}
      {...props}
    >
      {/* Specular clinical top-edge reflection */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent dark:from-white/10 pointer-events-none" 
        style={{ transform: 'translateZ(2px)' }}
      />
      {/* Subtle surgical ambient flare on hover */}
      <div 
        className="absolute -inset-1 bg-gradient-to-r from-transparent via-teal-500/10 dark:via-teal-400/10 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 pointer-events-none" 
        style={{ transform: 'translateZ(-1px)' }}
      />
      <div className="relative z-10" style={{ transform: 'translateZ(10px)' }}>
        {children}
      </div>
    </motion.div>
  )
})
GlassCard.displayName = 'GlassCard'

export const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
))
CardHeader.displayName = 'CardHeader'

export const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight text-[var(--color-text-primary)]', className)} {...props} />
))
CardTitle.displayName = 'CardTitle'

export const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-[var(--color-text-secondary)]', className)} {...props} />
))
CardDescription.displayName = 'CardDescription'

export const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
))
CardFooter.displayName = 'CardFooter'
