// The app's screens as the ad shows them, rebuilt from the Animart app's code (repo Animart: src/features/hunt/
// screens/WorkUnlocked.tsx board F, ui/story-parts.tsx, ui/player.tsx, ui/chrome.tsx, screens/Scan.tsx,
// theme/theme.ts) at the device's 390×844 pt, French strings from src/i18n. When the app's screen changes, change it
// here from the code, never from memory.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, useVideoConfig } from "remotion";
import { inter } from "./fonts";
import type { DetailsReel } from "./types";

const ICON = (d: string[], size: number, color: string, fill = "none") => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    {d.map((x, i) => <path key={i} d={x} />)}
  </svg>
);
const I = {
  pause: ["M6 4h4v16H6z", "M14 4h4v16h-4z"],
  ccw: ["M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", "M3 3v5h5"],
  cw: ["M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8", "M21 3v5h-5"],
  mic: ["M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z", "M19 10v2a7 7 0 0 1-14 0v-2", "M12 19v3"],
};

// Lyrics: opacity by distance to the line being said (story-parts.tsx NEAR).
const NEAR = [1, 0.5, 0.3, 0.16];
/** Frames per script line while the screen shows. */
export const LINE_EVERY = 34;
// Rows a line takes at 18 px semibold in 350 px (the app's lyric style), measured with the loaded font.
const rowsOf = (text: string) => {
  if (typeof document === "undefined") return 2;
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.font = `600 18px ${inter}`;
  let rows = 1, line = "";
  for (const w of text.split(" ")) {
    const next = line ? line + " " + w : w;
    if (ctx.measureText(next).width * 0.985 > 350 && line) { rows++; line = w; } else line = next;
  }
  return rows;
};

