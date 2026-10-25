# /// script
# requires-python = ">=3.10,<3.13"
# dependencies = ["faster-whisper>=1.0", "python-dotenv>=1.0", "numpy", "certifi"]
# ///
"""The Guide's narration (Gemini TTS) with word timings: the edit, the captions and every effect follow them.
Same call as the app (packages/ai/src/tts.ts): Interactions API, the guide's voice from GUIDE_VOICE_ID_GEMINI,
GOOGLE_API_KEY, model TTS_MODEL_GEMINI_PREMIUM (default gemini-3.8-flash-tts). Keys come from the repo-root .env,
loaded into the environment, never printed. Gemini returns no timestamps: words are timed locally with Whisper
and matched to the script, letter by letter.
The whole script is one call (one steady tone), then cut into lines; the take is cached (cache/gemini/<hash>.wav):
re-running never pays twice for the same text, voice and style (~$0.03 per new take).
  uv run scripts/voice-gemini.py <Episode> --tempo 1.1 --cap 0.2   # the studio's pace (bible/sound.md)
  uv run scripts/voice-check.py <Episode>                          # then check every cut
Reads src/episodes/<Episode>.script.json, writes public/voice/<Episode>.mp3 + .json.
"""
import argparse
import base64
import difflib
import hashlib
import json
import os
import re
import ssl
import struct
import subprocess
import tempfile
import urllib.request
from pathlib import Path

import certifi
import numpy as np
from dotenv import load_dotenv

GAP = 0.35  # seconds of silence after each segment (the edit places segments itself)
STYLE = (
    "A warm, natural storyteller: an elderly Italian painter telling a friend about a painting, in French, for a short video. "
    "One steady, conversational tone from start to finish, no dramatic swings, no exaggerated emphasis; "
    "a lively, fluent pace that flows from one sentence to the next without long pauses; light Italian accent."
)


def norm(s: str) -> str:
    return re.sub(r"[^\w]", "", s.lower())


def synth(text: str, model: str, voice: str, key: str) -> tuple[bytes, int]:
    body = {
        "model": model,
        "input": [{"type": "user_input", "content": [{"type": "text", "text": text, "annotations": [{"type": "speech_metadata", "style": STYLE}]}]}],
        "response_format": {"type": "audio"},
        "generation_config": {"speech_config": [{"voice": voice}]},
    }
    req = urllib.request.Request(
        "https://generativelanguage.googleapis.com/v1beta/interactions",
        data=json.dumps(body).encode(),
        headers={"x-goog-api-key": key, "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=180, context=ssl.create_default_context(cafile=certifi.where())) as r:
        res = json.load(r)
    parts = [c for s in res.get("steps", []) for c in s.get("content", []) if c.get("type") == "audio" and c.get("data")]
    if not parts:
        raise RuntimeError(f"Gemini returned no audio: {json.dumps(res)[:300]}")
    return base64.b64decode(parts[0]["data"]), parts[0].get("sample_rate", 24000)


def wav_pcm(audio: bytes, rate: int) -> tuple[bytes, int]:
    """The 16-bit samples only. Gemini may answer with a whole WAV file whose chunks include a C2PA provenance
    block after the audio; read as samples, that block plays as a loud burst at the end of every line."""
    if audio[:4] != b"RIFF":
        return audio, rate
    i = 12
    while i + 8 <= len(audio):
        cid, size = audio[i : i + 4], struct.unpack("<I", audio[i + 4 : i + 8])[0]
        if cid == b"fmt ":
            rate = struct.unpack("<I", audio[i + 12 : i + 16])[0]
        if cid == b"data":
            return audio[i + 8 : i + 8 + size], rate
        i += 8 + size + (size & 1)
    raise RuntimeError("WAV without a data chunk")


def cached_line(text: str, model: str, voice: str, key: str, cache: Path) -> Path:
    h = hashlib.sha1(f"{model}|{voice}|{STYLE}|{text}".encode()).hexdigest()[:16]
    wav = cache / f"{h}.wav"
    if wav.exists():
        return wav
    audio, rate = synth(text, model, voice, key)
    pcm, rate = wav_pcm(audio, rate)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(rate), "-ac", "1", "-i", "-", str(wav)], input=pcm, check=True)
    return wav


def probe(path: Path) -> float:
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)]))


def speech_bounds(path: Path) -> tuple[float, float]:
    """Where a cut line's speech starts and ends, from its loudness (20 ms frames). The breaths around it are left
    out: kept at both ends of every cut, the next line's intake plus its own sounded like a double breath."""
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(pcm, np.float32)
    n = len(x) // 320
    db = 20 * np.log10(np.sqrt((x[: n * 320].reshape(n, 320) ** 2).mean(1)) + 1e-9)
    peak = np.percentile(db, 98)
    loud = np.flatnonzero(db > peak - 12)
    # From the first and last loud syllables, extend while the sound runs on (a soft "s", a fading "réel"): a breath
    # is set apart from the speech by a drop below that level, so it stays out. At the end, the closure of a "t" or
    # a "q" (under 0.15 s) is part of the word, not the end of the line; at the start, the same closure (the "c" of
    # "cour") must not cut off softer first words ("Dans sa cour").
    on = db > peak - 35
    a, b = loud[0], loud[-1]
    while True:
        behind = np.flatnonzero(on[max(0, a - 8) : a])
        if not len(behind):
            break
        a = max(0, a - 8) + behind[-1]
        while a > 0 and on[a - 1]:
            a -= 1
    while True:
        ahead = np.flatnonzero(on[b + 1 : b + 9])
        if not len(ahead):
            break
        b += ahead[0] + 1
    return max(0.0, a * 0.02 - 0.04), min(len(x) / 16000, (b + 1) * 0.02 + 0.1)


