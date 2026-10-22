#!/usr/bin/env bash
# Builds the free (CC0) sound palette v3 in public/sfx/v3 from the packs in sound-library/ (git-ignored).
# Same file names as scripts/sfx-library.json, so an ElevenLabs take (scripts/sfx.mjs) simply replaces one.
# Every file: mono 48 kHz, leading silence trimmed, 5 ms fade-in, peak -3 dBFS (bible/sound.md: volumes in code
# then mean the same thing for every file). Usage (from the repo root): bash scripts/sfx-curate.sh
set -euo pipefail
LIB=sound-library
OUT=public/sfx/v3
mkdir -p "$OUT"

if [ ! -d "$LIB/kenney_rpg-audio" ]; then
  mkdir -p "$LIB" && cd "$LIB"
  for u in \
    https://kenney.nl/media/pages/assets/rpg-audio/8e99002d76-1677590336/kenney_rpg-audio.zip \
    https://kenney.nl/media/pages/assets/impact-sounds/87b4ddecda-1677589768/kenney_impact-sounds.zip \
    https://kenney.nl/media/pages/assets/interface-sounds/fa43c1dd4d-1677589452/kenney_interface-sounds.zip; do
    n=$(basename "$u" .zip); mkdir -p "$n"; curl -sL "$u" -o "$n.zip"; unzip -qo "$n.zip" -d "$n"; rm "$n.zip"
  done
  mkdir -p bigsoundbank && curl -sL https://bigsoundbank.com/UPLOAD/flac/3432.flac -o bigsoundbank/chambord-interior-3432.flac
  cd - >/dev/null
fi

RPG=$LIB/kenney_rpg-audio/Audio
IMP=$LIB/kenney_impact-sounds/Audio
UI=$LIB/kenney_interface-sounds/Audio

# peak-normalise to -3 dBFS after the given filters
norm() { # in out [filters]
  local in=$1 out=$2 pre=${3:-anull}
  local tmp; tmp=$(mktemp -t sfx).wav
  ffmpeg -v error -y -i "$in" -af "$pre,silenceremove=start_periods=1:start_threshold=-50dB,afade=t=in:d=0.005" -ac 1 -ar 48000 "$tmp"
  local max; max=$(ffmpeg -i "$tmp" -af volumedetect -f null - 2>&1 | sed -n 's/.*max_volume: \(-*[0-9.]*\) dB.*/\1/p')
  ffmpeg -v error -y -i "$tmp" -af "volume=$(echo "-3 - (${max})" | bc)dB" "$out"
  rm -f "$tmp"
}

# Footsteps of a small man in leather shoes on a parquet floor (his hops and shuffles)
norm "$IMP/footstep_wood_000.ogg" "$OUT/step-1.wav"
norm "$IMP/footstep_wood_001.ogg" "$OUT/step-2.wav"
norm "$IMP/footstep_wood_003.ogg" "$OUT/step-3.wav"
norm "$IMP/impactSoft_medium_001.ogg" "$OUT/hop.wav" "lowpass=f=5000"
# Jacket and satchel moving on a pose change
norm "$RPG/clothBelt.ogg" "$OUT/cloth-1.wav"
norm "$RPG/clothBelt2.ogg" "$OUT/cloth-2.wav"
norm "$RPG/beltHandle1.ogg" "$OUT/cloth-3.wav"
# The magnifying glass: out of the leather satchel with a brass click, back in with a soft drop
ffmpeg -v error -y -i "$RPG/handleSmallLeather.ogg" -i "$RPG/metalClick.ogg" \
  -filter_complex "[1]adelay=260|260[c];[0][c]amix=inputs=2:normalize=0" "$LIB/loupe-out.wav"
norm "$LIB/loupe-out.wav" "$OUT/loupe-out.wav"
norm "$RPG/dropLeather.ogg" "$OUT/loupe-away.wav"
norm "$IMP/impactGlass_light_000.ogg" "$OUT/glint.wav" "highpass=f=1500,volume=-6dB"
# Paper and desk: tags pinned, a note card, a pencil tap
norm "$UI/drop_002.ogg" "$OUT/bubble.wav" "lowpass=f=4000"
norm "$UI/click_002.ogg" "$OUT/pin.wav"
norm "$UI/tick_002.ogg" "$OUT/tick-hmm.wav"
norm "$RPG/bookFlip2.ogg" "$OUT/tape.wav"

# Room tone: Chambord, visitors inside the château (BigSoundBank #3432, CC0). 90 s from the calmest stretch,
# band-limited and pushed back so it reads as "a big quiet room" under the voice, never as people talking.
ffmpeg -v error -y -ss 40 -t 90 -i "$LIB/bigsoundbank/chambord-interior-3432.flac" \
  -af "highpass=f=140,lowpass=f=5500,aecho=0.8:0.6:60|110:0.25|0.18,loudnorm=I=-26:TP=-6:LRA=5,afade=t=in:d=1,afade=t=out:st=88:d=2" \
  -ac 2 -ar 48000 "$OUT/room-tone.wav"
echo "v3 palette: $(ls "$OUT" | wc -l | tr -d ' ') files in $OUT"
