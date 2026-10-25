import type React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { clamp, easeInOut } from "../theme";

// The Guide as a cut-out puppet: one drawing per pose (public/guide, cut by scripts/guide-assets.py),
// brought to life with breathing, a bob on every spoken word, squash-and-stretch on each pose change and hops.

export type Pose =
  | "explaining" | "celebrating" | "satchel" | "reading" | "back" | "point-left" | "point-right"
  // The bank, generated from the canonical sheet alone (scripts/guide-generate.py, sheet_bank_1/2.png).
  | "ears" | "thinking" | "amazed" | "point-up" | "shh" | "shrug" | "writing" | "walking"
  | "scared" | "whisper" | "counting" | "card" | "skeptical" | "sitting" | "loupe" | "waving";

// Pixel size (2× the sheet), the feet's horizontal centre and the mouth, as fractions of the image.
// `left`: the drawing faces left; it is mirrored so the Guide always faces right, towards his bubble and the screen.
const POSES: Record<Pose, { w: number; h: number; footX: number; mouth: [number, number]; left?: true }> = {
  explaining: { w: 728, h: 902, footX: 0.4, mouth: [0.3, 0.2] },
  celebrating: { w: 672, h: 888, footX: 0.45, mouth: [0.42, 0.24] },
  satchel: { w: 568, h: 816, footX: 0.5, mouth: [0.62, 0.22] },
  reading: { w: 640, h: 916, footX: 0.47, mouth: [0.42, 0.2] },
  back: { w: 580, h: 912, footX: 0.5, mouth: [0.55, 0.12] },
  "point-left": { w: 764, h: 896, footX: 0.6, mouth: [0.52, 0.2] },
  "point-right": { w: 820, h: 892, footX: 0.36, mouth: [0.4, 0.2] },
  ears: { w: 610, h: 864, footX: 0.5, mouth: [0.52, 0.28] },
  thinking: { w: 584, h: 883, footX: 0.46, mouth: [0.51, 0.29], left: true },
  amazed: { w: 660, h: 871, footX: 0.51, mouth: [0.53, 0.31] },
  "point-up": { w: 593, h: 881, footX: 0.55, mouth: [0.67, 0.29], left: true },
  shh: { w: 546, h: 871, footX: 0.49, mouth: [0.62, 0.3], left: true },
  shrug: { w: 769, h: 890, footX: 0.46, mouth: [0.49, 0.31] },
  writing: { w: 587, h: 869, footX: 0.53, mouth: [0.64, 0.27] },
  walking: { w: 631, h: 887, footX: 0.49, mouth: [0.53, 0.31], left: true },
  scared: { w: 553, h: 893, footX: 0.46, mouth: [0.59, 0.31] },
  whisper: { w: 650, h: 864, footX: 0.46, mouth: [0.59, 0.31] },
  counting: { w: 612, h: 876, footX: 0.49, mouth: [0.53, 0.31], left: true },
  card: { w: 590, h: 887, footX: 0.55, mouth: [0.46, 0.3] },
  skeptical: { w: 542, h: 889, footX: 0.53, mouth: [0.62, 0.29], left: true },
  sitting: { w: 617, h: 896, footX: 0.58, mouth: [0.5, 0.3], left: true },
  loupe: { w: 666, h: 866, footX: 0.51, mouth: [0.61, 0.28] },
  waving: { w: 655, h: 896, footX: 0.46, mouth: [0.57, 0.27] },
};
export const SCALE = 0.58; // ~1 sheet pixel per video pixel: the drawing stays crisp
const PAD = 24; // transparent margin under the feet in every pose file
const HOP = 0.45;

// x = feet position on screen; a beat with a new x hops there, a beat with a new pose pops into it.
export type Beat = { at: number; pose: Pose; x: number; flip?: boolean };

// Damped wobble after an impact (landing, pose change): 1 at dt = 0, settling to 0.
const wobble = (dt: number) => (dt < 0 ? 0 : Math.exp(-dt * 9) * Math.cos(dt * 30));

