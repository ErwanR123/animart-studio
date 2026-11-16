// « Détails » engine: a reel JSON → a 1080×1920 composition. One camera travels through the painting: the whole
// painting with the hook and the work's label, then each detail (a move, a dwell long enough to read), the app ad
// laid over one detail, back to the whole painting for the follow call. Rules: README.md (same folder).
import React from "react";
import { AbsoluteFill, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Phone } from "./app";
import { inter } from "./fonts";
import type { Detail, DetailsReel } from "./types";

export const W = 1080, H = 1920, FPS = 30;
/** Text blocks end this far above the bottom: just above the platform's account name and caption. */
export const TEXT_BOTTOM = 380;
/** Frames: first shot (hook), camera move, dwell on a detail (time to read), ad, move back, end screen. */
const T = { hook: 40, travel: 30, dwell: 165, ad: 200, back: 36, end: 120 };
/** In the ad (frames from its start): the work recognised, its story opens, the waitlist button. */
const AD = { recog: 22, open: 44, cta: 78 };

type Cam = { cx: number; cy: number; wf: number; fy: number };

export function timeline(r: DetailsReel) {
  const adIdx = r.ad.afterDetail - 1;
  const arrive: number[] = [];
  let t = T.hook;
  r.details.forEach((_, i) => { t += T.travel; arrive.push(t); t += T.dwell + (i === adIdx ? T.ad : 0); });
  const leaveLast = t;
  const total = t + T.back + T.end;
  const adAt = arrive[adIdx] + T.dwell - 10;
  return { adIdx, arrive, leaveLast, total, adAt };
}

