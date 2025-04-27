from transformers import pipeline
import torch, functools

@functools.lru_cache(1)
def _load_pipe():
    device = 0 if torch.cuda.is_available() else -1
    pipe = pipeline(
        "depth-estimation",
        model="depth-anything/Depth-Anything-V2-Large-hf",
        torch_dtype=torch.float16 if device == 0 else torch.float32,
        device=device,
    )
    if device == 0: # ensure half-precision weights if running on CPU
        pipe.model.half()
    return pipe

def predict_depth_pil(pil_img):
    return _load_pipe()(pil_img)["depth"]
