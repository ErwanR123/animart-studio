import { createGuideEpisode, type Cue, type Voice } from "../guide/engine";
import { ItalieMalte } from "../guide/maps/italie-malte";
import voice from "../../public/voice/GuideCaravaggio.json";

// Caravaggio, David with the Head of Goliath, c. 1609–10, oil on canvas, 125 × 101 cm, Galleria Borghese, Rome.
// Format "Le Guide", built for the first 2 s (IDEAS.md): frame 0 = Goliath's head with the promise written on it.
// Facts (28 Oct. 2026; Wikipedia EN "David with the Head of Goliath (Caravaggio, Rome)" and "Exile of Caravaggio",
// Galleria Borghese collection page, italia.it):
// - 28 May 1606, Rome: Caravaggio kills Ranuccio Tomassoni in a sword fight; sentenced to death in absentia, a
//   *bando capitale*: anyone in the Papal States could kill him, a bounty on his head;
// - four years on the run: Naples, Malta, Sicily (Syracuse, Messina, Palermo), Naples again;
// - Goliath's head is a self-portrait (the scholarly consensus); David looks at it with sadness, not triumph;
// - the painting belonged to Cardinal Scipione Borghese, Pope Paul V's nephew, the man who could obtain the papal
//   pardon; that it was painted as a plea for that pardon is Calvesi's reading (1985), followed by most accounts:
//   told here as the story, the facts it rests on are certain;
// - July 1610: he sails north to Rome to receive the pardon and dies on the way, at Porto Ercole (18 July).
// The story is acted by paper puppets cut from Jacques Callot's prints (Florence and Nancy, 1620s): his Duel with
// Swords for the duel, a cloaked gentleman of La Noblesse as Caravaggio on the run (a stand-in, his face is Leoni's
// portrait), the gentleman with the large cane for the bounty hunters.
// Images (public/art/SOURCES.md): the painting (Commons, 5922 px); Ottavio Leoni's portrait of Caravaggio
// (Biblioteca Marucelliana); Caravaggio's portrait of Paul V; Bernini's bust of Scipione Borghese; Tempesta's view
// of Rome (1593, De Rossi 1645); Callot; a flat map from Natural Earth's coastline; a ship from Ortelius's map of
// Italy (1570); a thumbs-down hand (the Pope's sentence, the arena's way). The wanted poster is drawn, its reward of
// 1000 écus invented (no sum is known; the user's call). Music: Frescobaldi, Toccata 3 (organist of St Peter's from
// 1608), harpsichord.
const ART = "art/caravaggio";
const CRUMPLED = "art/paper/crumpled.jpg";
const RED = "#B8261B";
const OCHRE = "#D8B26E";
const FULL = { z: 0.955, fx: 0.5, fy: 0.5 };
// The flat map from Tuscany down to Malta (scripts/map-osm.py italie-malte --coast), 760 wide at x 160, y 80 (above
// the Guide's band) on a dark sea; its places in shot px.
const MAP = { map: ItalieMalte, x: 160, y: 80, w: 760, z: 0.4, enter: "none" as const };
const SEA = { field: "#2B3533", dots: "tl" as const, paper: CRUMPLED };
const at = (name: string): [number, number] => {
  const [x, y] = ItalieMalte.points[name];
  return [Math.round(MAP.x + (x * MAP.w) / 1000), Math.round(MAP.y + (y * MAP.w) / 1000)];
};
const ROME = at("Rome");
const NAPLES = at("Naples");
const MALTA = at("Malte");
const SYRACUSE = at("Syracuse");
const MESSINA = at("Messine");
const PALERMO = at("Palerme");
// The little Caravaggio on the map (fugitive.png, 478 × 938, drawn 80 wide): placed by his feet, and a hop from one
// place to the next [s after landing, dx, dy, steps, step s].
const SMALL = { w: 80, h: 157 };
const standAt = ([x, y]: [number, number]) => ({ x: x - SMALL.w / 2, y: y - SMALL.h + 6 });
const hop = (at: number, [x0, y0]: [number, number], [x1, y1]: [number, number], steps = 3): [number, number, number, number, number] => [at, x1 - x0, y1 - y0, steps, 0.13];
// Four years riffling by on the calendar while he runs: one page a month.
const MONTHS = ["JANV.", "FÉVR.", "MARS", "AVRIL", "MAI", "JUIN", "JUIL.", "AOÛT", "SEPT.", "OCT.", "NOV.", "DÉC."];
const riffle: [Cue, string, number][] = Array.from({ length: 49 }, (_, k) => [["d2", "il"], `${MONTHS[(5 + k) % 12]} ${1606 + Math.floor((5 + k) / 12)}`, 0.2 + k * 0.04]);

