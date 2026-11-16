import { createKey, type Art } from "../keys/engine";
import voice from "../../public/voice/Key02.json";

// 30 jours pour kiffer l'art, Jour 1 (launch episode): le contrapposto, 3 trucs à savoir (handmade sticker look).
// Facts (9 Nov. 2026):
// - contrapposto: the weight on one leg, the other relaxed; the hips tilt one way, the shoulders the other, the body
//   makes an S (Wikipedia "Contrapposto", artincontext.org);
// - before it, archaic kouroi stand rigid and frontal (the Met's kouros, c. 590-580 BC); the Kritios Boy, c. 480 BC
//   (Acropolis Museum), is the earliest known example, its sculptor uncertain, hence "un sculpteur grec";
//   Polykleitos' Doryphoros (c. 440 BC, known from Roman copies) made it the canon;
// - revived at the Renaissance (Donatello), Michelangelo's David (1501-1504) stands on his right leg.
// Images (public/art/SOURCES.md): Met kouros 32.11.1 (CC0), Kritios Boy by Marsyas (CC BY-SA 2.5), Doryphoros from
// Pompeii, Naples, by Yair Haklai (CC BY-SA 4.0), David by Jörg Bittner Unna (CC BY 3.0).
// Stars in the same pose (hook, recent photos): Kendall Jenner, Venice 2026, by Colleen Sturtevant (CC BY-SA 4.0);
// Jennifer Lopez, Sundance 2025, by Everwest (CC BY 4.0); Selena Gomez, TIFF 2024, by Frank Sun (CC BY-SA 4.0); cropped.
// The statues are nude: a strip of masking tape ("censuré") on each keeps the video safe on TikTok.
const kouros: Art = { src: "art/contrapposto/kouros.jpg", ratio: 1512 / 960 };
const kritios: Art = { src: "art/contrapposto/kritios.jpg", ratio: 2098 / 900 };
const dory: Art = { src: "art/contrapposto/dory.jpg", ratio: 2084 / 960 };
const david: Art = { src: "art/contrapposto/david.jpg", ratio: 1440 / 960 };
const kendall: Art = { src: "art/contrapposto/kendall-jenner-2026.jpg", ratio: 1994 / 900 };
const jlo: Art = { src: "art/contrapposto/jennifer-lopez-2025.jpg", ratio: 1845 / 900 };
const selena: Art = { src: "art/contrapposto/selena-gomez-2024.jpg", ratio: 1453 / 900 };
const DAVID_CENSOR = { censor: [0.455, 0.515] as [number, number], w: 0.16 };

