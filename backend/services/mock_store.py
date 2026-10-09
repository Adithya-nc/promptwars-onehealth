"""
Mock Data Store
Centralizes all mock data for MOCK_MODE development.
This keeps mock data isolated from production code paths.
"""
from datetime import datetime

# Mock Users (patients + doctors)
MOCK_USERS = {
    # Patients
    'mock-patient-uid-001': {
        'uid': 'mock-patient-uid-001',
        'patient_id': 'OH-P-AAAB2C3',
        'role': 'patient',
        'name': 'Priya Sharma',
        'email': 'patient@test.com',
        'phone': '+91 98765 43210',
        'profile': {
            'dob': '1994-08-15',
            'gender': 'female',
            'blood_group': 'O+',
            'height_cm': 165,
            'weight_kg': 58,
            'allergies': ['Penicillin', 'Dust Mites'],
            'chronic_diseases': ['Mild Asthma'],
            'emergency_contacts': [
                {'name': 'Rahul Sharma', 'relationship': 'Spouse', 'phone': '+91 99887 76655'}
            ]
        },
        'createdAt': '2026-01-01T00:00:00'
    },
    'mock-patient-uid-002': {
        'uid': 'mock-patient-uid-002',
        'patient_id': 'OH-P-BBB3D4E',
        'role': 'patient',
        'name': 'Arjun Mehta',
        'email': 'arjun@test.com',
        'phone': '+91 91234 56789',
        'profile': {
            'dob': '1980-03-22',
            'gender': 'male',
            'blood_group': 'A+',
            'height_cm': 175,
            'weight_kg': 80,
            'allergies': ['Sulfa drugs'],
            'chronic_diseases': ['Hypertension', 'Type 2 Diabetes'],
            'emergency_contacts': [
                {'name': 'Sunita Mehta', 'relationship': 'Wife', 'phone': '+91 98800 12345'}
            ]
        },
        'createdAt': '2026-01-15T00:00:00'
    },
    # Doctors
    'mock-doctor-uid-001': {
        'uid': 'mock-doctor-uid-001',
        'role': 'doctor',
        'name': 'Sarah Smith',
        'email': 'doctor@test.com',
        'doctor_profile': {
            'specialisation': 'Cardiology',
            'hospital': 'Apollo Hospital',
            'registration_number': 'MCI-2021-45678',
            'verified': True,
            'bio': 'Expert cardiologist with 12+ years of experience.'
        },
        'createdAt': '2026-01-01T00:00:00'
    },
    'mock-doctor-uid-002': {
        'uid': 'mock-doctor-uid-002',
        'role': 'doctor',
        'name': 'Rahul Kumar',
        'email': 'rahul.dr@test.com',
        'doctor_profile': {
            'specialisation': 'General Medicine',
            'hospital': 'City Medical Center',
            'registration_number': 'MCI-2019-12345',
            'verified': True,
            'bio': 'General physician specializing in preventive healthcare.'
        },
        'createdAt': '2026-01-01T00:00:00'
    },
    'mock-doctor-uid-003': {
        'uid': 'mock-doctor-uid-003',
        'role': 'doctor',
        'name': 'Priya Nair',
        'email': 'priya.dr@test.com',
        'doctor_profile': {
            'specialisation': 'Neurology',
            'hospital': 'NIMHANS',
            'registration_number': 'MCI-2020-98765',
            'verified': False,
            'bio': 'Neurologist focusing on migraine and epilepsy management.'
        },
        'createdAt': '2026-02-01T00:00:00'
    }
}

# Patient ID → UID lookup
MOCK_PATIENT_ID_TO_UID = {
    user['patient_id']: uid
    for uid, user in MOCK_USERS.items()
    if user.get('role') == 'patient' and user.get('patient_id')
}

