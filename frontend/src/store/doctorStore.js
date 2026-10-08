import { create } from 'zustand';
import doctorService from '../services/doctorService';

// ── Doctor Patient Store ──────────────────────────────────────────────────────
// Manages the list of patients accessible to the doctor (via active consent).
// Sensitive patient data is NOT persisted to localStorage.
export const useDoctorStore = create((set, get) => ({
  // ── Patient Directory State ──────────────────────────────────────────────
  patients: [],
  patientsLoading: false,
  patientsError: null,

  // ── Patient Passport State ───────────────────────────────────────────────
  selectedPatient: null,
  selectedPatientLoading: false,
  selectedPatientError: null,

  // ── Patient ID Search State ──────────────────────────────────────────────
  patientSearchResult: null,
  patientSearchLoading: false,
  patientSearchError: null,

  // ── Dashboard Stats ──────────────────────────────────────────────────────
  appointments: [],
  stats: {
    totalPatients: 0,
    todaysConsultations: 0,
    pendingFollowUps: 0,
  },
  isLoading: false,

  // ── Actions ──────────────────────────────────────────────────────────────

  /** Fetch all patients with active consent for this doctor */
  fetchPatients: async (search = '') => {
    set({ patientsLoading: true, patientsError: null });
    try {
      const data = await doctorService.getDoctorPatients(search);
      set({
        patients: data.patients || [],
        patientsLoading: false,
        stats: {
          ...get().stats,
          totalPatients: data.count || 0,
        }
      });
    } catch (err) {
      const message = err.response?.data?.error?.message
        || err.response?.data?.error
        || err.message
        || 'Failed to load patients';
      set({ patientsLoading: false, patientsError: message });
    }
  },

  /** Search patient by OneHealth Patient ID */
  searchPatientById: async (patientId) => {
    set({ patientSearchLoading: true, patientSearchError: null, patientSearchResult: null });
    try {
      const data = await doctorService.searchPatientById(patientId);
      set({ patientSearchResult: data.patient || null, patientSearchLoading: false });
    } catch (err) {
      const status = err.response?.status;
      let message;
      if (status === 404) {
        message = 'Patient not found or access not granted.';
      } else if (status === 403) {
        message = 'This patient has not granted you access to their health passport.';
      } else {
        message = err.response?.data?.error?.message || 'Search failed. Please try again.';
      }
      set({ patientSearchLoading: false, patientSearchError: message });
    }
  },

  /** Fetch full patient passport by patient_id */
  fetchPatientPassport: async (patientId) => {
    set({ selectedPatientLoading: true, selectedPatientError: null, selectedPatient: null });
    try {
      const data = await doctorService.getPatientPassport(patientId);
      set({ selectedPatient: data.patient || null, selectedPatientLoading: false });
    } catch (err) {
      const status = err.response?.status;
      let message;
      if (status === 403) {
        message = 'Access denied. The patient has not granted you access to their health passport.';
      } else if (status === 404) {
        message = 'Patient not found.';
      } else {
        message = err.response?.data?.error?.message || 'Failed to load patient passport.';
      }
      set({ selectedPatientLoading: false, selectedPatientError: message });
    }
  },

  clearPatientSearch: () => set({ patientSearchResult: null, patientSearchError: null }),
  clearSelectedPatient: () => set({ selectedPatient: null, selectedPatientError: null }),

  setPatients: (patients) => set({ patients }),
  setAppointments: (appointments) => set({ appointments }),
  setStats: (stats) => set({ stats }),
  setLoading: (isLoading) => set({ isLoading }),
}));

// ── Consultation Session Store ─────────────────────────────────────────────────
export const useConsultationStore = create((set, get) => ({
  activePatientId: null,   // OneHealth Patient ID (OH-P-XXXXX)
  activePatient: null,     // Full patient data object

  diagnosis: '',
  severity: 'moderate',
  symptoms: [],
  treatmentPlan: '',
  doctorNotes: '',
  prescriptions: [],
  aiSummary: null,

  setActivePatient: (patientId, patientData = null) => set({
    activePatientId: patientId,
    activePatient: patientData
  }),

  updateDiagnosisField: (field, value) => set({ [field]: value }),

  addSymptom: (symptom) => set({ symptoms: [...get().symptoms, symptom] }),
  removeSymptom: (symptom) => set({ symptoms: get().symptoms.filter(s => s !== symptom) }),

  addPrescription: (med) => set({ prescriptions: [...get().prescriptions, med] }),
  removePrescription: (index) => set({ prescriptions: get().prescriptions.filter((_, i) => i !== index) }),

  setAiSummary: (summary) => set({ aiSummary: summary }),

  resetConsultation: () => set({
    activePatientId: null,
    activePatient: null,
    diagnosis: '',
    severity: 'moderate',
    symptoms: [],
    treatmentPlan: '',
    doctorNotes: '',
    prescriptions: [],
    aiSummary: null,
  })
}));
