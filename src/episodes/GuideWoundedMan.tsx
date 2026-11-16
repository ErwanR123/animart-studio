import { createGuideEpisode, type Voice } from "../guide/engine";
import voice from "../../public/voice/GuideWoundedMan.json";

// Gustave Courbet, *L'Homme blessé*, between 1844 and 1854, musée d'Orsay (RF 338). First video for the app (phase 2).
// Facts (4 Nov. 2026):
// - C2RMF, "Gustave Courbet étudié et restauré": the painting lies over two compositions, one of them a younger Courbet
//   embracing his companion Virginie Binet; he came back to it ten years later and half erased it. The radiograph shown
//   is theirs (Jean-Louis Bellec): she is plainly there, her head against him.
// - Wikipedia EN "The Wounded Man" (after Faunce & Nochlin, 1988) and gustave-courbet.com: before May 1854 the woman goes,
//   the sword and the red stain on the shirt come in. The sword sits on the far side from her; the stain sits where she lay.
// - The son: Désiré Alfred Émile Binet, born 17 Sept. 1847 (Matthiesen Gallery, *Courbet*). She left around 1852.
// - The 1973 laboratory study: Ségolène Le Men (UTCP); Les yeux d'Argus (2016).
// The link between the breakup and the erasure is a reading (historians say "may have"), told with conviction (bible/script.md 5).
// Images (public/art/SOURCES.md): the painting (Commons), the radiograph (C2RMF), *La Sieste champêtre* (Besançon, Commons),
// the clock of the musée d'Orsay (Commons). Music: Chopin, Prelude op. 28 no. 4 (Paris, 1839).
const ART = "art/wounded";
const CRUMPLED = "art/paper/crumpled.jpg";
const KRAFT = "art/paper/kraft.jpg";
const CREAM = "#EDE5D3";
const RED = "#B8261B";
const DARK = "#1B1712";
const FULL = { z: 1, fx: 0.5, fy: 0.5 };
// Frame 0 and the loop's last frame: his face and the stain, full screen.
const OPEN = { z: 1, fx: 0.5, fy: 0.5 };
// The picture keeps this exact place from shot to shot, so what changes on it reads as the same canvas being changed.
const CANVAS = { x: 60, y: 300, w: 960 };
// The phone showing the app, clear of the platform's buttons on the right.
const PHONE = { x: 240, y: 200, w: 600 };
// Everything that matters stays in the phone's safe area: below y 230 and left of x 930 from y 900 down.

