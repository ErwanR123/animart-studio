import { createGuideEpisode, type Voice } from "../guide/engine";
import { EgypteEurope } from "../guide/maps/egypte-europe";
import voice from "../../public/voice/GuideMummyBrown.json";

// Mummy brown: the paint made from ground Egyptian mummies. Format "La couleur" (IDEAS.md): the story of a pigment,
// told through the works and objects of its time: how mummies went from the apothecary's jar to the painter's palette,
// and why the colour only died out when the mummies ran out.
// Facts (3 Nov. 2026; Wikipedia EN "Mummy brown", Science History Institute "Mummies and the usefulness of death",
// National Geographic "Europe's morbid mummy craze", JSTOR Daily, Smithsonian, Artnet, Cabinet no. 47):
// - mummy brown, ground mummies mixed with white pitch and myrrh, was on European palettes from at least the 16th
//   century into the 20th ("pendant des siècles"); prized for its transparency in glazes and shadows;
// - mumia, powdered mummy, was sold by apothecaries as a medicine taken by mouth from the Middle Ages (the jar
//   "PULV. MUMIAE VER.", Deutsches Apotheken-Museum, Heidelberg); apothecaries also made and sold artists' colours,
//   which is how the powder reached the palette;
// - Bonaparte's Egyptian campaign (1798–1801) launched the European Egyptomania; mummies were shipped to Europe in
//   numbers, unrolled before paying audiences (Pettigrew's "unrollings", Philippoteaux's painting) and sold on;
// - C. Roberson & Co, London, often called the last maker, told Time (Oct. 1964) it had no mummies left to make more
//   (the wording of the quote varies between sources: not shown on screen).
// Left out after checking: the Burne-Jones burial (true, Georgiana Burne-Jones's Memorials, 1881, but off the thread)
// and Kipling's version of it; the Drolling "kings' hearts" story (no solid source).
// Images (public/art/SOURCES.md): the unwrapped mummy (Wellcome M0009392, labelled Ramesses II) and Ramesses II's head
// in profile (c. 1881); a Roberson "Mummy" tube and swatch; the Heidelberg jar; Pietro Longhi, *L'Apothicaire* (c.
// 1752); a 19th-century palette (Musée Delacroix); Gérôme, *Bonaparte devant le Sphinx* (1868); the inner coffin of
// Henettawy (The Met); Philippoteaux, *Examen d'une momie* (1891); Alma-Tadema, *La Veuve égyptienne* (1872); a flat
// map from Natural Earth's coastline. Music: Saint-Saëns, *Danse macabre* (1874), Philadelphia Orchestra, Stokowski,
// 1925.
const ART = "art/mummy-brown";
const CRUMPLED = "art/paper/crumpled.jpg";
const KRAFT = "art/paper/kraft.jpg";
const UMBER = "#3B2A1E";
const CREAM = "#EDE5D3";
const RED = "#B8261B";
const BROWNS = ["#4A3020", "#6B4A2E", "#5A3C25", "#7A5536", "#3E2818"];
const FULL = { z: 1.44, fx: 0.5, fy: 0.5 };
// Frame 0 and the loop's last frame: the unwrapped mummy, his face and crossed arms full screen.
const OPEN = { z: 2.6, fx: 0.48, fy: 0.185 };

// A brushstroke made of bristles: parallel strokes of uneven width and brown, drawn together left to right, the
// outer ones shorter (a dry edge).
const brush = (x0: number, y0: number, x1: number, y1: number, at: string) =>
  [-70, -52, -36, -20, -6, 8, 22, 38, 54, 68].map((d, k) => ({
    pencil: `M${x0 + Math.abs(d) * 0.6} ${y0 + d} C${x0 + 300} ${y0 + d - 40} ${x1 - 300} ${y1 + d + 30} ${x1 - Math.abs(d) * 1.4} ${y1 + d}`,
    color: BROWNS[k % BROWNS.length],
    width: [8, 18, 26, 30, 34, 30, 28, 22, 14, 7][k],
    at,
    after: k * 0.012,
    draw: 0.45,
  }));

