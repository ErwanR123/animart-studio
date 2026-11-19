// « Détails » engine: a reel JSON → a 1080×1920 composition. One camera travels through the painting: the whole
// painting with the hook and the work's label, then each detail (a move, a dwell long enough to read), the app ad
// laid over one detail, back to the whole painting for the follow call. Rules: README.md (same folder).
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Phone } from "./app";
import { inter } from "./fonts";
import type { Detail, DetailsReel } from "./types";

export const W = 1080, H = 1920, FPS = 30;
/** Text blocks end this far above the bottom: just above the platform's account name and caption. */
export const TEXT_BOTTOM = 300;
/** How far up the painting's bottom edge may rise: about the height of the text block. */
const TEXT_ZONE = 700;
const TOP_ZONE = 380; // a detail at the painting's top edge comes down out of the platform's top bar, the dark ground above it
/** Frames: first shot (hook), camera move, dwell on a detail (time to read), ad, move back, end screen. */
const T = { hook: 66, travel: 30, dwell: 165, ad: 150, back: 36, end: 120 };
/** In the ad (frames from its start): the work recognised, its story opens, the waitlist button. */
const AD = { recog: 16, open: 52, cta: 92 };
/** A named work pops in this long after the detail's text. */
const INSET_AT = 40;
/** The last frames glide back to the opening framing. */
const LOOP = 14;
/** Extra frames the ending ad keeps its buttons on screen. */
const AD_HOLD = 20;
/** The discreet follow call mid-video (2026-11-17 test: follow mid-video, beta sign-up at the end): its start in the
 * second detail's dwell, and how long it stays. */
const MID_FOLLOW = { at: 60, tap: 50, len: 100 };
/** The row of portraits (a detail's `faces`): top edge, each one's size, the delay between two. */
const FACES = { top: 245, w: 104, h: 128, every: 7 };
/** The spotlight (a detail's `marks`): the painting dims this long after the text, each spot lit one every `every`. */
const MARK = { at: 26, draw: 14, every: 45 };

type Cam = { cx: number; cy: number; wf: number; fy: number };
/** A detail's centre sits this high on screen: its whole subject stays above the text (which starts near 62 %). */
const DETAIL_Y = 0.34 * H;
/** The question's top edge: under the close-up's centre, clear of the platform's caption. */
const QUESTION_Y = 1080;

export function timeline(r: DetailsReel) {
  const adIdx = r.ad.afterDetail - 1;
  // The ad closing the video holds its two buttons a second longer, then the loop: no separate end screen.
  const adLast = adIdx === r.details.length - 1;
  const adLen = T.ad + (adLast ? AD_HOLD : 0);
  const arrive: number[] = [];
  let t = T.hook;
  r.details.forEach((_, i) => { t += T.travel; arrive.push(t); t += T.dwell + (i === adIdx ? adLen : 0); });
  const leaveLast = t;
  const total = adLast ? t + LOOP : t + T.back + T.end;
  const adAt = arrive[adIdx] + T.dwell - 10;
  return { adIdx, adLast, adLen, arrive, leaveLast, total, adAt };
}

/** Light sounds, one per visible event, under the music the platform adds (2026-11-19): the camera moving, a circle
 * being drawn, a square filling, a button tapped, the phone recognising the painting. All CC0 (public/sfx/SOURCES.md). */
const SFX = { swish: 0.22, pencil: 0.3, tick: 0.35, scan: 0.25 };
const Sfx: React.FC<{ at: number; file: string; volume: number }> = ({ at, file, volume }) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={45} layout="none">
    <Audio src={staticFile(`sfx/${file}`)} volume={volume} />
  </Sequence>
);

