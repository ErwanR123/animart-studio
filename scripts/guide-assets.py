# Cuts the Guide (and his doodles/stamps) out of the canonical sheets on white paper, with clean
# edges on any background: the paper is keyed out and the ink "unmultiplied" from white, so no halo.
# Usage (from the repo root): python3 scripts/guide-assets.py   → public/guide/*.png (2× Lanczos)
import json, sys
import numpy as np
from PIL import Image
from scipy import ndimage

SHEETS = "docs/design-handoff/visuel/sheets"
OUT = "public/guide"
# name → (sheet, bbox x0,y0,x1,y1 in sheet pixels); filled from the component listing (--list).
CUTS = json.load(open("scripts/guide-cuts.json"))
# Flaws in the source drawings, painted over in the output (2×) pixels: name → [(x, y, r, sample_x, sample_y)].
RETOUCH = {"explaining": [(275, 191, 7.5, 281, 179)]}  # a second pupil in the left eye
# Stamps whose inside also gets a solid mask (<name>-fill.png), to back text with the exact stamp shape.
FILLS = ["stamp-postage"]


def key(rgb):
    """rgb float 0..255 → RGBA with the white paper removed."""
    mn, mx = rgb.min(2), rgb.max(2)
    paper = mn > 236
    # Pale, unsaturated strokes (pencil shadows) that touch the paper are keyed too.
    pale = (mn > 150) & (mx - mn < 24)
    seeds = np.zeros_like(paper)
    seeds[0, :] = seeds[-1, :] = seeds[:, 0] = seeds[:, -1] = True
    lab, _ = ndimage.label(paper | pale)
    outside = np.isin(lab, np.unique(lab[seeds & (paper | pale)]))
    # Paper enclosed by the drawing (between the legs, inside a stamp) is still paper; small
    # white patches (eyes, shirt highlights) are not.
    blank = (mn > 240) & (mx - mn < 12)
    hl, _ = ndimage.label(blank)
    sizes = ndimage.sum(blank, hl, index=np.arange(hl.max() + 1))
    outside |= (sizes > 600)[hl] & blank
    near = ndimage.binary_dilation(outside, iterations=2)
    # Unmultiply from white: c = a*ink + (1-a)*255, with a chosen so the ink is as dark as possible.
    a_key = np.clip((255 - mn) / 255 * 1.6, 0, 1)
    alpha = np.where(near, a_key, 1.0)
    alpha = np.where(outside & (mn > 246), 0, alpha)
    safe = np.maximum(alpha, 1e-3)[..., None]
    ink = np.clip((rgb - (1 - alpha[..., None]) * 255) / safe, 0, 255)
    return np.dstack([ink, alpha * 255]).astype(np.uint8)


def components(sheet):
    rgb = np.asarray(Image.open(f"{SHEETS}/{sheet}").convert("RGB")).astype(float)
    lab, n = ndimage.label(ndimage.binary_dilation(rgb.min(2) < 225, iterations=6))
    for i, sl in enumerate(ndimage.find_objects(lab)):
        h, w = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
        if h * w > 4000:
            print(sheet, i, [sl[1].start, sl[0].start, sl[1].stop, sl[0].stop])


if "--list" in sys.argv:
    for s in sys.argv[2:]:
        components(s)
    sys.exit()

for name, (sheet, box) in CUTS.items():
    x0, y0, x1, y1 = box
    rgb = np.asarray(Image.open(f"{SHEETS}/{sheet}").convert("RGB")).astype(float)
    pad = 6
    crop = rgb[max(0, y0 - pad): y1 + pad, max(0, x0 - pad): x1 + pad]
    rgba = key(crop)
    # Drop pieces of neighbouring figures: anything touching the crop border.
    lab, _ = ndimage.label(ndimage.binary_dilation(rgba[..., 3] > 40, iterations=3))
    edge = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    rgba[np.isin(lab, edge[edge > 0]), 3] = 0
    # Premultiplied upscale so edge pixels don't pick up dark or white fringes.
    a = rgba[..., 3:4].astype(float) / 255
    pre = Image.fromarray(np.dstack([rgba[..., :3] * a, a * 255]).astype(np.uint8), "RGBA")
    big = np.asarray(pre.resize((pre.width * 2, pre.height * 2), Image.LANCZOS)).astype(float)
    ba = np.maximum(big[..., 3:4] / 255, 1e-3)
    out = np.dstack([np.clip(big[..., :3] / ba, 0, 255), big[..., 3]]).astype(np.uint8)
    for x, y, r, sx, sy in RETOUCH.get(name, []):
        yy, xx = np.mgrid[: out.shape[0], : out.shape[1]]
        d = np.hypot(xx - x, yy - y)
        k = np.clip(r + 1 - d, 0, 1)[..., None]  # soft edge
        out[..., :3] = (out[..., :3] * (1 - k) + out[sy, sx, :3] * k).astype(np.uint8)
    Image.fromarray(out, "RGBA").save(f"{OUT}/{name}.png", optimize=True)
    if name in FILLS:
        # The whole stamp silhouette (borders included, it sits behind the art), pulled in off the perforations.
        ink = ndimage.binary_closing(out[..., 3] > 60, iterations=10)
        inside = ndimage.binary_erosion(ndimage.binary_fill_holes(ink), iterations=16)
        Image.fromarray(np.dstack([np.full(inside.shape + (3,), 255, np.uint8), (inside * 255).astype(np.uint8)]), "RGBA").save(f"{OUT}/{name}-fill.png", optimize=True)
    print("wrote", name, out.shape[1], "x", out.shape[0])
