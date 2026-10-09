import pytest
import io

def test_health_check(client):
    """Test health check endpoint for liveness and readiness."""
    res = client.get('/api/health')
    assert res.status_code == 200
    data = res.get_json()
    assert data['status'] == 'healthy'
    assert 'service' in data

    # Also test /health alias
    res_alias = client.get('/health')
    assert res_alias.status_code == 200
    assert res_alias.get_json()['status'] == 'healthy'

def test_root_route(client):
    """Test API root endpoint."""
    res = client.get('/')
    assert res.status_code == 200
    data = res.get_json()
    assert data.get('status') == 'running'

def test_unauthorized_access(client):
    """Protected endpoints must reject requests without tokens."""
    res = client.get('/api/patients/profile')
    assert res.status_code == 401
    assert res.get_json()['error']['code'] == 'MISSING_TOKEN'

def test_invalid_token(client):
    """Requests with malformed tokens must return 401."""
    res = client.get('/api/patients/profile', headers={'Authorization': 'BadHeaderFormat'})
    assert res.status_code == 401

def test_patient_authorized_profile(client, patient_headers):
    """Patient with valid token can access profile."""
    res = client.get('/api/patients/profile', headers=patient_headers)
    assert res.status_code == 200
    data = res.get_json()
    assert data.get('success') is True
    assert 'profile' in data
    assert 'data' in data

def test_role_authorization_forbidden(client, patient_headers):
    """Patient attempting to access doctor-only endpoints must receive 403."""
    res = client.get('/api/doctor/patients', headers=patient_headers)
    assert res.status_code == 403
    assert res.get_json()['error']['code'] == 'FORBIDDEN'

def test_doctor_authorized_access(client, doctor_headers):
    """Doctor with valid credentials can access doctor portal patients directory."""
    res = client.get('/api/doctor/patients', headers=doctor_headers)
    assert res.status_code == 200
    data = res.get_json()
    assert data.get('success') is True
