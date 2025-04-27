import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI')
MONGO_DBNAME = os.getenv('MONGO_DBNAME')
UPLOAD_FOLDER = '3d_objects' 
GEMINI_API_KEY=os.getenv('GOOGLE_GEMINI_API_KEY')
