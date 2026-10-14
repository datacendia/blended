import type { L } from "./i18n";

/**
 * Reading a photo-based posture report (PostureScreen-style) honestly.
 *
 * These reports measure landmarks placed on photographs: four photos, each
 * with its own camera angle, stance and clothing. The left and right side
 * photos measure the same head, shoulders, hips and knees moments apart, so
 * the gap between them is a free, built-in estimate of measurement error. This
 * module uses that gap instead of trusting any single number.
 *
 * Sign convention, everywhere: lateral translation + = forward, − = backward;
 * lateral angulation + = flexed, − = extended; frontal translation and
 * angulation + = to the person's right, − = to the left.
 */
export const LATERAL_SEGMENTS = ["head", "shoulder", "hip", "knee"] as const;
export const FRONTAL_SEGMENTS = ["head", "shoulder", "ribcage", "hip"] as const;
export type LateralSegment = (typeof LATERAL_SEGMENTS)[number];
export type FrontalSegment = (typeof FRONTAL_SEGMENTS)[number];

export interface Reading {
  /** Translation, cm, signed. */
  t: number | null;
  /** Angulation, degrees, signed. */
  a: number | null;
}

export interface Scan {
  id: string;
  date: string;
  right: Record<LateralSegment, Reading>;
  left: Record<LateralSegment, Reading>;
  anterior: Record<FrontalSegment, Reading>;
  posterior: Record<FrontalSegment, Reading>;
  /** The "averaged lateral" table, if the report prints one. Magnitudes as printed. */
  printedAverage?: Partial<Record<LateralSegment, Reading>>;
  effectiveHeadKg?: number | null;
  baselineHeadKg?: number | null;
}

/**
 * A real report, anonymised: a 2026 PostureScreen scan from a chiropractic
 * clinic in Lima, given to a patient with a trapped nerve in the neck. It is
 * the sample because it is the report that started this project, and because
 * it shows every problem this module checks for.
 */
export const SAMPLE_SCAN: Scan = {
  id: "sample",
  date: "2026-09-16",
  right: {
    head: { t: 7.07, a: 16.6 },
    shoulder: { t: -4.75, a: -4.95 },
    hip: { t: 4.02, a: 6.73 },
    knee: { t: 4.77, a: 8.71 }
  },
  left: {
    head: { t: 4.64, a: 10.45 },
    shoulder: { t: 1.12, a: 1.19 },
    hip: { t: -0.87, a: -1.41 },
    knee: { t: 4.67, a: 7.6 }
  },
  anterior: {
    head: { t: 1.27, a: 3.1 },
    shoulder: { t: 0, a: 0 },
    ribcage: { t: -2.09, a: null },
    hip: { t: 0.91, a: 2.0 }
  },
  posterior: {
    head: { t: 0.34, a: 4.3 },
    shoulder: { t: 0.02, a: 0 },
    ribcage: { t: -0.16, a: null },
    hip: { t: 2.73, a: 0 }
  },
  printedAverage: {
    head: { t: 5.85, a: 13.52 },
    shoulder: { t: 2.93, a: -1.88 },
    hip: { t: 2.44, a: 2.66 },
    knee: { t: 4.72, a: 8.15 }
  },
  effectiveHeadKg: 19.2,
  baselineHeadKg: 5.8
};

export type Agreement = "good" | "fair" | "poor";

export interface PairCheck {
  segment: string;
  /** e.g. "right vs left side photo" */
  pair: "lateral" | "frontal";
  first: number;
  second: number;
  gap: number;
  directionsDisagree: boolean;
  agreement: Agreement;
}

/** A shift smaller than this is treated as "no direction" — too small to have one. */
const DIRECTION_FLOOR_CM = 0.5;

/**
 * Agreement bands for two photos of the same body part. These are RootAtlas's
 * own reading thresholds, not published cut-offs: under 1 cm is about as close
 * as hand-placed landmarks on a phone photo get; over 2.5 cm is larger than
 * most of the posture changes a treatment plan promises.
 */
const GOOD_CM = 1.0;
const FAIR_CM = 2.5;

function agreementFor(gap: number, directionsDisagree: boolean): Agreement {
  if (directionsDisagree || gap > FAIR_CM) return "poor";
  return gap > GOOD_CM ? "fair" : "good";
}

function compare(segment: string, pair: PairCheck["pair"], first: number | null, second: number | null): PairCheck | null {
  if (first === null || second === null) return null;
  const directionsDisagree =
    Math.sign(first) !== Math.sign(second) &&
    Math.abs(first) >= DIRECTION_FLOOR_CM &&
    Math.abs(second) >= DIRECTION_FLOOR_CM;
  const gap = round2(Math.abs(first - second));
  return { segment, pair, first, second, gap, directionsDisagree, agreement: agreementFor(gap, directionsDisagree) };
}

/** Right-side photo against left-side photo, and front against back. */
export function pairChecks(scan: Scan): PairCheck[] {
  const lateral = LATERAL_SEGMENTS.map((s) => compare(s, "lateral", scan.right[s].t, scan.left[s].t));
  const frontal = FRONTAL_SEGMENTS.map((s) => compare(s, "frontal", scan.anterior[s].t, scan.posterior[s].t));
  return [...lateral, ...frontal].filter((c): c is PairCheck => c !== null);
}

/**
 * The scan's own measurement noise: the median gap between two photos of the
 * same body part. A change on a re-scan smaller than this cannot be told apart
 * from where the camera was and how the person stood.
 */
