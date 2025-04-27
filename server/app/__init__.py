from flask import Flask
from app.db import init_db
from app.routes import all_blueprints  

def create_app():
    app = Flask(__name__)
    app.config.from_object('config')
    app.config['UPLOAD_FOLDER'] = app.config['UPLOAD_FOLDER']

    init_db(app)  # Connect MongoDB

    # Register ALL blueprints
    for bp in all_blueprints:
        app.register_blueprint(bp)

    return app
