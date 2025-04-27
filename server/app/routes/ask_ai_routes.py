# app/routes/ask_ai_routes.py

from flask import Blueprint, request, jsonify
from app.utils.qdrant_client import qdrant_client 
from app.utils.gemini import generate_gemini_answer
from app.utils.embedder import generate_embedding

ask_ai_bp = Blueprint('ask_ai_bp', __name__)

@ask_ai_bp.route('/ask-ai', methods=['POST'])
def ask_ai():
    try:
        data = request.get_json()
        question = data['question']
        username = data['username']

        # Embed the question
        question_embedding = generate_embedding(question)

        # Search Qdrant
        search_result = qdrant_client.search(
            collection_name="wound_knowledge",
            query_vector=question_embedding,
            limit=5,
            query_filter={
                "must": [
                    {"key": "username", "match": {"value": username}}
                ]
            }
        )

        # Build context from top matches
        retrieved_context = "\n".join([
            f"Date: {hit.payload['date']}, Area: {hit.payload['area_cm2']} cm²"
            for hit in search_result
        ])

        # Compose final prompt (Doctor thinking)
        final_prompt = f"""
You are a professional wound healing specialist. 
Think carefully like an experienced doctor. Analyze the patient's wound healing records step-by-step.

Instructions:
- Review each record based on the area (cm²) and dates.
- Check if the wound size is decreasing or increasing over time.
- Identify any critical points where healing slows or worsens.
- Think step-by-step before answering.
- Only use the provided records. Do not make up any facts.

Patient Wound Records:
{retrieved_context}

User's Question:
{question}

Give your clinical analysis and a clear final answer.
"""

        # Ask Gemini
        ai_answer = generate_gemini_answer(final_prompt)

        return jsonify({"answer": ai_answer}), 200

    except Exception as e:
        print("Error in AskAI:", str(e))
        return jsonify({"error": str(e)}), 500