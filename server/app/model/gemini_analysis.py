# app/model/gemini_analysis.py

from google import genai
from flask import current_app

def analyze_with_gemini(prompt: str) -> str:
    """
    Analyze wound data using Gemini 2.0 model.

    Args:
        prompt (str): The full prompt text to send to Gemini.

    Returns:
        str: The text response from Gemini.
    """
    # Load the Gemini API key from Flask app config
    api_key = current_app.config['GEMINI_API_KEY']

    # Initialize Gemini client
    client = genai.Client(api_key=api_key)

    # Send prompt
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",  # or "gemini-pro" if you prefer
            contents=prompt
        )
        return response.text
    except Exception as e:
        print("Gemini API Error:", str(e))
        return "Error analyzing wound data."
