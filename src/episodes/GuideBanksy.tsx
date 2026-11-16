import { createGuideEpisode, type Voice } from "../guide/engine";
import voice from "../../public/voice/GuideBanksy.json";

// Banksy, Girl with Balloon → Love is in the Bin. Format "Les questions…": a viral hook (the real footage of the
// shredding on frame 0), then the story in order: the trap set years before, the why, the sale, the paradox.
// Facts (28 Oct. 2026; Wikipedia "Love Is in the Bin", The Art Newspaper, Guardian, CNN, NBC, KQED, LBC):
// - Banksy sold the canvas to a collector years before (Sotheby's 2018 catalogue: "acquired directly from the artist
//   in 2006", a date The Art Newspaper questions: the script says "des années plus tôt");
// - Banksy on Instagram: "A few years ago I secretly built a shredder into a painting in case it was ever put up for
//   auction";
// - he mocks the art market: the print "I can't believe you morons actually buy this shit" (2007, an auction room);
//   the voice translates it softened ("abrutis … ça"), the English stays on screen;
// - Sotheby's London, 5 Oct. 2018: sold for £1,042,000; the shredder in the frame shreds about half the canvas and
//   stops; resold at Sotheby's London on 14 Oct. 2021 for £18,582,000, a record for Banksy.
// Footage: Banksy's own videos (banksyfilm), cut into public/clips/banksy. Music: Grieg, In the Hall of the Mountain
// King (Musopen), its outburst on "la broyeuse se déclenche".
// Kept sober after the over-built version was rejected: one idea per shot, each piece shown once (the hoodie, the
// print and the paper shredder are not repeated except the closing callback).
const ART = "art/banksy";
const CLIP = "clips/banksy";
const KRAFT = "art/paper/kraft.jpg";
const DARK = "art/paper/dark.jpg";
const RED = "#D7261E";
const FULL = { z: 0.6, fx: 0.5, fy: 0.5 };
// The canvas in its frame, 520 px wide (the print is 473 × 679).
const GIRL = { shredder: `${ART}/girl.jpg`, ratio: 679 / 473, strips: 16, x: 280, y: 110, w: 520, z: 0.5, enter: "none" as const };
// The art market as a share price: famous paintings (small framed thumbnails, art/banksy/stack) pile up in five
// columns, each taller than the last, and the red curve climbs along their tops.
const piece = (f: number, x: number, y: number, rot: number, k: number) => ({
  src: `${ART}/stack/${String(f).padStart(2, "0")}.jpg`, x, y, w: 140, rot, z: 0.5, at: "déteste", after: k * 0.13,
});
const STACK = [
  piece(7, 120, 953, -4, 0),
  piece(1, 300, 964, 3, 1),
  piece(9, 300, 870, -2, 2),
  piece(11, 480, 958, 5, 3),
  piece(13, 480, 875, -3, 4),
  piece(8, 480, 781, 2, 5),
  piece(12, 660, 947, -5, 6),
  piece(10, 660, 833, 4, 7),
  piece(4, 660, 793, -1, 8),
  piece(2, 660, 670, 3, 9),
  piece(3, 840, 906, -4, 10),
  piece(0, 840, 722, 2, 11),
  piece(14, 840, 559, 5, 12),
  piece(6, 840, 386, -3, 13),
  piece(5, 840, 185, 1, 14),
];

