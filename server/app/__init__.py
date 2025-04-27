# app/init.py
from flask import Flask
from app.db import init_db
from app.model.routes import upload_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object('config')
    app.config['UPLOAD_FOLDER'] = app.config['UPLOAD_FOLDER']

    init_db(app)  # Connect MongoDB
    app.register_blueprint(upload_bp)  # Register upload API

    return app