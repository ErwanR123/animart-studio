import type React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { display, hand, poster } from "../fonts";
import { clamp, easeIn, easeInOut, easeOut } from "../theme";
import {
  Decor,
  type DecorLayer,
  isDecor,
  isMark,
  type Palette,
  PaletteContext,
  Silhouette,
  TONES,
  ToneFilters,
  usePalette,
} from "./decor";
import {
  Graphic,
  type GraphicLayer,
  isGraphic,
  isSelfMoving,
} from "./graphics";
import { isRig, Rig, type RigLayer } from "./rigs";
import { isScenery, Scenery, type SceneryLayer } from "./scenery";
import { isVox, isVoxFlat, isVoxStill, Vox, type VoxLayer } from "./voxkit";

// Collage shots: while the Guide talks at the bottom, the top of the frame becomes a run of paper collages, a new
// composition every second or two (Vox style). Each shot is a stack of layers at a depth (0 far … 1 near): a camera
// drifts or pushes through them (near layers move most), the layers land on the voice's words, and each shot arrives
// with its own transition. Pieces stay still once landed: only an explicit `shake` jolts the frame (the user found a
// constant boil and fast cuts tiring: hold a shot ~2 s and build it word by word instead of cutting).
// Pieces animate on a stepped clock (12 drawings a second, like cut paper shot frame by frame) while the camera
// glides at the full frame rate: the contrast is what reads as hand-made collage (measured on Vox-style reels).
// Pieces come from scripts/image-collage.py (cut-outs with a paper rim, prints on torn paper, full-bleed pages).

export const SHOT_W = 1080;
export const SHOT_H = 1400; // the top of the frame; its bottom fades into the Guide's dark band

type Enter =
  | "drop"
  | "slap"
  | "left"
  | "right"
  | "up"
  | "rise"
  | "crane"
  | "grow"
  | "pop"
  | "toss"
  | "none";
export type ShotLayer = {
  x?: number; // px in the 1080 × 1400 shot (top-left of the piece)
  y?: number;
  w?: number; // px wide (images, stripes, discs)
  rot?: number;
  z?: number; // depth 0 (far) … 1 (near), default 0.5
  at?: string; // lands on this word (default: with the shot, then 0.1 s after the previous layer)
  after?: number; // … this many s later (a beat after its word, in time with a blow); also delays a `lift` or `exit`
  enter?: Enter; // default: drop for pieces, slap for stamps and big numbers, none for backgrounds; rise: up from behind the foreground; crane: lowered from above into place
  // Landed pieces stay still; only a strip or a cloud may travel sideways (drift, `amount` px a second).
  move?: "drift";
  amount?: number;
} &
  // A prepared piece (PNG with its paper rim). `edge`: a flat silhouette of that colour offset behind it (the Vox
  // sticker); `tone`: a duotone (TONES);
  // `swap`: other images it jumps to in turn every `hold` s (a pose jump, a photo becoming its caricature).
  // `fill`: another image seen through the piece's outline (a silhouette full of rubble), drifting slowly; `gilt`: a gilt
  // picture frame round it (a painting quoted inside a collage).
  // A cut-out person can act, on the pieces' clock (a paper puppet): `neck` (fraction of its height) splits off the
  // head, which nods and turns in held poses for `talk` s after landing (or from `talk[0]` to `talk[1]` s); `walk` [dx, dy, steps, step s] hops it across
  // the shot step by step, tilting side to side (a step lasts 0.32 s by default: a rat scurries at 0.08); `turn` flips it
  // to face the other way that many s after landing (squashed through edge-on in five drawings); `breathe` swells it
  // slowly from the feet; `chop` [pivot x, pivot y, delay s, amplitude] swings it round that point of itself (fractions) like a
  // pickaxe in held drawings, raised slowly and struck hard, once a second (a tool in a paper figure's hands).
  (| {
        src: string;
        edge?: string;
        tone?: string;
        swap?: string[];
        hold?: number;
        fill?: string;
        gilt?: boolean;
        neck?: number;
        talk?: number | [number, number];
        walk?: [number, number, number, number?];
        turn?: number;
        breathe?: boolean;
        chop?: [number, number, number?, number?];
        // Leaving the composition: `fall` [s after landing, dy px, deg] knocks it off (it tumbles and lies there: a
        // chunk of a house under the pick); `lift` pulls it out of the picture on that word for `hold` s (a floor slid
        // out of a building); `exit` slides it out of the frame to the left on that word (pushed out).
        fall?: [number, number, number, number?]; // [s, dy, deg, dx?]
        lift?: string;
        exit?: string;
      }
    // A magnifying glass over the shot at x, y (radius r) showing the layers under it `zoom` times larger; with `to`, it
    // glides there over `glide` s.
    | {
        loupe: [number, number, number];
        zoom?: number;
        to?: [number, number];
        glide?: number;
      }
    | DecorLayer // the kit in decor.tsx: hand-drawn marks, desk objects, period paper, graphic shapes
    | VoxLayer // voxkit.tsx: the Vox paper register (colour field, cut-out letters, name scrap, stencils, evidence ephemera)
    | SceneryLayer // scenery.tsx: drawn props (a Haussmann facade floor by floor, slops out of a window, flies, a barricade)
    | RigLayer // rigs.tsx: a paper puppet cut into limbs that acts (swings a pickaxe), `w` px wide
    | GraphicLayer // graphics.tsx: kinetic type, counters, charts, routes, spotlight, scraps, splats, letters, paper grounds
    | { bg: string; dim?: number; rise?: number } // a full-bleed page or texture behind everything (`dim` darkens it, 0 … 1; `rise` lifts it that many px, still bleeding off the bottom), or a "#colour"
    | { tape: string; size?: number; color?: string; strike?: string } // a label on torn tape (yellow), crossed out in red on `strike`
    | { note: string; size?: number } // handwriting on a scrap of cream paper, `w` px wide (a diary line)
    | { big: string; size: number; color?: string } // huge poster numbers, letter by letter
    | { stamp: string; size?: number } // a red rubber stamp
    | { stripes: number } // a red-and-cream warning band, `stripes` px high
    | { disc: string } // a flat circle of that colour (the Vox sun)
    | { pencil: string; color?: string; width?: number; draw?: number } // a red pencil path (SVG, shot px) drawn over `draw` s
    | { marker: [number, number, number, number] } // a yellow highlighter swipe over x, y, w, h (shot px), left to right
    | { haze: [number, number]; color?: string; draw?: number } // a cloud of ash spreading from a point until it veils the whole shot
  );

