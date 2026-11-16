# Stratégie de contenu et de distribution

La référence au-dessus de tout reste `../Animart/docs/STRATEGIE.md` (§5 Distribution, §6 Canaux, §7 Comptes). Ce
dossier en est l'exécution : ce qu'on poste, comment, et comment on mesure.

## Le but

**Des inscrits à la waitlist** (puis des installs quand l'app sort), pas des vues. Une vidéo qui fait 50 000 vues
et zéro inscrit est un échec ; on garde ce qui amène des gens sur animartai.com.

## Le funnel et ce qu'on mesure

| étape | où on le lit |
|---|---|
| 1. Vues, rétention, partages, enregistrements, abonnés gagnés | Metricool (Instagram, TikTok, YouTube réunis) |
| 2. Visites du site, par plateforme et par post | PostHog (`utm_source`, `utm_campaign`) |
| 3. Inscriptions à la waitlist, par plateforme et par post | PostHog (événement `waitlist_signup`) ; les emails restent dans Supabase `public.waitlist` |

Le chiffre de la semaine : **inscrits par plateforme et par format**. Le reste sert à comprendre pourquoi.

## Les outils (choisis le 2026-11-16)

| outil | rôle | pourquoi lui |
|---|---|---|
| **Metricool** | programmer les posts et lire les stats des 3 plateformes au même endroit | une seule connexion par compte au lieu de trois API (Meta, TikTok, Google) à faire valider ; a un serveur MCP officiel, donc Claude lit les stats directement |
| **PostHog** (cloud UE) | les visites du site et les inscriptions, par source | gratuit à notre échelle, un serveur MCP officiel ; servira aussi pour l'app à sa sortie |
| **Supabase** `public.waitlist` | la liste des emails (existe déjà) | rien à changer |
| **iCloud Drive** `Animart à poster/` | l'export y dépose la vidéo et son texte, on les retrouve sur le téléphone | zéro AirDrop, zéro envoi |

PostHog tourne **sans cookie** (`cookieless_mode: "always"`) : pas de bandeau de consentement, donc pas
d'inscrits perdus sur un bandeau. Le texte légal du site dit qu'on mesure l'audience sans cookie.

## Publier

- **Reels et TikTok : depuis le téléphone, avec le son tendance.** Aucune API ne permet de choisir un son
  tendance, et c'est un levier de portée. Le fichier et le texte sont déjà dans iCloud : 1 minute par post.
- **YouTube Shorts et carrousels : programmés dans Metricool** (pas de son tendance à ajouter).
- Une vidéo part sur les 3 plateformes le même jour.

## Les liens

Un lien en bio par plateforme, pour savoir d'où viennent les inscrits :

| plateforme | lien en bio |
|---|---|
| Instagram | `https://animartai.com/?utm_source=instagram&utm_medium=bio` |
| TikTok | `https://animartai.com/?utm_source=tiktok&utm_medium=bio` |
| YouTube | `https://animartai.com/?utm_source=youtube&utm_medium=bio` |

Là où un post peut porter son propre lien (description YouTube, story Instagram avec sticker lien), on ajoute
`&utm_campaign=<id du post>` (ex. `details-sacre`) : on sait alors quel post a amené quel inscrit. L'export le
met dans le texte du post.

Étape suivante possible sur Instagram : « commente SECRET et je t'envoie le lien » (réponse automatique en DM,
avec ManyChat). Les commentaires font monter le post, et chaque lien est propre au post.

## Les comptes

| compte | plateformes | format | cible | appel à l'action |
|---|---|---|---|---|
| Animart (principal) | Instagram, TikTok, YouTube | Détails, Le Guide | ceux qui aiment l'art, les visiteurs de musées | waitlist en bio |
| L'art en 30 jours | TikTok | 30 jours | les jeunes qui veulent apprendre à regarder | abonne-toi, puis waitlist |

À compléter : les noms exacts des comptes, et qui a les accès. Les comptes Instagram et TikTok doivent être en
mode **professionnel** (créateur ou entreprise) pour que Metricool lise leurs stats.

## Règles des posts

- **Légende** : la promesse de la vidéo (« 4 détails du Sacre de Napoléon que presque personne ne remarque au
  Louvre 👀 »), puis l'œuvre (titre · artiste · date), puis « Lien de la waitlist en bio 🔗 », puis exactement
  **5 hashtags** (musée, sujet, artiste, `art`, ville).
- **YouTube** : un titre court, la même description avec le lien direct, une dizaine de tags.
- **Couverture** : la première image (le tableau entier et l'accroche).
- Tout texte écrit par l'IA est relu par l'un de nous avant de partir.

## Le rythme

- Chaque post est noté dans [journal.md](journal.md) le jour où il part.
- Chaque lundi, `/bilan` remplit les chiffres à 48 h et à 7 jours, et propose les 5 posts de la semaine.
- Un format qui n'amène aucun inscrit en 5 posts est arrêté ; celui qui en amène le plus prend sa place.

## Brancher les outils (une fois, par la personne qui a les accès)

1. **Metricool** : créer le compte de l'équipe, y connecter Instagram, TikTok et YouTube (comptes pro). L'API et
   le MCP demandent l'offre qui inclut l'API. Mettre `METRICOOL_USER_TOKEN` et `METRICOOL_USER_ID` dans `.env`.
2. **PostHog** : créer le projet sur eu.posthog.com ; sa clé de projet (publique, `phc_…`) va dans le site.
   Une clé personnelle (préréglage « MCP server ») va dans `.env` **et** dans le shell
   (`export POSTHOG_PERSONAL_API_KEY=…` dans `~/.zshrc`), car `.mcp.json` la lit depuis l'environnement.
3. **Le site** (dépôt `animart_website`) : PostHog sans cookie, l'événement `waitlist_signup` avec la source et la
   campagne, le texte légal à jour.
4. Relancer Claude Code dans ce dépôt et accepter les serveurs `metricool` et `posthog` ; `/bilan` les utilise.
