# app/routes/analyze_routes.py

from flask import Blueprint, request, jsonify
from app.model.gemini_analysis import analyze_with_gemini

analyze_bp = Blueprint('analyze_bp', __name__)

@analyze_bp.route('/analyze-wound-data', methods=['POST'])
def analyze_wound_data():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()

    try:
        prompt = f"""
You are a medical wound healing expert.

Analyze the following wound data:

{data}

Your tasks:
- Check if healing is good or bad.
- Predict how many days or weeks until full healing.
- Identify any warning signs.
- Suggest tips to improve healing.

Respond clearly in simple sentences.
"""

        result = analyze_with_gemini(prompt)
        return jsonify({"analysis": result}), 200

    except Exception as e:
        print("Analyze route error:", str(e))
        return jsonify({"error": str(e)}), 500
