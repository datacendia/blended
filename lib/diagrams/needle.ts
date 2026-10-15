import type { L } from "../i18n";
import type { SourceId } from "../sources";

/**
 * Where needles go over the upper back, and what is under each spot. A map
 * of the back shows five common sites over the lung field, and a schematic
 * slice through the chosen one shows how deep each layer starts. The rarest
 * serious harm from acupuncture and dry needling here is a punctured lung,
 * so the slice ends at the pleura (the lung's lining) wherever the lung is
 * beneath.
 *
 * Thicknesses are in figure units, not centimetres: real depths vary too much
 * between people to print. What the figure gets right is the order of the
 * layers, that a slimmer build brings the lung closer, that an angled needle
 * reaches less deep than a straight one of the same length, and that bone (the
 * shoulder blade, or the arch of a vertebra) stops a needle where it lies
 * between the skin and the lung.
 */
export type Build = "slim" | "average" | "larger";
export type NeedleAngle = "straight" | "angled";
export type LayerId =
  | "skin"
  | "fat"
  | "trapezius"
  | "rhomboid"
  | "erector"
  | "deep-shoulder"
  | "infraspinatus"
  | "multifidus"
  | "scapula"
  | "subscapularis"
  | "lamina"
  | "ribs"
  | "pleura";
export type SiteId = "top-shoulder" | "beside-spine" | "blade-edge" | "blade-centre" | "next-to-spine";

const FAT: Record<Build, number> = { slim: 4, average: 9, larger: 18 };
const MUSCLE: Record<Build, number> = { slim: 0.85, average: 1, larger: 1.1 };
const MUSCLES: ReadonlySet<LayerId> = new Set(["trapezius", "rhomboid", "erector", "deep-shoulder", "infraspinatus", "multifidus", "subscapularis"]);
/** Bone a needle can't pass. */
export const BONE: ReadonlySet<LayerId> = new Set(["scapula", "lamina"]);

export const NEEDLE_LENGTH = 40;
/** An angled needle goes in at 30° from the skin, so its tip reaches half its length deep. */
export const ANGLE_FACTOR: Record<NeedleAngle, number> = { straight: 1, angled: Math.sin(Math.PI / 6) };

export interface Site {
  n: number;
  id: SiteId;
  name: L;
  /** The named acupuncture point here, by its WHO code and Chinese name. */
  acupoint?: { code: string; name: string };
  /** The muscle dry needling aims for here. */
  dryNeedling: L;
  /** Where it is, as the standard locations describe it. */
  where: L;
  /** What lies beneath, in a sentence. */
  under: L;
  /** Layers from the skin down, with thickness for an average build. Fat is set by build. */
  profile: readonly (readonly [LayerId, number])[];
  /** Is the lung under the deepest layer drawn? */
  lungBeneath: boolean;
  /** On the map of the back. */
  at: readonly [number, number];
}

