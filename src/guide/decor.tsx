import type React from "react";
import { createContext, useContext } from "react";
import { Img, interpolate, staticFile } from "remotion";
import rough from "roughjs";
import { display, fellSC, hand, poster, typewriter } from "../fonts";
import { clamp, easeInOut } from "../theme";

// The collage kit beyond tape, stamps and stripes: hand-drawn marks (Rough.js, fixed seeds so a mark never
// re-randomises between frames), desk objects that hold the pieces (washi tape, pins, clips), period paper (postage
// stamps, tags, tickets, press clippings) and a halftone disc. Every kind takes a
// colour, so each episode can have its own palette instead of the same orange disc and red-and-cream band.
// Coordinates are px in the 1080 × 1400 shot. Rendered by shots.tsx (`Layer`), which handles landing and parallax.

export const PALETTE = {
  red: "#C0281C",
  cream: "#F2EBDD",
  ink: "#1C1B19",
  yellow: "#F4C531",
  orange: "#E2602E",
  blue: "#2F5D8C",
  teal: "#2E7D74",
  pink: "#E59AA6",
  green: "#6E8B3D",
  ochre: "#D9A441",
  // The roles (bible/vox.md §4): one paper, one ink, one saturated accent, the highlighter.
  paper: "#F2EBDD",
  accent: "#C0281C",
  hl: "#F4C531",
};
// An episode locks its palette (GuideConfig.palette): any role or named colour redefined there is what every piece
// naming it draws with. A colour that is not a name ("#2B6A99") is used as given.
export type Palette = Partial<Record<keyof typeof PALETTE, string>>;
export const PaletteContext = createContext<Palette>({});
export const usePalette = () => {
  const pal = useContext(PaletteContext);
  return (c: string | undefined, fallback = "ink") => {
    const k = c ?? fallback;
    return pal[k as keyof Palette] ?? PALETTE[k as keyof typeof PALETTE] ?? k;
  };
};

type Box = [number, number, number, number]; // x, y, w, h
export type DecorLayer =
  | { scribble: Box; color?: string; width?: number; draw?: number } // a marker loop round a box, two passes
  | { arrow: [number, number, number, number]; bend?: number; color?: string; width?: number; draw?: number } // from x1,y1 to x2,y2, curved
  | { underline: [number, number, number]; wave?: boolean; color?: string; width?: number; draw?: number } // x, y, length
  | { cross: Box; color?: string; width?: number; draw?: number } // a big X over a box
  | { bracket: [number, number, number]; flip?: boolean; color?: string; width?: number; draw?: number } // x, y, height: a curly brace
  | { halftone: string } // a disc of print dots fading out at the rim, `w` across
  | { washi: string; pattern?: "plain" | "stripes" | "dots" | "grid" } // a strip of washi tape, `w` long
  | { pin: string } // a push pin seen from above
  | { clip: true } // a steel paper clip, upright
  | { postage: string; value?: string; color?: string } // an image in a perforated stamp, `w` wide
  | { label: string; color?: string; size?: number } // a luggage tag with its string, handwritten
  | { ticket: string; sub?: string; color?: string } // a ticket stub with a serial number
  | { clipping: string; masthead?: string; lines?: number; mark?: number } // a press clipping, `w` wide; `mark`: the line a highlighter sweeps
  | { polaroid: string; caption?: string } // a photo in a white instant-print frame with a handwritten caption, `w` wide
  | { typed: string; size?: number; speed?: number } // typed letter by letter on a sheet (`speed` letters a second), `w` wide
  | { filmstrip: string[]; speed?: number } // a strip of film frames scrolling sideways (`speed` px a second), `w` = frame width
  | { redact: Box }; // a black censor bar sliding over a box

const gen = rough.generator();
const roughPaths = (d: ReturnType<typeof gen.path>) => gen.toPaths(d).map((p) => p.d);

// A set of SVG paths drawn on in order over `draw` seconds (each path in its share of the time).
const Strokes: React.FC<{ paths: string[]; e: number; draw: number; color: string; width: number }> = ({ paths, e, draw, color, width }) => {
  const p = interpolate(e, [0, draw], [0, paths.length], clamp);
  return (
    <svg width={1080} height={1400} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {paths.map((d, k) => {
        const local = easeInOut(Math.max(0, Math.min(1, p - k)));
        return local > 0 ? <path key={k} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - local} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" /> : null;
      })}
    </svg>
  );
};

