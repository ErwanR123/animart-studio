# Format « Détails »

A short (9:16, 1080×1920, 30 fps, ~40 s, no voice) that sells the app's waitlist without looking like an ad: one
famous painting, 4 details nobody notices, the app shown doing exactly that in a museum. First reel: Le Sacre de
Napoléon (`reels/sacre.json`, posted 2026-11-16). Make a new one with the `/details` skill.

## The video, shot by shot

| part | what is on screen | length |
|---|---|---|
| hook | the whole painting; above it the work's label (title, artist, date), under it a line that opens the loops the details close (« Ce tableau cache un cannibale, un peintre célèbre… et un bateau qui les abandonne. »), shown from the very first frame | 2.2 s |
| each detail | one camera move into the painting (no cut), then a slow push while the text reads: the surprise in big, the why in small; a work the text names pops in small above it, with its label, 1.3 s later (`inset`) | 1 s move + 5.5 s dwell |
| the ad, over the last detail (since 2026-11-17; `afterDetail` = the number of details) | a phone rises in front of the painting on the app's scan screen, recognises the work at once (buzz, « Œuvre reconnue »), its story slides up (tab Présentation, the script scrolling), « Gratuit. », then « Rejoins la waitlist · lien en bio »; the squares stay (« Encore N détails 👇 » only if the ad sits mid-video); each line long enough to read (« Au musée, scanne un tableau… » 1.6 s, then « …et Animart te raconte ses secrets. Gratuit. », then the button) | 5 s |
| end | back on the whole painting: « Un chef-d'œuvre. Ses secrets. Tous les jours. », « + Abonne-toi », « L'app arrive bientôt · waitlist en bio »; the last half second glides back to the first frame's framing (seamless loop) | 4 s |

Progress: one square per detail at the top left, like the app's grid cells, each filled with its detail when the
camera arrives (hidden during the ad).

## Rules the user set (2026-11-16, 2026-11-17)

- **The writing carries the video** (no big effects): every line opens a question the next one answers; the hook
  promises the details' mysteries; the strongest shock comes last, just before the ad, and answers the hook.

- **Text sits low**, its bottom ~300 px above the frame's bottom: just above the platform's account name
  (`TEXT_BOTTOM` in `engine.tsx`). Nothing in the top 220 px, the right margin stays clear of the buttons.
- **The subject sits above the text**: the camera puts a detail's centre at 34 % of the height (`DETAIL_Y`); a
  detail made of two things (a butcher above Jesus) gets a `cy`/`wf` that keeps both above ~60 %. Check every dwell.
- **Simple effects that point** (2026-11-17, the user asked for more of these: light, natural, never flashy):
  `faces` (the real people the text names, portraits popping one after the other with their names, above the
  subject), `marks` (a white circle drawing itself around what the text points at, like a finger on a photo),
  `inset` (another work the text names).
- **Structure: the Radeau's** (back to it on 2026-11-18): the app ad after the 2nd detail (`afterDetail: 2`), the
  ending a follow screen only. Follows per 1,000 views: Radeau (ad mid, follow ending) 12; Cana (ad ending) 3.3;
  Tricheur (follow button mid, ad ending) 4.4. The mid ad loses ~15 % of viewers, but whoever reaches the end liked
  the video and is asked one thing: follow, for a daily series. (`MID_FOLLOW` and `end.beta` stay in the engine for an
  ad-last reel; not used now.)
- **The hook decides** — the Radeau's template: « Ce tableau cache X, Y… et Z », three concrete things you want to
  look for in the painting, a shock word first (« un cannibale », « une prostituée »); never a riddle or an abstract line.
  Cana (« tout le monde lui tourne le dos ») and the Tricheur (« trois arnaqueurs, une victime ») fell under 50 % retention fast.
  Previous note: (skip rate Radeau 45 % vs Cana 59 %): three concrete promises (« un cannibale, un peintre
  célèbre… et un bateau ») beat a riddle (« tout le monde lui tourne le dos »).
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
