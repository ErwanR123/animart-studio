# The Vox rules

What makes a shot read as Vox, as rules the engine follows and a reviewer can check. Built October 2026 after two
effect labs drifted into generic motion design ("parti en cacahuète"). Sources, in order of weight:

- **Vox's own people**: art director Joey Sendaydiego (Storybench, 2024), Estelle Caswell on Earworm (School of
  Motion podcast), Jackie Lay / John McColgan on *Explained*.
- **Our own measurements of real Vox videos** (section 12, `refs/vox-real/`): they win over everything below.
- **Measurements**: refs/vox-style-video (`style/collage-motion/`: 8 collage reels measured frame by frame, 5 Vox
  videos, 120 Vox thumbnails, files 00, 05, 06, 13, 14), our reference reel `docs/inspiration/` (sanji.chien).
- **Tutorials and skills**: PremiumBeat "5 breakdowns on the Vox look" (2021), refs/vox-editorial
  (`visual-system.md`, `scene-patterns.md`), the vox-animation skill (Downloads, read only), Kapwing / Easy-Peasy guides.

Where this file and `art-direction.md` disagree, this file wins for collage shots; `art-direction.md` keeps the
painting views, the Guide and the verdicts.

## 1. Priorities

1. **Story first, then evidence, then design.** "My job wasn't to decorate a video. My job was to tell a story"
   (Caswell); animation is "number nine on the list". A move that carries no information is cut.
2. **Every shot shows a piece of evidence and names its source** (a photo, a document, a map, a number, a quote):
   the `source` line. Decorative props only on shots that claim nothing.
3. **One visual anchor per video**, chosen for the story and coming back in every run (Sendaydiego: construction paper
   for one video, protest posters for another). For us: the painting, plus one object of the story (the 1868 map in
   *Rue de Paris*).
4. **Not too perfect**: "you don't want it to look perfect, it looks like an ad" (Sendaydiego). Hand-cut edges, tape,
   paper, a tilt. Never glossy, never 3D, never generated "archives".

## 2. The shots (boards)

| shot | for | must have |
|---|---|---|
| **cluster** | a person or a place | the subject in the middle, a second version of them (another portrait, a caricature), the people round them, the monument of their place in ink behind, one object of theirs, their **name on a torn scrap of graph paper** |
| **archival print** | a photo, an engraving, a painting quoted | cream border, ±1–3° tilt, slow push 1.00 → 1.06, source line |
| **document** | a text, a law, a newspaper | the page at 75–85 % of the shot height; push ×1.4–3 onto the passage; the rest dims; a yellow highlighter sweeps the phrase as the voice says it (`doc` + `mark` + `cue`; real text only) |
| **map** | "where" | flat land and water, our own labels, a route drawn on, pins landing; borders only from a dated source (`map` + `routes` + `pins`, data from `scripts/map-osm.py`) |
| **number** | a figure | the number big (poster face), counting to its word or slapping in, its unit on tape, the source |
| **headline** | the hook or the line that matters | cut-out letters or yellow tape boxes, black text, tilted, stacked |
| **then / now** | the same place in two times | the two images in the same geometry, a dissolve (the only one allowed) |

The painting is our anchor shot: views on it follow `art-direction.md`.

## 3. Composition (9:16, the collage takes the top 1080 × 1400, the Guide the bottom)

- **One focal point per shot.** The subject in the middle third, big enough to read at phone size (≥ 40 % of the shot
  width for a person).
- **Back to front, every shot**: colour field or paper → (monument in ink, disc) → subjects → labels and marks →
  a **foreground** that crops the subject (a torn paper band, a facade, a crowd), the layer that makes depth
  (`fore: "bottom"`, drawn last; subjects `enter: "rise"` from behind it).
- **Leave paper showing** in explainer shots (30–60 % of the frame plain field or page). Dense shots are allowed for a
  cluster, but one new focal piece at a time.
- **2–4 small scraps per shot** (stencil shapes, number tags, a postmark, ticks), round the subject, never on it.
- Nothing that matters under the TikTok/Reels buttons (`episode-review.py sheet --phone`); text at least 1.9 % of the
  frame height (≈ 36 px).

## 4. Colour

