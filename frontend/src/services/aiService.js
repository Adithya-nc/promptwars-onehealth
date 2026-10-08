import api from './api'

export const aiService = {
  // Symptom Analyzer API
  async analyzeSymptoms(data) {
    // data: { symptoms: string[], duration: string, profile: object }
    const response = await api.post('/ai/symptoms', data)
    return response.data
  },

  // Feedback Analytics API
  async analyzeFeedback(feedbackText, type) {
    const response = await api.post('/ai/feedback', { text: feedbackText, type })
    return response.data
  },

  // Health Report Generator API
  async generateHealthReport(sources, patientId) {
    const response = await api.post('/ai/report', { sources, patientId })
    return response.data
  },

  // Emergency Guidance API
  async getEmergencyGuidance(query, patientData) {
    const response = await api.post('/ai/emergency', { query, patientData })
    return response.data
  },

  // Clinical Lab Report Analyzer API
  async analyzeReport(data) {
    const response = await api.post('/ai/analyze-report', data)
    return response.data
  }
}
