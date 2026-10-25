#!/usr/bin/env bash
# Final render + audio master for social (bible/sound.md): Remotion render, then a two-pass EBU R128 loudnorm
# to -14 LUFS integrated, true peak aimed at -1.5 dBTP so the AAC encode stays under -1 (TikTok, Reels and Shorts
# all normalise around -14: a quieter file just sounds weak next to the others).
# Usage (from the repo root): bash scripts/episode-master.sh <CompositionId> [out-name]
#   → out/<out-name>.mp4 (default: the id in kebab-case), then prints the audio report.
set -euo pipefail
COMP=${1:?usage: episode-master.sh <CompositionId> [out-name]}
NAME=${2:-$(echo "$COMP" | sed -E 's/([a-z0-9])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]')}
RAW=out/.${NAME}-raw.mp4
FINAL=out/${NAME}.mp4

npx remotion render "$COMP" "$RAW" --log=error

# Pass 1: measure. Pass 2: apply the measured values (linear mode keeps the mix's dynamics intact).
STATS=$(ffmpeg -hide_banner -i "$RAW" -af loudnorm=I=-14:TP=-1.5:LRA=9:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
val() { echo "$STATS" | sed -n "s/.*\"$1\" : \"\(-*[0-9.]*\)\".*/\1/p"; }
ffmpeg -v error -y -i "$RAW" -c:v copy \
  -af "loudnorm=I=-14:TP=-1.5:LRA=9:measured_I=$(val input_i):measured_TP=$(val input_tp):measured_LRA=$(val input_lra):measured_thresh=$(val input_thresh):offset=$(val target_offset):linear=true,aresample=48000" \
  -c:a aac -b:a 256k -movflags +faststart "$FINAL"
rm -f "$RAW"
echo "$FINAL"
uv run -q scripts/episode-review.py audio "$FINAL"
