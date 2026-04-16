# Documentation Technique

## 1. But du projet

Cette application permet de gérer des tickets internes.

Fonctions actuelles :

- créer un ticket
- modifier un ticket
- supprimer un ticket
- filtrer par statut
- filtrer par priorité
- enregistrer les données dans SQLite

Le projet a été volontairement gardé simple pour un niveau BTS SIO :

- backend en `Node.js + Express`
- base locale en `SQLite` avec `sql.js`
- frontend en `HTML / CSS / JavaScript`
- conteneur desktop avec `Electron`
- pas de framework front

## 2. Vue d'ensemble

Le projet est séparé en trois parties :

1. le conteneur desktop (Electron)
2. le serveur (Express)
3. le client (Navigateur intégré)

Le conteneur desktop :

- lance le serveur au démarrage
- ouvre une fenêtre pour afficher l'application
- ferme le serveur quand la fenêtre est fermée

Le serveur :

- sert les fichiers du site
- expose les routes API
- parle avec la base SQLite

Le client :

- affiche l'interface
- appelle les routes API
- rafraîchit l'écran après chaque action

## 3. Arborescence

```txt
Ticket-Manager/
├── data/
│   └── tickets.db
├── documentation/
│   ├── documentation-technique.md
│   └── documentation-utilisateur.md
├── lib/
│   ├── db.js
│   ├── tickets.js
│   └── values.js
├── public/
│   ├── api.js
│   ├── app.js
│   ├── formView.js
│   ├── view.js
│   └── styles/
│       ├── base.css
│       ├── components.css
│       └── layout.css
├── electron-main.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

## 4. Cycle complet d'une action

Exemple : création d'un ticket.

1. l'utilisateur clique sur `Nouveau ticket`
2. `public/app.js` demande à `public/formView.js` d'ouvrir le formulaire
3. l'utilisateur remplit le formulaire
4. `public/formView.js` récupère les valeurs
5. `public/app.js` appelle `public/api.js`
6. `public/api.js` envoie une requête `POST /api/tickets`
7. `server.js` reçoit la requête
8. `server.js` appelle `api.create(...)` venant de `lib/tickets.js`
9. `lib/tickets.js` valide les données
10. `lib/tickets.js` enregistre dans SQLite via `db.run(...)`
11. `lib/db.js` a déjà préparé la base et la fonction de sauvegarde
12. la réponse JSON revient au front
13. `public/app.js` recharge la liste
14. `public/view.js` reconstruit les cartes HTML

Le même schéma existe pour modifier, supprimer et filtrer.

## 5. Détail de chaque fichier

## 5.1 `electron-main.js`

Rôle :

- processus principal d'Electron
- crée le serveur via `server.js`
- ouvre la fenêtre principale
- gère la fermeture de l'application et du serveur

## 5.2 `server.js`

Rôle :

- point d'entrée du serveur
- configuration Express
- déclaration des routes API
- export de la fonction `createServer` pour Electron

Ce fichier fait :

- calcule le chemin racine du projet
- crée l'application Express
- initialise la base avec `createStore(...)`
- initialise les actions métier avec `createTicketApi(...)`
- active `cors()`
- active `express.json({ limit: '10kb' })`
- bloque l'accès direct à `/data`
- sert les fichiers statiques avec `express.static(root)`
- expose les routes API
- valide les ids dans les routes `/api/tickets/:id`
- ajoute un middleware global d'erreur
- démarre le serveur sur le port `3000` par défaut

Routes disponibles :

- `GET /api/meta`
- `GET /api/tickets`
- `GET /api/tickets/:id`
- `POST /api/tickets`
- `DELETE /api/tickets`
- `PUT /api/tickets/:id`
- `DELETE /api/tickets/:id`

Pourquoi ce fichier est simple :

- il ne contient pas la logique SQL
- il ne contient pas la logique d'affichage
- il joue juste le rôle de pont entre HTTP et la logique métier

Sécurité simple ajoutée :

- limitation de taille JSON pour éviter les requêtes trop lourdes
- refus d'accès direct au fichier `data/tickets.db`
- validation des ids sur les routes avec paramètre
- réponse serveur générique en cas d'erreur

## 5.2 `lib/db.js`

Rôle :

- préparer la base SQLite
- créer la table `tickets`
- fournir une fonction de sauvegarde

Ce fichier contient :

- `schema` : la requête SQL de création de table
- `createStore(file)` : la fonction principale

`createStore(file)` fait :

1. charge `sql.js`
2. crée le dossier `data/` si besoin
3. ouvre la base existante ou crée une base vide
4. définit `save()`
5. applique le schéma SQL
6. sauvegarde la base
7. retourne `{ db, save }`

Pourquoi ce fichier est important :

- toute l'application dépend de lui pour ouvrir la base
- il centralise l'initialisation SQLite

## 5.3 `lib/values.js`

Rôle :

- centraliser les valeurs autorisées

Il contient :

- `values.types`
- `values.priorities`
- `values.statuses`
- `emptyTicket`

Pourquoi ce fichier est utile :

- évite de répéter les mêmes tableaux partout
- le front et le back peuvent se baser sur les mêmes valeurs

## 5.4 `lib/tickets.js`

Rôle :

- contenir la logique métier des tickets

Ce fichier contient plusieurs petits outils :

- `fail(error)` : fabrique une réponse d'erreur
- `ok(data)` : fabrique une réponse de succès
- `text(value)` : nettoie un texte
- `valid(set, value)` : vérifie qu'une valeur existe dans une liste
- `stamp()` : retourne la date actuelle en format ISO

Fonction principale :

- `createTicketApi(store)`

Cette fonction reçoit :

- `store.db`
- `store.save`

Puis elle retourne un objet avec :

- `meta`
- `list(filter)`
- `get(id)`
- `create(body)`
- `update(id, body)`
- `remove(id)`
- `removeAll()`

### `list(filter)`

Rôle :

- lire les tickets
- appliquer les filtres `status` et `priority`

Fonctionnement :

- démarre avec `SELECT * FROM tickets`
- ajoute `WHERE` si un filtre est actif
- trie par `id DESC`
- lit les résultats ligne par ligne

### `get(id)`

Rôle :

- retourner un ticket précis

Si le ticket n'existe pas :

- renvoie `success: false`

### `create(body)`

Rôle :

- créer un ticket

Étapes :

1. valide les données avec `check(body)`
2. construit les dates `created_at` et `updated_at`
3. fait un `INSERT`
4. récupère le dernier id
5. sauvegarde
6. retourne le ticket complet

### `update(id, body)`

Rôle :

- modifier un ticket existant

Étapes :

1. vérifie que le ticket existe
2. valide les nouvelles données
3. fait un `UPDATE`
4. met à jour `updated_at`
5. sauvegarde
6. retourne le ticket modifié

### `remove(id)`

Rôle :

- supprimer un ticket

Étapes :

1. vérifie que le ticket existe
2. fait un `DELETE`
3. sauvegarde
4. retourne `true`

### `removeAll()`

Rôle :

- supprimer tous les tickets

## 5.5 `index.html`

Rôle :

- structure de base de la page

Contient :

- le titre
- le bouton `Nouveau ticket`
- les deux filtres
- la zone de message
- la grille des tickets
- la balise `dialog` pour la fenêtre modale
- les liens vers les fichiers CSS
- le lien vers `public/app.js`

Ce fichier ne contient pas de logique métier.

## 5.6 `public/api.js`

Rôle :

- centraliser les appels HTTP

Fonctions :

- `apiGet(path)`
- `apiSend(path, method, body)`

Pourquoi ce fichier existe :

- éviter d'écrire `fetch(...)` partout
- garder `public/app.js` plus lisible

## 5.7 `public/app.js`

Rôle :

- coordonner le front

Il contient :

- l'état global `state`
- la recherche d'un ticket dans la liste
- le chargement des tickets
- l'enregistrement
- la suppression
- la création de tickets de test via `Faker`
- la suppression complète via la popup `Faker`
- le démarrage initial
- les écouteurs d'événements

### `state`

Il stocke :

- `meta` : listes autorisées reçues du serveur
- `tickets` : liste affichée
- `filters` : filtres actuels

### `start()`

Rôle :

- charger les données de base

Étapes :

1. appelle `/api/meta`
2. remplit `state.meta`
3. remplit `state.filters`
4. affiche les filtres
5. charge les tickets

### événements `click`

Ils gèrent :

- ouverture du formulaire création
- ouverture du formulaire modification
- suppression avec confirmation

### événements `change`

Ils gèrent :

- changement de filtre statut
- changement de filtre priorité
- rechargement de la liste

## 5.8 `public/view.js`

Rôle :

- construire l'affichage principal

Fonctions :

- `byId(id)`
- `escapeHtml(text)`
- `buildOptions(...)`
- `buildSelect(...)`
- `setMessage(text)`
- `renderFilters(meta, filters)`
- `renderTickets(tickets)`
- `buildCard(ticket)`

### `escapeHtml(text)`

Rôle :

- éviter qu'un texte utilisateur casse le HTML

Exemple :

si quelqu'un écrit `<script>` dans un titre, le navigateur ne doit pas l'exécuter.

### `renderTickets(tickets)`

Rôle :

- afficher soit un message vide
- soit la liste des cartes

### `buildCard(ticket)`

Rôle :

- construire une carte ticket en HTML texte

## 5.9 `public/formView.js`

Rôle :

- gérer la fenêtre modale du formulaire

Fonctions :

- `renderForm(ticket, id, meta, onSave)`
- `renderCountForm(onSave)`
- `buildField(label, input)`
- `readForm(form)`
- `buildForm(ticket, meta)`

### `renderForm(...)`

Rôle :

- afficher le formulaire
- brancher le bouton annuler
- brancher la soumission
- utiliser les listes venant de `meta`

### `renderCountForm(...)`

Rôle :

- afficher une petite fenêtre pour demander combien de tickets de test créer
- proposer aussi un bouton pour supprimer tous les tickets

### `readForm(form)`

Rôle :

- transformer le `FormData` en objet JavaScript

Exemple :

```js
{
  title: "Mon ticket",
  description: "Texte",
  type: "Bug",
  priority: "Haute",
  status: "Ouvert"
}
```

## 5.10 `public/styles/base.css`

Rôle :

- style global du site

Contient :

- variables CSS
- style `body`
- marges globales
- taille du conteneur principal
- responsive de base

## 5.11 `public/styles/layout.css`

Rôle :

- mise en page

Contient :

- flexbox des barres
- grille des cartes
- disposition mobile

## 5.12 `public/styles/components.css`

Rôle :

- style des composants visuels

Contient :

- cartes
- badges
- boutons
- modal
- textarea
- couleurs des statuts

## 6. Base de données

Le projet utilise une seule table : `tickets`.

Structure :

```sql
CREATE TABLE IF NOT EXISTS tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL,
  priority TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
)
```

Explication des colonnes :

- `id` : identifiant unique
- `title` : titre du ticket
- `description` : détail du ticket
- `type` : catégorie
- `priority` : niveau de priorité
- `status` : état du ticket
- `created_at` : date de création
- `updated_at` : date de modification

## 7. API actuelle

## `GET /api/meta`

Retourne :

- les types possibles
- les priorités possibles
- les statuts possibles
- les filtres par défaut
- le ticket vide par défaut

## `GET /api/tickets`

Paramètres possibles :

- `status`
- `priority`

Exemple :

```txt
/api/tickets?status=Ouvert&priority=Haute
```

## `GET /api/tickets/:id`

Retourne un ticket précis.

## `POST /api/tickets`

Attend un JSON :

```json
{
  "title": "Titre",
  "description": "Description",
  "type": "Bug",
  "priority": "Haute",
  "status": "Ouvert"
}
```

## `PUT /api/tickets/:id`

Attend le même JSON que `POST`.

## `DELETE /api/tickets/:id`

Supprime un ticket.

## 8. Comment ajouter une nouvelle fonctionnalité

Cette section est la plus importante pour faire évoluer le projet.

Il faut toujours réfléchir en 4 zones :

1. données
2. logique métier
3. API
4. interface

En cas d'oubli d'une zone, la fonctionnalité ne fonctionnera pas partout.

## 8.1 Méthode générale

Pour ajouter une fonction, il convient de se poser ces questions :

1. faut-il une nouvelle donnée en base ?
2. faut-il une nouvelle validation ?
3. faut-il une nouvelle route API ?
4. faut-il afficher quelque chose de nouveau à l'écran ?
5. faut-il modifier le formulaire ?
6. faut-il modifier le CSS ?

## 8.2 Exemple 1 : ajouter un champ `assigned_to`

But :

- stocker le nom de la personne assignée au ticket

### Étape 1 : base de données

Dans `lib/db.js`, il faudrait ajouter la colonne au schéma :

```sql
assigned_to TEXT NOT NULL DEFAULT ''
```

Attention :

- si la base existe déjà, `CREATE TABLE IF NOT EXISTS` ne modifie pas une table existante
- il faudra faire une migration ou recréer la base

Méthode simple en projet scolaire :

1. supprimer `data/tickets.db`
2. redémarrer le projet

Méthode plus propre :

- faire un `ALTER TABLE tickets ADD COLUMN assigned_to TEXT NOT NULL DEFAULT ''`

### Étape 2 : valeurs par défaut

Dans `lib/values.js`, ajouter dans `emptyTicket` :

```js
assigned_to: ''
```

### Étape 3 : validation métier

Dans `lib/tickets.js`, dans `check(body)` :

- lire `body.assigned_to`
- nettoyer la valeur
- vérifier la règle métier si besoin

Exemple :

- limiter à une chaîne simple
- ou autoriser seulement certains noms

### Étape 4 : insertion SQL

Dans `create(body)` :

- ajouter la colonne dans `INSERT`
- ajouter la valeur dans le tableau de paramètres

### Étape 5 : mise à jour SQL

Dans `update(id, body)` :

- ajouter le champ dans `UPDATE`
- ajouter la valeur dans les paramètres

### Étape 6 : affichage carte

Dans `public/view.js`, dans `buildCard(ticket)` :

- afficher `ticket.assigned_to`

### Étape 7 : formulaire

Dans `public/formView.js`, dans `buildForm(ticket, id)` :

- ajouter un champ texte `assigned_to`

### Étape 8 : test

Tester :

- création
- modification
- lecture
- affichage

## 8.3 Exemple 2 : ajouter un filtre par type

But :

- filtrer aussi les tickets par type

### Côté serveur

Dans `lib/tickets.js`, dans `list(filter)` :

- lire `filter.type`
- ajouter la condition SQL

Il faudra aussi ajouter un filtre par défaut dans `meta`.

Exemple :

```js
const all = {
  status: 'Tous',
  priority: 'Toutes',
  type: 'Tous'
}
```

### Côté HTML

Dans `index.html` :

- ajouter un troisième `<select id="typeFilter"></select>`

### Côté affichage

Dans `public/view.js` :

- ajouter le rendu du filtre type

### Côté logique front

Dans `public/app.js` :

- ajouter `type` dans `state.filters`
- écouter `typeFilter`
- recharger les tickets au changement

## 8.4 Exemple 3 : ajouter un bouton "Fermer"

But :

- fermer un ticket en un clic

### Côté interface

Dans `public/view.js`, dans `buildCard(ticket)` :

- ajouter un bouton `Fermer`

### Côté logique front

Dans `public/app.js` :

- détecter le clic sur ce bouton
- envoyer un `PUT`

### Côté données envoyées

Le front doit envoyer :

- le ticket complet
- avec `status: 'Fermé'`

Le backend n'a pas besoin d'une nouvelle route si `PUT /api/tickets/:id` suffit.

## 9. Règles à respecter lors de l'ajout de code

Pour garder le projet propre :

- garder la logique SQL dans `lib/`
- garder les appels HTTP dans `public/api.js`
- garder la coordination dans `public/app.js`
- garder l'affichage principal dans `public/view.js`
- garder le formulaire dans `public/formView.js`
- garder les styles séparés dans `public/styles/`

À éviter :

- mettre du SQL dans `server.js`
- mettre du `fetch(...)` dans tous les fichiers
- dupliquer les listes de valeurs
- mélanger HTML, SQL et logique dans le même fichier

## 10. Procédure propre pour ajouter une fonction

Voici l'ordre conseillé :

1. définir le besoin
2. vérifier s'il faut une nouvelle colonne
3. modifier `lib/values.js` si besoin
4. modifier `lib/tickets.js`
5. modifier `server.js` seulement si une nouvelle route est nécessaire
6. modifier `index.html` si l'écran change
7. modifier `public/view.js` ou `public/formView.js`
8. modifier `public/app.js`
9. modifier le CSS si besoin
10. tester le cycle complet

## 11. Checklist de test après modification

Après chaque évolution, vérifier :

- `npm start` démarre sans erreur
- la page s'ouvre
- la liste s'affiche
- la création marche
- la modification marche
- la suppression marche
- les filtres marchent
- la base garde les données après redémarrage

## 12. Limites actuelles

Limites connues :

- pas d'authentification
- pas de pagination
- pas de recherche texte
- pas de tri personnalisé
- pas de migration automatique SQLite
- pas de tests automatisés
- CORS encore volontairement simple pour un usage local

## 13. Pistes d'amélioration

Améliorations faciles :

- filtre par type
- recherche par mot-clé
- tri par date
- bouton de changement rapide de statut
- affichage de `created_at`

Améliorations plus avancées :

- assignation d'un ticket
- historique des modifications
- export CSV
- authentification
- API séparée du front

## 14. Résumé simple

Lors de l'ajout d'une fonctionnalité :

- prévoir l'impact sur la base de données
- prévoir la validation
- prévoir l'API
- prévoir l'interface
- prévoir les tests

La règle la plus importante :

une nouvelle donnée ou une nouvelle action doit être ajoutée partout où elle est utilisée, sinon le projet sera incohérent.

## 15. Build Desktop

L'application peut être compilée en un exécutable portable pour Windows.

### 15.1 Pré-requis

- `Node.js` installé
- Dépendances installées via `npm install`

### 15.2 Procédure de compilation

Dans le dossier du projet :

```bash
npm run dist
```

Cette commande :

- télécharge les binaires Electron nécessaires si besoin
- compile le code
- génère un fichier `.exe` portable dans le dossier `dist/`

### 15.3 Résultat

Le build génère :

- un fichier `.exe` portable dans `dist/`
- un dossier `win-unpacked/` utilisé par Electron Builder pendant le build
