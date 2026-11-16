import { createGuideEpisode, type Voice } from "../guide/engine";
import voice from "../../public/voice/GuideRhino.json";

// Dürer's *Rhinoceros* (woodcut, 1515): the first viral fake. Thesis: a strong image beats reality, it outlived the real
// animal and the more accurate drawings. Format "Sans l'avoir vu".
// Facts (4 Nov. 2026; Wikipedia EN "Dürer's Rhinoceros" and "Clara (rhinoceros)", Wikipedia FR "Rhinocéros de Dürer",
// Natural History Museum "The legacy of Dürer's rhinoceros", Medievalists.net, 28 Dec. 2017):
// - the rhino reached Lisbon on 20 May 1515, a gift from Sultan Muzaffar Shah II of Gujarat to King Manuel I;
// - Manuel set it against an elephant to test Pliny; the elephant fled before a blow (Bedini 1981; FR: "vainqueur par
//   abandon");
// - Dürer never saw it: a letter and a sketch by an unknown artist reached Nuremberg; his plates, rivets and dorsal horn
//   are not in a real rhinoceros;
// - sent as a gift to Pope Leo X, the rhino drowned, chained to the deck, in a wreck off Porto Venere (early 1516);
// - Burgkmair's woodcut is truer to life; one impression survives (Albertina, Vienna);
// - the Pisa Cathedral door panel copies Dürer's (school of Giambologna, c. 1602);
// - Oudry painted Clara life-size in Paris, 1749 (Schwerin);
// - regarded as accurate into the late 18th c.; in German school textbooks until the late 1930s: one source only,
//   Clarke, The Rhinoceros from Dürer to Stubbs (1986), p. 20, cited by both Wikipedias.
// Images (public/art/SOURCES.md). The real rhino throughout is Burgkmair's, shackles included. Music: anonymous lute
// prelude, 16th c.
const ART = "art/rhino";
const CRUMPLED = "art/paper/crumpled.jpg";
const CREAM = "#EDE5D3";
const RED = "#B8261B";
const SEA = "#2E5266";
const FULL = { z: 1, fx: 0.5, fy: 0.5 };
// Frame 0 and the loop's last frame: the head and the little horn on the back, full screen.
const OPEN = { z: 1.5, fx: 0.5, fy: 0.353 };

// The armour: each plate laid exactly over the bare rhino (fractions of its width).
const RH = { x: 40, y: 350, w: 1000 };
const plate = (name: string, fx: number, fy: number, fw: number) => ({
  src: `${ART}/plate-${name}.png`, x: RH.x + fx * RH.w, y: RH.y + fy * RH.w, w: fw * RH.w, z: 0.5, enter: "slap" as const,
});
// The years riffling from Oudry to the textbooks.
const riffle = Array.from({ length: 18 }, (_, k) => [["d8", "trop"], String(1750 + k * 10), 0.05 + k * 0.06] as [[string, string], string, number]);

