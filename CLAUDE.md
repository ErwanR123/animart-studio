# Animart video studio

Short videos about paintings (9:16, 1080×1920, 30 fps, 55–70 s) for TikTok / Reels / Shorts, in French. The format
is **"Le Guide"**: the Guide (our cartoon mascot) tells the story from the bottom of the frame, his words in a paper
bubble beside him, while the top shows the painting (pencil loops, notes, spotlights on his words) and Vox-style
paper collages of its time (real archives, cut and pasted). Remotion (React) renders it; every timing comes from
the voiceover's word timestamps.

**Five finished episodes are the references** (`examples/` holds compressed previews): `GuideAthens` (the pilot),
`GuideHomecoming`, `GuideAlexander`, `GuideScream` (the collage-shot style) and **`GuideParisRain`** (Caillebotte,
the latest and the quality bar: every beat a collage shot, paper puppets, drawn scenery, a loupe in the hook). Start
a new episode by copying `src/episodes/GuideParisRain.tsx`.

Before any work, read:

| file | what it decides |
|---|---|
| [bible/format.md](bible/format.md) | the frame (Guide at the bottom, images at the top), the beat structure, timing by reads, on-screen text |
| [bible/script.md](bible/script.md) | **how to write the narration**: the rules the user's notes produced, reference scripts |
| [bible/vox.md](bible/vox.md) | **the Vox rules** for collage shots: shot types, composition, colour, type, motion, paper puppets, camera, cuts, checklist |
| [bible/art-direction.md](bible/art-direction.md) | the collage-shot style, choosing images, every effect with its verdict, rejected and banned |
| [bible/character.md](bible/character.md) | the Guide: the pose bank, which pose for which line, acting rules, adding a pose |
| [bible/sound.md](bible/sound.md) | the voice (tempo, pauses, cache), the bed, accents, mastering |
| [bible/workflow.md](bible/workflow.md) | painting → master, step by step with commands and checks; render pitfalls |
| [bible/prompts.md](bible/prompts.md) | XML prompt templates; [bible/references.md](bible/references.md): outside references |

Skills: **`/episode`** (a new video end to end) and **`/video-review`** (look at a render like a viewer, fix it).
Load `remotion-best-practices` before writing Remotion code.

## Code map

- `src/guide/engine.tsx` — `createGuideEpisode(cfg)`: the whole format. `GuideConfig` and `GuideDetail` document
  every option; the timeline, the camera, every overlay and every sound derive from the voice JSON.
- `src/guide/shots.tsx` — the collage shots (`shots` in a detail): layers (pages, cut-outs, tape, big numbers,
  stamps, stripes, discs, pencil, highlighter, haze) landing on their words, transitions, gentle camera.
- `src/guide/puppet.tsx` — the Guide (pose bank, talk nods, hops, mirrored so he always faces right).
- `src/guide/room.tsx` — the painting's room in CSS 3D (`room`, the pilot); `src/guide/shader.ts` — `paintFx`, the
  WebGL2 flow of the paint round a still figure (`flow` + `depth`; renders need ANGLE, set in `remotion.config.ts`).
- `src/episodes/<Name>.tsx` + `<Name>.script.json` — one episode = a config + its narration; `src/episodes/index.ts`
  registers them (one composition each, via `src/Root.tsx`).
- `src/fonts.ts`, `src/theme.ts` (easings, size, fps), `src/components.tsx` (film grain).
- `src/guide/maps/` — flat maps generated from OpenStreetMap (`scripts/map-osm.py`) for the `map` layer.
- `src/guide/scenery.tsx` — drawn scenery layers in flat cut paper (a facade floor by floor, a bucket emptied from a
  window, flies, a barricade, building-site ground and scaffolding, fire).
- `src/guide/rigs.tsx` + `src/guide/rigs/` — paper puppets cut limb by limb from archive photos (`scripts/rig-cut.py`, specs in `scripts/rigs/`) for the `rig` layer; judged in the `GuidePuppets` lab composition.
- `public/` — what the videos load:
  - `art/<episode>/` (the painting, its close-ups, its collage pieces), `art/paper/` (shared backgrounds),
    `art/kit/` (shared cut-outs: 19th-c. Paris people, monuments in ink), `art/SOURCES.md`;
  - `guide/` (the pose bank, bubble, paper);
  - `sfx/accents/` (paper, pencil, swish: placed by the engine), `sfx/story/` (one-offs an episode names),
    `sfx/SOURCES.md`;
  - `music/`, `voice/` (generated narration + word timings).
- `scripts/` — named by family: `episode-*` (new, review, master), `voice-*`, `image-*`, `guide-*` (see Commands).
- `docs/brand/` — the Guide's identity: `mascot.md`, the canonical pose sheet and the bank sheets
  (`sheets/`), drawn decorations and textures (`assets/`), the brand (`design-direction.md`,
  `design-system.md`). `docs/inspiration/` — the Vox-style reel the collage style comes from.
- `library/` — raw material not yet in a video: `app-guide/` (paper bubbles, tape, stamps, sketches from the
  app), `soundbank/` (`music/` beds, `ambiences/`).