export function noiseFloor(scan: Scan): number | null {
  const gaps = pairChecks(scan).map((c) => c.gap).sort((a, b) => a - b);
  if (gaps.length === 0) return null;
  const mid = Math.floor(gaps.length / 2);
  const median = gaps.length % 2 ? gaps[mid]! : (gaps[mid - 1]! + gaps[mid]!) / 2;
  return round2(median);
}

export interface AveragingCheck {
  segment: LateralSegment;
  printed: number;
  signedMean: number;
  magnitudeMean: number;
  /** The printed average adds up the sizes of shifts that point opposite ways. */
  hidesOppositeDirections: boolean;
}

/**
 * Some reports average the left and right photos by size, ignoring direction.
 * If one photo says 4.75 cm backward and the other 1.12 cm forward, the honest
 * average is 1.82 cm backward — not "2.93 cm". This finds where the printed
 * average matches the size-only mean while the two photos disagree on direction.
 */
export function averagingChecks(scan: Scan): AveragingCheck[] {
  const out: AveragingCheck[] = [];
  for (const segment of LATERAL_SEGMENTS) {
    const printed = scan.printedAverage?.[segment]?.t;
    const r = scan.right[segment].t;
    const l = scan.left[segment].t;
    if (printed == null || r === null || l === null) continue;
    const signedMean = round2((r + l) / 2);
    const magnitudeMean = round2((Math.abs(r) + Math.abs(l)) / 2);
    const matchesMagnitude = Math.abs(Math.abs(printed) - magnitudeMean) <= 0.02;
    const opposite = Math.sign(r) !== Math.sign(l) && r !== 0 && l !== 0;
    out.push({ segment, printed, signedMean, magnitudeMean, hidesOppositeDirections: matchesMagnitude && opposite });
  }
  return out;
}

/** Report "totals" add the size of every shift regardless of direction. */
export function viewTotal(readings: Record<string, Reading>): { t: number; a: number } {
  const values = Object.values(readings);
  return {
    t: round2(values.reduce((sum, r) => sum + Math.abs(r.t ?? 0), 0)),
    a: round2(values.reduce((sum, r) => sum + Math.abs(r.a ?? 0), 0))
  };
}

export function headWeightRatio(scan: Scan): number | null {
  if (!scan.effectiveHeadKg || !scan.baselineHeadKg) return null;
  return round2(scan.effectiveHeadKg / scan.baselineHeadKg);
}

export interface SegmentChange {
  segment: LateralSegment;
  before: number;
  after: number;
  /** Positive = moved back toward neutral (smaller forward/backward shift). */
  improvement: number;
  beyondNoise: boolean;
}

/**
 * Compare two scans segment by segment, using the side-photo average with
 * direction kept. A change only counts as real when it is bigger than the
 * larger of the two scans' own noise floors.
 */
export function compareScans(before: Scan, after: Scan): { noise: number | null; changes: SegmentChange[] } {
  const noise = Math.max(noiseFloor(before) ?? 0, noiseFloor(after) ?? 0) || null;
  const changes: SegmentChange[] = [];
  for (const segment of LATERAL_SEGMENTS) {
    const b = signedSideMean(before, segment);
    const a = signedSideMean(after, segment);
    if (b === null || a === null) continue;
    const improvement = round2(Math.abs(b) - Math.abs(a));
    changes.push({ segment, before: b, after: a, improvement, beyondNoise: noise !== null && Math.abs(improvement) > noise });
  }
  return { noise, changes };
}

export function signedSideMean(scan: Scan, segment: LateralSegment): number | null {
  const r = scan.right[segment].t;
  const l = scan.left[segment].t;
  if (r === null || l === null) return null;
  return round2((r + l) / 2);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export const SEGMENT_LABEL: Record<LateralSegment | FrontalSegment, L> = {
  head: { en: "Head", es: "Cabeza" },
  shoulder: { en: "Shoulder", es: "Hombro" },
  ribcage: { en: "Rib cage", es: "Caja torácica" },
  hip: { en: "Hip / pelvis", es: "Cadera / pelvis" },
  knee: { en: "Knee", es: "Rodilla" }
};

/** What each lateral reading means, in plain words. */
export const SEGMENT_MEANING: Record<LateralSegment, L> = {
  head: {
    en: "How far the head sits forward of the body below it in the side photo ('forward head posture'), and how much it tilts down. Very common. In adults it is modestly associated with neck pain in some studies, but a photo cannot show discs or nerve roots, and posture alone is not how a trapped nerve is diagnosed.",
    es: "Cuánto se adelanta la cabeza respecto al cuerpo en la foto lateral ('cabeza adelantada') y cuánto se inclina hacia abajo. Es muy frecuente. En adultos se asocia moderadamente con dolor de cuello en algunos estudios, pero una foto no muestra discos ni raíces nerviosas, y la postura por sí sola no sirve para diagnosticar un nervio atrapado."
  },
  shoulder: {
    en: "Whether the shoulder landmark sits forward or behind, and its tilt. Shoulder landmarks move a lot with how relaxed the arms are when the photo is taken.",
    es: "Si el hombro está adelantado o atrasado, y su inclinación. Los puntos del hombro cambian mucho según lo relajados que estén los brazos al tomar la foto."
  },
  hip: {
    en: "Whether the pelvis sits forward or behind, and its tilt. Sensitive to how weight is spread between the feet at the moment of the photo.",
    es: "Si la pelvis está adelantada o atrasada, y su inclinación. Depende de cómo se reparte el peso entre los pies en el momento de la foto."
  },
  knee: {
    en: "Whether the knees sit forward of the ankles and how bent they are. Changes simply by softening or locking the knees.",
    es: "Si las rodillas están por delante de los tobillos y cuánto se flexionan. Cambia solo con aflojar o bloquear las rodillas."
  }
};
