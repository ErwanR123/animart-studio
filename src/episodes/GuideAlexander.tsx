import { createGuideEpisode, type Voice } from "../guide/engine";
import voice from "../../public/voice/GuideAlexander.json";

// Giuseppe Cades, Alexander the Great Refuses to Take Water (1792). The episode tells Arrian's version (Anabasis VI,
// 26: the Gedrosian desert, 325 BC; Alexander pours the water on the ground before the army, "and the whole army was
// as much refreshed as if every man had drunk"). Plutarch (Alexander 42) sets a similar scene during the pursuit of
// Darius (330 BC): not used. King at 20 (336 BC), never defeated in battle, Persia, Egypt, India: Wikipedia FR/EN.
// "Boire seul, c'était leur dire : moi d'abord" is the episode's reading (bible/script.md rule 4).
// Images: public/art/SOURCES.md (the painting: Commons "Alexander the Great Refuses to Take Water.jpg", 1484 px, the
// best found online, upscaled ×4 with Real-ESRGAN and saved at 2968 px); collage pieces in public/art/alexander.
export const guideAlexander = createGuideEpisode({
  voiceFile: "voice/GuideAlexander.mp3",
  voice: voice as Voice,
  image: { src: "art/alexander/alexander.jpg", width: 2968, height: 2076 },
  maxWidth: 1000,
  climb: true,
  climbFrom: "start",
  // The whole painting, full width.
  openView: { z: 0.54, fx: 0.5, fy: 0.5 },
  tight: true,
  // Pointing up at the painting: the first frame and, with the loop, the last.
  openPose: "point-up",
  lead: {
    // Who he was: the painting tears open onto a Vox collage of his conquests.
    context: {
      collage: {
        word: "alexandre",
        intro: "rip",
        outro: "page",
        push: 0.25,
        pieces: [
          { src: "art/paper/kraft.jpg", x: 0, y: 0, w: 1080, depth: 0 },
          { disc: "#E2602E", x: 290, y: 470, w: 520, depth: 0.25 },
          { src: "art/alexander/alex-mosaic.png", x: 270, y: 440, w: 560, rot: -2, depth: 0.6 },
          { src: "art/alexander/map.png", x: 40, y: 50, w: 1000, rot: -2, depth: 0.15, at: "conquérant" },
          { src: "art/alexander/coin.png", x: 760, y: 560, w: 280, rot: 8, depth: 0.7, at: "roi" },
          { tape: "ROI À 20 ANS", x: 130, y: 640, w: 54, rot: -4, depth: 0.9, at: "vingt", over: true },
          { src: "art/alexander/battle.png", x: 440, y: 930, w: 640, rot: 4, depth: 0.5, at: "écrase" },
          { pencil: "M 120 330 C 260 250 380 420 520 360 S 800 290 960 420", x: 0, y: 0, w: 1080, depth: 0.2, at: "écrase", draw: 4.2 },
          { tape: "PERSE", x: 360, y: 250, w: 54, rot: -4, depth: 0.9, at: "perse", over: true },
          { tape: "ÉGYPTE", x: 150, y: 420, w: 54, rot: 3, depth: 0.9, at: "l'égypte", over: true },
          { tape: "INDE", x: 760, y: 330, w: 54, rot: -3, depth: 0.9, at: "inde", over: true },
          // Alexander on Bucephalus (the Pompeii mosaic) riding across the map towards India.
          { src: "art/alexander/alex-bucephalus.png", x: -930, y: 300, w: 360, depth: 0.85, at: "pousse", fly: 1500 },
          { stamp: "INVAINCU", x: 470, y: 780, w: 84, rot: -9, depth: 0.95, at: "jamais", over: true },
        ],
      },
      sfx: [
        { word: "roi", src: "sfx/story/coins.wav", volume: 0.5 },
        { word: "écrase", src: "sfx/story/sword.wav", volume: 0.55 },
      ],
    },
  },
  // From the water poured away until "bu": the scene goes grey and silent; on "comme si chacun avait bu" the colour
  // comes back as a wave from Alexander through his men.
  freeze: { from: ["d3", "verse"], to: ["d5", "comme"], fx: 0.5, fy: 0.5, rx: 0.001, ry: 0.001, spread: { fx: 0.74, fy: 0.3, dur: 1.4 } },
  loop: { word: "voilà" },
  header: "GIUSEPPE CADES · 1792",
  title: ["Alexandre", "refuse l'eau."],
  // Coordinates measured on a grid over public/art/alexander/alexander.jpg.
  details: [
    {
      // The Gedrosian desert, as a second collage (the first one turns away like a page onto it).
      id: "d0", fx: 0.5, fy: 0.5,
      collage: {
        word: "mais",
        early: 1,
        outro: "page",
        push: 0.3,
        pieces: [
          { src: "art/alexander/sand.jpg", x: 0, y: 0, w: 1080, depth: 0 },
          { stamp: "325 AV. J.-C.", x: 520, y: 300, w: 64, rot: 7, depth: 0.9, at: "325" },
          { src: "art/alexander/map.png", x: 60, y: 380, w: 960, rot: 3, depth: 0.2, at: "mais" },
          // The way back on the map: from the mouth of the Indus west along the Gedrosian coast to Pura, then Carmania.
          { pencil: "M 815 950 C 760 945 700 940 650 920 S 560 885 520 860 S 470 820 445 805", x: 0, y: 0, w: 1080, depth: 0.25, at: "chemin", draw: 2.2 },
          { tape: "RETOUR", x: 700, y: 790, w: 56, rot: -3, depth: 0.9, at: "retour" },
          { tape: "GÉDROSIE", x: 530, y: 945, w: 48, rot: -4, depth: 0.9, at: "gédrosie" },
          { src: "art/alexander/desert.png", x: 20, y: 400, w: 1040, rot: -2, depth: 0.4, at: "fournaise" },
          { disc: "#E2602E", x: 250, y: 30, w: 700, depth: 0.1, at: "fournaise" },
          { tape: "60 JOURS", x: 170, y: 700, w: 62, rot: -3, depth: 0.9, at: "semaines", over: true },
          { tape: "SANS EAU", x: 640, y: 780, w: 62, rot: 4, depth: 0.9, at: "sans", over: true },
          { src: "art/alexander/vultures.png", x: 160, y: 60, w: 760, depth: 0.75, at: "milliers", fly: 160 },
          { pencil: "M 230 760 l 26 26 m 0 -26 l -26 26 M 360 800 l 26 26 m 0 -26 l -26 26 M 520 770 l 26 26 m 0 -26 l -26 26 M 690 820 l 26 26 m 0 -26 l -26 26 M 830 790 l 26 26 m 0 -26 l -26 26", x: 0, y: 0, w: 1080, depth: 0.9, at: "meurent", draw: 0.8, over: true },
        ],
      },
      poses: [{ word: "meurent", pose: "scared" }],
      hold: 0.8,
      beat: { pose: "explaining", x: 230 },
    },
    {
      // Back to the painting: the scout and the water in a helmet (held upside down like a bowl).
      id: "d1", fx: 0.56, fy: 0.42,
      view: { z: 1.6, fx: 0.56, fy: 0.42 },
      spots: [
        { word: "éclaireurs", fx: 0.46, fy: 0.45, rx: 0.1, ry: 0.28, name: "l'éclaireur", dy: -10 },
        { word: "casque", fx: 0.615, fy: 0.45, rx: 0.08, ry: 0.07, name: "" },
      ],
      glow: [{ word: "casque", fx: 0.615, fy: 0.45, w: 0.1, h: 0.06, angle: -6 }],
      beat: { pose: "point-up", x: 230 },
    },
    {
      // Follow his finger: not to the water, to his dying men.
      id: "d2", fx: 0.33, fy: 0.5,
      view: { z: 1, fx: 0.33, fy: 0.5 },
      // Vox test: Alexander and his exhausted men cut out of the painting onto kraft, his finger drawn to the soldier.
      collage: {
        word: "doigt",
        early: 0.3,
        pieces: [
          { src: "art/paper/kraft.jpg", x: 0, y: 0, w: 1080, depth: 0 },
          { disc: "#E2602E", x: 580, y: 230, w: 460, depth: 0.25 },
          { src: "art/alexander/p-men.png", x: -20, y: 400, w: 580, rot: -3, depth: 0.5 },
          { src: "art/alexander/p-alexander.png", x: 500, y: 230, w: 560, rot: 2, depth: 0.6 },
          { pencil: "M 590 450 C 590 420 565 405 540 405 C 510 405 492 425 492 450 C 492 478 515 495 542 495 C 570 495 592 478 588 445", x: 0, y: 0, w: 1080, depth: 0.9, at: "doigt", draw: 0.5, over: true },
          { pencil: "M 500 490 C 520 640 500 780 400 860 M 400 860 L 418 826 M 400 860 L 436 856", x: 0, y: 0, w: 1080, depth: 0.9, at: "montre", draw: 0.7, over: true },
          { tape: "SES HOMMES", x: 120, y: 330, w: 54, rot: -4, depth: 0.9, at: "hommes", over: true },
          { pencil: "M 380 870 C 380 790 290 740 190 740 C 90 740 10 800 10 880 C 10 960 90 1020 190 1020 C 300 1020 385 950 375 860", x: 0, y: 0, w: 1080, depth: 0.9, at: "s'effondre", draw: 0.6, over: true },
        ],
      },
      hold: 0.8,
      beat: { pose: "point-up", x: 230 },
    },
    {
      // The water poured into the sand.
      id: "d3", fx: 0.62, fy: 0.5,
      view: { z: 1.3, fx: 0.6, fy: 0.55 },
      pour: { word: "verse", from: { fx: 0.662, fy: 0.466 }, to: { fx: 0.705, fy: 0.815 } },
      sfx: [
        { word: "verse", src: "sfx/story/pour.wav", volume: 0.7 },
        { word: "sable", src: "sfx/story/sizzle.wav", volume: 0.25 },
      ],
      poses: [{ word: "verse", pose: "amazed" }],
      hold: 1.4,
      beat: { pose: "explaining", x: 230 },
    },
    {
      // "Moi d'abord", crossed out: "avec eux".
      id: "d4", fx: 0.75, fy: 0.32,
      view: { z: 1.5, fx: 0.72, fy: 0.36 },
      collage: {
        word: "boire",
        pieces: [
          { tape: "MOI D'ABORD", x: 120, y: 330, w: 70, rot: -5, depth: 0.9, at: "moi", strike: "préfère" },
          { tape: "AVEC EUX", x: 520, y: 760, w: 78, rot: 4, depth: 0.9, at: "eux" },
        ],
      },
      hold: 1.2,
      beat: { pose: "explaining", x: 230 },
    },
    {
      // The whole painting again; the colour comes back on "bu", then the loop to the opening question.
      id: "d5", fx: 0.5, fy: 0.5,
      view: { z: 0.54, fx: 0.5, fy: 0.5 },
      collage: {
        word: "selon",
        until: "voilà",
        pieces: [{ tape: "ARRIEN, ANABASE VI, 26", x: 170, y: 960, w: 40, rot: -3, depth: 0.9, at: "arrien" }],
      },
      beat: { pose: "explaining", x: 230 },
    },
  ],
});
