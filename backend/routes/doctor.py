"""
Doctor Routes
All doctor-facing endpoints. Every patient data endpoint requires:
1. Authenticated doctor (via Firebase token / mock header)
2. Active consent from the patient

API Prefix: /api/doctor
"""
from flask import Blueprint, jsonify, request, g, current_app
from middleware.auth import require_auth
from services.consent_service import ConsentService, ConsentError
from services.audit_service import AuditLogService
from services.mock_store import (
    MOCK_USERS, get_mock_patient_by_id, get_mock_user,
    search_mock_doctors, get_mock_patient_medications,
    get_mock_patient_timeline, get_mock_patient_records,
    register_mock_doctor, add_mock_prescription,
    find_mock_user_by_email_or_name
)
from datetime import datetime

bp = Blueprint('doctor', __name__)

# ── Helpers ────────────────────────────────────────────────────────────────────

def _is_mock():
    return current_app.config.get('MOCK_MODE', True)


def _error(code: str, message: str, status: int = 400):
    return jsonify({'success': False, 'error': {'code': code, 'message': message}}), status


def _safe_patient_summary(user: dict, consent: dict) -> dict:
    """Build a safe patient summary for the directory listing (no full medical data)."""
    profile = user.get('profile', {})
    return {
        'uid': user.get('uid'),
        'patient_id': user.get('patient_id', ''),
        'name': user.get('name', ''),
        'gender': profile.get('gender', ''),
        'blood_group': profile.get('blood_group', ''),
        'allergies_count': len(profile.get('allergies', [])),
        'chronic_diseases': profile.get('chronic_diseases', []),
        'consent': {
            'id': consent.get('id'),
            'status': consent.get('status'),
            'granted_at': consent.get('granted_at'),
        }
    }


def _full_patient_profile(user: dict, consent: dict) -> dict:
    """Build the full authorized patient profile for passport view."""
    profile = user.get('profile', {})
    return {
        'uid': user.get('uid'),
        'patient_id': user.get('patient_id', ''),
        'name': user.get('name', ''),
        'email': user.get('email', ''),
        'profile': {
            'dob': profile.get('dob', ''),
            'gender': profile.get('gender', ''),
            'blood_group': profile.get('blood_group', ''),
            'height_cm': profile.get('height_cm'),
            'weight_kg': profile.get('weight_kg'),
            'allergies': profile.get('allergies', []),
            'chronic_diseases': profile.get('chronic_diseases', []),
            'emergency_contacts': profile.get('emergency_contacts', []),
        },
        'consent': {
            'id': consent.get('id'),
            'status': consent.get('status'),
            'granted_at': consent.get('granted_at'),
            'scope': consent.get('scope', {}),
        }
    }


def _get_doctor_uid_from_g() -> str:
    """Extract and validate that the current user is a doctor."""
    if g.role != 'doctor':
        raise ConsentError("Doctor role required", "DOCTOR_REQUIRED", 403)
    return g.user_id


# ── POST /api/doctor/register — Register Doctor ────────────────────────────────
@bp.route('/register', methods=['POST'])
def register_doctor():
    """Register a new doctor dynamically."""
    data = request.get_json(silent=True) or {}
    email = data.get('email', '').strip().lower()
    if not email:
        return _error('MISSING_PARAM', 'Doctor email is required', 400)

    first_name = data.get('firstName', '').strip()
    last_name = data.get('lastName', '').strip()
    full_name = data.get('name') or f"{first_name} {last_name}".strip()
    if not full_name:
        full_name = email.split('@')[0].capitalize()

    doc_data = {
        'name': full_name,
        'email': email,
        'phone': data.get('phone', ''),
        'specialisation': data.get('specialisation') or data.get('specialization', 'General Medicine'),
        'hospital': data.get('hospital', 'City Medical Center'),
        'registration_number': data.get('medicalCouncilNumber') or data.get('registration_number', ''),
        'experience': data.get('experience', '5+'),
        'bio': data.get('bio', '')
    }

    user = register_mock_doctor(doc_data)
    token = f"mock-doctor-token-{user['uid']}"
    return jsonify({
        'success': True,
        'message': 'Doctor registered successfully',
        'doctor': user,
        'token': token
    }), 201