- **A palette per video, locked before the first shot**: one paper, one ink, **one saturated accent**, the yellow
  highlighter. Field colours may change shot to shot within that palette. In the config: `palette` (roles `paper`,
  `ink`, `accent`, `hl`, and field names); pieces name their colours, so they all follow. Real paper under the
  colour: `field` + `paper: "art/paper/crumpled.jpg"`.
- **Exactly one saturated accent per frame.** A second hot colour only for the payoff, or tiny.
- **Photos are treated**: greyscale with lifted contrast, newsprint halftone, or a duotone in the paper's own hue.
  Evidence under analysis keeps its tonality (one uniform contrast change at most).
- Cut-out people get the white torn rim (`image-collage.py --cut`), optionally an offset flat silhouette in the accent
  (`edge`). Drop shadows only under paper props, soft, down and right.
- No gradients on objects, no glow, no light leak, no chromatic aberration, no lens flare.

## 5. Type

- **One font per text element**, a fixed role per font for the whole video:
  heavy grotesque (Libre Franklin 800–900) for names, cut-out letters, tags;
  black serif on yellow tape (Playfair 900) for headlines; poster condensed (Anton) for big numbers;
  old serif small caps (IM Fell SC) for source lines; typewriter (Special Elite) for typed documents; Caveat for the
  Guide's own handwriting.
- **Text never overshoots and never fades in as a paragraph.** It arrives as physical pieces: per letter on its chip
  (2 frames a letter), per word (every 3–4 frames), as a tape that slaps, or typed per glyph (no cursor).
- Reading time: `max(2 s, words / 3 + 1 s)` on screen.

## 6. Motion

- **Two clocks.** Pieces on **12 drawings a second** (holds of 3, 2, 3, 2 frames at 30 fps); the camera smooth at 30.
  Grain and paper re-rolls ride the pieces' clock.
- **Entrances, 3–8 drawings (0.25–0.7 s)**, hard stop or ease out:
  props pop to +15–28 % and settle (`pop`); stamps slap 1.42 → 1.12 → 0.96 → 1; pieces drop or slide from off the
  page; subjects **rise from behind the foreground**. Lines, underlines, routes, charts, signatures **draw on**.
- **Stagger: never two landings on the same frame.** Foreground first, then subjects 0.3–0.5 s apart, the label last.
  Narrated shots: each piece on its word.
- **Landed pieces stay still.** No boil on photos (the user: "ça tremble pour rien"); no idle spin, pulse or wobble.
- **One loud thing at a time**; something lands about every 0.5–0.8 s in a build, an impact about every 3 s.

## 7. People (paper puppets)

- A cut-out person moves **like paper**, in held poses on the 12 fps clock, never warped or puppet-pinned (that reads
  as AI): the head nods and turns while they speak (`neck` + `talk`); they cross the shot in steps with a hop and a
  tilt (`walk`); they turn round through edge-on (`turn`); a pose jumps to another photo of them (`swap`).
- They enter by rising from behind something, dropping in, or walking in from the edge.
- Nobody speaks on screen with a moving mouth (no lip sync); dialogue goes on tape next to them.

## 8. Camera

- **Alive on holds**: a slow push of 2–5 % per 5 s, linear (built in: shot `cam`, and `HOLD_PUSH` on the painting).
  Exception, measured on Vox: while marks draw on an image under analysis (circles, a traced shape), the camera holds
  still; the drawing is the motion.
- **One move per shot, a different one from the previous shot**: push in → pan → pull out → tilt → push in → near
  static for the payoff.
- Energy goes into the cuts: a whip out and settle in, or a push that snaps (×1.065 then ×1.4 over the last
  5 frames) before a hard cut. A zoom-through (×3–5 over 18–24 frames into a detail, cut on the last frame) to dive
  into a document or a face.
- Depth: near layers move more than far ones (parallax by `z`); a multiplane push can fly through the near layers.
- Never handheld shake. A single jolt only where the story hits (an explosion, a demolition).

## 9. Cuts and transitions

- **Hard cut between arguments** is the default ("in storytelling, transitions mean nothing").
- Allowed moves: **whip pan**, **push** (the previous shot rushes past), **slide** (a new sheet laid over), **tear**
  (the page rips in), **camera blur** (`in: "blur"`, the fake one-shot: motion blur peaking on the cut),
  **zoom-through** (`in: "zoom"` + `into`: ×4 into a point of the previous shot, cut on the last frame), **dissolve
  only between two states of the same picture** (then/now, a map across years).
