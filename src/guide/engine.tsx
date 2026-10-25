import type React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  getStaticFiles,
  Img,
  Interactive,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Grain } from "../components";
import { fell, fellSC, hand } from "../fonts";
import { clamp, easeIn, easeInOut, easeOut, FPS } from "../theme";
import {
  type Cam,
  facing,
  fromCentre,
  mixCam,
  Room,
  type RoomWall,
} from "./room";
import { type Beat, Guide, mouthAt, type Pose } from "./puppet";
import { paintFx } from "./shader";
import type { Palette } from "./decor";
import { isRig, rigHits } from "./rigs";
import { presentAtStart, type Shot, Shots, type TimedShot } from "./shots";

// "Le Guide" format (pilot: GuideAthens). The hook plays in the painting's room in 3D, the painting then hangs in its
// frame (class photo), and the camera climbs full screen from figure to figure while the Guide narrates from the
// floor, his words in a paper bubble beside him. Every timing derives from the voice JSON written by
// scripts/voice-gemini.py (segments + word timings); bible/ holds the rules this engine encodes.

// Narration: one entry per script segment, words timed on the voice file's clock.
export type VoiceWord = {
  text: string;
  start: number;
  end: number;
  segment: string;
};
export type Voice = {
  segments: { id: string; start: number; end: number }[];
  words: VoiceWord[];
};
// High-res crop laid exactly over the painting (x/y/w/h as fractions of it), for zooms past the main image's resolution.
export type Inset = { src: string; x: number; y: number; w: number; h: number };

// One beat of the episode = one segment of the script (same id). Every effect fires on a spoken `word`: the first
// word of the segment starting with it (case-insensitive), so "timée" matches "Timée".
export type GuideDetail = {
  id: string;
  fx: number; // detail centre, fractions of the painting
  fy: number;
  // Camera for this beat in `climb` mode: z = 1 shows the painting's full height on the full-screen frame.
  view?: { z: number; fx: number; fy: number };
  // Pencil arrows drawn from a point of the painting when the voice says `word` (e.g. Plato's raised finger).
  arrows?: {
    word: string;
    fx: number;
    fy: number;
    dir: "up" | "down";
    label: string;
  }[];
  // Whip-pan to another painting on `word`; on `split`, both paintings side by side with their labels.
  turn?: {
    word: string;
    split?: string;
    view: { z: number; fx: number; fy: number };
  };
  // Handwritten notes on torn paper, taped next to a point of the painting, from the spoken `word`.
  notes?: {
    word: string;
    text: string;
    fx: number;
    fy: number;
    dx: number;
    dy: number;
  }[];
  // A pencil loop drawn round an object when the voice names it (a book, a hand); `round` for a circle.
  glow?: {
    word: string;
    fx: number;
    fy: number;
    w: number;
    h: number;
    angle?: number;
    round?: boolean;
  }[];
  // Name tags pinned on many figures at once (a class photo), dropping one after another from the sentence start.
  tags?: { fx: number; fy: number; name: string; dx: number; dy: number }[];
  // Spotlight: the frame darkens around these figures (ellipse radii in painting fractions) and their names are
  // written next to them, from the spoken `word` (default: the start of the sentence).
  spots?: {
    word?: string;
    fx: number;
    fy: number;
    rx: number;
    ry: number;
    name: string;
    dx?: number;
    dy?: number;
  }[];
  // Hand-drawn question marks rising from a figure on `word` (Socrates questioning passers-by).
  questions?: { word: string; fx: number; fy: number };
  // On `word` the scene loses its colour around the spotlit figure and tears well up under each eye (lower lid, painting
  // fractions), one after another, and run down the cheek by `drop`.
  tear?: { word: string; eyes: { fx: number; fy: number }[]; drop: number };
  // Water poured out on `word`: a stream falls from a vessel's lip (`from`) to the ground (`to`, painting fractions),
  // splashes, stops before the beat ends, and the wet stain soaks into the ground.
  pour?: {
    word: string;
    from: { fx: number; fy: number };
    to: { fx: number; fy: number };
  };
  // Soft light swelling over a region of the painting on `word` (the sky for Plato); with `tint`, that colour deepens
  // the region instead (multiply: Munch's sky turning blood red).
  shine?: {
    word: string;
    fx: number;
    fy: number;
    rx: number;
    ry: number;
    tint?: string;
  }[];
  // The paint flows like liquid from `word` to the end of the beat (`amp` in painting widths; `pulse` Hz makes it beat
  // with the sound); with a `depth` map, the near planes (the figure) stay still.
  flow?: { word: string; amp: number; pulse?: number };
  // The Guide changes pose on a spoken word (several gestures in one beat).
  poses?: { word: string; pose: Pose }[];
  // A painted eye winks on `word` (lid drawn over it, painting fractions, skin colour sampled from the painting).
  wink?: {
    word: string;
    fx: number;
    fy: number;
    rx: number;
    ry: number;
    skin: string;
  };
  // Another artwork shown framed over the scene when the voice says `word` (e.g. Gérôme's Diogenes on "jarre"); with
  // `paper`, a document or photo taped on instead of a gilt frame; gone on `until` (default: when the beat ends).
  picture?: {
    word: string;
    src: string;
    width: number;
    height: number;
    caption: string;
    x?: number;
    y?: number;
    w?: number;
    paper?: boolean;
    until?: string;
  };
  // Pencil lines drawn from several figures towards one on `word` (a whole street running towards someone); the
  // heads stop on an ellipse round him (`rx`, `ry` in painting fractions), never on him.
  rays?: {
    word: string;
    to: { fx: number; fy: number; rx: number; ry: number };
    from: { fx: number; fy: number }[];
  };
  // Archive photos cut in over the frame (black and white), each from its `word` to the next one or the end of the
  // beat. The photo's point (ax, ay) lands on the painting's point (fx, fy) and the photo is `h` painting heights
  // tall, so a figure in the photo can sit exactly on a painted one (a match cut).
  // The last photo dissolves into the painting on `until` (default: when the beat ends).
  flashes?: {
    word: string;
    until?: string;
    src: string;
    width: number;
    height: number;
    ax: number;
    ay: number;
    fx: number;
    fy: number;
    h: number;
  }[];
  // Photos taped over a point of the painting one after another, faster and faster (many faces on one figure), from
  // `word` until `until` (default: the end of the beat), when they fly off.
  portraits?: {
    word: string;
    until?: string;
    srcs: string[];
    fx: number;
    fy: number;
    w: number;
  };
  // A Vox-style collage replacing the frame from `word` to the end of the beat: paper, torn prints, halftone
  // cut-outs, tape labels, stamps, landing one after another with parallax (the `figure` stays on top of it).
  // With `tear` (screen x), the frame rips top to bottom along a jagged line there: the collage takes the right side,
  // the painting keeps the left, in colour.
  // `early`: starts that many seconds before its word (to follow another collage without a gap); `push`: how far the
  // camera travels into the layers (default 0.1; 0.3 flies through them); `intro: "rip"`: the painting tears in two and
  // its halves fly apart to reveal it; `outro: "page"`: it leaves like a page turned (default: a blur).
  collage?: {
    word: string;
    until?: string;
    early?: number;
    push?: number;
    intro?: "rip";
    outro?: "page";
    tear?: number;
    pieces: CollagePiece[];
  };
  // Collage shots replacing the painting from their words (src/guide/shots.tsx): a new paper composition every second
  // or two, each to the next shot or the end of the beat, where the run hands back to the painting.
  shots?: Shot[];
  // Sound accents on spoken words (paths under public/).
  sfx?: { word: string; src: string; volume?: number }[];
  hold?: number; // extra seconds on this beat after the sentence (a reveal that needs to land)
  beat: Omit<Beat, "at">;
};

// Effects on the hook and context lines (the same keys as a detail, without a pose; `view` in climb mode).
export type LeadFx = Omit<
  GuideDetail,
  "id" | "fx" | "fy" | "turn" | "hold" | "beat"
>;
// A spoken word: [segment id, word] (first word of the segment starting with it).
export type Cue = [string, string];
// One piece of a collage, in px of the 1080 × CLIMB_H frame. `depth` 0 (far: lands blurred, barely moves) … 1 (near:
// sharp, moves most with the push). It lands on its word `at` (default: 0.14 s after the previous piece); `fly` makes it
// travel that many px sideways over the whole collage (planes). Kinds: an image (`src`, `w` wide), a yellow tape
// label, a big pale number, a red rubber stamp, a red-and-cream stripe, red pencil marks (`d`, an SVG path). A tape can be
// crossed out in red pencil on its word `strike` (drawn on the tape, so it moves
// with it).
export type CollagePiece = {
  x: number;
  y: number;
  w: number;
  rot?: number;
  depth: number;
  at?: string;
  fly?: number;
  over?: boolean;
  draw?: number;
} & (
  | { src: string }
  | { tape: string; strike?: string }
  | { ghost: string }
  | { stamp: string }
  | { stripes: number } // its height
  | { pencil: string; color?: string; width?: number } // drawn on over `draw` seconds (default 0.45): a route on a map can take longer; a wide one is a soft smear (ash spreading)
  | { disc: string } // a flat circle of that colour, `w` across (the Vox sun)
);

export type GuideConfig = {
  voiceFile: string;
  voice: Voice;
  image: { src: string; width: number; height: number };
  insets?: Inset[];
  maxWidth?: number; // painting box width (default 860); wide paintings can use more of the screen
  // "Climb" mode: during the details the frame grows to full screen and the camera travels from beat to beat.
  climb?: boolean;
  climbFrom?: string; // detail id where climb mode starts (default: the first detail; "start": full screen from frame 0)
  openView?: { z: number; fx: number; fy: number }; // camera during the hook and context in climb mode (default: z 1)
  // A cut-out of one figure (PNG with alpha, its box in painting fractions), drawn over the archive `flashes`: the
  // painted figure stays while the world behind him becomes the war.
  figure?: { src: string; x: number; y: number; w: number; h: number };
  // The video's palette, locked before the first shot (bible/vox.md §4): the roles paper, ink, accent (the one
  // saturated colour) and hl (the highlighter), and any named field colour. Every collage piece draws with it.
  palette?: Palette;
  lead?: { hook?: LeadFx; context?: LeadFx };
  // The real printed object (a poster, a magazine) lying on a table: the video opens on it, dives into its painting
  // on the hook's `word`, and with `loop` pulls back out to it. `painting`: where the painting sits on it (fractions);
  // our painting is laid over that spot so the hand-over is seamless.
  cover?: {
    src: string;
    width: number;
    height: number;
    painting: { x: number; y: number; w: number; h: number };
    word: string;
  };
  // The world freezes: from `from` to `to`, everything but one figure (an ellipse in painting fractions) loses its
  // colour and the music ducks. With `spread`, the colour comes back as a wave from that point (painting fractions)
  // over `dur` seconds from `to`, instead of everywhere at once.
  freeze?: {
    from: Cue;
    to: Cue;
    fx: number;
    fy: number;
    rx: number;
    ry: number;
    spread?: { fx: number; fy: number; dur?: number };
  };
  // A looping sound bed from `from` (e.g. a courtyard), swapped for its `muffled` twin from `muffle` to `clear`.
  ambience?: {
    src: string;
    muffled: string;
    from: Cue;
    muffle?: Cue;
    clear?: Cue;
    volume?: number;
  };
  // The painting stacked over its depth map (scripts/image-depth.py → <painting>-3d.jpg): while a `flow` runs in a wide view,
  // the near planes (the figure) stay still.
  depth?: { src: string };
  // The Guide's pose on the first frame (and on the loop's last frame); default point-right.
  openPose?: Pose;
  // The bed under the voice (public/music, ≥ the episode's length; bible/sound.md: pick one of the painting's time and
  // place); default Satie's Gymnopédie No. 1.
  music?: string;
  // A looping heartbeat from `from` to `to`.
  heart?: { src: string; from: Cue; to: Cue; volume?: number };
  // The painting's room in 3D during the hook and context. walls: 0 = this painting, 1 right, 2 facing, 3 left.
  // Close on `start` (wall 0) during the hook; then from the middle of the room the camera turns to each wall as its
  // `words[i]` is spoken (wide lens, the whole fresco lit), and pulls back into wall 0 as it hangs in the frame.
  room?: {
    walls: RoomWall[];
    words: string[];
    start: { fx: number; fy: number };
  };
  // With a room or a cover: from this word of the last line, the camera flies back to the opening shot, so the last
  // frame matches the first and the video loops into its hook.
  loop?: { word: string };
  tight?: boolean; // short gaps, camera moves overlapping the voice (≤ 75 s edits)
  // Second painting for `turn` beats (e.g. the fresco on the facing wall) and the labels of the side-by-side view.
  other?: {
    src: string;
    width: number;
    height: number;
    labels: [string, string];
  };
  header: string;
  title: [string, string];
  details: GuideDetail[];
};

const f = (s: number) => Math.round(s * FPS);
const WALL = "#151A14";
const CREAM = "#F4EBDD";
const INK = "#20251F";
const GOLD = "#E8C66A";
const MOVE = 0.85; // camera travel between details
const BASELINE = 1665; // the Guide's feet (TikTok/Reels keep ~400 px at the bottom for caption and account)
const GUIDE_X = 230;
const CLIMB_H = 1400; // painting height on screen in climb mode
const HOLD_PUSH = 0.006; // the camera's slow push while it holds on the painting: +3 % in 5 s (Vox: it never freezes)

