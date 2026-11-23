// © 2026 Riadh MNASRI
import type { Priority } from "@/lib/tasks";

export const PRIO_COLOR: Record<Priority, { bg: string; text: string; border: string; soft: string }> = {
  1: { bg: "bg-now", text: "text-now", border: "border-now", soft: "bg-now/10" },
  2: { bg: "bg-next", text: "text-next", border: "border-next", soft: "bg-next/12" },
  3: { bg: "bg-later", text: "text-later", border: "border-later", soft: "bg-later/12" },
};

/** Vibration courte sur Android (iOS Safari l'ignore silencieusement). */
export function haptic(ms = 12) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(ms);
    } catch {
      /* ignoré */
    }
  }
}

export function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TrashIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowUpIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M12 19V5M5.5 11.5L12 5l6.5 6.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect width="64" height="64" rx="16" fill="var(--now)" />
      <rect x="14" y="17" width="36" height="7" rx="3.5" fill="#fff" />
      <rect x="14" y="29" width="26" height="7" rx="3.5" fill="#fff" opacity="0.75" />
      <rect x="14" y="41" width="16" height="7" rx="3.5" fill="#fff" opacity="0.5" />
    </svg>
  );
}
