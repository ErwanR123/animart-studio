# Sound sources

Only CC0 / public-domain / our own sounds. Record every file you add here (source URL, licence, cut).

## v2 palette (`v2/`, "La loupe du Guide" from October 2026), all CC0

Cut, faded and peak-normalised by hand; the engine cycles through the numbered takes so a repeat never sounds identical.

| File | Source | Cut |
|---|---|---|
| pencil-1…4.wav | "writing - pencil - wide 03" (Freesound 337091) | 0.0 / 1.55 / 3.8 / 4.75 s, ~0.7 s each |
| shutter.wav | "Vintage Camera Flash Powder and Shutter" (Freesound 232130) | 0.5–1.5 s |
| card.wav | "Paper sheets (sliding)" (Freesound 560352) | 0.3–1.15 s |
| page-1.wav | "Page Turn 05" (Freesound 397552) | 0.3–0.8 s |
| page-2.wav | "Page Turn Free" (Freesound 842183) | 0.1–0.55 s |
| page-3.wav | "turning page 2" (Freesound 215743) | whole |
| swish-1…4.wav | Kenney "RPG Audio" cloth1…4 (kenney.nl) | whole |
| thud.wav | Kenney "RPG Audio" bookPlace1 | whole |
| book.wav | Kenney "RPG Audio" bookOpen | whole |

## v3 palette (`v3/`, October 2026), all CC0 — built by `scripts/sfx-curate.sh`

Peak-normalised to -3 dBFS, leading silence trimmed. Any file can be replaced by a bespoke ElevenLabs take
(`scripts/sfx.mjs`, prompts in `scripts/sfx-library.json`) under the same name.

| File | Source | Cut |
|---|---|---|
| step-1…3.wav | Kenney "Impact Sounds" footstep_wood_000/001/003 (kenney.nl) | whole |
| hop.wav | Kenney "Impact Sounds" impactSoft_medium_001 | low-passed 5 kHz |
| cloth-1/2.wav, cloth-3.wav | Kenney "RPG Audio" clothBelt, clothBelt2, beltHandle1 | whole |
| loupe-out.wav | Kenney "RPG Audio" handleSmallLeather + metalClick (+260 ms) | mixed |
| loupe-away.wav | Kenney "RPG Audio" dropLeather | whole |
| glint.wav | Kenney "Impact Sounds" impactGlass_light_000 | high-passed 1.5 kHz, -6 dB |
| bubble.wav, pin.wav, tick-hmm.wav | Kenney "Interface Sounds" drop_002, click_002, tick_002 | whole |
| tape.wav | Kenney "RPG Audio" bookFlip2 | whole |
| room-tone.wav | Chambord castle, France 2 — https://bigsoundbank.com/chambord-castle-france-2-s3432.html | 40–130 s, band-limited 140 Hz–5.5 kHz, light early reflections, -26 LUFS |

## v4 (`v4/`, GuideHomecoming, October 2026): public domain / CC0 from Wikimedia Commons, or ours

| File | Source | Cut |
|---|---|---|
| courtyard.wav, courtyard-muffled.wav | "Douzen kids on playground.ogg" (Commons, public domain) | 2–26 s, -20 LUFS; muffled twin low-passed 350 Hz ×2 |
| hurray.wav | "Hurray.ogg" (Commons, public domain) | 0.3–2.9 s |
| bark-1.wav / bark-2.wav | "Dog in Antefasy.wav" (CC0) / "Dog.ogg" (public domain) | 0.85–1.5 s / 1.55–2.2 s |
| heart.wav | "Human heart rate.flac" (Commons, CC0) | 0.3–8.3 s, low-passed 180 Hz, +6 dB at 70 Hz |
| war-rumble.wav | our own: brown noise, three decaying bursts, low-passed 110 Hz, echo | 7 s |
| eisenhower-radio.wav | "Gen. Dwight D. Eisenhower s D-Day order of the day.mp3" (Commons) | 0.6–13.9 s, band-passed 320 Hz–3.2 kHz, compressed, light hiss (old radio) |
| planes.wav | our own: detuned low tones with a propeller beat + brown noise, swelling | 8 s |
| pour.wav | "Pouring wine.ogg" (Commons) | 4.85–8.2 s, -16 LUFS |
| sizzle.wav | "Water vaporizing on hot stones.ogg" (Commons) | 1–4 s |
| sword.wav, coins.wav | Kenney "RPG Audio" drawKnife1, handleCoins | whole |
| wind.wav, wind-muffled.wav | our own: noise in three bands with slow gusts, seamless 24 s loop; muffled twin low-passed 350 Hz ×2 | 24 s |
| nature-cry.wav | our own: low dissonant cluster (49/52/73.5/98.5 Hz, slow vibrato) over rumbling noise, swelling 2.5 s then dying | 5 s |
