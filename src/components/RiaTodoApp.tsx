// © 2026 Riadh MNASRI
"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { NOW_LIMIT, PRIORITIES, byOrder, isToday, taskActions, useTasks, type Task } from "@/lib/tasks";
import { setLang, useLang } from "@/lib/i18n";
import { TaskItem } from "./TaskItem";
import { Composer } from "./Composer";
import { EditSheet } from "./EditSheet";
import { CheckIcon, Logo, PRIO_COLOR, haptic } from "./ui";

interface Toast {
  id: number;
  message: string;
  undo?: () => void;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const noopSubscribe = () => () => {};
const useMounted = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

export function RiaTodoApp() {
  const tasks = useTasks();
  const [lang, t] = useLang();
  const mounted = useMounted();
  const [editing, setEditing] = useState<Task | null>(null);
  const [showDone, setShowDone] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const notify = useCallback((message: string, undo?: () => void) => {
    window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message, undo });
    toastTimer.current = window.setTimeout(() => setToast(null), 4500);
  }, []);

  const active = tasks.filter((x) => !x.doneAt);
  const done = tasks.filter((x) => x.doneAt).sort((a, b) => (b.doneAt ?? 0) - (a.doneAt ?? 0));
  const ordered = PRIORITIES.flatMap((p) => active.filter((x) => x.priority === p).sort(byOrder));
  const focus = ordered[0];
  const nowCount = active.filter((x) => x.priority === 1).length;
  const doneToday = done.filter((x) => x.doneAt && isToday(x.doneAt)).length;

  const toggle = (task: Task) => {
    taskActions.toggleDone(task.id);
    if (!task.doneAt) notify(t.completed, () => taskActions.toggleDone(task.id));
  };

  const remove = (task: Task) => {
    const removed = taskActions.remove(task.id);
    if (removed) notify(t.deleted, () => taskActions.restore(removed));
  };

  const closeSheet = useCallback(() => setEditing(null), []);

  const today = mounted
    ? capitalize(new Intl.DateTimeFormat(lang, { weekday: "long", day: "numeric", month: "long" }).format(new Date()))
    : " ";

  return (
    <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-xl flex-col px-4">
      <header className="pt-safe flex items-center gap-3 pb-4">
        <Logo className="h-10 w-10 shadow-[0_6px_16px_-6px_var(--now)] rounded-[12px]" />
        <div className="min-w-0 flex-1">
          <h1 className="text-[22px] font-bold leading-tight tracking-tight">RiaTodo</h1>
          <p className="truncate text-[13px] text-muted">{today}</p>
        </div>
        <button
          type="button"
          onClick={() => setLang(lang === "fr" ? "en" : "fr")}
          aria-label={t.langLabel}
          className="h-9 rounded-full border border-line bg-surface/70 px-3 text-[12px] font-bold tracking-wider text-muted backdrop-blur active:scale-95"
        >
          {t.lang}
        </button>
      </header>

      <main className="flex-1 pb-44">
        {mounted && (
          <p className="mb-4 text-[13px] text-muted">
            {t.left(active.length)}
            {doneToday > 0 && (
              <>
                {" · "}
                <span className="font-medium text-ok">{t.doneToday(doneToday)}</span>
              </>
            )}
          </p>
        )}

        {mounted && focus && (
          <FocusCard
            key={focus.id}
            task={focus}
            label={t.focusLabel}
            prioLabel={t.prio[focus.priority]}
            doneLabel={t.focusDone}
            onDone={() => {
              haptic(18);
              toggle(focus);
            }}
            onOpen={() => setEditing(focus)}
          />
        )}

        {mounted && nowCount > NOW_LIMIT && (
          <div className="animate-pop-in mt-4 rounded-2xl border border-now/30 bg-now/8 px-4 py-3 text-[14px] leading-snug text-ink">
            {t.nowLimit(nowCount)}
          </div>
        )}

        {mounted && tasks.length === 0 && <Empty title={t.emptyTitle} text={t.emptyText} icon="pen" />}
        {mounted && tasks.length > 0 && active.length === 0 && (
          <Empty title={t.allDoneTitle} text={t.allDoneText} icon="check" />
        )}

        {PRIORITIES.map((p) => {
          const list = active.filter((x) => x.priority === p && x.id !== focus?.id).sort(byOrder);
          if (list.length === 0) return null;
          const c = PRIO_COLOR[p];
          return (
            <section key={p} className="mt-6" aria-label={t.prio[p]}>
              <h2 className="mb-2 flex items-center gap-2 px-1 text-[13px] font-semibold uppercase tracking-wider">
                <span className={`h-2.5 w-2.5 rounded-full ${c.bg}`} />
                <span className={c.text}>{t.prio[p]}</span>
                <span className="font-medium normal-case tracking-normal text-muted">{list.length}</span>
              </h2>
              <ul className="grid gap-2">
                {list.map((task) => (
                  <TaskItem key={task.id} task={task} t={t} onToggle={toggle} onDelete={remove} onOpen={setEditing} />
                ))}
              </ul>
            </section>
          );
        })}

        {mounted && active.length > 1 && (
          <p className="mt-5 text-center text-[12px] text-muted/80">{t.swipeHint}</p>
        )}

        {done.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                onClick={() => setShowDone((v) => !v)}
                aria-expanded={showDone}
                className="flex h-10 items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-muted"
              >
                <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform ${showDone ? "rotate-90" : ""}`} aria-hidden>
                  <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t.done} <span className="font-medium normal-case tracking-normal">{done.length}</span>
              </button>
              {showDone && (
                <button
                  type="button"
                  onClick={() => {
                    const snapshot = done;
                    taskActions.clearDone();
                    notify(t.deleted, () => snapshot.forEach((x) => taskActions.restore(x)));
                  }}
                  className="h-10 px-2 text-[13px] font-medium text-danger"
                >
                  {t.clearDone}
                </button>
              )}
            </div>
            {showDone && (
              <ul className="mt-2 grid gap-2 opacity-80">
                {done.map((task) => (
                  <TaskItem key={task.id} task={task} t={t} onToggle={toggle} onDelete={remove} onOpen={setEditing} />
                ))}
              </ul>
            )}
          </section>
        )}

        <footer className="mt-12 text-center text-[12px] text-muted/70">
          © 2026 Riadh MNASRI · {t.tagline}
        </footer>
      </main>

      <Composer
        t={t}
        onAdd={(title, priority) => {
          taskActions.add(title, priority);
        }}
      />

      {toast && (
        <div
          key={toast.id}
          role="status"
          className="animate-pop-in fixed inset-x-4 bottom-[calc(8.5rem+env(safe-area-inset-bottom))] z-30 mx-auto flex max-w-md items-center gap-3 rounded-2xl bg-ink py-2 pl-4 pr-2 text-[14px] text-bg shadow-xl"
        >
          <span className="flex-1">{toast.message}</span>
          {toast.undo && (
            <button
              type="button"
              onClick={() => {
                toast.undo?.();
                setToast(null);
                haptic();
              }}
              className="h-9 rounded-xl px-3 font-semibold text-next active:scale-95"
            >
              {t.undo}
            </button>
          )}
        </div>
      )}

      {editing && (
        <EditSheet
          key={editing.id}
          task={editing}
          t={t}
          onClose={closeSheet}
          onSave={(title, priority) => {
            taskActions.update(editing.id, { title, priority });
            setEditing(null);
          }}
          onMoveTop={() => {
            taskActions.moveToTop(editing.id);
            haptic();
            setEditing(null);
          }}
          onDelete={() => {
            remove(editing);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function FocusCard({
  task,
  label,
  prioLabel,
  doneLabel,
  onDone,
  onOpen,
}: {
  task: Task;
  label: string;
  prioLabel: string;
  doneLabel: string;
  onDone: () => void;
  onOpen: () => void;
}) {
  const c = PRIO_COLOR[task.priority];
  return (
    <article className="animate-pop-in relative overflow-hidden rounded-[26px] border border-line bg-surface p-5 shadow-[0_18px_40px_-20px_rgb(0_0_0/0.35)]">
      <div aria-hidden className={`absolute -right-10 -top-10 h-36 w-36 rounded-full ${c.bg} opacity-15 blur-2xl`} />
      <div className="relative flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider">
        <span className={`relative flex h-2.5 w-2.5`}>
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${c.bg} opacity-60`} />
          <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${c.bg}`} />
        </span>
        <span className="text-muted">{label}</span>
        <span className={`ml-auto rounded-full px-2 py-0.5 ${c.soft} ${c.text}`}>{prioLabel}</span>
      </div>
      <button
        type="button"
        onClick={onOpen}
        className="relative mt-3 block w-full text-left text-[24px] font-semibold leading-tight tracking-tight break-words text-ink"
      >
        {task.title}
      </button>
      <button
        type="button"
        onClick={onDone}
        className={`relative mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-[16px] font-semibold text-white shadow-lg transition-transform active:scale-[0.98] ${c.bg}`}
      >
        <CheckIcon className="h-5 w-5" />
        {doneLabel}
      </button>
    </article>
  );
}

function Empty({ title, text, icon }: { title: string; text: string; icon: "pen" | "check" }) {
  return (
    <div className="animate-pop-in mt-10 flex flex-col items-center px-6 text-center">
      <div className="mb-4 grid h-20 w-20 place-items-center rounded-[26px] border border-line bg-surface shadow-[0_14px_30px_-16px_rgb(0_0_0/0.3)]">
        {icon === "check" ? (
          <CheckIcon className="h-9 w-9 text-ok" />
        ) : (
          <svg viewBox="0 0 24 24" className="h-9 w-9 text-now" fill="none" aria-hidden>
            <path
              d="M4 20h4L19 9a2.8 2.8 0 00-4-4L4 16v4zM13.5 6.5l4 4"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <h2 className="text-[19px] font-semibold">{title}</h2>
      <p className="mt-1.5 max-w-xs text-[15px] leading-relaxed text-muted">{text}</p>
    </div>
  );
}
