# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Ce projet respecte le [Versionning Sémantique](https://semver.org/lang/fr/).

## [1.1.0] - 2026-03-29

### Modifié
- Cycle de statut mis à jour : À faire → En cours → Terminé
- Boutons de changement de statut ajoutés sur les tickets

## [1.0.0] - 2026-03-29

### Ajouté
- Initialisation du projet Ticket Manager
- Architecture MVC avec Electron + React + SQLite
- Gestion complète des tickets (création, modification, suppression)
- Filtrage par statut (Ouvert / En cours / Fermé) et priorité (Haute / Moyenne / Basse)
- Vue liste et vue Kanban
- Persistance locale via sql.js (SQLite embarqué)
- IPC sécurisé via contextBridge (sans nodeIntegration)
- Validation des données côté service
- Interface utilisateur avec CSS Modules

[1.0.0]: https://github.com/LetermeFlorent/Ticket-Manager/releases/tag/v1.0.0
