import { createGuideEpisode, type Voice } from "../guide/engine";
import { pencilLoop } from "../guide/shots";
import voice from "../../public/voice/GuideMondrian.json";

// Piet Mondrian, New York City I, 1941, oil and painted paper tape on canvas, 120 × 115 cm, unfinished and unsigned,
// Kunstsammlung Nordrhein-Westfalen (K20), Düsseldorf. Facts checked against Wikipedia EN "New York City (painting)",
// Smithsonian Magazine, CBS News and The Local (Oct. 2022): curator Susanne Meyer-Büser found that it has hung upside
// down since it was first shown in New York after Mondrian's death (1945 or 1946, the sources differ: hence "80 ans");
// the evidence is a photograph in his studio published in Town & Country (June 1944) showing it the other way up on
// the easel, and the finished New York City (1942, Centre Pompidou) whose lines thicken at the top "like a dark sky".
// The museum keeps it as it is: the tapes are "hanging by a thread" and turned over, gravity would pull them off.
// Images (public/art/SOURCES.md): the painting from Commons (978 px, the only scan; doubled with Lanczos, it is all
// straight lines), its flipped copy with the four top tapes cut out as pieces and the canvas filled from a clean band
// (the tapes that fall), the Pompidou painting, Mondrian in 1922, the K20, a model of his 1943 New York studio (1987),
// his signature. Music: Meade Lux Lewis, Doll House Boogie (New York, 1944): he loved boogie-woogie.
// Mode: a story in Vox collage shots (bible/format.md), back on the painting between them.
const FULL = { z: 0.809, fx: 0.5, fy: 0.5 };
// Frame 0 and the loop's last frame: the painting covering the whole screen.
const OPEN = { z: 1, fx: 0.5, fy: 0.5 };
// When a word is spoken (first word of the segment starting with it), for the pieces' own clocks (swing, fall).
const at = (segment: string, word: string) => {
  const w = (voice as Voice).words.find((x) => x.segment === segment && x.text.toLowerCase().startsWith(word));
  if (!w) throw new Error(`no "${word}" in ${segment}`);
  return w.start;
};
// The painting laid in a shot at 1000 px wide (1904 × 1996 px image): 1048 px high.
const P = { x: 40, y: 300, w: 1000 };
const PH = 1048;
// One of the four tapes cut from the top of the flipped painting, laid exactly where it was (`top`: fraction of its height).
const tape = (name: string, top: number) => ({
  src: `art/mondrian/tape-${name}.png`, x: P.x, y: P.y + top * PH, w: P.w, z: 0.5, enter: "none" as const,
});
// The tapes' clock starts when they land (on "Ses"); they let go on "Retournés".
const FALL = at("d4", "retournés") - at("d4", "ses");
const TURN = at("d4", "retourner") - at("d4", "alors");
const EASEL = at("d2", "l'autre") - at("d2", "chevalet");
export const guideMondrian = createGuideEpisode({
  voiceFile: "voice/GuideMondrian.mp3",
  voice: voice as Voice,
  image: { src: "art/mondrian/nyc1.jpg", width: 1904, height: 1996 },
  maxWidth: 1000,
  climb: true,
  climbFrom: "start",
  openView: FULL,
  openPose: "point-up",
  music: "music/doll-house-boogie.mp3",
  palette: { paper: "#EDE5D3", accent: "#C8321E", hl: "#F4C531" },
  tight: true,
  // Cold open: the painting full screen as it hangs, "à l'envers depuis 80 ans" small at the bottom; on "l'envers" it
  // turns over the right way up, and back on "ans": the whole video in one move.
  cold: [
    { view: OPEN, tapes: ["À L'ENVERS DEPUIS 80 ANS"], y: 1700, size: 54 },
    { word: "l'envers", view: OPEN, spin: 180 },
    { word: "ans", view: OPEN },
  ],
  // From "C'est pour ça que…", back to frame 0 full screen, the Guide gone: "…ce Mondrian est accroché à l'envers".
  loop: { word: "c'est", view: OPEN, full: true },
  header: "PIET MONDRIAN · 1941",
  title: ["New York", "City I."],
  lead: {
    context: {
      // The museum, and its answer.
      shots: [
        {
          word: "musée", in: "cut", source: "K20, Düsseldorf (Commons)", cam: { from: [0, 0, 1], to: [0, -20, 1.05] },
          layers: [
            { bg: "art/paper/kraft.jpg", dim: 0.1 },
            { src: "art/mondrian/k20.png", x: 90, y: 380, w: 900, rot: -2, z: 0.4, enter: "none" },
            { tape: "K20 · Düsseldorf", x: 130, y: 300, size: 54, rot: -3, z: 0.9 },
            { stamp: "TEL QUEL", size: 130, x: 470, y: 900, rot: -9, z: 0.95, at: "laisser" },
          ],
        },
      ],
      poses: [{ word: "laisser", pose: "shrug" }],
    },
  },
  details: [
    {
      // The man in one line: his red, yellow and blue squares; dead in 1944, the work never signed (so no one knew
      // which way up it went).
      id: "d0", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "mondrian", in: "tear", source: "Piet Mondrian, 1922 (Commons); Composition II in Red, Blue and Yellow, 1930 (Commons); his signature", cam: { from: [0, 0, 1], to: [0, -15, 1.05] },
          layers: [
            { bg: "art/paper/kraft.jpg", dim: 0.1 },
            { disc: "#C8321E", x: 560, y: 150, w: 440, z: 0.25, enter: "none" },
            { src: "art/mondrian/portrait.png", x: 540, y: 220, w: 440, rot: 2, z: 0.6, enter: "up" },
            { tape: "Piet Mondrian", x: 580, y: 680, size: 50, rot: 3, z: 0.9 },
            { src: "art/mondrian/composition.png", x: 50, y: 170, w: 430, rot: -4, z: 0.7, at: "carrés" },
            { big: "1944", size: 190, x: 60, y: 600, z: 0.85, at: "1944" },
            { src: "art/mondrian/signature.png", x: 120, y: 900, w: 620, rot: -3, z: 0.7, at: "sans", enter: "pop" },
            { pencil: "M110 890 L760 1060 M130 1060 L740 880", width: 9, draw: 0.3, z: 0.8, at: "signé" },
          ],
        },
      ],
      poses: [{ word: "mondrian", pose: "explaining" }],
      // The crossed-out signature needs a moment to be read.
      hold: 0.5,
      beat: { pose: "point-up", x: 230 },
    },
    {
      // Shown in New York after his death, as it hangs today: the dense lines at the bottom.
      id: "d1", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "après", in: "slide", cam: { from: [0, 0, 1], to: [0, 10, 1.04] },
          layers: [
            { bg: "#E6E1D5" },
            { src: "art/mondrian/nyc1.jpg", x: 180, y: 250, w: 720, z: 0.5, enter: "none" },
            { tape: "New York", x: 120, y: 160, size: 60, rot: -3, z: 0.9, at: "york" },
            { pencil: pencilLoop(540, 940, 400, 80, 3), draw: 0.4, z: 0.8, at: "dans" },
            { pencil: "M985 700 C1010 790 990 860 950 905 M950 905 L940 870 M950 905 L985 890", draw: 0.3, z: 0.8, at: "sens" },
          ],
        },
      ],
      beat: { pose: "explaining", x: 230 },
    },
    {
      // 2022: the photo in his studio; on the easel, the other way up.
      id: "d2", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "en", in: "push", source: "Model of Mondrian's New York studio (1943), 1987 (Commons)", cam: { from: [0, 0, 1], to: [0, -20, 1.06] },
          layers: [
            { bg: "art/paper/kraft.jpg", dim: 0.15 },
            { big: "2022", size: 200, x: 80, y: 120, z: 0.85 },
            { tape: "Susanne Meyer-Büser", x: 90, y: 340, size: 46, rot: -2, z: 0.95, at: "conservatrice" },
            { src: "art/mondrian/studio.png", x: 30, y: 430, w: 1020, rot: -2, z: 0.4, at: "photo" },
            { tape: "Son atelier · New York", x: 300, y: 1090, size: 44, rot: 2, z: 0.95, at: "atelier" },
            {
              src: "art/mondrian/nyc1.jpg", x: 640, y: 560, w: 330, rot: 3, z: 0.7, at: "chevalet",
              swing: { pivot: [0.5, 0.5], keys: [[EASEL, 0], [EASEL + 0.5, 180]] },
            },
            { pencil: pencilLoop(805, 735, 210, 215, 7), draw: 0.35, z: 0.8, at: "sens" },
          ],
        },
      ],
      poses: [{ word: "photo", pose: "loupe" }],
      beat: { pose: "amazed", x: 230 },
    },
    {
      // The finished version in Paris: the lines thicken at the top, a dark sky over the city.
      id: "d3", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "et", in: "tear", source: "Piet Mondrian, New York City, 1942, Centre Pompidou (Commons)", cam: { from: [0, 0, 1], to: [0, -20, 1.05] },
          layers: [
            { bg: "art/paper/kraft.jpg", dim: 0.1 },
            { src: "art/mondrian/pompidou.png", x: 110, y: 260, w: 860, rot: -1, z: 0.5, enter: "none" },
            { tape: "Paris · 1942", x: 140, y: 190, size: 54, rot: -3, z: 0.9, at: "paris" },
            { pencil: pencilLoop(540, 400, 420, 120, 2), draw: 0.4, z: 0.8, at: "haut" },
            { tape: "le ciel", x: 690, y: 560, size: 50, rot: 4, z: 0.95, at: "ciel" },
          ],
        },
      ],
      poses: [{ word: "haut", pose: "point-up" }],
      beat: { pose: "explaining", x: 230 },
    },
    {
      // The signature moment: turned the right way up, the old tapes let go one by one; one hangs by a thread.
      id: "d4", fx: 0.5, fy: 0.5,
      view: OPEN,
      shots: [
        {
          word: "alors", in: "cut", cam: { from: [0, 0, 1], to: [0, 0, 1] },
          layers: [
            { bg: "#2A2823" },
            {
              src: "art/mondrian/nyc1.jpg", ...P, z: 0.5, enter: "none",
              swing: { pivot: [0.5, 0.5], keys: [[TURN - 0.1, 0], [TURN + 0.45, 180]] },
            },
          ],
        },
        {
          // The same picture turned over (nyc1-up-bare.jpg + its tapes is nyc1.jpg at 180°): the cut does not show.
          word: "ses", in: "cut", until: "c'est", cam: { from: [0, 0, 1], to: [0, 0, 1] },
          layers: [
            { bg: "#2A2823" },
            { src: "art/mondrian/nyc1-up-bare.jpg", ...P, z: 0.5, enter: "none" },
            { ...tape("yellow2", 0.0521), fall: [FALL + 0.3, 1150, -24, -70] },
            { ...tape("blue", 0.0822), swing: { pivot: [0.02, 0.5], keys: [[FALL, 0], [FALL + 0.45, 74], [FALL + 0.7, 63], [FALL + 0.95, 68]] } },
            { ...tape("yellow", 0.1072), fall: [FALL + 0.6, 1100, 18, 50] },
            { ...tape("red", 0.1393), fall: [FALL, 1100, 12, 40] },
          ],
        },
      ],
      poses: [
        { word: "retourner", pose: "skeptical" },
        { word: "tomberaient", pose: "scared" },
      ],
      beat: { pose: "explaining", x: 230 },
    },
  ],
});
