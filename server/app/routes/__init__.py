from .upload_wound import upload_wound_bp
from .list_user_wounds import list_wounds_bp
from .download_routes import download_bp

all_blueprints = [
    upload_wound_bp,
    list_wounds_bp,
    download_bp
]
