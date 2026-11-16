# Format: "Le Guide"

A video about a painting or an art story, **about 40 s, never a minute**, 9:16, for TikTok, Reels and Shorts. The
viewer leaves knowing **what the work shows, the story behind it, and the answer to the hook**, and the video loops
into its hook so they watch it again.

**What we lose is the first two seconds.** Once people stay, they watch (~60 % retention); 50–70 % swipe before 2 s.
Everything in "The hook" below is a note the user had to give on every video: it is the default now, not a request.

## Two modes

| mode | what moves | references |
|---|---|---|
| **The story (Vox)** | archive collage shots tell what happened around the work: the facts, the people, the places, the dates, the objects; back on the work when the voice points at it | *Banksy* (best so far: 3,000 views on Shorts), *Caravaggio*, *Le Cri* (Krakatoa) |
| **Inside the painting** | the camera travels from detail to detail; each move tells the next part of the story, so the meaning builds up piece by piece (seen whole, the painting says nothing; walked through, it makes sense) | *Athens* (the last version) |

A video may mix them, but pick its main mode with the script.

**The account is about artworks** (the user, 2026-11-03): even a story told in Vox mode is told *through works of
art*. Every beat shows a real painting, print or drawing of that moment (for a story many artists painted, a
different work per beat); archives, maps and paper pieces only frame them. A story with no artworks to show is the
wrong subject.

## The hook (0–3 s): visual and audio

- **Frame 0 = the striking image, full screen** (`cold`): the whole painting covering the screen, the detail that
  matters, or real footage already moving (*Banksy*: the shredding). Never the painting small in its frame, never the
  title, never the Guide: he comes in with the second line.
- **The hook on screen, short and small**: one line of yellow tape, 3–6 words, at the bottom (`y: 1700, size: 54`).
  Big stacked tapes over the image were rejected ("c'est nul"). It says the promise, not the whole sentence.
- **The hook line** teases a fact the video pays off later, one that makes people say "what is he talking about?"
  (*Le Cri*: "Et si ce qui l'angoisse, c'était un volcan à onze mille kilomètres ?", answered by Krakatoa at 25 s).
  ≤ 12 words, ≤ 3.5 s spoken. Not "tout le monde croit que…", not "ce tableau cache un secret".
- **The voice starts on frame 0** and is fast: the hook is played at `--hook-tempo` 1.3, no pause inside it.
- **A hard cut before 2 s**, on the hook's key word, onto the detail it is about, where the teased thing lands as
  a real piece (the Krakatoa engraving on the red sky) with one sound accent.

## The body

| beat | on screen |
|---|---|
| **Context / proof** (line 2) | the Guide comes in; the proof on the painting (pencil loops on the hands) or who / when / where in one collage shot |
| **The story, in order** (3–4 lines) | Vox collage shots or camera moves (the two modes); a new image every ~2 s, built word by word |
| **The answer** (last line) | the payoff of the teaser, one last mark; its last words run straight into the hook |
| **Loop** | `loop: { word, view: OPEN, full: true }`: the camera flies back to frame 0, the frame grows to full screen, the Guide leaves; the last frame is frame 0 |

Cut what repeats: when the story is told, the video ends (*Alexander*: everything after 40 s said the same thing again).

## The signature moment (find it without being asked)

Every video has at least one animation idea nobody else would have, born from its story: *Banksy* the real shredding,
*Le Cri* the ash cloud spreading over the world map and the paint flowing round the still man, the figure leaving his
painting, *Athens* the class photo with name tags, the calendar riffling through the years. Propose one or two with
the script, ambitious and clever, in the paper register (`bible/vox.md`), never a gimmick (`bible/art-direction.md`,
rejected and banned). Add new effects one or two at a time and show them; a stack of gadgets was rejected (*Banksy*
"boosted").

## The frame

| zone | what | rule |
|---|---|---|
| **cold open** | the image covers 1080 × 1920 | the hook tape at the bottom; nothing else |
| **top**, 0 → `CLIMB_H` = 1400 | the images: the painting or a collage shot | everything that is *shown* lives here |
| **bottom** | the Guide (feet at `BASELINE` = 1665, x = `GUIDE_X` 230) and his bubble to his right (≤ 3 lines) | from the context line to the loop |
| platform UI | top ~220 px, bottom ~400 px, right ~140 px from y ≈ 900 | nothing essential there; check with `episode-review.py sheet <Ep> --phone` |

The Guide is **secondary**: the eye belongs to the images (`bible/character.md`).

## Timing: model the viewer

You know what happens because you wrote it; the viewer sees it once, at full speed, sound maybe off.

- **One read at a time**, each ≥ 20 frames. Never start a new effect while the last one is still being read.
- **Hold a shot ~2 s (never under 1.5 s)** and build it word by word rather than cutting.
- **Fast moves, slow meanings.** Camera moves 0.5–0.9 s, eased; what they reveal holds ≥ 1 s.
- **The picture lands on its word** (`word` = the first word of the segment starting with it).
- **No dead air**: pauses inside a line ≤ 0.2 s; a 0.5 s gap is a "moment mou", people swipe.

## On-screen text

The bubble shows the phrase being said (people watch muted). Everything else is **information the voice does not
give**: a name, a date, a place ("27 NOV. 1883", "Kristiania (Oslo)"). A label that repeats the bubble is noise.
Never a paragraph, never text typing itself.

## The check

`uv run scripts/episode-check.py <Ep>` after the voice and after the master: length, hook length, pauses,
vouvoiement, cold open, loop, the cut before 2 s, last frame = frame 0. Nothing goes to the user with a FAIL.
