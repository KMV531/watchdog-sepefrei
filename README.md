# Watchdog Junior - Supervision des services Sepefrei

![Watchdog Junior Preview](./public/thumbnail.png)

Dashboard de supervision permettant de surveiller en temps réel la disponibilité des sites web de la Junior-Entreprise Sepefrei.

## Technologies utilisées

- **Next.js (App Router)** - Framework full-stack (front + API)
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles rapides et cohérents
- **JSON file storage** - Stockage léger sans base de données

## Installation et lancement

1. **Cloner le repository:**

   ```bash
   git clone https://github.com/KMV531/watchdog-junior.git

   ```

2. **changer de répertoire:**

   ```bash
   cd watchdog-junior

   ```

3. **Installer les dépendances:**

   ```bash
   npm install

   ```

4. **Exécuter le serveur de développement:**
   ```bash
   npm run dev
   ```

Ouvrir [http://localhost:3000](http://localhost:3000/) pour voir l'application.

## Fonctionnalités réalisées

### Core demandé

- Liste des sites surveillés avec statut UP/DOWN
- Ajout d'un nouveau site (nom + URL)
- Suppression d'un site avec confirmation
- Mise à jour automatique des statuts en temps réel (polling)
- Affichage du temps de réponse et du code HTTP

### Fonctionnalités supplémentaires

- Dashboard avec cartes de statistiques (uptime global)
- Graphique de disponibilité
- Modal de confirmation avant suppression
- Notifications toast pour les actions (ajout, suppression)
- Filtre de recherche dans le tableau
- Alerte visuelle pour les services hors-ligne

## Choix techniques

- **Next.js App Router** : Maîtrise personnelle, simplicité d'organisation, front et API dans un seul projet
- **Stockage JSON** : Solution légère, pas besoin de base de données complexe pour ce scope
- **Polling (useEffect + setInterval)** : Mise à jour temps réel simple et efficace

## Structure du projet

![Structure du projet Preview](./public/structure-preview.png)

## Notes

- Le projet n'est pas déployé en ligne (non demandé)
- L'accent a été mis sur la propreté du code et l'expérience utilisateur

## Auteur

\[Vinny Brayan\] - Étudiant - B1 - EFREI Bordeaux

- GitHub : \[[Mon GitHub](https://github.com/KMV531/)\]
