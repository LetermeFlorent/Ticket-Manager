# Ticket Manager

Application desktop de gestion de tickets internes (tâches, bugs, demandes).

## Stack technique

| Composant | Technologie |
|-----------|-------------|
| Framework desktop | Electron |
| Frontend | React |
| Base de données | SQLite (sql.js) |
| Bundler | electron-vite |
| Architecture | MVC |

## Prérequis

- Node.js 18+
- npm 9+

## Installation

```bash
npm install
```

## Lancement en développement

```bash
npm run dev
```

## Build production

```bash
npm run build
```

L'exécutable se trouve dans `dist/`.

## Fonctionnalités

- ✅ Créer, consulter, modifier, supprimer des tickets
- ✅ Filtrer par statut (Ouvert / En cours / Fermé) et priorité (Haute / Moyenne / Basse)
- ✅ Vue liste et vue Kanban
- ✅ Persistance locale via SQLite (pas de serveur requis)
- ✅ Architecture MVC claire (main process)
- ✅ IPC sécurisé via contextBridge (pas de nodeIntegration)
- ✅ Validation des données côté service

## Structure du projet

```
Ticket-Manager/
├── src/
│   ├── main/                  # Process principal Electron
│   │   ├── index.js           # Point d'entrée Electron
│   │   ├── database.js        # Init SQLite
│   │   ├── models/            # Accès données
│   │   ├── services/          # Logique métier
│   │   ├── controllers/       # Orchestration IPC
│   │   └── utils/             # Constantes, validation
│   ├── preload/
│   │   └── index.js           # Bridge IPC sécurisé
│   └── renderer/              # Application React
│       └── src/
│           ├── App.jsx
│           └── views/         # Composants UI
├── CHANGELOG.md
├── electron.vite.config.js
└── package.json
```

## Versionning

Ce projet suit [Semantic Versioning](https://semver.org/lang/fr/).  
Voir [CHANGELOG.md](./CHANGELOG.md) pour l'historique des versions.
