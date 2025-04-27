from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from app.db import get_db
import gridfs
from datetime import datetime

upload_bp = Blueprint('upload_bp', __name__)

ALLOWED_IMAGE_EXTENSIONS = {'jpg', 'jpeg', 'png'}
ALLOWED_MODEL_EXTENSIONS = {'obj', 'stl', 'gltf', 'glb'}

def allowed_file(filename, allowed_extensions):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

@upload_bp.route('/upload-image', methods=['POST'])
def upload_image():
    if 'file' not in request.files or 'username' not in request.form:
        return jsonify({'error': 'Missing file or username'}), 400

    file = request.files['file']
    username = request.form['username']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if allowed_file(file.filename, ALLOWED_IMAGE_EXTENSIONS):
        filename = secure_filename(file.filename)
        db = get_db()
        fs_images = gridfs.GridFS(db, collection="images")

        metadata = {
            'username': username,
            'uploadTime': datetime.utcnow(),
            'original_filename': filename,
            'contentType': file.content_type
        }

        file_id = fs_images.put(file, filename=filename, metadata=metadata)

        return jsonify({'message': 'Image uploaded successfully!', 'file_id': str(file_id)}), 201

    return jsonify({'error': 'Invalid image file type'}), 400

@upload_bp.route('/upload-3dmodel', methods=['POST'])
def upload_3dmodel():
    if 'file' not in request.files or 'username' not in request.form:
        return jsonify({'error': 'Missing file or username'}), 400

    file = request.files['file']
    username = request.form['username']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if allowed_file(file.filename, ALLOWED_MODEL_EXTENSIONS):
        filename = secure_filename(file.filename)
        db = get_db()
        fs_models = gridfs.GridFS(db, collection="models")

        metadata = {
            'username': username,
            'uploadTime': datetime.utcnow(),
            'original_filename': filename,
            'contentType': file.content_type
        }

        file_id = fs_models.put(file, filename=filename, metadata=metadata)

        return jsonify({'message': '3D model uploaded successfully!', 'file_id': str(file_id)}), 201

    return jsonify({'error': 'Invalid 3D model file type'}), 400