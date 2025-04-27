from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse, StreamingResponse

import base64
import json
import io
import os
import tempfile
from typing import Tuple

import cv2
import numpy as np
import torch
import open3d as o3d
from PIL import Image

from .depth import predict_depth_pil
from .segmentation import segment_largest_mask, segment_from_bbox
from .geometry import project, measure as geom_measure

app = FastAPI(title="Wound-Measurement-API")

def _png_b64(arr_uint8: np.ndarray) -> str:
    ok, buf = cv2.imencode(".png", arr_uint8)
    return base64.b64encode(buf).decode() if ok else ""

MAX_SIDE = 1024  # px – downscale longest side to keep VRAM low

def _downscale(pil_img: Image.Image, max_side: int = MAX_SIDE) -> Image.Image:
    w, h = pil_img.size 
    scale = max_side / max(w, h)
    return pil_img.resize((int(w * scale), int(h * scale))) if scale < 1 else pil_img

def _build_mesh(depth_pil: Image.Image, mask: np.ndarray) -> io.BytesIO:
    pts = project(mask, depth_pil)
    if pts.shape[0] < 30:
        raise ValueError("Not enough 3-D points to reconstruct mesh.")

    pcd = o3d.geometry.PointCloud(o3d.utility.Vector3dVector(pts))
    pcd.estimate_normals()

    mesh, _ = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(
        pcd, depth=7
    )
    mesh.remove_degenerate_triangles()
    mesh.remove_duplicated_triangles()
    mesh.remove_unreferenced_vertices()
    mesh.compute_vertex_normals()

    tmp = tempfile.NamedTemporaryFile(suffix=".obj", delete=False)
    tmp.close()
    o3d.io.write_triangle_mesh(tmp.name, mesh, write_ascii=True)
    with open(tmp.name, "rb") as fh:
        data = fh.read()
    os.remove(tmp.name)

    buf = io.BytesIO(data)
    buf.seek(0)
    return buf


@app.get("/")
async def root():
    """Simple health-check and pointer to Swagger UI."""
    return {
        "status": "running",
        "docs": "/docs",
        "endpoints": [
            "/analyze_wound",
            "/preview/depth",
            "/preview/mask",
            "/mesh",
        ],
    }


@app.post("/analyze_wound")
async def analyze_wound(
    file: UploadFile = File(...),
    bbox: str | None = Form(default=None),
):
    try:
        img = Image.open(io.BytesIO(await file.read())).convert("RGB")
        img = _downscale(img)

        # depth (GPU if available)
        depth = predict_depth_pil(img)
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

        # segmentation (RAN ON CPU)
        if bbox:
        # parse the JSON list we sent from Expo
            x0, y0, x1, y1 = map(float, json.loads(bbox))
            mask = segment_from_bbox(img, [x0, y0, x1, y1])
        else:
            mask = segment_largest_mask(img)    # fallback

        pts = project(mask, depth)
        dims, area = geom_measure(pts)
        if dims is None:
            raise ValueError("Could not detect wound region.")

        return JSONResponse(
            {
                "width_m": float(dims[0]),
                "height_m": float(dims[1]),
                "depth_m": float(dims[2]),
                "surface_area_m2": float(area),
                "mask_preview_b64": _png_b64(mask.astype("uint8") * 255),
                "depth_preview_b64": _png_b64(np.asarray(depth, np.uint8)),
            }
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@app.post("/preview/depth")
async def depth_preview(file: UploadFile = File(...)):
    pass
    # TODO: The analyze_wound needs to save to database, this should read from database? Maybe?

@app.post("/preview/mask")
async def mask_preview(file: UploadFile = File(...)):
    pass
    # TODO: The analyze_wound needs to save to database, this should read from database? Maybe?

@app.post("/mesh")
async def mesh_obj(file: UploadFile = File(...)):
    
    # TODO: This re-runs the whole pipeline, takes a while. Maybe reuse saved info from the database here

    try:
        img = Image.open(io.BytesIO(await file.read())).convert("RGB")
        img = _downscale(img)

        depth = predict_depth_pil(img) #THIS STEP IS SLOW
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        mask = segment_largest_mask(img) #THIS STEP IS SLOW
        buf = _build_mesh(depth, mask)  

        headers = {
            "Content-Disposition": 'attachment; filename="wound.obj"'
        }
        return StreamingResponse(buf, media_type="text/plain", headers=headers)

    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