// How a shot arrives over the previous one (bible/vox.md §9): a hard cut, a whip pan, a push (the previous one rushes
// past the camera), a tear (the new page rips in from the left), a slide (laid on top from below like a page), a fade
// (only between two states of the same picture), blur (the fake one-shot: the camera swings away in a motion blur and
// the cut hides at its peak), zoom (the camera dives ×4 into the point `into` of the previous shot, cut on the last
// frame: into a document, a face, a window).
export type ShotIn =
  | "cut"
  | "whip"
  | "push"
  | "tear"
  | "slide"
  | "fade"
  | "blur"
  | "zoom";
export type Shot = {
  word: string;
  in?: ShotIn;
  // Camera over the shot: x, y in px and a scale, from → to (default: a slow push 1 → 1.05). Always moving, gently.
  cam?: { from?: [number, number, number]; to?: [number, number, number] };
  focus?: number; // the sharp depth (layers away from it blur: rack focus); default all sharp
  shake?: string; // the whole shot jolts on this word (an explosion)
  until?: string; // the run hands back to the painting on this word (default: the next shot, or the end of the beat)
  carry?: boolean; // the last shot of a beat stays up until the next beat's first shot when it follows within 1.5 s (no flash of the painting)
  figure?: boolean; // the episode's cut-out figure (GuideConfig.figure) stays in front of this shot, in place
  into?: [number, number]; // the point of the previous shot a `zoom` dives into (shot px)
  source?: string; // where the archive comes from ("Harper's Weekly, 29 sept. 1883"): kept with the shot, never shown (the user found the credit lines cluttered the frame)
  layers: ShotLayer[];
};
// Grounds and pieces without an entrance or a word are there as the shot arrives; the others land one after another.
export const presentAtStart = (l: ShotLayer) =>
  "bg" in l || "field" in l || "paper" in l || (l.enter === "none" && !l.at);
export type TimedShot = Shot & {
  start: number;
  end: number;
  times: number[];
  strikes: (number | undefined)[];
  shakeAt?: number;
  last: boolean;
};

const TR = 0.4; // transition length
const DRAWINGS = 12; // the pieces' clock: a new drawing every 1/12 s (holds of 3, 2, 3, 2 frames at 30 fps)
const onTwos = (t: number, at: number) =>
  Math.max(at, Math.floor(t * DRAWINGS) / DRAWINGS);
const PAPER = "#F2EBDD"; // outside a piece (the tear's rim); pieces take the episode's palette
const INK = "#1C1B19";

const rnd = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

// A ragged vertical edge for the tear transition (x at each of 30 rows), deterministic.
const tearEdge = (x: number, seed: number) =>
  Array.from({ length: 31 }, (_, i) => ({
    x: x + (rnd(seed + i * 7) - 0.5) * 50,
    y: (i / 30) * SHOT_H,
  }));

// A hand-drawn loop round something (a hand, a mouth): one stroke going round ~1.1 times, a little wobbly.
export const pencilLoop = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  seed = 1,
) =>
  Array.from({ length: 41 }, (_, i) => {
    const a = -2.1 + rnd(seed) * 0.5 + (i / 40) * Math.PI * 2.2;
    const k = 1 + (rnd(seed + i * 3) - 0.5) * 0.05 + (i / 40) * 0.07;
    return `${i ? "L" : "M"} ${(cx + Math.cos(a) * rx * k).toFixed(1)} ${(cy + Math.sin(a) * ry * k).toFixed(1)}`;
  }).join(" ");

