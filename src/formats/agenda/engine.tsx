// « L'Agenda »: the weekend's exhibitions in Paris, read by a voice. Real photos full screen, hard cuts, and text in
// the platforms' own white boxes (design A, chosen 2026-11-17: anything that looks designed reads as AI or an ad).
// Every timing comes from the voice JSON (scripts/voice-gemini.py): segments place the images and labels, words
// place the captions.
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { inter } from "../details/fonts";
import type { AgendaReel, VoiceJson } from "./types";

export const FPS = 30;
export const W = 1080;
export const H = 1920;
const TEXT_BOTTOM = 300; // the caption's bottom edge, px above the frame's bottom (just above the account name)
const RIGHT = 170; // the like / comment / share column
const LEFT = 60;

type Shot = { src: string; pos: string; from: number; to: number };
type Caption = { text: string; from: number; to: number };
type Label = { title: string; info: string; from: number; to: number };

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[^\w]/g, "");

// Words a caption never ends on: the phrase would be cut in the middle ("une expo qui se").
const GLUE = new Set(["de", "du", "des", "d'un", "d'une", "et", "qui", "que", "se", "la", "le", "les", "l'", "un", "une", "à", "au", "aux", "est", "a", "en", "dans", "sur", "pour", "avec", "il", "elle", "ta", "ton", "sa", "son", "ses", "y", "avant,", "van", "mary", "walid", "gustave", "ali"]);
const MAX = 7;

// A segment's words cut into short captions: clauses (sentence end, or a comma once 3 words are in); a clause longer
// than MAX words is split where no caption ends on a glue word, as close to the middle as possible.
function captions(words: VoiceJson["words"], display: Record<string, string>): Caption[] {
  const clauses: VoiceJson["words"][] = [];
  let cur: VoiceJson["words"] = [];
  words.forEach((w, i) => {
    if (i > 0 && w.segment !== words[i - 1].segment && cur.length) { clauses.push(cur); cur = []; }
    cur.push(w);
    if (/[.!?…]$/.test(w.text) || (/[,:;]$/.test(w.text) && cur.length >= 3)) { clauses.push(cur); cur = []; }
  });
  if (cur.length) clauses.push(cur);
  const split = (c: VoiceJson["words"]): VoiceJson["words"][] => {
    if (c.length <= MAX) return [c];
    const mid = c.length / 2;
    const cuts = c.map((_, k) => k).filter(k => k >= 2 && k <= c.length - 2 && !GLUE.has(c[k - 1].text.toLowerCase()));
    // A cut before a conjunction reads best ("Il avait 10 Van Gogh / et 78 Gauguin"): it counts as 2 words nearer.
    const cost = (k: number) => Math.abs(k - mid) - (/^(et|mais|dont|qui)$/i.test(c[k].text) ? 2 : 0);
    const k = cuts.sort((a, b) => cost(a) - cost(b))[0] ?? Math.round(mid);
    return [...split(c.slice(0, k)), ...split(c.slice(k))];
  };
  const out: Caption[] = clauses.flatMap(split).map(c => {
    let text = c.map(w => w.text).join(" ");
    // Whole words only: "dix" -> "10" must not touch "soixante-dix-huit".
    for (const [a, b] of Object.entries(display)) text = text.replace(new RegExp(`(^|\\s)${a}(?=[\\s.,:;!?…]|$)`, "g"), `$1${b}`);
    return { text, from: c[0].start, to: c[c.length - 1].end };
  });
  // Each caption stays until the next one starts, so the box never blinks off between phrases.
  return out.map((c, i) => ({ ...c, to: out[i + 1]?.from ?? c.to + 0.6 }));
}

export function createAgendaReel(r: AgendaReel, voice: VoiceJson) {
  const end = voice.segments[voice.segments.length - 1].end + 0.8;
  const durationInFrames = Math.ceil(end * FPS);

  const shots: Shot[] = [];
  const labels: Label[] = [];
  voice.segments.forEach((s, i) => {
    const seg = r.segments[s.id];
    if (!seg) throw new Error(`no visuals for segment ${s.id}`);
    const to = voice.segments[i + 1]?.start ?? end;
    const words = voice.words.filter(w => w.segment === s.id);
    // An image either starts on a word (`at`) or shares the segment's time evenly with the others.
    const starts = seg.images.map((img, k) => {
      if (img.at) {
        const w = words.find(x => norm(x.text).startsWith(norm(img.at!)));
        if (!w) throw new Error(`${s.id}: no word "${img.at}"`);
        return k === 0 ? s.start : w.start;
      }
      return s.start + ((to - s.start) * k) / seg.images.length;
    });
    seg.images.forEach((img, k) => shots.push({ src: img.src, pos: img.pos ?? "center", from: starts[k], to: starts[k + 1] ?? to }));
    if (seg.label) {
      const prev = labels[labels.length - 1];
      if (prev && prev.title === seg.label.title) prev.to = to;
      else labels.push({ ...seg.label, from: s.start, to });
    }
  });
  const caps = captions(voice.words, r.display ?? {});

  const Component: React.FC = () => {
    const f = useCurrentFrame();
    const t = f / FPS;
    const shot = shots.find(s => t >= s.from && t < s.to) ?? shots[shots.length - 1];
    const cap = caps.find(c => t >= c.from && t < c.to);
    const label = labels.find(l => t >= l.from && t < l.to);
    // A slow push-in on each photo, restarted at every cut.
    const zoom = interpolate(t, [shot.from, shot.to], [1.0, 1.07], { extrapolateRight: "clamp" });
    return (
      <AbsoluteFill style={{ background: "#000", fontFamily: inter }}>
        <Img src={staticFile(shot.src)} style={{ position: "absolute", inset: 0, width: W, height: H, objectFit: "cover", objectPosition: shot.pos, transform: `scale(${zoom})` }} />
        {label && (
          <div style={{ position: "absolute", left: LEFT, right: RIGHT, bottom: TEXT_BOTTOM + 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <Box size={44} weight={800}>{label.title}</Box>
            <Box size={34} weight={600}>{label.info}</Box>
          </div>
        )}
        {cap && (
          <div style={{ position: "absolute", left: LEFT, right: RIGHT, bottom: TEXT_BOTTOM, textAlign: "center" }}>
            <Box size={54} weight={700}>{cap.text}</Box>
          </div>
        )}
        <Audio src={staticFile(`voice/${r.voice}.mp3`)} />
      </AbsoluteFill>
    );
  };
  return { Component, durationInFrames };
}

// The platforms' own text style: black text on white, rounded, one box per line.
const Box: React.FC<{ size: number; weight: number; children: React.ReactNode }> = ({ size, weight, children }) => (
  <div style={{ textAlign: "center", lineHeight: 1.5 }}>
    <span style={{ display: "inline", background: "#fff", color: "#111", fontSize: size, fontWeight: weight, padding: `${size * 0.12}px ${size * 0.3}px`, borderRadius: size * 0.28, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>
      {children}
    </span>
  </div>
);