- Not Vox, out of the engine: portal, iris, mosaic, word mask, card flip, page turn, split, blinds, dot screen, brush
  wipe, ink blackout, lunge at the lens, glitch.

## 10. Rhythm and sound

- In collage runs a new composition every 1.5–3 s; evidence held 3–6 s with a push; the painting between runs.
- Cut on the voice (word timings) and on the music's beats; the music may drop out under a reveal.
- Paper accents land on the frame a piece lands (cue 0.03 s before contact), quiet (about −22 dB under the voice):
  paper, tape, stamp thud, pencil, marker, page, shutter, typewriter, a low hit. One accent per landing at most, pitch
  varied (`sound.md`).

## 11. Checklist (every shot, then the whole video)

- [ ] One focal point; the subject readable at phone size; paper showing; a foreground.
- [ ] One saturated accent; photos treated; no glow, gradient, 3D or generated archive.
- [ ] Every text element one font; nothing overshoots in text; reading time respected; nothing under the buttons.
- [ ] Pieces land one at a time on their words, on the 12 fps clock; landed pieces still.
- [ ] Camera moving, one move, different from the last shot; cuts not dissolves (except then/now).
- [ ] A source line on every piece of evidence.
- [ ] The video: one palette, one anchor motif coming back, an impact every ~3 s, the hook answered at the end.

## 12. Measured on real Vox videos (October 2026)

Downloaded to `refs/vox-real/` (git-ignored; `yt-dlp`), read with `episode-review.py sheet` / `cadence` and frame
tiles. Vox's own vertical shorts are no reference: today they are podcast clips and reporters to camera, with no
collage. The collage videos are the long ones:

| video | id | median shot | animated on twos/threes | still |
|---|---|---|---|---|
| *How American Gothic became an icon* (Darkroom, a painting) | `Lf3ER5Ope_s` | 1.86 s | 14 % | 25 % |
| *Why I'm obsessed with these cheap paintings of Paris* | `rOjTc3F5UB4` | — | 27 % | 16 % |
| *The forgotten "wade-ins"* (Missing Chapter) | `Wk0872XhnHk` | 1.06 s | 30 % | 3 % |
| *How heavy metal and Satan gave us this sticker* (Earworm) | `v9gLmBgUTV4` | — | 10 % (mostly archive film) | 9 % |

Share of one-second windows; the rest is archive film (smooth) or cuts.

What they do, and the rules it gives:

- **The painting as the subject** (American Gothic): full frame, then hard cuts from detail to detail (faces, the
  window, the brooch); the painting framed on a flat field (yellow, purple with brushed streaks, pale teal), a small
  museum plinth glyph under it; side by side with its sources (Van Eyck, Memling) at the same height.
- **Analysis tint**: the painting turns a flat ochre duotone while it is discussed; a white outline circle draws onto
  a face, a shape (the pitchfork) is traced over it in the accent and erased. The part being shown can come back in
  colour. Camera still during it.
- **A region lit by tint, not by dimming**: on a newspaper page the advert under discussion fills with pale yellow.
- **Entrances**: pieces reveal from an edge (a straight wipe of their own mask, 4–6 frames), or the camera pulls out
  fast (6–8 frames, eased) from a document full frame to the page lying on its field, then holds.
- **Documents**: real pages; words circled or underlined in red ink on newsprint; yellow highlighter on paper, purple
  on web screenshots; typed transcripts of quotes on parchment.
- **Names**: a person's name in white sans with a short yellow underline (Earworm), or a yellow box, bold name and
  italic role (lower thirds); dates as plain white text over archive film.
- **Maps**: flat land in one colour on a flat field (Iowa yellow on maroon), or a period map with photos taped on and
  pins with place labels.
- **Charts**: real bar and pie charts in the video's two colours on a flat field, drawing on.
- **Archive film**: in a torn-paper frame on a black grain field (Earworm), or full frame with grain.
- **Repeated grids**: silhouettes in a grid, one filled in the accent (the one we're talking about).
- **First frame**: the title is already on screen at frame 0, over the subject, in the video's type.
