// © 2026 Riadh MNASRI
"use client";

import { useEffect, useState } from "react";
import { PRIORITIES, type Priority, type Task } from "@/lib/tasks";
import type { Dict } from "@/lib/i18n";
import { ArrowUpIcon, PRIO_COLOR, TrashIcon, haptic } from "./ui";

interface Props {
  task: Task;
  t: Dict;
  onClose: () => void;
  onSave: (title: string, priority: Priority) => void;
  onMoveTop: () => void;
  onDelete: () => void;
}

export function EditSheet({ task, t, onClose, onSave, onMoveTop, onDelete }: Props) {
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState<Priority>(task.priority);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const save = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!title.trim()) return;
    onSave(title.trim(), priority);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center" role="dialog" aria-modal="true" aria-label={t.edit}>
      <button
        type="button"
        aria-label={t.close}
        onClick={onClose}
        className="animate-fade-in absolute inset-0 bg-black/35 backdrop-blur-[2px]"
      />
      <form
        onSubmit={save}
        className="animate-sheet-up pb-safe relative w-full max-w-xl rounded-t-[28px] border-t border-line bg-surface px-5 pt-3 shadow-2xl"
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-line" />
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">{t.edit}</h2>

        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) save(e);
          }}
          rows={2}
          maxLength={200}
          aria-label={t.edit}
          className="w-full resize-none rounded-2xl border border-line bg-bg px-4 py-3 text-[17px] leading-snug text-ink focus:border-ink/30 focus:outline-none"
        />

        <div className="mt-4 grid gap-2">
          {PRIORITIES.map((p) => {
            const active = p === priority;
            const c = PRIO_COLOR[p];
            return (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setPriority(p);
                  haptic(6);
                }}
                aria-pressed={active}
                className={`flex min-h-[52px] items-center gap-3 rounded-2xl border px-4 text-left transition-all active:scale-[0.98] ${
                  active ? `${c.border} ${c.soft}` : "border-line"
                }`}
              >
                <span className={`h-3 w-3 rounded-full ${c.bg}`} />
                <span className="flex-1">
                  <span className={`block font-semibold ${active ? c.text : "text-ink"}`}>{t.prio[p]}</span>
                  <span className="block text-[13px] text-muted">{t.prioHint[p]}</span>
                </span>
                {active && <span className={`h-2.5 w-2.5 rounded-full ${c.bg} ring-4 ring-current/10`} />}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onMoveTop}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-line text-[15px] font-medium text-ink active:scale-[0.98]"
          >
            <ArrowUpIcon className="h-4 w-4" />
            {t.moveTop}
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={t.delete}
            className="grid h-12 w-12 place-items-center rounded-2xl border border-line text-danger active:scale-95"
          >
            <TrashIcon />
          </button>
        </div>

        <button
          type="submit"
          disabled={!title.trim()}
          className="mt-3 mb-2 h-13 w-full rounded-2xl bg-ink py-3.5 text-[16px] font-semibold text-bg transition-transform active:scale-[0.98] disabled:opacity-40"
        >
          {t.save}
        </button>
      </form>
    </div>
  );
}
