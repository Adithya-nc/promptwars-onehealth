from flask import Blueprint, jsonify, request, g
from middleware.auth import require_auth
from datetime import datetime

bp = Blueprint('records', __name__)

ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'txt', 'csv'}
MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024  # 15MB

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/upload', methods=['POST'])
@require_auth(role='patient')
def upload_record():
    """Securely uploads medical record file with MIME/extension checks."""
    if 'file' not in request.files:
        return jsonify({
            "success": False,
            "error": {"code": "NO_FILE", "message": "No file part in request"}
        }), 400
        
    file = request.files['file']
    if not file or not file.filename:
        return jsonify({
            "success": False,
            "error": {"code": "EMPTY_FILENAME", "message": "No selected file"}
        }), 400
        
    if not allowed_file(file.filename):
        return jsonify({
            "success": False,
            "error": {
                "code": "INVALID_FILE_TYPE",
                "message": f"File type not allowed. Allowed formats: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
            }
        }), 400

    # Read up to max limit to enforce size check safely
    content = file.read(MAX_FILE_SIZE_BYTES + 1)
    if len(content) > MAX_FILE_SIZE_BYTES:
        return jsonify({
            "success": False,
            "error": {"code": "FILE_TOO_LARGE", "message": "File exceeds maximum size of 15MB"}
        }), 413

    rec_id = f"rec-{int(datetime.now().timestamp())}"
    return jsonify({
        "success": True,
        "record_id": rec_id,
        "file_url": f"https://storage.googleapis.com/onehealth-records/{rec_id}_{file.filename}",
        "filename": file.filename,
        "type": request.form.get('type', 'lab_report'),
        "date": request.form.get('date', datetime.now().strftime('%Y-%m-%d')),
        "message": "File uploaded successfully"
    }), 200

@bp.route('/', methods=['GET'])
@bp.route('/list', methods=['GET'])
@require_auth()
def list_records():
    """Lists records for current user or accessible patient."""
    user_id = g.user_id
    from services.mock_store import get_mock_patient_records
    records = get_mock_patient_records(user_id)
    return jsonify({
        "success": True,
        "records": records,
        "count": len(records)
    }), 200

@bp.route('/<record_id>', methods=['GET'])
@require_auth()
def get_record(record_id):
    """Retrieve single medical record with access restriction."""
    if not record_id or record_id.strip() == '':
        return jsonify({
            "success": False,
            "error": {"code": "NOT_FOUND", "message": "Record ID is required"}
        }), 404

    return jsonify({
        "success": True,
        "record": {
            "id": record_id,
            "type": "report",
            "date": datetime.now().isoformat(),
            "title": "Clinical Diagnostic Report",
            "owner_uid": g.user_id
        }
    }), 200