export const guideWoundedMan = createGuideEpisode({
  voiceFile: "voice/GuideWoundedMan.mp3",
  voice: voice as Voice,
  image: { src: `${ART}/cover.jpg`, width: 2160, height: 3840 },
  maxWidth: 1000,
  climb: true,
  climbFrom: "start",
  openView: FULL,
  openPose: "explaining",
  music: "music/chopin-prelude-4.mp3",
  tight: true,
  quietPieces: true,
  palette: { paper: CREAM, accent: RED, hl: "#F4C531" },
  // Frame 0: his closed eyes, the promise on tape; on "tableau" a hard cut to the blood on his shirt.
  cold: [
    { view: OPEN, tapes: ["IL A EFFACÉ SON EX"], y: 1700, size: 54 },
    { word: "tableau.", view: { z: 4, fx: 0.76, fy: 0.56 } },
  ],
  // The last line ends on the link, then the video loops to its hook.
  loop: { word: "bio.", view: OPEN, full: true },
  header: "GUSTAVE COURBET · 1844-1854",
  title: ["L'Homme", "blessé"],
  lead: {
    hook: {},
    context: {
      shots: [
        {
          // His own drawing of the same couple asleep: the love story, one still sheet of paper to the tear.
          word: "en", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.04] },
          source: "Gustave Courbet, La Sieste champêtre, c. 1844 (Besançon, D.3176)",
          layers: [
            { bg: KRAFT },
            { src: `${ART}/sieste.jpg`, ...CANVAS, z: 0.4, enter: "none" },
            { tag: "1844", size: 54, x: 800, y: 235, rot: 3, z: 0.9, at: "1844," },
            { name: ["Gustave", "Courbet"], size: 44, x: 70, y: 950, rot: -3, z: 0.95, at: "courbet" },
            { name: ["Virginie", "Binet"], size: 44, x: 640, y: 950, rot: 2, z: 0.95, at: "virginie." },
          ],
        },
      ],
      poses: [{ word: "en", pose: "explaining" }],
    },
  },
  details: [
    {
      id: "d1", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          // The same sheet, not a new picture: only the son's date lands.
          word: "ils", in: "cut", carry: true, cam: { from: [0, 0, 1.04], to: [0, 0, 1.06] },
          source: "Gustave Courbet, La Sieste champêtre",
          layers: [
            { bg: KRAFT },
            { src: `${ART}/sieste.jpg`, ...CANVAS, z: 0.4, enter: "none" },
            { tag: "UN FILS · 1847", size: 46, x: 330, y: 950, rot: -2, z: 0.95, at: "ont" },
          ],
        },
      ],
      beat: { pose: "explaining", x: 230 },
    },
    {
      // She is torn out of the sheet and goes: the hole stays.
      id: "d2", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "puis", in: "cut", carry: true, shake: "quitte.", cam: { from: [0, 0, 1.06], to: [0, 0, 1.06] },
          source: "Gustave Courbet, La Sieste champêtre",
          layers: [
            { bg: KRAFT },
            { src: `${ART}/sieste.jpg`, ...CANVAS, z: 0.4, enter: "none" },
            { src: `${ART}/hole.png`, ...CANVAS, z: 0.42, enter: "none" },
            { src: `${ART}/virginie.png`, ...CANVAS, z: 0.44, enter: "none", route: [[0.42, 1200, 60, 1, 0.3]] },
          ],
        },
      ],
      sfx: [{ word: "quitte.", src: "sfx/accents/page-3.wav", volume: 0.6 }],
      beat: { pose: "scared", x: 230 },
    },
    {
      // Signature 1: the brush. The drawing in its frame, the painting comes over it stroke by stroke, left to right:
      // he is painted first, she goes last, under the brush.
      id: "d3", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          // The sheet with its hole holds through "Alors il…".
          word: "alors", in: "cut", cam: { from: [0, 0, 1.06], to: [0, 0, 1.07] },
          source: "Gustave Courbet, La Sieste champêtre",
          layers: [
            { bg: KRAFT },
            { src: `${ART}/sieste.jpg`, ...CANVAS, z: 0.4, enter: "none" },
            { src: `${ART}/hole.png`, ...CANVAS, z: 0.42, enter: "none" },
          ],
        },
        {
          word: "ressort", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.02] },
          source: "Courbet, La Sieste champêtre; L'Homme blessé",
          layers: [
            { field: DARK, dots: "tl", paper: CRUMPLED },
            { src: `${ART}/sieste.jpg`, ...CANVAS, z: 0.5, gilt: true, enter: "none" },
            { src: `${ART}/painting-clean.jpg`, ...CANVAS, z: 0.5, at: "recouvre", enter: "none", write: 1.5 },
            { src: `${ART}/brush.png`, x: 90, y: -85, w: 130, rot: 25, z: 0.8, at: "recouvre", enter: "none", route: [[0, 190, 550, 1, 0.28], [0.3, 190, -550, 1, 0.28], [0.6, 190, 550, 1, 0.28], [0.9, 190, -550, 1, 0.28], [1.2, 190, 550, 1, 0.28], [1.5, 500, -1300, 1, 0.2]] },
          ],
        },
      ],
      sfx: [{ word: "recouvre", src: "sfx/accents/swish-1.wav", volume: 0.35 }],
      beat: { pose: "explaining", x: 230 },
    },
    {
      // The same canvas: the sword comes down on its left edge.
      id: "d4", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "il", in: "cut", carry: true, shake: "épée.", cam: { from: [0, 0, 1.02], to: [0, 0, 1.02] },
          source: "Courbet, L'Homme blessé",
          layers: [
            { field: DARK, dots: "tl", paper: CRUMPLED },
            { src: `${ART}/painting-clean.jpg`, ...CANVAS, z: 0.5, gilt: true, enter: "none" },
            { src: `${ART}/sword.png`, ...CANVAS, z: 0.5, at: "épée.", enter: "drop" },
            { pencil: "M110 560 C190 530 260 620 240 720 C225 810 130 890 70 860 C20 830 50 620 110 560", color: RED, width: 8, z: 0.8, at: "épée.", after: 0.15, draw: 0.3 },
          ],
        },
      ],
      sfx: [{ word: "épée.", src: "sfx/story/sword.wav", volume: 0.5 }],
      beat: { pose: "point-up", x: 230 },
    },
    {
      // The camera goes in on the shirt, and the stain spreads where she lay.
      id: "d5", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "et", in: "cut", cam: { from: [0, 0, 1.02], to: [-340, -260, 2.1] },
          source: "Courbet, L'Homme blessé",
          layers: [
            { field: DARK, dots: "tl", paper: CRUMPLED },
            { src: `${ART}/painting-clean.jpg`, ...CANVAS, z: 0.5, gilt: true, enter: "none" },
            { src: `${ART}/sword.png`, ...CANVAS, z: 0.5, enter: "none" },
          ],
        },
        {
          // Right on the shirt: the blank linen, and the stain comes on "peint".
          word: "cœur,", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          source: "Courbet, L'Homme blessé",
          layers: [
            { field: DARK, dots: "tl", paper: CRUMPLED },
            { src: `${ART}/painting-clean.jpg`, x: -1098, y: -547, w: 2600, z: 0.5, enter: "none" },
            { src: `${ART}/stain.png`, x: -1098, y: -547, w: 2600, z: 0.5, at: "peint", enter: "none", write: 0.6 },
          ],
        },
      ],
      beat: { pose: "whisper", x: 230 },
    },
    {
      // Signature 2: the real radiograph, laid exactly on the painting, passes across it: she comes back.
      id: "d7", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "en", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [-210, -170, 1.5] },
          source: "Radiograph of L'Homme blessé, C2RMF, Jean-Louis Bellec",
          layers: [
            { field: "#0E0F10", dots: "tl", paper: CRUMPLED },
            { src: `${ART}/painting.jpg`, ...CANVAS, z: 0.5, gilt: true, enter: "none" },
            { src: `${ART}/xray.jpg`, ...CANVAS, z: 0.5, at: "rayons", enter: "none", write: 1.2 },
            { tag: "1973", size: 54, x: 800, y: 235, rot: 3, z: 0.9, at: "1973,", off: "et" },
            { pencil: "M560 500 C600 420 740 420 770 510 C800 600 720 680 620 660 C540 640 520 570 565 495", color: RED, width: 8, z: 0.8, at: "virginie", draw: 0.5 },
            { tape: "VIRGINIE", size: 60, x: 620, y: 700, rot: -3, z: 0.95, at: "toujours" },
          ],
        },
      ],
      sfx: [
        { word: "rayons", src: "sfx/accents/swish-4.wav", volume: 0.4 },
        { word: "virginie", src: "sfx/accents/pencil-3.wav", volume: 0.4 },
      ],
      beat: { pose: "amazed", x: 230 },
      poses: [{ word: "virginie", pose: "whisper" }],
    },
    {
      // The painting back on the wall at Orsay; visitors cross in front and do not stop.
      id: "d8", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "à", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.02] },
          source: "Musée d'Orsay, the clock (Commons); Courbet, L'Homme blessé",
          layers: [
            { bg: `${ART}/clock.jpg`, dim: 0.55 },
            { src: `${ART}/painting.jpg`, x: 170, y: 290, w: 740, z: 0.4, gilt: true, enter: "none" },
            { tag: "MUSÉE D'ORSAY", size: 44, x: 310, y: 235, rot: -1, z: 0.9, at: "orsay," },
            { src: "art/kit/people-parapluies.png", x: 1150, y: 610, w: 270, z: 0.7, at: "vous", enter: "none", route: [[0, -1650, 0, 7, 0.26]] },
            { src: "art/mona-lisa/crowd-l.png", x: -720, y: 760, w: 460, z: 0.75, at: "vous", after: 0.5, enter: "none", route: [[0, 1950, 0, 6, 0.26]] },
          ],
        },
      ],
      beat: { pose: "shrug", x: 230 },
    },
    {
      // The real look of the app: its screens in a phone that comes up over the wall, Explorer, then the scan on
      // "scanné", then the story in the painting's colours on "téléphone".
      id: "d9", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "mais", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.02] },
          source: "Musée d'Orsay, the clock (Commons); screens rebuilt from the app's tokens",
          layers: [
            { bg: `${ART}/clock.jpg`, dim: 0.55 },
            { src: `${ART}/painting.jpg`, x: 170, y: 290, w: 740, z: 0.4, gilt: true, enter: "none" },
            { src: "art/kit/people-parapluies.png", x: 30, y: 560, w: 300, z: 0.45, enter: "none" },
            { src: `${ART}/screen-explore.png`, ...PHONE, y: 1500, z: 0.9, at: "mais", enter: "none", route: [[0, 0, -1300, 1, 0.22]] },
            { src: `${ART}/screen-scan.png`, ...PHONE, z: 0.9, at: "scanné", enter: "none" },
            { src: `${ART}/screen-story.png`, ...PHONE, z: 0.9, at: "téléphone.", enter: "none" },
            { tape: "BÊTA : INSCRIPTION, LIEN EN BIO", size: 40, x: 170, y: 1060, rot: -2, z: 0.95, at: "téléphone." },
          ],
        },
      ],
      sfx: [
        { word: "mais", src: "sfx/accents/page-2.wav", volume: 0.4 },
        { word: "scanné", src: "sfx/accents/shutter.wav", volume: 0.4 },
        { word: "téléphone.", src: "sfx/accents/tape.wav", volume: 0.45 },
      ],
      beat: { pose: "explaining", x: 230 },
    },
    {
      // The story stays on the phone, the band says what the link is; on "bio" the loop flies back to frame 0.
      id: "d10", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "inscrivez-vous", in: "cut", until: "bio.", cam: { from: [0, 0, 1.02], to: [0, 0, 1.03] },
          source: "Musée d'Orsay, the clock (Commons); screens rebuilt from the app's tokens",
          layers: [
            { bg: `${ART}/clock.jpg`, dim: 0.55 },
            { src: `${ART}/painting.jpg`, x: 170, y: 290, w: 740, z: 0.4, gilt: true, enter: "none" },
            { src: "art/kit/people-parapluies.png", x: 30, y: 560, w: 300, z: 0.45, enter: "none" },
            { src: `${ART}/screen-story.png`, ...PHONE, z: 0.9, enter: "none" },
            { tape: "BÊTA : INSCRIPTION, LIEN EN BIO", size: 40, x: 170, y: 1060, rot: -2, z: 0.95, enter: "none" },
          ],
        },
      ],
            beat: { pose: "point-up", x: 230 },
    },
  ],
});
