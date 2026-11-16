#!/usr/bin/env bash
# Export a « Détails » reel ready to post: out/<id>.mp4 (full quality, silent stereo track so the platform's music
# can be added), out/<id>-mobile.mp4 (< 30 MB, to send to a phone) and out/<id>.post.md (caption, hashtags,
# YouTube title and tags, the tracked link, sources to check), all from src/formats/details/reels/*.json; then copies
# the phone file and the text to iCloud Drive « Animart à poster ».
#   bash scripts/details-export.sh DetailsSacre
set -euo pipefail
ID="${1:?usage: details-export.sh <DetailsId>}"
cd "$(dirname "$0")/.."
mkdir -p out
SLUG=$(echo "$ID" | sed -E 's/([a-z])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]')

npx remotion render "$ID" "out/$SLUG.video.mp4" --crf=18 --muted
ffmpeg -loglevel error -y -i "out/$SLUG.video.mp4" -f lavfi -i anullsrc=r=48000:cl=stereo \
  -c:v copy -c:a aac -b:a 128k -shortest -movflags +faststart "out/$SLUG.mp4"
rm "out/$SLUG.video.mp4"
ffmpeg -loglevel error -y -i "out/$SLUG.mp4" -c:v libx264 -crf 21 -preset slow -c:a copy -movflags +faststart "out/$SLUG-mobile.mp4"

node -e '
const fs = require("fs"), path = require("path");
const dir = "src/formats/details/reels";
const r = fs.readdirSync(dir).filter(f => f.endsWith(".json")).map(f => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"))).find(x => x.id === process.argv[1]);
if (!r) { console.error("no reel with id " + process.argv[1]); process.exit(1); }
const w = r.work, p = r.post;
const tags = p.hashtags.map(h => "#" + h).join(" ");
const body = `${p.caption}\n\n${w.title} · ${w.artist} · ${w.date}\n\nLien de la waitlist en bio 🔗\n\n${tags}`;
const out = [
  `# ${r.id}: post`, "",
  "## Instagram / TikTok", "", "```", body, "```", "",
  "## YouTube Shorts", "", `Titre : ${p.youtubeTitle ?? p.caption}`, "",
  "Description :", "", "```", body.replace("Lien de la waitlist en bio 🔗", "Lien de la waitlist sur la chaîne 🔗"), "```", "",
  "Tags :", "", "```", (p.youtubeTags ?? []).join(", "), "```", "",
  "## Avant de poster", "",
  "- Ajouter le son tendance dans l’app du réseau (la piste de la vidéo est muette).",
  "- Couverture : la première image (le tableau entier et l’accroche).",
  "- Vérifier chaque fait :", ...r.sources.map(s => `  - ${s}`), "",
].join("\n");
fs.writeFileSync(`out/${process.argv[2]}.post.md`, out);
' "$ID" "$SLUG"

ls -la "out/$SLUG.mp4" "out/$SLUG-mobile.mp4" "out/$SLUG.post.md"

# To the phone: iCloud Drive « Animart à poster » (skipped on a Mac without iCloud Drive).
ICLOUD="$HOME/Library/Mobile Documents/com~apple~CloudDocs"
if [ -d "$ICLOUD" ]; then
  mkdir -p "$ICLOUD/Animart à poster"
  cp "out/$SLUG-mobile.mp4" "$ICLOUD/Animart à poster/$SLUG.mp4"
  cp "out/$SLUG.post.md" "$ICLOUD/Animart à poster/$SLUG.post.md"
  echo "→ iCloud Drive/Animart à poster/$SLUG.mp4 + .post.md"
fi
