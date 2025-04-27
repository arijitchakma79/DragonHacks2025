import base64
import io
import json
from pathlib import Path
import requests
from PIL import Image

SERVER = "http://127.0.0.1:8000"
IMAGE  = Path("example_output/wound.png")   # path to your test photo
BBOX   = [148, 114, 175, 132]               # [x0, y0, x1, y1] in pixel space

resp = requests.post(
    f"{SERVER}/analyze_wound",
    files={"file": IMAGE.open("rb")},
    data={"bbox": json.dumps(BBOX)},
)
resp.raise_for_status()

payload = resp.json()

mask_png = base64.b64decode(payload["mask_preview_b64"])
mask_img = Image.open(io.BytesIO(mask_png))
depth_png = base64.b64decode(payload["depth_preview_b64"])
depth_img = Image.open(io.BytesIO(depth_png))

mask_img.save("mask.png")
mask_img.show()
depth_img.save("depth.png")
depth_img.show()