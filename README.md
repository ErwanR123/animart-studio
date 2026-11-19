# Animart Studio

Le hub marketing d'Animart. Tout ce qui amène des gens vers l'app est ici : les formats de vidéos et le moteur qui
les fabrique, la stratégie, les textes des posts, et les stats qui disent ce qui marche. L'app elle-même est dans
un autre repo (`Animart`).

**Le but : des inscrits à la waitlist** (puis des téléchargements à la sortie), pas des vues.

Les vidéos sont faites avec [Remotion](https://www.remotion.dev) (des vidéos écrites en React) et **Claude Code**
fait presque tout le travail : ouvre ce dossier dans Claude Code, il lit `CLAUDE.md` et les skills tout seul.

## Les contenus

Chaque format montre une partie de l'app.

| format | ce qu'il montre de l'app | quoi | rythme | état | comment en faire un |
|---|---|---|---|---|---|
| **Détails** | **le Guide** (scanner un tableau au musée, l'app raconte ses secrets) | un tableau, 4 détails cachés, la pub de l'app à la fin | 2 à 3 par semaine | ✅ en place | `/details` · [README](src/formats/details/README.md) |
| **L'Agenda** | **Explorer** (les expos qui arrivent, ce qui ferme bientôt) | les expos à voir ce week-end à Paris, en voix off | 1 à 2 par semaine, le jeudi soir | ✅ en place (1er le 20 nov.) | `/agenda` · [README](src/formats/agenda/README.md) |
| **Sorties entre amis** | **le Profil et les amis** (sortir au musée en groupe, voir ce que les potes ont aimé) | à inventer | — | 💡 à inventer | [strategie/README.md](strategie/README.md#les-formats) |
| Le Guide (Lorenzo) | — | la mascotte raconte l'histoire d'un tableau, collages style Vox | — | 📦 en réserve : on n'en fait plus pour l'instant, mais on garde le moteur | `/episode` · [bible/](bible/README.md) |
| 30 jours pour apprendre l'art | — | une notion par jour | — | ⏸ en pause (on réfléchit au format) | [IDEAS.md](IDEAS.md) |

Les règles communes à toutes les vidéos (accroche, rétention, appel à l'action) sont dans
[bible/viral.md](bible/viral.md) : à lire avant d'écrire un script.

## Installer (une fois par ordi)

Pour macOS avec [Homebrew](https://brew.sh) (Linux : ton gestionnaire de paquets ; Windows : WSL). Claude peut faire
cette section de haut en bas : chaque étape finit par une vérification.

1. **Les outils** : `brew install git ffmpeg uv nvm` (vérifier : `ffmpeg -version`, `uv --version`).
2. **Node 22** : `source "$(brew --prefix nvm)/nvm.sh" && nvm install && nvm use` (vérifier : `node -v` → v22).
3. **Les paquets** : `npm ci --loglevel=error && npx remotion browser ensure` (vérifier : `npm run lint` sans erreur).
4. **Python** : rien à installer, `uv run` récupère ce qu'il faut au premier lancement
   (vérifier : `uv run scripts/episode-review.py --help`).
5. **Les clés** : `cp .env.example .env`, puis remplir. **Demande les valeurs à Erwan en direct, jamais dans un chat
   ou un commit.** `.env` n'est jamais commité ni affiché.
   - `GOOGLE_API_KEY` : la voix de L'Agenda (Gemini, ~0,03 $ la prise). Les Détails n'en ont pas besoin.
   - `POSTHOG_PERSONAL_API_KEY` : lire les stats et mettre à jour les dashboards.
6. **Vérifier** : `npm run dev` ouvre Remotion Studio dans le navigateur ; lance `DetailsTricheur` et `Agenda1120`.

## Faire une vidéo

Dans Claude Code : `/details` ou `/agenda`. Claude propose le sujet et les textes, **tu les relis** (tout ce
qu'écrit l'IA est relu par un humain avant d'être posté), puis il fabrique la vidéo et l'exporte dans
`~/Desktop/marketing_animart/` avec le texte du post (`<video>.post.md`).

À la main :

```bash
npm run dev                                   # Remotion Studio : toutes les vidéos
npx remotion still DetailsTricheur out/s.png --frame=300 --scale=0.5   # une image
bash scripts/details-export.sh DetailsTricheur   # une vidéo Détails prête à poster
bash scripts/agenda-export.sh Agenda1120         # une vidéo Agenda prête à poster
```

## Poster

Tout est dans [strategie/README.md](strategie/README.md) (« Publier », « Les liens », « Règles des posts »). En bref :

1. Reels et TikTok **depuis le téléphone**, avec un son tendance (les Détails n'ont que de petits bruitages : garde le son original et mets la musique par-dessus) ; YouTube
   Shorts le même jour. Le texte de chaque plateforme est dans le `.post.md`.
2. **Juste après**, ajoute la vidéo dans [strategie/videos.json](strategie/videos.json) (id Instagram, id YouTube,
   durée, format), puis `node --env-file=.env scripts/posthog-videos.mjs`. Sans ça, la vidéo n'apparaît pas dans les
   stats. Claude retrouve les ids tout seul si tu lui dis « c'est posté ».
3. Commit + push, pour que les autres voient ce qui est sorti.

## Les stats

Sur PostHog (demande l'accès à Erwan) :

- **[Progression jour par jour](https://eu.posthog.com/project/351733/dashboard/1124859)** : chaque jour en une
  ligne, abonnés, ce que chaque post a gagné, formats comparés, qualité de chaque vidéo, vie de chaque post.
- **[Réseaux](https://eu.posthog.com/project/351733/dashboard/1122748)** : chaque vidéo et ses vues par plateforme.
- **[Waitlist](https://eu.posthog.com/project/351733/dashboard/1122659)** : visiteurs du site → inscrits, par source.

Le relevé horaire des stats (`scripts/stats-snapshot.mjs`) tourne **sur un seul Mac** (celui d'Erwan, via
`bash scripts/stats-launchd.sh`) : ne l'installe pas chez toi, ça compterait double. TikTok n'a pas d'API : on dépose
ses exports CSV dans `~/Desktop/marketing_animart/stats/` puis `node scripts/stats-import.mjs`. Chaque lundi,
`/bilan` fait le point dans [strategie/journal.md](strategie/journal.md).

## Travailler à plusieurs

- `git pull` avant de commencer, commit + push quand une vidéo est finie. Petits commits, un par vidéo.
- **Ne commite jamais** `.env`, ni les rendus (`out/`, ignoré), ni le cache des voix payées (`cache/`, ignoré : copie
  celui d'Erwan si tu veux réutiliser ses prises sans repayer).
- Une vidéo = ses fichiers dans son format (`src/formats/<format>/reels/`) et ses images dans `public/art/<sujet>/`.
- Une nouvelle règle apprise (« ça, les gens n'aiment pas ») va dans le README du format, pour que tout le monde (et
  Claude) la suive.

## Où est quoi

| chemin | quoi |
|---|---|
| [CLAUDE.md](CLAUDE.md) | les règles que Claude suit dans ce repo (à lire aussi) |
| [strategie/](strategie/README.md) | le but, les comptes, comment poster, les liens, la mesure ; `journal.md` (chaque post et ce qu'on en a appris), `todo.md` (ce qu'il reste à mettre en place), `videos.json`, `posthog/` (les requêtes des dashboards) |
| `src/formats/details/`, `src/formats/agenda/` | les deux formats en cours : moteur, vidéos, README |
| `src/guide/`, `src/episodes/`, [bible/](bible/README.md) | Le Guide (en réserve) : moteur Vox, épisodes, règles ; `examples/` les meilleurs |
| `src/keys/`, `src/lesson/` | 30 jours (en pause) |
| `public/` | ce que les vidéos chargent : `art/`, `voice/`, `music/`, `sfx/`, `guide/` |
| `scripts/` | `details-export`, `agenda-export`, `voice-*` (voix Gemini), `image-*` (trouver et cadrer les images), `stats-*` et `posthog-*` (les stats), `episode-*` (Le Guide) |
| `.claude/skills/` | `/details`, `/agenda`, `/contenu` (que faire ensuite), `/bilan` (le point de la semaine), `/video-review`, `/episode` |
| [IDEAS.md](IDEAS.md) | les idées de vidéos |
| `library/`, `docs/brand/` | matière brute et identité de la mascotte (Le Guide) |

Pas dans git : `out/` (rendus), `cache/` (prises de voix payées), `refs/` (`bash scripts/refs.sh`).

Remotion demande une licence entreprise au-delà d'une certaine taille :
https://github.com/remotion-dev/remotion/blob/main/LICENSE.md
