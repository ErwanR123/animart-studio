# The Guide on screen

The character is defined once, for the whole product, in
`docs/design-handoff/design/07_MASCOT.md` (personality, body, outfit, style, golden rule). Read
it; this file only adds what video needs. **Never redesign him**: every new drawing derives from the canonical
sheets in `docs/design-handoff/visuel/sheets/`.

Who he is in one line: an old Italian painter-explorer, warm, curious, a bit clumsy, who can't wait to show you
the detail everybody misses. He makes culture feel more alive, never less serious.

## What the rig can do today (`src/guide/puppet.tsx`)

- **Poses** (full body, cut from `sheet_poses.png` by `scripts/guide-assets.py` + `guide-cuts.json`): `explaining`,
  `point-left`, `point-right`, `celebrating`, `satchel`, `reading`, `back`. Each detail's `beat` picks one
  (`{ pose, x }`); the Guide stays at x ≈ 230 in the pilot.
- **Motion**: breathing, sway, a nod on every spoken word, squash-and-stretch and wobble on a pose change, hops
  when `x` changes, line boil.
- **Busts** (`bust-loupe`, `bust-worried`, `bust-laugh`, `bust-skeptical`, `bust-thumb`, `bust-proud`, with
  `BustInsert`) exist in the rig and in `public/guide/` but the engine no longer uses them: the loupe close-up was
  dropped in the pilot. Wire one back only for a clear punchline, and test it first.

## Acting rules (as in the pilot)

| the line… | pose |
|---|---|
| asks the hook, names something on the painting | `point-right` / `point-left` **toward it** (check the side on a frame) |
| introduces, explains, answers | `explaining` |
| looks at the painting with the viewer (a quiet, odd figure: Diogenes) | `back` |

- **One gesture per idea.** Change pose on a new figure, not on every sentence.
- **He never covers the art and never moves under his bubble**: feet at `BASELINE`, bubble to his right in the dark
  band, the painting above `CLIMB_H`.
- On the loop, he returns to his opening pose (`point-right`) so the last frame matches the first.

## Rig upgrade path (what makes him stop looking like a sticker)

Today a pose is one flat image: the mouth never moves, he never blinks, the loupe is part of a bust. The upgrade
is **layers**, drawn from the canonical sheets by the same illustrator hand, transparent PNG, at 2× the sheet
size, each with its pivot point written down. Request them in this order (biggest win first):

1. **Mouths** (for lip-sync on the `explaining` and `point-*` heads): 6 shapes — closed (M/B/P), slightly open
   (most consonants), open (A), round (O/U), wide (E/I), smile-closed. Same moustache over all of them: the
   moustache is drawn **on top** and moves with the mouth (bounce) — that's his signature.
   Code: drive the shape from the voice's word timings + the audio amplitude (`@remotion/media-utils`
   `useWindowedAudioData` + `visualizeAudio`, installed).
2. **Eyes**: open / half / closed per pose, for blinks every 2.5–5 s (hashed, never in sync with anything) and a
   squint on punchlines.
3. **The loupe arm**: the right arm holding the brass magnifying glass, cut at the shoulder, so he can raise it and
   look through it (if the loupe comes back as a gesture rather than an effect).
4. **Eyebrows** on a separate layer (surprise, skepticism) — 07_MASCOT: emotion lives in brows, lids, moustache.
5. A **turn** set: 3/4 front → profile → 3/4 back, for when he turns to the painting.

Prompt for the illustrator / image model (attach `sheet_poses.png` + `sheet_expressions.png` +
`visuel/perso.png`):

```
<character>The Guide from the attached sheets: same face, moustache, beret, outfit, palette and ink-and-gouache
technique. Do not redesign anything.</character>
<task>A mouth chart for the "explaining" pose head, front 3/4 view as in the sheet: 6 mouth shapes (closed M/B/P,
slightly open, open A, round O/U, wide E/I, closed smile), each a separate drawing of the lower face only
(nose bottom to chin), the moustache drawn above each mouth as in the sheet.</task>
<format>White paper background, each shape in its own box with 40 px margin, same scale for all, 2048 px wide
sheet, no text, no shadows outside the drawing.</format>
```

Then cut them with `scripts/guide-assets.py` (add the boxes to `scripts/guide-cuts.json`) and measure each layer's
anchor on the pose image. Check every new layer with `review.py strip --crop` on the face at 2× before using it.
