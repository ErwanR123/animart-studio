# Animart studio

The studio for the Animart social account (Instagram / TikTok): short educational videos about paintings in the
**"Le Guide"** format, rendered with [Remotion](https://www.remotion.dev). Everything needed to make one is in this
repo: the engine, the character, the voice pipeline, the sound palette, the art, and finished episodes to copy from.

Start with [CLAUDE.md](CLAUDE.md) and the studio bible in [bible/](bible/). A new episode is one command plus the
`/episode` skill in Claude Code.

## Setup

Needs Node 22+, `ffmpeg` and [`uv`](https://docs.astral.sh/uv/) (Python scripts).

```console
npm i --loglevel=error
cp .env.example .env        # then fill GOOGLE_API_KEY, GUIDE_VOICE_ID_GEMINI, ELEVENLABS_API_KEY
bash scripts/sfx-curate.sh  # only to rebuild the sound palette: re-downloads the raw packs into sound-library/
```

## Make a video

```console
npm run dev                                                         # Remotion Studio
node scripts/new-episode.mjs GuideMonaLisa public/art/mona-lisa.jpg   # scaffold a new episode
bash scripts/master.sh GuideMonaLisa                                # final render + audio master → out/
```

The full step-by-step (script → storyboard → voice → edit → review → master) is [bible/workflow.md](bible/workflow.md).

## What's where

| folder | what |
|---|---|
| `src/` | the engine (`src/guide/`) and the episodes (`src/episodes/`) |
| `bible/` | the rules: script, format, art direction, sound, character, workflow, prompts |
| `examples/` | finished episodes (compressed previews); `guide-athens.mp4` is the reference |
| `public/` | what the videos use: art, the Guide's cut-outs, music, sfx, generated voices |
| `docs/design-handoff/` | the app's design handoff: the Guide's character sheet (`design/07_MASCOT.md`), sheets (`visuel/sheets/`), drawn assets (`design/assets/`), brand direction |
| `library/` | raw material from the app: `app-guide/` (bubbles, badges, paper), `paintings/`, `soundbank/` |
| `inspiration/` | outside reels we learned from |
| `scripts/` | scaffold, voice, review, master, sound tools |

Not in git (local only): `out/` (full-quality renders), `cache/` (paid voice takes — copy it between machines so a
re-run never pays twice), `sound-library/` (raw CC0 packs), `refs/` (`bash scripts/refs.sh`).

Remotion needs a company licence for some entities: https://github.com/remotion-dev/remotion/blob/main/LICENSE.md
