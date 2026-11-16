---
name: episode
description: Make a new "Le Guide" video about a painting in the studio's style, end to end (research, script, storyboard stills, archives, voice, build, review, master). Use when asked for a new episode, a new video about an artwork, or to remake one.
---

# New episode

Work from the repo root with Node 22 (`source ~/.nvm/nvm.sh && nvm use 22`). Read `CLAUDE.md`, then the bible:
`format.md` first (the hook, the two modes, the loop, ~40 s), `script.md`, `vox.md`, `art-direction.md`, `sound.md`.
Open the closest example: `GuideBanksy.tsx` / `GuideCaravaggio.tsx` (a story in Vox collage shots), `GuideScream.tsx`
(the cold open with the teased piece on the cut, collage shots, the full-screen loop), `GuideAthens.tsx` (inside the
painting, each camera move telling the next part). Follow `bible/workflow.md`: each step's check passes before the
next. **The user sees two things: the script, then the finished video.** Everything they asked on every past video
(`bible/format.md`, the hook) is already in the scaffold and the check: never hand over a video they would have to
send back for it.

1. **Research**: museum page, Wikipedia FR/EN, and the story around the painting (diaries, letters, the press of the
   time). Find what in the painting the story rests on, and what moves people.
2. **Script** in `src/episodes/<Ep>.script.json` (`bible/script.md`: vouvoiement, a ≤ 12-word hook teasing a fact
   paid off later, ~40 s, every sentence showable, the last line running into the hook). Show it to the user with
   the mode (Vox story or inside the painting), frame 0 and its tape, and **one or two signature-moment ideas**
   (`bible/format.md`) you found yourself; wait for a go.
3. **The painting** at full museum resolution (`image-find.py get`, or `hires` on a Google Arts & Culture / museum
   viewer page) in `public/art/<ep>/`, scaffold (`node scripts/episode-new.mjs Guide<Name> …`). Pick the **music bed**
   of its time and place (`bible/sound.md`).
4. **Storyboard**: per sentence, what is on top (painting view or collage shot), which archive, which mark, the
   Guide's pose (one per beat), what each shot carries across the cut, the `source` line of each archive. Find the
   archives (`image-find.py`: Commons, `category`, `europeana`, IA), prepare pieces (`image-collage.py`), build each
   collage shot and **show it as a full-size still** (`npx remotion still … --gl=angle`) before animating.
5. **Coordinates** with `scripts/image-grid.py` (`--mark` to check); placeholder voice; build the config; `npm run lint`.
6. **Look**: `episode-review.py sheet <Ep> --every 1.5`, then `--phone`; fix; full-size stills and strips on
   transitions and thin lines.
7. **Voice, once** (~$0.03): `uv run scripts/voice-gemini.py <Ep> --tempo 1.1 --cap 0.2`, then
   `voice-check.py` and `episode-check.py` (the hook is played at `--hook-tempo` 1.3 by default). Re-check the sheet
   (timings moved). A line rewritten later: `--splice <ids>` re-voices only it, the rest keeps its tone.
8. **Master**: `bash scripts/episode-master.sh <Ep>` (one render at a time), `episode-review.py cadence out/<ep>.mp4`,
   `uv run scripts/episode-check.py <Ep>` (no FAIL); `/video-review`; fix the worst; master again. While it renders,
   research and write the next episode's script.

Report in French: the output path, its length, what you checked, what you could not check (motion, sound), and the
decisions you need. Every image goes in `SOURCES.md`. When the user gives a note that is a rule, add it to the
bible; once signed off, add the preview to `examples/`.