export const SITES: readonly Site[] = [
  {
    n: 1,
    id: "top-shoulder",
    name: { en: "Top of the shoulder", es: "Parte superior del hombro" },
    acupoint: { code: "GB21", name: "Jianjing" },
    dryNeedling: { en: "Upper trapezius", es: "Trapecio superior" },
    where: {
      en: "On top of the shoulder, midway between the spine at C7 and the tip of the shoulder (acromion).",
      es: "En la parte superior del hombro, a medio camino entre la columna en C7 y la punta del hombro (acromion)."
    },
    under: {
      en: "The top of the lung (its apex) rises above the first rib into the base of the neck, beneath this spot. No flat bone covers it from above.",
      es: "La parte superior del pulmón (su vértice) sube por encima de la primera costilla hasta la base del cuello, bajo este punto. Ningún hueso plano lo cubre desde arriba."
    },
    profile: [
      ["skin", 2.5],
      ["fat", 0],
      ["trapezius", 7],
      ["deep-shoulder", 10],
      ["pleura", 1.5]
    ],
    lungBeneath: true,
    at: [201, 54]
  },
  {
    n: 2,
    id: "beside-spine",
    name: { en: "Beside the spine, upper back", es: "Junto a la columna, parte alta de la espalda" },
    acupoint: { code: "BL13", name: "Feishu" },
    dryNeedling: { en: "Erector spinae", es: "Erector de la columna" },
    where: {
      en: "1.5 cun (about two finger-widths) out from the lower edge of the T3 spine.",
      es: "A 1,5 cun (unos dos dedos de ancho) del borde inferior de la apófisis espinosa de D3."
    },
    under: {
      en: "The long back muscles lie over the ribs. Between two ribs, only thin muscle and the pleura cover the lung.",
      es: "Los músculos largos de la espalda están sobre las costillas. Entre dos costillas, solo un músculo fino y la pleura cubren el pulmón."
    },
    profile: [
      ["skin", 2.5],
      ["fat", 0],
      ["trapezius", 5],
      ["rhomboid", 4],
      ["erector", 7],
      ["ribs", 6],
      ["pleura", 1.5]
    ],
    lungBeneath: true,
    at: [168, 86]
  },
  {
    n: 3,
    id: "blade-edge",
    name: { en: "Inner edge of the shoulder blade", es: "Borde interno de la escápula" },
    acupoint: { code: "BL43", name: "Gaohuang" },
    dryNeedling: { en: "Rhomboids", es: "Romboides" },
    where: {
      en: "3 cun out from the lower edge of the T4 spine, on the inner edge of the shoulder blade.",
      es: "A 3 cun del borde inferior de la apófisis espinosa de D4, en el borde interno de la escápula."
    },
    under: {
      en: "Muscle over the ribs, just inside the shoulder blade: the blade itself doesn't cover this spot.",
      es: "Músculo sobre las costillas, justo por dentro de la escápula: la escápula no cubre este punto."
    },
    profile: [
      ["skin", 2.5],
      ["fat", 0],
      ["trapezius", 6],
      ["rhomboid", 9],
      ["ribs", 6],
      ["pleura", 1.5]
    ],
    lungBeneath: true,
    at: [184, 100]
  },
  {
    n: 4,
    id: "blade-centre",
    name: { en: "Middle of the shoulder blade", es: "Centro de la escápula" },
    acupoint: { code: "SI11", name: "Tianzong" },
    dryNeedling: { en: "Infraspinatus", es: "Infraespinoso" },
    where: {
      en: "In the hollow below the shoulder blade's ridge, a third of the way from the ridge to the blade's lower tip.",
      es: "En la fosa por debajo de la espina de la escápula, a un tercio del camino entre la espina y el ángulo inferior."
    },
    under: {
      en: "The flat of the shoulder blade lies between the muscle and the rib cage.",
      es: "La parte plana de la escápula queda entre el músculo y la caja torácica."
    },
    profile: [
      ["skin", 2.5],
      ["fat", 0],
      ["infraspinatus", 9],
      ["scapula", 3],
      ["subscapularis", 6],
      ["ribs", 6],
      ["pleura", 1.5]
    ],
    lungBeneath: true,
    at: [215, 94]
  },
  {
    n: 5,
    id: "next-to-spine",
    name: { en: "Right next to the spine", es: "Pegado a la columna" },
    dryNeedling: { en: "Multifidus", es: "Multífido" },
    where: { en: "About a finger-width out from the spine; shown here at T5.", es: "A un dedo de ancho de la columna; aquí, a la altura de D5." },
    under: {
      en: "The bony arch of the vertebra (the lamina) lies under the muscle. The lung is further out to the side.",
      es: "El arco óseo de la vértebra (la lámina) está bajo el músculo. El pulmón queda más hacia fuera."
    },
    profile: [
      ["skin", 2.5],
      ["fat", 0],
      ["trapezius", 5],
      ["multifidus", 12],
      ["lamina", 8]
    ],
    lungBeneath: false,
    at: [157, 110]
  }
];

/** The site the slice opens on: beside the spine, the commonest spot over the lung. */
export const DEFAULT_SITE: SiteId = "beside-spine";

export function siteById(id: SiteId): Site {
  return SITES.find((s) => s.id === id)!;
}

export function layers(build: Build, site: SiteId = DEFAULT_SITE): { id: LayerId; top: number; bottom: number }[] {
  let y = 0;
  return siteById(site).profile.map(([id, base]) => {
    const t = id === "fat" ? FAT[build] : MUSCLES.has(id) ? base * MUSCLE[build] : base;
    const layer = { id, top: y, bottom: y + t };
    y += t;
    return layer;
  });
}

/** How deep the first bone starts, or Infinity where nothing bony is in the way. */
export function boneDepth(build: Build, site: SiteId = DEFAULT_SITE): number {
  return layers(build, site).find((l) => BONE.has(l.id))?.top ?? Infinity;
}

/**
 * How deep the tip is, in figure units, for a needle pushed `fraction` of its
 * length in. A needle that meets bone goes no further.
 */
export function tipDepth(fraction: number, angle: NeedleAngle, stop = Infinity): number {
  return Math.min(stop, NEEDLE_LENGTH * Math.max(0, Math.min(1, fraction)) * ANGLE_FACTOR[angle]);
}

/** The layer the tip is in. Resting on bone counts as bone; past the pleura it is in the lung. */
export function layerAt(depth: number, build: Build, site: SiteId = DEFAULT_SITE): LayerId | "lung" {
  const ls = layers(build, site);
  for (const l of ls) {
    if (BONE.has(l.id) && depth >= l.top) return l.id;
    if (depth < l.bottom) return l.id;
  }
  return siteById(site).lungBeneath ? "lung" : ls[ls.length - 1]!.id;
}

