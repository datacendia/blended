import type { MapView, Side } from "./regions";

/**
 * Geometry for the tappable body and hand diagrams.
 *
 * Kept in lib/ rather than inside the component so a test can check both
 * directions: every region in regions.ts has something to tap, and every shape
 * here belongs to a region. A region with no shape is a symptom nobody can
 * report; a shape with no region is a tap that silently does nothing.
 *
 * Front view is anatomical position — facing you, palms forward — so the
 * person's right side is on the viewer's left. Back view faces away, so the
 * person's left is on the viewer's left. The hand is drawn palm up as you look
 * at your own hand.
 */
type Pt = readonly [number, number];

export interface Shape {
  region: string;
  side: Side;
  view: MapView;
  d: string;
  /** Where the region's name sits, and its rotation in degrees. Hand only. */
  labelAt?: Pt;
  labelAngle?: number;
}

const W = 200;

function poly(points: readonly Pt[]): string {
  return `M${points.map(([x, y]) => `${round(x)} ${round(y)}`).join(" L")} Z`;
}

function ellipse(cx: number, cy: number, rx: number, ry: number): string {
  return `M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${2 * rx} 0 a${rx} ${ry} 0 1 0 ${-2 * rx} 0 Z`;
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

function mirror(points: readonly Pt[], width = W): Pt[] {
  return points.map(([x, y]) => [width - x, y] as const);
}

/** Viewer-left x of the torso edge at height y; the right edge mirrors it. */
const TORSO_EDGE: readonly Pt[] = [
  [86, 60], [100, 60], [130, 63], [170, 67], [200, 69], [225, 66], [248, 66]
];

function torsoX(y: number): number {
  for (let i = 1; i < TORSO_EDGE.length; i++) {
    const [y0, x0] = TORSO_EDGE[i - 1]!;
    const [y1, x1] = TORSO_EDGE[i]!;
    if (y <= y1) return x0 + ((x1 - x0) * (y - y0)) / (y1 - y0);
  }
  return TORSO_EDGE[TORSO_EDGE.length - 1]![1];
}

/** A horizontal band across the torso, following its outline. */
function band(y0: number, y1: number): string {
  const inner = TORSO_EDGE.map(([y]) => y).filter((y) => y > y0 && y < y1);
  const ys = [y0, ...inner, y1];
  const left: Pt[] = ys.map((y) => [torsoX(y), y]);
  const right: Pt[] = [...ys].reverse().map((y) => [W - torsoX(y), y]);
  return poly([...left, ...right]);
}

// Limb outlines on the viewer-left side. Mirrored for the other side.
const CAPE: Pt[] = [[89, 74], [89, 88], [60, 88], [46, 96], [44, 92], [52, 82], [70, 76]];
const UPPER_ARM_OUTER: Pt[] = [[40, 98], [49, 99], [34, 183], [25, 182]];
const UPPER_ARM_INNER: Pt[] = [[49, 99], [58, 100], [43, 184], [34, 183]];
const FOREARM_OUTER: Pt[] = [[25, 186], [33, 187], [22, 263], [14, 262]];
const FOREARM_INNER: Pt[] = [[33, 187], [41, 188], [30, 263], [22, 263]];
const HAND: Pt[] = [[13, 266], [31, 267], [34, 292], [27, 308], [19, 308], [11, 292]];
const UPPER_THIGH: Pt[] = [[66, 250], [98, 250], [96, 290], [69, 290]];
const LOWER_THIGH: Pt[] = [[69, 290], [96, 290], [93, 345], [73, 345]];
const SHIN_OUTER: Pt[] = [[73, 347], [83, 347], [83, 418], [77, 418]];
const SHIN_INNER: Pt[] = [[83, 347], [93, 347], [89, 418], [83, 418]];
const FOOT_OUTER: Pt[] = [[76, 420], [83, 420], [83, 438], [68, 436]];
const FOOT_INNER: Pt[] = [[83, 420], [90, 420], [96, 436], [83, 438]];

const SHOULDER_BLADE: Pt[] = [[62, 94], [88, 96], [88, 150], [74, 158], [64, 132]];
const BUTTOCK: Pt[] = [[66, 234], [94, 234], [94, 278], [70, 274], [64, 252]];
const BACK_UPPER_ARM: Pt[] = [[40, 98], [58, 100], [43, 184], [25, 182]];
const BACK_FOREARM: Pt[] = [[25, 186], [41, 188], [30, 263], [14, 262]];
const BACK_THIGH: Pt[] = [[66, 280], [98, 280], [93, 345], [73, 345]];
const CALF: Pt[] = [[73, 347], [93, 347], [89, 412], [77, 412]];
const HEEL: Pt[] = [[77, 414], [89, 414], [90, 436], [76, 436]];

/** Both sides of a paired region. `leftSide` is the side on the viewer's left. */
function pair(region: string, view: MapView, points: readonly Pt[], leftSide: Side): Shape[] {
  const rightSide: Side = leftSide === "R" ? "L" : "R";
  return [
    { region, view, side: leftSide, d: poly(points) },
    { region, view, side: rightSide, d: poly(mirror(points)) }
  ];
}

const front = (region: string, points: readonly Pt[]) => pair(region, "front", points, "R");
const back = (region: string, points: readonly Pt[]) => pair(region, "back", points, "L");

const FRONT_SHAPES: Shape[] = [
  { region: "face", view: "front", side: "C", d: ellipse(100, 34, 19, 24) },
  { region: "neck-front", view: "front", side: "C", d: poly([[91, 56], [109, 56], [111, 78], [89, 78]]) },
  ...front("shoulder-top", CAPE),
  { region: "upper-chest", view: "front", side: "C", d: band(88, 114) },
  { region: "chest", view: "front", side: "C", d: band(114, 134) },
  { region: "upper-abdomen", view: "front", side: "C", d: band(134, 172) },
  { region: "navel", view: "front", side: "C", d: band(172, 194) },
  { region: "lower-abdomen", view: "front", side: "C", d: band(194, 220) },
  { region: "groin", view: "front", side: "C", d: band(220, 248) },
  ...front("outer-upper-arm", UPPER_ARM_OUTER),
  ...front("inner-upper-arm", UPPER_ARM_INNER),
  ...front("outer-forearm", FOREARM_OUTER),
  ...front("inner-forearm", FOREARM_INNER),
  ...front("hand", HAND),
  ...front("upper-thigh", UPPER_THIGH),
  ...front("lower-thigh", LOWER_THIGH),
  ...front("outer-shin", SHIN_OUTER),
  ...front("inner-shin", SHIN_INNER),
  ...front("outer-foot", FOOT_OUTER),
  ...front("foot-top", FOOT_INNER)
];

const BACK_SHAPES: Shape[] = [
  { region: "occiput", view: "back", side: "C", d: ellipse(100, 34, 19, 24) },
  { region: "back-of-neck", view: "back", side: "C", d: poly([[90, 56], [110, 56], [112, 80], [88, 80]]) },
  ...back("upper-trapezius", CAPE),
  ...back("shoulder-blade", SHOULDER_BLADE),
  { region: "mid-back", view: "back", side: "C", d: poly([[90, 90], [110, 90], [110, 180], [90, 180]]) },
  { region: "low-back", view: "back", side: "C", d: band(182, 232) },
  ...back("buttock", BUTTOCK),
  { region: "saddle", view: "back", side: "C", d: poly([[94, 240], [106, 240], [106, 280], [94, 280]]) },
  ...back("back-upper-arm", BACK_UPPER_ARM),
  ...back("back-forearm", BACK_FOREARM),
  ...back("back-thigh", BACK_THIGH),
  ...back("calf", CALF),
  ...back("heel", HEEL)
];

/** The plain body underneath the tappable regions, shared by front and back. */
export const SILHOUETTE: readonly string[] = [
  ellipse(100, 34, 19, 24),
  poly([[90, 54], [110, 54], [112, 82], [88, 82]]),
  poly([...CAPE, ...mirror(CAPE).reverse()]),
  band(86, 250),
  ...[UPPER_ARM_OUTER, UPPER_ARM_INNER, FOREARM_OUTER, FOREARM_INNER, HAND, UPPER_THIGH, LOWER_THIGH, SHIN_OUTER, SHIN_INNER, FOOT_OUTER, FOOT_INNER]
    .flatMap((p) => [poly(p), poly(mirror(p))])
];

// ── Hand: right hand, palm up, as its owner sees it (thumb on the right). ──
const HW = 200;

function rrect(x: number, y: number, w: number, h: number, r: number): string {
  return `M${x + r} ${y} H${x + w - r} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h} H${x} V${y + r} A${r} ${r} 0 0 1 ${x + r} ${y} Z`;
}

function mirrorRect(x: number, w: number): number {
  return HW - x - w;
}

interface Finger {
  region: string;
  x: number;
  y: number;
  w: number;
  h: number;
  labelAt: Pt;
}

const FINGERS: Finger[] = [
  { region: "little", x: 54, y: 62, w: 16, h: 58, labelAt: [62, 91] },
  { region: "ring", x: 73, y: 34, w: 17, h: 86, labelAt: [81.5, 77] },
  { region: "middle", x: 93, y: 22, w: 18, h: 98, labelAt: [102, 71] },
  { region: "index", x: 114, y: 36, w: 17, h: 84, labelAt: [122.5, 78] }
];

const THUMB: Pt[] = [[142, 150], [160, 124], [172, 104], [186, 108], [184, 126], [168, 164], [150, 204], [140, 210]];
const PALM_LITTLE: Pt[] = [[52, 120], [82, 120], [82, 222], [60, 216], [52, 196]];
const PALM_CENTRE: Pt[] = [[82, 120], [112, 120], [112, 226], [82, 222]];
const PALM_THUMB: Pt[] = [[112, 120], [140, 122], [142, 150], [140, 210], [112, 226]];

function handShapes(side: "L" | "R"): Shape[] {
  const flip = side === "L";
  const pts = (p: readonly Pt[]) => (flip ? mirror(p, HW) : p);
  const at = ([x, y]: Pt): Pt => (flip ? [HW - x, y] : [x, y]);
  return [
    ...FINGERS.map((f) => ({
      region: f.region,
      view: "hand" as const,
      side,
      d: rrect(flip ? mirrorRect(f.x, f.w) : f.x, f.y, f.w, f.h, f.w / 2),
      // Names run up inside each finger: written above the tips, the longer
      // Spanish ones ("Dedo medio", "Anular", "Índice") collided.
      labelAt: at(f.labelAt),
      labelAngle: -90
    })),
    // Along the thumb's axis; mirrored, the angle flips so it never reads upside down.
    { region: "thumb", view: "hand", side, d: poly(pts(THUMB)), labelAt: at([166, 152]), labelAngle: flip ? 65 : -65 },
    { region: "palm-little-side", view: "hand", side, d: poly(pts(PALM_LITTLE)) },
    { region: "palm-centre", view: "hand", side, d: poly(pts(PALM_CENTRE)) },
    { region: "palm-thumb-side", view: "hand", side, d: poly(pts(PALM_THUMB)) }
  ];
}

export const SHAPES: readonly Shape[] = [...FRONT_SHAPES, ...BACK_SHAPES, ...handShapes("R"), ...handShapes("L")];

export function shapesFor(view: MapView, handSide: "L" | "R" = "R"): Shape[] {
  if (view === "hand") return SHAPES.filter((s) => s.view === "hand" && s.side === handSide);
  return SHAPES.filter((s) => s.view === view);
}
