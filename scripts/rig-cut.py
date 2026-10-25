# /// script
# requires-python = ">=3.10,<3.13"
# dependencies = ["rembg[cpu]", "pillow", "numpy", "scipy"]
# ///
"""A paper puppet (a `rig` layer, src/guide/rigs.ts) cut from an archive photo or print: every limb is its own piece of
paper with a hand-cut rim, drawn where it sits in the source, so the rest pose is the photo itself.

  uv run scripts/rig-cut.py scripts/rigs/napoleon.json

The spec (JSON):
  out        folder for the pieces (public/art/rigs/<name>)
  scale      rig px per source px
  tone       halftone | bw | colour (as image-collage.py)
  sources    {id: {file, crop: [x0, y0, x1, y1]}} in fractions; the FIRST one sets the rig's canvas
  parts      in drawing order (back to front), {name: {...}}:
    src      a source id (default the first)
    poly     the piece's outline, [[x, y], …] fractions of its source, intersected with the cut-out figure
    solid    keep the whole polygon (not only the figure): where a limb was cut away, the paper behind is refilled
    holes    polygons inside the piece to refill from the paper around them (a limb that lay over it)
    joint    the pivot, [x, y] fractions of its source
    end      a point carried along (the hand's grip on a forearm), [x, y] fractions
    to, size another source's piece placed so its joint lands on `to` (fractions of the first source), `size` = its
             scale against the first source
    mirror   copy a part already cut, flipped, its joint landing on `to` (a back arm from the front one)
  marks      {name: [x, y]} points of the first source the puppet needs in rig px (where a drawn tail starts)
Writes <part>.png for each piece, and src/guide/rigs/<name>.json (name = the out folder's): the canvas size and each
piece's box, joint and end in rig px.
"""
import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps
from scipy import ndimage

Image.MAX_IMAGE_PIXELS = None
ap = argparse.ArgumentParser()
ap.add_argument("spec")
spec = json.loads(Path(ap.parse_args().spec).read_text())
rng = np.random.default_rng(7)
out = Path(spec["out"])
out.mkdir(parents=True, exist_ok=True)
PAPER = np.array([244, 238, 226], float) / 255
RIM = spec.get("rim", 6)


def tone(img: Image.Image) -> np.ndarray:
    """The episode's print look (image-collage.py), so a puppet sits with the other pieces."""
    if spec.get("tone") == "colour":
        return np.asarray(img.convert("RGB")).astype(float) / 255
    g = np.asarray(ImageOps.autocontrast(img.convert("L"), cutoff=1)).astype(float) / 255
    if spec.get("tone", "halftone") == "halftone":
        h, w = g.shape
        yy, xx = np.mgrid[0:h, 0:w]
        cell = spec.get("cell", 5)
        u, v = (xx + yy) / np.sqrt(2) / cell, (xx - yy) / np.sqrt(2) / cell
        dots = (np.hypot(u - np.round(u), v - np.round(v)) > np.sqrt(np.clip(1 - g, 0, 1)) * 0.62).astype(float)
        g = np.clip((0.55 * dots + 0.45 * g - 0.05) * 1.12, 0, 1)
    else:
        g = np.clip((g - 0.5) * 1.15 + 0.5 + rng.normal(0, 0.035, g.shape), 0, 1)
    return g[..., None] * PAPER[None, None, :] + (1 - g[..., None]) * np.array([0.09, 0.09, 0.1])


def refill(rgb: np.ndarray, known: np.ndarray) -> np.ndarray:
    """Paint the unknown pixels from the known ones around them (normalised blurs, wide to narrow)."""
    outp = rgb.copy()
    for s in (40, 16, 6, 2):
        w = ndimage.gaussian_filter(known.astype(float), s)
        fill = np.stack([ndimage.gaussian_filter(rgb[..., c] * known, s) for c in range(3)], -1) / np.maximum(w, 1e-6)[..., None]
        ok = (w > 0.02) & ~known
        outp[ok] = fill[ok]
        known = known | ok
        rgb = np.where(known[..., None], outp, rgb)
    return outp


# Every source cropped, scaled, its figure cut out once.
srcs = {}
for i, (sid, s) in enumerate(spec["sources"].items()):
    im = Image.open(s["file"]).convert("RGB")
    W, H = im.size
    x0, y0, x1, y1 = s["crop"]
    box = (round(x0 * W), round(y0 * H), round(x1 * W), round(y1 * H))
    k = spec["scale"] * s.get("size", 1)
    crop = im.crop(box)
    crop = crop.resize((round(crop.width * k), round(crop.height * k)), Image.LANCZOS)
    from rembg import new_session, remove

    fig = np.asarray(remove(crop, session=new_session("birefnet-general")).split()[3]) > 128
    srcs[sid] = {"img": crop, "fig": fig, "box": box, "k": k, "W": W, "H": H}
