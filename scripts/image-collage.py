# /// script
# requires-python = ">=3.10,<3.13"
# dependencies = ["rembg[cpu]", "pillow", "numpy", "scipy"]
# ///
"""One collage piece from any image (a painting, an archive photo, a newspaper page), for `shots` in GuideConfig.

  uv run scripts/image-collage.py SRC OUT.png [--crop x0 y0 x1 y1] [--width 900] [--cut] [--tone bw|halftone|colour]
                                 [--rim 12] [--paper]

--crop     fractions of the source (default: all of it)
--cut      cut the main subject out (rembg) and give it a hand-cut white paper rim (`--rim` px, default 12)
           — without it the piece is a print on torn paper (rough white border all round)
--tone     bw (default: punchy black and white on warm paper), halftone (print dots), colour (keep the colours)
--paper    no border at all: a full-bleed texture (a newspaper page behind everything)
--keep-box with --cut: keep the crop's canvas (no trim) so the cut-out lands exactly where its crop was (a figure
           leaving the painting in place); the rim's padding is then `rim + 8` px on every side
"""
import argparse

import numpy as np
from PIL import Image, ImageFilter, ImageOps
from scipy import ndimage

Image.MAX_IMAGE_PIXELS = None
ap = argparse.ArgumentParser()
ap.add_argument("src")
ap.add_argument("out")
ap.add_argument("--crop", nargs=4, type=float, default=[0, 0, 1, 1])
ap.add_argument("--width", type=int, default=900)
ap.add_argument("--cut", action="store_true")
ap.add_argument("--tone", choices=["bw", "halftone", "colour"], default="bw")
ap.add_argument("--rim", type=int, default=12)
ap.add_argument("--paper", action="store_true")
ap.add_argument("--keep-box", action="store_true")
a = ap.parse_args()
rng = np.random.default_rng(7)

im = Image.open(a.src).convert("RGB")
W, H = im.size
x0, y0, x1, y1 = a.crop
crop = im.crop((round(x0 * W), round(y0 * H), round(x1 * W), round(y1 * H)))
crop = crop.resize((a.width, round(crop.height * a.width / crop.width)), Image.LANCZOS)
h, w = crop.height, crop.width

# Tone: everything sits on the same warm paper so pieces from different archives belong together.
PAPER = np.array([244, 238, 226], float) / 255
if a.tone == "colour":
    body = np.asarray(crop).astype(float) / 255
else:
    g = np.asarray(ImageOps.autocontrast(crop.convert("L"), cutoff=1)).astype(float) / 255
    if a.tone == "halftone":
        yy, xx = np.mgrid[0:h, 0:w]
        cell = max(4, a.width / 180)
        u, v = (xx + yy) / np.sqrt(2) / cell, (xx - yy) / np.sqrt(2) / cell
        dots = (np.hypot(u - np.round(u), v - np.round(v)) > np.sqrt(np.clip(1 - g, 0, 1)) * 0.62).astype(float)
        g = np.clip((0.55 * dots + 0.45 * g - 0.05) * 1.12, 0, 1)
    else:
        g = np.clip((g - 0.5) * 1.15 + 0.5 + rng.normal(0, 0.035, g.shape), 0, 1)  # contrast + print grain
    body = g[..., None] * PAPER[None, None, :] + (1 - g[..., None]) * np.array([0.09, 0.09, 0.1])
rgb = (np.clip(body, 0, 1) * 255).astype(np.uint8)

if a.paper:
    Image.fromarray(rgb).save(a.out, quality=90)
    print(a.out, (w, h))
    raise SystemExit

if a.cut:
    from rembg import new_session, remove

    alpha = np.asarray(remove(crop, session=new_session("birefnet-general")).split()[3]) > 128
    alpha = ndimage.binary_opening(alpha, iterations=2)
    lab, _ = ndimage.label(alpha)
    alpha = lab == (np.argmax(np.bincount(lab.ravel())[1:]) + 1)  # the main piece only
    if not a.keep_box:
        ys, xs = np.nonzero(alpha)
        alpha, rgb = alpha[ys.min():ys.max() + 1, xs.min():xs.max() + 1], rgb[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    h, w = alpha.shape
    pad = a.rim + 8
    rim = np.zeros((h + 2 * pad, w + 2 * pad), bool)
    rim[pad:pad + h, pad:pad + w] = alpha
    # Scissors, not a stroke: the dilated outline wobbles a little and its corners are cut straight.
    rim = ndimage.binary_dilation(rim, iterations=a.rim)
    wob = ndimage.gaussian_filter(rng.normal(0, 1, rim.shape), 6) * 40
    rim = ndimage.gaussian_filter(rim.astype(float), 2.5) + wob * 0.02 > 0.5
    inner = np.zeros_like(rim)
    inner[pad:pad + h, pad:pad + w] = alpha
else:
    # A print on torn paper: a white border with ragged fibres all round.
    pad, border = 10, max(10, a.width // 60)
    Ht, Wt = h + 2 * (pad + border), w + 2 * (pad + border)
    Y, X = np.mgrid[0:Ht, 0:Wt]

    def jag(n, amp):
        return ndimage.gaussian_filter1d(rng.normal(0, 1, n), 1.2) * amp + ndimage.gaussian_filter1d(rng.normal(0, 1, n), 12) * amp * 1.5

    rim = (Y >= pad + jag(Wt, 2.5)[None, :]) & (Y <= Ht - pad + jag(Wt, 2.5)[None, :]) & (X >= pad + jag(Ht, 2.5)[:, None]) & (X <= Wt - pad + jag(Ht, 2.5)[:, None])
    inner = np.zeros_like(rim)
    inner[pad + border:pad + border + h, pad + border:pad + border + w] = True
    pad = pad + border

canvas = np.zeros(rim.shape + (4,), np.uint8)
canvas[rim] = [246, 242, 233, 255]
img = np.zeros(rim.shape + (3,), np.uint8)
img[pad:pad + h, pad:pad + w] = rgb
canvas[inner, :3] = img[inner]
canvas[inner, 3] = 255
out = Image.fromarray(canvas, "RGBA")
out.putalpha(out.split()[3].filter(ImageFilter.GaussianBlur(0.7)))
out.save(a.out)
print(a.out, out.size)
