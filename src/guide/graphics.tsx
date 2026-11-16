import type React from "react";
import { interpolate, staticFile } from "remotion";
import { hand, poster, sans } from "../fonts";
import { clamp, easeInOut, easeOut } from "../theme";
import { usePalette } from "./decor";

// Moving graphics for collage shots: a counter running up, hand-made charts, a route travelling over a map, a
// spotlight, a letter written line by line, and paper grounds (graph, lined, newsprint).
// Coordinates are px in the 1080 × 1400 shot; `e` is the time since the layer landed, on the pieces' 12 fps clock.

type Pt = [number, number];

export type GraphicLayer =
  | { counter: [number, number]; size?: number; color?: string; dur?: number; suffix?: string } // a number running from → to over `dur` s
  | { bars: { label: string; value: number; color?: string }[]; h?: number } // a hand-made bar chart, bars growing in turn, `w` wide, `h` tall
  | { route: Pt[]; color?: string; dur?: number; marker?: string; cut?: boolean } // a dotted route drawn point to point, a marker riding its tip; `cut`: a dashed cutting line instead, scissors riding it (cutting a photo out)
  | { spot: [number, number, number] } // the shot darkens round a circle x, y, r (on what is already there)
  | { letter: string; size?: number; lineDur?: number } // a handwritten letter on laid paper, written line by line, `w` wide
  | { paper: "graph" | "lined" | "newsprint" } // a full-bleed paper ground
  // A paper slot reel `w` wide under its `title`: the `reel` entries spin past its window, fast then slowing, and it
  // stops on the last one after `dur` s (a date of death drawn at random).
  | { reel: string[]; title?: string; size?: number; dur?: number }
  // Rain over the whole shot: `rain` slanted streaks falling on the pieces' clock (a wet November window).
  | { rain: number; color?: string }
  // A museum ticket `w` wide: the show's `title` on a red band, its `venue` under it, then one row per practical fact,
  // each led by its sign (M: the métro roundel, date, price); the stub on the left is torn along a perforation.
  | { entry: string; venue: string; rows: ["M" | "date" | "price", string][] }
  // A framed picture going through a shredder hidden in its frame: from `start` s after landing the canvas slides
  // down out of the frame's bottom for `dur` s, coming out as `strips` dangling paper strips, and stops when `stop`
  // (0 … 1) of it has gone through. `ratio` is the picture's height / width, the frame is drawn round it.
  | { shredder: string; ratio: number; strips?: number; start?: number; dur?: number; stop?: number; bills?: number; jam?: number } // `bills`: that many s after landing, the hanging strips flip over one by one into banknotes; `jam`: that many s after landing it chokes (the frame shudders, smoke puffs out of the bottom rail, one strip stays stuck and trembles)
  // The framed picture through an airport scanner: from `start` s a glowing line sweeps down for `dur` s and leaves
  // an X-ray behind it (negative, blue) that shows what the frame hides: a shredder's blades along its bottom.
  | { xray: string; ratio: number; start?: number; dur?: number }
  // `paddles` numbered bidding paddles shooting up from the bottom of the shot, faster and faster over `dur` s; they
  // vanish on the layer's `off` word (the hammer falls).
  | { paddles: number; dur?: number }
  // `scales`: a hanging balance `w` wide, a cut-out standing on each pan; the beam tilts through `keys` [s after
  // landing, deg] (positive: the right pan goes down), eased between them.
  | { scales: [string, string]; keys?: [number, number][] }
  // A protester's cardboard placard on its stick, `w` wide; `framed` s after landing a gilt frame closes in round it.
  | { placard: string; framed?: number; size?: number }
  // A paper price tag on its string, `w` wide, swinging in from above and settling (a painting turned product).
  | { pricetag: string; size?: number }
  // `notes` banknotes fluttering down over the whole shot, staggered (money raining).
  | { notes: number }
  // A count made of things: `tally` strips cut from that picture (`h` px tall, `w` the whole row) popping in one by
  // one, `n` of them, `every` s apart (one strip, one million).
  | { tally: string; n: number; h: number; every?: number };

