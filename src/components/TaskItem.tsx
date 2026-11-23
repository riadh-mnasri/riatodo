// © 2026 Riadh MNASRI
"use client";

import { useRef, useState } from "react";
import type { Task } from "@/lib/tasks";
import type { Dict } from "@/lib/i18n";
import { CheckIcon, PRIO_COLOR, TrashIcon, haptic } from "./ui";

interface Props {
  task: Task;
  t: Dict;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
  onOpen: (task: Task) => void;
}

const THRESHOLD = 0.32;

export function TaskItem({ task, t, onToggle, onDelete, onOpen }: Props) {
  const [dx, setDx] = useState(0);
  const [leaving, setLeaving] = useState<"left" | "right" | null>(null);
  const [dragging, setDragging] = useState(false);
  const start = useRef<{ x: number; y: number; w: number; axis: "x" | "y" | null; armed: boolean } | null>(null);
  const moved = useRef(false);
  const done = !!task.doneAt;
  const color = PRIO_COLOR[task.priority];

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    start.current = { x: e.clientX, y: e.clientY, w: e.currentTarget.offsetWidth, axis: null, armed: false };
    moved.current = false;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = start.current;
    if (!s) return;
    const ddx = e.clientX - s.x;
    const ddy = e.clientY - s.y;
    if (!s.axis) {
      if (Math.abs(ddx) < 8 && Math.abs(ddy) < 8) return;
      s.axis = Math.abs(ddx) > Math.abs(ddy) ? "x" : "y";
      if (s.axis === "x") {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
      }
    }
    if (s.axis !== "x") return;
    moved.current = true;
    setDx(ddx);
    const armed = Math.abs(ddx) > s.w * THRESHOLD;
    if (armed !== s.armed) {
      s.armed = armed;
      if (armed) haptic(8);
    }
  };

  const onPointerUp = () => {
    const s = start.current;
    start.current = null;
    setDragging(false);
    if (!s || s.axis !== "x") return;
    if (Math.abs(dx) > s.w * THRESHOLD) {
      const dir = dx > 0 ? "right" : "left";
      setLeaving(dir);
      setDx(dir === "right" ? s.w : -s.w);
      haptic(18);
      window.setTimeout(() => (dir === "right" ? onToggle(task) : onDelete(task)), 180);
    } else {
      setDx(0);
    }
  };

  const progress = Math.min(Math.abs(dx) / 120, 1);

  return (
    <li className="animate-pop-in relative overflow-hidden rounded-2xl">
      {/* Fonds révélés pendant le glissement */}
      <div
        aria-hidden
        className={`absolute inset-0 flex items-center rounded-2xl px-5 ${
          dx >= 0 ? "justify-start bg-ok text-white" : "justify-end bg-danger text-white"
        }`}
        style={{ opacity: dx === 0 ? 0 : 0.4 + progress * 0.6 }}
      >
        {dx >= 0 ? <CheckIcon className="h-6 w-6" /> : <TrashIcon className="h-6 w-6" />}
      </div>

      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`relative flex min-h-[60px] touch-pan-y select-none items-center gap-3 rounded-2xl border border-line bg-surface py-2 pl-2 pr-4 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_4px_14px_-6px_rgb(0_0_0/0.08)] ${
          dragging ? "" : "transition-transform duration-200 ease-out"
        } ${leaving ? "opacity-0 transition-[transform,opacity]" : ""}`}
        style={{ transform: `translateX(${dx}px)` }}
      >
        <span aria-hidden className={`absolute inset-y-3 left-0 w-1 rounded-r-full ${color.bg} ${done ? "opacity-30" : ""}`} />

        <button
          type="button"
          onClick={() => {
            haptic();
            onToggle(task);
          }}
          aria-label={done ? t.reopen : t.markDone}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full active:scale-90 transition-transform"
        >
          <span
            className={`grid h-6 w-6 place-items-center rounded-full border-2 transition-colors ${
              done ? "border-ok bg-ok text-white" : color.border
            }`}
          >
            {done && <CheckIcon className="animate-check-pop h-3.5 w-3.5" />}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (moved.current) return;
            onOpen(task);
          }}
          className={`min-w-0 flex-1 py-2 text-left text-[16px] leading-snug break-words ${
            done ? "text-muted line-through decoration-muted/60" : "text-ink"
          }`}
        >
          {task.title}
        </button>
      </div>
    </li>
  );
}
