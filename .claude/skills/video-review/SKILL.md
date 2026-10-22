---
name: video-review
description: Critically review a rendered or in-progress video of this studio like a first-time viewer (contact sheet, strips, voice cuts, audio report) against the studio bible and the GuideAthens pilot, then fix the worst problems. Use after any render, before calling a video done, or when the user says a video looks generated / "AI slop" / the sound is off.
---

# Video review

From the repo root. Target = a composition id or an `out/*.mp4`.

1. `uv run scripts/review.py sheet <target> --every 1.5` and open the image. For each frame write: where the eye
   is, what a viewer who has never seen the painting understands, and anything wrong.
2. Check against the bible:
   - `bible/script.md`: every bubble makes sense on its own; positions tied to who the figures were; no false or
     uncertain claim; the last beat answers the hook.
   - `bible/format.md`: reads ≥ 20 frames, one at a time; effects land on their word; the bubble sits right of the
     Guide in the dark band, never over the painting; safe zones clear; no dead air.
   - `bible/art-direction.md`: only approved effects, nothing from the rejected or banned lists.
3. Strips (`review.py strip --from --to`, full size, `--crop` on faces) for every camera seam, room move and
   effect flagged in step 1: pops, black slabs, an effect firing before its word, twins.
4. Voice: `uv run scripts/check-voice.py <Ep>` — no clipped first/last word, no long pause.
5. Audio: `uv run scripts/review.py audio <mp4>` → -14 LUFS ±1, true peak ≤ -1 (after `master.sh`). Every accent
   must match what is seen (`bible/sound.md`).
6. Output a ranked list: timestamp · problem · rule it breaks · fix. Fix the top three (or the ones the user picks),
   re-render the affected range, show before/after.

Never declare a fix done without looking at a new image (review.py names every output with a timestamp).
