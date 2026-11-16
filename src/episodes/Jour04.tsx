import { createKey, type Art } from "../keys/engine";
import voice from "../../public/voice/Jour04.json";

// 30 jours pour capter l'art, Jour 4: le clair-obscur (engine v2, 14 Nov. 2026).
// Facts: the Contarelli chapel, San Luigi dei Francesi, Rome: a coin-operated light box lights Caravaggio's Matthew
// cycle; The Calling of Saint Matthew (1599-1600): the light enters from the upper right with Christ's gesture; which
// figure is Matthew (the bearded man pointing to himself, or the young man slumped over the coins at the left end) is
// still debated by art historians. Images: public/art/SOURCES.md, jour04/.
const chapel: Art = { src: "art/jour04/opener.jpg", ratio: 2560 / 1920 };
const matthew: Art = { src: "art/jour04/matthew.jpg", ratio: 1200 / 1283 };

export const jour04 = createKey({
  day: 4,
  notion: "le clair-obscur",
  voice,
  voiceFile: "voice/Jour04.mp3",
  music: "music/belleville.mp3",
  intro: { at: "intro:jour" },
  opener: {
    src: chapel.src,
    ratio: chapel.ratio,
    text: "À Rome, tu mets une pièce pour allumer ce tableau.",
    until: "hook:et",
    out: "intro:jour",
    focus: [0.27, 0.5],
    sticker: { x: 280, y: 620, w: 520, rot: -4 },
  },
  pointStyle: "badge",
  progress: true,
  loopTo: "opener",
  captionsY: 1450,
  // TODO meme slot: at "three:1", a "1 or 2?" vote meme (the user sends the clip), e.g.
  // { src: "clips/jour04/vote.mp4", at: "three:1", from: 0, dur: 1.5, mode: "sticker", ratio: 16 / 9, x: 560, y: 1050, w: 380 },
  clips: [],
  points: [
    { n: "1", at: "one:un", body: "one:un", out: "two:deux", title: "1 seule lumière", badge: [775, 470] },
    { n: "2", at: "two:deux", body: "two:deux", out: "three:trois", title: "elle choisit qui compte", badge: [775, 470] },
    { n: "3", at: "three:trois", body: "three:trois", out: "outro:au", title: "c'est lequel, Matthieu ?", badge: [775, 470] },
  ],
  stickers: [
    {
      art: matthew, at: "hook:lumière", out: "outro:au", x: 120, y: 600, w: 820, rot: 1.5,
      marks: [
        { arrow: [[0.97, 0.27], [0.48, 0.52]], at: "one:biais" },
        { note: "spot", pos: [0.82, 0.2], at: "one:spot", size: 60, rot: -10, color: "#ffe14d" },
        { loupe: [0.66, 0.41, 0.07], at: "two:main", out: "three:trois", x: 150, y: 610, size: 300 },
        { ellipse: [0.3, 0.56, 0.21, 0.13], at: "two:thune", color: "#ffe14d" },
        { ellipse: [0.3, 0.44, 0.05, 0.07], at: "three:barbu" },
        { note: "1", pos: [0.3, 0.32], at: "three:barbu", size: 90, rot: 0 },
        { ellipse: [0.2, 0.58, 0.06, 0.06], at: "three:jeune" },
        { note: "2", pos: [0.09, 0.66], at: "three:jeune", size: 90, rot: 0 },
      ],
    },
    { art: chapel, at: "outro:au", x: 90, y: 560, w: 230, rot: -5 },
    { art: matthew, at: "outro:au+0.15", x: 420, y: 570, w: 330, rot: 3, marks: [{ arrow: [[0.97, 0.27], [0.48, 0.52]], at: "outro:lumière" }] },
  ],
  tapes: [
    { text: "Le Caravage, 1600", at: "one:caravage", out: "two:deux", x: 500, y: 1330, rot: -2, size: 42 },
    { text: "collecteur d'impôts", at: "two:collecteur", out: "three:trois", x: 120, y: 1330, rot: 2, size: 42 },
    { text: "1 ou 2 ? dis-moi", at: "three:1", out: "outro:au", x: 110, y: 1330, rot: 3, size: 46, color: "#c8322b" },
  ],
  outro: { at: "outro:au", lines: ["cherche d'où", "vient la lumière"], follow: "outro:abonne", tomorrow: "jour 5 demain" },
});
