export const ROUTES = {
  LANDING:        '/',
  LOGIN:          '/login',
  REGISTER:       '/register',
  OTP:            '/otp',
  ONBOARDING:     '/onboarding',
  DASHBOARD:      '/dashboard',
  PASSPORT:       '/passport',
  SYMPTOMS:       '/symptoms',
  EMERGENCY:      '/emergency',
  REPORTS:        '/reports',
  MEDICATIONS:    '/medications',
  RISK:           '/risk',
  SETTINGS:       '/settings',
  DOCTOR:         '/doctor',
  ADMIN:          '/admin',
  FEEDBACK:       '/feedback-analytics',
  REPORT_GEN:     '/health-report',
}

export const RECORD_TYPES = ['report', 'prescription', 'diagnosis', 'vaccination', 'symptom_check', 'treatment', 'followup']
export const FILTER_TABS = ['all', 'report', 'prescription', 'diagnosis', 'vaccination']

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
export const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say']

export const COMMON_ALLERGIES = [
  'Penicillin', 'Sulfonamides', 'Aspirin', 'NSAIDs', 'Peanuts', 'Shellfish',
  'Dairy', 'Gluten', 'Dust', 'Pollen', 'Latex', 'Bee Stings',
]

export const COMMON_CONDITIONS = [
  'Diabetes', 'Hypertension', 'Asthma', 'Thyroid (Hypo)', 'Thyroid (Hyper)',
  'Heart Disease', 'COPD', 'Arthritis', 'Migraine', 'Depression/Anxiety',
  'Kidney Disease', 'Liver Disease',
]

export const SYMPTOM_CATEGORIES = {
  General:        ['Fever', 'Fatigue', 'Weakness', 'Loss of Appetite', 'Weight Loss', 'Night Sweats'],
  Respiratory:    ['Cough', 'Shortness of Breath', 'Wheezing', 'Chest Pain', 'Sore Throat', 'Runny Nose'],
  Digestive:      ['Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Abdominal Pain', 'Bloating'],
  Neurological:   ['Headache', 'Dizziness', 'Numbness', 'Tingling', 'Memory Issues', 'Confusion'],
  Musculoskeletal:['Body Ache', 'Joint Pain', 'Back Pain', 'Neck Pain', 'Muscle Cramps', 'Swelling'],
  Skin:           ['Rash', 'Itching', 'Hives', 'Dry Skin', 'Bruising', 'Yellowing (Jaundice)'],
}

export const DURATION_OPTIONS = [
  { label: 'Less than 1 day', value: '<1day' },
  { label: '1–3 days', value: '1-3days' },
  { label: '4–7 days', value: '4-7days' },
  { label: '1–2 weeks', value: '1-2weeks' },
  { label: 'More than 2 weeks', value: '>2weeks' },
]

export const COMMON_VACCINES = [
  'BCG', 'Oral Polio (OPV)', 'Hepatitis B', 'DPT (Diphtheria/Pertussis/Tetanus)',
  'MMR (Measles/Mumps/Rubella)', 'Typhoid', 'Hepatitis A', 'Varicella (Chickenpox)',
  'COVID-19 (Primary)', 'COVID-19 (Booster)', 'Influenza (Annual)', 'HPV',
]

export const NAV_ITEMS = [
  { path: '/dashboard',          label: 'Dashboard',        icon: 'LayoutDashboard' },
  { path: '/passport',           label: 'Health Passport',  icon: 'BookHeart' },
  { path: '/symptoms',           label: 'Symptom Check',    icon: 'Stethoscope' },
  { path: '/reports',            label: 'Report Analyzer',  icon: 'FileSearch' },
  { path: '/medications',        label: 'Medications',      icon: 'Pill' },
  { path: '/risk',               label: 'Risk Prediction',  icon: 'Activity' },
  { path: '/feedback-analytics', label: 'Feedback AI',      icon: 'BarChart3' },
  { path: '/health-report',      label: 'AI Health Report', icon: 'FileText' },
]