# Mock Medications per patient UID
MOCK_PATIENT_MEDICATIONS = {
    'mock-patient-uid-001': [
        {
            'id': 'med-001',
            'name': 'Salbutamol 100mcg',
            'dosage': '2 puffs',
            'frequency': 'as_needed',
            'timing': [],
            'start_date': '2026-04-01',
            'end_date': '2026-12-31',
            'instructions': 'Use inhaler as needed for breathing difficulty.',
            'status': 'active',
            'remaining_days': 84,
            'prescribed_by': 'Dr. Sarah Smith',
            'taken_today': True,
            'adherence_percent': 94,
            'missed_doses': 1
        },
        {
            'id': 'med-002',
            'name': 'Montelukast 10mg',
            'dosage': '1 tablet',
            'frequency': 'once',
            'timing': ['21:00'],
            'start_date': '2026-05-01',
            'end_date': '2026-11-01',
            'instructions': 'Take at bedtime.',
            'status': 'active',
            'remaining_days': 24,
            'prescribed_by': 'Dr. Sarah Smith',
            'taken_today': False,
            'adherence_percent': 88,
            'missed_doses': 3
        }
    ],
    'mock-patient-uid-002': [
        {
            'id': 'med-003',
            'name': 'Metformin 1000mg',
            'dosage': '1 tablet',
            'frequency': 'twice',
            'timing': ['08:00', '20:00'],
            'start_date': '2026-01-01',
            'end_date': '2026-12-31',
            'instructions': 'Take with meals.',
            'status': 'active',
            'remaining_days': 84,
            'prescribed_by': 'Dr. Sarah Smith',
            'taken_today': True,
            'adherence_percent': 97,
            'missed_doses': 0
        },
        {
            'id': 'med-004',
            'name': 'Amlodipine 5mg',
            'dosage': '1 tablet',
            'frequency': 'once',
            'timing': ['09:00'],
            'start_date': '2026-03-01',
            'end_date': '2026-09-01',
            'instructions': 'Take in the morning.',
            'status': 'active',
            'remaining_days': 6,
            'prescribed_by': 'Dr. Sarah Smith',
            'taken_today': False,
            'adherence_percent': 90,
            'missed_doses': 2
        }
    ]
}

# Mock Medical Timeline per patient UID
MOCK_PATIENT_TIMELINE = {
    'mock-patient-uid-001': [
        {
            'id': 'tl-001',
            'type': 'Consultation',
            'title': 'Asthma Follow-up',
            'date': '2026-10-01T10:00:00',
            'doctor': 'Dr. Sarah Smith',
            'hospital': 'Apollo Hospital',
            'description': 'Patient reported improved breathing. Inhaler technique corrected.',
            'status': 'normal'
        },
        {
            'id': 'tl-002',
            'type': 'Report',
            'title': 'Spirometry Test',
            'date': '2026-09-20T09:00:00',
            'doctor': 'City Lab',
            'hospital': 'Apollo Diagnostics',
            'description': 'FEV1/FVC ratio: 0.72. Mild obstructive pattern consistent with asthma.',
            'status': 'attention'
        },
        {
            'id': 'tl-003',
            'type': 'Vaccination',
            'title': 'Annual Flu Shot',
            'date': '2026-09-01T11:00:00',
            'doctor': 'Nurse Station',
            'hospital': 'Apollo Hospital',
            'description': 'Tetravalent influenza vaccine administered.',
            'status': 'normal'
        }
    ],
    'mock-patient-uid-002': [
        {
            'id': 'tl-004',
            'type': 'Consultation',
            'title': 'Diabetes Review',
            'date': '2026-10-05T09:00:00',
            'doctor': 'Dr. Sarah Smith',
            'hospital': 'Apollo Hospital',
            'description': 'HbA1c: 7.2%. Blood pressure: 138/88 mmHg. Diet counseling provided.',
            'status': 'attention'
        },
        {
            'id': 'tl-005',
            'type': 'Report',
            'title': 'HbA1c & Lipid Panel',
            'date': '2026-10-02T08:00:00',
            'doctor': 'City Lab',
            'hospital': 'Apollo Diagnostics',
            'description': 'HbA1c: 7.2%, LDL: 145 mg/dL, HDL: 42 mg/dL.',
            'status': 'attention'
        }
    ]
}

# Mock Medical Records per patient UID
MOCK_PATIENT_RECORDS = {
    'mock-patient-uid-001': [
        {
            'id': 'rec-001',
            'type': 'report',
            'title': 'Spirometry Test Report',
            'date': '2026-09-20',
            'file_url': None,
            'metadata': {'hospital': 'Apollo Diagnostics', 'doctor_name': 'Dr. Sarah Smith'},
            'ai_analysis': {
                'summary': 'Mild obstructive pattern. No significant deterioration.',
                'status': 'attention'
            }
        }
    ],
    'mock-patient-uid-002': [
        {
            'id': 'rec-002',
            'type': 'report',
            'title': 'HbA1c Report',
            'date': '2026-10-02',
            'file_url': None,
            'metadata': {'hospital': 'Apollo Diagnostics', 'doctor_name': 'City Lab'},
            'ai_analysis': {
                'summary': 'HbA1c at 7.2%. Borderline controlled diabetes.',
                'status': 'attention'
            }
        }
    ]
}


