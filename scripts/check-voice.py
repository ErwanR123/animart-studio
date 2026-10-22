# /// script
# requires-python = ">=3.10,<3.13"
# dependencies = ["faster-whisper>=1.0", "numpy"]
# ///
"""Check the narration's cuts: transcribe the first and last words of every segment of public/voice/<Episode>.mp3, so
a clipped start ("evant" for "Devant") or end ("vérit" for "vérité") shows before the render. Also lists the pauses
longer than 0.35 s inside segments (voiceover-gemini.py caps them at 0.3 s).

  uv run scripts/check-voice.py <Episode>
"""
import json
import subprocess
import sys

import numpy as np
from faster_whisper import WhisperModel

episode = sys.argv[1]
data = json.load(open(f"public/voice/{episode}.json"))
pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", f"public/voice/{episode}.mp3", "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, np.float32)
model = WhisperModel("small", device="cpu", compute_type="int8")
for s in data["segments"]:
    clip = audio[int(s["start"] * 16000) : int(s["end"] * 16000)]
    heard = [w.word.strip() for seg in model.transcribe(clip, language="fr", word_timestamps=True)[0] for w in seg.words]
    n = len(clip) // 160
    db = 20 * np.log10(np.sqrt((clip[: n * 160].reshape(n, 160) ** 2).mean(1)) + 1e-9)
    quiet = db < np.percentile(db, 98) - 45  # same rule as the cut in voiceover-gemini.py
    runs, k = [], 0
    for q in quiet:
        k = k + 1 if q else 0
        if k == 36:
            runs.append(1)
    script = next((x["text"] for x in json.load(open(f"src/episodes/{episode}.script.json"))["segments"] if x["id"] == s["id"]), "")
    print(f"{s['id']:8} {s['end'] - s['start']:5.2f}s  heard: {' '.join(heard[:4])} … {' '.join(heard[-4:])}")
    print(f"{'':8} {'':6}  script: {' '.join(script.split()[:4])} … {' '.join(script.split()[-4:])}" + (f"   ⚠ {len(runs)} long pause(s)" if runs else ""))