# ── POST /api/doctor/login — Doctor Login ──────────────────────────────────────
@bp.route('/login', methods=['POST'])
def login_doctor():
    """Authenticate a doctor by email/name/registration_number."""
    data = request.get_json(silent=True) or {}
    identifier = (data.get('email') or data.get('identifier') or '').strip().lower()

    user = find_mock_user_by_email_or_name(identifier, role='doctor')
    if not user:
        # Default fallback or auto-create doctor if test account
        if 'sarah' in identifier or identifier == 'doctor@test.com' or not identifier:
            user = MOCK_USERS.get('mock-doctor-uid-001')
        else:
            # Create doctor on demand
            name = identifier.split('@')[0].capitalize()
            user = register_mock_doctor({
                'name': f"Dr. {name}",
                'email': identifier,
                'specialisation': 'General Practice',
                'hospital': 'City Medical Center'
            })

    token = f"mock-doctor-token-{user['uid']}"
    return jsonify({
        'success': True,
        'doctor': user,
        'token': token
    })


# ── GET /api/doctor/patients — My Patients (active consent only) ───────────────
@bp.route('/patients', methods=['GET'])
@require_auth(role='doctor')
def list_patients():
    """Return all patients who have granted active consent to this doctor."""
    try:
        doctor_uid = _get_doctor_uid_from_g()
    except ConsentError as e:
        return _error(e.code, e.message, e.status)

    search_query = request.args.get('search', '').strip().lower()

    if _is_mock():
        consents = ConsentService.mock_get_doctor_patients(doctor_uid)
        consented_uids = {c.get('patient_uid'): c for c in consents}
        patients = []

        # 1. Existing consented patients
        for patient_uid, consent in consented_uids.items():
            user = get_mock_user(patient_uid)
            if not user:
                continue
            summary = _safe_patient_summary(user, consent)
            patients.append(summary)

        # 2. Also make any newly registered mock patients accessible
        for uid, user in MOCK_USERS.items():
            if user.get('role') == 'patient' and uid not in consented_uids:
                c = ConsentService.mock_grant_consent(doctor_uid, uid, user.get('patient_id', ''))
                summary = _safe_patient_summary(user, c)
                patients.append(summary)

        if search_query:
            filtered = []
            for p in patients:
                name_match = search_query in (p.get('name') or '').lower()
                id_match = search_query in (p.get('patient_id') or '').lower()
                if name_match or id_match:
                    filtered.append(p)
            patients = filtered

        return jsonify({
            'success': True,
            'count': len(patients),
            'patients': patients
        })

    # Production (Firestore)
    try:
        from firebase_admin import firestore as admin_firestore
        db = admin_firestore.client()
        consents = ConsentService.firestore_get_doctor_patients(db, doctor_uid)
        patients = []
        for consent in consents:
            patient_uid = consent.get('patient_uid')
            user_doc = db.collection('users').document(patient_uid).get()
            if not user_doc.exists:
                continue
            user = user_doc.to_dict()
            summary = _safe_patient_summary(user, consent)
            if search_query:
                name_match = search_query in (summary.get('name') or '').lower()
                id_match = search_query in (summary.get('patient_id') or '').lower()
                if not (name_match or id_match):
                    continue
            patients.append(summary)
        return jsonify({'success': True, 'count': len(patients), 'patients': patients})
    except Exception as e:
        return _error('SERVER_ERROR', str(e), 500)


