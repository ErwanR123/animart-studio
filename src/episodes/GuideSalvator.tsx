import { createGuideEpisode, type Voice } from "../guide/engine";
import { pencilLoop } from "../guide/shots";
import voice from "../../public/voice/GuideSalvator.json";

// Leonardo da Vinci (attributed), Salvator Mundi, c. 1500, oil on walnut. Format: an investigation between two clues
// (the thumb says Leonardo, the orb says no); thesis: the name makes the price. Facts (10 Nov. 2026):
// - Sotheby's London, 25 June 1958, Cook Collection dispersal: £45, catalogued as a follower's copy (The Art Newspaper,
//   "What now for the £45 da Vinci"; Artnet, "Timeline: How Salvator Mundi went from £45 to $450 million");
// - 2005, Louisiana: bought by the dealers Robert Simon and Alexander Parish for under $10,000 (sources range from
//   $1,175 to $10,000: "trois fois rien"); the 2005 catalogue on Commons: lot 664, "After Leonardo da Vinci",
//   estimate [1200/1800];
// - Dianne Modestini's cleaning and the infrared found a first, more upright position of the blessing thumb, the
//   pentimento held as the strongest argument for Leonardo (NYU IFA Newsgram 12; salvatormundirevisited.com,
//   "Pentimenti"): shown as a dashed pencil outline, the infrared itself is not public;
// - Christie's New York, 15 Nov. 2017: $450,312,500, the world record; buyer Prince Badr bin Abdullah; not shown in
//   public since (absent from the Louvre's Leonardo show, Oct. 2019: The Art Newspaper, 7 Apr. 2021; whereabouts
//   unknown: Irish Times, MoneyWeek);
// - the undistorting orb: the argument of its critics (Walter Isaacson among them); Leonardo's optics: Codex Atlanticus.
// Images (public/art/SOURCES.md): the restored painting, the 1958 photo (Cook Collection) and the 2006-07 photo after
// cleaning, both registered onto the restored scan (SIFT, so the fade and the swab land in place); the 2005 catalogue;
// Leonardo's red-chalk self-portrait (Turin); a Codex Atlanticus eye diagram; Winslow Homer, Art-Students and Copyists
// in the Louvre Gallery (Harper's Weekly, 1868); a crystal ball at Hanstholm lighthouse; a cotton swab.
// Music: Kevin MacLeod, Investigations (CC BY 3.0).
const ART = "art/salvator";
const CRUMPLED = "art/paper/crumpled.jpg";
const BLUE = "#14203A";
const ORANGE = "#FF6A13";
const FULL = { z: 1.135, fx: 0.5, fy: 0.5 };
// Frame 0 and the loop's last frame: the painting covering the whole screen, the 45 £ tag hanging on it.
const OPEN = { z: 1, fx: 0.5, fy: 0.5 };
const ground = { field: BLUE, dots: "tl" as const, paper: CRUMPLED };
// The painting in its gilt frame, the same place in every shot: only its state changes (1958, cleaned, restored).
const PAINT = { x: 190, y: 150, w: 700, z: 0.4, gilt: true, enter: "none" as const };
const restored = { src: `${ART}/painting.jpg`, ...PAINT };
const before = { src: `${ART}/before-1958.jpg`, ...PAINT };
// The blessing hand, close (crop 0–0.30 × 0.38–0.70 of the panel, 990 × 1554): restored, where the thumb reads.
const HAND = { src: `${ART}/hand-restored.jpg`, x: 90, y: 0, w: 900, z: 0.4, enter: "none" as const };
// The orb, close (crop 0.52–1 × 0.64–1 of the panel, 1584 × 1749).
const ORB = { src: `${ART}/orb-restored.jpg`, x: 0, y: 104, w: 1080, z: 0.4, enter: "none" as const };
// The finished thumb, then its first position (more upright, from the infrared) as a dashed ghost.
const THUMB = pencilLoop(590, 850, 118, 290, 2);
// A path cut into pencil dashes (dash, gap px) along the polyline `pts`.
const dashed = (pts: [number, number][], dash = 26, gap = 16) => {
  const out: string[] = [];
  let on = true;
  let left = dash;
  let [x, y] = pts[0];
  let seg = `M${x} ${y}`;
  for (const [nx, ny] of pts.slice(1)) {
    let d = Math.hypot(nx - x, ny - y);
    while (d > 0) {
      const step = Math.min(left, d);
      x += ((nx - x) * step) / d;
      y += ((ny - y) * step) / d;
      d -= step;
      left -= step;
      if (on) seg += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
      if (left <= 0) {
        if (on) out.push(seg);
        on = !on;
        left = on ? dash : gap;
        seg = `M${x.toFixed(1)} ${y.toFixed(1)}`;
      }
    }
  }
  if (on) out.push(seg);
  return out.join(" ");
};
const arc = Array.from({ length: 9 }, (_, k) => {
  const a = Math.PI - (k * Math.PI) / 8;
  return [705 + 52 * Math.cos(a), 540 - 60 * Math.sin(a)] as [number, number];
});
const GHOST = dashed([[653, 1060], [653, 540], ...arc, [757, 540], [757, 1060]]);
// A real crystal ball's view turns the world upside down; the robe's fold runs straight through Leonardo's.
const FOLD = "M572 140 L590 360 M594 400 L612 640 M615 680 L632 915";

