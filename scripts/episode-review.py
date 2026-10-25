# /// script
# requires-python = ">=3.10"
# dependencies = ["pillow", "numpy"]
# ///
"""Look at a video before calling it done (bible/workflow.md, step "review"). Every image is labelled with its
timestamp; ffmpeg here has no drawtext, so the labels are drawn with Pillow.

  uv run scripts/episode-review.py sheet <Comp|file.mp4> [--every 2 | --at 0.5,3,7.2] [--cols 6] [--crop x,y,w,h]
  uv run scripts/episode-review.py sheet <Comp|file.mp4> --phone        # phone size, with TikTok/Reels buttons and caption
  uv run scripts/episode-review.py strip <Comp|file.mp4> --from 12.3 --to 12.9 [--crop x,y,w,h]   # every frame of a move
  uv run scripts/episode-review.py audio <file.mp4>                                                # loudness + waveform
  uv run scripts/episode-review.py cadence <file.mp4> [<other.mp4> …]                              # cut rhythm, held frames

A composition id renders a proxy first (scale 0.4, cached in out/review/<Comp>-proxy.mp4 until a src/ or public/
file is newer); strips render the exact frames at full size. Output: out/review/<name>-<kind>-<time>.png
(a new file every run: never judge a fix from a cached image).
"""
import argparse
import json
import re
import subprocess
import time
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

FPS = 30
OUT = Path("out/review")
FONT = ImageFont.load_default(size=22)


def run(*cmd: str) -> str:
    return subprocess.run(cmd, check=True, capture_output=True, text=True).stdout


def newest_source() -> float:
    return max(p.stat().st_mtime for d in ("src", "public") for p in Path(d).rglob("*") if p.is_file())


def source_video(target: str) -> Path:
    if target.endswith(".mp4"):
        return Path(target)
    proxy = OUT / f"{target}-proxy.mp4"
    if not proxy.exists() or proxy.stat().st_mtime < newest_source():
        print(f"rendering proxy of {target} …")
        subprocess.run(["npx", "remotion", "render", target, str(proxy), "--scale=0.4", "--muted", "--log=error"], check=True)
    return proxy


