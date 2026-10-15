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
export type Stance = "together" | "apart" | "tandem" | "horse" | "tai-chi" | "empty" | "one-leg";

function rotate(points: readonly Pt[], cx: number, cy: number, angleDeg: number): Pt[] {
  const a = (angleDeg * Math.PI) / 180;
  return points.map(([x, y]) => [cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a)] as const);
}

/** A whole foot on the ground: 26 wide, 72 long. */
function foot(cx: number, cy: number, angleDeg: number): Pt[] {
  return rotate(
    [
      [-13, -36],
      [13, -36],
      [13, 36],
      [-13, 36]
    ],
    cx,
    cy,
    angleDeg
  );
}

/** Only the ball of the foot touching, as in tai chi's empty stance. */
function ball(cx: number, cy: number): Pt[] {
  return rotate(
    [
      [-13, -12],
      [13, -12],
      [13, 12],
      [-13, 12]
    ],
    cx,
    cy,
    0
  );
}

export interface StanceInfo {
  /** What touches the ground, foot by foot. */
  feet: Pt[][];
  /** The outline of each whole foot, for drawing (the empty stance's front foot is mostly in the air). */
  outline: Pt[][];
  name: L;
  note: L;
}

const both = (feet: Pt[][], name: L, note: L): StanceInfo => ({ feet, outline: feet, name, note });

export const STANCES: Record<Stance, StanceInfo> = {
  together: both([foot(105, 120, 0), foot(135, 120, 0)], { en: "Feet together", es: "Pies juntos" }, {
    en: "A small base: a little lean in any direction reaches the edge.",
    es: "Una base pequeña: una inclinación leve en cualquier dirección llega al borde."
  }),
  apart: both([foot(88, 120, 0), foot(152, 120, 0)], { en: "Feet apart", es: "Pies separados" }, {
    en: "Ordinary standing, hip-width apart: much wider side to side, no deeper front to back.",
    es: "De pie normal, a la anchura de las caderas: mucho más ancha de lado a lado, igual de profunda de delante atrás."
  }),
  tandem: both([foot(120, 84, 0), foot(120, 156, 0)], { en: "Heel to toe", es: "Talón con punta" }, {
    en: "One foot in front of the other: long front to back, but only a foot wide, so side to side is the weak direction.",
    es: "Un pie delante del otro: larga de delante atrás, pero solo del ancho de un pie, así que de lado a lado es la dirección débil."
  }),
  horse: both([foot(62, 124, -10), foot(178, 124, 10)], { en: "Horse stance", es: "Postura del jinete" }, {
    en: "Tai chi's wide, low stance: feet well apart, knees bent, weight shared between them.",
    es: "La postura ancha y baja del taichí: pies muy separados, rodillas dobladas y el peso repartido entre ambos."
  }),
  "tai-chi": both([foot(142, 78, 0), foot(92, 168, -40)], { en: "Bow stance", es: "Postura del arco" }, {
    en: "Tai chi's step forward: front knee bent, back leg long, most of the weight on the front foot. Long and wide at once.",
    es: "El paso adelante del taichí: rodilla delantera doblada, pierna trasera larga y la mayor parte del peso en el pie delantero. Larga y ancha a la vez."
  }),
  empty: {
    feet: [ball(138, 72), foot(108, 164, -40)],
    outline: [foot(138, 96, 0), foot(108, 164, -40)],
    name: { en: "Empty stance", es: "Postura vacía" },
    note: {
      en: "Nearly all the weight on the back foot; the front foot only touches with its ball, ready to step. The base is there, but leaning onto the front foot shifts the load fast.",
      es: "Casi todo el peso en el pie trasero; el delantero solo toca con la parte anterior, listo para dar un paso. La base existe, pero inclinarse hacia el pie delantero cambia la carga rápido."
    }
  },
  "one-leg": both([foot(120, 120, 0)], { en: "One leg", es: "Una pierna" }, {
    en: "The base is one foot: the hardest stance, and the one a stumble suddenly asks for.",
    es: "La base es un solo pie: la postura más difícil, y la que exige de repente un tropiezo."
  })
};

const centre = (poly: readonly Pt[]): Pt => [poly.reduce((a, p) => a + p[0], 0) / poly.length, poly.reduce((a, p) => a + p[1], 0) / poly.length];

/**
 * How the body's weight splits between the feet, by the lever rule: with
 * the centre of mass over one foot it carries everything, halfway between
 * them each carries half. Clamped at the feet, since past them you would
 * be stepping anyway.
 */
export function footLoads(com: Pt, stance: Stance): number[] {
  const feet = STANCES[stance].feet;
  if (feet.length === 1) return [1];
  const [a, b] = feet.map(centre) as [Pt, Pt];
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const t = Math.max(0, Math.min(1, ((com[0] - a[0]) * dx + (com[1] - a[1]) * dy) / (dx * dx + dy * dy)));
  return [1 - t, t];
}

/** Where the centre of mass sits for a given share of weight on the first foot (tai chi's slow weight shift). */
export function comForShare(stance: Stance, firstShare: number): Pt {
  const feet = STANCES[stance].feet;
  if (feet.length === 1) return centre(feet[0]!);
  const [a, b] = feet.map(centre) as [Pt, Pt];
  const t = 1 - firstShare;
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

/** Which way the two feet are apart, so they can be named left/right or front/back. */
export function footNames(stance: Stance): ("left" | "right" | "front" | "back")[] {
  const feet = STANCES[stance].feet.map(centre);
  if (feet.length === 1) return ["left"];
  const [a, b] = feet as [Pt, Pt];
  if (Math.abs(a[0] - b[0]) >= Math.abs(a[1] - b[1])) return a[0] < b[0] ? ["left", "right"] : ["right", "left"];
  return a[1] < b[1] ? ["front", "back"] : ["back", "front"];
}

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
  loads: { en: "Weight on each foot", es: "Peso en cada pie" },
  feetNames: {
    left: { en: "Left foot", es: "Pie izquierdo" },
    right: { en: "Right foot", es: "Pie derecho" },
    front: { en: "Front foot", es: "Pie delantero" },
    back: { en: "Back foot", es: "Pie trasero" }
  },
  oneFoot: { en: "Standing foot", es: "Pie de apoyo" },
  area: { en: "Base area: {x}× feet together", es: "Área de la base: {x}× pies juntos" },
  shift: { en: "Shift the weight, as tai chi does slowly", es: "Cambia el peso, como hace el taichí despacio" },
  even: { en: "Even", es: "Repartido" },
  stances: { en: "Every stance, by size of base", es: "Todas las posturas, por tamaño de base" },
  base: { en: "Base of support", es: "Base de apoyo" },
  com: { en: "Centre of mass", es: "Centro de masa" },
  figure: { en: "Feet seen from above with the base of support and the centre of mass", es: "Pies vistos desde arriba con la base de apoyo y el centro de masa" },
  evidence: {
    en: "In trials of older adults living at home, tai chi and similar balance exercise reduced falls.",
    es: "En ensayos con personas mayores que viven en casa, el taichí y ejercicios de equilibrio similares redujeron las caídas."
  }
} as const;

export const BALANCE_SOURCES: readonly SourceId[] = ["sherrington2019"];