## Commands (from the repo root, Node 22: `source ~/.nvm/nvm.sh && nvm use 22`)

```bash
npm run dev                                                      # Remotion Studio
npm run lint                                                     # eslint + tsc

# episode
node scripts/episode-new.mjs GuideMonaLisa public/art/mona-lisa/mona-lisa.jpg   # scaffold, plays at once
uv run scripts/episode-review.py sheet <Ep> --every 1.5          # labelled contact sheet
uv run scripts/episode-review.py sheet <Ep> --every 3 --phone   # phone size, TikTok/Reels buttons drawn over
uv run scripts/episode-review.py strip <Ep> --from 12.2 --to 12.8   # every frame of a move, full size
uv run scripts/episode-review.py cadence out/<ep>.mp4            # cut rhythm and held frames vs the Vox reference
npx remotion still <Ep> out/sb.png --frame=300 --gl=angle        # one full-size still (storyboard, checks)
bash scripts/episode-master.sh <Ep>                              # out/<ep>.mp4, -14 LUFS, audio report

# images
uv run scripts/image-find.py search "Munch Scream"               # Commons search; info / get / category; IA: inside / page
uv run scripts/image-find.py europeana "Krakatoa"                # European libraries and museums (French press, prints)
uv run scripts/image-find.py hires "<museum viewer URL>"         # full-resolution tiled scan (Google Arts & Culture, IIIF)
uv run scripts/image-collage.py SRC OUT.png --cut                # any image → a collage piece (cut-out, torn print, page)
uv run scripts/image-grid.py public/art/<ep>/<img>.jpg 0.4 0.5 0.6 0.7   # coordinates → out/grid.png
uv run scripts/image-depth.py public/art/<ep>/<img>.jpg          # depth map for `flow` (local, free)
uv run scripts/map-osm.py paris --bbox S,W,N,E --boundary <rel> --river "La Seine" --way "Rue de Rivoli"   # flat map → src/guide/maps/
uv run scripts/rig-cut.py scripts/rigs/napoleon.json   # paper puppet pieces → public/art/rigs/<name>/ + src/guide/rigs/<name>.json

# voice
node scripts/voice-placeholder.mjs <Ep>                          # free voice to build the edit
uv run scripts/voice-gemini.py <Ep> --tempo 1.1 --cap 0.2        # the Guide's voice (~$0.03 a take, cached)
uv run scripts/voice-check.py <Ep>                               # every line's first/last words vs the script
```

The Guide's drawings: `scripts/guide-generate.py` (a new pose sheet from the canonical one, ~$0.13),
`scripts/guide-assets.py` (cut them, boxes in `guide-cuts.json`). `scripts/refs.sh` re-clones outside references.

## Rules that bite

- **Never judge from code. Render and look** (sheet → stills → strips, full size for thin lines), and listen. A
  change is not done until it was seen in a frame and heard in a render.
- **Storyboard collage shots as stills before animating them**, and show them.
- **A shot layer without `at` lands 0.08 s after the layer before it** (plus its `after`): a list of such layers
  chains and drifts seconds late. Give every piece that must land early `at: "<the shot's word>"` + `after`.
- **A shot lasts until the next shot of its beat; the last one ends with the beat**, and the painting shows in the
  gap before the next beat's first shot. `carry: true` holds it until the next shot (a gap under 1.5 s).
- **A cue word matches the first word of the beat that starts with it** ("rue" hits "ruelles"): check
  `public/voice/<Ep>.json` and pick an unambiguous word.
- **Frames are pure functions of time.** No state, no `Math.random()`, no CSS transitions; clock-driven motion
  starts from its own cue.
- **Facts are checked** (museum page, Wikipedia, period documents; sources in the episode file's header comment).
- **Paid generation is rare and cached** (`cache/`, git-ignored: copy it between machines): the voice once per
  approved script, a Guide sheet only for a missing pose. The user watches the API bill.
- Images and sounds: any source the episode needs (the user owns the rights call; don't raise copyright), each
  recorded in its folder's `SOURCES.md`.
- Ask before adding an effect the user hasn't seen: test it on one beat, show it, record the verdict in
  `bible/art-direction.md`.

## How the user judges a video

- **The text matters most**: sentences that are vague, false or meaningless to a cold viewer get rewritten. Show the
  script before building anything. Emotion first; only hard facts must be true.
- Hates anything that looks or sounds "AI": filters and warps on the painting, sparkles, glows, chimes, jitter, a
  Guide whose drawing changes, a choppy voice.
- Wants the viewer to travel: archives of the time, collages built word by word, ~2 s a shot, calm motion.
- Notices every misplaced mark (a loop off the ear), every label cut by the edge, every leftover, every repeat.
- Wants a lively pace: no blanks in the voice except where eloquence needs them.
- "Refais" means from scratch. When unsure what they mean, propose options before changing.
- Never raise copyright or licensing: use whatever source serves the video, record where it came from.

`examples/` holds compressed copies of the finished episodes (`out/` is git-ignored); after a new episode is signed
off, add its preview (`ffmpeg -i out/<ep>.mp4 -c:v libx264 -crf 27 -preset slow -c:a aac -b:a 128k -movflags
+faststart examples/<ep>.mp4`).
