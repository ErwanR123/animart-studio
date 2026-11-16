import { createKey, type Art } from "../keys/engine";
import voice from "../../public/voice/Jour02.json";

// 30 jours pour capter l'art, Jour 2: la taille d'un tableau (engine v2, 14 Nov. 2026).
// Facts: Mona Lisa 77 × 53 cm (Louvre); The Wedding at Cana 6.77 × 9.94 m, ~67 m², hangs facing it in the Salle des
// États (Louvre); the hierarchy of genres (Académie, history painting at the top, still life at the bottom);
// Courbet's A Burial at Ornans, 3.15 × 6.68 m, Salon of 1850-51, ordinary villagers at history-painting scale (Orsay).
// Images: public/art/SOURCES.md, jour02/.
const opener: Art = { src: "art/jour02/opener.jpg", ratio: 1517 / 3840 };
const cana: Art = { src: "art/jour02/cana.jpg", ratio: 2609 / 3840 };
const mona: Art = { src: "art/jour02/mona-lisa.jpg", ratio: 2861 / 1920 };
const ornans: Art = { src: "art/jour02/ornans.jpg", ratio: 1765 / 3840 };
// A felt-pen stick figure in its box's fractions (head drawn separately).
const STICK: [number, number][][] = [
  [[0.5, 0.13], [0.5, 0.56]],
  [[0.5, 0.56], [0.22, 0.99]],
  [[0.5, 0.56], [0.78, 0.99]],
  [[0.12, 0.36], [0.5, 0.22], [0.88, 0.36]],
];

export const jour02 = createKey({
  day: 2,
  notion: "la taille",
  voice,
  voiceFile: "voice/Jour02.mp3",
  music: "music/belleville.mp3",
  intro: { at: "intro:jour" },
  opener: {
    src: opener.src,
    ratio: opener.ratio,
    text: "Tout le monde fait la queue pour la Joconde. Personne ne regarde le tableau de 10 m derrière.",
    until: "hook:tableau",
    out: "intro:jour",
    focus: [0.31, 0.45],
    sticker: { x: 60, y: 560, w: 470, rot: -4 },
  },
  pointStyle: "badge",
  progress: true,
  loopTo: "opener",
  captionsY: 1450,
  // TODO meme slot: at "two:appart", a tiny-flat reaction / meme (the user sends the clip), e.g.
  // { src: "clips/jour02/appart.mp4", at: "two:appart", from: 0, dur: 1.5, mode: "full" },
  clips: [],
  points: [
    { n: "1", at: "one:un", body: "one:un", out: "two:deux", title: "petit = intime", badge: [760, 560] },
    { n: "2", at: "two:deux", body: "two:deux", out: "three:trois", title: "XXL = important", badge: [770, 470] },
    { n: "3", at: "three:trois", body: "three:trois", out: "outro:donc", title: "Courbet casse la règle", badge: [770, 470] },
  ],
  stickers: [
    { art: cana, at: "hook:10", out: "one:un", x: 45, y: 700, w: 990, rot: 2 },
    {
      art: mona, at: "one:un", out: "two:deux", x: 470, y: 640, w: 270, rot: 3,
      marks: [{ loupe: [0.5, 0.25, 0.2], at: "one:intime", x: 650, y: 1110, size: 260 }],
    },
    {
      art: cana, at: "two:deux", out: "three:trois", x: 40, y: 650, w: 1000, rot: -1.5,
    },
    {
      art: ornans, at: "three:trois", out: "outro:donc", x: 40, y: 700, w: 1000, rot: 1.5,
      marks: [
        { arrow: [[0.5, 1.12], [0.02, 1.12]], at: "three:7" },
        { arrow: [[0.5, 1.12], [0.98, 1.12]], at: "three:7" },
        { note: "des inconnus !", pos: [0.62, 0.15], at: "three:inconnus", size: 56, rot: -4 },
      ],
    },
    { art: mona, at: "outro:donc", x: 70, y: 580, w: 180, rot: -5 },
    { art: cana, at: "outro:donc+0.15", x: 290, y: 590, w: 400, rot: 3 },
    { art: ornans, at: "outro:donc+0.3", x: 690, y: 640, w: 270, rot: -4 },
  ],
  doodles: [
    // You, at one metre from her: the figure is drawn to the painting's scale (77 cm against ~1.70 m).
    { at: "one:joconde", out: "two:deux", x: 120, y: 560, w: 300, h: 820, strokes: STICK, head: [0.5, 0.07, 0.11] },
    // The same you, in front of Cana: ~1.70 m against 6.77 m.
    { at: "two:noces", out: "three:trois", x: 480, y: 1146, w: 62, h: 168, strokes: STICK, head: [0.5, 0.07, 0.11] },
  ],
  tapes: [
    { text: "77 × 53 cm", at: "one:77", out: "two:deux", x: 430, y: 1065, rot: -3, size: 52 },
    { text: "à 1 mètre", at: "one:mètre", out: "two:deux", x: 90, y: 1300, rot: 3, size: 44 },
    { text: "67 m²", at: "two:67", out: "two:xxl", x: 420, y: 560, rot: -3, size: 64 },
    { text: "XXL : Dieu, rois, batailles", at: "two:xxl", out: "three:trois", x: 60, y: 560, rot: -2, size: 46 },
    { text: "A4 : une pomme", at: "two:a4", out: "three:trois", x: 590, y: 1335, rot: 3, size: 46 },
    { text: "Courbet, 1850", at: "three:courbet", out: "outro:donc", x: 60, y: 580, rot: -3, size: 48 },
    { text: "6,68 m de large", at: "three:7", out: "outro:donc", x: 300, y: 1250, rot: 2, size: 48 },
    { text: "SCANDALE", at: "three:scandale", out: "outro:donc", x: 560, y: 1330, rot: -4, size: 62, color: "#c8322b" },
  ],
  outro: { at: "outro:donc", lines: ["au musée, regarde", "d'abord la taille"], follow: "outro:abonne", tomorrow: "jour 3 demain" },
});
