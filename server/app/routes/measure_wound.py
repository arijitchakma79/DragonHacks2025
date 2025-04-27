from flask import Blueprint, request, jsonify
import json, io, base64
from PIL import Image
from app.model.wound_measure import (
    depth_from_pil, mask_from_image, _project, dims_and_area, previews
)

measure_bp = Blueprint("measure_bp", __name__)

@measure_bp.route("/measure-wound", methods=["POST"])
def measure_wound():
    if "file" not in request.files:
        return jsonify({"error": "missing image file"}), 400

    # parse optional bbox prompt
    bbox = request.form.get("bbox")
    bbox_arr = None
    if bbox:
        try:
            bbox_arr = json.loads(bbox)
            assert isinstance(bbox_arr, list) and len(bbox_arr) == 4
        except Exception:
            return jsonify({"error": "bbox must be JSON array [x0,y0,x1,y1]"}), 422

    # run pipeline
    pil_img = Image.open(request.files["file"].stream).convert("RGB")
    depth_pil = depth_from_pil(pil_img)
    mask = mask_from_image(pil_img, bbox_arr)
    points = _project(mask, depth_pil)

    try:
        dims, area = dims_and_area(points)
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 422

    mask_b64, depth_b64 = previews(mask, depth_pil)

    return jsonify({
        "width_m":  float(dims[0]),
        "height_m": float(dims[1]),
        "depth_m":  float(dims[2]),
        "surface_area_m2": float(area),
        "mask_preview_b64":  mask_b64,
        "depth_preview_b64": depth_b64,
    })
