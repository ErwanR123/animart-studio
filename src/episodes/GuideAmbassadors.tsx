import { createGuideEpisode, type Voice } from "../guide/engine";
import type { ShotLayer } from "../guide/shots";
import voice from "../../public/voice/GuideAmbassadors.json";

// Hans Holbein the Younger, The Ambassadors, 1533, oil on oak, 207 × 209.5 cm, National Gallery, London (NG1314).
// Script (25 Oct. 2026): the memento mori explained through the painting. Checked against EN Wikipedia "The Ambassadors
// (Holbein)" and the National Gallery page:
// - the anamorphic skull at the bottom, seen from the side (high on the right or low on the left);
// - Jean de Dinteville, French ambassador in London for most of 1533 ("AET. SVÆ 29" on his dagger); Georges de Selve,
//   bishop of Lavaur ("AETATIS SVÆ 25" on his book); a skull medallion on Dinteville's hat; memento mori his motto;
// - the broken lute string ("a symbol of discord"), beside a hymnal with Luther's translation;
// - the Roman triumph's reminder: Tertullian, Apologeticum 33 ("respice post te, hominem te memento");
// - the danse macabre after the Black Death, painted on cemetery and church walls (Bernt Notke's, Tallinn, c. 1490);
// - Holbein's own Dance of Death woodcuts (designed c. 1523–26, published Lyon 1538): the pope, the king, the ploughman;
// - vanitas still lifes, 17th century (skull, hourglass, snuffed candle, wilted flowers).
// The loop: the last line stops on "Voilà pourquoi…" and the hook completes it ("…il y a une tête de mort cachée").
// Style (bible/vox.md): the painting is the anchor; the skull is the object carried across every run.
const FULL = { z: 0.76, fx: 0.5, fy: 0.5 };
// The smear on the floor fills the frame (out/grid.png: 0.30–0.72 × 0.76–0.99).
const SMEAR = { z: 1.35, fx: 0.51, fy: 0.86 };
const ART = "art/ambassadors";
const CRUMPLED = "art/paper/crumpled.jpg";
// The qualities board (d5): the two men cut out at the sides, the proofs of each quality popping in the middle.
const QUALITIES: ShotLayer[] = [
  { field: "paper", dots: "none", paper: CRUMPLED },
  { src: `${ART}/dinteville.png`, x: -70, y: 170, w: 440, z: 0.5, enter: "rise" },
  { src: `${ART}/selve.png`, x: 740, y: 170, w: 380, z: 0.5, enter: "rise", after: 0.25 },
  // Jeunesse: their faces, with the ages written in the painting (his dagger, "AET. SVÆ 29"; de Selve's book, "25").
  { src: `${ART}/q-face-dinteville.png`, x: 260, y: 470, w: 230, rot: -5, z: 0.8, at: "jeunesse", enter: "pop" },
  { src: `${ART}/q-face-selve.png`, x: 560, y: 330, w: 230, rot: 4, z: 0.8, at: "jeunesse", after: 0.3, enter: "pop" },
  // Pouvoir: the gold medal on his chest, pulled out big.
  { src: `${ART}/q-medal.png`, x: 460, y: 150, w: 150, rot: -4, z: 0.8, at: "pouvoir", enter: "pop" },
  // Savoir: the globe and the lute from the shelves between them.
  { src: `${ART}/obj-globe.png`, x: 400, y: 790, w: 230, rot: -3, z: 0.8, at: "savoir", enter: "pop" },
  { src: `${ART}/obj-lute.png`, x: 560, y: 930, w: 330, rot: 2, z: 0.85, at: "savoir", after: 0.15, enter: "pop" },
];
// Rome (d2): Caesar in paper and the crown-bearer behind him, both cut from Mantegna's canvas, before Piranesi's Forum; `k` scales the pair round
// Caesar's ear for the close-up, where the bearer leans in and talks from `talk` s after the shot starts.
const EAR: [number, number] = [480, 330];
const rome = (k: number, talk?: number): ShotLayer[] => {
  const at = (x: number, y: number) => ({ x: 540 + (x - EAR[0]) * k, y: (k > 1 ? 560 : EAR[1]) + (y - EAR[1]) * k });
  return [
    { bg: `${ART}/rome-forum.png`, dim: 0.2 },
    { src: `${ART}/rome-slave.png`, ...at(370, 150), w: 380 * k, rot: -13, z: 0.45, ...(k > 1 ? { enter: "none" as const, neck: 0.22, talk: [talk ?? 0, 9] as [number, number] } : { at: "esclave", enter: "rise" as const }) },
    { src: `${ART}/rome-caesar.png`, ...at(80, 260), w: 560 * k, z: 0.5, ...(k > 1 ? { enter: "none" as const } : { at: "rome", enter: "rise" as const }) },
    // The crowd of the triumph in the foreground (Mantegna's trumpeters), cheering below them.
    { src: `${ART}/rome-crowd.png`, x: -40, y: 1060 - (k > 1 ? 0 : 60), w: 1160, z: 0.9, enter: "none" },
  ];
};
export const guideAmbassadors = createGuideEpisode({
  voiceFile: "voice/GuideAmbassadors.mp3",
  voice: voice as Voice,
  image: { src: `${ART}/ambassadors.jpg`, width: 7000, height: 6897 },
  maxWidth: 1000,
  climb: true,
  climbFrom: "start",
  openView: FULL,
  openPose: "loupe",
  // A Renaissance lute, the instrument lying in the painting: an anonymous 16th-century prelude.
  music: "music/lute-prelude.mp3",
  tight: true,
  loop: { word: "voilà" },
  // The search game of the title: the glass looks at Dinteville, the celestial globe, the lute, de Selve, and stops on
  // the smear between their feet on "yeux" (it sees nothing there: the reveal comes next).
  search: { word: "yeux", path: [[0.245, 0.16], [0.43, 0.24], [0.67, 0.57], [0.84, 0.15], [0.53, 0.86]] },
  header: "HANS HOLBEIN · 1533",
  title: ["Saurez-vous", "la trouver ?"],
  // Bone paper, black ink, one vermilion accent (stamps, circles, arrows); Holbein's emerald as a field; the yellow highlighter.
  palette: { paper: "#EDE5D3", accent: "#C8321E", hl: "#F4C531", green: "#2E6B47", ochre: "#B8935A" },
  lead: {
    context: {
      view: SMEAR,
      // A diagonal smear has no loop that fits: hand-drawn "?" rise off it on "rien".
      questions: { word: "rien", fx: 0.53, fy: 0.85 },
      shots: [
        {
          // The smear cut out as paper over the painting's own floor (painted out under it), folding back along its
          // axis into the skull Holbein hid; the camera follows it in.
          word: "changez", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.8] },
          layers: [
            { bg: `${ART}/skull-floor.jpg`, z: 0.487 },
            { src: `${ART}/skull-smear.png`, x: -63, y: 229, w: 1334, z: 0.487, enter: "none", fold: { word: "d'angle", angle: -25, k: 0.2, origin: [0.452, 0.571] } },
            // The angle to look from: an arrow from the painting's right edge.
            { arrow: [1040, 300, 760, 520], bend: 0.3, color: "accent", width: 10, at: "changez", draw: 0.35 },
          ],
        },
      ],
      sfx: [{ word: "crâne", src: "sfx/story/boom.wav", volume: 0.35 }],
      poses: [{ word: "crâne", pose: "amazed" }],
    },
  },
  details: [
    {
      // The name: the skull and its name in cut-out letters.
      id: "d1", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "crâne", in: "cut", carry: true, cam: { from: [0, 0, 1.06], to: [0, 0, 1] },
          layers: [
            { field: "paper", dots: "none", paper: CRUMPLED },
            { src: `${ART}/skull.png`, x: 230, y: 420, w: 620, rot: -4, z: 0.6, enter: "pop" },
            { letters: "MEMENTO MORI", x: 70, y: 110, w: 940, size: 120, at: "memento" },
          ],
        },
      ],
      beat: { pose: "explaining", x: 230 },
    },
    {
      // Rome: Caesar in paper (Mantegna) is there at the cut; the crown-bearer behind him on the same canvas climbs up and,
      // close up, leans to his ear and talks (paper puppet); then the stamp.
      id: "d2", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "rome", in: "tear", source: "Andrea Mantegna, Les Triomphes de César IX, 1484–1492, Royal Collection", cam: { from: [0, 0, 1], to: [0, 0, 1.04] },
          layers: [
            ...rome(1),
            { name: ["Le triomphe", "Rome antique"], x: 80, y: 80, size: 44, rot: -2, z: 0.95, at: "rome" },
          ],
        },
        {
          word: "souffler", in: "push", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          layers: [
            ...rome(1.9, 0.6),
            { stamp: "PAS UN DIEU", size: 110, x: 120, y: 980, rot: -8, z: 0.95, at: "dieu" },
          ],
        },
      ],
      sfx: [{ word: "dieu", src: "sfx/accents/thud.wav", volume: 0.5 }],
      beat: { pose: "whisper", x: 230 },
    },
    {
      // A real danse macabre (Notke's, the skeletons leading the pope and the emperor by the hand), the camera sliding
      // along it until "pape"; then the name over Holbein's own, the pope, the king and the ploughman, each one big card
      // slapped on the last, all three swaying on "égal".
      id: "d4", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "au", in: "cut", source: "Bernt Notke, Danse macabre, vers 1490, église Saint-Nicolas, Tallinn", cam: { from: [0, 0, 1], to: [-1820, 0, 1] },
          layers: [
            { bg: "art/paper/dark.jpg" },
            { src: `${ART}/dance-mural.png`, x: 0, y: 110, w: 2900, z: 1, enter: "none" },
          ],
        },
        {
          word: "pape", in: "slide", carry: true, source: "Hans Holbein le Jeune, La Danse macabre, gravures sur bois, Lyon 1538 (MET)", cam: { from: [0, 0, 1], to: [0, 0, 1.03] },
          layers: [
            { bg: "art/paper/dark.jpg" },
            { letters: "DANSES MACABRES", x: 70, y: 60, w: 940, size: 100, at: "pape" },
            // Each card sways from its foot on "personne" (3.3, 2.9 and 2.4 s after it lands).
            { src: `${ART}/dance-pope.png`, x: 40, y: 380, w: 520, rot: -6, z: 0.5, at: "pape", after: 0.25, enter: "slap", chop: [0.5, 1, 3.3, 0.25] },
            { src: `${ART}/dance-king.png`, x: 290, y: 340, w: 500, rot: 3, z: 0.55, at: "roi", enter: "slap", chop: [0.5, 1, 2.9, -0.25] },
            { src: `${ART}/dance-ploughman.png`, x: 500, y: 410, w: 520, rot: -3, z: 0.6, at: "paysan", enter: "slap", chop: [0.5, 1, 2.4, 0.25] },
          ],
        },
      ],
      sfx: [
        { word: "pape", src: "sfx/accents/thud.wav", volume: 0.4 },
        { word: "roi", src: "sfx/accents/thud.wav", volume: 0.4 },
        { word: "paysan", src: "sfx/accents/thud.wav", volume: 0.4 },
      ],
      beat: { pose: "explaining", x: 230 },
    },
    {
      // Back to the painting: the two men in paper land on their titles; then each quality brings the proofs from it.
      id: "d5", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "et", in: "cut", carry: true, source: "Les Ambassadeurs, détails", cam: { from: [0, 0, 1], to: [0, 0, 1.03] },
          layers: [
            ...QUALITIES.map((l): ShotLayer =>
              "src" in l && l.src.endsWith("/dinteville.png") ? { ...l, at: "et" } : "src" in l && l.src.endsWith("/selve.png") ? { ...l, at: "et" } : l,
            ),
            { name: ["Jean de Dinteville", "ambassadeur, 29 ans"], x: 20, y: 40, size: 34, rot: -2, z: 0.95, at: "ambassadeur" },
            { name: ["Georges de Selve", "évêque, 25 ans"], x: 640, y: 40, size: 34, rot: 2, z: 0.95, at: "évêque" },
          ],
        },
      ],
      beat: { pose: "point-up", x: 230 },
    },
    {
      // His motto over his portrait; then the camera dives into his hat, the small skull on it circled.
      id: "d6", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "pourtant", in: "push", cam: { from: [0, 0, 1], to: [0, 0, 1.04] },
          layers: [
            { field: "paper", dots: "none", paper: CRUMPLED },
            { src: `${ART}/dinteville.png`, x: 230, y: 330, w: 620, z: 0.5, enter: "none", neck: 0.17, talk: [0.3, 3] },
            { letters: "MEMENTO MORI", x: 70, y: 50, w: 940, size: 110, at: "memento" },
          ],
        },
        {
          word: "il", in: "zoom", into: [520, 160], carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          layers: [
            { field: "green", dots: "none", paper: CRUMPLED },
            { src: `${ART}/hat.png`, x: 40, y: 230, w: 1000, rot: -1, z: 0.5, enter: "none" },
            { scribble: [530, 470, 140, 130], color: "accent", width: 10, at: "crâne", draw: 0.35 },
          ],
        },
      ],
      beat: { pose: "point-up", x: 230 },
    },
    {
      // The board again: the skull rises between them and everything they own is blown out of the frame.
      id: "d7", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          // The same board: the skull rises between them and everything they own is blown out of the frame.
          word: "face", in: "cut", carry: true, cam: { from: [0, 0, 1.03], to: [0, 0, 1] },
          layers: [
            // One after another, never two on the same frame.
            ...QUALITIES.filter((l) => !("tag" in l)).map((l, i): ShotLayer =>
              "src" in l && /\/(q|obj)-/.test(l.src) ? { ...l, at: undefined, enter: "none", exit: "gloire", after: i * 0.1 } : { ...l, at: undefined, enter: "none" },
            ),
            { src: `${ART}/skull.png`, x: 360, y: 380, w: 380, rot: -3, z: 0.7, at: "mort", enter: "rise" },
            { tape: "du vent", x: 400, y: 1080, size: 64, rot: -3, z: 0.92, at: "vent" },
          ],
        },
      ],
      sfx: [{ word: "gloire", src: "sfx/accents/swish-2.wav", volume: 0.5 }],
      beat: { pose: "shrug", x: 230 },
    },
    {
      // Seen only in passing: the painting fills the frame and the camera slides past it; at an angle, its smear folds
      // back into the skull.
      id: "d8", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "et", in: "cut", until: "voilà", cam: { from: [90, 0, 1.08], to: [-60, -60, 1.14] },
          layers: [
            { bg: "#151A14" },
            { src: `${ART}/ambassadors-clean.jpg`, x: 0, y: 40, w: 1080, z: 0.5, enter: "none" },
            { src: `${ART}/skull-smear.png`, x: 275.7, y: 801.0, w: 571.9, z: 0.5, enter: "none", fold: { word: "biais", angle: -25, k: 0.2, origin: [0.452, 0.571] } },
            { scribble: [440, 900, 190, 160], color: "accent", width: 10, at: "mort", draw: 0.35 },
          ],
        },
      ],
      sfx: [{ word: "biais", src: "sfx/story/boom.wav", volume: 0.3 }],
      // He walks past it, as the viewer would; the camera slides sideways the same way.
      beat: { pose: "walking", x: 230 },
    },
  ],
});