// A ragged edge for paper ends (tape, tickets), deterministic.
const rnd = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
const raggedEnds = (seed: number) => {
  const left = Array.from({ length: 7 }, (_, k) => `${(rnd(seed + k) * 4).toFixed(1)}% ${((k / 6) * 100).toFixed(0)}%`);
  const right = Array.from({ length: 7 }, (_, k) => `${(96 + rnd(seed + 20 + k) * 4).toFixed(1)}% ${(100 - (k / 6) * 100).toFixed(0)}%`);
  return `polygon(${[...left, ...right].join(", ")})`;
};

// Perforations: round bites all along a stamp's edge (a dot pattern), the middle kept whole (a plain rectangle).
const perforated = (size: number) => ({
  WebkitMaskImage: `radial-gradient(circle at ${size / 2}px ${size / 2}px, transparent ${size * 0.28}px, black ${size * 0.3}px), linear-gradient(#000, #000)`,
  WebkitMaskSize: `${size}px ${size}px, calc(100% - ${size}px) calc(100% - ${size}px)`,
  WebkitMaskPosition: `-${size / 2}px -${size / 2}px, center`,
  WebkitMaskRepeat: "repeat, no-repeat",
});

export const isDecor = (l: object): l is DecorLayer =>
  ["scribble", "arrow", "underline", "cross", "bracket", "halftone", "washi", "pin", "clip", "postage", "label", "ticket", "clipping", "polaroid", "typed", "filmstrip", "redact"].some((k) => k in l);
// Marks drawn on the page (no drop shadow, no landing move: they are drawn on).
export const isMark = (l: object) => ["scribble", "arrow", "underline", "cross", "bracket", "redact"].some((k) => k in l);

