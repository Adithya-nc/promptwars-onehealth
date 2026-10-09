"""
Patient Routes
Patient-facing API endpoints.
API Prefix: /api/patients
"""
from flask import Blueprint, jsonify, request, g, current_app
from middleware.auth import require_auth
from services.mock_store import (
    get_mock_user, get_mock_patient_medications, get_mock_patient_timeline,
    get_mock_patient_records, add_mock_patient_record,
    register_mock_patient, find_mock_user_by_email_or_name, MOCK_USERS, MOCK_PATIENT_ID_TO_UID
)
from datetime import datetime

bp = Blueprint('patients', __name__)


def _is_mock():
    return current_app.config.get('MOCK_MODE', True)


def _error(code: str, message: str, status: int = 400):
    return jsonify({'success': False, 'error': {'code': code, 'message': message}}), status


# ── POST /api/patients/register ───────────────────────────────────────────────
@bp.route('/register', methods=['POST'])
def register_patient():
    """Register a new patient account with medical background and optional reports."""
    data = request.get_json(silent=True) or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    
    if not name and not email:
        return _error('VALIDATION_ERROR', 'Name or email is required for registration.', 400)

    if _is_mock():
        new_user = register_mock_patient(data)
        profile = new_user.get('profile', {})
        h = profile.get('height_cm') or 165
        w = profile.get('weight_kg') or 65
        bmi = round(w / ((h / 100) ** 2), 1)
        
        return jsonify({
            'success': True,
            'message': 'Patient registration complete.',
            'patient_id': new_user['patient_id'],
            'user': {
                'uid': new_user['uid'],
                'patient_id': new_user['patient_id'],
                'name': new_user['name'],
                'email': new_user['email'],
                'phone': new_user['phone'],
                'role': 'patient',
            },
            'profile': profile,
            'token': f"token-{new_user['uid']}",
            'metrics': {
                'health_score': 85,
                'bmi': bmi,
                'blood_pressure': '120/80',
                'heart_rate': 72
            }
        }), 201

    # Production (Firestore)
    try:
        from firebase_admin import firestore as admin_firestore
        from services.patient_id_service import generate_patient_id
        db = admin_firestore.client()
        uid = data.get('uid') or f"patient_{int(datetime.utcnow().timestamp()*1000)}"
        patient_id = generate_patient_id()
        user_record = {
            'uid': uid,
            'patient_id': patient_id,
            'role': 'patient',
            'name': name,
            'email': email,
            'phone': data.get('phone', ''),
            'profile': {
                'dob': data.get('dob', ''),
                'gender': data.get('gender', ''),
                'blood_group': data.get('blood_group', ''),
                'height_cm': data.get('height_cm'),
                'weight_kg': data.get('weight_kg'),
                'allergies': data.get('allergies', []),
                'chronic_diseases': data.get('chronic_diseases', []),
                'emergency_contacts': data.get('emergency_contacts', []),
            },
            'createdAt': datetime.utcnow().isoformat()
        }
        db.collection('users').document(uid).set(user_record)
        return jsonify({'success': True, 'user': user_record, 'patient_id': patient_id}), 201
    except Exception as e:
        return _error('SERVER_ERROR', str(e), 500)


# ── POST /api/patients/login ──────────────────────────────────────────────────
@bp.route('/login', methods=['POST'])
def login_patient():
    """Login patient by email, phone, name or patient ID."""
    data = request.get_json(silent=True) or {}
    identifier = data.get('identifier') or data.get('email') or data.get('username') or ''
    
    if _is_mock():
        user = find_mock_user_by_email_or_name(identifier, role='patient')
        if not user:
            # Fallback to default patient if testing with blank or default demo
            user = MOCK_USERS.get('mock-patient-uid-001')
        
        profile = user.get('profile', {})
        return jsonify({
            'success': True,
            'user': {
                'uid': user['uid'],
                'patient_id': user.get('patient_id', ''),
                'name': user.get('name', ''),
                'email': user.get('email', ''),
                'phone': user.get('phone', ''),
                'role': 'patient',
            },
            'profile': profile,
            'token': f"token-{user['uid']}"
        })

    return _error('NOT_IMPLEMENTED', 'Production login requires Firebase auth client', 501)


