import { createGuideEpisode, type Voice } from "../guide/engine";
import voice from "../../public/voice/GuideExposNov.json";
import { ParisCentre } from "../guide/maps/paris-centre";
import type { Shot } from "../guide/shots";

// "L'Agenda" pilot: the shows to see in Paris in November 2026, the Guide at home under a blanket on a rainy day.
// Every fact checked on 28 Oct. 2026 (official pages first):
// - Bruxelles 1900, Petit Palais, 10 Nov. 2026 – 25 Apr. 2027, 17 € (petitpalais.paris.fr; Khnopff's Caresses on it);
// - Les secrets de l'Alhambra, Institut du monde arabe, 24 Nov. 2026 – 16 May 2027, 17 €, 12–26 ans 9 € (imarabe.org);
// - Zurbarán, Louvre (Hall Napoléon), 7 Oct. 2026 – 25 Jan. 2027, 22 € EEA (louvre.fr; Sainte Casilda on it);
// - Cézanne et nous, Grand Palais, 23 Sept. 2026 – 17 Jan. 2027, 19 € (grandpalais.fr: Gauguin, Matisse, Picasso,
//   Mondrian … ; La Montagne Sainte-Victoire au grand pin among the highlights);
// - Mary Cassatt, musée d'Orsay, 6 Oct. 2026 – 31 Jan. 2027, 16 € (musee-orsay.fr); the only American to show with
//   the Impressionists;
// - free under 26 for EEA residents, shows included: Louvre (Grille tarifaire EPML 2026: 18–25 EEA) and Orsay
//   (musee-orsay.fr "Young people under 26");
// - métro: Champs-Élysées – Clemenceau (Petit and Grand Palais), Jussieu (IMA), Palais-Royal – Musée du Louvre,
//   Solférino and RER C Musée d'Orsay.
// Music: Django Reinhardt, « Belleville » (1943). The app line has no user count until the app is out.
const ART = "art/expos";
const KRAFT = "art/paper/kraft.jpg";
const DARK = "art/paper/dark.jpg";
const RAIN = "art/paris-rain";
const FULL = { z: 0.5, fx: 0.5, fy: 0.5 };

// The map 1080 px wide at y 200 (map units × 1.08); the pins in the order of the list, each new one landing on its
// word while the ones before stay down. IMA and both Palais are placed by hand (OSM's points: whole building blocks).
const MAP_Y = 200;
const PINS: [string, number, number, "left"?][] = [
  ["Petit Palais", 318, 326],
  ["IMA", 824, 634],
  ["Louvre", 546.9, 419.4],
  ["Grand Palais", 288, 322, "left"],
  ["Orsay", 429.8, 419, "left"],
];
// Streets in ink and the river on the parchment (the land is left unfilled: Paris's outline is bigger than the frame).
const MAP = { map: ParisCentre, land: "transparent", streets: true, labels: [["Seine", 160, 440]] as [string, number, number][], x: 0, y: MAP_Y, w: 1080 };
// The map with pins 0 … n, pin n landing on `cue`; the camera leans towards it.
const mapShot = (n: number, word: string, cue: string): Shot => {
  const [, x, y] = PINS[n];
  const px = x * 1.08 - 540;
  const py = y * 1.08 + MAP_Y - 600;
  return {
    word, in: "cut", cam: { from: [0, 0, 1], to: [-px * 0.2, -py * 0.2, 1.1] },
    layers: [
      { bg: "art/paper/parchment.jpg" },
      { ...MAP, pins: PINS.slice(0, n + 1), landed: n, cue, enter: "none" },
    ],
  };
};
// The show's card: its key work, then the ticket with the practical facts.
type Rows = ["M" | "date" | "price", string][];
const ticket = (title: string, venue: string, rows: Rows, y: number) =>
  ({ entry: title, venue, rows, x: 140, y, w: 800, rot: -1.5, z: 0.9, after: 0.35 });

