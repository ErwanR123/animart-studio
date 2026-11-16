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
| 2. Visites du site, par plateforme (et par post, d’après la date) | PostHog (`utm_source`, repères de posts) |
| 3. Inscriptions à la waitlist, par plateforme et par post | PostHog (événement `waitlist_signup`) ; les emails restent dans Supabase `public.waitlist` |

Le chiffre de la semaine : **inscrits par plateforme et par format**. Le reste sert à comprendre pourquoi.

Tout est sur le dashboard PostHog **« Animart · Waitlist »**
(https://eu.posthog.com/project/351733/dashboard/1122659) : inscrits par plateforme et par post, conversion
visite → inscription, visiteurs, clics vers la waitlist, erreurs, messages de contact. Événements envoyés par le
site : `waitlist_signup` (nouvel email), `waitlist_already`, `waitlist_error`, `contact_sent`, `contact_error`, plus
les pages vues et les clics. Alertes par email : une erreur d'inscription, un nouveau message de contact.

## Les outils (choisis le 2026-11-16)

| outil | rôle | pourquoi lui |
|---|---|---|
| **Metricool** (offre gratuite) | programmer les posts et voir les stats des comptes au même endroit | une seule connexion par compte ; Claude lit les stats sur une capture du tableau de bord. L'offre Advanced (~45 €/mois) donne l'API et le MCP : à prendre quand on postera tous les jours sur plusieurs comptes |
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

Un lien court en bio par plateforme, pour savoir d'où viennent les inscrits. Le serveur du site (nginx) le redirige
vers l'accueil avec `?utm_source=<plateforme>&utm_medium=bio` :

| plateforme | lien en bio |
|---|---|
| Instagram | `animartai.com/ig` |
| TikTok | `animartai.com/tt` |
| YouTube | `animartai.com/yt` |

Les liens dans la description d'un Short YouTube ne sont pas cliquables (depuis 2023) : sur les 3 plateformes,
le seul lien est celui du profil. Un post se repère donc à la date : PostHog porte un repère « Post : <id> » à
chaque publication, et les inscrits des 48 h qui suivent lui sont attribués.

Étape suivante possible sur Instagram : « commente SECRET et je t'envoie le lien » (réponse automatique en DM,
avec ManyChat). Les commentaires font monter le post, et chaque lien est propre au post.

## Les comptes

| compte | plateformes | format | cible | appel à l'action |
|---|---|---|---|---|
| Animart (principal) | Instagram, TikTok, YouTube | Détails, Le Guide | ceux qui aiment l'art, les visiteurs de musées | waitlist en bio |
| L'art en 30 jours | TikTok | 30 jours | les jeunes qui veulent apprendre à regarder | abonne-toi, puis waitlist |

À compléter : les noms exacts des comptes, et qui a les accès. Les comptes Instagram et TikTok doivent être en
mode **professionnel** (créateur ou entreprise) pour que Metricool lise leurs stats (connectés le 2026-11-16 : Facebook, Instagram, TikTok, YouTube).

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

1. **Metricool** : fait le 2026-11-16 (offre gratuite, 4 comptes connectés). Si on prend l'offre Advanced, mettre
   `METRICOOL_USER_TOKEN` et `METRICOOL_USER_ID` dans `.env` et ajouter le serveur dans `.mcp.json`.
2. **PostHog** : créer le projet sur eu.posthog.com ; sa clé de projet (publique, `phc_…`) va dans le site.
   Une clé personnelle (préréglage « MCP server ») va dans `.env` **et** dans le shell
   (`export POSTHOG_PERSONAL_API_KEY=…` dans `~/.zshrc`), car `.mcp.json` la lit depuis l'environnement.
3. **Le site** (dépôt `animart_website`) : PostHog sans cookie, l'événement `waitlist_signup` avec la source et la
   campagne, le texte légal à jour.
4. Relancer Claude Code dans ce dépôt et accepter le serveur `posthog` ; `/bilan` l'utilise.
