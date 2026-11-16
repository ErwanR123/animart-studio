import { Audio, Video } from "@remotion/media";
import { loadFont as loadFigtree } from "@remotion/google-fonts/Figtree";
import { loadFont as loadMarker } from "@remotion/google-fonts/PermanentMarker";
import rough from "roughjs";
import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp, easeInOut, easeOut, FPS } from "../theme";

// "30 jours pour kiffer l'art" (TikTok, IDEAS.md): one notion a day "en 3 points", in the sticker look chosen on
// 9 Nov. 2026, made to feel handmade (the first cut "looked AI"): printed stickers hand-cut with scissors on the
// lilac dotted ground (a cardboard ground was tried and rejected), masking tape for every label, felt-pen strokes and notes, and everything that moves runs on twos
// (12 images a second) with a little boil, like stop-motion. Only the voice, the captions and the hook's slow push
// into the painting run at full rate. Every timing comes from the voice's word timings.
// A quiet music bed runs under the voice (the user found the video clearer with it); captions run all along.

const marker = loadMarker("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const figtree = loadFigtree("normal", { weights: ["700", "900"], subsets: ["latin"] }).fontFamily;

export type Voice = {
  segments: { id: string; start: number; end: number }[];
  words: { text: string; start: number; end: number; segment: string }[];
};
// A cue: the first word starting with this text, optionally inside one segment ("two:tête"), plus seconds.
type Cue = string | number;
type Pt = [number, number]; // fractions of an artwork (0…1, 0…1)

export const RED = "#c8322b";
const INKC = "#1d1b18";
const TAPE = "rgba(236,226,188,.95)";

export type Art = { src: string; ratio: number }; // ratio = height / width

// Felt-pen marks on an artwork, in its own fractions: they move and zoom with it.
export type Mark =
  | { lines: { vp: Pt; from: Pt[] }; at: Cue; color?: string }
  | { ellipse: [number, number, number, number]; at: Cue; color?: string } // cx cy rx ry
  | { arrow: [Pt, Pt]; at: Cue; color?: string }
  | { note: string; pos: Pt; at: Cue; rot?: number; size?: number; color?: string }
  | { curve: Pt[]; at: Cue; color?: string }
  // A strip of masking tape stuck on the artwork (nudity, for TikTok), there as soon as the sticker is.
  | { censor: Pt; w: number; at: Cue; rot?: number }
  // A round hand-cut cut-out of one detail (centre fx fy, radius r in fractions of the art's width), blown up and
  // stuck on the stage at x y (top-left, stage px) with a felt-pen line from the spot to it.
  | { loupe: [number, number, number]; at: Cue; out?: Cue; x: number; y: number; size: number };

export type Sticker = {
  art: Art;
  at: Cue;
  out?: Cue;
  x: number;
  y: number;
  w: number;
  rot: number;
  marks?: Mark[];
  zoom?: { at: Cue; fx: number; fy: number; z: number };
  push?: { fx: number; fy: number; to: number; until: Cue }; // the hook's slow push into the painting
};
// Masking-tape labels on the stage.
export type Tape = { text: string; at: Cue; out?: Cue; x: number; y: number; rot: number; size?: number; color?: string };
// A point: its title card (from `at`, while the voice says "Un : …"), then its body (from `body`), until `out`.
// `badge` (pointStyle "badge" only): top-left of the number sticker on the stage, default [740, 560].
export type Point = { n: string; at: Cue; body: Cue; out: Cue; title: string; badge?: Pt };
// The real photo or video that opens the video full frame (what works on TikTok: real footage first, never motion
// design), the hook in TikTok's own white text box. At `until` it gets printed into a sticker (`sticker`, stage px)
// that stays until `out`.
export type Opener = {
  src: string; // image or .mp4 in public/
  ratio: number; // height / width
  text: string;
  until: Cue;
  out: Cue;
  focus?: Pt; // what the full-frame crop keeps, default the centre
  sticker?: { x: number; y: number; w: number; rot: number };
  from?: number; // a video opener: seconds into the file where it starts
  audio?: boolean; // a video opener: keep its own sound while it holds full frame (muted otherwise)
};
// A meme or viral clip cut into the video with its own sound. "full": it fills the frame, hard cut in and out,
// everything else (captions too) hidden. "sticker": it plays inside a hand-cut sticker on the stage. The voice does
// not pause: the author places it in a gap or over a line; voice and music are ducked by `duck` while it plays.
export type Clip = {
  src: string; // mp4 in public/
  at: Cue;
  from: number; // seconds into the clip
  dur: number; // seconds it plays
  mode: "full" | "sticker";
  ratio?: number; // sticker: the clip's height / width (default 16:9 → 0.5625)
  x?: number;
  y?: number;
  w?: number;
  rot?: number;
  volume?: number; // the clip's own sound, default 1
  duck?: number; // voice + music multiplier while it plays: default 0.15 full, 0.5 sticker
  caption?: string; // TikTok white text box over it
};

export type KeyConfig = {
  day: number;
  notion: string;
  voice: Voice;
  voiceFile: string;
  music: string;
  intro: { at: Cue }; // the voice names the notion: it gets written in the header
  points: [Point, Point, Point];
  stickers: Sticker[];
  tapes: Tape[];
  // Felt-pen drawings straight on the ground (a stick figure…), in fractions of their box.
  doodles?: { at: Cue; out?: Cue; x: number; y: number; w: number; h: number; strokes: Pt[][]; head?: [number, number, number] }[];
  outro: { at: Cue; lines: [string, string]; follow: Cue; tomorrow: string };
  opener?: Opener;
  clips?: Clip[];
  captionsY?: number; // top of the caption block, default 1395
  pointStyle?: "card" | "badge"; // card: full-screen number (v1); badge: a number sticker beside the art
  progress?: boolean; // header = "Jour n" + 30 tick boxes (today's ticked at intro.at)
  loopTo?: "opener"; // the last 0.5 s cut back to the opening frame, for a seamless loop
};

const gen = rough.generator();
const paths = (d: ReturnType<typeof gen.path>) => gen.toPaths(d).map((p) => p.d);
// Deterministic noise in [-1, 1].
const rnd = (a: number, b = 0) => {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1;
};
// A hand-cut outline: a rectangle whose sides wander a little.
const cut = (seed: number) => {
  const pts: string[] = [];
  const side = (x0: number, y0: number, x1: number, y1: number, k: number) => {
    for (let i = 0; i < 5; i++) {
      const f = i / 5;
      pts.push(`${(x0 + (x1 - x0) * f + rnd(seed, k * 10 + i) * 0.5).toFixed(2)}% ${(y0 + (y1 - y0) * f + rnd(seed + 1, k * 10 + i) * 0.5).toFixed(2)}%`);
    }
  };
  side(0.6, 0.4, 99.4, 0.8, 1);
  side(99.4, 0.8, 99.2, 99.4, 2);
  side(99.2, 99.4, 0.8, 99.2, 3);
  side(0.8, 99.2, 0.6, 0.4, 4);
  return `polygon(${pts.join(",")})`;
};
const TAPE_CUT = "polygon(1.5% 6%, 98% 0, 100% 24%, 97.5% 50%, 100% 76%, 98.5% 100%, 1% 94%, 2.5% 70%, 0 46%, 2% 22%)";
// A disc cut with scissors: a circle whose edge wanders a little.
const disc = (seed: number) =>
  `polygon(${Array.from({ length: 28 }, (_, i) => {
    const a = (i / 28) * Math.PI * 2;
    const r = 49 + rnd(seed, i) * 0.9;
    return `${(50 + r * Math.cos(a)).toFixed(2)}% ${(50 + r * Math.sin(a)).toFixed(2)}%`;
  }).join(",")})`;
// A phone held in the hand: small, slow, uneven sway at full frame rate (never a smooth Ken Burns).
const handheld = (t: number) => ({
  x: 7 * Math.sin(t * 1.3) + 3 * Math.sin(t * 3.1 + 1),
  y: 6 * Math.sin(t * 1.1 + 2) + 2.5 * Math.sin(t * 2.7),
  r: 0.35 * Math.sin(t * 0.9 + 0.5) + 0.12 * Math.sin(t * 2.3),
});
const isVideo = (src: string) => /\.(mp4|mov|webm)$/i.test(src);

export const createKey = (cfg: KeyConfig) => {
  const words = cfg.voice.words;
  const cue = (c: Cue): number => {
    if (typeof c === "number") return c;
    const [seg, rest] = c.includes(":") ? c.split(":") : [null, c];
    const [word, plus] = rest.split("+");
    const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}']/gu, "");
    const w = words.find((x) => (!seg || x.segment === seg) && norm(x.text).startsWith(norm(word)));
    if (!w) throw new Error(`key cue not found: ${c}`);
    return w.start + (plus ? Number(plus) : 0);
  };
  const END = cfg.voice.segments[cfg.voice.segments.length - 1].end + 0.8;
  const allMarks = cfg.stickers.flatMap((s) => s.marks ?? []);
  const op = cfg.opener;
  const badge = cfg.pointStyle === "badge";
  // Header v2: 30 hand-drawn tick boxes in two rows of 15.
  const boxes = Array.from({ length: 30 }, (_, i) => {
    const x = (i % 15) * 42 + 6;
    const y = Math.floor(i / 15) * 42 + 6;
    const o = { seed: i + 200, roughness: 1.1, bowing: 1, disableMultiStroke: true };
    return {
      box: paths(gen.rectangle(x, y, 30, 30, o)),
      tick: paths(gen.linearPath([[x + 4, y + 14], [x + 13, y + 26], [x + 30, y - 2]], { ...o, seed: i + 300, roughness: 0.8 })),
    };
  });

  // Captions: short lines (≤ 26 characters), broken at punctuation, in TikTok's own white-with-outline style.
  const lines: { start: number; words: typeof words }[] = [];
  for (const w of words.filter((x) => /[\p{L}\p{N}]/u.test(x.text))) {
    const last = lines[lines.length - 1];
    const len = last ? last.words.map((x) => x.text).join(" ").length + 1 + w.text.length : Infinity;
    const brk = last && /[.!?:,]$/.test(last.words[last.words.length - 1].text);
    if (!last || len > 26 || brk || last.words[0].segment !== w.segment) lines.push({ start: w.start, words: [w] });
    else last.words.push(w);
  }

  const Component: React.FC = () => {
    const t = useCurrentFrame() / FPS;
    const step = Math.floor(t * 12);
    const ts = step / 12; // stop-motion time: everything handmade moves on twos
    const boilK = Math.floor(step / 2);
    const boil = (seed: number) => ({ x: rnd(seed, boilK) * 1.6, y: rnd(seed + 7, boilK) * 1.6, r: rnd(seed + 3, boilK) * 0.35 });
    const since = (c: Cue) => ts - cue(c);
    // A slap: two big frames, then it settles. A peel: gone in three frames.
    const life = (at: Cue, out?: Cue, first = false) => {
      const s = first ? 1 : since(at);
      const o = out === undefined ? 0 : interpolate(since(out), [0, 0.25], [0, 1], clamp);
      const visible = s >= 0 && o < 1;
      const pop = s < 1 / 12 ? 1.14 : s < 2 / 12 ? 0.97 : 1;
      return { visible, scale: pop * (1 - 0.3 * o), opacity: 1 - o, tilt: (s < 1 / 12 ? 5 : 0) + 10 * o };
    };
    const drawn = (at: Cue, dur = 0.42) => interpolate(since(at), [0, dur], [0, 1], clamp);
    const outroAt = cue(cfg.outro.at);
    const opAt = op ? cue(op.until) : -1;
    const printed = op ? interpolate(t, [opAt, opAt + 0.35], [0, 1], clamp) : 1;
    const holding = !!op && t < opAt;
    const looping = !!op && cfg.loopTo === "opener" && t >= END - 0.5;
    const line = [...lines].reverse().find((l) => l.start <= t + 0.05) ?? lines[0];
    // The whole stage jolts for one frame when a sticker lands.
    const landed =
      cfg.stickers.some((s) => cue(s.at) > 0 && since(s.at) >= 0 && since(s.at) < 1 / 12) ||
      (!!op && ts - (opAt + 0.35) >= 0 && ts - (opAt + 0.35) < 1 / 12);
    const jolt = landed ? `translate(${rnd(step) * 6}px, ${rnd(step, 1) * 6}px)` : "none";

    const markSvg = (s: Sticker, n: number, w: number, h: number, z: number) =>
      (s.marks ?? []).map((m, j) => {
        if (since(m.at) < 0 || "loupe" in m) return null;
        if ("censor" in m) {
          return (
            <div
              key={j}
              style={{
                position: "absolute",
                left: (m.censor[0] - m.w / 2) * w,
                top: m.censor[1] * h,
                width: m.w * w,
                transform: `translate(0, -50%) rotate(${m.rot ?? -8}deg)`,
                background: TAPE,
                clipPath: TAPE_CUT,
                textAlign: "center",
                fontFamily: marker,
                fontSize: Math.max(18, m.w * w * 0.17),
                lineHeight: 1.5,
                color: INKC,
                boxShadow: "0 2px 4px rgba(0,0,0,.25)",
              }}
            >
              censuré
            </div>
          );
        }
        const color = m.color ?? RED;
        if ("note" in m) {
          const k = drawn(m.at, 0.4);
          return (
            <div
              key={j}
              style={{
                position: "absolute",
                left: m.pos[0] * w,
                top: m.pos[1] * h,
                transform: `translate(-50%, -50%) rotate(${m.rot ?? -5}deg) scale(${1 / z})`,
                fontFamily: marker,
                fontSize: m.size ?? 50,
                color,
                whiteSpace: "nowrap",
                clipPath: `inset(-20% ${100 - k * 100}% -20% -5%)`,
                textShadow: "0 0 4px #fff, 0 0 8px #fff, 0 0 2px #fff",
              }}
            >
              {m.note}
            </div>
          );
        }
        const o = { seed: n * 10 + j + 1, roughness: 1.3, bowing: 1.2, disableMultiStroke: true };
        let d: string[];
        if ("lines" in m) d = m.lines.from.flatMap((p) => paths(gen.line(p[0] * w, p[1] * h, m.lines.vp[0] * w, m.lines.vp[1] * h, o)));
        else if ("curve" in m) d = paths(gen.curve(m.curve.map((q) => [q[0] * w, q[1] * h] as [number, number]), o));
        else if ("ellipse" in m) d = paths(gen.ellipse(m.ellipse[0] * w, m.ellipse[1] * h, m.ellipse[2] * 2 * w, m.ellipse[3] * 2 * h, { ...o, curveStepCount: 14 }));
        else {
          const [a, b] = [[m.arrow[0][0] * w, m.arrow[0][1] * h], [m.arrow[1][0] * w, m.arrow[1][1] * h]];
          const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
          const head = (sg: number) => [b[0] - 34 * Math.cos(ang + sg), b[1] - 34 * Math.sin(ang + sg)] as const;
          d = [...paths(gen.line(a[0], a[1], b[0], b[1], o)), ...paths(gen.line(b[0], b[1], ...head(0.5), o)), ...paths(gen.line(b[0], b[1], ...head(-0.5), o))];
        }
        const p = interpolate(since(m.at), [0, 0.5], [0, d.length], clamp);
        return (
          <svg key={j} width={w} height={h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {d.map((path, i) => {
              const k = Math.max(0, Math.min(1, p - i));
              return k > 0 ? (
                <path key={i} d={path} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} fill="none" stroke={color} strokeWidth={9 / z} strokeLinecap="round" />
              ) : null;
            })}
          </svg>
        );
      });

    const tape = (key: string, text: string, x: number, y: number, rot: number, size: number, scale: number, opacity: number, color = INKC, seed = 1) => {
      const b = boil(seed);
      return (
        <div
          key={key}
          style={{
            position: "absolute",
            left: x,
            top: y,
            transformOrigin: "0 50%",
            transform: `translate(${b.x}px, ${b.y}px) rotate(${rot + b.r}deg) scale(${scale})`,
            opacity,
            filter: "drop-shadow(0 4px 5px rgba(0,0,0,.28))",
          }}
        >
          <div style={{ background: TAPE, clipPath: TAPE_CUT, padding: `${size * 0.18}px ${size * 0.55}px ${size * 0.12}px`, fontFamily: marker, fontSize: size, lineHeight: 1.15, color, whiteSpace: "nowrap" }}>
            {text}
          </div>
        </div>
      );
    };


    // The opener's photo or video, cover-cropped round its focus.
    const media = (w: number, h: number, sound = false, startAt = 0) => {
      if (!op) return null;
      const [fx, fy] = op.focus ?? [0.5, 0.5];
      const style = { position: "absolute" as const, inset: 0, width: w, height: h, objectFit: "cover" as const, objectPosition: `${fx * 100}% ${fy * 100}%` };
      return isVideo(op.src) ? (
        <Video src={staticFile(op.src)} muted={!(sound && op.audio)} trimBefore={Math.round(Math.max(0, startAt) * FPS)} objectFit="cover" style={style} />
      ) : (
        <Img src={staticFile(op.src)} style={style} />
      );
    };
    // Full frame, as filmed: the phone's sway, the hook in TikTok's own white text box.
    const tiktokBox = (text: string, top = 1160) => (
      <div style={{ position: "absolute", left: 150, width: 780, top, textAlign: "center", fontFamily: figtree, fontWeight: 700, fontSize: 56, lineHeight: 1.42 }}>
        <span style={{ background: "#fff", color: "#121212", padding: "5px 22px", borderRadius: 14, WebkitBoxDecorationBreak: "clone", boxDecorationBreak: "clone" }}>{text}</span>
      </div>
    );
    const fullFrame = (tt: number, sound = true, startAt = op?.from ?? 0) => {
      if (!op) return null;
      const h = handheld(tt);
      return (
        <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, transform: `translate(${h.x}px, ${h.y}px) rotate(${h.r}deg) scale(1.06)` }}>{media(1080, 1920, sound, startAt)}</div>
          {tiktokBox(op.text)}
        </AbsoluteFill>
      );
    };
    // The photo printed into a sticker: from the full frame to its spot on the ground, then it lives like a sticker.
    const openerSticker = () => {
      if (!op || holding) return null;
      const st = op.sticker ?? { x: 540 - 210, y: 560, w: 420, rot: -3 };
      const th = st.w * op.ratio;
      const e = easeInOut(printed);
      const l = life(opAt + 0.35, op.out);
      if (printed >= 1 && !l.visible) return null;
      const x = st.x * e, y = st.y * e, w = 1080 + (st.w - 1080) * e, h = 1920 + (th - 1920) * e;
      const b = printed >= 1 ? boil(5) : { x: 0, y: 0, r: 0 };
      const rim = 20 * e;
      return (
        <div
          style={{
            position: "absolute", left: x, top: y, width: w, height: h,
            transform: `translate(${b.x}px, ${b.y}px) rotate(${st.rot * e + b.r + (printed >= 1 ? l.tilt : 0)}deg) scale(${printed >= 1 ? l.scale : 1})`,
            opacity: printed >= 1 ? l.opacity : 1,
          }}
        >
          <div style={{ position: "absolute", inset: -rim, filter: `drop-shadow(0 12px 12px rgba(30,15,0,${0.45 * e}))` }}>
            <div style={{ position: "absolute", inset: 0, background: "#fbfaf6", clipPath: e > 0.5 ? cut(0) : "none" }} />
          </div>
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>{media(w, h, false, op.from ?? 0)}</div>
          <div style={{ position: "absolute", inset: 0, opacity: e, background: "linear-gradient(118deg, transparent 38%, rgba(255,255,255,.16) 46%, transparent 54%)" }} />
        </div>
      );
    };
    // Loupes: a detail cut out round, blown up, stuck beside its artwork, a felt-pen line from the spot.
    const loupes = () =>
      cfg.stickers.flatMap((s, n) =>
        (s.marks ?? []).map((m, j) => {
          if (!("loupe" in m)) return null;
          const l = life(m.at, m.out ?? s.out);
          if (!l.visible) return null;
          const [fx, fy, r] = m.loupe;
          const sh = s.w * s.art.ratio;
          const sx = s.x + fx * s.w, sy = s.y + fy * sh;
          const cx = m.x + m.size / 2, cy = m.y + m.size / 2;
          const o = { seed: n * 10 + j + 400, roughness: 1.3, bowing: 1.2, disableMultiStroke: true };
          const d = [...paths(gen.ellipse(sx, sy, r * s.w * 2.3, r * s.w * 2.3, { ...o, curveStepCount: 14 })), ...paths(gen.line(sx, sy, cx, cy, o))];
          const k = drawn(m.at, 0.3);
          const D = m.size - 26;
          const W = D / (2 * r);
          const b = boil(n * 10 + j + 120);
          return (
            <div key={`l${n}-${j}`} style={{ position: "absolute", inset: 0, opacity: l.opacity }}>
              <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
                {d.map((path, i) => (
                  <path key={i} d={path} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} fill="none" stroke={RED} strokeWidth={9} strokeLinecap="round" />
                ))}
              </svg>
              <div style={{ position: "absolute", left: m.x, top: m.y, width: m.size, height: m.size, transform: `translate(${b.x}px, ${b.y}px) rotate(${b.r * 3 + l.tilt}deg) scale(${l.scale})` }}>
                <div style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 12px 12px rgba(30,15,0,.45))" }}>
                  <div style={{ position: "absolute", inset: 0, background: "#fbfaf6", clipPath: disc(n + j + 3) }} />
                </div>
                <div style={{ position: "absolute", left: 13, top: 13, width: D, height: D, overflow: "hidden", clipPath: disc(n + j + 9) }}>
                  <Img src={staticFile(s.art.src)} style={{ position: "absolute", left: D / 2 - fx * W, top: D / 2 - fy * W * s.art.ratio, width: W, height: W * s.art.ratio, maxWidth: "none" }} />
                </div>
              </div>
            </div>
          );
        }),
      );
    // Badge points: a round number sticker beside the art, the point's title on tape under the header.
    const badgeEl = (p: Point, n: number) => {
      const l = life(p.at, p.out);
      if (!l.visible) return null;
      const [bx, by] = p.badge ?? [740, 560];
      const ring = paths(gen.ellipse(85, 85, 150, 146, { seed: n + 40, roughness: 1.5, bowing: 1.4, curveStepCount: 14 }));
      const k = drawn(p.at, 0.35);
      const b = boil(n + 140);
      return (
        <div key={`b${n}`} style={{ position: "absolute", inset: 0, opacity: l.opacity }}>
          <div style={{ position: "absolute", left: bx, top: by, width: 170, height: 170, transform: `translate(${b.x}px, ${b.y}px) rotate(${-6 + b.r + l.tilt}deg) scale(${l.scale})` }}>
            <div style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 8px 8px rgba(30,15,0,.4))" }}>
              <div style={{ position: "absolute", inset: 0, background: "#fbfaf6", clipPath: disc(n + 20) }} />
            </div>
            <svg width={170} height={170} style={{ position: "absolute", inset: 0 }}>
              {ring.map((d, i) => (
                <path key={i} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} fill="none" stroke={RED} strokeWidth={10} strokeLinecap="round" />
              ))}
            </svg>
            <div style={{ position: "absolute", inset: 0, textAlign: "center", fontFamily: marker, fontSize: 112, lineHeight: "176px", color: INKC }}>{p.n}</div>
          </div>
          {tape(`pt${n}`, p.title, 60, 478, -1.5, 52, l.scale, 1, INKC, n + 30)}
        </div>
      );
    };

    // Clips: each one in its own Sequence so the file plays from `from` when it lands.
    const clipOn = (c: Clip) => t >= cue(c.at) && t < cue(c.at) + c.dur;
    const clipVideo = (c: Clip, w: number, h: number) => (
      <Sequence from={Math.round(cue(c.at) * FPS)} durationInFrames={Math.round(c.dur * FPS)} layout="none">
        <Video src={staticFile(c.src)} trimBefore={Math.round(c.from * FPS)} volume={c.volume ?? 1} objectFit="cover" style={{ position: "absolute", inset: 0, width: w, height: h }} />
      </Sequence>
    );
    const fullClip = cfg.clips?.find((c) => c.mode === "full" && clipOn(c));
    const stickerClips = () =>
      (cfg.clips ?? []).map((c, n) => {
        if (c.mode !== "sticker" || !clipOn(c)) return null;
        const w = c.w ?? 760;
        const h = w * (c.ratio ?? 0.5625);
        const l = life(c.at);
        const b = boil(n + 170);
        const y = c.y ?? 620;
        return (
          <div key={`c${n}`}>
          <div style={{ position: "absolute", left: c.x ?? (1080 - w) / 2, top: y, width: w, height: h, transform: `translate(${b.x}px, ${b.y}px) rotate(${(c.rot ?? -3) + b.r + l.tilt}deg) scale(${l.scale})` }}>
            <div style={{ position: "absolute", inset: -20, filter: "drop-shadow(0 12px 12px rgba(30,15,0,.45))" }}>
              <div style={{ position: "absolute", inset: 0, background: "#fbfaf6", clipPath: cut(n + 50) }} />
            </div>
            <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>{clipVideo(c, w, h)}</div>
          </div>
          {c.caption ? tiktokBox(c.caption, y + h + 40) : null}
          </div>
        );
      });
    // Voice and music under a clip's own sound.
    const duckAt = (sec: number) =>
      Math.min(1, ...(cfg.clips ?? []).filter((c) => sec >= cue(c.at) && sec < cue(c.at) + c.dur).map((c) => c.duck ?? (c.mode === "full" ? 0.15 : 0.5)));

    return (
      <AbsoluteFill style={{ backgroundColor: "#f6f2ff", backgroundImage: "radial-gradient(#e3dbff 5px, transparent 6px)", backgroundSize: "64px 64px", overflow: "hidden" }}>

        {!holding ? (
        <>
        <div style={{ position: "absolute", inset: 0, transform: jolt }}>
          {printed >= 1 ? openerSticker() : null}
          {/* Stickers: printed, hand-cut, slightly glossy; they land on twos and boil a little. */}
          {cfg.stickers.map((s, n) => {
            const first = cue(s.at) === 0;
            const l = life(s.at, s.out, first);
            if (!l.visible) return null;
            const h = s.w * s.art.ratio;
            const z = s.zoom ? 1 + (s.zoom.z - 1) * easeInOut(interpolate(since(s.zoom.at), [0, 0.5], [0, 1], clamp)) : 1;
            const push = s.push ? 1 + (s.push.to - 1) * easeOut(interpolate(t, [0, cue(s.push.until)], [0, 1], clamp)) : 1;
            const fx = s.zoom?.fx ?? s.push?.fx ?? 0.5;
            const fy = s.zoom?.fy ?? s.push?.fy ?? 0.5;
            const b = boil(n + 11);
            return (
              <div
                key={n}
                style={{
                  position: "absolute",
                  left: s.x,
                  top: s.y,
                  width: s.w,
                  height: h,
                  transformOrigin: `${fx * 100}% ${fy * 100}%`,
                  transform: `translate(${b.x}px, ${b.y}px) rotate(${s.rot + b.r + l.tilt}deg) scale(${l.scale * z * push})`,
                  opacity: l.opacity,
                }}
              >
                <div style={{ position: "absolute", inset: -20, filter: "drop-shadow(0 12px 12px rgba(30,15,0,.45))" }}>
                  <div style={{ position: "absolute", inset: 0, background: "#fbfaf6", clipPath: cut(n + 1) }} />
                </div>
                <Img src={staticFile(s.art.src)} style={{ position: "absolute", inset: 0, width: s.w, height: h }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(118deg, transparent 38%, rgba(255,255,255,.16) 46%, transparent 54%)" }} />
                {markSvg(s, n, s.w, h, z * push)}
              </div>
            );
          })}

          {loupes()}
          {stickerClips()}

          {/* Each point's title card: a big felt-pen number in a circle, its title on tape. */}
          {cfg.points.map((p, n) => {
            if (badge) return badgeEl(p, n);
            const l = life(p.at, p.body);
            if (!l.visible) return null;
            const ring = paths(gen.ellipse(540, 820, 330, 320, { seed: n + 40, roughness: 1.6, bowing: 1.5, curveStepCount: 16 }));
            const k = drawn(p.at, 0.4);
            return (
              <div key={n} style={{ position: "absolute", inset: 0, opacity: l.opacity }}>
                <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
                  {ring.map((d, i) => (
                    <path key={i} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} fill="none" stroke={RED} strokeWidth={14} strokeLinecap="round" />
                  ))}
                </svg>
                <div style={{ position: "absolute", left: 0, right: 0, top: 650, textAlign: "center", fontFamily: marker, fontSize: 280, lineHeight: 1, color: INKC, transform: `rotate(-4deg) scale(${l.scale})` }}>{p.n}</div>
                {tape(`pt${n}`, p.title, 540 - (p.title.length * 40 + 73) / 2, 1040, -2, 66, l.scale, 1, INKC, n + 30)}
              </div>
            );
          })}

          {/* Felt-pen doodles drawn straight on the ground. */}
          {(cfg.doodles ?? []).map((dd, n) => {
            const l = life(dd.at, dd.out);
            if (!l.visible) return null;
            const o = { seed: n + 60, roughness: 1.4, bowing: 1.3, disableMultiStroke: true };
            const d = [
              ...(dd.head ? paths(gen.ellipse(dd.head[0] * dd.w, dd.head[1] * dd.h, dd.head[2] * 2 * dd.w, dd.head[2] * 2 * dd.w, { ...o, curveStepCount: 12 })) : []),
              ...dd.strokes.flatMap((st) => paths(gen.linearPath(st.map((q) => [q[0] * dd.w, q[1] * dd.h] as [number, number]), o))),
            ];
            const p = interpolate(since(dd.at), [0, 0.9], [0, d.length], clamp);
            const b = boil(n + 80);
            return (
              <svg key={`d${n}`} width={dd.w} height={dd.h} style={{ position: "absolute", left: dd.x + b.x, top: dd.y + b.y, overflow: "visible", opacity: l.opacity }}>
                {d.map((path, i) => {
                  const k = Math.max(0, Math.min(1, p - i));
                  return k > 0 ? <path key={i} d={path} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} fill="none" stroke={INKC} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" /> : null;
                })}
              </svg>
            );
          })}

          {/* Tape labels on the stage. */}
          {cfg.tapes.map((tp, n) => {
            const l = life(tp.at, tp.out);
            return l.visible ? tape(`t${n}`, tp.text, tp.x, tp.y, tp.rot + l.tilt, tp.size ?? 50, l.scale, l.opacity, tp.color, n + 50) : null;
          })}

          {/* Outro: why follow, written on tape; then the follow call in red felt pen. */}
          {t >= outroAt ? (
            <>
              {tape("o1", cfg.outro.lines[0], 70, 900, -2, 54, life(cfg.outro.at).scale, 1, INKC, 71)}
              {t >= cue(cfg.outro.at) + 0.9 ? tape("o2", cfg.outro.lines[1], 90, 995, 1.5, 54, life(cue(cfg.outro.at) + 0.9).scale, 1, INKC, 72) : null}
              {t >= cue(cfg.outro.follow) ? (
                <>
                  <div style={{ position: "absolute", left: 120, top: 1105, fontFamily: marker, fontSize: 120, lineHeight: 1, color: RED, transform: "rotate(-4deg)", clipPath: `inset(-20% ${100 - drawn(cfg.outro.follow, 0.45) * 100}% -20% -5%)`, textShadow: "0 3px 0 rgba(0,0,0,.15)" }}>
                    Abonne-toi
                  </div>
                  {t >= cue(cfg.outro.follow) + 0.8 ? tape("o3", cfg.outro.tomorrow, 360, 1240, -3, 48, life(cue(cfg.outro.follow) + 0.8).scale, 1, INKC, 73) : null}
                </>
              ) : null}
            </>
          ) : null}
        </div>

        {/* Header: the day and the series on tape; the notion written in felt pen once the voice names it. */}
        {cfg.progress ? (
          <>
            {tape("day", `Jour ${cfg.day}`, 60, 262, -3, 58, 1, 1, INKC, 90)}
            <svg width={640} height={90} style={{ position: "absolute", left: 300, top: 222, overflow: "visible" }}>
              {boxes.map((bx, i) => (
                <g key={i}>
                  {bx.box.map((d, j) => <path key={j} d={d} fill={i < cfg.day ? "rgba(255,255,255,.7)" : "none"} stroke={INKC} strokeWidth={3.5} />)}
                  {i < cfg.day - 1 || (i === cfg.day - 1 && since(cfg.intro.at) >= 0)
                    ? bx.tick.map((d, j) => (
                        <path key={`t${j}`} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={i === cfg.day - 1 ? 1 - drawn(cfg.intro.at, 0.3) : 0} fill="none" stroke={i === cfg.day - 1 ? RED : INKC} strokeWidth={i === cfg.day - 1 ? 7 : 5} strokeLinecap="round" />
                      ))
                    : null}
                </g>
              ))}
            </svg>
          </>
        ) : (
          tape("day", `Jour ${cfg.day}/30 · 1 notion par jour`, 60, 236, -2, 46, 1, 1, INKC, 90)
        )}
        {since(cfg.intro.at) >= 0 ? (
          <div style={{ position: "absolute", left: 66, top: cfg.progress ? 330 : 300, transform: `rotate(-1.5deg) translate(${boil(91).x}px, ${boil(91).y}px)` }}>
            <div style={{ fontFamily: marker, fontSize: 108, lineHeight: 1.1, color: INKC, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - drawn(`${cfg.intro.at}+0.9`, 0.5) * 100}% -20% -5%)`, textShadow: "0 0 6px rgba(255,250,235,.8)" }}>{cfg.notion}</div>
            <svg width={700} height={40} style={{ position: "absolute", left: 0, top: 118, overflow: "visible" }}>
              {paths(gen.line(6, 18, 640, 10, { seed: 5, roughness: 1.4, bowing: 2, disableMultiStroke: true })).map((d, i) => (
                <path key={i} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - drawn(`${cfg.intro.at}+1.5`, 0.35)} fill="none" stroke={RED} strokeWidth={11} strokeLinecap="round" />
              ))}
            </svg>
          </div>
        ) : null}
        {t >= cue(cfg.outro.follow) && !cfg.progress ? (
          <svg width={120} height={110} style={{ position: "absolute", left: 640, top: 200, overflow: "visible" }}>
            {paths(gen.linearPath([[10, 60], [40, 92], [104, 12]], { seed: 9, roughness: 1, disableMultiStroke: true })).map((d, i) => (
              <path key={i} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - drawn(cfg.outro.follow, 0.3)} fill="none" stroke={RED} strokeWidth={14} strokeLinecap="round" />
            ))}
          </svg>
        ) : null}

        </>
        ) : null}

        {/* The opener: full frame until `until`, then printed into a sticker; again for the last 0.5 s (loop). */}
        {holding ? fullFrame(t) : null}
        {op && !holding && printed < 1 ? openerSticker() : null}
        {looping && op ? (
          <Sequence from={Math.round((END - 0.5) * FPS)} layout="none">
            {fullFrame(t - END, false, (op.from ?? 0) - 0.5)}
          </Sequence>
        ) : null}
        {fullClip ? (
          <AbsoluteFill style={{ backgroundColor: "#000" }}>
            {clipVideo(fullClip, 1080, 1920)}
            {fullClip.caption ? tiktokBox(fullClip.caption) : null}
          </AbsoluteFill>
        ) : null}

        {/* Captions, TikTok style: white with a dark outline, the word being said in yellow. */}
        {t < END - 0.6 && !holding && !looping && !fullClip ? (
          <div style={{ position: "absolute", left: 60, width: 860, top: cfg.captionsY ?? 1395, textAlign: "center", fontFamily: figtree, fontWeight: 900, fontSize: 66, lineHeight: 1.15 }}>
            {line.words.map((w, n) => {
              const lit = t >= w.start && t < w.end + 0.12;
              return (
                <span key={n} style={{ color: lit ? "#ffe14d" : "#fff", WebkitTextStroke: "9px #1a1208", paintOrder: "stroke fill" }}>
                  {w.text}{" "}
                </span>
              );
            })}
          </div>
        ) : null}

        {/* Sound: the voice, a quiet music bed, and one short sound per visible event. */}
        <Audio src={staticFile(cfg.voiceFile)} volume={(f) => duckAt(f / FPS)} />
        <Audio src={staticFile(cfg.music)} volume={(f) => interpolate(f / FPS, [0, END - 1.5, END], [0.13, 0.13, 0], clamp) * duckAt(f / FPS)} />
        {(cfg.clips ?? []).filter((c) => c.mode === "sticker").map((c, n) => (
          <Sequence key={`cs${n}`} from={Math.round(cue(c.at) * FPS)} durationInFrames={10}>
            <Audio src={staticFile("sfx/sticker/slap.wav")} volume={0.5} />
          </Sequence>
        ))}
        {cfg.stickers.map((s, n) =>
          cue(s.at) > 0 ? (
            <Sequence key={`s${n}`} from={Math.round(cue(s.at) * FPS)} durationInFrames={10}>
              <Audio src={staticFile("sfx/sticker/slap.wav")} volume={0.55} />
            </Sequence>
          ) : null,
        )}
        {op ? (
          <Sequence from={Math.round((opAt + 0.35) * FPS)} durationInFrames={10}>
            <Audio src={staticFile("sfx/sticker/slap.wav")} volume={0.6} />
          </Sequence>
        ) : null}
        {allMarks.filter((m) => "loupe" in m).map((m, n) => (
          <Sequence key={`lp${n}`} from={Math.round(cue(m.at) * FPS)} durationInFrames={10}>
            <Audio src={staticFile("sfx/sticker/slap.wav")} volume={0.45} />
          </Sequence>
        ))}
        {allMarks.filter((m) => !("censor" in m) && !("loupe" in m)).map((m, n) => (
          <Sequence key={`m${n}`} from={Math.round(cue(m.at) * FPS)} durationInFrames={15}>
            <Audio src={staticFile("sfx/sticker/draw.wav")} volume={"note" in m ? 0.25 : 0.35} />
          </Sequence>
        ))}
        {[...cfg.tapes.map((x) => x.at), cfg.outro.at, ...cfg.points.map((p) => p.at)].map((at, n) => (
          <Sequence key={`t${n}`} from={Math.round(cue(at) * FPS)} durationInFrames={12}>
            <Audio src={staticFile("sfx/sticker/tape-rip.wav")} volume={0.3} />
          </Sequence>
        ))}
        {(cfg.doodles ?? []).map((dd, n) => (
          <Sequence key={`dd${n}`} from={Math.round(cue(dd.at) * FPS)} durationInFrames={27}>
            <Audio src={staticFile("sfx/sticker/draw.wav")} volume={0.35} loop />
          </Sequence>
        ))}
        <Sequence from={Math.round(cue(cfg.outro.follow) * FPS)} durationInFrames={30}>
          <Audio src={staticFile("sfx/sticker/ding.wav")} volume={0.35} />
        </Sequence>
      </AbsoluteFill>
    );
  };

  return { Component, durationInFrames: Math.ceil(END * FPS) };
};
