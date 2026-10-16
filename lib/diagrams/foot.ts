import type { L } from "../i18n";
import type { SourceId } from "../sources";

/**
 * A reflexology chart in the detail the printed ones have, checked zone by
 * zone against what is actually under the skin.
 *
 * Charts draw the body onto the soles: head in the toes, chest in the ball,
 * gut in the arch, pelvis in the heel, the spine along the inner edge, and
 * the right foot for the right side of the body (so the liver is on the
 * right sole and the heart on the left). Charts differ in the details; these
 * are the zones most of them share.
 *
 * For each zone the page shows the chart's claim beside three facts from
 * anatomy: the bones and soft tissues under the thumb, the nerve that
 * carries feeling from that skin, and where that nerve enters the spinal
 * cord. Every nerve of the sole enters between L3 and S2. That is the point
 * the detail makes plain: no zone has a pathway to the organ the chart puts
 * there.
 *
 * Geometry is one foot (the right, seen from below, toes up, big toe on the
 * left) in a 190×384 box; the left foot is its mirror image.
 */
export const FOOT_BOX = { width: 190, height: 384 } as const;

export const FOOT_OUTLINE =
  "M28 92C40 80 70 70 100 66C125 64 150 70 170 84C180 100 178 130 176 150C172 190 160 230 160 260C160 290 162 320 150 345C135 372 105 380 88 378C62 376 36 360 30 330C26 300 34 270 40 240C44 210 30 170 24 140C20 120 20 104 28 92Z";

export interface Ellipse {
  kind: "ellipse";
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}
export interface Rect {
  kind: "rect";
  x: number;
  y: number;
  w: number;
  h: number;
}
export interface PathShape {
  kind: "path";
  d: string;
  /** Drawn as a thick line rather than a filled area. */
  stroke?: boolean;
}
export type Shape = Ellipse | Rect | PathShape;

const ell = (cx: number, cy: number, rx: number, ry: number): Ellipse => ({ kind: "ellipse", cx, cy, rx, ry });
const rect = (x: number, y: number, w: number, h: number): Rect => ({ kind: "rect", x, y, w, h });
const path = (d: string, stroke = false): PathShape => ({ kind: "path", d, stroke });

export const TOES: readonly Ellipse[] = [ell(50, 52, 21, 30), ell(90, 52, 12, 18), ell(115, 54, 11, 16), ell(138, 62, 10, 14), ell(158, 76, 9, 12)];

/* ---------- Nerves and what lies under the skin ---------- */

export type NerveId = "medial-plantar" | "lateral-plantar" | "calcaneal" | "saphenous" | "sural";

export const NERVES: Record<NerveId, { name: L; short: L; roots: string; slot: number }> = {
  "medial-plantar": {
    name: { en: "Medial plantar nerve (inner sole and the big toe to the middle toe)", es: "Nervio plantar medial (planta interna y del dedo gordo al dedo medio)" },
    short: { en: "Medial plantar", es: "Plantar medial" },
    roots: "L4-L5",
    slot: 1
  },
  "lateral-plantar": {
    name: { en: "Lateral plantar nerve (outer sole, the fourth and little toes)", es: "Nervio plantar lateral (planta externa, cuarto dedo y meñique)" },
    short: { en: "Lateral plantar", es: "Plantar lateral" },
    roots: "S1-S2",
    slot: 2
  },
  calcaneal: {
    name: { en: "Calcaneal branches of the tibial nerve (heel)", es: "Ramas calcáneas del nervio tibial (talón)" },
    short: { en: "Heel branches", es: "Ramas del talón" },
    roots: "S1-S2",
    slot: 4
  },
  saphenous: {
    name: { en: "Saphenous nerve (inner edge of the foot)", es: "Nervio safeno (borde interno del pie)" },
    short: { en: "Saphenous", es: "Safeno" },
    roots: "L3-L4",
    slot: 3
  },
  sural: {
    name: { en: "Sural nerve (outer edge of the foot)", es: "Nervio sural (borde externo del pie)" },
    short: { en: "Sural", es: "Sural" },
    roots: "S1-S2",
    slot: 7
  }
};

