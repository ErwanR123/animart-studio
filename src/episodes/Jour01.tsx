import { Audio } from "@remotion/media";
import { loadFont as loadFigtree } from "@remotion/google-fonts/Figtree";
import { loadFont as loadMarker } from "@remotion/google-fonts/PermanentMarker";
import rough from "roughjs";
import { AbsoluteFill, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp, easeInOut, FPS } from "../theme";
import voice from "../../public/voice/Jour01.json";

// 30 jours pour comprendre l'art et l'apprécier, Jour 1: comment regarder un tableau (the three VTS questions,
// Housen & Yenawine, MoMA), shown on Landscape with the Fall of Icarus. Made by hand while the look is being found
// (user, 14-15 Nov. 2026): sticker look, lilac dotted ground, felt pen, stop-motion on twos.
// Facts: half of the Met's visitors look at a painting for less than 17 s (median 17.0 s, Smith & Smith 2001);
// the Brussels Icarus: composition by Bruegel, execution doubted, hence "d'après Bruegel" on the label.
// Sources: opener = Mixkit free clip 49292 (Mixkit licence); Icarus = Commons "Pieter Bruegel the Elder - Landscape
// with the Fall of Icarus - Brussels, Royal Museums of Fine Arts of Belgium - Google Arts & Culture.jpg".

