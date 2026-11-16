---
name: contenu
description: The entry point for any Animart content or marketing work. Use when asked what to post, for a new video, reel, short, carousel or story, for "du contenu", "un post", "une vidéo", a content plan for the week, or when unsure which format or skill fits.
---

# /contenu: what to make next, then make it

Read `CLAUDE.md` (the hub), `strategie/README.md` (goal, accounts, post rules, links) and the last lines of
`strategie/journal.md` (what worked). The goal is waitlist signups, not views.

## 1. Decide what to make

If the user named a piece, go to step 2. Otherwise propose **3 pieces**, each in one line:
account · format · subject · the hook (the first sentence on screen) · why now (journal result, a date, a trend).
Prefer the format with the most signups per post in the journal; an untested format gets at most one slot in three.
Wait for the user's pick.

## 2. Hand over to the format

| piece | do |
|---|---|
| a painting's hidden details, a reel that sells the waitlist | `/details` |
| a painting's story told by the Guide | `/episode` |
| a 30-jours notion | `IDEAS.md` § Nouveau cap, engine `src/keys/` |
| a meme | `/meme-hunt` |
| a format that does not exist yet | propose it (what the viewer gets, the hook, a still), build it only after a yes, in `src/formats/<name>/` with its README, its skill and its export like `details` |

The two human gates hold for every format: **the texts, then the finished video**.

## 3. Post

The export gives `out/<id>.mp4`, a phone copy and `out/<id>.post.md` (one text per platform, the tracked links),
and copies the phone copy and the text to iCloud Drive `Animart à poster/`. Tell the user:
Reels and TikTok from the phone with a trending sound; YouTube Shorts scheduled in Metricool.
Then add the post's line to `strategie/journal.md` (date, id, format, account, platforms), and the video to
`strategie/videos.json` (id, title, format; its platform ids are filled at the next `/bilan`). **The same caption on
every platform** (the export gives it): it is how `/bilan` finds the video on each one.
And mark the post on PostHog's graphs: an annotation `Post : <id> (…)` at the posting time (REST API,
`POST /api/projects/351733/annotations/`, key from `.env` via `node --env-file=.env`), so a spike shows its video.
Our own tests use `?utm_source=test`: PostHog leaves them out of every graph.
