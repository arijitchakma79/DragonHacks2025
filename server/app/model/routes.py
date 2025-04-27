from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from app.db import get_db
import gridfs

upload_bp = Blueprint('upload_bp', __name__)

ALLOWED_EXTENSIONS = {'obj', 'stl', 'gltf', 'glb'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        db = get_db()
        fs = gridfs.GridFS(db)

        # Save file into GridFS
        file_id = fs.put(file, filename=filename, content_type=file.content_type)

        return jsonify({
            'message': 'File uploaded successfully!',
            'file_id': str(file_id),
            'filename': filename
        }), 201

    return jsonify({'error': 'Invalid file type'}), 400
