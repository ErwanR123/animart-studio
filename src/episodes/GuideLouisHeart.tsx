import { createGuideEpisode, type Voice } from "../guide/engine";
import voice from "../../public/voice/GuideLouisHeart.json";

// Louis XIV's heart in a painting: Alexandre Pau de Saint-Martin, *Vue de Caen*, 1810, musée Tavet-Delacour
// (musée d'Art et d'Histoire Pissarro-Pontoise). Format "La couleur", the sequel to GuideMummyBrown.
// Facts (4 Nov. 2026; Factuel, Virginie Girod, 25 Apr. 2023; Le Point, Marc Fourny, 29 Apr. 2023; Ça m'intéresse /
// Yahoo, 5 Apr. 2025; Wikipedia FR "Alexandre Pau de Saint-Martin"; ICI / Radio France, 30 Apr. 2019):
// - Louis XIV died 1 Sept. 1715; his embalmed heart was kept in a vermeil reliquary (cardiotaphe) in the Jesuit church
//   of Saint-Louis, rue Saint-Antoine (today Saint-Paul-Saint-Louis), Paris;
// - in the Revolution the reliquary was melted down (at the Monnaie de Paris, Factuel) and the heart ended with the
//   painter Alexandre Pau de Saint-Martin, who cut pieces from it to make his brown paint (Factuel: "qui en a prélevé
//   quelques morceaux pour fabriquer sa peinture brune");
// - his *Vue de Caen* (1810) was painted in part with that brown; the forensic pathologist Philippe Charlier analysed
//   the painting's browns (told in *Autopsie des cœurs célèbres*, with David Alliot; no peer-reviewed paper found);
// - mummy brown, ground mummies, was a common painter's brown at the time (GuideMummyBrown).
// Left out after checking: the gold snuffbox from Louis XVIII (unsourced, contradicted by Wikipedia), a date for the
// melting (sources disagree), Drolling's Louvre kitchen (the 1905 Lenotre legend, debunked by Dagnaud in 1957).
// Images (public/art/SOURCES.md): the *Vue de Caen* (Commons); Rigaud's Louis XIV (Louvre); a heart after Senac
// (Wellcome); Pau de Saint-Martin's signature and three of his paintings (Carnavalet); Boilly's sans-culotte (Carnavalet); a hand study (French school); a bronze mortar and pestle (Wellcome);
// a figure from Boilly's Réunion d'artistes (Louvre) as the painter. Music: Lully, *Marche pour la cérémonie des
// Turcs* (1670).
const ART = "art/louis-heart";
const CRUMPLED = "art/paper/crumpled.jpg";
const CREAM = "#EDE5D3";
const RED = "#B8261B";
const FULL = { z: 1, fx: 0.5, fy: 0.5 };
// Frame 0 and the loop's last frame: the cover, the *Vue de Caen* in its frame on its own browns, full screen.
const OPEN = { z: 1.5, fx: 0.5, fy: 0.49 };
// Everything that matters stays in the phone's safe area: below y 230 (the platform's top bar) and left of x 930 from
// y 900 down (its buttons).