export const guideSalvator = createGuideEpisode({
  voiceFile: "voice/GuideSalvator.mp3",
  voice: voice as Voice,
  image: { src: `${ART}/painting.jpg`, width: 2400, height: 3532 },
  maxWidth: 1000,
  climb: true,
  climbFrom: "start",
  openView: FULL,
  openPose: "amazed",
  music: "music/investigations.mp3",
  tight: true,
  palette: { paper: "#EDE5D3", accent: ORANGE, hl: "#F4C531" },
  cold: [
    { view: OPEN, tapes: ["VENDU 45 £"], y: 1700, size: 54 },
    { word: "45", view: { z: 2.1, fx: 0.5, fy: 0.27 } },
  ],
  coldTag: { text: "45 £", x: 940, y: 1420 },
  // The orb's reveal in silence; the music comes back with Leonardo's notebooks.
  musicCut: [["d6", "celle-là,"], ["d7", "et"]],
  // The last words ("… une copie à 45 livres ?") run into the first ("Ils ont bradé ce tableau 45 livres.").
  loop: { word: "livres", view: OPEN, full: true },
  header: "SALVATOR MUNDI · VERS 1500",
  title: ["Le Léonard", "à 45 livres"],
  lead: {
    hook: {
      sfx: [{ word: "45", src: "sfx/accents/thud.wav", volume: 0.5 }],
    },
    context: {
      shots: [
        {
          // The name lands under the frame; then the tag prints out its receipt: 45 £ at the top, 450 312 500 $ at
          // the bottom of a long strip.
          word: "c'était", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 30, 1.04] },
          source: "Salvator Mundi, restored; the prices of 1958 (Sotheby's) and 2017 (Christie's)",
          layers: [
            ground,
            restored,
            { pricetag: "45 £", size: 46, x: 660, y: 110, w: 260, z: 0.9, enter: "none" },
            { name: ["Léonard de Vinci"], size: 50, x: 330, y: 1190, rot: -3, z: 0.9, at: "léonard" },
            { src: `${ART}/receipt.png`, x: 690, y: 290, w: 240, rot: 2, z: 0.92, at: "revendu", enter: "none", wipe: 1.4 },
          ],
        },
      ],
      sfx: [
        { word: "léonard", src: "sfx/accents/tape.wav", volume: 0.45 },
        { word: "revendu", src: "sfx/story/receipt.wav", volume: 0.5 },
      ],
      poses: [{ word: "c'était", pose: "amazed" }],
    },
  },
  details: [
    {
      // "Regardez-le en 1958": the same panel fades to its 1958 photo; the overpaint circled, the stamp, the tag back.
      id: "d1", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "comment", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, -20, 1.05] },
          source: "Salvator Mundi, restored",
          layers: [ground, restored],
        },
        {
          word: "regardez-le", in: "fade", carry: true, cam: { from: [0, -20, 1.05], to: [0, -30, 1.08] },
          source: "Salvator Mundi before restoration, photo of the Cook Collection (Commons)",
          layers: [
            ground,
            before,
            { tag: "LONDRES · 1958", size: 42, x: 500, y: 1200, rot: -2, z: 0.95, at: "1958." },
            { pencil: pencilLoop(540, 470, 170, 210, 2), draw: 0.45, z: 0.9, at: "repeint" },
            { stamp: "COPIE", size: 130, x: 300, y: 760, rot: -10, z: 0.95, at: "copie." },
            { pricetag: "45 £", size: 46, x: 660, y: 110, w: 260, z: 0.9, at: "copie.", after: 0.35 },
          ],
        },
      ],
      sfx: [
        { word: "1958.", src: "sfx/accents/page-2.wav", volume: 0.4 },
        { word: "repeint", src: "sfx/accents/pencil-2.wav", volume: 0.45 },
        { word: "copie.", src: "sfx/story/stamp.wav", volume: 0.6 },
      ],
      beat: { pose: "skeptical", x: 230 },
    },
    {
      // The real 2005 catalogue ("After Leonardo", estimate 1,200–1,800 $), then the swab lifting the overpaint.
      id: "d2", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "en", in: "slide", cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          source: "Auction catalogue, Louisiana, 2005, lot 664 (Commons)",
          layers: [
            { bg: "art/paper/kraft.jpg" },
            { src: `${ART}/catalogue.png`, x: -20, y: 250, w: 1500, rot: -1, z: 0.4, enter: "none" },
            { tag: "LOUISIANE · 2005", size: 42, x: 80, y: 230, rot: -2, z: 0.95, at: "2005," },
            { marker: [82, 668, 615, 50], z: 0.9, at: "marchands" },
            { marker: [82, 786, 180, 48], z: 0.9, at: "rien…" },
            { tape: "ESTIMÉ 1 200 $", size: 56, x: 330, y: 1120, rot: -3, z: 0.95, at: "rien…", after: 0.2 },
          ],
        },
        {
          word: "et", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.03] },
          source: "Salvator Mundi, Cook Collection photo; the 2006-07 photo after cleaning (Commons); a cotton swab",
          layers: [
            ground,
            before,
            { src: `${ART}/cleaned.jpg`, ...PAINT, at: "nettoient.", write: 1.6 },
            { src: `${ART}/swab.png`, x: 60, y: 640, w: 520, rot: -60, z: 0.95, at: "nettoient.", enter: "none", route: [[0, 700, 0, 6, 0.27]] },
          ],
        },
      ],
      sfx: [
        { word: "2005,", src: "sfx/accents/page-1.wav", volume: 0.4 },
        { word: "marchands", src: "sfx/accents/pencil-3.wav", volume: 0.35 },
        { word: "rien…", src: "sfx/accents/tape.wav", volume: 0.45 },
        { word: "nettoient.", src: "sfx/story/brush.wav", volume: 0.5 },
      ],
      beat: { pose: "explaining", x: 230 },
    },
    {
      // Into the hand: the thumb circled, then its first, upright position drawn on as a dashed ghost.
      id: "d3", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "sous", in: "zoom", into: [295, 665], carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1] },
          source: "Salvator Mundi, the blessing hand; the first thumb after the infrared (Modestini)",
          layers: [
            { bg: "#100D0B" },
            HAND,
            { pencil: THUMB, draw: 0.45, z: 0.9, at: "pouce." },
            { pencil: GHOST, color: ORANGE, width: 9, draw: 0.6, z: 0.92, at: "deuxième." },
            { tape: "1ʳᵉ VERSION", size: 50, x: 700, y: 470, rot: 3, z: 0.95, at: "deuxième.", after: 0.5 },
          ],
        },
      ],
      sfx: [
        { word: "pouce.", src: "sfx/accents/pencil-2.wav", volume: 0.45 },
        { word: "deuxième.", src: "sfx/accents/pencil-4.wav", volume: 0.5 },
      ],
      beat: { pose: "loupe", x: 230 },
    },
    {
      // The hand stays while "Le peintre a hésité"; then the copyist at his board, and his copies, one thumb each.
      id: "d4", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "le", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.03] },
          source: "Salvator Mundi, the blessing hand",
          layers: [
            { bg: "#100D0B" },
            HAND,
            { pencil: THUMB, z: 0.9, enter: "none" },
            { pencil: GHOST, color: ORANGE, width: 9, z: 0.92, enter: "none" },
            { tape: "1ʳᵉ VERSION", size: 50, x: 700, y: 470, rot: 3, z: 0.95, enter: "none" },
          ],
        },
        {
          word: "un", in: "whip", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.04] },
          source: "Winslow Homer, Art-Students and Copyists in the Louvre Gallery, Harper's Weekly, 1868; the restored hand",
          layers: [
            { bg: "art/paper/graph.jpg" },
            { src: `${ART}/copyist.png`, x: 30, y: 300, w: 540, rot: -2, z: 0.5, enter: "rise" },
            ...[0, 1, 2].map((k) => ({
              src: `${ART}/hand-restored.jpg`, x: 570 + k * 40, y: 200 + k * 150, w: 300, rot: [-4, 2, 5][k], z: 0.6 + k * 0.02,
              at: "n'hésite", after: k * 0.25, enter: "slap" as const,
            })),
            { tape: "UN SEUL POUCE", size: 56, x: 560, y: 1120, rot: -2, z: 0.95, at: "recopie." },
          ],
        },
      ],
      sfx: [
        { word: "un", src: "sfx/accents/page-3.wav", volume: 0.4 },
        ...[0, 0.25, 0.5].map((after) => ({ word: "n'hésite", after, src: "sfx/accents/shutter.wav", volume: 0.35 })),
        { word: "recopie.", src: "sfx/accents/tape.wav", volume: 0.45 },
      ],
      beat: { pose: "point-up", x: 230 },
    },
    {
      // The verdict, the paddles racing, the gavel: 450 000 000 $.
      id: "d5", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "donc", in: "cut", carry: true, shake: "millions.", cam: { from: [0, 0, 1], to: [0, 20, 1.05] },
          source: "Salvator Mundi, restored; Christie's New York, 15 Nov. 2017",
          layers: [
            ground,
            restored,
            { name: ["Léonard de Vinci", "vers 1500"], size: 50, x: 330, y: 1190, rot: -3, z: 0.9, at: "léonard." },
            { paddles: 12, dur: 1.2, x: 0, y: 0, w: 1080, z: 0.85, at: "record", off: "millions." },
            { tag: "CHRISTIE'S · NEW YORK · 2017", size: 38, x: 80, y: 90, rot: -2, z: 0.95, at: "monde" },
            { big: "450\u00a0000\u00a0000\u00a0$", size: 112, color: ORANGE, x: 90, y: 560, rot: -4, z: 0.97, at: "millions." },
          ],
        },
      ],
      sfx: [
        { word: "léonard.", src: "sfx/accents/tape.wav", volume: 0.4 },
        { word: "millions.", src: "sfx/story/gavel.wav", volume: 0.8 },
      ],
      beat: { pose: "amazed", x: 230 },
    },
    {
      // The orb: circled; a real crystal ball turns the lighthouse upside down; Leonardo's lets the fold run straight.
      id: "d6", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "sauf", in: "zoom", into: [736, 995], cam: { from: [0, 0, 1], to: [0, 0, 1] },
          source: "Salvator Mundi, restored, the orb",
          layers: [
            { bg: "#0E1424" },
            ORB,
            { pencil: pencilLoop(648, 760, 330, 330, 2), draw: 0.5, z: 0.9, at: "gauche." },
          ],
        },
        {
          word: "une", in: "cut", cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          source: "A crystal ball in front of Hanstholm lighthouse (Commons)",
          layers: [
            { bg: "art/paper/graph.jpg" },
            { src: `${ART}/glass-ball.png`, x: 190, y: 260, w: 700, z: 0.5, at: "boule", enter: "slap" },
            { tape: "À L'ENVERS", size: 60, x: 560, y: 1000, rot: -4, z: 0.95, at: "déforme" },
            { pencil: "M700 990 C640 900 600 820 560 700 M560 700 L548 752 M560 700 L600 735", width: 9, draw: 0.35, z: 0.9, at: "déforme", after: 0.2 },
          ],
        },
        {
          word: "celle-là,", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1] },
          source: "Salvator Mundi, restored, the orb and the fold of the robe behind it",
          layers: [
            { bg: "#0E1424" },
            ORB,
            { pencil: FOLD, color: ORANGE, width: 10, draw: 0.6, z: 0.9, at: "celle-là," },
            { tape: "LA ROBE PASSE TOUT DROIT", size: 50, x: 200, y: 250, rot: -2, z: 0.95, at: "rien." },
          ],
        },
      ],
      sfx: [
        { word: "gauche.", src: "sfx/accents/pencil-1.wav", volume: 0.45 },
        { word: "boule", src: "sfx/accents/thud.wav", volume: 0.45 },
        { word: "déforme", src: "sfx/accents/tape.wav", volume: 0.4 },
        { word: "celle-là,", src: "sfx/accents/pencil-3.wav", volume: 0.5 },
        { word: "rien.", src: "sfx/accents/tape.wav", volume: 0.45 },
      ],
      beat: { pose: "skeptical", x: 230 },
    },
    {
      // Leonardo and his optics; then the painting sealed and gone dark.
      id: "d7", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "et", in: "cut", cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          source: "Leonardo, presumed self-portrait, red chalk (Turin); Codex Atlanticus, eye diagram",
          layers: [
            ground,
            { src: `${ART}/leonardo.png`, x: 50, y: 280, w: 480, rot: -2, z: 0.5, enter: "rise" },
            { src: `${ART}/codex.png`, x: 560, y: 220, w: 460, rot: 2, z: 0.55, at: "roi", enter: "drop" },
            { marker: [600, 290, 380, 300], z: 0.9, at: "l'optique." },
            { tag: "CODEX ATLANTICUS", size: 38, x: 580, y: 930, rot: 2, z: 0.95, at: "l'optique." },
          ],
        },
        {
          word: "depuis", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.04] },
          source: "Salvator Mundi, restored; not shown in public since Nov. 2017",
          layers: [
            ground,
            restored,
            { tape: "NE PAS OUVRIR", size: 64, x: 120, y: 420, rot: -28, z: 0.9, at: "jamais" },
            { tape: "NE PAS OUVRIR", size: 64, x: 140, y: 760, rot: 24, z: 0.92, at: "jamais", after: 0.25 },
            { veil: 0.8, color: "#07090F", z: 0.95, at: "montré." },
            { tape: "UNE HISTOIRE D'ART PAR JOUR", size: 34, x: 330, y: 1060, rot: -2, z: 0.99, at: "vente," },
            { tape: "ABONNEZ-VOUS", size: 34, x: 600, y: 1128, rot: 2, z: 0.99, at: "vente,", after: 0.3 },
          ],
        },
      ],
      sfx: [
        { word: "roi", src: "sfx/accents/page-2.wav", volume: 0.4 },
        { word: "l'optique.", src: "sfx/accents/pencil-3.wav", volume: 0.35 },
        { word: "jamais", src: "sfx/accents/tape.wav", volume: 0.5 },
        { word: "jamais", after: 0.25, src: "sfx/accents/tape.wav", volume: 0.5 },
      ],
      beat: { pose: "whisper", x: 230 },
    },
    {
      // The vote: Leonardo (1) or a copy (2), each with its price; then the flight back to frame 0.
      id: "d8", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "alors", in: "cut", until: "livres", cam: { from: [0, 0, 1], to: [0, 0, 1.03] },
          source: "Salvator Mundi, restored and in 1958",
          layers: [
            ground,
            { src: `${ART}/painting.jpg`, x: 30, y: 230, w: 500, rot: -2, z: 0.4, gilt: true, enter: "none" },
            { src: `${ART}/before-1958.jpg`, x: 550, y: 230, w: 500, rot: 2, z: 0.42, gilt: true, enter: "none" },
            { pricetag: "450 M$", size: 40, x: 300, y: 150, w: 220, z: 0.9, at: "millions" },
            { tape: "1 · LÉONARD", size: 54, x: 60, y: 1010, rot: -3, z: 0.95, at: "léonard…" },
            { tape: "2 · COPIE", size: 54, x: 580, y: 1010, rot: 3, z: 0.95, at: "copie" },
            { pricetag: "45 £", size: 40, x: 820, y: 150, w: 200, z: 0.9, at: "copie" },
            { tag: "1 OU 2 ? EN COMMENTAIRE", size: 34, x: 360, y: 1140, rot: -1, z: 0.95, at: "copie", after: 0.3 },
          ],
        },
      ],
      sfx: [
        { word: "léonard…", src: "sfx/accents/tape.wav", volume: 0.45 },
        { word: "copie", src: "sfx/accents/tape.wav", volume: 0.45 },
      ],
      beat: { pose: "shrug", x: 230 },
    },
  ],
});
