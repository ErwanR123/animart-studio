import { createGuideEpisode, type Voice } from "../guide/engine";
import voice from "../../public/voice/GuideLamb.json";

// The Lamb of the Ghent Altarpiece (Jan and Hubert van Eyck, 1432, Saint-Bavo's, Ghent). Format "Restauration ratée… ou
// pas". Facts (5 Nov. 2026; The Art Newspaper, 18 Dec. 2019; Getty / KIK-IRPA, Closer to Van Eyck, Aug. 2020; RTBF, 2025;
// Wikipedia EN "Ghent Altarpiece", FR "L'Agneau mystique"; Yahoo / The Telegraph, Jan. 2020):
// - the restoration by KIK-IRPA (from 2012, €5 M in all by the RTBF's latest count, for the whole altarpiece and with
//   work after 2020; about €2.2 M when the Lamb was shown) removed all the 16th-century overpaint of the Lamb, revealing
//   the Eyckian face; the panel was shown in January 2020;
// - the press and the internet mocked it: "alarmingly humanoid" (Smithsonian), "A Nightmarish Restoration" (Hyperallergic),
//   "the Internet Thinks It Looks Like Zoolander" (Artnet); the headlines on screen are translated from these;
// - the overpaint probably dates from September 1550 (a Ghent chronicle): left at "au seizième siècle".
// The face shown is the Commons comparison's "during" state, the original before retouching, the most striking one and
// the only sharp one found.
// Images (public/art/SOURCES.md): the before/after of the Lamb's head; the open altarpiece; three visitors of their time
// (Hollar 1640, Costumes Parisiens 1831, Atget c. 1900). Music: Dufay, *Se la face ay pale* (c. 1430), of the Burgundian
// court.
const ART = "art/agneau";
const CRUMPLED = "art/paper/crumpled.jpg";
const GREEN = "#232A1B";
const RED = "#B8261B";
const FULL = { z: 1, fx: 0.5, fy: 0.5 };
// Frame 0 and the loop's last frame: the face covering the whole screen.
const OPEN = { z: 1, fx: 0.5, fy: 0.5 };
// The head, the same place in every shot from "En 2020" to the end: one set, only the face changes.
const FACE = { x: 110, y: 250, w: 860 };
const ground = { field: GREEN, dots: "tl" as const, paper: CRUMPLED };
const face = { src: `${ART}/face.jpg`, ...FACE, z: 0.4, enter: "none" as const };
const old = { src: `${ART}/face-old.jpg`, ...FACE, z: 0.5, enter: "none" as const };
// The headlines landing on the face, then swept away by "Sauf que…".
const press = [
  { clipping: "« D'une humanité alarmante »", masthead: "Smithsonian", lines: 3, w: 490, x: 40, y: 420, rot: -6, z: 0.82 },
  { clipping: "Une restauration cauchemardesque", masthead: "Hyperallergic", lines: 3, w: 490, x: 560, y: 630, rot: 5, z: 0.84 },
  { clipping: "Internet lui trouve une tête de Zoolander", masthead: "artnet", lines: 3, w: 490, x: 70, y: 840, rot: 3, z: 0.86 },
];
// A visitor crossing the shot: walks in, stops in front of the Lamb, walks out.
const visitor = (src: string, w: number, y: number, at: string) => ({
  src: `${ART}/${src}`, x: -w, y, w, z: 0.92, enter: "none" as const, at,
  route: [[0, 560 + w, 0, 4, 0.13], [0.8, 700, 0, 5, 0.11]] as [number, number, number, number, number][],
});
// More than four centuries going by, from the overpaint to the restoration.
const riffle = Array.from({ length: 24 }, (_, k) => [["d4", "pendant"], String(1550 + k * 20), 0.1 + k * 0.1] as [[string, string], string, number]);

