from flask import Blueprint, jsonify
from app.db import get_db

list_wounds_bp = Blueprint('list_wounds_bp', __name__)

@list_wounds_bp.route('/user-wounds/<username>', methods=['GET'])
def list_user_wounds(username):
    db = get_db()

    wounds = list(db["wound_records"].find({"username": username}).sort("date", 1))

    def format_wound(doc):
        return {
            "date": doc["date"],
            "time": doc["time"],
            "length_cm": doc["length_cm"],
            "width_cm": doc["width_cm"],
            "image_file_id": str(doc["image_file_id"]),
            "model_file_id": str(doc["model_file_id"]),
        }

    return jsonify([format_wound(doc) for doc in wounds])
