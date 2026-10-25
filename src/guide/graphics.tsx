import type React from "react";
import { interpolate } from "remotion";
import { hand, poster } from "../fonts";
import { clamp, easeInOut, easeOut } from "../theme";
import { usePalette } from "./decor";

// Moving graphics for collage shots: a counter running up, hand-made charts, a route travelling over a map, a
// spotlight, a letter written line by line, and paper grounds (graph, lined, newsprint).
// Coordinates are px in the 1080 × 1400 shot; `e` is the time since the layer landed, on the pieces' 12 fps clock.

type Pt = [number, number];

export type GraphicLayer =
  | { counter: [number, number]; size?: number; color?: string; dur?: number; suffix?: string } // a number running from → to over `dur` s
  | { bars: { label: string; value: number; color?: string }[]; h?: number } // a hand-made bar chart, bars growing in turn, `w` wide, `h` tall
  | { route: Pt[]; color?: string; dur?: number; marker?: string } // a dotted route drawn point to point, a marker riding its tip
  | { spot: [number, number, number] } // the shot darkens round a circle x, y, r (on what is already there)
  | { letter: string; size?: number; lineDur?: number } // a handwritten letter on laid paper, written line by line, `w` wide
  | { paper: "graph" | "lined" | "newsprint" }; // a full-bleed paper ground

const KINDS = ["counter", "bars", "route", "spot", "letter", "paper"];
export const isGraphic = (l: object): l is GraphicLayer => KINDS.some((k) => k in l);
// Graphics that animate themselves (no landing move) or cover the shot (no drop shadow).
export const isSelfMoving = (l: object) => ["counter", "bars", "route", "spot", "letter", "paper"].some((k) => k in l);

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