export type StructureId =
  | "hallux-phalanges"
  | "flexor-hallucis"
  | "toe-phalanges"
  | "toe-flexors"
  | "mt1-head"
  | "sesamoids"
  | "mt-heads"
  | "fat-pad-ball"
  | "metatarsal-shafts"
  | "plantar-fascia"
  | "short-flexors"
  | "quadratus"
  | "medial-tarsals"
  | "cuboid"
  | "calcaneus"
  | "heel-pad"
  | "abductor-hallucis"
  | "abductor-minimi"
  | "mt5"
  | "plantar-nerves";

export const STRUCTURES: Record<StructureId, L> = {
  "hallux-phalanges": { en: "The two bones of the big toe (phalanges)", es: "Los dos huesos del dedo gordo (falanges)" },
  "flexor-hallucis": { en: "The tendon that bends the big toe (flexor hallucis longus)", es: "El tendón que flexiona el dedo gordo (flexor largo del dedo gordo)" },
  "toe-phalanges": { en: "The small bones of the toes (phalanges)", es: "Los huesos pequeños de los dedos (falanges)" },
  "toe-flexors": { en: "The tendons that curl the toes", es: "Los tendones que flexionan los dedos" },
  "mt1-head": { en: "The head of the first metatarsal, the bone behind the big toe", es: "La cabeza del primer metatarsiano, el hueso detrás del dedo gordo" },
  sesamoids: { en: "Two pea-sized sesamoid bones under the big-toe joint", es: "Dos huesos sesamoideos, del tamaño de un guisante, bajo la articulación del dedo gordo" },
  "mt-heads": { en: "The heads of the second to fifth metatarsals: the ball of the foot", es: "Las cabezas del segundo al quinto metatarsiano: la parte anterior de la planta" },
  "fat-pad-ball": { en: "A thick cushion of fat under the ball of the foot", es: "Una almohadilla gruesa de grasa bajo la parte anterior de la planta" },
  "metatarsal-shafts": { en: "The long shafts of the metatarsal bones", es: "Las diáfisis largas de los metatarsianos" },
  "plantar-fascia": { en: "The plantar fascia: the tough band that runs from the heel to the toes", es: "La fascia plantar: la banda resistente que va del talón a los dedos" },
  "short-flexors": { en: "The short flexor muscle of the toes, just under the fascia", es: "El músculo flexor corto de los dedos, justo bajo la fascia" },
  quadratus: { en: "A deeper muscle that steadies the long toe tendons (quadratus plantae)", es: "Un músculo más profundo que estabiliza los tendones largos de los dedos (cuadrado plantar)" },
  "medial-tarsals": { en: "The bones of the inner arch: navicular and cuneiforms", es: "Los huesos del arco interno: navicular y cuneiformes" },
  cuboid: { en: "The cuboid bone, at the outer side of the arch", es: "El hueso cuboides, en el lado externo del arco" },
  calcaneus: { en: "The heel bone (calcaneus)", es: "El hueso del talón (calcáneo)" },
  "heel-pad": { en: "The heel's thick fat pad, which absorbs each step", es: "La almohadilla de grasa gruesa del talón, que amortigua cada paso" },
  "abductor-hallucis": { en: "The muscle along the inner edge that pulls the big toe out (abductor hallucis)", es: "El músculo del borde interno que separa el dedo gordo (abductor del dedo gordo)" },
  "abductor-minimi": { en: "The muscle along the outer edge that moves the little toe (abductor digiti minimi)", es: "El músculo del borde externo que mueve el meñique (abductor del quinto dedo)" },
  mt5: { en: "The fifth metatarsal, with its bump at the base on the outer edge", es: "El quinto metatarsiano, con su saliente en la base del borde externo" },
  "plantar-nerves": { en: "The plantar nerves and arteries, running between the muscle layers", es: "Los nervios y arterias plantares, que corren entre las capas musculares" }
};

/* ---------- The chart's zones ---------- */