const marker = loadMarker("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const figtree = loadFigtree("normal", { weights: ["900", "700"], subsets: ["latin"] }).fontFamily;
const INK = "#1d1b18";
const RED = "#c8322b";
const TAPE = "rgba(236,226,188,.95)";
const TAPE_CUT = "polygon(1.5% 6%, 98% 0, 100% 24%, 97.5% 50%, 100% 76%, 98.5% 100%, 1% 94%, 2.5% 70%, 0 46%, 2% 22%)";
const ICARUS_RATIO = 2505 / 3840;
const gen = rough.generator();
const rnd = (a: number, b = 0) => {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1;
};
const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
const cue = (seg: string, w?: string, plus = 0) => {
  if (!w) return voice.segments.find((s) => s.id === seg)!.start + plus;
  const x = voice.words.find((v) => v.segment === seg && norm(v.text).startsWith(norm(w)));
  if (!x) throw new Error(`cue not found: ${seg}:${w}`);
  return x.start + plus;
};
const segEnd = (seg: string) => voice.segments.find((s) => s.id === seg)!.end;
const END = segEnd("outro") + 0.7;

// Captions: short lines, TikTok white with a dark outline, the spoken word in yellow.
const lines: { start: number; words: typeof voice.words }[] = [];
for (const w of voice.words.filter((x) => /[\p{L}\p{N}]/u.test(x.text))) {
  const last = lines[lines.length - 1];
  const len = last ? last.words.map((x) => x.text).join(" ").length + 1 + w.text.length : Infinity;
  const brk = last && /[.!?:,…]$/.test(last.words[last.words.length - 1].text);
  if (!last || len > 24 || brk || last.words[0].segment !== w.segment) lines.push({ start: w.start, words: [w] });
  else last.words.push(w);
}

// The three questions, short on tape.
const Q = ["1. Qu'est-ce qui se passe ?", "2. Qu'est-ce qui te fait dire ça ?", "3. Quoi d'autre ?"];

// Shots (seconds).
const T = {
  title: cue("day"),
  slots: cue("key", "trois"),
  icarus: cue("q1"),
  q2: cue("q2"),
  q3: cue("q3"),
  legs: cue("legs"),
  label: cue("icare", "tableau"),
  msg: cue("msg"),
  reflex: cue("reflex"),
  outro: cue("outro"),
};

// Felt-pen marks on the painting, in its own fractions.
type Mark = { at: number; out?: number; ellipse?: [number, number, number, number]; note?: { text: string; pos: [number, number]; rot: number } };
const MARKS: Mark[] = [
  { at: cue("a1", "paysan"), out: T.q3, ellipse: [0.43, 0.67, 0.1, 0.21] },
  { at: cue("a1", "berger"), out: T.q3, ellipse: [0.525, 0.58, 0.045, 0.09] },
  { at: cue("a1", "bateaux"), out: T.q3, ellipse: [0.79, 0.53, 0.13, 0.18] },
  { at: cue("a2", "calme"), out: T.q3, note: { text: "calme", pos: [0.62, 0.4], rot: -6 } },
  { at: cue("a2", "personne"), out: T.q3, note: { text: "zéro panique", pos: [0.3, 0.88], rot: 4 } },
  { at: cue("legs", "jambes"), ellipse: [0.858, 0.755, 0.035, 0.05] },
];
const LEGS: [number, number] = [0.858, 0.755];

const Component: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const step = Math.floor(t * 12);
  const ts = step / 12; // stop-motion time
  const boil = (seed: number) => ({ x: rnd(seed, Math.floor(step / 2)) * 1.6, y: rnd(seed + 7, Math.floor(step / 2)) * 1.6, r: rnd(seed + 3, Math.floor(step / 2)) * 0.3 });
  const pop = (at: number) => {
    const s = ts - at;
    return s < 0 ? 0 : s < 1 / 12 ? 1.15 : s < 2 / 12 ? 0.97 : 1;
  };
  const drawn = (at: number, dur = 0.45) => interpolate(ts - at, [0, dur], [0, 1], clamp);
  const line = [...lines].reverse().find((l) => l.start <= t + 0.05) ?? lines[0];

  const tape = (key: string, text: string, x: number, y: number, rot: number, size: number, at: number, seed: number) => {
    const s = pop(at);
    if (!s) return null;
    const b = boil(seed);
    return (
      <div key={key} style={{ position: "absolute", left: x, top: y, transformOrigin: "0 50%", transform: `translate(${b.x}px, ${b.y}px) rotate(${rot + b.r}deg) scale(${s})`, filter: "drop-shadow(0 4px 5px rgba(0,0,0,.28))" }}>
        <div style={{ background: TAPE, clipPath: TAPE_CUT, padding: `${size * 0.18}px ${size * 0.5}px ${size * 0.12}px`, fontFamily: marker, fontSize: size, lineHeight: 1.15, color: INK, whiteSpace: "nowrap" }}>{text}</div>
      </div>
    );
  };

  // The painting shot: zoom towards the legs on "là", back out on the message.
  const zoom =
    t < T.legs
      ? 1 + 0.12 * easeInOut(interpolate(t, [T.q3, T.legs], [0, 1], clamp))
      : t < T.msg
        ? 1.12 + 1.6 * easeInOut(interpolate(t, [T.legs, T.legs + 0.7], [0, 1], clamp))
        : 2.72 - 1.72 * easeInOut(interpolate(t, [T.msg, T.msg + 0.9], [0, 1], clamp));
  const W = 1000;
  const H = W * ICARUS_RATIO;
  const showIcarus = t >= T.icarus && t < T.reflex;
  const qIndex = t < T.q2 ? 0 : t < T.q3 ? 1 : 2;
  const qAt = [T.icarus, T.q2, T.q3][qIndex];

  const markSvg = MARKS.map((m, i) => {
    if (ts < m.at || (m.out !== undefined && ts >= m.out)) return null;
    if (m.note) {
      const k = drawn(m.at, 0.4);
      return (
        <div key={i} style={{ position: "absolute", left: m.note.pos[0] * W, top: m.note.pos[1] * H, transform: `translate(-50%, -50%) rotate(${m.note.rot}deg) scale(${1 / zoom})`, fontFamily: marker, fontSize: 52, color: RED, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - k * 100}% -20% -5%)`, textShadow: "0 0 4px #fff, 0 0 8px #fff" }}>
          {m.note.text}
        </div>
      );
    }
    const [cx, cy, rx, ry] = m.ellipse!;
    const d = gen.toPaths(gen.ellipse(cx * W, cy * H, rx * 2 * W, ry * 2 * H, { seed: i + 3, roughness: 1.4, bowing: 1.3, disableMultiStroke: true, curveStepCount: 14 })).map((p) => p.d);
    const k = drawn(m.at, 0.45);
    return (
      <svg key={i} width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {d.map((p, j) => (
          <path key={j} d={p} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} fill="none" stroke={RED} strokeWidth={9 / zoom} strokeLinecap="round" />
        ))}
      </svg>
    );
  });

  const b1 = boil(1);
  return (
    <AbsoluteFill style={{ backgroundColor: "#f6f2ff", backgroundImage: "radial-gradient(#e3dbff 5px, transparent 6px)", backgroundSize: "64px 64px", overflow: "hidden" }}>
      {/* Title: the day and the key, then three empty question slots. */}
      {t >= T.title && t < T.icarus ? (
        <>
          {tape("day", "Jour 1/30", 80, 300, -3, 52, T.title, 2)}
          <div style={{ position: "absolute", left: 80, top: 420, width: 920, fontFamily: marker, fontSize: 104, lineHeight: 1.08, color: INK, transform: "rotate(-2deg)", clipPath: `inset(-20% ${100 - drawn(T.title + 0.2, 0.6) * 100}% -20% -5%)` }}>
            Comment regarder un tableau
          </div>
          {[0, 1, 2].map((i) => tape(`slot${i}`, `${i + 1}. ?`, 120 + i * 40, 820 + i * 150, i % 2 ? 2 : -2, 72, T.slots + i * 0.25, 10 + i))}
        </>
      ) : null}

      {/* The painting, as a big printed sticker; the current question on tape above it. */}
      {showIcarus ? (
        <>
          {tape(`q${qIndex}`, Q[qIndex], 60, 330, -2, 50, qAt, 20 + qIndex)}
          <div style={{ position: "absolute", left: 40, top: 470, width: W, height: H, overflow: "visible", transform: `translate(${b1.x}px, ${b1.y}px) rotate(${-1 + b1.r}deg) scale(${pop(T.icarus)})` }}>
            <div style={{ position: "absolute", inset: -16, background: "#fbfaf6", filter: "drop-shadow(0 12px 12px rgba(30,15,0,.4))" }} />
            <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, transformOrigin: `${LEGS[0] * 100}% ${LEGS[1] * 100}%`, transform: `scale(${zoom})` }}>
                <Img src={staticFile("art/jour01v2/icarus.jpg")} style={{ width: W, height: H, display: "block" }} />
                {markSvg}
              </div>
            </div>
          </div>
          {/* The museum label: "d'après Bruegel". */}
          {pop(T.label) ? (
            <div style={{ position: "absolute", left: 90, top: 1060, width: 560, transform: `rotate(2deg) scale(${pop(T.label)})`, filter: "drop-shadow(0 10px 10px rgba(30,15,0,.4))" }}>
              <div style={{ background: "#fff", padding: "20px 24px", fontFamily: figtree, color: INK, lineHeight: 1.25 }}>
                <div style={{ fontWeight: 700, fontSize: 24, opacity: 0.75 }}>d'après Pieter Bruegel l'Ancien</div>
                <div style={{ fontWeight: 900, fontSize: 34 }}>Paysage avec la chute d'Icare</div>
                <div style={{ fontWeight: 700, fontSize: 22, opacity: 0.7 }}>vers 1560 · huile sur toile</div>
              </div>
            </div>
          ) : null}
        </>
      ) : null}

      {/* The reflex: the painting small, the three questions filled in. */}
      {t >= T.reflex && t < T.outro ? (
        <>
          <div style={{ position: "absolute", left: 270, top: 300, width: 540, transform: `rotate(-3deg) scale(${pop(T.reflex)})`, filter: "drop-shadow(0 10px 10px rgba(30,15,0,.4))" }}>
            <div style={{ background: "#fbfaf6", padding: 12 }}>
              <Img src={staticFile("art/jour01v2/icarus.jpg")} style={{ width: "100%", display: "block" }} />
            </div>
          </div>
          {tape("r0", Q[0], 70, 760, -2, 54, cue("reflex", "passe"), 30)}
          {tape("r1", Q[1], 50, 900, 1.5, 54, cue("reflex", "dire"), 31)}
          {tape("r2", Q[2], 90, 1040, -1.5, 54, cue("reflex", "quoi"), 32)}
        </>
      ) : null}

      {/* Tomorrow. */}
      {t >= T.outro ? (
        <>
          {tape("o1", "Jour 2 : le petit carton", 120, 700, -3, 64, T.outro, 40)}
          <div style={{ position: "absolute", left: 150, top: 880, fontFamily: marker, fontSize: 140, color: RED, transform: "rotate(-4deg)", clipPath: `inset(-20% ${100 - drawn(cue("outro", "abonne"), 0.45) * 100}% -20% -5%)` }}>Abonne-toi</div>
        </>
      ) : null}

      {/* The real opening shot, full frame, first. */}
      {t < T.title ? <OffthreadVideo src={staticFile("art/jour01v2/opener.mp4")} muted style={{ position: "absolute", inset: 0, width: 1080, height: 1920, objectFit: "cover" }} /> : null}

      {/* Captions. */}
      <div style={{ position: "absolute", left: 60, width: 960, top: 1480, textAlign: "center", fontFamily: figtree, fontWeight: 900, fontSize: 68, lineHeight: 1.15 }}>
        {line.words.map((w, n) => {
          const lit = t >= w.start && t < w.end + 0.12;
          return (
            <span key={n} style={{ color: lit ? "#ffe14d" : "#fff", WebkitTextStroke: "10px #1a1208", paintOrder: "stroke fill" }}>
              {w.text}{" "}
            </span>
          );
        })}
      </div>

      {/* Sound: the voice, a quiet bed, one short sound per visible event. */}
      <Audio src={staticFile("voice/Jour01.mp3")} />
      <Audio src={staticFile("music/belleville.mp3")} volume={(f) => interpolate(f / FPS, [0, END - 1.2, END], [0.1, 0.1, 0], clamp)} />
      {[T.title, T.slots, T.slots + 0.25, T.slots + 0.5, T.q2, T.q3, cue("reflex", "passe"), cue("reflex", "dire"), cue("reflex", "quoi"), T.outro].map((at, i) => (
        <Sequence key={`t${i}`} from={Math.round(at * FPS)} durationInFrames={12}>
          <Audio src={staticFile("sfx/sticker/tape-rip.wav")} volume={0.3} />
        </Sequence>
      ))}
      {[T.icarus, T.label, T.reflex].map((at, i) => (
        <Sequence key={`s${i}`} from={Math.round(at * FPS)} durationInFrames={10}>
          <Audio src={staticFile("sfx/sticker/slap.wav")} volume={0.5} />
        </Sequence>
      ))}
      {MARKS.map((m, i) => (
        <Sequence key={`m${i}`} from={Math.round(m.at * FPS)} durationInFrames={15}>
          <Audio src={staticFile("sfx/sticker/draw.wav")} volume={0.3} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const jour01 = { Component, durationInFrames: Math.ceil(END * FPS) };
