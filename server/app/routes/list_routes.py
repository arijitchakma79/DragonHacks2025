from flask import Blueprint, jsonify
from app.db import get_db

list_bp = Blueprint('list_bp', __name__)

@list_bp.route('/user-files/<username>', methods=['GET'])
def list_user_files(username):
    db = get_db()

    fs_images = db["images.files"]
    fs_models = db["models.files"]
    fs_depthmaps = db["depthmaps.files"]

    images = list(fs_images.find({"metadata.username": username}, {"filename": 1, "uploadDate": 1}))
    models = list(fs_models.find({"metadata.username": username}, {"filename": 1, "uploadDate": 1}))
    depthmaps = list(fs_depthmaps.find({"metadata.username": username}, {"filename": 1, "uploadDate": 1}))

    def format_file(doc):
        return {
            "file_id": str(doc["_id"]),
            "filename": doc["filename"],
            "uploadDate": doc["uploadDate"]
        }

    return jsonify({
        "images": [format_file(doc) for doc in images],
        "models": [format_file(doc) for doc in models],
        "depthmaps": [format_file(doc) for doc in depthmaps]
    })
