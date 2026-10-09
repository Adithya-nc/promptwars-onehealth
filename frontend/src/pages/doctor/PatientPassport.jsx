import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  PhoneCall,
  AlertTriangle,
  Pill,
  Activity,
  FileText,
  Calendar,
  RefreshCw,
  ShieldOff,
  UserX,
  Stethoscope,
  CheckCircle2
} from 'lucide-react'
import { GlassCard, Button, Badge } from '../../components/ui'
import { MedicalTimeline } from '../../components/doctor/passport/MedicalTimeline'
import { ReportReviewModule } from '../../components/doctor/passport/ReportReviewModule'
import { PatientIdCard } from '../../components/ui/PatientIdCard'
import { useDoctorStore, useConsultationStore } from '../../store/doctorStore'
import { useRecordsStore } from '../../store/recordsStore'
import doctorService from '../../services/doctorService'

const COMMON_DRUGS = [
  { name: 'Paracetamol 650mg', dosage: '1 tablet', freq: 'thrice_daily', days: 5, instr: 'Take after meals for fever or pain' },
  { name: 'Amoxicillin 500mg', dosage: '1 capsule', freq: 'twice_daily', days: 7, instr: 'Complete full 7-day antibiotic course' },
  { name: 'Pantoprazole 40mg', dosage: '1 tablet', freq: 'once_daily', days: 14, instr: 'Take on empty stomach 30 mins before breakfast' },
  { name: 'Azithromycin 500mg', dosage: '1 tablet', freq: 'once_daily', days: 5, instr: 'Take once daily at the same time' },
  { name: 'Cetirizine 10mg', dosage: '1 tablet', freq: 'once_daily', days: 5, instr: 'Take at bedtime for allergic symptoms' },
  { name: 'Metformin 500mg', dosage: '1 tablet', freq: 'twice_daily', days: 30, instr: 'Take with main meals' }
]

