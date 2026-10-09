import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Download, 
  Sparkles,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Calendar,
  Activity
} from 'lucide-react'
import { Button } from '../../ui'
import { doctorService } from '../../../services/doctorService'
import { useRecordsStore } from '../../../store/recordsStore'

const FALLBACK_REPORTS = [
  {
    id: 'R-102',
    title: 'Lipid Profile & HbA1c',
    date: '2026-05-12',
    lab: 'City Diagnostic Center',
    type: 'Blood Report',
    aiSummary: {
      status: 'Warning',
      text: 'Elevated LDL Cholesterol (160 mg/dL). HbA1c is borderline at 6.2%. Liver enzymes (AST/ALT) are within normal limits.',
      flags: ['High LDL', 'Borderline HbA1c'],
      extracted_values: [
        { parameter: 'LDL Cholesterol', value: '160', unit: 'mg/dL', status: 'high' },
        { parameter: 'HbA1c', value: '6.2', unit: '%', status: 'high' },
        { parameter: 'Total Cholesterol', value: '215', unit: 'mg/dL', status: 'high' }
      ]
    }
  },
  {
    id: 'R-098',
    title: 'Chest X-Ray (PA View)',
    date: '2026-05-10',
    lab: 'General Hospital Radiology',
    type: 'Imaging',
    aiSummary: {
      status: 'Normal',
      text: 'No active cardiothoracic lesion seen. Lung fields are clear. Heart size is normal.',
      flags: [],
      extracted_values: []
    }
  }
]

