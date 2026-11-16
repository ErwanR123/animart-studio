import { createGuideEpisode, type Voice } from "../guide/engine";
import { pencilLoop } from "../guide/shots";
import voice from "../../public/voice/GuideBanana.json";

// Maurizio Cattelan, Comedian, 2019: a banana duct-taped to a wall, eaten three times and worth more each time.
// Galerie Perrotin, Art Basel Miami Beach, Dec. 2019 (editions at $120,000): on 7 Dec. the performance artist David
// Datuna ate it; the gallery taped up another ("He did not destroy the artwork. The banana is the idea."). Leeum Museum
// of Art, Seoul, April 2023: the student Noh Huyn-soo ate it ("he was hungry") and taped the peel back on the wall.
// Sotheby's New York, 20 Nov. 2024: $6.2 million, to Justin Sun, who ate it in Hong Kong on 29 Nov. The buyer gets a
// certificate of authenticity and the instructions to replace the fruit. "Each bite makes it more famous… and dearer"
// is the episode's reading. Sources: The Guardian, CNN, Artnet, Irish Times, Wikipedia EN "Comedian (artwork)".
// Footage (public/art/SOURCES.md), cropped off logos and captions: The Guardian (Datuna; the Seoul student, KBS),
// Sotheby's own film (the hammer), HK01 news (Sun). Music: Scott Joplin, Maple Leaf Rag (1916 roll).
// Mode: a story told on real footage with Vox paper on top (stamps, prints, the counter), like GuideBanksy.
const CLIP = "clips/banana";
const ART = "art/banana";
// Frame 0 and the loop's last frame: Datuna reaching for it on the wall, full screen (grab0.jpg is the clip's first frame).
const OPEN = { z: 1, fx: 0.5, fy: 0.5 };
const KRAFT = "art/paper/kraft.jpg";
const WALL = "#E3E2DD";
// A clip filling the shot (1080 × 1400, cut and cropped to start where it should).
const clip = (name: string, volume = 0) => ({ footage: `${CLIP}/${name}.mp4`, h: 1400, volume, x: 0, y: 0, w: 1080, z: 0.4, enter: "none" as const });
// The bite count, slapped on the footage on the word (the shot jolts with it), clear of the Guide's head.
const bite = (n: number, at: string) => ({ stamp: `BOUCHÉE N°${n}`, size: 96, x: 400, y: 900, rot: -7, z: 0.95, at });
// The work rebuilt: the banana and its tape, cut from the same photo, laid at the same x, y, w (1250 × 1450 px crops).
const ON_WALL = { x: 240, y: 260, w: 600, z: 0.5 };
export const guideBanana = createGuideEpisode({
  voiceFile: "voice/GuideBanana.mp3",
  voice: voice as Voice,
  image: { src: `${ART}/grab0.jpg`, width: 1080, height: 1920 },
  maxWidth: 1000,
  climb: true,
  climbFrom: "start",
  openView: OPEN,
  openPose: "point-up",
  music: "music/maple-leaf-rag.mp3",
  palette: { paper: "#EDE5D3", accent: "#C8321E", hl: "#F4C531" },
  tight: true,
  // Cold open on the real thing: Datuna pulling it off the wall, full screen, "120 000 $" small at the bottom; on
  // "œuvre", a hard cut to his bite.
  cold: [
    { view: OPEN, tapes: ["120 000 $"], y: 1700, size: 54, cover: `${CLIP}/datuna-grab.mp4` },
    { word: "œuvre", view: OPEN, cover: `${CLIP}/datuna-bite.mp4` },
  ],
  // From "Et tout a commencé quand…", back to him at the wall: "…il vient de manger une œuvre à 120 000 dollars". He
  // steps up to it (the footage just before the cold open's first frame), so the loop runs on in motion.
  loop: { word: "tout", view: OPEN, full: true, cover: { src: `${CLIP}/datuna-enter.mp4`, dur: 1.73 } },
  header: "MAURIZIO CATTELAN · 2019",
  title: ["Comedian", "de Cattelan."],
  lead: {
    hook: {
      sfx: [{ word: "cent", src: "sfx/story/bite.wav", volume: 0.8 }],
    },
    context: {
      // He chews on; the count starts.
      shots: [
        {
          word: "et", in: "cut", carry: true, shake: "première", source: "The Guardian, 8 Dec. 2019 (YouTube 9ZqdfUHtkk8), 16 s", cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          layers: [clip("datuna-chew"), { tape: "Miami · 2019", x: 80, y: 140, size: 54, rot: -3, z: 0.95, enter: "none" }, bite(1, "première")],
        },
      ],
      sfx: [{ word: "première", src: "sfx/accents/thud.wav", volume: 0.5 }],
      poses: [{ word: "première", pose: "amazed" }],
    },
  },
  details: [
    {
      // The gallery doesn't even get angry: the empty tape on the wall, "ZÉRO PANIQUE", a fresh banana lowered under it.
      id: "d0", fx: 0.5, fy: 0.5,
      view: OPEN,
      shots: [
        {
          word: "la", in: "cut", carry: true, shake: "scotche", cam: { from: [0, 30, 0.96], to: [0, -40, 1.16] },
          layers: [
            { bg: WALL },
            { src: `${ART}/banana.png`, ...ON_WALL, at: "neuve", enter: "crane" },
            { src: `${ART}/tape.png`, ...ON_WALL, enter: "none" },
            { tape: "Galerie Perrotin", x: 120, y: 140, size: 54, rot: -3, z: 0.95, at: "galerie" },
            { stamp: "ZÉRO PANIQUE", size: 92, x: 330, y: 960, rot: -7, z: 0.95, at: "pas" },
          ],
        },
      ],
      sfx: [{ word: "scotche", src: "sfx/accents/tape.wav", volume: 0.6 }],
      poses: [{ word: "même", pose: "shrug" }],
      beat: { pose: "explaining", x: 230 },
    },
    {
      // Seoul, 2023: the camera pushes in on the student eating; his name; the peel taped back, ringed.
      id: "d1", fx: 0.5, fy: 0.5,
      view: OPEN,
      shots: [
        {
          word: "séoul", in: "whip", carry: true, shake: "mange", source: "The Guardian / KBS, 1 May 2023 (YouTube qvwfWyU9Gfc), 2 s", cam: { from: [0, 0, 1], to: [0, -30, 1.15] },
          layers: [
            { ...clip("seoul-eat"), z: 0.9 },
            { tape: "Séoul · 2023", x: 150, y: 190, size: 54, rot: -3, z: 0.95, at: "séoul" },
            bite(2, "mange"),
            { tape: "Noh Huyn-soo", x: 500, y: 330, size: 44, rot: 3, z: 0.95, at: "étudiant" },
          ],
        },
        {
          word: "et", in: "cut", carry: true, source: "The Guardian / KBS, 10.3 s", cam: { from: [0, 0, 1], to: [0, -20, 1.08] },
          layers: [
            clip("seoul-peel"),
            { pencil: pencilLoop(520, 770, 150, 120, 3), draw: 0.4, z: 0.9, at: "peau" },
            { tape: "La peau, recollée", x: 380, y: 160, size: 50, rot: 3, z: 0.95, at: "peau" },
          ],
        },
      ],
      sfx: [
        { word: "mange", src: "sfx/story/bite.wav", volume: 0.7 },
        { word: "recolle", src: "sfx/accents/tape.wav", volume: 0.6 },
      ],
      poses: [{ word: "petit-déj", pose: "shrug" }],
      beat: { pose: "explaining", x: 230 },
    },
    {
      // New York, 2024: the auctioneer's hammer (its own sound), the price running up and "ADJUGÉ"; then the buyer's bite.
      id: "d2", fx: 0.5, fy: 0.5,
      view: OPEN,
      shots: [
        {
          word: "new", in: "whip", carry: true, shake: "millions", source: "Sotheby's, The New York Sales, 20 Nov. 2024 (YouTube E7pPomFdpLY), 431.1 s (the hammer at 2.6 s)", cam: { from: [0, 0, 1], to: [0, 0, 1.06] },
          layers: [
            clip("hammer", 0.9),
            { tape: "Sotheby's · New York · 2024", x: 80, y: 140, size: 48, rot: -3, z: 0.95, at: "new" },
            { counter: [120000, 6200000], dur: 0.8, suffix: " $", size: 130, x: 70, y: 880, z: 0.9, at: "vend" },
            { stamp: "ADJUGÉ", size: 120, x: 520, y: 330, rot: -9, z: 0.95, at: "millions" },
          ],
        },
        {
          word: "et", in: "cut", carry: true, shake: "mange", source: "HK01 news, Hong Kong, 29 Nov. 2024 (YouTube 7QaKIfPhY_M), 22.6 s", cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          layers: [clip("bite"), { tape: "Justin Sun · l'acheteur", x: 80, y: 140, size: 50, rot: -3, z: 0.95, at: "l'acheteur" }, bite(3, "mange")],
        },
      ],
      sfx: [{ word: "mange", src: "sfx/story/bite.wav", volume: 0.7 }],
      poses: [{ word: "mange", pose: "amazed" }],
      beat: { pose: "explaining", x: 230 },
    },
    {
      // The answer: no banana, a certificate (stamped) and the right to tape up a new one: three fresh ones lowered in
      // a row, faster each time.
      id: "d3", fx: 0.5, fy: 0.5,
      view: OPEN,
      shots: [
        {
          word: "le", in: "tear", carry: true, shake: "neuve", cam: { from: [0, 30, 0.96], to: [0, -20, 1.06] },
          layers: [
            { bg: KRAFT, dim: 0.1 },
            { stamp: "SECRET", size: 110, x: 120, y: 140, rot: -6, z: 0.95, at: "secret" },
            { src: `${ART}/whole.png`, x: 80, y: 330, w: 420, rot: -8, z: 0.6, enter: "drop", off: "juste" },
            { pencil: "M70 300 L520 620 M520 300 L70 620", width: 10, draw: 0.25, z: 0.8, at: "pas", off: "juste" },
            { letter: "Certificat d'authenticité\nComedian, 2019\nMaurizio Cattelan\nRemplacer la banane\nau besoin.", w: 560, size: 40, x: 260, y: 300, rot: 3, z: 0.7, at: "certificat", enter: "toss" },
            { stamp: "AUTHENTIQUE", size: 84, x: 440, y: 560, rot: -8, z: 0.95, at: "certificat", after: 0.5 },
            { src: `${ART}/whole.png`, x: 70, y: 800, w: 260, rot: -6, z: 0.85, at: "scotcher", enter: "crane" },
            { src: `${ART}/whole.png`, x: 410, y: 820, w: 260, rot: 4, z: 0.86, at: "une", enter: "crane" },
            { src: `${ART}/whole.png`, x: 750, y: 800, w: 260, rot: -3, z: 0.87, at: "neuve", enter: "crane" },
          ],
        },
      ],
      sfx: [{ word: "certificat", src: "sfx/accents/thud.wav", volume: 0.4 }],
      poses: [{ word: "secret", pose: "whisper" }],
      beat: { pose: "explaining", x: 230 },
    },
    {
      // The signature moment: the three bites as prints in a row, then the price under them, 120,000 → 6.2 million.
      id: "d4", fx: 0.5, fy: 0.5,
      view: OPEN,
      shots: [
        {
          word: "chaque", in: "cut", until: "tout", cam: { from: [0, 0, 1], to: [0, -10, 1.05] },
          layers: [
            { bg: KRAFT, dim: 0.15 },
            { src: `${ART}/still1.jpg`, x: 20, y: 230, w: 340, rot: -5, z: 0.6, at: "chaque", enter: "toss" },
            { src: `${ART}/still2.jpg`, x: 370, y: 260, w: 340, rot: 3, z: 0.62, at: "bouchée", enter: "toss" },
            { src: `${ART}/still3.jpg`, x: 720, y: 230, w: 340, rot: -3, z: 0.64, at: "rend", enter: "toss" },
            { stamp: "N°1", size: 70, x: 60, y: 610, rot: -8, z: 0.95, at: "chaque", after: 0.2 },
            { stamp: "N°2", size: 70, x: 420, y: 640, rot: 5, z: 0.95, at: "bouchée", after: 0.2 },
            { stamp: "N°3", size: 70, x: 770, y: 610, rot: -4, z: 0.95, at: "rend", after: 0.2 },
            { tape: "+ célèbre", x: 360, y: 760, size: 60, rot: -3, z: 0.95, at: "célèbre" },
            { counter: [120000, 6200000], dur: 0.9, suffix: " $", size: 140, x: 60, y: 950, z: 0.9, at: "chère" },
          ],
        },
      ],
      poses: [{ word: "chère", pose: "celebrating" }],
      beat: { pose: "explaining", x: 230 },
    },
  ],
});