// Everything that matters stays in the phone's safe area: below y 230 (the platform's top bar) and left of x 930 from
// y 900 down (its buttons).
// The flat map from London down to Cairo, 860 wide at x 40, y 240 on a dark sea; its places in shot px.
const MAP = { map: EgypteEurope, x: 40, y: 240, w: 860, z: 0.4, enter: "none" as const };
const SEA = { field: "#26313A", dots: "tl" as const, paper: CRUMPLED };
const at = (name: string): [number, number] => {
  const [x, y] = EgypteEurope.points[name];
  return [Math.round(MAP.x + (x * MAP.w) / 1000), Math.round(MAP.y + (y * MAP.w) / 1000)];
};
const ALEX = at("Alexandrie");
const SICILY: [number, number] = [458, 752];
const MARSEILLE = at("Marseille");
const PARIS = at("Paris");
const LONDON = at("Londres");
// A convoy of coffins (the Met's Henettawy, 34 wide) sailing from Alexandria to Marseille, then up to Paris and London,
// one after the other.
const COFFIN = { w: 34, h: 120 };
const stand = ([x, y]: [number, number]) => ({ x: x - COFFIN.w / 2, y: y - COFFIN.h + 10 });
const leg = (t: number, [x0, y0]: [number, number], [x1, y1]: [number, number], steps = 3): [number, number, number, number, number] => [t, x1 - x0, y1 - y0, steps, 0.12];
const convoy = [0, 1, 2, 3].map((k) => ({
  src: `${ART}/coffin-lid.png`,
  ...stand(ALEX),
  w: COFFIN.w,
  z: 0.9,
  at: "momies",
  after: k * 0.22,
  enter: "pop" as const,
  route: [leg(0.1, ALEX, SICILY), leg(0.5, SICILY, MARSEILLE), leg(0.9, MARSEILLE, PARIS, 2), ...(k % 2 ? [leg(1.2, PARIS, LONDON, 2)] : [])],
}));
// The years riffling from the Egyptian campaign to the last tube.
const riffle = Array.from({ length: 21 }, (_, k) => [["d4", "dernier"], String(1800 + k * 8), k * 0.05] as [[string, string], string, number]);

