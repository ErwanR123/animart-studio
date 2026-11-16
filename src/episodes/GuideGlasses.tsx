import { createGuideEpisode, type Voice } from "../guide/engine";
import voice from "../../public/voice/GuideGlasses.json";

// Glasses on the floor of SFMOMA (May 2016), then Duchamp's *Fontaine* (1917). Thesis: the place makes the work.
// Facts (5 Nov. 2026): Today, Rheana Murray, 27 May 2016 (TJ Khayatan, 17, and Kevin Nguyen, 16, "is this really art?",
// "we put down Kevin's glasses", the crowd, "some even crouching down to take photos", tweet of 24 May 2016); NPR, Atlas
// Obscura and Business Insider seen in search extracts only (they differ on whose glasses, hence "d'un ado").
// Fontaine: Wikipedia EN/FR "Fountain (Duchamp)" (signed "R. Mutt 1917", Society of Independent Artists, New York,
// April 1917, never placed in the show, "ce n'est pas une œuvre d'art"; only image of the original: Stieglitz's photo);
// BBC, Dec. 2004 (poll of 500 art experts: the most influential modern artwork). The attribution to Elsa von
// Freytag-Loringhoven is argued by some, with no documentary evidence: we say Duchamp. "L'endroit où on le met" is our
// reading of the readymade.
// Images (public/art/SOURCES.md): the teens' own photos (teejay / Kevin Nguyen, via Today), Stieglitz's photo of Fontaine.
// Music: Scott Joplin, Maple Leaf Rag (his 1916 piano roll).
const ART = "art/glasses";
const CRUMPLED = "art/paper/crumpled.jpg";
const CREAM = "#EDE5D3";
const RED = "#B8261B";
const FULL = { z: 1, fx: 0.5, fy: 0.5 };
// Frame 0 and the loop's last frame: the real photo, the crowd and the glasses, full screen.
const OPEN = { z: 1.09, fx: 0.5, fy: 0.353 };
// The whole gallery as a layer, same place in every shot, so the glasses stay where they were.
const GALLERY = { x: 0, y: 60, w: 1080, z: 0.3, enter: "none" as const };
// The years riffling from the tweet back to Duchamp.
const riffle = Array.from({ length: 19 }, (_, k) => [["d3", "mais"], String(2016 - k * 5), 0.05 + k * 0.05] as [[string, string], string, number]);

