from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import gridfs
from app.db import get_db
from app.model.depth_to_mesh import generate_mesh_from_image_local 

upload_wound_bp = Blueprint('upload_wound_bp', __name__)

ALLOWED_IMAGE_EXTENSIONS = {'jpg', 'jpeg', 'png'}

def allowed_image(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_IMAGE_EXTENSIONS

@upload_wound_bp.route('/upload-wound', methods=['POST'])
def upload_wound():
    if 'file' not in request.files or 'username' not in request.form:
        return jsonify({'error': 'Missing file or username'}), 400

    file = request.files['file']
    username = request.form['username']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if allowed_image(file.filename):
        db = get_db()
        fs_images = gridfs.GridFS(db, collection="images")
        fs_models = gridfs.GridFS(db, collection="models")

        # Save image temporarily
        filename = secure_filename(file.filename)
        temp_image_path = os.path.join('uploads', filename)
        file.save(temp_image_path)

        # Save original image to GridFS
        with open(temp_image_path, "rb") as f:
            image_file_id = fs_images.put(f, filename=filename, metadata={
                'username': username,
                'uploadTime': datetime.utcnow(),
                'contentType': file.content_type
            })

        # Generate 3D model from image
        model_file_id, _ = generate_mesh_from_image_local(temp_image_path, username)

        # Estimate dummy length/width for now (replace with real calc later)
        length_cm = 5.0
        width_cm = 3.0

        # Save wound record
        date_now = datetime.utcnow()
        wound_record = {
            'username': username,
            'date': date_now.strftime('%Y-%m-%d'),
            'time': date_now.strftime('%H:%M:%S'),
            'image_file_id': image_file_id,
            'model_file_id': model_file_id,
            'length_cm': length_cm,
            'width_cm': width_cm
        }
        db["wound_records"].insert_one(wound_record)

        # Cleanup temp image
        os.remove(temp_image_path)

        return jsonify({'message': 'Wound record uploaded successfully!'}), 201

    return jsonify({'error': 'Invalid image file type'}), 400
