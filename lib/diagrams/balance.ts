import type { L } from "../i18n";
import type { SourceId } from "../sources";

/**
 * Standing balance seen from above. You stay upright while your centre of
 * mass sits over the base of support, the area enclosed by your feet. A
 * wide, staggered stance (as tai chi uses) makes that area bigger; standing
 * on one leg makes it tiny. Tai chi practises shifting weight slowly toward
 * the edge and back, which is the skill a stumble calls on.
 *
 * Geometry in a 240×240 box, front of the body at the top.
 */
export type Pt = readonly [number, number];
export type Stance = "together" | "tai-chi" | "one-leg";

function foot(cx: number, cy: number, angleDeg: number): Pt[] {
  const a = (angleDeg * Math.PI) / 180;
  const corners: Pt[] = [
    [-13, -36],
    [13, -36],
    [13, 36],
    [-13, 36]
  ];
  return corners.map(([x, y]) => [cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a)] as const);
}

export const STANCES: Record<Stance, { feet: Pt[][]; name: L }> = {
  together: { feet: [foot(105, 120, 0), foot(135, 120, 0)], name: { en: "Feet together", es: "Pies juntos" } },
  "tai-chi": { feet: [foot(142, 78, 0), foot(92, 168, -40)], name: { en: "Tai chi bow stance", es: "Postura del arco del taichí" } },
  "one-leg": { feet: [foot(120, 120, 0)], name: { en: "One leg", es: "Una pierna" } }
};

/** Convex hull (Andrew's monotone chain), counter-clockwise in screen space. */
export function convexHull(points: readonly Pt[]): Pt[] {
  const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (pts.length < 3) return pts;
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: Pt[] = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2]!, lower[lower.length - 1]!, p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper: Pt[] = [];
  for (const p of [...pts].reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2]!, upper[upper.length - 1]!, p) <= 0) upper.pop();
    upper.push(p);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

export function polygonArea(poly: readonly Pt[]): number {
  let sum = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i]!;
    const [x2, y2] = poly[(i + 1) % poly.length]!;
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum) / 2;
}

function distToSegment(p: Pt, a: Pt, b: Pt): number {
  const [px, py] = p;
  const [ax, ay] = a;
  const [bx, by] = b;
  const dx = bx - ax;
  const dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function inside(p: Pt, poly: readonly Pt[]): boolean {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]!;
    const [xj, yj] = poly[j]!;
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

/** Distance from the point to the edge of the base: positive inside, negative outside. */
export function margin(p: Pt, base: readonly Pt[]): number {
  let d = Infinity;
  for (let i = 0; i < base.length; i++) d = Math.min(d, distToSegment(p, base[i]!, base[(i + 1) % base.length]!));
  return inside(p, base) ? d : -d;
}

/** Under this many units from the edge, you are close to having to step. */
export const NEAR_EDGE = 8;

export type BalanceState = "steady" | "edge" | "step";

export function balanceState(p: Pt, base: readonly Pt[]): BalanceState {
  const m = margin(p, base);
  if (m < 0) return "step";
  return m < NEAR_EDGE ? "edge" : "steady";
}

export const BALANCE_TEXT: Record<BalanceState, { name: L; text: L }> = {
  steady: {
    name: { en: "Steady", es: "Estable" },
    text: { en: "Your centre of mass is well inside your base: you can stand here without effort.", es: "Tu centro de masa está bien dentro de tu base: puedes estar así sin esfuerzo." }
  },
  edge: {
    name: { en: "Near the edge", es: "Cerca del borde" },
    text: {
      en: "Still balanced, but your ankles and hips are working to hold you. Tai chi practises moving slowly into this zone and back.",
      es: "Sigues en equilibrio, pero tus tobillos y caderas trabajan para sostenerte. El taichí practica entrar despacio en esta zona y volver."
    }
  },
  step: {
    name: { en: "You'd have to step", es: "Tendrías que dar un paso" },
    text: {
      en: "Your centre of mass is outside your base: without a step, you'd fall. A wider, staggered stance moves this edge further away.",
      es: "Tu centro de masa está fuera de tu base: sin dar un paso, caerías. Una postura más amplia y escalonada aleja este borde."
    }
  }
};

export const BALANCE_COPY = {
  stance: { en: "Stance", es: "Postura" },
  forward: { en: "Lean forward or back", es: "Inclinarse hacia delante o atrás" },
  side: { en: "Lean left or right", es: "Inclinarse a izquierda o derecha" },
  front: { en: "Front", es: "Delante" },
  base: { en: "Base of support", es: "Base de apoyo" },
  com: { en: "Centre of mass", es: "Centro de masa" },
  figure: { en: "Feet seen from above with the base of support and the centre of mass", es: "Pies vistos desde arriba con la base de apoyo y el centro de masa" },
  evidence: {
    en: "In trials of older adults living at home, tai chi and similar balance exercise reduced falls.",
    es: "En ensayos con personas mayores que viven en casa, el taichí y ejercicios de equilibrio similares redujeron las caídas."
  }
} as const;

export const BALANCE_SOURCES: readonly SourceId[] = ["sherrington2019"];
