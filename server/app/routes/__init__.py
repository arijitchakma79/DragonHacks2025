from .upload_routes import upload_bp
from .depth_map import depthmap_bp
from .download_routes import download_bp
from .list_routes import list_bp

all_blueprints = [upload_bp, depthmap_bp, download_bp, list_bp]