export const key02 = createKey({
  day: 1,
  notion: "le contrapposto",
  voice,
  voiceFile: "voice/Key02.mp3",
  music: "music/belleville.mp3", // Django Reinhardt, 1943 (public/music/SOURCES.md)
  intro: { at: "intro:jour" },
  points: [
    { n: "1", at: "one_t:un", body: "one:une", out: "two_t:deux", title: "le poids sur une jambe" },
    { n: "2", at: "two_t:deux", body: "two:avant", out: "three_t:trois", title: "les Grecs l'inventent" },
    { n: "3", at: "three_t:trois", body: "three:2", out: "outro:chaque", title: "Michel-Ange le ressort" },
  ],
  stickers: [
    // Hook: David, then three stars in the same pose, the hips marked.
    { art: david, at: 0, out: "hook:inconsciemment", x: 280, y: 560, w: 520, rot: -3, marks: [{ ...DAVID_CENSOR, at: 0 }] },
    { art: kendall, at: "hook:inconsciemment", out: "intro:trucs", x: 40, y: 540, w: 300, rot: -4, marks: [{ curve: [[0.36, 0.44], [0.84, 0.42]], at: "hook:pose" }] },
    { art: jlo, at: "hook:inconsciemment+0.15", out: "intro:trucs", x: 380, y: 580, w: 310, rot: 3, marks: [{ curve: [[0.2, 0.54], [0.74, 0.51]], at: "hook:pose+0.15" }] },
    { art: selena, at: "hook:inconsciemment+0.3", out: "intro:trucs", x: 720, y: 560, w: 330, rot: -2, marks: [{ curve: [[0.2, 0.64], [0.72, 0.6]], at: "hook:pose+0.3" }] },
    {
      art: dory, at: "one:une", out: "two_t:deux", x: 355, y: 560, w: 370, rot: 2,
      marks: [
        { censor: [0.47, 0.43], w: 0.22, at: "one:une" },
        { arrow: [[0.43, 0.52], [0.43, 0.84]], at: "one:porte" },
        { note: "jambe d'appui", pos: [0.08, 0.7], at: "one:porte", size: 40, rot: -8 },
        { curve: [[0.28, 0.39], [0.7, 0.425]], at: "one:hanche" },
        { curve: [[0.22, 0.215], [0.78, 0.19]], at: "one:épaules" },
        { curve: [[0.48, 0.07], [0.56, 0.18], [0.46, 0.33], [0.52, 0.45], [0.43, 0.62], [0.44, 0.85]], at: "one:s" },
      ],
    },
    {
      art: kouros, at: "two:avant", out: "three_t:trois", x: 60, y: 600, w: 400, rot: -3,
      marks: [
        { censor: [0.5, 0.5], w: 0.2, at: "two:avant" },
        { curve: [[0.33, 0.25], [0.68, 0.25]], at: "two:raides" },
        { curve: [[0.38, 0.42], [0.62, 0.42]], at: "two:raides+0.25" },
        { note: "tout droit", pos: [0.5, 0.88], at: "two:deux", size: 48 },
      ],
    },
    {
      art: kritios, at: "two:vers", out: "three_t:trois", x: 540, y: 560, w: 340, rot: 3,
      marks: [
        { censor: [0.43, 0.55], w: 0.24, at: "two:vers" },
        { curve: [[0.25, 0.455], [0.7, 0.43]], at: "two:hanche" },
        { note: "ça bouge !", pos: [0.5, 0.34], at: "two:respire", size: 48 },
      ],
    },
    {
      art: david, at: "three:2", out: "outro:chaque", x: 280, y: 560, w: 520, rot: 2,
      marks: [
        { ...DAVID_CENSOR, at: "three:2" },
        { arrow: [[0.4, 0.56], [0.44, 0.88]], at: "three:jambe" },
        { curve: [[0.3, 0.415], [0.6, 0.445]], at: "three:hanche" },
        { curve: [[0.22, 0.26], [0.6, 0.215]], at: "three:épaules" },
      ],
    },
    { art: dory, at: "outro:chaque", x: 80, y: 560, w: 200, rot: -5, marks: [{ censor: [0.47, 0.43], w: 0.3, at: "outro:chaque" }] },
    { art: kritios, at: "outro:chaque+0.17", x: 420, y: 590, w: 180, rot: 4, marks: [{ censor: [0.43, 0.55], w: 0.32, at: "outro:chaque" }] },
    { art: david, at: "outro:chaque+0.33", x: 690, y: 570, w: 290, rot: -3, marks: [{ censor: [0.455, 0.515], w: 0.24, at: "outro:chaque" }] },
  ],
  tapes: [
    { text: "Kendall, J.Lo, Selena", at: "hook:insta", out: "intro:trucs", x: 270, y: 1250, rot: 3, size: 50 },
    { text: "3 trucs à savoir", at: "intro:trucs", out: "one_t:un", x: 230, y: 860, rot: -3, size: 80 },
    { text: "Polyclète, le Doryphore", at: "one:une", out: "two_t:deux", x: 300, y: 470, rot: -2, size: 42 },
    { text: "kouros, v. 590 av. J.-C.", at: "two:avant+0.3", out: "three_t:trois", x: 60, y: 1250, rot: -3, size: 40 },
    { text: "v. 480 av. J.-C.", at: "two:480", out: "three_t:trois", x: 600, y: 470, rot: 2, size: 44 },
    { text: "Michel-Ange, 1504", at: "three:david", out: "outro:chaque", x: 60, y: 470, rot: -2, size: 44 },
  ],
  outro: { at: "outro:chaque", lines: ["chaque jour, 1 notion", "pour lire toutes les œuvres"], follow: "outro:abonne", tomorrow: "notion n°2 demain" },
});