export type GroupId = "head" | "glands" | "chest" | "digestion" | "urinary" | "spine" | "limbs";

export const GROUPS: Record<GroupId, { name: L; slot: number }> = {
  head: { name: { en: "Head and senses", es: "Cabeza y sentidos" }, slot: 1 },
  glands: { name: { en: "Glands", es: "Glándulas" }, slot: 5 },
  chest: { name: { en: "Chest", es: "Tórax" }, slot: 2 },
  digestion: { name: { en: "Digestion", es: "Digestión" }, slot: 4 },
  urinary: { name: { en: "Kidneys and bladder", es: "Riñones y vejiga" }, slot: 3 },
  spine: { name: { en: "Spine", es: "Columna" }, slot: 7 },
  limbs: { name: { en: "Limbs, hips and pelvis", es: "Extremidades, caderas y pelvis" }, slot: 6 }
};

export type FootSide = "left" | "right";

export interface Zone {
  /** The number on the chart and in the key; the same on both feet. */
  n: number;
  id: string;
  name: L;
  group: GroupId;
  feet: "both" | FootSide;
  shapes: Shape[];
  /** Where the number sits, in foot coordinates. */
  at: readonly [number, number];
  nerves: NerveId[];
  under: StructureId[];
}

const SMALL_TOES: Shape[] = [ell(90, 44, 9, 10), ell(115, 47, 8, 9), ell(138, 56, 7, 8), ell(158, 71, 6, 7)];