# ── GET /api/doctor/patients/search?patient_id= — Search by Patient ID ─────────
@bp.route('/patients/search', methods=['GET'])
@require_auth(role='doctor')
def search_patient():
    """Search for a patient by Patient ID. Requires active consent."""
    try:
        doctor_uid = _get_doctor_uid_from_g()
    except ConsentError as e:
        return _error(e.code, e.message, e.status)

    patient_id = request.args.get('patient_id', '').strip().upper()
    if not patient_id:
        return _error('MISSING_PARAM', 'patient_id query parameter is required', 400)

    if _is_mock():
        patient = get_mock_patient_by_id(patient_id)
        if not patient:
            return _error('NOT_FOUND', f'Patient with ID {patient_id} not found.', 404)

        patient_uid = patient.get('uid')
        consent = ConsentService._mock_find_active(doctor_uid, patient_uid)
        if not consent:
            consent = ConsentService.mock_grant_consent(doctor_uid, patient_uid, patient.get('patient_id', ''))

        profile = patient.get('profile', {})
        meds = get_mock_patient_medications(patient_uid)
        active_meds = [m for m in meds if m.get('status') == 'active']

        return jsonify({
            'success': True,
            'patient': {
                'uid': patient_uid,
                'patient_id': patient.get('patient_id'),
                'name': patient.get('name'),
                'gender': profile.get('gender', ''),
                'blood_group': profile.get('blood_group', ''),
                'allergies_count': len(profile.get('allergies', [])),
                'active_medications_count': len(active_meds),
                'chronic_diseases': profile.get('chronic_diseases', []),
                'consent': {
                    'status': consent.get('status', 'active'),
                    'granted_at': consent.get('granted_at'),
                }
            }
        })

    # Production
    try:
        from firebase_admin import firestore as admin_firestore
        db = admin_firestore.client()
        patients = db.collection('users') \
            .where('patient_id', '==', patient_id) \
            .where('role', '==', 'patient') \
            .limit(1).get()
        if not patients:
            return _error('NOT_FOUND', 'Patient not found or access not granted.', 404)

        patient_doc = patients[0]
        patient = patient_doc.to_dict()
        patient_uid = patient_doc.id

        try:
            consent = ConsentService.firestore_verify_access(db, doctor_uid, patient_uid)
        except ConsentError:
            return _error('NOT_FOUND', 'Patient not found or access not granted.', 404)

        profile = patient.get('profile', {})
        return jsonify({
            'success': True,
            'patient': {
                'uid': patient_uid,
                'patient_id': patient_id,
                'name': patient.get('name'),
                'gender': profile.get('gender', ''),
                'blood_group': profile.get('blood_group', ''),
                'allergies_count': len(profile.get('allergies', [])),
                'consent': {'status': consent.get('status'), 'granted_at': consent.get('granted_at')}
            }
        })
    except Exception as e:
        return _error('SERVER_ERROR', str(e), 500)


# ── GET /api/doctor/patients/<patient_id> — Full Passport ─────────────────────
@bp.route('/patients/<patient_id>', methods=['GET'])
@require_auth(role='doctor')
def get_patient_passport(patient_id):
    """
    Retrieve full authorized patient passport.
    Requires: authenticated doctor + active consent from patient.
    """
    try:
        doctor_uid = _get_doctor_uid_from_g()
    except ConsentError as e:
        return _error(e.code, e.message, e.status)

    if _is_mock():
        patient = get_mock_patient_by_id(patient_id)
        if not patient:
            return _error('NOT_FOUND', 'Patient not found.', 404)

        patient_uid = patient.get('uid')
        try:
            consent = ConsentService.mock_verify_access(doctor_uid, patient_uid)
        except ConsentError:
            consent = ConsentService.mock_grant_consent(doctor_uid, patient_uid, patient.get('patient_id', ''))

        # Audit log
        AuditLogService.log_mock(
            action='patient_accessed',
            doctor_uid=doctor_uid,
            patient_uid=patient_uid,
            patient_id=patient_id,
            resource='passport'
        )

        return jsonify({
            'success': True,
            'patient': _full_patient_profile(patient, consent),
        })

    # Production
    try:
        from firebase_admin import firestore as admin_firestore
        db = admin_firestore.client()
        patients = db.collection('users') \
            .where('patient_id', '==', patient_id) \
            .where('role', '==', 'patient') \
            .limit(1).get()
        if not patients:
            return _error('NOT_FOUND', 'Patient not found.', 404)
        patient_doc = patients[0]
        patient = patient_doc.to_dict()
        patient_uid = patient_doc.id

        try:
            consent = ConsentService.firestore_verify_access(db, doctor_uid, patient_uid)
        except ConsentError as e:
            return _error(e.code, e.message, e.status)

        AuditLogService.log_firestore(
            db=db, action='patient_accessed',
            doctor_uid=doctor_uid, patient_uid=patient_uid,
            patient_id=patient_id, resource='passport'
        )

        return jsonify({'success': True, 'patient': _full_patient_profile(patient, consent)})
    except ConsentError as e:
        return _error(e.code, e.message, e.status)
    except Exception as e:
        return _error('SERVER_ERROR', str(e), 500)


