# /// script
# requires-python = ">=3.10,<3.13"
# dependencies = []
# ///
"""Cut a moment into the meme bank: public/memes/<slug>.mp4 (H.264, AAC, loudness -16 LUFS so it sits with the
voice) and a row in public/memes/INDEX.md, the bank every episode picks from.

  uv run scripts/meme-cut.py https://youtu.be/LQ5B5CgzERg 3:12.4 3:14.6 choque-wesh \
      --quote "wesh c'est quoi ça" --tags "choqué,réaction" --crop 9:16 --x 0.5
  uv run scripts/meme-cut.py cache/memes/LQ5B5CgzERg.mp4 192.4 194.6 choque-wesh --quote "…"   # from a scanned file

--crop 9:16 keeps a vertical slice centred at --x (0…1 of the width; full-screen use); --crop none keeps the frame
(sticker use, the engine's clip `ratio` = height / width is printed). Times are seconds or m:ss.s.
In an episode: clips: [{ src: "memes/<slug>.mp4", at: "<cue>", from: 0, dur: <printed>, mode: "full" }].
"""
import argparse
import datetime
import subprocess
from pathlib import Path

BANK = Path("public/memes")
INDEX = BANK / "INDEX.md"
HEAD = (
    "# Meme bank\n\nClips cut by `scripts/meme-cut.py` for the 30-day series (`src/keys/engine.tsx` `clips`). "
    "One row per clip: what is said, the mood it plays, when it was found (keep it recent), where it comes from.\n\n"
    "| clip | dur | ratio | quote | tags | found | source |\n|---|---|---|---|---|---|---|\n"
)


def sec(t: str) -> float:
    if ":" in t:
        m, s = t.split(":")
        return int(m) * 60 + float(s)
    return float(t)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("start")
    ap.add_argument("end")
    ap.add_argument("slug")
    ap.add_argument("--quote", default="")
    ap.add_argument("--tags", default="")
    ap.add_argument("--crop", choices=["9:16", "none"], default="none")
    ap.add_argument("--x", type=float, default=0.5, help="centre of the vertical slice, 0…1 of the width")
    args = ap.parse_args()
    a, b = sec(args.start), sec(args.end)
    BANK.mkdir(parents=True, exist_ok=True)
    src = args.src
    url = src
    if not Path(src).exists():
        vid = subprocess.check_output(["yt-dlp", "--print", "id", "--skip-download", src], text=True).strip().splitlines()[-1]
        cached = Path("cache/memes") / f"{vid}.mp4"
        if not cached.exists():
            cached.parent.mkdir(parents=True, exist_ok=True)
            subprocess.run(["yt-dlp", "-q", "-f", "bv*[height<=1080]+ba/b", "--merge-output-format", "mp4",
                            "--download-sections", f"*{max(0, a - 2)}-{b + 2}", "--force-keyframes-at-cuts",
                            "-o", str(cached.with_name(f"{vid}-{int(a)}.mp4")), src], check=True)
            cached = cached.with_name(f"{vid}-{int(a)}.mp4")
            a, b = min(2.0, a), min(2.0, a) + (b - a)
        src = str(cached)
    vf = []
    if args.crop == "9:16":
        vf.append(f"crop=ih*9/16:ih:(iw-ih*9/16)*{args.x}:0,scale=1080:1920")
    else:
        vf.append("scale='min(1080,iw)':-2")
    out = BANK / f"{args.slug}.mp4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-i", src, "-vf", ",".join(vf),
                    "-af", "loudnorm=I=-16:TP=-1.5", "-ar", "48000", "-c:v", "libx264", "-crf", "19", "-pix_fmt", "yuv420p",
                    "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", str(out)], check=True)
    w, h = subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
                                    "-of", "csv=p=0", str(out)], text=True).strip().split(",")
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(out)]))
    ratio = round(int(h) / int(w), 4)
    if not INDEX.exists():
        INDEX.write_text(HEAD)
    rows = [r for r in INDEX.read_text().splitlines(keepends=True) if not r.startswith(f"| {args.slug} |")]
    rows.append(f"| {args.slug} | {dur:.1f}s | {ratio} | {args.quote} | {args.tags} | {datetime.date.today()} | {url} @ {args.start}–{args.end} |\n")
    INDEX.write_text("".join(rows))
    print(f"wrote {out}  dur {dur:.2f}s  ratio {ratio}  ({w}x{h})")


main()
