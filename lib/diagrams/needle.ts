import type { L } from "../i18n";
import type { SourceId } from "../sources";

/**
 * A schematic slice through the upper back, between the spine and the
 * shoulder blade, where acupuncture and dry needling often go. The rarest
 * serious harm from both is a punctured lung, so the slice ends at the
 * pleura (the lung's lining).
 *
 * Thicknesses are in figure units, not centimetres: real depths vary too much
 * between people to print. What the figure gets right is the order of the
 * layers, that a slimmer build brings the lung closer, and that an angled
 * needle reaches less deep than a straight one of the same length.
 */
export type Build = "slim" | "average" | "larger";
export type NeedleAngle = "straight" | "angled";
export type LayerId = "skin" | "fat" | "trapezius" | "deep-muscle" | "ribs" | "pleura";

const FAT: Record<Build, number> = { slim: 4, average: 9, larger: 18 };
const MUSCLE: Record<Build, number> = { slim: 0.85, average: 1, larger: 1.1 };

export const NEEDLE_LENGTH = 40;
/** An angled needle goes in at 30° from the skin, so its tip reaches half its length deep. */
export const ANGLE_FACTOR: Record<NeedleAngle, number> = { straight: 1, angled: Math.sin(Math.PI / 6) };

export function layers(build: Build): { id: LayerId; top: number; bottom: number }[] {
  const thick: [LayerId, number][] = [
    ["skin", 2.5],
    ["fat", FAT[build]],
    ["trapezius", 7 * MUSCLE[build]],
    ["deep-muscle", 8 * MUSCLE[build]],
    ["ribs", 6],
    ["pleura", 1.5]
  ];
  let y = 0;
  return thick.map(([id, t]) => {
    const layer = { id, top: y, bottom: y + t };
    y += t;
    return layer;
  });
}

/** How deep the tip is, in figure units, for a needle pushed `fraction` of its length in. */
export function tipDepth(fraction: number, angle: NeedleAngle): number {
  return NEEDLE_LENGTH * Math.max(0, Math.min(1, fraction)) * ANGLE_FACTOR[angle];
}

/** The layer the tip is in; past the pleura it is in the lung. */
export function layerAt(depth: number, build: Build): LayerId | "lung" {
  for (const l of layers(build)) if (depth <= l.bottom) return l.id;
  return "lung";
}

export const LAYER_NAME: Record<LayerId | "lung", L> = {
  skin: { en: "Skin", es: "Piel" },
  fat: { en: "Fat", es: "Grasa" },
  trapezius: { en: "Trapezius muscle", es: "Músculo trapecio" },
  "deep-muscle": { en: "Deeper back muscles", es: "Músculos profundos de la espalda" },
  ribs: { en: "Ribs and the muscles between them", es: "Costillas y músculos intercostales" },
  pleura: { en: "Pleura (the lung's lining)", es: "Pleura (la membrana del pulmón)" },
  lung: { en: "Lung", es: "Pulmón" }
};

export type NeedleRisk = "shallow" | "target" | "close" | "danger";

export function riskAt(layer: LayerId | "lung"): NeedleRisk {
  if (layer === "skin" || layer === "fat") return "shallow";
  if (layer === "trapezius" || layer === "deep-muscle") return "target";
  if (layer === "ribs") return "close";
  return "danger";
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

export const NEEDLE_SOURCES: readonly SourceId[] = ["white2004", "gattie2017"];