// The heart, 440 wide at x 320, y 300: the red heart, its gold reliquary, and the red heart cut in three pieces laid
// exactly over it (same canvas), which part on "découpe".
const HEART = { x: 320, y: 300, w: 440 };
// The years riffling from the painting to the analysis.
// The sound of one beat, on every lub of a `pulse: 0.8` piece that landed on `word` (only while a heart is in sight).
const BEAT = "sfx/story/heart-beat.wav";
const beats = (word: string, n: number, from = 0, volume = 0.6) => Array.from({ length: n }, (_, k) => ({ word, after: from + k * 0.8, src: BEAT, volume }));
const STEP = "sfx/story/wood-step.wav";
const steps = (word: string, n: number, each: number, from = 0, volume = 0.5) => Array.from({ length: n }, (_, k) => ({ word, after: from + k * each, src: STEP, volume }));
// The painter's studio: his own pictures on the wall, his mortar on the bench.
const BENCH = "#3B2415";
const ATELIER_SOURCE = "Pau de Saint-Martin, La Porte Saint-Denis, Les cagnards de l'Hôtel-Dieu, Le Boulevard des Capucines (Carnavalet); Rigaud, Louis XIV (Louvre); Boilly, Réunion d'artistes dans l'atelier d'Isabey, 1798 (Louvre); his signature, 1799";
const atelier = [
  { field: "#6B4F35", dots: "tl" as const, paper: CRUMPLED },
  { src: `${ART}/capucines.jpg`, x: 40, y: 245, w: 320, rot: -1.5, z: 0.3, gilt: true, enter: "none" as const },
  { src: `${ART}/cagnards.jpg`, x: 395, y: 235, w: 230, rot: 1, z: 0.3, gilt: true, enter: "none" as const },
  { src: `${ART}/porte.jpg`, x: 665, y: 250, w: 340, rot: -1, z: 0.3, gilt: true, enter: "none" as const },
  { src: `${ART}/rigaud-bust.jpg`, x: 90, y: 530, w: 190, rot: 1.5, z: 0.3, gilt: true, enter: "none" as const },
  { src: `${ART}/pestle.png`, x: 800, y: 610, w: 110, z: 0.39, enter: "none" as const },
  { src: `${ART}/mortar2.png`, x: 730, y: 720, w: 250, z: 0.4, enter: "none" as const },
];
// Louis XIV's portrait, watching from the studio wall: his face turns to horror `horror` s after landing (already
// horrified without it) and he jumps at each blow (s after landing).
const watching = (blows: number[], horror?: number) => ({
  src: `${ART}/${horror ? "rigaud-bust" : "rigaud-horror"}.jpg`, x: 40, y: 245, w: 230, rot: -2, z: 0.3, gilt: true, enter: "none" as const,
  ...(horror ? { swap: Array.from({ length: 12 }, () => `${ART}/rigaud-horror.jpg`), hold: horror } : {}),
  route: blows.flatMap((t) => [[t, 0, -34, 1, 0.05], [t + 0.08, 0, 34, 1, 0.06]] as [number, number, number, number, number][]),
});
// The painting, in the same place from "Avec ce brun" to the wink, room above it for the king's head.
const CAEN = { x: 40, y: 500, w: 850, rot: -1, z: 0.4 };
const riffle = Array.from({ length: 22 }, (_, k) => [["d5", "deux"], String(1810 + k * 10), 0.1 + k * 0.05] as [[string, string], string, number]);

