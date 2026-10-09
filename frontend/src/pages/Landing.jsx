import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HeartPulse, ArrowRight, Check,
  Stethoscope, FileText, AlertTriangle,
  User, Pill, Activity,
  Lock, Share2, Clock, Search, Menu, X,
  FileCheck, ClipboardList, ChevronRight, QrCode,
  Cross, PhoneCall, CheckCircle, ShieldCheck
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { HealthcareBackground } from '../components/layout/HealthcareBackground'

// --- Clinical Care Pillars ---
const clinicalPillars = [
  {
    icon: FileCheck,
    title: 'Longitudinal Medical Records',
    description: 'Consolidate hospital discharge summaries, specialist notes, diagnostic imaging, and immunization records into one continuous patient vault.'
  },
  {
    icon: AlertTriangle,
    title: 'Emergency Triage Readiness',
    description: 'Instant zero-login emergency card providing triage nurses, EMTs, and ER doctors with immediate access to life-threatening allergies and blood type.'
  },
  {
    icon: Pill,
    title: 'Medication Reconciliation',
    description: 'Maintain an accurate, active record of ongoing prescriptions, dosages, and administration schedules to eliminate harmful drug interactions.'
  },
  {
    icon: Share2,
    title: 'Patient-Directed Consent',
    description: 'Authorize consulting specialists to review your clinical records for designated appointment windows, with one-click revocation at any time.'
  }
]

// --- Clinical Features ---
const clinicalFeatures = [
  {
    icon: ClipboardList,
    category: 'Patient Portal',
    title: 'Lifetime Digital Health Passport',
    description: 'A permanent, patient-owned health vault bridging fragmented hospital systems, outpatient clinics, and private medical practices.',
    points: ['Consolidated chronological consultation timeline', 'Documented chronic condition history', 'Downloadable doctor health summary']
  },
  {
    icon: AlertTriangle,
    category: 'Acute Care & ER',
    title: 'Paramedic Emergency Card',
    description: 'First responders can immediately view your blood type, severe anaphylaxis triggers, and designated family contacts via public QR scan.',
    points: ['Direct access without login barriers', 'Primary & secondary emergency contacts', 'Compatible with all mobile browsers offline']
  },
  {
    icon: FileText,
    category: 'Diagnostic Vault',
    title: 'Biomarker & Lab Report Organizer',
    description: 'Upload laboratory PDFs and diagnostic summaries. Values are automatically structured by physiological panel and reference intervals.',
    points: ['Automatic biomarker reference interval mapping', 'Chronological trend comparison across labs', 'Secure, private cloud storage for all records']
  },
  {
    icon: Pill,
    category: 'Pharmacy & Care',
    title: 'Prescription & Regimen Tracking',
    description: 'Keep all active prescriptions and doctor instructions synchronized between primary doctors and consulting specialists.',
    points: ['Real-time active medication roster', 'Doctor-verified prescription logs', 'Documented allergy-drug conflict warnings']
  },
  {
    icon: Lock,
    category: 'Data Governance',
    title: 'Granular Clinical Consent Engine',
    description: 'Generate time-limited digital authorization codes for specialist consultations without surrendering permanent record ownership.',
    points: ['Time-bound 24h or 30-day consultation windows', 'Full audit trail of every provider inspection', 'Immediate access termination capability']
  },
  {
    icon: Stethoscope,
    category: 'Doctor Network',
    title: 'Clinical Consultation Station',
    description: 'A dedicated workspace for licensed doctors to review authorized patient charts, inspect lab trends, and dispense digital prescriptions.',
    points: ['Fast OneHealth Patient ID lookup', 'Pre-consultation clinical history review', 'Direct digital prescription delivery to passport']
  }
]

