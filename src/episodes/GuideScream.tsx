import { createGuideEpisode, type Voice } from "../guide/engine";
import voice from "../../public/voice/GuideScream.json";

// Edvard Munch, The Scream (Skrik), 1893, tempera and crayon on cardboard, 91 × 73.5 cm, Nasjonalmuseet, Oslo
// (NG.M.00939). Facts checked against Wikipedia EN "The Scream" and the museum: Munch's diary entry (headed "Nice,
// 22 January 1892") tells the walk with two friends on a path above Kristiania (Oslo) at sunset, the clouds turning
// "blood red", Munch stopping, exhausted, while his friends walked on, and "an infinite scream passing through
// nature"; the German title of its first showing was "Der Schrei der Natur". The pencil inscription in the sky ("Kan
// kun være malet af en gal mand", only on this version) was written by Munch himself, around 1895 (Nasjonalmuseet,
// 2021; The Art Newspaper, Smithsonian). That the figure covers its ears against the cry, rather than screaming, is
// the episode's reading (bible/script.md rule 4; several scholars share it). Disputed explanations of the sky
// (Krakatoa, his sister's asylum nearby) stay out.
// Images (public/art/SOURCES.md): the museum's scan (Commons "Edvard Munch - The Scream - NG.M.00939 - National
// Museum of Art, Architecture and Design.jpg", 6703 × 8322) saved at 3222 px, with native-resolution insets of the
// face and the inscription; the figure cut out with rembg (u2net); collage pieces in public/art/collage-scream.
const keep = { src: "art/scream-figure.png", x: 0.36002, y: 0.46, w: 0.32, h: 0.54 };
export const guideScream = createGuideEpisode({
  voiceFile: "voice/GuideScream.mp3",
  voice: voice as Voice,
  image: { src: "art/scream.jpg", width: 3222, height: 4000 },
  insets: [
    { src: "art/scream-face.jpg", x: 0.39997, y: 0.45999, w: 0.26003, h: 0.26003 },
    { src: "art/scream-note.jpg", x: 0.17007, y: 0.12497, w: 0.2199, h: 0.04999 },
  ],
  maxWidth: 1000,
  climb: true,
  climbFrom: "start",
  // The whole painting, full width.
  openView: { z: 0.957, fx: 0.5, fy: 0.5 },
  tight: true,
  lead: {
    hook: {
      glow: [{ word: "personnage", fx: 0.528, fy: 0.58, w: 0.15, h: 0.19 }],
    },
    // The evening walk above Oslo: the painting tears open onto a collage.
    context: {
      collage: {
        word: "soir",
        intro: "rip",
        outro: "page",
        push: 0.2,
        pieces: [
          { src: "art/collage-scream/kraft.jpg", x: 0, y: 0, w: 1080, depth: 0 },
          { disc: "#E2602E", x: 560, y: 250, w: 400, depth: 0.25, at: "soir" },
          { src: "art/collage-scream/kristiania.png", x: 150, y: 560, w: 910, rot: 3, depth: 0.45, at: "chemin" },
          { src: "art/collage-scream/munch.png", x: 50, y: 250, w: 430, rot: -3, depth: 0.6, at: "munch" },
          { tape: "EDVARD MUNCH", x: 60, y: 770, w: 46, rot: -3, depth: 0.9, at: "marche", over: true },
          { tape: "OSLO", x: 760, y: 500, w: 64, rot: 4, depth: 0.9, at: "d'oslo", over: true },
        ],
      },
    },
  },
  // Alone: the world goes grey around him and the music stops; on "nature" the colour comes back from the sky.
  freeze: { from: ["d2", "seul"], to: ["d4", "nature"], fx: 0.53, fy: 0.75, rx: 0.13, ry: 0.27, spread: { fx: 0.5, fy: 0.12, dur: 1.6 } },
  // The wind over the fjord, muffled while he covers his ears, a heartbeat under it.
  ambience: { src: "sfx/v4/wind.wav", muffled: "sfx/v4/wind-muffled.wav", from: ["context", "soir"], muffle: ["d3", "oreilles"], clear: ["d4", "nature"], volume: 0.3 },
  heart: { src: "sfx/v4/heart.wav", from: ["d3", "oreilles"], to: ["d4", "nature"], volume: 0.8 },
  loop: { word: "voilà" },
  header: "EDVARD MUNCH · 1893",
  title: ["Le", "Cri."],
  // Coordinates measured on a grid over public/art/scream.jpg; collage pieces in px of the full-width view
  // (screen x = 0.4 + 1079 fx, y = 30 + 1340 fy).
  details: [
    {
      // The sky turns blood red.
      id: "d0", fx: 0.5, fy: 0.15,
      view: { z: 1.3, fx: 0.5, fy: 0.4 },
      hold: 0.8,
      shine: [{ word: "rouge", fx: 0.5, fy: 0.14, rx: 0.75, ry: 0.2, tint: "rgba(170,0,0,0.5)" }],
      beat: { pose: "point-right", x: 230 },
    },
    {
      // Munch stops; his two friends walk on at the far end of the bridge.
      id: "d1", fx: 0.4, fy: 0.5,
      view: { z: 1.15, fx: 0.4, fy: 0.52 },
      spots: [
        { word: "munch", fx: 0.53, fy: 0.68, rx: 0.13, ry: 0.25, name: "Munch" },
        { word: "amis", fx: 0.07, fy: 0.44, rx: 0.07, ry: 0.11, name: "ses amis", dx: 150 },
      ],
      beat: { pose: "point-right", x: 230 },
    },
    {
      // Alone, grey; his own words; the cry spreading through the landscape.
      id: "d2", fx: 0.5, fy: 0.45,
      view: { z: 1.0, fx: 0.5, fy: 0.48 },
      notes: [{ word: "raconté", text: "« Un cri infini traversait la nature » — Munch", fx: 0.2, fy: 0.2, dx: -150, dy: -40 }],
      ripples: { word: "cri", fx: 0.55, fy: 0.37, from: 0.03, to: 0.9 },
      sfx: [{ word: "cri", src: "sfx/v4/nature-cry.wav", volume: 0.3 }],
      beat: { pose: "back", x: 230 },
    },
    {
      // The face: hands, mouth; he is not screaming, he covers his ears against the cry closing in on him.
      id: "d3", fx: 0.528, fy: 0.6,
      view: { z: 3.2, fx: 0.528, fy: 0.6 },
      glow: [
        { word: "mains", fx: 0.45, fy: 0.615, w: 0.03, h: 0.06, round: true },
        { word: "mains", fx: 0.612, fy: 0.615, w: 0.03, h: 0.06, round: true },
        { word: "bouche", fx: 0.525, fy: 0.625, w: 0.025, h: 0.04, round: true },
      ],
      collage: {
        word: "ce",
        pieces: [{ tape: "IL HURLE", x: 90, y: 420, w: 64, rot: -5, depth: 0.9, at: "ce", strike: "hurle" }],
      },
      ripples: { word: "oreilles", fx: 0.528, fy: 0.575, from: 0.22, to: 0.085, inward: true },
      hold: 0.6,
      beat: { pose: "point-right", x: 230 },
    },
    {
      // The colour comes back from the sky; the sky, the fjord, the path traced in red; everything undulates but him.
      id: "d4", fx: 0.5, fy: 0.5,
      view: { z: 0.957, fx: 0.5, fy: 0.5 },
      collage: {
        word: "ciel",
        push: 0,
        pieces: [
          { pencil: "M 20 345 C 180 325 260 312 324 318 S 520 340 648 332 S 880 300 1000 296", x: 0, y: 0, w: 1080, depth: 1, at: "ciel", draw: 0.6 },
          { pencil: "M 130 593 C 250 590 330 578 420 570 S 600 552 650 530 C 690 510 670 482 620 478 S 520 470 470 474", x: 0, y: 0, w: 1080, depth: 1, at: "fjord", draw: 0.6 },
          { pencil: "M 116 565 L 478 851 M 672 960 L 1004 1176", x: 0, y: 0, w: 1080, depth: 1, at: "chemin", draw: 0.6 },
        ],
      },
      wave: { word: "ondule", amp: 0.014, keep },
      sfx: [
        { word: "ciel", src: "sfx/v2/pencil-1.wav", volume: 0.5 },
        { word: "fjord", src: "sfx/v2/pencil-2.wav", volume: 0.5 },
        { word: "chemin", src: "sfx/v2/pencil-3.wav", volume: 0.5 },
        { word: "ondule", src: "sfx/v4/nature-cry.wav", volume: 0.55 },
      ],
      hold: 0.8,
      beat: { pose: "explaining", x: 230 },
    },
    {
      // Munch's pencil line in the sky, read at native resolution.
      id: "d5", fx: 0.277, fy: 0.147,
      view: { z: 4.0, fx: 0.277, fy: 0.147 },
      glow: [{ word: "crayon", fx: 0.277, fy: 0.147, w: 0.17, h: 0.02 }],
      // Too faint to read on a phone: the line written out under it.
      notes: [{ word: "ciel", text: "« Kan kun være malet af en gal mand »", fx: 0.277, fy: 0.147, dx: -215, dy: 130 }],
      collage: {
        word: "fou",
        pieces: [{ tape: "FOU", x: 640, y: 1010, w: 90, rot: -6, depth: 0.95, at: "fou" }],
      },
      hold: 0.6,
      beat: { pose: "reading", x: 230 },
    },
    {
      // The answer, over the whole painting, then back to the opening shot.
      id: "d6", fx: 0.5, fy: 0.5,
      view: { z: 0.957, fx: 0.5, fy: 0.5 },
      collage: {
        word: "cri",
        until: "voilà",
        pieces: [
          { tape: "UN CRI QU'ON ENTEND", x: 90, y: 400, w: 50, rot: -4, depth: 0.9, at: "cri", strike: "a" },
          { tape: "UNE ANGOISSE QU'ON RESSENT", x: 70, y: 560, w: 46, rot: 3, depth: 0.9, at: "angoisse" },
        ],
      },
      beat: { pose: "explaining", x: 230 },
    },
  ],
});