// Landing tables, one value per drawing (12 a second), measured on Vox reels (refs/vox-style-video, M1 and M11).
const POP = [0.28, 0.81, 1.21, 1.28, 1.17, 1.07, 1.0, 0.98, 1.0];
const TOSS: [number, number][] = [
  [1.45, -9],
  [1.18, -5],
  [0.97, 2.7],
  [1.01, 1],
  [1, 0],
];

// The paper puppet (an image layer's `walk`, `turn`, `breathe`), as a transform; the head's held poses while it talks.
const TALK: [number, number][] = [
  [0, 0],
  [-4, -3],
  [2, -1],
  [-2.5, -4],
  [3, -2],
  [-1, 0],
  [1.5, -3],
  [-3, -1],
];
const TURN = [1, 0.6, 0.15, -0.4, -0.85, -1];
const CHOP = [0, -6, -14, -24, -33, -40, -42, -42, -10, 12, 6, 0]; // degrees per drawing: raised, held, struck, rebound
const headPose = (e: number, talk: number | [number, number]) => {
  const [from, to] = typeof talk === "number" ? [0, talk] : talk;
  if (e < from || e >= to) return "";
  const [r, y] = TALK[Math.floor(e * 6) % TALK.length];
  return `translateY(${y}px) rotate(${r}deg)`;
};
// Leaving the composition (an image layer's `fall`, `lift`, `exit`); `cue` is its word, s after landing.
const leave = (
  l: {
    fall?: [number, number, number, number?];
    lift?: string;
    hold?: number;
    exit?: string;
  },
  e: number,
  cue?: number,
) => {
  if (l.fall && e >= l.fall[0]) {
    const u = Math.min(1, (e - l.fall[0]) / 0.45);
    return ` translate(${(l.fall[3] ?? 0) * u}px, ${l.fall[1] * u * u}px) rotate(${l.fall[2] * u}deg)`;
  }
  if (cue !== undefined && l.lift && e >= cue && e < cue + (l.hold ?? 1.2)) {
    const u = Math.min(1, (e - cue) / 0.17);
    return ` translate(${-60 * u}px, ${-22 * u}px) scale(${1 + 0.08 * u})`;
  }
  if (cue !== undefined && l.exit && e >= cue) {
    const u = Math.min(1, (e - cue) / 0.6);
    return ` translateX(${-1400 * u * u}px) rotate(${-10 * u}deg)`;
  }
  return "";
};
const puppet = (
  l: {
    walk?: [number, number, number, number?];
    turn?: number;
    breathe?: boolean;
    chop?: [number, number, number?, number?];
  },
  e: number,
) => {
  let tf = "";
  if (l.walk) {
    const [dx, dy, steps, STEP = 0.32] = l.walk;
    const k = Math.min(steps, Math.floor(e / STEP));
    const u = k < steps ? (e % STEP) / STEP : 0;
    const f = (k + Math.min(1, u * 2.5)) / steps;
    tf += ` translate(${dx * f}px, ${dy * f - Math.sin(u * Math.PI) * 16 * Math.min(1, STEP / 0.32)}px) rotate(${k < steps ? (k % 2 ? 2.5 : -2.5) : 0}deg)`;
  }
  if (l.chop) {
    const t = e - (l.chop[2] ?? 0);
    if (t >= 0)
      tf += ` rotate(${CHOP[Math.floor(t * DRAWINGS) % CHOP.length] * (l.chop[3] ?? 1)}deg)`;
  }
  if (l.turn !== undefined && e >= l.turn)
    tf += ` scaleX(${TURN[Math.min(TURN.length - 1, Math.floor((e - l.turn) * DRAWINGS))]})`;
  if (l.breathe) tf += ` scaleY(${1 + 0.014 * Math.sin(e * 2.4)})`;
  return tf;
};

