// © 2026 Riadh MNASRI
"use client";

import { useState } from "react";
import { PRIORITIES, type Priority } from "@/lib/tasks";
import type { Dict } from "@/lib/i18n";
import { ArrowUpIcon, PRIO_COLOR, haptic } from "./ui";

interface Props {
  t: Dict;
  onAdd: (title: string, priority: Priority) => void;
}

export function Composer({ t, onAdd }: Props) {
  const [title, setTitle] = useState("");
  // « Ensuite » par défaut : on évite que tout atterrisse en urgent par réflexe.
  const [priority, setPriority] = useState<Priority>(2);
  const canAdd = title.trim().length > 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAdd) return;
    onAdd(title, priority);
    haptic();
    setTitle("");
  };

  return (
    <form
      onSubmit={submit}
      className="pb-safe fixed inset-x-0 bottom-0 z-20 border-t border-line/70 bg-bg/80 px-4 pt-3 backdrop-blur-xl backdrop-saturate-150"
    >
      <div className="mx-auto max-w-xl">
        <div role="radiogroup" aria-label={t.prio[priority]} className="mb-2.5 flex gap-2">
          {PRIORITIES.map((p) => {
            const active = p === priority;
            const c = PRIO_COLOR[p];
            return (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => {
                  setPriority(p);
                  haptic(6);
                }}
                className={`flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border text-[13px] font-semibold transition-all active:scale-95 ${
                  active ? `${c.bg} border-transparent text-white shadow-md` : "border-line bg-surface text-muted"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${active ? "bg-white" : c.bg}`} />
                {t.prio[p]}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface p-1.5 pl-4 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.25)] focus-within:border-ink/30">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.placeholder}
            aria-label={t.placeholder}
            enterKeyHint="done"
            autoComplete="off"
            maxLength={200}
            // 16px minimum : sinon Safari iOS zoome au focus.
            className="min-w-0 flex-1 bg-transparent py-2 text-[16px] text-ink placeholder:text-muted/80 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!canAdd}
            aria-label={t.add}
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white transition-all active:scale-90 disabled:opacity-30 ${PRIO_COLOR[priority].bg}`}
          >
            <ArrowUpIcon />
          </button>
        </div>
      </div>
    </form>
  );
}