export const guideBanksy = createGuideEpisode({
  voiceFile: "voice/GuideBanksy.mp3",
  voice: voice as Voice,
  image: { src: `${ART}/girl.jpg`, width: 473, height: 679 },
  maxWidth: 1000,
  climb: true,
  climbFrom: "start",
  openView: FULL,
  openPose: "amazed",
  music: "music/mountain-king.mp3",
  tight: true,
  header: "BANKSY · 2018",
  title: ["Le tableau", "autodétruit"],
  palette: { paper: "#EDE5D3", accent: RED, hl: "#F4C531" },
  calendar: {
    pages: [
      [["d3", "octobre"], "5 OCT. 2018"],
      [["d4", "trois"], "OCT. 2019"],
      [["d4", "trois"], "OCT. 2020", 0.12],
      [["d4", "trois"], "14 OCT. 2021", 0.24],
    ],
    until: ["d5", "le"],
  },
  lead: {
    hook: {
      shots: [
        {
          // Frame 0: the real room, the canvas already coming out in strips; the promise written over it.
          word: "ce", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 30, 1.08] },
          layers: [
            { bg: "#151413" },
            { footage: `${CLIP}/shred-room.mp4`, h: 1400, volume: 0.22, x: 0, y: -200, w: 1080, z: 0.4, enter: "none" },
            { tape: "VENDU 1 000 000 £…", size: 84, x: 70, y: 70, rot: -3, z: 0.95, enter: "none" },
            { stamp: "AUTODÉTRUIT", size: 110, x: 60, y: 980, rot: -8, z: 0.95, at: "devant" },
          ],
        },
      ],
      poses: [{ word: "devant", pose: "scared" }],
    },
    context: {
      shots: [
        {
          // Years before, the deal as a little paper play: Banksy (a stencil, his face a void) walks in with the
          // canvas, a Daumier banker waddles in from the other side, and the painting and a wad of notes cross.
          word: "des", in: "slide", carry: true, cam: { from: [0, 0, 1], to: [0, 20, 1.05] },
          layers: [
            { bg: KRAFT },
            { tape: "DES ANNÉES PLUS TÔT", size: 56, x: 250, y: 130, rot: -2, z: 0.95, enter: "none" },
            { src: `${ART}/stencil.png`, x: -380, y: 330, w: 410, z: 0.5, at: "banksy", enter: "none", walk: [410, 0, 4, 0.18] },
            { src: `${ART}/banker.png`, x: 1100, y: 340, w: 420, z: 0.5, at: "avait", enter: "none", walk: [-460, 0, 3, 0.18] },
            { src: `${ART}/girl.jpg`, x: -146, y: 527, w: 230, rot: -3, z: 0.55, at: "banksy", enter: "none", gilt: true, route: [[0, 410, 0, 4, 0.18], [3.4, 500, 70, 3, 0.14]] },
            { name: ["Banksy"], size: 60, x: 70, y: 230, rot: -3, z: 0.95, at: "banksy", after: 0.7 },
            { big: "?", size: 150, color: RED, x: 198, y: 387, z: 0.9, at: "personne" },
            { src: `${ART}/wad.png`, x: 852, y: 520, w: 170, rot: 6, z: 0.6, at: "toile", enter: "pop", route: [[0.05, -558, 114, 3, 0.14]] },
            { note: "un collectionneur", size: 52, x: 620, y: 220, w: 420, rot: 3, z: 0.95, at: "collectionneur" },
          ],
        },
      ],
      sfx: [
        { word: "banksy", src: "sfx/accents/swish-1.wav", volume: 0.4 },
        { word: "toile", src: "sfx/story/coins.wav", volume: 0.35 },
      ],
      poses: [{ word: "des", pose: "explaining" }],
    },
  },
  details: [
    {
      // The trap: his own footage of the shredder being built, then his own words, typed, the clause highlighted.
      id: "d1", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "mais", in: "push", cam: { from: [0, 0, 1], to: [0, 30, 1.07] },
          layers: [
            { bg: KRAFT },
            // Through the airport scanner: the X-ray finds the blades hidden in the frame's bottom rail.
            { xray: `${ART}/girl.jpg`, ratio: 679 / 473, start: 1.2, dur: 1.3, x: 310, y: 130, w: 460, z: 0.5, enter: "slap" },
            { tape: "UNE BROYEUSE… DANS LE CADRE", size: 50, x: 100, y: 930, rot: 2, z: 0.95, at: "cadre" },
          ],
        },
        {
          word: "au", in: "slide", carry: true, cam: { from: [0, 0, 1], to: [-30, 20, 1.08] },
          layers: [
            { bg: DARK },
            { doc: "A few years ago I secretly built a shredder into a painting\n\nin case it was ever put up for auction…", face: "typed", head: "@banksy", mark: "in case it was ever put up for auction", cue: "au", size: 62, x: 60, y: 230, w: 960, z: 0.5, enter: "slap" },
            { tape: "BANKSY, SUR INSTAGRAM", size: 50, x: 120, y: 140, rot: -3, z: 0.95, enter: "none" },
          ],
        },
      ],
      sfx: [{ word: "broyeuse", src: "sfx/accents/tape.wav", volume: 0.45 }],
      beat: { pose: "whisper", x: 230 },
    },
    {
      // Why: the art market as a share price, paintings piled up under the climbing curve; then his own print, the
      // line highlighted and translated.
      id: "d2", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "parce", in: "slide", cam: { from: [0, 0, 1], to: [0, -30, 1.05] },
          layers: [
            { bg: KRAFT },
            { pencil: "M80 260 L80 1045 L1010 1045", color: "#2a2420", width: 7, draw: 0.4 },
            { tape: "COTE DE L'ART", size: 56, x: 110, y: 130, rot: -3, z: 0.95, at: "parce" },
            ...STACK,
            { pencil: "M110 960 C150 940 170 925 190 920 S330 850 370 840 S510 760 550 750 S690 655 730 640 S860 330 910 150", width: 12, at: "déteste", draw: 2.0 },
            // The arrowhead once the curve has reached the top (each subpath of one path would draw at once).
            { pencil: "M860 190 L910 150 L925 210", width: 12, at: "déteste", after: 2.0, draw: 0.15 },
            { note: "placement pour riches", size: 54, x: 120, y: 300, w: 520, rot: -2, z: 0.95, at: "placement" },
          ],
        },
        {
          word: "il", in: "push", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.02] },
          layers: [
            { bg: DARK },
            { src: `${ART}/morons.png`, x: 40, y: 150, w: 1000, rot: -1, z: 0.5, enter: "slap" },
            { tape: "BANKSY, 2007", size: 52, x: 160, y: 110, rot: -3, z: 0.95, at: "peint" },
            // The glass slides onto the line he wrote on the canvas inside the print.
            { loupe: [480, 620, 175], zoom: 2.0, to: [850, 420], glide: 0.4, at: "message" },
            { note: "« Je n'arrive pas à croire que vous, abrutis, achetiez ça. »", size: 54, x: 90, y: 900, w: 900, rot: -1, z: 0.95, at: "je" },
          ],
        },
      ],
      sfx: [
        { word: "déteste", src: "sfx/accents/pencil-2.wav", volume: 0.45 },
        { word: "message", src: "sfx/accents/pencil-3.wav", volume: 0.4 },
      ],
      beat: { pose: "skeptical", x: 230 },
    },
    {
      // The sale: Sotheby's, the real hammer, then the paper canvas through the shredder on the music's outburst.
      id: "d3", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          // One shot, the real auctioneer the whole time: the house's name pops up on "Sotheby's", then his
          // hammer comes down on "adjugé" (the clip is cut, its first frame
          // held 0.8 s, so the strike lands there).
          word: "octobre", in: "whip", cam: { from: [0, 0, 1], to: [0, 0, 1.06] },
          layers: [
            { bg: "#151413" },
            { footage: `${CLIP}/hammer.mp4`, h: 1400, volume: 0.2, x: 0, y: 0, w: 1080, z: 0.4, enter: "none" },
            { src: `${ART}/sothebys.png`, x: 110, y: 90, w: 560, z: 0.9, at: "sotheby's", enter: "pop" },
          ],
        },
        {
          word: "et", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 60, 1.1] },
          shake: "déclenche",
          layers: [{ bg: DARK }, { ...GIRL, start: 0.75, dur: 1.0, stop: 0.55 }],
        },
      ],
      sfx: [
        { word: "octobre", src: "sfx/accents/swish-2.wav", volume: 0.45 },
        { word: "sotheby's", src: "sfx/accents/swish-4.wav", volume: 0.35 },
        { word: "déclenche", src: "sfx/story/shredder.wav", volume: 0.7 },
      ],
      beat: { pose: "explaining", x: 230 },
      poses: [{ word: "et", pose: "scared" }],
    },
    {
      // It jams halfway; three years on, the half-shredded canvas sells for 18 times the price.
      id: "d4", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "sauf", in: "cut", cam: { from: [0, 60, 1.1], to: [0, 40, 1.14] },
          layers: [
            { bg: DARK },
            // The jam: the frame shudders, smoke puffs out of the bottom rail, one strip stuck and trembling.
            { ...GIRL, start: -1, dur: 0.01, stop: 0.55, jam: 0.05 },
            { stamp: "BLOQUÉ", size: 150, x: 260, y: 520, rot: -10, z: 0.95, at: "bloque" },
          ],
        },
        {
          word: "trois", in: "slide", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          layers: [
            { bg: KRAFT },
            // On "dix-huit" the hanging strips flip over one by one into banknotes: the destruction became money.
            { ...GIRL, x: 370, y: 250, w: 340, start: -1, dur: 0.01, stop: 0.55, bills: 2.5, enter: "slap" },
            { tape: "LOVE IS IN THE BIN", size: 54, x: 50, y: 320, rot: -4, z: 0.95, at: "l'œuvre" },
            { counter: [1042000, 18582000], suffix: " £", size: 110, color: "accent", dur: 0.9, x: 70, y: 110, z: 0.95, at: "dix-huit" },
          ],
        },
      ],
      sfx: [{ word: "dix-huit", src: "sfx/story/coins.wav", volume: 0.55 }],
      beat: { pose: "amazed", x: 230 },
    },
    {
      // The paradox: the auction he mocked in 2007 came true (the half-shredded canvas lands on the easel of his own
      // print, a price tag swings from it); then the question on a balance, the two characters of the deal back on
      // its pans, Banksy against the collector, tipping one way, the other, and settling level.
      id: "d5", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "le", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [-60, 20, 1.12] },
          layers: [
            { bg: DARK },
            { src: `${ART}/morons.png`, x: 40, y: 150, w: 1000, rot: -1, z: 0.5, enter: "none" },
            { tape: "BANKSY, 2007", size: 52, x: 160, y: 110, rot: -3, z: 0.95, enter: "none" },
            { src: `${ART}/bin.png`, x: 750, y: 170, w: 220, rot: 2, z: 0.6, at: "transformé", enter: "slap" },
            { pricetag: "18 582 000 £", size: 46, x: 470, y: 130, w: 300, z: 0.9, at: "en", enter: "none" },
          ],
        },
        {
          word: "alors", in: "whip", cam: { from: [0, 0, 1], to: [0, 0, 1.04] },
          layers: [
            { bg: KRAFT },
            { scales: [`${ART}/stencil.png`, `${ART}/banker.png`], keys: [[0, 0], [1.05, 0], [1.35, -14], [2.05, -14], [2.4, 14], [2.9, -6], [3.3, 3], [3.7, 0]], x: 40, y: 140, w: 1000, z: 0.5, enter: "none" },
            { name: ["Banksy"], size: 56, x: 70, y: 150, rot: -3, z: 0.95, at: "banksy" },
            { name: ["Les abrutis"], size: 56, x: 540, y: 150, rot: 2, z: 0.95, at: "abrutis" },
          ],
        },
      ],
      sfx: [
        { word: "transformé", src: "sfx/accents/thud.wav", volume: 0.4 },
        { word: "record", src: "sfx/accents/swish-3.wav", volume: 0.4 },
      ],
      beat: { pose: "shrug", x: 230 },
    },
  ],
});
