/**
 * consentService.js
 * Patient-facing consent management API calls.
 * Uses the existing api.js Axios instance (with Firebase token interceptor).
 */
import api from './api'

const consentService = {
  /**
   * Grant a doctor access to the patient's health passport.
   * @param {string} doctorUid - Doctor's Firebase UID
   */
  async grantConsent(doctorUid) {
    const res = await api.post('/consents', { doctor_uid: doctorUid })
    return res.data
  },

  /**
   * Get all consents for the current patient (active, revoked, expired).
   */
  async getMyConsents() {
    const res = await api.get('/consents')
    return res.data
  },

  /**
   * Revoke a specific consent.
   * @param {string} consentId - Consent document ID
   */
  async revokeConsent(consentId) {
    const res = await api.patch(`/consents/${consentId}`, { status: 'revoked' })
    return res.data
  },

  /**
   * Search for doctors by name, specialisation, or hospital.
   * @param {string} query
   */
  async searchDoctors(query = '') {
    const params = query ? { q: query } : {}
    const res = await api.get('/doctor/search', { params })
    return res.data
  },

  /**
   * Get a doctor's discoverable profile.
   * @param {string} doctorUid
   */
  async getDoctorProfile(doctorUid) {
    const res = await api.get(`/doctor/${doctorUid}/profile`)
    return res.data
  },
}

export default consentService