export function createDetailsReel(r: DetailsReel) {
  const img = staticFile(r.image);
  const AR = r.imageSize[0] / r.imageSize[1];
  const { adIdx, arrive, leaveLast, total, adAt } = timeline(r);

  // Camera keys: (cx, cy) is the painting point shown at screen height fy; wf the share of its width on screen.
  const WHOLE: Cam = { cx: 0.5, cy: 0.5, wf: 1, fy: 860 };
  const END_CAM: Cam = { ...WHOLE, fy: 700 }; // painting higher: room for the end text
  const keys: [number, Cam][] = [[0, WHOLE], [T.hook, { ...WHOLE, wf: 0.94 }]];
  r.details.forEach((d, i) => {
    const stay = T.dwell + (i === adIdx ? T.ad : 0);
    keys.push([arrive[i], { cx: d.cx, cy: d.cy, wf: d.wf, fy: 0.4 * H }]);
    keys.push([arrive[i] + stay, { cx: d.cx, cy: d.cy, wf: d.wf * (i === adIdx ? 0.86 : 0.93), fy: 0.4 * H }]);
  });
  keys.push([leaveLast + T.back, END_CAM], [total, { ...END_CAM, wf: 0.95 }]);
  const camAt = (f: number): Cam => {
    let k = 0;
    while (k < keys.length - 2 && f >= keys[k + 1][0]) k++;
    const [f0, a] = keys[k], [f1, b] = keys[k + 1];
    const moving = k % 2 === 1 || k === keys.length - 3; // odd segments are the moves between dwells
    const u = interpolate(f, [f0, f1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: moving ? Easing.inOut(Easing.cubic) : Easing.linear });
    return { cx: a.cx + (b.cx - a.cx) * u, cy: a.cy + (b.cy - a.cy) * u, wf: Math.exp(Math.log(a.wf) + (Math.log(b.wf) - Math.log(a.wf)) * u), fy: a.fy + (b.fy - a.fy) * u };
  };

  const Painting: React.FC<{ c: Cam }> = ({ c }) => {
    const iw = W / c.wf, ih = iw / AR;
    let left = W / 2 - c.cx * iw, top = c.fy - c.cy * ih;
    left = Math.min(0, Math.max(W - iw, left));
    if (ih >= H) top = Math.min(0, Math.max(H - ih, top));
    return <Img src={img} style={{ position: "absolute", left, top, width: iw, height: ih }} />;
  };

  // Progress: one square per detail, like the app's grid cells, filled with its detail when the camera arrives.
  const Tracker: React.FC<{ f: number; hide: number }> = ({ f, hide }) => {
    const { fps } = useVideoConfig();
    const S = 92;
    return (
      <div style={{ position: "absolute", left: 64, top: 250, display: "flex", gap: 14, opacity: 1 - hide }}>
        {r.details.map((d, i) => {
          const k = spring({ frame: f - arrive[i] - 12, fps, config: { damping: 11, stiffness: 170 } });
          const w = d.wf * 0.55, hf = w * AR;
          const x0 = Math.min(Math.max(d.cx - w / 2, 0), 1 - w), y0 = Math.min(Math.max(d.cy - hf / 2, 0), 1 - hf);
          return (
            <div key={i} style={{ position: "relative", width: S, height: S, borderRadius: 18, background: "rgba(0,0,0,0.35)", border: "3px solid rgba(255,255,255,0.45)",
              display: "grid", placeItems: "center", color: "rgba(255,255,255,0.6)", fontSize: 40, fontWeight: 600 }}>
              ?
              <div style={{ position: "absolute", inset: -3, borderRadius: 18, border: "3px solid #fff", overflow: "hidden", transform: `scale(${k})`, opacity: Math.min(1, k * 1.5), boxShadow: "0 4px 16px rgba(0,0,0,0.5)" }}>
                <Img src={img} style={{ position: "absolute", width: S / w, height: S / w / AR, left: (-x0 * S) / w, top: (-y0 * S) / w / AR }} />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const Caption: React.FC<{ d: Detail; f: number; stay: number; hide?: number }> = ({ d, f, stay, hide = 0 }) => {
    hide = Math.max(hide, interpolate(f, [stay - 8, stay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    const o = interpolate(f, [4, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (1 - hide);
    const o2 = interpolate(f, [18, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (1 - hide);
    return (
      <>
        <AbsoluteFill style={{ background: "linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.75) 72%, rgba(0,0,0,0.9) 100%)", opacity: 1 - hide * 0.6 }} />
        <div style={{ position: "absolute", left: 64, right: 150, bottom: TEXT_BOTTOM }}>
          <div style={{ opacity: o, fontSize: 66, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.035em", textWrap: "balance" }}>{d.title}</div>
          <div style={{ opacity: o2, fontSize: 36, lineHeight: 1.32, color: "rgba(255,255,255,0.8)", marginTop: 22, letterSpacing: "-0.01em" }}>{d.text}</div>
        </div>
      </>
    );
  };

  // The ad: a phone rises in front of the painting, recognises it, opens its story, then the waitlist button.
  const AdOverlay: React.FC<{ f: number }> = ({ f }) => {
    const { fps } = useVideoConfig();
    const inn = spring({ frame: f, fps, config: { damping: 15, stiffness: 110 } });
    const out = spring({ frame: f - (T.ad - 16), fps, config: { damping: 20, stiffness: 160 } });
    const p = inn - out;
    const buzz = f >= AD.recog && f < AD.recog + 9 ? Math.sin((f - AD.recog) * 2.6) * 7 : 0;
    const cta = spring({ frame: f - AD.cta, fps, config: { damping: 13, stiffness: 150 } });
    const line1 = interpolate(f, [6, 14, AD.open - 6, AD.open], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const line2 = interpolate(f, [AD.open, AD.open + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const txt: React.CSSProperties = { position: "absolute", left: 64, right: 64, top: 300, fontSize: 60, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.035em", textWrap: "balance" };
    return (
      <>
        <AbsoluteFill style={{ background: "linear-gradient(rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.25) 70%, rgba(0,0,0,0.7) 100%)", opacity: p }} />
        <div style={{ ...txt, opacity: line1 * p }}>Au musée, tu scannes le tableau…</div>
        <div style={{ ...txt, opacity: line2 * p }}>…et Animart te raconte ses secrets.<div style={{ fontSize: 36, fontWeight: 600, color: "#EAD9BF", marginTop: 14, letterSpacing: "-0.01em" }}>Gratuit.</div></div>
        <div style={{ position: "absolute", left: (W - 470 * 0.95) / 2, top: 480, transformOrigin: "top left",
          transform: `translate(${buzz}px, ${(1 - p) * 1400}px) scale(0.95) rotate(${(1 - p) * 8 - 1.5}deg)` }}>
          <Phone r={r} img={img} f={f} recog={AD.recog} open={AD.open} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: TEXT_BOTTOM, display: "flex", justifyContent: "center", opacity: cta * p, transform: `translateY(${(1 - cta) * 60}px)` }}>
          <div style={{ background: "#fff", color: "#111", fontSize: 38, fontWeight: 600, padding: "26px 52px", borderRadius: 999, letterSpacing: "-0.015em" }}>Rejoins la waitlist · lien en bio</div>
        </div>
      </>
    );
  };

  const end = { lines: ["Un chef-d'œuvre.", "Ses secrets.", "Tous les jours."], follow: "Abonne-toi", sub: "L'app arrive bientôt · waitlist en bio", ...r.end };

  const Component: React.FC = () => {
    const f = useCurrentFrame();
    const hookOut = interpolate(f, [T.hook - 6, T.hook + 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const endIn = interpolate(f, [leaveLast + T.back - 4, leaveLast + T.back + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const follow = spring({ frame: f - (leaveLast + T.back + 14), fps: FPS, config: { damping: 12, stiffness: 160 } });
    return (
      <AbsoluteFill style={{ background: "#17110E", color: "#fff", fontFamily: inter }}>
        <Painting c={camAt(f)} />

        {/* First shot: the work's label above the painting, the hook under it */}
        <div style={{ position: "absolute", left: 64, right: 64, top: 370, opacity: hookOut }}>
          <div style={{ fontSize: 46, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1 }}>{r.work.title}</div>
          <div style={{ fontSize: 34, fontWeight: 500, color: "rgba(255,255,255,0.7)", marginTop: 8 }}>{r.work.artist} · {r.work.date}</div>
        </div>
        <div style={{ position: "absolute", left: 64, right: 64, bottom: TEXT_BOTTOM, fontSize: 82, fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.045em", opacity: hookOut }}>{r.hook}</div>

        {r.details.map((d, i) => {
          const stay = T.dwell + (i === adIdx ? T.ad : 0);
          return (
            <Sequence key={i} from={arrive[i]} durationInFrames={stay}>
              <Caption d={d} f={f - arrive[i]} stay={stay}
                hide={i === adIdx ? interpolate(f - arrive[i], [T.dwell - 16, T.dwell - 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0} />
              {i === adIdx && <Sequence from={T.dwell - 10} durationInFrames={T.ad + 10}><AdOverlay f={f - adAt} /></Sequence>}
            </Sequence>
          );
        })}

        {/* End: the whole painting, the follow call */}
        <div style={{ position: "absolute", left: 64, right: 64, bottom: TEXT_BOTTOM, opacity: endIn, transform: `translateY(${(1 - endIn) * 30}px)` }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.045em" }}>{end.lines.map((l, i) => <div key={i}>{l}</div>)}</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginTop: 34, background: "#fff", color: "#111", fontSize: 40, fontWeight: 700,
            padding: "22px 44px", borderRadius: 999, letterSpacing: "-0.02em", transform: `scale(${follow})`, transformOrigin: "left center" }}>
            <span style={{ fontSize: 46, lineHeight: 1, marginTop: -4 }}>+</span>{end.follow}</div>
          <div style={{ fontSize: 30, color: "rgba(255,255,255,0.7)", marginTop: 26 }}>{end.sub}</div>
        </div>

        {f >= arrive[0] && <Tracker f={f} hide={interpolate(f, [adAt, adAt + 10, adAt + T.ad - 10, adAt + T.ad], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />}
      </AbsoluteFill>
    );
  };

  return { Component, durationInFrames: total };
}
