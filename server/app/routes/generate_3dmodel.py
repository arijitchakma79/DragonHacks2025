from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from app.model.depth_to_mesh import generate_mesh_from_image

generate_bp = Blueprint('generate_bp', __name__)

@generate_bp.route('/generate-depthmap-3dmodel', methods=['POST'])
def generate_depthmap_3dmodel():
    if 'file' not in request.files or 'username' not in request.form:
        return jsonify({'error': 'Missing file or username'}), 400

    file = request.files['file']
    username = request.form['username']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        file_id, mesh_filename = generate_mesh_from_image(file, username)

        return jsonify({
            'message': '3D model generated successfully!',
            'file_id': str(file_id),
            'filename': mesh_filename
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500
