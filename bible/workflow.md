# Workflow: painting → master

Each step has a check; don't move on until it passes. Commands run from the repo root with Node 22
(`source ~/.nvm/nvm.sh && nvm use 22`). The `/episode` skill walks through the same steps.

| # | step | command / output | check |
|---|---|---|---|
| 1 | **Research**: museum page, Wikipedia FR + EN, and the story around the painting (letters, diaries, the press of the time) | sources in the episode file's header comment | every hard fact has a source; a disputed hypothesis is said as one |
| 2 | **Script** `src/episodes/<Ep>.script.json` (`bible/script.md`) | 140–180 words, vouvoiement | read aloud ≈ 55–70 s; every sentence makes sense cold; the end answers the hook. **Show the user, wait for a go** |
| 3 | **The painting**: the museum's scan, as large as exists (≥ 3000 px; a deep zoom on a detail wants 6000+) | `uv run scripts/image-find.py search "<artist> <title>"` → `info` → `get` (Commons), or `hires "<Google Arts & Culture / museum viewer URL>"` (dezoomify-rs, the full tiled scan); lands in `out/sources/`, copy to `public/art/<ep>/` | the whole painting, sharp at the closest zoom the script needs; a line in `public/art/SOURCES.md` |
| 4 | **Scaffold** | `node scripts/episode-new.mjs Guide<Name> public/art/<ep>/<img>.jpg` | plays in `npm run dev` |
| 5 | **Storyboard, as still images**: per sentence, what is on top (painting view or collage shot), which archive, which mark, the Guide's pose, and what each shot carries across the cut (`bible/art-direction.md`, raccord) | a table first, then **one still per collage shot** (`npx remotion still <Ep> out/sb-<t>.png --frame=<f> --gl=angle`) | show the stills and get a go **before animating**: a bad composition is already bad as a still (pieces cut by the edge, a photo hidden, a figure pasted over what it should face) |
| 6 | **Archives** for the shots: period photos, engravings, newspapers, letters; for a French story, the French press of the time (*Le Petit Journal*, *Le Petit Parisien* covers) | `image-find.py search/get` and `category "1890 Le Petit Journal"` on Commons; `europeana "<words>"` (European libraries and museums) then `url <link>`; `inside <IA item> "<words>"` then `page <item> <n>` for a scanned book or journal | each image says what its sentence says, true to its time and place (`bible/art-direction.md`) |
| 7 | **Pieces** | `uv run scripts/image-collage.py SRC public/art/<ep>/<name>.png [--crop …] [--cut] [--tone bw|halftone|colour] [--paper]` | a line each in `SOURCES.md` |
| 8 | **Coordinates** of every mark on the painting | `uv run scripts/image-grid.py public/art/<ep>/<img>.jpg x0 y0 x1 y1 --mark fx,fy` → `out/grid.png` | a loop goes round the thing (a hand from ear to wrist), measured, never guessed |
| 9 | **Placeholder voice** (free) | `node scripts/voice-placeholder.mjs <Ep>` | the edit plays through |
| 10 | **Build** `src/episodes/<Ep>.tsx` (copy patterns from the closest example) | `npm run lint` | passes |
| 11 | **Contact sheet**, then at phone size | `uv run scripts/episode-review.py sheet <Ep> --every 1.5`, then `… sheet <Ep> --every 3 --phone` (TikTok/Reels buttons and caption drawn over) | per frame: where is the eye, is it understood? nothing cut by an edge, nothing left over from the previous shot, the Guide facing right; at phone size the subject is still big enough to read and nothing that matters sits under the buttons |
| 12 | **Real voice, once** (~$0.03) | `uv run scripts/voice-gemini.py <Ep> --tempo 1.1 --cap 0.2`, then `uv run scripts/voice-check.py <Ep>` | first and last words intact, names and dates right; re-check the sheet (timings moved) |
| 13 | **Strips** on every transition and new motion | `uv run scripts/episode-review.py strip <Ep> --from 12.2 --to 12.8` | no pop, no jump in frame, nothing shaking without a reason |
| 14 | **Master** | `bash scripts/episode-master.sh <Ep>` → `out/<ep>.mp4` + audio report, then `uv run scripts/episode-review.py cadence out/<ep>.mp4` | -14 LUFS ±1, true peak ≤ -1, no music hole; cadence close to the reference (median shot ≤ 3 s in collage runs, frozen ≈ 0 %: the picture never stops for half a second) |
| 15 | **Review** like a first-time viewer, then the user | `/video-review` | the user's notes that are rules go into the bible; a signed-off episode gets its preview in `examples/` |

## Render pitfalls

- **Full-size frames for anything thin** (pencil strokes, dashes, a 3D wall): stills at `--scale 0.4` hide bugs. A
  red strike that came out dotted, a black slab in the 3D room: both only showed at full size.
- **Two renders at once can hang**: one render at a time; kill one that sits at 0 % CPU.
- **`interpolate` needs finite, increasing ranges**: `inOut()` for cues that may come late, `1e6` (never `Infinity`).
- **Frames are pure functions of time**: no state, no `Math.random()` (use `rnd(seed)`), no CSS transitions. Any
  motion that depends on the clock starts from its own cue (`t - at`), never from the video's start (the ash cloud
  that had drifted off the map by 40 s).
- **The voice cache**: `cache/gemini/` holds every paid take by text + voice + style. Re-cutting (`--tempo`, `--cap`)
  is free while the take is cached; change one word of the script and the next run pays for a new performance.
  Never trim a take from Whisper's word times (they clip syllables): only `voice-gemini.py`'s silence detection.

## Budget

Sheets are cheap (0.4 proxy): one per change. Stills for the storyboard: a few seconds each. A full master of 65 s
takes ~6 minutes: only when the sheet is clean. The paid voice: once per approved script. A Guide pose sheet
(`scripts/guide-generate.py`, ~$0.13): only to add a pose the bank lacks.
