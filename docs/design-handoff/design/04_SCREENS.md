# Museum Companion — Canonical Screens

Use with the design system, navigation, Notebook and mascot specs. Inspect the existing repo first; preserve working business logic and migrate progressively.

## Global shell
Bottom nav: `Accueil | Explorer | Visite | Carnet | Profil`. Hide during immersive audio, camera/scanning, full-screen games and major reward moments. Background `paper`, surfaces `surface`, horizontal padding 16–20px.

## A — Onboarding
### Welcome
Headline: **L'art a mille histoires.** Secondary: **Partez à leur rencontre où que vous soyez.** Large Guide + subtle cultural/city sketch. CTA **Commencer l'aventure**; secondary sign-in.
### Interests
Editorial selectable cards: painting, history, architecture, sculpture, Antiquity, Renaissance, modern art, civilizations, etc. Keep onboarding short.

## B — Home
Greeting + editorial question **Où on explore aujourd'hui ?** Global search. One dominant contextual card (active visit > upcoming > strong recommendation > suggestion). Modules: recommendations, current Notebook chapter, one contextual challenge. No infinite feed.

## C — Explorer
Search, `Carte | Liste`, filters. Map uses restrained cultural-place markers and a useful bottom sheet. List emphasizes photography/context. No Pokémon-like collectibles.

## D — Museum
Hero image; back/favorite/share; museum metadata; `Présentation | Expositions | Infos pratiques`; user context; highlights; CTA **Planifier ma visite** or **Commencer la visite**.
### Visit Planner
Duration, interests, must-see works, relevant accessibility/preferences. Generated route with duration, works, themes and map preview.

## E — Visit
Calm dashboard: museum, progress, current/next artwork, room/distance, CTA, map/scanner/Ask Guide/audio. Optimize for less phone attention.
### Museum Map
Current position if technically supported, route, visited works, next destination. Function > decoration.
### Scan
Camera-first, minimal UI, **Cadrez l'œuvre**. Avoid fake futuristic scanner effects.

## F — Discovery
### Artwork Reveal
Clean artwork + title/artist/date + subtle discovery marker + Guide reaction. CTA **Découvrir son histoire**.
### Artwork Detail
Hero artwork, metadata, Listen/Favorite/Share, tabs `À propos | Contexte | Anecdotes | Connexions`. Guide appears only in selected explanation moments.
### Historical Connection Reveal
Show how discovery connects into Notebook; CTA **Voir dans mon carnet**, secondary **Continuer la visite**.

## G — Audio
Compact persistent player during visits. Full immersive player: darkened artwork/museum visual, title, progress, ±15 sec, transcript. Guide should not interrupt immersion.
### Ask the Guide
Conversational layer tied to current context; suggestions like “Pourquoi cette œuvre est célèbre ?”, “Qu'est-ce que je dois regarder ?”, “Que se passait-il à cette époque ?”.

## H — Carnet
Header **Mon carnet d'explorateur**. Tabs `Histoire | Œuvres | Lieux | Collections`.
### History Overview
Periods from Antiquity to contemporary world. Unknown=faint, revealed=outline, discovered=visible, explored=richer.
### Period
Editorial header, intro, progress and chapters.
### Chapter
Example: **Florence — Berceau de la Renaissance**. What changed, people, events, places, discoveries, connections, remaining exploration, Guide annotation. Elegant explorer notebook, not standard article.
### Artworks
Personal discoveries with filters. Contextual unknown/revealed gaps allowed; no rarity system.
### Places
Map + list where places gain meaning through cultural/historical connections.
### Collections
Themes combining discovery and understanding.

## I — Mini-games
### Entry
Contextual reason for challenge + Guide + **Jouer**.
### Selection
Only if intentionally opened: recommended, by theme, quick, unlocked.
### Recognize
Cropped detail → identify artwork.
### Timeline
Reorder personal discoveries chronologically; drag + accessible tap alternative.
### Matching
Artwork↔movement/artist/event or person↔period.
### Odd One Out
Identify the work that breaks a learned concept.
### Puzzle
Short reconstruction for visual familiarity.
### Quick Quiz
One question per screen; strong imagery, minimal chrome.
### Feedback
Correct: Guide reacts + explain why. Incorrect: kind hint/explanation, never punitive. Learning > scoring.
### Completion
Score/summary, learned concepts, Notebook progress/unlock, Guide celebration, CTA back to relevant Notebook context.

## J — Rewards
Use sparingly: new chapter, badge, historical connection, collection milestone, Notebook page. Chapter unlock can be a major visual moment. Badges resemble museum stamps, seals, medallions or explorer insignia—not game trophies.

## K — Profile
Name/identity, restrained stats, badges, current cultural journey, favorites, visit history, downloads, preferences, settings. Do not over-emphasize numbers.

## L — Empty states
Good place for Guide: searching satchel for empty artworks, holding map for no visits, reading downloaded notebook offline. Always include a meaningful next action.

## M — Key transitions
Artwork→Notebook; discovery→historical connection; chapter reveal; game answer→Guide reaction; visit completion→route closes→works collected→Notebook update.

## Implementation rule
For each screen: search repo for equivalent functionality; reuse business logic; extract design primitives; match spec; use canonical assets; do not invent new visual conventions; flag missing product decisions.
