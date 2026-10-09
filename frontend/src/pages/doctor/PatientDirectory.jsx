import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Activity,
  Droplet,
  ChevronRight,
  ShieldAlert,
  RefreshCw,
  UserSearch,
  AlertCircle,
  CheckCircle2,
  Users
} from 'lucide-react'
import { Button, GlassCard } from '../../components/ui'
import { useDoctorStore } from '../../store/doctorStore'

// ── Patient ID Search Section ────────────────────────────────────────────────
function PatientIdSearch() {
  const navigate = useNavigate()
  const { searchPatientById, patientSearchResult, patientSearchLoading, patientSearchError, clearPatientSearch } = useDoctorStore()
  const [inputId, setInputId] = useState('')

  const handleSearch = async (e) => {
    e?.preventDefault()
    if (!inputId.trim()) return
    await searchPatientById(inputId.trim().toUpperCase())
  }

  const handleClear = () => {
    setInputId('')
    clearPatientSearch()
  }

  return (
    <GlassCard className="p-5 border-blue-100/50 dark:border-blue-900/20">
      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
        <UserSearch className="w-4 h-4 text-blue-600" /> Find Patient by ID
      </h3>
      <form onSubmit={handleSearch} className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputId}
            onChange={e => {
              setInputId(e.target.value.toUpperCase())
              clearPatientSearch()
            }}
            placeholder="OH-P-7K4M92"
            aria-label="Enter patient OneHealth ID"
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-mono font-bold text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-normal tracking-wider"
          />
        </div>
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white shrink-0 shadow-md shadow-blue-500/20"
          disabled={patientSearchLoading || !inputId.trim()}
        >
          {patientSearchLoading ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Searching...
            </span>
          ) : 'Search'}
        </Button>
        {(patientSearchResult || patientSearchError) && (
          <Button type="button" variant="ghost" onClick={handleClear} className="text-slate-500 shrink-0">
            Clear
          </Button>
        )}
      </form>

      <AnimatePresence>
        {patientSearchError && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Access Not Granted</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">{patientSearchError}</p>
            </div>
          </motion.div>
        )}

        {patientSearchResult && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black text-sm shrink-0">
                {(patientSearchResult.name || 'P').split(' ').map(n => n[0]).join('').slice(0,2)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-200">{patientSearchResult.name}</h4>
                  <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-black rounded-full uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Consent Active
                  </span>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-mono font-bold">{patientSearchResult.patient_id}</p>
                <div className="flex gap-4 mt-2 text-xs text-emerald-800 dark:text-emerald-300">
                  {patientSearchResult.blood_group && (
                    <span className="flex items-center gap-1">
                      <Droplet className="w-3 h-3" /> {patientSearchResult.blood_group}
                    </span>
                  )}
                  {typeof patientSearchResult.allergies_count === 'number' && (
                    <span>Allergies: {patientSearchResult.allergies_count}</span>
                  )}
                  {typeof patientSearchResult.active_medications_count === 'number' && (
                    <span>Active Meds: {patientSearchResult.active_medications_count}</span>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                onClick={() => navigate(`/doctor/patients/${patientSearchResult.patient_id}`)}
              >
                Open Passport
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  )
}

// ── Patient Card ──────────────────────────────────────────────────────────────
function PatientCard({ patient, cardVariant, onClick }) {
  const risk = (patient.chronic_diseases?.length > 1) ? 'high'
    : (patient.chronic_diseases?.length > 0) ? 'moderate'
    : 'low'
  const initials = (patient.name || 'P').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <motion.div variants={cardVariant} layout>
      <GlassCard
        className="overflow-hidden p-0 group border-none shadow-xl flex flex-col justify-between cursor-pointer"
        onClick={onClick}
      >
        {/* Card Header */}
        <div className="p-6 pb-4 flex justify-between items-start">
          <div className="flex gap-4">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 flex items-center justify-center font-black text-lg shadow-inner"
              >
                {initials}
              </motion.div>
              {risk === 'high' && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-md animate-pulse">
                  <ShieldAlert className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {patient.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono font-bold">
                {patient.patient_id}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {patient.gender} {patient.blood_group && `· ${patient.blood_group}`}
              </p>
            </div>
          </div>
          {/* Consent Active Badge */}
          <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[9px] font-black rounded-full border border-emerald-100 dark:border-emerald-500/20 uppercase tracking-wide flex items-center gap-1 shrink-0">
            <CheckCircle2 className="w-2.5 h-2.5" /> Active
          </span>
        </div>

        {/* Stats Telemetry */}
        <div className="px-6 py-4 border-y border-slate-100 dark:border-slate-800/60 grid grid-cols-3 gap-4 bg-slate-50/40 dark:bg-slate-950/10">
          <div>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Droplet className="w-3 h-3 text-red-500" /> Blood
            </p>
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              {patient.blood_group || '—'}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Activity className="w-3 h-3 text-blue-500" /> Conditions
            </p>
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              {patient.chronic_diseases?.length || 0}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">Allergies</p>
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              {patient.allergies_count || 0}
            </p>
          </div>
        </div>

        {/* Footer Tags */}
        <div className="p-6 pt-4 flex items-center justify-between bg-white/10 dark:bg-slate-900/10">
          <div className="flex gap-1.5 flex-wrap">
            {(patient.chronic_diseases || []).slice(0, 2).map(tag => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400"
              >
                {tag}
              </span>
            ))}
            {!patient.chronic_diseases?.length && (
              <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400">
                Healthy
              </span>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

// ── Main PatientDirectory ──────────────────────────────────────────────────────
export function PatientDirectory() {
  const navigate = useNavigate()
  const { patients, patientsLoading, patientsError, fetchPatients } = useDoctorStore()
  const [searchTerm, setSearchTerm] = useState('')

  const loadPatients = useCallback(() => {
    fetchPatients()
  }, [fetchPatients])

  useEffect(() => {
    loadPatients()
  }, [loadPatients])

  // Client-side filter on top of what backend returns
  const filteredPatients = patients.filter(p => {
    if (!searchTerm.trim()) return true
    const q = searchTerm.toLowerCase()
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.patient_id || '').toLowerCase().includes(q)
    )
  })

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } }
  }

  const cardVariant = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 22 } }
  }

  return (
    <div className="space-y-6 relative z-10">

      {/* Header & Search */}
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1.5">Patient Directory</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
              Patients who have granted you access to their health passport.
            </p>
          </div>

          <div className="flex gap-3 items-center flex-1 max-w-lg">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by name or patient ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Filter patients"
                className="w-full pl-12 pr-4 py-3 bg-[var(--color-surface-2)]/60 dark:bg-slate-800/40 border border-[var(--color-border)] dark:border-slate-700/30 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-[var(--color-text-primary)] font-semibold transition-all"
              />
            </div>
            <button
              onClick={loadPatients}
              aria-label="Refresh patients"
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${patientsLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Patient ID Search */}
      <PatientIdSearch />

      {/* Error State */}
      {patientsError && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400 font-medium">{patientsError}</p>
          <Button
            size="sm"
            variant="outline"
            className="ml-auto text-red-600 border-red-200"
            onClick={loadPatients}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Loading Skeleton */}
      {patientsLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <GlassCard key={i} className="p-6 animate-pulse">
              <div className="flex gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[1,2,3].map(j => <div key={j} className="h-10 bg-slate-100 dark:bg-slate-800 rounded" />)}
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Patient Grid */}
      {!patientsLoading && (
        <>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredPatients.map((patient) => (
                <PatientCard
                  key={patient.patient_id || patient.uid}
                  patient={patient}
                  cardVariant={cardVariant}
                  onClick={() => navigate(`/doctor/patients/${patient.patient_id}`)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredPatients.length === 0 && !patientsError && (
            <div className="py-20 text-center relative z-10">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              {patients.length === 0 ? (
                <>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No Patients Yet</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm">
                    Patients will appear here once they grant you access to their health passport.
                    Share your profile so patients can find and authorize you.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No matches</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm">
                    No patients match your filter. Try a different search term.
                  </p>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
