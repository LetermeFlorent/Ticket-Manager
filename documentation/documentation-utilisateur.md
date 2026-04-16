# Documentation Utilisateur

## 1. Présentation

Ticket Manager est une petite application desktop pour gérer des tickets internes.

Elle permet de :

- créer un ticket
- modifier un ticket
- supprimer un ticket
- filtrer les tickets

## 2. Lancer l'application

Dans le dossier du projet :

```bash
npm install
npm start
```

## 3. Écran principal

L'écran principal contient :

- un filtre par statut
- un filtre par priorité
- un bouton `Faker`
- un bouton `Nouveau ticket`
- la liste des tickets

Chaque ticket est affiché dans une carte.

## 4. Créer un ticket

1. cliquer sur `Nouveau ticket`
2. remplir les champs du formulaire
3. cliquer sur `Enregistrer`

Champs disponibles :

- `Titre`
- `Description`
- `Type`
- `Priorité`
- `Statut`

Le titre est obligatoire.

## 5. Modifier un ticket

1. trouver le ticket dans la liste
2. cliquer sur `Modifier`
3. changer les informations
4. cliquer sur `Enregistrer`

La carte du ticket sera mise à jour.

## 6. Supprimer un ticket

1. trouver le ticket dans la liste
2. cliquer sur `Supprimer`
3. confirmer la suppression

Le ticket disparaît de la liste.

## 7. Filtrer les tickets

Deux filtres sont disponibles :

- statut
- priorité

Exemples :

- afficher seulement les tickets `Ouvert`
- afficher seulement les tickets `Haute`
- afficher seulement les tickets `Ouvert` et `Haute`

Pour revenir à la liste complète :

- remettre `Tous`
- remettre `Toutes`

## 8. Ajouter des tickets de test

Le bouton `Faker` permet d'ajouter rapidement plusieurs tickets.

Étapes :

1. cliquer sur `Faker`
2. saisir le nombre de tickets à créer
3. cliquer sur `Ajouter`

La même fenêtre permet aussi :

- de supprimer tous les tickets avec `Tout supprimer`

## 9. Valeurs possibles

### Type

- `Bug`
- `Feature`
- `Amélioration`

### Priorité

- `Basse`
- `Moyenne`
- `Haute`

### Statut

- `Ouvert`
- `En cours`
- `Fermé`

## 10. Messages possibles

L'application peut afficher des messages si une action échoue.

Exemples :

- `Titre requis`
- `Type invalide`
- `Priorité invalide`
- `Statut invalide`
- `Ticket introuvable.`

## 11. Où sont enregistrées les données

Les données sont stockées dans le fichier :

```txt
data/tickets.db
```

Cela veut dire :

- les tickets restent après fermeture de l'application
- les tickets restent après redémarrage de l'application

## 12. Conseils d'utilisation

- donner un titre clair au ticket
- utiliser la priorité correctement
- fermer les tickets terminés
- utiliser les filtres pour retrouver plus vite les tickets

## 13. En cas de problème

Si l'application ne s'ouvre pas :

1. vérifier que `npm install` a été lancé
2. vérifier que `npm start` tourne bien
3. relancer l'application

Si un ticket ne s'enregistre pas :

1. vérifier que le titre est rempli
2. vérifier que les valeurs choisies sont valides
3. regarder le message affiché dans l'application

## 14. Résumé

Pour utiliser l'application :

1. lancer l'application
2. utiliser la fenêtre desktop
3. créer, modifier, supprimer et filtrer les tickets
