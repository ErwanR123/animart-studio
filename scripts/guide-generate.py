# /// script
# requires-python = ">=3.10"
# dependencies = ["python-dotenv>=1.0", "certifi"]
# ///
"""New drawings of the Guide, derived from the canonical sheets with a Gemini image model.

Usage (from the repo root):
  uv run scripts/guide-generate.py scripts/guide-prompts/bank-1.xml sheet_bank_3.png
The prompt file says what to draw; the canonical sheet (docs/brand/sheets/sheet_poses.png) is the only reference, so
every drawing has one source and the Guide never drifts (bible/character.md). The result lands next to it in
docs/brand/sheets/, where scripts/guide-assets.py cuts it (boxes from --list).
Every image is cached in cache/gemini-image/ by model + prompt + references: a re-run never pays twice (~$0.13 a 2K
sheet with gemini-3-pro-image). GOOGLE_API_KEY comes from the repo-root .env, never printed.
"""
import argparse
import base64
import hashlib
import json
import os
import ssl
import urllib.request
from pathlib import Path

import certifi
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
SHEETS = ROOT / "docs/brand/sheets"
REFS = [SHEETS / "sheet_poses.png"]
CACHE = Path("cache/gemini-image")

ap = argparse.ArgumentParser()
ap.add_argument("prompt", help="prompt file (XML, see scripts/guide-prompts/)")
ap.add_argument("out", help="file name of the new sheet, written to docs/brand/sheets/")
ap.add_argument("--model", default="gemini-3-pro-image")
ap.add_argument("--aspect", default="3:2")
ap.add_argument("--size", default="2K")

args = ap.parse_args()

load_dotenv(ROOT / ".env")
key = os.environ["GOOGLE_API_KEY"]
prompt = Path(args.prompt).read_text()
refs = [p.read_bytes() for p in REFS]
digest = hashlib.sha256(json.dumps([args.model, args.aspect, args.size, prompt]).encode() + b"".join(refs)).hexdigest()[:16]
cached = CACHE / f"{digest}.png"
if not cached.exists():
    body = {
        "contents": [{"parts": [{"text": prompt}, *({"inline_data": {"mime_type": "image/png", "data": base64.b64encode(r).decode()}} for r in refs)]}],
        "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": args.aspect, "imageSize": args.size}},
    }
    req = urllib.request.Request(
        f"https://generativelanguage.googleapis.com/v1beta/models/{args.model}:generateContent",
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json", "x-goog-api-key": key},
    )
    res = json.load(urllib.request.urlopen(req, context=ssl.create_default_context(cafile=certifi.where()), timeout=300))
    parts = res["candidates"][0]["content"]["parts"]
    image = next((p for p in parts if "inlineData" in p), None)
    if image is None:
        raise SystemExit(f"no image in the response: {json.dumps(res)[:500]}")
    CACHE.mkdir(parents=True, exist_ok=True)
    cached.write_bytes(base64.b64decode(image["inlineData"]["data"]))
    print(f"generated {cached}")
else:
    print(f"cached {cached}")
dest = SHEETS / args.out
dest.write_bytes(cached.read_bytes())
print(f"wrote {dest}")
