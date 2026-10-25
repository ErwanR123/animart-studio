# The Guide on screen

The character is defined once, for the whole product, in `docs/brand/mascot.md` (personality, body, outfit,
style, golden rule). This file adds what video needs. **Never redesign him**: every drawing derives from one sheet,
`docs/brand/sheets/sheet_poses.png` (the canonical poses); `docs/brand/perso.png` and `turnaround.png` show him whole.

Who he is in one line: an old Italian painter-explorer, warm, curious, a bit clumsy, who can't wait to show you the
detail everybody misses. Short, stocky, round belly, red beret, big grey moustache, olive jacket, red scarf, satchel.

## The bank (`public/guide/`, `src/guide/puppet.tsx`)

One drawing per pose, all by the same hand: the 7 canonical poses plus 16 drawn from them alone in one pass
(`sheet_bank_1.png`, `sheet_bank_2.png`). The user's rule: **one bank, made once, always the same Guide**. A mix of
generations (rounder faces, smoother renders, busts drawn differently) was spotted at once: "on dirait de l'IA".

| pose | use it for |
|---|---|
| `point-up` | showing anything in the images (they are above him): the default "regardez" |
| `explaining` | telling, answering |
| `thinking` | a question, "pourquoi…" |
| `amazed` | a reveal, a shock ("l'éruption", "toute la nature") |
| `scared` | fear, war, death |
| `ears` | hearing, noise, a cry |
| `shh` | silence, a secret kept; also a good first/last frame |
| `whisper` | a hidden thing told ("nous le cache exprès") |
| `shrug` | "peut-être", a hypothesis |
| `reading` | a diary, a letter, a book |
| `writing`, `counting`, `card`, `loupe`, `skeptical`, `sitting`, `walking`, `waving` | only when the line says exactly that (`loupe` on an inscription, `walking` on "rentre chez lui") |
| `celebrating` | joy, a victory |
| `back` | mirroring a figure seen from behind |
| `point-left` / `point-right` | only towards something beside him, never at his own bubble |

Poses drawn facing left are mirrored by the engine (`left: true` in `POSES`): **he always faces right**, towards
his bubble and the screen.

## Acting rules

- **He is secondary**: the eye belongs to the images. **One pose per beat, at most one gesture** on the word that
  carries the meaning (hands on his ears on "entendre"). Three changes in one sentence "pollue la vision".
- **Never a pose that contradicts the line**: three fingers up on "Mai 1945" was "illogique".
- He never covers the art and never moves under his bubble: feet at `BASELINE`, bubble to his right.
- `openPose` is his first frame and, with `loop`, his last: pick one that fits the last line too (`shh` under "il
  est le seul à l'entendre"; `point-up` towards a poster).

## Adding a pose

Only if the bank lacks it. Copy `scripts/guide-prompts/bank-1.xml` (its `<character>`, `<style>` and `<format>`
blocks stay, only `<task>` changes), then:

```console
uv run scripts/guide-generate.py scripts/guide-prompts/<file>.xml sheet_bank_3.png   # ~$0.13 a sheet of 8, cached
```

The canonical sheet is its only reference. Put the result next to `sheet_poses.png` and compare before cutting;
whiten a cream paper first (`guide-assets.py` keys out white). Then `uv run --with pillow --with numpy --with scipy
python scripts/guide-assets.py --list sheet_bank_3.png`, add the boxes to `scripts/guide-cuts.json` at scale 1.2,
run `guide-assets.py`, and add the pose to `POSES` (size, foot centre, mouth, `left` if he faces left).

## Motion (in the rig)

Breathing, sway, a nod on every spoken word, squash-and-stretch on a pose change, hops when `x` changes.

## Upgrade path (if he must come more alive)

Not done, on purpose (October 2026). Each pose has its own mouth, drawn into it at its own angle and size (a grin, an
"O", closed under the moustache): lip sync means painting six mouths (Rhubarb Lip Sync's A–F shapes, free and
local, gives the timing) for every pose, and a generated mouth that doesn't match the drawing is exactly the "on
dirait de l'IA" the user caught on mixed generations. He is secondary: the talk nods carry the speech. If it is ever
done, start with the two poses he talks in most (`point-up`, `explaining`), show the patches beside the poses before
wiring anything.

Layers drawn from the canonical sheet by the same hand, each with its pivot: **mouths** (6 shapes for lip-sync, the
moustache on top moving with them), **eyes** (open / half / closed for blinks every 2.5–5 s), **eyebrows**. Same
generation rule as above: one source, one pass, compared before use.