export const guideExposNov = createGuideEpisode({
  voiceFile: "voice/GuideExposNov.mp3",
  voice: voice as Voice,
  // Caillebotte's rainy Paris is the ground under everything (the shots cover it end to end).
  image: { src: `${RAIN}/paris-rain.jpg`, width: 4000, height: 3030 },
  maxWidth: 1000,
  climb: true,
  climbFrom: "start",
  openView: FULL,
  openPose: "cozy",
  // Paris, warm indoors: Django Reinhardt's « Belleville » (1943).
  music: "music/belleville.mp3",
  tight: true,
  header: "AGENDA · PARIS",
  title: ["Les expos", "de novembre"],
  palette: { paper: "#EDE5D3", accent: "#C0281C", hl: "#F4C531" },
  lead: {
    hook: {
      shots: [
        {
          // November through the window: Caillebotte's wet street, rain running down the glass.
          word: "novembre", in: "cut", cam: { from: [0, 0, 1], to: [0, -20, 1.06] },
          layers: [
            { bg: DARK },
            { src: `${ART}/rain-window.png`, x: 60, y: 140, w: 960, rot: -1, z: 0.4, enter: "none" },
            { rain: 70 },
            { letters: "NOVEMBRE", size: 105, x: 70, y: 930, rot: -3, z: 0.95, at: "novembre" },
            { tape: "PARFAIT POUR LES MUSÉES !", size: 60, x: 150, y: 1140, rot: 3, z: 0.95, at: "parfait" },
          ],
        },
        {
          // The five shows tossed on the table, then the number.
          word: "voici", in: "whip", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          layers: [
            { bg: KRAFT },
            { src: `${ART}/caresses.png`, x: 40, y: 120, w: 560, rot: -6, z: 0.5, enter: "toss", at: "voici" },
            { src: `${ART}/casilda.png`, x: 680, y: 80, w: 300, rot: 5, z: 0.5, enter: "toss", at: "voici", after: 0.15 },
            { src: `${ART}/lions.png`, x: 60, y: 420, w: 460, rot: 4, z: 0.5, enter: "toss", at: "voici", after: 0.3 },
            { src: `${ART}/cassatt.png`, x: 720, y: 560, w: 300, rot: -4, z: 0.5, enter: "toss", at: "voici", after: 0.45 },
            { src: `${ART}/victoire.png`, x: 200, y: 760, w: 520, rot: -2, z: 0.5, enter: "toss", at: "voici", after: 0.6 },
            { big: "5", size: 420, x: 400, y: 330, z: 0.95, at: "cinq" },
            { letters: "EXPOS", size: 110, x: 470, y: 1000, rot: -2, z: 0.95, at: "expos" },
          ],
        },
      ],
      sfx: [
        { word: "novembre", src: "sfx/story/rain.wav", volume: 0.5 },
        { word: "parfait", src: "sfx/accents/tape.wav", volume: 0.5 },
        { word: "voici", src: "sfx/accents/swish-2.wav", volume: 0.5 },
      ],
      poses: [{ word: "voici", pose: "cape" }],
    },
    context: {
      shots: [
        {
          // The map unfolded on the table.
          word: "on", in: "slide", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.04] },
          layers: [
            { bg: "art/paper/parchment.jpg" },
            { ...MAP, enter: "drop" },
          ],
        },
      ],
      sfx: [{ word: "carte", src: "sfx/accents/page-2.wav", volume: 0.6 }],
      poses: [{ word: "on", pose: "map" }],
    },
  },
  details: [
    {
      id: "d1", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        mapShot(0, "un", "bruxelles"),
        {
          word: "dès", in: "push", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          layers: [
            { bg: KRAFT },
            { src: `${ART}/caresses.png`, x: 50, y: 150, w: 980, rot: -1, z: 0.5, enter: "slap", gilt: true },
            ticket("Bruxelles 1900", "Petit Palais", [["date", "10 nov. → 25 avr. 2027"], ["M", "Champs-Élysées – Clemenceau"], ["price", "17 €"]], 620),
          ],
        },
      ],
      sfx: [
        { word: "bruxelles", src: "sfx/accents/thud.wav", volume: 0.45 },
        { word: "dès", src: "sfx/accents/swish-1.wav", volume: 0.45 },
      ],
      beat: { pose: "point-up", x: 230 },
    },
    {
      id: "d2", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        mapShot(1, "deux", "l'institut"),
        {
          word: "dès", in: "push", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          layers: [
            { bg: KRAFT },
            { src: `${ART}/lions.png`, x: 90, y: 70, w: 900, rot: -2, z: 0.5, enter: "slap" },
            ticket("Les secrets de l'Alhambra", "Institut du monde arabe", [["date", "24 nov. → 16 mai 2027"], ["M", "Jussieu"], ["price", "17 € · 9 € (12-26 ans)"]], 740),
          ],
        },
      ],
      sfx: [
        { word: "l'institut", src: "sfx/accents/thud.wav", volume: 0.45 },
        { word: "dès", src: "sfx/accents/swish-1.wav", volume: 0.45 },
      ],
      beat: { pose: "explaining", x: 230 },
    },
    {
      id: "d3", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        mapShot(2, "trois", "zurbarán"),
        {
          word: "le", in: "push", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          layers: [
            { bg: KRAFT },
            { src: `${ART}/casilda.png`, x: 360, y: 30, w: 360, rot: 1, z: 0.5, enter: "slap", gilt: true },
            ticket("Zurbarán", "Louvre · Hall Napoléon", [["date", "Jusqu'au 25 janv. 2027"], ["M", "Palais-Royal – Musée du Louvre"], ["price", "22 €"]], 670),
          ],
        },
      ],
      sfx: [
        { word: "zurbarán", src: "sfx/accents/thud.wav", volume: 0.45 },
        { word: "le", src: "sfx/accents/swish-1.wav", volume: 0.45 },
      ],
      beat: { pose: "point-up", x: 230 },
    },
    {
      id: "d4", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        mapShot(3, "quatre", "cézanne"),
        {
          word: "face", in: "push", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          layers: [
            { bg: KRAFT },
            { src: `${ART}/victoire.png`, x: 110, y: 50, w: 860, rot: -1, z: 0.5, enter: "slap", gilt: true },
            ticket("Cézanne et nous", "Grand Palais", [["date", "Jusqu'au 17 janv. 2027"], ["M", "Champs-Élysées – Clemenceau"], ["price", "19 €"]], 730),
            { tape: "PICASSO", size: 56, x: 90, y: 520, rot: -5, z: 0.95, at: "picasso" },
            { tape: "MATISSE", size: 56, x: 420, y: 580, rot: 3, z: 0.95, at: "matisse" },
            { tape: "MONDRIAN", size: 56, x: 700, y: 520, rot: -3, z: 0.95, at: "mondrian" },
          ],
        },
      ],
      sfx: [
        { word: "cézanne", src: "sfx/accents/thud.wav", volume: 0.45 },
        { word: "face", src: "sfx/accents/swish-1.wav", volume: 0.45 },
        { word: "picasso", src: "sfx/accents/tape.wav", volume: 0.4 },
        { word: "matisse", src: "sfx/accents/tape.wav", volume: 0.4 },
        { word: "mondrian", src: "sfx/accents/tape.wav", volume: 0.4 },
      ],
      beat: { pose: "amazed", x: 230 },
    },
    {
      id: "d5", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        mapShot(4, "cinq", "mary"),
        {
          word: "la", in: "push", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          layers: [
            { bg: KRAFT },
            { src: `${ART}/cassatt.png`, x: 320, y: 40, w: 440, rot: -1, z: 0.5, enter: "slap", gilt: true },
            ticket("Mary Cassatt", "Musée d'Orsay", [["date", "Jusqu'au 31 janv. 2027"], ["M", "Solférino · RER C"], ["price", "16 €"]], 720),
            { tape: "LA SEULE AMÉRICAINE", size: 52, x: 90, y: 560, rot: -5, z: 0.95, at: "américaine" },
          ],
        },
      ],
      sfx: [
        { word: "mary", src: "sfx/accents/thud.wav", volume: 0.45 },
        { word: "la", src: "sfx/accents/swish-1.wav", volume: 0.45 },
        { word: "américaine", src: "sfx/accents/tape.wav", volume: 0.4 },
      ],
      beat: { pose: "explaining", x: 230 },
    },
    {
      // The tip: two tickets, GRATUIT stamped across both.
      id: "d6", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "astuce", in: "slide", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          layers: [
            { bg: DARK },
            { letters: "ASTUCE", size: 110, x: 250, y: 90, rot: -2, z: 0.95, at: "astuce" },
            { entry: "Louvre", venue: "Expos incluses", rows: [["price", "22 €"]], x: 30, y: 280, w: 480, rot: -4, z: 0.5, at: "louvre" },
            { entry: "Orsay", venue: "Expos incluses", rows: [["price", "16 €"]], x: 570, y: 320, w: 480, rot: 3, z: 0.5, at: "orsay" },
            { stamp: "GRATUIT", size: 190, x: 180, y: 560, rot: -8, z: 0.95, at: "gratuit" },
            { big: "-26\u00a0ANS", size: 190, x: 150, y: 860, z: 0.95, at: "26" },
            { tape: "SI TU VIS DANS L'UNION EUROPÉENNE", size: 44, x: 110, y: 1050, rot: 2, z: 0.95, at: "l'union" },
          ],
        },
      ],
      sfx: [
        { word: "louvre", src: "sfx/accents/swish-3.wav", volume: 0.4 },
        { word: "26", src: "sfx/story/coins.wav", volume: 0.4 },
      ],
      beat: { pose: "ticket", x: 230 },
    },
    {
      // The app: the Guide shows his phone; the beta sign-up.
      id: "d7", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "et", in: "push", cam: { from: [0, 0, 1], to: [0, 0, 1.06] },
          layers: [
            { bg: KRAFT },
            { note: "un guide dans ta poche", size: 64, x: 140, y: 100, w: 800, rot: -2, z: 0.5 },
            { src: `${ART}/caresses.png`, x: 40, y: 300, w: 420, rot: -5, z: 0.5, enter: "toss", at: "visiter" },
            { src: `${ART}/casilda.png`, x: 450, y: 250, w: 190, rot: 4, z: 0.5, enter: "toss", at: "visiter", after: 0.15 },
            { src: `${ART}/victoire.png`, x: 660, y: 290, w: 380, rot: -3, z: 0.5, enter: "toss", at: "visiter", after: 0.3 },
            { letters: "ANIMART", size: 115, x: 90, y: 620, rot: -2, z: 0.95, at: "animart" },
            { tape: "ARRIVE BIENTÔT", size: 64, x: 300, y: 830, rot: 3, z: 0.95, at: "arrive" },
            { stamp: "BÊTA · LIEN EN BIO", size: 90, x: 130, y: 960, rot: -6, z: 0.95, at: "lien" },
          ],
        },
      ],
      sfx: [
        { word: "visiter", src: "sfx/accents/swish-2.wav", volume: 0.45 },
        { word: "animart", src: "sfx/accents/thud.wav", volume: 0.5 },
        { word: "arrive", src: "sfx/accents/tape.wav", volume: 0.45 },
      ],
      beat: { pose: "phone", x: 230 },
    },
  ],
});