def duration(video: Path) -> float:
    return float(run("ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(video)))


def grab(video: Path, t: float, crop: str | None) -> Image.Image:
    vf = []
    if crop:
        x, y, w, h = (int(v) for v in crop.split(","))
        # crop is given in 1080×1920 frame pixels; scale it to the source's size
        width = int(run("ffprobe", "-v", "error", "-select_streams", "v", "-show_entries", "stream=width", "-of", "csv=p=0", str(video)))
        k = width / 1080
        vf.append(f"crop={int(w * k)}:{int(h * k)}:{int(x * k)}:{int(y * k)}")
    tmp = OUT / "_frame.png"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.3f}", "-i", str(video), "-frames:v", "1", *(["-vf", ",".join(vf)] if vf else []), str(tmp)], check=True)
    return Image.open(tmp).convert("RGB")


def label(img: Image.Image, text: str) -> Image.Image:
    d = ImageDraw.Draw(img)
    box = d.textbbox((8, 6), text, font=FONT)
    d.rectangle((box[0] - 6, box[1] - 4, box[2] + 6, box[3] + 4), fill=(0, 0, 0))
    d.text((8, 6), text, fill=(255, 230, 120), font=FONT)
    return img


# Where TikTok / Reels draw over the video (1080 × 1920 px; bible/format.md): the top bar, the caption and account at the
# bottom, the like / comment / share column on the right.
PLATFORM_UI = [(0, 0, 1080, 220), (0, 1520, 940, 1920), (940, 900, 1080, 1920)]


def platform_ui(img: Image.Image) -> Image.Image:
    k = img.width / 1080
    over = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(over)
    for x0, y0, x1, y1 in PLATFORM_UI:
        d.rectangle((x0 * k, y0 * k, x1 * k, y1 * k), fill=(255, 40, 40, 70), outline=(255, 60, 60, 200), width=2)
    for i in range(5):  # the button column
        cy = (1000 + i * 135) * k
        d.ellipse((965 * k, cy, 1055 * k, cy + 90 * k), outline=(255, 255, 255, 220), width=3)
    return Image.alpha_composite(img.convert("RGBA"), over).convert("RGB")


def tile(images: list[Image.Image], cols: int, width: int) -> Image.Image:
    scaled = [im.resize((width, int(im.height * width / im.width))) for im in images]
    h = max(im.height for im in scaled)
    rows = (len(scaled) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * width + (cols + 1) * 6, rows * h + (rows + 1) * 6), (40, 40, 40))
    for i, im in enumerate(scaled):
        sheet.paste(im, (6 + (i % cols) * (width + 6), 6 + (i // cols) * (h + 6)))
    return sheet


def save(img: Image.Image, name: str, kind: str) -> None:
    path = OUT / f"{name}-{kind}-{time.strftime('%H%M%S')}.png"
    img.save(path)
    print(path)


def sheet(a: argparse.Namespace) -> None:
    video = source_video(a.target)
    times = [float(x) for x in a.at.split(",")] if a.at else [t * a.every for t in range(int(duration(video) / a.every) + 1)]
    imgs = [grab(video, t, a.crop) for t in times]
    if a.phone:
        # What a viewer sees on a phone (≈ 390 pt wide): is the subject still big enough, is anything under the buttons?
        imgs = [platform_ui(im) for im in imgs]
        a.width = 390
    imgs = [label(im, f"{t:.1f}s") for im, t in zip(imgs, times)]
    save(tile(imgs, a.cols, a.width), Path(a.target).stem, "phone" if a.phone else "sheet")


def strip(a: argparse.Namespace) -> None:
    first, last = round(a.start * FPS), round(a.end * FPS)
    if a.target.endswith(".mp4"):
        imgs = [label(grab(Path(a.target), n / FPS, a.crop), f"{n / FPS:.2f}s f{n}") for n in range(first, last + 1)]
    else:
        frames = OUT / "_strip"
        subprocess.run(["rm", "-rf", str(frames)], check=True)
        subprocess.run(["npx", "remotion", "render", a.target, str(frames), "--sequence", f"--frames={first}-{last}", "--image-format=png", "--log=error"], check=True)
        files = sorted(frames.glob("*.png"))
        imgs = []
        for n, f in zip(range(first, last + 1), files):
            im = Image.open(f).convert("RGB")
            if a.crop:
                x, y, w, h = (int(v) for v in a.crop.split(","))
                im = im.crop((x, y, x + w, y + h))
            imgs.append(label(im, f"{n / FPS:.2f}s f{n}"))
    save(tile(imgs, a.cols, a.width), Path(a.target).stem, "strip")


def audio(a: argparse.Namespace) -> None:
    video = Path(a.target)
    log = subprocess.run(["ffmpeg", "-nostats", "-i", str(video), "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    summary = log[log.rfind("Summary:"):]
    get = lambda key: re.search(rf"{key}:\s+(-?[\d.]+)", summary)
    report = {k: float(m.group(1)) for k, m in (("integrated_lufs", get("I")), ("lra_lu", get("LRA")), ("true_peak_dbfs", get("Peak"))) if m}
    # Short-term loudness every 0.5 s: dead air and spikes are visible at a glance.
    st = [(float(t), float(s)) for t, s in re.findall(r"t:\s*([\d.]+).*?S:\s*(-?[\d.]+)", log)]
    report["silent_stretches_s"] = [round(t, 1) for t, s in st[::5] if t >= 3 and s < -45]  # the 3 s window starts empty
    print(json.dumps(report, indent=1))
    wave = OUT / f"{video.stem}-audio-{time.strftime('%H%M%S')}.png"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(video), "-filter_complex", "showwavespic=s=2400x400:split_channels=0:colors=#e8c66a", "-frames:v", "1", str(wave)], check=True)
    img = Image.open(wave).convert("RGB")
    d = ImageDraw.Draw(img)
    total = duration(video)
    for s in range(0, int(total) + 1, 5):
        x = int(s / total * img.width)
        d.line((x, 0, x, img.height), fill=(90, 90, 90))
        d.text((x + 3, 3), f"{s}s", fill=(255, 255, 255), font=FONT)
    img.save(wave)
    print(wave)
    print("target: -14 LUFS (±1), true peak <= -1 dBFS, no silent stretch except on purpose")


def cadence(a: argparse.Namespace) -> None:
    """How the picture moves, measured on the images zone (the top 1400 px): shot lengths, frames held 2 or 3 times
    (pieces on 12 drawings a second), the share of half-seconds where nothing moved. The Vox-style reference (docs/inspiration/) reads: median shot
    1.8 s, ~280 frames held 2-3 times a minute, never frozen for half a second."""
    import numpy as np

    for target in a.targets:
        fps_s = run("ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", target).strip()
        num, den = fps_s.split("/")
        fps = float(num) / float(den)
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", target, "-vf", "scale=144:256,format=gray", "-f", "rawvideo", "-"], capture_output=True, check=True).stdout
        frames = np.frombuffer(raw, np.uint8).reshape(-1, 256, 144).astype(np.int16)[:, :187]
        diff = np.abs(np.diff(frames, axis=0)).mean(axis=(1, 2))
        cuts: list[int] = []
        for i in np.where(diff > 25)[0]:
            if not cuts or i - cuts[-1] > 4:
                cuts.append(int(i))
        shots = np.diff([0, *cuts, len(frames)]) / fps
        runs, cur = [], 1
        for still in diff < 0.4:
            if still:
                cur += 1
            else:
                runs.append(cur)
                cur = 1
        runs_a = np.array(runs)
        per_min = 60 / (len(frames) / fps)
        # Frozen = nothing changed over half a second: a slow push (+3 % in 5 s) moves too little from one frame to the
        # next to register, but it is motion.
        half = max(1, round(fps / 2))
        frozen = (np.abs(frames[half:] - frames[:-half]).mean(axis=(1, 2)) < 0.8).mean()
        print(f"{Path(target).name}: {len(frames) / fps:.1f} s, {len(cuts)} cuts, median shot {np.median(shots):.2f} s, "
              f"held 2-3 frames {int(((runs_a == 2) | (runs_a == 3)).sum() * per_min)}/min, frozen {frozen:.0%}")


def main() -> None:
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("sheet")
    s.add_argument("target")
    s.add_argument("--every", type=float, default=2.0)
    s.add_argument("--at")
    s.add_argument("--cols", type=int, default=6)
    s.add_argument("--width", type=int, default=270)
    s.add_argument("--crop")
    s.add_argument("--phone", action="store_true")
    s.set_defaults(fn=sheet)
    r = sub.add_parser("strip")
    r.add_argument("target")
    r.add_argument("--from", dest="start", type=float, required=True)
    r.add_argument("--to", dest="end", type=float, required=True)
    r.add_argument("--cols", type=int, default=6)
    r.add_argument("--width", type=int, default=300)
    r.add_argument("--crop")
    r.set_defaults(fn=strip)
    au = sub.add_parser("audio")
    au.add_argument("target")
    au.set_defaults(fn=audio)
    c = sub.add_parser("cadence")
    c.add_argument("targets", nargs="+")
    c.set_defaults(fn=cadence)
    a = p.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    a.fn(a)


if __name__ == "__main__":
    main()