export const Decor: React.FC<{ l: DecorLayer & { x?: number; y?: number; w?: number; rot?: number }; e: number; seed: number; piece: React.CSSProperties }> = ({ l, e, seed, piece }) => {
  const col = usePalette();
  const w = l.w ?? 300;
  if ("scribble" in l) {
    const [x, y, bw, bh] = l.scribble;
    const o = { seed: seed + 1, roughness: 1.6, bowing: 1.2, disableMultiStroke: true };
    const paths = [...roughPaths(gen.ellipse(x + bw / 2, y + bh / 2, bw * 1.08, bh * 1.12, o)), ...roughPaths(gen.ellipse(x + bw / 2 + 6, y + bh / 2 - 4, bw * 1.15, bh * 1.05, { ...o, seed: seed + 2 }))];
    return <Strokes paths={paths} e={e} draw={l.draw ?? 0.6} color={col(l.color, "red")} width={l.width ?? 9} />;
  }
  if ("arrow" in l) {
    const [x1, y1, x2, y2] = l.arrow;
    const len = Math.hypot(x2 - x1, y2 - y1);
    const nx = -(y2 - y1) / len;
    const ny = (x2 - x1) / len;
    const b = (l.bend ?? 0.25) * len;
    const cx = (x1 + x2) / 2 + nx * b;
    const cy = (y1 + y2) / 2 + ny * b;
    // The head follows the curve's last tangent.
    const tx = x2 - cx;
    const ty = y2 - cy;
    const tl = Math.hypot(tx, ty);
    const hs = Math.min(70, len * 0.22);
    const head = (s: number) => {
      const a = Math.atan2(ty / tl, tx / tl) + Math.PI + s * 0.5;
      return `M ${x2} ${y2} L ${(x2 + Math.cos(a) * hs).toFixed(1)} ${(y2 + Math.sin(a) * hs).toFixed(1)}`;
    };
    const o = { seed: seed + 3, roughness: 1.1, disableMultiStroke: true };
    const paths = [...roughPaths(gen.path(`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`, o)), ...roughPaths(gen.path(head(1), o)), ...roughPaths(gen.path(head(-1), o))];
    return <Strokes paths={paths} e={e} draw={l.draw ?? 0.55} color={col(l.color, "red")} width={l.width ?? 10} />;
  }
  if ("underline" in l) {
    const [x, y, len] = l.underline;
    const d = l.wave
      ? `M ${x} ${y} ` + Array.from({ length: 8 }, (_, k) => `Q ${x + (len / 8) * (k + 0.5)} ${y + (k % 2 ? 14 : -14)} ${x + (len / 8) * (k + 1)} ${y}`).join(" ")
      : `M ${x} ${y} L ${x + len} ${y - 6} M ${x + 20} ${y + 16} L ${x + len - 10} ${y + 10}`;
    return <Strokes paths={roughPaths(gen.path(d, { seed: seed + 4, roughness: 1.2, disableMultiStroke: true }))} e={e} draw={l.draw ?? 0.4} color={col(l.color, "red")} width={l.width ?? 9} />;
  }
  if ("cross" in l) {
    const [x, y, bw, bh] = l.cross;
    const o = { seed: seed + 5, roughness: 1.4, disableMultiStroke: true };
    const paths = [...roughPaths(gen.line(x, y, x + bw, y + bh, o)), ...roughPaths(gen.line(x + bw, y, x, y + bh, { ...o, seed: seed + 6 }))];
    return <Strokes paths={paths} e={e} draw={l.draw ?? 0.45} color={col(l.color, "red")} width={l.width ?? 14} />;
  }
  if ("bracket" in l) {
    const [x, y, h] = l.bracket;
    const s = l.flip ? -1 : 1;
    const d = `M ${x} ${y} Q ${x - 30 * s} ${y} ${x - 30 * s} ${y + h * 0.2} L ${x - 30 * s} ${y + h * 0.4} Q ${x - 30 * s} ${y + h / 2} ${x - 55 * s} ${y + h / 2} Q ${x - 30 * s} ${y + h / 2} ${x - 30 * s} ${y + h * 0.6} L ${x - 30 * s} ${y + h * 0.8} Q ${x - 30 * s} ${y + h} ${x} ${y + h}`;
    return <Strokes paths={roughPaths(gen.path(d, { seed: seed + 7, roughness: 0.9, disableMultiStroke: true }))} e={e} draw={l.draw ?? 0.5} color={col(l.color, "red")} width={l.width ?? 9} />;
  }
  if ("halftone" in l) {
    const c = col(l.halftone, "red");
    return <div style={{ ...piece, width: w, height: w, borderRadius: "50%", background: `radial-gradient(circle, ${c} 38%, transparent 41%)`, backgroundSize: `${Math.max(10, w / 24)}px ${Math.max(10, w / 24)}px`, WebkitMaskImage: "radial-gradient(circle, black 30%, transparent 70%)", mixBlendMode: "multiply" }} />;
  }
  if ("washi" in l) {
    const c = col(l.washi, "pink");
    const pattern =
      l.pattern === "stripes"
        ? `repeating-linear-gradient(90deg, ${c} 0 14px, rgba(255,255,255,0.35) 14px 22px)`
        : l.pattern === "dots"
          ? `radial-gradient(circle, rgba(255,255,255,0.55) 22%, transparent 26%) 0 0 / 22px 22px, ${c}`
          : l.pattern === "grid"
            ? `linear-gradient(rgba(255,255,255,0.4) 2px, transparent 2px) 0 0 / 18px 18px, linear-gradient(90deg, rgba(255,255,255,0.4) 2px, transparent 2px) 0 0 / 18px 18px, ${c}`
            : c;
    return <div style={{ ...piece, width: w, height: 56, background: pattern, opacity: 0.86, clipPath: raggedEnds(seed), boxShadow: "inset 0 0 12px rgba(0,0,0,0.12)" }} />;
  }
  if ("pin" in l) {
    const c = col(l.pin, "red");
    return (
      <svg width={70} height={70} viewBox="0 0 70 70" style={{ ...piece, overflow: "visible" }}>
        <ellipse cx={42} cy={44} rx={22} ry={12} fill="rgba(0,0,0,0.3)" />
        <circle cx={33} cy={33} r={22} fill={c} />
        <circle cx={33} cy={33} r={22} fill="url(#pin-shade)" />
        <circle cx={26} cy={25} r={7} fill="rgba(255,255,255,0.55)" />
        <defs>
          <radialGradient id="pin-shade" cx="0.35" cy="0.3" r="0.8">
            <stop offset="0.5" stopColor="rgba(0,0,0,0)" />
            <stop offset="1" stopColor="rgba(0,0,0,0.35)" />
          </radialGradient>
        </defs>
      </svg>
    );
  }
  if ("clip" in l)
    return (
      <svg width={60} height={170} viewBox="0 0 60 170" style={{ ...piece, overflow: "visible" }}>
        <path d="M 40 40 L 40 140 A 15 15 0 0 1 10 140 L 10 25 A 20 20 0 0 1 50 25 L 50 125 A 5 5 0 0 1 40 125" fill="none" stroke="#9AA0A6" strokeWidth={7} strokeLinecap="round" />
        <path d="M 40 40 L 40 140 A 15 15 0 0 1 10 140 L 10 25 A 20 20 0 0 1 50 25 L 50 125" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={2} transform="translate(-1.5,-1.5)" />
      </svg>
    );
  if ("postage" in l)
    return (
      <div style={{ ...piece, width: w, padding: w * 0.07, background: col("cream"), ...perforated(w * 0.07), filter: `${piece.filter ?? ""} drop-shadow(0 6px 10px rgba(0,0,0,0.35))` }}>
        <Img src={staticFile(l.postage)} style={{ display: "block", width: "100%", height: "auto" }} />
        {l.value ? <div style={{ position: "absolute", right: w * 0.1, bottom: w * 0.09, fontFamily: poster, fontSize: w * 0.14, color: col(l.color, "red") }}>{l.value}</div> : null}
      </div>
    );
  if ("label" in l) {
    const size = l.size ?? 46;
    return (
      <div style={{ ...piece, transformOrigin: "0 50%" }}>
        <svg width={160} height={40} style={{ position: "absolute", left: -150, top: size * 0.6, overflow: "visible" }}>
          <path d="M 0 30 C 50 -10 100 40 158 10" fill="none" stroke="#B8A27A" strokeWidth={4} />
        </svg>
        <div style={{ position: "relative", padding: `${size * 0.4}px ${size * 0.7}px ${size * 0.35}px ${size * 1.1}px`, background: col(l.color, "#E8D9B5"), fontFamily: hand, fontWeight: 700, fontSize: size, lineHeight: 1, color: col("ink"), whiteSpace: "nowrap", clipPath: `polygon(${size * 0.6}px 0, 100% 0, 100% 100%, ${size * 0.6}px 100%, 0 50%)` }}>
          <div style={{ position: "absolute", left: size * 0.55, top: "50%", width: size * 0.3, height: size * 0.3, marginTop: -size * 0.15, borderRadius: "50%", background: "#2A241D", boxShadow: "0 0 0 4px #CDBB8E" }} />
          {l.label}
        </div>
      </div>
    );
  }
  if ("ticket" in l)
    return (
      <div style={{ ...piece, width: w, padding: "18px 26px", background: col(l.color, "#E9B7A0"), clipPath: raggedEnds(seed + 9), fontFamily: fellSC, color: col("ink"), textAlign: "center", borderTop: "3px dashed rgba(0,0,0,0.25)", borderBottom: "3px dashed rgba(0,0,0,0.25)" }}>
        <div style={{ fontSize: w * 0.13, lineHeight: 1 }}>{l.ticket}</div>
        {l.sub ? <div style={{ fontSize: w * 0.075, marginTop: 6 }}>{l.sub}</div> : null}
        <div style={{ fontFamily: poster, fontSize: w * 0.07, color: col("red"), marginTop: 6, letterSpacing: 4 }}>N° {String(Math.floor(rnd(seed) * 90000) + 10000)}</div>
      </div>
    );
  if ("polaroid" in l)
    return (
      <div style={{ ...piece, width: w, padding: `${w * 0.05}px ${w * 0.05}px ${w * 0.2}px`, background: "#F7F4EC" }}>
        <Img src={staticFile(l.polaroid)} style={{ display: "block", width: "100%", aspectRatio: "1", objectFit: "cover" }} />
        {l.caption ? <div style={{ position: "absolute", left: 0, right: 0, bottom: w * 0.035, textAlign: "center", fontFamily: hand, fontWeight: 700, fontSize: w * 0.1, color: col("ink") }}>{l.caption}</div> : null}
      </div>
    );
  if ("typed" in l) {
    const shown = Math.floor(Math.max(0, e - 0.2) * (l.speed ?? 28));
    const size = l.size ?? 40;
    return (
      <div style={{ ...piece, width: w, padding: `${size}px ${size * 0.9}px`, background: "#F4EFE2", fontFamily: typewriter, fontSize: size, lineHeight: 1.35, color: "#22201C", whiteSpace: "pre-wrap", boxShadow: "inset 0 0 40px rgba(120,90,40,0.18)" }}>
        <span>{l.typed.slice(0, shown)}</span>
        <span style={{ visibility: "hidden" }}>{l.typed.slice(shown)}</span>
      </div>
    );
  }
  if ("filmstrip" in l) {
    const fw = w;
    const shift = (e * (l.speed ?? 120)) % (fw * l.filmstrip.length);
    const frames = [...l.filmstrip, ...l.filmstrip, ...l.filmstrip];
    const holes = { height: 34, background: "radial-gradient(ellipse 30% 36% at 50% 50%, #E9E2D0 90%, transparent 100%) 0 0 / 46px 34px, #141210" };
    return (
      <div style={{ ...piece, width: fw * 3.2, overflow: "hidden", background: "#141210" }}>
        <div style={holes} />
        <div style={{ display: "flex", gap: 14, padding: "0 7px", transform: `translateX(${-shift}px)` }}>
          {frames.map((f, k) => (
            <Img key={k} src={staticFile(f)} style={{ width: fw, height: fw * 0.75, objectFit: "cover", flex: "none", filter: "grayscale(1) contrast(1.1)" }} />
          ))}
        </div>
        <div style={holes} />
      </div>
    );
  }
  if ("redact" in l) {
    const [x, y, bw, bh] = l.redact;
    const wipe = interpolate(e, [0, 0.25], [0, 1], { ...clamp, easing: easeInOut });
    return <div style={{ position: "absolute", left: x, top: y, width: bw * wipe, height: bh, background: "#121110", transform: "rotate(-0.8deg)", boxShadow: "0 2px 0 rgba(0,0,0,0.3)" }} />;
  }
  // A press clipping: masthead, headline, then lines of small type (grey bars); `mark` gets a highlighter sweep.
  const lines = l.lines ?? 7;
  const sweep = interpolate(e, [0.5, 0.85], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <div style={{ ...piece, width: w, padding: "26px 30px 30px", background: "#EFE8D6", color: col("ink"), clipPath: "polygon(0 1%, 4% 0, 30% 1.5%, 62% 0, 100% 1%, 99% 40%, 100% 99%, 70% 100%, 35% 98.5%, 0 100%, 1% 60%)" }}>
      {l.masthead ? <div style={{ fontFamily: display, fontSize: w * 0.09, textAlign: "center", borderBottom: "3px double #1C1B19", paddingBottom: 8, marginBottom: 14 }}>{l.masthead}</div> : null}
      <div style={{ fontFamily: display, fontSize: w * 0.075, lineHeight: 1.05, marginBottom: 16 }}>{l.clipping}</div>
      {Array.from({ length: lines }, (_, k) => (
        <div key={k} style={{ position: "relative", height: 13, margin: "11px 0", width: `${k === lines - 1 ? 55 : 92 + rnd(seed + k) * 8}%`, background: "rgba(28,27,25,0.55)" }}>
          {k === l.mark ? <div style={{ position: "absolute", left: -6, top: -9, height: 31, width: `${sweep * 104}%`, background: col("yellow"), opacity: 0.8, mixBlendMode: "multiply" }} /> : null}
        </div>
      ))}
    </div>
  );
};

