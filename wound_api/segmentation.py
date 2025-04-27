import numpy as np
import torch
from segment_anything import sam_model_registry, SamAutomaticMaskGenerator, SamPredictor
from PIL import Image

_CKPT = "models/sam_vit_b_01ec64.pth"  # adjust if you moved the file

# Lazy loader so we allocate the big model only on first use.
def _get_generator() -> SamAutomaticMaskGenerator:
    if not hasattr(_get_generator, "gen"):
        sam = sam_model_registry["vit_b"](checkpoint=_CKPT)
        # COMMENT OUT IF YOUR MACHINE HAS ENOUGH VRAM TO RUN BOTH DA2 and SAM
        sam.to("cpu")                       # keep VRAM free for Depth-Anything
        _get_generator.gen = SamAutomaticMaskGenerator(
            model=sam,
            points_per_side=24,
            pred_iou_thresh=0.85,
            stability_score_thresh=0.92,
            crop_n_layers=0,
        )
    return _get_generator.gen


def segment_largest_mask(pil_img: Image.Image) -> np.ndarray:
    # Return a binary mask by picking the largest SAM mask.
    masks = _get_generator().generate(np.asarray(pil_img))
    if not masks:
        return np.zeros(pil_img.size[::-1], dtype=np.uint8)
    return max(masks, key=lambda m: m["area"])["segmentation"].astype(np.uint8)

def _get_predictor() -> SamPredictor:
    # Reuse the same SAM weights
    if not hasattr(_get_predictor, "pred"):
        sam = sam_model_registry["vit_b"](checkpoint=_CKPT)
        sam.to("cpu")
        _get_predictor.pred = SamPredictor(sam)
    return _get_predictor.pred


def segment_from_bbox(pil_img, bbox_xyxy) -> np.ndarray:
    predictor = _get_predictor()
    img_np = np.asarray(pil_img)
    predictor.set_image(img_np)

    # SAM expects ndarray (N,4)
    masks, scores, _ = predictor.predict(
        box=np.array(bbox_xyxy)[None, :],
        multimask_output=False,
    )
    return masks[0].astype(np.uint8)
