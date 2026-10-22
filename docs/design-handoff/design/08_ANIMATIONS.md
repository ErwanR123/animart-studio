# Museum Companion — Motion & Interaction Direction

## Principle
Motion should explain state changes and reinforce discovery. It should not make the app feel like a mobile game.

## Timing
- Micro-interactions: ~150–220ms
- Normal navigation/component transitions: ~220–350ms
- Major discovery/reward transitions: ~450–700ms

Prefer natural ease-out movement. Respect reduced-motion preferences.

## Canonical moments
### Artwork → Notebook
Artwork card/image subtly scales/translates toward its Notebook representation; the destination state resolves with a small stamp/connection. Do not literally animate across unrelated screens if technically awkward—preserve the conceptual continuity.

### Historical connection reveal
A restrained hand-drawn line/ink stroke appears between nodes; labels resolve after the connection.

### Chapter unlock
Faint page/illustration becomes clear; a stamp or Guide gesture completes the reveal. This may be one of the more expressive moments.

### Correct game answer
Answer state resolves first; then small Guide reaction and explanation. Avoid confetti by default.

### Wrong answer
Gentle state change, contextual clue, no shaking screen/aggressive red flash.

### Visit completion
Route visually closes, discovered works group together, then Notebook update is summarized.

### Audio
Player transitions should be calm; immersive audio should avoid mascot motion.

## Mascot animation
If animated, prefer small loops/poses: blink, subtle breathing, pointing gesture, page flip, satchel search, stamp placement. Avoid perpetual bouncing. Animation must have a semantic reason.

## Loading
Prefer skeleton/content placeholders. For culturally themed waits (e.g. recognition), a very subtle Guide sketching/searching interaction may be used only when the wait is meaningful and long enough.

## Accessibility
All information conveyed by motion must also be visible in the final static state. Respect `prefers-reduced-motion`; do not require drag gestures without tap alternatives.