const KINDS = ["counter", "bars", "route", "spot", "letter", "paper", "reel", "rain", "entry", "shredder", "pricetag", "notes", "tally", "xray", "paddles", "placard", "scales"];
export const isGraphic = (l: object): l is GraphicLayer => KINDS.some((k) => k in l);
// Graphics that animate themselves (no landing move) or cover the shot (no drop shadow).
export const isSelfMoving = (l: object) => ["counter", "bars", "route", "spot", "letter", "paper", "reel", "rain"].some((k) => k in l);

// Point at a fraction of a polyline (by length).
const along = (pts: Pt[], f: number): { p: Pt; i: number } => {
  const segs = pts.slice(1).map((q, k) => Math.hypot(q[0] - pts[k][0], q[1] - pts[k][1]));
  let d = f * segs.reduce((a, b) => a + b, 0);
  for (let k = 0; k < segs.length; k++) {
    if (d <= segs[k]) {
      const u = segs[k] ? d / segs[k] : 0;
      return { p: [pts[k][0] + (pts[k + 1][0] - pts[k][0]) * u, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * u], i: k };
    }
    d -= segs[k];
  }
  return { p: pts[pts.length - 1], i: segs.length - 1 };
};

export const Graphic: React.FC<{ l: GraphicLayer & { x?: number; y?: number; w?: number }; e: number; piece: React.CSSProperties }> = ({ l, e, piece }) => {
  const col = usePalette();
  const w = l.w ?? 900;
  if ("counter" in l) {
    const [a, b] = l.counter;
    const v = Math.round(a + (b - a) * easeOut(interpolate(e, [0, l.dur ?? 1.2], [0, 1], clamp)));
    return (
      <div style={{ ...piece, fontFamily: poster, fontSize: l.size ?? 220, lineHeight: 0.85, color: col(l.color, "cream"), whiteSpace: "nowrap", filter: "drop-shadow(0 14px 24px rgba(0,0,0,0.5))" }}>
        {v.toLocaleString("fr-FR").replace(/\u202f/g, "\u00a0")}
        {l.suffix ?? ""}
      </div>
    );
  }
  if ("bars" in l) {
    const h = l.h ?? 520;
    const max = Math.max(...l.bars.map((b) => b.value));
    const bw = w / l.bars.length;
    return (
      <div style={{ ...piece, width: w, height: h + 70 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: h, height: 6, background: col("ink"), transform: "rotate(-0.4deg)" }} />
        {l.bars.map((b, k) => {
          const g = easeOut(interpolate(e, [k * 0.25, k * 0.25 + 0.5], [0, 1], clamp));
          const bh = (b.value / max) * (h - 80) * g;
          return (
            <div key={k} style={{ position: "absolute", left: k * bw + bw * 0.15, width: bw * 0.7, top: h - bh, height: bh }}>
              <div style={{ position: "absolute", inset: 0, background: col(b.color, k % 2 ? col("red") : col("ochre")), clipPath: "polygon(2% 1%, 98% 0, 100% 100%, 0 99%)" }} />
              {g > 0.9 ? <div style={{ position: "absolute", top: -64, left: 0, right: 0, textAlign: "center", fontFamily: poster, fontSize: 52, color: col("ink") }}>{b.value.toLocaleString("fr-FR")}</div> : null}
              <div style={{ position: "absolute", top: bh + 16, left: -20, right: -20, textAlign: "center", fontFamily: hand, fontWeight: 700, fontSize: 42, color: col("ink") }}>{b.label}</div>
            </div>
          );
        })}
      </div>
    );
  }
  if ("route" in l) {
    const f = easeInOut(interpolate(e, [0, l.dur ?? 1.6], [0, 1], clamp));
    const { p, i } = along(l.route, f);
    const pts = [...l.route.slice(0, i + 1), p];
    const c = col(l.color, "red");
    if (l.cut) {
      const q = l.route[Math.min(i + 1, l.route.length - 1)];
      const ang = (Math.atan2(q[1] - p[1], q[0] - p[0]) * 180) / Math.PI;
      return (
        <svg width={1080} height={1400} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <polyline points={pts.map((r) => r.join(",")).join(" ")} fill="none" stroke={col(l.color, "cream")} strokeWidth={7} strokeDasharray="22 14" strokeLinejoin="round" />
          {f < 1 ? (
            <text x={p[0]} y={p[1]} textAnchor="middle" dominantBaseline="central" transform={`rotate(${ang} ${p[0]} ${p[1]})`} style={{ fontSize: 76, fill: col(l.color, "cream") }}>✂</text>
          ) : null}
        </svg>
      );
    }
    return (
      <svg width={1080} height={1400} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <polyline points={pts.map((q) => q.join(",")).join(" ")} fill="none" stroke={c} strokeWidth={10} strokeDasharray="4 22" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={l.route[0][0]} cy={l.route[0][1]} r={16} fill={c} />
        {f > 0.98 ? <circle cx={p[0]} cy={p[1]} r={26} fill="none" stroke={c} strokeWidth={8} /> : null}
        <g transform={`translate(${p[0]} ${p[1]})`}>
          {l.marker ? (
            <text textAnchor="middle" dominantBaseline="central" style={{ fontSize: 64 }}>{l.marker}</text>
          ) : (
            <path d="M 0 0 C -18 -26 -26 -40 -26 -52 A 26 26 0 1 1 26 -52 C 26 -40 18 -26 0 0 Z" fill={c} stroke={col("cream")} strokeWidth={5} />
          )}
        </g>
      </svg>
    );
  }
  if ("rain" in l) {
    // Each streak has its own column, length and speed (deterministic), and wraps from the bottom back to the top.
    const r = (k: number) => {
      const v = Math.sin(k * 12.9898) * 43758.5453;
      return v - Math.floor(v);
    };
    return (
      <svg width={1080} height={1400} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
        {Array.from({ length: l.rain }, (_, k) => {
          const len = 50 + r(k + 1) * 70;
          const y = ((r(k + 2) * 1600 + e * (1500 + r(k + 3) * 700)) % 1600) - 150;
          const x = r(k + 4) * 1300 - 100 - y * 0.18;
          return <line key={k} x1={x} y1={y} x2={x - len * 0.18} y2={y + len} stroke={col(l.color, "cream")} strokeOpacity={0.35 + r(k + 5) * 0.4} strokeWidth={3 + r(k + 6) * 3} strokeLinecap="round" />;
        })}
      </svg>
    );
  }
  if ("xray" in l) {
    const h = w * l.ratio;
    const frame = Math.round(w * 0.09);
    const start = l.start ?? 0;
    const dur = l.dur ?? 1.4;
    const H = h + 2 * frame;
    const scan = interpolate(e, [start, start + dur], [0, 1], clamp) * H; // px of the frame scanned so far
    const gilt: React.CSSProperties = { position: "absolute", left: -frame, top: -frame, width: w + 2 * frame, height: H, border: `${frame}px solid #B8862B`, borderImage: "linear-gradient(135deg, #E9C76B, #8A5F14 30%, #F2D98A 50%, #7A5210 70%, #D9B04F) 1", boxSizing: "border-box" };
    const XR = "invert(1) grayscale(1) sepia(1) hue-rotate(160deg) saturate(2.4) brightness(0.95)";
    const n = 22;
    return (
      <div style={{ ...piece, width: w, height: h }}>
        <img src={staticFile(l.xray)} style={{ position: "absolute", inset: 0, width: w, height: h }} />
        <div style={{ ...gilt, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }} />
        {/* The scanned part: the same picture as an X-ray, the frame's hidden shredder showing in its bottom rail. */}
        <div style={{ position: "absolute", left: -frame, top: -frame, width: w + 2 * frame, height: H, clipPath: `inset(0 0 ${Math.max(0, H - scan)}px 0)` }}>
          <div style={{ position: "absolute", inset: 0, background: "#0B2B3A" }} />
          <img src={staticFile(l.xray)} style={{ position: "absolute", left: frame, top: frame, width: w, height: h, filter: XR, opacity: 0.85 }} />
          <div style={{ position: "absolute", inset: 0, border: `${frame}px solid rgba(150,220,255,0.28)`, boxSizing: "border-box" }} />
          <svg width={w + 2 * frame} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
            <rect x={frame * 0.6} y={H - frame * 0.95} width={w + frame * 0.8} height={frame * 0.5} rx={8} fill="none" stroke="#BFF3FF" strokeWidth={5} />
            {Array.from({ length: n }, (_, k) => {
              const x = frame + (k + 0.5) * (w / n);
              return <line key={k} x1={x} y1={H - frame * 0.95} x2={x} y2={H - frame * 0.25} stroke="#E6FBFF" strokeWidth={4} />;
            })}
            <circle cx={frame * 0.55} cy={H - frame * 0.7} r={frame * 0.32} fill="none" stroke="#BFF3FF" strokeWidth={5} />
          </svg>
        </div>
        {scan > 0 && scan < H ? (
          <div style={{ position: "absolute", left: -frame - 30, top: -frame + scan - 3, width: w + 2 * frame + 60, height: 6, background: "#9FF4FF", boxShadow: "0 0 24px 8px rgba(120,230,255,0.75)" }} />
        ) : null}
      </div>
    );
  }
  if ("paddles" in l) {
    const r = (k: number) => {
      const v = Math.sin(k * 57.31) * 43758.5453;
      return v - Math.floor(v);
    };
    const dur = l.dur ?? 1.2;
    return (
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1400, pointerEvents: "none", opacity: piece.opacity }}>
        {Array.from({ length: l.paddles }, (_, k) => {
          const t0 = dur * Math.sqrt(k / l.paddles); // each one sooner after the last
          const s = Math.floor((e - t0) * 12);
          if (s < 0) return null;
          const up = [0.15, 0.75, 1.08, 0.97, 1][Math.min(s, 4)];
          const x = 40 + r(k + 1) * 900;
          const top = 560 + r(k + 2) * 520;
          const num = 100 + Math.floor(r(k + 3) * 899);
          return (
            <div key={k} style={{ position: "absolute", left: x, top: top + (1 - up) * 500, width: 130, transform: `rotate(${(r(k + 4) - 0.5) * 24}deg)`, filter: "drop-shadow(0 10px 12px rgba(0,0,0,0.45))" }}>
              <div style={{ width: 130, height: 110, borderRadius: "50%", background: "#F4EFE4", border: "5px solid #1C1B19", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: poster, fontSize: 58, color: "#1C1B19" }}>{num}</div>
              <div style={{ width: 16, height: 170, margin: "-4px auto 0", background: "#2a2420" }} />
            </div>
          );
        })}
      </div>
    );
  }
  if ("scales" in l) {
    const keys = l.keys ?? [[0, 0]];
    const k = keys.findIndex(([at]) => at > e);
    const deg =
      k === -1 ? keys[keys.length - 1][1] : k === 0 ? keys[0][1] : interpolate(e, [keys[k - 1][0], keys[k][0]], [keys[k - 1][1], keys[k][1]], { ...clamp, easing: easeInOut });
    const rad = (deg * Math.PI) / 180;
    const px = w / 2;
    const py = 120;
    const arm = w * 0.32;
    const chain = 540;
    const dish = w * 0.36;
    const brass = "linear-gradient(90deg, #8A5F14, #E9C76B 45%, #B8862B 70%, #7A5210)";
    const pan = (side: -1 | 1, src: string) => {
      const hx = px + side * arm * Math.cos(rad);
      const hy = py + side * arm * Math.sin(rad);
      return (
        <div key={side} style={{ position: "absolute", left: hx - dish / 2, top: hy, width: dish, height: chain + 30 }}>
          <svg width={dish} height={chain} style={{ position: "absolute", left: 0, top: 0 }}>
            <path d={`M${dish / 2} 0 L8 ${chain} M${dish / 2} 0 L${dish - 8} ${chain}`} stroke="#5C3D0A" strokeWidth={5} strokeDasharray="10 6" fill="none" />
          </svg>
          <img src={staticFile(src)} style={{ position: "absolute", left: dish * 0.12, bottom: 26, width: dish * 0.76, filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.35))" }} />
          <div style={{ position: "absolute", left: 0, top: chain - 4, width: dish, height: 34, borderRadius: `0 0 ${dish / 2}px ${dish / 2}px`, background: brass, boxShadow: "0 10px 16px rgba(0,0,0,0.4)" }} />
        </div>
      );
    };
    return (
      <div style={{ ...piece, width: w, height: 1000 }}>
        <div style={{ position: "absolute", left: px - 14, top: py, width: 28, height: 840, background: brass }} />
        <div style={{ position: "absolute", left: px - 150, top: py + 820, width: 300, height: 40, borderRadius: 10, background: brass, boxShadow: "0 12px 20px rgba(0,0,0,0.4)" }} />
        <div style={{ position: "absolute", left: px - arm - 20, top: py - 12, width: 2 * arm + 40, height: 24, borderRadius: 12, background: brass, transformOrigin: `${arm + 20}px 12px`, transform: `rotate(${deg}deg)`, boxShadow: "0 8px 14px rgba(0,0,0,0.35)" }} />
        <div style={{ position: "absolute", left: px - 26, top: py - 26, width: 52, height: 52, borderRadius: 26, background: brass, boxShadow: "inset 0 0 0 4px #5C3D0A" }} />
        {pan(-1, l.scales[0])}
        {pan(1, l.scales[1])}
      </div>
    );
  }
  if ("placard" in l) {
    const bh = w * 0.62;
    const f = l.framed === undefined ? 0 : easeOut(interpolate(e, [l.framed, l.framed + 0.35], [0, 1], clamp));
    const frame = Math.round(w * 0.08);
    return (
      <div style={{ ...piece, width: w, height: bh + w * 0.75 }}>
        <div style={{ position: "absolute", left: w / 2 - 14, top: bh - 10, width: 28, height: w * 0.75, background: "#7A5A36", boxShadow: "inset -6px 0 0 rgba(0,0,0,0.2)" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: w, height: bh, background: "#C9A26B", boxShadow: "inset 0 0 0 3px rgba(90,60,25,0.35), 0 14px 24px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", padding: 30, boxSizing: "border-box", textAlign: "center", fontFamily: poster, fontSize: l.size ?? 92, lineHeight: 0.95, color: "#1C1B19", transform: "rotate(-1.5deg)" }}>
          {l.placard}
        </div>
        {f > 0 ? (
          <div style={{ position: "absolute", left: -frame, top: -frame, width: w + 2 * frame, height: bh + 2 * frame, border: `${frame}px solid #B8862B`, borderImage: "linear-gradient(135deg, #E9C76B, #8A5F14 30%, #F2D98A 50%, #7A5210 70%, #D9B04F) 1", boxSizing: "border-box", boxShadow: "inset 0 0 0 4px #5C3D0A, 0 20px 40px rgba(0,0,0,0.5)", opacity: f, transform: `scale(${1.5 - 0.5 * f})` }} />
        ) : null}
      </div>
    );
  }
  if ("pricetag" in l) {
    // A damped pendulum from the string's top: big swing as it lands, settling in about two seconds.
    const deg = 28 * Math.exp(-e * 1.9) * Math.cos(e * 7.5);
    const string = 150;
    return (
      <div style={{ ...piece, width: w, height: string + w * 0.62, transformOrigin: `${w / 2}px 0px` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: w, height: "100%", transformOrigin: `${w / 2}px 0px`, transform: `rotate(${deg}deg)` }}>
          <div style={{ position: "absolute", left: w / 2 - 2, top: 0, width: 4, height: string + 26, background: "#3b2f22" }} />
          <div style={{ position: "absolute", left: 0, top: string, width: w, height: w * 0.62, background: "#E9D9B4", clipPath: "polygon(16% 0, 84% 0, 100% 22%, 100% 100%, 0 100%, 0 22%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 0 0 3px rgba(80,60,30,0.35)" }}>
            <div style={{ position: "absolute", left: w / 2 - 13, top: 14, width: 26, height: 26, borderRadius: 13, background: "#2a2420" }} />
            <div style={{ marginTop: 34, fontFamily: hand, fontWeight: 700, fontSize: l.size ?? 70, color: col("ink"), whiteSpace: "nowrap" }}>{l.pricetag}</div>
          </div>
        </div>
      </div>
    );
  }
  if ("notes" in l) {
    const r = (k: number) => {
      const v = Math.sin(k * 91.7) * 43758.5453;
      return v - Math.floor(v);
    };
    return (
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1400, pointerEvents: "none" }}>
        {Array.from({ length: l.notes }, (_, k) => {
          const t0 = r(k + 1) * 0.5;
          const u = e - t0;
          if (u < 0) return null;
          const y = -140 + u * (620 + r(k + 2) * 300);
          const x = r(k + 3) * 1000 - 60 + Math.sin(u * 3 + k) * 60;
          const rot = r(k + 4) * 360 + u * (r(k + 5) > 0.5 ? 120 : -120);
          const flip = Math.cos(u * 6 + k);
          return (
            <div key={k} style={{ position: "absolute", left: x, top: y, width: 220, height: 112, transform: `rotate(${rot}deg) scaleY(${flip.toFixed(2)})`, background: "#B9C8A4", border: "6px solid #6E8A5A", boxShadow: "0 8px 14px rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", fontFamily: poster, fontSize: 64, color: "#3F5A33" }}>
              <span>£</span>
              <div style={{ width: 56, height: 56, borderRadius: 28, border: "4px solid #6E8A5A" }} />
              <span>50</span>
            </div>
          );
        })}
      </div>
    );
  }
  if ("tally" in l) {
    const sw = w / l.n;
    const every = l.every ?? 0.07;
    return (
      <div style={{ ...piece, width: w, height: l.h }}>
        {Array.from({ length: l.n }, (_, k) => {
          const s = Math.floor((e - k * every) * 12);
          if (s < 0) return null;
          const pop = [0.3, 1.2, 0.95, 1.03, 1][Math.min(s, 4)];
          const slice = k % 16;
          return (
            <div key={k} style={{ position: "absolute", left: k * sw + 2, bottom: 0, width: sw - 4, height: l.h, overflow: "hidden", transformOrigin: "50% 100%", transform: `scaleY(${pop}) rotate(${((k * 37) % 5) - 2}deg)`, boxShadow: "0 6px 10px rgba(0,0,0,0.35)" }}>
              <img src={staticFile(l.tally)} style={{ position: "absolute", left: -slice * sw, top: 0, width: sw * 16, height: l.h }} />
            </div>
          );
        })}
      </div>
    );
  }
  if ("shredder" in l) {
    const h = w * l.ratio;
    const n = l.strips ?? 18;
    const sw = w / n;
    const start = l.start ?? 0;
    const dur = l.dur ?? 1.4;
    const f = interpolate(e, [start, start + dur], [0, 1], clamp);
    const out = h * (l.stop ?? 0.5) * f; // how much of the canvas has gone through
    const running = f > 0 && f < 1;
    const r = (k: number) => {
      const v = Math.sin(k * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };
    const frame = Math.round(w * 0.09);
    const jammed = l.jam === undefined ? -1 : e - l.jam;
    // The shudder: a few px either way on every drawing for 0.7 s.
    const shudder = jammed >= 0 && jammed < 0.7 ? ` translate(${(r(Math.floor(jammed * 12)) - 0.5) * 12}px, ${(r(Math.floor(jammed * 12) + 40) - 0.5) * 6}px)` : "";
    return (
      <div style={{ ...piece, width: w, height: h, transform: `${piece.transform ?? ""}${shudder}` }}>
        {/* What is left inside the frame: the canvas slid down, the bare backing above it. */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#C9A27A" }}>
          <img src={staticFile(l.shredder)} style={{ position: "absolute", left: 0, top: out, width: w, height: h }} />
        </div>
        {/* The strips out of the bottom, each swinging a little on its own. */}
        {Array.from({ length: n }, (_, k) => {
          const stuck = jammed >= 0 && k === Math.floor(n / 2);
          const sway = running ? Math.sin(e * 22 + k * 1.7) * 2.5 : stuck ? Math.sin(Math.floor(e * 12) * 2.1) * 4 : Math.sin(e * 3 + k) * 0.8;
          const len = out * (0.96 + r(k) * 0.08);
          const flip = l.bills === undefined ? 0 : interpolate(e, [l.bills + k * 0.05, l.bills + k * 0.05 + 0.16], [0, 1], clamp);
          return (
            <div key={k} style={{ position: "absolute", left: k * sw + 1, top: h + frame * 0.4, width: sw - 2, height: len, overflow: "hidden", transformOrigin: "50% 0", transform: `rotate(${sway + (r(k + 9) - 0.5) * 3}deg) scaleX(${Math.abs(Math.cos(Math.PI * flip)).toFixed(3)})`, boxShadow: "0 4px 6px rgba(0,0,0,0.25)" }}>
              {flip < 0.5 ? (
                <img src={staticFile(l.shredder)} style={{ position: "absolute", left: -k * sw - 1, top: -(h - len), width: w, height: h }} />
              ) : (
                <div style={{ position: "absolute", inset: 0, background: "#B9C8A4", border: "4px solid #6E8A5A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around", fontFamily: poster, fontSize: sw * 0.9, color: "#3F5A33" }}>
                  <span>£</span>
                  <div style={{ width: sw * 0.6, height: sw * 0.6, borderRadius: "50%", border: "3px solid #6E8A5A" }} />
                  <span>£</span>
                </div>
              )}
            </div>
          );
        })}
        <div style={{ position: "absolute", left: -frame, top: -frame, width: w + 2 * frame, height: h + 2 * frame, border: `${frame}px solid #B8862B`, borderImage: "linear-gradient(135deg, #E9C76B, #8A5F14 30%, #F2D98A 50%, #7A5210 70%, #D9B04F) 1", boxShadow: "inset 0 0 0 4px #5C3D0A, 0 20px 40px rgba(0,0,0,0.5)", boxSizing: "border-box" }} />
        {/* Smoke out of the bottom rail: soft grey puffs, one after another, rising, swelling and thinning out. */}
        {jammed >= 0
          ? Array.from({ length: 9 }, (_, k) => {
              const u = Math.floor((jammed - k * 0.09) * 12) / 12;
              if (u < 0 || u > 1.6) return null;
              const f = u / 1.6;
              const size = w * (0.22 + 0.4 * f);
              return (
                <div key={`smoke-${k}`} style={{ position: "absolute", left: w * (0.08 + r(k + 60) * 0.84) - size / 2 + (r(k + 60) - 0.5) * 320 * f, top: h + frame * 0.5 - size / 2 - 180 * f, width: size, height: size, borderRadius: "50%", background: "radial-gradient(circle, rgba(118,114,108,0.95) 0%, rgba(98,95,90,0.75) 40%, rgba(80,78,74,0) 70%)", filter: "blur(4px)", opacity: 1 - f * f }} />
              );
            })
          : null}
      </div>
    );
  }
  if ("entry" in l) {
    const stub = w * 0.13;
    const sign = (k: "M" | "date" | "price") =>
      k === "M" ? (
        <div style={{ width: 54, height: 54, borderRadius: 27, border: `5px solid ${col("ink")}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: sans, fontWeight: 900, fontSize: 34, color: col("ink"), background: col("hl") }}>M</div>
      ) : (
        <div style={{ width: 54, height: 54, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: sans, fontWeight: 900, fontSize: 40, color: col("cream"), background: col("ink") }}>{k === "date" ? "▦" : "€"}</div>
      );
    return (
      <div style={{ ...piece, width: w, display: "flex", filter: `${piece.filter ?? ""} drop-shadow(0 10px 16px rgba(0,0,0,0.4))` }}>
        <div style={{ width: stub, background: col("cream"), borderRight: `5px dashed ${col("ink")}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ transform: "rotate(-90deg)", whiteSpace: "nowrap", fontFamily: sans, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: col("ink") }}>ENTRÉE · EXPO</div>
        </div>
        <div style={{ flex: 1, background: col("cream") }}>
          <div style={{ background: col("red"), padding: "22px 30px 16px", fontFamily: poster, fontSize: 76, lineHeight: 0.95, color: col("cream") }}>{l.entry}</div>
          <div style={{ padding: "16px 30px 6px", fontFamily: sans, fontWeight: 800, fontSize: 40, letterSpacing: 1, color: col("ink"), textTransform: "uppercase" }}>{l.venue}</div>
          <div style={{ padding: "8px 30px 26px", display: "flex", flexDirection: "column", gap: 14 }}>
            {l.rows.map(([k, text], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: sans, fontWeight: 700, fontSize: 38, color: col("ink") }}>
                {sign(k)}
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if ("reel" in l) {
    const size = l.size ?? 120;
    const row = size * 1.25;
    // Many turns at first, slowing to a stop on the last entry: an ease-out on the scrolled distance.
    const turns = 3;
    const n = l.reel.length;
    const total = (turns * n + n - 1) * row;
    const pos = total * easeOut(interpolate(e, [0, l.dur ?? 1.6], [0, 1], clamp));
    const k0 = Math.floor(pos / row);
    const off = pos - k0 * row;
    const ink = col("ink");
    return (
      <div style={{ ...piece, width: w }}>
        {l.title ? (
          <div style={{ fontFamily: sans, fontWeight: 900, fontSize: size * 0.36, letterSpacing: 2, color: col("paper"), background: ink, display: "inline-block", padding: "6px 18px", marginBottom: 14, transform: "rotate(-1.5deg)" }}>
            {l.title}
          </div>
        ) : null}
        <div style={{ position: "relative", height: row * 3, overflow: "hidden", background: col("paper"), border: `8px solid ${ink}`, borderRadius: 10, boxShadow: "0 18px 30px rgba(0,0,0,0.35)" }}>
          {[-1, 0, 1, 2].map((d) => (
            <div
              key={d}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: row * (1 + d) - off,
                height: row,
                lineHeight: `${row}px`,
                textAlign: "center",
                fontFamily: poster,
                fontSize: size,
                color: ink,
                whiteSpace: "nowrap",
              }}
            >
              {l.reel[(((k0 + d) % n) + n) % n]}
            </div>
          ))}
          {/* the drum's curve: the rows above and below the window fade into shadow */}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(28,27,25,0.75), rgba(28,27,25,0) 34%, rgba(28,27,25,0) 66%, rgba(28,27,25,0.75))` }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: row - 4, height: row + 8, borderTop: `6px solid ${col("accent")}`, borderBottom: `6px solid ${col("accent")}` }} />
        </div>
      </div>
    );
  }
  if ("spot" in l) {
    const [x, y, r] = l.spot;
    const k = easeOut(interpolate(e, [0, 0.4], [0, 1], clamp));
    return <div style={{ position: "absolute", left: -100, top: -100, width: 1280, height: 1600, background: `radial-gradient(circle at ${x + 100}px ${y + 100}px, transparent ${r}px, rgba(10,8,6,${0.78 * k}) ${r + 30}px)` }} />;
  }
  if ("letter" in l) {
    const lines = l.letter.split("\n");
    const size = l.size ?? 48;
    const per = l.lineDur ?? 0.55;
    return (
      <div style={{ ...piece, width: w, padding: `${size}px ${size * 0.9}px`, background: "repeating-linear-gradient(90deg, rgba(120,100,60,0.05) 0 2px, transparent 2px 9px), #F1E7CF", fontFamily: hand, fontWeight: 500, fontSize: size, lineHeight: 1.25, color: "#2B3A67" }}>
        {lines.map((ln, k) => {
          const g = interpolate(e, [k * per, (k + 1) * per], [0, 100], clamp);
          return (
            <div key={k} style={{ whiteSpace: "pre", WebkitMaskImage: `linear-gradient(90deg, black ${g}%, transparent ${g + 2}%)` }}>
              {ln || "\u00a0"}
            </div>
          );
        })}
      </div>
    );
  }
  const grounds: Record<string, string> = {
      graph: "linear-gradient(rgba(47,93,140,0.22) 2px, transparent 2px) 0 0 / 40px 40px, linear-gradient(90deg, rgba(47,93,140,0.22) 2px, transparent 2px) 0 0 / 40px 40px, #F4F1E6",
      lined: "linear-gradient(90deg, transparent 118px, rgba(192,40,28,0.45) 118px 121px, transparent 121px), linear-gradient(transparent 52px, rgba(47,93,140,0.3) 52px 54px) 0 0 / 100% 54px, #F7F3E8",
      newsprint: "repeating-linear-gradient(transparent 0 15px, rgba(28,27,25,0.12) 15px 24px), #E8E2D2",
    };
  return <div style={{ position: "absolute", left: -60, top: -60, width: 1200, height: 1520, background: grounds[l.paper] }} />;
};
