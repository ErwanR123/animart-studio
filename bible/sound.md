# Sound

The test: **with eyes closed, do you still follow the story?** A close, natural voice, a quiet piano bed, and a few
paper-and-pencil sounds on the moments that matter. All of it is placed by `src/guide/engine.tsx` from the same
word timings as the picture: an episode config only names an accent and its word.

## The voice (the king)

- **Gemini TTS, the Guide's own voice** (the app's voice: same `GUIDE_VOICE_ID_GEMINI`):
  `uv run scripts/voice-gemini.py <Episode> --tempo 1.1 --cap 0.2`. Model `TTS_MODEL_GEMINI_PREMIUM` (default
  `gemini-3.8-flash-tts`), key `GOOGLE_API_KEY`, all read from the repo-root `.env`, never printed.
- **One call for the whole script** (line-by-line calls change mood every sentence and sound "IA"), one sober
  `STYLE`. About **$0.03 per take**, cached in `cache/gemini/` by text + voice + style. Change the script, then
  generate **once**. Re-cutting the same take (`--tempo`, `--cap`) is free.
- **Pace**: `--tempo 1.1` and pauses inside a line capped at `--cap 0.2` s. The user found 1.06 and 0.3 s slow
  ("il prend beaucoup de temps à dire les phrases", "les gens vont se barrer"). A line that needs eloquence keeps a
  longer breath with `"pause": 0.35` in its segment (the last line of *Le Cri*).
- The script cuts the take into lines **in the breath between them**: Whisper says roughly where each line starts,
  then the cut goes in the middle of the longest true silence measured in the audio just before (one cut shared by
  the end of a line and the start of the next), and only true silence is trimmed. Never cut a take from Whisper's
  word times alone: they come early on word ends and late on starts, and collapse on numbers ("1848. En 1853"
  lost "En mille" on *Rue de Paris*).
- **Check every cut**: `uv run scripts/voice-check.py <Episode>` (first and last words of each line vs the script).
- `say` in a segment is what the voice reads when the caption differs (dates spelled out, "Mounk" for Munch).
- **Delivery tags** (Gemini TTS reads them, never says them): `[whispers]`, `[short pause]`, `[sigh]`… in `say`, one
  at most per line and only where the line needs it (a secret told, the last breath before the answer). Not yet
  heard by the user: try one line, let them listen, record the verdict here. `voice-gemini.py` drops the tags
  before cutting the take into lines.
- Free placeholder to build the edit first: `node scripts/voice-placeholder.mjs <Episode>` (macOS `say`).

## The bed

One quiet bed per episode, `music` in the config (default `public/music/gymnopedie-1.mp3`, Satie, public-domain
recording): 0.3 alone, ducked to 0.12 under the voice, faded over the last 1.5 s. Under a grey `freeze` it dips to
about half; it stops only when a heartbeat (`heart`) takes over, and comes back with the colour. A silence and then
the music jumping back reads as a bug (*Alexander*).

**Pick the bed of the painting's time and place** when one fits (Grieg for Munch's Norway, Debussy or Satie for
Paris around 1890, a Baroque adagio for a 17th-century canvas): the same Gymnopédie on every video of the account
becomes a jingle. A bed is a recording, never MIDI or a synthesised imitation: solo piano or a small ensemble, slow,
no strong beat, no voice, quiet from the first second, ≥ the episode's length (or a clean loop point). Sources:
Musopen recordings (public domain) on Internet Archive and Commons (`image-find.py search "<composer> <work> ogg"` →
`info` for the licence → `get`). Cut it with ffmpeg (start where it is already playing softly, loudness-normalised,
3 s fade-out), save it as `public/music/<work>.mp3` with a line in `public/music/SOURCES.md`, and **let the user hear
it on the first render**. `library/soundbank/music/` holds two other beds to try.

## Accents (all CC0, `public/sfx/`)

| moment | sound | volume |
|---|---|---|
| a pencil loop, arrow or strike starts | `accents/pencil-*` | 0.5 |
| a collage shot slides or tears in, a paper note lands | `accents/page-*` | 0.5 |
| a piece lands in a shot | `accents/page-*` | 0.22 |
| a stamp, a big number | `accents/thud` | 0.45 |
| a print is shown (`picture`) | `accents/tape` | 0.6 |
| room turns, spotlights, whip-pans | `accents/swish-*` | 0.35–0.6 |
| class photo | `accents/shutter` | 0.55 |
| story sounds, one-offs | `story/` (heart, courtyard, planes, pour, boom, nature-cry, bark, hurray…) | per beat |

`take(kind, i)` cycles numbered takes so a repeat never sounds identical.

## Rules

- **One sound per read, on its contact.** The pencil sounds when the line starts; nothing scratches through.
- **A sound matches what you see**: a pencil under a spotlight was heard as a bug.
- **Never a "cling", a chime or a sparkle sound**; nothing that sounds like an app notification.
- **Fewer is better**: two accents within 0.25 s, keep the one that matters.
- **No continuous noise bed** (*Le Cri*'s wind: "ça fait mal au crâne, ça porte rien"). A bed is a recognisable
  place (a courtyard) and only where the story is there.

## Mastering

`bash scripts/episode-master.sh <Episode>` renders, then a two-pass loudnorm to **-14 LUFS, true peak ≤ -1 dBTP**, AAC
256 k, and prints the audio report. Social platforms normalise around -14.

## Adding sounds

Any source that sounds right (Commons, Freesound CC0, our own synthesis with ffmpeg), cut and normalised, in
`public/sfx/story/`, with a line in `public/sfx/SOURCES.md`.
