import { createLesson } from "../lesson/engine";
import voice from "../../public/voice/Lesson01.json";

// L'art en 30 jours, Jour 1: the method to really look at a painting, on the Mona Lisa (Leonardo, Louvre).
// Facts (9 Nov. 2026):
// - under 30 s per work on average: Smith & Smith 2001, Metropolitan Museum (mean 27.2 s, median 17 s), replicated by
//   Smith, Smith & Tinio 2017 at the Art Institute of Chicago (mean 28.6 s);
// - the background's horizon sits lower on the left than on the right (Louvre, focus.louvre.fr; measured on the
//   image: left lake ≈ 0.345, right lake ≈ 0.27 of the height); its meaning is debated, so the script only shows it;
// - the smile: no contour, soft shadows (sfumato); it shows when you look at her eyes and fades when you look at the
//   mouth, because peripheral vision catches the low-frequency shadows (Margaret Livingstone, Harvard; Discover,
//   Harvard Gazette 2012);
// - she sits in a loggia ("un balcon" in the script); the landscape has winding paths, a bridge (right) and mountains.
// Music: anonymous 16th-century lute prelude (public/music/SOURCES.md).
const INK = "#1d2a44";

export const lesson01 = createLesson({
  day: 1,
  voice,
  voiceFile: "voice/Lesson01.mp3",
  music: "music/lute-prelude.mp3",
  image: { src: "art/mona-lisa/mona-lisa.jpg", ratio: 5723 / 3840 },
  hookNote: { lines: ["en moyenne", "< 30 s", "par tableau"], until: "method:la" },
  stickies: [
    { at: "method:trois", fill: "one:un", x: 575, y: 234, rot: -4, num: "1", label: "L'ensemble", check: "recap:trente" },
    { at: "method:trois+0.15", fill: "two:deux", x: 735, y: 242, rot: 3, num: "2", label: "Ce qui cloche", check: "recap:trente+0.25" },
    { at: "method:trois+0.3", fill: "three:trois", x: 895, y: 234, rot: -2, num: "3", label: "Les détails", check: "recap:trente+0.5" },
  ],
  marks: [
    // 1. The whole: her, the balcony, then the dream landscape.
    { ellipse: [0.46, 0.33, 0.2, 0.25], at: "one:femme", until: "one:paysage" },
    { line: [[0.0, 0.6], [0.17, 0.6]], at: "one:balcon", until: "two:deux", color: INK },
    { text: "balcon", pos: [0.1, 0.65], at: "one:balcon", until: "two:deux", color: INK },
    { arrow: [[0.15, 0.45], [0.1, 0.52]], at: "one:chemins", until: "two:deux" },
    { text: "chemins", pos: [0.17, 0.42], at: "one:chemins", until: "two:deux" },
    { arrow: [[0.82, 0.52], [0.87, 0.465]], at: "one:pont", until: "two:deux" },
    { text: "pont", pos: [0.8, 0.55], at: "one:pont", until: "two:deux" },
    { arrow: [[0.82, 0.1], [0.8, 0.19]], at: "one:montagnes", until: "two:deux" },
    { text: "montagnes", pos: [0.8, 0.07], at: "one:montagnes", until: "two:deux" },
    // 2. What's off: the two horizons don't meet.
    { line: [[0.0, 0.345], [0.3, 0.345]], at: "two:gauche", until: "three:trois" },
    { text: "plus bas", pos: [0.15, 0.4], at: "two:bas", until: "three:trois" },
    { line: [[0.66, 0.27], [1.0, 0.27]], at: "two:droite", until: "three:trois" },
    { arrow: [[0.84, 0.345], [0.84, 0.285]], at: "two:raccordent", until: "three:trois" },
    { text: "pas raccord !", pos: [0.8, 0.39], at: "two:raccordent", until: "three:trois" },
    // 3. The details: the mouth without a contour, then the smile that comes and goes.
    { ellipse: [0.447, 0.31, 0.075, 0.028], at: "three:contour", until: "smile:regarde" },
    { text: "zéro contour", pos: [0.447, 0.355], at: "three:ombres", until: "smile:regarde", size: 40 },
    { ellipse: [0.45, 0.232, 0.11, 0.03], at: "smile:yeux", until: "smile:sa" },
    { text: "elle sourit", pos: [0.45, 0.18], at: "smile:sourit", until: "smile:sa", size: 40 },
    { ellipse: [0.447, 0.31, 0.075, 0.028], at: "smile:bouche", until: "recap:trente" },
    { text: "… plus du tout", pos: [0.45, 0.36], at: "smile:disparaît", until: "recap:trente", size: 40 },
  ],
  shots: [
    { at: "two:regarde", x: 0.5, y: 0.32, z: 1.35 },
    { at: "three:sa", x: 0.447, y: 0.31, z: 2.6 },
    { at: "smile:regarde", x: 0.45, y: 0.27, z: 2.1 },
    { at: "recap:trente", x: 0.5, y: 0.5, z: 1 },
  ],
  tomorrow: { at: "outro:demain", text: "le détail que personne ne voit dans Le Radeau de la Méduse" },
  follow: "outro:abonne",
  tick: "outro:pendant",
});
