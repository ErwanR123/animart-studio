import { createGuideEpisode, type Voice } from "../guide/engine";
import voice from "../../public/voice/GuideHomecoming.json";

// Norman Rockwell, Homecoming G.I. (Saturday Evening Post cover, 26 May 1945; private collection), reused by the US
// Treasury as the poster of its last war bond drive, "Hasten the Homecoming". Facts checked against the Norman
// Rockwell Museum (Quick Pics: Homecoming Soldier), the Saturday Evening Post ("Rockwell Redheads", "Rockwell Files:
// Reflections of a Hero") and Christie's lot essay (the back turned to the viewer, Deborah Solomon's reading). The
// soldier's trauma and the hidden face as every family's son are the episode's reading, told as such
// (bible/script.md rule 4). The take ends on "…y voyait son fils." (its last words, "Voilà ce qui répond à la
// question :", were cut from the voice JSON: the pull-back to the poster is the loop).
// Images (public domain, public/art/SOURCES.md): the painting is cropped from the NARA scan of the poster
// (Commons "\"Hasten the Homecoming\" - NARA - 514441.jpg"), colours restored; archive photos from the US Army Signal
// Corps / NARA and the IWM; portraits of US soldiers (Medal of Honor recipients, PD US Army).
export const guideHomecoming = createGuideEpisode({
  voiceFile: "voice/GuideHomecoming.mp3",
  voice: voice as Voice,
  image: { src: "art/homecoming/homecoming.jpg", width: 3660, height: 4140 },
  maxWidth: 1000,
  climb: true,
  climbFrom: "start",
  // The whole painting, full width (the girl in green on the far left included).
  openView: { z: 0.873, fx: 0.5, fy: 0.5 },
  // The soldier cut out with rembg (BiRefNet model): he stays while the war replaces the courtyard behind him.
  figure: { src: "art/homecoming/homecoming-soldier.png", x: 0.53989, y: 0.64493, w: 0.21011, h: 0.35507 },
  tight: true,
  // The 1945 poster on a table: the video dives into it on the hook and pulls back out to it to loop.
  cover: { src: "art/homecoming/homecoming-poster.jpg", width: 1600, height: 2206, painting: { x: 0.0116, y: 0.12046, w: 0.96468, h: 0.79159 }, word: "tout" },
  loop: { word: "chaque" },
  // Pointing up at the poster above him: the first frame and, with the loop, the last.
  openPose: "point-up",
  lead: {
    // The whole street drawn running towards him.
    hook: {
      rays: {
        word: "court",
        to: { fx: 0.665, fy: 0.83, rx: 0.075, ry: 0.19 },
        from: [
          { fx: 0.51, fy: 0.53 }, // the mother
          { fx: 0.25, fy: 0.73 }, // the boy jumping off the steps
          { fx: 0.37, fy: 0.87 }, // the dog
          { fx: 0.04, fy: 0.68 }, // the girl in green, against the wall
          { fx: 0.4, fy: 0.28 }, // the man on the roof
          { fx: 0.63, fy: 0.18 }, // the neighbours at the window
          { fx: 0.85, fy: 0.13 }, // the boy in the tree
        ],
      },
      poses: [{ word: "pourquoi", pose: "thinking" }],
    },
    context: {
      // Imperial War Museum, HU 41808 (public domain).
      picture: { word: "guerre", src: "art/homecoming/ve-day-london.jpg", width: 1400, height: 998, caption: "8 mai 1945, la victoire en Europe", x: 120, y: 330, w: 620, paper: true },
      poses: [{ word: "rentre", pose: "walking" }],
    },
  },
  // From "immobile" to "ouvrait": the courtyard turns grey around him, its noise goes under water, his heart beats.
  freeze: { from: ["d3", "immobile"], to: ["d5", "chaque"], fx: 0.665, fy: 0.83, rx: 0.075, ry: 0.19 },
  ambience: { src: "sfx/story/courtyard.wav", muffled: "sfx/story/courtyard-muffled.wav", from: ["d0", "dans"], muffle: ["d3", "immobile"], clear: ["d5", "chaque"], volume: 0.35 },
  heart: { src: "sfx/story/heart.wav", from: ["d3", "immobile"], to: ["d5", "chaque"], volume: 0.9 },
  header: "NORMAN ROCKWELL · MAI 1945",
  title: ["Le retour", "du soldat."],
  // Coordinates measured on a grid over public/art/homecoming/homecoming.jpg.
  details: [
    {
      // The whole courtyard bursting with joy.
      id: "d0", fx: 0.5, fy: 0.5,
      view: { z: 0.873, fx: 0.5, fy: 0.5 },
      sfx: [{ word: "explosion", src: "sfx/story/hurray.wav", volume: 0.45 }],
      beat: { pose: "celebrating", x: 230 },
    },
    {
      id: "d1", fx: 0.41, fy: 0.68,
      view: { z: 1.6, fx: 0.41, fy: 0.68 },
      glow: [
        { word: "mère", fx: 0.52, fy: 0.53, w: 0.13, h: 0.1, angle: -6 },
        { word: "frère", fx: 0.25, fy: 0.73, w: 0.12, h: 0.09, angle: 8 },
        { word: "chien", fx: 0.37, fy: 0.87, w: 0.11, h: 0.05, angle: 15 },
      ],
      sfx: [
        { word: "chien", src: "sfx/story/bark-1.wav", volume: 0.5 },
        { word: "fonce", src: "sfx/story/bark-2.wav", volume: 0.4 },
      ],
      beat: { pose: "point-up", x: 230 },
    },
    {
      id: "d2", fx: 0.73, fy: 0.2,
      view: { z: 1.8, fx: 0.73, fy: 0.2 },
      glow: [
        { word: "voisins", fx: 0.63, fy: 0.18, w: 0.06, h: 0.08, angle: -4 },
        { word: "gamins", fx: 0.83, fy: 0.2, w: 0.1, h: 0.2, angle: 6 },
      ],
      beat: { pose: "point-up", x: 230 },
    },
    {
      // Him: still, his back to us.
      id: "d3", fx: 0.665, fy: 0.83,
      view: { z: 2, fx: 0.66, fy: 0.8 },
      // The war he comes back from, as a Vox-style collage behind him (public/art/homecoming, built from the archive
      // images below with halftone and torn paper): Omaha Beach, the D-Day map, B-17s, GIs under fire, the ruins.
      collage: {
        word: "était",
        pieces: [
          { src: "art/paper/kraft.jpg", x: 0, y: 0, w: 1080, depth: 0 },
          { src: "art/homecoming/news-cologne.png", x: -70, y: 40, w: 700, rot: -4, depth: 0.1 },
          { ghost: "1944", x: 470, y: 60, w: 260, depth: 0.15 },
          { src: "art/homecoming/map-normandy.png", x: 600, y: 330, w: 520, rot: 5, depth: 0.25 },
          { stripes: 64, x: -60, y: 1060, w: 460, rot: -12, depth: 0.3 },
          { src: "art/homecoming/omaha.png", x: 10, y: 470, w: 520, rot: -6, depth: 0.45, at: "front" },
          { tape: "LE FRONT", x: 60, y: 430, w: 64, rot: -5, depth: 0.9, at: "front" },
          { src: "art/homecoming/b17.png", x: 380, y: 30, w: 820, depth: 0.55, fly: -700 },
          { src: "art/homecoming/stlo.png", x: 700, y: 760, w: 400, rot: -3, depth: 0.5, at: "choses" },
          { stamp: "6 JUIN 1944", x: 640, y: 250, w: 54, rot: 11, depth: 0.85, at: "choses" },
          { src: "art/homecoming/gis-shelter.png", x: -10, y: 640, w: 380, rot: -2, depth: 0.6, at: "personne" },
          { src: "art/homecoming/news-hitler.png", x: 650, y: 1040, w: 460, rot: 6, depth: 0.7, at: "cour" },
          { pencil: "M 760 470 L 800 515 M 800 470 L 760 515 M 850 600 L 890 645 M 890 600 L 850 645", x: 0, y: 0, w: 1080, depth: 0.8, at: "jamais" },
        ],
      },
      sfx: [
        { word: "était", src: "sfx/story/planes.wav", volume: 0.5 },
        { word: "était", src: "sfx/story/eisenhower-radio.wav", volume: 0.32 },
        { word: "front", src: "sfx/story/war-rumble.wav", volume: 0.4 },
      ],
      // His back turned like the soldier's; the front frightens him.
      poses: [{ word: "front", pose: "scared" }],
      hold: 2.6,
      beat: { pose: "back", x: 230 },
    },
    {
      // "Eux… / lui": the painting tears in two. Their side keeps its colour; his is the war, behind him.
      id: "d4", fx: 0.5, fy: 0.5,
      view: { z: 0.873, fx: 0.5, fy: 0.5 },
      collage: {
        word: "eux",
        tear: 720,
        pieces: [
          { src: "art/paper/kraft.jpg", x: 0, y: 0, w: 1080, depth: 0 },
          { src: "art/homecoming/news-cologne.png", x: 600, y: 40, w: 560, rot: 4, depth: 0.15 },
          { src: "art/homecoming/b17.png", x: 640, y: 20, w: 620, depth: 0.5, fly: -260 },
          { ghost: "1944", x: 760, y: 470, w: 170, depth: 0.2 },
          { src: "art/homecoming/stlo.png", x: 790, y: 560, w: 330, rot: -4, depth: 0.45 },
          { stripes: 54, x: 700, y: 1240, w: 420, rot: -8, depth: 0.3 },
          // Fills the empty corner under "LUI", clear of the loop round his head.
          { src: "art/homecoming/omaha.png", x: 745, y: 870, w: 350, rot: 4, depth: 0.5 },
          { tape: "EUX", x: 150, y: 470, w: 76, rot: -4, depth: 0.9, at: "fêtent", over: true },
          { tape: "LUI", x: 840, y: 800, w: 76, rot: 5, depth: 0.9, at: "lui", over: true },
          { pencil: "M 785 930 C 785 885 760 868 728 868 C 690 868 668 895 668 935 C 668 975 695 1000 728 1000 C 765 1000 790 975 786 925", x: 0, y: 0, w: 1080, depth: 0.9, at: "tête", over: true },
        ],
      },
      sfx: [{ word: "eux", src: "sfx/accents/tape.wav", volume: 0.6 }],
      beat: { pose: "point-up", x: 230 },
    },
    {
      // His face, hidden on purpose: a wall of real GIs' portraits round him, every family's son.
      id: "d5", fx: 0.665, fy: 0.78,
      view: { z: 1.5, fx: 0.66, fy: 0.75 },
      glow: [{ word: "visage", fx: 0.672, fy: 0.69, w: 0.06, h: 0.07, round: true }],
      questions: { word: "cache", fx: 0.672, fy: 0.665 },
      collage: {
        word: "millions",
        until: "chaque",
        pieces: [
          { src: "art/paper/kraft.jpg", x: 0, y: 0, w: 1080, depth: 0 },
          { src: "art/homecoming/portrait-1.jpg", x: 30, y: 300, w: 240, rot: -5, depth: 0.5 },
          { src: "art/homecoming/portrait-2.jpg", x: 800, y: 280, w: 240, rot: 4, depth: 0.5 },
          { src: "art/homecoming/portrait-3.jpg", x: 60, y: 640, w: 240, rot: 3, depth: 0.55 },
          { src: "art/homecoming/portrait-4.jpg", x: 790, y: 620, w: 240, rot: -3, depth: 0.55 },
          { src: "art/homecoming/portrait-5.jpg", x: 250, y: 200, w: 200, rot: 6, depth: 0.4 },
          { src: "art/homecoming/portrait-6.jpg", x: 650, y: 190, w: 200, rot: -6, depth: 0.4 },
          { src: "art/homecoming/portrait-7.jpg", x: 20, y: 960, w: 230, rot: -2, depth: 0.6 },
          { src: "art/homecoming/portrait-8.jpg", x: 820, y: 950, w: 230, rot: 5, depth: 0.6 },
          { stamp: "16 MILLIONS DE G.I.", x: 150, y: 60, w: 66, rot: -5, depth: 0.85, over: true },
          { tape: "UN FILS", x: 40, y: 580, w: 54, rot: -4, depth: 0.9, at: "fils", over: true },
          { tape: "UN MARI", x: 760, y: 560, w: 54, rot: 3, depth: 0.9, at: "mari", over: true },
          { tape: "UN FRÈRE", x: 60, y: 900, w: 54, rot: 2, depth: 0.9, at: "frère", over: true },
          { pencil: "M 270 420 Q 380 470 440 560 M 800 420 Q 700 470 650 560 M 300 760 Q 380 760 430 720 M 790 740 Q 710 760 670 720", x: 0, y: 0, w: 1080, depth: 0.9, at: "leur", over: true },
        ],
      },
      // A secret: "Rockwell nous le cache exprès".
      poses: [{ word: "cache", pose: "whisper" }],
      beat: { pose: "explaining", x: 230 },
    },
  ],
});
