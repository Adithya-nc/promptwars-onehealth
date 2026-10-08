"""
Audit Log Service
Records sensitive healthcare actions for compliance and security.
"""
from datetime import datetime


class AuditLogService:
    """Lightweight audit logging service."""

    _mock_logs: list = []

    @classmethod
    def log_mock(cls, action: str, doctor_uid: str = None, patient_uid: str = None,
                 patient_id: str = None, resource: str = None, extra: dict = None):
        """Log an audit event in mock mode."""
        entry = {
            'id': f"audit-{int(datetime.utcnow().timestamp() * 1000)}",
            'action': action,
            'doctor_uid': doctor_uid,
            'patient_uid': patient_uid,
            'patient_id': patient_id,
            'resource': resource,
            'timestamp': datetime.utcnow().isoformat(),
            **(extra or {})
        }
        cls._mock_logs.append(entry)
        return entry

    @staticmethod
    def log_firestore(db, action: str, doctor_uid: str = None, patient_uid: str = None,
                      patient_id: str = None, resource: str = None, extra: dict = None):
        """Log an audit event in Firestore."""
        entry = {
            'action': action,
            'doctor_uid': doctor_uid,
            'patient_uid': patient_uid,
            'patient_id': patient_id,
            'resource': resource,
            'timestamp': datetime.utcnow().isoformat(),
            **(extra or {})
        }
        db.collection('access_audit_logs').add(entry)
        return entry
