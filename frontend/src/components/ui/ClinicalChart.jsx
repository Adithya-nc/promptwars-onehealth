import { motion } from 'framer-motion'

/**
 * ClinicalChartGradients
 * Injects rich, medical-grade multi-stop gradients for Recharts Area / Line / Bar charts.
 */
export function ClinicalChartGradients({ idPrefix = 'clinical' }) {
  return (
    <defs>
      {/* Primary Surgical Blue */}
      <linearGradient id={`${idPrefix}-blue`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2563EB" stopOpacity={0.45} />
        <stop offset="60%" stopColor="#2563EB" stopOpacity={0.12} />
        <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
      </linearGradient>

      {/* Surgical Teal */}
      <linearGradient id={`${idPrefix}-teal`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0D9488" stopOpacity={0.45} />
        <stop offset="60%" stopColor="#0D9488" stopOpacity={0.12} />
        <stop offset="100%" stopColor="#0D9488" stopOpacity={0} />
      </linearGradient>

      {/* Hospital Emerald */}
      <linearGradient id={`${idPrefix}-emerald`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#10B981" stopOpacity={0.45} />
        <stop offset="60%" stopColor="#10B981" stopOpacity={0.12} />
        <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
      </linearGradient>

      {/* Critical / Acute Red */}
      <linearGradient id={`${idPrefix}-red`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EF4444" stopOpacity={0.45} />
        <stop offset="60%" stopColor="#EF4444" stopOpacity={0.12} />
        <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
      </linearGradient>

      {/* Amber Warning */}
      <linearGradient id={`${idPrefix}-amber`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.45} />
        <stop offset="60%" stopColor="#F59E0B" stopOpacity={0.12} />
        <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
      </linearGradient>

      {/* Hospital Cyan */}
      <linearGradient id={`${idPrefix}-cyan`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0284C7" stopOpacity={0.45} />
        <stop offset="60%" stopColor="#0284C7" stopOpacity={0.12} />
        <stop offset="100%" stopColor="#0284C7" stopOpacity={0} />
      </linearGradient>
    </defs>
  )
}

/**
 * ClinicalTooltip
 * Frosted acrylic medical telemetry tooltip for Recharts.
 */
export function ClinicalTooltip({ active, payload, label, unit = '', title }) {
  if (!active || !payload || !payload.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="rounded-xl border border-white/20 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-3.5 shadow-2xl min-w-[170px]"
      style={{
        boxShadow: '0 10px 30px -5px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.4) inset',
      }}
    >
      {/* Header telemetry info */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800/80 pb-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
          </span>
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
            {title || 'Telemetry Log'}
          </span>
        </div>
        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 font-mono">
          {label}
        </span>
      </div>

      {/* Metrics Payload */}
      <div className="space-y-1.5">
        {payload.map((item, idx) => {
          const itemColor = item.color || item.fill || '#2563EB'
          const itemUnit = item.unit || unit || ''

          return (
            <div key={idx} className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shadow-sm flex-shrink-0"
                  style={{
                    backgroundColor: itemColor,
                    boxShadow: `0 0 8px ${itemColor}80`,
                  }}
                />
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  {item.name}
                </span>
              </div>
              <span className="font-black font-mono text-slate-900 dark:text-white">
                {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                {itemUnit && <span className="text-[10px] text-slate-400 font-sans font-normal ml-0.5">{itemUnit}</span>}
              </span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
