import { createGuideEpisode, type Cue, type Voice } from "../guide/engine";
import voice from "../../public/voice/GuideRonin.json";

// The 47 rōnin (Akō incident, 1701–1703), told through the prints the story became: the kabuki play *Kanadehon
// Chūshingura* (1748) and Kuniyoshi's portraits of the loyal retainers, *Seichū gishi shōzō* (1852, The Met).
// The account is about artworks (bible/format.md): every beat shows a real print of that moment.
// Facts (3 Nov. 2026; Wikipedia EN "Forty-seven rōnin", OUP blog "Tokyo's samurai", Japan Foundation "Legendary
// Loyalty"):
// - 21 April 1701, Edo castle: Asano Naganori, lord of Akō, draws his sword on Kira Yoshinaka, who had humiliated him;
//   drawing a sword in the shogun's palace is forbidden: he is ordered to die the same day; his samurai become rōnin;
// - on a snowy night (14th day of the 12th month of Genroku 15, 30 Jan. 1703) they storm Kira's mansion in Edo and
//   behead him, about 21 months later ("presque deux ans");
// - they lay the head on Asano's grave at Sengaku-ji, give themselves up and are sentenced to die (20 March 1703);
// - their graves at Sengaku-ji (Tokyo) still receive incense; they became the model of samurai loyalty.
// The voice never says seppuku or suicide (words the platforms throttle): "condamné à mort" is exact.
// Prints (public/art/SOURCES.md): Kuniyoshi's portraits (The Met), Hiroshige's Chūshingura acts III, IV and XI
// (LACMA, Commons), the Rijksmuseum's act III, Kuniyoshi's night attack (Rijksmuseum) and its battle (British Museum),
// Yoshitoshi's Ōishi with his drum (LACMA), the incense at the tomb (British Museum),
// the graves today (Commons). Music: *Shika no tōne*, shakuhachi duet (recording c. 1925–37).
const ART = "art/ronin";
const CRUMPLED = "art/paper/crumpled.jpg";
const NIGHT = "#1E2633";
const RED = "#B8261B";
const CREAM = "#EDE5D3";
// Frame 0 and the loop's last frame: Kuniyoshi's Yada Gorōzaemon raising his sword in the snow, full screen.
const OPEN = { z: 1, fx: 0.5, fy: 0.5 };
const FULL = { z: 1.138, fx: 0.5, fy: 0.5 };
// Kuniyoshi's rōnin, a 3 × 3 wall of portraits landing one by one (each 260 wide, 370 high), below the app's top bar.
const PORTRAITS = ["r486", "r487", "r489", "r491", "r492", "r493", "r494", "r495", "r496"];
const wall = PORTRAITS.map((p, k) => ({
  src: `${ART}/${p}.png`,
  x: 90 + (k % 3) * 320,
  y: 240 + Math.floor(k / 3) * 385,
  w: 260,
  rot: [-3, 2, -1, 3, -2, 1, -3, 2, -1][k],
  z: 0.5,
  at: "ils",
  after: 0.15 + k * 0.22,
  enter: "slap" as const,
}));
// The months from Asano's death to the night attack riffle by on "presque deux ans plus tard".
const MONTHS = ["JANV.", "FÉVR.", "MARS", "AVRIL", "MAI", "JUIN", "JUIL.", "AOÛT", "SEPT.", "OCT.", "NOV.", "DÉC."];
const riffle: [Cue, string, number][] = Array.from({ length: 21 }, (_, k) => [["d4", "presque"], `${MONTHS[(4 + k) % 12]} ${1701 + Math.floor((4 + k) / 12)}`, 0.1 + k * 0.05]);

