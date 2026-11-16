import { createGuideEpisode, type Voice } from "../guide/engine";
import voice from "../../public/voice/GuideAthens.json";

// Raphael, The School of Athens (c. 1509–1511), Stanza della Segnatura: the wall of reason, facing the wall of faith.
// Checked against the Vatican Museums text (Plato with the Timaeus, Aristotle with the Ethics, Pythagoras writing,
// Diogenes on the steps, Heraclitus as Michelangelo, Euclid teaching geometry, Zoroaster's celestial and Ptolemy's
// terrestrial globe, Raphael's self-portrait in the black cap) and Wikipedia FR (the four themes of the room, the
// Disputa on the facing wall, read as the harmony of faith and reason; no longer told). Raphael's self-portrait at the
// right edge, in the black cap, looking out: the ending, which loops into the hook. Narration names only the consensual figures;
// the class-photo tags add Wikipedia FR's usual names for the others (Zeno, Epicurus, Averroes, Alcibiades,
// Parmenides, Plotinus); Hypatia (unfounded) is left out. Raphael is not the only figure looking out at the viewer.
// Images (Wikimedia Commons, public domain): athens.jpg "Chroma denoise" lunette crop with native-res insets,
// disputa.jpg, parnassus.jpg "Raphael - The Parnassus.jpg", justice.jpg "Rafael - Virtudes Teologales y la Ley…".
// The whole painting, full width on the full-height screen.
const WHOLE = { z: 0.37, fx: 0.5, fy: 0.5 };

