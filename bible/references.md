# References (`refs/`, git-ignored, not kept locally — `bash scripts/refs.sh` re-clones them when needed)

Read them for **method**, not to copy: our medium is a real painting + a raster cartoon in Remotion; theirs are
p5.js / node-canvas / WebGL films drawn entirely in code.

| repo | what it is | what to take |
|---|---|---|
| `ClaudeAnimationBase` (JohnHeibel) | starter kit for hand-painted cartoons with Claude: p5.brush, the Clawd rig, `render.mjs` | **`ANIMATION_GUIDE.md`** — the best written rules for code animation: timing by *reads*, one read at a time, fast actions / slow meanings, "faces act, never snap", avoid twinning, transitions at every seam, sheets/strips/crops review loop, the "common failures" list. Its rig API (emotions with anticipation + take + overshoot) is the model for our Guide's rig upgrade |
| `PDoomVideo` (JohnHeibel) | the viral music video made by Opus with parallel sub-agents | `STORYBOARD.md` format; `ANIMATION_GUIDE.md` written by the model to brief its sub-agents (one chapter each) — the pattern for splitting a long episode |
| `claude-animation-skill` (buildwithhanif) | node-canvas films: detail bible, rigs with anatomy, synthesised sound | `references/sound.md` (cue on contact − 0.03 s, no continuous drawing scratch, vary pitch, bed ≈ −22 dB under voice, loudnorm check), `references/traps.md`, `references/characters.md` (how to build a rig: parts back-to-front, pose parameters not keyframes, test sheet incl. 2× crop), `scripts/sound.mjs` (synthesised SFX if we ever need them) |
| `Battle-of-Austerlitz-Film` (WinterArc21) | a 5-minute history film in WebGL, narration-timed | long-form educational structure; `web/script.js` beats → shots, every shot timed against narration beats — same idea as our word-timing engine at a larger scale |
| `awesome-opus5-5-videos` (yihui-dev) | 400+ videos made with Opus 5.5, with their prompts | browse for a move to adapt (a text reveal, a transition, a timing pattern); gallery: skillry.dev/ai-videos/opus-5-5 |
| `awesome-ai-motion` (guanmo-ai) | curated motion design / creative coding with sources and prompts | inspiration for transitions and texture effects |

## Libraries worth knowing (from "Claude Motion Tips")

| library | for us | status |
|---|---|---|
| **Rough.js** | sketchy pencil circles, arrows, underlines, hatching — replaces clean SVG rings | installed (`roughjs`); use its generator with a fixed `seed` per shape so it doesn't re-randomise each frame (or re-seed at 12 fps on purpose for boil) |
| **p5.brush** | real pencil / charcoal / watercolour strokes | p5 canvas — usable in Remotion via a `<canvas>` drawn per frame; heavy; only if Rough.js isn't enough |
| **Matter.js** | physics (name tags falling and stacking) | not installed; physics must be pre-simulated deterministically (bake positions per frame) |
| **PixiJS filters** | crosshatch, bulge (a real loupe distortion!), glitch | not installed; a bulge filter would make the lens look optical |
| Anime.js | choreography | not needed: Remotion's `interpolate`/`spring` do it |

## Agent skills in this folder (`.claude/skills`)

- Project skills: **`episode`** (a new video end to end) and **`video-review`** (review a render like a viewer).
- Remotion (remotion-dev/skills, installed in `.agents/skills`, pinned in `skills-lock.json`):
  `remotion-best-practices` (load it before writing Remotion code), `remotion-create`, `remotion-render`,
  `remotion-studio`, `remotion-markup`, `remotion-multimedia`, `remotion-captions`, `remotion-interactivity`,
  `remotion-docs`, `remotion-upgrade`.
- Video craft: `motion-designer` (motion specs for Remotion), `short-form-video` (hooks and retention for
  Reels/TikTok/Shorts).
- The HyperFrames skills (an HTML/GSAP video stack) were removed in the October 2026 cleanup: this studio is
  Remotion only.
