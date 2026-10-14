"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { TrackerState } from "@/lib/outcomes";
import type { Scan } from "@/lib/posture";
import { parseScans, parseTracker, readRaw, SCANS_KEY, storageWorks, subscribe, TRACKER_KEY } from "@/lib/storage";

/*
 * Storage and the clock are external to React. Reading them through
 * useSyncExternalStore gives the server render (built once, at deploy time) an
 * empty snapshot and the browser the real one, with no setState-in-effect and
 * no hydration mismatch. The snapshots are strings, so they compare stably.
 */
const noop = () => () => {};

export function useTracker(): TrackerState {
  const raw = useSyncExternalStore(subscribe, () => readRaw(TRACKER_KEY), () => null);
  return useMemo(() => parseTracker(raw), [raw]);
}

export function useScans(): Scan[] {
  const raw = useSyncExternalStore(subscribe, () => readRaw(SCANS_KEY), () => null);
  return useMemo(() => parseScans(raw), [raw]);
}

export function useToday(): string {
  return useSyncExternalStore(noop, () => new Date().toISOString().slice(0, 10), () => "");
}

export function useStorageWorks(): boolean {
  return useSyncExternalStore(noop, storageWorks, () => true);
}
