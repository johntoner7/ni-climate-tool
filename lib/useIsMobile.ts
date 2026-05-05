"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(max-width: 1023px)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

/** Returns true when viewport is below Tailwind's `lg` breakpoint (1024px). */
export function useIsMobile(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}
