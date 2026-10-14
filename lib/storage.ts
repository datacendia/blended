import { z } from "zod";
import { EMPTY_STATE, type TrackerState } from "./outcomes";
import type { Scan } from "./posture";

/**
 * Everything a person enters stays in their own browser's localStorage. There
 * is no server to send it to.
 *
 * Imported files are validated with zod before they replace anything: an
 * export edited by hand, or a file from a different app, is refused rather
 * than half-loaded.
 */
export const TRACKER_KEY = "rootatlas.tracker.v1";
export const SCANS_KEY = "rootatlas.scans.v1";

const score = z.number().min(0).max(10).nullable();
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const trackerSchema = z.object({
  version: z.literal(1),
  plan: z.object({
    condition: z.enum(["neck-arm", "neck", "back-leg", "back", "other"]),
    clinician: z.string().max(40),
    sessionsPurchased: z.number().int().min(1).max(500).nullable(),
    totalPrice: z.number().min(0).max(1_000_000).nullable(),
    currency: z.enum(["PEN", "USD", "EUR", "GBP"]),
    startDate: z.union([isoDate, z.literal("")]),
    symptomsSince: isoDate.nullable()
  }),
  activityNames: z.array(z.string().max(80)).max(3),
  checkIns: z
    .array(
      z.object({
        id: z.string().max(40),
        date: isoDate,
        sessionsUsed: z.number().int().min(0).max(500),
        limbPain: score,
        axialPain: score,
        activities: z.array(score).max(3),
        numbness: z.enum(["none", "sometimes", "constant"]),
        flags: z.array(z.string().max(40)).max(40),
        note: z.string().max(500).optional()
      })
    )
    .max(500)
});

const reading = z.object({ t: z.number().min(-100).max(100).nullable(), a: z.number().min(-180).max(180).nullable() });
const lateral = z.object({ head: reading, shoulder: reading, hip: reading, knee: reading });
const frontal = z.object({ head: reading, shoulder: reading, ribcage: reading, hip: reading });

export const scanSchema = z.object({
  id: z.string().max(40),
  date: isoDate,
  right: lateral,
  left: lateral,
  anterior: frontal,
  posterior: frontal,
  printedAverage: z.object({ head: reading, shoulder: reading, hip: reading, knee: reading }).partial().optional(),
  effectiveHeadKg: z.number().min(0).max(100).nullable().optional(),
  baselineHeadKg: z.number().min(0).max(100).nullable().optional()
});

export const scansSchema = z.array(scanSchema).max(100);

/**
 * localStorage, with a memory fallback. When a browser refuses storage
 * (private mode, blocked site data, a full quota) writes land in memory, so
 * the page keeps working for this visit instead of silently doing nothing.
 * Every write notifies subscribers, which is what lets components read
 * storage through useSyncExternalStore rather than copying it into state.
 */
const memory = new Map<string, string>();
const listeners = new Set<() => void>();

export function readRaw(key: string): string | null {
  if (memory.has(key)) return memory.get(key) ?? null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeRaw(key: string, value: string | null): boolean {
  let ok = true;
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
    memory.delete(key);
  } catch {
    ok = false;
    if (value === null) memory.delete(key);
    else memory.set(key, value);
  }
  listeners.forEach((listener) => listener());
  return ok;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

let probed: boolean | null = null;

/** Whether this browser will keep what is written. Checked once per page load. */
export function storageWorks(): boolean {
  if (probed !== null) return probed;
  try {
    window.localStorage.setItem("rootatlas.probe", "1");
    window.localStorage.removeItem("rootatlas.probe");
    probed = true;
  } catch {
    probed = false;
  }
  return probed;
}

function parseJson(raw: string | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function parseTracker(raw: string | null): TrackerState {
  const parsed = trackerSchema.safeParse(parseJson(raw));
  return parsed.success ? (parsed.data as TrackerState) : EMPTY_STATE;
}

export function parseScans(raw: string | null): Scan[] {
  const parsed = scansSchema.safeParse(parseJson(raw));
  return parsed.success ? (parsed.data as Scan[]) : [];
}

export function loadScans(): Scan[] {
  return parseScans(readRaw(SCANS_KEY));
}

export function saveTracker(state: TrackerState): boolean {
  return writeRaw(TRACKER_KEY, JSON.stringify(state));
}

export function saveScans(scans: Scan[]): boolean {
  return writeRaw(SCANS_KEY, JSON.stringify(scans));
}

export function clearAll(): void {
  writeRaw(TRACKER_KEY, null);
  writeRaw(SCANS_KEY, null);
}

export interface ExportFile {
  app: "rootatlas";
  exportedAt: string;
  tracker: TrackerState;
  scans: Scan[];
}

const exportSchema = z.object({
  app: z.literal("rootatlas"),
  exportedAt: z.string(),
  tracker: trackerSchema,
  scans: scansSchema
});

export function buildExport(tracker: TrackerState, scans: Scan[], now: Date): ExportFile {
  return { app: "rootatlas", exportedAt: now.toISOString(), tracker, scans };
}

export function parseImport(text: string): ExportFile | null {
  try {
    const parsed = exportSchema.safeParse(JSON.parse(text));
    return parsed.success ? (parsed.data as ExportFile) : null;
  } catch {
    return null;
  }
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
