import { createKey, type Art } from "../keys/engine";
import voice from "../../public/voice/Key01.json";

// 30 jours pour kiffer l'art, Jour 1: la perspective, 3 trucs à savoir (handmade sticker look).
// Facts (9 Nov. 2026):
// - linear perspective: receding parallels meet at one vanishing point and things shrink with distance; the rule was
//   demonstrated by Brunelleschi in Florence in the early 15th c., usually dated 1413-1420 ("il y a 600 ans");
// - the Last Supper's vanishing point is on Christ's head (right temple); Leonardo drove a nail there to stretch the
//   strings of his lines, and its hole is still visible (discoveringdavinci.com, nicofranz.art);
// - aerial (atmospheric) perspective: distance painted bluer and hazier, described by Leonardo; the Mona Lisa's
//   background landscape is the classic example.
// Images: Commons "Leonardo da Vinci (1452-1519) - The Last Supper (1495-1498).jpg" (public domain); the School of
// Athens and the Mona Lisa from earlier episodes.
const cene: Art = { src: "art/perspective/last-supper.jpg", ratio: 667 / 1280 };
const athens: Art = { src: "art/athens/athens.jpg", ratio: 3394 / 5200 };
const joconde: Art = { src: "art/mona-lisa/mona-lisa.jpg", ratio: 5723 / 3840 };
const CENE_VP: [number, number] = [0.4975, 0.494];
const ATHENS_VP: [number, number] = [0.514, 0.546];

export const key01 = createKey({
  day: 1,
  notion: "la perspective",
  voice,
  voiceFile: "voice/Key01.mp3",
  music: "music/belleville.mp3", // Django Reinhardt, 1943 (public/music/SOURCES.md)
  intro: { at: "intro:jour" },
  points: [
    { n: "1", at: "one_t:un", body: "one:tout", out: "two_t:deux", title: "le point de fuite" },
    { n: "2", at: "two_t:deux", body: "two:il", out: "three_t:trois", title: "l'astuce du peintre" },
    { n: "3", at: "three_t:trois", body: "three:pour", out: "outro:chaque", title: "le fond bleu" },
  ],
  stickers: [
    // Hook: the Last Supper, the camera slowly pushing into the room.
    { art: cene, at: 0, out: "intro:jour", x: 40, y: 640, w: 1000, rot: -2, push: { fx: CENE_VP[0], fy: CENE_VP[1], to: 1.4, until: "intro:jour" } },
    {
      art: athens, at: "one:tout", out: "two_t:deux", x: 80, y: 620, w: 920, rot: 2,
      marks: [
        { lines: { vp: ATHENS_VP, from: [[0, 1], [1, 1], [0, 0.656], [1, 0.656], [0.25, 0], [0.768, 0]] }, at: "one:lignes" },
        { ellipse: [ATHENS_VP[0], ATHENS_VP[1], 0.035, 0.05], at: "one:point" },
      ],
    },
    {
      art: cene, at: "two:il", out: "three_t:trois", x: 50, y: 660, w: 980, rot: -2,
      zoom: { at: "two:tête", fx: CENE_VP[0], fy: CENE_VP[1], z: 2.2 },
      marks: [
        { lines: { vp: CENE_VP, from: [[0, 0.072], [1, 0.072], [0.2875, 0], [0.7125, 0], [0, 0.72], [1, 0.72]] }, at: "two:met" },
        { ellipse: [CENE_VP[0], 0.47, 0.045, 0.12], at: "two:trou" },
        { arrow: [[0.6, 0.27], [0.53, 0.42]], at: "two:clou" },
        { note: "le trou du clou !", pos: [0.64, 0.22], at: "two:clou", size: 46, rot: -6 },
      ],
    },
    {
      art: joconde, at: "three:pour", out: "outro:chaque", x: 280, y: 600, w: 520, rot: 2,
      zoom: { at: "three:regarde", fx: 0.15, fy: 0.35, z: 2 },
      marks: [
        { ellipse: [0.14, 0.36, 0.13, 0.1], at: "three:bleu" },
        { ellipse: [0.86, 0.3, 0.13, 0.09], at: "three:flou" },
      ],
    },
    { art: athens, at: "outro:chaque", x: 60, y: 600, w: 320, rot: -6 },
    { art: cene, at: "outro:chaque+0.17", x: 400, y: 650, w: 320, rot: 4 },
    { art: joconde, at: "outro:chaque+0.33", x: 770, y: 560, w: 220, rot: -3 },
  ],
  tapes: [
    { text: "3 trucs à savoir", at: "intro:3", out: "one_t:un", x: 230, y: 860, rot: -3, size: 80 },
    { text: "Florence, il y a 600 ans", at: "one:florence", out: "two_t:deux", x: 80, y: 1250, rot: -3, size: 48 },
    { text: "bleu + flou = loin", at: "three:comme", out: "outro:chaque", x: 300, y: 500, rot: -4, size: 52 },
  ],
  outro: { at: "outro:chaque", lines: ["chaque jour, 1 notion", "pour lire tous les tableaux"], follow: "outro:abonne", tomorrow: "notion n°2 demain" },
});