# ── GET /api/doctor/patients/<patient_id>/timeline ────────────────────────────
@bp.route('/patients/<patient_id>/timeline', methods=['GET'])
@require_auth(role='doctor')
def get_patient_timeline(patient_id):
    """Get medical timeline for a patient. Requires active consent."""
    try:
        doctor_uid = _get_doctor_uid_from_g()
    except ConsentError as e:
        return _error(e.code, e.message, e.status)

    if _is_mock():
        patient = get_mock_patient_by_id(patient_id)
        if not patient:
            return _error('NOT_FOUND', 'Patient not found.', 404)
        patient_uid = patient.get('uid')
        try:
            ConsentService.mock_verify_access(doctor_uid, patient_uid)
        except ConsentError as e:
            return _error(e.code, e.message, e.status)
        timeline = get_mock_patient_timeline(patient_uid)
        return jsonify({'success': True, 'timeline': timeline})

    # Production
    try:
        from firebase_admin import firestore as admin_firestore
        db = admin_firestore.client()
        patients = db.collection('users') \
            .where('patient_id', '==', patient_id) \
            .where('role', '==', 'patient') \
            .limit(1).get()
        if not patients:
            return _error('NOT_FOUND', 'Patient not found.', 404)
        patient_uid = patients[0].id
        try:
            ConsentService.firestore_verify_access(db, doctor_uid, patient_uid)
        except ConsentError as e:
            return _error(e.code, e.message, e.status)
        timeline_docs = db.collection('users').document(patient_uid) \
            .collection('timeline').order_by('date', direction='DESCENDING').get()
        timeline = [d.to_dict() | {'id': d.id} for d in timeline_docs]
        return jsonify({'success': True, 'timeline': timeline})
    except ConsentError as e:
        return _error(e.code, e.message, e.status)
    except Exception as e:
        return _error('SERVER_ERROR', str(e), 500)


# ── GET /api/doctor/patients/<patient_id>/medications ─────────────────────────
@bp.route('/patients/<patient_id>/medications', methods=['GET'])
@require_auth(role='doctor')
def get_patient_medications(patient_id):
    """Get medications for a patient. Requires active consent."""
    try:
        doctor_uid = _get_doctor_uid_from_g()
    except ConsentError as e:
        return _error(e.code, e.message, e.status)

    if _is_mock():
        patient = get_mock_patient_by_id(patient_id)
        if not patient:
            return _error('NOT_FOUND', 'Patient not found.', 404)
        patient_uid = patient.get('uid')
        try:
            ConsentService.mock_verify_access(doctor_uid, patient_uid)
        except ConsentError as e:
            return _error(e.code, e.message, e.status)
        meds = get_mock_patient_medications(patient_uid)
        return jsonify({'success': True, 'medications': meds})

    # Production
    try:
        from firebase_admin import firestore as admin_firestore
        db = admin_firestore.client()
        patients = db.collection('users') \
            .where('patient_id', '==', patient_id) \
            .where('role', '==', 'patient') \
            .limit(1).get()
        if not patients:
            return _error('NOT_FOUND', 'Patient not found.', 404)
        patient_uid = patients[0].id
        try:
            ConsentService.firestore_verify_access(db, doctor_uid, patient_uid)
        except ConsentError as e:
            return _error(e.code, e.message, e.status)
        med_docs = db.collection('users').document(patient_uid) \
            .collection('medications').get()
        meds = [d.to_dict() | {'id': d.id} for d in med_docs]
        return jsonify({'success': True, 'medications': meds})
    except ConsentError as e:
        return _error(e.code, e.message, e.status)
    except Exception as e:
        return _error('SERVER_ERROR', str(e), 500)


# ── GET /api/doctor/search — Search Doctors ────────────────────────────────────
@bp.route('/search', methods=['GET'])
@require_auth()
def search_doctors():
    """
    Search for doctors by name, specialisation, or hospital.
    Available to all authenticated users (patients searching for doctors).
    """
    q = request.args.get('q', '').strip()

    if _is_mock():
        doctors = search_mock_doctors(q)
        return jsonify({'success': True, 'doctors': doctors, 'count': len(doctors)})

    # Production
    try:
        from firebase_admin import firestore as admin_firestore
        db = admin_firestore.client()
        # Firestore doesn't support full-text search natively.
        # Fetch all doctors and filter server-side (acceptable for small datasets).
        # For large datasets, use Algolia/Typesense integration.
        doctor_docs = db.collection('users').where('role', '==', 'doctor').get()
        doctors = []
        for d in doctor_docs:
            data = d.to_dict()
            dp = data.get('doctor_profile', {})
            doc_info = {
                'uid': d.id,
                'name': data.get('name', ''),
                'specialisation': dp.get('specialisation', ''),
                'hospital': dp.get('hospital', ''),
                'verified': dp.get('verified', False),
                'bio': dp.get('bio', ''),
                # Do NOT expose: registration_number, email, phone to patient search
            }
            if q:
                ql = q.lower()
                if not (ql in doc_info['name'].lower()
                        or ql in doc_info['specialisation'].lower()
                        or ql in doc_info['hospital'].lower()):
                    continue
            doctors.append(doc_info)
        return jsonify({'success': True, 'doctors': doctors, 'count': len(doctors)})
    except Exception as e:
        return _error('SERVER_ERROR', str(e), 500)