export const guideRonin = createGuideEpisode({
  voiceFile: "voice/GuideRonin.mp3",
  voice: voice as Voice,
  image: { src: `${ART}/yada.jpg`, width: 2645, height: 3901 },
  maxWidth: 1000,
  climb: true,
  climbFrom: "start",
  openView: FULL,
  openPose: "point-up",
  music: "music/shika-no-tone.mp3",
  tight: true,
  palette: { paper: CREAM, accent: RED, hl: "#F4C531" },
  // Frame 0: the rōnin full screen, the promise on tape; on "deux" a hard cut onto his face and his hands on the hilt.
  cold: [
    { view: OPEN, tapes: ["2 ANS POUR UNE TÊTE"], y: 1700, size: 54 },
    { word: "deux", view: { z: 1.9, fx: 0.45, fy: 0.45 } },
  ],
  loop: { word: "l'encens", view: OPEN, full: true },
  header: "LES 47 RŌNIN · 1703",
  title: ["Les 47", "rōnin"],
  calendar: {
    pages: [[["d4", "presque"], "AVRIL 1701"], ...riffle, [["d4", "nuit"], "30 JANV. 1703"]],
    until: ["d4", "attaquent"],
  },
  lead: {
    hook: {
      sfx: [{ word: "deux", src: "sfx/story/sword.wav", volume: 0.5 }],
    },
    context: {
      shots: [
        {
          // Edo castle at dusk (Hiroshige, act III), then the scene itself slapped over it on "sabre": the lord held
          // back in the palace (act III, Rijksmuseum).
          word: "japon", in: "cut", carry: true, cam: { from: [0, 0, 1], to: [0, -20, 1.06] },
          source: "Hiroshige, Chūshingura acte III; Kanadehon Chūshingura acte III (Rijksmuseum RP-P-1902-A-22864)",
          layers: [
            { field: NIGHT, dots: "tl", paper: CRUMPLED },
            { src: `${ART}/castle.png`, x: 40, y: 380, w: 1000, rot: -1.5, z: 0.3, enter: "slap" },
            { letters: "JAPON 1701", size: 100, x: 80, y: 240, w: 900, z: 0.9, at: "japon" },
            { name: ["Le seigneur Asano", "21 avril 1701"], size: 36, x: 90, y: 1060, rot: -3, z: 0.95, at: "seigneur" },
            { src: `${ART}/palace.png`, x: 70, y: 660, w: 900, rot: 2, z: 0.6, at: "sabre", enter: "slap" },
          ],
        },
      ],
      sfx: [{ word: "sabre", src: "sfx/story/sword.wav", volume: 0.45 }],
      poses: [{ word: "japon", pose: "explaining" }],
    },
  },
  details: [
    {
      // The shogun's envoys bring the sentence (Hiroshige, act IV): forbidden, condemned the same day.
      id: "d1", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "c'est", in: "slide", carry: true, cam: { from: [0, 0, 1.02], to: [0, 0, 1.07] },
          source: "Hiroshige, Chūshingura acte IV (LACMA M.66.35.49)",
          layers: [
            { field: CREAM, dots: "br", paper: CRUMPLED },
            { src: `${ART}/sentence.png`, x: 30, y: 300, w: 1020, rot: -1, z: 0.4, enter: "slap" },
            { stamp: "INTERDIT", size: 90, x: 520, y: 250, rot: 6, z: 0.95, at: "interdit" },
            { stamp: "CONDAMNÉ À MORT", size: 72, x: 120, y: 1040, rot: -5, z: 0.95, at: "condamné" },
          ],
        },
      ],
      sfx: [
        { word: "interdit", src: "sfx/accents/thud.wav", volume: 0.45 },
        { word: "condamné", src: "sfx/accents/thud.wav", volume: 0.45 },
      ],
      beat: { pose: "scared", x: 230 },
    },
    {
      // Signature 1: the rōnin, a wall of Kuniyoshi's portraits landing one by one, then the oath stamped over them.
      id: "d2", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "ils", in: "whip", carry: true, cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          source: "Kuniyoshi, Seichū gishi shōzō, 1852 (The Met)",
          layers: [
            { field: NIGHT, dots: "tr", paper: CRUMPLED },
            ...wall,
            { tag: "KUNIYOSHI · 1852", size: 34, x: 400, y: 1330, rot: -2, z: 0.95, at: "sans" },
            { stamp: "VENGEANCE", size: 130, x: 150, y: 640, rot: -8, z: 0.97, at: "jurent" },
          ],
        },
      ],
      sfx: [{ word: "jurent", src: "sfx/accents/thud.wav", volume: 0.5 }],
      beat: { pose: "explaining", x: 230 },
    },
    {
      // The climax in two prints: Kuniyoshi's night attack under the moon (the ladders on the wall), Yoshitoshi's Ōishi
      // beating his drum in the snow slapped over it on "attaquent"; then the battle and the head.
      id: "d4", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "presque", in: "whip", cam: { from: [0, 0, 1], to: [-120, 0, 1.08] },
          source: "Kuniyoshi, Chūshingura juichidanme youchi no zu (Rijksmuseum RP-P-1960-5); Yoshitoshi, Ōishi Kuranosuke (LACMA M.84.31.335)",
          layers: [
            { field: NIGHT, dots: "none", paper: CRUMPLED },
            { src: `${ART}/night.jpg`, x: -380, y: 180, w: 1900, z: 0.4, enter: "none" },
            { src: `${ART}/drum.png`, x: 420, y: 700, w: 640, rot: 3, z: 0.6, at: "attaquent", enter: "slap" },
          ],
        },
        {
          word: "coupent", in: "cut", carry: true, shake: "tête", cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          source: "Kuniyoshi, Chūshingura youchi no zu (British Museum 2008,3037.18805)",
          layers: [
            { field: "#151413", dots: "none", paper: CRUMPLED },
            { src: `${ART}/battle.png`, x: 190, y: 80, w: 700, rot: -1, z: 0.4, enter: "slap" },
            { stamp: "VENGÉ", size: 170, x: 260, y: 560, rot: -10, z: 0.97, at: "tête" },
          ],
        },
      ],
      sfx: [
        { word: "presque", src: "sfx/accents/swish-2.wav", volume: 0.45 },
        { word: "coupent", src: "sfx/story/sword.wav", volume: 0.55 },
        { word: "tête", src: "sfx/accents/thud.wav", volume: 0.5 },
      ],
      beat: { pose: "amazed", x: 230 },
    },
    {
      // The march to the temple (Hiroshige, act XI), the incense laid at the tomb (British Museum), the sentence.
      id: "d5", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "ils", in: "slide", carry: true, cam: { from: [0, 0, 1], to: [0, -20, 1.06] },
          source: "Hiroshige, Chūshingura acte XI (LACMA M.66.35.59); Chūshingura shijushichi-nin gishi shōkō no zu (British Museum 2008,3037.18810)",
          layers: [
            { field: CREAM, dots: "tr", paper: CRUMPLED },
            { src: `${ART}/march.png`, x: 20, y: 100, w: 1040, rot: 1.5, z: 0.4, enter: "slap" },
            { src: `${ART}/incense.png`, x: 540, y: 480, w: 480, rot: -3, z: 0.6, at: "tombe", enter: "drop" },
            { name: ["Sengaku-ji", "Edo, 1703"], size: 40, x: 90, y: 860, rot: -3, z: 0.95, at: "tombe", after: 0.3 },
            { stamp: "CONDAMNÉS À MORT", size: 64, x: 70, y: 990, rot: -5, z: 0.97, at: "condamnés" },
          ],
        },
      ],
      sfx: [{ word: "condamnés", src: "sfx/accents/thud.wav", volume: 0.45 }],
      beat: { pose: "scared", x: 230 },
    },
    {
      // What Japan made of them: two of Kuniyoshi's rōnin; then their graves today, the incense smoking; the loop
      // flies back to frame 0 on "l'encens".
      id: "d6", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "le", in: "slide", cam: { from: [0, 0, 1], to: [0, 0, 1.05] },
          source: "Kuniyoshi, Seichū gishi shōzō, 1852 (The Met)",
          layers: [
            { field: RED, dots: "tl", paper: CRUMPLED },
            { src: `${ART}/r495.png`, x: 70, y: 200, w: 450, rot: -3, z: 0.5, enter: "slap" },
            { src: `${ART}/r494.png`, x: 560, y: 260, w: 450, rot: 3, z: 0.55, at: "fidèle", enter: "slap" },
          ],
        },
        {
          word: "aujourd'hui", in: "cut", until: "l'encens", cam: { from: [0, 0, 1], to: [0, -20, 1.06] },
          source: "Tombes des 47 rōnin, Sengaku-ji, Tokyo (Wikimedia Commons)",
          layers: [
            { field: NIGHT, dots: "br", paper: CRUMPLED },
            { src: `${ART}/graves.png`, x: 20, y: 280, w: 1040, rot: -1, z: 0.4, enter: "slap" },
            { name: ["Sengaku-ji", "Tokyo, aujourd'hui"], size: 40, x: 90, y: 150, rot: -3, z: 0.95, at: "aujourd'hui", after: 0.3 },
          ],
        },
      ],
      beat: { pose: "explaining", x: 230 },
    },
  ],
});
