import type React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { fell, sans, typewriter } from "../fonts";
import { clamp, easeInOut } from "../theme";
import { usePalette } from "./decor";

// The Vox paper register, from refs/vox-style-video (14-vox-collage.md: 120 Vox thumbnails measured) and the
// reference reel (docs/inspiration): a flat colour field with paper fibre and a halftone sweep from one corner,
// cut-out lettering (every letter on its own torn chip, slapping in one per drawing), a name label on a torn scrap of
// graph paper, small paper-stencil scraps (2–4 per shot, never on the subject), and the evidence ephemera of the reel
// (number tags in black boxes, a postmark, red X marks joined by a thread, tick boxes, a vertical number strip, giant
// pale numerals, a scrap of patterned paper). The evidence boards of bible/vox.md §2: a flat map with routes drawing
// on and pins landing, a document page whose phrase is highlighted as the voice says it, and a torn paper band in the
// foreground that crops the subject. Px in the 1080 × 1400 shot; `e` = seconds since landing (12 fps clock).

const rnd = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
const shade = (hex: string, f: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * f))).toString(16).padStart(2, "0")).join("")}`;
};
const SLAP = [1.42, 1.12, 0.96, 1.0]; // per drawing: hits big, settles (measured on Vox reels)
const chipClip = (seed: number) => {
  const k = (n: number) => (rnd(seed * 7 + n) * 7).toFixed(1);
  return `polygon(${k(1)}% ${k(2)}%, ${100 - +k(3)}% ${k(4)}%, 100% ${100 - +k(5)}%, ${k(6)}% 100%)`;
};
type Pt = [number, number];
const POP = [0.28, 0.81, 1.21, 1.28, 1.17, 1.07, 1.0, 0.98, 1.0]; // a pin landing, per drawing

// A flat map made by scripts/map-osm.py (src/guide/maps/): SVG paths in a viewBox `width` × `height`.
export type MapData = { width: number; height: number; land?: string; rivers: Record<string, string>; ways: Record<string, string>; points: Record<string, number[]> };

export type VoxLayer =
  // The flat colour ground (disc: x, y, r, colour); `paper`: a real scan multiplied over it (art/paper/crumpled.jpg,
  // cardboard.jpg …) instead of the drawn fibre.
  | { field: string; dots?: "tl" | "tr" | "bl" | "br" | "none"; disc?: [number, number, number, string?]; paper?: string }
  | { letters: string; size?: number; chips?: [string, string][] } // cut-out lettering, chips cycling [paper, ink]
  | { name: [string, string?]; size?: number } // a name on a torn scrap of graph paper: big first line, lighter second
  | { stencil: "zigzag" | "triangle" | "dot" | "half" | "bar" | "star"; color?: string } // a small paper-stencil scrap, `w` across
  | { tag: string; size?: number } // a number in a black box
  | { postmark: string; sub?: string; color?: string } // a round date stamp, `w` across
  | { thread: Pt[]; color?: string; draw?: number } // red X marks joined by a thread, one after another
  | { ticks: number; crossed?: number[] } // a row of small tick boxes, some crossed
  | { strip: string } // a vertical black strip of small numbers
  | { ghost: string; size?: number; color?: string } // giant pale numerals behind everything
  | { motif: "cross" | "dots" | "stripes" | "check"; color?: string; h?: number } // a torn scrap of patterned paper, `w` × `h`
  // A flat map `w` wide: land and rivers in two flat colours, our own `labels` (text, x, y in map units), then the
  // named `routes` drawing on one after another (`draw` s each) in the accent from the word `cue` (default: as it
  // lands), then the `pins` landing (a place of the map's points, or [label, x, y]).
  | { map: MapData; land?: string; water?: string; routes?: string[]; pins?: (string | [string, number, number])[]; labels?: [string, number, number][]; draw?: number; cue?: string }
  // A document page `w` wide with its real text (paragraphs split on blank lines): `press` (newsprint, a masthead
  // `head`, two columns), `typed` (a typewritten sheet), `book` (a printed page). On the word `cue` the yellow
  // highlighter sweeps the phrase `mark` and the rest of the page dims; push the camera onto it with the shot's `cam`.
  | { doc: string; face?: "press" | "typed" | "book"; head?: string; mark?: string; cue?: string; size?: number; paper?: string }
  // The foreground: a torn paper band along the bottom (or top) of the shot, its ragged edge at `y`, drawn last so
  // the subjects rise from behind it (`enter: "rise"`). A cut-out foreground (a facade, a crowd) is an image at z 0.95.
  | { fore: "bottom" | "top"; color?: string }
  // A grid of `grid` little people (`cols` a row, `size` px a cell), popping in row by row; on the word `cue` the one
  // at `mark` turns the accent colour (one in fifty: measured on Vox, "the one we're talking about").
  | { grid: number; cols?: number; size?: number; mark?: number; cue?: string };

const KINDS = ["field", "letters", "name", "stencil", "tag", "postmark", "thread", "ticks", "strip", "ghost", "motif", "map", "doc", "fore", "grid"];
export const isVox = (l: object): l is VoxLayer => KINDS.some((k) => k in l);
// Grounds and drawn marks: no landing move of their own, no drop shadow.
export const isVoxFlat = (l: object) => ["field", "letters", "thread", "ghost", "map", "grid"].some((k) => k in l);
// There as the shot arrives (no landing move), but still a paper object with its shadow.
export const isVoxStill = (l: object) => ["fore"].some((k) => k in l);

export const Vox: React.FC<{ l: VoxLayer & { x?: number; y?: number; w?: number }; e: number; seed: number; piece: React.CSSProperties; cueAt?: number }> = ({ l, e, seed, piece, cueAt }) => {
  const col = usePalette();
  const w = l.w ?? 200;
  if ("field" in l) {
    const c = col(l.field, "yellow");
    const pos = { tl: "0% 0%", tr: "100% 0%", bl: "0% 100%", br: "100% 100%", none: "50% 50%" }[l.dots ?? "br"];
    return (
      <div style={{ position: "absolute", left: -60, top: -60, width: 1200, height: 1520, background: c }}>
        {l.disc ? <div style={{ position: "absolute", left: 60 + l.disc[0] - l.disc[2], top: 60 + l.disc[1] - l.disc[2], width: 2 * l.disc[2], height: 2 * l.disc[2], borderRadius: "50%", background: col(l.disc[3], shade(c, 0.82)) }} /> : null}
        {l.dots !== "none" ? <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle, ${shade(c, 0.7)} 34%, transparent 36%)`, backgroundSize: "26px 26px", WebkitMaskImage: `radial-gradient(ellipse 70% 60% at ${pos}, #000 0%, transparent 70%)`, opacity: 0.8 }} /> : null}
        {l.paper ? (
          <Img src={staticFile(l.paper)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply", opacity: 0.6 }} />
        ) : (
          <svg width={1200} height={1520} style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", opacity: 0.35 }}>
            <filter id={`fibre-${seed}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.012 0.04" numOctaves={4} seed={seed} />
              <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -1.2 0 0 0 1.05" />
            </filter>
            <rect width={1200} height={1520} filter={`url(#fibre-${seed})`} />
          </svg>
        )}
      </div>
    );
  }
  if ("letters" in l) {
    // One chip per letter, slapping in one per drawing; words never break across lines.
    const size = l.size ?? 120;
    const chips = l.chips ?? [["cream", "ink"], ["ink", "cream"], ["yellow", "ink"], ["red", "cream"]];
    let k = -1;
    return (
      <div style={{ ...piece, display: "flex", flexWrap: "wrap", width: l.w, gap: `${size * 0.1}px ${size * 0.4}px`, alignItems: "center" }}>
        {l.letters.split(" ").map((word, wi) => (
          <div key={wi} style={{ display: "flex", gap: size * 0.06, alignItems: "center" }}>
            {[...word].map((ch) => {
              k++;
              const s = Math.floor(e * 12) - k;
              if (s < 0) return <div key={k} style={{ width: size * 0.75, height: size * 1.2 }} />;
              const [bg, fg] = chips[k % chips.length];
              return (
                <div key={k} style={{ position: "relative", transform: `translateY(${(rnd(seed + k * 3) - 0.5) * size * 0.18}px) rotate(${(rnd(seed + k) - 0.5) * 14}deg) scale(${SLAP[Math.min(s, 3)]})`, filter: "drop-shadow(0 6px 6px rgba(0,0,0,0.4))" }}>
                  <div style={{ position: "absolute", inset: 0, background: col(bg, bg), clipPath: chipClip(seed + k) }} />
                  <div style={{ position: "relative", padding: `${size * 0.04}px ${size * 0.12}px`, fontFamily: sans, fontWeight: 900, fontSize: size, lineHeight: 1.05, color: col(fg, fg) }}>{ch}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }
  if ("name" in l) {
    const size = l.size ?? 96;
    return (
      <div style={{ ...piece, padding: `${size * 0.28}px ${size * 0.5}px ${size * 0.34}px`, background: "linear-gradient(rgba(120,140,170,0.25) 1.5px, transparent 1.5px) 0 0 / 22px 22px, linear-gradient(90deg, rgba(120,140,170,0.25) 1.5px, transparent 1.5px) 0 0 / 22px 22px, #EDEAE2", clipPath: "polygon(0 4%, 7% 0, 22% 3%, 41% 0, 63% 2.5%, 84% 0, 100% 3%, 98.5% 35%, 100% 68%, 97% 100%, 75% 97%, 52% 100%, 30% 96.5%, 9% 100%, 1% 97%, 2% 60%)", textAlign: "center", color: "#2A2A2A", whiteSpace: "nowrap" }}>
        <div style={{ fontFamily: sans, fontWeight: 800, fontSize: size, lineHeight: 0.95, letterSpacing: size * 0.04 }}>{l.name[0].toUpperCase()}</div>
        {l.name[1] ? <div style={{ fontFamily: sans, fontWeight: 400, fontSize: size * 0.48, lineHeight: 1.1, letterSpacing: size * 0.05 }}>{l.name[1].toUpperCase()}</div> : null}
      </div>
    );
  }
  if ("stencil" in l) {
    const c = col(l.color, "red");
    const star = Array.from({ length: 16 }, (_, k) => {
      const a = (k / 16) * Math.PI * 2;
      const r = k % 2 ? 22 : 46;
      return `${50 + Math.cos(a) * r},${50 + Math.sin(a) * r}`;
    }).join(" ");
    return (
      <svg viewBox="0 0 100 100" width={w} height={w} style={{ ...piece, overflow: "visible" }}>
        {l.stencil === "zigzag" ? <polyline points="0,60 15,20 30,60 45,20 60,60 75,20 90,60" fill="none" stroke={c} strokeWidth={12} /> : null}
        {l.stencil === "triangle" ? <polygon points="50,6 94,90 6,90" fill={c} /> : null}
        {l.stencil === "dot" ? <circle cx={50} cy={50} r={42} fill={c} /> : null}
        {l.stencil === "half" ? <path d="M6,70 A44,44 0 0,1 94,70 Z" fill={c} /> : null}
        {l.stencil === "bar" ? <rect x={4} y={36} width={92} height={28} fill={c} /> : null}
        {l.stencil === "star" ? <polygon points={star} fill={c} /> : null}
      </svg>
    );
  }
  if ("tag" in l) {
    const size = l.size ?? 80;
    return <div style={{ ...piece, padding: `${size * 0.08}px ${size * 0.2}px`, background: "#141414", border: `${size * 0.05}px solid #F2EEE4`, fontFamily: sans, fontWeight: 900, fontSize: size, lineHeight: 1, color: "#F2EEE4" }}>{l.tag}</div>;
  }
  if ("postmark" in l) {
    const c = col(l.color, "#7A2E3A");
    const id = `pm-${seed}`;
    return (
      <svg viewBox="0 0 200 200" width={w} height={w} style={{ ...piece, mixBlendMode: "multiply", opacity: 0.85, overflow: "visible" }}>
        <defs>
          <path id={id} d="M 100 100 m -72 0 a 72 72 0 1 1 144 0 a 72 72 0 1 1 -144 0" />
          <filter id={`${id}-f`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={seed} />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.6" />
            <feComposite in="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <g filter={`url(#${id}-f)`} fill="none" stroke={c}>
          <circle cx={100} cy={100} r={92} strokeWidth={6} />
          <circle cx={100} cy={100} r={58} strokeWidth={4} />
          <text fill={c} stroke="none" style={{ fontFamily: sans, fontWeight: 800, fontSize: 22, letterSpacing: 3 }}>
            <textPath href={`#${id}`}>{(l.sub ?? "PARIS").toUpperCase()} · {(l.sub ?? "PARIS").toUpperCase()} ·</textPath>
          </text>
          <text x={100} y={108} textAnchor="middle" fill={c} stroke="none" style={{ fontFamily: sans, fontWeight: 800, fontSize: 24 }}>{l.postmark.toUpperCase()}</text>
        </g>
      </svg>
    );
  }
  if ("thread" in l) {
    // The thread runs from mark to mark; each X lands as the thread reaches it.
    const c = col(l.color, "red");
    const n = l.thread.length;
    const p = interpolate(e, [0, l.draw ?? 1.2], [0, n - 1], clamp);
    return (
      <svg width={1080} height={1400} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {l.thread.slice(1).map(([x, y], k) => {
          const f = easeInOut(Math.max(0, Math.min(1, p - k)));
          const [x0, y0] = l.thread[k];
          return f > 0 ? <line key={k} x1={x0} y1={y0} x2={x0 + (x - x0) * f} y2={y0 + (y - y0) * f} stroke={c} strokeWidth={3} /> : null;
        })}
        {l.thread.map(([x, y], k) =>
          p >= k - 0.05 ? (
            <g key={`x${k}`} stroke={c} strokeWidth={6} strokeLinecap="round">
              <line x1={x - 14} y1={y - 14} x2={x + 14} y2={y + 14} />
              <line x1={x + 14} y1={y - 14} x2={x - 14} y2={y + 14} />
            </g>
          ) : null,
        )}
      </svg>
    );
  }
  if ("ticks" in l)
    return (
      <div style={{ ...piece, display: "flex", gap: 14 }}>
        {Array.from({ length: l.ticks }, (_, k) => (
          <svg key={k} width={34} height={34} viewBox="0 0 34 34">
            <rect x={3} y={3} width={28} height={28} fill="none" stroke="#2A2A2A" strokeWidth={3} />
            {l.crossed?.includes(k) ? <path d="M 8 8 L 26 26 M 26 8 L 8 26" stroke={col("red")} strokeWidth={4} /> : null}
          </svg>
        ))}
      </div>
    );
  if ("strip" in l)
    return <div style={{ ...piece, padding: "14px 8px", background: "#141414", color: "#F2EEE4", fontFamily: sans, fontWeight: 800, fontSize: 26, lineHeight: 1.25, letterSpacing: 2, writingMode: "vertical-rl" }}>{l.strip}</div>;
  if ("map" in l) {
    const m = l.map;
    const draw = l.draw ?? 0.6;
    const routes = l.routes ?? [];
    const from = cueAt ?? 0;
    const pinsAt = from + routes.length * draw + 0.15;
    const id = `map-${seed}`;
    const u = m.width / w; // map units per screen px: labels and pins keep their size on screen whatever the map's
    const type = (px: number) => ({ fontFamily: sans, fontWeight: 800, fontSize: px * u, letterSpacing: 0.06 * px * u });
    return (
      <svg viewBox={`0 0 ${m.width} ${m.height}`} width={w} height={(w * m.height) / m.width} style={{ ...piece, overflow: "visible" }}>
        <defs>
          <clipPath id={id}>{m.land ? <path d={m.land} /> : <rect width={m.width} height={m.height} />}</clipPath>
        </defs>
        {m.land ? <path d={m.land} fill={col(l.land, "paper")} stroke={col("ink")} strokeWidth={2.5} strokeLinejoin="round" /> : null}
        <g clipPath={`url(#${id})`} fill="none" stroke={col(l.water, "blue")} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round">
          {Object.values(m.rivers).map((d, k) => (
            <path key={k} d={d} />
          ))}
        </g>
        {(l.labels ?? []).map(([text, x, y], k) => (
          <text key={k} x={x} y={y} textAnchor="middle" fill={col("ink")} style={type(30)}>
            {text.toUpperCase()}
          </text>
        ))}
        {routes.map((name, k) => {
          const f = easeInOut(interpolate(e, [from + k * draw, from + (k + 1) * draw], [0, 1], clamp));
          return f > 0 && m.ways[name] ? <path key={name} d={m.ways[name]} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - f} fill="none" stroke={col("accent")} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" /> : null;
        })}
        {(l.pins ?? []).map((pin, k) => {
          const s = Math.floor((e - pinsAt - k * 0.25) * 12);
          const [label, x, y] = typeof pin === "string" ? [pin, ...(m.points[pin] ?? [-99, -99])] : pin;
          if (s < 0) return null;
          return (
            <g key={k} transform={`translate(${x} ${y}) scale(${POP[Math.min(s, POP.length - 1)]})`}>
              <circle r={14 * u} fill={col("accent")} stroke={col("paper")} strokeWidth={5 * u} />
              <rect x={22 * u} y={-24 * u} width={(label.length * 21 + 28) * u} height={48 * u} fill={col("ink")} />
              <text x={36 * u} y={10 * u} fill={col("paper")} style={type(32)}>
                {label.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }
  if ("doc" in l) {
    // The highlighter sweeps the phrase across its lines in reading order (one background laid over the whole run).
    const size = l.size ?? 30;
    const face = l.face ?? "press";
    const hl = cueAt === undefined ? 0 : easeInOut(interpolate(e, [cueAt, cueAt + 0.45], [0, 1], clamp));
    const dim = cueAt === undefined ? 0 : interpolate(e, [cueAt, cueAt + 0.3], [0, 0.55], clamp);
    const at = l.mark ? l.doc.indexOf(l.mark) : -1;
    const runs = at < 0 ? [l.doc] : [l.doc.slice(0, at), l.mark!, l.doc.slice(at + l.mark!.length)];
    const font = face === "typed" ? typewriter : fell;
    const paper = face === "press" ? "#E9E3D2" : face === "typed" ? "#F3EEE2" : "#F1E9D6";
    return (
      <div style={{ ...piece, width: w, padding: `${size * 1.2}px ${size * 1.1}px`, background: paper, color: "#1E1C19", fontFamily: font, fontSize: size, lineHeight: 1.32, boxShadow: "inset 0 0 80px rgba(120,90,40,0.18)" }}>
        {l.paper ? <Img src={staticFile(l.paper)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} /> : null}
        {l.head ? <div style={{ position: "relative", fontFamily: fell, fontSize: size * 2.1, lineHeight: 1, textAlign: "center", paddingBottom: size * 0.4, marginBottom: size * 0.6, borderBottom: "3px double #1E1C19" }}>{l.head}</div> : null}
        <div style={{ position: "relative", columnCount: face === "press" ? 2 : 1, columnGap: size * 1.2, columnRule: face === "press" ? "1px solid rgba(30,28,25,0.5)" : undefined, textAlign: face === "typed" ? "left" : "justify", hyphens: "auto", whiteSpace: "pre-wrap" }}>
          {runs.map((r, k) =>
            k === 1 ? (
              <span key={k} style={{ backgroundImage: `linear-gradient(${col("hl")}, ${col("hl")})`, backgroundRepeat: "no-repeat", backgroundSize: `${hl * 100}% 100%`, padding: "0 2px", hyphens: "none" }}>
                {r}
              </span>
            ) : (
              <span key={k} style={{ opacity: 1 - dim }}>
                {r}
              </span>
            ),
          )}
        </div>
      </div>
    );
  }
  if ("fore" in l) {
    const edge = l.y ?? (l.fore === "bottom" ? 960 : 160);
    const pts = Array.from({ length: 25 }, (_, k) => `${(k / 24) * 1200}px ${(edge + (rnd(seed + k) - 0.5) * 34 + 60).toFixed(1)}px`);
    const clip = l.fore === "bottom" ? `polygon(${pts.join(", ")}, 1200px 1520px, 0px 1520px)` : `polygon(0px 0px, 1200px 0px, ${pts.reverse().join(", ")})`;
    return (
      <div style={{ position: "absolute", left: -60, top: -60, width: 1200, height: 1520, filter: "drop-shadow(0 -6px 10px rgba(0,0,0,0.35))" }}>
        <div style={{ position: "absolute", inset: 0, background: col(l.color, "paper"), clipPath: clip }} />
      </div>
    );
  }
  if ("grid" in l) {
    const cols = l.cols ?? 10;
    const size = l.size ?? 90;
    const lit = cueAt !== undefined && e >= cueAt;
    return (
      <svg width={cols * size} height={Math.ceil(l.grid / cols) * size} style={{ ...piece, overflow: "visible" }}>
        {Array.from({ length: l.grid }, (_, k) => {
          const row = Math.floor(k / cols);
          if (e < row * 0.09) return null;
          const c = lit && k === l.mark ? col("accent") : col("ink");
          return (
            <g key={k} transform={`translate(${(k % cols) * size + size / 2} ${row * size + size * 0.12}) scale(${(size / 100) * (lit && k === l.mark ? 1.15 : 1)})`} fill={c}>
              <circle cx={0} cy={16} r={14} />
              <path d="M -24 76 Q -24 36 0 36 Q 24 36 24 76 Z" />
            </g>
          );
        })}
      </svg>
    );
  }
  if ("ghost" in l) return <div style={{ ...piece, fontFamily: sans, fontWeight: 900, fontSize: l.size ?? 520, lineHeight: 0.8, color: col(l.color, "#FFFFFF"), opacity: 0.32, letterSpacing: -10 }}>{l.ghost}</div>;
  const c = col(l.color, "red");
  const pattern = {
    cross: `linear-gradient(45deg, transparent 44%, rgba(0,0,0,0.75) 44% 56%, transparent 56%) 0 0 / 28px 28px, linear-gradient(-45deg, transparent 44%, rgba(0,0,0,0.75) 44% 56%, transparent 56%) 0 0 / 28px 28px, ${c}`,
    dots: `radial-gradient(circle, rgba(0,0,0,0.7) 28%, transparent 31%) 0 0 / 22px 22px, ${c}`,
    stripes: `repeating-linear-gradient(-45deg, ${c} 0 16px, #F2EEE4 16px 30px)`,
    check: `conic-gradient(${c} 25%, #F2EEE4 0 50%, ${c} 0 75%, #F2EEE4 0) 0 0 / 36px 36px`,
  }[l.motif];
  return <div style={{ ...piece, width: w, height: l.h ?? w * 0.6, background: pattern, clipPath: chipClip(seed) }} />;
};
