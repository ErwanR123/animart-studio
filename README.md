# Animart studio

The studio for the Animart social account (Instagram / TikTok): short educational videos about paintings in the
**"Le Guide"** format, rendered with [Remotion](https://www.remotion.dev). Everything needed to make one is in this
repo: the engine, the character, the voice pipeline, the sound palette, the art, and finished episodes to copy from.

Start with [CLAUDE.md](CLAUDE.md) and the studio bible in [bible/](bible/). A new episode is one command plus the
`/episode` skill in Claude Code.

## Setup

Needs Node 22+, `ffmpeg`, [`uv`](https://docs.astral.sh/uv/) (Python scripts) and `dezoomify-rs` (`brew install dezoomify-rs`, full-resolution museum scans).

```console
npm i --loglevel=error
cp .env.example .env        # then fill GOOGLE_API_KEY and GUIDE_VOICE_ID_GEMINI (copy them from the app's .env)
```

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
| `examples/` | the four finished episodes (compressed previews): Athens, Homecoming, Alexander, Le Cri |
| `public/` | what the videos load: `art/<episode>/` (painting, close-ups, collage pieces), `guide/` (the Guide's poses), `sfx/accents/` + `sfx/story/`, `music/`, `voice/` |
| `docs/brand/` | the Guide's identity: character sheet (`mascot.md`), canonical and bank pose sheets (`sheets/`), decorations and textures (`assets/`), brand direction |
| `library/` | raw material: `app-guide/` (paper bubbles, tape, stamps, sketches), `soundbank/` (`music/` beds, `ambiences/`) |
| `docs/inspiration/` | the Vox-style reel the collage style comes from |
| `scripts/` | by family: `episode-*` (new, review, master), `image-*` (find, collage, grid, depth), `voice-*` (gemini, placeholder, check), `guide-*` (the Guide's drawings) |

Not in git (local only): `out/` (full-quality renders, downloaded sources in `out/sources/`), `cache/` (paid voice
takes and Guide sheets — copy it between machines so a re-run never pays twice), `refs/` (`bash scripts/refs.sh`).

Remotion needs a company licence for some entities: https://github.com/remotion-dev/remotion/blob/main/LICENSE.md