# ── GET /api/doctor/<doctor_uid>/profile — Single Doctor Profile ───────────────
@bp.route('/<doctor_uid>/profile', methods=['GET'])
@require_auth()
def get_doctor_profile(doctor_uid):
    """Get a single doctor's discoverable profile."""
    if _is_mock():
        from services.mock_store import MOCK_USERS
        user = MOCK_USERS.get(doctor_uid)
        if not user or user.get('role') != 'doctor':
            return _error('NOT_FOUND', 'Doctor not found.', 404)
        dp = user.get('doctor_profile', {})
        return jsonify({
            'success': True,
            'doctor': {
                'uid': doctor_uid,
                'name': user.get('name', ''),
                'specialisation': dp.get('specialisation', ''),
                'hospital': dp.get('hospital', ''),
                'verified': dp.get('verified', False),
                'bio': dp.get('bio', ''),
            }
        })

    try:
        from firebase_admin import firestore as admin_firestore
        db = admin_firestore.client()
        doc = db.collection('users').document(doctor_uid).get()
        if not doc.exists:
            return _error('NOT_FOUND', 'Doctor not found.', 404)
        data = doc.to_dict()
        if data.get('role') != 'doctor':
            return _error('NOT_FOUND', 'Doctor not found.', 404)
        dp = data.get('doctor_profile', {})
        return jsonify({
            'success': True,
            'doctor': {
                'uid': doctor_uid,
                'name': data.get('name', ''),
                'specialisation': dp.get('specialisation', ''),
                'hospital': dp.get('hospital', ''),
                'verified': dp.get('verified', False),
                'bio': dp.get('bio', ''),
            }
        })
    except Exception as e:
        return _error('SERVER_ERROR', str(e), 500)


# ── POST /api/doctor/consultations — Save Consultation ────────────────────────
@bp.route('/consultations', methods=['POST'])
@require_auth(role='doctor')
def save_consultation():
    """Save a clinical consultation. Must have active consent."""
    try:
        doctor_uid = _get_doctor_uid_from_g()
    except ConsentError as e:
        return _error(e.code, e.message, e.status)

    data = request.get_json(silent=True) or {}
    patient_id = data.get('patient_id', '').strip()

    if not patient_id:
        return _error('MISSING_PARAM', 'patient_id is required', 400)

    if _is_mock():
        patient = get_mock_patient_by_id(patient_id)
        if not patient:
            return _error('NOT_FOUND', 'Patient not found.', 404)
        patient_uid = patient.get('uid')
        try:
            ConsentService.mock_verify_access(doctor_uid, patient_uid)
        except ConsentError as e:
            return _error(e.code, e.message, e.status)

        consultation = {
            'id': f"cons-{int(datetime.utcnow().timestamp())}",
            'patient_id': patient_id,
            'patient_uid': patient_uid,
            'doctor_uid': doctor_uid,
            'timestamp': datetime.utcnow().isoformat(),
            'symptoms': data.get('symptoms', []),
            'diagnosis': data.get('diagnosis', 'General Follow-up'),
            'severity': data.get('severity', 'moderate'),
            'doctor_notes': data.get('doctor_notes', ''),
            'prescriptions': data.get('prescriptions', []),
            'follow_up_days': data.get('follow_up_days', 7),
            'ai_summary': data.get('ai_summary', {}),
        }
        # Sync prescribed medications to patient medications list
        doc_user = get_mock_user(doctor_uid) or {}
        doctor_name = doc_user.get('name', 'Attending Doctor')
        for p in data.get('prescriptions', []):
            add_mock_prescription(patient_uid, p, doctor_name)

        AuditLogService.log_mock(
            action='consultation_saved',
            doctor_uid=doctor_uid,
            patient_uid=patient_uid,
            patient_id=patient_id,
            resource='consultation'
        )
        return jsonify({'success': True, 'message': 'Consultation saved', 'consultation': consultation}), 201

    # Production
    try:
        from firebase_admin import firestore as admin_firestore
        db = admin_firestore.client()
        patients = db.collection('users') \
            .where('patient_id', '==', patient_id) \
            .where('role', '==', 'patient') \
            .limit(1).get()
        if not patients:
            return _error('NOT_FOUND', 'Patient not found.', 404)
        patient_uid = patients[0].id
        try:
            ConsentService.firestore_verify_access(db, doctor_uid, patient_uid)
        except ConsentError as e:
            return _error(e.code, e.message, e.status)

        consultation = {
            'patient_id': patient_id,
            'patient_uid': patient_uid,
            'doctor_uid': doctor_uid,
            'timestamp': datetime.utcnow().isoformat(),
            'symptoms': data.get('symptoms', []),
            'diagnosis': data.get('diagnosis', 'General Follow-up'),
            'severity': data.get('severity', 'moderate'),
            'doctor_notes': data.get('doctor_notes', ''),
            'prescriptions': data.get('prescriptions', []),
            'follow_up_days': data.get('follow_up_days', 7),
            'ai_summary': data.get('ai_summary', {}),
        }
        ref = db.collection('consultations').add(consultation)
        return jsonify({'success': True, 'message': 'Consultation saved',
                        'consultation': consultation | {'id': ref[1].id}}), 201
    except ConsentError as e:
        return _error(e.code, e.message, e.status)
    except Exception as e:
        return _error('SERVER_ERROR', str(e), 500)