export const guideLamb = createGuideEpisode({
  voiceFile: "voice/GuideLamb.mp3",
  voice: voice as Voice,
  image: { src: `${ART}/cover.jpg`, width: 2160, height: 3840 },
  maxWidth: 1000,
  climb: true,
  climbFrom: "start",
  openView: FULL,
  openPose: "amazed",
  music: "music/dufay-face-pale.mp3",
  tight: true,
  palette: { paper: "#EDE5D3", accent: RED, hl: "#F4C531" },
  // Frame 0: the face full screen, its price tied under the chin; on "Résultat" a hard cut closer.
  cold: [
    { view: OPEN, y: 1700, size: 54 },
    { word: "résultat", view: { z: 1.14, fx: 0.5, fy: 0.5 } },
  ],
  coldTag: { text: "5 000 000 €", x: 600, y: 1560 },
  // The peel in silence, the music back with the date.
  musicCut: [["d5", "dessous,"], ["d5", "1432."]],
  // The last word ("…Van Eyck.") runs into the first ("Cinq millions d'euros…").
  loop: { word: "eyck.", view: OPEN, full: true },
  header: "VAN EYCK · 1432",
  title: ["L'Agneau", "mystique"],
  calendar: {
    pages: riffle,
    until: ["d5", "dessous,"],
    x: 700,
    y: 280,
  },
  lead: {
    hook: {
      sfx: [
        { word: "résultat", src: "sfx/accents/thud.wav", volume: 0.55 },
        { word: "moque", src: "sfx/story/laugh.wav", volume: 0.3 },
      ],
    },
    context: {
      shots: [
        {
          // The whole altarpiece, the camera closing in on the small white lamb in its middle.
          word: "c'est", in: "cut", cam: { from: [0, 0, 1], to: [0, -60, 1.5] },
          source: "Jan and Hubert van Eyck, Ghent Altarpiece, open, 1432 (Saint-Bavo's, Ghent)",
          layers: [
            ground,
            { src: `${ART}/retable.png`, x: 40, y: 300, w: 1000, z: 0.4, enter: "none" },
            { tag: "GAND · BELGIQUE", size: 40, x: 90, y: 1090, rot: -2, z: 0.95, at: "gand." },
          ],
        },
      ],
      sfx: [{ word: "gand.", src: "sfx/accents/page-2.wav", volume: 0.4 }],
      poses: [{ word: "c'est", pose: "explaining" }],
    },
  },
  details: [
    {
      // The press lands on the face, one headline after another; the stamp crushes them all.
      id: "d1", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "en", in: "cut", carry: true, shake: "ratée.", cam: { from: [0, 0, 1], to: [0, 0, 1.03] },
          source: "Ghent Altarpiece, the Lamb's head during restoration (Commons, KIK-IRPA); headlines of Jan. 2020, translated",
          layers: [
            ground,
            face,
            { tag: "JANVIER 2020", size: 44, x: 90, y: 280, rot: -3, z: 0.9, at: "2020," },
            { ...press[0], at: "tout" },
            { ...press[1], at: "parle" },
            { ...press[2], at: "restauration" },
            { stamp: "RATÉE", size: 170, x: 230, y: 560, rot: -12, z: 0.95, at: "ratée." },
          ],
        },
      ],
      sfx: [
        { word: "tout", src: "sfx/accents/page-1.wav", volume: 0.4 },
        { word: "parle", src: "sfx/accents/page-2.wav", volume: 0.4 },
        { word: "restauration", src: "sfx/accents/page-1.wav", volume: 0.4 },
        { word: "ratée.", src: "sfx/accents/thud.wav", volume: 0.6 },
      ],
      beat: { pose: "skeptical", x: 230 },
    },
    {
      // One take from the shot before: press and stamp go on "inventé", the face stays alone; the word comes on "retrouvé".
      id: "d2", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "sauf", in: "cut", carry: true, cam: { from: [0, 0, 1.03], to: [0, 0, 1.06] },
          source: "Ghent Altarpiece, the Lamb's head during restoration (Commons, KIK-IRPA)",
          layers: [
            ground,
            face,
            ...press.map((p) => ({ ...p, enter: "none" as const, off: "inventé" })),
            { stamp: "RATÉE", size: 170, x: 230, y: 560, rot: -12, z: 0.95, enter: "none", off: "inventé" },
            { tape: "RETROUVÉ", size: 70, x: 310, y: 1030, rot: -3, z: 0.95, at: "retrouvé." },
          ],
        },
      ],
      sfx: [
        { word: "inventé", src: "sfx/accents/swish-2.wav", volume: 0.4 },
        { word: "retrouvé.", src: "sfx/accents/tape.wav", volume: 0.45 },
      ],
      beat: { pose: "point-up", x: 230 },
    },
    {
      // Signature, first half: the 16th-century sheep is painted over the face before our eyes.
      id: "d3", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "au", in: "cut", carry: true, cam: { from: [0, 0, 1.06], to: [0, 0, 1.06] },
          source: "Ghent Altarpiece, the Lamb's head before restoration, with its 16th-century overpaint (Commons, KIK-IRPA)",
          layers: [
            ground,
            face,
            { ...old, at: "recouvrent", write: 0.9 },
            { tag: "XVIᵉ SIÈCLE", size: 44, x: 90, y: 280, rot: -3, z: 0.9, at: "seizième" },
          ],
        },
      ],
      sfx: [{ word: "recouvrent", src: "sfx/accents/swish-1.wav", volume: 0.4 }],
      beat: { pose: "explaining", x: 230 },
    },
    {
      // The same picture, four centuries going by: the visitors of each age stop before the sheep, the calendar riffling.
      id: "d4", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "pendant", in: "cut", carry: true, cam: { from: [0, 0, 1.06], to: [0, 0, 1.06] },
          source: "Ghent Altarpiece, the Lamb's head before restoration (Commons, KIK-IRPA); Hollar 1640, Costumes Parisiens 1831, Atget c. 1900",
          layers: [
            ground,
            face,
            old,
            visitor("visitor-1640.png", 330, 640, "pendant"),
            visitor("visitor-1831.png", 380, 610, "quatre"),
            visitor("visitor-1900.png", 330, 640, "tout"),
          ],
        },
      ],
      sfx: [{ word: "pendant", src: "sfx/accents/page-1.wav", volume: 0.4 }],
      beat: { pose: "shrug", x: 230 },
    },
    {
      // Signature, second half: the sheep peels off from its corner like a sticker, in silence; the real face looks at us.
      id: "d5", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "et", in: "cut", carry: true, shake: "1432.", cam: { from: [0, 0, 1.06], to: [0, 0, 1.12] },
          source: "Ghent Altarpiece, the Lamb's head before and during restoration (Commons, KIK-IRPA)",
          layers: [
            ground,
            face,
            { ...old, off: "dessous," },
            { ...old, at: "dessous,", curl: [2.2, 866] },
            { stamp: "1432", size: 110, x: 560, y: 830, rot: -8, z: 0.95, at: "1432." },
          ],
        },
      ],
      sfx: [
        { word: "dessous,", src: "sfx/accents/tape.wav", volume: 0.6 },
        { word: "1432.", src: "sfx/accents/thud.wav", volume: 0.6 },
      ],
      beat: { pose: "amazed", x: 230 },
    },
    {
      // The punchline in two strips: the restorers are crossed out, Van Eyck slaps on; then the loop flies back to frame 0.
      id: "d6", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "internet", in: "cut", until: "eyck.", cam: { from: [0, 0, 1.06], to: [0, 0, 1.12] },
          source: "Ghent Altarpiece, the Lamb's head during restoration (Commons, KIK-IRPA)",
          layers: [
            ground,
            face,
            { tape: "RESTAURATEURS", size: 72, x: 230, y: 880, rot: -3, z: 0.95, at: "restaurateurs.", strike: "il" },
            { tape: "VAN EYCK", size: 110, x: 300, y: 985, rot: 2, z: 0.96, enter: "slap", at: "moquait" },
          ],
        },
      ],
      sfx: [
        { word: "restaurateurs.", src: "sfx/accents/tape.wav", volume: 0.45 },
        { word: "il", src: "sfx/accents/pencil-2.wav", volume: 0.45 },
        { word: "moquait", src: "sfx/accents/thud.wav", volume: 0.6 },
      ],
      beat: { pose: "point-up", x: 230 },
    },
  ],
});
