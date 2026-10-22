# /// script
# requires-python = ">=3.10"
# dependencies = ["pillow", "numpy"]
# ///
"""Look at a video before calling it done (bible/workflow.md, step "review"). Every image is labelled with its
timestamp; ffmpeg here has no drawtext, so the labels are drawn with Pillow.

  uv run scripts/review.py sheet <Comp|file.mp4> [--every 2 | --at 0.5,3,7.2] [--cols 6] [--crop x,y,w,h]
  uv run scripts/review.py strip <Comp|file.mp4> --from 12.3 --to 12.9 [--crop x,y,w,h]   # every frame of a move
  uv run scripts/review.py audio <file.mp4>                                                # loudness + waveform

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
    imgs = [label(grab(video, t, a.crop), f"{t:.1f}s") for t in times]
    save(tile(imgs, a.cols, a.width), Path(a.target).stem, "sheet")


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
    a = p.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    a.fn(a)


if __name__ == "__main__":
    main()