/** The found work's screen (WorkUnlocked, tab Présentation), the story playing for f frames. */
const WorkScreen: React.FC<{ r: DetailsReel; img: string; f: number }> = ({ r, img, f }) => {
  const { ground, deep, accent } = r.ad.palette;
  const script = r.ad.script;
  const [iw, ih] = r.imageSize;
  const artW = iw >= ih ? 236 : Math.round((236 * iw) / ih), artH = iw >= ih ? Math.round((236 * ih) / iw) : 236;
  const sec = 2 + Math.max(0, f) / 30;
  const heights = script.map(l => rowsOf(l) * 24 + 8);
  const tops = heights.map((_, i) => heights.slice(0, i).reduce((a, b) => a + b, 0));
  const k = Math.floor(Math.max(0, f) / LINE_EVERY);
  const u = interpolate(Math.max(0, f) - k * LINE_EVERY, [0, 10], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateRight: "clamp" });
  const pos = Math.min(script.length - 1, Math.max(0, k - 1 + u));
  const i0 = Math.floor(pos);
  const y = tops[i0] + (tops[Math.min(i0 + 1, script.length - 1)] - tops[i0]) * (pos - i0);
  const lyricsTop = 47 + 14 + 3 + 8 + 22 + 12 + artH + 18 + 26 + 2 + 19 + 12 + 34 + 8;
  return (
    <div style={{ position: "relative", width: 390, height: 844, overflow: "hidden", color: "#fff", fontFamily: inter,
      background: `radial-gradient(130% 75% at 50% 12%, ${ground} 0%, ${deep} 72%, ${deep} 100%)` }}>
      {/* status bar */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 47, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 34px 0 44px", fontSize: 16, fontWeight: 600 }}>
        <span>9:41</span><span style={{ position: "absolute", left: "50%", top: 11, width: 122, height: 36, marginLeft: -61, borderRadius: 20, background: "#000" }} />
        <span style={{ display: "flex", gap: 5, alignItems: "center" }}><i style={{ width: 17, height: 11, borderRadius: 2, background: "#fff", opacity: 0.9 }} /><i style={{ width: 24, height: 12, borderRadius: 4, border: "1.5px solid rgba(255,255,255,0.6)" }} /></span>
      </div>
      {/* StoryTop: bars + counter */}
      <div style={{ paddingTop: 47 + 14 }}>
        <div style={{ display: "flex", gap: 2, padding: "0 20px" }}>
          {Array.from({ length: 12 }, (_, i) => <i key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: i === 5 ? accent : i < 5 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.28)" }} />)}
        </div>
        <div style={{ padding: "0 20px", marginTop: 8, minHeight: 22, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, lineHeight: "18px", fontWeight: 600 }}>Trouvées {r.ad.found}</span>
          <span style={{ width: 22, height: 22, borderRadius: 11, background: accent, color: deep, fontSize: 11, fontWeight: 500, display: "grid", placeItems: "center" }}>E</span>
        </div>
      </div>
      {/* Header (board F): painting large, title and byline under it, aligned left */}
      <div style={{ padding: "0 20px" }}>
        <Img src={img} style={{ display: "block", margin: "12px auto 0", width: artW, height: artH, objectFit: "cover", borderRadius: 4, boxShadow: "0 8px 24px rgba(0,0,0,0.45)" }} />
        <div style={{ fontSize: 22, lineHeight: "26px", fontWeight: 600, letterSpacing: "-0.02em", marginTop: 18, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.work.title}</div>
        <div style={{ fontSize: 14, lineHeight: "19px", color: "rgba(255,255,255,0.65)", marginTop: 2 }}>{r.work.artist} · {r.work.date}</div>
      </div>
      {/* Tabs: Présentation open */}
      <div style={{ display: "flex", height: 34, margin: "12px 20px 0", padding: 2, borderRadius: 17, background: "rgba(255,255,255,0.12)" }}>
        <div style={{ flex: 1, borderRadius: 15, background: "rgba(255,255,255,0.28)", display: "grid", placeItems: "center", fontSize: 14, fontWeight: 600 }}>Présentation</div>
        <div style={{ flex: 1, display: "grid", placeItems: "center", fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>Anecdotes · {r.ad.anecdotes}</div>
      </div>
      {/* Lyrics: start right under the tabs; the line being said stays at the top as the voice goes on */}
      <div style={{ position: "absolute", left: 0, right: 0, top: lyricsTop, bottom: 34 + 46 + 8 + 98, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: -y }}>
          {script.map((l, i) => (
            <div key={i} style={{ padding: "4px 20px", fontSize: 18, lineHeight: "24px", fontWeight: 600, letterSpacing: "-0.015em",
              opacity: interpolate(Math.min(3, Math.abs(i - pos)), [0, 1, 2, 3], NEAR) }}>{l}</div>
          ))}
        </div>
      </div>
      {/* Player */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 34 + 46 + 8, borderTop: "0.5px solid rgba(255,255,255,0.12)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 20px", marginTop: 8 }}>
          <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)" }}>0:{String(Math.floor(sec)).padStart(2, "0")}</span>
          <div style={{ flex: 1, height: 20, display: "flex", alignItems: "center", position: "relative" }}>
            <div style={{ flex: 1, height: 4, borderRadius: 4, background: "rgba(255,255,255,0.28)", overflow: "hidden" }}><div style={{ width: `${(sec / 72) * 100}%`, height: "100%", background: accent }} /></div>
            <div style={{ position: "absolute", left: `calc(${(sec / 72) * 100}% - 5.5px)`, width: 11, height: 11, borderRadius: 6, background: "#fff" }} />
          </div>
          <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)" }}>1:12</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28 }}>
          <span style={{ width: 44 }} />
          <span style={{ position: "relative", display: "grid", placeItems: "center" }}>{ICON(I.ccw, 24, "#fff")}<b style={{ position: "absolute", fontSize: 8 }}>15</b></span>
          <span style={{ width: 50, height: 50, borderRadius: 25, background: accent, display: "grid", placeItems: "center" }}>{ICON(I.pause, 20, deep, deep)}</span>
          <span style={{ position: "relative", display: "grid", placeItems: "center" }}>{ICON(I.cw, 24, "#fff")}<b style={{ position: "absolute", fontSize: 8 }}>15</b></span>
          <span style={{ width: 44, textAlign: "center", fontSize: 15, fontWeight: 600, color: accent }}>1×</span>
        </div>
      </div>
      {/* Ask row */}
      <div style={{ position: "absolute", left: 16, right: 16, bottom: 34, height: 46, borderRadius: 23, background: "rgba(255,255,255,0.12)", paddingLeft: 18, paddingRight: 4, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ flex: 1, fontSize: 17, color: "rgba(255,255,255,0.62)" }}>Pose ta question au Guide…</span>
        <span style={{ width: 37, height: 37, borderRadius: 19, background: accent, display: "grid", placeItems: "center" }}>{ICON(I.mic, 18, deep)}</span>
      </div>
      <div style={{ position: "absolute", left: "50%", bottom: 8, width: 134, height: 5, marginLeft: -67, borderRadius: 3, background: "#fff" }} />
    </div>
  );
};

/** The scan screen (Scan.tsx, V01), pointed at the painting; the work is recognised at frame `recog`. */
const CameraScreen: React.FC<{ img: string; ar: number; f: number; recog: number }> = ({ img, ar, f, recog }) => {
  const { fps } = useVideoConfig();
  const pill = spring({ frame: f - recog, fps, config: { damping: 14, stiffness: 180 } });
  const corner = (pos: string): React.CSSProperties => {
    const st: React.CSSProperties = { position: "absolute", width: 52, height: 52, borderColor: "#fff", borderStyle: "solid", borderWidth: 0 };
    // Scan.tsx: the frame runs from 24 % to 64 % of the screen, 34 pt from each side.
    const [v, h] = [pos[0] === "t" ? { top: 0.24 * 844 } : { top: 0.64 * 844 - 52 }, pos[1] === "l" ? { left: 34 } : { right: 34 }];
    const r = pos === "tl" ? { borderTopLeftRadius: 12 } : pos === "tr" ? { borderTopRightRadius: 12 } : pos === "bl" ? { borderBottomLeftRadius: 12 } : { borderBottomRightRadius: 12 };
    const w = { [pos[0] === "t" ? "borderTopWidth" : "borderBottomWidth"]: 4, [pos[1] === "l" ? "borderLeftWidth" : "borderRightWidth"]: 4 };
    return { ...st, ...v, ...h, ...r, ...w };
  };
  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: inter, color: "#fff" }}>
      {(() => {
        // The painting seen through the camera: 3.3× the screen's width, drifting slowly as a hand-held phone would.
        const w = 390 * 3.3, h = w / ar;
        return <Img src={img} style={{ position: "absolute", width: w, height: h, left: -((52 + f * 0.02) / 100) * (w - 390), top: -0.62 * (h - 844) }} />;
      })()}
      <AbsoluteFill style={{ background: "linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0) 25%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.55))" }} />
      {["tl", "tr", "bl", "br"].map(p => <div key={p} style={corner(p)} />)}
      <div style={{ position: "absolute", left: 20, top: 54, width: 44, height: 44, borderRadius: "50%", background: "rgba(0,0,0,0.45)", display: "grid", placeItems: "center", fontSize: 26 }}>×</div>
      <div style={{ position: "absolute", left: "50%", top: 0.24 * 844 - 22, transform: `translateX(-50%) scale(${pill})`, opacity: pill, background: "#fff", color: "#111",
        borderRadius: 999, padding: "12px 22px", fontSize: 17, fontWeight: 600, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#1F8A4C" }} />Œuvre reconnue ›</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, textAlign: "center", fontSize: 16, opacity: pill }}>Ouverture de son histoire…</div>
      <div style={{ position: "absolute", left: "50%", bottom: 44, width: 76, height: 76, marginLeft: -38, borderRadius: "50%", border: "5px solid rgba(255,255,255,0.9)", padding: 5 }}>
        <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#fff" }} /></div>
    </AbsoluteFill>
  );
};

/** A phone (390×844 screen scaled into a 470-wide frame): the camera, then the work's screen sliding over it. */
export const Phone: React.FC<{ r: DetailsReel; img: string; f: number; recog: number; open: number }> = ({ r, img, f, recog, open }) => {
  const slide = interpolate(f, [open, open + 12], [1, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const screen = (child: React.ReactNode) => (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ width: 390, height: 844, transform: `scale(${450 / 390})`, transformOrigin: "top left" }}>{child}</div>
    </div>
  );
  return (
    <div style={{ position: "relative", width: 470, height: 994, borderRadius: 62, overflow: "hidden", border: "10px solid #000", boxShadow: "0 40px 90px rgba(0,0,0,0.75)" }}>
      {screen(<div style={{ position: "relative", width: 390, height: 844 }}><CameraScreen img={img} ar={r.imageSize[0] / r.imageSize[1]} f={f} recog={recog} /></div>)}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${slide * 100}%)` }}>{screen(<WorkScreen r={r} img={img} f={f - open - 6} />)}</div>
    </div>
  );
};