const Layer: React.FC<{
  l: ShotLayer;
  at: number;
  strikeAt?: number;
  t: number;
  i: number;
  cam: [number, number, number];
  focus?: number;
  front?: boolean; // above the shade that dims the shot while a piece is lifted out (`lift`)
}> = ({ l, at, strikeAt, t, i, cam, focus, front }) => {
  const col = usePalette();
  if (t < at || "loupe" in l) return null; // a loupe is drawn by ShotView, over the layers it magnifies
  t = onTwos(t, at); // everything below animates on the pieces' clock; the camera (cam) stays smooth
  const RED = col("accent");
  const YELLOW = col("hl");
  const CREAM = col("paper");
  const z = l.z ?? 0.5;
  const isBg = "bg" in l;
  const kind: Enter =
    l.enter ??
    (isBg
      ? "none"
      : "stamp" in l || "big" in l
        ? "slap"
        : "pencil" in l ||
            "marker" in l ||
            "haze" in l ||
            isMark(l) ||
            isSelfMoving(l) ||
            isVoxFlat(l) ||
            isVoxStill(l)
          ? "none"
          : "drop");
  const e = Math.max(0, t - at);
  const land =
    kind === "none"
      ? 1
      : interpolate(e, [0, 0.25], [0, 1], { ...clamp, easing: easeOut });
  // Parallax: near layers travel and grow more with the camera.
  const p = 0.35 + 0.65 * z;
  const s = 1 + (cam[2] - 1) * p * 1.5;
  const enter =
    kind === "drop"
      ? `translateY(${(1 - land) * -24}px) rotate(${(1 - land) * 4}deg) scale(${1 + (1 - land) * 0.15})`
      : kind === "slap"
        ? `scale(${land < 1 ? 1.6 - 0.6 * land : 1})`
        : kind === "left"
          ? `translateX(${(1 - land) * -1300}px)`
          : kind === "right"
            ? `translateX(${(1 - land) * 1300}px)`
            : kind === "up"
              ? `translateY(${(1 - land) * 1500}px)`
              : kind === "rise"
                ? `translateY(${(1 - land) * 380}px)`
                : kind === "crane"
                  ? `translateY(${(1 - land) * -460}px)`
                  : kind === "grow"
                    ? `scale(${land})`
                    : kind === "pop"
                      ? `scale(${POP[Math.min(POP.length - 1, Math.floor(e * DRAWINGS))]})`
                      : kind === "toss"
                        ? (([k, r]) => `scale(${k}) rotate(${r}deg)`)(
                            TOSS[
                              Math.min(
                                TOSS.length - 1,
                                Math.floor(e * DRAWINGS),
                              )
                            ],
                          )
                        : "";
  const blur = focus === undefined ? 0 : Math.abs(z - focus) * 7;
  const shadow =
    isBg ||
    "pencil" in l ||
    "marker" in l ||
    "stamp" in l ||
    "haze" in l ||
    isMark(l) ||
    "halftone" in l ||
    isSelfMoving(l) ||
    isVoxFlat(l) ||
    "postmark" in l ||
    "fore" in l ||
    "flies" in l
      ? ""
      : ` drop-shadow(0 ${4 + 18 * z}px ${8 + 22 * z}px rgba(0,0,0,${0.35 + 0.2 * z}))`;
  const filter =
    `${blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : ""}${shadow}` || undefined;
  const opacity =
    kind === "drop" || kind === "slap" ? Math.min(1, land * 3) : 1;
  const move =
    l.move === "drift" ? `translateX(${e * (l.amount ?? 20)}px)` : "";
  const piece: React.CSSProperties = {
    position: "absolute",
    left: l.x ?? 0,
    top: l.y ?? 0,
    transform: `rotate(${l.rot ?? 0}deg) ${enter} ${move} ${"src" in l ? puppet(l, e) + leave(l, e, strikeAt === undefined ? undefined : strikeAt - at) : ""}`,
    transformOrigin:
      "src" in l && l.chop
        ? `${l.chop[0] * 100}% ${l.chop[1] * 100}%`
        : "src" in l && (l.walk || l.breathe || l.turn !== undefined)
          ? "50% 100%"
          : undefined,
    opacity,
    filter,
  };

  let body: React.ReactNode;
  if ("src" in l) {
    const src = l.swap
      ? [l.src, ...l.swap][
          Math.floor(e / (l.hold ?? 0.33)) % (l.swap.length + 1)
        ]
      : l.src;
    const tone = l.tone && l.tone in TONES ? `url(#tone-${l.tone})` : undefined;
    body = (
      <div style={{ ...piece, width: l.w }}>
        {l.edge ? (
          <Silhouette src={src} color={l.edge} dx={16} dy={12} />
        ) : null}
        <Img
          src={staticFile(src)}
          style={{
            position: "relative",
            display: "block",
            width: "100%",
            height: "auto",
            maxWidth: "none",
            filter: tone,
            opacity: l.fill ? 0 : 1,
          }}
        />
        {l.neck !== undefined ? (
          // The head, nodding on its own over the whole body; it fades out across the neck so no seam shows.
          <Img
            src={staticFile(src)}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "auto",
              maxWidth: "none",
              filter: tone,
              WebkitMaskImage: `linear-gradient(180deg, black ${(l.neck - 0.04) * 100}%, transparent ${(l.neck + 0.03) * 100}%)`,
              transform: headPose(e, l.talk ?? 0),
              transformOrigin: `50% ${l.neck * 100}%`,
            }}
          />
        ) : null}
        {l.fill ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              WebkitMaskImage: `url(${staticFile(src)})`,
              WebkitMaskSize: "100% 100%",
              overflow: "hidden",
            }}
          >
            <Img
              src={staticFile(l.fill)}
              style={{
                position: "absolute",
                left: -40 - e * 12,
                top: -40,
                width: "130%",
                height: "130%",
                objectFit: "cover",
                filter: tone,
              }}
            />
          </div>
        ) : null}
        {l.gilt ? (
          <div
            style={{
              position: "absolute",
              inset: -34,
              border: "34px solid #B8862B",
              borderImage:
                "linear-gradient(135deg, #E9C76B, #8A5F14 30%, #F2D98A 50%, #7A5210 70%, #D9B04F) 1",
              boxShadow: "inset 0 0 0 4px #5C3D0A, 0 20px 40px rgba(0,0,0,0.5)",
            }}
          />
        ) : null}
      </div>
    );
  } else if (isDecor(l))
    body = <Decor l={l} e={e} seed={i * 7 + 3} piece={piece} />;
  else if (isVox(l))
    body = (
      <Vox
        l={l}
        e={e}
        seed={i * 7 + 3}
        piece={piece}
        cueAt={strikeAt === undefined ? undefined : strikeAt - at}
      />
    );
  else if (isGraphic(l)) body = <Graphic l={l} e={e} piece={piece} />;
  else if (isScenery(l)) body = <Scenery l={l} e={e} piece={piece} />;
  else if (isRig(l))
    body = (
      <Rig
        l={l}
        e={e}
        start={strikeAt === undefined ? 0 : strikeAt - at}
        style={piece}
      />
    );
  else if ("bg" in l)
    body = (
      <div
        style={{
          position: "absolute",
          left: -60,
          top: -60 - (l.rise ?? 0),
          width: SHOT_W + 120,
          height: SHOT_H + 120 + (l.rise ?? 0),
          filter,
        }}
      >
        {l.bg.startsWith("#") ? (
          <div style={{ width: "100%", height: "100%", background: l.bg }} />
        ) : (
          <Img
            src={staticFile(l.bg)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
        {l.dim ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `rgba(20,16,12,${l.dim})`,
            }}
          />
        ) : null}
      </div>
    );
  else if ("tape" in l)
    body = (
      <div
        style={{
          ...piece,
          padding: "10px 26px 6px",
          background: l.color ?? YELLOW,
          fontFamily: display,
          fontWeight: 900,
          fontSize: l.size ?? 64,
          lineHeight: 1,
          letterSpacing: 1,
          color: INK,
          whiteSpace: "nowrap",
          textTransform: "uppercase",
          clipPath:
            "polygon(0 6%, 3% 0, 97% 4%, 100% 0, 99% 94%, 96% 100%, 4% 96%, 1% 100%)",
        }}
      >
        {l.tape}
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
            {/* Each stroke grows from its start (no dashes: they break with a non-scaling stroke). */}
            {[
              [3, 30, 97, 72],
              [4, 74, 96, 28],
            ].map(([x1, y1, x2, y2], k) => {
              const p = interpolate(
                t,
                [strikeAt + k * 0.22, strikeAt + k * 0.22 + 0.22],
                [0, 1],
                { ...clamp, easing: easeInOut },
              );
              return p > 0 ? (
                <line
                  key={k}
                  x1={x1}
                  y1={y1}
                  x2={x1 + (x2 - x1) * p}
                  y2={y1 + (y2 - y1) * p}
                  stroke={RED}
                  strokeWidth={8}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              ) : null;
            })}
          </svg>
        ) : null}
      </div>
    );
  else if ("note" in l)
    body = (
      <div
        style={{
          ...piece,
          width: l.w,
          padding: "26px 30px 22px",
          background: "#F3ECDC",
          fontFamily: hand,
          fontWeight: 700,
          fontSize: l.size ?? 44,
          lineHeight: 1.08,
          color: INK,
          clipPath:
            "polygon(0 3%, 6% 0, 40% 2%, 72% 0, 100% 3%, 98% 50%, 100% 97%, 60% 100%, 25% 98%, 0 100%, 2% 50%)",
        }}
      >
        {l.note}
      </div>
    );
  else if ("big" in l)
    body = (
      <div
        style={{
          ...piece,
          transform: `rotate(${l.rot ?? 0}deg)`,
          opacity: 1,
          display: "flex",
          fontFamily: poster,
          fontSize: l.size,
          lineHeight: 0.85,
          color: l.color ?? CREAM,
          whiteSpace: "nowrap",
        }}
      >
        {[...l.big].map((ch, k) => {
          const ce = Math.max(0, t - at - k * 0.1);
          const cl =
            t < at + k * 0.1
              ? 0
              : interpolate(ce, [0, 0.17], [0, 1], {
                  ...clamp,
                  easing: easeOut,
                });
          return (
            <span
              key={k}
              style={{
                display: "inline-block",
                opacity: cl > 0 ? 1 : 0,
                transform: `scale(${1.5 - 0.5 * cl}) rotate(${(rnd(k + i) - 0.5) * 6}deg)`,
                filter: `drop-shadow(0 ${10 + 14 * z}px ${18 + 20 * z}px rgba(0,0,0,0.45))`,
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
    );
  else if ("stamp" in l)
    body = (
      <div
        style={{
          ...piece,
          padding: "10px 22px 6px",
          border: `7px solid ${RED}`,
          borderRadius: 10,
          fontFamily: poster,
          fontSize: l.size ?? 72,
          lineHeight: 1,
          letterSpacing: 3,
          color: RED,
          whiteSpace: "nowrap",
          mixBlendMode: "multiply",
          opacity: opacity * 0.88,
        }}
      >
        {l.stamp}
      </div>
    );
  else if ("stripes" in l)
    body = (
      <div
        style={{
          ...piece,
          width: l.w,
          height: l.stripes,
          background: `repeating-linear-gradient(-45deg, ${RED} 0 26px, ${CREAM} 26px 52px)`,
        }}
      />
    );
  else if ("disc" in l)
    body = (
      <div
        style={{
          ...piece,
          width: l.w,
          height: l.w,
          borderRadius: "50%",
          background: l.disc,
          boxShadow: "inset 0 0 60px rgba(0,0,0,0.15)",
        }}
      />
    );
  else if ("pencil" in l) {
    const draw = interpolate(Math.max(0, t - at), [0, l.draw ?? 0.45], [0, 1], {
      ...clamp,
      easing: easeInOut,
    });
    body =
      t < at ? null : (
        // A wide stroke is a soft smear (ash spreading), not a line.
        <svg
          width={SHOT_W}
          height={SHOT_H}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            overflow: "visible",
            ...((l.width ?? 9) > 20
              ? { filter: "blur(10px)", mixBlendMode: "multiply" as const }
              : {}),
          }}
        >
          <path
            d={l.pencil}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - draw}
            fill="none"
            stroke={l.color ?? RED}
            strokeWidth={l.width ?? 9}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  } else if ("haze" in l) {
    // Cloud texture (fractal noise) inside a soft disc that grows from the source; it drifts slowly sideways.
    const [cx, cy] = l.haze;
    const grow = easeInOut(
      interpolate(Math.max(0, t - at), [0, l.draw ?? 1.6], [0, 1], clamp),
    );
    const r = 40 + grow * 1300;
    const id = `haze-${i}`;
    body = (
      <svg
        width={SHOT_W}
        height={SHOT_H}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          overflow: "visible",
          mixBlendMode: "multiply",
        }}
      >
        <defs>
          <filter id={`${id}-f`} x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.006 0.011"
              numOctaves={5}
              seed={7}
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.2  0 0 0 0 0.18  0 0 0 0 0.17  0 0 0 1.3 -0.15"
            />
            <feGaussianBlur stdDeviation={5} />
          </filter>
          <radialGradient
            id={`${id}-g`}
            cx={cx}
            cy={cy}
            r={r}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.5" stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id={`${id}-m`}>
            <rect
              x={-200}
              y={-200}
              width={SHOT_W + 400}
              height={SHOT_H + 400}
              fill={`url(#${id}-g)`}
            />
          </mask>
        </defs>
        <g mask={`url(#${id}-m)`}>
          <rect
            x={-200}
            y={-200}
            width={SHOT_W + 400}
            height={SHOT_H + 400}
            fill={l.color ?? "#5A524C"}
            opacity={0.35}
          />
          <rect
            x={-300 - Math.max(0, t - at) * 25}
            y={-200}
            width={SHOT_W + 800}
            height={SHOT_H + 400}
            filter={`url(#${id}-f)`}
          />
        </g>
      </svg>
    );
  } else {
    const [mx, my, mw, mh] = l.marker;
    const wipe = interpolate(Math.max(0, t - at), [0, 0.33], [0, 1], {
      ...clamp,
      easing: easeInOut,
    });
    body = (
      <div
        style={{
          position: "absolute",
          left: mx,
          top: my,
          width: mw * wipe,
          height: mh,
          background: YELLOW,
          opacity: 0.75,
          mixBlendMode: "multiply",
          borderRadius: 4,
          transform: "rotate(-0.6deg)",
        }}
      />
    );
  }
  // On a fly-through (a camera scale well over 1) the near layers pass the lens: they fade as they grow past it.
  const passing =
    s > 1.8 && !isBg ? interpolate(s, [1.8, 2.6], [1, 0], clamp) : 1;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transformOrigin: "540px 600px",
        transform: `translate(${cam[0] * p}px, ${cam[1] * p}px) scale(${s})`,
        opacity: passing,
        zIndex: front ? 3 : undefined,
      }}
    >
      {body}
    </div>
  );
};