// --- How It Works Steps ---
const clinicalWorkflow = [
  {
    step: '01',
    title: 'Register Your Profile',
    desc: 'Create your account securely in two minutes as a patient or a licensed medical practitioner.'
  },
  {
    step: '02',
    title: 'Input Critical Vitals',
    desc: 'Record your verified blood group, anaphylactic allergies, chronic conditions, and emergency contacts.'
  },
  {
    step: '03',
    title: 'Upload Medical History',
    desc: 'Add past lab results, hospital discharge summaries, and active prescriptions into your timeline.'
  },
  {
    step: '04',
    title: 'Share at Consultations',
    desc: 'Provide your consulting doctor with a secure digital consent token for immediate chart review.'
  }
]

// --- Clinical Data Governance Principles ---
const governancePrinciples = [
  {
    icon: ShieldCheck,
    title: 'Patient Record Ownership',
    description: 'Your medical history belongs exclusively to you. OneHealth never sells, commercializes, or shares personal health data with third parties or insurers.'
  },
  {
    icon: Lock,
    title: 'Explicit Time-Bound Authorization',
    description: 'Healthcare providers cannot view your records without your active, time-limited digital consent code, verified on our audit ledger.'
  },
  {
    icon: Clock,
    title: 'Instant Emergency Segregation',
    description: 'Life-critical emergency parameters (allergies, blood type, emergency contacts) are segregated for instant triage access in acute crises.'
  }
]