export const guideMummyBrown = createGuideEpisode({
  voiceFile: "voice/GuideMummyBrown.mp3",
  voice: voice as Voice,
  image: { src: `${ART}/ramses.jpg`, width: 2374, height: 4432 },
  maxWidth: 1000,
  climb: true,
  climbFrom: "start",
  openView: FULL,
  openPose: "scared",
  music: "music/danse-macabre.mp3",
  tight: true,
  palette: { paper: CREAM, accent: RED, hl: "#F4C531" },
  // Frame 0: the mummy full screen, the promise on tape; on "peintres" a hard cut onto his face.
  cold: [
    { view: OPEN, tapes: ["PEINT AVEC DES MOMIES"], y: 1700, size: 54 },
    { word: "peint", view: { z: 4.2, fx: 0.48, fy: 0.115 } },
  ],
  loop: { word: "qu'elle", view: OPEN, full: true },
  header: "LE BRUN MOMIE",
  title: ["Peint avec", "des momies"],
  calendar: {
    pages: [...riffle, [["d4", "1964."], "OCT. 1964"]],
    until: ["d4", "momies."],
  },
  lead: {
    hook: {
      // The paint itself lands on him on "momies": the real Roberson tube.
      collage: { word: "momies", pieces: [{ src: `${ART}/tube.png`, x: 600, y: 860, w: 280, rot: 8, depth: 0.9, at: "momies" }] },
      sfx: [{ word: "momies", src: "sfx/accents/thud.wav", volume: 0.5 }],
    },
    context: {
      shots: [
        {
          // Signature 1, the body becomes colour: his head on umber paper is crushed flat on "broyés", and on
          // "poudre" a brushstroke of bristles drags out of it across the page; the swatch follows.
          word: "des", in: "cut", cam: { from: [0, 0, 1], to: [0, -20, 1.06] },
          source: "Ramesses II, profile (c. 1881)",
          layers: [
            { field: UMBER, dots: "tl", paper: CRUMPLED },
            { src: `${ART}/head.png`, x: 280, y: 240, w: 500, rot: -3, z: 0.5, enter: "slap", fold: { word: "broyés", angle: 90, k: 0.12, origin: [0.5, 1], dur: 0.35 } },
            ...brush(120, 900, 900, 840, "poudre"),
          ],
        },
        {
          word: "un", in: "slide", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.04] },
          source: "C. Roberson & Co, Mummy swatch (size above, linseed oil below)",
          layers: [
            { field: CREAM, dots: "br", paper: CRUMPLED },
            { src: `${ART}/swatch.png`, x: 110, y: 250, w: 400, rot: -3, z: 0.5, enter: "slap" },
            { src: `${ART}/tube.png`, x: 580, y: 330, w: 270, rot: 7, z: 0.6, at: "brun", enter: "slap" },
            { tape: "BRUN MOMIE", size: 60, x: 240, y: 1050, rot: -3, z: 0.95, at: "transparent," },
          ],
        },
      ],
      sfx: [
        { word: "broyés", src: "sfx/accents/thud.wav", volume: 0.5 },
        { word: "poudre", src: "sfx/accents/swish-3.wav", volume: 0.45 },
        { word: "un", src: "sfx/accents/page-1.wav", volume: 0.4 },
      ],
      poses: [{ word: "des", pose: "explaining" }],
    },
  },
  details: [
    {
      // The medicine: the apothecary's jar, its label translated.
      id: "d1", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "au", in: "whip", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          source: "Deutsches Apotheken-Museum, Heidelberg, Mumia jar",
          layers: [
            { field: "#E2CFC0", dots: "tr", paper: CRUMPLED },
            { src: `${ART}/jar.png`, x: 270, y: 240, w: 520, rot: 2, z: 0.5, enter: "slap" },
            { stamp: "MÉDICAMENT", size: 72, x: 420, y: 920, rot: -7, z: 0.95, at: "médicament" },
            { tape: "« POUDRE DE VRAIE MOMIE »", size: 50, x: 90, y: 1040, rot: -2, z: 0.95, at: "pharmacies" },
          ],
        },
      ],
      sfx: [
        { word: "médicament", src: "sfx/accents/thud.wav", volume: 0.45 },
        { word: "avaler", src: "sfx/story/bite.wav", volume: 0.4 },
      ],
      beat: { pose: "explaining", x: 230 },
      poses: [{ word: "avaler", pose: "shiver" }],
    },
    {
      // Signature 2, from the pharmacy to the palette: Longhi's apothecary, the jars on his shelves ringed; then the
      // jar and a painter's palette, the powder thrown from one to the other in a brown arc that lands as a blob.
      id: "d1b", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "et", in: "push", cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          source: "Pietro Longhi, L'Apothicaire, c. 1752 (Gallerie dell'Accademia, Venise)",
          layers: [
            { field: "#2E2A24", dots: "tl", paper: CRUMPLED },
            { src: `${ART}/longhi.jpg`, x: 260, y: 240, w: 560, rot: -1.5, z: 0.5, gilt: true, enter: "slap" },
            { name: ["L'apothicaire", "Pietro Longhi, 1752"], size: 40, x: 60, y: 980, rot: -3, z: 0.95, at: "pharmacies" },
            { pencil: "M300 262 C450 240 650 240 790 268 C815 330 808 410 780 432 C620 448 430 448 300 432 C270 380 270 310 300 262", width: 9, at: "couleurs…", draw: 0.4 },
          ],
        },
        {
          word: "la", in: "whip", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          source: "Mumia jar; a 19th-century palette (Musée Delacroix)",
          layers: [
            { bg: KRAFT },
            { src: `${ART}/jar.png`, x: 50, y: 250, w: 260, rot: -6, z: 0.5, enter: "slap" },
            { src: `${ART}/palette.png`, x: 290, y: 540, w: 620, rot: 4, z: 0.5, at: "finit", enter: "slap" },
            { pencil: "M280 380 C480 220 700 330 620 720", color: "#5A3C25", width: 30, at: "poudre", draw: 0.45 },
            { stencil: "dot", color: "#4A3020", x: 560, y: 680, w: 120, z: 0.9, at: "palette" },
            { tape: "LA PALETTE DES PEINTRES", size: 42, x: 330, y: 260, rot: 2, z: 0.95, at: "palette" },
          ],
        },
      ],
      sfx: [
        { word: "couleurs…", src: "sfx/accents/pencil-3.wav", volume: 0.45 },
        { word: "poudre", src: "sfx/accents/swish-2.wav", volume: 0.45 },
        { word: "palette", src: "sfx/accents/tape.wav", volume: 0.4 },
      ],
      beat: { pose: "point-up", x: 230 },
    },
    {
      // Egyptomania: Gérôme's Bonaparte before the Sphinx; then signature 3, the convoy: coffins sailing in a line
      // from Alexandria to Marseille, then up to Paris and London.
      id: "d2", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "et", in: "push", cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          source: "Gérôme, Bonaparte devant le Sphinx, 1868 (Hearst Castle)",
          layers: [
            { field: "#D8B26E", dots: "tl", paper: CRUMPLED },
            { src: `${ART}/gerome.jpg`, x: 50, y: 360, w: 880, rot: -1.5, z: 0.5, gilt: true, enter: "slap" },
            { name: ["Bonaparte", "en Égypte, 1798"], size: 44, x: 70, y: 240, rot: -3, z: 0.95, at: "bonaparte" },
            { letters: "ÉGYPTOMANIE", size: 64, x: 60, y: 950, w: 800, z: 0.95, at: "l'europe" },
          ],
        },
        {
          word: "les", in: "whip", carry: true, cam: { from: [0, 0, 1.02], to: [0, 0, 1.08] },
          source: "Natural Earth coastline; inner coffin of Henettawy (The Met)",
          layers: [
            SEA,
            MAP,
            { thread: [ALEX, SICILY, MARSEILLE, PARIS, LONDON], color: "accent", at: "momies", draw: 0.9 },
            { tag: "ALEXANDRIE", x: ALEX[0] - 260, y: ALEX[1] + 14, size: 32, rot: -2, z: 0.9, at: "les" },
            { tag: "MARSEILLE", x: MARSEILLE[0] - 230, y: MARSEILLE[1] + 20, size: 32, rot: 2, z: 0.9, at: "arrivent" },
            { tag: "PARIS", x: PARIS[0] + 40, y: PARIS[1] - 10, size: 32, rot: -2, z: 0.9, at: "caisses" },
            { tag: "LONDRES", x: LONDON[0] + 70, y: LONDON[1] - 40, size: 32, rot: 2, z: 0.9, at: "entières." },
            ...convoy,
          ],
        },
      ],
      sfx: [
        { word: "et", src: "sfx/accents/swish-2.wav", volume: 0.45 },
        { word: "momies", src: "sfx/accents/pencil-2.wav", volume: 0.4 },
        { word: "caisses", src: "sfx/accents/page-2.wav", volume: 0.35 },
      ],
      beat: { pose: "explaining", x: 230 },
      poses: [{ word: "folle", pose: "amazed" }],
    },
    {
      // The unrolling before a crowd (Philippoteaux), the glass travelling from the mummy to the onlookers; then the
      // mummy sold off, a tag swinging from it, a red arrow to the paint tube.
      id: "d3", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "on", in: "slide", cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          source: "Paul Philippoteaux, Examen d'une momie, 1891",
          layers: [
            { field: UMBER, dots: "br", paper: CRUMPLED },
            { src: `${ART}/examen.jpg`, x: 30, y: 330, w: 900, rot: 1.5, z: 0.5, gilt: true, enter: "slap" },
            { tag: "PHILIPPOTEAUX · 1891", size: 34, x: 520, y: 250, rot: 2, z: 0.95 },
            { loupe: [520, 720, 150], zoom: 2.2, to: [160, 680], glide: 1.0, at: "déballe" },
          ],
        },
        {
          word: "puis", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          source: "Unwrapped mummy (Wellcome M0009392); C. Roberson & Co, Mummy tube",
          layers: [
            { field: "#D8C3A0", dots: "tl", paper: CRUMPLED },
            { src: `${ART}/mummy.png`, x: 100, y: 240, w: 250, rot: -3, z: 0.5, enter: "slap" },
            { pricetag: "VENDU", size: 44, x: 290, y: 420, w: 230, z: 0.9, at: "revend" },
            { arrow: [400, 780, 620, 720], bend: -0.3, color: "accent", width: 10, at: "marchand", draw: 0.3 },
            { src: `${ART}/tube.png`, x: 640, y: 380, w: 250, rot: 6, z: 0.6, at: "marchand", after: 0.2, enter: "slap" },
          ],
        },
      ],
      sfx: [
        { word: "déballe", src: "sfx/accents/swish-1.wav", volume: 0.4 },
        { word: "revend", src: "sfx/story/coins.wav", volume: 0.45 },
        { word: "marchand", src: "sfx/accents/pencil-1.wav", volume: 0.4 },
      ],
      beat: { pose: "whisper", x: 230 },
      poses: [{ word: "puis", pose: "skeptical" }],
    },
    {
      // The end of it: the tube alone, the years riffling on the calendar to October 1964; the answer stamped across
      // the empty coffin.
      id: "d4", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "le", in: "whip", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.06] },
          shake: "n'a",
          source: "C. Roberson & Co, Mummy tube; inner coffin of Henettawy (The Met)",
          layers: [
            { field: "#1E1B18", dots: "tl", paper: CRUMPLED },
            { src: `${ART}/coffin-lid.png`, x: 100, y: 250, w: 220, rot: -4, z: 0.4, enter: "slap" },
            { src: `${ART}/tube.png`, x: 420, y: 330, w: 270, rot: 6, z: 0.6, at: "fabricant", enter: "slap" },
            { tag: "C. ROBERSON & CO · LONDRES", size: 30, x: 360, y: 900, rot: 2, z: 0.95, at: "fabricant" },
            { big: "?", size: 180, color: RED, x: 740, y: 470, z: 0.9, at: "raison" },
            { stamp: "PLUS DE MOMIES", size: 96, x: 60, y: 700, rot: -9, z: 0.97, at: "n'a" },
          ],
        },
      ],
      sfx: [
        { word: "dernier", src: "sfx/accents/page-3.wav", volume: 0.4 },
        { word: "momies.", src: "sfx/accents/thud.wav", volume: 0.6 },
      ],
      beat: { pose: "explaining", x: 230 },
      poses: [{ word: "momies.", pose: "shrug" }],
    },
    {
      // The answer: a salon wall of the century's paintings, and in the middle, hung like one of them, his face.
      // Then the loop back to the mummy on frame 0.
      id: "d6", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "l'europe", in: "push", until: "qu'elle", cam: { from: [0, 0, 1], to: [0, 0, 1.06] },
          source: "Gérôme; Alma-Tadema, La Veuve égyptienne, 1872 (Rijksmuseum); Philippoteaux; Longhi; Ramesses II",
          layers: [
            { field: "#5A1F1A", dots: "tl", paper: CRUMPLED },
            { src: `${ART}/gerome.jpg`, x: 40, y: 250, w: 380, rot: -1, z: 0.4, gilt: true, enter: "slap" },
            { src: `${ART}/widow.jpg`, x: 510, y: 240, w: 400, rot: 1, z: 0.4, gilt: true, after: 0.12, enter: "slap" },
            { src: `${ART}/examen.jpg`, x: 30, y: 640, w: 240, rot: 1, z: 0.4, gilt: true, after: 0.24, enter: "slap" },
            { src: `${ART}/longhi.jpg`, x: 690, y: 620, w: 220, rot: -1, z: 0.4, gilt: true, after: 0.36, enter: "slap" },
            { src: `${ART}/head-photo.jpg`, x: 300, y: 560, w: 360, z: 0.6, at: "l'égypte…", gilt: true, enter: "crane" },
          ],
        },
      ],
      sfx: [{ word: "l'égypte…", src: "sfx/accents/thud.wav", volume: 0.45 }],
      beat: { pose: "explaining", x: 230 },
    },
  ],
});
