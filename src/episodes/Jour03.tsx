import { createKey, type Art } from "../keys/engine";
import voice from "../../public/voice/Jour03.json";

// 30 jours pour capter l'art, Jour 3: la perspective (engine v2, 14 Nov. 2026).
// Facts: The Last Supper, Santa Maria delle Grazie, Milan; visits by timed slots of about 15 minutes; a nail hole at
// Christ's right temple is the vanishing point, where Leonardo fixed strings to draw the orthogonals; aerial
// perspective (blue, blurred distance) in the landscape through the windows. Opener: walking into the refectory, cut
// from a YouTube video by Rocky Ruggiero (id Cy3H2xaFyxE). Images: public/art/SOURCES.md, jour03/ and perspective/.
const rails: Art = { src: "art/jour03/rails.jpg", ratio: 1280 / 720 };
const supper: Art = { src: "art/perspective/last-supper.jpg", ratio: 667 / 1280 };
const VP: [number, number] = [0.488, 0.445]; // Christ's right temple
const RAILS_VP: [number, number] = [0.535, 0.135];

export const jour03 = createKey({
  day: 3,
  notion: "la perspective",
  voice,
  voiceFile: "voice/Jour03.mp3",
  music: "music/belleville.mp3",
  intro: { at: "intro:jour" },
  opener: {
    src: "art/jour03/opener.mp4",
    ratio: 1920 / 1080,
    from: 0,
    text: "Ce mur à Milan, t'as 15 min pour le voir. Et il y a un trou de clou dedans.",
    until: "hook:tête",
    out: "intro:jour",
    focus: [0.5, 0.5],
    sticker: { x: 50, y: 560, w: 290, rot: -4 },
  },
  pointStyle: "badge",
  progress: true,
  loopTo: "opener",
  captionsY: 1450,
  // TODO meme slot: at "two:trou" (or "hook:clou"), a shocked reaction (the user sends the clip), e.g.
  // { src: "clips/jour03/shock.mp4", at: "two:trou", from: 0, dur: 1.2, mode: "full" },
  clips: [],
  points: [
    { n: "1", at: "one:un", body: "one:un", out: "two:deux", title: "tout file vers un point", badge: [740, 1130] },
    { n: "2", at: "two:deux", body: "two:deux", out: "three:trois", title: "l'essentiel au point", badge: [770, 470] },
    { n: "3", at: "three:trois", body: "three:trois", out: "outro:au", title: "le fond bleu et flou", badge: [770, 470] },
  ],
  stickers: [
    { art: supper, at: "hook:jésus+0.2", out: "one:un", x: 50, y: 860, w: 990, rot: 2, marks: [{ ellipse: [VP[0], VP[1], 0.02, 0.04], at: "intro:perspective" }] },
    {
      art: rails, at: "one:un", out: "two:deux", x: 80, y: 560, w: 460, rot: -2,
      marks: [
        { lines: { vp: RAILS_VP, from: [[0.0, 0.66], [0.98, 0.6], [0.0, 0.26], [1.0, 0.3]] }, at: "one:lignes" },
        { note: "1 seul point", pos: [0.53, 0.06], at: "one:point", size: 46, rot: -4 },
        { loupe: [RAILS_VP[0], RAILS_VP[1] + 0.02, 0.1], at: "one:rails", x: 580, y: 640, size: 340 },
      ],
    },
    {
      art: supper, at: "two:deux", out: "three:trois", x: 40, y: 600, w: 1000, rot: -1.5,
      marks: [
        { lines: { vp: VP, from: [[0.0, 0.02], [1.0, 0.02], [0.36, 0.0], [0.64, 0.0], [0.11, 0.44], [0.89, 0.42], [0.02, 0.63], [0.98, 0.62]] }, at: "two:lignes" },
        { ellipse: [VP[0], VP[1], 0.02, 0.04], at: "two:jésus" },
        { loupe: [0.495, 0.465, 0.05], at: "two:jésus+0.3", x: 360, y: 1110, size: 270 },
        { note: "le clou", pos: [0.37, 0.3], at: "two:trou", size: 50, rot: -6 },
      ],
    },
    {
      art: supper, at: "three:trois", out: "outro:au", x: 40, y: 600, w: 1000, rot: 1,
      marks: [
        { loupe: [0.395, 0.41, 0.03], at: "three:bleu", x: 70, y: 1110, size: 260 },
        { loupe: [0.6, 0.41, 0.03], at: "three:fenêtres", x: 680, y: 1110, size: 250 },
      ],
    },
    { art: rails, at: "outro:au", x: 80, y: 560, w: 170, rot: -5 },
    { art: supper, at: "outro:au+0.15", x: 300, y: 600, w: 600, rot: 3, marks: [{ lines: { vp: VP, from: [[0.0, 0.02], [1.0, 0.02], [0.02, 0.63], [0.98, 0.62]] }, at: "outro:converge" }] },
  ],
  tapes: [
    { text: "La Cène, Léonard", at: "two:cène", out: "three:trois", x: 60, y: 560, rot: -2, size: 44 },
    { text: "bleu + flou = loin", at: "three:flou", out: "outro:au", x: 330, y: 1300, rot: -3, size: 44 },
  ],
  outro: { at: "outro:au", lines: ["cherche le point", "où tout converge"], follow: "outro:abonne", tomorrow: "jour 4 demain" },
});
