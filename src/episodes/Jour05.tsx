import { createKey, type Art } from "../keys/engine";
import voice from "../../public/voice/Jour05.json";

// 30 jours pour capter l'art, Jour 5: les bébés vieux (engine v2, 14 Nov. 2026).
// Facts: medieval Christ Child painted as a "homunculus", a small perfect man (theology of the Child born perfect and
// wise; icon conventions, not likeness); at the Renaissance, portraits of real children and a taste for naturalism
// give babies real baby bodies; Raphael's two putti from the Sistine Madonna (1513-14, Dresden) are reproduced
// everywhere. Images: public/art/SOURCES.md, jour05/ (Berlinghiero, Madonna and Child, c. 1230, the Met, CC0).
const baby: Art = { src: "art/jour05/opener.jpg", ratio: 2560 / 3840 };
const berl: Art = { src: "art/jour05/berlinghiero.jpg", ratio: 2840 / 1920 };
const sistine: Art = { src: "art/jour05/sistine.jpg", ratio: 4151 / 3028 };
const putti: Art = { src: "art/jour05/putti.jpg", ratio: 610 / 1527 };

export const jour05 = createKey({
  day: 5,
  notion: "les bébés vieux",
  voice,
  voiceFile: "voice/Jour05.mp3",
  music: "music/belleville.mp3",
  intro: { at: "intro:jour" },
  opener: {
    src: baby.src,
    ratio: baby.ratio,
    text: "Pourquoi les bébés du Moyen Âge ont une tête de comptable de 50 ans ?",
    until: "hook:spoiler",
    out: "one:un",
    focus: [0.45, 0.5],
    sticker: { x: 40, y: 1060, w: 380, rot: -5 },
  },
  pointStyle: "badge",
  progress: true,
  loopTo: "opener",
  captionsY: 1450,
  // TODO meme slot: at "hook:comptable", a reaction (the user sends the clip), e.g.
  // { src: "clips/jour05/reaction.mp4", at: "hook:comptable", from: 0, dur: 1.2, mode: "full" },
  clips: [],
  points: [
    { n: "1", at: "one:un", body: "one:un", out: "two:deux", title: "Jésus naît parfait", badge: [110, 1110] },
    { n: "2", at: "two:deux", body: "two:deux", out: "three:trois", title: "pas une photo", badge: [90, 700] },
    { n: "3", at: "three:trois", body: "three:trois", out: "outro:petit", title: "la Renaissance", badge: [770, 900] },
  ],
  stickers: [
    {
      art: berl, at: "hook:spoiler+0.4", out: "three:trois", x: 370, y: 545, w: 560, rot: 2,
      marks: [
        { loupe: [0.7, 0.37, 0.09], at: "one:jésus", out: "two:deux", x: 40, y: 600, size: 330 },
        { note: "tête de vieux", pos: [-0.3, 0.55], at: "one:tête", size: 50, rot: -6 },
      ],
    },
    { art: baby, at: "two:vrai", out: "three:trois", x: 40, y: 960, w: 360, rot: -6 },
    {
      art: sistine, at: "three:trois", out: "outro:petit", x: 60, y: 545, w: 560, rot: -2,
      marks: [{ loupe: [0.37, 0.22, 0.1], at: "three:joues", x: 640, y: 560, size: 300 }],
    },
    { art: putti, at: "three:angelots", out: "outro:petit", x: 420, y: 1130, w: 520, rot: 3, marks: [{ note: "sur tous les mugs", pos: [0.5, -0.12], at: "three:mugs", size: 46, rot: -3 }] },
    // Outro: the old little man against the round baby.
    { art: berl, at: "outro:petit", x: 110, y: 545, w: 225, rot: -4, marks: [{ ellipse: [0.7, 0.37, 0.12, 0.09], at: "outro:petit+0.3" }] },
    { art: sistine, at: "outro:rond", x: 600, y: 550, w: 245, rot: 4, marks: [{ ellipse: [0.37, 0.22, 0.13, 0.1], at: "outro:renaissance" }] },
  ],
  tapes: [
    { text: "v. 1230", at: "hook:exprès", out: "one:un", x: 760, y: 1330, rot: 3, size: 44 },
    { text: "image sacrée ≠ photo", at: "two:sacrée", out: "three:trois", x: 380, y: 1330, rot: -2, size: 46 },
    { text: "Raphaël, 1513", at: "three:renaissance", out: "outro:petit", x: 70, y: 1330, rot: -3, size: 42 },
  ],
  outro: { at: "outro:petit", lines: ["petit vieux : Moyen Âge", "tout rond : Renaissance"], follow: "outro:abonne", tomorrow: "jour 6 demain" },
});