// Treatments of an image piece: a flat offset silhouette behind it (the Vox "sticker" in red), step-repeat echoes, a
// duotone. The silhouette is the PNG's own alpha used as a mask, so it follows a cut-out's outline exactly.
export const Silhouette: React.FC<{ src: string; color: string; dx: number; dy: number }> = ({ src, color, dx, dy }) => (
  <div style={{ position: "absolute", left: dx, top: dy, width: "100%", height: "100%", background: color, WebkitMaskImage: `url(${staticFile(src)})`, WebkitMaskSize: "100% 100%", WebkitMaskRepeat: "no-repeat" }} />
);

export const TONES: Record<string, [string, string]> = {
  red: ["#5C0F0B", "#F4D9C6"],
  blue: ["#13284A", "#DCE6EE"],
  teal: ["#0F3B37", "#E3EFE6"],
  ochre: ["#3B2A0E", "#F3DDA0"],
  pink: ["#4A1530", "#F6D5DC"],
};
const hex = (c: string) => [1, 3, 5].map((k) => (parseInt(c.slice(k, k + 2), 16) / 255).toFixed(3));
// One SVG filter per duotone, defined once in the shots' <defs>: luminance → a two-colour ramp.
export const ToneFilters: React.FC = () => (
  <>
    {Object.entries(TONES).map(([name, [dark, light]]) => {
      const [d, li] = [hex(dark), hex(light)];
      return (
        <filter key={name} id={`tone-${name}`} colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues={`${d[0]} ${li[0]}`} />
            <feFuncG type="table" tableValues={`${d[1]} ${li[1]}`} />
            <feFuncB type="table" tableValues={`${d[2]} ${li[2]}`} />
          </feComponentTransfer>
        </filter>
      );
    })}
  </>
);
