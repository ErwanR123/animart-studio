# /// script
# requires-python = ">=3.10,<3.13"
# dependencies = ["faster-whisper>=1.0", "numpy"]
# ///
"""Look inside a video (YouTube, TikTok, Insta, a local file) to find the moment worth cutting: downloads it once
(≤ 720p, cache/memes/), writes a timed transcript (Whisper, French) and a contact sheet (one frame every --every
seconds, labelled with its time), so the funny line and its picture can be found without watching 15 minutes.

  uv run scripts/meme-scan.py https://youtu.be/LQ5B5CgzERg                 # transcript + sheet
  uv run scripts/meme-scan.py https://youtu.be/LQ5B5CgzERg --grep "allô"   # only the lines with these words
  uv run scripts/meme-scan.py <url> --every 4 --from 120 --to 240          # a closer sheet of one part

Prints the paths: cache/memes/<id>.mp4, <id>.txt (one line per phrase: "mm:ss.s  text"), <id>-sheet-*.jpg.
"""
import argparse
import re
import subprocess
from pathlib import Path

CACHE = Path("cache/memes")


def fetch(src: str) -> Path:
    CACHE.mkdir(parents=True, exist_ok=True)
    if Path(src).exists():
        return Path(src)
    vid = subprocess.check_output(["yt-dlp", "--print", "id", "--skip-download", src], text=True).strip().splitlines()[-1]
    out = CACHE / f"{vid}.mp4"
    if not out.exists():
        subprocess.run(["yt-dlp", "-q", "-f", "bv*[height<=720]+ba/b[height<=720]/b", "--merge-output-format", "mp4",
                        "-o", str(out), src], check=True)
    return out


def ts(s: float) -> str:
    return f"{int(s // 60):02}:{s % 60:04.1f}"


def transcript(mp4: Path) -> Path:
    txt = mp4.with_suffix(".txt")
    if txt.exists():
        return txt
    from faster_whisper import WhisperModel

    model = WhisperModel("small", device="cpu", compute_type="int8")
    import numpy as np

    # Decoded by ffmpeg (faster-whisper's own decoder breaks on some PyAV versions).
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", str(mp4), "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True, check=True).stdout
    segs, _ = model.transcribe(np.frombuffer(pcm, np.float32), language="fr", vad_filter=True)
    txt.write_text("".join(f"{ts(s.start)}  {s.text.strip()}\n" for s in segs))
    return txt


def sheet(mp4: Path, every: float, a: float | None, b: float | None) -> list[Path]:
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(mp4)]))
    a, b = a or 0.0, min(b or dur, dur)
    tag = f"{int(a)}-{int(b)}"
    for old in CACHE.glob(f"{mp4.stem}-sheet-{tag}-*.jpg"):
        old.unlink()
    # 40 frames per sheet (8 x 5); the time of each frame is its position: a + every * index.
    pattern = CACHE / f"{mp4.stem}-sheet-{tag}-%02d.jpg"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(a), "-to", str(b), "-i", str(mp4), "-vf",
                    f"fps=1/{every},scale=240:-2,tile=8x5", str(pattern)], check=True)
    files = sorted(CACHE.glob(f"{mp4.stem}-sheet-{tag}-*.jpg"))
    for i, f in enumerate(files):
        print(f"sheet {f}  (frame k = {ts(a + i * 40 * every)} + k×{every}s, left to right, top to bottom)")
    return files


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("--every", type=float, default=6.0)
    ap.add_argument("--from", dest="a", type=float)
    ap.add_argument("--to", dest="b", type=float)
    ap.add_argument("--grep", help="comma-separated words: print only the transcript lines containing one")
    ap.add_argument("--no-text", action="store_true", help="skip the transcript (silent or music-only videos)")
    args = ap.parse_args()
    mp4 = fetch(args.src)
    print(f"video {mp4}")
    if not args.no_text:
        txt = transcript(mp4)
        lines = txt.read_text().splitlines()
        if args.grep:
            pat = re.compile("|".join(re.escape(w.strip()) for w in args.grep.split(",")), re.I)
            lines = [line for line in lines if pat.search(line)]
        print(f"transcript {txt}")
        print("\n".join(lines))
    sheet(mp4, args.every, args.a, args.b)


main()
