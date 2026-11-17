#!/usr/bin/env bash
# Export an « Agenda » reel ready to post: out/<slug>.mp4 (full quality, with its voice), out/<slug>-mobile.mp4
# (< 30 MB, to send to a phone), copied to the exports folder (~/Desktop/marketing_animart). The post's text is
# written by hand in out/<slug>.post.md (src/formats/agenda/README.md, « Le post »).
#   bash scripts/agenda-export.sh Agenda1120
set -euo pipefail
ID="${1:?usage: agenda-export.sh <AgendaId>}"
cd "$(dirname "$0")/.."
mkdir -p out
SLUG=$(echo "$ID" | sed -E 's/([a-z])([A-Z0-9])/\1-\2/g' | tr '[:upper:]' '[:lower:]')

npx remotion render "$ID" "out/$SLUG.mp4" --crf=18
ffmpeg -loglevel error -y -i "out/$SLUG.mp4" -c:v libx264 -crf 21 -preset slow -c:a copy -movflags +faststart "out/$SLUG-mobile.mp4"

EXPORTS="$HOME/Desktop/marketing_animart"
mkdir -p "$EXPORTS"
cp "out/$SLUG.mp4" "$EXPORTS/"
[ -f "out/$SLUG.post.md" ] && cp "out/$SLUG.post.md" "$EXPORTS/"
echo "→ $EXPORTS/$SLUG.mp4"