# ── GET /api/patients/profile ─────────────────────────────────────────────────
@bp.route('/profile', methods=['GET'])
@require_auth(role='patient')
def get_profile():
    """Get the current patient's profile including their OneHealth Patient ID."""
    patient_uid = g.user_id

    if _is_mock():
        # Check direct UID or patient_id lookup
        user = get_mock_user(patient_uid)
        if not user and patient_uid in MOCK_PATIENT_ID_TO_UID:
            user = get_mock_user(MOCK_PATIENT_ID_TO_UID[patient_uid])
        if not user:
            # Check by prefix or name
            user = find_mock_user_by_email_or_name(patient_uid, role='patient')
        if not user:
            # Default to first mock patient
            user = MOCK_USERS.get('mock-patient-uid-001')

        if user:
            profile = user.get('profile', {})
            h = profile.get('height_cm') or 165
            w = profile.get('weight_kg') or 60
            bmi = round(w / ((h / 100) ** 2), 1) if h else 22.1
            profile_dict = {
                'uid': user.get('uid', patient_uid),
                'patient_id': user.get('patient_id', ''),
                'name': user.get('name', ''),
                'email': user.get('email', ''),
                'phone': user.get('phone', ''),
                'dob': profile.get('dob', ''),
                'gender': profile.get('gender', ''),
                'blood_group': profile.get('blood_group', ''),
                'height_cm': profile.get('height_cm'),
                'weight_kg': profile.get('weight_kg'),
                'allergies': profile.get('allergies', []),
                'chronic_diseases': profile.get('chronic_diseases', []),
                'emergency_contacts': profile.get('emergency_contacts', []),
                'lifestyle': profile.get('lifestyle', {}),
                'medical_notes': profile.get('medical_notes', ''),
            }
            return jsonify({
                'success': True,
                'data': profile_dict,
                'profile': profile_dict,
                'metrics': {
                    'health_score': 88,
                    'bmi': bmi,
                    'blood_pressure': '120/80',
                    'heart_rate': 72
                }
            })

    # Production: Firestore
    try:
        from firebase_admin import firestore as admin_firestore
        from services.patient_id_service import get_or_create_patient_id_firestore
        db = admin_firestore.client()

        # Get or create patient_id
        patient_id = get_or_create_patient_id_firestore(patient_uid, db)

        user_doc = db.collection('users').document(patient_uid).get()
        if not user_doc.exists:
            return _error('NOT_FOUND', 'Patient profile not found.', 404)

        data = user_doc.to_dict()
        profile = data.get('profile', {})
        return jsonify({
            'success': True,
            'profile': {
                'uid': patient_uid,
                'patient_id': patient_id,
                'name': data.get('name', data.get('displayName', '')),
                'email': data.get('email', ''),
                'phone': data.get('phone', ''),
                'dob': profile.get('dob', ''),
                'gender': profile.get('gender', ''),
                'blood_group': profile.get('blood_group', ''),
                'height_cm': profile.get('height_cm'),
                'weight_kg': profile.get('weight_kg'),
                'allergies': profile.get('allergies', []),
                'chronic_diseases': profile.get('chronic_diseases', []),
                'emergency_contacts': profile.get('emergency_contacts', []),
            },
            'metrics': data.get('metrics', {})
        })
    except Exception as e:
        return _error('SERVER_ERROR', str(e), 500)


