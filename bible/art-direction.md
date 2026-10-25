# Art direction

**One sentence:** a real masterpiece explored by a little painted man who tells its story from the bottom of the
frame, while above him the painting and paper collages of its time take turns, cut and pasted by hand.

Everything on screen is either **real** (the painting, untouched; archives of the time: photos, engravings,
newspapers, letters, maps) or **made by hand** (pencil, handwriting, torn paper, tape, stamps, the Guide). Nothing
should look like a software default or a filter. The user's test: *"est-ce que ça fait IA ?"*

## Collage shots (`shots`, `src/guide/shots.tsx`): the house style

Reference: `docs/inspiration/vox-collage-reel-sanji-chien.mp4` (Vox-style collage). First approved on *Le Cri* (Krakatoa:
"vraiment mieux… j'aime bien la DA"); *Homecoming*'s and *Alexander*'s `collage` beats are the older version of the
same look and stay as they are.

- **Materials**: real archives of the time and cut-outs of the painting itself, prepared with
  `scripts/image-collage.py`: B&W on warm paper, cut-outs with a white scissor rim, prints on torn paper, full pages
  as backgrounds, kraft. On top: yellow tape labels (Playfair Display Black), huge poster numbers (Anton), red
  stamps, red-and-cream stripes, a flat colour disc behind a portrait, red pencil, yellow highlighter on a real line
  of text, an ash `haze` spreading from a point.
- **Composition** (check it as a still before animating, `bible/workflow.md` step 5): the top 1400 px filled edge to
  edge, three to five pieces, one clear subject, labels fully inside the frame (with the camera's push, keep them
  ≥ 120 px from the sides), nothing hidden behind another piece, nothing left over from the previous shot (a stamp
  peeking out from behind a disc, a cross that stays when the photo arrives).
- **Pace**: a shot ~2 s, built word by word; never under 1.5 s.
- **Motion**: pieces land and then stay still. No constant boil, no stop-motion jitter ("ça tremble pour rien"); a
  `shake` only where the story hits (an eruption). Gentle camera (scale ≤ 1.07, pans ≤ 30 px). Calm transitions:
  cut, slide, tear, fade; never back-to-back whip pans ("vomitif").
- **Two clocks**: pieces animate on 12 drawings a second (they land, draw and wipe in steps, like paper shot frame
  by frame) while the camera glides at 30 fps. Built into `shots.tsx`; not a jitter: a piece follows the same path,
  only sampled. Measured on the reference reel: ~280 frames held 2–3 times a minute, against ~70 in *Le Cri*
  (`episode-review.py cadence`).
- **Carry something across the cut** (raccord): the next shot takes up a colour, a shape or an object of the one
  before (the sky of the painting becomes the sky drawn at Chelsea in 1883; the red disc becomes the sun). Write it in
  the storyboard; a cut that drops everything is a deliberate reset, and rare.
- **Name the evidence**: an archive shot gets its `source` line ("Harper's Weekly, 29 sept. 1883"), small, bottom
  left, still. It makes the claim credible without a word in the bubble.
- **Choosing the image** ("des choix pour illustrer qui ne sont pas les bonnes"): each image says what its sentence
  says, true to its time and place. The actual document beats decoration (the 1884 *Science* letter about the red
  sunsets, *Harper's Weekly* of September 1883). No generic stand-ins (the 2004 astronomers are not an 18th-century
  telescope). Show the claim itself ("the ash filled the atmosphere" = a cloud spreading over the world map from the
  volcano, not a line on it). A label adds information, never repeats the bubble.

## Marks on the painting

- **Exact**: every loop measured on `scripts/image-grid.py` (the hands from ear to wrist; the mouth, not the chin).
- **A quoted inscription is shown as it is**, the camera close enough to read it: never re-traced, never rewritten
  in our hand.
- **A map shows one idea**: a route drawn to its end, no marker that the route then runs past.

## Effects: the verdicts