export const guideCaravaggio = createGuideEpisode({
  voiceFile: "voice/GuideCaravaggio.mp3",
  voice: voice as Voice,
  image: { src: `${ART}/david.jpg`, width: 3555, height: 4400 },
  maxWidth: 1000,
  climb: true,
  climbFrom: "start",
  openView: FULL,
  openPose: "scared",
  music: "music/frescobaldi-toccata.mp3",
  tight: true,
  header: "LE CARAVAGE · 1610",
  title: ["Condamné", "à mort"],
  // Dark varnish, bone paper, one blood red.
  palette: { paper: "#EDE5D3", accent: RED, hl: "#F4C531" },
  calendar: {
    pages: [
      [["context", "rome"], "28 MAI 1606"],
      ...riffle,
      [["d6", "meurt"], "18 JUIL. 1610"],
    ],
    until: ["d6", "sans"],
  },
  lead: {
    hook: {
      shots: [
        {
          // Frame 0 is a Vox cover: a blood-red field, the severed head hanging from David's fist and still swaying,
          // the sentence in cut-out letters. On "peint" his own face slaps in below, a red arrow to the head, and the
          // stamp on "coupée".
          word: "ce", in: "cut", cam: { from: [0, 0, 1.0], to: [0, 10, 1.08] },
          layers: [
            { field: RED, dots: "br", paper: CRUMPLED },
            { src: `${ART}/head-hand.png`, x: 440, y: 300, w: 560, rot: 3, z: 0.5, enter: "none", swing: { pivot: [0.42, 0.03], keys: [[0, 0], [0.5, 2.5], [1.1, -2], [1.7, 1.5], [2.3, -1], [2.9, 0.5], [3.5, 0]] } },
            { letters: "CONDAMNÉ À MORT", size: 104, x: 50, y: 220, w: 640, z: 0.95, at: "ce", after: -2, chips: [["cream", "ink"], ["ink", "cream"], ["yellow", "ink"]] },
            { src: `${ART}/leoni.png`, x: 40, y: 620, w: 380, rot: -6, z: 0.7, at: "peint", enter: "slap" },
            { name: ["Le Caravage"], size: 44, x: 60, y: 1050, rot: -3, z: 0.95, at: "peint", after: 0.2 },
            { arrow: [380, 760, 600, 980], bend: -0.3, color: "#EDE5D3", width: 10, at: "tête", draw: 0.3 },
            { stamp: "AUTOPORTRAIT", size: 84, x: 380, y: 1030, rot: -8, z: 0.95, at: "coupée" },
          ],
        },
      ],
      sfx: [{ word: "tête", src: "sfx/accents/pencil-2.wav", volume: 0.45 }],
      poses: [{ word: "peint", pose: "amazed" }],
    },
    context: {
      shots: [
        {
          // One scene: Rome in 1606 behind, Caravaggio (Callot's duellist) rises from behind the torn paper, his
          // rival rises on "tue"; they lunge on "duel", the rival falls on "l'épée", the stamp lands on him. The
          // sentence falls in the same scene: the Pope's hand turns its thumb down over him, and he weeps.
          word: "rome", in: "whip", carry: true, cam: { from: [0, 0, 1], to: [0, -20, 1.06] },
          shake: ["l'épée", "mort"],
          layers: [
            { field: OCHRE, dots: "tl", paper: CRUMPLED },
            { src: `${ART}/rome.png`, x: 160, y: 380, w: 800, rot: -2, z: 0.3, enter: "slap" },
            { letters: "ROME 1606", size: 110, x: 80, y: 190, w: 520, z: 0.9, at: "rome" },
            { src: `${ART}/duel-l.png`, x: 40, y: 560, w: 440, z: 0.6, at: "caravage", enter: "rise", neck: 0.22, talk: [0.2, 1.2], route: [[2.95, 50, 0, 2, 0.12]] },
            { name: ["Le Caravage", "peintre, 34 ans"], size: 40, x: 60, y: 480, rot: -3, z: 0.95, at: "caravage", after: 0.3, off: "tue" },
            { src: `${ART}/duel-r.png`, x: 470, y: 650, w: 530, z: 0.62, at: "tue", enter: "rise", route: [[0.75, -40, 0, 2, 0.12]], fall: [1.15, 160, 75, 60] },
            { name: ["Ranuccio Tomassoni"], size: 40, x: 470, y: 560, rot: 3, z: 0.95, at: "homme", off: "condamné" },
            { fore: "bottom", color: "#EDE5D3" },
            { stamp: "MORT", size: 150, x: 540, y: 600, rot: -10, z: 0.97, at: "duel", after: 0.3 },
            { src: `${ART}/thumb.png`, x: 620, y: 170, w: 260, z: 0.95, at: "condamné", enter: "pop", swing: { pivot: [0.5, 0.5], keys: [[0, -90], [0.2, -90], [0.36, 8], [0.44, 0]] } },
            { tears: [[422, 655]], at: "condamné" },
          ],
        },
      ],
      sfx: [
        { word: "rome", src: "sfx/accents/swish-2.wav", volume: 0.45 },
        { word: "duel", src: "sfx/story/sword.wav", volume: 0.5 },
        { word: "condamné", src: "sfx/story/sob.wav", volume: 0.45 },
      ],
      poses: [
        { word: "rome", pose: "explaining" },
        { word: "tue", pose: "scared" },
      ],
    },
  },
  details: [
    {
      // The wanted poster.
      id: "d1", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          // A Western wanted poster slapped on the wall (wanted.png: Rye woodtype, Leoni's face in sepia); the Pope's
          // police rise on each side, sheriff's stars on their chests; two shots punch through the poster.
          word: "sa", in: "cut", carry: true, cam: { from: [0, 0, 1.02], to: [0, 0, 1.07] },
          shake: ["droit", "tuer"],
          layers: [
            { bg: "art/paper/cardboard.jpg" },
            { src: `${ART}/wanted.png`, x: 240, y: 160, w: 600, rot: -1.5, z: 0.4, enter: "slap" },
            { src: `${ART}/hunter-l.png`, x: -70, y: 520, w: 380, z: 0.8, at: "n'importe", enter: "rise" },
            { badge: "POLICE", w: 140, x: 70, y: 720, rot: -8, z: 0.85, at: "n'importe", after: 0.3 },
            { src: `${ART}/hunter-r.png`, x: 770, y: 520, w: 380, z: 0.8, at: "qui", enter: "rise" },
            { badge: "POLICE", w: 140, x: 850, y: 720, rot: 8, z: 0.85, at: "qui", after: 0.3 },
            { hole: true, x: 760, y: 250, w: 110, z: 0.5, at: "droit" },
            { hole: true, x: 600, y: 760, w: 110, z: 0.5, at: "tuer" },
          ],
        },
      ],
      sfx: [
        { word: "droit", src: "sfx/story/gunshot-1.wav", volume: 0.55 },
        { word: "tuer", src: "sfx/story/gunshot-2.wav", volume: 0.55 },
      ],
      beat: { pose: "scared", x: 230 },
    },
    {
      // Four years on the run on the map: the little Caravaggio hops along the red thread, from Rome to Naples, down
      // to Malta, back up through Sicily, the calendar riffling.
      id: "d2", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "il", in: "whip", carry: true, cam: { from: [0, 0, 1], to: [20, 40, 1.05] },
          layers: [
            SEA,
            MAP,
            { tag: "ROME", x: ROME[0] - 150, y: ROME[1] - 20, size: 34, rot: -3, z: 0.9 },
            { thread: [ROME, NAPLES], color: "accent", at: "fuit", draw: 0.5 },
            { tag: "NAPLES", x: NAPLES[0] + 25, y: NAPLES[1] - 20, size: 34, rot: 2, z: 0.9, at: "naples" },
            { thread: [NAPLES, MALTA], color: "accent", at: "malte", draw: 0.35 },
            { tag: "MALTE", x: MALTA[0] - 170, y: MALTA[1] - 20, size: 34, rot: -2, z: 0.95, at: "malte", after: 0.2 },
            { thread: [MALTA, SYRACUSE, MESSINA, PALERMO], color: "accent", at: "sicile", draw: 0.5 },
            { tag: "SICILE", x: PALERMO[0] - 190, y: PALERMO[1] - 50, size: 34, rot: 3, z: 0.95, at: "sicile" },
            {
              src: `${ART}/fugitive.png`, ...standAt(ROME), w: SMALL.w, z: 0.9, at: "il", enter: "pop",
              route: [hop(0.16, ROME, NAPLES), hop(2.22, NAPLES, MALTA, 4), hop(2.88, MALTA, SYRACUSE, 2), hop(3.18, SYRACUSE, MESSINA, 2), hop(3.48, MESSINA, PALERMO, 2)],
            },
          ],
        },
      ],
      sfx: [{ word: "fuit", src: "sfx/accents/pencil-2.wav", volume: 0.4 }],
      beat: { pose: "walking", x: 230 },
    },
    {
      // Why the Pope matters, in one scene that builds: his sentence on him, struck out on "annuler" (only he can);
      // then his nephew rises (Bernini's bust), Caravaggio walks in with this very painting, and on "plaide" a red
      // arrow goes from the nephew to the Pope.
      id: "d3", fx: 0.5, fy: 0.5,
      view: FULL,
      shots: [
        {
          word: "seul", in: "slide", cam: { from: [0, 0, 1], to: [0, 0, 1.04] },
          layers: [
            { field: "#E9DFCB", dots: "tr", paper: CRUMPLED },
            { src: `${ART}/paulv.png`, x: 640, y: 330, w: 340, rot: 3, z: 0.5, enter: "slap", neck: 0.2, talk: [0.4, 1.4] },
            { stamp: "CONDAMNÉ À MORT", size: 50, x: 590, y: 540, rot: -8, z: 0.95, at: "pape" },
            { cross: [590, 520, 440, 110], color: "accent", width: 12, at: "annuler", draw: 0.3 },
            { tape: "GRÂCE ?", size: 60, x: 660, y: 930, rot: -3, z: 0.95, at: "condamnation" },
            { src: `${ART}/scipione.png`, x: 150, y: 400, w: 440, rot: -2, z: 0.5, at: "alors", enter: "rise", neck: 0.55, talk: [2.8, 3.4] },
            { name: ["Scipione Borghese", "cardinal, neveu du pape"], size: 40, x: 60, y: 300, rot: -2, z: 0.95, at: "neveu" },
            { src: `${ART}/fugitive.png`, x: -260, y: 620, w: 210, z: 0.7, at: "peint", enter: "none", walk: [280, 0, 4, 0.16] },
            { src: `${ART}/david-card.png`, x: -140, y: 760, w: 140, rot: -6, z: 0.75, at: "peint", enter: "none", walk: [280, 0, 4, 0.16] },
            { arrow: [520, 560, 660, 560], bend: -0.4, color: "accent", width: 9, at: "plaide", draw: 0.3 },
            { fore: "bottom", color: "#EDE5D3" },
          ],
        },
      ],
      sfx: [
        { word: "annuler", src: "sfx/accents/pencil-3.wav", volume: 0.5 },
        { word: "neveu", src: "sfx/accents/page-1.wav", volume: 0.45 },
      ],
      beat: { pose: "explaining", x: 230 },
    },
    {
      // Goliath's head, close; his own face beside it at the same size; then back to the arm holding it out to us.
      id: "d4", fx: 0.82, fy: 0.74,
      view: { z: 1.6, fx: 0.74, fy: 0.62 },
      glow: [{ word: "tend", fx: 0.8, fy: 0.48, w: 0.12, h: 0.09 }],
      shots: [
        {
          word: "c'est", in: "cut", until: "nous", cam: { from: [0, 0, 1], to: [0, 0, 1.04] },
          layers: [
            { field: RED, disc: [540, 600, 420, "#20251F"], paper: CRUMPLED },
            { src: `${ART}/leoni.png`, x: 30, y: 300, w: 500, rot: -2, z: 0.5, enter: "slap" },
            { src: `${ART}/goliath.png`, x: 550, y: 250, w: 500, rot: 2, z: 0.5, after: 0.15, enter: "slap" },
            { tag: "LE CARAVAGE", x: 60, y: 230, size: 34, rot: -3, z: 0.9 },
            { tag: "GOLIATH", x: 600, y: 180, size: 34, rot: 2, z: 0.9 },
            { big: "=", size: 220, color: "#EDE5D3", x: 470, y: 520, z: 0.95, at: "propre" },
          ],
        },
      ],
      sfx: [{ word: "tend", src: "sfx/accents/pencil-1.wav", volume: 0.5 }],
      beat: { pose: "point-up", x: 230 },
    },
    {
      // David: not a victor; his face, the eyes lowered on the head.
      id: "d5", fx: 0.47, fy: 0.29,
      view: { z: 2.6, fx: 0.48, fy: 0.3 },
      glow: [{ word: "david", fx: 0.47, fy: 0.29, w: 0.2, h: 0.17 }],
      beat: { pose: "point-up", x: 230 },
      poses: [{ word: "pitié", pose: "explaining" }],
    },
    {
      // The road back, on a paper shore: a ship sails in under a low red sun, the little Caravaggio steps down onto
      // the sand and falls (Porto Ercole, 18 July 1610); then the answer on the whole painting, the spotlight closing
      // on his head.
      id: "d6", fx: 0.82, fy: 0.74,
      view: FULL,
      shots: [
        {
          word: "en", in: "whip", cam: { from: [0, 0, 1], to: [0, 10, 1.06] },
          layers: [
            { field: "#E9DFCB", disc: [760, 520, 170, RED], paper: CRUMPLED },
            { src: `${ART}/sea.png`, x: -60, y: 640, w: 1200, z: 0.4, enter: "none" },
            { src: `${ART}/ship.png`, x: 1100, y: 420, w: 260, z: 0.5, at: "en", enter: "none", walk: [-560, 0, 6, 0.22] },
            { src: `${ART}/sand.png`, x: -60, y: 900, w: 1200, z: 0.5, enter: "none" },
            { src: `${ART}/fugitive.png`, x: 1180, y: 470, w: 110, z: 0.55, at: "en", enter: "none", route: [[0, -560, 0, 6, 0.22], [2.16, -220, 330, 3, 0.15]], fall: [3.34, 30, 85, -20] },
            { name: ["Porto Ercole", "18 juillet 1610"], size: 44, x: 80, y: 230, rot: -3, z: 0.95, at: "meurt" },
          ],
        },
      ],
      beat: { pose: "explaining", x: 230 },
      poses: [{ word: "meurt", pose: "scared" }],
    },
    {
      // The painting made it to Rome: the whole canvas, the spotlight on his head; then "il nous rappelle que…" cuts
      // to the hook's first frame exactly (camera easing back to it, the head at rest) so the video loops into "Ce
      // peintre était condamné à mort".
      id: "d7", fx: 0.82, fy: 0.74,
      view: FULL,
      spots: [{ word: "son", fx: 0.82, fy: 0.74, rx: 0.17, ry: 0.15, name: "Le Caravage", dx: -0.2, dy: -0.18 }],
      shots: [
        {
          word: "rappelle", in: "cut", carry: true, cam: { from: [0, 6, 1.04], to: [0, 0, 1.0] },
          layers: [
            { field: RED, dots: "br", paper: CRUMPLED },
            { src: `${ART}/head-hand.png`, x: 440, y: 300, w: 560, rot: 3, z: 0.5, enter: "none" },
            { letters: "CONDAMNÉ À MORT", size: 104, x: 50, y: 220, w: 640, z: 0.95, at: "rappelle", after: -2, chips: [["cream", "ink"], ["ink", "cream"], ["yellow", "ink"]] },
          ],
        },
      ],
      beat: { pose: "explaining", x: 230 },
      poses: [{ word: "rappelle", pose: "scared" }],
    },
  ],
});
