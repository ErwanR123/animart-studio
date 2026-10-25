# Animart studio

The studio for the Animart social account (Instagram / TikTok): short educational videos about paintings in the
**"Le Guide"** format, rendered with [Remotion](https://www.remotion.dev). Everything needed to make one is in this
repo: the engine, the character, the voice pipeline, the sound palette, the art, and finished episodes to copy from.

Start with [CLAUDE.md](CLAUDE.md) and the studio bible in [bible/](bible/). A new episode is one command plus the
`/episode` skill in Claude Code.

## Setup (from a fresh clone, in this order)

Everything the videos need is in git (engine, Guide drawings, art, music, sound, voices of the finished episodes);
only the tools below are installed per machine. Commands are for macOS with [Homebrew](https://brew.sh); on Linux use
your package manager, on Windows use WSL. A Claude agent can run this section top to bottom: each step ends with a
check that must pass before the next.

1. **System tools**

   ```console
   brew install git ffmpeg uv nvm
   brew install dezoomify-rs   # optional: full-resolution museum scans (scripts/image-find.py hires)
   ```
   Check: `ffmpeg -version`, `uv --version` print a version.

2. **Node 22** (the version in `.nvmrc`)

   ```console
   source "$(brew --prefix nvm)/nvm.sh"   # or add nvm to your shell profile once, as `brew info nvm` says
   nvm install && nvm use
   ```
   Check: `node -v` prints v22.

3. **Remotion and the other packages** (exact versions from `package-lock.json`)

   ```console
   npm ci --loglevel=error
   npx remotion browser ensure   # the headless Chrome Remotion renders with (~100 MB, once)
   ```
   Check: `npm run lint` ends without errors.

4. **Python scripts**: nothing to install. Each script declares its packages in its header and `uv run` fetches them
   on first use (a minute or two). The first voice run also downloads a Whisper model (a few hundred MB) for the word timings;
   `rig-cut.py` and `image-collage.py --cut` download a cut-out model the same way.
   Check: `uv run scripts/episode-review.py --help` prints the usage.

5. **Keys** (only for the real voice and new Guide poses; everything else works without them)

   ```console
   cp .env.example .env
   ```
   Fill `GOOGLE_API_KEY` (a Gemini key from [Google AI Studio](https://aistudio.google.com/apikey), billing on) and
   `GUIDE_VOICE_ID_GEMINI` (the Guide's voice: ask Erwan for the value so every video has the same voice). `.env` is
   git-ignored: never commit it, never print it. Optional: copy Erwan's `cache/` folder into the repo so voice
   takes already paid for are never paid again.

6. **Check the whole chain**

   ```console
   npx remotion still GuideParisRain out/check.png --frame=1336   # one frame of the reference episode
   npm run dev                                                    # Remotion Studio in the browser: play any episode
   ```
   Check: `out/check.png` shows the building site (the stone-breaker, the scaffolding, the Guide at the bottom). A
   full render + audio master of an episode: `bash scripts/episode-master.sh GuideParisRain` (a few minutes) →
   `out/guide-paris-rain.mp4`, compare with `examples/guide-paris-rain.mp4`.

With Claude Code: open the repo folder, `CLAUDE.md` and the skills in `.claude/skills/` load by themselves (`/episode`
makes a new video end to end, `/video-review` reviews a render). Paid steps (the voice, ~$0.03 a take; a new Guide
pose sheet, ~$0.13) are run only once a script is approved.

## Make a video

```console
npm run dev                                                         # Remotion Studio
node scripts/episode-new.mjs GuideMonaLisa public/art/mona-lisa/mona-lisa.jpg # scaffold a new episode
bash scripts/episode-master.sh GuideMonaLisa                                # final render + audio master → out/
```

The full step-by-step (research → script → storyboard stills → archives → voice → build → review → master) is
[bible/workflow.md](bible/workflow.md); how to write the script is [bible/script.md](bible/script.md), how it must
look is [bible/art-direction.md](bible/art-direction.md).

## What's where

| folder | what |
|---|---|
| `src/` | the engine (`src/guide/`) and the episodes (`src/episodes/`) |
| `bible/` | the rules: script, format, art direction, sound, character, workflow, prompts |
| `examples/` | the five finished episodes (compressed previews): Athens, Homecoming, Alexander, Le Cri, Rue de Paris (the quality bar) |
| `public/` | what the videos load: `art/<episode>/` (painting, close-ups, collage pieces), `guide/` (the Guide's poses), `sfx/accents/` + `sfx/story/`, `music/`, `voice/` |
| `docs/brand/` | the Guide's identity: character sheet (`mascot.md`), canonical and bank pose sheets (`sheets/`), decorations and textures (`assets/`), brand direction |
| `library/` | raw material: `app-guide/` (paper bubbles, tape, stamps, sketches), `guide-extra/` (more Guide drawings: six busts, peeking round a wall, stamping), `soundbank/` (`music/` beds, `ambiences/`, spare `sfx/`), `rig-sources/` (the originals the paper puppets are cut from) |
| `docs/inspiration/` | the Vox-style reel the collage style comes from |
| `scripts/` | by family: `episode-*` (new, review, master), `image-*` (find, collage, grid, depth), `voice-*` (gemini, placeholder, check), `guide-*` (the Guide's drawings) |

Not in git (local only): `out/` (full-quality renders, downloaded sources in `out/sources/`), `cache/` (paid voice
takes and Guide sheets — copy it between machines so a re-run never pays twice), `refs/` (`bash scripts/refs.sh`).

Remotion needs a company licence for some entities: https://github.com/remotion-dev/remotion/blob/main/LICENSE.md