| effect | key | verdict |
|---|---|---|
| collage shots | `shots` (+ `figure: true` to keep the episode's cut-out in front) | **yes**, the house style (rules above) |
| pieces on 12 drawings a second | built into `shots` | yes (*Rue de Paris*) |
| source line on an archive | `source` on a shot | **no**: never shown on screen (the field stays as a note for us; sources go in `SOURCES.md`) |
| slow push while the camera holds on the painting | built into `climb` (`HOLD_PUSH`, +3 % in 5 s, unwound on the loop) | added October 2026 (the picture never freezes: *Le Cri* stood still 13 % of the time, *Rue de Paris* 0 %): verdict pending |
| a figure alone, the world gone | `shots` with `in: "fade"` and the figure's cut-out (`image-collage.py --cut --keep-box`) placed on its painted self | yes (*Le Cri*, "tout se passe dans sa tête") |
| older collage | `collage` (+ `figure`, `tear`, `intro: "rip"`, `outro: "page"`) | yes in *Homecoming* and *Alexander*; new episodes use `shots` |
| the paint flowing round a still figure | `flow` + `depth` (`scripts/image-depth.py`) | **yes**: "je trouvais ça vraiment cool" (*Le Cri*, "tout le tableau vibre") |
| room tour in 3D | `room` | yes, for a fresco in its room (*Athens*): "trop stylé" |
| class photo | `tags` | yes (real names only, no "?" tags) |
| camera climb | `climb`, `view` | yes |
| pencil loop | `glow` | yes, preferred over any glow ("effet fait main") |
| pencil arrow | `arrows` | yes (the label says the thing shown) |
| paper note | `notes` | yes, for a real quote |
| spotlight | `spots` | yes (also to close on one figure at the end) |
| question marks | `questions` | yes |
| tears + colour drain | `tear` | yes, once |
| light on the sky | `shine` | yes |
| a related artwork / document | `picture` | yes, if named by the voice and held ≥ 2 s |
| whip-pan + side by side | `turn` | yes (*Athens*) |
| grey freeze, colour back as a wave | `freeze` (+ `spread`) | yes; the music dips under it, and stops only if a `heart` takes over |
| pour | `pour` | yes (*Alexander*) |
| paper puppets cut limb by limb from an archive: diggers swinging a pickaxe, a stone-breaker at his heap, a rat | `rig` (`src/guide/rigs.tsx`, `scripts/rig-cut.py`) | **yes**: "les personnages qui se penchent, qui donnent des coups" (*Rue de Paris*); a blow always lands on something (a house losing a piece per blow, a block cracking), never in the air |
| drawn scenery in flat cut paper: a Haussmann facade floor by floor, a bucket emptied from a window, flies, a barricade, building-site ground and scaffolding, fire | `facade`, `pour` (number), `flies`, `barricade`, `ground`, `scaffold`, `flames` (`src/guide/scenery.tsx`) | yes (*Rue de Paris*) |
| a piece pulled out of the picture while the rest goes into shadow (a floor of the building on its word) | `lift` (+ `hold`, `front`) | yes (*Rue de Paris*) |
| a brass loupe searching the painting in the hook, landing on the subject on its word | `search` (episode config) | yes (*Rue de Paris*) |
| a piece falling, pushed out of the frame, a floor lowered by a crane | `fall`, `exit`, `enter: "crane"` | yes (*Rue de Paris*) |
| the loop | `loop` | yes, always |
| wink, photo into painting, faces on a figure | `wink`, `flashes`, `portraits` | in the engine, not used since the pilot: test before reuse |

## Kit in the engine, verdicts pending

Built October 2026; what survived the clean-up against `bible/vox.md` (the effects lab `GuideLab` is gone). Test one
on a beat and show it before it goes into an episode.

| what | key | verdict |
|---|---|---|
| landings: pop with overshoot, toss with a turn | `enter: "pop" \| "toss"` | pending |
| punch zoom between shots | `in: "zoom"` | pending |
| photo treatments: offset flat silhouette (the Vox sticker), duotones, pose jump, another image inside a cut-out, gilt frame | `edge`, `tone`, `swap` + `hold`, `fill`, `gilt` | pending |
| magnifying glass gliding over a map or a page | `loupe` | pending |
| hand-drawn marks (Rough.js): marker loop, curved arrow, wavy or double underline, big X, curly bracket | `scribble`, `arrow`, `underline`, `cross`, `bracket` | pending |
| desk objects: washi tape, push pin, paper clip | `washi`, `pin`, `clip` | pending |
| period paper: postage stamp, luggage tag, ticket stub, press clipping, polaroid, typewritten sheet, censor bar, film strip | `postage`, `label`, `ticket`, `clipping`, `polaroid`, `typed`, `redact`, `filmstrip` | pending |
| halftone disc | `halftone` | pending |
| counter, hand-made bar chart, route with a marker, spotlight, handwritten letter | `counter`, `bars`, `route`, `spot`, `letter` (`src/guide/graphics.tsx`) | pending |
| paper grounds: graph, lined, newsprint | `paper` | pending |
| the camera flying through the collage | `cam: { to: [0, 0, 2.6] }` | pending |
| a strip drifting sideways | `move: "drift"` | pending |
| document with its real text, phrase highlighted on its word, the rest dimming | `doc` (+ `mark`, `cue`, `face`, `paper`) | pending (GuideVox 7, *Rue de Paris* d0) |
| flat map from OpenStreetMap: land, river, boulevards drawing on from a word, pins | `map` (+ `routes`, `pins`, `labels`, `cue`), `scripts/map-osm.py` | pending (GuideVox 8, *Rue de Paris* d0) |
| torn paper foreground band; subjects rising from behind it | `fore`, `enter: "rise"` | pending (GuideVox 9, *Rue de Paris* context) |
| camera-blur cut; zoom-through into a point | `in: "blur"`; `in: "zoom"` + `into` | pending (GuideVox 7–8) |
| real paper scans under the colour fields | `field` `paper` (`art/paper/crumpled.jpg`, `cardboard`, `dark`, `parchment`, `graph`) | pending |
| episode palette | `palette` in the config | pending |

Removed October 2026 as out of register ("parti en cacahuète"): the ways in ink, mosaic, iris, portal, card flip, word
mask, lunge at the lens, page turn, split, blinds, print dots, brush; spinning sunrays, starbursts, concentric rings,
confetti scraps, ink splats, pulsing asterisks, poster kinetic words, two-colour and blueprint and dot grounds,
step-repeat echoes, the photocopier; pendulum, hop, spin and pulse motions. Don't bring them back.

## The Vox paper register (`GuideVox`, `src/lab/GuideVox.tsx`, `src/guide/voxkit.tsx`): verdict pending

October 2026, after the user found the lab "pas dans le bon registre": rebuilt from the reference reel
(`docs/inspiration/`) and refs/vox-style-video's study of 120 Vox thumbnails (`style/collage-motion/14-vox-collage.md`).
What a Vox paper shot is:

- **one flat colour field** per shot (`field`, paper fibre + a halftone sweep from one corner, optional disc), the
  colour changing from shot to shot (cream, red, blue, yellow, ochre);
- **the subject as a dense cluster in the middle**: the person's photo, a second version of them (a caricature, another
  portrait), the people around them, the monument of their place drawn in ink behind (an engraving with the paper
  keyed out: `opera-ink.png`), one object of theirs (a stamp, a book), and **their name on a torn scrap of graph
  paper** (`name`: heavy grotesque, Libre Franklin);
