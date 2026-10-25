# /// script
# requires-python = ">=3.10,<3.13"
# dependencies = ["transformers>=4.45", "torch", "pillow", "numpy"]
# ///
"""Depth map of a painting, for the 3D camera inside it (src/guide/shader.ts, `depth` in GuideConfig).

Usage (from the repo root): uv run scripts/image-depth.py public/art/scream/scream.jpg
  → out/scream-depth.png (to look at) and public/art/scream/scream-3d.jpg (what the engine loads: the painting on top,
    its depth under it, one texture for the shader)
Depth Anything V2 Small (Apache-2.0, runs locally, free): white = near, black = far, lightly smoothed so the parallax
bends the paint instead of tearing it at every brush stroke.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from transformers import pipeline

src = Path(sys.argv[1])
out = Path("out") / f"{src.stem}-depth.png"  # a preview only: the engine loads the -3d.jpg
out.parent.mkdir(exist_ok=True)
Image.MAX_IMAGE_PIXELS = None
image = Image.open(src).convert("RGB")
small = image.resize((1024, round(1024 * image.height / image.width)), Image.LANCZOS)
depth = pipeline(task="depth-estimation", model="depth-anything/Depth-Anything-V2-Small-hf")(small)["predicted_depth"]
d = depth.squeeze().numpy().astype(np.float32)
d = (d - d.min()) / max(1e-6, d.max() - d.min())
img = Image.fromarray((d * 255).astype(np.uint8)).resize(small.size, Image.BICUBIC).filter(ImageFilter.GaussianBlur(2))
img.save(out)
W = 2048
paint = image.resize((W, round(W * image.height / image.width)), Image.LANCZOS)
stack = Image.new("RGB", (W, paint.height * 2))
stack.paste(paint, (0, 0))
stack.paste(img.resize(paint.size, Image.BICUBIC).convert("RGB"), (0, paint.height))
stack.save(src.with_name(f"{src.stem}-3d.jpg"), quality=90)
print(f"wrote {out} {img.size} and {src.stem}-3d.jpg {stack.size}")