export function createDetailsReel(r: DetailsReel) {
  const img = staticFile(r.image);
  const AR = r.imageSize[0] / r.imageSize[1];
  const { adIdx, adLast, adLen, arrive, leaveLast, total, adAt } = timeline(r);

  // Camera keys: (cx, cy) is the painting point shown at screen height fy; wf the share of its width on screen.
  const WHOLE: Cam = { cx: 0.5, cy: 0.5, wf: 1, fy: 860 };
  const END_CAM: Cam = { ...WHOLE, fy: 700 }; // painting higher: room for the end text
  // [frame, camera, eased move to the next key (else a slow linear push)]
  // With `open`, the first frame is a close-up on the hook's strongest point that pulls back to the whole painting:
  // something to look at in the first second, not a slide (2026-11-19).
  const OPEN: Cam | null = r.open ? { ...r.open, fy: DETAIL_Y } : null;
  const OPEN_BACK = 36;
  // With a `question` (2026-11-19, the long hook lost people in 2 s): the camera holds the close-up, pushing in a little,
  // under one short question; it never shows the whole painting first.
  const keys: [number, Cam, boolean][] = OPEN && r.question
    ? [[0, OPEN, false], [T.hook, { ...OPEN, wf: OPEN.wf * 0.9 }, true]]
    : OPEN
    ? [[0, OPEN, true], [OPEN_BACK, WHOLE, false], [T.hook, { ...WHOLE, wf: 0.94 }, true]]
    : [[0, WHOLE, false], [T.hook, { ...WHOLE, wf: 0.94 }, true]];
  r.details.forEach((d, i) => {
    const stay = T.dwell + (i === adIdx ? adLen : 0);
    keys.push([arrive[i], { cx: d.cx, cy: d.cy, wf: d.wf, fy: DETAIL_Y }, false]);
    keys.push([arrive[i] + stay, { cx: d.cx, cy: d.cy, wf: d.wf * (i === adIdx ? 0.86 : 0.93), fy: DETAIL_Y }, true]);
  });
  // The end ends on the first frame's framing, so the replay follows on without a jump.
  if (adLast) keys.push([total, OPEN ?? WHOLE, false]);
  else keys.push([leaveLast + T.back, END_CAM, false], [total - LOOP, { ...END_CAM, wf: 0.97 }, true], [total, OPEN ?? WHOLE, false]);
  const camAt = (f: number): Cam => {
    let k = 0;
    while (k < keys.length - 2 && f >= keys[k + 1][0]) k++;
    const [f0, a, moving] = keys[k], [f1, b] = keys[k + 1];
    const u = interpolate(f, [f0, f1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: moving ? Easing.inOut(Easing.cubic) : Easing.linear });
    return { cx: a.cx + (b.cx - a.cx) * u, cy: a.cy + (b.cy - a.cy) * u, wf: Math.exp(Math.log(a.wf) + (Math.log(b.wf) - Math.log(a.wf)) * u), fy: a.fy + (b.fy - a.fy) * u };
  };

  // Where the painting lies on screen for a camera.
  const place = (c: Cam) => {
    const iw = W / c.wf, ih = iw / AR;
    let left = W / 2 - c.cx * iw, top = c.fy - c.cy * ih;
    left = Math.min(0, Math.max(W - iw, left));
    // The painting may stop above the frame's bottom by the text's height: a detail low in the painting (musicians
    // at the bottom edge) still sits above the text, the dark ground showing under the caption.
    if (ih >= H) top = Math.min(TOP_ZONE, Math.max(H - ih - TEXT_ZONE, top));
    return { left, top, iw, ih };
  };
  const Painting: React.FC<{ c: Cam }> = ({ c }) => {
    const { left, top, iw, ih } = place(c);
    return <Img src={img} style={{ position: "absolute", left, top, width: iw, height: ih }} />;
  };

  // A spotlight on what the text points at (2026-11-19, replaces drawn circles): the rest of the painting dims, each
  // marked spot stays lit, in turn, like a museum light. Nothing is drawn over the painting.
  const Marks: React.FC<{ d: Detail; f: number; frame: number; hide: number }> = ({ d, f, frame, hide }) => {
    if (!d.marks) return null;
    const { left, top, iw } = place(camAt(frame));
    const dim = interpolate(f, [MARK.at, MARK.at + MARK.draw], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }) * (1 - hide);
    const id = `spot-${d.cx}-${d.cy}`;
    return (
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
        <defs>
          <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={40} /></filter>
          <mask id={id}>
            <rect width={W} height={H} fill="#fff" />
            {d.marks.map((m, k) => {
              const u = interpolate(f, [MARK.at + k * MARK.every, MARK.at + k * MARK.every + MARK.draw], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
              const R = m.r * iw * 1.15, x = left + m.x * iw, y = top + m.y * iw / AR;
              return <ellipse key={k} cx={x} cy={y} rx={R * 1.1 * (0.6 + 0.4 * u)} ry={R * (0.6 + 0.4 * u)} fill="#000" opacity={u} filter={`url(#${id}-blur)`} />;
            })}
          </mask>
        </defs>
        <rect width={W} height={H} fill="#000" opacity={0.5 * dim} mask={`url(#${id})`} />
      </svg>
    );
  };

  // Progress: one square per detail, like the app's grid cells, filled with its detail when the camera arrives.
  const Tracker: React.FC<{ f: number; left: number }> = ({ f, left }) => {
    const { fps } = useVideoConfig();
    const S = 92;
    return (
      <div style={{ position: "absolute", left: 64, top: 250, display: "flex", gap: 14, alignItems: "center" }}>
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
        {/* During a mid-video ad: the video is not over (nothing to say when the ad closes the video) */}
        {r.details.length > r.ad.afterDetail && <div style={{ marginLeft: 14, fontSize: 34, fontWeight: 600, letterSpacing: "-0.02em", opacity: left, transform: `translateX(${(1 - left) * -16}px)`,
          textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>Encore {r.details.length - r.ad.afterDetail} détails 👇</div>}
      </div>
    );
  };

  // A work the text names, small, with its label: pops in a second after the text.
  const Inset: React.FC<{ d: Detail; f: number; hide: number }> = ({ d, f, hide }) => {
    const { fps } = useVideoConfig();
    if (!d.inset) return null;
    const k = spring({ frame: f - INSET_AT, fps, config: { damping: 12, stiffness: 180 } });
    const h = 230, w = (h * d.inset.size[0]) / d.inset.size[1];
    return (
      <div style={{ display: "flex", alignItems: "flex-end", gap: 22, marginBottom: 30, opacity: Math.min(1, k * 1.4) * (1 - hide),
        transform: `scale(${0.7 + 0.3 * k})`, transformOrigin: "bottom left" }}>
        <Img src={staticFile(d.inset.image)} style={{ width: w, height: h, borderRadius: 8, border: "4px solid #fff", boxShadow: "0 8px 28px rgba(0,0,0,0.55)" }} />
        <div style={{ paddingBottom: 6 }}>
          <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", maxWidth: 420 }}>{d.inset.title}</div>
          <div style={{ fontSize: 26, color: "rgba(255,255,255,0.72)", marginTop: 6 }}>{d.inset.artist}</div>
        </div>
      </div>
    );
  };

  // The real faces of the people the text names: one after the other, tuc tuc tuc, each with its name.
  const Faces: React.FC<{ d: Detail; f: number; hide: number }> = ({ d, f, hide }) => {
    const { fps } = useVideoConfig();
    if (!d.faces) return null;
    const n = d.faces.length, gap = (W - 64 - 170 - n * FACES.w) / Math.max(1, n - 1);
    return (
      <>
        {d.faces.map((x, k) => {
          const s = spring({ frame: f - INSET_AT - k * FACES.every, fps, config: { damping: 12, stiffness: 200 } });
          return (
            <div key={k} style={{ position: "absolute", left: 64 + k * (FACES.w + gap), top: FACES.top, width: FACES.w, display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              opacity: Math.min(1, s * 1.4) * (1 - hide), transform: `scale(${0.6 + 0.4 * s})`, transformOrigin: "bottom center" }}>
              <Img src={staticFile(x.image)} style={{ width: FACES.w, height: FACES.h, objectFit: "cover", borderRadius: 8, border: "4px solid #fff", boxShadow: "0 8px 24px rgba(0,0,0,0.55)" }} />
              <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", textShadow: "0 2px 10px rgba(0,0,0,0.85)", whiteSpace: "nowrap" }}>{x.name}</div>
            </div>
          );
        })}
      </>
    );
  };

  const MidFollow: React.FC<{ f: number; hide: number }> = ({ f, hide }) => {
    const { fps } = useVideoConfig();
    const { at, tap, len } = MID_FOLLOW;
    if (f < at - 2 || f > at + len) return null;
    const k = spring({ frame: f - at, fps, config: { damping: 11, stiffness: 190 } });
    const out = interpolate(f, [at + len - 10, at + len], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const press = interpolate(f, [at + tap - 4, at + tap, at + tap + 6], [1, 0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const done = f >= at + tap;
    return (
      <div style={{ position: "absolute", left: 0, bottom: "100%", marginBottom: 30, display: "flex", alignItems: "center", gap: 20,
        opacity: Math.min(1, k) * out * (1 - hide), transform: `scale(${0.6 + 0.4 * k})`, transformOrigin: "left center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 34px 18px 26px", borderRadius: 999, fontSize: 40, fontWeight: 700,
          letterSpacing: "-0.02em", whiteSpace: "nowrap", background: done ? "rgba(255,255,255,0.22)" : "#fff", color: done ? "#fff" : "#111",
          transform: `scale(${press})` }}>
          <span style={{ fontSize: 46, lineHeight: 1, marginTop: done ? 0 : -4 }}>{done ? "✓" : "+"}</span>{done ? "Abonné" : "Abonne-toi"}
        </div>
        <div style={{ fontSize: 32, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.01em", color: "rgba(255,255,255,0.92)", width: 360 }}>{end.midFollow}</div>
      </div>
    );
  };

  const Caption: React.FC<{ d: Detail; f: number; frame: number; stay: number; hide?: number; follow?: boolean }> = ({ d, f, frame, stay, hide = 0, follow }) => {
    hide = Math.max(hide, interpolate(f, [stay - 8, stay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    const o = interpolate(f, [4, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (1 - hide);
    const o2 = interpolate(f, [18, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (1 - hide);
    return (
      <>
        <AbsoluteFill style={{ background: "linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.75) 72%, rgba(0,0,0,0.9) 100%)", opacity: 1 - hide * 0.6 }} />
        <Marks d={d} f={f} frame={frame} hide={hide} />
        <Faces d={d} f={f} hide={hide} />
        <div style={{ position: "absolute", left: 64, right: 150, bottom: TEXT_BOTTOM }}>
          {follow && <MidFollow f={f} hide={hide} />}
          <Inset d={d} f={f} hide={hide} />
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
    // Mid-video, the phone drops away; as the ending, everything fades during the loop's glide.
    const out = adLast ? interpolate(f, [adLen - 2, adLen + LOOP - 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : spring({ frame: f - (T.ad - 16), fps, config: { damping: 20, stiffness: 160 } });
    const p = Math.max(0, inn - out);
    const buzz = f >= AD.recog && f < AD.recog + 9 ? Math.sin((f - AD.recog) * 2.6) * 7 : 0;
    const cta = spring({ frame: f - AD.cta, fps, config: { damping: 13, stiffness: 150 } });
    const line1 = interpolate(f, [4, 10, AD.open - 5, AD.open], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    // As the ending, the top line turns to the account's promise when the follow button comes: the follow is about
    // the videos, the waitlist about the app.
    const line2 = interpolate(f, [AD.open, AD.open + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const ps = adLast ? 0.78 : 0.86;
    const txt: React.CSSProperties = { position: "absolute", left: 64, right: 64, top: 390, fontSize: 60, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.035em", textWrap: "balance" };
    return (
      <>
        <AbsoluteFill style={{ background: "linear-gradient(rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.25) 70%, rgba(0,0,0,0.7) 100%)", opacity: p }} />
        <div style={{ ...txt, opacity: line1 * p }}>Au musée, scanne un tableau…</div>
        <div style={{ ...txt, opacity: line2 * p }}>…et Animart te raconte ses secrets.<div style={{ fontSize: 36, fontWeight: 600, color: "#EAD9BF", marginTop: 14, letterSpacing: "-0.01em" }}>Gratuit.</div></div>
        <div style={{ position: "absolute", left: (W - 470 * ps) / 2, top: adLast ? 560 : 590, transformOrigin: "top left",
          transform: `translate(${buzz}px, ${(1 - p) * 1400}px) scale(${ps}) rotate(${(1 - p) * 8 - 1.5}deg)` }}>
          <Phone r={r} img={img} f={f} recog={AD.recog} open={AD.open} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: TEXT_BOTTOM, display: "flex", justifyContent: "center", opacity: cta * p, transform: `translateY(${(1 - cta) * 60}px)` }}>
          <div style={{ background: "#fff", color: "#111", fontSize: 38, fontWeight: 600, padding: "26px 52px", borderRadius: 999, letterSpacing: "-0.015em" }}>{adLast ? end.beta : "Rejoins la waitlist · lien en bio"}</div>
        </div>
      </>
    );
  };

  const end = { lines: ["Un chef-d'œuvre.", "Ses secrets.", "Tous les jours."], follow: "Abonne-toi", sub: "L'app arrive bientôt · waitlist en bio",
    midFollow: "Un chef-d'œuvre décrypté chaque jour", beta: "Inscris-toi à la bêta · lien en bio", ...r.end };

  // Mid-video, on the 2nd detail, a follow button pops just above the caption's title, where the eyes already are,
  // then gets "tapped" and turns to « Abonné ✓ »: the change of state is what catches the eye. The ending is the app's.
  const midIdx = adLast && arrive.length > 1 ? 1 : -1;
  // The progress squares step aside while a row of portraits takes their place.
  const facesOn = (f: number) => r.details.some((d, i) => d.faces && f >= arrive[i] + INSET_AT - 6 && f < arrive[i] + T.dwell);

  // Every sound's frame, from the same timeline as the pictures.
  const sounds = (() => {
    const out: [number, string, number][] = [];
    if (OPEN) out.push([4, "accents/swish-1.wav", SFX.swish]);
    r.details.forEach((d, i) => {
      out.push([arrive[i] - T.travel + 2, `accents/swish-${(i % 3) + 2}.wav`, SFX.swish]);
      out.push([arrive[i] + 12, "story/reel.wav", SFX.tick]);
      (d.marks ?? []).forEach((_, k) => out.push([arrive[i] + MARK.at + k * MARK.every, `accents/pencil-${((i + k) % 4) + 1}.wav`, SFX.pencil]));
      if (i === midIdx) out.push([arrive[i] + MID_FOLLOW.at + MID_FOLLOW.tap - 2, "story/reel.wav", SFX.tick]);
    });
    out.push([adAt, "accents/swish-4.wav", SFX.swish], [adAt + AD.recog, "story/scan-ping.wav", SFX.scan], [adAt + AD.cta, "story/reel.wav", SFX.tick]);
    if (!adLast) out.push([leaveLast + T.back + 14, "story/reel.wav", SFX.tick]);
    return out.map(([at, file, v], k) => <Sfx key={k} at={at} file={file} volume={v} />);
  })();

  const Component: React.FC = () => {
    const f = useCurrentFrame();
    const hookOut = interpolate(f, [T.hook - 6, T.hook + 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const endIn = adLast ? 0 : interpolate(f, [leaveLast + T.back - 4, leaveLast + T.back + 8, total - LOOP, total - 2], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const follow = spring({ frame: f - (leaveLast + T.back + 14), fps: FPS, config: { damping: 12, stiffness: 160 } });
    return (
      <AbsoluteFill style={{ background: "#17110E", color: "#fff", fontFamily: inter }}>
        <Painting c={camAt(f)} />

        {/* The question: the platforms' own white text boxes, one per line, readable in one glance */}
        {r.question && <div style={{ position: "absolute", left: 0, right: 0, top: QUESTION_Y, display: "flex", flexDirection: "column", alignItems: "center", gap: 0, opacity: hookOut }}>
          {r.question.split("\n").map((l, i) => <div key={i} style={{ background: "#fff", color: "#111", fontSize: 86, fontWeight: 700, lineHeight: 1.12,
            letterSpacing: "-0.03em", padding: "6px 26px", borderRadius: 14, marginTop: i ? -4 : 0 }}>{l}</div>)}
        </div>}
        {!r.question && <>
        {/* A tall painting fills the frame: dark at the top and bottom so the label and hook stay readable */}
        <AbsoluteFill style={{ background: "linear-gradient(rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,0.9) 100%)", opacity: hookOut }} />
        {/* First shot: the work's label above the painting, the hook under it */}
        <div style={{ position: "absolute", left: 64, right: 64, top: 370, opacity: hookOut * (OPEN ? interpolate(f, [OPEN_BACK - 10, OPEN_BACK], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1) }}>
          <div style={{ fontSize: 46, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1 }}>{r.work.title}</div>
          <div style={{ fontSize: 34, fontWeight: 500, color: "rgba(255,255,255,0.7)", marginTop: 8 }}>{r.work.artist} · {r.work.date}</div>
        </div>
        <div style={{ position: "absolute", left: 64, right: 64, bottom: TEXT_BOTTOM, fontSize: 72, fontWeight: 700, lineHeight: 1.04, letterSpacing: "-0.04em", textWrap: "balance", opacity: hookOut }}>{r.hook}</div>
        </>}

        {r.details.map((d, i) => {
          const stay = T.dwell + (i === adIdx ? adLen : 0);
          return (
            <Sequence key={i} from={arrive[i]} durationInFrames={stay + (i === adIdx && adLast ? LOOP : 0)}>
              <Caption d={d} f={f - arrive[i]} frame={f} stay={stay} follow={i === midIdx}
                hide={i === adIdx ? interpolate(f - arrive[i], [T.dwell - 16, T.dwell - 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0} />
              {i === adIdx && <Sequence from={T.dwell - 10} durationInFrames={adLen + 10 + (adLast ? LOOP : 0)}><AdOverlay f={f - adAt} /></Sequence>}
            </Sequence>
          );
        })}

        {/* End: the whole painting, the follow call (when the ad does not close the video) */}
        {!adLast && <div style={{ position: "absolute", left: 64, right: 64, bottom: TEXT_BOTTOM, opacity: endIn, transform: `translateY(${(1 - endIn) * 30}px)` }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.045em" }}>{end.lines.map((l, i) => <div key={i}>{l}</div>)}</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginTop: 34, background: "#fff", color: "#111", fontSize: 40, fontWeight: 700,
            padding: "22px 44px", borderRadius: 999, letterSpacing: "-0.02em", transform: `scale(${follow})`, transformOrigin: "left center" }}>
            <span style={{ fontSize: 46, lineHeight: 1, marginTop: -4 }}>+</span>{end.follow}</div>
          <div style={{ fontSize: 30, color: "rgba(255,255,255,0.7)", marginTop: 26 }}>{end.sub}</div>
        </div>}

        {sounds}
        {f >= arrive[0] && f < total - LOOP && !facesOn(f) && <Tracker f={f} left={interpolate(f, [adAt + 8, adAt + 18, adAt + adLen - 12, adAt + adLen], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />}
      </AbsoluteFill>
    );
  };

  return { Component, durationInFrames: total };
}
