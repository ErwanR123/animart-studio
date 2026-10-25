# Format: "Le Guide"

One painting, one question, 55–70 s, 9:16. The viewer leaves knowing **what the painting shows, the story behind
it, and the answer to the question**, and the video loops back to the question so they watch again.

The four episodes in `examples/` are the references: *Athens* (the pilot: room in 3D, class photo, figures),
*Homecoming* (a story told on one painting: the war behind the soldier), *Alexander* (an anecdote: collages of the
context, then the scene), *Le Cri* (a reading: the painting, then archive collages that travel in time).

## The frame: always the same two parts

| zone | what | rule |
|---|---|---|
| **top**, 0 → `CLIMB_H` = 1400 | **the images**: the painting (camera climbing from detail to detail) or a collage shot | everything that is *shown* lives here; it changes, the bottom doesn't |
| **bottom** | **the Guide** (feet at `BASELINE` = 1665, x = `GUIDE_X` 230) and his **bubble** to his right (top 1385, x 415 → 975, Caveat, ≤ 3 lines) | always there, always the same place: he tells, the images travel |
| platform UI | top ~220 px, bottom ~400 px, right ~140 px from y ≈ 900 | nothing essential; labels stay left of x ≈ 940. Check with `episode-review.py sheet <Ep> --phone` (the zones drawn over each frame at phone size). The bubble's text ends at x ≈ 930 and y ≈ 1550; only its paper edge passes under the buttons |

The user's words: *"on a le guide qui nous parle, qui nous explique les choses, et on voit les images défiler."* The
Guide is **secondary**: the eye belongs to the images (`bible/character.md`).

## Structure (a default, not a cage)

| beat | segment | on screen |
|---|---|---|
| **Hook** | `hook` | the whole painting full width (`openView`), the title rising once (gone when the hook ends); one mark on the key word (a pencil loop, a label crossed out) |
| **Context** | `context` | who / when / where: a collage shot or two (the artist, the date, the place), or the room in 3D for a fresco |
| **Story beats** ×4–6 | `d0…` | alternate **the painting** (when the voice points at something in it: `view` + loops, spots, notes) and **collage shots** (when the voice tells what is around it: the time, the place, the cause) |
| **Answer** | last `d` | back on the whole painting; the answer said over it; one last mark (a spotlight closing on the one who matters) |
| **Loop** | end | the last frame is the first (`loop`): the hook starts again |

## Timing: model the viewer (the rule that fails most)

You know what happens because you wrote it; the viewer sees it once, at full speed, sound maybe off.

- **Write the reads.** For every beat, list what the viewer must understand, in order. Each read needs ≥ 20 frames.
- **One read at a time.** Never start a new effect while the last one is still being read.
- **Hold a shot ~2 s (never under 1.5 s)** and build it word by word (pieces landing on their words) rather than
  cutting. A new image every second was "vomitif"; 7 shots in 13 s was right.
- **Fast moves, slow meanings.** Camera moves are 0.5–0.9 s, eased; what they reveal holds ≥ 1 s.
- **The picture lands on its word** (`word` = the first word of the segment starting with it).
- **No dead air**, but room to breathe where it counts: pauses inside a line ≤ 0.2 s, a longer breath only on the
  final line (`bible/sound.md`). A 0.5 s gap is a "moment mou"; people swipe.

## On-screen text

The bubble shows the phrase being said (people watch muted). Everything else is **information the voice does not
give**: a name, a date, a place, a source ("27 NOV. 1883", "Kristiania (Oslo)", "ARRIEN, ANABASE VI, 26"). A label
that only repeats the bubble ("CENDRES" over "rempli l'atmosphère de cendres") is noise: cut it. Never a paragraph,
never a "?" tag, never text typing itself.