def get_mock_user(uid: str) -> dict | None:
    """Get a mock user by UID."""
    return MOCK_USERS.get(uid)


def get_mock_patient_by_id(patient_id: str) -> dict | None:
    """Lookup patient by their OneHealth Patient ID or UID."""
    if not patient_id:
        return None
    # Check direct UID match first
    if patient_id in MOCK_USERS and MOCK_USERS[patient_id].get('role') == 'patient':
        return MOCK_USERS[patient_id]
    # Check by Patient ID (e.g. OH-P-AAAB2C3)
    uid = MOCK_PATIENT_ID_TO_UID.get(patient_id.strip().upper())
    if uid:
        return MOCK_USERS.get(uid)
    # Case-insensitive UID fallback
    for u_id, u_data in MOCK_USERS.items():
        if u_data.get('role') == 'patient':
            if u_id.lower() == patient_id.lower() or u_data.get('patient_id', '').upper() == patient_id.strip().upper():
                return u_data
    return None


def search_mock_doctors(query: str = '') -> list:
    """Search mock doctors by name, specialisation, or hospital."""
    doctors = []
    for uid, user in MOCK_USERS.items():
        if user.get('role') != 'doctor':
            continue
        dp = user.get('doctor_profile', {})
        doc_info = {
            'uid': uid,
            'name': user.get('name', ''),
            'email': user.get('email', ''),
            'specialisation': dp.get('specialisation', ''),
            'hospital': dp.get('hospital', ''),
            'registration_number': dp.get('registration_number', ''),
            'verified': dp.get('verified', False),
            'bio': dp.get('bio', ''),
        }
        if not query:
            doctors.append(doc_info)
            continue
        q = query.lower()
        if (q in doc_info['name'].lower()
                or q in doc_info['specialisation'].lower()
                or q in doc_info['hospital'].lower()):
            doctors.append(doc_info)
    return doctors


def get_mock_patient_medications(patient_uid: str) -> list:
    """Get medications for a patient, resolving by UID or OneHealth Patient ID."""
    uid = MOCK_PATIENT_ID_TO_UID.get(patient_uid, patient_uid)
    return MOCK_PATIENT_MEDICATIONS.get(uid, [])


def get_mock_patient_timeline(patient_uid: str) -> list:
    """Get timeline entries for a patient, resolving by UID or OneHealth Patient ID."""
    uid = MOCK_PATIENT_ID_TO_UID.get(patient_uid, patient_uid)
    return MOCK_PATIENT_TIMELINE.get(uid, [])


def get_mock_patient_records(patient_uid: str) -> list:
    """Get medical records for a patient, resolving by UID or OneHealth Patient ID."""
    uid = MOCK_PATIENT_ID_TO_UID.get(patient_uid, patient_uid)
    return MOCK_PATIENT_RECORDS.get(uid, [])


