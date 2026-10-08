/**
 * doctorService.js
 * All doctor-facing API calls including patient management and consent verification.
 * Uses the existing api.js Axios instance (with Firebase token interceptor).
 */
import api from './api'

const doctorService = {
  /**
   * Get all patients with active consent for the current doctor.
   * @param {string} search - Optional search query (name or patient ID)
   */
  async getDoctorPatients(search = '') {
    const params = search ? { search } : {}
    const res = await api.get('/doctor/patients', { params })
    return res.data
  },

  /**
   * Search for a patient by their OneHealth Patient ID.
   * Requires active consent — returns 404 if no consent or patient not found.
   * @param {string} patientId - e.g. "OH-P-7K4M92"
   */
  async searchPatientById(patientId) {
    const res = await api.get('/doctor/patients/search', {
      params: { patient_id: patientId }
    })
    return res.data
  },

  /**
   * Get the full patient passport (requires active consent).
   * @param {string} patientId - OneHealth Patient ID
   */
  async getPatientPassport(patientId) {
    const res = await api.get(`/doctor/patients/${patientId}`)
    return res.data
  },

  /**
   * Get patient medical timeline (requires active consent).
   * @param {string} patientId - OneHealth Patient ID
   */
  async getPatientTimeline(patientId) {
    const res = await api.get(`/doctor/patients/${patientId}/timeline`)
    return res.data
  },

  /**
   * Get patient medications (requires active consent).
   * @param {string} patientId - OneHealth Patient ID
   */
  async getPatientMedications(patientId) {
    const res = await api.get(`/doctor/patients/${patientId}/medications`)
    return res.data
  },

  /**
   * Search for doctors by name, specialisation, or hospital.
   * @param {string} query - Search query string
   */
  async searchDoctors(query = '') {
    const params = query ? { q: query } : {}
    const res = await api.get('/doctor/search', { params })
    return res.data
  },

  /**
   * Get a single doctor's discoverable profile.
   * @param {string} doctorUid - Doctor's Firebase UID
   */
  async getDoctorProfile(doctorUid) {
    const res = await api.get(`/doctor/${doctorUid}/profile`)
    return res.data
  },

  /**
   * Save a consultation (requires active consent for the patient).
   * @param {Object} consultationData - { patient_id, diagnosis, symptoms, ... }
   */
  async saveConsultation(consultationData) {
    const res = await api.post('/doctor/consultations', consultationData)
    return res.data
  },

  /**
   * Register a new doctor dynamically.
   * @param {Object} doctorData
   */
  async registerDoctor(doctorData) {
    const res = await api.post('/doctor/register', doctorData)
    return res.data
  },

  /**
   * Authenticate a doctor.
   * @param {Object} credentials - { email, password }
   */
  async loginDoctor(credentials) {
    const res = await api.post('/doctor/login', credentials)
    return res.data
  },

  /**
   * Doctor prescribes a medication to a patient.
   * @param {Object} prescriptionData - { patient_id, name, dosage, frequency, timing, instructions, days }
   */
  async prescribeMedication(prescriptionData) {
    const res = await api.post('/doctor/prescribe', prescriptionData)
    return res.data
  },
}

export default doctorService