export const guideGlasses = createGuideEpisode({
  voiceFile: "voice/GuideGlasses.mp3",
  voice: voice as Voice,
  image: { src: `${ART}/cover.jpg`, width: 2160, height: 5440 },
  maxWidth: 1000,
  climb: true,
  climbFrom: "start",
  openView: FULL,
  openPose: "amazed",
  music: "music/maple-leaf-rag.mp3",
  tight: true,
  palette: { paper: CREAM, accent: RED, hl: "#F4C531" },
  cold: [
    { view: OPEN, tapes: ["ILS CROIENT VOIR UNE ŒUVRE"], y: 1700, size: 54 },
    // Under the hook's shot, the cover's dark strip only.
    { word: "ce", view: { z: 3, fx: 0.5, fy: 0.95 } },
  ],
  // The last line ("… ou une œuvre ?") runs straight into the first ("Tout le monde croit que c'est une œuvre.").
  loop: { word: "ou", view: OPEN, full: true },
  header: "SFMOMA · 2016",
  title: ["Les lunettes", "par terre"],
  calendar: {
    pages: [...riffle, [["d3", "ans."], "1917"]],
    until: ["d4", "marcel"],
  },
  lead: {
    hook: {
      shots: [
        {
          // The cut lands on what they are looking at: a pair of glasses on the floor.
          word: "ce", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          source: "TJ Khayatan, the glasses on the floor of SFMOMA, 2016",
          layers: [
            { src: `${ART}/glasses-photo.jpg`, x: 0, y: 0, w: 1080, z: 0.5, enter: "none" },
            { tape: "LES LUNETTES D'UN ADO", size: 58, x: 130, y: 1000, rot: -2, z: 0.95, at: "lunettes" },
          ],
        },
      ],
      sfx: [
        { word: "ce", src: "sfx/accents/shutter.wav", volume: 0.5 },
        { word: "lunettes", src: "sfx/accents/tape.wav", volume: 0.5 },
      ],
    },
    context: {
      shots: [
        {
          word: "san", in: "cut", carry: true, cam: { from: [20, 0, 1.03], to: [-20, 0, 1.03] },
          source: "SFMOMA from Yerba Buena Gardens, 2017; the teens' own photo, 2016",
          layers: [
            { field: CREAM, dots: "tr", paper: CRUMPLED },
            { src: `${ART}/sfmoma.jpg`, x: 0, y: 230, w: 1080, z: 0.3, enter: "none" },
            { tag: "SAN FRANCISCO · MAI 2016", size: 44, x: 60, y: 260, rot: -2, z: 0.95, at: "2016." },
            { src: `${ART}/teens.png`, x: 360, y: 500, w: 270, z: 0.7, at: "deux", enter: "rise" },
            { fore: "bottom", color: "#5A3C25", y: 1120, z: 0.8, at: "san" },
          ],
        },
        {
          // Their own photo, under a piece in the museum, wondering.
          word: "devant", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.04] },
          source: "The teens' own photo, SFMOMA, 2016 (Kevin Nguyen, via Today)",
          layers: [
            { field: "#E2D3B5", dots: "br", paper: CRUMPLED },
            { src: `${ART}/museum.jpg`, x: 190, y: 220, w: 700, rot: -1, z: 0.4, enter: "none" },
            { tape: "C'EST VRAIMENT DE L'ART ?", size: 56, x: 90, y: 960, rot: -3, z: 0.95, at: "demandent" },
          ],
        },
      ],
      sfx: [
        { word: "san", src: "sfx/accents/page-1.wav", volume: 0.35 },
        { word: "deux", src: "sfx/story/steps.wav", volume: 0.4 },
        { word: "devant", src: "sfx/accents/page-2.wav", volume: 0.4 },
        { word: "demandent", src: "sfx/accents/tape.wav", volume: 0.5 },
      ],
      poses: [{ word: "san", pose: "explaining" }, { word: "devant", pose: "shrug" }],
    },
  },
  details: [
    {
      // The empty floor; a hand lays the glasses down and leaves; the two teens back away.
      id: "d1", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "alors", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.03] },
          source: "The floor of SFMOMA, the teens' photo, the glasses taken off and laid back on; hand from Quatre études de mains (French school)",
          layers: [
            { src: `${ART}/floor.jpg`, x: 0, y: 0, w: 1080, z: 0.3, enter: "none" },
            { src: `${ART}/teens.png`, x: 40, y: 400, w: 280, z: 0.6, at: "alors", enter: "rise", route: [[2.65, -480, 0, 4, 0.13]] },
            { src: `${ART}/glasses.png`, x: 370, y: 640, w: 400, z: 0.5, at: "lunettes", after: 0.15, enter: "pop" },
            { src: "art/louis-heart/hand.png", x: -760, y: 500, w: 620, z: 0.8, at: "posent", enter: "none", route: [[0, 800, 40, 1, 0.14], [0.65, -1000, -40, 1, 0.16]] },
          ],
        },
      ],
      sfx: [
        { word: "test.", src: "sfx/accents/page-3.wav", volume: 0.4 },
        { word: "posent", src: "sfx/accents/swish-1.wav", volume: 0.45 },
        { word: "lunettes", after: 0.15, src: "sfx/accents/thud.wav", volume: 0.4 },
        { word: "reculent.", src: "sfx/story/steps.wav", volume: 0.45 },
      ],
      beat: { pose: "point-up", x: 230 },
    },
    {
      // The empty gallery, the glasses tiny on the floor: the visitors walk in one by one; on "photographier" the flash
      // and the real photo.
      id: "d2", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "très", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1] },
          source: "The teens' photo at SFMOMA, 2016 (teejay, via Today); the people cut from it, the room rebuilt without them",
          layers: [
            { src: `${ART}/empty.jpg`, ...GALLERY },
            { src: `${ART}/crowd.png`, x: -320, y: 200, w: 285, z: 0.6, at: "foule", enter: "none", walk: [790, 0, 5, 0.12] },
            { src: `${ART}/man.png`, x: -300, y: 130, w: 270, z: 0.65, at: "arrive.", enter: "none", walk: [370, 0, 4, 0.12] },
            { src: `${ART}/crowd-photo.jpg`, ...GALLERY, z: 0.8, at: "photographier." },
            { flash: 2, at: "photographier." },
          ],
        },
      ],
      sfx: [
        { word: "foule", src: "sfx/story/steps.wav", volume: 0.5 },
        { word: "arrive.", src: "sfx/story/steps.wav", volume: 0.45 },
        { word: "photographier.", src: "sfx/accents/shutter.wav", volume: 0.7 },
      ],
      beat: { pose: "amazed", x: 230 },
    },
    {
      // The photo is copied everywhere, the teen's tweet on tape; then the years riffle back.
      id: "d3", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "la", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.03] },
          source: "The teens' photo; TJ Khayatan's tweet, 24 May 2016",
          layers: [
            { field: "#E2D3B5", dots: "tl", paper: CRUMPLED },
            ...[[60, 260, -3], [520, 240, 2], [40, 680, 3], [500, 660, -2]].map(([x, y, rot], k) => ({
              src: `${ART}/crowd-photo.jpg`, x, y, w: 460, rot, z: 0.4 + k * 0.02, at: "photo", after: k * 0.22, enter: "slap" as const,
            })),
            { tape: "« ON A MIS DES LUNETTES PAR TERRE »", size: 42, x: 50, y: 1060, rot: -2, z: 0.95, at: "d'internet." },
          ],
        },
      ],
      sfx: [
        ...[0, 0.22, 0.44, 0.66].map((after) => ({ word: "photo", after, src: "sfx/accents/shutter.wav", volume: 0.4 })),
        { word: "mais", src: "sfx/accents/swish-2.wav", volume: 0.4 },
      ],
      beat: { pose: "explaining", x: 230 },
    },
    {
      // Signature: the same real photo, the same people, and in their sight the glasses become Duchamp's urinal.
      id: "d4", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "en", in: "cut", carry: true, shake: "urinoir", cam: { from: [0, 0, 1], to: [0, 0, 1.03] },
          source: "The teens' photo, 2016; Stieglitz's photo of Fontaine, 1917; Duchamp at the Broadway Photo Shop, New York, 1917",
          layers: [
            { src: `${ART}/crowd-photo.jpg`, ...GALLERY },
            { src: `${ART}/duchamp.jpg`, x: 620, y: 230, w: 330, rot: 3, z: 0.6, at: "marcel", enter: "pop" },
            { name: ["Marcel Duchamp", "New York, 1917"], size: 36, x: 620, y: 620, rot: -2, z: 0.9, at: "duchamp" },
            { src: `${ART}/urinal.png`, x: 620, y: 760, w: 340, z: 0.7, at: "urinoir", enter: "slap" },
            { tape: "SIGNÉ « R. MUTT »", size: 46, x: 60, y: 1060, rot: -2, z: 0.95, at: "signé" },
          ],
        },
      ],
      sfx: [
        { word: "marcel", src: "sfx/accents/page-1.wav", volume: 0.4 },
        { word: "urinoir", src: "sfx/accents/thud.wav", volume: 0.7 },
        { word: "signé", src: "sfx/accents/pencil-3.wav", volume: 0.45 },
      ],
      beat: { pose: "whisper", x: 230 },
    },
    {
      // "Pas une œuvre d'art": the stamp; the shot goes dark, hidden; then today, Stieglitz's photo in a gilt frame.
      id: "d5", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "scandale", in: "cut", carry: true, shake: "scandale", cam: { from: [0, 0, 1], to: [0, 0, 1.02] },
          source: "Stieglitz's photo of Fontaine, 1917; the committee's words",
          layers: [
            { field: RED, dots: "tl", paper: CRUMPLED },
            { src: `${ART}/urinal.png`, x: 150, y: 420, w: 780, z: 0.5, enter: "none" },
            { stamp: "PAS UNE ŒUVRE D'ART", size: 70, x: 90, y: 280, rot: -6, z: 0.95, at: "scandale" },
            { veil: 0.96, color: "#141311", z: 0.99, at: "cache." },
          ],
        },
        {
          word: "aujourd'hui,", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.04] },
          source: "Alfred Stieglitz, Fontaine, 1917; BBC, Dec. 2004",
          layers: [
            { field: "#24180F", dots: "br", paper: CRUMPLED },
            { src: `${ART}/fountain.jpg`, x: 220, y: 240, w: 620, z: 0.4, gilt: true, enter: "none" },
            { tape: "N° 1 : 500 EXPERTS, 2004", size: 50, x: 150, y: 1050, rot: -2, z: 0.95, at: "influentes" },
          ],
        },
      ],
      sfx: [
        { word: "scandale", src: "sfx/accents/thud.wav", volume: 0.6 },
        { word: "cache.", src: "sfx/accents/swish-4.wav", volume: 0.5 },
        { word: "influentes", src: "sfx/accents/tape.wav", volume: 0.5 },
      ],
      beat: { pose: "amazed", x: 230 },
    },
    {
      // The idea, literally: the same urinal among the tiles, then on the museum's wall.
      id: "d6", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "son", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1] },
          source: "Stieglitz's photo of Fontaine, 1917; the gallery of SFMOMA, 2016",
          layers: [
            { bg: "art/paper/graph.jpg" },
            { src: `${ART}/urinal.png`, x: 200, y: 400, w: 680, z: 0.4, enter: "none" },
            { src: `${ART}/empty.jpg`, ...GALLERY, y: -20, z: 0.6, at: "l'endroit" },
            { src: `${ART}/urinal.png`, x: 130, y: 170, w: 500, z: 0.7, at: "l'endroit", enter: "none" },
            { tag: "FONTAINE · 1917", size: 44, x: 640, y: 480, rot: 2, z: 0.9, at: "met." },
          ],
        },
      ],
      sfx: [
        { word: "l'endroit", src: "sfx/accents/page-2.wav", volume: 0.5 },
        { word: "met.", src: "sfx/accents/tape.wav", volume: 0.4 },
      ],
      beat: { pose: "point-up", x: 230 },
    },
    {
      // Back on the glasses: the question, then the flight to frame 0.
      id: "d7", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "alors", in: "cut", until: "ou", cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          source: "TJ Khayatan, the glasses on the floor of SFMOMA, 2016",
          layers: [
            { src: `${ART}/glasses-photo.jpg`, x: 0, y: 0, w: 1080, z: 0.5, enter: "none" },
            { tape: "UNE BLAGUE…", size: 72, x: 120, y: 320, rot: -3, z: 0.95, at: "blague…" },
          ],
        },
      ],
      sfx: [
        { word: "blague…", src: "sfx/accents/tape.wav", volume: 0.5 },
      ],
      beat: { pose: "shrug", x: 230 },
    },
  ],
});
