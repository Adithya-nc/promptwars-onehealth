import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Fingerprint } from 'lucide-react'

/**
 * PatientIdCard
 * Displays the patient's OneHealth ID with a copy button.
 * The ID is immutable and read-only.
 */
export function PatientIdCard({ patientId, compact = false }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!patientId) return
    try {
      await navigator.clipboard.writeText(patientId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement('textarea')
      el.value = patientId
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!patientId) return null

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Fingerprint className="w-4 h-4 text-blue-500 shrink-0" />
        <span className="font-mono font-bold text-sm text-slate-700 dark:text-slate-200 tracking-wider">
          {patientId}
        </span>
        <button
          onClick={handleCopy}
          aria-label="Copy Patient ID"
          className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          {copied
            ? <Check className="w-3.5 h-3.5 text-emerald-500" />
            : <Copy className="w-3.5 h-3.5" />
          }
        </button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/30 rounded-2xl"
    >
      <div className="flex items-center gap-2 mb-1">
        <Fingerprint className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          OneHealth Patient ID
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-mono font-black text-xl text-slate-900 dark:text-white tracking-widest">
          {patientId}
        </span>
        <button
          onClick={handleCopy}
          aria-label="Copy Patient ID"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            copied
              ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
              : 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-500/20'
          }`}
        >
          {copied
            ? <><Check className="w-3.5 h-3.5" /> Copied!</>
            : <><Copy className="w-3.5 h-3.5" /> Copy</>
          }
        </button>
      </div>
      <p className="text-[10px] text-blue-400 dark:text-blue-500 mt-1.5">
        Share this ID with your doctor to grant secure access
      </p>
    </motion.div>
  )
}
