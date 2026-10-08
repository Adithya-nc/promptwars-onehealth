"""
Authentication Middleware
Verifies Firebase ID tokens and attaches user context to Flask's g object.
Supports role-based access control.
"""
from functools import wraps
from flask import request, jsonify, g, current_app


def require_auth(role=None):
    """
    Decorator that verifies the Firebase ID token.
    In MOCK_MODE, uses mock identities.
    
    Args:
        role: Optional role string ('patient' | 'doctor') to enforce.
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if current_app.config.get('MOCK_MODE', True):
                # Mock authentication for development
                # Allow role override via X-Mock-Role header for testing
                mock_role = request.headers.get('X-Mock-Role', 'patient')
                mock_uid = request.headers.get('X-Mock-Uid', 'mock-patient-uid-001')

                g.user_id = mock_uid
                g.role = mock_role

                if role and g.role != role:
                    return jsonify({
                        'success': False,
                        'error': {
                            'code': 'FORBIDDEN',
                            'message': f'This endpoint requires role: {role}'
                        }
                    }), 403

                return f(*args, **kwargs)

            # Production: verify Firebase ID token
            auth_header = request.headers.get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                return jsonify({
                    'success': False,
                    'error': {'code': 'MISSING_TOKEN', 'message': 'Authorization token required'}
                }), 401

            token = auth_header.split('Bearer ')[1]
            try:
                import firebase_admin.auth as firebase_auth
                from firebase_admin import firestore as admin_firestore
                decoded = firebase_auth.verify_id_token(token)
                g.user_id = decoded['uid']

                # Get role from Firestore (not from token claims to avoid stale data)
                db = admin_firestore.client()
                user_doc = db.collection('users').document(g.user_id).get()
                if user_doc.exists:
                    g.role = user_doc.to_dict().get('role', 'patient')
                else:
                    g.role = decoded.get('role', 'patient')

                if role and g.role != role:
                    return jsonify({
                        'success': False,
                        'error': {'code': 'FORBIDDEN', 'message': f'This endpoint requires role: {role}'}
                    }), 403

            except Exception as e:
                return jsonify({
                    'success': False,
                    'error': {'code': 'INVALID_TOKEN', 'message': 'Invalid or expired token'}
                }), 401

            return f(*args, **kwargs)
        return decorated_function
    return decorator
