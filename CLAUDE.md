# Animart studio: marketing and distribution hub

Everything that brings people to the Animart app lives here: the strategy, the content formats and the videos they
render, the posts, and the numbers that say what works. The app itself is in `../Animart`. The team (3 people)
writes docs in French; code and comments are in English.

**The goal is waitlist signups (later, installs), not views.** Every piece of content names its account, its target
and its call to action, and every result is logged so the next piece learns from it.

## The loop

1. **Plan**: `/contenu` reads `strategie/` and the journal, proposes what to make next.
2. **Make**: one format per folder; the user sees two things only: the texts, then the finished video.
3. **Post**: the export gives the files and the text of each platform's post, with its tracked link.
4. **Measure**: `/bilan` (weekly) reads the platforms, the site and the waitlist, fills `strategie/journal.md`, and
   says what to make more of.

## Where things are

| path | what |
|---|---|
| [strategie/README.md](strategie/README.md) | the goal, the accounts, the post rules, the funnel and the tools (Metricool, PostHog) |
| [strategie/journal.md](strategie/journal.md) | every post with its numbers and what we learnt |
| `../Animart/docs/STRATEGIE.md` §5–7 | the reference above everything (distribution, channels, content accounts) |
| [IDEAS.md](IDEAS.md) | the idea backlog and the 30-days programme |

Formats (each folder documents its rules; read it before touching the format):

| format | where | skill | state |
|---|---|---|---|
| **Détails**: a painting's hidden details, the app ad, the waitlist call | [src/formats/details/README.md](src/formats/details/README.md) | `/details` | in use (Sacre posted 2026-11-16) |
| **Le Guide**: the mascot tells a painting's story, Vox collages | [bible/README.md](bible/README.md) | `/episode` | 23 episodes, references in `examples/` |
| **30 jours**: one notion a day, stickers | `src/keys/`, `src/lesson/`, `IDEAS.md` § Nouveau cap | — | Jour01–05 |
| **Memes**: art memes from found clips | `scripts/meme-*.py` | `/meme-hunt` | test |

Every composition shows in `npm run dev` (`src/Root.tsx`). Other skills: `/video-review` (watch a render like a
viewer, fix it), the `remotion-*` skills (load `remotion-best-practices` before writing Remotion code).

## Commands (repo root, Node 22: `source ~/.nvm/nvm.sh && nvm use 22`)

```bash
npm run dev                                   # Remotion Studio, every format
npm run lint                                  # eslint + tsc
npx remotion still <Id> out/s.png --frame=300 # one still
bash scripts/details-export.sh <Id>           # a Détails reel ready to post
bash scripts/episode-master.sh <Ep>           # a Guide episode ready to post
```

## Rules for every format

- **Never judge from code. Render and look**, and listen. A change is done when it was seen in a frame.
- **9:16, 1080×1920, 30 fps, ~40 s.** Text sits low, its bottom ~380 px above the frame's bottom (just above the
  account name); nothing in the top 220 px; the right margin stays clear of the platform's buttons.
- **No music or sound effects baked in unless the format says so**: the trending sound is added when posting
  (exports carry a silent track so the platform's mixer keeps both).
- **The app is not out: the call is the waitlist** (« lien de la waitlist en bio »), never « l'app en bio ».
- **App screens are rebuilt from the app's code** (`../Animart/src`), never drawn from memory.
- **Facts are checked** and listed in the piece's sources. Affirmative tone, no conditional.
- **Frames are pure functions of time**: no state, no `Math.random()`, no CSS transitions.
- **Paid generation is rare and cached** (`cache/`, git-ignored). The user watches the API bill.
- **Anything written by AI is read by a human before it goes live.**
- Never raise copyright or licensing; record each source in its folder's `SOURCES.md`.

## How the user judges content

- **The text matters most**: vague, false or meaningless sentences get rewritten. Show the texts before building.
- Hates anything that looks or sounds "AI": overloaded frames, filters on the painting, sparkles, glows, chimes,
  sound effects, mock-ups that don't match the app.
- Wants time to read, a fast first shot, calm camera moves, few shots.
- "Refais" means from scratch. When unsure what they mean, propose options before changing.

## Secrets

Keys live in `.env` (git-ignored, model in `.env.example`). Never read it: load it with `node --env-file=.env` or
`uv run --env-file .env` and print only booleans. Never ask anyone to paste a key in chat. Ask before pushing `main`.