- **cut-out letters** (`letters`), each on its own torn chip, slapping in one per drawing; words never break;
- **2–4 small paper-stencil scraps** (`stencil`: zigzag, triangle, dot, half-disc, bar, star), never on the subject;
- **evidence ephemera**, small and scattered: number tags in black boxes (`tag`), a round date postmark (`postmark`),
  red X marks joined by a thread (`thread`), tick boxes (`ticks`), a vertical number strip (`strip`), giant pale
  numerals behind (`ghost`), a torn scrap of patterned paper (`motif`);
- **people act like paper puppets** on the 12 fps clock: the head nods and turns while they talk (`neck` + `talk`, the
  head fading into the body across the neck, so no seam), they cross the shot step by step (`walk`), turn round
  through edge-on (`turn`), breathe (`breathe`);
- **plain cuts, slides, whips, pushes** between shots; one camera move per shot, a different one from the last.

Pieces: Atget's rag-pickers (`chiffonnier.png`, `charrette.png`, Paris Musées) cut out with the halftone and white rim
of `image-collage.py --cut --tone halftone`.

## Rejected (don't bring back)

- **Effects laid on the painting**: WebGL shockwaves, a 3D camera moving inside the painting, a dive into the dark,
  zoom blur: "ça fait IA" (removed from the engine).
