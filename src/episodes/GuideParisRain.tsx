import { createGuideEpisode, type Voice } from "../guide/engine";
import voice from "../../public/voice/GuideParisRain.json";

// Gustave Caillebotte, Paris Street; Rainy Day (Rue de Paris, temps de pluie), 1877, oil on canvas, 212 × 276 cm,
// Art Institute of Chicago (1964.336). Script v5 (25 Oct. 2026), every claim checked:
// - before Haussmann the centre's streets were 1–2 m wide, without sewers, waste thrown into the street (EN Wikipedia
//   "Haussmann's renovation of Paris", Fondation Napoléon); cholera 1832: about 19,000–20,000 dead out of 861,400 (more
//   than one in fifty); the rats are an evocation, no figure rests on them;
// - Napoléon III and Haussmann (prefect 1853–1870 = 17 years, paris.fr); about 20,000 buildings demolished;
// - seven armed uprisings in the centre between 1830 and 1848 (18 years), barricades in the narrow streets; the riot
//   control is one motive of the wide straight streets (EN Wikipedia, Universalis); no Haussmann quotation is used;
// - the Haussmann building ranks people by floor: the "étage noble" on the 2nd with the long balcony, plainer going
//   up, maids' rooms under the roof (Paris Zigzag); rents soared (IDHES Nanterre, Slate);
// - in the painting a workman in a white smock carries a ladder, between the man's head and the umbrella's stick
//   (6000 px scan); "en allant travailler" is our reading.
// The loop: the last line stops on "dans ce tableau…" and the hook completes it ("…tout le monde regarde ce couple").
// Style (bible/vox.md): the painting is the anchor, the history runs as collage shots on one palette.
const FULL = { z: 0.584, fx: 0.5, fy: 0.5 };
// The opening frame: the couple, the workman small behind the man; the loop lands back on it.
const COUPLE = { z: 1.5, fx: 0.66, fy: 0.52 };
// The workman fills the frame, the hat's edge on the left and the umbrella's stick on the right (out/grid.png on the
// 6000 px scan: body 0.646–0.656 × 0.430–0.469, the ladder's top at 0.644, 0.428).
const WORKMAN = { z: 6, fx: 0.65, fy: 0.447 };
const BODY = { fx: 0.652, fy: 0.452, w: 0.014, h: 0.04 };
const ART = "art/paris-rain";
const CRUMPLED = "art/paper/crumpled.jpg";
// The Magenta building fills the shot: shot y = 1600 fy − 100 (2nd-floor balcony at fy 0.585, 5th at 0.21, roof 0.11).
export const guideParisRain = createGuideEpisode({
  voiceFile: "voice/GuideParisRain.mp3",
  voice: voice as Voice,
  // The 6000 px scan (Google Arts & Culture): the workman is 250 px tall in it, enough for the close-ups.
  image: { src: `${ART}/paris-rain-6k.jpg`, width: 5981, height: 4530 },
  maxWidth: 1000,
  climb: true,
  climbFrom: "start",
  openView: COUPLE,
  openPose: "loupe",
  // Offenbach, the composer of Second Empire Paris: the Barcarolle on a 1928 78 rpm (instrumental trio), cleaned.
  music: "music/barcarolle.mp3",
  tight: true,
  loop: { word: "aujourd'hui" },
  header: "GUSTAVE CAILLEBOTTE · 1877",
  title: ["Saurez-vous", "le trouver ?"],
  // Cream paper, black ink, one red (pencil, stamps, the marked one), the yellow highlighter; fields in the painting's
  // own muted ochre and slate blue.
  palette: { paper: "#EFE6D2", accent: "#C0281C", hl: "#F4C531", ochre: "#C9A15A", blue: "#4A6B84" },
  lead: {
    // The camera dives onto him: his smock, his ladder.
    context: {
      view: WORKMAN,
      glow: [
        { word: "blouse", ...BODY },
        { word: "échelle", fx: 0.6425, fy: 0.424, w: 0.009, h: 0.013 },
      ],
    },
  },
  details: [
    {
      // A street of old Paris full frame; a paper rat scurries across it; then one Parisian in fifty.
      id: "d1", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "des", in: "tear", source: "Charles Marville, rue du Haut-Moulin, vers 1865", cam: { from: [0, 0, 1], to: [0, -30, 1.08] },
          layers: [
            { bg: `${ART}/ruelle-haut-moulin.jpg` },
            { tape: "1 à 2 mètres", x: 330, y: 160, size: 60, rot: -3, z: 0.9, at: "mètres" },
            { tape: "Pas d'égouts", x: 90, y: 300, size: 52, rot: 2, z: 0.92, at: "égouts" },
            { rig: "rat", x: 1100, y: 940, w: 320, z: 0.95, at: "ordures", enter: "none", flip: true, travel: [-1560, 0, 3.4] },
          ],
        },
        {
          word: "en", in: "slide", source: "Choléra de 1832 : environ 19 000 morts pour 860 000 Parisiens", cam: { from: [0, 0, 1.04], to: [0, 0, 1] },
          layers: [
            { field: "paper", dots: "none", paper: CRUMPLED },
            { grid: 50, cols: 10, size: 92, mark: 37, cue: "cinquante", x: 80, y: 260, enter: "none" },
            { big: "1\u00a0sur\u00a050", size: 150, x: 120, y: 60, rot: -2, z: 0.9, at: "choléra", enter: "slap", color: "#1C1B19" },
          ],
        },
      ],
      sfx: [{ word: "rats", src: "sfx/story/squeak.wav", volume: 0.5 }],
      beat: { pose: "explaining", x: 230 },
    },
    {
      // The emperor and his prefect in paper, hacking at Paris as the caricaturists drew it; then the number.
      id: "d2", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "alors", in: "slide", source: "« Paris envahi par les démolisseurs », caricature, vers 1868", cam: { from: [0, 0, 1], to: [0, 0, 1.04] },
          layers: [
            { field: "ochre", dots: "br", paper: CRUMPLED },
            { src: `${ART}/paris-envahi.png`, x: 40, y: 40, w: 1000, rot: -1, z: 0.2, enter: "none" },
            { rig: "napoleon", x: 150, y: 250, w: 320, z: 0.6, at: "napoléon", enter: "rise", delay: 0.25 },
            { rig: "haussmann", x: 590, y: 230, w: 340, z: 0.65, at: "haussmann", enter: "rise", flip: true, delay: 0.25 },
            { name: ["Napoléon III", "empereur"], x: 90, y: 880, size: 46, rot: -2, z: 0.95, at: "napoléon" },
            { name: ["Haussmann", "préfet de la Seine"], x: 560, y: 910, size: 46, rot: 2, z: 0.95, at: "haussmann" },
          ],
        },
        {
          word: "vingt", in: "blur", carry: true, source: "Charles Marville, avenue de l'Opéra, 1877", shake: "rasés", cam: { from: [0, 0, 1.06], to: [0, 0, 1] },
          layers: [
            { field: "paper", dots: "none", paper: CRUMPLED },
            { src: `${ART}/demolition.png`, x: -10, y: 330, w: 1100, rot: -2, z: 0.4, enter: "none" },
            { big: "20 000", size: 220, x: 60, y: 120, rot: -3, z: 0.9, enter: "slap", color: "#1C1B19" },
            { tape: "immeubles rasés", x: 450, y: 330, size: 54, rot: 3, z: 0.92, at: "immeubles" },
          ],
        },
      ],
      sfx: [
        { word: "rasés", src: "sfx/story/pick-3.wav", volume: 0.5 },
      ],
      beat: { pose: "explaining", x: 230 },
    },
    {
      // The plan of 1868 with its new streets in red; seven uprisings; a barricade of 1848; then a boulevard.
      id: "d3", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "et", in: "slide", source: "Andriveau-Goujon, plan des travaux de Paris, 1868", cam: { from: [0, 0, 1], to: [-60, 40, 1.35] },
          layers: [
            { field: "paper", dots: "none", paper: CRUMPLED },
            { src: `${ART}/map-1868.png`, x: -40, y: 120, w: 1160, z: 0.5, enter: "none" },
          ],
        },
        {
          word: "connu", in: "cut", source: "Sept insurrections à Paris, 1830-1848", cam: { from: [0, 0, 1], to: [0, 0, 1.04] },
          layers: [
            { field: "blue", dots: "tl", paper: CRUMPLED },
            { big: "7", size: 520, x: 330, y: 40, z: 0.9, enter: "slap", color: "#EFE6D2" },
            { tape: "insurrections en 18 ans", x: 170, y: 760, size: 54, rot: -2, z: 0.95, at: "insurrections" },
          ],
        },
        {
          word: "une", in: "tear", carry: true, source: "Thibault, barricade rue Saint-Maur, 1848 · rue de Rivoli, 1854", cam: { from: [0, 0, 1.04], to: [0, 0, 1] },
          layers: [
            { field: "paper", dots: "none", paper: CRUMPLED },
            { src: `${ART}/barricade-1848.png`, x: 40, y: 40, w: 520, rot: -3, z: 0.4, enter: "none" },
            { tape: "barricade", x: 60, y: 450, size: 50, rot: -4, z: 0.9, at: "barricade" },
            { src: `${ART}/rivoli-1854.png`, x: 380, y: 520, w: 680, rot: 3, z: 0.6, at: "beaucoup" },
          ],
        },
      ],
      beat: { pose: "explaining", x: 230 },
    },
    {
      // A real Haussmann building, floor by floor: the noble floor lit, the arrow up, the maids under the roof.
      id: "d4", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "à", in: "slide", carry: true, source: "Immeuble haussmannien, 50 boulevard de Magenta (photo Wikimedia Commons)", cam: { from: [0, 0, 1.05], to: [0, 0, 1] },
          layers: [
            { bg: `${ART}/immeuble-magenta.jpg` },
            { marker: [150, 730, 820, 110], at: "riches" },
            { tape: "les riches", x: 600, y: 860, size: 52, rot: -2, z: 0.92, at: "riches" },
            { arrow: [960, 900, 960, 130], bend: 0, color: "accent", width: 12, at: "monte", draw: 0.8 },
            { tape: "les bonnes", x: 380, y: 130, size: 52, rot: 2, z: 0.92, at: "bonnes" },
          ],
        },
      ],
      beat: { pose: "point-up", x: 230 },
    },
    {
      // Who built them: the Opéra's building site and its stonecutters; him; then the rents.
      id: "d5", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "ces", in: "slide", source: "Delmaët & Durandelle, chantier de l'Opéra · Atget, tailleurs de pierre", cam: { from: [0, 0, 1], to: [0, 0, 1.04] },
          layers: [
            { field: "blue", dots: "br", paper: CRUMPLED },
            { src: `${ART}/opera-chantier.png`, x: 30, y: 40, w: 760, rot: -2, z: 0.4, enter: "none" },
            { src: `${ART}/tailleur-1.png`, x: 520, y: 430, w: 540, rot: 3, z: 0.5, at: "ouvriers" },
            { src: `${ART}/ouvrier-print.png`, x: 40, y: 520, w: 380, rot: -4, z: 0.8, at: "lui", enter: "pop" },
          ],
        },
        {
          word: "sauf", in: "cut", source: "Honoré Daumier, « Locataires et propriétaires »", cam: { from: [0, 0, 1.05], to: [0, 0, 1] },
          layers: [
            { field: "paper", dots: "none", paper: CRUMPLED },
            { src: `${ART}/daumier-demenagement.png`, x: -30, y: 300, w: 1140, rot: -2, z: 0.5, enter: "none" },
            { letters: "LOYERS", x: 140, y: 110, w: 800, size: 130, at: "loyers" },
          ],
        },
      ],
      beat: { pose: "skeptical", x: 230 },
    },
    {
      // On him, then the loop flies back to the couple of the first frame as the line breaks off.
      id: "d6", fx: 0.65, fy: 0.447,
      view: WORKMAN,
      beat: { pose: "point-up", x: 230 },
    },
  ],
});
