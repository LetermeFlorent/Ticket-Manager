# Ticket Manager

Application desktop simple de gestion de tickets internes.

## Objectif

Cette application permet de :

- créer des tickets
- consulter les tickets
- modifier les tickets
- supprimer les tickets
- filtrer par statut
- filtrer par priorité
- générer des tickets de test avec `Faker`
- supprimer tous les tickets depuis la popup `Faker`

## Lancer le projet

Prérequis :

- Node.js installé
- npm disponible

Installation :

```bash
npm install
```

Lancement en mode desktop :

```bash
npm start
```

## Générer le fichier portable

```bash
npm run dist
```

Le fichier `.exe` portable est généré dans le dossier `dist/`.

## Technologies utilisées

- Electron
- Node.js
- Express
- SQLite avec `sql.js`
- HTML
- CSS
- JavaScript

## Architecture

- `electron-main.js`
  processus principal Electron
- `server.js`
  serveur Express et routes API
- `lib/`
  logique métier et base SQLite
- `public/`
  interface utilisateur
- `documentation/`
  documentation technique et utilisateur

## Frameworks et outils

### Antigravity

Antigravity a été utilisé comme aide de travail et d'organisation pendant le projet.

### Codex

Codex a été utilisé comme assistant de développement pour accélérer l'implémentation, le nettoyage du code, la documentation et le build.

## Scripts npm

- `npm start`
  lance l'application desktop
- `npm run dev`
  lance le serveur en mode watch
- `npm run dist`
  génère un build Windows portable

## Données

Les tickets sont stockés localement dans SQLite.

Fichier utilisé :

```txt
data/tickets.db
```

## Documentation

- `documentation/documentation-technique.md`
- `documentation/documentation-utilisateur.md`
