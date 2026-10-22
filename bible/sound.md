# Sound

The test: **with eyes closed, do you still follow the story?** A close, natural voice, a quiet piano bed, and a few
paper-and-pencil sounds on the moments that matter. All of it is placed by `src/guide/engine.tsx` from the same
word timings as the picture: an episode config never places a sound by hand.

## The voice (the king)

- **Gemini TTS, the Guide's own voice**: `uv run scripts/voiceover-gemini.py <Episode> --tempo 1.06`. Model
  `TTS_MODEL_GEMINI_PREMIUM` (default `gemini-3.8-flash-tts`), voice `GUIDE_VOICE_ID_GEMINI`, key `GOOGLE_API_KEY`
  — all three read from the repo-root `.env`, never printed.
- **One call for the whole script** (line-by-line calls change mood every sentence and sound "IA"), with one sober
  `STYLE`: a warm storyteller, one steady conversational tone, lively pace, light Italian accent. About **$0.03 per
  full take**; every take is cached in `cache/gemini/` by text + voice + style, so re-running costs nothing unless
  the text changes. The user watches the API bill: change the script, then generate **once**.
- The script then cuts the take into lines: Whisper word timings matched to the script letter by letter, each line
  kept from its first to its last sound (breaths around it dropped — a breath at both ends of a cut sounded like a
  "double respiration"), **pauses inside a line capped at 0.3 s**, `--tempo 1.06` applied, then loudnorm.
- **Check every cut**: `uv run scripts/check-voice.py <Episode>` transcribes each line's first and last words next
  to the script's. A clipped word ("verie" for "vérité") or a mangled date shows here, before the render.
- `say` in a segment is what the voice reads when the caption differs (dates spelled out).
- Free placeholder to build the edit first: `node scripts/voiceover-placeholder.mjs <Episode>` (macOS `say`).

## The bed

`public/music/gymnopedie-1.mp3` (Satie, public-domain recording, `SOURCES.md`): 0.3 alone, ducked to 0.12 under
the voice (`musicVolume`), faded over the last 1.5 s. It stops dead on a `wink`.

## Accents (what the pilot plays, all CC0, `public/sfx/v2` + `v3`)

| moment | sound | volume |
|---|---|---|
| each room turn, the dive into the frame | `swish-*` (cloth) | 0.55 / 0.4 |
| class photo | `shutter` | 0.55 |
| a spotlight opens | `swish-*` | 0.35 |
| a pencil loop or arrow starts | `pencil-*` (the "gribouillage") | 0.5 |
| a paper note lands, the side-by-side view | `page-*` | 0.55 / 0.5 |
| a print is shown (`picture`) | `v3/tape` (a paper flap) | 0.6 |
| whip-pan to the facing wall | `swish-*` | 0.6 |

`take(kind, i)` cycles the numbered takes so a repeat never sounds identical.

## Rules (from the pilot's notes)

- **One sound per read, on its contact.** The pencil sounds when the line *starts*; nothing scratches through
  the whole draw-on.
- **A sound must match what you see.** A pencil sound under a spotlight (Diogenes) or a print was heard as a bug.
- **Never a "cling", a chime or a sparkle sound**; nothing that sounds like an app notification.
- **Fewer is better**: if two accents fall within 0.25 s, keep the one that matters.

## Mastering

`bash scripts/master.sh <Episode>` renders, then a two-pass loudnorm to **-14 LUFS, true peak ≤ -1 dBTP**, AAC
256 k, and prints the audio report (`review.py audio`). Social platforms normalise around -14: a quieter file just
sounds weak.

## More sounds

`public/sfx/v3` holds extra CC0 cuts (steps, hop, cloth, pin, room tone) built by `scripts/sfx-curate.sh` from the
packs in `sound-library/` (git-ignored, re-downloaded by the script); `scripts/sfx.mjs` makes a bespoke ElevenLabs
take under the same name (needs `ELEVENLABS_API_KEY`). Record every file you add in `public/sfx/SOURCES.md`; only
Any source that sounds right, recorded in `SOURCES.md`.

## The tragic turn (from *Homecoming G.I.*)

When the story turns dark (`freeze`), the music stops completely: no cheerful piano under it. The courtyard bed goes
muffled and a heartbeat takes over (`ambience`, `heart`); the music comes back only when the colour does.
