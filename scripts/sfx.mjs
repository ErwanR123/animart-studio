// Generates the sound palette (and music beds) listed in scripts/sfx-library.json with ElevenLabs, ONCE.
// Usage (from the repo root): node --env-file=.env scripts/sfx.mjs [name …] [--music] [--takes=N]
//   no names  → every missing sound effect (music beds only with --music: they cost much more)
//   --takes=N → N takes of each sound (<name>.mp3, <name>.t2.mp3 …) to pick the best by ear
// A file that already exists is never regenerated: delete it to pay for a new take.
// Each result is trimmed (leading silence), peak-normalised to -3 dBFS and given a 5 ms fade-in,
// so the volumes written in the episode code mean the same thing for every file (bible/sound.md).
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) throw new Error("ELEVENLABS_API_KEY missing: run with node --env-file=.env");
const OUT = "public/sfx/v3";
const MUSIC_OUT = "public/music";
const lib = JSON.parse(readFileSync("scripts/sfx-library.json", "utf8"));
const args = process.argv.slice(2);
const names = args.filter((a) => !a.startsWith("--"));
const withMusic = args.includes("--music");
const takes = Number(args.find((a) => a.startsWith("--takes="))?.split("=")[1] ?? 1);
mkdirSync(OUT, { recursive: true });

const post = async (path, body) => {
  const res = await fetch(`https://api.elevenlabs.io${path}`, {
    method: "POST",
    headers: { "xi-api-key": KEY, "content-type": "application/json", accept: "audio/mpeg" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path} ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return Buffer.from(await res.arrayBuffer());
};

// Peak to -3 dBFS, leading silence cut (not for loops or music, whose start is part of the take).
const finish = (file, { trim }) => {
  const peak = execFileSync("ffmpeg", ["-v", "info", "-i", file, "-af", "volumedetect", "-f", "null", "-"], { stdio: ["ignore", "pipe", "pipe"] })
    .toString()
    .match(/max_volume: (-?[\d.]+) dB/);
  const max = peak ? Number(peak[1]) : 0;
  const gain = -3 - max;
  const filters = [...(trim ? ["silenceremove=start_periods=1:start_threshold=-45dB", "afade=t=in:d=0.005"] : []), `volume=${gain.toFixed(2)}dB`];
  const tmp = `${file}.tmp.mp3`;
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", file, "-af", filters.join(","), "-ar", "48000", "-b:a", "192k", tmp]);
  renameSync(tmp, file);
};

const wanted = (n) => names.length === 0 || names.includes(n);
const fileFor = (dir, name, k) => `${dir}/${name}${k > 1 ? `.t${k}` : ""}.mp3`;

for (const s of lib.sounds.filter((x) => wanted(x.name))) {
  for (let k = 1; k <= takes; k++) {
    const file = fileFor(OUT, s.name, k);
    if (existsSync(file)) continue;
    process.stdout.write(`sfx ${s.name}${k > 1 ? ` take ${k}` : ""} … `);
    const audio = await post("/v1/sound-generation", {
      text: s.prompt,
      model_id: "eleven_text_to_sound_v2",
      duration_seconds: s.seconds,
      prompt_influence: 0.6,
      ...(s.loop ? { loop: true } : {}),
    });
    writeFileSync(file, audio);
    finish(file, { trim: !s.loop });
    console.log("ok");
  }
}

if (withMusic) {
  for (const m of lib.music.filter((x) => wanted(x.name))) {
    const file = fileFor(MUSIC_OUT, m.name, 1);
    if (existsSync(file)) continue;
    process.stdout.write(`music ${m.name} … `);
    const audio = await post("/v1/music", { prompt: m.prompt, music_length_ms: Math.round(m.seconds * 1000), model_id: "music_v1" });
    writeFileSync(file, audio);
    finish(file, { trim: false });
    console.log("ok");
  }
}
