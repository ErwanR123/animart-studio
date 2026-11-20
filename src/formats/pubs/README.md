# Format « Pubs » (une fonctionnalité, une vidéo)

A 20-second ad (9:16, 1080×1920, 30 fps, silent track) for **one feature of the app**, in the app's own look. The
styles were compared in the « Pubs Animart » artifact (https://claude.ai/artifact/6jTLM4fyRuHtLsqP4shhw6): style A
« Natif » chosen for our accounts (2026-11-20); style C (kinetic type) kept for paid ads later. Once the account
reaches the follower count that unlocks Instagram's trial reels, many variants of these ads get tested that way
(trial reels are shown to non-followers only).

## The skeleton (every ad)

| time | role | on screen |
|---|---|---|
| 0–2 s | hook: a dare or a problem everyone lived, ≤ 6 words | white text boxes (the platforms' own style) over the feature's images |
| 2–5 s | the problem / what it is | one line |
| 5–15 s | the feature in action | the phone, the app's real screen rebuilt from `../Animart/src/theme`, one gesture at a time |
| 15–18 s | the result | what you get from it |
| 18–20 s | waitlist | « Animart » + « Bientôt · waitlist en bio » |

## Rules

- **Only features that will be in the app at launch** (`../Animart/docs/MVP.md`), shown as they look in the app.
- Names on screen (a friends' ranking) are made up and say nothing about real people.
- No nudity in the paintings shown (Détails README).
- Text: white boxes, black bold Inter, never at the very top (platform UI).

## The series

| # | feature | hook | state |
|---|---|---|---|
| 1 | La grille du jour | « Je parie que tu fais pas 9/9. » | `PubGrille.tsx` |
| 2 | Le scan | « POV : tu lis plus jamais un cartel. » | prototype in the artifact |
| 3 | L'audio dans la poche | « L'audioguide à 6 €, c'est fini. » | to do |
| 4 | La chasse au musée | « J'ai transformé le Louvre en chasse au trésor. » | to do |
| 5 | La course entre potes | « On s'est fait une course à Orsay. » | to do |
| 6 | Explorer et les rappels | « T'as encore raté une expo ? » | to do |
| 7 | Le photo dump de visite | « Ton photo dump de musée, avec tes potes. » | to do |

## Make one

One file per ad in this folder (copy `PubGrille.tsx`: `In` shows a block between two times, `Boxes` the text
boxes), registered in `compositions.tsx`. Then:

```bash
npx remotion still PubGrille out/s.png --frame=300 --scale=0.4   # look at frames
bash scripts/pub-export.sh PubGrille                             # → ~/Desktop/marketing_animart
```

The post's text is written by hand in `out/<slug>.post.md` (see `pub-grille.post.md` in the exports folder).
