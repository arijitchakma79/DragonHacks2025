from .upload_wound import upload_wound_bp
from .list_user_wounds import list_wounds_bp
from .download_routes import download_bp
from .measure_wound import measure_bp 
from .analyze_routes import analyze_bp
from .fetch_knowledge_routes import fetch_knowledge_bp

all_blueprints = [
    upload_wound_bp,
    list_wounds_bp,
    download_bp,
    measure_bp,
    analyze_bp,
    fetch_knowledge_bp
]
