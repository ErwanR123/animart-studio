import { AbsoluteFill, useCurrentFrame } from "remotion";
import { hand } from "../fonts";
import type { Palette } from "../guide/decor";
import { presentAtStart, type Shot, Shots, type TimedShot } from "../guide/shots";
import { FPS } from "../theme";

// A reel of collage shots for judging them outside an episode: each shot `shot` s long, its caption written underneath
// (where the Guide stands in an episode), pieces landing `stagger` s apart from the start of their shot.
export const makeReel = (list: (Shot & { caption: string })[], shot = 4.2, stagger = 0.3, palette?: Palette) => {
  const timed: TimedShot[] = list.map((s, k) => {
    const start = k * shot;
    let n = 0;
    return {
      ...s,
      start,
      end: start + shot,
      times: s.layers.map((l) => (presentAtStart(l) ? start : start + 0.35 + stagger * n++)),
      strikes: s.layers.map((l, i) => ("cue" in l || "strike" in l ? start + 0.35 + stagger * i + 1 : undefined)), // a mark 1 s after its piece
      last: k === list.length - 1,
    };
  });
  const Reel: React.FC = () => {
    const t = useCurrentFrame() / FPS;
    const k = Math.min(list.length - 1, Math.floor(t / shot));
    return (
      <AbsoluteFill style={{ background: "#151A14" }}>
        <Shots shots={timed} t={t} palette={palette} />
        <div style={{ position: "absolute", left: 60, right: 60, top: 1480, fontFamily: hand, fontWeight: 700, fontSize: 64, lineHeight: 1.1, color: "#F2EBDD" }}>
          <span style={{ color: "#F4C531" }}>{k + 1}.</span> {list[k].caption}
        </div>
      </AbsoluteFill>
    );
  };
  return { Reel, frames: Math.round((list.length * shot + 0.6) * FPS) };
};
