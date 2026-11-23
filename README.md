# RiaTodo

> [English version](README.en.md)

Une liste de tâches pensée pour le téléphone, qui affiche tout de suite ce qui compte. Trois priorités, une tâche à la fois en avant, rien de plus.

© 2026 Riadh MNASRI

## Principes

- **Voir sa priorité en ouvrant l'app** : la tâche la plus importante est mise en avant dans une carte « À faire en premier », avec un gros bouton « C'est fait ».
- **Trois niveaux seulement** (inspirés de la matrice d'Eisenhower) :
  - **Maintenant** : urgent et important
  - **Ensuite** : important, pas urgent (priorité par défaut, pour éviter que tout finisse en urgent)
  - **Plus tard** : quand j'aurai le temps
- **Limite douce de 3 tâches en « Maintenant »** : au-delà, un rappel invite à en repousser une.
- **Saisie en un geste** : champ en bas de l'écran, à portée de pouce, choix de la priorité en une touche, validation avec Entrée.
- **Gestes natifs** : glisser à droite pour terminer, à gauche pour supprimer, avec « Annuler » pendant quelques secondes.
- **Toucher une tâche** pour la renommer, changer sa priorité, la mettre en tête de sa liste ou la supprimer.
- **Les tâches terminées** sont repliées et purgées automatiquement au bout de 7 jours.
- **Pas de compte, pas de serveur** : tout est stocké dans le navigateur (`localStorage`).

## Pensé pour le mobile

- Installable sur l'écran d'accueil (PWA) : iPhone via Safari > Partager > « Sur l'écran d'accueil », Android via Chrome > « Installer l'application ».
- Fonctionne hors ligne (service worker).
- Zones tactiles de 44 px minimum, champ de saisie en 16 px (pas de zoom automatique sur iOS), prise en compte des encoches (`safe-area-inset`).
- Thème clair et sombre automatiques, animations désactivées si « Réduire les animations » est activé.
- Interface en français et en anglais (détection automatique, bouton FR/EN).

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19, TypeScript
- Tailwind CSS 4
- `localStorage` via `useSyncExternalStore` (synchronisé entre onglets)

## Installation

```bash
npm install
```

Aucune variable d'environnement n'est nécessaire.

## Développement local

```bash
npm run dev
```

L'app tourne sur [http://localhost:3717](http://localhost:3717). Pour tester sur téléphone, ouvrir `http://<ip-du-mac>:3717` depuis le même réseau Wi-Fi.

## Qualité

```bash
npm run lint
npm run build
```

## Déploiement

Déploiement sur Vercel : chaque push sur `main` déclenche un déploiement de production via l'intégration GitHub.

## Roadmap

- [x] Saisie, trois priorités, carte de focus, gestes, annulation
- [x] PWA installable et hors ligne
- [x] Interface FR/EN, thème sombre
- [ ] Synchronisation entre appareils (uniquement si le besoin se confirme)
