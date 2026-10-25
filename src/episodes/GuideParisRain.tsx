import { createGuideEpisode, type Voice } from "../guide/engine";
import voice from "../../public/voice/GuideParisRain.json";
import { FLOOR_H, type Floor } from "../guide/scenery";
import { BOULEVARDS } from "./GuideParisRain.boulevards";

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
const KIT = "art/kit";
// A measuring arrow drawn in red pencil from x1 to x2 at height y, a head at each end.
const span = (x1: number, x2: number, y: number) =>
  `M ${x1} ${y} L ${x2} ${y} M ${x1 + 22} ${y - 15} L ${x1} ${y} L ${x1 + 22} ${y + 15} M ${x2 - 22} ${y - 15} L ${x2} ${y} L ${x2 - 22} ${y + 15}`;
// The old house of the rue des Sept-Voies (Marville) in five pieces, roof to shop (scripts/rigs/maison.json, canvas
// 518 × 516), laid out 330 px wide on the street at x 375, y 751: the giants knock one off at each blow.
const MAISON_K = 330 / 518;
const chunk = (n: number, [x, y, w]: [number, number, number], fall: [number, number, number, number]) => ({
  src: `${ART}/maison/maison-${n}.png`, x: 375 + x * MAISON_K, y: 751 + y * MAISON_K, w: w * MAISON_K, z: 0.5, enter: "none" as const, fall,
});
// A drawn Haussmann facade, 1000 px wide at x 40, its roof at y 60, floors stacked by their heights (scenery.tsx).
const FLOORS: Floor[] = ["toit", "5", "4", "3", "2", "1", "rdc"];
const storey = (f: Floor) => ({
  facade: f, x: 40, y: 60 + FLOORS.slice(0, FLOORS.indexOf(f)).reduce((h, g) => h + FLOOR_H[g], 0), w: 1000, z: 0.5, enter: "none" as const,
});
// The same facade scaled by `k`, its foot at `x`, `foot`; at building-site size (420 px wide, its foot at x 620, y 1000),
// floors lowered in from the street up.
const facadeAt = (f: Floor, x: number, foot: number, k: number) => ({
  facade: f, x, y: foot - k * FLOORS.slice(FLOORS.indexOf(f)).reduce((h, g) => h + FLOOR_H[g], 0), w: 1000 * k, z: 0.5,
  enter: "none" as const,
});
const siteFloor = (f: Floor, k: number) => ({ ...facadeAt(f, 620, 1000, 0.42), at: "immeubles", after: k * 0.25, enter: "crane" as const });
// Where each street's name sits when the default (just above its middle) would collide with a neighbour's.
const LABEL_AT: Record<string, [number, number]> = { "Bd Malesherbes": [90, 180], "Bd Haussmann": [300, 300], "Bd de Strasbourg": [560, 330], "Bd de Magenta": [800, 220] };
const CRUMPLED = "art/paper/crumpled.jpg";
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
  // Paris in one bar: a valse musette on the accordion, « Reine de musette » (André Verchuren, 78 rpm), cleaned.
  music: "music/reine-de-musette.mp3",
  tight: true,
  loop: { word: "aujourd'hui" },
  // The search game of the title: the glass looks at her face, his, his hand on the umbrella, the passers-by, and stops
  // on the workman behind them on "derrière".
  search: { word: "derrière", path: [[0.757, 0.466], [0.592, 0.452], [0.662, 0.571], [0.548, 0.44], [0.651, 0.442]] },
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
      // A street of old Paris full frame: its width measured, slops thrown out of a window, flies, a rat; then one
      // Parisian in fifty.
      id: "d1", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "des", in: "tear", source: "Charles Marville, rue du Haut-Moulin, vers 1865", cam: { from: [0, 0, 1], to: [0, -30, 1.08] },
          layers: [
            { bg: `${ART}/ruelle-haut-moulin.jpg` },
            // The width between the two walls, measured in red pencil across the alley.
            { pencil: span(408, 732, 640), width: 8, at: "deux", draw: 0.5 },
            { note: "1 à 2 m", x: 470, y: 668, w: 220, size: 54, rot: -3, z: 0.9, at: "mètres" },
            { tape: "Pas d'égouts", x: 90, y: 300, size: 52, rot: 2, z: 0.92, at: "égouts" },
            { flies: 7, x: 170, y: 1000, w: 240, z: 0.5, enter: "none" },
            // A bucket emptied out of the window on the right wall, down onto the cobbles.
            { pour: 850, x: 765, y: 230, z: 0.5, at: "ordures", enter: "none" },
            { flies: 6, x: 660, y: 1060, w: 220, z: 0.5, at: "dans", enter: "none" },
            // On the cobbles, at the photo's own depth: it passes behind the Guide.
            { rig: "rat", x: 1100, y: 1140, w: 220, z: 0.5, at: "dans", enter: "none", flip: true, travel: [-1500, 0, 2.4] },
          ],
        },
        {
          word: "en", in: "slide", carry: true, source: "Choléra de 1832 : environ 19 000 morts pour 860 000 Parisiens", cam: { from: [0, 0, 1.04], to: [0, 0, 1] },
          layers: [
            { field: "paper", dots: "none", paper: CRUMPLED },
            { grid: 50, cols: 10, size: 86, mark: 37, cue: "cinquante", x: 60, y: 220, enter: "none" },
            { src: `${ART}/cholera.png`, x: 690, y: 640, w: 330, rot: 4, z: 0.8, at: "choléra", enter: "toss" },
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
          word: "alors", in: "slide", source: "Charles Marville, Butte des Moulins, 1876 · rue des Sept-Voies, vers 1865", cam: { from: [0, 0, 1], to: [0, 0, 1.03] },
          layers: [
            // Two paper giants on a Paris street, an old house between them: a piece of it falls at each blow, the
            // roof first (Napoléon's blows at 1, 2, 3 s after the shot; Haussmann's at 1.65, 2.65 s).
            { bg: `${ART}/ville-1870.jpg`, dim: 0.12, rise: 200 },
            chunk(5, [63, 348, 439], [3, 90, -30, -120]),
            chunk(4, [34, 280, 468], [2.65, 160, 60, 160]),
            chunk(3, [34, 172, 468], [2, 220, -50, -150]),
            chunk(2, [49, 100, 430], [1.65, 260, 70, 170]),
            chunk(1, [66, 4, 309], [1, 300, -60, -160]),
            { rig: "napoleon", x: 760, y: 0, w: 380, z: 0.6, at: "alors", enter: "rise", delay: 0.25 },
            { rig: "haussmann", x: -110, y: -20, w: 400, z: 0.6, at: "alors", after: 0.15, enter: "rise", flip: true, delay: 0.75 },
            { name: ["Napoléon III", "empereur"], x: 560, y: 40, size: 44, rot: 2, z: 0.95, at: "napoléon" },
            { name: ["Haussmann", "préfet de la Seine"], x: 190, y: 60, size: 44, rot: -2, z: 0.95, at: "haussmann" },
          ],
        },
        {
          word: "vingt", in: "blur", carry: true, source: "Charles Marville, avenue de l'Opéra, 1877", shake: "rasés", cam: { from: [0, 0, 1.06], to: [0, 0, 1] },
          layers: [
            { field: "paper", dots: "none", paper: CRUMPLED },
            { src: `${ART}/demolition.png`, x: -10, y: 600, w: 1100, rot: -1, z: 0.5, enter: "none" },
            // The count runs up while a row of paper houses on the photo's edge falls one after another.
            { counter: [0, 20000], size: 220, x: 70, y: 110, dur: 1.3, color: "#1C1B19", z: 0.9 },
            { houses: 12, x: 60, y: 504, w: 960, cue: "immeubles", z: 0.5 },
            { tape: "immeubles rasés", x: 440, y: 340, size: 54, rot: 3, z: 0.92, at: "immeubles" },
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
          word: "et", in: "slide", source: "Andriveau-Goujon, plan des travaux de Paris, 1868", cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          layers: [
            { field: "paper", dots: "none", paper: CRUMPLED },
            // The centre of the 1868 plan, its printed works faded; the new streets drawn on in red one after another,
            // each with its name (OpenStreetMap centrelines registered on the plan).
            { src: `${ART}/plan-1868-centre.jpg`, x: 0, y: 100, w: 1080, z: 0.5, enter: "none" },
            ...BOULEVARDS.map(([, d], k) => ({ pencil: d, width: 10, at: "boulevards", after: k * 0.15, draw: 0.35 })),
            ...BOULEVARDS.map(([name, , [x, y]], k) => {
              const [lx, ly] = LABEL_AT[name] ?? [x - 60, y - 44];
              return { tape: name, x: lx, y: ly, size: 21, rot: ((k % 3) - 1) * 2, z: 0.5, at: "boulevards", after: k * 0.15 + 0.3 };
            }),
          ],
        },
        {
          word: "en", in: "cut", source: "Delacroix 1830 · Daumier 1834 · Thibault 1848 · Vernet 1848", cam: { from: [0, 0, 1], to: [0, 0, 1.04] },
          layers: [
            // Eighteen years of uprisings as evidence on the table: the paintings and prints of the time, their years,
            // the count, and seven barricades going up along the timeline.
            { field: "blue", dots: "tl", paper: CRUMPLED },
            { src: `${ART}/delacroix-liberte.png`, x: 10, y: 40, w: 330, rot: -4, z: 0.6, at: "en", enter: "toss" },
            { tag: "1830", x: 110, y: 400, size: 40, z: 0.9, at: "en", after: 0.1 },
            { src: `${ART}/daumier-transnonain.png`, x: 330, y: 200, w: 380, rot: 3, z: 0.65, at: "en", after: 0.25, enter: "toss" },
            { tag: "1834", x: 450, y: 470, size: 40, z: 0.9, at: "en", after: 0.35 },
            { src: `${ART}/vernet-soufflot.png`, x: 640, y: 40, w: 430, rot: -2, z: 0.7, at: "en", after: 0.5, enter: "toss" },
            { src: `${ART}/barricade-1848.png`, x: 820, y: 300, w: 230, rot: 5, z: 0.75, at: "en", after: 0.7, enter: "toss" },
            { tag: "1848", x: 760, y: 420, size: 40, z: 0.9, at: "en", after: 0.75 },
            { timeline: ["1830", "1848"], marks: 7, x: 80, y: 560, w: 920, cue: "sept", z: 0.5, at: "en", after: 0.9 },
            { big: "7", size: 250, x: 170, y: 840, z: 0.9, at: "sept", enter: "slap", color: "#EFE6D2" },
            { tape: "insurrections en 18 ans", x: 300, y: 910, size: 44, rot: -2, z: 0.95, at: "insurrections" },
          ],
        },
        {
          word: "une", in: "tear", carry: true, source: "Marville, rue du Haut-Moulin · la nouvelle rue de Rivoli, 1854", cam: { from: [0, 0, 1.03], to: [0, 0, 1] },
          layers: [
            // The same barricade twice: wall to wall in the alley (blocked), a speck in the boulevard (the troops go
            // round it).
            { field: "paper", dots: "none", paper: CRUMPLED },
            { src: `${ART}/ruelle-print.png`, x: 20, y: 60, w: 500, rot: -1, z: 0.5, enter: "none" },
            { pencil: span(232, 396, 612), width: 7, at: "ruelle", draw: 0.35 },
            { tape: "ruelle", x: 60, y: 930, size: 50, rot: -3, z: 0.9, at: "ruelle" },
            { barricade: true, x: 140, y: 690, w: 300, z: 0.55, at: "barricade", enter: "slap" },
            { stamp: "bloquée", x: 70, y: 470, size: 64, rot: -10, z: 0.95, at: "barricade", after: 0.3 },
            { src: `${ART}/rivoli-print.png`, x: 540, y: 300, w: 520, rot: 1.5, z: 0.5, at: "boulevard", enter: "slap" },
            { pencil: span(584, 1030, 690), width: 7, at: "boulevard", after: 0.2, draw: 0.4 },
            { tape: "boulevard", x: 600, y: 860, size: 50, rot: 2, z: 0.9, at: "boulevard" },
            { barricade: true, x: 760, y: 640, w: 100, z: 0.55, at: "beaucoup", enter: "slap" },
            // The way round it: a red route sweeping past the barricade.
            { pencil: "M 600 760 Q 700 800 820 770 Q 960 735 1010 650 M 980 655 L 1012 648 L 1004 680", width: 9, at: "moins", draw: 0.35 },
            { stamp: "ça passe", x: 640, y: 210, size: 58, rot: 6, z: 0.95, at: "moins", after: 0.25 },
          ],
        },
      ],
      beat: { pose: "explaining", x: 230 },
    },
    {
      // A drawn Haussmann building, floor by floor from the street up: the shops, the shopkeepers' entresol, the
      // rich on the noble 2nd floor, poorer going up, the maids under the roof.
      id: "d4", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          // The building in the painting itself first, then the same kind of building drawn flat, floor by floor.
          word: "à", in: "slide", source: "Caillebotte, Rue de Paris, temps de pluie (détail)", cam: { from: [0, 0, 1], to: [0, 0, 1.06] },
          layers: [
            { field: "#2A241D", dots: "none" },
            { src: `${ART}/facade-print.png`, x: 0, y: 30, w: 1080, z: 0.5, enter: "none" },
            { tape: "l'immeuble haussmannien", x: 260, y: 900, size: 46, rot: -2, z: 0.92, at: "haussmannien" },
          ],
        },
        {
          word: "et", in: "fade", carry: true, source: "Façade haussmannienne (dessin)", cam: { from: [0, 0, 1.02], to: [0, 0, 1] },
          layers: [
            { field: "#2A241D", dots: "none" },
            { ...storey("rdc"), lift: "range", hold: 0.9 },
            { ...storey("1"), lift: "range", hold: 0.9 },
            { ...storey("2"), lift: "riches", hold: 1.9 },
            { ...storey("3"), lift: "plus", hold: 0.5 },
            { ...storey("4"), lift: "plus", after: 0.45, hold: 0.5 },
            { ...storey("5"), lift: "plus", after: 0.9, hold: 0.55 },
            { ...storey("toit"), lift: "sous", hold: 1.4 },
            { tape: "rez-de-chaussée : boutiques", x: 330, y: 1000, size: 34, rot: -1, z: 0.92, at: "range" },
            { src: `${KIT}/people-paniers.png`, x: 50, y: 880, w: 110, rot: -2, z: 0.8, at: "range", enter: "pop" },
            { tape: "entresol : les commerçants", x: 360, y: 838, size: 34, rot: 1, z: 0.92, at: "range", after: 0.2 },
            { src: `${ART}/couple.png`, x: 20, y: 560, w: 210, rot: -3, z: 0.8, at: "riches", enter: "pop" },
            { tape: "2ᵉ : les riches", x: 600, y: 735, size: 44, rot: -2, z: 0.92, at: "riches" },
            { src: `${KIT}/people-parapluies.png`, x: 900, y: 440, w: 130, rot: 3, z: 0.8, at: "plus", enter: "pop" },
            { tape: "3ᵉ, 4ᵉ, 5ᵉ : de moins en moins cher", x: 140, y: 470, size: 36, rot: 1, z: 0.92, at: "plus", after: 0.3 },
            { src: `${KIT}/people-herbes.png`, x: 50, y: 310, w: 110, rot: -3, z: 0.8, at: "plus", after: 0.9, enter: "pop" },
            { arrow: [1056, 840, 1056, 120], bend: 0, color: "accent", width: 12, at: "plus", draw: 1.2 },
            { src: `${ART}/bonne.png`, x: 800, y: 0, w: 190, rot: 4, z: 0.8, at: "sous", enter: "pop" },
            { tape: "sous le toit : les bonnes", x: 240, y: 110, size: 40, rot: 2, z: 0.92, at: "sous", after: 0.15 },
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
          word: "ces", in: "slide", source: "Delmaët & Durandelle, chantier de l'Opéra · Courbet, Les Casseurs de pierres, 1849", cam: { from: [0, 0, 1], to: [0, 0, 1.03] },
          layers: [
            // The building site: the Opéra going up behind, a building rising floor by floor in its scaffolding,
            // Courbet's stone-breaker splitting a block on his heap, his boy carrying the stones over; then him, the
            // workman of the painting.
            { field: "blue", dots: "br", paper: CRUMPLED },
            { src: `${ART}/opera-chantier.png`, x: 20, y: 30, w: 560, rot: -2, z: 0.4, enter: "none" },
            { ground: true, x: -20, y: 975, w: 1120, z: 0.45, enter: "none" },
            ...(["rdc", "1", "2", "3", "4", "5", "toit"] as Floor[]).map((f, k) => siteFloor(f, k)),
            { scaffold: 440, x: 605, y: 560, w: 450, z: 0.55, enter: "none" },
            { rig: "casseur", x: -90, y: 610, w: 420, z: 0.7, enter: "none" },
            { src: `${ART}/casseur-jeune.png`, x: 290, y: 650, w: 190, z: 0.75, at: "immeubles", enter: "none", walk: [250, 0, 6] },
            { tape: "des ouvriers comme lui", x: 60, y: 500, size: 46, rot: -3, z: 0.92, at: "ouvriers" },
            { src: `${ART}/ouvrier-print.png`, x: 650, y: 90, w: 300, rot: 4, z: 0.85, at: "lui", enter: "pop" },
          ],
        },
        {
          word: "sauf", in: "cut", source: "Honoré Daumier, « Locataires et propriétaires »", cam: { from: [0, 0, 1.05], to: [0, 0, 1] },
          layers: [
            // The building he just put up, with a room to let; the rents catch fire; Daumier's removal carts are pushed
            // out of the frame, out to the faubourgs.
            { field: "paper", dots: "none", paper: CRUMPLED },
            ...(["rdc", "1", "2", "3", "4", "5", "toit"] as Floor[]).map((f) => facadeAt(f, 250, 830, 0.58)),
            { tape: "à louer", x: 600, y: 550, size: 34, rot: 6, z: 0.6, at: "loyers" },
            { flames: 7, x: 120, y: 205, w: 840, z: 0.88, at: "flambent", enter: "none" },
            { letters: "LOYERS", x: 140, y: 70, w: 800, size: 130, at: "loyers" },
            { flames: 22, x: 130, y: 215, w: 820, z: 0.9, at: "flambent", after: 0.1, enter: "none" },
            { src: `${ART}/daumier-demenagement.png`, x: -40, y: 760, w: 760, rot: -2, z: 0.45, enter: "none", exit: "ils" },
            { pencil: "M 1000 1010 L 120 1010 M 170 975 L 120 1010 L 170 1045", width: 14, at: "ils", draw: 0.4 },
            { tape: "vers les faubourgs", x: 300, y: 920, size: 40, rot: -2, z: 0.92, at: "ils", after: 0.15 },
          ],
        },
      ],
      beat: { pose: "skeptical", x: 230 },
    },
    {
      // On him, then the loop flies back to the couple of the first frame as the line breaks off.
      id: "d6", fx: 0.65, fy: 0.447,
      view: WORKMAN,
      // As the camera flies back to the couple, they stay in the shadow and he stays in the light (gone by the last
      // frame, which must match the first for the loop).
      spots: [{ word: "aujourd'hui", fx: 0.651, fy: 0.45, rx: 0.016, ry: 0.032, name: "" }],
      beat: { pose: "point-up", x: 230 },
    },
  ],
});
