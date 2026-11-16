// Scaffolds a new "Le Guide" episode from a painting image, ready to open in Remotion Studio.
// Usage (from the repo root): node scripts/episode-new.mjs <Name> <public/art/<ep>/painting.jpg>
//   e.g. node scripts/episode-new.mjs GuideMonaLisa public/art/mona-lisa/mona-lisa.jpg
// Writes src/episodes/<Name>.script.json (segments to rewrite) and src/episodes/<Name>.tsx (config with TODOs, shaped
// like GuideAthens.tsx), registers it in src/episodes/index.ts, then makes the free placeholder voice so it plays.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const [name, image] = process.argv.slice(2);
if (!/^[A-Z][A-Za-z0-9]+$/.test(name ?? "") || !image) throw new Error("usage: episode-new.mjs <PascalCaseName> <public/art/<ep>/image.jpg>");
if (!image.startsWith("public/art/") || !existsSync(image)) throw new Error(`${image}: put the painting in its episode folder public/art/<ep>/ first`);
const base = `src/episodes/${name}`;
if (existsSync(`${base}.tsx`)) throw new Error(`${base}.tsx already exists`);

const [width, height] = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", image])
  .toString()
  .trim()
  .split(",")
  .map(Number);
const src = image.replace(/^public\//, "");
const camel = name[0].toLowerCase() + name.slice(1);

// The studio's shape (bible/format.md): a ~40 s video, 90–120 words. Cold open (the hook, ≤ 3 s, teasing the
// surprise the video pays off later) → the proof → the story in order → the answer, whose last words run into the hook.
const segments = [
  { id: "hook", text: "L'accroche, 12 mots au plus : le fait surprenant que la vidéo expliquera plus tard." },
  { id: "context", text: "La preuve, ou qui / quand / où, en une phrase." },
  { id: "d0", text: "L'histoire, dans l'ordre : ce qui s'est passé." },
  { id: "d1", text: "La suite, jusqu'au moment clé." },
  { id: "d2", text: "Le moment clé : la réponse au teaser." },
  { id: "d3", text: "La chute, qui s'enchaîne sur la première phrase pour la boucle." },
];
// The script comes first (bible/workflow.md step 2): an approved one is kept, only a missing one gets the outline.
if (!existsSync(`${base}.script.json`)) writeFileSync(`${base}.script.json`, JSON.stringify({ segments }, null, 2) + "\n");

// The whole painting full width under the Guide: z = (1080 / ratio) / 1400.
const full = `{ z: ${((1080 * height) / width / 1400).toFixed(3)}, fx: 0.5, fy: 0.5 }`;
writeFileSync(
  `${base}.tsx`,
  `import { createGuideEpisode, type Voice } from "../guide/engine";
import voice from "../../public/voice/${name}.json";

// TODO: the painting (artist, title, date, museum) and the sources every fact was checked against (museum page,
// Wikipedia FR/EN, period documents); every image is in public/art/SOURCES.md.
// Two modes (bible/format.md): a story told in Vox collage shots (GuideBanksy.tsx, GuideCaravaggio.tsx, GuideScream.tsx
// d2), or a journey inside the painting, each camera move telling the next part (GuideAthens.tsx). GuideDetail in
// src/guide/engine.tsx and Shot in src/guide/shots.tsx document every option.
const FULL = ${full};
// Frame 0 and the loop's last frame: the painting covering the whole screen.
const OPEN = { z: 1, fx: 0.5, fy: 0.5 };
export const ${camel} = createGuideEpisode({
  voiceFile: "voice/${name}.mp3",
  voice: voice as Voice,
  image: { src: "${src}", width: ${width}, height: ${height} },
  maxWidth: 1000,
  climb: true,
  climbFrom: "start",
  openView: FULL,
  openPose: "point-up",
  // music: "music/TODO.mp3", // a bed of the painting's time and place (bible/sound.md); default the Gymnopédie
  tight: true,
  // Cold open (bible/format.md, the hook): the painting full screen on frame 0, the hook small on tape at the bottom,
  // then a hard cut before 2 s onto the detail the teaser is about. The Guide comes in with the context line.
  cold: [
    { view: OPEN, tapes: ["TODO L'ACCROCHE EN 5 MOTS"], y: 1700, size: 54 },
    { word: "TODO", view: { z: 2, fx: 0.5, fy: 0.3 } },
  ],
  // From this word of the last line, back to frame 0 full screen, the Guide gone: the video loops into its hook.
  loop: { word: "TODO", view: OPEN, full: true },
  header: "TODO ARTISTE · DATE",
  title: ["TODO Titre", "en deux lignes."],
  lead: {
    hook: {
      // On the cut: the teased thing lands as a real archive piece (the eruption on Le Cri's sky), with an accent.
      // collage: { word: "TODO", pieces: [{ src: "art/TODO/piece.png", x: 330, y: 560, w: 420, rot: -6, depth: 0.9, at: "TODO" }] },
      // sfx: [{ word: "TODO", src: "sfx/story/boom.wav", volume: 0.5 }],
    },
    context: {
      // Who / when / where as collage shots (bible/art-direction.md), each storyboarded as a still first:
      // shots: [{ word: "TODO", in: "slide", source: "TODO archive, date", layers: [{ bg: "art/paper/kraft.jpg" }, { src: "art/TODO/piece.png", x: 140, y: 260, w: 800, rot: -2, z: 0.5 }, { tape: "TODO", x: 120, y: 900, size: 64, rot: -3, z: 0.9 }] }],
    },
  },
  details: [
    {
      // TODO: a detail of the painting the voice points at (coordinates from scripts/image-grid.py).
      id: "d0", fx: 0.5, fy: 0.5,
      view: { z: 2.5, fx: 0.5, fy: 0.5 },
      beat: { pose: "point-up", x: 230 },
    },
    {
      // TODO: the story around the painting, as collage shots (~2 s each, built word by word).
      id: "d1", fx: 0.5, fy: 0.5,
      view: FULL,
      beat: { pose: "explaining", x: 230 },
    },
    {
      id: "d2", fx: 0.5, fy: 0.5,
      view: { z: 2, fx: 0.5, fy: 0.5 },
      beat: { pose: "point-up", x: 230 },
    },
    {
      // The answer, on the whole painting.
      id: "d3", fx: 0.5, fy: 0.5,
      view: FULL,
      beat: { pose: "explaining", x: 230 },
    },
  ],
});
`,
);

const index = "src/episodes/index.ts";
writeFileSync(
  index,
  readFileSync(index, "utf8")
    .replace("// new-episode: import", `import { ${camel} } from "./${name}";\n// new-episode: import`)
    .replace("  // new-episode: entry", `  ${name}: ${camel},\n  // new-episode: entry`),
);
execFileSync("node", ["scripts/voice-placeholder.mjs", name], { stdio: "inherit" });
console.log(`\n${name} ready: npm run dev, then follow .claude/skills/episode/SKILL.md (script → storyboard stills → archives → voice → build → review).`);
