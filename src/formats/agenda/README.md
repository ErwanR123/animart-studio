# Format « L'Agenda »

A weekly short (9:16, 1080×1920, 30 fps, ~40 s, **with a voice**) on the exhibitions to see in Paris this weekend.
Its job is to show the app's **Explore** tab: every exhibition the video names is in the app, and the ending shows
it on a phone. Posted on **Thursday evening** (a story on Friday). First reel: `reels/agenda1120.ts` (20–22 Nov 2026).
Make a new one with the `/agenda` skill.

## The video

| part | what is on screen | what the voice says |
|---|---|---|
| hook | real photos of the week's venues, hard cuts | « Tu sais pas quoi faire ce week-end ? Bouge pas, j'ai fait le tri dans les expos à Paris. » |
| the promise | two more venue photos | « Et chaque jeudi, je te poste celles de la semaine. » |
| each exhibition (5–6) | 1 to 4 real photos of the place or the works, the label `n/6 · Name` + `Venue · price · until…` in white boxes | one or two short sentences: what it is, and why go |
| call to action | the photo darkens, a phone shows the app's Explore tab: Musées → Expos tapped, « Les expos du moment » scrolling | « Toutes ces expos, et toutes les prochaines, tu les retrouveras dans l'app Animart. Elle sort bientôt : inscris-toi, le lien est en bio. » |

Captions: the voice's words in short chunks (never cut inside a phrase: `GLUE` in `engine.tsx`), at the bottom, in
the platforms' white text boxes.

## Rules the user set (2026-11-17)

- **Design A: real photos + TikTok-native white boxes.** Anything that looks designed (cards, gradients, 3D,
  illustrations) reads as AI or as an ad: « le plus naturel ».
- **Voice: Gemini « Achird », natural speed** (`--tempo 1.0 --hook-tempo 1.0`). The fast versions were rejected.
  The style in the script JSON: a young Parisian sending a voice note to a friend, no announcer tone.
- **The text sounds spoken, not written**: « Tu sais pas », « Bouge pas », tutoiement, short sentences, no
  « incontournable », « plongez ». Read it aloud before voicing it. The user rewrites the script first: show it.
- **Every fact checked the same week** (dates, prices, opening): an exhibition that closed is the worst mistake.
  Sources go in `strategie/journal.md` with the post.
- **The phone screen is rebuilt from the app's code** (`explore.tsx`, from `../Animart/src`), never drawn.
- Text low (bottom 300 px above the frame's bottom), nothing under the right column of buttons.

## Files

| file | what |
|---|---|
| `src/episodes/<Id>.script.json` | the voice script: `voice` (Achird), `style`, `segments` `{id, text}` (hook, weekly, one per exhibition, cta) |
| `public/voice/<Id>.mp3` + `.json` | the voice and its word timings, made by `scripts/voice-gemini.py` |
| `reels/<id>.ts` | the visuals per segment: `images` (`src` under `public/`, `pos`, `at` = the word the cut lands on), `label`, `phone: true` on the cta; `display` (« trois cents » → 300 in captions); `explore` (the phone's list); `credits` |
| `public/art/agenda/` | the venue photos (Wikimedia Commons, CC: credit them in the post) |
| `compositions.tsx` | registers each reel with its voice JSON |

## Make one

```bash
uv run scripts/voice-gemini.py Agenda1127 --tempo 1.0 --hook-tempo 1.0 --cap 0.35   # ~$0.03, cached
uv run scripts/voice-check.py Agenda1127                                             # names and dates heard right
npx remotion still Agenda1127 out/s.png --frame=300 --scale=0.4                      # look at frames
bash scripts/agenda-export.sh Agenda1127                                             # → ~/Desktop/marketing_animart
```

## Le post

`out/<slug>.post.md`, by hand: the caption (« Les expos à voir ce week-end à Paris 📍 … »), the list of the
exhibitions with venue and end date, « Toutes les expos dans l'app : lien de la waitlist en bio », 5 hashtags, and
the photo credits from `credits`.
