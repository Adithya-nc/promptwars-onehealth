"""
Consent Routes
Patient-facing consent management endpoints.
All endpoints require patient authentication.

API Prefix: /api/consents
"""
from flask import Blueprint, jsonify, request, g, current_app
from middleware.auth import require_auth
from services.consent_service import ConsentService, ConsentError
from services.audit_service import AuditLogService
from services.mock_store import MOCK_USERS, get_mock_user

bp = Blueprint('consents', __name__)


def _is_mock():
    return current_app.config.get('MOCK_MODE', True)


def _error(code: str, message: str, status: int = 400):
    return jsonify({'success': False, 'error': {'code': code, 'message': message}}), status


def _get_patient_id_for_user(user_uid: str) -> str:
    """Get or create patient_id for a user."""
    if _is_mock():
        user = get_mock_user(user_uid)
        if user:
            return user.get('patient_id', '')
        return ''
    # Production: Firestore
    from firebase_admin import firestore as admin_firestore
    from services.patient_id_service import get_or_create_patient_id_firestore
    db = admin_firestore.client()
    return get_or_create_patient_id_firestore(user_uid, db)


def _enrich_consent_with_doctor(consent: dict) -> dict:
    """Add doctor display name and profile to a consent record."""
    doctor_uid = consent.get('doctor_uid', '')
    if _is_mock():
        doctor = get_mock_user(doctor_uid) or {}
        dp = doctor.get('doctor_profile', {})
        return {
            **consent,
            'doctor': {
                'uid': doctor_uid,
                'name': doctor.get('name', 'Unknown Doctor'),
                'specialisation': dp.get('specialisation', ''),
                'hospital': dp.get('hospital', ''),
                'verified': dp.get('verified', False),
            }
        }
    # Production
    try:
        from firebase_admin import firestore as admin_firestore
        db = admin_firestore.client()
        doc = db.collection('users').document(doctor_uid).get()
        if doc.exists:
            data = doc.to_dict()
            dp = data.get('doctor_profile', {})
            return {
                **consent,
                'doctor': {
                    'uid': doctor_uid,
                    'name': data.get('name', ''),
                    'specialisation': dp.get('specialisation', ''),
                    'hospital': dp.get('hospital', ''),
                    'verified': dp.get('verified', False),
                }
            }
    except Exception:
        pass
    return {**consent, 'doctor': {'uid': doctor_uid, 'name': 'Unknown Doctor'}}


# ── POST /api/consents — Grant Consent to a Doctor ────────────────────────────
@bp.route('', methods=['POST'])
@bp.route('/', methods=['POST'])
@require_auth(role='patient')
def grant_consent():
    """
    Patient grants consent to a doctor.
    Body: { "doctor_uid": "..." }
    """
    if g.role != 'patient':
        return _error('FORBIDDEN', 'Only patients can grant consent.', 403)

    data = request.get_json(silent=True) or {}
    doctor_uid = data.get('doctor_uid', '').strip()
    if not doctor_uid:
        return _error('MISSING_PARAM', 'doctor_uid is required', 400)

    patient_uid = g.user_id
    patient_id = _get_patient_id_for_user(patient_uid)

    # Validate doctor exists
    if _is_mock():
        doctor = get_mock_user(doctor_uid)
        if not doctor or doctor.get('role') != 'doctor':
            return _error('NOT_FOUND', 'Doctor not found.', 404)

        consent = ConsentService.mock_grant_consent(
            doctor_uid=doctor_uid,
            patient_uid=patient_uid,
            patient_id=patient_id,
            requested_by='patient'
        )
        AuditLogService.log_mock(
            action='consent_granted',
            doctor_uid=doctor_uid,
            patient_uid=patient_uid,
            patient_id=patient_id,
            resource='consent'
        )
        enriched = _enrich_consent_with_doctor(consent)
        return jsonify({'success': True, 'message': 'Access granted successfully.', 'consent': enriched}), 201

    # Production
    try:
        from firebase_admin import firestore as admin_firestore
        db = admin_firestore.client()
        doc = db.collection('users').document(doctor_uid).get()
        if not doc.exists or doc.to_dict().get('role') != 'doctor':
            return _error('NOT_FOUND', 'Doctor not found.', 404)

        consent = ConsentService.firestore_grant_consent(
            db=db,
            doctor_uid=doctor_uid,
            patient_uid=patient_uid,
            patient_id=patient_id,
            requested_by='patient'
        )
        AuditLogService.log_firestore(
            db=db, action='consent_granted',
            doctor_uid=doctor_uid, patient_uid=patient_uid,
            patient_id=patient_id, resource='consent'
        )
        enriched = _enrich_consent_with_doctor(consent)
        return jsonify({'success': True, 'message': 'Access granted successfully.', 'consent': enriched}), 201
    except Exception as e:
        return _error('SERVER_ERROR', str(e), 500)


