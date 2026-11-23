// © 2026 Riadh MNASRI
"use client";

import { useSyncExternalStore } from "react";

export type Lang = "fr" | "en";

const dict = {
  fr: {
    tagline: "L'essentiel d'abord.",
    focusLabel: "À faire en premier",
    focusDone: "C'est fait",
    prio: { 1: "Maintenant", 2: "Ensuite", 3: "Plus tard" },
    prioHint: {
      1: "Urgent et important",
      2: "Important, pas urgent",
      3: "Quand j'aurai le temps",
    },
    placeholder: "Ajouter une tâche…",
    add: "Ajouter",
    nowLimit: (n: number) =>
      `${n} tâches en « Maintenant » : si tout est urgent, plus rien ne l'est. Repousse-en une ?`,
    done: "Terminées",
    clearDone: "Vider",
    doneToday: (n: number) => (n === 1 ? "1 tâche bouclée aujourd'hui" : `${n} tâches bouclées aujourd'hui`),
    left: (n: number) => (n === 0 ? "Rien en attente" : n === 1 ? "1 tâche en cours" : `${n} tâches en cours`),
    emptyTitle: "Esprit libre",
    emptyText: "Note ce qui te trotte dans la tête, choisis sa priorité. RiaTodo s'occupe du reste.",
    allDoneTitle: "Tout est bouclé",
    allDoneText: "Profite, ou ajoute la suite quand tu veux.",
    sectionEmpty: "Rien ici",
    edit: "Modifier la tâche",
    save: "Enregistrer",
    moveTop: "Mettre en tête",
    delete: "Supprimer",
    undo: "Annuler",
    completed: "Tâche terminée",
    deleted: "Tâche supprimée",
    reopen: "Rouvrir",
    markDone: "Marquer comme terminée",
    close: "Fermer",
    swipeHint: "Glisse à droite pour terminer, à gauche pour supprimer",
    lang: "EN",
    langLabel: "Switch to English",
  },
  en: {
    tagline: "First things first.",
    focusLabel: "Do this first",
    focusDone: "Done",
    prio: { 1: "Now", 2: "Next", 3: "Later" },
    prioHint: {
      1: "Urgent and important",
      2: "Important, not urgent",
      3: "When I have time",
    },
    placeholder: "Add a task…",
    add: "Add",
    nowLimit: (n: number) =>
      `${n} tasks in "Now": when everything is urgent, nothing is. Push one back?`,
    done: "Done",
    clearDone: "Clear",
    doneToday: (n: number) => (n === 1 ? "1 task wrapped up today" : `${n} tasks wrapped up today`),
    left: (n: number) => (n === 0 ? "Nothing pending" : n === 1 ? "1 task to go" : `${n} tasks to go`),
    emptyTitle: "Clear mind",
    emptyText: "Write down what's on your mind and pick its priority. RiaTodo handles the rest.",
    allDoneTitle: "All wrapped up",
    allDoneText: "Enjoy, or add what's next whenever you like.",
    sectionEmpty: "Nothing here",
    edit: "Edit task",
    save: "Save",
    moveTop: "Move to top",
    delete: "Delete",
    undo: "Undo",
    completed: "Task completed",
    deleted: "Task deleted",
    reopen: "Reopen",
    markDone: "Mark as done",
    close: "Close",
    swipeHint: "Swipe right to complete, left to delete",
    lang: "FR",
    langLabel: "Passer en français",
  },
};

export type Dict = (typeof dict)["fr"];

const KEY = "riatodo:lang";
const listeners = new Set<() => void>();
let current: Lang | null = null;

function detect(): Lang {
  if (current) return current;
  const saved = window.localStorage.getItem(KEY);
  if (saved === "fr" || saved === "en") current = saved;
  else current = navigator.language?.toLowerCase().startsWith("fr") ? "fr" : "en";
  return current;
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function setLang(lang: Lang) {
  current = lang;
  window.localStorage.setItem(KEY, lang);
  document.documentElement.lang = lang;
  listeners.forEach((l) => l());
}

export function useLang(): [Lang, Dict] {
  const lang = useSyncExternalStore(subscribe, detect, () => "fr" as Lang);
  return [lang, dict[lang] as Dict];
}
