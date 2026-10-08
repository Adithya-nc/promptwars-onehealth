import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import OTP from '../pages/OTP'
import Onboarding from '../pages/Onboarding'
import Passport from '../pages/Passport'
import SymptomAnalyzer from '../pages/SymptomAnalyzer'
import Emergency from '../pages/Emergency'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-light text-dark font-sans flex flex-col">
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/otp" element={<OTP />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/passport" element={<Passport />} />
            <Route path="/symptom-analyzer" element={<SymptomAnalyzer />} />
            <Route path="/emergency" element={<Emergency />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
