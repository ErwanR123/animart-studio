# /// script
# requires-python = ">=3.10"
# dependencies = ["pillow"]
# ///
"""Measure coordinates on a painting: a crop with a labelled grid in fractions of the WHOLE painting, so the numbers
go straight into an episode config (fx, fy, view, spots, eyes…).

  uv run scripts/image-grid.py public/art/athens/athens.jpg                       # whole painting, 10 × 10 grid
  uv run scripts/image-grid.py public/art/athens/athens.jpg 0.42 0.75 0.45 0.79   # zoom on a region (x0 y0 x1 y1)
  uv run scripts/image-grid.py public/art/athens/athens.jpg 0.42 0.75 0.45 0.79 --inset public/art/athens/athens-heraclitus.jpg 0.38373 0.74079 0.11627 0.20987
  … --mark 0.4345,0.7778 --mark 0.425,0.7774                        # circle candidate points to check them

--inset reads the pixels from a high-res crop laid over the painting (its x y w h as in the config's `insets`), for
details too small for the main image (eyes, a signature). Output: out/grid.png (open it to read the numbers).
"""
import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

Image.MAX_IMAGE_PIXELS = None

ap = argparse.ArgumentParser()
ap.add_argument("image")
ap.add_argument("box", nargs="*", type=float, help="x0 y0 x1 y1 in fractions of the painting (default: all of it)")
ap.add_argument("--inset", nargs=5, metavar=("SRC", "X", "Y", "W", "H"))
ap.add_argument("--mark", action="append", default=[], help="fx,fy to circle")
ap.add_argument("--lines", type=int, default=10)
args = ap.parse_args()
x0, y0, x1, y1 = args.box or (0, 0, 1, 1)

if args.inset:
    src, ix, iy, iw, ih = args.inset[0], *map(float, args.inset[1:])
    im = Image.open(src)
    to_px = lambda fx, fy: ((fx - ix) / iw * im.width, (fy - iy) / ih * im.height)  # noqa: E731
else:
    im = Image.open(args.image)
    to_px = lambda fx, fy: (fx * im.width, fy * im.height)  # noqa: E731
(a, b), (c, d) = to_px(x0, y0), to_px(x1, y1)
crop = im.crop((int(a), int(b), int(c), int(d))).convert("RGB")
crop = crop.resize((1400, max(1, round(1400 * crop.height / crop.width))))
w, h = crop.size
draw = ImageDraw.Draw(crop)
font = ImageFont.load_default(size=20)
n = args.lines
for i in range(1, n):
    x, y = w * i / n, h * i / n
    draw.line([(x, 0), (x, h)], fill=(255, 60, 60), width=1)
    draw.line([(0, y), (w, y)], fill=(60, 220, 255), width=1)
    draw.text((x + 3, 3), f"{x0 + (x1 - x0) * i / n:.4f}", fill=(255, 235, 80), font=font, stroke_width=2, stroke_fill="black")
    draw.text((3, y + 3), f"{y0 + (y1 - y0) * i / n:.4f}", fill=(255, 235, 80), font=font, stroke_width=2, stroke_fill="black")
for m in args.mark:
    fx, fy = map(float, m.split(","))
    px, py = (fx - x0) / (x1 - x0) * w, (fy - y0) / (y1 - y0) * h
    draw.ellipse([px - 10, py - 10, px + 10, py + 10], outline=(60, 255, 60), width=3)
out = Path("out/grid.png")
out.parent.mkdir(exist_ok=True)
crop.save(out)
print(out)
