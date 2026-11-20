// « Pubs » format: one app feature, one 20-second ad (README.md, same folder). This one: the daily grid, style A
// « Natif » (the app's light screens + the platforms' white text boxes), as prototyped in the « Pubs Animart » artifact.
// Times are in seconds, like the prototype; the phone screen is rebuilt from the app's theme (../Animart/src/theme).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const inter = loadFont("normal", { weights: ["400", "600", "700", "800", "900"], subsets: ["latin"] }).fontFamily;
export const FPS = 30, W = 1080, H = 1920, SECONDS = 20;

// The app's colours (theme.ts): ink, surface, outline, daily grid levels and states.
const C = { ink: "#111111", surface: "#F2F0EB", outline: "#E1DED7", muted: "#6B6862", disabled: "#9A968E", accent: "#C93B25",
  medium: "#F2994A", filled: "#7FA88E", rare: "#F2C94C", miss: "#E5484D", flame: "#E8743B", easy: "#5CC98B", plum: "#E8A0B4" };

const art = (n: string) => staticFile(`art/${n}/${n}.jpg`);

type Kind = "pop" | "up" | "fade" | "phone" | "shake";
/** Shows its children from `a` to `b` seconds, coming in with `kind` and fading out at `b`. */
const In: React.FC<{ a: number; b?: number; kind?: Kind; style?: React.CSSProperties; children?: React.ReactNode }> = ({ a, b, kind = "fade", style, children }) => {
  const f = useCurrentFrame(), t = f - a * FPS;
  if (t < 0 || (b !== undefined && f > b * FPS + 8)) return null;
  const out = b === undefined ? 1 : interpolate(f, [b * FPS, b * FPS + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ease = (n: number) => interpolate(t, [0, n], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  let opacity = 1, transform = "none";
  if (kind === "fade") opacity = ease(10);
  if (kind === "up") { const u = ease(13); opacity = u; transform = `translateY(${(1 - u) * 64}px)`; }
  if (kind === "pop") { const s = spring({ frame: t, fps: FPS, config: { damping: 11, stiffness: 190 } }); opacity = Math.min(1, t / 4); transform = `scale(${0.55 + 0.45 * s})`; }
  if (kind === "phone") { const u = ease(24); transform = `translateY(${(1 - u) * 2080}px) rotate(${(1 - u) * 6}deg)`; }
  if (kind === "shake") transform = `translateX(${Math.sin(t * 1.9) * 16 * Math.max(0, 1 - t / 15)}px)`;
  return <div style={{ position: "absolute", ...style, opacity: opacity * out, transform }}>{children}</div>;
};

/** The platforms' own text style: white boxes, one per line, black bold text. */
const Boxes: React.FC<{ lines: string[]; top: number; size?: number }> = ({ lines, top, size = 76 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", flexDirection: "column", alignItems: "center" }}>
    {lines.map((l, i) => <div key={i} style={{ background: "#fff", color: C.ink, fontWeight: 700, fontSize: size, lineHeight: 1.16, letterSpacing: "-0.02em",
      padding: "12px 36px", borderRadius: 28, marginTop: i ? -12 : 0, whiteSpace: "nowrap" }}>{l}</div>)}
  </div>
);

// The grid: rows and columns, then the order the cells are found in (seconds).
const COLS = ["Avant 1600", "1600–1800", "Après 1800"], ROWS = ["Te regarde", "De l'or", "Sur l'eau"];
const X = [136, 312, 488], Y = [336, 512, 688], CELL = 160;
const FINDS: { r: number; c: number; img: string; at: number }[] = [
  { r: 0, c: 0, img: "joconde", at: 5.6 }, { r: 2, c: 2, img: "radeau", at: 6.4 }, { r: 1, c: 0, img: "preteur", at: 7.2 },
  { r: 0, c: 2, img: "bonaparte", at: 8 }, { r: 1, c: 1, img: "tricheur", at: 9.8 }, { r: 1, c: 2, img: "sacre", at: 10.5 },
  { r: 2, c: 0, img: "nef", at: 11.3 },
];
const MISS = { r: 0, c: 1, at: 8.8, until: 9.6 };
const HOOK_TILES = ["joconde", "tricheur", "bonaparte", "preteur", "cana", "sacre", "nef", "liberte", "radeau"];

const Score: React.FC = () => {
  const s = useCurrentFrame() / FPS;
  const found = FINDS.filter(x => s >= x.at).length;
  return (
    <div style={{ position: "absolute", left: 48, right: 48, top: 944, display: "flex", justifyContent: "space-between", alignItems: "baseline", fontWeight: 800, letterSpacing: "-0.03em" }}>
      <span style={{ fontSize: 88 }}>{found}/9</span>
      <span style={{ fontSize: 32, fontWeight: 600, color: C.muted }}>{(found * 200).toLocaleString("fr-FR")} pts</span>
    </div>
  );
};

const Phone: React.FC = () => (
  <div style={{ width: 720, height: 1488, borderRadius: 124, background: "#0c0c0c", padding: 20, boxShadow: "0 72px 200px rgba(0,0,0,0.45)" }}>
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 104, overflow: "hidden", background: C.surface, color: C.ink }}>
      <div style={{ position: "absolute", top: 24, left: "50%", width: 184, height: 52, marginLeft: -92, borderRadius: 32, background: "#0c0c0c" }} />
      <div style={{ position: "absolute", left: 48, top: 120, fontWeight: 800, fontSize: 52, letterSpacing: "-0.03em" }}>Grille du jour</div>
      <div style={{ position: "absolute", right: 48, top: 126, fontSize: 32, fontWeight: 700, padding: "8px 28px", borderRadius: 99, background: C.medium }}>Moyen</div>
      {COLS.map((c, i) => <div key={c} style={{ position: "absolute", top: 248, left: X[i], width: CELL, fontSize: 26, fontWeight: 600, textAlign: "center", color: C.muted }}>{c}</div>)}
      {ROWS.map((r, i) => <div key={r} style={{ position: "absolute", left: 8, width: 116, top: Y[i] + 56, fontSize: 26, fontWeight: 600, textAlign: "right", color: C.muted, lineHeight: 1.15 }}>{r}</div>)}
      {Y.map((y, r) => X.map((x, c) => <div key={`${r}${c}`} style={{ position: "absolute", left: x, top: y, width: CELL, height: CELL, borderRadius: 28, background: "#fff",
        border: `4px solid ${C.outline}`, display: "grid", placeItems: "center", fontSize: 52, fontWeight: 700, color: C.disabled }}>?</div>))}
      <In a={10.7} style={{ left: 128, top: Y[1] - 16, width: 544, height: 192, borderRadius: 36, border: `8px solid ${C.rare}`, boxShadow: "0 0 0 16px rgba(242,201,76,0.25)" }} />
      {FINDS.map(x => <In key={x.img} a={x.at} kind="pop" style={{ left: X[x.c], top: Y[x.r] }}>
        <div style={{ width: CELL, height: CELL, borderRadius: 28, border: `8px solid ${C.filled}`, overflow: "hidden" }}>
          <Img src={art(x.img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </In>)}
      <In a={MISS.at} b={MISS.until} kind="shake" style={{ left: X[MISS.c], top: Y[MISS.r] }}>
        <div style={{ width: CELL, height: CELL, borderRadius: 28, border: `8px solid ${C.miss}`, background: "#fff", display: "grid", placeItems: "center", fontSize: 64, fontWeight: 800, color: C.miss }}>✕</div>
      </In>
      <Score />
      <In a={11.8} kind="up" style={{ left: 48, top: 1072, display: "flex", gap: 20, alignItems: "center", fontSize: 32, fontWeight: 700 }}>
        <div style={{ width: 36, height: 48, borderRadius: "50% 50% 45% 45% / 60% 60% 40% 40%", background: C.flame }} />12 jours d'affilée
      </In>
    </div>
  </div>
);

const Friend: React.FC<{ name: string; score: string; color: string }> = ({ name, score, color }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <span style={{ width: 72, height: 72, borderRadius: "50%", background: color, display: "grid", placeItems: "center", fontSize: 30, fontWeight: 800 }}>{name[0]}</span>{name}
    </span>
    <b>{score}</b>
  </div>
);

export const PubGrille: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.surface, fontFamily: inter, color: C.ink }}>
      {/* 0–2 s: the challenge over the day's paintings, blurred */}
      <In a={0} b={2.1}>
        <div style={{ position: "absolute", left: -80, top: -80, width: W + 160, height: H + 160, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24,
          padding: "160px 120px", filter: "blur(12px)", transform: `scale(${interpolate(f, [0, 66], [1.12, 1.02])})` }}>
          {HOOK_TILES.map(n => <Img key={n} src={art(n)} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 40 }} />)}
        </div>
      </In>
      <In a={0} b={2.1} kind="pop" style={{ inset: 0 }}><Boxes top={800} lines={["Je parie que tu fais", "pas 9/9."]} /></In>
      {/* 2–5 s: what it is */}
      <In a={2.2} b={4.9} kind="pop" style={{ inset: 0 }}><Boxes top={360} lines={["C'est le Wordle…", "mais pour l'art."]} /></In>
      {/* 5–15 s: the grid filling in the app */}
      <In a={2.6} b={15} kind="phone" style={{ left: 180, top: 600 }}><Phone /></In>
      <In a={5.2} b={8.6} kind="pop" style={{ inset: 0 }}><Boxes top={336} size={60} lines={["9 cases, 9 tableaux.", "Coche la ligne ET la colonne."]} /></In>
      <In a={8.8} b={11.9} kind="pop" style={{ inset: 0 }}><Boxes top={336} size={60} lines={["Une nouvelle chaque jour."]} /></In>
      <In a={12} b={14.9} kind="pop" style={{ inset: 0 }}><Boxes top={336} lines={["7/9. Pas mal."]} /></In>
      {/* 15–18 s: your friends' scores */}
      <In a={15.1} b={17.9} kind="pop" style={{ inset: 0 }}><Boxes top={400} lines={["Et tes potes ?"]} /></In>
      <In a={15.4} b={17.9} kind="up" style={{ left: 112, right: 112, top: 680 }}>
        <div style={{ background: "#fff", borderRadius: 48, padding: 56, display: "grid", gap: 36, fontSize: 48, fontWeight: 600, boxShadow: "0 40px 120px rgba(0,0,0,0.15)" }}>
          <Friend name="Léa" score="9/9" color={C.easy} />
          <Friend name="Toi" score="7/9" color={C.medium} />
          <Friend name="Malik" score="5/9" color={C.plum} />
        </div>
      </In>
      {/* 18–20 s: the waitlist */}
      <In a={18} style={{ inset: 0, background: C.ink, color: "#fff", display: "grid", placeContent: "center", justifyItems: "center", gap: 40, textAlign: "center" }}>
        <div style={{ fontSize: 160, fontWeight: 900, letterSpacing: "-0.06em", lineHeight: 1 }}>Animart</div>
        <div style={{ fontSize: 48, fontWeight: 600, lineHeight: 1.3, opacity: 0.8, maxWidth: 800 }}>La grille du jour, et tout le musée dans ta poche.</div>
        <div style={{ fontSize: 44, fontWeight: 700, padding: "32px 56px", borderRadius: 99, background: C.accent, marginTop: 24 }}>Bientôt · waitlist en bio</div>
      </In>
    </AbsoluteFill>
  );
};
