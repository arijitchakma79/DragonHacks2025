# app/routes/fetch_knowledge_routes.py

from flask import Blueprint, jsonify, current_app
from app.db import get_db

fetch_knowledge_bp = Blueprint('fetch_knowledge_bp', __name__)

@fetch_knowledge_bp.route('/fetch-user-knowledge/<username>', methods=['GET'])
def fetch_user_knowledge(username):
    try:
        db = get_db()
        
        # Wound records collection
        wound_records = list(db["wound_records"].find({"username": username}).sort("date", 1))

        # Build full knowledge base
        knowledge_base = []

        server_url = current_app.config.get('SERVER_URL', 'http://127.0.0.1:5000')  # Config or default

        for record in wound_records:
            wound_info = {
                "date": record.get("date"),
                "time": record.get("time"),
                "length_cm": record.get("length_cm"),
                "width_cm": record.get("width_cm"),
                "area_cm2": round(record.get("length_cm", 0) * record.get("width_cm", 0), 2),
                "image_url": f"{server_url}/download/images/{record.get('image_file_id')}",
                "model_url": f"{server_url}/download/models/{record.get('model_file_id')}" if record.get('model_file_id') else None,
            }
            knowledge_base.append(wound_info)

        return jsonify({
            "username": username,
            "wound_knowledge_base": knowledge_base,
            "record_count": len(knowledge_base)
        }), 200

    except Exception as e:
        print("Error fetching user knowledge:", str(e))
        return jsonify({"error": str(e)}), 500
