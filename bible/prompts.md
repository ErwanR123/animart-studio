# Prompt templates

Long briefs work better with XML tags separating style, references, timing and deliverable (Anthropic's prompting
guide; tip collection "Claude Motion Tips"). Copy, fill, paste into Claude Code from the repo root.

## New episode

```xml
<painting>Artist, title, museum. Image: public/art/<file>.jpg (and the other walls if it is a fresco in a room)</painting>
<angle>The hook: a question or a surprising statement with a named subject (bible/script.md rule 7).</angle>
<audience>French-speaking TikTok/Reels viewers, curious, not specialists. Sound off for many of them.</audience>
<must_show>The details of the painting the story rests on, and the story around it (the time, the place, the
documents) to show in collage shots.</must_show>
<tone>The Guide: warm, curious, never professorial (bible/character.md).</tone>
<constraints>55–70 s, vouvoiement, format bible/format.md, script rules bible/script.md, effects only from the approved list in
bible/art-direction.md, sound bible/sound.md. Check every fact against the museum page and Wikipedia; list sources
in the file header. One paid voice take per script version.</constraints>
<deliverable>Use /episode (bible/workflow.md): show me the script, then the storyboard as still images of every
collage shot, before animating; then the contact sheet before the master.</deliverable>
```

## One-second test (before building an effect into an episode)

```xml
<effect>A new effect, e.g. chalk hatching drawn over a shadow, on the word "ombre".</effect>
<timing>1 second: pencil starts at 0.00 s, circle closed at 0.45 s, note lands at 0.60 s, hold to 1.00 s.</timing>
<deliverable>Add it to the engine behind a new GuideDetail key, wire it in one beat of the episode, then
`uv run scripts/episode-review.py strip <Ep> --from <t> --to <t+1>` and show me the strip. Wait for my feedback before
using it anywhere else; record the verdict in bible/art-direction.md.</deliverable>
```

## Keyframe review before the final render

```xml
<task>Before the final master of <Episode>, render `episode-review.py sheet <Episode> --every 1.5` and a sheet at each
detail's arrival time.</task>
<check>Cropped or overlapping text, elements disappearing during transitions, the Guide or the bubble covering
the art, anything in the anti-slop list, reads shorter than 20 frames, the right pointing direction.</check>
<deliverable>The sheet, a list of problems with timestamps, the fixes you propose. Wait for my go before the
master.</deliverable>
```

## Sound pass

```xml
<task>Sound pass on <Episode> following bible/sound.md.</task>
<check>Render the master, run the audio report, list every accent with its time and the read it supports;
remove accents that don't support a read or don't match what is seen, vary repeats.</check>
<deliverable>The cue list (time · sound · why), the new master and its report.</deliverable>
```
