import pytest

def test_symptom_analyzer_empty_input(client, patient_headers):
    """Empty symptom input must be rejected with 400 validation error."""
    res = client.post('/api/ai/analyze-symptoms', json={"symptoms": []}, headers=patient_headers)
    assert res.status_code == 400
    data = res.get_json()
    assert data['success'] is False
    assert data['error']['code'] == 'MISSING_SYMPTOMS'

def test_symptom_analyzer_valid_input(client, patient_headers):
    """Valid symptoms must produce structured clinical triage assessment."""
    payload = {
        "symptoms": ["mild headache", "fatigue"],
        "duration": "2 days",
        "severity": "mild"
    }
    res = client.post('/api/ai/analyze-symptoms', json=payload, headers=patient_headers)
    assert res.status_code == 200
    data = res.get_json()
    assert 'severity' in data
    assert 'possible_conditions' in data
    assert 'recommendations' in data
    assert 'disclaimer' in data
    assert data['seek_emergency'] is False

def test_symptom_analyzer_emergency_red_flags(client, patient_headers):
    """Red flag symptoms like severe chest pain must trigger emergency escalation."""
    payload = {
        "symptoms": ["severe chest pain", "difficulty breathing"],
        "duration": "1 hour"
    }
    res = client.post('/api/ai/analyze-symptoms', json=payload, headers=patient_headers)
    assert res.status_code == 200
    data = res.get_json()
    assert data['seek_emergency'] is True
    assert data['severity'] == 'critical'
    assert 'emergency' in data['urgency'].lower()

def test_report_analyzer_empty_input(client, patient_headers):
    """Empty report text must return 400 without fabricating fake biomarkers."""
    res = client.post('/api/ai/analyze-report', json={"text": ""}, headers=patient_headers)
    assert res.status_code == 400
    data = res.get_json()
    assert data['success'] is False
    assert data['error']['code'] == 'EMPTY_DOCUMENT'

def test_report_analyzer_biomarker_extraction(client, patient_headers):
    """Medical text with lab values must be parsed with reference ranges and date."""
    lab_text = """
    CENTRAL PATHOLOGY CLINIC
    Date: 2026-05-12
    Patient: John Doe
    Haemoglobin: 13.8 g/dL
    WBC Count: 7200 cells/uL
    Fasting Blood Sugar: 95 mg/dL
    """
    res = client.post('/api/ai/analyze-report', json={
        "text": lab_text,
        "file_name": "CBC_Report_May2026.pdf"
    }, headers=patient_headers)
    assert res.status_code == 200
    data = res.get_json()
    assert data['success'] is True
    analysis = data['analysis']
    assert analysis['report_date'] == '2026-05-12'
    extracted = analysis['extracted_values']
    assert len(extracted) >= 2
    params = [v['parameter'] for v in extracted]
    assert any('Haemoglobin' in p for p in params)

def test_ai_feedback_analysis(client, patient_headers):
    """Feedback endpoint must classify sentiment and urgency."""
    res = client.post('/api/ai/feedback', json={
        "text": "The digital passport makes sharing records with my cardiologist very fast and easy!",
        "type": "care_experience"
    }, headers=patient_headers)
    assert res.status_code == 200
    data = res.get_json()
    assert data['success'] is True
    assert data['feedback_analysis']['sentiment'] == 'positive'

def test_ai_emergency_guidance(client, patient_headers):
    """Emergency guidance must provide immediate life safety instructions."""
    res = client.post('/api/ai/emergency', json={
        "query": "Patient experiencing sudden chest constriction and dizziness"
    }, headers=patient_headers)
    assert res.status_code == 200
    data = res.get_json()
    assert data['success'] is True
    triage = data['emergency_triage']
    assert triage['is_critical'] is True
    assert len(triage['immediate_steps']) > 0

def test_ai_report_generator(client, patient_headers):
    """Health summary generator must return consolidated report."""
    res = client.post('/api/ai/report', json={
        "patientId": "mock-patient-uid-001",
        "sources": ["vitals", "records", "medications"]
    }, headers=patient_headers)
    assert res.status_code == 200
    data = res.get_json()
    assert data['success'] is True
    assert 'report' in data
