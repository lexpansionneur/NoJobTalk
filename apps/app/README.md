# NoJobTalk — application

L'application principale (distincte de `apps/web`, la landing page de
validation). React + TypeScript + Vite + Tailwind + React Router.

## État actuel : données factices

Cette version tourne **entièrement côté navigateur, sans backend** :

- Les profils, tables (rencontres), messages et liens utiles de départ
  viennent de `src/data/seed.ts` (données fictives mais réalistes).
- Toutes les actions (rejoindre une table, en créer une, poster un
  message, modifier son profil) passent par `src/store/AppStore.tsx`,
  un simple state React persisté dans le `localStorage` du navigateur.
- Rien n'est partagé entre utilisateurs : chacun a sa propre copie
  locale. C'est volontaire à ce stade — l'objectif est de valider
  l'expérience avant de brancher un vrai backend partagé.

## Pages

| Route | Contenu |
|---|---|
| `/` | Accueil — résumé (prochaine table, tip du moment) |
| `/carte` | Carte interactive (Leaflet + OpenStreetMap, sans clé API) |
| `/tables` | Liste des tables, filtre par ville, création, inscription |
| `/discussion` | Fil de discussion par table |
| `/liens` | Ressources carrière, groupées par catégorie |
| `/profil` | Profil (prénom, ville, secteur, tip à partager) |

## Démarrer en local

```bash
pnpm install
pnpm dev
```

## Passage au vrai backend (cPanel / MySQL)

Le schéma MySQL cible est documenté dans
[`server/schema.sql`](./server/schema.sql) — il reprend directement
les types de `src/types.ts`. La bascule se fera comme pour le
formulaire d'inscription de la landing page (`apps/web/server/subscribe.php`) :
des petits scripts PHP exposés en API, et `src/store/AppStore.tsx`
remplacé par des appels `fetch` vers ces scripts au lieu de lire/écrire
dans `localStorage`. Les composants de page n'auront pas besoin de
changer : ils ne connaissent que `useAppStore()`, pas la façon dont
les données sont stockées.