# ── GET /api/consents — Get Patient's Consents ────────────────────────────────
@bp.route('', methods=['GET'])
@bp.route('/', methods=['GET'])
@require_auth(role='patient')
def get_consents():
    """Get all consents for the currently logged-in patient."""
    if g.role != 'patient':
        return _error('FORBIDDEN', 'Only patients can view their consents.', 403)

    patient_uid = g.user_id

    if _is_mock():
        consents = ConsentService.mock_get_patient_consents(patient_uid)
        enriched = [_enrich_consent_with_doctor(c) for c in consents]
        return jsonify({
            'success': True,
            'consents': enriched,
            'count': len(enriched)
        })

    try:
        from firebase_admin import firestore as admin_firestore
        db = admin_firestore.client()
        consents = ConsentService.firestore_get_patient_consents(db, patient_uid)
        enriched = [_enrich_consent_with_doctor(c) for c in consents]
        return jsonify({'success': True, 'consents': enriched, 'count': len(enriched)})
    except Exception as e:
        return _error('SERVER_ERROR', str(e), 500)


# ── PATCH /api/consents/<consent_id> — Revoke Consent ────────────────────────
@bp.route('/<consent_id>', methods=['PATCH', 'DELETE'])
@require_auth(role='patient')
def revoke_consent(consent_id):
    """
    Patient revokes consent.
    PATCH body: { "status": "revoked" }
    Or DELETE the resource.
    """
    if g.role != 'patient':
        return _error('FORBIDDEN', 'Only patients can revoke consent.', 403)

    # Validate PATCH has correct status
    if request.method == 'PATCH':
        data = request.get_json(silent=True) or {}
        if data.get('status') != 'revoked':
            return _error('BAD_REQUEST', 'status must be "revoked"', 400)

    patient_uid = g.user_id

    if _is_mock():
        try:
            consent = ConsentService.mock_revoke_consent(consent_id, patient_uid)
        except ConsentError as e:
            return _error(e.code, e.message, e.status)
        AuditLogService.log_mock(
            action='consent_revoked',
            doctor_uid=consent.get('doctor_uid'),
            patient_uid=patient_uid,
            patient_id=consent.get('patient_id'),
            resource='consent'
        )
        return jsonify({'success': True, 'message': 'Access revoked successfully.', 'consent': consent})

    try:
        from firebase_admin import firestore as admin_firestore
        db = admin_firestore.client()
        try:
            consent = ConsentService.firestore_revoke_consent(db, consent_id, patient_uid)
        except ConsentError as e:
            return _error(e.code, e.message, e.status)
        AuditLogService.log_firestore(
            db=db, action='consent_revoked',
            doctor_uid=consent.get('doctor_uid'), patient_uid=patient_uid,
            patient_id=consent.get('patient_id'), resource='consent'
        )
        return jsonify({'success': True, 'message': 'Access revoked successfully.', 'consent': consent})
    except ConsentError as e:
        return _error(e.code, e.message, e.status)
    except Exception as e:
        return _error('SERVER_ERROR', str(e), 500)