export const ZONES: readonly Zone[] = [
  { n: 1, id: "brain", name: { en: "Brain and head", es: "Cerebro y cabeza" }, group: "head", feet: "both", shapes: [ell(50, 40, 16, 14)], at: [50, 36], nerves: ["medial-plantar"], under: ["hallux-phalanges", "flexor-hallucis"] },
  { n: 2, id: "pituitary", name: { en: "Pituitary gland", es: "Hipófisis" }, group: "glands", feet: "both", shapes: [ell(50, 58, 5, 5)], at: [50, 58], nerves: ["medial-plantar"], under: ["hallux-phalanges", "flexor-hallucis"] },
  { n: 3, id: "sinuses", name: { en: "Sinuses", es: "Senos paranasales" }, group: "head", feet: "both", shapes: SMALL_TOES, at: [115, 47], nerves: ["medial-plantar", "lateral-plantar"], under: ["toe-phalanges", "toe-flexors"] },
  { n: 4, id: "neck", name: { en: "Neck and throat", es: "Cuello y garganta" }, group: "head", feet: "both", shapes: [ell(50, 76, 18, 6)], at: [50, 76], nerves: ["medial-plantar"], under: ["hallux-phalanges", "flexor-hallucis"] },
  { n: 5, id: "eyes", name: { en: "Eyes", es: "Ojos" }, group: "head", feet: "both", shapes: [ell(102, 80, 20, 6)], at: [102, 80], nerves: ["medial-plantar"], under: ["toe-phalanges", "toe-flexors"] },
  { n: 6, id: "ears", name: { en: "Ears", es: "Oídos" }, group: "head", feet: "both", shapes: [ell(148, 88, 16, 6)], at: [148, 88], nerves: ["lateral-plantar"], under: ["toe-phalanges", "toe-flexors"] },
  { n: 7, id: "thyroid", name: { en: "Thyroid", es: "Tiroides" }, group: "glands", feet: "both", shapes: [ell(44, 106, 16, 12)], at: [44, 106], nerves: ["medial-plantar"], under: ["mt1-head", "sesamoids", "flexor-hallucis"] },
  { n: 8, id: "lungs", name: { en: "Lungs and airways", es: "Pulmones y vías respiratorias" }, group: "chest", feet: "both", shapes: [rect(64, 94, 96, 42)], at: [112, 114], nerves: ["medial-plantar", "lateral-plantar"], under: ["mt-heads", "fat-pad-ball", "toe-flexors"] },
  { n: 9, id: "heart", name: { en: "Heart", es: "Corazón" }, group: "chest", feet: "left", shapes: [ell(84, 146, 15, 8)], at: [84, 146], nerves: ["medial-plantar"], under: ["metatarsal-shafts", "plantar-fascia", "short-flexors"] },
  { n: 10, id: "shoulder", name: { en: "Shoulder", es: "Hombro" }, group: "limbs", feet: "both", shapes: [rect(160, 96, 22, 34)], at: [169, 112], nerves: ["lateral-plantar", "sural"], under: ["mt-heads", "abductor-minimi"] },
  { n: 11, id: "solar-plexus", name: { en: "Solar plexus and diaphragm", es: "Plexo solar y diafragma" }, group: "chest", feet: "both", shapes: [ell(110, 156, 8, 7)], at: [110, 156], nerves: ["medial-plantar"], under: ["metatarsal-shafts", "plantar-fascia", "short-flexors"] },
  { n: 12, id: "liver", name: { en: "Liver", es: "Hígado" }, group: "digestion", feet: "right", shapes: [rect(100, 166, 76, 32)], at: [154, 176], nerves: ["lateral-plantar", "medial-plantar"], under: ["metatarsal-shafts", "plantar-fascia", "short-flexors"] },
  { n: 13, id: "gallbladder", name: { en: "Gallbladder", es: "Vesícula biliar" }, group: "digestion", feet: "right", shapes: [ell(126, 190, 6, 6)], at: [126, 190], nerves: ["lateral-plantar"], under: ["metatarsal-shafts", "plantar-fascia", "quadratus"] },
  { n: 14, id: "stomach", name: { en: "Stomach", es: "Estómago" }, group: "digestion", feet: "both", shapes: [ell(62, 178, 22, 14)], at: [62, 178], nerves: ["medial-plantar"], under: ["metatarsal-shafts", "abductor-hallucis", "plantar-fascia"] },
  { n: 15, id: "spleen", name: { en: "Spleen", es: "Bazo" }, group: "digestion", feet: "left", shapes: [ell(150, 180, 16, 13)], at: [150, 180], nerves: ["lateral-plantar"], under: ["metatarsal-shafts", "mt5", "abductor-minimi"] },
  { n: 16, id: "pancreas", name: { en: "Pancreas", es: "Páncreas" }, group: "digestion", feet: "both", shapes: [rect(46, 196, 62, 8)], at: [76, 200], nerves: ["medial-plantar"], under: ["medial-tarsals", "plantar-fascia", "short-flexors"] },
  { n: 17, id: "duodenum", name: { en: "Duodenum", es: "Duodeno" }, group: "digestion", feet: "right", shapes: [rect(46, 206, 32, 7)], at: [62, 210], nerves: ["medial-plantar"], under: ["medial-tarsals", "plantar-fascia"] },
  { n: 18, id: "adrenal", name: { en: "Adrenal gland", es: "Glándula suprarrenal" }, group: "glands", feet: "both", shapes: [ell(100, 208, 5, 4)], at: [100, 208], nerves: ["medial-plantar"], under: ["medial-tarsals", "quadratus"] },
  { n: 19, id: "kidney", name: { en: "Kidney", es: "Riñón" }, group: "urinary", feet: "both", shapes: [ell(100, 224, 9, 11)], at: [100, 224], nerves: ["medial-plantar"], under: ["medial-tarsals", "quadratus", "plantar-nerves"] },
  { n: 20, id: "transverse-colon", name: { en: "Large intestine, crossing part", es: "Intestino grueso, colon transverso" }, group: "digestion", feet: "both", shapes: [rect(40, 240, 124, 9)], at: [128, 244], nerves: ["medial-plantar", "lateral-plantar"], under: ["medial-tarsals", "cuboid", "plantar-fascia"] },
  { n: 21, id: "ascending-colon", name: { en: "Large intestine, rising part", es: "Intestino grueso, colon ascendente" }, group: "digestion", feet: "right", shapes: [rect(146, 249, 13, 54)], at: [152, 276], nerves: ["lateral-plantar", "sural"], under: ["cuboid", "abductor-minimi"] },
  { n: 22, id: "descending-colon", name: { en: "Large intestine, falling part", es: "Intestino grueso, colon descendente" }, group: "digestion", feet: "left", shapes: [rect(146, 249, 13, 54)], at: [152, 276], nerves: ["lateral-plantar", "sural"], under: ["cuboid", "abductor-minimi"] },
  { n: 23, id: "appendix", name: { en: "Appendix and ileocaecal valve", es: "Apéndice y válvula ileocecal" }, group: "digestion", feet: "right", shapes: [ell(152, 308, 6, 6)], at: [152, 308], nerves: ["calcaneal", "sural"], under: ["calcaneus", "abductor-minimi"] },
  { n: 24, id: "sigmoid", name: { en: "Large intestine, last bend (sigmoid)", es: "Intestino grueso, sigma" }, group: "digestion", feet: "left", shapes: [rect(76, 302, 82, 7)], at: [118, 306], nerves: ["calcaneal"], under: ["calcaneus", "plantar-fascia"] },
  { n: 25, id: "rectum", name: { en: "Rectum", es: "Recto" }, group: "digestion", feet: "left", shapes: [ell(76, 320, 6, 6)], at: [76, 320], nerves: ["calcaneal"], under: ["calcaneus", "heel-pad"] },
  { n: 26, id: "small-intestine", name: { en: "Small intestine", es: "Intestino delgado" }, group: "digestion", feet: "both", shapes: [rect(62, 254, 80, 42)], at: [100, 274], nerves: ["medial-plantar", "lateral-plantar"], under: ["medial-tarsals", "cuboid", "quadratus", "plantar-fascia"] },
  { n: 27, id: "ureter", name: { en: "Ureter", es: "Uréter" }, group: "urinary", feet: "both", shapes: [path("M96 235L74 284L58 300", true)], at: [80, 270], nerves: ["medial-plantar"], under: ["medial-tarsals", "plantar-fascia"] },
  { n: 28, id: "bladder", name: { en: "Bladder", es: "Vejiga" }, group: "urinary", feet: "both", shapes: [ell(52, 306, 12, 9)], at: [52, 306], nerves: ["saphenous", "calcaneal"], under: ["calcaneus", "abductor-hallucis"] },
  { n: 29, id: "cervical", name: { en: "Neck vertebrae", es: "Vértebras cervicales" }, group: "spine", feet: "both", shapes: [rect(28, 44, 7, 36)], at: [31, 62], nerves: ["medial-plantar", "saphenous"], under: ["hallux-phalanges"] },
  { n: 30, id: "thoracic", name: { en: "Mid-back vertebrae", es: "Vértebras dorsales" }, group: "spine", feet: "both", shapes: [path("M22 98L31 98L40 198L30 198Z")], at: [31, 150], nerves: ["saphenous", "medial-plantar"], under: ["mt1-head", "metatarsal-shafts", "abductor-hallucis"] },
  { n: 31, id: "lumbar", name: { en: "Low-back vertebrae", es: "Vértebras lumbares" }, group: "spine", feet: "both", shapes: [path("M30 200L40 200L46 262L36 262Z")], at: [38, 230], nerves: ["saphenous", "medial-plantar"], under: ["medial-tarsals", "abductor-hallucis"] },
  { n: 32, id: "sacrum", name: { en: "Sacrum and tailbone", es: "Sacro y cóccix" }, group: "spine", feet: "both", shapes: [path("M36 264L46 264L40 332L30 332Z")], at: [38, 296], nerves: ["saphenous", "calcaneal"], under: ["calcaneus", "abductor-hallucis"] },
  { n: 33, id: "arm", name: { en: "Arm and elbow", es: "Brazo y codo" }, group: "limbs", feet: "both", shapes: [rect(164, 134, 16, 30)], at: [171, 148], nerves: ["sural", "lateral-plantar"], under: ["mt5", "abductor-minimi"] },
  { n: 34, id: "hip-knee", name: { en: "Hip, knee and leg", es: "Cadera, rodilla y pierna" }, group: "limbs", feet: "both", shapes: [rect(160, 206, 20, 108)], at: [169, 236], nerves: ["sural", "lateral-plantar"], under: ["mt5", "cuboid", "abductor-minimi"] },
  { n: 35, id: "sciatic", name: { en: "Sciatic nerve", es: "Nervio ciático" }, group: "limbs", feet: "both", shapes: [rect(30, 330, 132, 8)], at: [96, 334], nerves: ["calcaneal"], under: ["calcaneus", "heel-pad", "plantar-fascia"] },
  { n: 36, id: "pelvis", name: { en: "Pelvis and lower back", es: "Pelvis y zona lumbar" }, group: "limbs", feet: "both", shapes: [rect(30, 340, 140, 44)], at: [96, 358], nerves: ["calcaneal"], under: ["calcaneus", "heel-pad"] }
];

