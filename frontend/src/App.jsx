import { Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useUIStore, applyTheme } from './store/uiStore'
import { AppShell } from './components/layout/AppShell'
import { Spinner } from './components/ui/index'
import { ErrorBoundary } from './components/ui/ErrorBoundary'

// Pages
import Landing from './pages/Landing'
import { Login, Register, OTP } from './pages/Auth'
import Onboarding from './pages/Onboarding'
import Dashboard from './components/dashboard/Dashboard'
import Passport from './components/passport/Passport'
import SymptomAnalyzer from './components/symptom/SymptomAnalyzer'
import Emergency from './components/emergency/Emergency'
import ReportAnalyzer from './components/reports/ReportAnalyzer'
import Medications from './components/medications/Medications'
import FeedbackAnalytics from './components/dashboard/FeedbackAnalytics'
import HealthReportGenerator from './components/dashboard/HealthReportGenerator'
import Settings from './pages/Settings'
import RiskPrediction from './pages/RiskPrediction'
import DoctorAccess from './pages/DoctorAccess'

// Doctor Portal
import { DoctorLayout } from './components/doctor/layout/DoctorLayout'
import { DoctorLogin } from './pages/doctor/auth/DoctorLogin'
import { DoctorRegister } from './pages/doctor/auth/DoctorRegister'
import { Dashboard as DoctorDashboard } from './pages/doctor/Dashboard'
import { PatientDirectory } from './pages/doctor/PatientDirectory'
import { PatientPassport as DoctorPatientPassport } from './pages/doctor/PatientPassport'
import { ActiveConsultation } from './pages/doctor/ActiveConsultation'
import { Analytics as DoctorAnalytics } from './pages/doctor/Analytics'
import { Profile as DoctorProfile } from './pages/doctor/Profile'

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>
  )
}

// Route guard — redirect to /login if not authenticated
function PrivateRoute() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const user = useAuthStore(s => s.user)
  // In demo/mock mode the user object is set on login; allow access if set
  if (!isAuthenticated && !user) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

export default function App() {
  const theme = useUIStore(s => s.theme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] font-sans flex flex-col transition-colors duration-300">
        <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Doctor Public Routes */}
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/doctor/register" element={<DoctorRegister />} />

          {/* Doctor Protected Routes */}
          <Route path="/doctor" element={<DoctorLayout />}>
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="patients" element={<PatientDirectory />} />
            <Route path="patients/:id" element={<DoctorPatientPassport />} />
            <Route path="consultation" element={<Navigate to="/doctor/patients" replace />} />
            <Route path="consultation/:id" element={<ActiveConsultation />} />
            <Route path="analytics" element={<DoctorAnalytics />} />
            <Route path="profile" element={<DoctorProfile />} />
            <Route index element={<Navigate to="/doctor/dashboard" replace />} />
          </Route>

          {/* Protected app routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppShell />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/passport" element={<Passport />} />
              <Route path="/symptoms" element={<SymptomAnalyzer />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/reports" element={<ReportAnalyzer />} />
              <Route path="/medications" element={<Medications />} />
              <Route path="/risk" element={<RiskPrediction />} />
              <Route path="/feedback-analytics" element={<FeedbackAnalytics />} />
              <Route path="/health-report" element={<HealthReportGenerator />} />
              <Route path="/doctor-access" element={<DoctorAccess />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      </ErrorBoundary>
      </div>
    </BrowserRouter>
  )
}
