from google import genai
from flask import current_app

# Setup Gemini client (initialize inside the function to ensure app context)
def generate_gemini_answer(prompt_text):
    GEMINI_API_KEY = current_app.config['GEMINI_API_KEY']
    client = genai.Client(api_key=GEMINI_API_KEY)

    response = client.models.generate_content(
        model="gemini-2.0-pro",  # or "gemini-2.0-flash"
        contents=[
            {"type": "text", "text": prompt_text}
        ]
    )

    return response.text.strip()