const ShotView: React.FC<{ shot: TimedShot; t: number; index: number }> = ({
  shot,
  t,
  index,
}) => {
  const k = interpolate(t, [shot.start, shot.end + TR], [0, 1], clamp);
  const from = shot.cam?.from ?? [0, 0, 1];
  const to = shot.cam?.to ?? [0, 0, 1.05];
  const kk = easeInOut(k);
  const cam: [number, number, number] = [
    from[0] + (to[0] - from[0]) * kk,
    from[1] + (to[1] - from[1]) * kk,
    from[2] + (to[2] - from[2]) * kk,
  ];
  // The jolt: a few big stop-motion offsets dying out.
  const sh =
    shot.shakeAt !== undefined && t >= shot.shakeAt
      ? Math.exp(-(t - shot.shakeAt) * 7)
      : 0;
  const n = Math.floor(t * 15);
  // The pieces pulled out right now (`lift`), if any (two can come out together).
  const up = shot.layers.map((l, i) => {
    const cue = shot.strikes[i];
    return (
      "lift" in l && cue !== undefined && t >= cue && t < cue + (l.hold ?? 1.2)
    );
  });
  const lifted = up.indexOf(true);
  const jolt =
    sh > 0.02
      ? `translate(${(rnd(n) - 0.5) * 40 * sh}px, ${(rnd(n + 9) - 0.5) * 40 * sh}px) rotate(${(rnd(n + 3) - 0.5) * 2 * sh}deg)`
      : "";
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        transform: jolt || undefined,
        backgroundColor: "#2A241D",
        isolation: "isolate", // the shade and front pieces stack inside the shot, never over the Guide
      }}
    >
      {shot.layers.map((l, i) => (
        <Layer
          key={i}
          l={l}
          at={shot.times[i]}
          strikeAt={shot.strikes[i]}
          t={t}
          i={index * 100 + i}
          cam={cam}
          focus={shot.focus}
          front={lifted >= 0 && (up[i] || (i > lifted && !("lift" in l)))}
        />
      ))}
      {lifted >= 0 ? (
        // While a piece is pulled out, the rest of the picture goes into shadow; what lands after it stays lit.
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            background: "rgba(16,13,10,0.55)",
            opacity: Math.min(1, (t - shot.strikes[lifted]!) / 0.17),
          }}
        />
      ) : null}
      {shot.layers.map((l, i) => {
        if (!("loupe" in l) || t < shot.times[i]) return null;
        // The glass shows the layers under it, enlarged round its centre.
        const e = onTwos(t, shot.times[i]) - shot.times[i];
        const g = l.to
          ? interpolate(
              t - shot.times[i],
              [0.3, 0.3 + (l.glide ?? 1.5)],
              [0, 1],
              { ...clamp, easing: easeInOut },
            )
          : 0;
        const [x0, y0, r] = l.loupe;
        const x = x0 + ((l.to?.[0] ?? x0) - x0) * g;
        const y = y0 + ((l.to?.[1] ?? y0) - y0) * g;
        const k = POP[Math.min(POP.length - 1, Math.floor(e * DRAWINGS))];
        return (
          <div
            key={`loupe-${i}`}
            style={{
              position: "absolute",
              left: x - r,
              top: y - r,
              width: 2 * r,
              height: 2 * r,
              transform: `scale(${k})`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: r * 1.55,
                top: r * 1.55,
                width: r * 0.32,
                height: r * 1.1,
                background: "linear-gradient(90deg, #3A2414, #6B4426, #3A2414)",
                borderRadius: r * 0.08,
                transform: "rotate(-45deg)",
                transformOrigin: "50% 0",
                boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                overflow: "hidden",
                boxShadow: "0 18px 40px rgba(0,0,0,0.55)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: r - x,
                  top: r - y,
                  width: SHOT_W,
                  height: SHOT_H,
                  transform: `scale(${l.zoom ?? 2.2})`,
                  transformOrigin: `${x}px ${y}px`,
                  backgroundColor: "#2A241D",
                }}
              >
                {shot.layers.slice(0, i).map((m, j) => (
                  <Layer
                    key={j}
                    l={m}
                    at={shot.times[j]}
                    strikeAt={shot.strikes[j]}
                    t={t}
                    i={index * 100 + j}
                    cam={cam}
                    focus={shot.focus}
                  />
                ))}
              </div>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.35), rgba(255,255,255,0) 35%)",
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                inset: -14,
                borderRadius: "50%",
                border: "16px solid #B8862B",
                boxShadow: "inset 0 0 0 3px #6B4E14, 0 0 0 3px #6B4E14",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

const TRANS: Record<ShotIn, number> = {
  cut: TR,
  whip: TR,
  push: TR,
  tear: TR,
  slide: TR,
  fade: TR,
  blur: 0.5,
  zoom: 0.7,
};
const BLUR_PAN = 60; // px the camera swings through a blur cut (inside the fields' 60 px margin: the blur does the rest)
const trLen = (mode: ShotIn | undefined) => TRANS[mode ?? "cut"];

// The run of shots of the whole episode, inside the top 1080 × 1400 of the frame. `out`: when the last shot of a run
// hands back to the painting (it rushes past the camera and fades).
export const Shots: React.FC<{
  shots: TimedShot[];
  t: number;
  palette?: Palette;
}> = ({ shots, t, palette }) => {
  const nextIn = (i: number) => {
    const next = shots[i + 1];
    return next && next.start - shots[i].end < 0.05
      ? (next.in ?? "cut")
      : undefined;
  };
  const live = shots
    .map((s, i) => ({ s, i }))
    .filter(
      ({ s, i }) =>
        t >= s.start && t < s.end + (s.last ? TR + 0.15 : trLen(nextIn(i))),
    );
  if (!live.length) return null;
  return (
    <PaletteContext.Provider value={palette ?? {}}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: SHOT_W,
          height: SHOT_H,
          overflow: "hidden",
        }}
      >
        <svg width={0} height={0} style={{ position: "absolute" }}>
          <defs>
            {live.map(({ i }) => (
              <filter
                key={i}
                id={`whip-${i}`}
                x="-20%"
                y="0"
                width="140%"
                height="100%"
              >
                <feGaussianBlur stdDeviation={`${whipBlur(shots, i, t)} 0`} />
              </filter>
            ))}
            <ToneFilters />
          </defs>
        </svg>
        {live.map(({ s, i }) => {
          const out = nextIn(i);
          const mode = s.in ?? "cut";
          const L = trLen(mode);
          const raw = interpolate(t, [s.start, s.start + L], [0, 1], clamp); // my arrival, linear
          const a = easeOut(raw);
          const lo = interpolate(t, [s.end, s.end + trLen(out)], [0, 1], clamp); // the next one's arrival, linear
          const d = easeIn(lo);
          let style: React.CSSProperties = {};
          if (mode === "whip" && a < 1)
            style = { transform: `translateX(${(1 - a) * SHOT_W}px)` };
          if (mode === "slide" && a < 1)
            style = {
              transform: `translateY(${(1 - a) * SHOT_H}px) rotate(${(1 - a) * 4}deg)`,
              boxShadow: "0 -30px 60px rgba(0,0,0,0.6)",
            };
          if (mode === "push" && a < 1)
            style = { transform: `scale(${0.82 + 0.18 * a})` };
          if (mode === "fade" && a < 1) style = { opacity: a };
          if (mode === "tear" && a < 1) {
            const edge = tearEdge(-60 + a * (SHOT_W + 120), i * 13);
            style = {
              clipPath: `polygon(0px 0px, ${edge.map((q) => `${q.x.toFixed(1)}px ${q.y.toFixed(1)}px`).join(", ")}, 0px ${SHOT_H}px)`,
            };
          }
          // Blur: the new shot appears at the blur's peak, finishing the camera's swing; zoom: it is there on the last frame.
          if (mode === "blur" && raw < 1)
            style =
              raw < 0.5
                ? { opacity: 0 }
                : {
                    transform: `translateX(${(1 - easeOut((raw - 0.5) * 2)) * BLUR_PAN}px)`,
                  };
          if (mode === "zoom" && raw < 1) style = { opacity: 0 };
          // Leaving: pushed off by a whip, punched into by a zoom, rushing past the camera on a push or at the end of a run.
          if (d > 0 && out === "whip")
            style = { ...style, transform: `translateX(${-d * SHOT_W}px)` };
          else if (lo > 0 && out === "zoom") {
            const [ix, iy] = shots[i + 1]?.into ?? [SHOT_W / 2, SHOT_H * 0.4];
            style = {
              ...style,
              transform: `scale(${1 + 3 * easeIn(lo)})`,
              transformOrigin: `${ix}px ${iy}px`,
              filter: `blur(${lo * lo * 6}px)`,
            };
          } else if (lo > 0 && out === "blur")
            style = {
              ...style,
              transform: `translateX(${-easeIn(Math.min(1, lo * 2)) * BLUR_PAN}px)`,
            };
          else if (d > 0 && (out === "push" || s.last))
            style = {
              ...style,
              transform: `scale(${1 + d * 0.25})`,
              opacity: 1 - d,
              filter: `blur(${d * 8}px)`,
            };
          const whip = whipBlur(shots, i, t) > 0.5;
          return (
            <div key={i} style={{ position: "absolute", inset: 0 }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  ...style,
                  filter:
                    [style.filter, whip ? `url(#whip-${i})` : ""]
                      .filter(Boolean)
                      .join(" ") || undefined,
                }}
              >
                <ShotView shot={s} t={t} index={i} />
                {mode === "tear" && a < 1 ? (
                  <svg
                    width={SHOT_W}
                    height={SHOT_H}
                    style={{ position: "absolute", left: 0, top: 0 }}
                  >
                    <polyline
                      points={tearEdge(-60 + a * (SHOT_W + 120), i * 13)
                        .map((q) => `${q.x},${q.y}`)
                        .join(" ")}
                      fill="none"
                      stroke={PAPER}
                      strokeWidth={14}
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </div>
            </div>
          );
        })}
        {/* The Guide's band: the collage fades into the dark floor under him. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: SHOT_H - 330,
            height: 330,
            background:
              "linear-gradient(180deg, rgba(21,26,20,0) 0%, rgba(21,26,20,0.75) 55%, #151A14 100%)",
          }}
        />
      </div>
    </PaletteContext.Provider>
  );
};

// Horizontal motion blur while a whip pan or a blur cut moves this shot (in or out); a blur cut peaks on the cut.
const whipBlur = (shots: TimedShot[], i: number, t: number) => {
  const s = shots[i];
  const next = shots[i + 1];
  const joined = next && next.start - s.end < 0.05;
  const B = TRANS.blur;
  const inV =
    s.in === "whip"
      ? interpolate(
          t,
          [s.start, s.start + TR * 0.5, s.start + TR],
          [40, 30, 0],
          clamp,
        )
      : s.in === "blur"
        ? interpolate(t, [s.start + B * 0.5, s.start + B], [48, 0], clamp)
        : 0;
  const outV =
    joined && next.in === "whip"
      ? interpolate(
          t,
          [s.end, s.end + TR * 0.5, s.end + TR],
          [0, 30, 40],
          clamp,
        )
      : joined && next.in === "blur"
        ? interpolate(t, [s.end, s.end + B * 0.5], [0, 48], clamp)
        : 0;
  return Math.max(inV, outV);
};
