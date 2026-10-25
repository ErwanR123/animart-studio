# Museum Companion — Character Bible

## Role
The recurring cultural companion, internally called **the Guide** until named. Not a logo with limbs: a character who accompanies exploration of museums, artworks, cities and history.

## Concept
Older Italian painter/explorer. Knowledgeable without acting like a professor; curious, slightly eccentric, warm and enthusiastic. Every artwork seems to hide a story he wants to share.

## Personality
Curious, warm, passionate, mischievous, cultivated, slightly clumsy, expressive. Experienced adult with childlike wonder—not childish behavior.

## Desired attachment
“I like this little guy,” not merely “this mascot is cute.” Personality, imperfections and recurring interactions create attachment.

## Body
Short, compact, slightly chubby—not obese, muscular or childlike. Moderately oversized head for expression, rounded silhouette, low center of gravity, small legs, comfortable posture.

## Face
Older Italian appearance. Large expressive moustache, round nose, warm cheeks, expressive eyebrows, small expressive eyes, subtle age. Avoid anime eyes. Emotion mainly via eyebrows, eyelids, mouth, moustache and posture.

## Outfit
Persistent: burgundy/red painter beret, cream shirt, muted olive jacket, small red/terracotta neck scarf, brown trousers, dark practical shoes, brown leather explorer satchel. Do not redesign between assets.

## Props
Notebook, pencils, brushes, folded museum map, magnifying glass, small book, rolled sketches.

## Silhouette
Recognizable at 48px/in black through beret + moustache/nose profile + small rounded explorer silhouette/satchel.

## Illustration style
2D editorial illustration; European editorial/travel sketchbook; ink, gouache, watercolor; visible imperfection and line variation. Never Pixar/Disney/3D/anime/chibi/Funko/corporate-vector/mobile-game mascot.

## Expressions
`neutral`, `happy`, `excited`, `very_happy`, `thinking`, `curious`, `surprised`, `confused`, `skeptical`, `proud`, `encouraging`, `disappointed_but_kind`, `celebrating`, `focused`.

## Poses
`standing`, `walking`, `pointing_left`, `pointing_right`, `pointing_up`, `looking_at_artwork`, `reading_book`, `reading_map`, `holding_notebook`, `holding_magnifying_glass`, `thinking`, `explaining`, `celebrating`, `peeking`, `sitting`, `sketching`.

## Priority combinations
Guide/explanation: pointing + talking. Discovery: amazed toward artwork. Correct answer: celebrating. Wrong answer: thinking/encouraging, never angry. Hint: magnifying glass. Context: notebook/book. Navigation: map. Empty collection: searching satchel. Chapter completed: placing stamp.

## Scale
S = head/bust for feedback/hints. M = half/full body for onboarding/explanations/empty states/games. L = integrated editorial scene, rare, for major moments.

## Dialogue
Short, natural, curiosity-first. Character creates curiosity; factual product content delivers the full knowledge. Avoid textbook monologues.

## Humor
Subtle and situational: overenthusiasm, getting distracted by details, searching the satchel, proudly knowing obscure facts, dramatic appreciation. Never meme-heavy.

## Games
Acts as game master: introduces, hints once, celebrates correct answers, encourages/explains wrong answers, reconnects learning to Notebook. Never shames.

## Notebook
Most natural home: annotate discoveries, draw lines, place stamps, reveal pages, explain connections, point to gaps and suggest next exploration.

## Artworks
Respect art. Never cover important regions or redraw originals in mascot style when originals are available. Real art vs illustrated Guide is a core contrast.

## Asset consistency
All production assets derive from one canonical reference. Same facial structure, moustache, beret, proportions, clothing, palette and technique. Do not independently generate every pose without reference.

## Where the drawings are
- References: `guide-character-reference.png` (the model sheet: colours, expressions, poses, props),
  `turnaround.png` (front, three-quarter, profile, back), `perso.png` (an early pose sheet), `inspi1–3.png` (the
  app's screens with the Guide, for the brand's look).
- `sheets/`: the canonical pose sheet (`sheet_poses.png`, what `scripts/guide-generate.py` starts from) and the bank
  sheets; `assets/`: drawn decorations, sketches and paper textures.
- In the videos: the pose bank in `public/guide/` (cut by `scripts/guide-assets.py`), more drawings not yet in the
  bank in `library/guide-extra/`. Every asset has a transparent background.

## Approval test
Same person? Same body? Same clothes? Same illustrator? Same warm/curious personality? If any answer is no, reject the asset.

## Golden rule
**The Guide should make culture feel more alive. He must never make culture feel less serious.**