export function zoneById(id: string): Zone | undefined {
  return ZONES.find((z) => z.id === id);
}

export function zonesFor(foot: FootSide): Zone[] {
  return ZONES.filter((z) => z.feet === "both" || z.feet === foot);
}

/** Every root a sole nerve enters through, in order. */
export const SOLE_ROOTS = ["L3", "L4", "L5", "S1", "S2"] as const;

/* ---------- The nerve map, drawn lengthwise ---------- */

/** Territories as shapes in foot coordinates, clipped to the outline when drawn. */
export const NERVE_AREAS: readonly { nerve: NerveId; shapes: Shape[] }[] = [
  { nerve: "medial-plantar", shapes: [rect(20, 60, 108, 240), ell(50, 52, 21, 30), ell(90, 52, 12, 18), ell(115, 54, 11, 16), path("M128 48A10 14 0 0 0 128 76Z")] },
  { nerve: "lateral-plantar", shapes: [rect(128, 60, 40, 240), path("M138 48A10 14 0 0 1 138 76Z"), ell(158, 76, 9, 12)] },
  { nerve: "calcaneal", shapes: [rect(20, 300, 160, 90)] },
  { nerve: "saphenous", shapes: [path("M20 150L32 150L44 250L40 300L28 300Z")] },
  { nerve: "sural", shapes: [path("M166 140L184 140L184 340L158 340L162 250Z")] }
];

