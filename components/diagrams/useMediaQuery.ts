"use client";

import { useSyncExternalStore } from "react";

/**
 * A media query read as external state. On the server and the first client
 * render it reports `fallback`, so the static HTML matches; the real value
 * arrives right after hydration.
 */
export function useMediaQuery(query: string, fallback = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => fallback
  );
}