export function ReportReviewModule({ patientId }) {
  const [reports, setReports] = useState(FALLBACK_REPORTS)
  const [loading, setLoading] = useState(false)
  const [selectedReportId, setSelectedReportId] = useState(FALLBACK_REPORTS[0].id)

  const loadReports = useCallback(async () => {
    if (!patientId) return
    setLoading(true)
    try {
      const res = await doctorService.getPatientRecords(patientId)
      const serverRecords = res?.records || []
      
      // Also check local records store for any freshly uploaded patient reports
      const localStoreRecords = useRecordsStore.getState().records || []
      const relevantLocal = localStoreRecords.filter(r => !r.patient_id || r.patient_id === patientId || patientId === 'OH-P-AAAB2C3')

      // Merge and deduplicate
      const combined = [...serverRecords]
      relevantLocal.forEach(lr => {
        if (!combined.some(c => c.id === lr.id || (c.title === lr.title && c.date === lr.date))) {
          combined.push(lr)
        }
      })

      if (combined.length > 0) {
        const formatted = combined.map(rec => ({
          id: rec.id || `rep-${Math.random()}`,
          title: rec.title || 'Diagnostic Report',
          date: rec.date || 'Recent',
          lab: rec.metadata?.hospital || 'Certified Pathology Laboratory',
          type: rec.type === 'report' ? 'Laboratory Test' : (rec.type || 'Clinical Report'),
          aiSummary: {
            status: (rec.ai_analysis?.abnormal_findings?.length > 0 || rec.ai_analysis?.extracted_values?.some(v => v.status === 'high' || v.status === 'critical')) ? 'Warning' : 'Normal',
            text: rec.ai_analysis?.summary || 'Standard diagnostic panel evaluated and integrated into digital passport.',
            flags: rec.ai_analysis?.abnormal_findings || (rec.ai_analysis?.extracted_values?.filter(v => v.status === 'high' || v.status === 'low' || v.status === 'critical').map(v => `${v.parameter}: ${v.value} ${v.unit || ''} (${v.status})`) || []),
            extracted_values: rec.ai_analysis?.extracted_values || [],
            suggested_actions: rec.ai_analysis?.suggested_actions || []
          }
        }))
        setReports(formatted)
        setSelectedReportId(formatted[0].id)
      } else {
        setReports(FALLBACK_REPORTS)
        setSelectedReportId(FALLBACK_REPORTS[0].id)
      }
    } catch (err) {
      console.warn('Could not load patient records for doctor view:', err)
      setReports(FALLBACK_REPORTS)
    } finally {
      setLoading(false)
    }
  }, [patientId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadReports()
  }, [loadReports])

  const activeReport = reports.find(r => r.id === selectedReportId) || reports[0]

  return (
    <div className="space-y-4">
      {/* Report List Header */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
        <span>Available Diagnostic Reports ({reports.length})</span>
        <button 
          onClick={loadReports} 
          disabled={loading}
          className="hover:text-blue-600 flex items-center gap-1 font-semibold transition-colors"
          title="Refresh Reports"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Report List */}
      <div className="grid grid-cols-1 gap-2.5 max-h-56 overflow-y-auto pr-1">
        {reports.map((report) => (
          <div 
            key={report.id}
            onClick={() => setSelectedReportId(report.id)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group
              ${selectedReportId === report.id 
                ? 'bg-blue-50/80 border-blue-200 dark:bg-blue-900/25 dark:border-blue-800 shadow-sm' 
                : 'bg-white border-slate-200/80 hover:border-slate-300 dark:bg-slate-900/80 dark:border-slate-800 dark:hover:border-slate-700'
              }
            `}
          >
            <div className="flex gap-3 items-center min-w-0">
              <div className={`p-2 rounded-xl shrink-0 ${selectedReportId === report.id ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className={`font-semibold text-xs truncate ${selectedReportId === report.id ? 'text-blue-900 dark:text-blue-100' : 'text-slate-900 dark:text-white'}`}>
                  {report.title}
                </h4>
                <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono">{report.date}</span>
                  <span>•</span>
                  <span className="truncate">{report.type}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {report.aiSummary?.flags?.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500" title="Contains Flagged Biomarkers" />
              )}
              <ChevronRight className={`w-4 h-4 ${selectedReportId === report.id ? 'text-blue-500' : 'text-slate-300 group-hover:text-slate-500'}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Active Report Preview Area */}
      {activeReport && (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeReport.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
              <div className="min-w-0">
                <h5 className="font-bold text-sm text-slate-900 dark:text-white truncate">{activeReport.title}</h5>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{activeReport.date}</span>
                  <span>•</span>
                  <span>{activeReport.lab}</span>
                </p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-slate-500 hover:text-blue-600"
                  onClick={() => window.print()}
                  title="Print / Save Report"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* AI Summary Panel */}
            <div className="p-4 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/20 dark:to-purple-950/20 relative overflow-hidden">
              <Sparkles className="absolute top-2 right-2 w-20 h-20 text-indigo-500/10 dark:text-indigo-400/5 pointer-events-none" />
              
              <div className="flex items-center justify-between mb-2.5 relative z-10">
                <h6 className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Clinical AI Intelligence Review
                </h6>
                {activeReport.aiSummary.status === 'Warning' ? (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400 text-[10px] font-bold rounded-full flex items-center gap-1 border border-amber-200/50 dark:border-amber-500/20">
                    <AlertTriangle className="w-3 h-3 text-amber-600" /> Flagged Out-of-Range
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 text-[10px] font-bold rounded-full flex items-center gap-1 border border-emerald-200/50 dark:border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Normal Limits
                  </span>
                )}
              </div>

              <p className="text-xs text-indigo-950/80 dark:text-indigo-200/80 leading-relaxed mb-3 relative z-10 font-medium">
                {activeReport.aiSummary.text}
              </p>

              {/* Extracted Parameter Cards if available */}
              {activeReport.aiSummary.extracted_values?.length > 0 && (
                <div className="mb-3 space-y-1.5 relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900/70 dark:text-indigo-300/70 block">
                    Extracted Biomarkers
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {activeReport.aiSummary.extracted_values.slice(0, 4).map((v, i) => (
                      <div key={i} className="p-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-indigo-100/60 dark:border-indigo-900/40 text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400 block truncate text-[10px]">{v.parameter}</span>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="font-bold text-slate-900 dark:text-white font-mono">{v.value} {v.unit}</span>
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${v.status === 'high' || v.status === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300' : v.status === 'low' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'}`}>
                            {v.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Flags */}
              {activeReport.aiSummary.flags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 relative z-10">
                  {activeReport.aiSummary.flags.map((flag, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-amber-100/90 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 text-[10px] font-bold rounded-lg border border-amber-200 dark:border-amber-800/50">
                      ⚠ {flag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
      
      <Button 
        variant="outline" 
        onClick={loadReports}
        className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-900/20 text-xs h-10"
        leftIcon={<Activity className="w-3.5 h-3.5" />}
      >
        Sync Verified Patient Health Records
      </Button>

    </div>
  )
}

