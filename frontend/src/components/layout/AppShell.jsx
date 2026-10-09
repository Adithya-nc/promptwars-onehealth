import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar, BottomNav } from './Sidebar'
import { Header } from './Header'
import { ToastContainer } from '../ui/Toast'
import { HealthcareBackground } from './HealthcareBackground'

const PAGE_TITLES = {
  '/dashboard':          { title: 'Dashboard',             subtitle: 'Your health at a glance' },
  '/passport':           { title: 'Health Passport',        subtitle: 'Your complete medical history' },
  '/symptoms':           { title: 'Symptom Analyzer',       subtitle: 'AI-powered health triage' },
  '/emergency':          { title: 'Emergency Card',         subtitle: 'Critical information for first responders' },
  '/reports':            { title: 'Report Analyzer',        subtitle: 'AI analysis of your lab reports' },
  '/medications':        { title: 'Medications',            subtitle: 'Track and manage your prescriptions' },
  '/risk':               { title: 'Risk Prediction',        subtitle: 'AI-driven health risk assessment' },
  '/feedback-analytics': { title: 'Feedback Analytics',    subtitle: 'AI sentiment analysis' },
  '/health-report':      { title: 'AI Health Report',      subtitle: 'Generate your comprehensive health report' },
  '/doctor-access':      { title: 'Doctor Access',         subtitle: 'Manage healthcare provider permissions & consent' },
  '/settings':           { title: 'Settings',              subtitle: 'Manage your account and preferences' },
}

export function AppShell({ title: propTitle, subtitle: propSubtitle }) {
  const location = useLocation()
  const info = PAGE_TITLES[location.pathname] || {}
  const title = propTitle || info.title || 'oneHealth'
  const subtitle = propSubtitle || info.subtitle || ''

  return (
    <div className="flex h-screen bg-[var(--color-background)] overflow-hidden relative">
      {/* Healthcare Clinical Themed Background */}
      <HealthcareBackground variant="app" />

      {/* Sidebar — desktop only */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(8px)', y: 15 }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
              exit={{ opacity: 0, scale: 0.98, filter: 'blur(8px)', y: -15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />

      {/* Global toast container */}
      <ToastContainer />
    </div>
  )
}
