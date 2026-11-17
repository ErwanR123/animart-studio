# À faire : distribution et réseaux

La liste de tout ce qu'il reste à mettre en place. On coche quand c'est fait ; une tâche finie qui change une règle
va dans `strategie/README.md`. Liste ouverte le 2026-11-17.

## 0. La stratégie (à réfléchir ensemble, en priorité)

Le but : devenir vraiment forts en marketing et en distribution. Une séance de travail dédiée, puis un document
`strategie/plan.md` qui répond à :

- [ ] **Le message** : ce qu'Animart promet en une phrase, pour qui, et pourquoi nous plutôt qu'un audioguide ou
      Smartify ; les 3 ou 4 angles qu'on répète partout (les secrets des tableaux, la chasse au musée, entre amis…).
- [ ] **Les piliers de contenu** : quels types de posts, pour quoi faire (faire découvrir, faire s'abonner, faire
      s'inscrire), dans quelle proportion.
- [ ] **Les nouveaux concepts** : partir de ce qui marche déjà sur TikTok et Instagram (formats, sons, tendances)
      et l'adapter à l'art ; en tester plusieurs vite et pas cher, garder ceux qui amènent des inscrits.
- [ ] **Les comptes** : un compte principal ou plusieurs comptes thématiques (STRATEGIE.md §7), qui pour qui.
- [ ] **Le plan de lancement de l'app** : comment la waitlist devient des téléchargements le jour J (compte à
      rebours, bêta-testeurs, emails, créateurs, presse, Nuit des musées…).
- [ ] **Les canaux au-delà de nos comptes** : créateurs, presse, communautés, partenaires (STRATEGIE.md §6), et
      lesquels on attaque d'abord.
- [ ] **La veille** : ce que font les comptes art qui marchent et nos concurrents, chaque semaine.
- [ ] **La boucle** : chaque lundi, `/bilan` dit ce qui a marché ; chaque mois, on ajuste le plan.

## 1. Mettre en ligne la mesure (en cours)

- [x] **Amine** déploie `gallery-wall` (en ligne le 2026-11-17 : `/ig` redirige, PostHog reçoit les visites) : les 3 lignes `location ~* ^/(ig|tt|yt)/?$` dans le nginx du site, le nouveau
      `security-headers.conf`, `nginx -t && reload`, `deploy/deploy.sh`.
- [ ] Tester : `animartai.com/ig` arrive sur l'accueil ; une inscription test (`?utm_source=test`) apparaît dans
      PostHog → Activity ; un message test depuis /contact arrive dans Supabase → `contact_messages`.
- [ ] Mettre les liens courts en bio : Instagram `animartai.com/ig`, TikTok `animartai.com/tt`, YouTube
      `animartai.com/yt` (titre « Waitlist de l'app 🎨 »).
- [ ] Brancher la table `waitlist` de Supabase dans PostHog (SQL prêt : vue `analytics.waitlist_signups` sans les
      emails, rôle `posthog_reader`), pour recouper les inscrits.
- [ ] Le dashboard PostHog par email chaque lundi (Erwan, Moh, Amine).
- [ ] Pousser le studio sur GitHub (tout est commité en local).

## 2. Des comptes propres (pour qui arrive sur le profil)

- [ ] **Bios** des 4 comptes (Instagram, TikTok, YouTube, Facebook) : ce qu'est Animart en une ligne, ce qu'on
      poste, « L'app arrive bientôt · rejoins la waitlist 👇 » au-dessus du lien.
- [ ] **Bannières** YouTube et Facebook, et photos de profil identiques partout (le même logo).
- [ ] **Stories à la une** Instagram : le concept (scanner un tableau, son histoire), comment ça marche, les musées,
      le pricing, la FAQ, la waitlist. Avec des couvertures dans la charte.
- [ ] **3 posts épinglés** sur Instagram, pensés ensemble pour faire une ligne propre en haut de la grille (par ex.
      l'app en 15 s, le meilleur Reel, la waitlist). Pareil sur TikTok (3 épinglés).
- [ ] YouTube : la section « À la une » de la chaîne (une vidéo de présentation), une playlist par format.
- [ ] Une **couverture** soignée pour chaque Reel (la grille Instagram doit rester belle).
- [ ] Les noms des comptes : aujourd'hui `animart.app` (Instagram), `animart.museum.app` (TikTok), `@animart.museum`
      (YouTube). Choisir un seul nom si possible (décision à prendre : changer un nom casse les anciens liens).
- [ ] Instagram : partager chaque Reel sur Facebook automatiquement (Paramètres → Partage).

## 3. Les formats

- [ ] Faire le ménage : garder les formats qui marchent (d'après le dashboard « Vues par vidéo »), archiver le reste.
- [ ] Un système pour créer un format facilement : une base commune (écrans de l'app, polices, zones sûres, texte
      bas, export avec piste muette, légende identique partout, ajout à `videos.json`) et un modèle de dossier
      `src/formats/<nom>/` avec son README, son skill et son export, comme `details`.
- [ ] Les formats pour présenter l'app (stories à la une, posts épinglés) : faits depuis les vrais écrans de l'app.

## 4. Le rythme

- [ ] Un calendrier de posts : combien par semaine, quel format quel jour (`/contenu` propose la semaine).
- [ ] Répondre aux commentaires et aux DM chaque jour (Meta Business Suite pour Instagram et Facebook).
- [ ] `/bilan` chaque lundi : chiffres, vues TikTok depuis Metricool, ce qui marche, les posts de la semaine.

## 5. Plus tard

- [ ] Les inscrits à la waitlist ne reçoivent rien aujourd'hui : un email de bienvenue, puis des nouvelles de temps
      en temps, pour qu'ils soient encore là à la sortie de l'app.
- [ ] Instagram : « commente SECRET et je t'envoie le lien » (réponse automatique en DM) pour faire des
      commentaires et des clics.
- [ ] TikTok dans PostHog (script de l'API TikTok) quand le compte décolle ; Facebook quand PostHog ouvre la source.
- [ ] Collaborations avec des comptes art et sorties à Paris (STRATEGIE.md §6).
- [ ] Revoir les dashboards après 2 à 3 semaines de données.
