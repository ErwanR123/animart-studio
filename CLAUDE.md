# Animart video studio

Short educational videos about paintings (9:16, 1080×1920, 30 fps, 60–75 s) for TikTok / Reels / Shorts, in
French. The format is **"Le Guide"**: the painting in its real room, then full screen, explored by the Guide (our
cartoon mascot) who narrates from the bottom of the frame, his words in a paper bubble beside him, while pencil
marks, paper notes and spotlights land on his words. Remotion (React) renders it; every timing comes from the
voiceover's word timestamps.

**The pilot is `GuideAthens`** (Raphael, *The School of Athens*, `out/guide-athens.mp4`): the user signed it off as
the reference for the account's style. A new episode should look and sound like it.

Before any work, read:

| file | what it decides |
|---|---|
| [bible/format.md](bible/format.md) | the episode structure beat by beat, timing by reads, layout and safe zones |
| [bible/script.md](bible/script.md) | **how to write the narration** — the rules the user's notes on the pilot produced |
| [bible/art-direction.md](bible/art-direction.md) | palette, type, the approved effects (with their config keys), the rejected ones, the anti-slop list |
| [bible/sound.md](bible/sound.md) | the Gemini voice pipeline, the bed, the accent palette, mastering |
| [bible/character.md](bible/character.md) | the Guide: poses, acting rules, rig upgrade path |
| [bible/workflow.md](bible/workflow.md) | painting → master, step by step with commands and checks; render pitfalls |
| [bible/prompts.md](bible/prompts.md) | XML prompt templates; [bible/references.md](bible/references.md): skills and outside references |

Skills: **`/episode`** (a new video end to end) and **`/video-review`** (look at a render like a viewer, fix it).
Load `remotion-best-practices` before writing Remotion code.

## Code map

- `src/guide/engine.tsx` — `createGuideEpisode(cfg)`: the whole format. `GuideConfig` and `GuideDetail` document
  every option and effect; the timeline, the camera, every overlay and every sound are derived from the voice JSON.
- `src/guide/room.tsx` — the painting's room in CSS 3D (walls, camera, `solo` mode); `src/guide/puppet.tsx` — the
  Guide puppet (poses, talk nods, hops, busts).
- `src/episodes/<Name>.tsx` + `<Name>.script.json` — one episode = a config + its narration; `src/episodes/index.ts`
  registers them (one composition each, via `src/Root.tsx`).
- `src/fonts.ts`, `src/theme.ts` (easings, size, fps), `src/components.tsx` (film grain).
- `public/` — `art/` (paintings and archive images + `SOURCES.md`), `guide/` (the character's cut-outs, bubble, paper),
  `music/`, `sfx/v2` … `v4` (sound palette + `SOURCES.md`), `voice/` (generated narration + word timings).
- `scripts/` — `new-episode.mjs` (scaffold), `grid.py` (measure coordinates), `voiceover-placeholder.mjs` (free
  voice), `voiceover-gemini.py` (the real voice), `check-voice.py` (verify its cuts), `review.py` (sheets, strips,
  audio report), `master.sh` (final render + -14 LUFS master), `guide-assets.py` (cut the character from its
  sheets), `sfx-curate.sh` / `sfx.mjs` (sound palette), `refs.sh` (re-clone outside references).

## Commands (from the repo root, Node 22: `source ~/.nvm/nvm.sh && nvm use 22`)

```bash
npm run dev                                                  # Remotion Studio
node scripts/new-episode.mjs GuideMonaLisa public/art/mona-lisa.jpg   # new episode, plays at once
uv run scripts/grid.py public/art/<img>.jpg 0.4 0.5 0.6 0.7  # coordinates → out/grid.png
node scripts/voiceover-placeholder.mjs <Ep>                  # free voice to build the edit
uv run scripts/voiceover-gemini.py <Ep> --tempo 1.06         # the Guide's voice (~$0.03 a take, cached)
uv run scripts/check-voice.py <Ep>                           # every line's first/last words vs the script
uv run scripts/review.py sheet <Ep> --every 1.5              # labelled contact sheet
uv run scripts/review.py strip <Ep> --from 12.2 --to 12.8    # every frame of a move, full size
bash scripts/master.sh <Ep>                                  # out/<ep>.mp4, -14 LUFS, audio report
npm run lint                                                 # eslint + tsc
```

## Rules that bite

- **Never judge from code. Render and look** (sheet → strips → crops), and listen. A change is not done until it
  was seen in a frame and heard in a render.
- **Frames are pure functions of time.** No state between frames, no `Math.random()`, no CSS transitions.
- **Facts are checked** against the museum's page and Wikipedia; sources in the episode file's header comment.
- **Paid generation is rare and cached**: the voice once per script version (`cache/gemini/`), never re-rolled
  silently. The user watches the API bill.
- Images and sounds: any source the episode needs (the user owns the rights call; don't raise copyright), each
  recorded in the folder's `SOURCES.md` so we know where it came from.
- Ask before adding an effect the user hasn't seen: test it on one beat, show a strip, record the verdict in
  `bible/art-direction.md`.

## Folders copied from the app (Animart.AI)

This repo was split out of the app repo on 2026-10-22. These are snapshots; the app keeps the originals:

- `docs/design-handoff/` — the app's design handoff. The Guide's character sheet is `design/07_MASCOT.md`, his
  sheets `visuel/sheets/` (cut by `scripts/guide-assets.py`), drawn assets `design/assets/`, the brand in
  `design/01_DESIGN_DIRECTION.md` and `design/02_DESIGN_SYSTEM.md`.
- `library/app-guide/` — the app's paper bubbles, badges and textures (`frontend/public/guide/`).
- `library/paintings/`, `library/soundbank/` — the app's painting images and music/texture bank (`data/`).
- The Guide's voice must stay the app's voice: same `GUIDE_VOICE_ID_GEMINI` in `.env`; the style prompt is in
  `scripts/voiceover-gemini.py`. If the app changes its voice, update both.

`examples/` holds compressed copies of the finished episodes (`out/` is git-ignored); after a new episode is
signed off, add its preview there (`ffmpeg -i out/<ep>.mp4 -c:v libx264 -crf 27 -preset slow -c:a aac -b:a 128k
-movflags +faststart examples/<ep>.mp4`).

## How the user judges a video

- **Cost-conscious**: paid voice once per approved script, never spend on an unvalidated text.
- Hates anything that looks or sounds "AI": sparkles, glows, chimes, a choppy or mood-shifting voice, gimmicks that
  don't serve the story. Prefers hand-made looks (pencil, paper) and natural pacing without dead air.
- **The text matters most**: most iterations were about sentences that were vague, false or meaningless to a cold
  viewer. Show the script before building anything.
- Wants emotion: interpretations of a painting are told with conviction and may round the corners; only hard facts
  must be true. A reveal must change the reading, not be trivia.
- "Refais" means from scratch, not patching. When unsure what they mean, propose options before changing.
- Wants ambitious motion design, but each effect gets their verdict: test it on one beat, show it, then keep or drop.
- Never raise copyright or licensing: use whatever source serves the video, record where it came from in `SOURCES.md`.