export const createGuideEpisode = (cfg: GuideConfig) => {
  // ---- Layout: the painting fits a 860 × 800 box under the heading ----
  const ratio = cfg.image.width / cfg.image.height;
  const PW = Math.min(cfg.maxWidth ?? 860, 800 * ratio);
  const PH = PW / ratio;
  const BX = 540 - PW / 2;
  const BY = 345 + (800 - PH) / 2;
  const SRC = staticFile(cfg.image.src);

  // ---- Timeline (seconds) ----
  const segment = (id: string) => {
    const s = cfg.voice.segments.find((x) => x.id === id);
    if (!s) throw new Error(`voice segment ${id} missing`);
    return s;
  };
  let cursor = 0.35;
  const place = (id: string, gapAfter: number) => {
    const s = segment(id);
    const at = cursor;
    cursor = at + (s.end - s.start) + gapAfter;
    return { id, at, end: at + (s.end - s.start), src: s.start };
  };
  const gap = (normal: number) => (cfg.tight ? Math.min(normal, 0.12) : normal);
  const hook = place("hook", gap(0.2));
  // With a room, the camera needs a moment after the last word to dive back into the painting.
  const context = place("context", cfg.room ? 0.35 : gap(0.2));
  const DETAILS_FROM = cursor;
  const details = cfg.details.map((d, i) => {
    // Tight: the camera starts moving under the end of the previous sentence.
    const move = cfg.tight ? Math.max(cursor - 0.35, 0) : cursor;
    cursor = cfg.tight ? move + 0.5 : cursor + (i === 0 ? MOVE * 1.1 : MOVE);
    const vo = place(d.id, gap(0.4) + (d.hold ?? 0));
    return {
      ...d,
      move,
      arrive: move + (i === 0 ? MOVE * 1.1 : MOVE),
      vo,
      end: cursor,
    };
  });
  // The episode ends on its last detail (with a `loop`, back on the opening shot).
  const END = cursor + 0.3;
  // The hook and context lines as effect carriers, then the details: every overlay below reads `all`.
  const leads = (["hook", "context"] as const).flatMap((id) => {
    const fx = cfg.lead?.[id];
    const vo = id === "hook" ? hook : context;
    return fx
      ? [
          {
            id,
            fx: 0.5,
            fy: 0.5,
            beat: { pose: "explaining" as const, x: GUIDE_X },
            ...fx,
            vo,
            move: vo.at,
            arrive: vo.at,
            end: id === "hook" ? context.at : DETAILS_FROM,
          },
        ]
      : [];
  });
  const all: (typeof details)[number][] = [...leads, ...details];
  // Overlays of a detail (notes, arrows, tags, spots) are gone before the camera leaves for the next one.
  const leaveOf = (d: (typeof details)[number]) =>
    Math.min(d.end, all[all.indexOf(d) + 1]?.move ?? cursor);
  // 0 → 1 over [a, a + rise], back to 0 over [b - fall, b]; safe when the cue comes late in a sentence (b close to a).
  const inOut = (t: number, a: number, rise: number, b: number, fall: number) =>
    Math.min(
      interpolate(t, [a, a + rise], [0, 1], { ...clamp, easing: easeInOut }),
      interpolate(t, [b - fall, b], [1, 0], { ...clamp, easing: easeInOut }),
    );
  const voiceLines = [hook, context, ...details.map((d) => d.vo)];

  // Word timings on the video clock (captions + the Guide's speech bob).
  type TimedWord = { text: string; at: number; until: number; segment: string };
  const words: TimedWord[] = voiceLines.flatMap((line) =>
    cfg.voice.words
      .filter((w) => w.segment === line.id)
      .map((w) => ({
        text: w.text,
        segment: w.segment,
        at: line.at + (w.start - line.src),
        until: line.at + (w.end - line.src),
      })),
  );
  const onsets = words.map((w) => w.at);
  const wordAt = (segment: string, word: string) =>
    words.find(
      (w) =>
        w.segment === segment &&
        w.text.toLowerCase().startsWith(word.toLowerCase()),
    )?.at;
  const LOOP_AT = cfg.loop
    ? (wordAt(details[details.length - 1].id, cfg.loop.word) ?? 1e6)
    : 1e6;
  const cue = (c?: Cue) => (c ? (wordAt(c[0], c[1]) ?? 1e6) : 1e6);
  const turnAt = new Map(
    details.map((d) => [
      d.id,
      d.turn ? (wordAt(d.id, d.turn.word) ?? d.vo.at) : undefined,
    ]),
  );
  const splitAt = new Map(
    details.map((d) => [
      d.id,
      d.turn?.split ? wordAt(d.id, d.turn.split) : undefined,
    ]),
  );

  // ---- Room (hook + context): camera keyframes on the spoken words ----
  const room = cfg.room;
  const wallAt = room
    ? room.words.map((w) => wordAt("context", w) ?? Infinity)
    : [];
  const lastWall = room ? Math.max(...wallAt.filter((x) => x < Infinity)) : 0;
  const ROOM_OUT = room ? Math.max(lastWall + 1.1, context.end + 0.15) : -1;
  const TURN = 0.7; // seconds to turn from one wall to the next
  const roomCam = (t: number): { cam: Cam; blur: number } => {
    const w = room!.walls;
    const start = facing(
      0,
      w[0],
      room!.start.fx,
      room!.start.fy,
      760,
      540,
      640,
    );
    // The tour, in spoken order; each turn keeps going the same way round (yaws unwrapped).
    const stops = wallAt
      .map((at, i) => ({ at, i }))
      .filter((x) => x.at < Infinity)
      .sort((a, b) => a.at - b.at);
    let yaw = 0;
    const tour = stops.map((x) => {
      const c = fromCentre(x.i, w[x.i]);
      yaw += (((c.yaw - yaw) % 360) + 360) % 360;
      return { at: x.at, cam: { ...c, yaw } };
    });
    // Wall 0 exactly where the hung painting sits, so the hand-over to the frame is invisible.
    const hung: Cam = {
      ...facing(0, w[0], 0.5, 0.5, (3080 * 1080) / PW, 540, BY + PH / 2),
      yaw,
    };
    const ease = (a: number, b: number) =>
      interpolate(t, [a, b], [0, 1], { ...clamp, easing: easeInOut });
    // Hook: slow push on the detail; context: back to the middle of the room, still facing wall 0.
    let cam = mixCam(
      start,
      { ...start, dist: start.dist * 0.9 },
      ease(0, context.at),
    );
    const centre = { ...fromCentre(0, w[0]), yaw: 0 };
    if (t >= context.at)
      cam = mixCam(cam, centre, ease(context.at, context.at + 1.1));
    let blur = 0;
    let prev = centre;
    for (const s of tour) {
      const from = s.at - TURN * 0.45;
      if (t < from) break;
      const p = ease(from, from + TURN);
      cam = mixCam(prev, s.cam, p);
      blur = Math.abs(s.cam.yaw - prev.yaw) > 1 ? Math.sin(p * Math.PI) * 9 : 0;
      prev = s.cam;
    }
    if (t >= lastWall + 0.3)
      cam = mixCam(prev, hung, ease(lastWall + 0.3, ROOM_OUT));
    // Loop: straight on, from the back of the room, a push into the opening shot, reached on the last frame.
    // Same lens as the opening shot all the way, so the side walls stay out of view: seen edge-on, close to the
    // camera, Chrome fails to rasterize them and draws a black slab over the fresco.
    if (t >= LOOP_AT)
      cam = mixCam(
        { ...start, dist: 2400 },
        start,
        ease(LOOP_AT, END - 1 / FPS),
      );
    return { cam, blur };
  };
  const roomOn = (t: number) =>
    room
      ? Math.max(
          interpolate(t, [ROOM_OUT, ROOM_OUT + 0.35], [1, 0], clamp),
          interpolate(t, [LOOP_AT, LOOP_AT + 0.4], [0, 1], clamp),
        )
      : 0;

  // ---- The Guide's beats ----
  const OPEN_POSE = cfg.openPose ?? "point-right";
  const beats: Beat[] = [
    // On screen from the first frame: his speech bubble must never appear before him.
    { at: 0, pose: OPEN_POSE, x: GUIDE_X },
    { at: context.at, pose: "explaining" as const, x: GUIDE_X },
    ...details.map((d) => ({ at: d.move + 0.15, ...d.beat })),
    ...all.flatMap((d) =>
      (d.poses ?? []).map((p) => ({
        at: wordAt(d.id, p.word) ?? 1e6,
        pose: p.pose,
        x: d.beat.x,
      })),
    ),
    ...(cfg.loop ? [{ at: LOOP_AT, pose: OPEN_POSE, x: GUIDE_X }] : []), // the opening pose
  ].sort((a, b) => a.at - b.at);
  // ---- Frame box: hung on the wall, or full screen while climbing ----
  const climbStart =
    cfg.climbFrom === "start"
      ? -1
      : (details.find((d) => d.id === cfg.climbFrom)?.move ?? DETAILS_FROM);
  const IMM_IN = cfg.climb ? climbStart - 0.3 : Infinity;
  // Once climbing, the frame stays full screen to the end.
  const immAt = (t: number) =>
    cfg.climb
      ? interpolate(t, [IMM_IN, IMM_IN + 0.9], [0, 1], {
          ...clamp,
          easing: easeInOut,
        })
      : 0;
  const boxAt = (t: number) => {
    const p = immAt(t);
    // Full width, down to just above the Guide's head: the bottom of the painting must never hide behind him.
    return {
      x: BX * (1 - p),
      y: BY * (1 - p),
      w: PW + (1080 - PW) * p,
      h: PH + (CLIMB_H - PH) * p,
    };
  };
  // Screen px per painting px: z times the scale at which the painting covers the box.
  const scaleAt = (t: number, z: number) => {
    const b = boxAt(t);
    return z * Math.max(b.w / PW, b.h / PH);
  };

  // ---- Painting view inside the frame (z = 1: whole painting) ----
  const climbView = (t: number) => {
    let v = cfg.openView ?? { z: 1, fx: 0.5, fy: 0.5 };
    const blend = (to: { z: number; fx: number; fy: number }, p: number) => {
      if (to.z / v.z > 1.8) {
        // A big zoom-in: the target stays pinned on screen and glides to the centre while the image grows around it
        // (a straight blend of position and scale would slide sideways across the painting).
        const z = Math.exp(
          Math.log(v.z) + (Math.log(to.z) - Math.log(v.z)) * p,
        );
        v = {
          z,
          fx: to.fx - ((to.fx - v.fx) * v.z * (1 - p)) / z,
          fy: to.fy - ((to.fy - v.fy) * v.z * (1 - p)) / z,
        };
      } else {
        v = {
          z: v.z + (to.z - v.z) * p,
          fx: v.fx + (to.fx - v.fx) * p,
          fy: v.fy + (to.fy - v.fy) * p,
        };
      }
    };
    // While the camera holds, it keeps pushing in slowly (HOLD_PUSH a second): the picture never freezes, even on the
    // whole painting where the framing can't climb. Each move starts from where the push got to, so nothing jumps.
    let held = 0;
    for (const d of all) {
      if (!d.view || t < d.move - 0.2) continue;
      v = { ...v, z: v.z * (1 + HOLD_PUSH * Math.max(0, d.move - 0.2 - held)) };
      const p = interpolate(t, [d.move - 0.2, d.arrive + 0.3], [0, 1], {
        ...clamp,
        easing: easeInOut,
      });
      // Keeps climbing while the Guide talks (not under a collage: its pencil traces follow the zoom, not a pan).
      const drift = d.collage
        ? 0
        : interpolate(t, [d.arrive, d.end + MOVE], [0, 0.02], clamp);
      blend({ z: d.view.z, fx: d.view.fx, fy: d.view.fy - drift }, p);
      held = Math.min(t, d.arrive + 0.3);
    }
    // On the loop the camera flies back to the opening frame and the push eases off: the last frame is the first again.
    if (cfg.loop && t >= LOOP_AT)
      blend(
        cfg.openView ?? { z: 1, fx: 0.5, fy: 0.5 },
        interpolate(t, [LOOP_AT, END - 1 / FPS], [0, 1], {
          ...clamp,
          easing: easeInOut,
        }),
      );
    const unwind =
      cfg.loop && t >= LOOP_AT
        ? interpolate(t, [LOOP_AT, END - 1 / FPS], [1, 0], {
            ...clamp,
            easing: easeInOut,
          })
        : 1;
    v = { ...v, z: v.z * (1 + HOLD_PUSH * Math.max(0, t - held) * unwind) };
    const s = scaleAt(t, v.z);
    const b = boxAt(t);
    const keep = (c: number, visible: number) =>
      visible >= 1 ? 0.5 : Math.min(1 - visible / 2, Math.max(visible / 2, c));
    // The top edge may come down by `slack` under the heading zone (the summit is not hidden behind the title), and the
    // bottom edge may rise by `low` so a detail at the very bottom (a compass on the floor) clears the speech bubble.
    const keepTop = (c: number, visible: number, slack: number, low: number) =>
      visible >= 1
        ? 0.5
        : Math.min(1 - visible / 2 + low, Math.max(visible / 2 - slack, c));
    return {
      z: v.z,
      fx: keep(v.fx, b.w / (PW * s)),
      fy: keepTop(
        v.fy,
        b.h / (PH * s),
        (380 * immAt(t)) / (PH * s),
        (300 * immAt(t)) / (PH * s),
      ),
    };
  };
  const viewAt = (t: number) =>
    cfg.climb ? climbView(t) : { z: 1, fx: 0.5, fy: 0.5 };
  const toScreen = (fx: number, fy: number, t: number) => {
    const v = viewAt(t);
    const b = boxAt(t);
    const s = scaleAt(t, v.z);
    return {
      x: b.x + b.w / 2 + (fx - v.fx) * PW * s,
      y: b.y + b.h / 2 + (fy - v.fy) * PH * s,
    };
  };
  const contentTransform = (t: number) => {
    const v = viewAt(t);
    const b = boxAt(t);
    const s = scaleAt(t, v.z);
    return `translate(${b.w / 2 - v.fx * PW * s}px, ${b.h / 2 - v.fy * PH * s}px) scale(${s})`;
  };

  const full: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    maxWidth: "none",
  };
  // Tears and the wink are painted on the painting itself, so the camera magnifies them with it.
  // How much of the depth-masked flow shows: all of it in wide views, none from z 1.5 in (where the insets take over).
  const wideAt = (t: number) =>
    cfg.depth ? interpolate(viewAt(t).z, [1, 1.5], [1, 0], clamp) : 0;
  // The paint flow at time t (the only shader effect).
  const flowAt = (t: number) => {
    let flow = 0;
    for (const d of all) {
      const at = d.flow ? wordAt(d.id, d.flow.word) : undefined;
      if (d.flow && at !== undefined && t >= at && t <= leaveOf(d))
        flow =
          d.flow.amp *
          inOut(t, at, 0.8, leaveOf(d), 0.6) *
          (d.flow.pulse
            ? 0.65 + 0.35 * Math.sin(2 * Math.PI * d.flow.pulse * (t - at))
            : 1);
    }
    return flow;
  };
  // An image of the painting (box in painting fractions), through the shader while an effect is live.
  const FxImg: React.FC<{
    src: string;
    box: [number, number, number, number];
    t: number;
    stacked?: boolean;
    style?: React.CSSProperties;
  }> = ({ src, box, t, stacked = false, style }) => {
    const flow = flowAt(t);
    const css: React.CSSProperties = {
      position: "absolute",
      left: box[0] * PW,
      top: box[1] * PH,
      width: box[2] * PW,
      height: box[3] * PH,
      maxWidth: "none",
      ...style,
    };
    if (flow <= 0) return <Img src={src} style={css} />;
    // Process at the size it is shown on screen: sharp at any zoom, never more work than needed.
    const s = scaleAt(t, viewAt(t).z);
    const size = {
      width: Math.round(Math.min(4096, Math.max(64, box[2] * PW * s))),
      height: Math.round(Math.min(4096, Math.max(64, box[3] * PH * s))),
    };
    return (
      <Img
        src={src}
        effectsOutputSize={size}
        style={{ ...css, objectFit: "fill" }}
        effects={[paintFx({ box, ar: PW / PH, flow, time: t, stacked })]}
      />
    );
  };
  const PaintingLayer: React.FC<{ t: number; style: React.CSSProperties }> = ({
    t,
    style,
  }) => {
    // While the flow runs, the stacked painting + depth replaces the flat one in wide views (the figure stays still).
    const wide = flowAt(t) > 0 ? wideAt(t) : 0;
    return (
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: PW,
          height: PH,
          transformOrigin: "0 0",
          ...style,
        }}
      >
        <FxImg src={SRC} box={[0, 0, 1, 1]} t={t} />
        {cfg.depth && wide > 0 ? (
          <FxImg
            src={staticFile(cfg.depth.src)}
            box={[0, 0, 1, 1]}
            t={t}
            stacked
            style={{ opacity: wide }}
          />
        ) : null}
        {(cfg.insets ?? []).map((inset) => (
          <FxImg
            key={inset.src}
            src={staticFile(inset.src)}
            box={[inset.x, inset.y, inset.w, inset.h]}
            t={t}
            style={{ opacity: 1 - wide }}
          />
        ))}
        <Tears t={t} />
        <Wink t={t} />
      </div>
    );
  };

  // ---- Frame: drops onto its nail and swings to rest ----
  const Frame: React.FC<{ t: number }> = ({ t }) => {
    // Opening on a cover or full screen, the painting is already in place (and the loop's last frame matches it).
    const still = cfg.cover || cfg.climbFrom === "start";
    const drop = still
      ? 0
      : interpolate(t, [0, 0.5], [-1400, 0], { ...clamp, easing: easeIn });
    const dt = still ? -1 : t - 0.5;
    const swing = dt > 0 ? 4 * Math.exp(-dt * 3) * Math.sin(dt * 11) : 0;
    const b = boxAt(t);
    const imm = immAt(t);
    const pad = 20 * (1 - imm);
    return (
      <div
        style={{
          position: "absolute",
          left: b.x - pad,
          top: b.y - pad + drop,
          width: b.w + 2 * pad,
          height: b.h + 2 * pad,
          transformOrigin: "50% -60px",
          transform: `rotate(${swing}deg)`,
          padding: pad,
          boxSizing: "border-box",
          background:
            "linear-gradient(135deg, #D9B66E 0%, #8A6A2E 30%, #E3C27A 52%, #6B4B1C 78%, #B8924A 100%)",
          boxShadow:
            "0 40px 80px rgba(0,0,0,0.6), inset 0 0 0 2px rgba(255,240,200,0.35), inset 0 0 0 6px rgba(60,40,10,0.5)",
        }}
      >
        <div
          style={{
            position: "relative",
            width: b.w,
            height: b.h,
            overflow: "hidden",
            boxShadow: "inset 0 0 0 3px #2A1E0C",
            backgroundColor: "#000",
          }}
        >
          <PaintingLayer t={t} style={{ transform: contentTransform(t) }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              boxShadow: "inset 0 0 40px rgba(0,0,0,0.55)",
            }}
          />
        </div>
      </div>
    );
  };

  // ---- Hand-drawn pencil marks (loops round objects, arrows) in cream, drawn on as the voice names them ----
  const rnd = (seed: number) => {
    const x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  // One stroke going round ~1.1 times, slightly wobbly, deterministic.
  const loopPath = (
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    angle: number,
    seed: number,
  ) => {
    const n = 40;
    const start = -2.1 + rnd(seed) * 0.5;
    const ca = Math.cos((angle * Math.PI) / 180);
    const sa = Math.sin((angle * Math.PI) / 180);
    return Array.from({ length: n + 1 }, (_, i) => {
      const a = start + (i / n) * Math.PI * 2.2;
      const k = 1 + (rnd(seed + i * 3) - 0.5) * 0.05 + (i / n) * 0.07;
      const ex = Math.cos(a) * rx * k;
      const ey = Math.sin(a) * ry * k;
      return `${i ? "L" : "M"} ${(cx + ex * ca - ey * sa).toFixed(1)} ${(cy + ex * sa + ey * ca).toFixed(1)}`;
    }).join(" ");
  };
  const Pencil: React.FC<{
    d: string;
    draw: number;
    width?: number;
    color?: string;
  }> = ({ d, draw, width = 6, color = CREAM }) => (
    <path
      d={d}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - draw}
    />
  );
  const pencilStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    overflow: "visible",
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.6))",
  };

  const Arrows: React.FC<{ t: number }> = ({ t }) => (
    <svg width={1080} height={1920} style={pencilStyle}>
      {all.flatMap((d) =>
        (d.arrows ?? []).map((a, i) => {
          const at = wordAt(d.id, a.word);
          if (at === undefined || t < at || t > leaveOf(d)) return null;
          const line = interpolate(t, [at, at + 0.45], [0, 1], {
            ...clamp,
            easing: easeInOut,
          });
          const head = interpolate(t, [at + 0.4, at + 0.55], [0, 1], clamp);
          const out = interpolate(
            t,
            [leaveOf(d) - 0.3, leaveOf(d)],
            [1, 0],
            clamp,
          );
          const o = toScreen(a.fx, a.fy, t);
          const sgn = a.dir === "up" ? -1 : 1;
          const tip = {
            x: o.x + 30 * -sgn,
            y: o.y + sgn * (a.dir === "up" ? 260 : 300),
          };
          const from = { x: o.x, y: o.y + sgn * 30 };
          const ang = Math.atan2(tip.y - from.y, tip.x - from.x);
          const barb = (da: number) =>
            `M ${tip.x} ${tip.y} L ${tip.x - Math.cos(ang + da) * 34} ${tip.y - Math.sin(ang + da) * 34}`;
          return (
            <g key={`${d.id}-${i}`} opacity={out}>
              <Pencil
                d={`M ${from.x} ${from.y} Q ${(from.x + tip.x) / 2 + sgn * 18} ${(from.y + tip.y) / 2} ${tip.x} ${tip.y}`}
                draw={line}
              />
              <Pencil d={barb(0.45)} draw={head} />
              <Pencil d={barb(-0.45)} draw={head} />
              <text
                x={a.dir === "up" ? tip.x + 26 : tip.x - 26}
                y={a.dir === "up" ? tip.y + 40 : tip.y - 10}
                textAnchor={a.dir === "up" ? "start" : "end"}
                fontFamily={hand}
                fontSize={58}
                fontWeight={700}
                fill={CREAM}
                transform={`rotate(-4 ${tip.x} ${tip.y})`}
                opacity={interpolate(t, [at + 0.45, at + 0.75], [0, 1], clamp)}
              >
                {a.label}
              </text>
            </g>
          );
        }),
      )}
    </svg>
  );

  // ---- The facing wall: whip-pan to the other painting, then both side by side ----
  const other = cfg.other;
  const OtherWall: React.FC<{ t: number }> = ({ t }) => {
    if (!other) return null;
    const d = details.find((x) => x.turn);
    const ta = d ? turnAt.get(d.id) : undefined;
    const sa = d ? splitAt.get(d.id) : undefined;
    const splits: [number, number][] = [];
    if (d && sa !== undefined)
      splits.push([sa, Math.min(d.end - 0.25, LOOP_AT + 0.4)]);
    const inTurn = d && ta !== undefined && t >= ta && t < (sa ?? d.end + 0.3);
    const split = splits.find(([a, b]) => t >= a - 0.05 && t < b);
    if (!inTurn && !split) return null;
    const oRatio = other.width / other.height;
    if (split) {
      const p = interpolate(t, [split[0], split[0] + 0.5], [0, 1], {
        ...clamp,
        easing: easeOut,
      });
      const out = interpolate(t, [split[1] - 0.3, split[1]], [1, 0], clamp);
      const w = 500;
      const card = (
        src: string,
        ratio: number,
        label: string,
        x: number,
        from: number,
      ) => (
        <div
          style={{
            position: "absolute",
            left: x,
            top: 470,
            width: w,
            transform: `translateX(${(1 - p) * from}px) rotate(${from > 0 ? 2 : -2}deg)`,
            opacity: p * out,
          }}
        >
          <div
            style={{
              width: w,
              height: w / ratio,
              border: `6px solid #B88A3E`,
              boxShadow: "0 30px 60px rgba(0,0,0,0.7)",
              overflow: "hidden",
            }}
          >
            <Img
              src={staticFile(src)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div
            style={{
              marginTop: 18,
              textAlign: "center",
              fontFamily: fellSC,
              fontSize: 34,
              letterSpacing: "0.16em",
              color: GOLD,
              fontWeight: 500,
            }}
          >
            {label}
          </div>
        </div>
      );
      return (
        <AbsoluteFill
          style={{ backgroundColor: `rgba(12,14,10,${0.9 * p * out})` }}
        >
          {card(cfg.image.src, ratio, other.labels[0], 25, -600)}
          {card(other.src, oRatio, other.labels[1], 555, 600)}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 470 + w / ratio / 2 - 40,
              textAlign: "center",
              fontFamily: fell,
              fontSize: 70,
              color: CREAM,
              opacity: p * out,
            }}
          >
            ⇄
          </div>
        </AbsoluteFill>
      );
    }
    // Whip: the facing fresco slides in from the right with motion blur, full screen above the Guide.
    const p = interpolate(t, [ta!, ta! + 0.55], [0, 1], {
      ...clamp,
      easing: easeInOut,
    });
    const v = d!.turn!.view;
    const cover = v.z * Math.max(1080 / other.width, CLIMB_H / other.height);
    const W = other.width * cover;
    const H = other.height * cover;
    return (
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: CLIMB_H,
          overflow: "hidden",
          transform: `translateX(${(1 - p) * 1080}px)`,
          filter: `blur(${Math.sin(p * Math.PI) * 14}px)`,
        }}
      >
        <Img
          src={staticFile(other.src)}
          style={{
            position: "absolute",
            left: 540 - v.fx * W,
            top: CLIMB_H / 2 - v.fy * H,
            width: W,
            height: H,
            maxWidth: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, rgba(12,14,10,0.82) 0px, rgba(12,14,10,0.3) 380px, rgba(12,14,10,0) 560px, rgba(12,14,10,0) ${CLIMB_H - 260}px, ${WALL} ${CLIMB_H}px)`,
          }}
        />
      </div>
    );
  };

  // ---- Torn-paper notes (the app's paper strip + tape), Caveat handwriting ----
  const Notes: React.FC<{ t: number }> = ({ t }) => (
    <>
      {all.flatMap((d) =>
        (d.notes ?? []).map((n, i) => {
          const at = wordAt(d.id, n.word);
          if (at === undefined || t < at || t > leaveOf(d)) return null;
          const p = interpolate(t, [at, at + 0.35], [0, 1], {
            ...clamp,
            easing: easeOut,
          });
          const k =
            t > at + 0.3
              ? Math.exp(-(t - at - 0.3) * 9) * Math.cos((t - at - 0.3) * 32)
              : 0;
          const out = interpolate(
            t,
            [leaveOf(d) - 0.3, leaveOf(d)],
            [1, 0],
            clamp,
          );
          const a = toScreen(n.fx, n.fy, t);
          const w = 430;
          // Offset from the anchor in screen px, chosen per note so it never covers what it names.
          const x = Math.min(1080 - w - 24, Math.max(24, a.x + n.dx));
          const y = Math.min(1000, Math.max(330, a.y + n.dy));
          const tilt = n.dx > 0 ? 3 : -3;
          return (
            <div
              key={`${d.id}-note-${i}`}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: w,
                opacity: p * out,
                transform: `translateY(${(1 - p) * -40}px) rotate(${tilt + (1 - p) * 10 * Math.sign(tilt) + k * 3}deg) scale(${0.85 + 0.15 * p})`,
              }}
            >
              <Img
                src={staticFile("guide/paper-strip.webp")}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.55))",
                }}
              />
              <div
                style={{
                  position: "relative",
                  padding: "38px 40px 34px",
                  fontFamily: hand,
                  fontWeight: 700,
                  fontSize: 46,
                  lineHeight: 1.0,
                  color: INK,
                  textAlign: "center",
                }}
              >
                {n.text}
              </div>
              <Img
                src={staticFile("guide/tape.webp")}
                style={{
                  position: "absolute",
                  left: w / 2 - 80,
                  top: -26,
                  width: 160,
                  transform: `rotate(${-tilt * 2}deg)`,
                  opacity: 0.9,
                }}
              />
            </div>
          );
        }),
      )}
    </>
  );

  // ---- A pencil loop drawn round the named object (a book, a hand), held while the Guide talks about it ----
  const Glows: React.FC<{ t: number }> = ({ t }) => (
    <svg width={1080} height={1920} style={pencilStyle}>
      {all.flatMap((d) =>
        (d.glow ?? []).map((g, i) => {
          const at = wordAt(d.id, g.word);
          if (at === undefined || t < at || t > leaveOf(d)) return null;
          const draw = interpolate(t, [at, at + 0.5], [0, 1], {
            ...clamp,
            easing: easeInOut,
          });
          const out = interpolate(
            t,
            [leaveOf(d) - 0.3, leaveOf(d)],
            [1, 0],
            clamp,
          );
          const c = toScreen(g.fx, g.fy, t);
          const s = scaleAt(t, viewAt(t).z);
          const rx = Math.max(40, (g.w * PW * s) / 2) * (g.round ? 1.2 : 1.3);
          const ry = Math.max(40, (g.h * PH * s) / 2) * (g.round ? 1.2 : 1.3);
          return (
            <g key={`${d.id}-glow-${i}`} opacity={out}>
              <Pencil
                d={loopPath(c.x, c.y, rx, ry, g.angle ?? 0, i + 7)}
                draw={draw}
              />
            </g>
          );
        }),
      )}
    </svg>
  );

  // ---- The room in 3D (hook + context) ----
  const RoomLayer: React.FC<{ t: number }> = ({ t }) => {
    const on = roomOn(t);
    if (!room || on <= 0) return null;
    const { cam, blur } = roomCam(t);
    const firstTurn = Math.min(...wallAt) - TURN * 0.45;
    const lit = wallAt.map((at) =>
      interpolate(t, [at - 0.05, at + 0.35], [0, 1], {
        ...clamp,
        easing: easeOut,
      }),
    );
    // Before the tour, the walls in view are simply lit; the tour then switches them on one by one.
    const pre = interpolate(t, [context.at, context.at + 0.6], [1, 0], clamp);
    return (
      <AbsoluteFill style={{ opacity: on, backgroundColor: "#0C0E0A" }}>
        {/* Straight on the fresco (before the first turn, the dive into the frame, the way back for the loop) the other walls are out of view. */}
        <Room
          cam={cam}
          walls={room.walls}
          lit={lit.map((l) => Math.max(l, pre))}
          blur={blur}
          solo={t < firstTurn || t >= lastWall + 0.3}
        />
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, rgba(12,14,10,0.7) 0px, rgba(12,14,10,0) 420px, rgba(12,14,10,0) 1330px, ${WALL} 1640px)`,
          }}
        />
        {/* The wall being named, big under the title: in the room itself it would sit behind the Guide. */}
        {wallAt.map((at, i) => {
          const next = Math.min(...wallAt.filter((x) => x > at), ROOM_OUT);
          const p = inOut(t, at - 0.05, 0.3, next, 0.25);
          return p > 0 ? (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 330,
                textAlign: "center",
                fontFamily: fellSC,
                fontSize: 96,
                letterSpacing: "0.08em",
                color: GOLD,
                opacity: p,
                transform: `scale(${interpolate(p, [0, 1], [1.4, 1])})`,
                textShadow:
                  "0 0 40px rgba(232,198,106,0.6), 0 8px 24px rgba(0,0,0,0.9)",
              }}
            >
              {room.walls[i].label}
            </div>
          ) : null;
        })}
      </AbsoluteFill>
    );
  };

  // ---- Class photo: name tags dropping onto the figures ----
  const Tags: React.FC<{ t: number }> = ({ t }) => (
    <>
      {all.flatMap((d) =>
        (d.tags ?? []).map((g, i) => {
          const at = d.vo.at + 0.15 + i * 0.1;
          if (t < at || t > leaveOf(d)) return null;
          const p = interpolate(t, [at, at + 0.22], [0, 1], {
            ...clamp,
            easing: easeIn,
          });
          const out = interpolate(
            t,
            [leaveOf(d) - 0.3, leaveOf(d)],
            [1, 0],
            clamp,
          );
          const o = toScreen(g.fx, g.fy, t);
          const x = o.x + g.dx;
          const y = o.y + g.dy;
          const tilt = ((i * 37) % 9) - 4;
          return (
            <div
              key={`${d.id}-tag-${i}`}
              style={{ position: "absolute", inset: 0, opacity: out }}
            >
              <svg
                width={1080}
                height={1920}
                style={{ position: "absolute", left: 0, top: 0, opacity: p }}
              >
                <line
                  x1={o.x}
                  y1={o.y}
                  x2={x}
                  y2={y}
                  stroke={CREAM}
                  strokeWidth={2.5}
                  strokeOpacity={0.85}
                />
                <circle
                  cx={o.x}
                  cy={o.y}
                  r={6}
                  fill={GOLD}
                  stroke="#2A1E0C"
                  strokeWidth={2}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  transform: `translate(-50%, -50%) rotate(${tilt}deg) scale(${interpolate(p, [0, 1], [1.8, 1])})`,
                  opacity: p,
                  padding: "4px 16px 6px",
                  background: "#F3E6CC",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.55)",
                  fontFamily: hand,
                  fontWeight: 700,
                  fontSize: 40,
                  lineHeight: 1,
                  color: INK,
                  whiteSpace: "nowrap",
                }}
              >
                {g.name}
              </div>
            </div>
          );
        }),
      )}
    </>
  );

  // ---- Spotlight: everything but the named figures darkens; names written beside them ----
  const spotList = all.flatMap((d) =>
    (d.spots ?? []).map((sp) => ({
      ...sp,
      d,
      at: (sp.word ? wordAt(d.id, sp.word) : undefined) ?? d.vo.at,
    })),
  );
  const Spots: React.FC<{ t: number }> = ({ t }) => {
    const active = spotList
      .map((sp) => ({
        sp,
        p: inOut(t, sp.at - 0.15, 0.45, leaveOf(sp.d), 0.3),
      }))
      .filter((a) => a.p > 0);
    if (!active.length) return null;
    const s = scaleAt(t, viewAt(t).z);
    const dark = Math.max(...active.map((a) => a.p));
    return (
      <>
        <svg
          width={1080}
          height={1920}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          <defs>
            <filter
              id="spot-feather"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation={28} />
            </filter>
            <mask
              id="spot-mask"
              maskUnits="userSpaceOnUse"
              x={0}
              y={0}
              width={1080}
              height={1920}
            >
              <rect width={1080} height={1920} fill="white" />
              {active.map(({ sp, p }, i) => {
                const c = toScreen(sp.fx, sp.fy, t);
                return (
                  <ellipse
                    key={i}
                    cx={c.x}
                    cy={c.y}
                    rx={sp.rx * PW * s}
                    ry={sp.ry * PH * s}
                    fill="black"
                    fillOpacity={p}
                    filter="url(#spot-feather)"
                  />
                );
              })}
            </mask>
          </defs>
          <rect
            width={1080}
            height={CLIMB_H + 80}
            fill="rgb(8,10,7)"
            opacity={0.62 * dark}
            mask="url(#spot-mask)"
          />
        </svg>
        {active.map(({ sp }, i) => {
          // The colour drains from the world around a weeping figure; he alone keeps his.
          const tw = sp.d.tear ? wordAt(sp.d.id, sp.d.tear.word) : undefined;
          if (tw === undefined) return null;
          const g = inOut(t, tw, 1.2, leaveOf(sp.d), 0.4);
          const c = toScreen(sp.fx, sp.fy, t);
          const hole = `radial-gradient(ellipse ${sp.rx * PW * s}px ${sp.ry * PH * s}px at ${c.x}px ${c.y}px, transparent 75%, black 100%)`;
          return g > 0 ? (
            <div
              key={`drain-${i}`}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 1080,
                height: CLIMB_H,
                backgroundColor: "rgb(128,128,128)",
                mixBlendMode: "saturation",
                opacity: g * 0.9,
                maskImage: hole,
                WebkitMaskImage: hole,
              }}
            />
          ) : null;
        })}
        {active.map(({ sp, p }, i) => {
          const c = toScreen(sp.fx, sp.fy, t);
          const write = interpolate(t, [sp.at, sp.at + 0.5], [0, 1], {
            ...clamp,
            easing: easeOut,
          });
          return (
            <div
              key={`spot-name-${i}`}
              style={{
                position: "absolute",
                left: c.x + (sp.dx ?? 0) - 300,
                top: c.y - sp.ry * PH * s - 70 + (sp.dy ?? 0),
                width: 600,
                textAlign: "center",
                fontFamily: hand,
                fontWeight: 700,
                fontSize: 86,
                lineHeight: 1,
                color: GOLD,
                opacity: p,
                textShadow: "0 4px 18px rgba(0,0,0,0.95)",
                clipPath: `inset(0 ${(1 - write) * 100}% 0 0)`,
                transform: "rotate(-4deg)",
              }}
            >
              {sp.name}
            </div>
          );
        })}
      </>
    );
  };

  // ---- A related artwork, framed, dropped over the scene ----
  const Pictures: React.FC<{ t: number }> = ({ t }) => (
    <>
      {all.map((d) => {
        const pic = d.picture;
        const at = pic ? wordAt(d.id, pic.word) : undefined;
        // Gone on its `until` word, or when the detail moves on.
        const until = Math.min(
          (pic?.until ? wordAt(d.id, pic.until) : undefined) ?? Infinity,
          leaveOf(d),
        );
        if (!pic || at === undefined || t < at - 0.05 || t > until) return null;
        const p = interpolate(t, [at - 0.05, at + 0.35], [0, 1], {
          ...clamp,
          easing: easeOut,
        });
        const out = interpolate(t, [until - 0.3, until], [1, 0], clamp);
        const w = pic.w ?? 660;
        const h = (w * pic.height) / pic.width;
        if (pic.paper) {
          // A print or a letter taped on: white border, tape, the caption in ink under it.
          const iw = w - 28;
          return (
            <div
              key={`pic-${d.id}`}
              style={{
                position: "absolute",
                left: pic.x ?? 540 - w / 2,
                top: pic.y ?? 360,
                width: w,
                opacity: p * out,
                transform: `translateY(${(1 - p) * -60}px) rotate(${-3 + (1 - p) * 8}deg) scale(${0.9 + 0.1 * p})`,
              }}
            >
              <div
                style={{
                  padding: "14px 14px 0",
                  background: "#F2EBDD",
                  boxShadow: "0 30px 60px rgba(0,0,0,0.7)",
                }}
              >
                <Img
                  src={staticFile(pic.src)}
                  style={{
                    display: "block",
                    width: iw,
                    height: (iw * pic.height) / pic.width,
                  }}
                />
                <div
                  style={{
                    padding: "8px 4px 12px",
                    textAlign: "center",
                    fontFamily: hand,
                    fontWeight: 700,
                    fontSize: 38,
                    lineHeight: 1,
                    color: INK,
                  }}
                >
                  {pic.caption}
                </div>
              </div>
              <Img
                src={staticFile("guide/tape.webp")}
                style={{
                  position: "absolute",
                  left: w / 2 - 80,
                  top: -26,
                  width: 160,
                  transform: "rotate(5deg)",
                  opacity: 0.9,
                }}
              />
            </div>
          );
        }
        return (
          <div
            key={`pic-${d.id}`}
            style={{
              position: "absolute",
              left: pic.x ?? 540 - w / 2 + 40,
              top: pic.y ?? 360,
              width: w,
              opacity: p * out,
              transform: `translateY(${(1 - p) * -60}px) rotate(${3 - (1 - p) * 8}deg) scale(${0.9 + 0.1 * p})`,
            }}
          >
            <div
              style={{
                padding: 14,
                background:
                  "linear-gradient(135deg, #D9B66E 0%, #8A6A2E 30%, #E3C27A 52%, #6B4B1C 78%, #B8924A 100%)",
                boxShadow:
                  "0 40px 70px rgba(0,0,0,0.75), inset 0 0 0 2px rgba(255,240,200,0.35)",
              }}
            >
              <Img
                src={staticFile(pic.src)}
                style={{
                  display: "block",
                  width: w - 28,
                  height: h - 28 * (pic.height / pic.width),
                  objectFit: "cover",
                }}
              />
            </div>
            <div
              style={{
                marginTop: 12,
                textAlign: "right",
                fontFamily: hand,
                fontWeight: 700,
                fontSize: 40,
                color: CREAM,
                textShadow: "0 3px 10px rgba(0,0,0,0.9)",
              }}
            >
              {pic.caption}
            </div>
          </div>
        );
      })}
    </>
  );

  // ---- Pencil lines converging on one figure ----
  const Rays: React.FC<{ t: number }> = ({ t }) => (
    <svg width={1080} height={1920} style={pencilStyle}>
      {all.flatMap((d) => {
        const r = d.rays;
        const at = r ? wordAt(d.id, r.word) : undefined;
        if (!r || at === undefined || t < at || t > leaveOf(d)) return [];
        const out = interpolate(
          t,
          [leaveOf(d) - 0.3, leaveOf(d)],
          [1, 0],
          clamp,
        );
        return r.from.map((from, i) => {
          const a = at + i * 0.12;
          const draw = interpolate(t, [a, a + 0.45], [0, 1], {
            ...clamp,
            easing: easeInOut,
          });
          const head = interpolate(t, [a + 0.4, a + 0.55], [0, 1], clamp);
          const o = toScreen(from.fx, from.fy, t);
          // The head stops on the ellipse round the figure, on the line from its centre to this figure.
          const ex = (from.fx - r.to.fx) * PW;
          const ey = (from.fy - r.to.fy) * PH;
          const k = 1 / Math.hypot(ex / (r.to.rx * PW), ey / (r.to.ry * PH));
          const tip = toScreen(
            r.to.fx + (ex * k) / PW,
            r.to.fy + (ey * k) / PH,
            t,
          );
          const len = Math.hypot(tip.x - o.x, tip.y - o.y);
          // Each line bends its own way.
          const bend = (rnd(i + 3) - 0.5) * 0.3 * len;
          const c = {
            x: (o.x + tip.x) / 2 - ((tip.y - o.y) / len) * bend,
            y: (o.y + tip.y) / 2 + ((tip.x - o.x) / len) * bend,
          };
          const ang = Math.atan2(tip.y - c.y, tip.x - c.x);
          const barb = (da: number) =>
            `M ${tip.x} ${tip.y} L ${tip.x - Math.cos(ang + da) * 30} ${tip.y - Math.sin(ang + da) * 30}`;
          return (
            <g key={`${d.id}-ray-${i}`} opacity={out}>
              <Pencil
                d={`M ${o.x} ${o.y} Q ${c.x} ${c.y} ${tip.x} ${tip.y}`}
                draw={draw}
                width={5}
              />
              <Pencil d={barb(0.45)} draw={head} width={5} />
              <Pencil d={barb(-0.45)} draw={head} width={5} />
            </g>
          );
        });
      })}
    </svg>
  );

  // ---- Collage shots: every beat's shots on the video clock, each lasting until the next one ----
  const timedShots: TimedShot[] = all.flatMap((d) => {
    const list = d.shots ?? [];
    const starts = list.map((s) => wordAt(d.id, s.word) ?? d.vo.at);
    return list.map((s, i) => {
      const start = starts[i];
      const end =
        (s.until ? wordAt(d.id, s.until) : undefined) ??
        starts[i + 1] ??
        leaveOf(d);
      let prev = start - 0.08;
      const times = s.layers.map((l) =>
        presentAtStart(l)
          ? start
          : (prev = (l.at ? wordAt(d.id, l.at) : undefined) ?? prev + 0.08),
      );
      // A tape's `strike`, a document's `cue`: the word a mark on the piece waits for.
      const strikes = s.layers.map((l) => {
        const word = "strike" in l ? l.strike : "cue" in l ? l.cue : undefined;
        return word ? wordAt(d.id, word) : undefined;
      });
      return {
        ...s,
        start,
        end,
        times,
        strikes,
        shakeAt: s.shake ? wordAt(d.id, s.shake) : undefined,
        last: i === list.length - 1 || !!s.until,
      };
    });
  });
  timedShots.forEach((s, i) => {
    const next = timedShots[i + 1];
    // Only across a short gap: a beat without shots in between keeps its painting.
    if (s.carry && next && next.start - s.end < 1.5)
      Object.assign(s, { end: next.start, last: false });
  });

  // ---- Archive photos cut in over the frame (a match cut on a figure, then plain cuts) ----
  // A collage's window: from its word to its `until` word (default: the end of the beat).
  const collageSpan = (d: (typeof all)[number]) => {
    const word = d.collage ? wordAt(d.id, d.collage.word) : undefined;
    if (!d.collage || word === undefined) return undefined;
    const start = word - (d.collage.early ?? 0);
    return {
      start,
      end: Math.min(
        (d.collage.until ? wordAt(d.id, d.collage.until) : undefined) ??
          Infinity,
        leaveOf(d),
      ),
    };
  };
  // While archive flashes or a collage replace the frame, the cut-out figure stands in front of them.
  const flashOn = (t: number) =>
    Math.max(
      0,
      ...all.flatMap((d) => {
        const list = d.flashes ?? [];
        const at = list.length ? wordAt(d.id, list[0].word) : undefined;
        const span = collageSpan(d);
        return [
          ...(at === undefined ? [] : [inOut(t, at, 0.35, leaveOf(d), 0.4)]),
          ...(span ? [inOut(t, span.start, 0.3, span.end, 0.45)] : []),
        ];
      }),
    );
  // Landing time of every collage piece: its word, or just after the previous one.
  const collageTimes = (d: (typeof all)[number]) => {
    const span = collageSpan(d);
    if (!d.collage || !span) return undefined;
    let prev = span.start - 0.14;
    return {
      ...span,
      times: d.collage.pieces.map(
        (pc) =>
          (prev = (pc.at ? wordAt(d.id, pc.at) : undefined) ?? prev + 0.14),
      ),
    };
  };
  // A torn collage: the jagged line where the frame rips, top to bottom as `p` goes 0 → 1 (screen px).
  const tearEdge = (x: number) =>
    Array.from({ length: 29 }, (_, i) => ({
      x: x + (rnd(i * 5 + 11) - 0.5) * 46 + (i / 28 - 0.5) * 120,
      y: (i / 28) * CLIMB_H,
    }));
  const tearClip = (x: number, p: number) => {
    const pts = tearEdge(x).filter((q) => q.y <= p * CLIMB_H);
    const y = p * CLIMB_H;
    return `polygon(1080px 0px, ${pts.map((q) => `${q.x.toFixed(1)}px ${q.y.toFixed(1)}px`).join(", ")}, ${(pts[pts.length - 1]?.x ?? x).toFixed(1)}px ${y.toFixed(1)}px, 1080px ${y.toFixed(1)}px)`;
  };
  // The open tear at time t, if any (the freeze stays on the torn side only: the other side keeps its colour).
  const tearAt = (t: number) => {
    for (const d of all) {
      const ct = d.collage?.tear !== undefined ? collageTimes(d) : undefined;
      if (ct && t >= ct.start && t <= ct.end)
        return {
          x: d.collage!.tear!,
          p: interpolate(t, [ct.start, ct.start + 0.6], [0, 1], {
            ...clamp,
            easing: easeInOut,
          }),
        };
    }
    return undefined;
  };
  const Piece: React.FC<{
    pc: CollagePiece;
    at: number;
    t: number;
    k: number;
    out: number;
    travel: number;
    strikeAt?: number;
  }> = ({ pc, at, t, k, out, travel, strikeAt }) => {
    const land = interpolate(t, [at, at + 0.32], [0, 1], {
      ...clamp,
      easing: easeOut,
    });
    const settle =
      t > at + 0.22
        ? Math.exp(-(t - at - 0.22) * 10) * Math.sin((t - at - 0.22) * 28)
        : 0; // a little bounce
    const far = 1 - pc.depth;
    const push = 1 + travel * k * pc.depth + 0.08 * out * pc.depth;
    const blur = (1 - land) * 8 * far + far * 1.2; // rack focus: far pieces land soft and stay a touch soft
    const dx = (pc.fly ?? 0) * k;
    const transform = `translate(${(pc.x + pc.w / 2 - 540) * (push - 1) + dx}px, ${(pc.y - 700) * (push - 1)}px) rotate(${(pc.rot ?? 0) + (1 - land) * 7 + settle * 2}deg) scale(${(1.25 - 0.25 * land + settle * 0.03) * push})`;
    const base: React.CSSProperties = {
      position: "absolute",
      left: pc.x,
      top: pc.y,
      width: pc.w,
      opacity: land,
      transform,
      filter: `blur(${blur}px)`,
    };
    if ("src" in pc)
      return (
        <Img
          src={staticFile(pc.src)}
          style={{
            ...base,
            height: "auto",
            maxWidth: "none",
            filter: `blur(${blur}px) drop-shadow(0 ${6 + 14 * pc.depth}px ${10 + 16 * pc.depth}px rgba(0,0,0,0.45))`,
          }}
        />
      );
    if ("tape" in pc)
      return (
        <div
          style={{
            ...base,
            width: "auto",
            padding: "6px 22px 2px",
            background: "#F2C230",
            boxShadow: "0 8px 16px rgba(0,0,0,0.35)",
            fontFamily: fellSC,
            fontWeight: 700,
            fontSize: pc.w,
            lineHeight: 1,
            color: INK,
            whiteSpace: "nowrap",
            clipPath: "polygon(1% 4%, 99% 0, 100% 92%, 0 100%)",
          }}
        >
          {pc.tape}
          {strikeAt !== undefined && t >= strikeAt ? (
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                overflow: "visible",
              }}
            >
              {/* Each stroke grows from its start (dashes break with a non-scaling stroke: the line came out dotted). */}
              {[
                [3, 30, 97, 72],
                [4, 74, 96, 26],
              ].map(([x1, y1, x2, y2], i) => {
                const p = interpolate(
                  t,
                  [strikeAt + i * 0.25, strikeAt + i * 0.25 + 0.25],
                  [0, 1],
                  { ...clamp, easing: easeInOut },
                );
                return p > 0 ? (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x1 + (x2 - x1) * p}
                    y2={y1 + (y2 - y1) * p}
                    stroke="#B3261E"
                    strokeWidth={6}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                ) : null;
              })}
            </svg>
          ) : null}
        </div>
      );
    if ("ghost" in pc)
      return (
        <div
          style={{
            ...base,
            width: "auto",
            fontFamily: fell,
            fontSize: pc.w,
            lineHeight: 0.8,
            color: "rgba(246,238,224,0.6)",
            whiteSpace: "nowrap",
          }}
        >
          {pc.ghost}
        </div>
      );
    if ("stamp" in pc)
      return (
        <div
          style={{
            ...base,
            width: "auto",
            opacity: land * 0.85,
            padding: "8px 18px",
            border: "5px solid #B3261E",
            borderRadius: 6,
            fontFamily: fellSC,
            fontWeight: 700,
            fontSize: pc.w,
            lineHeight: 1,
            color: "#B3261E",
            whiteSpace: "nowrap",
            mixBlendMode: "multiply",
            transform: `${transform} scale(${1 + (1 - land) * 0.6})`,
          }}
        >
          {pc.stamp}
        </div>
      );
    if ("disc" in pc)
      return (
        <div
          style={{
            ...base,
            height: pc.w,
            borderRadius: "50%",
            background: pc.disc,
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.12)",
          }}
        />
      );
    if ("stripes" in pc)
      return (
        <div
          style={{
            ...base,
            height: pc.stripes,
            background:
              "repeating-linear-gradient(-45deg, #B3261E 0 22px, #F2EBDD 22px 44px)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
          }}
        />
      );
    return (
      <svg
        width={1080}
        height={CLIMB_H}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          overflow: "visible",
          ...((pc.width ?? 5) > 20
            ? { filter: "blur(6px)", mixBlendMode: "multiply" as const }
            : {}),
        }}
      >
        <Pencil
          d={pc.pencil}
          draw={interpolate(t, [at, at + (pc.draw ?? 0.45)], [0, 1], {
            ...clamp,
            easing: easeInOut,
          })}
          color={pc.color ?? "#B3261E"}
          width={pc.width ?? 5}
        />
      </svg>
    );
  };
  // `over` pieces sit above the figure (labels on him); the rest are the world behind him.
  // Later collages first: a collage leaving as a turned page goes over the one it reveals.
  const Collage: React.FC<{ t: number; over?: boolean }> = ({
    t,
    over = false,
  }) => (
    <>
      {[...all].reverse().map((d) => {
        const ct = collageTimes(d);
        if (!d.collage || !ct || t < ct.start || t > ct.end) return null;
        const k = interpolate(t, [ct.start, ct.end], [0, 1], clamp); // the slow push across the whole collage
        const out = interpolate(t, [ct.end - 0.45, ct.end], [0, 1], {
          ...clamp,
          easing: easeIn,
        });
        const page = d.collage.outro === "page";
        const tear = d.collage.tear;
        const p = interpolate(t, [ct.start, ct.start + 0.6], [0, 1], {
          ...clamp,
          easing: easeInOut,
        });
        const pieces = d.collage.pieces.map((pc, i) =>
          !!pc.over === over && t >= ct.times[i] ? (
            <Piece
              key={i}
              pc={pc}
              at={ct.times[i]}
              t={t}
              k={k}
              out={page ? 0 : out}
              travel={d.collage!.push ?? 0.1}
              strikeAt={
                "tape" in pc && pc.strike ? wordAt(d.id, pc.strike) : undefined
              }
            />
          ) : null,
        );
        return (
          <div
            key={`collage-${d.id}-${over}`}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 1080,
              height: CLIMB_H,
              overflow: "hidden",
              // Pencil traces sit on the painting: they follow the camera's slow push (a zoom about the frame's centre).
              ...(page
                ? {
                    transformOrigin: "0 100%",
                    transform: `translateX(${-out * 1150}px) rotate(${-out * 12}deg)`,
                    boxShadow:
                      out > 0 ? "30px 0 60px rgba(0,0,0,0.5)" : undefined,
                  }
                : {
                    opacity: 1 - out,
                    filter: `blur(${out * 10}px)`,
                    transformOrigin: `540px ${CLIMB_H / 2}px`,
                    transform: `scale(${viewAt(t).z / (d.view?.z ?? viewAt(ct.start).z)})`,
                  }),
            }}
          >
            {tear !== undefined && !over ? (
              <>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    clipPath: tearClip(tear, p),
                  }}
                >
                  {pieces}
                </div>
                {/* The torn paper's white rim along the rip. */}
                <svg
                  width={1080}
                  height={CLIMB_H}
                  style={{ position: "absolute", left: 0, top: 0 }}
                >
                  <polyline
                    points={tearEdge(tear)
                      .filter((q) => q.y <= p * CLIMB_H)
                      .map((q) => `${q.x},${q.y}`)
                      .join(" ")}
                    fill="none"
                    stroke="rgba(0,0,0,0.35)"
                    strokeWidth={16}
                    strokeLinejoin="round"
                    transform="translate(-4 0)"
                  />
                  <polyline
                    points={tearEdge(tear)
                      .filter((q) => q.y <= p * CLIMB_H)
                      .map((q) => `${q.x},${q.y}`)
                      .join(" ")}
                    fill="none"
                    stroke="#F2EBDD"
                    strokeWidth={9}
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            ) : (
              pieces
            )}
            {over && d.collage.intro === "rip" ? (
              <Rip t={t} start={ct.start} />
            ) : null}
          </div>
        );
      })}
    </>
  );
  // The painting tears down the middle and its two halves fly apart, revealing the collage under it.
  const Rip: React.FC<{ t: number; start: number }> = ({ t, start }) => {
    const r = interpolate(t, [start, start + 0.8], [0, 1], {
      ...clamp,
      easing: easeIn,
    });
    if (r >= 1) return null;
    const a = toScreen(0, 0, t);
    const b = toScreen(1, 1, t);
    const edge = tearEdge(540);
    const left = `polygon(0px 0px, ${edge.map((q) => `${q.x.toFixed(1)}px ${q.y.toFixed(1)}px`).join(", ")}, 0px ${CLIMB_H}px)`;
    const half = (clip: string, dir: number) => (
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: clip,
          transformOrigin: `${540 + dir * 300}px ${CLIMB_H}px`,
          transform: `translateX(${dir * r * 760}px) rotate(${dir * r * 14}deg)`,
          filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.6))",
        }}
      >
        <Img
          src={SRC}
          style={{
            position: "absolute",
            left: a.x,
            top: a.y,
            width: b.x - a.x,
            height: b.y - a.y,
            maxWidth: "none",
          }}
        />
        <svg
          width={1080}
          height={CLIMB_H}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          <polyline
            points={edge.map((q) => `${q.x},${q.y}`).join(" ")}
            fill="none"
            stroke="#F2EBDD"
            strokeWidth={12}
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
    return (
      <>
        {half(left, -1)}
        {half(tearClip(540, 1), 1)}
      </>
    );
  };
  // Shots marked `figure` keep the cut-out in front of them too (the soldier standing before his war).
  const shotFigure = (t: number) =>
    Math.max(
      0,
      ...timedShots
        .filter((s) => s.figure)
        .map((s) => inOut(t, s.start, 0.3, s.end + 0.4, 0.4)),
    );
  const Figure: React.FC<{ t: number; on: number }> = ({ t, on }) => {
    const fg = cfg.figure;
    if (!fg || on <= 0) return null;
    const a = toScreen(fg.x, fg.y, t);
    const b = toScreen(fg.x + fg.w, fg.y + fg.h, t);
    return (
      <Img
        src={staticFile(fg.src)}
        style={{
          position: "absolute",
          left: a.x,
          top: a.y,
          width: b.x - a.x,
          height: b.y - a.y,
          maxWidth: "none",
          opacity: on,
        }}
      />
    );
  };
  // Archive photos fade out at their edges: smaller than the frame, they must never show a hard border.
  const FEATHER =
    "radial-gradient(ellipse 50% 50% at 50% 50%, black 70%, transparent 100%)";
  const Flashes: React.FC<{ t: number }> = ({ t }) => (
    <>
      {all.flatMap((d) =>
        (d.flashes ?? []).map((fl, i, list) => {
          const at = wordAt(d.id, fl.word);
          if (at === undefined) return null;
          const next = list[i + 1]
            ? (wordAt(d.id, list[i + 1].word) ?? leaveOf(d))
            : Math.min(
                (fl.until ? wordAt(d.id, fl.until) : undefined) ?? Infinity,
                leaveOf(d),
              );
          // Each photo stays under the next one's fade-in; the last one dissolves back into the painting.
          const end = i < list.length - 1 ? next + 0.35 : next;
          if (t < at || t > end) return null;
          const p = interpolate(t, [at, at + 0.35], [0, 1], {
            ...clamp,
            easing: easeInOut,
          });
          const out =
            i === list.length - 1
              ? interpolate(t, [end - 0.4, end], [1, 0], clamp)
              : 1;
          const s = scaleAt(t, viewAt(t).z);
          const H =
            fl.h *
            PH *
            s *
            (1 + 0.04 * interpolate(t, [at, end], [0, 1], clamp)); // a slow push
          const W = (H * fl.width) / fl.height;
          const c = toScreen(fl.fx, fl.fy, t);
          return (
            <div
              key={`${d.id}-flash-${i}`}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 1080,
                height: CLIMB_H,
                overflow: "hidden",
                opacity: p * out,
              }}
            >
              <Img
                src={staticFile(fl.src)}
                style={{
                  position: "absolute",
                  left: c.x - fl.ax * W,
                  top: c.y - fl.ay * H,
                  width: W,
                  height: H,
                  maxWidth: "none",
                  filter: "grayscale(1) contrast(1.08)",
                  maskImage: FEATHER,
                  WebkitMaskImage: FEATHER,
                }}
              />
            </div>
          );
        }),
      )}
    </>
  );

  // ---- Portraits taped over a figure, faster and faster, then blown away ----
  const Portraits: React.FC<{ t: number }> = ({ t }) => (
    <>
      {all.map((d) => {
        const pr = d.portraits;
        const at = pr ? wordAt(d.id, pr.word) : undefined;
        if (!pr || at === undefined || t < at) return null;
        const until =
          (pr.until ? wordAt(d.id, pr.until) : undefined) ?? leaveOf(d);
        if (t > until + 0.7) return null;
        const c = toScreen(pr.fx, pr.fy, t);
        let a = at;
        const times = pr.srcs.map((_, i) => {
          const x = a;
          a += Math.max(0.1, 0.55 * 0.78 ** i);
          return x;
        });
        return (
          <div
            key={`portraits-${d.id}`}
            style={{ position: "absolute", inset: 0 }}
          >
            {pr.srcs.map((src, i) => {
              if (t < times[i]) return null;
              const land = interpolate(t, [times[i], times[i] + 0.18], [0, 1], {
                ...clamp,
                easing: easeOut,
              });
              const away = interpolate(
                t,
                [until + i * 0.02, until + 0.5 + i * 0.02],
                [0, 1],
                { ...clamp, easing: easeIn },
              );
              const dx = (rnd(i * 7 + 1) - 0.5) * pr.w * 0.9;
              const dy =
                (rnd(i * 7 + 2) - 0.5) * pr.w * 1.1 -
                away * (500 + 300 * rnd(i * 7 + 4));
              const tilt =
                (rnd(i * 7 + 3) - 0.5) * 18 +
                away * 40 * (rnd(i * 7 + 5) - 0.5);
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: c.x + dx - pr.w / 2,
                    top: c.y + dy - pr.w * 0.62,
                    width: pr.w,
                    padding: 10,
                    background: "#F2EBDD",
                    boxShadow: "0 18px 34px rgba(0,0,0,0.6)",
                    opacity: land * (1 - away),
                    transform: `rotate(${tilt}deg) scale(${1.35 - 0.35 * land})`,
                  }}
                >
                  <Img
                    src={staticFile(src)}
                    style={{
                      display: "block",
                      width: pr.w - 20,
                      height: (pr.w - 20) * 1.2,
                      objectFit: "cover",
                      objectPosition: "50% 20%",
                      filter: "grayscale(1) sepia(0.25)",
                    }}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );

  // ---- Freeze: the world loses its colour around one figure ----
  const fz = cfg.freeze;
  const spreadDur = fz?.spread ? (fz.spread.dur ?? 1.4) : 0;
  const freezeAt = (t: number) =>
    fz
      ? inOut(
          t,
          cue(fz.from),
          0.5,
          cue(fz.to) + Math.max(0.6, spreadDur + 0.3),
          0.6,
        )
      : 0;
  const Freeze: React.FC<{ t: number }> = ({ t }) => {
    const g = freezeAt(t);
    if (!fz || g <= 0) return null;
    const c = toScreen(fz.fx, fz.fy, t);
    const s = scaleAt(t, viewAt(t).z);
    // The returning wave: a soft-edged circle growing from the spread point until it covers the frame.
    const w = fz.spread ? toScreen(fz.spread.fx, fz.spread.fy, t) : c;
    const r = fz.spread
      ? interpolate(t, [cue(fz.to), cue(fz.to) + spreadDur], [0, 2600], {
          ...clamp,
          easing: easeInOut,
        })
      : 0;
    const hole =
      r > 0
        ? `radial-gradient(circle ${r}px at ${w.x}px ${w.y}px, transparent ${Math.max(0, r - 320)}px, black ${r}px)`
        : `radial-gradient(ellipse ${fz.rx * PW * s}px ${fz.ry * PH * s}px at ${c.x}px ${c.y}px, transparent 70%, black 100%)`;
    const tear = tearAt(t);
    return (
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: CLIMB_H,
          backgroundColor: "rgb(128,128,128)",
          mixBlendMode: "saturation",
          opacity: g * 0.92,
          maskImage: hole,
          WebkitMaskImage: hole,
          clipPath: tear ? tearClip(tear.x, 1) : undefined,
        }}
      />
    );
  };

  // ---- The cover: the printed object on a table, the camera diving into its painting (and back out to loop) ----
  const cover = cfg.cover;
  const coverP = (t: number) => {
    if (!cover) return 1;
    const sa = wordAt("hook", cover.word) ?? 1;
    if (cfg.loop && t >= LOOP_AT)
      return interpolate(t, [LOOP_AT, END - 1 / FPS], [1, 0], {
        ...clamp,
        easing: easeInOut,
      });
    return interpolate(t, [sa - 0.55, sa], [0, 1], {
      ...clamp,
      easing: easeInOut,
    });
  };
  const CoverLayer: React.FC<{ t: number }> = ({ t }) => {
    const p = coverP(t);
    if (!cover || p >= 1) return null;
    const pr = cover.painting;
    // Where the painting is on screen right now: the cover's painting lands exactly on it.
    const a = toScreen(0, 0, t);
    const b = toScreen(1, 1, t);
    const target = { w: b.x - a.x, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 };
    const CW0 = 620; // the cover's width lying on the table
    const CH0 = (CW0 * cover.height) / cover.width;
    const pw0 = CW0 * pr.w;
    const pw = Math.exp(
      Math.log(pw0) + (Math.log(target.w) - Math.log(pw0)) * p,
    );
    const k = (pw - pw0) / (target.w - pw0); // the centre travels with the scale, so the dive stays straight
    const start = {
      cx: 540 + (pr.x + pr.w / 2 - 0.5) * CW0,
      cy: 780 + (pr.y + pr.h / 2 - 0.5) * CH0,
    };
    const cx = start.cx + (target.cx - start.cx) * k;
    const cy = start.cy + (target.cy - start.cy) * k;
    const CW = pw / pr.w;
    const CH = (CW * cover.height) / cover.width;
    const left = cx - (pr.x + pr.w / 2) * CW;
    const top = cy - (pr.y + pr.h / 2) * CH;
    const table = interpolate(p, [0.8, 1], [1, 0], clamp);
    return (
      <AbsoluteFill style={{ perspective: 1800 }}>
        <AbsoluteFill
          style={{
            opacity: table,
            background:
              "radial-gradient(ellipse 620px 760px at 540px 760px, rgba(255,206,140,0.26), transparent 72%), repeating-linear-gradient(90deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 268px, rgba(0,0,0,0.45) 270px, rgba(0,0,0,0) 273px), repeating-linear-gradient(91deg, rgba(255,230,190,0.04) 0px, rgba(0,0,0,0.1) 5px, rgba(255,230,190,0.03) 9px, rgba(0,0,0,0.06) 15px), linear-gradient(180deg, #3A2414 0%, #2B190D 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left,
            top,
            width: CW,
            height: CH,
            transformOrigin: `${(pr.x + pr.w / 2) * CW}px ${(pr.y + pr.h / 2) * CH}px`,
            transform: `rotateX(${16 * (1 - k)}deg) rotateZ(${-3 * (1 - k)}deg)`,
            boxShadow: `0 ${40 * (1 - k)}px ${70 * (1 - k)}px rgba(0,0,0,${0.7 * table})`,
            opacity: interpolate(p, [0.93, 1], [1, 0], clamp),
          }}
        >
          <Img src={staticFile(cover.src)} style={full} />
          <Img
            src={SRC}
            style={{
              position: "absolute",
              left: pr.x * CW,
              top: pr.y * CH,
              width: pr.w * CW,
              height: pr.h * CH,
              maxWidth: "none",
            }}
          />
        </div>
      </AbsoluteFill>
    );
  };

  // ---- Socrates' questions: hand-drawn "?" drift up and out, one after another ----
  const Questions: React.FC<{ t: number }> = ({ t }) => (
    <>
      {all.map((d) => {
        const q = d.questions;
        const at = q ? wordAt(d.id, q.word) : undefined;
        if (!q || at === undefined || t < at || t > leaveOf(d)) return null;
        const o = toScreen(q.fx, q.fy, t);
        const out = interpolate(
          t,
          [leaveOf(d) - 0.3, leaveOf(d)],
          [1, 0],
          clamp,
        );
        return (
          <div
            key={`q-${d.id}`}
            style={{ position: "absolute", inset: 0, opacity: out }}
          >
            {[-1, 0.4, -0.3, 1, -0.8, 0.7].map((dir, i) => {
              const a = at + i * 0.28;
              const life = interpolate(t, [a, a + 1.6], [0, 1], clamp);
              if (t < a || life >= 1) return null;
              const pop = interpolate(t, [a, a + 0.18], [0, 1], {
                ...clamp,
                easing: easeOut,
              });
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: o.x + dir * (60 + 160 * life) - 30,
                    top: o.y - 60 - 260 * life,
                    fontFamily: hand,
                    fontWeight: 700,
                    fontSize: 70 + (i % 3) * 16,
                    color: i % 2 ? GOLD : CREAM,
                    opacity: pop * (1 - life * life),
                    transform: `rotate(${dir * 18 * life}deg) scale(${0.5 + 0.5 * pop})`,
                    textShadow: "0 4px 12px rgba(0,0,0,0.8)",
                  }}
                >
                  ?
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );

  // ---- Water poured out: a stream from the lip to the ground, splashing, then soaking in ----
  // Drawn in painting px over the freeze, so the water keeps its colour while the world turns grey.
  const Pour: React.FC<{ t: number }> = ({ t }) => (
    <>
      {all.map((d) => {
        const pr = d.pour;
        const at = pr ? wordAt(d.id, pr.word) : undefined;
        if (!pr || at === undefined || t < at || t > leaveOf(d)) return null;
        const FALL = 0.35; // seconds for the water to reach the ground
        const stop = leaveOf(d) - 1; // the last water leaves the lip
        const a = { x: pr.from.fx * PW, y: pr.from.fy * PH };
        const b = { x: pr.to.fx * PW, y: pr.to.fy * PH };
        const head = interpolate(t, [at, at + FALL], [0, 1], {
          ...clamp,
          easing: easeIn,
        });
        const tail = interpolate(t, [stop, stop + FALL], [0, 1], {
          ...clamp,
          easing: easeIn,
        });
        // Thrown off the lip, then falling: a parabola, trembling a little; the stream breaks into drops near the ground.
        const BREAK = 0.72;
        const pt = (u: number) => ({
          x:
            a.x +
            (b.x - a.x) * Math.sqrt(u) +
            Math.sin(t * 21 + u * 11) * 0.7 * u,
          y: a.y + (b.y - a.y) * u,
        });
        const half = (u: number) => 3.4 - 2.4 * u; // wide at the lip, thin as it falls
        const u0 = tail;
        const u1 = Math.min(head, BREAK);
        const us = Array.from(
          { length: 25 },
          (_, k) => u0 + ((u1 - u0) * k) / 24,
        );
        const edge = (side: number) =>
          us.map(
            (u) =>
              `${(pt(u).x + side * half(u)).toFixed(2)},${pt(u).y.toFixed(2)}`,
          );
        const line = (from: number, to: number, side: number) =>
          Array.from({ length: 13 }, (_, k) => from + ((to - from) * k) / 12)
            .map(
              (u, k) =>
                `${k ? "L" : "M"} ${(pt(u).x + side * half(u)).toFixed(2)} ${pt(u).y.toFixed(2)}`,
            )
            .join(" ");
        // Splashes while the water hits the ground: drops thrown up and out, falling back.
        const drops = Array.from(
          { length: Math.ceil((stop - at) / 0.04) },
          (_, k) => ({ k, from: at + FALL + k * 0.04 }),
        ).filter(({ from }) => t >= from && t < from + 0.5);
        // The wet patch grows while it pours, then the ground drinks it.
        const wet = interpolate(t, [at + FALL, stop + FALL], [0, 1], {
          ...clamp,
          easing: easeOut,
        });
        const soak = interpolate(
          t,
          [stop + FALL, stop + FALL + 1],
          [1, 0.3],
          clamp,
        );
        const o = toScreen(0, 0, t);
        const s = scaleAt(t, viewAt(t).z);
        return (
          <div
            key={`pour-${d.id}`}
            style={{
              position: "absolute",
              left: o.x,
              top: o.y,
              width: PW,
              height: PH,
              transformOrigin: "0 0",
              transform: `scale(${s})`,
            }}
          >
            <svg
              width={PW}
              height={PH}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                overflow: "visible",
              }}
            >
              <defs>
                <linearGradient
                  id={`pour-g-${d.id}`}
                  x1="0"
                  y1={a.y}
                  x2="0"
                  y2={b.y}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#D9F0FF" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#6FB6E8" stopOpacity={0.85} />
                </linearGradient>
                <filter id={`pour-soft-${d.id}`}>
                  <feGaussianBlur stdDeviation={1.4} />
                </filter>
              </defs>
              <ellipse
                cx={b.x}
                cy={b.y}
                rx={28 * wet}
                ry={7 * wet}
                fill="#1E3A52"
                opacity={0.6 * soak}
                filter={`url(#pour-soft-${d.id})`}
              />
              <ellipse
                cx={b.x - 3}
                cy={b.y - 1}
                rx={14 * wet}
                ry={3 * wet}
                fill="#BFE3FA"
                opacity={0.6 * Math.max(0, (soak - 0.3) / 0.7)}
              />
              {u1 > u0 ? (
                <>
                  <polygon
                    points={[...edge(-1), ...edge(1).reverse()].join(" ")}
                    fill={`url(#pour-g-${d.id})`}
                    stroke="rgba(20,50,80,0.45)"
                    strokeWidth={0.35}
                  />
                  <path
                    d={line(u0, u1, -0.45)}
                    fill="none"
                    stroke="white"
                    strokeWidth={0.6}
                    strokeDasharray="9 15"
                    strokeDashoffset={-t * 160}
                    strokeLinecap="round"
                    opacity={0.75}
                  />
                </>
              ) : null}
              {head > BREAK
                ? // Drops of uneven sizes: two dash rhythms that never line up.
                  [
                    { w: 2.6, dash: "1.2 7", v: 210 },
                    { w: 1.6, dash: "0.1 4.3", v: 260 },
                  ].map((r) => (
                    <path
                      key={r.dash}
                      d={line(Math.max(u0, BREAK), head, 0)}
                      fill="none"
                      stroke="#9FD3F5"
                      strokeWidth={r.w}
                      strokeDasharray={r.dash}
                      strokeDashoffset={-t * r.v}
                      strokeLinecap="round"
                    />
                  ))
                : null}
              {drops.map(({ k, from }) => {
                const u = t - from;
                const vx = (rnd(k * 3 + 1) - 0.5) * 130;
                const vy = -(34 + rnd(k * 3 + 2) * 50);
                return (
                  <circle
                    key={k}
                    cx={b.x + vx * u}
                    cy={b.y + vy * u + 0.5 * 300 * u * u}
                    r={0.8 + rnd(k * 3 + 3) * 1.5}
                    fill="#BFE3FA"
                    stroke="rgba(20,50,80,0.35)"
                    strokeWidth={0.2}
                    opacity={interpolate(u, [0.32, 0.5], [1, 0], clamp)}
                  />
                );
              })}
            </svg>
          </div>
        );
      })}
    </>
  );

  // ---- Heraclitus' tear: a glossy drop forms under the eye and runs down the cheek ----
  const Tears: React.FC<{ t: number }> = ({ t }) => (
    <>
      {all.map((d) => {
        const tr = d.tear;
        const at = tr ? wordAt(d.id, tr.word) : undefined;
        if (!tr || at === undefined || t < at + 0.3 || t > leaveOf(d))
          return null;
        // Painting px. A drop every 0.4 s, eyes in turn: it wells up under the lid, then slides down the cheek leaving
        // a wet trail. Big enough to read at a glance on a phone.
        const drops = Array.from(
          { length: Math.max(1, Math.ceil((leaveOf(d) - at - 0.3) / 0.4)) },
          (_, k) => ({
            k,
            eye: tr.eyes[k % tr.eyes.length],
            from: at + 0.3 + k * 0.4,
          }),
        );
        return (
          <svg
            key={`tear-${d.id}`}
            width={PW}
            height={PH}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              overflow: "visible",
              opacity:
                1 -
                interpolate(t, [leaveOf(d) - 0.3, leaveOf(d)], [0, 1], clamp),
            }}
          >
            <defs>
              <radialGradient id={`tear-g-${d.id}`} cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.95} />
                <stop offset="45%" stopColor="#E6F1F8" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#A9C6DA" stopOpacity={0.45} />
              </radialGradient>
            </defs>
            {drops.map(({ k, eye, from }) => {
              if (t < from) return null;
              const form = interpolate(t, [from, from + 0.3], [0, 1], {
                ...clamp,
                easing: easeOut,
              });
              const run = interpolate(t, [from + 0.3, from + 1.2], [0, 1], {
                ...clamp,
                easing: easeIn,
              });
              const x = eye.fx * PW + Math.sin(run * 2.4 + k) * 0.35; // follows the cheek, not a ruler
              const y0 = eye.fy * PH;
              const r = 1.25 * form;
              const y = y0 + 1.8 * r + tr.drop * PH * run; // the drop hangs from the lid while it forms
              const gone = interpolate(run, [0.85, 1], [1, 0], clamp);
              return (
                <g key={k}>
                  <line
                    x1={eye.fx * PW}
                    y1={y0}
                    x2={x}
                    y2={y}
                    stroke="rgba(240,248,255,0.4)"
                    strokeWidth={0.8}
                    strokeLinecap="round"
                  />
                  <g opacity={gone}>
                    <path
                      d={`M ${x} ${y - r * 1.9} Q ${x + r * 1.05} ${y - r * 0.2} ${x} ${y + r} Q ${x - r * 1.05} ${y - r * 0.2} ${x} ${y - r * 1.9} Z`}
                      fill={`url(#tear-g-${d.id})`}
                      stroke="rgba(40,30,25,0.45)"
                      strokeWidth={0.18}
                    />
                    <circle
                      cx={x - r * 0.3}
                      cy={y - r * 0.25}
                      r={r * 0.25}
                      fill="white"
                      opacity={0.95 * form}
                    />
                  </g>
                </g>
              );
            })}
          </svg>
        );
      })}
    </>
  );

  // ---- Light swelling over a region (screen blend) ----
  const Shines: React.FC<{ t: number }> = ({ t }) => (
    <>
      {all.flatMap((d) =>
        (d.shine ?? []).map((g, i) => {
          const at = wordAt(d.id, g.word);
          if (at === undefined || t < at - 0.1 || t > leaveOf(d)) return null;
          const p = inOut(t, at - 0.1, 0.7, leaveOf(d), 0.3);
          const c = toScreen(g.fx, g.fy, t);
          const s = scaleAt(t, viewAt(t).z);
          const rx = g.rx * PW * s;
          const ry = g.ry * PH * s;
          return (
            <div
              key={`shine-${d.id}-${i}`}
              style={{
                position: "absolute",
                left: c.x - rx,
                top: c.y - ry,
                width: 2 * rx,
                height: 2 * ry,
                opacity: p,
                mixBlendMode: g.tint ? "multiply" : "screen",
                background: g.tint
                  ? `radial-gradient(closest-side, ${g.tint} 60%, transparent 100%)`
                  : "radial-gradient(closest-side, rgba(255,236,190,0.75), rgba(255,226,160,0.3) 55%, rgba(255,220,150,0) 100%)",
              }}
            />
          );
        }),
      )}
    </>
  );

  // ---- A wink: the painted lid closes and opens ----
  const Wink: React.FC<{ t: number }> = ({ t }) => (
    <>
      {all.map((d) => {
        const w = d.wink;
        const at = w ? wordAt(d.id, w.word) : undefined;
        if (!w || at === undefined || t < at || t > at + 1.2) return null;
        const close = interpolate(
          t,
          [at, at + 0.1, at + 0.32, at + 0.45],
          [0, 1, 1, 0],
          clamp,
        );
        // Painting px (magnified with the painting).
        const cx = w.fx * PW;
        const cy = w.fy * PH;
        const rx = w.rx * PW;
        const ry = w.ry * PH;
        return (
          <svg
            key={`wink-${d.id}`}
            width={PW}
            height={PH}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              overflow: "visible",
            }}
          >
            <defs>
              <filter
                id={`wink-soft-${d.id}`}
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation={rx * 0.1} />
              </filter>
            </defs>
            {close > 0 ? (
              <g transform={`translate(${cx} ${cy - ry})`}>
                {/* The lid comes down from the brow line: a skin-coloured half-ellipse with a dark crease at its edge. */}
                <ellipse
                  cx={0}
                  cy={0}
                  rx={rx * 1.25}
                  ry={ry * 2 * close}
                  fill={w.skin}
                  filter={`url(#wink-soft-${d.id})`}
                />
                <path
                  d={`M ${-rx * 1.15} ${ry * 2 * close - ry * 0.15} Q 0 ${ry * 2 * close + ry * 0.55} ${rx * 1.15} ${ry * 2 * close - ry * 0.15}`}
                  stroke="rgba(60,32,22,0.85)"
                  strokeWidth={ry * 0.35}
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            ) : null}
          </svg>
        );
      })}
    </>
  );

  // ---- Type ----
  const rise = (t: number, at: number) => {
    const p = interpolate(t, [at, at + 0.45], [0, 1], {
      ...clamp,
      easing: easeOut,
    });
    return {
      opacity: p,
      transform: `translateY(${(1 - p) * 40}px)`,
      display: "inline-block",
      whiteSpace: "pre" as const,
    };
  };
  const Words: React.FC<{
    t: number;
    at: number;
    text: string;
    style?: React.CSSProperties;
  }> = ({ t, at, text, style }) => (
    <span style={style}>
      {text.split(" ").map((w, i) => (
        <span key={i} style={rise(t, at + i * 0.06)}>
          {w}{" "}
        </span>
      ))}
    </span>
  );

  const Title: React.FC<{ t: number }> = ({ t }) => {
    // Gone with the hook (it must not sit over the painting for long), or before the first collage covers the frame.
    const firstCollage = Math.min(
      ...all.map((d) => collageSpan(d)?.start ?? Infinity),
      timedShots[0]?.start ?? Infinity,
    );
    const until = Math.min(context.at, firstCollage + 0.2);
    const out = interpolate(t, [until - 0.3, until], [1, 0], clamp);
    if (out <= 0) return null;
    // One line inside the frame: a long title ("Rue de Paris, temps de pluie.") gets smaller type (IM Fell ≈ 0.39 em a
    // character), never a second line over the painting.
    const titleSize = Math.min(
      112,
      Math.round(
        1000 / (0.39 * (cfg.title[0].length + cfg.title[1].length + 1)),
      ),
    );
    return (
      <div style={{ opacity: out }}>
        <div
          style={{
            position: "absolute",
            left: 64,
            top: 132,
            fontFamily: fellSC,
            fontSize: 24,
            letterSpacing: "0.14em",
            color: "rgba(244,235,221,0.65)",
          }}
        >
          <Words t={t} at={0.5} text={cfg.header} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 168,
            fontFamily: fell,
            fontSize: titleSize,
            lineHeight: 1,
            color: CREAM,
            whiteSpace: "nowrap",
          }}
        >
          <Words t={t} at={0.6} text={cfg.title[0]} />
          <Words
            t={t}
            at={0.75}
            text={cfg.title[1]}
            style={{ fontStyle: "italic", color: GOLD }}
          />
        </div>
      </div>
    );
  };

  // ---- Speech bubble: one sentence at a time, spoken words in ink, the rest faded ----
  const captionGroups = voiceLines.flatMap((line) => {
    const ws = words.filter((w) => w.segment === line.id);
    const groups: TimedWord[][] = [];
    let current: TimedWord[] = [];
    ws.forEach((w, i) => {
      // A lone closing mark (» after a quote) stays with the sentence it closes, never in a bubble of its own.
      if (
        !/[\p{L}\p{N}]/u.test(w.text) &&
        current.length === 0 &&
        groups.length > 0
      ) {
        groups[groups.length - 1].push(w);
        return;
      }
      current.push(w);
      const chars = current.reduce((n, x) => n + x.text.length + 1, 0);
      if (
        /[.?!…]$/.test(w.text) ||
        (/[,:]$/.test(w.text) && chars > 30) ||
        chars > 62 ||
        i === ws.length - 1
      ) {
        groups.push(current);
        current = [];
      }
    });
    return groups;
  });

  const Bubble: React.FC<{ t: number }> = ({ t }) => {
    const gi = captionGroups.findIndex((g, i) => {
      const next = captionGroups[i + 1];
      return (
        t >= g[0].at - 0.08 &&
        t <
          Math.min(
            next ? next[0].at - 0.08 : Infinity,
            g[g.length - 1].until + 0.5,
          )
      );
    });
    if (gi < 0) return null;
    const group = captionGroups[gi];
    const mouth = mouthAt(t, beats, BASELINE);
    // The app's hand-drawn paper bubble (frontend/public/guide/bubble-rect.webp): its tail sits bottom-right; it is
    // mirrored when the speaker stands on the left, and flipped upside down so the tail points up to his mouth.
    const fontSize = 46;
    // Beside the Guide, in the dark band under the painting (the painting above stays clear);
    // right edge ≤ 975: clear of the platforms' like/comment/share column.
    const L = 415;
    const W = 975 - L;
    const chars = group.reduce((n, w) => n + w.text.length + 1, 0);
    const lines = Math.max(
      1,
      Math.ceil((chars * fontSize * 0.43) / (W * 0.84)),
    );
    const textH = lines * fontSize * 1.02;
    const H = Math.max(textH / 0.64, 200); // text area = 64 % of the art (paper border + tail); never a thin strip
    const top = CLIMB_H - 15;
    const pop = interpolate(
      t,
      [group[0].at - 0.08, group[0].at + 0.14],
      [0.8, 1],
      { ...clamp, easing: easeOut },
    );
    const mirror = mouth.x < L + W / 2;
    const tail = { x: mirror ? L + W * 0.12 : L + W * 0.88, y: top };
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: `${tail.x}px ${tail.y}px`,
          transform: `scale(${pop}) rotate(${(1 - pop) * (mirror ? -12 : 12)}deg)`,
          opacity: interpolate(pop, [0.8, 0.92], [0, 1], clamp),
        }}
      >
        <Img
          src={staticFile("guide/bubble-speech.webp")}
          style={{
            position: "absolute",
            left: L,
            top,
            width: W,
            height: H,
            transform: `scaleX(${mirror ? -1 : 1}) scaleY(-1)`,
            filter: "drop-shadow(0 16px 26px rgba(0,0,0,0.45))",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: L + W * 0.08,
            top: top + H * 0.28,
            width: W * 0.84,
            height: H * 0.64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontFamily: hand,
            fontSize,
            fontWeight: 700,
            lineHeight: 1.02,
            color: INK,
          }}
        >
          <div>
            {group.map((w, i) => (
              <span key={i} style={{ opacity: t >= w.at ? 1 : 0.3 }}>
                {w.text}{" "}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const winkAt =
    all
      .map((d) => (d.wink ? wordAt(d.id, d.wink.word) : undefined))
      .find((x) => x !== undefined) ?? 1e6;
  const musicVolume = (frame: number) => {
    const t = frame / FPS;
    if (t >= winkAt) return 0; // the music stops dead on the wink
    const speaking = Math.max(
      0,
      ...voiceLines.map((l) =>
        interpolate(
          t,
          [l.at - 0.3, l.at, l.end, l.end + 0.3],
          [0, 1, 1, 0],
          clamp,
        ),
      ),
    );
    // While the world is frozen the music stops only if a heartbeat takes over; alone, it just dips (a silence then a
    // jump back read as a bug: Alexander).
    const dip = freezeAt(t) * (cfg.heart ? 1 : 0.55);
    return (
      interpolate(speaking, [0, 1], [0.3, 0.12]) *
      interpolate(t, [END - 1.5, END], [1, 0], clamp) *
      (1 - dip)
    );
  };

  // Sound beds: the courtyard (clear, then muffled while frozen) and the heartbeat, looped, on the video clock.
  const amb = cfg.ambience;
  const AMB_AT = cue(amb?.from);
  const muffledAt = (t: number) =>
    amb?.muffle ? inOut(t, cue(amb.muffle), 0.3, cue(amb.clear) + 0.5, 0.5) : 0;
  const ambBase = (t: number) =>
    (amb?.volume ?? 0.5) *
    interpolate(t, [AMB_AT, AMB_AT + 1.2], [0, 1], clamp) *
    interpolate(t, [END - 1.5, END], [1, 0], clamp);
  const heart = cfg.heart;
  const HEART_AT = cue(heart?.from);
  const HEART_END = cue(heart?.to) + 0.6;

  // Sound variants in public/sfx/accents: take("pencil", i) cycles through pencil-1…4 so repeats never sound identical.
  const TAKES = { swish: 4, pencil: 4, page: 3 } as const;
  const take = (kind: keyof typeof TAKES, i: number) =>
    `sfx/accents/${kind}-${(i % TAKES[kind]) + 1}.wav`;

  const Sfx: React.FC<{ file: string; at: number; volume?: number }> = ({
    file,
    at,
    volume = 1,
  }) =>
    getStaticFiles().some((s) => s.name === file) ? (
      <Sequence from={Math.max(0, f(at))} layout="none" name={file}>
        <Audio src={staticFile(file)} volume={volume} />
      </Sequence>
    ) : null;

  const Inner = () => {
    const frame = useCurrentFrame();
    const t = frame / FPS;

    return (
      <AbsoluteFill style={{ backgroundColor: WALL, overflow: "hidden" }}>
        {/* Wall: museum spotlight on the painting, a floor for the Guide */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 760px 900px at 540px ${BY + PH * 0.45}px, rgba(255,214,150,0.16), transparent 70%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1500,
            bottom: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 8%, rgba(0,0,0,0.55) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1512,
            height: 2,
            backgroundColor: "rgba(244,235,221,0.06)",
          }}
        />

        <Frame t={t} />
        <Freeze t={t} />
        <Pour t={t} />
        <Flashes t={t} />
        <Collage t={t} />
        <Figure t={t} on={flashOn(t)} />
        <Collage t={t} over />
        {/* Full-screen climb: shade the top (headings) and bottom (Guide, bubble) so they read over the painting. */}
        {immAt(t) > 0 ? (
          <AbsoluteFill
            style={{
              opacity: immAt(t),
              background: `linear-gradient(180deg, rgba(12,14,10,0.82) 0px, rgba(12,14,10,0.3) 380px, rgba(12,14,10,0) 560px, rgba(12,14,10,0) ${CLIMB_H - 260}px, ${WALL} ${CLIMB_H}px, ${WALL} 1920px)`,
            }}
          />
        ) : null}
        <RoomLayer t={t} />
        <Spots t={t} />
        <OtherWall t={t} />
        <Arrows t={t} />
        <Glows t={t} />
        <Tags t={t} />
        <Shines t={t} />
        <Questions t={t} />
        <Rays t={t} />
        <Pictures t={t} />
        <Portraits t={t} />
        <Notes t={t} />
        {/* Collage shots replace the frame: above every mark on the painting (spots, loops, notes). */}
        <Shots shots={timedShots} t={t} palette={cfg.palette} />
        <Figure t={t} on={shotFigure(t)} />
        <CoverLayer t={t} />
        <Title t={t} />
        <Guide t={t} beats={beats} onsets={onsets} baseline={BASELINE} />
        <Bubble t={t} />

        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 50% 45%, transparent 60%, rgba(0,0,0,0.5) 100%)",
          }}
        />
        <Grain opacity={0.05} blend="screen" />

        <Audio
          src={staticFile(cfg.music ?? "music/gymnopedie-1.mp3")}
          volume={musicVolume}
        />
        {voiceLines.map((line) => (
          <Sequence
            key={line.id}
            from={f(line.at)}
            durationInFrames={f(line.end - line.at) + 6}
            layout="none"
            name={`voice ${line.id}`}
          >
            <Audio src={staticFile(cfg.voiceFile)} trimBefore={f(line.src)} />
          </Sequence>
        ))}
        {/* Sound: a small paper-and-studio palette (public/sfx/accents, CC0) on the moments that matter, never the same take twice. */}
        {room
          ? wallAt.map((at, i) =>
              at < Infinity ? (
                <Sfx
                  key={`turn-${i}`}
                  file={take("swish", i)}
                  at={at - TURN * 0.45}
                  volume={0.55}
                />
              ) : null,
            )
          : null}
        {room ? (
          <Sfx file={take("swish", 5)} at={lastWall + 0.3} volume={0.4} />
        ) : null}
        {all.map((d) =>
          d.tags ? (
            <Sfx
              key={`photo-${d.id}`}
              file="sfx/accents/shutter.wav"
              at={d.vo.at + 0.05}
              volume={0.55}
            />
          ) : null,
        )}
        {spotList.map((sp, i) => (
          <Sfx
            key={`spot-${i}`}
            file={take("swish", i + 2)}
            at={sp.at}
            volume={0.35}
          />
        ))}
        {/* A pencil scribble under every hand-drawn loop and arrow. */}
        {all
          .flatMap((d) =>
            [...(d.glow ?? []), ...(d.arrows ?? [])].map((m) =>
              wordAt(d.id, m.word),
            ),
          )
          .map((at, i) =>
            at !== undefined ? (
              <Sfx
                key={`scribble-${i}`}
                file={take("pencil", i)}
                at={at}
                volume={0.5}
              />
            ) : null,
          )}
        {all.flatMap((d, k) =>
          (d.notes ?? []).map((n, i) => {
            const at = wordAt(d.id, n.word);
            return at !== undefined ? (
              <Sfx
                key={`${d.id}-${n.word}`}
                file={take("page", k + i)}
                at={at}
                volume={0.55}
              />
            ) : null;
          }),
        )}
        {all.map((d, k) => {
          const ta = turnAt.get(d.id);
          const sa = splitAt.get(d.id);
          return (
            <Sequence key={`fx-${d.id}`} layout="none">
              {d.picture && wordAt(d.id, d.picture.word) !== undefined ? (
                <Sfx
                  file="sfx/accents/tape.wav"
                  at={wordAt(d.id, d.picture.word)!}
                  volume={0.6}
                />
              ) : null}
              {d.turn && ta !== undefined ? (
                <Sfx file={take("swish", k)} at={ta - 0.05} volume={0.6} />
              ) : null}
              {sa !== undefined ? (
                <Sfx file={take("page", k)} at={sa} volume={0.5} />
              ) : null}
            </Sequence>
          );
        })}
        {all.flatMap((d) =>
          (d.sfx ?? []).map((s, i) => (
            <Sfx
              key={`${d.id}-sfx-${i}`}
              file={s.src}
              at={wordAt(d.id, s.word) ?? 1e6}
              volume={s.volume ?? 0.6}
            />
          )),
        )}
        {all.map((d) =>
          d.rays && wordAt(d.id, d.rays.word) !== undefined ? (
            <Sfx
              key={`rays-${d.id}`}
              file={take("pencil", 2)}
              at={wordAt(d.id, d.rays.word)!}
              volume={0.5}
            />
          ) : null,
        )}
        {/* Portraits: the first ones taped on, the rest a flurry of paper. */}
        {all.flatMap((d) => {
          const pr = d.portraits;
          const at = pr ? wordAt(d.id, pr.word) : undefined;
          if (!pr || at === undefined) return [];
          let a = at;
          return pr.srcs.map((_, i) => {
            const x = a;
            a += Math.max(0.1, 0.55 * 0.78 ** i);
            return (
              <Sfx
                key={`${d.id}-portrait-${i}`}
                file={i < 3 ? "sfx/accents/tape.wav" : take("page", i)}
                at={x}
                volume={i < 3 ? 0.55 : 0.3}
              />
            );
          });
        })}
        {/* Shots: a whoosh on each whip, a paper flick under each landing piece, a thump under stamps and big numbers. */}
        {timedShots.flatMap((s, i) => [
          s.in === "whip" || s.in === "push" ? (
            <Sfx
              key={`shot-${i}`}
              file={take("swish", i)}
              at={s.start - 0.05}
              volume={0.5}
            />
          ) : null,
          s.in === "tear" || s.in === "slide" ? (
            <Sfx
              key={`shot-${i}`}
              file={take("page", i)}
              at={s.start}
              volume={0.5}
            />
          ) : null,
          ...s.layers.flatMap((l, k) =>
            (isRig(l) ? rigHits(l, s.strikes[k] ?? s.times[k], s.end) : []).map(
              (x, n) => (
                <Sfx
                  key={`hit-${i}-${k}-${n}`}
                  file={`sfx/story/pick-${(n % 3) + 1}.wav`}
                  at={x}
                  volume={0.45}
                />
              ),
            ),
          ),
          ...s.layers.map((l, k) =>
            "bg" in l ||
            "pencil" in l ||
            "marker" in l ||
            (k === 0 && s.in) ? null : (
              <Sfx
                key={`shot-${i}-${k}`}
                file={
                  "stamp" in l || "big" in l
                    ? "sfx/accents/thud.wav"
                    : take("page", i + k)
                }
                at={s.times[k]}
                volume={"stamp" in l || "big" in l ? 0.45 : 0.22}
              />
            ),
          ),
        ])}
        {/* Collage: a paper flick under each landing piece, a thump under a stamp. */}
        {all.flatMap((d) => {
          const ct = collageTimes(d);
          if (!d.collage || !ct) return [];
          return d.collage.pieces.map((pc, i) =>
            "pencil" in pc || "ghost" in pc ? null : (
              <Sfx
                key={`${d.id}-collage-${i}`}
                file={"stamp" in pc ? "sfx/accents/thud.wav" : take("page", i)}
                at={ct.times[i]}
                volume={"stamp" in pc ? 0.6 : 0.28}
              />
            ),
          );
        })}
        {amb && AMB_AT < 1e6 ? (
          <Sequence from={f(AMB_AT)} layout="none" name="ambience">
            <Audio
              src={staticFile(amb.src)}
              loop
              volume={(fr) =>
                ambBase(AMB_AT + fr / FPS) * (1 - muffledAt(AMB_AT + fr / FPS))
              }
            />
            <Audio
              src={staticFile(amb.muffled)}
              loop
              volume={(fr) =>
                ambBase(AMB_AT + fr / FPS) * muffledAt(AMB_AT + fr / FPS)
              }
            />
          </Sequence>
        ) : null}
        {heart && HEART_AT < 1e6 ? (
          <Sequence
            from={f(HEART_AT)}
            durationInFrames={f(HEART_END - HEART_AT)}
            layout="none"
            name="heart"
          >
            <Audio
              src={staticFile(heart.src)}
              loop
              volume={(fr) =>
                (heart.volume ?? 0.8) *
                inOut(HEART_AT + fr / FPS, HEART_AT, 0.6, HEART_END, 0.6)
              }
            />
          </Sequence>
        ) : null}
      </AbsoluteFill>
    );
  };

  return {
    Component: Interactive.create({
      Component: Inner,
      layout: "absolute-fill",
    }),
    durationInFrames: f(END),
  };
};