export const guideRhino = createGuideEpisode({
  voiceFile: "voice/GuideRhino.mp3",
  voice: voice as Voice,
  image: { src: `${ART}/cover.jpg`, width: 2160, height: 5440 },
  maxWidth: 1000,
  climb: true,
  climbFrom: "start",
  openView: FULL,
  openPose: "amazed",
  music: "music/lute-prelude.mp3",
  tight: true,
  palette: { paper: CREAM, accent: RED, hl: "#F4C531" },
  cold: [
    { view: OPEN, tapes: ["CET ANIMAL N'A JAMAIS EXISTÉ"], y: 1700, size: 54 },
    // Under the hook's shot, the cover's dark strip only.
    { word: "existé.", view: { z: 3, fx: 0.5, fy: 0.95 } },
  ],
  // The last line ("L'Europe a gardé celui-ci.") runs straight into the first ("Cet animal n'a jamais existé.").
  loop: { word: "gardé", view: OPEN, full: true },
  header: "DÜRER · 1515",
  title: ["Le rhinocéros", "de Dürer"],
  calendar: {
    pages: [...riffle, [["d8", "années"], "1930"]],
    until: ["d8", "dürer."],
  },
  lead: {
    hook: {
      shots: [
        {
          word: "existé.", in: "cut", carry: true, shake: "l'europe", cam: { from: [0, 0, 1], to: [0, -10, 1.05] },
          source: "Albrecht Dürer, Rhinocerus, woodcut, 1515 (NGA)",
          layers: [
            { field: CREAM, dots: "tl", paper: CRUMPLED },
            { src: `${ART}/durer.png`, x: 20, y: 400, w: 1040, z: 0.5, enter: "none" },
            { stamp: "FAUX", size: 120, x: 90, y: 270, rot: -9, z: 0.9, at: "l'europe" },
            { tape: "CET ANIMAL N'A JAMAIS EXISTÉ", size: 44, x: 60, y: 1160, rot: -2, z: 0.95, enter: "none" },
          ],
        },
      ],
      sfx: [
        { word: "existé.", src: "sfx/accents/swish-1.wav", volume: 0.4 },
        { word: "l'europe", src: "sfx/accents/thud.wav", volume: 0.6 },
      ],
    },
    context: {
      shots: [
        {
          // Lisbon: the ship comes in along the Tagus, the real rhino walks in along the quay.
          word: "en", in: "cut", carry: true, cam: { from: [40, 0, 1.04], to: [-40, 0, 1.04] },
          source: "Braun & Hogenberg, Lisbon, 1572; Bruegel, Armed Three-Master; Burgkmair, Rhinoceros, 1515",
          layers: [
            { field: "#E2D3B5", dots: "tr", paper: CRUMPLED },
            { src: `${ART}/lisbon.jpg`, x: -150, y: 250, w: 1380, z: 0.3, enter: "none" },
            { src: `${ART}/ship.png`, x: 1150, y: 300, w: 300, z: 0.4, enter: "none", route: [[0, -560, 0, 6, 0.2]] },
            { fore: "bottom", color: "#5A3C25", y: 1150, z: 0.8, at: "en" },
            { src: `${ART}/real.png`, x: 1180, y: 800, w: 640, z: 0.6, at: "vrai", enter: "none", walk: [-860, 0, 6, 0.16] },
            { tag: "LISBONNE · 20 MAI 1515", size: 44, x: 60, y: 870, rot: -2, z: 0.95, at: "lisbonne," },
            { tape: "CADEAU DU SULTAN DU GUJARAT", size: 36, x: 60, y: 960, rot: 1, z: 0.95, at: "cadeau" },
          ],
        },
      ],
      sfx: [
        { word: "en", src: "sfx/accents/page-1.wav", volume: 0.35 },
        { word: "vrai", src: "sfx/story/steps.wav", volume: 0.45 },
        { word: "cadeau", src: "sfx/accents/tape.wav", volume: 0.4 },
      ],
      poses: [{ word: "en", pose: "explaining" }],
    },
  },
  details: [
    {
      // The elephant walks up, looks, turns round and runs out of the frame. The rhino has not moved.
      id: "d1", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "le", in: "cut", carry: true, shake: "s'enfuit.", cam: { from: [0, 0, 1], to: [0, 0, 1.03] },
          source: "School of Raphael, The Elephant Hanno, c. 1514 (flipped); Burgkmair, Rhinoceros, 1515",
          layers: [
            { field: CREAM, dots: "tl", paper: CRUMPLED },
            { fore: "bottom", color: "#C9B58D", y: 1040, z: 0.3, at: "le" },
            { src: `${ART}/real.png`, x: 480, y: 720, w: 600, z: 0.5, enter: "none" },
            { src: `${ART}/elephant.png`, x: -640, y: 500, w: 620, z: 0.6, enter: "none", route: [[0, 560, 0, 4, 0.14], [1.75, -1400, 0, 7, 0.08]], turn: 1.6 },
            { stamp: "VAINQUEUR PAR FORFAIT", size: 58, x: 170, y: 400, rot: -6, z: 0.95, at: "s'enfuit.", after: 0.25 },
          ],
        },
      ],
      sfx: [
        { word: "le", src: "sfx/story/steps.wav", volume: 0.45 },
        { word: "l'éléphant", src: "sfx/accents/swish-4.wav", volume: 0.5 },
        { word: "s'enfuit.", src: "sfx/story/steps.wav", volume: 0.6 },
        { word: "s'enfuit.", after: 0.25, src: "sfx/accents/thud.wav", volume: 0.55 },
      ],
      beat: { pose: "amazed", x: 230 },
    },
    {
      // Dürer in his 1500 self-portrait, a strip over his eyes; then all he has: a letter and a sketch.
      id: "d2", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "à", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.03] },
          source: "Dürer, Self-Portrait, 1500 (Alte Pinakothek); Dürer, Rhinoceros, pen and ink, 1515 (British Museum)",
          layers: [
            { field: "#24180F", dots: "br", paper: CRUMPLED },
            { src: `${ART}/self.png`, x: 180, y: 260, w: 720, z: 0.4, enter: "none" },
            { tape: "JAMAIS VU", size: 62, x: 330, y: 490, rot: -3, z: 0.7, at: "jamais" },
            { src: `${ART}/letter.jpg`, x: 30, y: 930, w: 620, rot: -4, z: 0.8, at: "lettre", enter: "pop" },
            { src: `${ART}/drawing.jpg`, x: 430, y: 800, w: 620, rot: 4, z: 0.85, at: "croquis.", enter: "pop" },
          ],
        },
      ],
      sfx: [
        { word: "jamais", src: "sfx/accents/tape.wav", volume: 0.55 },
        { word: "lettre", src: "sfx/accents/page-2.wav", volume: 0.45 },
        { word: "croquis.", src: "sfx/accents/page-3.wav", volume: 0.45 },
      ],
      beat: { pose: "shrug", x: 230 },
    },
    {
      // Signature: the rhino gets its armour plate by plate, then the rivets, then the little horn.
      id: "d3", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "alors", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1] },
          source: "Albrecht Dürer, Rhinocerus, woodcut, 1515 (NGA), cut plate by plate",
          layers: [
            { field: CREAM, dots: "tr", paper: CRUMPLED },
            { src: `${ART}/bare.png`, ...RH, z: 0.5, enter: "none" },
            { ...plate("saddle", 0.1781, 0.081, 0.3423), at: "armure," },
            { ...plate("hip", 0.0128, 0.0117, 0.239), at: "armure,", after: 0.2 },
            { ...plate("shoulder", 0.4595, 0.0458, 0.2116), at: "armure,", after: 0.4 },
            { ...plate("gorget", 0.6505, 0.148, 0.1513), at: "armure,", after: 0.55 },
            ...[[505, 620], [535, 720], [560, 810], [700, 620], [720, 720], [730, 810]].map(([x, y], k) => ({
              pencil: `M${x} ${y} l1 1`, color: RED, width: 18, z: 0.6, at: "rivets,", after: k * 0.1, draw: 0.04,
            })),
            { ...plate("horn", 0.6002, 0.0458, 0.0999), at: "corne" },
            { pencil: "M630 450 C620 370 760 360 765 420 C770 480 640 500 625 440", color: RED, width: 7, z: 0.6, at: "dos.", draw: 0.25 },
          ],
        },
      ],
      sfx: [
        { word: "armure,", src: "sfx/accents/thud.wav", volume: 0.5 },
        { word: "armure,", after: 0.2, src: "sfx/accents/thud.wav", volume: 0.45 },
        { word: "armure,", after: 0.4, src: "sfx/accents/thud.wav", volume: 0.45 },
        { word: "armure,", after: 0.55, src: "sfx/accents/thud.wav", volume: 0.4 },
        ...[0, 0.1, 0.2, 0.3, 0.4, 0.5].map((after, k) => ({ word: "rivets,", after, src: `sfx/story/pick-${(k % 3) + 1}.wav`, volume: 0.4 })),
        { word: "corne", src: "sfx/accents/thud.wav", volume: 0.55 },
        { word: "dos.", src: "sfx/accents/pencil-2.wav", volume: 0.45 },
      ],
      beat: { pose: "point-up", x: 230 },
    },
    {
      // One take: the ship sails toward the Pope, goes down with the rhino on deck; only Dürer's sheet comes up.
      id: "d4", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "le", in: "cut", carry: true, shake: "coule.", cam: { from: [0, 0, 1], to: [0, 0, 1] },
          source: "Bruegel, Armed Three-Master; Burgkmair, Rhinoceros, 1515; Raphael, Leo X (Uffizi); Dürer, Rhinocerus, 1515",
          layers: [
            { field: "#D8CFB8", dots: "tl", paper: CRUMPLED },
            { src: `${ART}/pope.png`, x: 690, y: 700, w: 340, z: 0.35, at: "pape.", enter: "rise" },
            { tag: "LÉON X", size: 44, x: 780, y: 620, rot: 2, z: 0.95, at: "pape.", after: 0.15 },
            { src: `${ART}/ship.png`, x: -40, y: 240, w: 560, z: 0.5, enter: "none", route: [[0, 110, 0, 5, 0.3], [2.2, 0, 430, 21, 0.08]] },
            { src: `${ART}/real.png`, x: 90, y: 640, w: 340, z: 0.52, enter: "none", route: [[0, 110, 0, 5, 0.3], [2.2, 0, 430, 21, 0.08]] },
            { src: `${ART}/print.jpg`, x: 270, y: 640, w: 480, rot: -4, z: 0.6, at: "il", enter: "rise" },
            { fore: "bottom", color: SEA, y: 1040, z: 0.7, at: "le" },
          ],
        },
      ],
      sfx: [
        { word: "le", src: "sfx/accents/page-1.wav", volume: 0.3 },
        { word: "pape.", src: "sfx/accents/swish-2.wav", volume: 0.35 },
        { word: "coule.", src: "sfx/story/pour.wav", volume: 0.6 },
        { word: "coule.", src: "sfx/accents/thud.wav", volume: 0.5 },
        { word: "il", src: "sfx/accents/page-2.wav", volume: 0.4 },
      ],
      beat: { pose: "scared", x: 230 },
    },
    {
      // Burgkmair's whole print, truer; and the number of copies left.
      id: "d5", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "un", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.03] },
          source: "Hans Burgkmair, Rhinoceros, woodcut, 1515 (Albertina)",
          layers: [
            { field: "#E2D3B5", dots: "br", paper: CRUMPLED },
            { src: `${ART}/burgkmair.jpg`, x: 60, y: 250, w: 960, rot: -1, z: 0.5, enter: "none" },
            { name: ["Hans Burgkmair", "Augsbourg, 1515"], size: 40, x: 60, y: 920, rot: -2, z: 0.9, at: "burgkmair," },
            { big: "1", size: 220, color: RED, x: 780, y: 880, z: 0.9, at: "seul" },
            { tape: "EXEMPLAIRE AU MONDE", size: 44, x: 60, y: 1040, rot: -2, z: 0.95, at: "exemplaire." },
          ],
        },
      ],
      sfx: [
        { word: "burgkmair,", src: "sfx/accents/page-1.wav", volume: 0.4 },
        { word: "seul", src: "sfx/accents/thud.wav", volume: 0.6 },
      ],
      beat: { pose: "explaining", x: 230 },
    },
    {
      // Copies stamped one after another, like a press; the bronze door of Pisa lands over them.
      id: "d6", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "celui", in: "cut", carry: true, shake: "cathédrale", cam: { from: [0, 0, 1], to: [0, 0, 1.03] },
          source: "Dürer, Rhinocerus, 1515; door of Pisa Cathedral, school of Giambologna, c. 1602",
          layers: [
            { field: RED, dots: "tl", paper: CRUMPLED },
            ...[[40, 250], [370, 260], [690, 250], [30, 480], [360, 490], [680, 480], [40, 710], [370, 720], [680, 710], [30, 940], [360, 950], [650, 940]].map(([x, y], k) => ({
              src: `${ART}/durer.png`, x, y, w: 330, rot: (k % 3) - 1, z: 0.4, at: "celui", after: k * 0.2, enter: "slap" as const,
            })),
            { src: `${ART}/pisa.jpg`, x: 90, y: 480, w: 880, rot: -2, z: 0.8, at: "cathédrale", enter: "slap" },
            { tag: "PISE · VERS 1602", size: 44, x: 110, y: 1060, rot: -2, z: 0.95, at: "pise." },
          ],
        },
      ],
      sfx: [
        ...[0, 0.4, 0.8, 1.2, 1.6, 2].map((after) => ({ word: "celui", after, src: "sfx/accents/shutter.wav", volume: 0.35 })),
        { word: "cathédrale", src: "sfx/accents/thud.wav", volume: 0.6 },
      ],
      beat: { pose: "amazed", x: 230 },
    },
    {
      // Oudry's Clara in her frame; Dürer's rhino walks up and stands nose to nose with the real one.
      id: "d7", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "en", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.03] },
          source: "Jean-Baptiste Oudry, Clara, 1749 (Staatliches Museum Schwerin); Dürer, Rhinocerus, 1515",
          layers: [
            { field: "#24180F", dots: "tl", paper: CRUMPLED },
            { src: `${ART}/oudry.jpg`, x: 300, y: 300, w: 760, z: 0.4, gilt: true, enter: "none" },
            { src: `${ART}/durer.png`, x: -400, y: 420, w: 400, z: 0.7, at: "oudry", enter: "none", walk: [400, 0, 4, 0.14] },
            { tag: "CLARA · 1749", size: 48, x: 640, y: 930, rot: 2, z: 0.95, at: "rhinocéros," },
          ],
        },
      ],
      sfx: [
        { word: "en", src: "sfx/accents/thud.wav", volume: 0.5 },
        { word: "oudry", src: "sfx/story/steps.wav", volume: 0.45 },
      ],
      beat: { pose: "point-up", x: 230 },
    },
    {
      // A school exercise book: the same armoured rhino pasted in it, and the years riffling past.
      id: "d8", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "trop", in: "cut", carry: true, shake: "dürer.", cam: { from: [0, 0, 1], to: [0, 0, 1.04] },
          source: "Dürer, Rhinocerus, 1515",
          layers: [
            { bg: "art/paper/graph.jpg" },
            { src: `${ART}/print.jpg`, x: 90, y: 300, w: 860, rot: -2, z: 0.5, enter: "none" },
            { note: "le rhinocéros", size: 60, x: 90, y: 985, w: 420, rot: -3, z: 0.8, at: "manuels" },
            { stamp: "TOUJOURS FAUX", size: 84, x: 90, y: 520, rot: -8, z: 0.95, at: "dürer." },
          ],
        },
      ],
      sfx: [
        { word: "trop", src: "sfx/accents/page-3.wav", volume: 0.45 },
        { word: "manuels", src: "sfx/accents/pencil-1.wav", volume: 0.4 },
        { word: "dürer.", src: "sfx/accents/thud.wav", volume: 0.6 },
      ],
      beat: { pose: "whisper", x: 230 },
    },
    {
      // The sea again, Dürer's sheet alone on it; then the flight back to frame 0.
      id: "d9", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "le", in: "cut", until: "gardé", cam: { from: [0, 0, 1], to: [0, 0, 1.06] },
          source: "Dürer, Rhinocerus, 1515",
          layers: [
            { field: "#D8CFB8", dots: "tl", paper: CRUMPLED },
            { src: `${ART}/print.jpg`, x: 170, y: 480, w: 740, rot: -3, z: 0.5, enter: "none" },
            { fore: "bottom", color: SEA, y: 1040, z: 0.7, at: "le" },
          ],
        },
      ],
      sfx: [
        { word: "l'europe", src: "sfx/accents/swish-2.wav", volume: 0.4 },
      ],
      beat: { pose: "explaining", x: 230 },
    },
  ],
});
