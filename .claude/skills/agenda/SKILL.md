---
name: agenda
description: Make an « Agenda » short (9:16, ~40 s, Gemini voice Achird): the exhibitions to see in Paris this weekend, real venue photos with white text boxes, ending on the app's Explore tab on a phone. Posted every Thursday evening. Use when asked for the Agenda, "les expos de la semaine", "quoi faire ce week-end", or a video that shows the app's Explore tab.
---

# New « Agenda » reel

Work from the repo root with Node 22. Read `src/formats/agenda/README.md` (the format and the user's rules), then
`src/episodes/Agenda1120.script.json` and `src/formats/agenda/reels/agenda1120.ts`, the reference. **The user
sees two things: the script, then the finished video.**

1. **Pick 5 or 6 exhibitions** open this weekend in Paris: a mix of big museums and a surprising or free one; one
   that closes soon. Check each on the venue's own page (dates, price, opening hours). Note every source.
2. **Write the script** in `src/episodes/<Id>.script.json` (`Id` = `Agenda` + month + day of the Thursday, e.g.
   `Agenda1127`): copy the reference's `voice`, `style`, hook, weekly promise and cta; one segment per exhibition,
   one or two spoken sentences each (what it is + why go). Check it against `bible/viral.md`. **Show it to the
   user and wait for a go**: they often rewrite.
3. **Photos**: real photos of each venue or works on show, from Wikimedia Commons (`uv run scripts/image-find.py`),
   in `public/art/agenda/`; note each licence and author for `credits`.
4. **Voice, once** (~$0.03): `uv run scripts/voice-gemini.py <Id> --tempo 1.0 --hook-tempo 1.0 --cap 0.35`, then
   `uv run scripts/voice-check.py <Id>`.
5. **Reel file** `src/formats/agenda/reels/<id>.ts` (images per segment with `at` on the word each cut lands on,
   labels `n/6 · Name` / `Venue · price · until…`, `phone: true` on the cta, `explore` = these exhibitions), and
   register it with its voice JSON in `compositions.tsx`. `npx eslint src/formats && npx tsc --noEmit`.
6. **Look**: stills on every segment and the phone (`npx remotion still <Id> out/s.png --frame=<f> --scale=0.4`):
   no caption cut inside a phrase, labels readable, nothing under the right buttons.
7. **Export**: `bash scripts/agenda-export.sh <Id>`, write `out/<slug>.post.md` (README « Le post »), give the user
   both.
8. **After posting**: add the video to `strategie/videos.json` (format `L'Agenda`) and the sources to
   `strategie/journal.md`; `node --env-file=.env scripts/posthog-videos.mjs`.
