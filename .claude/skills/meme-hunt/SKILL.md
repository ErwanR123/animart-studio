---
name: meme-hunt
description: Find recent, funny, viral French clips (Snapchat compilations, TikTok, YouTube memes and reactions, TV moments) and cut them into the studio's meme bank (public/memes/) for the "30 jours" videos. Use when asked for memes, Snap or TikTok references, trending sounds or reaction clips, or when a script line calls for one.
---

# Meme hunt

The 30-day series (`src/keys/engine.tsx`) cuts short clips into the video (`clips`: full screen or a sticker, with
their own sound) so a notion lands with a laugh. **The clip has to be recent and known to French 15–25-year-olds
right now.** Nothing from the 2000s or 2010s unless it is being re-memed this year. When unsure whether a meme is
current, it is not: ask the user, who knows the Snap culture better than search results.

## 1. What's trending now (web first)

Run these in one turn (WebSearch, `mode: "standard"`, add the current month and year):
- "mèmes du moment" / "tendances TikTok France" / "son TikTok tendance" / "les memes de la semaine";
- French pop-culture news sites that list them (Konbini, Topito, Melty, Numerama, Le HuffPost "tendances", Twitter/X
  recaps), and Know Your Meme filtered to France.

Out of that, write a short list: the meme, its catchphrase or sound, where it started, roughly when. That list is
what you search YouTube for in step 2.

## 2. Find the clip on YouTube (everything gets re-uploaded there)

```bash
uv run scripts/meme-find.py "pires snap" "snap k-sos" "meilleurs tiktok france" --period month    # compilations
uv run scripts/meme-find.py "<catchphrase from step 1>" --period year --short                     # the meme itself
uv run scripts/meme-find.py "https://www.youtube.com/@<channel>/videos" --channel                  # a channel's latest
```

`--period week|month|year` keeps uploads recent and sorts by views; `--short` keeps videos under 4 minutes (easier to
cut). Channels that compile French Snaps and TikToks every week (Ckrémgl Tv "Les pires snap & K-sos", ImDylanOff2 "Les
pires snaps de …", Le Déraciné "Les meilleurs TikTok") are the richest source: one compilation holds ~40 clips.

**TikTok** has no searchable API: it can't be scraped by query. Single TikTok links work everywhere below (yt-dlp
reads them), so the user can paste links. Instagram reels and X videos too.

## 3. Find the moment inside

```bash
uv run scripts/meme-scan.py https://youtu.be/<id>                       # transcript with times + contact sheets
uv run scripts/meme-scan.py https://youtu.be/<id> --grep "wesh,allô"    # only lines with these words
uv run scripts/meme-scan.py <url> --every 1 --from 192 --to 200         # every second of one part, to set the cut
```

Read the transcript for the lines that carry a reaction (shock, cringe, "quoi ?!", hesitation, a punchline), then
look at the sheet to check the picture reads without context in under 2 s: a face, a gesture, a fail.

## 4. Cut it into the bank

```bash
uv run scripts/meme-cut.py https://youtu.be/<id> 3:12.4 3:14.6 choque-quoi --quote "quoi ?!" --tags "choqué,réaction" --crop 9:16 --x 0.5
```

Writes `public/memes/<slug>.mp4` (loudness-matched to the voice) and a row in `public/memes/INDEX.md` (quote, tags,
date found, source). `--crop 9:16` for full-screen use (set `--x` on the face), `--crop none` for a sticker (the
printed `ratio` goes into the clip config). Keep clips 1–2.5 s: one beat, cut on the reaction, not before.

## 5. Use it in an episode

```ts
clips: [{ src: "memes/choque-quoi.mp4", at: "two:trou", from: 0, dur: 1.6, mode: "full" }],
```

Rules that keep it light and not cringe:
- **One or two clips per video**, on the line that calls for them (the shock, the vote, the "toi sur ta photo").
  A clip on every line turns the video into a compilation.
- The clip **answers the line just said** (the viewer's own reaction, or the absurd comparison), never a random gag.
- Full screen clips sit in a gap of the voice or over a short line; the engine ducks the voice (`duck`).
- No clip with real people humiliated, minors in distress, violence, or anything sexual or political; no clip whose
  joke needs knowing the original.
- Check the bank (`public/memes/INDEX.md`) before hunting: reuse a clip that fits, but not in two videos in a row.
- Show the user the clips you picked (path + quote) with the finished video; their verdict on "current or dated" wins,
  write it in the INDEX row's tags (`daté` or `validé`).
