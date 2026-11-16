import { createGuideEpisode, type Voice } from "../guide/engine";
import voice from "../../public/voice/GuideMeegeren.json";

// Han van Meegeren, The Supper at Emmaus (De Emmaüsgangers), 1937, a forged Vermeer, Museum Boijmans Van Beuningen,
// Rotterdam. Format "L'Affaire" (GuideMonaLisa): the case file, the evidence, the trial; the Guide below.
// Script (27 Oct. 2026), checked against Wikipedia EN and FR "Han van Meegeren":
// - arrested 29 May 1945 after a "Vermeer" (Christ with the Adulteress) turned up in Göring's collection; Göring had
//   traded 137 looted paintings for it (EN; FR says 200: the episode follows EN); charged with aiding the enemy
//   (selling a national treasure), a crime punishable by death; his confession: "The painting in Göring's hands is
//   not a Vermeer of Delft, but a Van Meegeren! I painted the picture!";
// - his Vermeers fooled Abraham Bredius ("the masterpiece of Johannes Vermeer of Delft", Burlington Magazine, 1937);
//   the Rembrandt Society bought the Emmaus for fl. 520,000 for the Boijmans, Rotterdam;
// - his method: genuine 17th-century canvases, phenol formaldehyde (Bakelite) to harden the paint, baked at about
//   100–120 °C, cracks rolled in and filled with India ink;
// - critics from 1928 called his work derivative ("a sort of composite facsimile"); he set out to prove himself;
// - Jesus among the Doctors, painted in 1945 under guard before court-appointed witnesses (six, FR);
// - tried in Amsterdam from 29 Oct. 1947, collaboration charges dropped, sentenced on 12 Nov. 1947 to one year for
//   forgery and fraud; an Oct. 1947 poll ranked him the second most popular man in the Netherlands, behind the Prime
//   Minister; heart attack on 26 Nov., died 30 Dec. 1947, aged 58.
// No free image exists of Göring's forgery: it is shown as an unknown canvas in a gilt frame.
// The loop: the last line stops on "Tout ça parce qu'en 1945…" and the hook completes it.
// Images (public/art/SOURCES.md): Nationaal Archief / Anefo press photographs (1945, 1947), the Rijksmuseum print
// of him painting before witnesses, the forgeries, Vermeer's Milkmaid, Göring (Röhr portrait; Nuremberg cell, 1945).
const FULL = { z: 0.701, fx: 0.5, fy: 0.5 };
const ART = "art/meegeren";
const KRAFT = "art/paper/kraft.jpg";
const DARK = "art/paper/dark.jpg";
const RED = "#C8321E";
export const guideMeegeren = createGuideEpisode({
  voiceFile: "voice/GuideMeegeren.mp3",
  voice: voice as Voice,
  image: { src: `${ART}/emmaus.jpg`, width: 1920, height: 1745 },
  maxWidth: 1000,
  climb: true,
  climbFrom: "start",
  openView: FULL,
  openPose: "point-up",
  // A sly investigation theme: the forger who fooled Göring.
  music: "music/investigations.mp3",
  tight: true,
  loop: { word: "tout" },
  header: "HAN VAN MEEGEREN · 1945",
  title: ["Le faux", "Vermeer"],
  palette: { paper: "#EDE5D3", accent: RED, hl: "#F4C531" },
  calendar: {
    pages: [
      [["context", "mai"], "29 MAI 1945"],
      [["d7", "verdict"], "12 NOV. 1947"],
      [["d8", "il"], "30 DÉC. 1947"],
    ],
    until: ["d8", "tout"],
  },
  lead: {
    hook: {
      shots: [
        {
          // The suspect against the police height chart, talking; the death penalty stamped, the gavel down.
          word: "cet", in: "cut", cam: { from: [0, 0, 1], to: [0, -20, 1.06] },
          layers: [
            { bg: `${ART}/lineup.jpg` },
            { src: `${ART}/hvm.png`, x: 230, y: 330, w: 620, z: 0.5, enter: "none", neck: 0.42, talk: [0.2, 2.2] },
            { stamp: "PEINE DE MORT", size: 100, x: 130, y: 930, rot: -8, z: 0.95, at: "mort" },
            { src: `${ART}/gavel.png`, x: 620, y: 160, w: 400, rot: 20, z: 0.9, at: "peine", enter: "none", swing: { pivot: [0.85, 0.85], keys: [[0, -40], [0.25, -40], [0.4, 8], [0.5, 0]] } },
          ],
        },
        {
          // His way out: the photograph of him painting a "Vermeer" before witnesses; the word taped on him.
          word: "sa", in: "whip", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.06] },
          layers: [
            { bg: KRAFT },
            { src: `${ART}/painting-1945.png`, x: 30, y: 230, w: 1020, rot: -2, z: 0.5, enter: "slap" },
            { tape: "FAUSSAIRE", x: 520, y: 880, size: 80, rot: -4, z: 0.95, at: "faussaire" },
          ],
        },
      ],
      sfx: [
        { word: "mort", src: "sfx/accents/thud.wav", volume: 0.6 },
        { word: "faussaire", src: "sfx/accents/tape.wav", volume: 0.5 },
      ],
    },
    context: {
      shots: [
        {
          // The case file fills the frame and opens on the date: Göring pinned on its first page, the "Vermeer"
          // found in his collection in its gilt frame, an unknown canvas.
          word: "mai", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.04] },
          layers: [
            { bg: DARK },
            { src: `${ART}/folder-page.png`, x: 0, y: -27, w: 1080, z: 0.5, enter: "none" },
            { letters: "MAI 1945", x: 70, y: 90, w: 600, size: 100, z: 0.5, at: "dans" },
            { src: `${ART}/goring.png`, x: 60, y: 330, w: 420, rot: -3, z: 0.5, at: "collection", enter: "slap" },
            { clip: true, x: 120, y: 300, w: 70, z: 0.5, at: "collection" },
            { name: ["Hermann Göring", "n° 2 du régime nazi"], x: 60, y: 990, size: 34, rot: -2, z: 0.95, at: "göring" },
            { src: `${ART}/unknown.png`, x: 560, y: 380, w: 420, rot: 3, z: 0.55, at: "vermeer", enter: "slap", gilt: true },
            { tag: "« VERMEER »", x: 560, y: 960, size: 44, rot: 3, z: 0.95, at: "vermeer" },
            { src: `${ART}/folder-front.png`, x: 0, y: -27, w: 1080, z: 0.5, enter: "none", open: "dans" },
          ],
        },
        {
          // The price: his "Vermeer" one side, the wall of 137 real paintings it cost, counted up.
          word: "l'avait", in: "push", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.04] },
          layers: [
            { bg: DARK },
            { src: `${ART}/frames.png`, x: 80, y: 160, w: 920, z: 0.5, enter: "pop" },
            { counter: [0, 137], size: 260, color: "accent", dur: 0.9, x: 290, y: 860, z: 0.95, at: "137" },
          ],
        },
      ],
      sfx: [
        { word: "dans", src: "sfx/accents/page-2.wav", volume: 0.6 },
        { word: "collection", src: "sfx/accents/thud.wav", volume: 0.4 },
        { word: "vermeer", src: "sfx/accents/thud.wav", volume: 0.4 },
        { word: "137", src: "sfx/story/coins.wav", volume: 0.45 },
      ],
      poses: [{ word: "mai", pose: "explaining" }],
    },
  },
  details: [
    {
      // The seller: Van Meegeren pinned up, a red arrow from him to Göring; "TRAHISON" stamped across.
      id: "d1", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "le", in: "slide", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          layers: [
            { bg: KRAFT },
            { src: `${ART}/hvm.png`, x: 40, y: 250, w: 480, rot: -3, z: 0.5, at: "un", enter: "slap", neck: 0.42, talk: [0.3, 2] },
            { name: ["Han van Meegeren", "peintre, 55 ans"], x: 40, y: 140, size: 40, rot: -2, z: 0.95, at: "han" },
            { src: `${ART}/goring.png`, x: 640, y: 300, w: 380, rot: 4, z: 0.5, at: "nazis", enter: "slap" },
            { arrow: [470, 520, 650, 520], bend: -0.25, color: "accent", width: 10, at: "vendre", draw: 0.4 },
            { stamp: "TRAHISON", size: 130, x: 170, y: 880, rot: -9, z: 0.95, at: "trahison" },
          ],
        },
      ],
      sfx: [
        { word: "un", src: "sfx/accents/thud.wav", volume: 0.4 },
        { word: "nazis", src: "sfx/accents/thud.wav", volume: 0.4 },
        { word: "trahison", src: "sfx/accents/thud.wav", volume: 0.6 },
      ],
      beat: { pose: "skeptical", x: 230 },
    },
    {
      // The confession: the "Vermeer" stamped FAUX; he rises beside it and signs it in red.
      id: "d2", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "alors", in: "push", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.06] },
          layers: [
            { bg: DARK },
            { src: `${ART}/unknown.png`, x: 140, y: 150, w: 520, rot: -2, z: 0.5, enter: "slap", gilt: true },
            { stamp: "FAUX", size: 180, x: 210, y: 380, rot: -14, z: 0.95, at: "vermeer" },
            { src: `${ART}/hvm.png`, x: 560, y: 470, w: 520, z: 0.8, at: "moi", enter: "rise", neck: 0.42, talk: [0.1, 1.2] },
            { pencil: "M200 900 C240 860 260 960 300 900 S380 860 400 920 S470 880 520 905", width: 7, at: "peint", draw: 0.5 },
          ],
        },
      ],
      sfx: [
        { word: "vermeer", src: "sfx/accents/thud.wav", volume: 0.55 },
        { word: "peint", src: "sfx/accents/pencil-3.wav", volume: 0.5 },
      ],
      beat: { pose: "amazed", x: 230 },
    },
    {
      // Nobody believes him: the Emmaus, which fooled the great Bredius; then its price, counted in florins.
      id: "d3", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "personne", in: "slide", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          layers: [
            { bg: KRAFT },
            { src: `${ART}/emmaus-card.png`, x: 150, y: 120, w: 800, rot: 2, z: 0.5, enter: "slap" },
            { src: `${ART}/bredius.png`, x: 40, y: 620, w: 380, rot: -4, z: 0.7, at: "experts", enter: "slap" },
            { name: ["Abraham Bredius", "le grand expert de Vermeer"], x: 40, y: 1040, size: 34, rot: -2, z: 0.95, at: "experts" },
            { tape: "« LE CHEF-D'ŒUVRE DE VERMEER »", x: 450, y: 900, size: 40, rot: -3, z: 0.95, at: "experts", after: 0.3 },
          ],
        },
        {
          word: "un", in: "whip", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          layers: [
            { bg: DARK },
            { src: `${ART}/emmaus-card.png`, x: 140, y: 120, w: 800, rot: -2, z: 0.5, enter: "none" },
            { tag: "MUSÉE BOIJMANS · ROTTERDAM · 1937", x: 160, y: 80, size: 34, rot: -2, z: 0.95, at: "rotterdam" },
            { counter: [0, 520000], size: 150, color: "accent", dur: 1.0, suffix: " ƒ", x: 150, y: 900, z: 0.95, at: "acheté" },
          ],
        },
      ],
      sfx: [
                { word: "experts", src: "sfx/accents/thud.wav", volume: 0.4 },
        { word: "acheté", src: "sfx/story/coins.wav", volume: 0.5 },
      ],
      beat: { pose: "explaining", x: 230 },
    },
    {
      // The recipe, step by step: his bottles and powders; the oven's heat climbing; the paint cracking.
      id: "d4", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "son", in: "tear", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          layers: [
            { bg: KRAFT },
            { tape: "LA RECETTE", x: 360, y: 60, size: 64, rot: -3, z: 0.95 },
            { src: `${ART}/hands.png`, x: 40, y: 180, w: 620, rot: -3, z: 0.5, enter: "slap" },
            { tag: "1 · TOILE DE 1650", x: 60, y: 150, size: 38, rot: -3, z: 0.95, at: "toiles" },
            { src: `${ART}/pigments.png`, x: 380, y: 700, w: 660, rot: 3, z: 0.6, at: "résine", enter: "slap" },
            { tag: "2 · BAKÉLITE", x: 560, y: 660, size: 38, rot: 2, z: 0.95, at: "résine" },
          ],
        },
        {
          word: "et", in: "push", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.08] },
          layers: [
            { bg: "#1A0E08" },
            { src: `${ART}/emmaus-card.png`, x: 140, y: 120, w: 800, rot: 0, z: 0.5, enter: "none" },
            { haze: [540, 1300], color: "#C24A1C", at: "four", draw: 1.2 },
            { tag: "3 · AU FOUR", x: 160, y: 80, size: 38, rot: -2, z: 0.95, at: "four" },
            { counter: [20, 110], size: 160, color: "#F4C531", dur: 0.9, suffix: " °C", x: 300, y: 900, z: 0.95, at: "four" },
            { pencil: "M200 200 L260 330 L240 420 L320 560 L300 700 M260 330 L380 300 L470 380 M320 560 L460 600 L560 560 L640 640 M560 560 L620 420 L760 380 L840 300 M640 640 L700 760 L860 800", color: "#1C1B19", width: 4, at: "craqueler", draw: 0.6 },
          ],
        },
      ],
      sfx: [
                { word: "résine", src: "sfx/accents/thud.wav", volume: 0.4 },
        { word: "four", src: "sfx/story/sizzle.wav", volume: 0.5 },
        { word: "craqueler", src: "sfx/accents/pencil-4.wav", volume: 0.6 },
      ],
      beat: { pose: "counting", x: 230 },
    },
    {
      // Why: the young painter of 1928 and what the critics said; then Vermeer and him side by side.
      id: "d5", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "pourquoi", in: "slide", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          layers: [
            { bg: KRAFT },
            { src: `${ART}/hvm-1928.png`, x: 60, y: 200, w: 960, rot: -2, z: 0.5, enter: "slap" },
            { tag: "LA HAYE · 1928", x: 80, y: 160, size: 38, rot: -3, z: 0.95 },
            { tape: "« UNE SORTE DE FAC-SIMILÉ »", x: 200, y: 900, size: 52, rot: -3, z: 0.95, at: "méprisaient" },
          ],
        },
        {
          word: "il", in: "whip", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          layers: [
            { bg: DARK },
            { src: `${ART}/milkmaid.png`, x: 30, y: 280, w: 420, rot: -3, z: 0.5, enter: "slap" },
            { tag: "VERMEER", x: 90, y: 790, size: 44, rot: -3, z: 0.95 },
            { src: `${ART}/emmaus-card.png`, x: 540, y: 300, w: 440, rot: 3, z: 0.5, at: "prouver", enter: "slap" },
            { tag: "VAN MEEGEREN", x: 580, y: 760, size: 44, rot: 3, z: 0.95, at: "prouver" },
            { big: "=", size: 220, color: RED, x: 455, y: 420, z: 0.95, at: "valait" },
          ],
        },
      ],
      sfx: [
        { word: "méprisaient", src: "sfx/accents/tape.wav", volume: 0.5 },
        { word: "prouver", src: "sfx/accents/thud.wav", volume: 0.4 },
        { word: "valait", src: "sfx/accents/thud.wav", volume: 0.5 },
      ],
      beat: { pose: "thinking", x: 230 },
    },
    {
      // Proving his crime: him painting under guard (Rijksmuseum print), the press flashes going off; the finished
      // "Vermeer" slapped on.
      id: "d6", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "pour", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.06] },
          layers: [
            { bg: KRAFT },
            { src: `${ART}/witnesses.png`, x: 20, y: 140, w: 1040, rot: -1, z: 0.5, enter: "slap" },
            { src: `${ART}/doctors.png`, x: 380, y: 700, w: 640, rot: 4, z: 0.7, at: "dernier", enter: "slap" },
            { tag: "JÉSUS PARMI LES DOCTEURS · 1945", x: 400, y: 650, size: 32, rot: 3, z: 0.95, at: "dernier" },
            { flash: 3, at: "surveillance" },
            { tag: "6 TÉMOINS", x: 60, y: 1000, size: 54, rot: -3, z: 0.95, at: "surveillance" },
          ],
        },
      ],
      sfx: [
        { word: "dernier", src: "sfx/accents/thud.wav", volume: 0.4 },
        { word: "surveillance", src: "sfx/accents/shutter.wav", volume: 0.6 },
      ],
      beat: { pose: "point-up", x: 230 },
    },
    {
      // The trial: the courtroom, "TRAÎTRE" crossed out, "FAUSSAIRE" stamped, a year and the gavel; then the poll
      // that made him the second most popular man in the country, and Göring in his cell.
      id: "d7", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "verdict", in: "tear", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          layers: [
            { bg: DARK },
            { src: `${ART}/court.png`, x: 20, y: 120, w: 1040, rot: -1, z: 0.5, enter: "slap" },
            { tag: "TRIBUNAL D'AMSTERDAM", x: 60, y: 80, size: 38, rot: -2, z: 0.95 },
            { tape: "TRAÎTRE", x: 100, y: 870, size: 80, rot: -4, z: 0.95, at: "plus", strike: "juste" },
            { stamp: "FAUSSAIRE", size: 110, x: 480, y: 860, rot: -8, z: 0.95, at: "faussaire" },
            { big: "1 AN", size: 200, color: RED, x: 520, y: 460, z: 0.95, at: "an" },
            { src: `${ART}/gavel.png`, x: 80, y: 420, w: 380, rot: 20, z: 0.9, at: "an", enter: "none", swing: { pivot: [0.85, 0.85], keys: [[0, -40], [0.15, -40], [0.3, 8], [0.4, 0]] } },
          ],
        },
        {
          word: "et", in: "whip", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          layers: [
            { bg: KRAFT },
            { tape: "SONDAGE · OCT. 1947", x: 80, y: 90, size: 56, rot: -3, z: 0.95 },
            { tag: "1 · LE PREMIER MINISTRE", x: 80, y: 230, size: 44, rot: -2, z: 0.9 },
            { tag: "2 · HAN VAN MEEGEREN", x: 80, y: 330, size: 52, rot: 2, z: 0.95, at: "néerlandais" },
            { src: `${ART}/goring-cell.png`, x: 140, y: 520, w: 800, rot: -2, z: 0.6, at: "c'est", enter: "slap" },
            { stamp: "ROULÉ", size: 150, x: 330, y: 780, rot: -10, z: 0.95, at: "roulé" },
          ],
        },
      ],
      sfx: [
        { word: "juste", src: "sfx/accents/pencil-2.wav", volume: 0.5 },
        { word: "an", src: "sfx/story/gate.wav", volume: 0.55 },
        { word: "roulé", src: "sfx/accents/thud.wav", volume: 0.5 },
      ],
      beat: { pose: "celebrating", x: 230 },
    },
    {
      // The end: his photograph, the dates; he fades out before the prison door.
      id: "d8", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "il", in: "slide", until: "tout", cam: { from: [0, 0, 1], to: [0, 0, 1.06] },
          layers: [
            { bg: DARK },
            { src: `${ART}/painting-1945.png`, x: 30, y: 200, w: 1020, rot: -1, z: 0.5, enter: "slap" },
            { name: ["Han van Meegeren", "1889 – 1947"], x: 100, y: 120, size: 42, rot: -2, z: 0.95, at: "meurt" },
            { cross: [60, 200, 960, 760], color: "accent", width: 12, at: "cardiaque", draw: 0.4 },
          ],
        },
      ],
      beat: { pose: "shh", x: 230 },
    },
  ],
});