export function PatientPassport() {
  const { id } = useParams()  // id = OneHealth Patient ID (OH-P-XXXXX)
  const navigate = useNavigate()

  const {
    selectedPatient,
    selectedPatientLoading,
    selectedPatientError,
    fetchPatientPassport,
    clearSelectedPatient
  } = useDoctorStore()

  const { setActivePatient } = useConsultationStore()

  // Timeline state
  const [timeline, setTimeline] = useState([])
  const [timelineLoading, setTimelineLoading] = useState(false)

  // Medications state
  const [medications, setMedications] = useState([])
  const [medsLoading, setMedsLoading] = useState(false)

  // Prescription Form State
  const [showPrescribeModal, setShowPrescribeModal] = useState(false)
  const [prescribing, setPrescribing] = useState(false)
  const [prescribeMsg, setPrescribeMsg] = useState(null)
  const [prescriptionForm, setPrescriptionForm] = useState({
    name: '',
    dosage: '1 tablet',
    frequency: 'twice_daily',
    timing: ['08:00', '20:00'],
    days: 7,
    instructions: 'Take with food and water.'
  })

  const loadTimeline = useCallback(async (patientId) => {
    setTimelineLoading(true)
    try {
      const data = await doctorService.getPatientTimeline(patientId)
      const serverTimeline = data.timeline || []

      // Also merge any local records from recordsStore if patient has uploaded them
      const localStoreRecords = useRecordsStore.getState().records || []
      const relevantLocal = localStoreRecords.filter(r => !r.patient_id || r.patient_id === patientId || patientId === 'OH-P-AAAB2C3')
      const combined = [...serverTimeline]
      relevantLocal.forEach(lr => {
        const tlId = `tl-${lr.id}`
        if (!combined.some(c => c.id === tlId || (c.title === lr.title && c.date?.startsWith(lr.date)))) {
          combined.push({
            id: tlId,
            type: lr.type === 'report' ? 'Report' : (lr.type?.charAt(0).toUpperCase() + lr.type?.slice(1) || 'Report'),
            title: lr.title,
            date: lr.date,
            doctor: lr.metadata?.doctor_name || 'oneHealth AI',
            hospital: lr.metadata?.hospital || 'Clinical Diagnostic Lab',
            description: lr.ai_analysis?.summary || lr.metadata?.notes || 'Patient uploaded health record.',
            status: lr.ai_analysis?.abnormal_findings?.length > 0 ? 'attention' : 'normal'
          })
        }
      })
      combined.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      setTimeline(combined)
    } catch {
      setTimeline([])
    } finally {
      setTimelineLoading(false)
    }
  }, [])

  const loadMedications = useCallback(async (patientId) => {
    setMedsLoading(true)
    try {
      const data = await doctorService.getPatientMedications(patientId)
      setMedications(data.medications || [])
    } catch {
      setMedications([])
    } finally {
      setMedsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (id) {
      fetchPatientPassport(id)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadTimeline(id)
      loadMedications(id)
    }
    return () => clearSelectedPatient()
  }, [id, fetchPatientPassport, clearSelectedPatient, loadTimeline, loadMedications])

  const handleStartConsultation = () => {
    if (selectedPatient) {
      setActivePatient(selectedPatient.patient_id, selectedPatient)
      navigate(`/doctor/consultation/${selectedPatient.patient_id}`)
    }
  }

  const handleSelectPreset = (drug) => {
    setPrescriptionForm({
      name: drug.name,
      dosage: drug.dosage,
      frequency: drug.freq,
      timing: drug.freq === 'once_daily' ? ['09:00'] : drug.freq === 'twice_daily' ? ['08:00', '20:00'] : ['08:00', '14:00', '20:00'],
      days: drug.days,
      instructions: drug.instr
    })
  }

  const handlePrescribeSubmit = async (e) => {
    e.preventDefault()
    if (!prescriptionForm.name.trim()) return
    setPrescribing(true)
    setPrescribeMsg(null)
    try {
      const res = await doctorService.prescribeMedication({
        patient_id: id,
        name: prescriptionForm.name.trim(),
        dosage: prescriptionForm.dosage,
        frequency: prescriptionForm.frequency,
        timing: prescriptionForm.timing,
        days: Number(prescriptionForm.days) || 7,
        instructions: prescriptionForm.instructions
      })

      if (res.medication) {
        setMedications(prev => [res.medication, ...prev])
      }
      setPrescribeMsg({ type: 'success', text: `Prescribed ${prescriptionForm.name} successfully.` })
      setPrescriptionForm({
        name: '',
        dosage: '1 tablet',
        frequency: 'twice_daily',
        timing: ['08:00', '20:00'],
        days: 7,
        instructions: 'Take with food and water.'
      })
      loadTimeline(id)
      setTimeout(() => setPrescribeMsg(null), 4000)
    } catch (err) {
      setPrescribeMsg({
        type: 'error',
        text: err.response?.data?.error?.message || 'Failed to issue prescription.'
      })
    } finally {
      setPrescribing(false)
    }
  }

  // ── Loading State ──────────────────────────────────────────────────────────
  if (selectedPatientLoading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="text-slate-500" onClick={() => navigate('/doctor/patients')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
          </Button>
        </div>
        <GlassCard className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="flex gap-6 items-center">
              <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="space-y-3 flex-1">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/4" />
              </div>
            </div>
          </div>
          <p className="text-center text-slate-500 mt-6 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" /> Loading patient passport...
          </p>
        </GlassCard>
      </div>
    )
  }

  // ── Error / Access Denied State ────────────────────────────────────────────
  if (selectedPatientError) {
    const isConsentError = selectedPatientError.toLowerCase().includes('consent')
      || selectedPatientError.toLowerCase().includes('access')
      || selectedPatientError.toLowerCase().includes('denied')

    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <Button variant="ghost" className="text-slate-500" onClick={() => navigate('/doctor/patients')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
        </Button>
        <GlassCard className="p-12 text-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
            isConsentError
              ? 'bg-amber-50 dark:bg-amber-500/10'
              : 'bg-red-50 dark:bg-red-500/10'
          }`}>
            {isConsentError
              ? <ShieldOff className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              : <UserX className="w-8 h-8 text-red-600 dark:text-red-400" />
            }
          </div>
          <h2 className={`text-xl font-bold mb-3 ${
            isConsentError ? 'text-amber-900 dark:text-amber-200' : 'text-red-900 dark:text-red-200'
          }`}>
            {isConsentError ? 'Access Revoked' : 'Patient Not Found'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            {selectedPatientError}
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate('/doctor/patients')}>
              Back to Patients
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => fetchPatientPassport(id)}
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Retry
            </Button>
          </div>
        </GlassCard>
      </div>
    )
  }

  // ── No Patient Data ────────────────────────────────────────────────────────
  if (!selectedPatient) return null

  const patient = selectedPatient
  const profile = patient.profile || {}
  const initials = (patient.name || 'P').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">

      {/* Top Nav Action */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="text-slate-500" onClick={() => navigate('/doctor/patients')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
        </Button>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50"
            onClick={() => setShowPrescribeModal(!showPrescribeModal)}
          >
            <Pill className="w-4 h-4 mr-1.5" /> {showPrescribeModal ? 'Close Prescription Form' : 'Prescribe Medication'}
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
            onClick={handleStartConsultation}
          >
            <Stethoscope className="w-4 h-4 mr-2" /> Start Consultation
          </Button>
        </div>
      </div>

      {/* Comprehensive Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      >
        <GlassCard className="p-0 overflow-hidden border-0 shadow-md">
          <div className="p-8 flex flex-col md:flex-row gap-8 items-start relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

            {/* Profile Info */}
            <div className="flex gap-6 items-center md:w-1/3 relative z-10">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-3xl shadow-inner border-4 border-white dark:border-slate-900">
                {initials}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{patient.name}</h2>
                <PatientIdCard patientId={patient.patient_id} compact />
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {profile.gender && <span className="capitalize">{profile.gender}</span>}
                  {profile.dob && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                      <span>DOB: {new Date(profile.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </>
                  )}
                  {profile.blood_group && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                      <span className="flex items-center gap-1 font-bold text-red-500">
                        <DropletIcon className="w-3 h-3" /> {profile.blood_group}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="w-px h-24 bg-slate-200 dark:bg-slate-800 hidden md:block relative z-10" />

            {/* Emergency & Quick Info */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div className="space-y-4">
                {(profile.emergency_contacts || []).length > 0 ? (
                  profile.emergency_contacts.map((ec, i) => (
                    <div key={i}>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <PhoneCall className="w-3 h-3" /> Emergency Contact
                      </h4>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {ec.name} ({ec.relationship || ec.relation || 'Contact'})
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{ec.phone}</p>
                    </div>
                  ))
                ) : (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <PhoneCall className="w-3 h-3" /> Emergency Contact
                    </h4>
                    <p className="text-sm text-slate-400">No emergency contact on file</p>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Pill className="w-3 h-3" /> Current Conditions
                  </h4>
                  {(profile.chronic_diseases || []).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.chronic_diseases.map(d => (
                        <span key={d} className="px-2 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded-md text-xs font-medium border border-amber-200 dark:border-amber-500/20">
                          {d}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">No chronic conditions recorded</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Badges Bar */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 px-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-6">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-red-100 text-red-600 rounded-md mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-1">Allergies</p>
                <div className="flex gap-2 flex-wrap">
                  {(profile.allergies || []).length > 0
                    ? profile.allergies.map(a => <Badge key={a} variant="danger">{a}</Badge>)
                    : <span className="text-xs text-slate-400">None on record</span>
                  }
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-md mt-0.5">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1">Consent Status</p>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  ✓ Active — ABDM Authorized Access
                </span>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* ── DOCTOR PRESCRIPTION MODULE ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <GlassCard className="p-6 border-blue-100/60 dark:border-blue-900/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Pill className="w-5 h-5 text-blue-600" /> Prescribe Medications & Active Therapy
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Prescriptions issued here immediately sync to the patient's mobile passport and adherence tracker.
              </p>
            </div>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white shrink-0 shadow-md shadow-blue-500/20"
              onClick={() => setShowPrescribeModal(!showPrescribeModal)}
            >
              {showPrescribeModal ? 'Hide Form' : '+ New Prescription'}
            </Button>
          </div>

          {prescribeMsg && (
            <div className={`p-3.5 mb-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              prescribeMsg.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                : 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600'
            }`}>
              {prescribeMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              {prescribeMsg.text}
            </div>
          )}

          {/* Interactive Form */}
          <AnimatePresence>
            {showPrescribeModal && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handlePrescribeSubmit}
                className="overflow-hidden mb-6 p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4"
              >
                <div>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                    Quick Clinical Presets:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_DRUGS.map((cd, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(cd)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 transition-all"
                      >
                        {cd.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Medication Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amoxicillin 500mg"
                      value={prescriptionForm.name}
                      onChange={e => setPrescriptionForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Dosage Form</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1 tablet, 2 puffs, 5 ml"
                      value={prescriptionForm.dosage}
                      onChange={e => setPrescriptionForm(f => ({ ...f, dosage: e.target.value }))}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Frequency</label>
                    <select
                      value={prescriptionForm.frequency}
                      onChange={e => setPrescriptionForm(f => ({ ...f, frequency: e.target.value }))}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-900 dark:text-white"
                    >
                      <option value="once_daily">Once Daily (OD)</option>
                      <option value="twice_daily">Twice Daily (BD)</option>
                      <option value="thrice_daily">Three Times Daily (TDS)</option>
                      <option value="as_needed">As Needed (SOS / PRN)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Duration (Days)</label>
                    <input
                      type="number"
                      min={1}
                      max={365}
                      value={prescriptionForm.days}
                      onChange={e => setPrescriptionForm(f => ({ ...f, days: e.target.value }))}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Instructions for Patient</label>
                    <input
                      type="text"
                      placeholder="e.g. Take with warm water after meals. Do not chew."
                      value={prescriptionForm.instructions}
                      onChange={e => setPrescriptionForm(f => ({ ...f, instructions: e.target.value }))}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPrescribeModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                    disabled={prescribing || !prescriptionForm.name.trim()}
                  >
                    {prescribing ? 'Issuing Prescription...' : 'Issue Prescription'}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Existing Patient Medications List */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Current Patient Medications ({medications.length})
            </h4>

            {medsLoading ? (
              <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Loading medications...
              </div>
            ) : medications.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-dashed border-slate-200 dark:border-slate-800">
                <Pill className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
                <p className="text-xs text-slate-500 dark:text-slate-400">No active medications prescribed yet.</p>
                <button
                  type="button"
                  onClick={() => setShowPrescribeModal(true)}
                  className="mt-2 text-xs font-bold text-blue-600 hover:underline"
                >
                  + Add First Prescription
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {medications.map((m, idx) => (
                  <div
                    key={m.id || idx}
                    className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 flex items-start justify-between gap-3 shadow-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{m.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30">
                          {m.dosage}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {m.instructions || 'Take as advised'}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                        <span className="capitalize">{m.frequency ? m.frequency.replace('_', ' ') : 'Daily'}</span>
                        <span>•</span>
                        <span>Prescribed by: {m.prescribed_by || 'Doctor'}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 shrink-0">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, type: 'spring', stiffness: 100, damping: 15 }}>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" /> Medical Timeline
            </h3>
            <GlassCard className="p-6">
              <MedicalTimeline entries={timeline} loading={timelineLoading} />
            </GlassCard>
          </motion.div>
        </div>

        {/* Right: Reports & Stats */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, type: 'spring', stiffness: 100, damping: 15 }}>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" /> Recent Reports
            </h3>
            <ReportReviewModule patientId={patient.patient_id} />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, type: 'spring', stiffness: 100, damping: 15 }}>
            <GlassCard className="p-6">
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Patient Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Allergies</span>
                  <span className="font-bold text-slate-900 dark:text-white">{profile.allergies?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Chronic Conditions</span>
                  <span className="font-bold text-slate-900 dark:text-white">{profile.chronic_diseases?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Blood Group</span>
                  <span className="font-bold text-slate-900 dark:text-white">{profile.blood_group || '—'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Medications</span>
                  <span className="font-bold text-slate-900 dark:text-white">{medications.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Timeline Entries</span>
                  <span className="font-bold text-slate-900 dark:text-white">{timeline.length}</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function DropletIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.5c-3.5 0-6.5-2.9-6.5-6.4 0-3.9 6.5-12.6 6.5-12.6s6.5 8.7 6.5 12.6c0 3.5-3 6.4-6.5 6.4z"/>
    </svg>
  )
}
