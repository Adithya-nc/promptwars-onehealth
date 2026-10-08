"""
Consent Service
Central service for verifying and managing patient-doctor consent.
All consent logic flows through here to avoid duplication.
"""
from datetime import datetime


class ConsentError(Exception):
    """Raised when consent check fails."""
    def __init__(self, message: str, code: str = "CONSENT_REQUIRED", status: int = 403):
        super().__init__(message)
        self.message = message
        self.code = code
        self.status = status


class ConsentService:
    """Central consent management. All routes must use this to gate access."""

    # ── MOCK MODE ─────────────────────────────────────────────────────────────
    # In-memory store for mock consents: list of consent dicts
    _mock_consents: list = [
        {
            'id': 'consent-seed-001',
            'doctor_uid': 'mock-doctor-uid-001',
            'patient_uid': 'mock-patient-uid-001',
            'patient_id': 'OH-P-AAAB2C3',
            'status': 'active',
            'requested_by': 'patient',
            'created_at': '2026-03-01T10:00:00',
            'updated_at': '2026-03-01T10:00:00',
            'granted_at': '2026-03-01T10:00:00',
            'revoked_at': None,
            'expires_at': None,
            'scope': {
                'profile': True,
                'records': True,
                'medications': True,
                'timeline': True,
                'emergency_contacts': True,
            }
        }
    ]

    @classmethod
    def _mock_find_active(cls, doctor_uid: str, patient_uid: str) -> dict | None:
        for c in cls._mock_consents:
            if (
                c.get('doctor_uid') == doctor_uid
                and c.get('patient_uid') == patient_uid
                and c.get('status') == 'active'
            ):
                return c
        return None

    @classmethod
    def mock_grant_consent(cls, doctor_uid: str, patient_uid: str,
                           patient_id: str, requested_by: str = 'patient') -> dict:
        """Grant or reactivate consent in mock mode."""
        # Check for existing active
        existing = cls._mock_find_active(doctor_uid, patient_uid)
        if existing:
            return existing

        # Check for revoked — reactivate
        for c in cls._mock_consents:
            if c.get('doctor_uid') == doctor_uid and c.get('patient_uid') == patient_uid:
                c['status'] = 'active'
                c['granted_at'] = datetime.utcnow().isoformat()
                c['updated_at'] = datetime.utcnow().isoformat()
                c['revoked_at'] = None
                return c

        now = datetime.utcnow().isoformat()
        consent = {
            'id': f"consent-{int(datetime.utcnow().timestamp() * 1000)}",
            'doctor_uid': doctor_uid,
            'patient_uid': patient_uid,
            'patient_id': patient_id,
            'status': 'active',
            'requested_by': requested_by,
            'created_at': now,
            'updated_at': now,
            'granted_at': now,
            'revoked_at': None,
            'expires_at': None,
            'scope': {
                'profile': True,
                'records': True,
                'medications': True,
                'timeline': True,
                'emergency_contacts': True,
            }
        }
        cls._mock_consents.append(consent)
        return consent

    @classmethod
    def mock_revoke_consent(cls, consent_id: str, patient_uid: str) -> dict:
        """Revoke consent in mock mode."""
        for c in cls._mock_consents:
            if c.get('id') == consent_id and c.get('patient_uid') == patient_uid:
                c['status'] = 'revoked'
                c['revoked_at'] = datetime.utcnow().isoformat()
                c['updated_at'] = datetime.utcnow().isoformat()
                return c
        raise ConsentError("Consent not found", "NOT_FOUND", 404)

    @classmethod
    def mock_get_patient_consents(cls, patient_uid: str) -> list:
        """Get all consents for a patient in mock mode."""
        return [c for c in cls._mock_consents if c.get('patient_uid') == patient_uid]

    @classmethod
    def mock_get_doctor_patients(cls, doctor_uid: str) -> list:
        """Get all active consent records for a doctor in mock mode."""
        return [
            c for c in cls._mock_consents
            if c.get('doctor_uid') == doctor_uid and c.get('status') == 'active'
        ]

    @classmethod
    def mock_verify_access(cls, doctor_uid: str, patient_uid: str) -> dict:
        """Verify doctor has active consent; raise ConsentError if not."""
        consent = cls._mock_find_active(doctor_uid, patient_uid)
        if not consent:
            raise ConsentError(
                "This patient has not granted you access to their health passport.",
                "CONSENT_REQUIRED",
                403
            )
        return consent

    # ── FIRESTORE (PRODUCTION) ─────────────────────────────────────────────────
    @staticmethod
    def firestore_grant_consent(db, doctor_uid: str, patient_uid: str,
                                patient_id: str, requested_by: str = 'patient') -> dict:
        """Grant or reactivate consent in Firestore (atomic)."""
        # Check duplicate active
        existing = db.collection('doctor_consents') \
            .where('doctor_uid', '==', doctor_uid) \
            .where('patient_uid', '==', patient_uid) \
            .where('status', '==', 'active') \
            .limit(1).get()
        if existing:
            return existing[0].to_dict() | {'id': existing[0].id}

        # Check for revoked to reactivate
        revoked = db.collection('doctor_consents') \
            .where('doctor_uid', '==', doctor_uid) \
            .where('patient_uid', '==', patient_uid) \
            .where('status', '==', 'revoked') \
            .limit(1).get()

        now = datetime.utcnow().isoformat()
        if revoked:
            doc = revoked[0]
            updates = {
                'status': 'active',
                'granted_at': now,
                'updated_at': now,
                'revoked_at': None,
            }
            doc.reference.update(updates)
            return doc.to_dict() | updates | {'id': doc.id}

        # Create new consent
        consent_data = {
            'doctor_uid': doctor_uid,
            'patient_uid': patient_uid,
            'patient_id': patient_id,
            'status': 'active',
            'requested_by': requested_by,
            'created_at': now,
            'updated_at': now,
            'granted_at': now,
            'revoked_at': None,
            'expires_at': None,
            'scope': {
                'profile': True,
                'records': True,
                'medications': True,
                'timeline': True,
                'emergency_contacts': True,
            }
        }
        ref = db.collection('doctor_consents').add(consent_data)
        return consent_data | {'id': ref[1].id}

    @staticmethod
    def firestore_revoke_consent(db, consent_id: str, patient_uid: str) -> dict:
        """Revoke a consent in Firestore."""
        ref = db.collection('doctor_consents').document(consent_id)
        snap = ref.get()
        if not snap.exists:
            raise ConsentError("Consent not found", "NOT_FOUND", 404)
        data = snap.to_dict()
        if data.get('patient_uid') != patient_uid:
            raise ConsentError("Unauthorized", "UNAUTHORIZED", 403)
        now = datetime.utcnow().isoformat()
        updates = {'status': 'revoked', 'revoked_at': now, 'updated_at': now}
        ref.update(updates)
        return data | updates | {'id': consent_id}

    @staticmethod
    def firestore_get_patient_consents(db, patient_uid: str) -> list:
        """Get all consents for a patient from Firestore."""
        docs = db.collection('doctor_consents') \
            .where('patient_uid', '==', patient_uid) \
            .order_by('created_at', direction='DESCENDING') \
            .get()
        return [d.to_dict() | {'id': d.id} for d in docs]

    @staticmethod
    def firestore_get_doctor_patients(db, doctor_uid: str) -> list:
        """Get active consents for a doctor from Firestore."""
        docs = db.collection('doctor_consents') \
            .where('doctor_uid', '==', doctor_uid) \
            .where('status', '==', 'active') \
            .get()
        return [d.to_dict() | {'id': d.id} for d in docs]

    @staticmethod
    def firestore_verify_access(db, doctor_uid: str, patient_uid: str) -> dict:
        """Verify active consent in Firestore; raise ConsentError if not."""
        docs = db.collection('doctor_consents') \
            .where('doctor_uid', '==', doctor_uid) \
            .where('patient_uid', '==', patient_uid) \
            .where('status', '==', 'active') \
            .limit(1).get()
        if not docs:
            raise ConsentError(
                "This patient has not granted you access to their health passport.",
                "CONSENT_REQUIRED",
                403
            )
        return docs[0].to_dict() | {'id': docs[0].id}
