import pytest
import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from config import Config

class TestConfig(Config):
    TESTING = True
    MOCK_MODE = True
    SECRET_KEY = 'test-secret-key-for-onehealth'

@pytest.fixture
def app():
    app = create_app(TestConfig)
    return app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def patient_headers():
    return {
        'Authorization': 'Bearer test-patient-token',
        'X-Mock-Role': 'patient',
        'X-Mock-Uid': 'mock-patient-uid-001'
    }

@pytest.fixture
def doctor_headers():
    return {
        'Authorization': 'Bearer test-doctor-token',
        'X-Mock-Role': 'doctor',
        'X-Mock-Uid': 'mock-doctor-uid-001'
    }
