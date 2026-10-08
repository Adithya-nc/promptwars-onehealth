import axios from 'axios'
import { auth } from './firebase'
import { useAuthStore } from '../store/authStore'

// Create an Axios instance
const api = axios.create({
  // Point to the Flask backend URL defined in env variables, defaulting to localhost:5000
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request Interceptor: Attach Firebase ID Token & Mock headers
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser
  if (user) {
    try {
      const token = await user.getIdToken()
      config.headers.Authorization = `Bearer ${token}`
    } catch {
      // Fall through to mock headers
    }
  }

  // Attach mock headers for role-based backend verification
  try {
    const authState = useAuthStore.getState?.() || {}
    const isDoctorRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/doctor')
    const currentRole = authState.role || (isDoctorRoute ? 'doctor' : 'patient')
    const currentUid = authState.user?.uid || authState.user?.id || (currentRole === 'doctor' ? 'mock-doctor-uid-001' : 'mock-patient-uid-001')

    if (!config.headers['X-Mock-Role']) {
      config.headers['X-Mock-Role'] = currentRole
    }
    if (!config.headers['X-Mock-Uid']) {
      config.headers['X-Mock-Uid'] = currentUid
    }
  } catch (err) {
    // Ignore in non-browser context
  }

  return config
}, (error) => Promise.reject(error))

// Response Interceptor: Handle Global Errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle global error states here (e.g., logging out user on 401)
    console.error('API Error:', error.response?.data?.message || error.message)
    return Promise.reject(error)
  }
)

export default api
