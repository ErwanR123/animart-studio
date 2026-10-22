# Art direction

**One sentence:** a real masterpiece in its real room, explored by a little painted man who points, writes on it
in pencil and tapes notes next to it, while the camera climbs from face to face.

Everything on screen is either **the painting** (a real photo or scan of it, untouched) or **made by hand** (pencil
lines, handwriting, torn paper, the Guide). Nothing should look like a software default.

## Palette (engine constants in `src/guide/engine.tsx`)

| role | value | use |
|---|---|---|
| wall | `#151A14` | the room behind the painting (warm green-black, never pure black) |
| cream | `#F4EBDD` | pencil lines, handwritten labels, paper |
| ink | `#20251F` | text on paper (bubble, notes, tags) |
| gold | `#E8C66A` | figure names under a spotlight, the title's second line, frames — one accent per beat |

No pure white, no pure black, no saturated digital colours, no gradients as backgrounds.

## Type (`src/fonts.ts`)

- **IM Fell English** (old printed book): the title, once; italic second line in gold.
- **IM Fell English SC**: the header line and the wall names in the room tour, tracked.
- **Caveat** (the app's handwriting): the bubble, names, notes, arrow labels — everything the Guide says or writes.
- Never a UI sans-serif in the picture.

## Effects: approved in the pilot (use these)

| effect | config key | look | the user's verdict |
|---|---|---|---|
| room tour in 3D | `room` | real walls of the room, wide lens, wall names in gold small caps | "trop stylé"; keep the list spoken while the walls turn |
| class photo | `tags` | name tags on every figure, real names only | yes (no "?" tags) |
| camera climb | `climb`, `view` | full-screen frame, eased travel; big zooms keep the target pinned | yes |
| pencil loop | `glow` | a cream hand-drawn loop drawn on around a book / a hand | preferred over any glow ("effet fait main") |
| pencil arrow | `arrows` | curved cream stroke + two barbs + handwritten label | yes (labels say the thing shown: "le ciel", "la terre") |
| paper note | `notes` | torn paper strip + tape, Caveat ink | yes |
| spotlight | `spots` | the rest of the painting dims, the name in gold Caveat | yes |
| question marks | `questions` | hand-drawn "?" drifting up (Socrates) | yes |
| tears + colour drain | `tear` | glossy drops from both eyes, every 0.4 s, wet trails; the world around goes grey, the figure keeps its colour | yes, once big enough to see on a phone |
| light on the sky | `shine` | soft light swelling over a region on the key word | yes ("le ciel") |
| a related artwork | `picture` | a small framed print with a caption | yes, if it lands on its word and stays ≥ 2 s |
| whip-pan + side by side | `turn` | the facing wall slides in, then both frescoes as framed cards with labels | yes |
| loop to the opening | `loop` | the last frame is the first frame | yes |
| wink | `wink` | a painted lid closes once (painting space) | yes, without sparkle or sound |
| Vox collage (to judge) | `collage` + `figure` | the frame becomes kraft paper, torn prints, halftone cut-outs with a white rim, yellow tape labels, a red stamp, red pencil marks, landing one by one with rack focus and parallax; the painted figure stays in front | asked for after *sanji.chien*'s Vox-style reel (inspiration/); first used on *Homecoming*'s war beat |
| Painting as collage (to judge) | `collage` with cut-outs of the painting | the painting's own figures cut out in colour (rembg) and pinned on kraft, pencil circle and arrow between them | *Alexander* d2, the finger to the collapsed soldier |
| Colour wave (to judge) | `freeze.spread` | after a grey freeze, the colour comes back as a wave from one figure through the others instead of everywhere at once | *Alexander*: "comme si chacun avait bu", from Alexander through his men |
| Pour (to judge) | `pour` | a stream of water from a vessel's lip to the ground, thinning into drops, splashing, its stain soaking in; drawn over the freeze so the water alone keeps its colour | *Alexander* d3, "verse l'eau dans le sable" (replaced a trickle of tear drops the user found weak) |
| Blood-red sky (to judge) | `shine.tint` | a colour multiplied over a region on its word, deepening it instead of lighting it | *Le Cri* d0, "rouge sang" |
| Sound rings (to judge) | `ripples` | wobbly cream pencil rings one after another, spreading out from a point or (`inward`) closing in on it | *Le Cri*: the cry crossing the landscape (d2), then closing in on his head as he covers his ears (d3) |
| Undulating painting (to judge) | `wave` + `keep` | the painting's columns slide up and down in a travelling wave while one cut-out figure stays still | *Le Cri* d4, "tout ondule autour de lui" |

## Effects: tried in the pilot and rejected (don't bring back)

- **A document the narration never mentions** (the V-mail letter on the mother, *Homecoming*): "ça sert à rien", and it hid her face. Every picture must be named by the voice and never cover the figure being talked about.
- **A zoom that crops the painting's edges at the start** (*Homecoming*: the girl on the far left was cut): the opening shows the whole painting, full width (`openView`).
- **Arrows ending on a figure** (on his head): they stop on an ellipse round him (`rays.to.rx/ry`).

- **The magnifying glass travelling over details** ("les animations avec la loupe sont claquées"). The engine no
  longer has it; the Guide's loupe bust remains in `public/guide/` for a future idea.
- **Figures lifting off the painting** (SAM cut-outs with a shadow): "c'est nul".
- **Gold glow rectangles/rings around objects** and **gold arrows**: replaced by pencil loops and arrows.
- **Sun rays / shadow sweep** (Diogenes), **light on the ground** (Aristotle): "nul".
- **Sparkles, glints, lens flares**, the wink's sparkle and "cling": "immonde".
- A **CTA end card**, numbered chapter headings, casting cards: cut for a cleaner, shorter video.

## Banned (what makes a video look generated)

- sparkles, twinkles, ✦ stars, lens flares, glow halos, "magic dust" particles, neon outlines
- constant zoom-pulse / shake / bounce; motion with no reason; every element with the same ease and duration
- text typing itself letter by letter; captions repeating the voice in big type; emoji
- glassmorphism, bevels, drop shadows on text
- the same transition at every seam; a whoosh on every move
- AI-generated paintings: the artworks are always real photos or scans of them

## Motion

- **Slow in, slow out** on every move (`easeInOut` / `easeOut` in `src/theme.ts`).
- **Draw-on, don't pop**: pencil lines draw on in ~0.45 s; paper lands with a small overshoot and flutter.
- **Holds are part of the motion**: after a reveal, nothing moves but the slow drift for ≥ 1 s.
- **Vary**: hand-drawn loops are seeded per mark (`loopPath`), never twins.
