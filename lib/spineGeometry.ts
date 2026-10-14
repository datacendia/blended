import type { SpineRegion } from "./spine";

/**
 * Lays the spine out along its real side-view curve: the neck curving forward
 * (lordosis), the mid back curving back (kyphosis), the low back forward
 * again, then the sacrum and coccyx sweeping back and under.
 *
 * Positions are computed rather than hand-placed so that every vertebra sits
 * on one smooth curve and grows in size from neck to low back, as real ones
 * do. The front of the body is to the right (+x).
 */
export const SPINE_VIEWBOX = { width: 240, height: 760 } as const;

type Pt = readonly [number, number];

const CONTROL: readonly Pt[] = [
  [120, 92], [128, 130], [131, 165], [124, 200], [108, 260], [98, 330], [104, 400],
  [122, 460], [136, 520], [138, 560], [126, 610], [104, 660], [96, 700], [104, 732]
];

export interface Placed {
  id: string;
  region: SpineRegion;
  x: number;
  y: number;
  /** Degrees to rotate a drawing whose long axis points straight down. */
  angle: number;
  /** Height along the spine. */
  h: number;
  /** Front-to-back depth of the vertebral body. */
  w: number;
  /** Spinous process length. */
  spine: number;
  /** How far the spinous process slopes downward. */
  drop: number;
}

export interface RootMark {
  rootId: string;
  x: number;
  y: number;
}

interface Piece {
  id: string;
  region: SpineRegion;
  h: number;
  w: number;
  gapAfter: number;
  spine: number;
  drop: number;
}

const PIECES: Piece[] = [
  { id: "C1", region: "cervical", h: 8, w: 15, gapAfter: 3.5, spine: 6, drop: 0 },
  { id: "C2", region: "cervical", h: 13, w: 16, gapAfter: 3.5, spine: 10, drop: 2 },
  ...[3, 4, 5, 6].map((n) => ({ id: `C${n}`, region: "cervical" as const, h: 10, w: 16, gapAfter: 3.5, spine: 8, drop: 3 })),
  { id: "C7", region: "cervical", h: 10.5, w: 17, gapAfter: 4, spine: 15, drop: 4 },
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `T${i + 1}`,
    region: "thoracic" as const,
    h: 12 + (i * 4) / 11,
    w: 18 + (i * 4) / 11,
    gapAfter: 4,
    spine: 15,
    drop: i < 9 ? 8 : 4
  })),
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `L${i + 1}`,
    region: "lumbar" as const,
    h: 18 + i * 0.8,
    w: 26 + i,
    gapAfter: 6,
    spine: 13,
    drop: 1
  })),
  { id: "sacrum", region: "sacral", h: 72, w: 30, gapAfter: 3, spine: 0, drop: 0 },
  { id: "coccyx", region: "coccyx", h: 24, w: 10, gapAfter: 0, spine: 0, drop: 0 }
];

function catmullRom(points: readonly Pt[], samplesPerSegment: number): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[Math.min(points.length - 1, i + 2)]!;
    for (let s = 0; s < samplesPerSegment; s++) {
      const t = s / samplesPerSegment;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(points[points.length - 1]!);
  return out;
}

const CURVE = catmullRom(CONTROL, 40);
const CUMULATIVE: number[] = CURVE.reduce<number[]>((acc, p, i) => {
  if (i === 0) return [0];
  const prev = CURVE[i - 1]!;
  acc.push(acc[i - 1]! + Math.hypot(p[0] - prev[0], p[1] - prev[1]));
  return acc;
}, []);
const LENGTH = CUMULATIVE[CUMULATIVE.length - 1]!;

/** Point and unit tangent at arc length s. */
function at(s: number): { p: Pt; t: Pt } {
  const target = Math.max(0, Math.min(LENGTH, s));
  let i = CUMULATIVE.findIndex((c) => c >= target);
  if (i <= 0) i = 1;
  const a = CURVE[i - 1]!;
  const b = CURVE[i]!;
  const span = CUMULATIVE[i]! - CUMULATIVE[i - 1]! || 1;
  const k = (target - CUMULATIVE[i - 1]!) / span;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  return { p: [a[0] + dx * k, a[1] + dy * k], t: [dx / len, dy / len] };
}

const round = (n: number) => Math.round(n * 100) / 100;

function layout(): { placed: Placed[]; roots: RootMark[] } {
  const natural = PIECES.reduce((sum, p) => sum + p.h + p.gapAfter, 0);
  const scale = LENGTH / natural;
  const placed: Placed[] = [];
  const roots: RootMark[] = [];
  let s = 0;

  const rootAt = (arc: number, depth: number, rootId: string) => {
    const { p, t } = at(arc);
    // Posterior is the opposite of the anterior normal (t.y, -t.x).
    roots.push({ rootId, x: round(p[0] - t[1] * depth), y: round(p[1] + t[0] * depth) });
  };

  // C1 leaves between the skull and the atlas.
  rootAt(0, (PIECES[0]!.w / 2 + 3) * scale, "C1");

  PIECES.forEach((piece, index) => {
    const h = piece.h * scale;
    const { p, t } = at(s + h / 2);
    placed.push({
      id: piece.id,
      region: piece.region,
      x: round(p[0]),
      y: round(p[1]),
      angle: round((Math.atan2(-t[0], t[1]) * 180) / Math.PI),
      h: round(h),
      w: round(piece.w * scale),
      spine: round(piece.spine * scale),
      drop: round(piece.drop * scale)
    });

    const next = PIECES[index + 1];
    if (next && piece.region !== "sacral") {
      const exitId = rootBelow(piece.id);
      if (exitId) rootAt(s + h + (piece.gapAfter * scale) / 2, (Math.max(piece.w, next.w) / 2 + 3) * scale, exitId);
    }
    if (piece.region === "sacral") {
      // S1-S4 leave through the sacrum's own holes, S5 at its tip.
      ["S1", "S2", "S3", "S4", "S5"].forEach((id, k) => rootAt(s + h * (0.12 + k * 0.2), (piece.w / 2 - 6 - k * 2.5) * scale, id));
    }
    s += h + piece.gapAfter * scale;
  });

  return { placed, roots };
}

/** The root that leaves just below a vertebra (C7 → C8, T1 → T1, C3 → C4). */
function rootBelow(id: string): string | null {
  const m = id.match(/^([CTL])(\d+)$/);
  if (!m) return null;
  const n = Number(m[2]);
  if (m[1] === "C") return `C${n + 1}`;
  return `${m[1]}${n}`;
}

const LAYOUT = layout();
export const PLACED: readonly Placed[] = LAYOUT.placed;
export const ROOT_MARKS: readonly RootMark[] = LAYOUT.roots;

/** Vertical extent of each region, for the brackets drawn beside the spine. */
export function regionExtent(region: SpineRegion): { top: number; bottom: number } {
  const items = PLACED.filter((p) => p.region === region);
  const tops = items.map((p) => p.y - p.h / 2);
  const bottoms = items.map((p) => p.y + p.h / 2);
  return { top: Math.min(...tops), bottom: Math.max(...bottoms) };
}
