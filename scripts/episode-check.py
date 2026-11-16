# /// script
# requires-python = ">=3.10"
# dependencies = ["numpy"]
# ///
"""The checks every episode passes before the user sees it (bible/format.md): the notes the user gave on every video,
made automatic. Run after the voice, then again on the master.

  uv run scripts/episode-check.py GuideScream

Reads the script, the voice timings, the episode config and, when it is newer than the voice, the master
out/<guide-name>.mp4. Prints PASS / WARN / FAIL per rule; exits 1 on any FAIL.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np

ep = sys.argv[1]
script = json.loads(Path(f"src/episodes/{ep}.script.json").read_text())["segments"]
voice = json.loads(Path(f"public/voice/{ep}.json").read_text())
config = Path(f"src/episodes/{ep}.tsx").read_text()
master = Path("out") / (re.sub(r"(?<!^)([A-Z])", r"-\1", ep).lower() + ".mp4")
results: list[tuple[str, str, str]] = []


def check(level: str, ok: bool, rule: str, detail: str = "") -> None:
    results.append(("PASS" if ok else level, rule, detail))


seg = {s["id"]: s for s in voice["segments"]}
length = voice["segments"][-1]["end"]
check("FAIL", length <= 50, "length ≤ 50 s (aim ~40 s)", f"{length:.1f} s of voice")
check("WARN", length <= 45, "length ≤ 45 s", f"{length:.1f} s")
hook = seg["hook"]["end"] - seg["hook"]["start"]
check("FAIL", hook <= 3.5, "hook line ≤ 3.5 s", f"{hook:.2f} s")
words = sum(len(s["text"].split()) for s in script)
check("WARN", 80 <= words <= 125, "script 80–125 words (~40 s)", f"{words} words")

# A pause inside a line longer than 0.5 s is a "moment mou": people swipe.
gaps = [
    (a["text"], b["text"], b["start"] - a["end"])
    for a, b in zip(voice["words"], voice["words"][1:])
    if a["segment"] == b["segment"] and b["start"] - a["end"] > 0.5
]
check("WARN", not gaps, "no pause > 0.5 s inside a line", "; ".join(f"{a} … {b} ({g:.2f} s)" for a, b, g in gaps))

tu = sorted({m.lower() for s in script for m in re.findall(r"\b(regarde|tu|te|toi|ton|ta|tes)\b", s["text"], re.I)})
check("WARN", not tu, "vouvoiement (regardez, vous)", ", ".join(tu))

# Frame 0: the painting full screen with the hook on tape (`cold`), or real footage already moving (Banksy).
check("FAIL", ("cold:" in config and "tapes:" in config) or "clips/" in config, "cold open: frame 0 full screen, the hook written")
check("FAIL", re.search(r"loop:.*full:\s*true", config) is not None, "loop back to frame 0 (loop … full: true)")


def frame(last: bool = False) -> np.ndarray:
    """The first or the last frame, small and grey (the last: every frame of the final second, keep the last one)."""
    seek, n = (["-sseof", "-1"], []) if last else ([], ["-frames:v", "1"])
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", *seek, "-i", str(master), *n, "-vf", "scale=108:192,format=gray", "-f", "rawvideo", "-"],
        capture_output=True, check=True,
    ).stdout
    return np.frombuffer(raw[-108 * 192 :], np.uint8).astype(float)


if master.exists() and master.stat().st_mtime > Path(f"public/voice/{ep}.json").stat().st_mtime:
    # A cut to a close-up of the same painting keeps its colours: a scene score of 0.1 is already a hard cut.
    out = subprocess.run(
        ["ffmpeg", "-v", "info", "-t", "2.5", "-i", str(master), "-vf", "select='gte(scene,0)',metadata=print:key=lavfi.scene_score", "-f", "null", "-"],
        capture_output=True, text=True,
    ).stderr
    scores = re.findall(r"pts_time:([\d.]+)\s+.*?lavfi\.scene_score=([\d.]+)", out, re.S)
    cuts = [round(float(t), 2) for t, score in scores if float(score) > 0.1]
    check("WARN", any(0.3 < c <= 2.0 for c in cuts), "a hard cut before 2 s (or footage moving)", f"cuts at {cuts}")
    diff = np.abs(frame() - frame(last=True)).mean()
    check("FAIL", diff < 14, "last frame ≈ frame 0 (the loop)", f"mean difference {diff:.1f}/255")
    duration = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(master)]))
    check("FAIL", duration <= 52, "master ≤ 52 s", f"{duration:.1f} s")
else:
    results.append(("SKIP", "master checks (cut before 2 s, loop frame, length)", f"no {master} newer than the voice"))

for level, rule, detail in results:
    print(f"{level:4}  {rule}" + (f"  — {detail}" if detail and level != "PASS" else ""))
sys.exit(1 if any(r[0] == "FAIL" for r in results) else 0)
