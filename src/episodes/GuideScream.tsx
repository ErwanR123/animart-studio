import { createGuideEpisode, type Voice } from "../guide/engine";
import { pencilLoop } from "../guide/shots";
import voice from "../../public/voice/GuideScream.json";

// Edvard Munch, The Scream (Skrik), 1893, tempera and crayon on cardboard, 91 × 73.5 cm, Nasjonalmuseet, Oslo
// (NG.M.00939). Facts checked against Wikipedia EN "The Scream" and the museum: Munch's diary entry (headed "Nice,
// 22 January 1892") tells the walk with two friends on a path above Kristiania (Oslo) at sunset, the clouds turning
// "blood red", his friends walking on, and "an infinite scream passing through nature". The pencil inscription in
// the sky ("Kan kun være malet af en gal mand", only on this version) is by Munch himself, around 1895
// (Nasjonalmuseet, 2021; The Art Newspaper; Smithsonian). Krakatoa: the hypothesis of D. Olson, R. Doescher and
// M. Olson (Texas State; Sky & Telescope, Feb. 2004) that Munch remembered the volcanic twilights of late 1883 over
// Christiania; disputed by most art historians, so told as a hypothesis ("des astronomes pensent", bible/script.md
// rule 4). That the figure covers its ears rather than screams is the episode's reading.
// Images (public/art/SOURCES.md): the museum's scan (Commons, NG.M.00939) at 3222 px with native-resolution insets;
// the 1883 Chelsea sky sketches by William Ascroft and the eruption lithograph from the Royal Society's Krakatoa
// report (1888); Harper's Weekly (29 Sept. 1883); Science (Jan. 1884); Malte-Brun's world map (1832); Kristiania from
// Ekeberg (National Library of Norway postcard). Diary line: Munch's entry "Nice 22.01.1892" ("Jeg gikk bortover
// veien med to venner – solen gikk ned"), in French.
// Style: the painting where the voice points at it (pencil loops, notes, spotlights), collage shots (src/guide/
// shots.tsx) for the story around it, each held ~2 s and built word by word (bible/art-direction.md).
// The full-width view: screen x = 0.4 + 1079 fx, y = 30 + 1340 fy (collage pieces in px of the 1080 × 1400 frame).
const FULL = { z: 0.957, fx: 0.5, fy: 0.5 };
export const guideScream = createGuideEpisode({
  voiceFile: "voice/GuideScream.mp3",
  voice: voice as Voice,
  image: { src: "art/scream/scream.jpg", width: 3222, height: 4000 },
  insets: [
    { src: "art/scream/scream-face.jpg", x: 0.39997, y: 0.45999, w: 0.26003, h: 0.26003 },
    { src: "art/scream/scream-note.jpg", x: 0.17007, y: 0.12497, w: 0.2199, h: 0.04999 },
  ],
  // The painting over its depth map (scripts/image-depth.py): the flow on "vibre" leaves the near planes (him) still.
  depth: { src: "art/scream/scream-3d.jpg" },
  maxWidth: 1000,
  climb: true,
  climbFrom: "start",
  openView: FULL,
  // Finger on his lips: the first frame and the last ("il est le seul à l'entendre": silence), so the loop matches.
  openPose: "shh",
  tight: true,
  lead: {
    // The painting, then a print of him: "il hurle" taped on him and crossed out.
    hook: {
      shots: [
        {
          word: "tout", in: "slide", cam: { from: [0, 0, 1], to: [0, 20, 1.05] },
          layers: [
            { bg: "art/paper/kraft.jpg", dim: 0.25 },
            { src: "art/scream/figure.png", x: 140, y: 50, w: 804, z: 0.5, enter: "none" },
            { tape: "Il hurle.", x: 560, y: 700, size: 84, rot: -5, z: 0.9, at: "hurle", strike: "réalité" },
          ],
        },
      ],
      // He does what the man does.
      poses: [{ word: "essaie", pose: "ears" }],
      sfx: [{ word: "réalité", src: "sfx/accents/pencil-4.wav", volume: 0.5 }],
    },
    // The proof, on the painting: his hands on his ears, his open mouth.
    context: {
      view: { z: 3.0, fx: 0.528, fy: 0.6 },
      glow: [
        // His hands, from the ear down to the wrist under the jaw (measured on out/grid.png).
        { word: "mains", fx: 0.456, fy: 0.607, w: 0.036, h: 0.135, angle: -6 },
        { word: "mains", fx: 0.59, fy: 0.605, w: 0.034, h: 0.135, angle: -6 },
        { word: "bouche", fx: 0.53, fy: 0.607, w: 0.026, h: 0.032, round: true },
      ],
      poses: [{ word: "regardez", pose: "point-up" }],
    },
  },
  // "Aucun bruit": the world goes grey and the music stops; in his head, a heartbeat.
  freeze: { from: ["d0", "aucun"], to: ["d1", "munch"], fx: 0.53, fy: 0.75, rx: 0.13, ry: 0.27 },
  heart: { src: "sfx/story/heart.wav", from: ["d0", "tout"], to: ["d1", "munch"], volume: 0.85 },
  loop: { word: "l'entendre" },
  header: "EDVARD MUNCH · 1893",
  title: ["Le", "Cri."],
  // Coordinates measured on a grid over public/art/scream/scream.jpg.
  details: [
    {
      // Out of the dark: his two friends walk on, calm; for them, no sound; it is all in his head.
      id: "d0", fx: 0.38, fy: 0.5,
      view: FULL,
      // "Tout se passe dans sa tête": he leaves the painting in place (a cut-out on his painted self, x = 0.4 + 1079 fx,
      // y = 30 + 1340 fy, crop 0.36–0.72 × 0.44–1 plus its 18 px rim at 1/3 scale) and the world dissolves around him.
      shots: [
        {
          word: "tout", in: "fade", cam: { from: [0, 0, 1], to: [0, -30, 1.08] },
          layers: [
            { bg: "#0E0F0C" },
            { src: "art/scream/figure-cut.png", x: 383, y: 614, w: 400, z: 0.5, enter: "none" },
          ],
        },
      ],
      spots: [{ word: "amis", fx: 0.07, fy: 0.44, rx: 0.07, ry: 0.11, name: "ses amis", dx: 150 }],
      poses: [{ word: "aucun", pose: "shh" }],
      beat: { pose: "thinking", x: 230 },
    },
    {
      // His diary: the man and the first line of the entry; Kristiania (Oslo) as it was, its sky turning blood red;
      // then back to the painting for his words.
      id: "d1", fx: 0.5, fy: 0.42,
      view: { z: 1.0, fx: 0.5, fy: 0.42 },
      shots: [
        {
          word: "munch", in: "tear", cam: { from: [0, 0, 1], to: [0, -15, 1.05] },
          layers: [
            { bg: "art/paper/kraft.jpg", dim: 0.1 },
            { stripes: 80, x: -100, y: 960, w: 1300, rot: -4, z: 0.2, enter: "none" },
            { disc: "#E2602E", x: 520, y: 150, w: 480, z: 0.25, enter: "none" },
            { src: "art/scream/munch.png", x: 540, y: 200, w: 440, z: 0.6, enter: "up" },
            { tape: "Edvard Munch", x: 580, y: 790, size: 50, rot: 3, z: 0.9 },
            { note: "« Je marchais le long de la route avec deux amis — le soleil se couchait… »", w: 470, size: 46, x: 50, y: 250, rot: -4, z: 0.8, at: "raconté" },
            { tape: "Son journal · 1892", x: 70, y: 700, size: 46, rot: 2, z: 0.95, at: "journal" },
          ],
        },
        {
          word: "au-dessus", until: "et", in: "slide", cam: { from: [0, 0, 1], to: [0, 20, 1.06] },
          layers: [
            { bg: "art/paper/kraft.jpg", dim: 0.2 },
            { src: "art/scream/kristiania.png", x: 60, y: 330, w: 960, rot: -2, z: 0.4, enter: "none" },
            { tape: "Kristiania (Oslo)", x: 90, y: 230, size: 54, rot: -3, z: 0.95, at: "d'oslo" },
            { src: "art/scream/sky-strip.png", x: -140, y: 50, w: 1360, rot: 2, z: 0.6, at: "rouge" },
            { tape: "Rouge sang", x: 150, y: 640, size: 70, rot: -4, z: 0.95, at: "sang" },
          ],
        },
      ],
      notes: [{ word: "senti", text: "« Un cri infini traversait la nature » — Munch, journal", fx: 0.25, fy: 0.2, dx: -200, dy: -30 }],
      sfx: [{ word: "cri", src: "sfx/story/nature-cry.wav", volume: 0.3 }],
      // He reads the diary, then shows the sky above.
      poses: [{ word: "au-dessus", pose: "point-up" }],
      beat: { pose: "reading", x: 230 },
    },
    {
      // Krakatoa, told as a hypothesis: 1883, the eruption, the ash going round the planet, the red twilights painted
      // in London that November, all the way to Norway.
      id: "d2", fx: 0.5, fy: 0.5,
      view: FULL,
      // The test of the collage shots (src/guide/shots.tsx): a new paper composition every second or two, all from
      // archives of the time (Harper's Weekly, 29 Sept. 1883; Science, 4 and 11 Jan. 1884: the red sunsets letter and
      // the table of the dates the glow was first seen, country by country).
      shots: [
        {
          // This sky; then who doubts it and when (D. Olson et al., Sky & Telescope, Feb. 2004).
          word: "et", in: "tear", cam: { from: [0, 0, 1], to: [-20, 0, 1.06] },
          layers: [
            { bg: "art/paper/kraft.jpg" },
            { src: "art/scream/page-science.jpg", x: 140, y: -60, w: 820, rot: 4, z: 0.1, enter: "none" },
            { src: "art/scream/page-science-2.jpg", x: -120, y: 560, w: 640, rot: -7, z: 0.2, enter: "none" },
            { stripes: 90, x: 520, y: 980, w: 800, rot: -6, z: 0.3, enter: "none" },
            { src: "art/scream/sky-strip.png", x: -140, y: 250, w: 1360, rot: -3, z: 0.5, enter: "left" },
            { tape: "Imaginaire ?", x: 290, y: 760, size: 74, rot: -4, z: 0.9, at: "imaginaire" },
            { tape: "Des astronomes · 2004", x: 140, y: 120, size: 60, rot: 3, z: 0.95, at: "astronomes" },
          ],
        },
        {
          word: "fin", cam: { from: [0, 0, 1], to: [0, 0, 1.06] },
          layers: [
            { bg: "art/scream/page-science-2.jpg", dim: 0.55 },
            { tape: "Fin de l'année", x: 110, y: 250, size: 60, rot: -4, z: 0.9 },
            { big: "1883", size: 420, x: 80, y: 360, z: 0.7, at: "1883" },
          ],
        },
        {
          // The real page of September 1883; the eruption lands on its word, then its ash spreads across the sky.
          word: "l'éruption", in: "slide", shake: "krakatoa", cam: { from: [0, 0, 1], to: [0, 30, 1.06] },
          layers: [
            { bg: "art/paper/kraft.jpg", dim: 0.2 },
            { src: "art/scream/page-science-2.jpg", x: 300, y: 560, w: 760, rot: 5, z: 0.2, enter: "none" },
            { src: "art/scream/harper.png", x: -60, y: 160, w: 1200, rot: -2, z: 0.4, enter: "none" },
            { src: "art/scream/krakatoa.png", x: 40, y: 520, w: 430, rot: -6, z: 0.8, at: "krakatoa", enter: "slap" },
            { tape: "Krakatoa", x: 500, y: 830, size: 88, rot: -4, z: 0.95 },
            { stamp: "26 AOÛT 1883", x: 560, y: 690, size: 56, rot: -8, z: 0.9 },
          ],
        },
        {
          // The ash fills the sky: from Krakatoa (circled) a cloud spreads until it veils the whole world map.
          word: "rempli", in: "tear", cam: { from: [0, 0, 1.02], to: [-15, -10, 1.06] },
          layers: [
            { bg: "art/paper/kraft.jpg" },
            { src: "art/scream/map.png", x: 10, y: 160, w: 1060, rot: -1, z: 0.3, enter: "none" },
            { pencil: pencilLoop(646, 850, 26, 26, 4), width: 7, draw: 0.35, z: 0.3, enter: "none" },
            { haze: [646, 850], draw: 2.4, z: 0.3, at: "rempli" },
          ],
        },
        {
          word: "couchers", in: "tear", cam: { from: [0, 0, 1], to: [0, -25, 1.06] },
          layers: [
            { bg: "art/scream/page-science.jpg", dim: 0.3 },
            { src: "art/scream/sky-chelsea-1.png", x: 30, y: 80, w: 640, rot: -5, z: 0.45 },
            { tape: "27 nov. 1883", x: 620, y: 90, size: 52, rot: 5, z: 0.95 },
            { src: "art/scream/sky-chelsea-2.png", x: 420, y: 270, w: 620, rot: 4, z: 0.55, at: "soleil" },
            { src: "art/scream/red-sunsets.png", x: 160, y: 640, w: 760, z: 0.8, at: "étaient" },
            { marker: [300, 828, 545, 30], z: 0.8, at: "rouges" },
            { tape: "Toute la planète", x: 380, y: 560, size: 58, rot: -3, z: 0.95, at: "planète" },
          ],
        },
        {
          // The red twilights reach Norway: from the south-east (Krakatoa's side) to Christiania.
          word: "jusqu'en", cam: { from: [0, 0, 1], to: [0, 10, 1.06] },
          layers: [
            { bg: "art/paper/kraft.jpg", dim: 0.3 },
            { src: "art/scream/map-europe.png", x: -40, y: 10, w: 1156, z: 0.4, enter: "none" },
            { pencil: "M 1140 1100 C 960 960 760 780 450 590", color: "rgba(200,40,28,0.6)", width: 80, draw: 0.9, z: 0.4, enter: "none" },
            { pencil: pencilLoop(400, 490, 90, 150, 5), draw: 0.45, z: 0.4, at: "norvège" },
            { tape: "Norvège", x: 560, y: 300, size: 92, rot: -3, z: 0.95, at: "norvège" },
          ],
        },
      ],
      sfx: [{ word: "krakatoa", src: "sfx/story/boom.wav", volume: 0.8 }],
      // "Peut-être" (the shrug of the beat), then the eruption.
      poses: [{ word: "l'éruption", pose: "amazed" }],
      hold: 0.7,
      beat: { pose: "shrug", x: 230 },
    },
    {
      // On the painting: the sky, the fjord, the path traced in cream pencil, while the paint flows in waves round him.
      id: "d3", fx: 0.5, fy: 0.5,
      view: FULL,
      collage: {
        word: "ciel",
        push: 0,
        pieces: [
          { pencil: "M 20 345 C 180 325 260 312 324 318 S 520 340 648 332 S 880 300 1000 296", x: 0, y: 0, w: 1080, depth: 1, color: "#F4EBDD", width: 9, at: "ciel", draw: 0.6 },
          { pencil: "M 130 593 C 250 590 330 578 420 570 S 600 552 650 530 C 690 510 670 482 620 478 S 520 470 470 474", x: 0, y: 0, w: 1080, depth: 1, color: "#F4EBDD", width: 9, at: "fjord", draw: 0.6 },
          { pencil: "M 116 565 L 478 851 M 672 960 L 1004 1176", x: 0, y: 0, w: 1080, depth: 1, color: "#F4EBDD", width: 9, at: "chemin", draw: 0.6 },
        ],
      },
      // The paint flows like waves around him while he stays still (the user's favourite from v3).
      flow: { word: "vibre", amp: 0.012, pulse: 3 },
      sfx: [
        { word: "vibre", src: "sfx/story/nature-cry.wav", volume: 0.4 },
        { word: "ciel", src: "sfx/accents/pencil-1.wav", volume: 0.5 },
        { word: "fjord", src: "sfx/accents/pencil-2.wav", volume: 0.5 },
        { word: "chemin", src: "sfx/accents/pencil-3.wav", volume: 0.5 },
      ],
      poses: [{ word: "propageait", pose: "ears" }],
      beat: { pose: "explaining", x: 230 },
    },
    {
      // Munch's own pencil line, as it is: the camera comes close enough to read it (the user: no re-tracing).
      id: "d4", fx: 0.28, fy: 0.147,
      view: { z: 5.4, fx: 0.285, fy: 0.147 },
      // The magnifying glass on the inscription.
      hold: 0.4,
      beat: { pose: "loupe", x: 230 },
    },
    {
      id: "d5", fx: 0.5, fy: 0.5,
      view: FULL,
      // The answer: the whole painting, then the light closes on the one man who hears it.
      spots: [{ word: "seul", fx: 0.53, fy: 0.66, rx: 0.14, ry: 0.26, name: "" }],
      poses: [{ word: "nature", pose: "amazed" }],
      hold: 0.6,
      beat: { pose: "explaining", x: 230 },
    },
  ],
});