def cap_pauses(src: Path, a: float, b: float, out: Path, cap: float = 0.3) -> None:
    """The speech from a to b, with every pause inside it (after a colon, a comma) cut down to `cap` seconds:
    Gemini's run to 0.9 s. Only true silence is cut, from its middle, so the words on both sides stay untouched."""
    rate = 24000
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-i", src, "-ac", "1", "-ar", str(rate), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(pcm, np.float32)
    hop = rate // 100  # 10 ms
    n = len(x) // hop
    db = 20 * np.log10(np.sqrt((x[: n * hop].reshape(n, hop) ** 2).mean(1)) + 1e-9)
    quiet = db < np.percentile(db, 98) - 45
    half = int(cap * 50)  # frames kept on each side of a long pause
    pieces, start, i = [], 0, 0
    while i < n:
        j = i
        while j < n and quiet[j]:
            j += 1
        if j - i > 2 * half:
            pieces.append(x[start * hop : (i + half) * hop])
            start = j - half
        i = max(j, i + 1)
    pieces.append(x[start * hop :])
    y = np.concatenate(pieces)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(rate), "-ac", "1", "-i", "-", out], input=y.astype(np.float32).tobytes(), check=True)


def silence_before(pcm: bytes, t: float, floor: float) -> float:
    """Where to start a line whose first word Whisper places at `t`: the middle of the longest true silence (under
    -40 dB) between the previous line's end and `t`, i.e. the breath between the two lines. Whisper's starts can come
    late on a numeric first word ("En 1853" heard as "153"): cutting at `t - 0.3`, or at the last short gap before
    `t` (inside "mille huit cent | cinquante"), clipped "En mille huit cent"."""
    a = np.frombuffer(pcm, np.float32)
    win = 160  # 10 ms at 16 kHz
    lo, hi = max(int(floor * 100), 0), min(int(t * 100), len(a) // win - 1)
    quiet = [20 * np.log10(np.sqrt((a[k * win : (k + 1) * win] ** 2).mean()) + 1e-9) < -40 for k in range(lo, hi + 1)]
    best, run_start = (0, (lo + hi) / 2), None
    for k, q in enumerate([*quiet, False]):
        if q and run_start is None:
            run_start = k
        elif not q and run_start is not None:
            if k - run_start > best[0]:
                best = (k - run_start, lo + (run_start + k) / 2)
            run_start = None
    return best[1] / 100


def align(text: str, heard: list, duration: float):
    """Script tokens (with the punctuation captions need) timed from Whisper's words, matched letter by letter."""
    tokens = text.split()
    heard_chars, heard_times = [], []
    for w in heard:
        for c in norm(w.word):
            heard_chars.append(c)
            heard_times.append((w.start, w.end))
    script_chars, owner = [], []
    for k, tok in enumerate(tokens):
        for c in norm(tok):
            script_chars.append(c)
            owner.append(k)
    times = [None] * len(script_chars)
    sm = difflib.SequenceMatcher(None, script_chars, heard_chars, autojunk=False)
    for a, b, n in sm.get_matching_blocks():
        for j in range(n):
            times[a + j] = heard_times[b + j]
    out = []
    for k, tok in enumerate(tokens):
        ts = [times[i] for i in range(len(owner)) if owner[i] == k and times[i]]
        out.append({"text": tok, "start": ts[0][0] if ts else None, "end": ts[-1][1] if ts else None})
    # Unheard tokens (punctuation, misses): placed between their neighbours.
    for k, w in enumerate(out):
        if w["start"] is None:
            prev = next((out[j]["end"] for j in range(k - 1, -1, -1) if out[j]["end"] is not None), 0.0)
            nxt = next((out[j]["start"] for j in range(k + 1, len(out)) if out[j]["start"] is not None), duration)
            w["start"], w["end"] = prev, max(prev, min(nxt, prev + 0.25))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("episode")
    ap.add_argument("--only", help="synthesise this one segment and print its pace (a cheap test before the full run)")
    ap.add_argument("--tempo", type=float, default=1.1, help="speed-up applied after synthesis (no new API call)")
    # Pauses inside a line (after a comma, a colon) cut down to this many seconds; a segment's own "pause" in the
    # script keeps a longer breath where the eloquence needs it (the last line). No new API call either.
    ap.add_argument("--cap", type=float, default=0.2, help="longest pause kept inside a line, seconds")
    args = ap.parse_args()
    load_dotenv(Path(__file__).resolve().parents[1] / ".env")
    key = os.environ.get("GOOGLE_API_KEY")
    voice = os.environ.get("GUIDE_VOICE_ID_GEMINI")
    model = os.environ.get("TTS_MODEL_GEMINI_PREMIUM") or "gemini-3.8-flash-tts"
    if not key or not voice:
        raise SystemExit("GOOGLE_API_KEY and GUIDE_VOICE_ID_GEMINI must be set (repo-root .env)")
    segments = json.loads(Path(f"src/episodes/{args.episode}.script.json").read_text())["segments"]
    cache = Path("cache/gemini")
    cache.mkdir(parents=True, exist_ok=True)

    if args.only:
        seg = next(x for x in segments if x["id"] == args.only)
        wav = cached_line(seg["text"], model, voice, key, cache)
        print(f"{args.only}: {probe(wav):.2f}s for {len(seg['text'].split())} words -> {wav}")
        return
    from faster_whisper import WhisperModel

    whisper = WhisperModel("small", device="cpu", compute_type="int8")
    tmp = Path(tempfile.mkdtemp(prefix="gemini-"))
    timed, words, files, t = [], [], [], 0.0
    # The whole script in one call (one continuous tone: line-by-line calls change mood every sentence), then cut
    # into lines at the gaps between Whisper's words.
    # `say` (optional) is what the voice reads when it differs from the caption, e.g. a year spelled out.
    spoken = [x.get("say", x["text"]) for x in segments]
    full = cached_line("\n\n".join(spoken), model, voice, key, cache)
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", full, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True, check=True).stdout
    heard_all = [w for s in whisper.transcribe(np.frombuffer(pcm, np.float32), language="fr", word_timestamps=True)[0] for w in s.words]
    # Delivery tags ("[whispers]", "[short pause]": bible/sound.md) are read by Gemini, never spoken: drop them to align.
    plain = [re.sub(r"\[[^\]]*\]\s*", "", x) for x in spoken]
    tokens = align(" ".join(plain), heard_all, probe(full))
    spans, k = [], 0
    for x in plain:
        n = len(x.split())
        spans.append((tokens[k]["start"], tokens[k + n - 1]["end"]))
        k += n
    # One cut between two lines, in the breath between them (the longest true silence in the 2 s before Whisper's
    # first word, or since the previous line's end if that is earlier): the end of one line and the start of the next
    # share it, so neither can take a syllable of the other. Whisper's times alone did that: on "1848. En 1853" they
    # collapsed onto one instant and "En mille" was cut off.
    bounds = [0.0] + [silence_before(pcm, spans[i][0], max(spans[i - 1][0], min(spans[i - 1][1], spans[i][0] - 2.0))) for i in range(1, len(spans))] + [probe(full)]
    cuts = []
    for i in range(len(spans)):
        cut = tmp / f"raw-{i}.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", full, "-ss", f"{bounds[i]:.3f}", "-to", f"{bounds[i + 1]:.3f}", cut], check=True)
        cuts.append(cut)
    for i, seg in enumerate(segments):
        src = cuts[i]
        wav = tmp / f"{i}.wav"
        # Keep the speech only, apply the tempo, then pad the gap.
        # The line is kept as Gemini spoke it (cutting pauses inside it made the voice stutter): only the silence
        # and breaths before and after it are trimmed, with short fades so the cut is never heard.
        a, b = speech_bounds(src)
        line = tmp / f"line-{i}.wav"
        cap_pauses(src, a, b, line, seg.get("pause", args.cap))
        af = f"afade=t=in:d=0.03,areverse,afade=t=in:d=0.06,areverse,atempo={args.tempo},apad=pad_dur={GAP}"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", line, "-af", af, "-ar", "44100", "-ac", "1", wav], check=True)
        duration = probe(wav) - GAP
        # No initial prompt: biased with the script, Whisper sometimes skips most of a line.
        pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", wav, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True, check=True).stdout
        heard = [w for s in whisper.transcribe(np.frombuffer(pcm, np.float32), language="fr", word_timestamps=True)[0] for w in s.words]
        local = align(seg["text"], heard, duration)
        timed.append({"id": seg["id"], "start": t, "end": t + duration})
        words += [{"text": w["text"], "start": t + w["start"], "end": t + w["end"], "segment": seg["id"]} for w in local]
        files.append(wav)
        t += duration + GAP
        print(f"  {seg['id']}: {duration:.2f}s, {len(heard)} words heard")
    (tmp / "list.txt").write_text("\n".join(f"file '{f}'" for f in files))
    out = Path(f"public/voice/{args.episode}")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", tmp / "list.txt", "-af", "loudnorm=I=-17:TP=-2:LRA=11,alimiter=limit=0.79:level=false", "-ar", "44100", "-b:a", "192k", f"{out}.mp3"], check=True)
    Path(f"{out}.json").write_text(json.dumps({"voice": f"gemini:{model}", "segments": timed, "words": words}, ensure_ascii=False, indent=1))
    print(f"wrote {out}.mp3 and {out}.json ({t:.1f}s)")


main()
