// © 2026 Riadh MNASRI
"use client";

import { useEffect } from "react";

/** Enregistre le service worker en production pour un usage hors ligne. */
export function SwRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
