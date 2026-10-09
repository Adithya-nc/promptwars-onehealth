import pytest
import io

def test_record_upload_missing_file(client, patient_headers):
    """Upload request without file part must return 400."""
    res = client.post('/api/records/upload', data={}, headers=patient_headers)
    assert res.status_code == 400
    assert res.get_json()['error']['code'] == 'NO_FILE'

def test_record_upload_disallowed_extension(client, patient_headers):
    """Uploading executable scripts or dangerous formats must be blocked."""
    data = {
        'file': (io.BytesIO(b'malicious payload'), 'exploit.exe')
    }
    res = client.post('/api/records/upload', data=data, content_type='multipart/form-data', headers=patient_headers)
    assert res.status_code == 400
    assert res.get_json()['error']['code'] == 'INVALID_FILE_TYPE'

def test_record_upload_valid_pdf(client, patient_headers):
    """Uploading valid PDF report must succeed."""
    pdf_content = b"%PDF-1.4 sample diagnostic laboratory report text"
    data = {
        'file': (io.BytesIO(pdf_content), 'lab_result.pdf'),
        'type': 'lab_report',
        'date': '2026-05-01'
    }
    res = client.post('/api/records/upload', data=data, content_type='multipart/form-data', headers=patient_headers)
    assert res.status_code == 200
    json_data = res.get_json()
    assert json_data['success'] is True
    assert 'record_id' in json_data

def test_list_records(client, patient_headers):
    """Listing records returns list for patient."""
    res = client.get('/api/records/', headers=patient_headers)
    assert res.status_code == 200
    data = res.get_json()
    assert data['success'] is True
    assert isinstance(data.get('records'), list)

def test_get_medications(client, patient_headers):
    """Medications endpoint returns medication schedule and adherence stats."""
    res = client.get('/api/medications/', headers=patient_headers)
    assert res.status_code == 200
    data = res.get_json()
    assert data['success'] is True
    assert 'medications' in data
    assert 'summary' in data
    assert 'adherence_today_percent' in data['summary']

def test_create_medication_validation(client, patient_headers):
    """Creating medication requires name and dosage."""
    res = client.post('/api/medications/', json={"name": ""}, headers=patient_headers)
    assert res.status_code == 400
    assert res.get_json()['success'] is False

def test_create_medication_success(client, patient_headers):
    """Creating medication with complete fields succeeds."""
    payload = {
        "name": "Metformin 500mg",
        "dosage": "1 tablet",
        "frequency": "twice_daily",
        "instructions": "Take with meals"
    }
    res = client.post('/api/medications/', json=payload, headers=patient_headers)
    assert res.status_code == 201
    assert res.get_json()['success'] is True

def test_consent_grant_validation(client, patient_headers):
    """Granting consent requires doctor_uid."""
    res = client.post('/api/consents/', json={}, headers=patient_headers)
    assert res.status_code == 400

def test_consent_grant_success(client, patient_headers):
    """Granting consent to doctor succeeds."""
    res = client.post('/api/consents/', json={"doctor_uid": "mock-doctor-uid-001"}, headers=patient_headers)
    assert res.status_code == 201
    assert res.get_json()['success'] is True