export const guideLouisHeart = createGuideEpisode({
  voiceFile: "voice/GuideLouisHeart.mp3",
  voice: voice as Voice,
  image: { src: `${ART}/cover.jpg`, width: 2160, height: 3840 },
  maxWidth: 1000,
  climb: true,
  climbFrom: "start",
  openView: FULL,
  openPose: "amazed",
  music: "music/lully-turcs.mp3",
  tight: true,
  handSfx: true,
  sfxGain: 0.5,
  palette: { paper: CREAM, accent: RED, hl: "#F4C531" },
  // Frame 0: the painting in its frame full screen, the promise on tape; on "peint" a hard cut to the king walking in.
  cold: [
    { view: OPEN, tapes: ["PEINT AVEC LE CŒUR DE LOUIS XIV"], y: 1700, size: 54 },
    // Under the hook's shot, the cover's dark blurred ground only (no strip of the frame below the shot).
    { word: "peint", view: { z: 3, fx: 0.5, fy: 0.9 } },
  ],
  // The last line ("on peut le dire :") runs straight into the first ("Ce tableau a été peint…").
  loop: { word: "dire", view: OPEN, full: true },
  header: "PAU DE SAINT-MARTIN · 1810",
  title: ["Le cœur", "de Louis XIV"],
  calendar: {
    pages: [...riffle, [["d5", "analyse"], "2023"]],
    until: ["d5", "peinture…"],
  },
  lead: {
    hook: {
      shots: [
        {
          // Signature: the painting beats like a heart; Rigaud's Louis XIV strides in from the left, his heart leaps
          // from his chest into the mill on "cœur" and bursts into a brown splat on "Louis": the paint.
          word: "peint", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, -10, 1.06] },
          shake: "louis",
          source: "Rigaud, Louis XIV (Louvre); Pau de Saint-Martin, Vue de Caen, 1810",
          layers: [
            { field: "#24180F", dots: "tl", paper: CRUMPLED },
            { src: `${ART}/caen.jpg`, x: 380, y: 330, w: 660, rot: 1.5, z: 0.4, gilt: true, enter: "none", pulse: 0.8 },
            { src: `${ART}/king.png`, x: -440, y: 270, w: 440, z: 0.7, enter: "none", walk: [470, 0, 4, 0.16] },
            { src: `${ART}/heart-red.png`, x: 170, y: 470, w: 140, rot: -10, z: 0.9, at: "cœur", enter: "pop", route: [[0.08, 290, 140, 2, 0.13]], off: "louis" },
            { src: `${ART}/splat.png`, x: 450, y: 520, w: 240, rot: 12, z: 0.85, at: "louis", enter: "slap" },
            { tape: "PEINT AVEC LE CŒUR DE LOUIS XIV", size: 50, x: 90, y: 1060, rot: -2, z: 0.95, enter: "none" },
          ],
        },
      ],
      sfx: [
        ...steps("peint", 4, 0.16),
        { word: "cœur", src: BEAT, volume: 0.7 },
        { word: "louis", src: "sfx/story/splat.wav", volume: 0.7 },
      ],
    },
    context: {
      shots: [
        {
          // The king stands, falls flat on "mort" like a board, and the camera closes in on his face: two red crosses.
          word: "à", in: "cut", cam: { from: [0, 0, 1], to: [834, -697, 1.72] },
          source: "Hyacinthe Rigaud, Louis XIV, 1701 (Louvre)",
          layers: [
            { src: `${ART}/blood-ground.jpg`, x: -1400, y: -1400, w: 3800, z: 0.5, enter: "none" },
            { src: `${ART}/rigaud-small.jpg`, x: 60, y: 250, w: 340, rot: -2, z: 0.3, gilt: true, enter: "none" },
            { src: `${ART}/king.png`, x: 580, y: 180, w: 560, z: 0.6, enter: "none", route: [], fall: [0.55, 20, -84] },
            ...[[195, 915], [199, 881]].flatMap(([x, y], k) => [
              { pencil: `M${x - 12} ${y - 12} L${x + 12} ${y + 12}`, color: RED, width: 7, z: 0.6, at: "en", after: 0.1 + k * 0.12, draw: 0.06 },
              { pencil: `M${x + 12} ${y - 12} L${x - 12} ${y + 12}`, color: RED, width: 7, z: 0.6, at: "en", after: 0.16 + k * 0.12, draw: 0.06 },
            ]),
            { stamp: "1ER SEPT. 1715", size: 42, x: 20, y: 740, rot: -5, z: 0.6, at: "1715,", after: 0.3 },
          ],
        },
        {
          // The heart rises from below; cream bands wrap it on "embaumé"; the gold reliquary snaps shut on "reliquaire"
          // and stays where it is: the next beat starts from this very picture.
          word: "son", in: "cut", carry: true, shake: "reliquaire", cam: { from: [0, 0, 1], to: [0, 0, 1] },
          source: "Heart after Senac (Wellcome V0007847)",
          layers: [
            { field: "#2A1D17", dots: "br", paper: CRUMPLED },
            { src: `${ART}/heart-red.png`, ...HEART, z: 0.5, enter: "rise", pulse: 0.8 },
            { src: `${ART}/heart-wrapped.png`, ...HEART, z: 0.52, at: "embaumé", enter: "none", write: 0.45, pulse: 0.8 },
            ...(["l", "r"] as const).map((s) => ({
              src: `${ART}/gold-${s}.png`, ...HEART, z: 0.6, at: "reliquaire", enter: "none" as const,
              swing: { pivot: [0.5, 0.97] as [number, number], keys: [[0, s === "l" ? -80 : 80], [0.2, 0], [0.28, s === "l" ? 4 : -4], [0.36, 0]] as [number, number][] },
            })),
            { tag: "ÉGLISE SAINT-LOUIS · PARIS", size: 36, x: 280, y: 860, rot: -2, z: 0.95, at: "paris." },
          ],
        },
      ],
      sfx: [
        { word: "à", after: 0.95, src: "sfx/story/body-fall.wav", volume: 0.8 },
        { word: "en", after: 0.14, src: "sfx/accents/pencil-1.wav", volume: 0.4 },
        { word: "1715,", after: 0.3, src: "sfx/story/stamp.wav", volume: 0.6 },
        ...beats("son", 4),
        { word: "embaumé", src: "sfx/accents/swish-2.wav", volume: 0.5 },
        { word: "reliquaire", after: 0.18, src: "sfx/story/lid-shut.wav", volume: 0.7 },
      ],
      poses: [{ word: "à", pose: "explaining" }],
    },
  },
  details: [
    {
      // One take from the reliquary of the shot before: the crowd rises round it and the Nation's stamp hits it; fire
      // behind the crowd, the locket opens on "fondu" and its halves drop in; the bare heart beats until a hand takes it.
      id: "d1", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "puis", in: "cut", carry: true, shake: ["arrive.", "fondu…"], cam: { from: [0, 0, 1], to: [0, 0, 1] },
          source: "Boilly, Simon Chenard en sans-culotte, 1792 (Carnavalet); Quatre études de mains (French school); heart after Senac (Wellcome)",
          layers: [
            { field: "#2A1D17", dots: "br", paper: CRUMPLED },
            { flames: 7, x: -10, y: 620, w: 1100, z: 0.3, at: "reliquaire" },
            { src: `${ART}/fire-ground.png`, x: -110, y: 600, w: 1300, z: 0.3, enter: "none" },
            { src: `${ART}/heart-red.png`, ...HEART, z: 0.5, enter: "none", pulse: 0.8, route: [[3.38, -1150, 0, 1, 0.16]] },
            ...(["l", "r"] as const).map((s) => ({
              src: `${ART}/gold-${s}.png`, ...HEART, z: 0.55, enter: "none" as const,
              swing: { pivot: [0.5, 0.97] as [number, number], keys: [[0, 0], [1.7, 0], [1.95, s === "l" ? -75 : 75]] as [number, number][] },
              fall: [2.05, 1400, s === "l" ? -35 : 35, s === "l" ? -110 : 110] as [number, number, number, number],
            })),
            { stamp: "BIEN NATIONAL", size: 58, x: 305, y: 470, rot: -9, z: 0.6, at: "arrive.", off: "fondu…" },
            ...[[-40, 560], [170, 590], [400, 570], [620, 595], [830, 560]].map(([x, y], k) => ({
              src: `${ART}/crowd-mid.png`, x, y, w: 280, z: 0.7, at: "la", after: k * 0.05, enter: "rise" as const,
            })),
            ...[[80, 680], [650, 670]].map(([x, y], k) => ({
              src: `${ART}/sansculotte.png`, x, y, w: 300, z: 0.8, at: "révolution", after: k * 0.1, enter: "rise" as const, ...(k === 1 ? { turn: 0 } : {}),
            })),
            { letters: "RÉVOLUTION", size: 72, x: 120, y: 245, w: 800, z: 0.95, at: "révolution", off: "le", chips: [["ink", "cream"], ["cream", "ink"], ["red", "cream"]] },
            { src: `${ART}/hand.png`, x: -760, y: 450, w: 640, z: 0.9, at: "finit", enter: "none", route: [[0, 660, 0, 1, 0.14], [0.46, -1150, 0, 1, 0.16]] },
          ],
        },
        {
          // The painter's studio, his own pictures on every wall: the hand brings the heart in, the painter walks up
          // (a figure from Boilly's gathering of painters, Paris 1798: I found no portrait of Pau de Saint-Martin)
          // and takes it. The next beat goes on from this very picture.
          word: "chez", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1] },
          source: ATELIER_SOURCE,
          layers: [
            ...atelier,
            { src: `${ART}/painter.png`, x: 1120, y: 300, w: 260, z: 0.5, enter: "none", route: [[0.1, -510, 0, 3, 0.14]] },
            { src: `${ART}/hand.png`, x: -430, y: 520, w: 430, z: 0.7, enter: "none", route: [[0, 470, 0, 1, 0.14], [0.8, -700, 0, 1, 0.16]] },
            { src: `${ART}/heart-red.png`, x: -60, y: 480, w: 170, z: 0.6, enter: "none", pulse: 0.8, route: [[0, 470, 0, 1, 0.14], [0.62, 130, 90, 1, 0.14]] },
            { fore: "bottom", color: BENCH, y: 880, z: 0.8, at: "chez" },
          ],
        },
      ],
      sfx: [
        { word: "la", src: "sfx/story/crowd-riot.wav", volume: 0.7 },
        { word: "arrive.", src: "sfx/story/stamp.wav", volume: 0.8 },
        { word: "reliquaire", src: "sfx/story/fire.wav", volume: 0.55 },
        { word: "fondu…", src: "sfx/story/metal-clank.wav", volume: 0.5 },
        ...beats("puis", 2, 2.4),
        { word: "finit", src: "sfx/story/hand-whoosh.wav", volume: 0.6 },
        { word: "chez", src: "sfx/story/hand-whoosh.wav", volume: 0.5 },
        ...steps("chez", 3, 0.14, 0.1),
      ],
      beat: { pose: "scared", x: 230 },
      poses: [{ word: "et", pose: "amazed" }],
    },
    {
      // The studio goes on: the painter steps to his bench and sets the heart down; his signature writes itself on the
      // wall. Then the mortar, waiting from the start: the knife cuts the heart, the pieces drop into the bowl on "broie"
      // and the pestle crushes them, a puff of brown powder at each blow.
      id: "d2", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "alexandre", in: "cut", cam: { from: [0, 0, 1], to: [0, 0, 1] },
          source: ATELIER_SOURCE,
          layers: [
            ...atelier,
            { src: `${ART}/painter.png`, x: 610, y: 300, w: 260, z: 0.5, enter: "none", route: [[0.08, -110, 0, 2, 0.14]] },
            { src: `${ART}/heart-red.png`, x: 540, y: 570, w: 170, z: 0.6, enter: "none", pulse: 0.8, route: [[0.08, -110, 0, 2, 0.14], [0.4, 0, 150, 1, 0.1]] },
            { src: `${ART}/signature.png`, x: 60, y: 765, w: 360, rot: -4, z: 0.7, at: "pau", enter: "none", write: 0.9 },
            { fore: "bottom", color: BENCH, y: 880, z: 0.8, at: "alexandre" },
            { name: ["Alexandre Pau de Saint-Martin", "peintre de paysages"], size: 38, x: 70, y: 1000, rot: -2, z: 0.95, at: "saint-martin." },
          ],
        },
        {
          word: "il", in: "cut", carry: true, shake: ["broie", "couleur."], cam: { from: [0, 0, 1], to: [0, 0, 1] },
          source: "Heart after Senac (Wellcome); kitchen knife, c. 1920; bronze mortar and pestle (Wellcome L0058934)",
          layers: [
            { field: "#E9DFCB", dots: "tl", paper: CRUMPLED },
            watching([1.36, 1.84, 2.26], 0.32),
            { src: `${ART}/mortar2.png`, x: 190, y: 520, w: 700, z: 0.5, enter: "none" },
            { src: `${ART}/hp-l.png`, x: 380, y: 230, w: 320, z: 0.55, enter: "none", route: [[0.18, -40, 10, 1, 0.1], [1.28, 40, 390, 1, 0.1]], off: "couleur." },
            { src: `${ART}/hp-m.png`, x: 380, y: 230, w: 320, z: 0.55, enter: "none", route: [[1.28, 0, 400, 1, 0.1]], off: "couleur." },
            { src: `${ART}/hp-r.png`, x: 380, y: 230, w: 320, z: 0.55, enter: "none", route: [[0.18, 40, 10, 1, 0.1], [1.28, -40, 390, 1, 0.1]], off: "couleur." },
            { src: `${ART}/pestle.png`, x: 450, y: 60, w: 240, z: 0.6, at: "broie", enter: "none", route: [[0, 0, 370, 1, 0.08], [0.28, 0, -120, 1, 0.12], [0.5, 0, 120, 1, 0.06], [0.72, 0, -120, 1, 0.1], [0.92, 0, 120, 1, 0.06]] },
            { src: `${ART}/mortar-front.png`, x: 190, y: 520, w: 700, z: 0.65, at: "il", enter: "none" },
            { src: `${ART}/knife.png`, x: 340, y: 190, w: 560, rot: 18, z: 0.8, at: "il", enter: "slap", chop: [0.96, 0.5, -0.35, 0.9], off: "broie" },
            { src: `${ART}/powder.png`, x: 330, y: 500, w: 420, z: 0.85, at: "broie", after: 0.08, enter: "pop", off: "couleur." },
            { src: `${ART}/powder.png`, x: 260, y: 450, w: 560, rot: 8, z: 0.86, at: "couleur.", enter: "pop" },
            { src: `${ART}/powder.png`, x: 170, y: 390, w: 740, rot: -5, z: 0.87, at: "broie", after: 0.98, enter: "pop" },
            { fore: "bottom", color: BENCH, y: 1050, z: 0.7, at: "il" },
            { tape: "BRUN LOUIS XIV", size: 50, x: 300, y: 880, rot: -3, z: 0.95, at: "couleur." },
          ],
        },
      ],
      sfx: [
        ...steps("alexandre", 2, 0.14, 0.08),
        { word: "alexandre", after: 0.44, src: "sfx/story/splat.wav", volume: 0.4 },
        ...beats("alexandre", 2, 0.85, 0.7),
        { word: "pau", src: "sfx/accents/pencil-3.wav", volume: 0.5 },
        { word: "il", after: 0.32, src: "sfx/story/chop.wav", volume: 0.75 },
        { word: "broie", after: 0.08, src: "sfx/story/pestle-1.wav", volume: 0.85 },
        { word: "broie", after: 0.56, src: "sfx/story/pestle-2.wav", volume: 0.85 },
        { word: "broie", after: 0.98, src: "sfx/story/pestle-3.wav", volume: 0.85 },
      ],
      beat: { pose: "explaining", x: 230 },
    },
    {
      // The same mortar: a mummy walks along the bench, jumps and dives in head first, legs in the air; the pestle drives
      // it down, three blows, a puff of brown at each; on "ombres" the bowl fills and the paint runs down its side.
      id: "d3", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "à", in: "cut", carry: true, shake: ["momies", "pour", "peindre"], cam: { from: [0, 0, 1], to: [0, 0, 1] },
          source: "Bronze mortar and pestle (Wellcome L0058934); unwrapped mummy (Wellcome)",
          layers: [
            { field: "#E9DFCB", dots: "tl", paper: CRUMPLED },
            watching([2.42, 2.68, 3.02]),
            { stamp: "NORMAL", size: 84, x: 640, y: 240, rot: -7, z: 0.3, at: "normal" },
            { src: `${ART}/mortar2.png`, x: 190, y: 520, w: 700, z: 0.5, enter: "none" },
            { src: "art/mummy-brown/mummy.png", x: -170, y: 542, w: 150, z: 0.55, at: "normal", enter: "none", route: [[0, 240, 0, 3, 0.2], [1.0, 395, -750, 2, 0.14], [1.75, 0, 0, 1, 0.2], [1.98, 0, 60, 1, 0.05], [2.18, 0, 70, 1, 0.05], [2.52, 0, 70, 1, 0.05]], fall: [1.3, 120, 180] },
            { src: `${ART}/pestle.png`, x: 420, y: -30, w: 240, z: 0.6, at: "momies", enter: "none", route: [[0, 0, 250, 1, 0.05], [0.08, 0, -100, 1, 0.08], [0.2, 0, 170, 1, 0.05], [0.3, 0, -100, 1, 0.1], [0.54, 0, 170, 1, 0.05], [0.84, 0, -700, 1, 0.2]] },
            { src: `${ART}/mortar-front.png`, x: 190, y: 520, w: 700, z: 0.65, enter: "none" },
            { src: `${ART}/powder.png`, x: 330, y: 500, w: 420, z: 0.85, at: "momies", after: 0.06, enter: "pop", off: "pour" },
            { src: `${ART}/powder.png`, x: 260, y: 450, w: 560, rot: 8, z: 0.86, at: "pour", enter: "pop", off: "peindre" },
            { src: `${ART}/powder.png`, x: 170, y: 390, w: 740, rot: -5, z: 0.87, at: "peindre", enter: "pop", off: "leurs" },
            { src: `${ART}/paint-over.png`, x: 190, y: 520, w: 700, z: 0.88, at: "leurs", enter: "none", wipe: 0.5 },
            { fore: "bottom", color: BENCH, y: 1050, z: 0.7, at: "à" },
            { tape: "BRUN MOMIE", size: 56, x: 80, y: 880, rot: -3, z: 0.95, at: "ombres." },
          ],
        },
      ],
      sfx: [
        { word: "normal", src: "sfx/story/stamp.wav", volume: 0.6 },
        ...steps("normal", 3, 0.2, 0, 0.4),
        { word: "normal", after: 1.0, src: "sfx/accents/swish-1.wav", volume: 0.5 },
        { word: "momies", after: 0.02, src: "sfx/story/pestle-1.wav", volume: 0.85 },
        { word: "pour", src: "sfx/story/pestle-2.wav", volume: 0.85 },
        { word: "peindre", src: "sfx/story/pestle-3.wav", volume: 0.85 },
        { word: "leurs", src: "sfx/story/splat.wav", volume: 0.6 },
      ],
      beat: { pose: "shrug", x: 230 },
    },
    {
      // The painting paints itself: the Vue de Caen as a bare wash drawing, its colours coming in under a sweeping
      // edge on "peint".
      id: "d4", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "avec", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1] },
          source: "Alexandre Pau de Saint-Martin, Vue de Caen, 1810 (musée Tavet-Delacour, Pontoise)",
          layers: [
            { field: "#2A1D17", dots: "tl", paper: CRUMPLED },
            { src: `${ART}/caen-grey.jpg`, x: 40, y: 500, w: 850, rot: -1, z: 0.5, gilt: true, enter: "slap" },
            { src: `${ART}/caen.jpg`, x: 40, y: 500, w: 850, rot: -1, z: 0.5, at: "peint", enter: "none", write: 1.3 },
            { tag: "VUE DE CAEN · 1810", size: 40, x: 470, y: 430, rot: 2, z: 0.95, at: "caen," },
          ],
        },
      ],
      sfx: [
        { word: "peint", src: "sfx/story/brush.wav", volume: 0.22 },
      ],
      beat: { pose: "point-up", x: 230 },
    },
    {
      // One take on the painting: a scanner's bar sweeps down it on "analyse", turning it to an X-ray; a second pass on
      // "retrouve" brings the heart up in the middle, beating. The next beat goes on from this very picture.
      id: "d5", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "deux", in: "cut", carry: true, shake: "cœur.", cam: { from: [0, 0, 1], to: [0, 0, 1] },
          source: "Pau de Saint-Martin, Vue de Caen, 1810; heart after Senac (Wellcome)",
          layers: [
            { field: "#2A1D17", dots: "tl", paper: CRUMPLED },
            { src: `${ART}/caen.jpg`, ...CAEN, gilt: true, enter: "none" },
            { tag: "MÉDECIN LÉGISTE", size: 36, x: 60, y: 430, rot: -2, z: 0.95, at: "médecin" },
            { src: `${ART}/caen-xray.jpg`, ...CAEN, at: "analyse", enter: "none", wipe: 1.05, scanLine: true },
            { src: `${ART}/caen-heart.png`, ...CAEN, at: "retrouve", enter: "none", wipe: 0.45, scanLine: true, pulse: 0.8 },
            { tape: "IDENTIFIÉ : LOUIS XIV", size: 62, x: 90, y: 1030, rot: -4, z: 0.97, at: "cœur." },
          ],
        },
      ],
      sfx: [
        { word: "analyse", src: "sfx/story/scanner.wav", volume: 0.55 },
        { word: "retrouve", src: "sfx/accents/swish-4.wav", volume: 0.4 },
        ...beats("retrouve", 2, 0.45, 0.8),
        { word: "cœur.", src: "sfx/story/scan-ping.wav", volume: 0.55 },
      ],
      beat: { pose: "whisper", x: 230 },
      poses: [{ word: "retrouve", pose: "amazed" }],
    },
    {
      // Same picture, the heart still beating in the X-ray: the king's head rises from behind the frame and winks; a last
      // pass of the bar gives the painting its colours back, and on "dire" the loop flies to frame 0, the hook line
      // following.
      id: "d6", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "et", in: "cut", until: "dire", cam: { from: [0, 0, 1], to: [0, 0, 1] },
          source: "Vue de Caen; Rigaud, Louis XIV (Louvre), the wink drawn on; heart after Senac (Wellcome)",
          layers: [
            { field: "#2A1D17", dots: "tl", paper: CRUMPLED },
            { src: `${ART}/rigaud-head.png`, x: 260, y: 500, w: 440, z: 0.3, enter: "none", route: [[0.15, 0, -270, 1, 0.18]], swap: [1, 2, 3].map(() => `${ART}/rigaud-wink.png`), hold: 0.75 },
            { src: `${ART}/caen-xray.jpg`, ...CAEN, gilt: true, enter: "none" },
            { src: `${ART}/caen-heart.png`, ...CAEN, enter: "none", pulse: 0.8 },
            { tape: "IDENTIFIÉ : LOUIS XIV", size: 62, x: 90, y: 1030, rot: -4, z: 0.97, enter: "none" },
            { src: `${ART}/caen.jpg`, ...CAEN, at: "on", enter: "none", wipe: 0.28, scanLine: true },
          ],
        },
      ],
      sfx: [
        ...beats("et", 2, 0.05, 0.8),
        { word: "et", after: 0.15, src: "sfx/accents/swish-2.wav", volume: 0.5 },
        { word: "on", src: "sfx/accents/swish-4.wav", volume: 0.4 },
      ],
      beat: { pose: "point-up", x: 230 },
    },
  ],
});
