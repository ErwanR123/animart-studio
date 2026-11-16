import { createKey, type Art, type KeyConfig } from "../keys/engine";
import voice from "../../public/voice/Key02.json";

// Key02 (le contrapposto) rebuilt on the keys engine v2 (14 Nov. 2026): a real photo full frame first (Kendall
// Jenner on the red carpet) printed into a sticker, number badges instead of full-screen cards, the 30 tick boxes,
// bigger art, a loupe on David's hip, a loop back to the opening photo. Same voice and facts as Key02.
const kouros: Art = { src: "art/contrapposto/kouros.jpg", ratio: 1512 / 960 };
const kritios: Art = { src: "art/contrapposto/kritios.jpg", ratio: 2098 / 900 };
const dory: Art = { src: "art/contrapposto/dory.jpg", ratio: 2084 / 960 };
const david: Art = { src: "art/contrapposto/david.jpg", ratio: 1440 / 960 };
const jlo: Art = { src: "art/contrapposto/jennifer-lopez-2025.jpg", ratio: 1845 / 900 };
const selena: Art = { src: "art/contrapposto/selena-gomez-2024.jpg", ratio: 1453 / 900 };

export const key02v2Config: KeyConfig = {
  day: 1,
  notion: "le contrapposto",
  voice,
  voiceFile: "voice/Key02.mp3",
  music: "music/belleville.mp3",
  intro: { at: "intro:jour" },
  opener: {
    src: "art/contrapposto/kendall-jenner-2026.jpg",
    ratio: 1994 / 900,
    text: "Toutes les stars font cette pose. Elles l'ont piquée à une statue grecque.",
    until: "hook:inconsciemment",
    out: "intro:trucs",
    focus: [0.5, 0.35],
    sticker: { x: 30, y: 560, w: 330, rot: -4 },
  },
  pointStyle: "badge",
  progress: true,
  loopTo: "opener",
  // Engine test (14 Nov.): a 1.5 s full-frame clip in the gap after the intro, a sticker clip over point 2.
  clips: [
    { src: "clips/banana/bite.mp4", at: "one_t:un+-0.2", from: 0, dur: 1.5, mode: "full", caption: "moi qui découvre ça" },
    { src: "clips/banksy/full-shred.mp4", at: "two:480", from: 2, dur: 3, mode: "sticker", ratio: 720 / 410, x: 620, y: 1000, w: 300, rot: -4 },
  ],
  points: [
    { n: "1", at: "one_t:un", body: "one:une", out: "two_t:deux", title: "le poids sur une jambe", badge: [730, 600] },
    { n: "2", at: "two_t:deux", body: "two:avant", out: "three_t:trois", title: "les Grecs l'inventent", badge: [60, 570] },
    { n: "3", at: "three_t:trois", body: "three:2", out: "outro:chaque", title: "Michel-Ange le ressort", badge: [30, 580] },
  ],
  stickers: [
    { art: jlo, at: "hook:inconsciemment+0.45", out: "intro:trucs", x: 375, y: 600, w: 320, rot: 3, marks: [{ curve: [[0.2, 0.54], [0.74, 0.51]], at: "hook:pose" }] },
    { art: selena, at: "hook:inconsciemment+0.6", out: "intro:trucs", x: 715, y: 580, w: 320, rot: -2, marks: [{ curve: [[0.2, 0.64], [0.72, 0.6]], at: "hook:pose+0.15" }] },
    {
      art: dory, at: "one_t:un", out: "two_t:deux", x: 90, y: 575, w: 560, rot: 2,
      marks: [
        { censor: [0.47, 0.43], w: 0.22, at: "one_t:un" },
        { arrow: [[0.43, 0.52], [0.43, 0.84]], at: "one:porte" },
        { note: "jambe d'appui", pos: [0.14, 0.6], at: "one:porte", size: 46, rot: -8 },
        { curve: [[0.28, 0.39], [0.7, 0.425]], at: "one:hanche" },
        { curve: [[0.22, 0.215], [0.78, 0.19]], at: "one:épaules" },
        { curve: [[0.48, 0.07], [0.56, 0.18], [0.46, 0.33], [0.52, 0.45], [0.43, 0.62], [0.44, 0.85]], at: "one:s" },
      ],
    },
    {
      art: kouros, at: "two:avant", out: "three_t:trois", x: 50, y: 770, w: 430, rot: -3,
      marks: [
        { censor: [0.5, 0.5], w: 0.2, at: "two:avant" },
        { curve: [[0.33, 0.25], [0.68, 0.25]], at: "two:raides" },
        { curve: [[0.38, 0.42], [0.62, 0.42]], at: "two:raides+0.25" },
        { note: "tout droit", pos: [0.5, 0.74], at: "two:deux", size: 52 },
      ],
    },
    {
      art: kritios, at: "two:vers", out: "three_t:trois", x: 520, y: 590, w: 410, rot: 3,
      marks: [
        { censor: [0.43, 0.55], w: 0.24, at: "two:vers" },
        { curve: [[0.25, 0.455], [0.7, 0.43]], at: "two:hanche" },
        { note: "ça bouge !", pos: [0.5, 0.34], at: "two:respire", size: 52 },
      ],
    },
    {
      art: david, at: "three_t:trois", out: "outro:chaque", x: 150, y: 590, w: 760, rot: 2,
      marks: [
        { censor: [0.455, 0.515], w: 0.16, at: "three_t:trois" },
        { arrow: [[0.4, 0.56], [0.44, 0.88]], at: "three:jambe" },
        { curve: [[0.3, 0.415], [0.6, 0.445]], at: "three:hanche" },
        { loupe: [0.45, 0.43, 0.09], at: "three:hanche+0.2", x: 640, y: 1000, size: 280 },
        { curve: [[0.22, 0.26], [0.6, 0.215]], at: "three:épaules" },
      ],
    },
    { art: dory, at: "outro:chaque", x: 80, y: 560, w: 200, rot: -5, marks: [{ censor: [0.47, 0.43], w: 0.3, at: "outro:chaque" }] },
    { art: kritios, at: "outro:chaque+0.17", x: 420, y: 590, w: 180, rot: 4, marks: [{ censor: [0.43, 0.55], w: 0.32, at: "outro:chaque" }] },
    { art: david, at: "outro:chaque+0.33", x: 640, y: 570, w: 290, rot: -3, marks: [{ censor: [0.455, 0.515], w: 0.24, at: "outro:chaque" }] },
  ],
  tapes: [
    { text: "Kendall, J.Lo, Selena", at: "hook:insta", out: "intro:trucs", x: 270, y: 1250, rot: 3, size: 50 },
    { text: "3 trucs à savoir", at: "intro:trucs", out: "one_t:un", x: 230, y: 860, rot: -3, size: 80 },
    { text: "le Doryphore", at: "one:une", out: "two_t:deux", x: 630, y: 820, rot: 3, size: 40 },
    { text: "v. 590 av. J.-C.", at: "two:avant+0.3", out: "three_t:trois", x: 300, y: 690, rot: -3, size: 40 },
    { text: "v. 480 av. J.-C.", at: "two:480", out: "three_t:trois", x: 610, y: 545, rot: 2, size: 40 },
    { text: "1504", at: "three:david", out: "outro:chaque", x: 760, y: 610, rot: 4, size: 48 },
  ],
  outro: { at: "outro:chaque", lines: ["chaque jour, 1 notion", "pour lire toutes les œuvres"], follow: "outro:abonne", tomorrow: "notion n°2 demain" },
};

export const key02v2 = createKey(key02v2Config);
