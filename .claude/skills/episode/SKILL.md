---
name: episode
description: Make a new "Le Guide" educational video about a painting in the style of the GuideAthens pilot, end to end (research, images, script, storyboard, voice, build, review, master). Use when asked for a new episode, a new video about an artwork, or to remake one.
---

# New episode

Work from the repo root with Node 22 (`source ~/.nvm/nvm.sh && nvm use 22`). Read `CLAUDE.md`, then
`bible/format.md`, `bible/script.md`, `bible/art-direction.md`, `bible/sound.md`; open `src/episodes/GuideAthens.tsx`
and its `.script.json` as the worked example. Follow `bible/workflow.md`: each step's check passes before the next.

1. **Research** (museum page + Wikipedia FR/EN). Note which figures are consensual and what each one's pose or
   place in the painting says about who they were (`bible/script.md` rule 2) — that's the material for the script.
2. **Images** from Wikimedia Commons into `public/art/` (the painting ≥ 3000 px; for a fresco in a room, the other
   walls; native-res crops of the faces you'll zoom on) and a line each in `public/art/SOURCES.md`.
3. **Scaffold**: `node scripts/new-episode.mjs Guide<Name> public/art/<img>.jpg`.
4. **Script** in `src/episodes/<Ep>.script.json` following `bible/script.md`. **Show it to the user and wait for a
   go** — most of the pilot's iterations were about the text.
5. **Storyboard**: per beat, camera view, pose, effects (approved list only) and the word each fires on. Show it.
6. **Coordinates** with `uv run scripts/grid.py` (crop + `--mark` to check); free voice with
   `node scripts/voiceover-placeholder.mjs <Ep>`; build the config; `npm run lint`.
7. **Look**: `uv run scripts/review.py sheet <Ep> --every 1.5`; fix; strips on new effects and camera seams (full
   size — the 3D room's black-slab bug doesn't show at 0.4 scale).
8. **Voice, once** (~$0.03): `uv run scripts/voiceover-gemini.py <Ep> --tempo 1.06`, then
   `uv run scripts/check-voice.py <Ep>`. Re-check the sheet (timings moved).
9. **Master**: `bash scripts/master.sh <Ep>` (one render at a time); run `/video-review` on it; fix the worst
   moments; master again.

Report in French to the user: the output path, its length, what you checked, and the decisions you need from them.
When the user gives a note that is a rule (not a one-off), add it to the right bible file.
