from flask import Blueprint, send_file, abort
from bson import ObjectId
from io import BytesIO
from app.db import get_db
import gridfs

download_bp = Blueprint('download_bp', __name__)

@download_bp.route('/download/<collection>/<file_id>', methods=['GET'])
def download_file(collection, file_id):
    db = get_db()
    fs = gridfs.GridFS(db, collection=collection)

    try:
        file = fs.get(ObjectId(file_id))
        return send_file(BytesIO(file.read()), download_name=file.filename, mimetype=file.content_type, as_attachment=True)
    except:
        return abort(404, description="File not found")