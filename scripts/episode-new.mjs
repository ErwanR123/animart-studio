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

// The studio's shape (bible/format.md): hook → context in collage shots → story beats alternating the painting and
// collage shots → the answer on the whole painting → loop.
const segments = [
  { id: "hook", text: "L'accroche : une question ou une affirmation surprenante, avec un sujet nommé, dès les premiers mots." },
  { id: "context", text: "Qui, quand, où : ce qu'il faut savoir pour comprendre la suite." },
  { id: "d0", text: "Regardez ce détail du tableau : ce qu'il montre, ce qu'il veut dire." },
  { id: "d1", text: "L'histoire autour du tableau : ce qui s'est passé à l'époque." },
  { id: "d2", text: "Un deuxième détail, ou la suite de l'histoire." },
  { id: "d3", text: "La réponse à l'accroche, dite sur le tableau entier." },
];
// The script comes first (bible/workflow.md step 2): an approved one is kept, only a missing one gets the outline.
if (!existsSync(`${base}.script.json`)) writeFileSync(`${base}.script.json`, JSON.stringify({ segments }, null, 2) + "\n");

// The whole painting full width: z = (1080 / ratio) / 1400.
const full = `{ z: ${((1080 * height) / width / 1400).toFixed(3)}, fx: 0.5, fy: 0.5 }`;
writeFileSync(
  `${base}.tsx`,
  `import { createGuideEpisode, type Voice } from "../guide/engine";
import voice from "../../public/voice/${name}.json";

// TODO: the painting (artist, title, date, museum) and the sources every fact was checked against (museum page,
// Wikipedia FR/EN, period documents); every image is in public/art/SOURCES.md.
// Patterns: GuideScream.tsx (collage shots, marks on the painting), GuideAlexander.tsx, GuideHomecoming.tsx;
// GuideDetail in src/guide/engine.tsx and Shot in src/guide/shots.tsx document every option.
const FULL = ${full};
export const ${camel} = createGuideEpisode({
  voiceFile: "voice/${name}.mp3",
  voice: voice as Voice,
  image: { src: "${src}", width: ${width}, height: ${height} },
  maxWidth: 1000,
  climb: true,
  climbFrom: "start",
  openView: FULL,
  openPose: "point-up", // his first and last frame (the loop): pick one that fits the last line too
  // music: "music/TODO.mp3", // a bed of the painting's time and place (bible/sound.md); default the Gymnopédie
  tight: true,
  loop: { word: "TODO" }, // a word of the last line: from there the camera flies back to the opening shot
  header: "TODO ARTISTE · DATE",
  title: ["TODO Titre", "en deux lignes."],
  lead: {
    hook: {
      // One mark on the key word, e.g. a pencil loop measured with scripts/image-grid.py:
      // glow: [{ word: "TODO", fx: 0.5, fy: 0.5, w: 0.05, h: 0.08 }],
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