/* ---------- The bones, for the "what's underneath" view ---------- */

export const BONES: readonly { label: L; shapes: Shape[]; at: readonly [number, number] }[] = [
  {
    label: { en: "Toe bones", es: "Falanges" },
    shapes: [rect(41, 28, 18, 24), rect(39, 56, 22, 34), rect(85, 38, 10, 12), rect(85, 52, 10, 10), rect(84, 64, 12, 30), rect(110, 42, 9, 11), rect(110, 55, 9, 10), rect(109, 67, 11, 28), rect(134, 52, 8, 10), rect(133, 64, 9, 8), rect(132, 74, 10, 24), rect(154, 68, 7, 8), rect(153, 78, 8, 7), rect(152, 87, 9, 18)],
    at: [100, 30]
  },
  { label: { en: "Metatarsals", es: "Metatarsianos" }, shapes: [rect(38, 100, 24, 100), rect(84, 98, 12, 114), rect(108, 100, 12, 112), rect(130, 104, 12, 106), path("M152 108H164V200L172 212H152Z")], at: [114, 160] },
  { label: { en: "Cuneiforms", es: "Cuneiformes" }, shapes: [rect(40, 202, 24, 38), rect(82, 214, 16, 24), rect(104, 214, 18, 26)], at: [80, 228] },
  { label: { en: "Navicular", es: "Navicular" }, shapes: [path("M40 244H108Q112 254 104 262H44Q38 254 40 244Z")], at: [74, 254] },
  { label: { en: "Cuboid", es: "Cuboides" }, shapes: [rect(126, 214, 40, 48)], at: [146, 238] },
  { label: { en: "Heel bone", es: "Calcáneo" }, shapes: [path("M54 268H156Q164 300 156 340Q140 372 104 374Q66 372 52 342Q44 300 54 268Z")], at: [104, 320] },
  // Drawn after the metatarsals: from below, the sesamoids lie over the big toe's.
  { label: { en: "Sesamoids", es: "Sesamoideos" }, shapes: [ell(44, 110, 5, 5.5), ell(56, 110, 5, 5.5)], at: [50, 128] }
];

