# Workflow: painting → master

Each step has a check; don't move on until it passes. Commands run from the repo root with Node 22
(`source ~/.nvm/nvm.sh && nvm use 22`). The `/episode` skill walks through the same steps.

| # | step | command / output | check |
|---|---|---|---|
| 1 | **Research** the painting: museum page, Wikipedia FR + EN | sources in the episode file's header comment | every claim in the script has a source; disputed identifications stay out of the narration |
| 2 | **Images** from Wikimedia Commons into `public/art/` (≥ 3000 px long side; for frescoes in a room, the other walls too; native-res crops of the faces you will zoom on, as `insets`) | a line per file in `public/art/SOURCES.md` | the crop is the whole painting |
| 3 | **Scaffold** | `node scripts/new-episode.mjs Guide<Name> public/art/<img>.jpg` | the composition plays in `npm run dev` |
| 4 | **Script** `src/episodes/<Ep>.script.json` (rules: `bible/script.md`) | spoken French, 150–190 words | read aloud: 60–75 s; every sentence makes sense to a cold viewer; the last beat answers the hook. **Show the user the script and wait for a go** |
| 5 | **Storyboard**: per beat, the camera view, the pose, the effect and its word (format: `bible/format.md`) | a table in the episode file's comment or in chat | one read at a time; effects only from the approved list in `bible/art-direction.md`; show the user |
| 6 | **Coordinates** of every figure / object / eye | `uv run scripts/grid.py public/art/<img>.jpg [x0 y0 x1 y1] [--inset …] [--mark fx,fy]` → `out/grid.png` | marks land on the thing (eyes: the *lower* lid, measured on the inset) |
| 7 | **Placeholder voice** (free) after each script change | `node scripts/voiceover-placeholder.mjs <Ep>` | the edit plays through |
| 8 | **Build** the config `src/episodes/<Ep>.tsx` (copy patterns from `GuideAthens.tsx`) | `npm run lint` | lint passes |
| 9 | **Contact sheet** | `uv run scripts/review.py sheet <Ep> --every 1.5` | per frame: where is the eye, is it understood yet? bubble beside the Guide, nothing in the safe zones, nothing banned |
| 10 | **Real voice, once** (~$0.03) | `uv run scripts/voiceover-gemini.py <Ep> --tempo 1.06`, then `uv run scripts/check-voice.py <Ep>` | every line's first and last words intact, names and dates pronounced right |
| 11 | **Strips** on new effects and every camera seam | `uv run scripts/review.py strip <Ep> --from 12.2 --to 12.8 [--crop x,y,w,h]` | no pop, no black slab, effects on their word |
| 12 | **Master** | `bash scripts/master.sh <Ep>` → `out/<ep>.mp4` + audio report | -14 LUFS ±1, true peak ≤ -1; watch it once with sound, once muted |
| 13 | **Review** like a first-time viewer | `/video-review` | the user's notes go into the bible if they are rules |

## Render pitfalls (all met in the pilot)

- **Black slabs in the 3D room**: a wall that reaches behind the camera is drawn by Chrome as a black slab. When the
  camera faces the painting straight on (before the first turn, the dive into the frame, the loop) `Room` renders
  only that wall (`solo`). A new camera path in the room needs a full-size strip: **stills at `--scale 0.4` don't
  show the bug**, full-size frames do.
- **Two renders at once can hang**: a render that sits at 0 % CPU for minutes is stuck; kill it and render again,
  one at a time.
- **`interpolate` needs finite, increasing ranges**: use `inOut()` for effects whose cue may come late in a
  sentence, and `1e6` (never `Infinity`) for "never".
- **Frames are pure functions of time**: no state, no `Math.random()` (use `rnd(seed)`), no CSS transitions.

## Review like a viewer

- Read the sheet in order and ask at each frame: *where is the eye, and does the viewer understand it yet?*
- Count frames per read (30 = 1 s). A read shorter than 20 frames is missed.
- Look for generated-video tells: everything moving at once, glows and sparkles, an empty frame 0, an ending that
  just stops.

## Budget

Sheets are cheap (proxy at 0.4 scale): one per change. Strips render a few full-size frames: one per new motion. A
full render of a 75 s episode takes ~8 minutes: only when the sheet is clean. The paid voice: once per script
version.