export const guideAthens = createGuideEpisode({
  voiceFile: "voice/GuideAthens.mp3",
  voice: voice as Voice,
  image: { src: "art/athens/athens.jpg", width: 5200, height: 3394 },
  insets: [
    { src: "art/athens/athens-plato.jpg", x: 0.44768, y: 0.5, w: 0.12211, h: 0.14201 },
    { src: "art/athens/athens-heraclitus.jpg", x: 0.38373, y: 0.74079, w: 0.11627, h: 0.20987 },
    { src: "art/athens/athens-euclid.jpg", x: 0.75578, y: 0.7655, w: 0.13957, h: 0.20987 },
  ],
  maxWidth: 1000,
  climb: true,
  // Full screen from frame 0 on the whole painting (the class photo), the shot the loop comes back to.
  climbFrom: "start",
  openView: WHOLE,
  tight: true,
  // Test cut without the Guide or his bubbles: the painting alone, full screen once the camera climbs in.
  bare: true,
  // The last line runs into the hook: "Et toi, lesquels j'ai pas cités, tu les as reconnus ?" → "Raphaël a réuni…"
  loop: { word: "toi", view: WHOLE },
  header: "RAPHAËL · VATICAN · VERS 1510",
  plate: { work: ["L’École d’Athènes", "· Raphaël · 1509-1511"], place: "Musées du Vatican · Cité du Vatican" },
  title: ["L’École", "d’Athènes."],
  // The class photo on the hook: every name drops onto its figure while the voice says who they are.
  lead: {
    hook: {
        tags: [
          { fx: 0.05, fy: 0.67, name: "Zénon", dx: 10, dy: -170 },
          { fx: 0.238, fy: 0.522, name: "Alcibiade", dx: -40, dy: -190 },
          { fx: 0.333, fy: 0.525, name: "Socrate", dx: -10, dy: -130 },
          { fx: 0.479, fy: 0.539, name: "Platon", dx: -40, dy: -200 },
          { fx: 0.523, fy: 0.535, name: "Aristote", dx: 100, dy: -170 },
          { fx: 0.861, fy: 0.518, name: "Plotin", dx: 0, dy: -170 },
          { fx: 0.914, fy: 0.66, name: "Zoroastre", dx: -70, dy: -140 },
          { fx: 0.113, fy: 0.665, name: "Épicure", dx: -50, dy: 80 },
          { fx: 0.207, fy: 0.716, name: "Averroès", dx: 70, dy: 70 },
          { fx: 0.31, fy: 0.68, name: "Parménide", dx: 50, dy: -50 },
          { fx: 0.22, fy: 0.778, name: "Pythagore", dx: -70, dy: 130 },
          { fx: 0.432, fy: 0.77, name: "Héraclite", dx: 10, dy: 160 },
          { fx: 0.579, fy: 0.719, name: "Diogène", dx: 120, dy: 90 },
          { fx: 0.935, fy: 0.668, name: "Ptolémée", dx: -20, dy: 100 },
          { fx: 0.83, fy: 0.81, name: "Euclide", dx: 20, dy: 145 },
        ],
    },
  },
  // Coordinates measured on a grid over public/art/athens/athens.jpg (fractions of the working image).
  details: [
    {
      id: "d1", fx: 0.47, fy: 0.57,
      view: { z: 3, fx: 0.47, fy: 0.57 },
      glow: [{ word: "timée", fx: 0.4921, fy: 0.607, w: 0.012, h: 0.045, angle: -4 }],
      notes: [{ word: "timée", text: "Le Timée : la naissance de l’univers", fx: 0.4921, fy: 0.607, dx: -520, dy: -40 }],
      arrows: [{ word: "ciel", fx: 0.4508, fy: 0.5274, dir: "up", label: "le ciel" }],
      shine: [{ word: "pensée", fx: 0.5, fy: 0.43, rx: 0.075, ry: 0.09 }],
      beat: { pose: "point-right", x: 210 },
    },
    {
      id: "d2", fx: 0.55, fy: 0.6,
      view: { z: 3, fx: 0.55, fy: 0.6 },
      glow: [{ word: "éthique", fx: 0.5469, fy: 0.6247, w: 0.032, h: 0.024, angle: -8 }],
      notes: [{ word: "éthique", text: "L’Éthique : comment bien vivre", fx: 0.5469, fy: 0.6247, dx: 120, dy: -230 }],
      arrows: [{ word: "terre", fx: 0.5104, fy: 0.5746, dir: "down", label: "la terre" }],
      beat: { pose: "explaining", x: 240 },
    },
    {
      id: "d3", fx: 0.333, fy: 0.55,
      view: { z: 2.6, fx: 0.33, fy: 0.57 },
      spots: [{ fx: 0.33, fy: 0.575, rx: 0.05, ry: 0.1, name: "Socrate" }],
      questions: { word: "questionner", fx: 0.333, fy: 0.51 },
      glow: [{ word: "doigts", fx: 0.305, fy: 0.578, w: 0.03, h: 0.045, round: true }],
      beat: { pose: "point-left", x: 250 },
    },
    {
      id: "d4", fx: 0.585, fy: 0.76,
      view: { z: 2.6, fx: 0.62, fy: 0.75 },
      spots: [{ fx: 0.585, fy: 0.765, rx: 0.065, ry: 0.07, name: "Diogène" }],
      // Jean-Léon Gérôme, Diogenes (1860), Walters Art Museum (Commons, public domain).
      picture: { word: "jarre", src: "art/athens/diogenes-gerome.jpg", width: 1800, height: 1322, caption: "Gérôme, Diogène, 1860", x: 560, y: 380, w: 480 },
      beat: { pose: "back", x: 240 },
    },
    {
      id: "d5", fx: 0.432, fy: 0.77,
      view: { z: 2.4, fx: 0.44, fy: 0.84 },
      // Well up on the lower lids (his right eye, viewer's right, first), measured on the athens-heraclitus.jpg inset.
      tear: { word: "surnommait", eyes: [{ fx: 0.4345, fy: 0.7778 }, { fx: 0.425, fy: 0.7774 }], drop: 0.006 },
      spots: [{ fx: 0.43, fy: 0.835, rx: 0.055, ry: 0.12, name: "Héraclite" }],
      beat: { pose: "explaining", x: 230 },
    },
    {
      // "Et le dernier, tout au bord": straight from Heraclitus across to his face (black cap), Raphael's self-portrait;
      // on "Alors…" back out to the whole painting, the first frame.
      id: "d6", fx: 0.957, fy: 0.665,
      view: { z: 4, fx: 0.957, fy: 0.665 },
      spots: [{ word: "raphaël", fx: 0.957, fy: 0.665, rx: 0.03, ry: 0.05, name: "Raphaël" }],
      beat: { pose: "explaining", x: 230 },
    },
  ],
});
