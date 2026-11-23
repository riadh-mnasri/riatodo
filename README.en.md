# Prio

> [Version française](README.md)

A to-do list built for your phone that shows what matters the moment you open it. Three priorities, one task in the spotlight, nothing more.

© 2026 Riadh MNASRI

## Principles

- **See your priority on launch**: the most important task is highlighted in a "Do this first" card with a big "Done" button.
- **Only three levels** (inspired by the Eisenhower matrix):
  - **Now**: urgent and important
  - **Next**: important, not urgent (default priority, so not everything ends up urgent)
  - **Later**: when I have time
- **Soft limit of 3 tasks in "Now"**: beyond that, a reminder suggests pushing one back.
- **One-gesture capture**: input at the bottom of the screen, within thumb reach, priority in one tap, Enter to add.
- **Native gestures**: swipe right to complete, left to delete, with "Undo" for a few seconds.
- **Tap a task** to rename it, change its priority, move it to the top of its list or delete it.
- **Completed tasks** are collapsed and purged automatically after 7 days.
- **No account, no server**: everything is stored in the browser (`localStorage`).

## Built for mobile

- Installable on the home screen (PWA): iPhone via Safari > Share > "Add to Home Screen", Android via Chrome > "Install app".
- Works offline (service worker).
- Touch targets of at least 44 px, 16 px input (no auto-zoom on iOS), notch-aware layout (`safe-area-inset`).
- Automatic light and dark themes, animations disabled when "Reduce motion" is on.
- French and English UI (auto-detected, FR/EN toggle).

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19, TypeScript
- Tailwind CSS 4
- `localStorage` through `useSyncExternalStore` (synced across tabs)

## Setup

```bash
npm install
```

No environment variables are required.

## Local development

```bash
npm run dev
```

The app runs on [http://localhost:3717](http://localhost:3717). To try it on a phone, open `http://<your-mac-ip>:3717` from the same Wi-Fi network.

## Quality

```bash
npm run lint
npm run build
```

## Deployment

Deployed on Vercel: every push to `main` triggers a production deployment through the GitHub integration.

## Roadmap

- [x] Capture, three priorities, focus card, gestures, undo
- [x] Installable, offline-ready PWA
- [x] FR/EN UI, dark theme
- [ ] Cross-device sync (only if the need becomes real)
