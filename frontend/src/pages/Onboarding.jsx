import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  HeartPulse, ArrowRight, ArrowLeft, Check, Plus, X,
  UploadCloud, FileText, Activity, ShieldCheck, Trash2,
  Moon, Wine, Cigarette, AlertCircle, Sparkles
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input, Select } from '../components/ui/Input'
import { ProgressBar } from '../components/ui/index'
import { useAuthStore } from '../store/authStore'
import { useUserStore } from '../store/userStore'
import api from '../services/api'
import {
  BLOOD_GROUPS, GENDERS, COMMON_ALLERGIES, COMMON_CONDITIONS, COMMON_VACCINES
} from '../utils/constants'
import { cn } from '../utils/formatters'

const STEPS = [
  { id: 1, title: 'Basic Information', desc: 'Vital physical metrics that power your Emergency Card' },
  { id: 2, title: 'Clinical History', desc: 'Allergies, conditions, surgeries & family genetics' },
  { id: 3, title: 'Lifestyle & Habits', desc: 'Sleep, exercise, smoking & dietary profile' },
  { id: 4, title: 'Medical Reports (Optional)', desc: 'Attach past lab tests, scans, or pathology reports' },
  { id: 5, title: 'Emergency & Vaccines', desc: 'Emergency contacts and immunization records' },
]

function ChipSelector({ label, options, selected, onToggle, onAdd, addPlaceholder }) {
  const [custom, setCustom] = useState('')
  const handleAdd = (e) => {
    e.preventDefault()
    if (custom.trim()) { onAdd(custom.trim()); setCustom('') }
  }
  return (
    <div className="space-y-3">
      {label && <p className="text-sm font-semibold text-[var(--color-text-primary)]">{label}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map(o => (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
              selected.includes(o)
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm'
                : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-border-strong)]'
            )}
          >
            {o}
          </button>
        ))}
      </div>
      {onAdd && (
        <form onSubmit={handleAdd} className="flex gap-2 mt-2">
          <input
            type="text"
            value={custom}
            onChange={e => setCustom(e.target.value)}
            placeholder={addPlaceholder}
            className="flex-1 h-9 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text-primary)]"
          />
          <Button type="submit" size="sm" variant="outline" leftIcon={<Plus size={12} />}>Add</Button>
        </form>
      )}
    </div>
  )
}