def add_mock_patient_record(patient_uid: str, data: dict) -> dict:
    """Add an uploaded medical record or report to patient and update medical timeline."""
    import time
    uid = MOCK_PATIENT_ID_TO_UID.get(patient_uid, patient_uid)
    rec_id = data.get('id') or f"rec-{int(time.time() * 1000)}"
    user = get_mock_user(uid)
    patient_id = (user.get('patient_id') if user else '') or data.get('patient_id', '')
    
    # Auto-detect date or fallback
    record_date = data.get('date') or datetime.utcnow().isoformat().split('T')[0]
    title = data.get('title') or 'Diagnostic Lab Report'
    rec_type = data.get('type') or 'report'
    
    metadata = data.get('metadata') or {}
    if not isinstance(metadata, dict):
        metadata = {}
    if 'doctor_name' not in metadata:
        metadata['doctor_name'] = data.get('doctor_name', 'oneHealth AI')
    if 'hospital' not in metadata:
        metadata['hospital'] = data.get('hospital', 'Clinical Pathology Lab')
    if 'notes' not in metadata:
        metadata['notes'] = data.get('notes', '')
        
    ai_analysis = data.get('ai_analysis')
    
    record = {
        'id': rec_id,
        'type': rec_type,
        'title': title,
        'date': record_date,
        'patient_id': patient_id,
        'file_url': data.get('file_url'),
        'metadata': metadata,
        'ai_analysis': ai_analysis
    }
    
    if uid not in MOCK_PATIENT_RECORDS:
        MOCK_PATIENT_RECORDS[uid] = []
    # Avoid duplicate ID if existing
    MOCK_PATIENT_RECORDS[uid] = [r for r in MOCK_PATIENT_RECORDS[uid] if r.get('id') != rec_id]
    MOCK_PATIENT_RECORDS[uid].insert(0, record)
    
    # Also update patient timeline so doctor and patient timeline views immediately show it
    if uid not in MOCK_PATIENT_TIMELINE:
        MOCK_PATIENT_TIMELINE[uid] = []
        
    tl_id = f"tl-{rec_id}"
    MOCK_PATIENT_TIMELINE[uid] = [t for t in MOCK_PATIENT_TIMELINE[uid] if t.get('id') != tl_id]
    
    summary_desc = ''
    if ai_analysis and isinstance(ai_analysis, dict):
        summary_desc = ai_analysis.get('summary') or ai_analysis.get('overall_summary') or ''
    if not summary_desc:
        summary_desc = metadata.get('notes') or f"Diagnostic {rec_type} filed to OneHealth Passport."
        
    MOCK_PATIENT_TIMELINE[uid].insert(0, {
        'id': tl_id,
        'type': 'Report' if rec_type == 'report' else rec_type.capitalize(),
        'title': title,
        'date': record_date,
        'doctor': metadata.get('doctor_name', 'oneHealth AI'),
        'hospital': metadata.get('hospital', 'Diagnostic Center'),
        'description': summary_desc,
        'status': 'attention' if (ai_analysis and ai_analysis.get('abnormal_findings')) else 'normal'
    })
    
    return record


def register_mock_patient(data: dict) -> dict:
    """Register a new mock patient with a unique Patient ID."""
    from services.patient_id_service import generate_patient_id
    import time
    
    uid = data.get('uid') or f"pat-{int(time.time() * 1000)}"
    patient_id = data.get('patient_id') or generate_patient_id()
    name = data.get('name', 'Registered Patient')
    email = data.get('email', '')
    phone = data.get('phone', '')
    
    height = None
    if data.get('height_cm'):
        try:
            height = float(data['height_cm'])
        except (ValueError, TypeError):
            pass
            
    weight = None
    if data.get('weight_kg'):
        try:
            weight = float(data['weight_kg'])
        except (ValueError, TypeError):
            pass

    profile = {
        'dob': data.get('dob', ''),
        'gender': data.get('gender', ''),
        'blood_group': data.get('blood_group', ''),
        'height_cm': height,
        'weight_kg': weight,
        'allergies': data.get('allergies', []),
        'chronic_diseases': data.get('chronic_diseases', []),
        'emergency_contacts': data.get('emergency_contacts', []),
        'medical_notes': data.get('medical_notes', ''),
        'lifestyle': data.get('lifestyle', {}),
    }
    
    user = {
        'uid': uid,
        'patient_id': patient_id,
        'role': 'patient',
        'name': name,
        'email': email,
        'phone': phone,
        'profile': profile,
        'createdAt': datetime.utcnow().isoformat()
    }
    
    MOCK_USERS[uid] = user
    MOCK_PATIENT_ID_TO_UID[patient_id] = uid
    MOCK_PATIENT_MEDICATIONS[uid] = data.get('medications', [])
    MOCK_PATIENT_TIMELINE[uid] = [
        {
            'id': f"tl-reg-{int(time.time())}",
            'type': 'Registration',
            'title': 'OneHealth Passport Created',
            'date': datetime.utcnow().isoformat(),
            'doctor': 'System',
            'hospital': 'ABDM Digital Health',
            'description': f"Health passport generated with Unique Patient ID: {patient_id}",
            'status': 'normal'
        }
    ]
    
    # Store initial optional reports
    reports = data.get('reports', [])
    MOCK_PATIENT_RECORDS[uid] = []
    for r in reports:
        rec_id = f"rec-{int(time.time()*1000)}"
        rec = {
            'id': rec_id,
            'type': r.get('type', 'report'),
            'title': r.get('title', 'Initial Lab Report'),
            'date': r.get('date', datetime.utcnow().isoformat().split('T')[0]),
            'patient_id': patient_id,
            'metadata': {
                'doctor_name': r.get('doctor_name', 'Self-Uploaded'),
                'hospital': r.get('hospital', ''),
                'notes': r.get('notes', ''),
                'file_name': r.get('file_name', '')
            },
            'ai_analysis': r.get('ai_analysis')
        }
        MOCK_PATIENT_RECORDS[uid].append(rec)
        MOCK_PATIENT_TIMELINE[uid].insert(0, {
            'id': f"tl-{rec_id}",
            'type': 'Report',
            'title': rec['title'],
            'date': rec['date'],
            'doctor': rec['metadata']['doctor_name'],
            'hospital': rec['metadata']['hospital'] or 'OneHealth Vault',
            'description': 'Initial report attached during registration onboarding.',
            'status': 'normal'
        })
        
    return user


