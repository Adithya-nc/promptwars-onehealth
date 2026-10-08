import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, CheckCircle2, XCircle, Shield, UserCheck,
  Clock, Stethoscope, Building, AlertTriangle, RefreshCw,
  Copy, Check, ChevronRight, ShieldOff, Plus
} from 'lucide-react'
import { GlassCard, Button, Badge } from '../ui'
import consentService from '../../services/consentService'

/**
 * PatientDoctorAccess
 * Patient-side consent management: find doctors, grant/revoke access, view active consents.
 * Integrates with /api/consents and /api/doctor/search endpoints.
 */
export function PatientDoctorAccess() {
  const [tab, setTab] = useState('active') // 'active' | 'find'
  const [consents, setConsents] = useState([])
  const [consentsLoading, setConsentsLoading] = useState(false)
  const [consentsError, setConsentsError] = useState(null)

  // Doctor search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchDone, setSearchDone] = useState(false)

  // Grant/revoke action state
  const [actionLoading, setActionLoading] = useState({})
  const [actionMessages, setActionMessages] = useState({})

  // Revoke confirmation
  const [revokeTarget, setRevokeTarget] = useState(null)

  const loadConsents = useCallback(async () => {
    setConsentsLoading(true)
    setConsentsError(null)
    try {
      const data = await consentService.getMyConsents()
      setConsents(data.consents || [])
    } catch (err) {
      setConsentsError('Failed to load your doctor connections.')
    } finally {
      setConsentsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadConsents()
  }, [loadConsents])

  const loadInitialDoctors = useCallback(async () => {
    setSearchLoading(true)
    try {
      const data = await consentService.searchDoctors(searchQuery.trim())
      setSearchResults(data.doctors || [])
      setSearchDone(true)
    } catch {
      setSearchResults([])
      setSearchDone(true)
    } finally {
      setSearchLoading(false)
    }
  }, [searchQuery])

  useEffect(() => {
    if (tab === 'find') {
      loadInitialDoctors()
    }
  }, [tab, loadInitialDoctors])

  const handleSearch = async (e) => {
    e?.preventDefault()
    setSearchLoading(true)
    setSearchDone(false)
    try {
      const data = await consentService.searchDoctors(searchQuery.trim())
      setSearchResults(data.doctors || [])
      setSearchDone(true)
    } catch {
      setSearchResults([])
      setSearchDone(true)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleGrantConsent = async (doctorUid, doctorName) => {
    setActionLoading(prev => ({ ...prev, [doctorUid]: true }))
    setActionMessages(prev => ({ ...prev, [doctorUid]: null }))
    try {
      await consentService.grantConsent(doctorUid)
      setActionMessages(prev => ({
        ...prev, [doctorUid]: { type: 'success', text: `Access granted to ${doctorName}` }
      }))
      await loadConsents()
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Failed to grant access.'
      setActionMessages(prev => ({ ...prev, [doctorUid]: { type: 'error', text: msg } }))
    } finally {
      setActionLoading(prev => ({ ...prev, [doctorUid]: false }))
    }
  }

  const handleRevokeConsent = async (consentId, doctorName) => {
    setActionLoading(prev => ({ ...prev, [consentId]: true }))
    try {
      await consentService.revokeConsent(consentId)
      setActionMessages(prev => ({
        ...prev, [consentId]: { type: 'success', text: `Access revoked from ${doctorName}` }
      }))
      await loadConsents()
      setRevokeTarget(null)
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Failed to revoke access.'
      setActionMessages(prev => ({ ...prev, [consentId]: { type: 'error', text: msg } }))
    } finally {
      setActionLoading(prev => ({ ...prev, [consentId]: false }))
    }
  }

  // Check if a doctor already has active consent
  const getDoctorConsentStatus = (doctorUid) => {
    return consents.find(
      c => c.doctor?.uid === doctorUid || c.doctor_uid === doctorUid
    )
  }

  const activeConsents = consents.filter(c => c.status === 'active')
  const historyConsents = consents.filter(c => c.status !== 'active')

  const tabs = [
    { id: 'active', label: 'Active Access', count: activeConsents.length },
    { id: 'find', label: 'Find Doctor', count: null },
    { id: 'history', label: 'History', count: historyConsents.length },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Doctor Access</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Control which doctors can view your health passport
            </p>
          </div>
          <button
            onClick={loadConsents}
            className="ml-auto p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
            aria-label="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${consentsLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-5 p-1 bg-slate-100/60 dark:bg-slate-800/40 rounded-xl">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                tab === t.id
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {t.label}
              {t.count !== null && t.count > 0 && (
                <span className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-black ${
                  tab === t.id ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </GlassCard>

      <AnimatePresence mode="wait">
        {/* ── ACTIVE CONSENTS ───────────────────────────────────────── */}
        {tab === 'active' && (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
          >
            {consentsError && (
              <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl text-sm text-red-700 dark:text-red-400">
                {consentsError}
              </div>
            )}

            {consentsLoading ? (
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <GlassCard key={i} className="p-5">
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-2/3" />
                    </div>
                  </GlassCard>
                ))}
              </div>
            ) : activeConsents.length === 0 ? (
              <GlassCard className="p-10 text-center">
                <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-slate-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">No Active Doctor Access</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
                  No doctors currently have access to your health passport.
                </p>
                <Button onClick={() => setTab('find')} className="bg-blue-600 hover:bg-blue-700 text-white mx-auto">
                  <Plus className="w-4 h-4 mr-2" /> Find a Doctor
                </Button>
              </GlassCard>
            ) : (
              activeConsents.map(consent => (
                <ConsentCard
                  key={consent.id}
                  consent={consent}
                  actionLoading={actionLoading}
                  actionMessages={actionMessages}
                  onRevoke={() => setRevokeTarget(consent)}
                />
              ))
            )}
          </motion.div>
        )}

        {/* ── FIND DOCTOR ───────────────────────────────────────────── */}
        {tab === 'find' && (
          <motion.div
            key="find"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
          >
            <GlassCard className="p-5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-blue-600" /> Find a Doctor
              </h3>
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by name, specialisation, or hospital..."
                    aria-label="Search doctors"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
                  disabled={searchLoading || !searchQuery.trim()}
                >
                  {searchLoading ? 'Searching...' : 'Search'}
                </Button>
              </form>
            </GlassCard>

            {searchDone && (
              <AnimatePresence>
                {searchResults.length === 0 ? (
                  <GlassCard className="p-8 text-center">
                    <Search className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 dark:text-slate-400 font-medium">No doctors found for "{searchQuery}"</p>
                  </GlassCard>
                ) : (
                  <div className="space-y-3">
                    {searchResults.map(doctor => {
                      const existingConsent = getDoctorConsentStatus(doctor.uid)
                      const isGranted = existingConsent?.status === 'active'
                      const msgKey = doctor.uid
                      return (
                        <motion.div
                          key={doctor.uid}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <GlassCard className="p-5">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/20 flex items-center justify-center font-black text-base text-blue-700 dark:text-blue-300 shrink-0">
                                {doctor.name.split(' ').filter(n => n.startsWith('Dr') ? false : true).map(n => n[0]).join('').slice(0, 2)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-bold text-slate-900 dark:text-white">Dr. {doctor.name.replace(/^Dr\.?\s*/i, '')}</h4>
                                  {doctor.verified && (
                                    <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" /> Verified
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                  {doctor.specialisation} • {doctor.hospital}
                                </p>
                                {doctor.bio && (
                                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 leading-relaxed line-clamp-2">{doctor.bio}</p>
                                )}
                                {actionMessages[msgKey] && (
                                  <p className={`text-xs mt-2 font-medium ${
                                    actionMessages[msgKey].type === 'success' ? 'text-emerald-600' : 'text-red-600'
                                  }`}>
                                    {actionMessages[msgKey].text}
                                  </p>
                                )}
                              </div>
                              <div className="shrink-0">
                                {isGranted ? (
                                  <span className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-xl border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Access Active
                                  </span>
                                ) : (
                                  <Button
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    onClick={() => handleGrantConsent(doctor.uid, doctor.name)}
                                    disabled={actionLoading[doctor.uid]}
                                  >
                                    {actionLoading[doctor.uid] ? 'Granting...' : 'Grant Access'}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </GlassCard>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </AnimatePresence>
            )}
          </motion.div>
        )}

        {/* ── HISTORY ───────────────────────────────────────────────── */}
        {tab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-3"
          >
            {historyConsents.length === 0 ? (
              <GlassCard className="p-8 text-center">
                <p className="text-slate-500 dark:text-slate-400">No access history yet.</p>
              </GlassCard>
            ) : (
              historyConsents.map(consent => (
                <GlassCard key={consent.id} className="p-4 opacity-70">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <ShieldOff className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-700 dark:text-slate-300">
                        {consent.doctor?.name || 'Unknown Doctor'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {consent.doctor?.specialisation} · {consent.doctor?.hospital}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      {consent.status}
                    </span>
                  </div>
                </GlassCard>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Revoke Confirmation Dialog ──────────────────────────────── */}
      <AnimatePresence>
        {revokeTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="revoke-dialog-title"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 id="revoke-dialog-title" className="text-lg font-bold text-slate-900 dark:text-white text-center mb-2">
                Revoke Access?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
                Revoke access from <strong>{revokeTarget.doctor?.name}</strong>?
                The doctor will immediately lose access to your health passport.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setRevokeTarget(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleRevokeConsent(revokeTarget.id, revokeTarget.doctor?.name)}
                  disabled={actionLoading[revokeTarget.id]}
                >
                  {actionLoading[revokeTarget.id] ? 'Revoking...' : 'Revoke Access'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── ConsentCard ───────────────────────────────────────────────────────────────
function ConsentCard({ consent, actionLoading, actionMessages, onRevoke }) {
  const doctor = consent.doctor || {}
  const grantedDate = consent.granted_at
    ? new Date(consent.granted_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—'

  return (
    <GlassCard className="p-5">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/20 flex items-center justify-center font-black text-base text-blue-700 dark:text-blue-300 shrink-0">
          {(doctor.name || 'DR').split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-slate-900 dark:text-white">{doctor.name || 'Unknown Doctor'}</h4>
            {doctor.verified && (
              <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verified
              </span>
            )}
            <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[10px] font-bold rounded-full flex items-center gap-1">
              <Shield className="w-3 h-3" /> Active
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {doctor.specialisation} · {doctor.hospital}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Access granted: {grantedDate}
          </p>
          {actionMessages[consent.id] && (
            <p className={`text-xs mt-2 font-medium ${
              actionMessages[consent.id]?.type === 'success' ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {actionMessages[consent.id]?.text}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 text-red-600 border-red-200 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10"
          onClick={onRevoke}
          disabled={actionLoading[consent.id]}
          aria-label={`Revoke access from ${doctor.name}`}
        >
          {actionLoading[consent.id] ? 'Revoking...' : 'Revoke'}
        </Button>
      </div>
    </GlassCard>
  )
}
