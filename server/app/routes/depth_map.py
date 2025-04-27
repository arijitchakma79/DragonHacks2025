from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from app.db import get_db
import gridfs
from datetime import datetime

depthmap_bp = Blueprint('depthmap_bp', __name__)

ALLOWED_DEPTHMAP_EXTENSIONS = {'jpg', 'jpeg', 'png'}

def allowed_depthmap(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_DEPTHMAP_EXTENSIONS

@depthmap_bp.route('/upload-depthmap', methods=['POST'])
def upload_depthmap():
    if 'file' not in request.files or 'username' not in request.form:
        return jsonify({'error': 'Missing file or username'}), 400

    file = request.files['file']
    username = request.form['username']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if allowed_depthmap(file.filename):
        filename = secure_filename(file.filename)
        db = get_db()
        fs_depthmaps = gridfs.GridFS(db, collection="depthmaps")

        metadata = {
            'username': username,
            'uploadTime': datetime.utcnow(),
            'original_filename': filename,
            'contentType': file.content_type
        }

        file_id = fs_depthmaps.put(file, filename=filename, metadata=metadata)

        return jsonify({'message': 'Depth map uploaded successfully!', 'file_id': str(file_id)}), 201

    return jsonify({'error': 'Invalid depthmap file type'}), 400
