#!/usr/bin/env bash
# Export a « Pubs » ad ready to post: out/<slug>.mp4 (silent stereo track: the platform's music goes on it),
# out/<slug>-mobile.mp4, copied with its hand-written out/<slug>.post.md to the exports folder.
#   bash scripts/pub-export.sh PubGrille
set -euo pipefail
ID="${1:?usage: pub-export.sh <PubId>}"
cd "$(dirname "$0")/.."
mkdir -p out
SLUG=$(echo "$ID" | sed -E 's/([a-z])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]')
npx remotion render "$ID" "out/$SLUG.video.mp4" --crf=18 --muted
ffmpeg -loglevel error -y -i "out/$SLUG.video.mp4" -f lavfi -i anullsrc=r=48000:cl=stereo \
  -c:v copy -c:a aac -b:a 128k -shortest -movflags +faststart "out/$SLUG.mp4"
rm "out/$SLUG.video.mp4"
ffmpeg -loglevel error -y -i "out/$SLUG.mp4" -c:v libx264 -crf 21 -preset slow -c:a copy -movflags +faststart "out/$SLUG-mobile.mp4"
EXPORTS="${ANIMART_EXPORTS:-$HOME/Desktop/marketing_animart}"
mkdir -p "$EXPORTS"
cp "out/$SLUG.mp4" "$EXPORTS/"
[ -f "out/$SLUG.post.md" ] && cp "out/$SLUG.post.md" "$EXPORTS/"
echo "→ $EXPORTS/$SLUG.mp4"