export default function Landing() {
  const [authIntent, setAuthIntent] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activePreviewMode, setActivePreviewMode] = useState('passport') // 'passport' | 'doctor'
  const navigate = useNavigate()

  const handleRoleSelect = (role) => {
    if (authIntent === 'login') {
      navigate(role === 'doctor' ? '/doctor/login' : '/login')
    } else {
      navigate(role === 'doctor' ? '/doctor/register' : '/register')
    }
    setAuthIntent(null)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070D18] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white antialiased overflow-x-hidden relative">

      {/* --- CLINICAL TOP NOTICE BAR --- */}
      <div className="bg-[#0A1628] text-slate-300 text-xs py-2 px-4 border-b border-slate-800 relative z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 inline-block animate-pulse" />
            <span className="font-bold text-slate-200 tracking-wide">OneHealth Clinical Network</span>
            <span className="text-slate-500 hidden md:inline">•</span>
            <span className="text-slate-400 hidden md:inline">Hospital-Verified Patient Passport & Emergency Registry</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/emergency" className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1.5 transition-colors">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>Paramedic Emergency Card Portal</span>
            </Link>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">24/7 Zero-Login Triage Access</span>
          </div>
        </div>
      </div>

      {/* --- HEALTHCARE THEMED BACKGROUND SYSTEM --- */}
      <HealthcareBackground variant="landing" />

      {/* --- ROLE SELECTION MODAL --- */}
      <AnimatePresence>
        {authIntent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
            onClick={() => setAuthIntent(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-7 relative"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                    <HeartPulse size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {authIntent === 'login' ? 'Sign In to OneHealth' : 'Create OneHealth Account'}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Choose your healthcare portal</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthIntent(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
                  aria-label="Close dialog"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect('patient')}
                  className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl border border-blue-200/80 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20 hover:border-blue-600 hover:bg-blue-50/80 transition-all text-center group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <User size={24} />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900 dark:text-white text-base">Patient</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Health Passport & Card</span>
                  </div>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect('doctor')}
                  className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl border border-teal-200/80 dark:border-teal-900/40 bg-teal-50/40 dark:bg-teal-950/20 hover:border-teal-600 hover:bg-teal-50/80 transition-all text-center group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <Stethoscope size={24} />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900 dark:text-white text-base">Doctor</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Clinical Station Portal</span>
                  </div>
                </motion.button>
              </div>

              <div className="text-center">
                <Button variant="ghost" size="sm" onClick={() => setAuthIntent(null)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MAIN HEADER / CLINICAL NAVBAR --- */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">

          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <HeartPulse size={20} />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white block leading-none">
                one<span className="text-blue-600 dark:text-blue-400">Health</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400 dark:text-slate-500">
                Clinical Health Passport
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#passport" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Health Passport</a>
            <a href="#emergency" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Emergency Triage</a>
            <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Clinical Features</a>
            <a href="#doctors" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">For Doctors</a>
            <a href="#trust" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Data Privacy</a>
          </nav>

          {/* Action Portals */}
          <div className="hidden sm:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-700 dark:text-slate-200 hover:text-slate-900 font-semibold"
              onClick={() => setAuthIntent('login')}
            >
              Sign In
            </Button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm px-4"
                onClick={() => setAuthIntent('register')}
              >
                Create Account
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-3"
            >
              <a href="#passport" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600">Health Passport</a>
              <a href="#emergency" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600">Emergency Triage</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600">Clinical Features</a>
              <a href="#doctors" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600">For Doctors</a>
              <a href="#trust" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600">Data Privacy</a>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                <Button variant="outline" size="sm" className="w-1/2" onClick={() => { setMobileMenuOpen(false); setAuthIntent('login'); }}>Sign In</Button>
                <Button size="sm" className="w-1/2 bg-blue-600 text-white" onClick={() => { setMobileMenuOpen(false); setAuthIntent('register'); }}>Create Account</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* --- HERO SECTION: CLINICAL HEALTHCARE PRESENTATION --- */}
      <section className="relative z-10 pt-10 pb-20 lg:pt-16 lg:pb-28 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Value Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-6 text-left"
          >
            {/* Clinical Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 text-xs font-semibold text-teal-800 dark:text-teal-300 mb-6 shadow-xs">
              <Cross size={14} className="text-teal-600 dark:text-teal-400" />
              <span>Hospital-Grade Longitudinal Health Passport</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-slate-900 dark:text-white leading-[1.12] mb-6 tracking-tight">
              Every Medical Record. <br />
              Every Allergy. <br />
              <span className="text-blue-600 dark:text-blue-400">Ready When Care Matters.</span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-xl font-normal">
              OneHealth connects your longitudinal medical history, lab diagnostics, active prescriptions, and critical emergency information in a secure patient-owned digital passport. Share verified data with consulting doctors in seconds.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3.5 mb-10">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-600/20 px-6 py-3 text-base"
                  rightIcon={<ArrowRight size={18} />}
                  onClick={() => setAuthIntent('register')}
                >
                  Create Patient Passport
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link to="/emergency">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-red-200 dark:border-red-900/60 bg-red-50/60 dark:bg-red-950/30 hover:bg-red-50 text-red-700 dark:text-red-300 rounded-xl px-6 py-3 text-base font-semibold"
                    leftIcon={<AlertTriangle size={18} className="text-red-600" />}
                  >
                    Paramedic Emergency Card
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Clinical Verification Indicators */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
                <span>Patient-governed records</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
                <span>Doctor consent verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
                <span>24/7 Zero-login ER triage</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Live Healthcare Interface Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-6"
          >
            {/* Mode Switcher */}
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Preview Clinical Interface:</span>
              <div className="inline-flex rounded-lg bg-slate-200/80 dark:bg-slate-800 p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActivePreviewMode('passport')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    activePreviewMode === 'passport'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Patient Health Passport
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewMode('doctor')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    activePreviewMode === 'doctor'
                      ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Doctor Clinical Station
                </button>
              </div>
            </div>

            {/* The Clinical Window Frame */}
            <div className="relative mx-auto max-w-xl rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden">

              <AnimatePresence mode="wait">
                {activePreviewMode === 'passport' ? (
                  <motion.div
                    key="passport-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Header Bar */}
                    <div className="bg-[#0D1829] text-white px-4 py-3 flex items-center justify-between text-xs border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <HeartPulse size={16} className="text-red-400" />
                        <span className="font-bold">OneHealth Patient Passport</span>
                      </div>
                      <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 px-2.5 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active Patient ID: OH-P-7K4M92
                      </span>
                    </div>

                    {/* Acute Emergency Alert Ribbon */}
                    <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-red-600 text-white">
                          <AlertTriangle size={12} />
                        </div>
                        <span className="font-bold text-red-700 dark:text-red-300">
                          CRITICAL TRIAGE: PENICILLIN ANAPHYLAXIS RISK
                        </span>
                      </div>
                      <span className="font-black text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950 px-2 py-0.5 rounded">
                        BLOOD O+
                      </span>
                    </div>

                    {/* Patient Profile & Live Vitals */}
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center shadow-xs">
                            AM
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">Alex Morgan</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">42 Yrs • Male • Primary Care: Metro Health</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Emergency Contact</span>
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Sarah Morgan (Spouse)</span>
                        </div>
                      </div>

                      {/* Live Vital Signs Monitor Simulation with SVG ECG Wave */}
                      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <Activity size={14} className="text-teal-500" />
                            Live Telemetry & Vital Parameters
                          </span>
                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Sinus Rhythm • Normal</span>
                        </div>

                        {/* Animated ECG Heartbeat Graph Line */}
                        <div className="h-8 w-full bg-slate-950 rounded-lg p-1 relative overflow-hidden mb-3 flex items-center">
                          <svg className="w-full h-full text-emerald-400 stroke-current fill-none" viewBox="0 0 400 30" preserveAspectRatio="none">
                            <motion.path
                              d="M0 15 L80 15 L90 5 L95 25 L100 10 L105 18 L110 15 L200 15 L210 5 L215 25 L220 10 L225 18 L230 15 L320 15 L330 5 L335 25 L340 10 L345 18 L350 15 L400 15"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              initial={{ pathOffset: 0 }}
                              animate={{ pathOffset: [0, 1] }}
                              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                            />
                          </svg>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] text-slate-400 block font-semibold">Heart Rate</span>
                            <span className="font-extrabold text-slate-900 dark:text-white">72 <span className="text-[10px] text-slate-500 font-normal">BPM</span></span>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] text-slate-400 block font-semibold">Blood Pressure</span>
                            <span className="font-extrabold text-slate-900 dark:text-white">120/80 <span className="text-[10px] text-slate-500 font-normal">mmHg</span></span>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] text-slate-400 block font-semibold">Oxygen (SpO2)</span>
                            <span className="font-extrabold text-slate-900 dark:text-white">99% <span className="text-[10px] text-slate-500 font-normal">Normal</span></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Active Clinical Prescriptions & Verified Labs */}
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">Active Clinical Regimen</span>
                        <span className="text-teal-600 text-[11px] font-semibold">Prescribed by Dr. S. Chen</span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-md bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300">
                            <Pill size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">Atorvastatin 20mg Tablet</p>
                            <p className="text-[11px] text-slate-500">Lipid management • Take 1 tablet orally at bedtime</p>
                          </div>
                        </div>
                        <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[11px] font-semibold">
                          Active Rx
                        </span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                            <FileText size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">Comprehensive Metabolic Panel (CMP)</p>
                            <p className="text-[11px] text-slate-500">Collected Oct 14, 2025 • Verified by LabCorp</p>
                          </div>
                        </div>
                        <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded text-[11px] font-semibold">
                          In Range
                        </span>
                      </div>
                    </div>

                    {/* Paramedic Emergency QR Verification Strip */}
                    <div className="p-3 bg-slate-100/90 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <QrCode size={18} className="text-slate-700 dark:text-slate-300" />
                        <span className="text-slate-600 dark:text-slate-300 font-medium text-[11px]">
                          Triage Badge Code: <strong className="font-mono">ER-7K4M92-TRIAGE</strong>
                        </span>
                      </div>
                      <Link to="/emergency" className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 text-[11px]">
                        Scan Card <ChevronRight size={14} />
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="doctor-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Doctor Pro Header */}
                    <div className="bg-[#0B1528] text-white px-4 py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Stethoscope size={16} className="text-teal-400" />
                        <span className="font-bold">OneHealth Pro • Dr. Sarah Chen, MD (Cardiology)</span>
                      </div>
                      <span className="bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded text-[11px]">
                        Cardiology Command Station
                      </span>
                    </div>

                    {/* Patient Search & Active Consent Banner */}
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                        <Search size={14} className="text-slate-400" />
                        <span>Consultation Chart: <strong>OH-P-7K4M92 (Alex Morgan)</strong></span>
                      </div>
                      <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1">
                        <Check size={12} /> Patient Consent Verified (24h)
                      </span>
                    </div>

                    {/* Clinical Chart Data */}
                    <div className="p-5 space-y-4">
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                        <p className="font-bold mb-1">Pre-Consultation Safety Alert:</p>
                        <p className="text-[11px]">Patient has documented severe allergy to <strong>Penicillin derivatives</strong>. Avoid Beta-lactam antibiotics.</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Primary Diagnosis</span>
                          <span className="font-bold text-slate-900 dark:text-white">Primary Hypertension (Stage 1)</span>
                        </div>
                        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Adherence Rate</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">96% Confirmed Regimen</span>
                        </div>
                      </div>

                      {/* Doctor Clinical Actions */}
                      <div className="space-y-2 pt-2">
                        <button type="button" className="w-full py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer">
                          <FileText size={14} /> Dispense Verified Electronic Prescription
                        </button>
                        <button type="button" className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer">
                          Review Full Longitudinal Laboratory Trends
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 text-center text-[11px] text-slate-500 border-t border-slate-200 dark:border-slate-700">
                      Licensed doctor session audit ledger active: <span className="font-mono">CLIN-AUTH-9914</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </section>

      {/* --- CLINICAL CARE PILLARS --- */}
      <section id="passport" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block mb-2">
              Clinical Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Built on hospital-grade standards for patient safety and clinical continuity.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {clinicalPillars.map((pillar, idx) => {
              const Icon = pillar.icon
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-800/50 hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all shadow-xs"
                >
                  <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/60 flex items-center justify-center mb-4 shadow-xs">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* --- EMERGENCY MEDICINE & TRIAGE FOCUS --- */}
      <section id="emergency" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 dark:border-slate-800/80 bg-red-50/30 dark:bg-red-950/10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs font-bold text-red-700 dark:text-red-300 mb-6">
              <PhoneCall size={14} />
              <span>Paramedic & Hospital Triage System</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
              In a medical emergency, seconds dictate outcomes.
            </h2>

            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
              When trauma, shock, or acute emergencies strike, patients frequently cannot communicate critical medical context. OneHealth provides EMTs and emergency triage teams with immediate, zero-login access to life-saving clinical parameters.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { title: 'Blood Group & Cross-Match Data', desc: 'Pre-verified Rh factor and blood type available immediately to transfusion teams.' },
                { title: 'Severe Anaphylactic Alerts', desc: 'Instant warnings for penicillin, cephalosporins, latex, and anesthesia contraindications.' },
                { title: 'Next-of-Kin Emergency Contacts', desc: 'One-touch dialing to designated primary and secondary emergency family members.' }
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-red-600 text-white mt-1">
                    <Check size={14} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/emergency">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl px-7 shadow-md shadow-red-600/20">
                Test Emergency Card View
              </Button>
            </Link>
          </div>

          <div className="lg:col-span-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-red-200 dark:border-red-900/50 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                    O+
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-red-600 block">Emergency Medical Card</span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Alex Morgan</h3>
                  </div>
                </div>
                <div className="w-16 h-16 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                  <QrCode size={48} className="text-slate-800 dark:text-slate-200" />
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-900 dark:text-red-200">
                  <span className="font-bold block text-[11px] uppercase mb-1">Severe Drug & Food Allergies:</span>
                  <span className="font-semibold text-sm">PENICILLIN (Anaphylaxis Risk), PEANUTS</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Chronic Conditions</span>
                    <span className="font-bold text-slate-900 dark:text-white">Hypertension (Controlled)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Organ Donor</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Yes (Registered)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Emergency Contact</span>
                    <span className="font-bold text-slate-900 dark:text-white">Sarah Morgan (Spouse)</span>
                  </div>
                  <span className="font-mono text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-lg">
                    +1 (555) 234-8901
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-[11px] text-slate-400">
                Official Paramedic Triage Record • Verified on OneHealth Health Network
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CLINICAL FEATURES GRID --- */}
      <section id="features" className="relative z-10 py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Healthcare Systems
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 mb-4 tracking-tight">
              Comprehensive clinical tools for modern patient care.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
              Designed in alignment with clinical practice workflows to eliminate record fragmentation and safeguard patient safety.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clinicalFeatures.map((feat, idx) => {
              const Icon = feat.icon
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:shadow-xl hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200/50 dark:border-teal-800/50 flex items-center justify-center">
                        <Icon size={22} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                        {feat.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 font-normal">
                      {feat.description}
                    </p>
                  </div>

                  <ul className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                    {feat.points.map((p) => (
                      <li key={p} className="flex items-start gap-2">
                        <Check size={14} className="text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (CLINICAL CARE JOURNEY) --- */}
      <section className="relative z-10 py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Care Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 mb-4 tracking-tight">
              From Registration to Clinical Consultations
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400">
              A transparent, privacy-first workflow from account creation to your hospital appointments.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {clinicalWorkflow.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-800/50 relative flex flex-col justify-between shadow-xs"
              >
                <div>
                  <span className="text-3xl font-black text-teal-600/40 dark:text-teal-400/30 block mb-3 font-mono">
                    {step.step}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOR DOCTORS & CLINICS (ONEHEALTH PRO) --- */}
      <section id="doctors" className="relative z-10 py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 dark:border-slate-800/80 bg-[#09111E] text-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-950 border border-teal-700/80 text-xs font-bold text-teal-300 mb-6">
              <Stethoscope size={14} />
              <span>OneHealth Pro • Clinical Doctor Network</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
              Spend less time hunting charts. More time with patients.
            </h2>

            <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
              When patients bring incomplete records, consultations slow down and duplicate diagnostics occur. OneHealth Pro gives authorized clinicians an immediate, chronological medical history, documented drug allergies, and active medication timelines.
            </p>

            <div className="space-y-4 mb-8">
              {[
                'Instant OneHealth ID lookup with automatic patient digital consent verification',
                'Comprehensive reconciliation of active medications, past doses, and refill records',
                'High-contrast allergy and contraindication safety alerts before prescription entry',
                'Direct digital prescription issuance sent straight to the patient health passport'
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={12} />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold rounded-xl px-7"
                  onClick={() => { setAuthIntent('register'); handleRoleSelect('doctor'); }}
                >
                  Join as a Doctor
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-slate-700 bg-slate-800/80 text-white rounded-xl px-7"
                  onClick={() => { setAuthIntent('login'); handleRoleSelect('doctor'); }}
                >
                  Doctor Portal Login
                </Button>
              </motion.div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                    <Stethoscope size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Dr. Sarah Chen, MD</h4>
                    <p className="text-xs text-slate-400">Cardiology Dept • Metro Health Network</p>
                  </div>
                </div>
                <span className="text-[11px] bg-slate-900 border border-slate-700 text-teal-400 px-2.5 py-1 rounded-md font-mono">
                  CLIN-ID: MD-88214
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Current Consultation:</span>
                  <span className="font-bold text-white">OH-P-7K4M92 (Alex Morgan)</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Consent Validation:</span>
                  <span className="font-bold text-emerald-400">Active (24h Remaining)</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Longitudinal Lab History:</span>
                  <span className="font-bold text-white">12 Verified Documents Attached</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-800/60 text-xs text-teal-200">
                Patient records inspected under authorized doctor token. All accesses are signed to the patient audit log.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CLINICAL TRUST & DATA PRIVACY --- */}
      <section id="trust" className="relative z-10 py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Data Privacy & Governance
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 mb-4 tracking-tight">
              Medical Privacy and Patient Autonomy by Design
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400">
              Healthcare data requires uncompromising boundaries. OneHealth is built on transparent principles that protect your rights.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {governancePrinciples.map((principle, idx) => {
              const Icon = principle.icon
              return (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-800/50 flex flex-col justify-between shadow-xs hover:border-teal-500/50 transition-colors"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200/50 dark:border-teal-800/50 flex items-center justify-center mb-5">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5">
                      {principle.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                      {principle.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* --- FINAL CALL TO ACTION --- */}
      <section className="relative z-10 py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl bg-[#091322] text-white p-8 sm:p-14 border border-slate-800 shadow-2xl text-center relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-6 shadow-md">
                <HeartPulse size={26} />
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
                Be prepared before an emergency happens.
              </h2>

              <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed font-normal">
                Set up your lifetime health passport in under two minutes. Keep your complete medical history organized for doctors, and your emergency card ready for first responders.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-6">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setAuthIntent('register')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-base px-8 py-3.5 rounded-xl shadow-lg transition-colors cursor-pointer select-none"
                >
                  <span>Create Free Patient Account</span>
                  <ArrowRight size={18} />
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setAuthIntent('login')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-base px-7 py-3.5 rounded-xl transition-colors cursor-pointer select-none"
                >
                  <span>Sign In to Portal</span>
                </motion.button>
              </div>

              <p className="text-xs text-slate-400">
                Free for individual patients • Instant setup • 100% confidential and secure
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CLINICAL HEALTHCARE FOOTER --- */}
      <footer className="relative z-10 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-sm text-slate-600 dark:text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Column 1: Brand & Purpose */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <HeartPulse size={18} />
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                one<span className="text-blue-600 dark:text-blue-400">Health</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed mb-4">
              A unified digital health passport bridging patients, emergency first responders, and licensed medical practitioners. Centralized medical records, emergency triage cards, and consent-governed chart access.
            </p>
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300 max-w-md">
              <strong>Medical Disclaimer:</strong> OneHealth is an electronic health passport platform. In a life-threatening medical emergency, always dial your local emergency services (911 / 112 / 108) immediately.
            </div>
          </div>

          {/* Column 2: Patient Resources */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Patient Care
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><a href="#passport" className="hover:text-blue-600 transition-colors">Digital Health Passport</a></li>
              <li><Link to="/emergency" className="hover:text-blue-600 transition-colors font-semibold text-red-600 dark:text-red-400">Paramedic Emergency Card</Link></li>
              <li><a href="#features" className="hover:text-blue-600 transition-colors">Lab Biomarker Organizer</a></li>
              <li><a href="#trust" className="hover:text-blue-600 transition-colors">Patient Privacy Rights</a></li>
            </ul>
          </div>

          {/* Column 3: Doctor Network */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Doctor Network
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><a href="#doctors" className="hover:text-blue-600 transition-colors">OneHealth Pro Station</a></li>
              <li>
                <button
                  type="button"
                  onClick={() => { setAuthIntent('login'); handleRoleSelect('doctor'); }}
                  className="hover:text-blue-600 text-left transition-colors cursor-pointer"
                >
                  Doctor Portal Sign In
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => { setAuthIntent('register'); handleRoleSelect('doctor'); }}
                  className="hover:text-blue-600 text-left transition-colors cursor-pointer"
                >
                  Doctor Registration
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => { setAuthIntent('login'); handleRoleSelect('patient'); }}
                  className="hover:text-blue-600 text-left transition-colors cursor-pointer"
                >
                  Patient Portal Login
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 oneHealth Medical Systems. All rights reserved.</p>
          <p>Verified Clinical Health Passport & Triage System.</p>
        </div>
      </footer>

    </div>
  )
}
