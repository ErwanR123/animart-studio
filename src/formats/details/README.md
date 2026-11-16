# Format « Détails »

A short (9:16, 1080×1920, 30 fps, ~40 s, no voice) that sells the app's waitlist without looking like an ad: one
famous painting, 4 details nobody notices, the app shown doing exactly that in a museum. First reel: Le Sacre de
Napoléon (`reels/sacre.json`, posted 2026-11-16). Make a new one with the `/details` skill.

## The video, shot by shot

| part | what is on screen | length |
|---|---|---|
| hook | the whole painting; above it the work's label (title, artist, date), under it « 4 détails que t'as jamais vus dans ce tableau » | 1.3 s, short: get to the first detail fast |
| each detail | one camera move into the painting (no cut), then a slow push while the text reads: the surprise in big, the why in small | 1 s move + 5.5 s dwell |
| the ad, over one detail | a phone rises in front of the painting on the app's scan screen, recognises the work at once (buzz, « Œuvre reconnue »), its story slides up (tab Présentation, the script scrolling), « Gratuit. », then « Rejoins la waitlist · lien en bio » | 6.7 s |
| end | back on the whole painting: « Un chef-d'œuvre. Ses secrets. Tous les jours. », « + Abonne-toi », « L'app arrive bientôt · waitlist en bio » | 4 s |

Progress: one square per detail at the top left, like the app's grid cells, each filled with its detail when the
camera arrives (hidden during the ad).

## Rules the user set (2026-11-16)

- **Text sits low**, its bottom ~380 px above the frame's bottom: just above the platform's account name
  (`TEXT_BOTTOM` in `engine.tsx`). Nothing in the top 220 px, the right margin stays clear of the buttons.
- **Time to read** every text: 5.5 s a detail. The first shot is short.
- **One camera travelling through the painting**, slow zooms; no cuts between details, no numbers on the painting.
- **No sound effects** in the render (they read as AI slop); the music is the platform's trending sound, added when
  posting (the file has a silent track so the platform's mixer keeps both).
- **The app screens are rebuilt from the app's code** (`app.tsx`, sources in its header). When the app changes,
  re-read the code; never draw the screen from memory. The app screen must not reveal a detail still to come.
- The app is not out: the call is always **the waitlist**, never « l'app en bio ».
- Rejected: story-style bars as progress, two ads in one video, a separate ad slide, a mock-up that doesn't match
  the app, numbers on the painting.

## Files

- `types.ts`: what a reel JSON holds; `reels/*.json`: one per video; `reels/index.ts` registers them.
- `engine.tsx`: timing (`T`, `AD`), camera, captions, tracker, ad, end. `app.tsx`: the scan and work screens.
- `compositions.tsx`: the reels as compositions, mounted in `src/Root.tsx` (`npm run dev` shows them).
- `scripts/details-export.sh <Id>`: the files to post and the post text.
