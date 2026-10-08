"""
Patient ID Service
Generates and manages unique, immutable OneHealth Patient IDs.
Format: OH-P-XXXXXXX (alphanumeric, collision-safe)
"""
import random
import string
from datetime import datetime


def generate_patient_id() -> str:
    """
    Generate a collision-safe OneHealth Patient ID.
    Format: OH-P-7K4M92 (6 alphanumeric chars, uppercase)
    Uses uppercase letters and digits (excluding confusable chars: 0, O, I, 1)
    """
    safe_chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    suffix = ''.join(random.choices(safe_chars, k=7))
    return f"OH-P-{suffix}"


def get_or_create_patient_id_mock(user_id: str, mock_db: dict) -> str:
    """
    In MOCK_MODE: get existing patient_id or create a stable one based on user_id.
    Uses a simple hash-based approach so the same user always gets the same ID.
    """
    if user_id in mock_db:
        return mock_db[user_id]

    # Generate deterministic-looking ID from user_id hash
    import hashlib
    h = hashlib.md5(user_id.encode()).hexdigest().upper()
    safe_chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    # Map hex chars to safe chars
    suffix = ''
    for c in h[:7]:
        idx = int(c, 16) % len(safe_chars)
        suffix += safe_chars[idx]
    patient_id = f"OH-P-{suffix}"
    mock_db[user_id] = patient_id
    return patient_id


def get_or_create_patient_id_firestore(user_id: str, db) -> str:
    """
    Production: atomically get or create patient_id in Firestore.
    Uses a transaction to prevent duplicates.
    """
    from google.cloud.firestore_v1 import transaction
    from firebase_admin import firestore as admin_firestore

    user_ref = db.collection('users').document(user_id)
    
    @admin_firestore.firestore.transactional
    def txn(transaction, user_ref):
        snapshot = user_ref.get(transaction=transaction)
        if snapshot.exists:
            data = snapshot.to_dict()
            existing_id = data.get('patient_id')
            if existing_id:
                return existing_id
        
        # Generate new unique patient_id
        new_id = _generate_unique_patient_id_firestore(db)
        transaction.update(user_ref, {
            'patient_id': new_id,
            'patient_id_created_at': datetime.utcnow().isoformat()
        })
        return new_id

    t = db.transaction()
    return txn(t, user_ref)


def _generate_unique_patient_id_firestore(db, max_attempts: int = 10) -> str:
    """Generate a unique patient_id, checking Firestore for collisions."""
    for _ in range(max_attempts):
        candidate = generate_patient_id()
        # Check if this ID already exists
        existing = db.collection('users').where(
            'patient_id', '==', candidate
        ).limit(1).get()
        if not existing:
            return candidate
    raise RuntimeError("Failed to generate unique patient_id after max attempts")
