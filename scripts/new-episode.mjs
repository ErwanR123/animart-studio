// Scaffolds a new "Le Guide" episode from a painting image, ready to open in Remotion Studio.
// Usage (from the repo root): node scripts/new-episode.mjs <Name> <public/art/painting.jpg>
//   e.g. node scripts/new-episode.mjs GuideMonaLisa public/art/mona-lisa.jpg
// Writes src/episodes/<Name>.script.json (segments to rewrite) and src/episodes/<Name>.tsx (config with TODOs, shaped
// like GuideAthens.tsx), registers it in src/episodes/index.ts, then makes the free placeholder voice so it plays.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const [name, image] = process.argv.slice(2);
if (!/^[A-Z][A-Za-z0-9]+$/.test(name ?? "") || !image) throw new Error("usage: new-episode.mjs <PascalCaseName> <public/art/image.jpg>");
if (!image.startsWith("public/art/") || !existsSync(image)) throw new Error(`${image}: put the painting in public/art/ first`);
const base = `src/episodes/${name}`;
if (existsSync(`${base}.tsx`)) throw new Error(`${base}.tsx already exists`);

const [width, height] = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", image])
  .toString()
  .trim()
  .split(",")
  .map(Number);
const src = image.replace(/^public\//, "");
const camel = name[0].toLowerCase() + name.slice(1);

// The pilot's shape (bible/format.md): hook question → context → whole painting → one figure per beat → the answer.
const segments = [
  { id: "hook", text: "Question d'accroche : qui, quoi, pourquoi ?" },
  { id: "context", text: "Le contexte en une ou deux phrases : qui l'a commandé, où, quand." },
  { id: "d0", text: "Sur ce tableau, on voit tout le monde d'un coup." },
  { id: "d1", text: "Premier détail : où il est, qui il était." },
  { id: "d2", text: "Deuxième détail : où il est, qui il était." },
  { id: "d3", text: "Troisième détail : où il est, qui il était." },
  { id: "d4", text: "Et la réponse à la question du début, la voilà." },
];
writeFileSync(`${base}.script.json`, JSON.stringify({ segments }, null, 2) + "\n");

const detail = (id, pose, extra = "") => `    {
      // TODO: what this beat shows; coordinates measured with scripts/grid.py.
      id: "${id}", fx: 0.5, fy: 0.5,
      view: { z: 2.5, fx: 0.5, fy: 0.5 },${extra}
      beat: { pose: "${pose}", x: 230 },
    },`;
writeFileSync(
  `${base}.tsx`,
  `import { createGuideEpisode, type Voice } from "../guide/engine";
import voice from "../../public/voice/${name}.json";

// TODO: the painting (artist, title, date, museum) and the sources every fact was checked against (museum page,
// Wikipedia FR/EN), plus the Wikimedia Commons file of each image (also in public/art/SOURCES.md).
// Start from GuideAthens.tsx for every effect in use; GuideDetail in src/guide/engine.tsx documents them all.
export const ${camel} = createGuideEpisode({
  voiceFile: "voice/${name}.mp3",
  voice: voice as Voice,
  image: { src: "${src}", width: ${width}, height: ${height} },
  maxWidth: 1000,
  climb: true,
  climbFrom: "d1",
  tight: true,
  header: "TODO ARTISTE · MUSÉE · DATE",
  title: ["TODO Titre", "en deux lignes."],
  details: [
${detail("d0", "point-right", `
      // Class photo: name tags on every figure the narration (or Wikipedia) can name.
      tags: [],`)}
${detail("d1", "point-right")}
${detail("d2", "explaining")}
${detail("d3", "point-left")}
${detail("d4", "explaining")}
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
execFileSync("node", ["scripts/voiceover-placeholder.mjs", name], { stdio: "inherit" });
console.log(`\n${name} ready: npm run dev, then follow .claude/skills/episode/SKILL.md (script → coordinates → voice → build → review).`);