export const LAYER_NAME: Record<LayerId | "lung", L> = {
  skin: { en: "Skin", es: "Piel" },
  fat: { en: "Fat", es: "Grasa" },
  trapezius: { en: "Trapezius muscle", es: "Músculo trapecio" },
  rhomboid: { en: "Rhomboid muscles", es: "Músculos romboides" },
  erector: { en: "Erector spinae (long back muscles)", es: "Erector de la columna (músculos largos de la espalda)" },
  "deep-shoulder": { en: "Deeper shoulder muscles", es: "Músculos profundos del hombro" },
  infraspinatus: { en: "Infraspinatus muscle", es: "Músculo infraespinoso" },
  multifidus: { en: "Multifidus muscle", es: "Músculo multífido" },
  scapula: { en: "Shoulder blade (bone)", es: "Escápula (hueso)" },
  subscapularis: { en: "Subscapularis muscle", es: "Músculo subescapular" },
  lamina: { en: "Arch of the vertebra (bone)", es: "Arco de la vértebra (hueso)" },
  ribs: { en: "Ribs and the muscles between them", es: "Costillas y músculos intercostales" },
  pleura: { en: "Pleura (the lung's lining)", es: "Pleura (la membrana del pulmón)" },
  lung: { en: "Lung", es: "Pulmón" }
};

export type NeedleRisk = "shallow" | "target" | "bone" | "close" | "danger";

export function riskAt(layer: LayerId | "lung"): NeedleRisk {
  if (layer === "skin" || layer === "fat") return "shallow";
  if (BONE.has(layer as LayerId)) return "bone";
  if (layer === "ribs") return "close";
  if (layer === "pleura" || layer === "lung") return "danger";
  return "target";
}

export const RISK_TEXT: Record<NeedleRisk, { name: L; text: L }> = {
  shallow: {
    name: { en: "Shallow", es: "Superficial" },
    text: { en: "Under the skin, above the muscle.", es: "Bajo la piel, por encima del músculo." }
  },
  target: {
    name: { en: "In the muscle", es: "En el músculo" },
    text: { en: "Where acupuncture and dry needling usually aim over the upper back.", es: "Donde suelen apuntar la acupuntura y la punción seca en la parte alta de la espalda." }
  },
  bone: {
    name: { en: "Stopped by bone", es: "Detenida por hueso" },
    text: {
      en: "The tip has met bone, which lies between the needle and what is deeper. Pushing harder doesn't take it further.",
      es: "La punta ha llegado al hueso, que queda entre la aguja y lo más profundo. Empujar más no la hace avanzar."
    }
  },
  close: {
    name: { en: "Close to the lung", es: "Cerca del pulmón" },
    text: { en: "At the rib cage: only the pleura lies between here and the lung.", es: "En la caja torácica: solo la pleura separa este punto del pulmón." }
  },
  danger: {
    name: { en: "Risk of a punctured lung", es: "Riesgo de perforar el pulmón" },
    text: {
      en: "A punctured lung (pneumothorax) is rare, but it is the serious harm reported most for needling here. Sudden chest pain or breathlessness after needling needs urgent care.",
      es: "La perforación del pulmón (neumotórax) es rara, pero es el daño grave más descrito al pinchar en esta zona. Un dolor torácico repentino o falta de aire tras la punción requiere atención urgente."
    }
  }
};

export const NEEDLE_COPY = {
  sites: { en: "Where the needle goes", es: "Dónde entra la aguja" },
  map: { en: "Back of the upper body: the lung field, the shoulder blades and five needling sites", es: "Espalda: el campo pulmonar, las escápulas y cinco puntos de punción" },
  lungField: { en: "Lung, beneath the ribs", es: "Pulmón, bajo las costillas" },
  blade: { en: "Shoulder blade", es: "Escápula" },
  acupoint: { en: "Acupuncture point", es: "Punto de acupuntura" },
  noAcupoint: { en: "Not a classical point", es: "No es un punto clásico" },
  dryNeedling: { en: "Dry needling aims for", es: "La punción seca apunta a" },
  where: { en: "Where it is", es: "Dónde está" },
  under: { en: "What's underneath", es: "Qué hay debajo" },
  bothSides: { en: "Each site has a twin on the other side.", es: "Cada punto tiene su par en el otro lado." },
  build: { en: "Build", es: "Complexión" },
  builds: {
    slim: { en: "Slim", es: "Delgada" },
    average: { en: "Average", es: "Media" },
    larger: { en: "Larger", es: "Más corpulenta" }
  },
  angle: { en: "Needle", es: "Aguja" },
  angles: {
    straight: { en: "Straight in", es: "Perpendicular" },
    angled: { en: "Angled", es: "Inclinada" }
  },
  depth: { en: "How far in", es: "Cuánto entra" },
  tip: { en: "The tip is in:", es: "La punta está en:" },
  figure: { en: "Slice through the upper back with a needle", es: "Corte de la parte alta de la espalda con una aguja" },
  schematic: { en: "Schematic: layer thicknesses vary from person to person.", es: "Esquema: el grosor de las capas varía de una persona a otra." }
} as const;

export const NEEDLE_SOURCES: readonly SourceId[] = ["white2004", "gattie2017", "who2008", "standring2020"];
