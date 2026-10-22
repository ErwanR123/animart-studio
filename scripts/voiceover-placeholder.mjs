// Free placeholder narration (macOS `say`) with estimated word timings, to build and cut an episode before paying for
// the real voice (scripts/voiceover-gemini.py writes the same files and replaces it).
// Usage (from the repo root): node scripts/voiceover-placeholder.mjs <Episode>
// Reads src/episodes/<Episode>.script.json, writes public/voice/<Episode>.mp3 + .json (segment and word timings).
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const GAP = 0.35; // seconds between segments
// `say` pads each phrase with silence; trim both ends so the gap is the only pause.
const TRIM_SILENCE = "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse";

const episode = process.argv[2];
if (!episode) throw new Error("usage: voiceover-placeholder.mjs <Episode>");
const out = `public/voice/${episode}`;
const { segments } = JSON.parse(readFileSync(`src/episodes/${episode}.script.json`, "utf8"));
mkdirSync("public/voice", { recursive: true });

const dir = mkdtempSync(join(tmpdir(), "vo-"));
const probe = (file) => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString());
const timed = [];
const words = [];
const list = [];
let t = 0;
segments.forEach((s, i) => {
  const aiff = join(dir, `${i}.aiff`);
  // `say` (optional) is what the voice reads when it differs from the caption, e.g. a year spelled out.
  execFileSync("say", ["-v", "Jacques", "-r", "185", "-o", aiff, s.say ?? s.text]);
  // Bake the gap into the file as real silence: the concat demuxer's `duration` does not insert any.
  const file = join(dir, `${i}.wav`);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", aiff, "-af", `${TRIM_SILENCE},apad=pad_dur=${GAP}`, "-ar", "44100", "-ac", "1", file]);
  const padded = probe(file);
  const duration = padded - GAP;
  timed.push({ id: s.id, start: t, end: t + duration });
  // Spread the caption's words over the segment in proportion to their length.
  const parts = s.text.split(/\s+/);
  const total = parts.reduce((n, w) => n + w.length + 1, 0);
  let w0 = t;
  for (const w of parts) {
    const d = (duration * (w.length + 1)) / total;
    words.push({ text: w, start: w0, end: w0 + d, segment: s.id });
    w0 += d;
  }
  list.push(`file '${file}'`);
  t += padded;
});
writeFileSync(join(dir, "list.txt"), list.join("\n"));
execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", join(dir, "list.txt"), "-ar", "44100", `${out}.mp3`]);
writeFileSync(`${out}.json`, JSON.stringify({ placeholder: true, segments: timed, words }, null, 1));
console.log(`wrote placeholder ${out}.mp3 and ${out}.json (${t.toFixed(1)} s)`);
