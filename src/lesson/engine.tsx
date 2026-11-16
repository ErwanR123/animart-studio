import { Audio } from "@remotion/media";
import { loadFont as loadMarker } from "@remotion/google-fonts/PermanentMarker";
import rough from "roughjs";
import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { hand, sans } from "../fonts";
import { clamp, easeInOut, easeOut, FPS } from "../theme";

// "L'art en 30 jours" (TikTok, IDEAS.md): one key a day on a school notebook. The painting is taped to grid paper,
// the marker draws on it word by word, sticky notes hold the method, the day counter ticks at the end. Every timing
// comes from the voice's word timings, like the Guide; a lesson config only names cue words and painting fractions.

const marker = loadMarker("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;

export type Voice = {
  segments: { id: string; start: number; end: number }[];
  words: { text: string; start: number; end: number; segment: string }[];
};
// A cue: the first word starting with this text, optionally inside one segment ("one:pont"), plus seconds.
type Cue = string | number;
type Pt = [number, number]; // fractions of the painting (0…1, 0…1)

export type Mark =
  | { ellipse: [number, number, number, number]; at: Cue; until?: Cue; color?: string } // cx cy rx ry
  | { line: [Pt, Pt]; at: Cue; until?: Cue; color?: string }
  | { arrow: [Pt, Pt]; at: Cue; until?: Cue; color?: string }
  | { text: string; pos: Pt; at: Cue; until?: Cue; color?: string; size?: number; rot?: number; font?: "marker" | "hand" };

// The camera on the painting: centre (painting fractions) and zoom, reached in 0.6 s from its cue.
export type Shot = { at: Cue; x: number; y: number; z: number };

export type Sticky = { at: Cue; fill?: Cue; x: number; y: number; rot: number; num: string; label: string; check?: Cue };

export type LessonConfig = {
  day: number;
  voice: Voice;
  voiceFile: string;
  music?: string;
  image: { src: string; ratio: number }; // ratio = height / width
  marks: Mark[];
  shots: Shot[];
  stickies: Sticky[];
  // The hook's note (frame 0, top right of the painting) and the outro: tomorrow's subject and the follow call.
  hookNote: { lines: [string, string, string]; until: Cue };
  tomorrow: { at: Cue; text: string };
  follow: Cue;
  tick: Cue; // the day's box gets its tick
};

const PAPER = "#fbfaf4";
const INK = "#1d2a44";
const RED = "#d6453d";
const YELLOW = "#ffe45c";
const W = 1080;
// The painting's polaroid: centred, under the counter, above the captions (TikTok hides y < 220 and y > 1520).
const PIC = { x: 190, y: 410, w: 700 };

const gen = rough.generator();
const paths = (d: ReturnType<typeof gen.path>) => gen.toPaths(d).map((p) => p.d);

export const createLesson = (cfg: LessonConfig) => {
  const words = cfg.voice.words;
  const cue = (c: Cue): number => {
    if (typeof c === "number") return c;
    const [seg, rest] = c.includes(":") ? c.split(":") : [null, c];
    const [word, plus] = rest.split("+");
    const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}']/gu, "");
    const w = words.find((x) => (!seg || x.segment === seg) && norm(x.text).startsWith(norm(word)));
    if (!w) throw new Error(`lesson cue not found: ${c}`);
    return w.start + (plus ? Number(plus) : 0);
  };
  const END = cfg.voice.segments[cfg.voice.segments.length - 1].end + 0.8;
  const PW = PIC.w - 28;
  const PH = PW * cfg.image.ratio;

  // Captions: the narration in short lines (≤ 30 characters), the word being said under the highlighter.
  const lines: { start: number; words: typeof words }[] = [];
  for (const w of words.filter((x) => /[\p{L}\p{N}]/u.test(x.text))) {
    const last = lines[lines.length - 1];
    const len = last ? last.words.map((x) => x.text).join(" ").length + 1 + w.text.length : Infinity;
    const brk = last && (/[.!?]$/.test(last.words[last.words.length - 1].text) || last.words[0].segment !== w.segment);
    if (!last || len > 30 || brk) lines.push({ start: w.start, words: [w] });
    else last.words.push(w);
  }

  const Component: React.FC = () => {
    const frame = useCurrentFrame();
    const t = frame / FPS;
    const since = (c: Cue) => t - cue(c);
    const shown = (at: Cue, until?: Cue) => t >= cue(at) && (until === undefined || t < cue(until) + 0.25);
    const fadeOut = (until?: Cue) => (until === undefined ? 1 : interpolate(t, [cue(until), cue(until) + 0.25], [1, 0], clamp));

    // Camera: from the previous shot to the current one over 0.6 s.
    const cams = [{ at: 0, x: 0.5, y: 0.5, z: 1 }, ...cfg.shots.map((s) => ({ ...s, at: cue(s.at) }))];
    let i = 0;
    while (i + 1 < cams.length && cams[i + 1].at <= t) i++;
    const prev = cams[Math.max(0, i - 1)];
    const cur = cams[i];
    const k = i === 0 ? 1 : easeInOut(interpolate(t, [cur.at, cur.at + 0.6], [0, 1], clamp));
    const cam = { x: prev.x + (cur.x - prev.x) * k, y: prev.y + (cur.y - prev.y) * k, z: prev.z + (cur.z - prev.z) * k };
    // The point (cam.x, cam.y) of the painting goes to the painting's own centre on screen, scaled by z.
    const cx = PIC.x + 14 + PW / 2;
    const cy = PIC.y + 14 + PH / 2;
    const px = PIC.x + 14 + cam.x * PW;
    const py = PIC.y + 14 + cam.y * PH;
    const camera = `translate(${cx - px * cam.z}px, ${cy - py * cam.z}px) scale(${cam.z})`;

    const drawn = (at: Cue, dur = 0.45) => easeOut(interpolate(since(at), [0, dur], [0, 1], clamp));
    const P = (p: Pt) => [p[0] * PW, p[1] * PH] as const;

    const markEls = cfg.marks.map((m, n) => {
      if (!shown(m.at, m.until)) return null;
      const color = m.color ?? RED;
      const op = fadeOut(m.until);
      if ("text" in m) {
        const [x, y] = P(m.pos);
        const e = drawn(m.at, 0.35);
        return (
          <div
            key={n}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: `translate(-50%, -50%) rotate(${m.rot ?? -4}deg) scale(${1 / Math.max(1, cam.z * 0.8)})`,
              fontFamily: m.font === "hand" ? hand : marker,
              fontWeight: m.font === "hand" ? 700 : 400,
              fontSize: m.size ?? 44,
              color,
              whiteSpace: "nowrap",
              opacity: op,
              clipPath: `inset(-20% ${100 - e * 100}% -20% -5%)`,
              textShadow: color === "#fff" ? "0 2px 8px rgba(0,0,0,.5)" : `0 0 6px ${PAPER}, 0 0 3px ${PAPER}`,
            }}
          >
            {m.text}
          </div>
        );
      }
      let d: string[];
      const o = { seed: n + 3, roughness: 1.2, bowing: 1.4, disableMultiStroke: true };
      if ("ellipse" in m) {
        const [ex, ey] = P([m.ellipse[0], m.ellipse[1]]);
        d = paths(gen.ellipse(ex, ey, m.ellipse[2] * 2 * PW, m.ellipse[3] * 2 * PH, { ...o, curveStepCount: 14 }));
      } else if ("line" in m) {
        const [a, b] = [P(m.line[0]), P(m.line[1])];
        d = paths(gen.line(a[0], a[1], b[0], b[1], o));
      } else {
        const [a, b] = [P(m.arrow[0]), P(m.arrow[1])];
        const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
        const head = (s: number) => [b[0] - 34 * Math.cos(ang + s), b[1] - 34 * Math.sin(ang + s)] as const;
        d = [...paths(gen.line(a[0], a[1], b[0], b[1], o)), ...paths(gen.line(b[0], b[1], ...head(0.5), o)), ...paths(gen.line(b[0], b[1], ...head(-0.5), o))];
      }
      const p = interpolate(since(m.at), [0, 0.45], [0, d.length], clamp);
      return (
        <svg key={n} width={PW} height={PH} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: op }}>
          {d.map((path, j) => {
            const local = easeInOut(Math.max(0, Math.min(1, p - j)));
            return local > 0 ? (
              <path
                key={j}
                d={path}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - local}
                fill="none"
                stroke={color}
                strokeWidth={9 / cam.z}
                strokeLinecap="round"
              />
            ) : null;
          })}
        </svg>
      );
    });

    const line = [...lines].reverse().find((l) => l.start <= t + 0.05) ?? lines[0];
    const tickAt = cue(cfg.tick);
    const hookEnd = cue(cfg.hookNote.until);

    return (
      <AbsoluteFill
        style={{
          backgroundColor: PAPER,
          backgroundImage: "linear-gradient(rgba(110,150,205,.26) 2px, transparent 2px), linear-gradient(90deg, rgba(110,150,205,.26) 2px, transparent 2px)",
          backgroundSize: "54px 54px",
          color: INK,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: 96, top: 0, bottom: 0, width: 4, background: "rgba(214,69,61,.5)" }} />

        {/* The painting, taped, under the camera; the marks move with it. */}
        <div style={{ position: "absolute", inset: 0, transform: camera, transformOrigin: "0 0" }}>
          <div style={{ position: "absolute", left: PIC.x, top: PIC.y, width: PIC.w, padding: 14, background: "#fff", boxShadow: "0 10px 28px rgba(0,0,0,.2)", transform: "rotate(-1deg)" }}>
            <div style={{ position: "relative", width: PW, height: PH }}>
              <Img src={staticFile(cfg.image.src)} style={{ width: PW, height: PH, display: "block" }} />
              {markEls}
            </div>
            <div style={{ position: "absolute", top: -22, left: "38%", width: 150, height: 44, background: "rgba(232,222,186,.85)", transform: "rotate(-4deg)" }} />
          </div>
        </div>

        {/* The hook's note: there from frame 0, gone when the method starts. */}
        {t < hookEnd + 0.3 ? (
          <div
            style={{
              position: "absolute",
              left: 720,
              top: 470,
              width: 300,
              padding: "22px 24px",
              background: YELLOW,
              boxShadow: "0 10px 20px rgba(0,0,0,.2)",
              transform: "rotate(5deg)",
              opacity: interpolate(t, [hookEnd, hookEnd + 0.3], [1, 0], clamp),
              fontFamily: marker,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 40, lineHeight: 1.1 }}>{cfg.hookNote.lines[0]}</div>
            <div style={{ fontSize: 76, lineHeight: 1, color: RED, whiteSpace: "nowrap" }}>{cfg.hookNote.lines[1]}</div>
            <div style={{ fontSize: 34 }}>{cfg.hookNote.lines[2]}</div>
          </div>
        ) : null}

        {/* The method's sticky notes, top right beside the counter, written on when the step is named, ticked on the recap. */}
        {cfg.stickies.map((s, n) => {
          if (t < cue(s.at)) return null;
          const pop = easeOut(interpolate(since(s.at), [0, 0.25], [0, 1], clamp));
          const fill = s.fill === undefined ? 1 : interpolate(since(s.fill), [0, 0.4], [0, 1], clamp);
          return (
            <div
              key={n}
              style={{
                position: "absolute",
                left: s.x,
                top: s.y,
                width: 165,
                padding: "10px 12px",
                background: YELLOW,
                boxShadow: "0 8px 18px rgba(0,0,0,.2)",
                transform: `rotate(${s.rot}deg) scale(${0.6 + 0.4 * pop})`,
                opacity: pop,
                fontFamily: marker,
              }}
            >
              <div style={{ fontSize: 46, lineHeight: 1, color: RED }}>{s.num}</div>
              <div style={{ fontSize: 23, lineHeight: 1.1, clipPath: `inset(-10% ${100 - fill * 100}% -10% -5%)` }}>{s.label}</div>
              {s.check !== undefined && t >= cue(s.check) ? (
                <div style={{ position: "absolute", right: 8, top: 0, fontSize: 54, color: RED, clipPath: `inset(0 ${100 - drawn(s.check, 0.3) * 100}% 0 0)` }}>✓</div>
              ) : null}
            </div>
          );
        })}

        {/* Outro: tomorrow's subject and the follow call, written over the painting. */}
        {t >= cue(cfg.tomorrow.at) ? (
          <div
            style={{
              position: "absolute",
              left: 140,
              top: 1120,
              width: 800,
              padding: "22px 30px",
              background: PAPER,
              border: `6px solid ${INK}`,
              borderRadius: "22px 60px 30px 50px",
              transform: `rotate(-1.5deg) scale(${0.7 + 0.3 * drawn(cfg.tomorrow.at, 0.3)})`,
              opacity: drawn(cfg.tomorrow.at, 0.3),
              fontFamily: marker,
            }}
          >
            <div style={{ fontSize: 36 }}>Demain :</div>
            <div style={{ fontFamily: hand, fontWeight: 700, fontSize: 64, lineHeight: 1.05 }}>
              <span style={{ background: `linear-gradient(transparent 50%, ${YELLOW} 50%, ${YELLOW} 92%, transparent 92%)` }}>{cfg.tomorrow.text}</span>
            </div>
            {t >= cue(cfg.follow) ? (
              <div style={{ marginTop: 14, fontSize: 44, color: RED, whiteSpace: "nowrap", clipPath: `inset(-10% ${100 - drawn(cfg.follow, 0.35) * 100}% -10% -5%)` }}>Abonne-toi : 1 clé par jour</div>
            ) : null}
          </div>
        ) : null}

        {/* The counter, outside the camera, under TikTok's top bar. */}
        <div style={{ position: "absolute", left: 130, top: 238 }}>
          <div style={{ fontFamily: marker, fontSize: 64, lineHeight: 1.1 }}>Jour {String(cfg.day).padStart(2, "0")} / 30</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(15, 28px)", gap: 8, marginTop: 10 }}>
            {Array.from({ length: 30 }, (_, n) => (
              <div key={n} style={{ height: 28, border: `4px solid ${INK}`, borderRadius: 4, position: "relative" }}>
                {n < cfg.day - 1 || (n === cfg.day - 1 && t >= tickAt) ? (
                  <div
                    style={{
                      position: "absolute",
                      left: -6,
                      top: -34,
                      fontFamily: marker,
                      fontSize: 52,
                      color: RED,
                      clipPath: n === cfg.day - 1 ? `inset(0 ${100 - drawn(tickAt, 0.3) * 100}% 0 0)` : undefined,
                    }}
                  >
                    ✓
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {/* Captions for the sound-off viewers, just above TikTok's caption area. */}
        <div style={{ position: "absolute", left: 0, width: W, top: 1440, display: "flex", justifyContent: "center" }}>
          <div style={{ background: "#fff", border: `4px solid ${INK}`, borderRadius: 14, padding: "10px 22px", fontFamily: sans, fontWeight: 800, fontSize: 50, lineHeight: 1.15, maxWidth: 940, textAlign: "center", boxShadow: "6px 6px 0 rgba(29,42,68,.9)" }}>
            {line.words.map((w, n) => (
              <span key={n} style={{ background: t >= w.start && t < w.end + 0.15 ? YELLOW : "transparent", borderRadius: 6, padding: "0 4px" }}>
                {w.text}
              </span>
            ))}
          </div>
        </div>

        <Audio src={staticFile(cfg.voiceFile)} />
        <Audio
          src={staticFile(cfg.music ?? "music/gymnopedie-1.mp3")}
          volume={(f) => interpolate(f / FPS, [0, END - 1.5, END], [0.1, 0.1, 0], clamp)}
        />
        {cfg.marks.map((m, n) =>
          "text" in m ? null : (
            <Sequence key={n} from={Math.round(cue(m.at) * FPS)} durationInFrames={20}>
              <Audio src={staticFile(`sfx/accents/pencil-${(n % 4) + 1}.wav`)} volume={0.35} />
            </Sequence>
          ),
        )}
        {cfg.stickies.map((s, n) => (
          <Sequence key={`s${n}`} from={Math.round(cue(s.at) * FPS)} durationInFrames={20}>
            <Audio src={staticFile(`sfx/accents/page-${(n % 3) + 1}.wav`)} volume={0.4} />
          </Sequence>
        ))}
      </AbsoluteFill>
    );
  };

  return { Component, durationInFrames: Math.ceil(END * FPS) };
};