- **Re-tracing the artist's handwriting** (Munch's inscription): not faithful, "c'est de la merde". Zoom on it.
- **Collages built without a still first** (*Homecoming* v2: pieces cut by the edges, a photo hidden at the side,
  the soldier pasted over the photos): "nulle à chier". Storyboard stills, then motion.
- **A cut-paper restyle of the Guide**: "un style complètement différent".
- **A document the narration never mentions** (the V-mail letter on the mother): "ça sert à rien".
- **A zoom that crops the painting at the start**: the opening shows the whole painting.
- **The magnifying glass travelling over details**; figures lifting off the painting with a shadow; gold glow
  rings and gold arrows; sun rays, light on the ground; a CTA end card; chapter headings; casting cards.
- **Sparkles, glints, lens flares, a "cling"**: "immonde".

## Banned (what makes a video look generated)

- sparkles, twinkles, ✦ stars, lens flares, glow halos, particles, neon outlines
- constant zoom-pulse / shake / bounce / jitter; motion with no reason; every element with the same ease
- text typing itself; captions repeating the voice in big type; labels repeating the bubble; emoji
- glassmorphism, bevels, drop shadows on text
- the same transition at every seam; a whoosh on every move
- AI-generated paintings or archives: the artworks and documents are always real scans
- a Guide whose drawing changes from one pose to the next (`bible/character.md`)

## Palette (engine constants in `src/guide/engine.tsx`, `src/guide/shots.tsx`)

| role | value | use |
|---|---|---|
| wall | `#151A14` | the room / the Guide's band (warm green-black, never pure black) |
| cream | `#F4EBDD` | pencil lines, handwritten labels, paper |
| ink | `#20251F` | text on paper (bubble, notes, tags) |
| gold | `#E8C66A` | names under a spotlight, the title's second line |
| tape yellow | `#F4C531` | collage labels, highlighter |
| red | `#C0281C` | stamps, strikes, stripes, red pencil |
| sun orange | `#E2602E` | the flat disc behind a portrait |

No pure white, no saturated digital colours, no gradients as backgrounds.

## Type (`src/fonts.ts`)

- **IM Fell English** (old printed book): the title, once; italic second line in gold. **IM Fell English SC**: the
  header line.
- **Caveat** (the app's handwriting): the bubble, names, notes, labels the Guide writes.
- **Playfair Display Black**: tape labels in collages. **Anton**: poster numbers ("1883").
- Never a UI sans-serif in the picture.

## Motion

- **Slow in, slow out** on every move (`easeInOut` / `easeOut` in `src/theme.ts`).
- **Draw-on, don't pop**: pencil lines draw on in ~0.45 s; paper lands with a small overshoot, then holds still.
- **Holds are part of the motion**: after a reveal, nothing moves but the slow push for ≥ 1 s. The camera never fully
  stops (Vox: "the camera is alive"), but it never shakes either.
- **Vary**: hand-drawn loops are seeded per mark, never twins.
