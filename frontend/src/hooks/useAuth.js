import { useState } from 'react'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'
import { useToast } from '../components/ui/Toast'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const setUser = useAuthStore(s => s.setUser)
  const clearAuth = useAuthStore(s => s.clearAuth)
  const toast = useToast()

  const login = async (email, password) => {
    setLoading(true)
    try {
      const user = await authService.loginUser(email, password)
      const profile = await authService.getUserProfile(user.uid)
      const token = await user.getIdToken()
      setUser(profile || { uid: user.uid, email: user.email }, token, profile?.role || 'patient')
      toast.success('Welcome back', 'You have successfully signed in.')
      return true
    } catch (error) {
      toast.error('Login Failed', error.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (email, password, name, role = 'patient') => {
    setLoading(true)
    try {
      const user = await authService.registerUser(email, password, name, role)
      const token = await user.getIdToken()
      setUser({ uid: user.uid, email: user.email, name }, token, role)
      toast.success('Account Created', 'Your account has been set up successfully.')
      return true
    } catch (error) {
      toast.error('Registration Failed', error.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await authService.logout()
      clearAuth()
      toast.info('Signed Out', 'You have been securely signed out.')
    } catch (error) {
      toast.error('Sign Out Failed', error.message)
    } finally {
      setLoading(false)
    }
  }

  return { login, register, logout, loading }
}
