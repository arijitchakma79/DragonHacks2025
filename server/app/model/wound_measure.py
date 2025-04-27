"""
Lazy-loaded helpers for depth → mask → 3-D → metrics
(kept separate from the Flask blueprint so nothing reloads twice)
"""
from __future__ import annotations
import json, io, base64, numpy as np, open3d as o3d
from typing import Optional, Tuple, List
from PIL import Image
import torch
from transformers import pipeline
from segment_anything import sam_model_registry, SamAutomaticMaskGenerator, SamPredictor

# ───────────────────────── depth ──────────────────────────
_depth_pipe = None
def depth_from_pil(img: Image.Image):
    global _depth_pipe
    if _depth_pipe is None:
        device = 0 if torch.cuda.is_available() else -1
        _depth_pipe = pipeline(
            "depth-estimation",
            model="depth-anything/Depth-Anything-V2-Large-hf",
            torch_dtype=torch.float16 if device == 0 else torch.float32,
            device=device,
        )
        if device == 0:
            _depth_pipe.model.half()
    return _depth_pipe(img)["depth"]   # PIL, mode="F", metres

# ──────────────────────── SAM (seg) ───────────────────────
_SAM_GEN = None
_SAM_PRED = None
_CKPT = "models/sam_vit_b_01ec64.pth"   # relative to repo root

def _get_gen():
    global _SAM_GEN
    if _SAM_GEN is None:
        sam = sam_model_registry["vit_b"](checkpoint=_CKPT)
        sam.to("cpu")
        _SAM_GEN = SamAutomaticMaskGenerator(
            model=sam,
            points_per_side=16,
            pred_iou_thresh=0.85,
            stability_score_thresh=0.92,
            crop_n_layers=0,
        )
    return _SAM_GEN

def _get_pred():
    global _SAM_PRED
    if _SAM_PRED is None:
        sam = sam_model_registry["vit_b"](checkpoint=_CKPT)
        sam.to("cpu")
        _SAM_PRED = SamPredictor(sam)
    return _SAM_PRED

def mask_from_image(img: Image.Image, bbox: Optional[List[float]]):
    if bbox:                                  # prompt with one box
        pred = _get_pred()
        pred.set_image(np.asarray(img))
        masks, _, _ = pred.predict(box=np.array(bbox)[None, :],
                                   multimask_output=False)
        return masks[0].astype(np.uint8)
    # fallback: largest automatic mask
    masks = _get_gen().generate(np.asarray(img))
    if not masks:
        return np.zeros(img.size[::-1], dtype=np.uint8)
    return max(masks, key=lambda m: m["area"])["segmentation"].astype(np.uint8)

# ───────────────────── 3-D + metrics ──────────────────────
def _project(mask: np.ndarray, depth_pil: Image.Image) -> np.ndarray:
    d = np.asarray(depth_pil, np.float32)      # metres
    h, w = d.shape
    fx = fy = max(h, w) * 1.2
    cx, cy = w / 2, h / 2
    ys, xs = np.where(mask > 0)
    z = d[ys, xs]
    x = (xs - cx) * z / fx
    y = (ys - cy) * z / fy
    return np.column_stack((x, y, z)).astype(np.float32)

def dims_and_area(points: np.ndarray) -> Tuple[np.ndarray, float]:
    if points.shape[0] < 30:
        raise RuntimeError("Too few points for 3-D reconstruction.")
    pcd = o3d.geometry.PointCloud(o3d.utility.Vector3dVector(points))
    bbox = pcd.get_axis_aligned_bounding_box()
    dims = bbox.get_extent()                  # (w,h,d) in metres
    mesh, _ = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(
        pcd, depth=7
    )
    area = mesh.get_surface_area()            # m²
    return dims, area

# ────────────────────── convenience dump ───────────────────
def previews(mask: np.ndarray, depth_pil: Image.Image) -> Tuple[str, str]:
    mask_png = Image.fromarray(mask.astype("uint8") * 255)
    buf1 = io.BytesIO(); mask_png.save(buf1, format="PNG")
    buf2 = io.BytesIO(); depth_pil.convert("L").save(buf2, format="PNG")
    return (base64.b64encode(buf1.getvalue()).decode(),
            base64.b64encode(buf2.getvalue()).decode())