/* ---------- Words ---------- */

export const FOOT_COPY = {
  view: { en: "Show", es: "Mostrar" },
  views: {
    chart: { en: "What the chart says", es: "Lo que dice el mapa" },
    nerves: { en: "The real nerves", es: "Los nervios reales" },
    bones: { en: "What's underneath", es: "Lo que hay debajo" }
  },
  feet: { en: "Feet", es: "Pies" },
  feetOptions: {
    both: { en: "Both", es: "Ambos" },
    left: { en: "Left", es: "Izquierdo" },
    right: { en: "Right", es: "Derecho" }
  },
  left: { en: "LEFT", es: "IZQUIERDO" },
  right: { en: "RIGHT", es: "DERECHO" },
  key: { en: "Key: tap any zone", es: "Leyenda: toca cualquier zona" },
  leftOnly: { en: "left foot only", es: "solo pie izquierdo" },
  rightOnly: { en: "right foot only", es: "solo pie derecho" },
  bothFeet: { en: "both feet", es: "ambos pies" },
  chartSays: { en: "The chart says this spot is linked to", es: "El mapa dice que este punto está ligado a" },
  under: { en: "What's under your thumb here", es: "Lo que hay bajo tu pulgar aquí" },
  nerve: { en: "The nerve that carries feeling from this skin", es: "El nervio que lleva la sensibilidad de esta piel" },
  enters: { en: "enters the spinal cord at {roots}", es: "entra en la médula espinal en {roots}" },
  noPath: {
    en: "Every nerve from the sole enters the spinal cord between L3 and S2, in the low back. None of them runs to that part of the body ({organ}).",
    es: "Todos los nervios de la planta entran en la médula entre L3 y S2, en la zona lumbar. Ninguno llega a esa parte del cuerpo ({organ})."
  },
  neckNote: {
    en: "The chart's neck is wired to the low back, L4-L5, like the rest of the big toe.",
    es: "El cuello del mapa está conectado a la zona lumbar, L4-L5, como el resto del dedo gordo."
  },
  sciaticNote: {
    en: "The sciatic nerve is real and does reach the foot: its tibial branch becomes the plantar nerves. But it carries feeling from the foot to the back, not the other way round, and pressing the heel doesn't treat it.",
    es: "El nervio ciático es real y llega al pie: su rama tibial se convierte en los nervios plantares. Pero lleva la sensibilidad del pie a la espalda, no al revés, y presionar el talón no lo trata."
  },
  chartCaveat: { en: "A typical chart: charts differ in the details.", es: "Un mapa típico: los mapas difieren en los detalles." },
  nervesCaption: {
    en: "The nerves run lengthwise, not in the chart's horizontal bands. All of them enter the spinal cord between L3 and S2.",
    es: "Los nervios van a lo largo del pie, no en las franjas horizontales del mapa. Todos entran en la médula entre L3 y S2."
  },
  bonesCaption: {
    en: "26 bones in each foot, under layers of fascia, muscle and fat. This is what a thumb presses on.",
    es: "26 huesos en cada pie, bajo capas de fascia, músculo y grasa. Esto es lo que presiona un pulgar."
  },
  figure: { en: "Soles of both feet with the reflexology chart's zones", es: "Plantas de ambos pies con las zonas del mapa de reflexología" },
  evidence: {
    en: "A systematic review found no convincing evidence that reflexology treats any medical condition. A foot massage can still feel relaxing.",
    es: "Una revisión sistemática no encontró evidencia convincente de que la reflexología trate ninguna enfermedad. Un masaje de pies puede, aun así, resultar relajante."
  }
} as const;

export const FOOT_SOURCES: readonly SourceId[] = ["ernst2009", "standring2020"];