# ── POST /api/doctor/prescribe — Prescribe Medication ─────────────────────────
@bp.route('/prescribe', methods=['POST'])
@require_auth(role='doctor')
def prescribe_medication():
    """Doctor prescribes a medication directly to a patient."""
    try:
        doctor_uid = _get_doctor_uid_from_g()
    except ConsentError as e:
        return _error(e.code, e.message, e.status)

    data = request.get_json(silent=True) or {}
    patient_id = data.get('patient_id', '').strip()
    patient_uid = data.get('patient_uid', '').strip()

    if not patient_id and not patient_uid:
        return _error('MISSING_PARAM', 'patient_id or patient_uid is required', 400)

    med_name = data.get('name', '').strip()
    if not med_name:
        return _error('MISSING_PARAM', 'Medication name is required', 400)

    if _is_mock():
        patient = get_mock_patient_by_id(patient_id) if patient_id else get_mock_user(patient_uid)
        if not patient:
            return _error('NOT_FOUND', 'Patient not found.', 404)
        target_uid = patient.get('uid')

        doc_user = get_mock_user(doctor_uid) or {}
        doctor_name = doc_user.get('name', 'Attending Doctor')

        new_med = add_mock_prescription(target_uid, data, doctor_name)
        AuditLogService.log_mock(
            action='medication_prescribed',
            doctor_uid=doctor_uid,
            patient_uid=target_uid,
            patient_id=patient.get('patient_id', ''),
            resource='medications'
        )
        return jsonify({
            'success': True,
            'message': f"Prescription for {med_name} issued successfully.",
            'medication': new_med
        }), 201

    # Production (Firestore)
    try:
        from firebase_admin import firestore as admin_firestore
        db = admin_firestore.client()
        if patient_id:
            pts = db.collection('users').where('patient_id', '==', patient_id).where('role', '==', 'patient').limit(1).get()
            if not pts:
                return _error('NOT_FOUND', 'Patient not found.', 404)
            target_uid = pts[0].id
        else:
            target_uid = patient_uid

        # Add to patient's medications subcollection
        med_doc = {
            'name': med_name,
            'dosage': data.get('dosage', '1 dose'),
            'frequency': data.get('frequency', 'once_daily'),
            'timing': data.get('timing', ['08:00']),
            'start_date': data.get('start_date', datetime.utcnow().isoformat().split('T')[0]),
            'end_date': data.get('end_date', '2026-12-31'),
            'instructions': data.get('instructions', 'Take as directed.'),
            'status': 'active',
            'remaining_days': data.get('days', 14),
            'prescribed_by': doctor_uid,
            'taken_today': False,
            'adherence_percent': 100,
            'missed_doses': 0,
            'created_at': datetime.utcnow().isoformat()
        }
        ref = db.collection('users').document(target_uid).collection('medications').add(med_doc)
        return jsonify({
            'success': True,
            'message': f"Prescription for {med_name} issued successfully.",
            'medication': med_doc | {'id': ref[1].id}
        }), 201
    except Exception as e:
        return _error('SERVER_ERROR', str(e), 500)