# ── GET /api/patients/timeline ────────────────────────────────────────────────
@bp.route('/timeline', methods=['GET'])
@require_auth(role='patient')
def get_timeline():
    """Get the current patient's medical timeline."""
    patient_uid = g.user_id

    if _is_mock():
        timeline = get_mock_patient_timeline(patient_uid)
        if not timeline:
            # Generic timeline for unlisted patients
            timeline = [
                {
                    'id': 'tl-gen-1',
                    'type': 'Consultation',
                    'title': 'General Checkup',
                    'date': datetime.utcnow().isoformat(),
                    'doctor': 'Dr. Smith',
                    'hospital': 'City Hospital',
                    'description': 'Routine annual checkup. All parameters normal.',
                    'status': 'normal'
                }
            ]
        return jsonify({'success': True, 'entries': timeline})

    try:
        from firebase_admin import firestore as admin_firestore
        db = admin_firestore.client()
        docs = db.collection('users').document(patient_uid) \
            .collection('timeline').order_by('date', direction='DESCENDING').get()
        entries = [d.to_dict() | {'id': d.id} for d in docs]
        return jsonify({'success': True, 'entries': entries})
    except Exception as e:
        return _error('SERVER_ERROR', str(e), 500)


# ── PUT /api/patients/profile ─────────────────────────────────────────────────
@bp.route('/profile', methods=['PUT', 'PATCH'])
@require_auth(role='patient')
def update_profile():
    """Update the current patient's profile."""
    patient_uid = g.user_id
    data = request.get_json(silent=True) or {}

    if _is_mock():
        return jsonify({'success': True, 'message': 'Profile updated (mock mode)'})

    try:
        from firebase_admin import firestore as admin_firestore
        db = admin_firestore.client()
        # Never allow updating patient_id, uid, role
        safe_fields = {
            k: v for k, v in data.items()
            if k not in ('uid', 'patient_id', 'role', 'email')
        }
        db.collection('users').document(patient_uid).set(safe_fields, merge=True)
        return jsonify({'success': True, 'message': 'Profile updated successfully.'})
    except Exception as e:
        return _error('SERVER_ERROR', str(e), 500)


# ── GET & POST /api/patients/records ──────────────────────────────────────────
@bp.route('/records', methods=['GET', 'POST'])
@require_auth(role='patient')
def patient_records():
    """Retrieve or upload persistent medical records for the authenticated patient."""
    patient_uid = g.user_id

    if request.method == 'POST':
        data = request.get_json(silent=True) or {}
        if _is_mock():
            record = add_mock_patient_record(patient_uid, data)
            return jsonify({'success': True, 'record': record, 'message': 'Record uploaded and synced to passport.'}), 201

        # Production Firestore
        try:
            from firebase_admin import firestore as admin_firestore
            db = admin_firestore.client()
            rec_id = data.get('id') or f"rec_{int(datetime.utcnow().timestamp()*1000)}"
            data['id'] = rec_id
            data['created_at'] = datetime.utcnow().isoformat()
            db.collection('users').document(patient_uid).collection('records').document(rec_id).set(data)
            # Add to timeline as well
            db.collection('users').document(patient_uid).collection('timeline').document(f"tl_{rec_id}").set({
                'id': f"tl_{rec_id}",
                'type': data.get('type', 'report').capitalize(),
                'title': data.get('title', 'Medical Record'),
                'date': data.get('date', datetime.utcnow().isoformat().split('T')[0]),
                'doctor': data.get('metadata', {}).get('doctor_name', 'oneHealth AI'),
                'hospital': data.get('metadata', {}).get('hospital', 'Diagnostic Center'),
                'description': data.get('ai_analysis', {}).get('summary', 'Uploaded medical document'),
                'status': 'normal'
            })
            return jsonify({'success': True, 'record': data}), 201
        except Exception as e:
            return _error('SERVER_ERROR', str(e), 500)

    # GET records
    if _is_mock():
        records = get_mock_patient_records(patient_uid)
        return jsonify({'success': True, 'records': records})

    try:
        from firebase_admin import firestore as admin_firestore
        db = admin_firestore.client()
        docs = db.collection('users').document(patient_uid).collection('records').order_by('date', direction='DESCENDING').get()
        records = [d.to_dict() | {'id': d.id} for d in docs]
        return jsonify({'success': True, 'records': records})
    except Exception as e:
        return _error('SERVER_ERROR', str(e), 500)

