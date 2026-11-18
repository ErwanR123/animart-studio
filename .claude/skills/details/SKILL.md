---
name: details
description: Make a « Détails » short (9:16, ~40 s, no voice): one famous painting, 3 to 5 details nobody notices, a camera travelling through the painting, the Animart app ad (scan → story) laid over one detail, and the waitlist call. Use when asked for "4 détails", "les secrets d'un tableau", a new Détails reel, or a content piece that sells the app's waitlist.
---

# New « Détails » reel

Work from the repo root with Node 22. Read `src/formats/details/README.md` (the format and every rule the user set),
then open `src/formats/details/reels/sacre.json`, the reference reel (posted 2026-11-16). **The user sees two
things: the details' texts, then the finished video.**

1. **Pick the painting**: famous enough that the title alone stops the scroll (Louvre, Orsay, Orangerie first: the
   app's museums), large and dense, so several details hold full-screen. Check the museum and room.
2. **Find 4 details** (3 to 5) that are true, visible and surprising: a person who was not there, a hidden object,
   a price, a scandal, a trick of the painter. Sources: the museum's page, `../Animart/content/selection/*-texts/`
   (the app's texts, not reviewed yet: verify), Wikipedia FR/EN, napoleon.org-type references. Every fact gets a
   line in `sources`. Order them so a strong one opens and the strongest closes (it answers the hook); the ad follows it.
3. **Write the texts** (Gen Z, tutoiement, no AI tells such as « fascinant », « plongeons »): `title` ≤ 10 words, the
   surprise; `text` ≤ 25 words, why. **Show them to the user and wait for a go.**
4. **The image** at full resolution in `public/art/<slug>/` (`uv run scripts/image-find.py get "<Commons file>"`),
   its size in `imageSize`, its source in `imageSource`.
5. **Coordinates**: `uv run scripts/image-grid.py public/art/<slug>/<img>.jpg` → `cx`, `cy` of each detail; `wf`
   from 0.1 (a face, a crown) to 0.25 (a group). Check each with a still at the dwell's frame.
6. **The ad**: after the 2nd detail (`afterDetail: 2`, the Radeau's structure, best follows: see README), the ending is the follow screen; the work's `palette` (ground = a mid tone of the painting, deep =
   its darkest, accent = a light warm colour in it), `script` = 8 to 10 lines of the app's presentation that **do not
   reveal the details still to come**.
7. **Post texts**: `post.caption` (« N détails de <œuvre> que presque personne ne remarque au <musée> 👀 »), exactly
   5 `hashtags` (museum, subject, artist, `art`, city), `youtubeTitle`, `youtubeTags`.
8. **Register** the JSON in `src/formats/details/reels/index.ts`; `npx eslint src/formats && npx tsc --noEmit`.
9. **Look**: stills at the hook, each dwell, the ad (camera, story open), the end
   (`npx remotion still <Id> out/s.png --frame=<f> --scale=0.4`). Check: text low and
   readable, nothing under the platform's buttons (right side, top 220 px, bottom 380 px), the detail visible and
   framed, no detail spoiled by the app screen.
10. **Export**: `bash scripts/details-export.sh <Id>` → `out/<slug>.mp4`, `out/<slug>-mobile.mp4` (< 30 MB, to send
    to the phone), `out/<slug>.post.md` (captions for each platform, tags, facts to check). Give the user the files
    and the post text.
11. **After posting**: add the video to `strategie/videos.json` (ig and yt ids, `duration_s`, format `Détails`), run `node --env-file=.env scripts/posthog-videos.mjs`, and add the post's line to `strategie/journal.md`; `/bilan` fills
    its numbers, so the next reels learn from it.
