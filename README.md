# Feuille de personnage Gab — multimédia

Une fiche de personnage RPG pour suivre ses compétences, projets et badges au fil du programme.

Chaque étudiant·e possède **son propre fork** de ce dépôt et **son propre site GitHub Pages**. Il n'y a pas de base de
données partagée : toutes les données vivent dans un seul fichier, `src/data/me.json`, versionné avec le code.

## Pour les étudiant·es

### 1. Forker et publier son site

1. Cliquez sur **Fork** en haut de ce dépôt (GitHub).
2. Dans votre fork, allez dans **Settings → Pages** et activez GitHub Pages sur la branche `main` (via GitHub Actions,
   déjà configuré dans `.github/workflows/deploy.yml`).
3. Si vous renommez le dépôt, mettez à jour `base` dans [vite.config.js](vite.config.js) pour qu'il corresponde au nom
   exact de votre fork (ex : `base: '/mon-fork/'`).
4. Après le premier push, votre site est disponible à `https://<votre-nom-utilisateur>.github.io/<nom-du-repo>/`.

### 2. Remplir sa fiche

1. Clonez votre fork et lancez l'app en local :
   ```bash
   npm install
   npm run dev
   ```
2. Ouvrez le site, cliquez sur **Modifier ma fiche** pour activer le mode édition, et remplissez votre profil, vos
   projets, vos savoir-être et vos infos GitHub (nom d'utilisateur + nom du dépôt).
3. Les changements ne sont visibles que dans votre navigateur tant qu'ils ne sont pas exportés.
4. Cliquez sur **Exporter mes données (me.json)**.
   - En local (`npm run dev`), le serveur de développement écrit directement le fichier
     `src/data/me.json` sur votre disque — pas besoin de le déplacer manuellement.
   - Si vous cliquez sur ce bouton sur le site déjà publié (production), un fichier `me.json` est
     téléchargé à la place ; remplacez alors `src/data/me.json` par ce fichier.
5. Committez et poussez :
   ```bash
   git add src/data/me.json
   git commit -m "Mise à jour de ma fiche"
   git push
   ```
6. GitHub Actions redéploie automatiquement votre site avec les nouvelles données.

### 3. Appuis entre pairs (endorsements)

Sur la fiche d'un·e camarade, le bouton **« Signaler un appui »** ouvre une issue GitHub pré-remplie sur son fork,
référençant le projet concerné. Une fois la discussion conclue, c'est à la personne propriétaire du fork d'ajouter
l'entrée d'appui (alias du pair + lien vers l'issue) via le formulaire disponible dans le détail du projet en mode
édition, puis d'exporter et de committer comme ci-dessus.

### 4. Badges attribués par le prof ou le comité étudiant

Le fonctionnement est le même que pour les appuis entre pairs :

1. Dans **Modifier ma fiche**, cliquez sur un badge verrouillé. Le bouton **« Demander ce badge (GitHub) »** ouvre une
   issue GitHub pré-remplie sur votre propre fork, à l'attention du prof ou du comité.
2. Le prof (ou un membre du comité) voit l'issue apparaître dans l'onglet *Issues* de votre dépôt et discute avec
   vous pour confirmer l'obtention du badge.
3. Une fois convaincu, retournez sur votre fiche en mode édition, réouvrez ce badge et remplissez le petit formulaire
   « Accordé par » (nom de la personne) + lien vers l'issue comme preuve, puis cliquez **Confirmer le badge**.
4. Cliquez **Exporter mes données**, puis committez et poussez `me.json` comme d'habitude.

## Pour le prof : vue d'ensemble de la classe

L'onglet **Vue de classe** agrège en lecture seule tous les forks publics du dépôt gabarit via l'API GitHub (liste des
forks + lecture du `me.json` de chacun). Aucune authentification n'est requise pour des forks publics ; un jeton
GitHub personnel (lecture seule) peut être collé dans le champ prévu si la classe dépasse la limite de requêtes
anonymes (60/heure).

Configurez le dépôt gabarit dans [src/data/config.json](src/data/config.json) :

```json
"github": {
  "templateOwner": "nom-utilisateur-du-prof",
  "templateRepo": "character-sheet-v2"
}
```

## Développement

```bash
npm install
npm run dev      # serveur de développement
npm run build    # build de production
npm run lint     # oxlint
```

Pas de variables d'environnement requises : tout est statique.
