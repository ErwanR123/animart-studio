import { createGuideEpisode, type Cue, type Voice } from "../guide/engine";
import type { ShotLayer } from "../guide/shots";
import voice from "../../public/voice/GuideMonaLisa.json";

// Leonardo da Vinci, Mona Lisa (La Joconde), c. 1503–1519, oil on poplar, 77 × 53 cm, Louvre (INV. 779).
// Format "L'Affaire": an art story told as a police file (the folder, the evidence, the suspects), the Guide below.
// Script (27 Oct. 2026): the theft of 1911. Checked against Wikipedia FR "Vol de La Joconde" and EN "Vincenzo Peruggia":
// - Monday 21 August 1911, the Louvre's weekly closing day; Peruggia in a white smock like the staff; the panel taken
//   off its pegs in the Salon Carré, its case and frame left in a service stairway; a plumber opened the service door
//   for him, taking him for an employee; noticed the next morning by a painter come to copy it (Louis Béroud);
// - the empty wall with its four iron pegs (press photograph, 1911); the Louvre reopened on 29 August, "everyone
//   entering the museum went to the salon Carre to stare at the vacant place on the wall" (Victoria Daily Times,
//   30 Aug. 1911);
// - Apollinaire jailed at the Santé on 7 September 1911 and Picasso questioned (the Iberian statuettes stolen by Géry
//   Pieret; the press tied them to the Joconde); both cleared of it; Apollinaire born 26 Aug. 1880, Picasso 25 Oct. 1881;
// - Peruggia (born 8 Oct. 1881), a glazier who had worked at the Louvre and put the painting under glass; his
//   fingerprints on file since 1909 (his Bertillon card) but never compared; questioned on 29 September 1911 in his
//   room, rue de l'Hôpital-Saint-Louis, the room never searched; the painting kept two years in a trunk;
// - December 1913: by train to Florence, offered to Alfredo Geri, authenticated by Giovanni Poggi (Uffizi), Peruggia
//   arrested at his hotel; his plea, to return it to Italy; back at the Louvre on 4 January 1914.
// The loop: the last line stops on "Tout ça parce qu'un jour…" and the hook completes it ("On a volé la Joconde").
// Images (public/art/SOURCES.md): Excelsior's reconstruction of the theft (Dec. 1913), cut panel by panel, and its
// thief cut out as a paper puppet; the press photograph of the empty wall; a plan of the Louvre (1850–1900); the 1911
// press (Iskry, Moscow; La Domenica del Corriere; Victoria Daily Times; a Madrid art review); Peruggia's Bertillon
// card; a Paris sergent de ville (1906); the Europe railway map of May 1910 and a PLM Pacific; Le Petit Parisien
// (13 Dec. 1913); the return to the Louvre (1914). The case file in manila card is drawn (scratchpad manila.py).
const FULL = { z: 1.15, fx: 0.5, fy: 0.5 };
const ART = "art/mona-lisa";
const KRAFT = "art/paper/kraft.jpg";
const DARK = "art/paper/dark.jpg";
// The empty wall photograph (wall.png, 950 × 1297) `w` wide at x, y: its four pegs measured with scripts/image-grid.py.
const PEGS: [number, number][] = [[0.395, 0.355], [0.534, 0.355], [0.3485, 0.489], [0.57, 0.489]];
const pegs = (x: number, y: number, w: number) => PEGS.map(([fx, fy]) => [x + fx * w, y + fy * w * (1297 / 950)]);
// Two years riffling by on the calendar as the last line opens on "En 1913": one page a month, then the day.
const MONTHS = ["JANV.", "FÉVR.", "MARS", "AVRIL", "MAI", "JUIN", "JUIL.", "AOÛT", "SEPT.", "OCT.", "NOV.", "DÉC."];
const riffle: [Cue, string, number][] = Array.from({ length: 26 }, (_, k) => [["d8", "en"], `${MONTHS[(9 + k) % 12]} ${1911 + Math.floor((9 + k) / 12)}`, k * 0.045]);
export const guideMonaLisa = createGuideEpisode({
  voiceFile: "voice/GuideMonaLisa.mp3",
  voice: voice as Voice,
  image: { src: `${ART}/mona-lisa.jpg`, width: 3840, height: 5723 },
  maxWidth: 1000,
  climb: true,
  climbFrom: "start",
  openView: FULL,
  openPose: "point-up",
  // Paris, 1911: a rag of the time, played by Joplin himself (piano roll, 1916).
  music: "music/maple-leaf-rag.mp3",
  tight: true,
  loop: { word: "tout" },
  header: "LÉONARD DE VINCI · LOUVRE",
  title: ["Le casse", "du siècle"],
  // Manila card, black ink, one red accent (stamps, circles, arrows, the thread of the case).
  palette: { paper: "#EDE5D3", accent: "#C8321E", hl: "#F4C531" },
  // The case's dates, torn off one by one (the voice never says most of them).
  calendar: {
    pages: [
      [["context", "lundi"], "21 AOÛT 1911"],
      [["d2", "lendemain"], "22 AOÛT 1911"],
      [["d3", "semaine"], "29 AOÛT 1911"],
      [["d4", "poète"], "7 SEPT. 1911"],
      [["d7", "police"], "29 SEPT. 1911"],
      ...riffle,
      [["d8", "en"], "10 DÉC. 1913", 1.25],
      [["d9", "elle"], "4 JANV. 1914"],
    ],
    until: ["d9", "tout"],
  },
  lead: {
    hook: {
      shots: [
        {
          // The Salon Carré wall, the painting on its pegs: the man in the smock (a paper puppet cut from Excelsior's
          // reconstruction) hops in, takes it, laughs, and hops off with it; the stamp on the four bare pegs, before
          // the cut to Picasso on "Et la police…".
          word: "on", in: "cut", cam: { from: [0, 0, 1.02], to: [0, 0, 1.06] },
          layers: [
            { bg: DARK },
            { src: `${ART}/wall.png`, x: 40, y: 20, w: 1000, z: 0.4, enter: "none" },
            { src: `${ART}/thief.png`, x: -260, y: 520, w: 240, z: 0.6, enter: "none", neck: 0.16, talk: [1.05, 1.6], route: [[0, 380, 0, 4, 0.2], [1.6, 1300, 0, 4, 0.15]] },
            { src: `${ART}/joconde-card.png`, x: 349, y: 450, w: 300, z: 0.65, enter: "none", route: [[0.85, -259, 161, 1, 0.2], [1.6, 1300, 0, 4, 0.15]] },
            { note: "hé hé !", x: 40, y: 380, w: 230, rot: -6, z: 0.9, at: "volé", after: 0.3, off: "joconde" },
            { stamp: "VOLÉE", size: 150, x: 250, y: 600, rot: -12, z: 0.95, at: "joconde" },
          ],
        },
        {
          // The famous suspect against the police height chart: the flash of the police camera, the stamp, a red "?".
          word: "et", in: "whip", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.06] },
          layers: [
            { bg: `${ART}/lineup.jpg` },
            { src: `${ART}/picasso-cut.png`, x: 290, y: 330, w: 520, z: 0.5, enter: "rise", neck: 0.25, talk: [0.3, 1.3] },
            { flash: 1, at: "picasso", after: 0.1 },
            { stamp: "SUSPECT", size: 110, x: 120, y: 900, rot: -8, z: 0.95, at: "picasso", after: 0.35 },
            { big: "?", size: 300, color: "#C8321E", x: 790, y: 300, z: 0.9, at: "picasso", after: 0.55 },
          ],
        },
      ],
      sfx: [
        { word: "on", src: "sfx/story/steps.wav", volume: 0.5 },
        { word: "volé", src: "sfx/story/laugh.wav", volume: 0.6 },
        { word: "la", src: "sfx/story/steps.wav", volume: 0.45 },
        { word: "joconde", src: "sfx/accents/thud.wav", volume: 0.5 },
        { word: "picasso", src: "sfx/accents/shutter.wav", volume: 0.6 },
      ],
    },
    context: {
      shots: [
        {
          // The case file fills the frame: its manila cover swings open on the date onto the first page (the date in
          // cut-out letters, the Louvre clipped on), and the stamp lands on that photograph.
          word: "lundi", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.04] },
          layers: [
            { bg: DARK },
            { src: `${ART}/folder-page.png`, x: 0, y: -27, w: 1080, z: 0.5, enter: "none" },
            { letters: "21 AOÛT 1911", x: 70, y: 100, w: 940, size: 110, z: 0.5, at: "août" },
            { src: `${ART}/louvre.png`, x: 140, y: 400, w: 800, rot: -2, z: 0.5, at: "1911", enter: "slap" },
            { clip: true, x: 190, y: 370, w: 70, z: 0.5, at: "1911" },
            { stamp: "FERMÉ", size: 150, x: 330, y: 660, rot: -10, z: 0.95, at: "fermeture" },
            { src: `${ART}/folder-front.png`, x: 0, y: -27, w: 1080, z: 0.5, enter: "none", open: "21" },
          ],
        },
        {
          // Excelsior's reconstruction: the man in the smock takes it off the wall; the painting in his hands circled.
          word: "un", in: "push", carry: true, cam: { from: [0, 0, 1], to: [0, -20, 1.06] },
          layers: [
            { bg: KRAFT },
            { src: `${ART}/ex-decroche.png`, x: 230, y: 110, w: 620, rot: 2, z: 0.5, at: "homme", enter: "slap" },
            { clip: true, x: 300, y: 70, w: 60, z: 0.9, at: "homme" },
            { scribble: [490, 290, 190, 190], color: "accent", width: 10, at: "décroche", draw: 0.35 },
          ],
        },
      ],
      sfx: [
        { word: "21", src: "sfx/accents/page-2.wav", volume: 0.6 },
        { word: "homme", src: "sfx/accents/page-1.wav", volume: 0.5 },
      ],
      poses: [{ word: "un", pose: "whisper" }],
    },
  },
  details: [
    {
      // The way out on a plan of the Louvre: the little thief walks the red thread from the Salon Carré to the quai,
      // the stairway and the frame pinned up beside it; then the door to the quai, opened by the plumber, and out.
      id: "d1", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "dans", in: "whip", carry: true, cam: { from: [0, 0, 1], to: [0, -30, 1.06] },
          layers: [
            { bg: KRAFT },
            { src: `${ART}/plan.png`, x: -315, y: -189, w: 1500, z: 0.4, enter: "none" },
            { tag: "SALON CARRÉ", x: 660, y: 655, size: 30, rot: -2, z: 0.9 },
            { thread: [[645, 632], [637, 562], [480, 562], [435, 643]], color: "accent", at: "escalier", draw: 2.1 },
            { src: `${ART}/thief.png`, x: 615, y: 459, w: 60, z: 0.7, at: "escalier", enter: "pop", route: [[0.1, -8, -70, 2, 0.25], [0.6, -157, 0, 4, 0.25], [1.6, -45, 81, 2, 0.25]] },
            { src: `${ART}/ex-escalier.png`, x: 30, y: 90, w: 260, rot: -4, z: 0.6, at: "escalier", enter: "slap" },
            { src: `${ART}/ex-cadre.png`, x: 320, y: 110, w: 220, rot: 3, z: 0.65, at: "abandonne", enter: "slap" },
          ],
        },
        {
          // The door to the quai (Excelsior): an old key turns in the lock on "ouvre", the door creaks, and the
          // little thief hops out of it with the painting under his arm.
          word: "plombier", in: "slide", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          layers: [
            { bg: KRAFT },
            { src: `${ART}/ex-quai.png`, x: 60, y: 70, w: 560, rot: -2, z: 0.5, enter: "slap" },
            { src: `${ART}/key.png`, x: 560, y: 330, w: 460, rot: -10, z: 0.8, at: "plombier", enter: "slap", swing: { pivot: [0.12, 0.5], keys: [[0, 0], [0.65, 0], [1.0, 90], [1.3, 90]] } },
            { src: `${ART}/thief.png`, x: 330, y: 560, w: 120, z: 0.7, at: "sort", enter: "pop", route: [[0.15, 700, 120, 6, 0.18]] },
            { src: `${ART}/joconde-card.png`, x: 370, y: 650, w: 110, rot: 4, z: 0.75, at: "sort", enter: "pop", route: [[0.15, 700, 120, 6, 0.18]] },
          ],
        },
      ],
      sfx: [
        { word: "escalier", src: "sfx/story/steps.wav", volume: 0.55 },
        { word: "abandonne", src: "sfx/accents/thud.wav", volume: 0.4 },
        { word: "ouvre", src: "sfx/story/door.wav", volume: 0.6 },
        { word: "sort", src: "sfx/story/steps.wav", volume: 0.45 },
      ],
      beat: { pose: "whisper", x: 230 },
    },
    {
      // The next morning: the empty wall, the painting's outline in chalk (a crime scene); the painter comes up,
      // puzzled; its four pegs circled.
      id: "d2", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "le", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [-30, -40, 1.12] },
          layers: [
            { bg: DARK },
            { src: `${ART}/wall.png`, x: 220, y: 180, w: 640, z: 0.5, enter: "slap" },
            { pencil: "M415 455 L617 451 L621 742 L411 748 Z", color: "#F3EFE4", width: 7, at: "lendemain", draw: 0.8 },
            // The painter come to copy it: Louis Béroud himself (his photograph), rising in, turning his head; three
            // question marks pop over it.
            { src: `${ART}/beroud.png`, x: 600, y: 700, w: 460, z: 0.85, at: "peintre", enter: "rise", neck: 0.55, talk: [0.3, 2.4] },
            { name: ["Louis Béroud", "peintre"], x: 640, y: 640, size: 34, rot: 2, z: 0.95, at: "venu" },
            { big: "?", size: 120, color: "#C8321E", x: 640, y: 470, z: 0.95, at: "trouve" },
            { big: "?", size: 90, color: "#C8321E", x: 750, y: 420, z: 0.95, at: "trouve", after: 0.15 },
            { big: "?", size: 140, color: "#C8321E", x: 840, y: 480, z: 0.95, at: "trouve", after: 0.3 },
            ...pegs(220, 180, 640).map(([x, y], i): ShotLayer => ({ scribble: [x - 34, y - 34, 68, 68], color: "accent", width: 8, at: "quatre", after: i * 0.15, draw: 0.2 })),
          ],
        },
      ],
      sfx: [
        { word: "lendemain", src: "sfx/accents/pencil-1.wav", volume: 0.5 },
        { word: "quatre", src: "sfx/accents/pencil-2.wav", volume: 0.5 },
      ],
      beat: { pose: "amazed", x: 230 },
    },
    {
      // A week closed (the Louvre again, a red postmark); then the press of four countries whirling in.
      id: "d3", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "le", in: "push", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.04] },
          layers: [
            { bg: KRAFT },
            { src: `${ART}/louvre.png`, x: 140, y: 200, w: 800, rot: 2, z: 0.5, enter: "slap" },
            { postmark: "FERMÉ", sub: "MUSÉE DU LOUVRE", color: "accent", x: 330, y: 330, w: 420, rot: -8, z: 0.9, at: "ferme" },
          ],
        },
        {
          word: "son", in: "whip", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          layers: [
            { bg: DARK },
            { src: `${ART}/press-iskry.png`, x: 40, y: 130, w: 400, rot: -6, z: 0.5, at: "visage", enter: "spin" },
            { tag: "RUSSIE", x: 60, y: 100, size: 42, rot: -4, z: 0.9, at: "visage", after: 0.4 },
            { src: `${ART}/press-domenica.png`, x: 450, y: 170, w: 400, rot: 5, z: 0.55, at: "fait", enter: "spin" },
            { tag: "ITALIE", x: 520, y: 140, size: 42, rot: 3, z: 0.9, at: "fait", after: 0.4 },
            { src: `${ART}/press-canada.png`, x: 50, y: 690, w: 620, rot: -3, z: 0.6, at: "journaux", enter: "spin" },
            { tag: "CANADA", x: 70, y: 660, size: 42, rot: -2, z: 0.9, at: "journaux", after: 0.4 },
            { src: `${ART}/press-spain.png`, x: 780, y: 480, w: 240, rot: 4, z: 0.65, at: "monde", enter: "spin" },
            { tag: "ESPAGNE", x: 770, y: 450, size: 42, rot: 3, z: 0.9, at: "monde", after: 0.3 },
          ],
        },
      ],
      sfx: [
        { word: "ferme", src: "sfx/accents/thud.wav", volume: 0.4 },
        { word: "visage", src: "sfx/accents/swish-1.wav", volume: 0.5 },
        { word: "fait", src: "sfx/accents/swish-2.wav", volume: 0.45 },
        { word: "journaux", src: "sfx/accents/swish-3.wav", volume: 0.5 },
        { word: "monde", src: "sfx/accents/swish-4.wav", volume: 0.45 },
      ],
      beat: { pose: "explaining", x: 230 },
    },
    {
      // The board of suspects: the poet and the painter, a red arrow from each to the painting; the poet stamped on
      // "prison"; both crossed out (a false lead).
      id: "d4", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "le", in: "slide", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.04] },
          layers: [
            { bg: KRAFT },
            { tape: "SUSPECTS", x: 300, y: 70, size: 64, rot: -3, z: 0.92 },
            { src: `${ART}/joconde-card.png`, x: 420, y: 160, w: 240, rot: 2, z: 0.4, enter: "none" },
            { src: `${ART}/apollinaire.png`, x: 40, y: 470, w: 380, rot: -4, z: 0.5, at: "poète", enter: "slap" },
            { arrow: [300, 520, 440, 360], bend: 0.15, color: "accent", width: 7, at: "apollinaire", draw: 0.3 },
            { name: ["Guillaume Apollinaire", "31 ans"], x: 60, y: 1010, size: 34, rot: -2, z: 0.95, at: "apollinaire" },
            { stamp: "ÉCROUÉ", size: 80, x: 70, y: 820, rot: -12, z: 0.95, at: "prison" },
            { src: `${ART}/picasso.png`, x: 660, y: 500, w: 380, rot: 3, z: 0.55, at: "picasso", enter: "slap" },
            { arrow: [780, 540, 640, 360], bend: -0.15, color: "accent", width: 7, at: "picasso", after: 0.2, draw: 0.3 },
            { cross: [60, 490, 350, 480], color: "accent", width: 10, at: "interrogé", after: 0.3, draw: 0.25 },
            { cross: [680, 520, 350, 480], color: "accent", width: 10, at: "interrogé", after: 0.5, draw: 0.25 },
          ],
        },
      ],
      sfx: [
        { word: "poète", src: "sfx/accents/thud.wav", volume: 0.4 },
        { word: "picasso", src: "sfx/accents/thud.wav", volume: 0.4 },
        { word: "interrogé", src: "sfx/accents/pencil-3.wav", volume: 0.5 },
      ],
      beat: { pose: "skeptical", x: 230 },
    },
    {
      // The empty wall again, and the crowd rising in front of it, pushing in to look at nothing, and starting at it.
      id: "d5", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "et", in: "push", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          layers: [
            { bg: DARK },
            { src: `${ART}/wall.png`, x: 190, y: 70, w: 700, z: 0.4, enter: "none" },
            { src: `${ART}/crowd-l.png`, x: -60, y: 640, w: 430, z: 0.9, at: "foule", enter: "rise", route: [[0.5, 80, 0, 3, 0.22], [2.0, 0, -45, 1, 0.12], [2.12, 0, 45, 1, 0.12]] },
            { src: `${ART}/crowd-r.png`, x: 620, y: 660, w: 500, z: 0.9, at: "foule", after: 0.15, enter: "rise", route: [[0.35, -80, 0, 3, 0.22], [1.85, 0, -45, 1, 0.12], [1.97, 0, 45, 1, 0.12]] },
            { note: "Oh !", x: 60, y: 520, w: 170, rot: -8, z: 0.95, at: "vide" },
            { note: "Rien !?", x: 420, y: 600, w: 210, rot: 4, z: 0.95, at: "vide", after: 0.15 },
            { note: "Mon Dieu…", x: 760, y: 540, w: 250, rot: -3, z: 0.95, at: "vide", after: 0.3 },
          ],
        },
      ],
      sfx: [{ word: "presse", src: "sfx/story/steps.wav", volume: 0.4 }],
      beat: { pose: "shrug", x: 230 },
    },
    {
      // The thief's card, the faces under black bars until his name; then a magnifying glass slides over his prints:
      // they were on file all along.
      id: "d6", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "le", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.04] },
          layers: [
            { bg: KRAFT },
            { src: `${ART}/bertillon.png`, x: 110, y: 120, w: 860, rot: -2, z: 0.5, enter: "slap" },
            { redact: [362, 398, 115, 55], enter: "none", off: "vincenzo" },
            { redact: [620, 392, 160, 55], enter: "none", off: "vincenzo" },
            { name: ["Vincenzo Peruggia", "29 ans"], x: 210, y: 70, size: 40, rot: -2, z: 0.95, at: "peruggia", off: "c'est" },
            { loupe: [248, 858, 150], zoom: 2.3, to: [600, 858], glide: 1.2, at: "c'est" },
            { tag: "SES EMPREINTES ÉTAIENT DÉJÀ AUX ARCHIVES", x: 110, y: 60, size: 34, rot: -2, z: 0.95, at: "joconde" },
          ],
        },
      ],
      sfx: [
        { word: "vincenzo", src: "sfx/accents/swish-2.wav", volume: 0.5 },
        { word: "joconde", src: "sfx/accents/thud.wav", volume: 0.4 },
      ],
      beat: { pose: "point-up", x: 230 },
    },
    {
      // Two years in a trunk: the painting stands by it; the lid opens, the painting hops in, the lid shuts; a
      // policeman walks up, stops, looks at his feet, walks on; the lid opens and the painting peeks out again.
      id: "d7", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "pendant", in: "tear", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.04] },
          layers: [
            { bg: KRAFT },
            { src: `${ART}/joconde-card.png`, x: 40, y: 380, w: 260, rot: -3, z: 0.4, enter: "pop", route: [[1.85, 480, -120, 1, 0.25], [2.15, 0, 420, 1, 0.25], [4.85, 0, -330, 1, 0.25]] },
            { src: `${ART}/trunk-body.png`, x: 300, y: 520, w: 700, z: 0.6, at: "malle", enter: "slap" },
            { src: `${ART}/trunk-lid.png`, x: 300, y: 520, w: 700, z: 0.6, at: "malle", enter: "slap", swing: { pivot: [0.7, 0.03], keys: [[0.0, 0], [0.25, 0], [0.5, 32], [1.0, 32], [1.25, 0], [3.1, 0], [3.35, 32]] } },
            { name: ["Paris, 10e", "rue de l'Hôpital-Saint-Louis"], x: 150, y: 90, size: 36, rot: -2, z: 0.95, at: "chambre" },
            { src: `${ART}/policeman.png`, x: -320, y: 360, w: 260, z: 0.8, at: "police", enter: "none", route: [[0, 700, 0, 4, 0.2], [1.2, 900, 0, 5, 0.2]] },
          ],
        },
      ],
      sfx: [
        { word: "malle", src: "sfx/accents/thud.wav", volume: 0.45 },
        { word: "chambre", src: "sfx/accents/thud.wav", volume: 0.35 },
        { word: "police", src: "sfx/story/steps.wav", volume: 0.55 },
      ],
      beat: { pose: "shh", x: 230 },
    },
    {
      // By train to Florence on the 1910 railway map; then the arrest: the painting found at the Uffizi, the
      // handcuffs, Le Petit Parisien whirling in.
      id: "d8", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "en", in: "whip", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          layers: [
            { bg: DARK },
            { src: `${ART}/map.png`, x: 40, y: 140, w: 1000, z: 0.4, enter: "slap" },
            { src: `${ART}/train.png`, x: 140, y: 204, w: 160, z: 0.8, at: "en", enter: "pop", route: [[0.5, 150, 217, 1, 0.4], [0.9, 70, 182, 1, 0.4], [1.3, 70, 69, 1, 0.4], [1.7, 60, 44, 1, 0.4], [2.1, 320, 78, 1, 0.4], [2.5, -10, 86, 1, 0.35]] },
            { pencil: "M220 244 L370 461 L440 643 L510 712 L570 756 L890 834 L880 920", width: 8, at: "1913", draw: 2.4 },
            { tag: "PARIS", x: 150, y: 270, size: 36, rot: -3, z: 0.9 },
            { tag: "FLORENCE", x: 700, y: 940, size: 40, rot: 2, z: 0.9, at: "florence" },
          ],
        },
        {
          word: "arrêté", in: "slide", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.04] },
          layers: [
            { bg: DARK },
            { src: `${ART}/florence.png`, x: 60, y: 150, w: 960, rot: -2, z: 0.5, enter: "slap" },
            { name: ["Musée des Offices", "Florence"], x: 150, y: 80, size: 38, rot: -2, z: 0.95 },
            { src: `${ART}/handcuffs.png`, x: 300, y: 430, w: 460, rot: -8, z: 0.85, enter: "slap", after: 0.1 },
            { src: `${ART}/press-parisien.png`, x: 200, y: 560, w: 760, rot: 4, z: 0.7, at: "jure", enter: "spin" },
          ],
        },
      ],
      sfx: [
                { word: "arrêté", src: "sfx/story/gate.wav", volume: 0.6 },
        { word: "jure", src: "sfx/accents/swish-4.wav", volume: 0.5 },
      ],
      beat: { pose: "counting", x: 230 },
    },
    {
      // Back at the Louvre in 1914; then today's crowd, phones up, the flashes going off on "star".
      id: "d9", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "elle", in: "slide", until: "tout", cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          layers: [
            { bg: DARK },
            { src: `${ART}/return.png`, x: 90, y: 120, w: 900, rot: -2, z: 0.5, enter: "slap" },
            { name: ["Retour au Louvre", "4 janvier 1914"], x: 210, y: 70, size: 38, rot: -2, z: 0.95, at: "louvre" },
            { src: `${ART}/today.png`, x: 390, y: 420, w: 620, rot: 4, z: 0.7, at: "c'est", enter: "slap" },
            { flash: 3, at: "star" },
          ],
        },
      ],
      sfx: [
        { word: "c'est", src: "sfx/accents/thud.wav", volume: 0.45 },
        { word: "star", src: "sfx/accents/shutter.wav", volume: 0.6 },
      ],
      beat: { pose: "celebrating", x: 230 },
    },
  ],
});