// A small upward nod on every word onset, alternating tilt: reads as speech without a mouth rig.
export const talk = (t: number, onsets: number[]) => {
  let y = 0;
  let r = 0;
  onsets.forEach((o, i) => {
    const dt = t - o;
    if (dt >= 0 && dt < 0.4) {
      const k = Math.exp(-dt * 13) * Math.sin(Math.min(1, dt * 18) * Math.PI * 0.5);
      y -= 7 * k;
      r += (i % 2 ? 1 : -1) * 1.1 * k;
    }
  });
  return { y, r };
};

export const guideState = (t: number, beats: Beat[]) => {
  let i = 0;
  while (i + 1 < beats.length && beats[i + 1].at <= t) i++;
  const beat = beats[i];
  const prev = beats[i - 1];
  const hopping = prev && prev.x !== beat.x;
  const p = hopping ? interpolate(t, [beat.at, beat.at + HOP], [0, 1], { ...clamp, easing: easeInOut }) : 1;
  const shown = hopping && p < 0.5 ? prev : beat;
  return {
    pose: shown.pose,
    flip: !!shown.flip !== !!POSES[shown.pose].left,
    x: hopping ? interpolate(p, [0, 1], [prev.x, beat.x]) : beat.x,
    lift: hopping ? Math.sin(p * Math.PI) * 80 : 0,
    impact: hopping ? beat.at + HOP : beat.at,
    hopP: p,
  };
};

// Where the Guide's mouth is on screen (for the speech-bubble tail).
export const mouthAt = (t: number, beats: Beat[], baseline: number) => {
  const g = guideState(t, beats);
  const m = POSES[g.pose];
  const mx = (g.flip ? 1 - m.mouth[0] : m.mouth[0]) - (g.flip ? 1 - m.footX : m.footX);
  return { x: g.x + mx * m.w * SCALE, y: baseline + PAD * SCALE - (1 - m.mouth[1]) * m.h * SCALE - g.lift };
};

export const Guide: React.FC<{ t: number; beats: Beat[]; onsets: number[]; baseline: number; opacity?: number }> = ({
  t,
  beats,
  onsets,
  baseline,
  opacity = 1,
}) => {
  const g = guideState(t, beats);
  const m = POSES[g.pose];
  const w = m.w * SCALE;
  const h = m.h * SCALE;
  const footX = g.flip ? 1 - m.footX : m.footX;
  const k = wobble(t - g.impact);
  // Anticipation: crouch just before take-off, stretch in the air, squash on landing.
  const crouch = g.hopP > 0 && g.hopP < 0.12 ? Math.sin((g.hopP / 0.12) * Math.PI) * 0.06 : 0;
  const stretch = g.lift > 0 ? 0.05 * Math.sin(g.hopP * Math.PI) : 0;
  const breathe = Math.sin(t * 2.4) * 0.012;
  const sy = 1 + breathe - 0.09 * k - crouch + stretch;
  const sx = 1 - breathe * 0.5 + 0.07 * k + crouch * 0.8 - stretch * 0.6;
  const speech = talk(t, onsets);
  const sway = Math.sin(t * 1.3) * 0.8;
  const shadow = 1 - Math.min(1, g.lift / 120);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity }}>
      <div
        style={{
          position: "absolute",
          left: g.x - 110 * shadow,
          top: baseline - 6,
          width: 220 * shadow,
          height: 26 * shadow,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(0,0,0,0.55), transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: g.x - footX * w,
          top: baseline + PAD * SCALE - h - g.lift + speech.y,
          width: w,
          height: h,
          transformOrigin: `${footX * 100}% 100%`,
          transform: `rotate(${sway + speech.r}deg) scale(${(g.flip ? -1 : 1) * sx}, ${sy})`,
        }}
      >
        <Img src={staticFile(`guide/${g.pose}.png`)} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
};
