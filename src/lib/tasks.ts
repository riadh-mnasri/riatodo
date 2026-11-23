// © 2026 Riadh MNASRI
"use client";

import { useSyncExternalStore } from "react";

export type Priority = 1 | 2 | 3;

export const PRIORITIES: Priority[] = [1, 2, 3];

/** Au-delà de ce nombre de tâches « Maintenant », plus rien n'est vraiment prioritaire. */
export const NOW_LIMIT = 3;

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  /** Ordre d'affichage au sein d'une même priorité (croissant). */
  order: number;
  createdAt: number;
  doneAt: number | null;
}

const STORAGE_KEY = "riatodo:tasks:v1";
/** Les tâches terminées depuis plus longtemps que ça sont purgées au chargement. */
const DONE_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;

const EMPTY: Task[] = [];
let cache: Task[] | null = null;
const listeners = new Set<() => void>();

function isTask(value: unknown): value is Task {
  if (!value || typeof value !== "object") return false;
  const t = value as Record<string, unknown>;
  return (
    typeof t.id === "string" &&
    typeof t.title === "string" &&
    (t.priority === 1 || t.priority === 2 || t.priority === 3) &&
    typeof t.order === "number"
  );
}

function read(): Task[] {
  if (cache) return cache;
  try {
    // Reprise des tâches saisies avant le renommage (ancienne clé « prio »).
    const raw = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem("prio:tasks:v1");
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    const limit = Date.now() - DONE_RETENTION_MS;
    cache = Array.isArray(parsed)
      ? parsed.filter(isTask).filter((t) => !t.doneAt || t.doneAt > limit)
      : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: Task[]) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Stockage plein ou mode privé : on garde l'état en mémoire.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useTasks(): Task[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const taskActions = {
  add(title: string, priority: Priority): Task {
    const task: Task = {
      id: newId(),
      title: title.trim(),
      priority,
      order: Date.now(),
      createdAt: Date.now(),
      doneAt: null,
    };
    write([...read(), task]);
    return task;
  },
  update(id: string, patch: Partial<Pick<Task, "title" | "priority">>) {
    write(
      read().map((t) => {
        if (t.id !== id) return t;
        const next = { ...t, ...patch };
        // Changer de priorité place la tâche en bas de sa nouvelle liste.
        if (patch.priority && patch.priority !== t.priority) next.order = Date.now();
        return next;
      }),
    );
  },
  moveToTop(id: string) {
    const all = read();
    const target = all.find((t) => t.id === id);
    if (!target) return;
    const min = Math.min(
      ...all.filter((t) => t.priority === target.priority && !t.doneAt).map((t) => t.order),
    );
    write(all.map((t) => (t.id === id ? { ...t, order: min - 1 } : t)));
  },
  toggleDone(id: string) {
    write(read().map((t) => (t.id === id ? { ...t, doneAt: t.doneAt ? null : Date.now() } : t)));
  },
  remove(id: string): Task | undefined {
    const all = read();
    const removed = all.find((t) => t.id === id);
    write(all.filter((t) => t.id !== id));
    return removed;
  },
  restore(task: Task) {
    write([...read().filter((t) => t.id !== task.id), task]);
  },
  clearDone() {
    write(read().filter((t) => !t.doneAt));
  },
};

export function byOrder(a: Task, b: Task) {
  return a.order - b.order;
}

export function isToday(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}
