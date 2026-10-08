import React from 'react'
import { motion } from 'framer-motion'
import {
  Stethoscope,
  Pill,
  FileText,
  Syringe,
  Building,
  ChevronDown,
  RefreshCw,
  Calendar
} from 'lucide-react'
import { Button } from '../../ui'

// Map entry type strings to icons and colors
const TYPE_CONFIG = {
  Consultation: { icon: Stethoscope, color: 'bg-blue-500 text-white', ring: 'ring-blue-100 dark:ring-blue-900/30' },
  Report: { icon: FileText, color: 'bg-indigo-500 text-white', ring: 'ring-indigo-100 dark:ring-indigo-900/30' },
  Prescription: { icon: Pill, color: 'bg-emerald-500 text-white', ring: 'ring-emerald-100 dark:ring-emerald-900/30' },
  Vaccination: { icon: Syringe, color: 'bg-amber-500 text-white', ring: 'ring-amber-100 dark:ring-amber-900/30' },
  'Hospital Visit': { icon: Building, color: 'bg-red-500 text-white', ring: 'ring-red-100 dark:ring-red-900/30' },
}

function getConfig(type) {
  return TYPE_CONFIG[type] || TYPE_CONFIG['Consultation']
}

/**
 * MedicalTimeline
 * @param {Array} entries - Timeline entries from API or empty for loading state
 * @param {boolean} loading - Whether data is still loading
 */
export function MedicalTimeline({ entries = null, loading = false }) {
  // If no entries prop passed, use built-in mock data (for backwards compatibility)
  const data = entries !== null ? entries : BUILTIN_MOCK

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
            </div>
          </div>
        ))}
        <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-3 h-3 animate-spin" /> Loading timeline...
        </p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No timeline entries yet</p>
      </div>
    )
  }

  return (
    <div className="relative pl-4 sm:pl-0">
      {/* Vertical Line */}
      <div className="absolute left-4 sm:left-32 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-800" />

      <div className="space-y-8">
        {data.map((item, index) => {
          const config = getConfig(item.type)
          const Icon = config.icon
          const displayDate = item.date
            ? new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
            : '—'

          return (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, x: -30, y: 15 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 90,
                damping: 12,
                delay: index * 0.08
              }}
              className="relative sm:flex items-start group"
            >
              {/* Date (Desktop) */}
              <div className="hidden sm:block w-28 shrink-0 text-right pr-6 pt-2">
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{displayDate}</span>
              </div>

              {/* Node */}
              <div className={`absolute left-0 sm:relative sm:left-auto w-8 h-8 rounded-full ${config.color} flex items-center justify-center ring-8 ${config.ring} shadow-sm z-10 shrink-0 mt-1`}>
                <Icon className="w-4 h-4" />
              </div>

              {/* Content Card */}
              <div className="ml-12 sm:ml-6 flex-1">
                <motion.div
                  whileHover={{
                    scale: 1.02,
                    translateY: -3,
                    boxShadow: '0 20px 40px rgba(59, 130, 246, 0.1)'
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="bg-white/55 hover:bg-white/80 dark:bg-slate-900/55 dark:hover:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/50 transition-colors shadow-sm cursor-pointer relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{item.type}</span>
                      <span className="sm:hidden text-xs font-medium text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 rounded-full">{displayDate}</span>
                    </div>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{item.doctor || item.hospital || ''}</span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.description || item.desc}</p>

                  {item.status && item.status !== 'normal' && (
                    <span className={`inline-flex items-center mt-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'attention'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                        : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                    }`}>
                      {item.status}
                    </span>
                  )}

                  {/* Expand indicator */}
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details <ChevronDown className="w-3 h-3" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-8 text-center sm:pl-32">
        <Button variant="outline" className="text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 w-full sm:w-auto">
          Load Older Records
        </Button>
      </div>
    </div>
  )
}

// Fallback data when no entries prop is provided (backwards compatibility)
const BUILTIN_MOCK = [
  {
    id: 1,
    date: '2026-05-10',
    type: 'Consultation',
    title: 'General Checkup',
    doctor: 'Dr. Sarah Smith',
    description: 'Patient reported mild chest pain. Recommended ECG and blood work.',
  },
  {
    id: 2,
    date: '2026-05-12',
    type: 'Report',
    title: 'ECG & Lipid Profile',
    doctor: 'City Lab',
    description: 'ECG normal. Elevated LDL cholesterol (160 mg/dL).',
  },
  {
    id: 3,
    date: '2026-05-14',
    type: 'Prescription',
    title: 'Cholesterol Management',
    doctor: 'Dr. Sarah Smith',
    description: 'Prescribed Atorvastatin 20mg daily. Diet modification advised.',
  },
]