function StepBasicInfo({ data, onChange }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input id="ob-dob" label="Date of Birth" type="date" required value={data.dob} onChange={e => onChange('dob', e.target.value)} />
        <Select id="ob-gender" label="Gender" required value={data.gender} onChange={e => onChange('gender', e.target.value)}>
          <option value="">Select gender</option>
          {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select id="ob-blood" label="Blood Group" required value={data.blood_group} onChange={e => onChange('blood_group', e.target.value)}>
          <option value="">Select blood group</option>
          {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
        </Select>
        <Select id="ob-marital" label="Marital Status" value={data.marital_status || ''} onChange={e => onChange('marital_status', e.target.value)}>
          <option value="">Select status</option>
          {['Single', 'Married', 'Divorced', 'Widowed'].map(s => <option key={s} value={s}>{s}</option>)}
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input id="ob-height" label="Height (cm)" type="number" placeholder="170" value={data.height_cm} onChange={e => onChange('height_cm', e.target.value)} />
        <Input id="ob-weight" label="Weight (kg)" type="number" placeholder="68" value={data.weight_kg} onChange={e => onChange('weight_kg', e.target.value)} />
      </div>
      <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
          These essential baseline metrics automatically sync to your Emergency QR Card and Digital Health Passport.
        </p>
      </div>
    </div>
  )
}

function StepMedical({ data, onChange }) {
  const toggleAllergy = (a) => onChange('allergies', data.allergies.includes(a) ? data.allergies.filter(x => x !== a) : [...data.allergies, a])
  const addAllergy = (a) => onChange('allergies', [...data.allergies, a])
  const toggleCondition = (c) => onChange('chronic_diseases', data.chronic_diseases.includes(c) ? data.chronic_diseases.filter(x => x !== c) : [...data.chronic_diseases, c])
  const addCondition = (c) => onChange('chronic_diseases', [...data.chronic_diseases, c])

  const FAMILY_RISKS = ['Hypertension', 'Diabetes Type 2', 'Coronary Artery Disease', 'Asthma', 'Thyroid Disorder', 'Stroke']
  const toggleFamily = (f) => {
    const list = data.family_history || []
    onChange('family_history', list.includes(f) ? list.filter(x => x !== f) : [...list, f])
  }

  return (
    <div className="space-y-6">
      <ChipSelector label="Known Allergies" options={COMMON_ALLERGIES} selected={data.allergies} onToggle={toggleAllergy} onAdd={addAllergy} addPlaceholder="Add custom allergy..." />
      <div className="h-px bg-[var(--color-border)]" />
      <ChipSelector label="Chronic Health Conditions" options={COMMON_CONDITIONS} selected={data.chronic_diseases} onToggle={toggleCondition} onAdd={addCondition} addPlaceholder="Add custom condition..." />
      <div className="h-px bg-[var(--color-border)]" />
      <ChipSelector label="Family Genetic History (Parents/Siblings)" options={FAMILY_RISKS} selected={data.family_history || []} onToggle={toggleFamily} />
      <div className="grid grid-cols-1 gap-3">
        <Input id="ob-surgeries" label="Past Surgeries / Major Hospitalizations" placeholder="e.g., Appendectomy (2022), Knee Arthroscopy (2024)" value={data.surgeries || ''} onChange={e => onChange('surgeries', e.target.value)} />
        <Input id="ob-notes" label="Other Medical Notes & Doctor Warnings" placeholder="Any specific instructions, drug sensitivities, or pacemakers..." value={data.medical_notes} onChange={e => onChange('medical_notes', e.target.value)} />
      </div>
    </div>
  )
}

function StepLifestyle({ data, onChange }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2 flex items-center gap-1.5">
          <Moon size={14} className="text-indigo-500" /> Typical Nightly Sleep
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {['Less than 6 hrs', '6 - 7 hours', '7 - 8 hours', '8+ hours'].map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange('sleep_hours', opt)}
              className={cn(
                'p-2.5 rounded-xl border text-xs font-semibold text-center transition-all',
                data.sleep_hours === opt
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-blue-400'
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2 flex items-center gap-1.5">
          <Activity size={14} className="text-emerald-500" /> Physical Activity Level
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {['Sedentary (Desk)', 'Light (1-2x/wk)', 'Moderate (3-4x/wk)', 'Very Active (5+x)'].map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange('activity_level', opt)}
              className={cn(
                'p-2.5 rounded-xl border text-xs font-semibold text-center transition-all',
                data.activity_level === opt
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-emerald-400'
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5 flex items-center gap-1.5">
            <Cigarette size={14} className="text-amber-500" /> Smoking Status
          </label>
          <Select id="ob-smoking" value={data.smoking || 'Non-smoker'} onChange={e => onChange('smoking', e.target.value)}>
            <option value="Non-smoker">Non-smoker</option>
            <option value="Occasional">Occasional</option>
            <option value="Regular">Regular</option>
            <option value="Former smoker">Former smoker</option>
          </Select>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5 flex items-center gap-1.5">
            <Wine size={14} className="text-purple-500" /> Alcohol Intake
          </label>
          <Select id="ob-alcohol" value={data.alcohol || 'Never'} onChange={e => onChange('alcohol', e.target.value)}>
            <option value="Never">Never</option>
            <option value="Socially">Socially</option>
            <option value="Moderate">Moderate (1-2 drinks/wk)</option>
            <option value="Regular">Regular</option>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">Dietary Preference</label>
        <Select id="ob-diet" value={data.diet || 'Balanced'} onChange={e => onChange('diet', e.target.value)}>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Non-vegetarian">Non-vegetarian</option>
          <option value="Vegan">Vegan</option>
          <option value="Eggetarian">Eggetarian</option>
          <option value="Balanced">Balanced Omnivore</option>
        </Select>
      </div>
    </div>
  )
}

function StepReports({ reports, onAddReport, onRemoveReport }) {
  const [newTitle, setNewTitle] = useState('')
  const [newHospital, setNewHospital] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [fileName, setFileName] = useState('')

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      if (!newTitle) setNewTitle(file.name.replace(/\.[^/.]+$/, ''))
    }
  }

  const handleAttach = (e) => {
    e.preventDefault()
    if (!newTitle.trim() && !fileName) return
    onAddReport({
      id: `rep-${Date.now()}`,
      title: newTitle.trim() || fileName || 'Diagnostic Report',
      hospital: newHospital.trim() || 'Laboratory Diagnostics',
      doctor_name: 'Self Uploaded',
      notes: newNotes.trim() || 'Attached during registration onboarding',
      file_name: fileName || 'health_record.pdf',
      date: new Date().toISOString().split('T')[0]
    })
    setNewTitle('')
    setNewHospital('')
    setNewNotes('')
    setFileName('')
  }

  return (
    <div className="space-y-5">
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900/30 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200">Optional: Attach Historical Reports</h4>
          <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-0.5">
            Attach blood tests, prescriptions, or imaging reports now. You can skip this step and upload anytime in the Report Analyzer.
          </p>
        </div>
      </div>

      <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 text-center">
        <input
          type="file"
          id="onboard-file"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
        />
        <label htmlFor="onboard-file" className="cursor-pointer block p-3">
          <UploadCloud className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {fileName ? `Selected: ${fileName}` : 'Choose PDF, JPG or PNG to attach'}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Max size 20MB per report</p>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="rep-title"
          placeholder="Report Title (e.g. CBC Blood Panel)"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
        />
        <Input
          id="rep-hosp"
          placeholder="Lab / Clinic (e.g. Apollo Diagnostics)"
          value={newHospital}
          onChange={e => setNewHospital(e.target.value)}
        />
      </div>
      <Input
        id="rep-notes"
        placeholder="Key findings or doctor notes (optional)"
        value={newNotes}
        onChange={e => setNewNotes(e.target.value)}
      />

      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={handleAttach}
        disabled={!newTitle.trim() && !fileName}
        leftIcon={<Plus size={14} />}
        className="w-full"
      >
        Add Report to Vault
      </Button>

      {reports.length > 0 && (
        <div className="space-y-2 pt-2">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Attached Reports ({reports.length}):</p>
          {reports.map((r, i) => (
            <div key={r.id || i} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{r.title}</p>
                  <p className="text-[10px] text-slate-400">{r.hospital || 'Lab'} • {r.date}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemoveReport(i)}
                className="text-red-500 hover:text-red-700 p-1 rounded-lg"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StepContactsAndVaccines({ contacts, onAddContact, onRemoveContact, onUpdateContact, vaccines, onToggleVaccine }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-3">Primary Emergency Contacts</h3>
        <div className="space-y-3">
          {contacts.map((c, i) => (
            <div key={i} className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[var(--color-text-primary)]">Emergency Contact {i + 1}</span>
                {i > 0 && <button type="button" onClick={() => onRemoveContact(i)} className="text-[var(--color-danger)] text-xs hover:opacity-70">Remove</button>}
              </div>
              <Input id={`ec-name-${i}`} placeholder="Full Name" value={c.name} onChange={e => onUpdateContact(i, 'name', e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <Select id={`ec-rel-${i}`} value={c.relationship} onChange={e => onUpdateContact(i, 'relationship', e.target.value)}>
                  <option value="">Relationship</option>
                  {['Spouse', 'Parent', 'Sibling', 'Child', 'Friend', 'Family Doctor', 'Guardian', 'Other'].map(r => <option key={r} value={r}>{r}</option>)}
                </Select>
                <Input id={`ec-phone-${i}`} type="tel" placeholder="+91 98765..." value={c.phone} onChange={e => onUpdateContact(i, 'phone', e.target.value)} />
              </div>
            </div>
          ))}
          {contacts.length < 3 && (
            <Button type="button" variant="outline" size="sm" onClick={() => onAddContact({ name: '', relationship: '', phone: '' })} leftIcon={<Plus size={14} />} className="w-full">
              Add Emergency Contact ({contacts.length}/3)
            </Button>
          )}
        </div>
      </div>

      <div className="h-px bg-[var(--color-border)]" />

      <div>
        <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-2">Received Immunizations</h3>
        <p className="text-xs text-[var(--color-text-muted)] mb-3">Select all vaccines you have received for your passport registry.</p>
        <div className="grid grid-cols-2 gap-2">
          {COMMON_VACCINES.map(v => (
            <button
              key={v}
              type="button"
              onClick={() => onToggleVaccine(v)}
              className={cn(
                'flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium text-left transition-all',
                vaccines.includes(v)
                  ? 'border-[var(--color-accent)] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-300'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]'
              )}
            >
              <span className={cn('w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                vaccines.includes(v) ? 'border-emerald-600 bg-emerald-600' : 'border-[var(--color-border)]')}>
                {vaccines.includes(v) && <Check size={9} className="text-white" />}
              </span>
              <span className="truncate">{v}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()
  const setUser = useAuthStore(s => s.setUser)
  const setProfile = useUserStore(s => s.setProfile)

  // Registration identity details
  const [accountInfo, setAccountInfo] = useState({ name: '', email: '', phone: '', password: '' })

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('pending_patient_reg')
      if (saved) {
        setAccountInfo(JSON.parse(saved))
      }
    } catch {}
  }, [])

  const [basicInfo, setBasicInfo] = useState({
    dob: '1996-05-14',
    gender: 'Female',
    blood_group: 'B+',
    height_cm: '165',
    weight_kg: '58',
    marital_status: 'Single'
  })
  const [medInfo, setMedInfo] = useState({
    allergies: ['Penicillin'],
    chronic_diseases: ['Mild Asthma'],
    surgeries: '',
    family_history: ['Hypertension'],
    medical_notes: ''
  })
  const [lifestyleInfo, setLifestyleInfo] = useState({
    sleep_hours: '7 - 8 hours',
    activity_level: 'Moderate (3-4x/wk)',
    smoking: 'Non-smoker',
    alcohol: 'Socially',
    diet: 'Vegetarian'
  })
  const [reports, setReports] = useState([])
  const [contacts, setContacts] = useState([{ name: 'Rohan Sharma', relationship: 'Sibling', phone: '+91 98765 43210' }])
  const [vaccines, setVaccines] = useState(['COVID-19 (Covishield/Covaxin)', 'Tetanus', 'Hepatitis B'])

  const updateBasic = (k, v) => setBasicInfo(f => ({ ...f, [k]: v }))
  const updateMed = (k, v) => setMedInfo(f => ({ ...f, [k]: v }))
  const updateLifestyle = (k, v) => setLifestyleInfo(f => ({ ...f, [k]: v }))

  const handleComplete = async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      const payload = {
        name: accountInfo.name || 'Priya Sharma',
        email: accountInfo.email || 'patient@onehealth.org',
        phone: accountInfo.phone || '+91 98765 43210',
        password: accountInfo.password || 'password123',
        dob: basicInfo.dob,
        gender: basicInfo.gender,
        blood_group: basicInfo.blood_group,
        height_cm: basicInfo.height_cm,
        weight_kg: basicInfo.weight_kg,
        marital_status: basicInfo.marital_status,
        allergies: medInfo.allergies,
        chronic_diseases: medInfo.chronic_diseases,
        surgeries: medInfo.surgeries,
        family_history: medInfo.family_history,
        medical_notes: medInfo.medical_notes,
        lifestyle: lifestyleInfo,
        emergency_contacts: contacts.filter(c => c.name.trim()),
        vaccines: vaccines,
        reports: reports
      }

      const res = await api.post('/patients/register', payload)
      if (res.data?.success) {
        const userObj = res.data.user
        setUser(userObj, res.data.token || 'mock-patient-token', 'patient')
        if (res.data.profile) {
          setProfile(res.data.profile)
        }
        sessionStorage.removeItem('pending_patient_reg')
        navigate('/dashboard')
      } else {
        setErrorMsg('Registration failed. Please verify your details.')
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error?.message || 'Server error creating patient passport.')
    } finally {
      setLoading(false)
    }
  }

  const step = STEPS[currentStep - 1]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/40 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--color-primary)] via-purple-500 to-[var(--color-accent)]" />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-purple-600 flex items-center justify-center shadow-md">
              <HeartPulse size={18} className="text-white" />
            </div>
            <span className="text-xl font-black text-[var(--color-text-primary)]">oneHealth</span>
          </div>
          <span className="text-xs text-[var(--color-text-muted)] font-bold uppercase tracking-wider">
            Step {currentStep} of {STEPS.length}
          </span>
        </div>
        <ProgressBar value={(currentStep / STEPS.length) * 100} color="primary" className="mb-5 h-1.5" />

        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl overflow-hidden">
          <div className="p-6 pb-4 border-b border-[var(--color-border)] bg-gradient-to-r from-blue-500/5 to-purple-500/5">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white text-xs font-black flex items-center justify-center shadow-sm">
                {currentStep}
              </div>
              <h1 className="text-lg font-black text-[var(--color-text-primary)]">{step.title}</h1>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] ml-10">{step.desc}</p>
          </div>

          <div className="p-6 max-h-[58vh] overflow-y-auto">
            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-xs text-red-600 font-semibold flex items-center gap-2">
                <AlertCircle size={14} /> {errorMsg}
              </div>
            )}
            <AnimatePresence mode="wait">
              <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                {currentStep === 1 && <StepBasicInfo data={basicInfo} onChange={updateBasic} />}
                {currentStep === 2 && <StepMedical data={medInfo} onChange={updateMed} />}
                {currentStep === 3 && <StepLifestyle data={lifestyleInfo} onChange={updateLifestyle} />}
                {currentStep === 4 && <StepReports reports={reports} onAddReport={r => setReports(p => [...p, r])} onRemoveReport={idx => setReports(p => p.filter((_, i) => i !== idx))} />}
                {currentStep === 5 && (
                  <StepContactsAndVaccines
                    contacts={contacts}
                    onAddContact={(c) => setContacts(p => [...p, c])}
                    onRemoveContact={(i) => setContacts(p => p.filter((_, idx) => idx !== i))}
                    onUpdateContact={(i, k, v) => setContacts(p => p.map((c, idx) => idx === i ? { ...c, [k]: v } : c))}
                    vaccines={vaccines}
                    onToggleVaccine={(v) => setVaccines(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v])}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="p-5 border-t border-[var(--color-border)] flex gap-3 bg-[var(--color-surface-2)]/30">
            {currentStep > 1 && (
              <Button variant="outline" onClick={() => setCurrentStep(s => s - 1)} leftIcon={<ArrowLeft size={16} />} className="flex-1">Back</Button>
            )}
            {currentStep < STEPS.length ? (
              <Button onClick={() => setCurrentStep(s => s + 1)} className="flex-1 shadow-md shadow-blue-500/20" rightIcon={<ArrowRight size={16} />}>
                {currentStep === 4 && reports.length === 0 ? 'Skip / Continue' : 'Continue'}
              </Button>
            ) : (
              <Button onClick={handleComplete} isLoading={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25" rightIcon={<Check size={16} />}>
                Complete Passport Setup
              </Button>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-1.5 mt-5">
          {STEPS.map(s => (
            <div
              key={s.id}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                s.id === currentStep ? 'w-8 bg-[var(--color-primary)]' : s.id < currentStep ? 'w-4 bg-[var(--color-primary)]/50' : 'w-3 bg-slate-300 dark:bg-slate-700'
              )}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