def register_mock_doctor(data: dict) -> dict:
    """Register a new mock doctor and make them searchable in directory."""
    import time
    uid = data.get('uid') or f"doc-{int(time.time() * 1000)}"
    name = data.get('name') or f"Dr. {data.get('firstName', '')} {data.get('lastName', '')}".strip()
    if not name.lower().startswith('dr'):
        name = f"Dr. {name}"
        
    doctor_profile = {
        'specialisation': data.get('specialisation') or data.get('specialization', 'General Medicine'),
        'hospital': data.get('hospital', 'City Medical Center'),
        'registration_number': data.get('registration_number') or data.get('medicalCouncilNumber', f"MCI-2026-{int(time.time())%100000}"),
        'verified': True,
        'bio': data.get('bio') or f"{data.get('experience', '5+')} years experience in {data.get('specialisation', 'healthcare')}.",
    }
    
    user = {
        'uid': uid,
        'role': 'doctor',
        'name': name,
        'email': data.get('email', ''),
        'phone': data.get('phone', ''),
        'doctor_profile': doctor_profile,
        'createdAt': datetime.utcnow().isoformat()
    }
    
    MOCK_USERS[uid] = user
    return user


def add_mock_prescription(patient_uid: str, prescription: dict, doctor_name: str = 'Attending Doctor') -> dict:
    """Add a prescribed medication to patient and update medical timeline."""
    import time
    med_id = f"med-{int(time.time() * 1000)}"
    new_med = {
        'id': med_id,
        'name': prescription.get('name', 'Prescription Drug'),
        'dosage': prescription.get('dosage', '1 dose'),
        'frequency': prescription.get('frequency', 'once_daily'),
        'timing': prescription.get('timing', ['08:00']),
        'start_date': prescription.get('start_date', datetime.utcnow().isoformat().split('T')[0]),
        'end_date': prescription.get('end_date', '2026-12-31'),
        'instructions': prescription.get('instructions', 'Take as advised by doctor.'),
        'status': 'active',
        'remaining_days': prescription.get('days', 14),
        'prescribed_by': doctor_name,
        'taken_today': False,
        'adherence_percent': 100,
        'missed_doses': 0
    }
    
    if patient_uid not in MOCK_PATIENT_MEDICATIONS:
        MOCK_PATIENT_MEDICATIONS[patient_uid] = []
    MOCK_PATIENT_MEDICATIONS[patient_uid].insert(0, new_med)
    
    if patient_uid not in MOCK_PATIENT_TIMELINE:
        MOCK_PATIENT_TIMELINE[patient_uid] = []
    MOCK_PATIENT_TIMELINE[patient_uid].insert(0, {
        'id': f"tl-{med_id}",
        'type': 'Prescription',
        'title': f"Prescription: {new_med['name']}",
        'date': datetime.utcnow().isoformat(),
        'doctor': doctor_name,
        'hospital': 'OneHealth Clinic',
        'description': f"{new_med['dosage']} • {new_med['frequency']} • {new_med['instructions']}",
        'status': 'normal'
    })
    
    return new_med


def find_mock_user_by_email_or_name(identifier: str, role: str = None) -> dict | None:
    """Find a user in mock store by email, phone, name or patient ID."""
    if not identifier:
        return None
    ident = identifier.strip().lower()
    for uid, user in MOCK_USERS.items():
        if role and user.get('role') != role:
            continue
        if (user.get('email', '').lower() == ident
            or user.get('name', '').lower() == ident
            or user.get('phone', '') == ident
            or user.get('patient_id', '').upper() == ident.upper()
            or uid.lower() == ident):
            return user
    return None
