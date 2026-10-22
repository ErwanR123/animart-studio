# Format: "Le Guide" (pilot: GuideAthens)

One painting, one question, 60–75 s, 9:16. The viewer leaves knowing **who is in the painting, why they stand
where they stand, and the answer to the question** — and the video loops back to the question so they watch again.

## Structure (what the pilot does, beat by beat)

| beat | segment | time | on screen (engine feature) |
|---|---|---|---|
| **Hook** | `hook` | 0–5 s | the painting's room in 3D, slow push on the painting (`room.start`); title + header rise in |
| **Context** | `context` | 5–14 s | from the middle of the room the camera turns to each wall as its word is spoken, the wall's name big under the title (`room.words`); then it dives back into the painting, which hangs in its gold frame |
| **Everyone** | `d0` | 14–18 s | class photo: shutter, then a name tag on every figure (`tags`) |
| **Figures** ×4–6 | `d1…` | 6–9 s each | the frame grows full screen (`climb`) and the camera travels to the figure (`view`); one or two effects on its key words: pencil loop on an object (`glow`), pencil arrow (`arrows`), paper note (`notes`), spotlight + name (`spots`), question marks (`questions`), tears + colour drain (`tear`), a related artwork as a print (`picture`), light on the sky (`shine`) |
| **Answer** | last `d` | 12–16 s | the whole painting full width (`view.z` ≈ 0.5), whip-pan to the facing wall (`turn.word`), both side by side (`turn.split`) |
| **Loop** | end of the last `d` | 2 s | on `loop.word` the camera flies back to the opening shot: the last frame matches the first, the hook starts again |

The structure is a default, not a cage: a painting without a room (most museum paintings) starts on the hung
painting instead of the 3D tour, and can't use `loop` (it needs the room); its answer beat ends on the whole
painting.

## Timing: model the viewer (the rule that fails most)

You know what happens because you wrote it; the viewer sees it once, at full speed, with the sound maybe off.

- **Write the reads.** For every beat, list in order what the viewer has to understand (a *read*): "this is
  Plato", "he points up", "up = the sky". Each read needs ≥ 20 frames to be found and registered.
- **One read at a time.** Never start a new effect while the last one is still being read.
- **Fast moves, slow meanings.** Camera moves are quick (0.5–0.9 s, eased); what they reveal holds (≥ 1 s).
- **The picture lands on the word.** Effects fire on a spoken word's onset (`word` in the config = the first word
  of the segment starting with it). Put the effect's word where the meaning is: the Gérôme print fires on
  "jarre", so the jar sentence comes *before* the convenances sentence.
- **No dead air.** Pauses inside a line are capped at 0.3 s by the voice script; gaps between lines are 0.12 s
  (`tight: true`). The user hears a 0.5 s pause as a "moment mou".

## Layout and safe zones (1080 × 1920)

| zone | value (engine constant) | rule |
|---|---|---|
| painting, climb mode | top 0 → `CLIMB_H` = 1400 | everything that is *shown* lives here |
| the Guide | feet at `BASELINE` = 1665, x = `GUIDE_X` 230 | bottom-left, never over the art |
| speech bubble | right of the Guide, top 1385, x 415 → 975, Caveat 46 px, ≤ 3 lines | in the dark band under the painting, tail up to his mouth — never above his head, never over the painting |
| platform UI | top ~220 px, bottom ~400 px, right ~140 px from y ≈ 900 | nothing essential there; labels stay left of x ≈ 940 |

Check them on a frame with `uv run scripts/review.py sheet <Ep>`; the bubble's 3-line limit comes from the caption
groups (≤ 62 characters, split at punctuation) in `engine.tsx`.

## On-screen text

The voice tells the story; the bubble shows the current phrase (viewers watch muted). Everything else on screen is
a **name** (tags, spot names in gold Caveat), a **label** on an arrow ("le ciel", "la terre", handwritten), a
**short paper note** ("L'Éthique : comment bien vivre"), a **caption** on a print, or the **title** once. Never a
paragraph, never a "?" tag.