first = next(iter(spec["sources"]))
CW, CH = srcs[first]["img"].size


def px(sid: str, p: list[float]) -> tuple[float, float]:
    """A source fraction in that source's cropped, scaled pixels."""
    s = srcs[sid]
    return ((p[0] * s["W"] - s["box"][0]) * s["k"], (p[1] * s["H"] - s["box"][1]) * s["k"])


def poly_mask(sid: str, poly: list, shape: tuple) -> np.ndarray:
    m = Image.new("L", (shape[1], shape[0]), 0)
    ImageDraw.Draw(m).polygon([px(sid, p) for p in poly], fill=255)
    return np.asarray(m) > 0


def scissors(alpha: np.ndarray) -> np.ndarray:
    """The hand-cut paper rim round a piece (as image-collage.py)."""
    rim = ndimage.binary_dilation(alpha, iterations=RIM)
    wob = ndimage.gaussian_filter(rng.normal(0, 1, rim.shape), 6) * 40
    return ndimage.gaussian_filter(rim.astype(float), 2.5) + wob * 0.02 > 0.5


rig = {"width": CW, "height": CH, "parts": {}}
cut = {}
for name, p in spec["parts"].items():
    if "mirror" in p:
        rgba, j, e = cut[p["mirror"]]
        rgba = rgba[:, ::-1]
        h, w = rgba.shape[:2]
        j, e = (w - j[0], j[1]), (w - e[0], e[1]) if e else None
        tx, ty = px(first, p["to"])
        ox, oy = tx - j[0], ty - j[1]
    else:
        sid = p.get("src", first)
        s = srcs[sid]
        img = np.asarray(s["img"]).astype(float) / 255
        mask = poly_mask(sid, p["poly"], s["fig"].shape)
        if not p.get("solid"):
            mask &= s["fig"]
            lab, n = ndimage.label(mask)
            if n > 1:  # the piece only, not the stray bits round it (whiskers, a leaf)
                mask = lab == (np.argmax(np.bincount(lab.ravel())[1:]) + 1)
        if p.get("holes"):
            hole = np.zeros_like(mask)
            for hp in p["holes"]:
                hole |= poly_mask(sid, hp, mask.shape)
            img = refill(img, mask & ~hole)
        img = tone(Image.fromarray((img * 255).astype(np.uint8)))
        ys, xs = np.nonzero(mask)
        pad = RIM + 8
        y0, y1, x0, x1 = ys.min() - pad, ys.max() + pad + 1, xs.min() - pad, xs.max() + pad + 1
        big = np.zeros((mask.shape[0] + 2 * pad, mask.shape[1] + 2 * pad), bool)
        big[pad:-pad, pad:-pad] = mask
        bimg = np.zeros(big.shape + (3,))
        bimg[pad:-pad, pad:-pad] = img
        m, im3 = big[y0 + pad:y1 + pad, x0 + pad:x1 + pad], bimg[y0 + pad:y1 + pad, x0 + pad:x1 + pad]
        rim = scissors(m)
        rgba = np.zeros(m.shape + (4,), np.uint8)
        rgba[rim] = [246, 242, 233, 255]
        rgba[m, :3] = (np.clip(im3[m], 0, 1) * 255).astype(np.uint8)
        jx, jy = px(sid, p["joint"]) if "joint" in p else (0, 0)
        j = (jx - x0, jy - y0)
        e = (px(sid, p["end"])[0] - x0, px(sid, p["end"])[1] - y0) if "end" in p else None
        if sid == first:
            ox, oy = x0, y0
        else:
            tx, ty = px(first, p["to"])
            ox, oy = tx - j[0], ty - j[1]
    cut[name] = (rgba, j, e)
    o = Image.fromarray(rgba, "RGBA")
    o.putalpha(o.split()[3].filter(ImageFilter.GaussianBlur(0.7)))
    o.save(out / f"{name}.png")
    h, w = rgba.shape[:2]
    rig["parts"][name] = {"x": round(float(ox), 1), "y": round(float(oy), 1), "w": w, "h": h, "joint": [round(float(ox + j[0]), 1), round(float(oy + j[1]), 1)]}
    if e:
        rig["parts"][name]["end"] = [round(float(ox + e[0]), 1), round(float(oy + e[1]), 1)]
    print(name, w, h)
rig["marks"] = {k: [round(float(v), 1) for v in px(first, m)] for k, m in spec.get("marks", {}).items()}
data = Path(__file__).resolve().parent.parent / "src" / "guide" / "rigs" / f"{out.name}.json"
data.parent.mkdir(exist_ok=True)
data.write_text(json.dumps(rig, indent=1))
print(data)
