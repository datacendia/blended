import type { L } from "../i18n";
import type { SourceId } from "../sources";

/**
 * A reflexology chart checked against the nerves of the sole. Charts draw
 * the body across the foot in horizontal bands: head in the toes, chest in
 * the ball, gut in the arch, pelvis in the heel. The nerves that carry
 * feeling from that skin run the other way, lengthwise: an inner (medial
 * plantar) and an outer (lateral plantar) half, the heel's own branches, and
 * the saphenous nerve along the inner edge. Every one of them enters the
 * spinal cord between L3 and S2, in the low back.
 *
 * Right foot, seen from below, toes up, big toe on the left. Charts differ
 * in detail; these are the zones most of them share.
 */
export type ZoneId = "toes" | "big-toe" | "big-toe-base" | "ball" | "upper-arch" | "lower-arch" | "heel" | "inner-edge";
export type NerveId = "medial-plantar" | "lateral-plantar" | "calcaneal" | "saphenous";

export const NERVES: Record<NerveId, { name: L; short: L; roots: string }> = {
  "medial-plantar": { name: { en: "Medial plantar nerve (inner sole)", es: "Nervio plantar medial (planta interna)" }, short: { en: "Medial plantar", es: "Plantar medial" }, roots: "L4-L5" },
  "lateral-plantar": { name: { en: "Lateral plantar nerve (outer sole)", es: "Nervio plantar lateral (planta externa)" }, short: { en: "Lateral plantar", es: "Plantar lateral" }, roots: "S1-S2" },
  calcaneal: { name: { en: "Calcaneal branches of the tibial nerve (heel)", es: "Ramas calcáneas del nervio tibial (talón)" }, short: { en: "Heel branches", es: "Ramas del talón" }, roots: "S1-S2" },
  saphenous: { name: { en: "Saphenous nerve (inner edge)", es: "Nervio safeno (borde interno)" }, short: { en: "Saphenous", es: "Safeno" }, roots: "L3-L4" }
};

export const ZONES: readonly { id: ZoneId; claim: L; short: L; nerves: NerveId[] }[] = [
  { id: "big-toe", claim: { en: "Head and brain", es: "Cabeza y cerebro" }, short: { en: "Head", es: "Cabeza" }, nerves: ["medial-plantar"] },
  { id: "big-toe-base", claim: { en: "Neck", es: "Cuello" }, short: { en: "Neck", es: "Cuello" }, nerves: ["medial-plantar"] },
  { id: "toes", claim: { en: "Sinuses, eyes and ears", es: "Senos nasales, ojos y oídos" }, short: { en: "Sinuses", es: "Senos" }, nerves: ["medial-plantar", "lateral-plantar"] },
  { id: "ball", claim: { en: "Lungs and chest", es: "Pulmones y pecho" }, short: { en: "Chest", es: "Pecho" }, nerves: ["medial-plantar", "lateral-plantar"] },
  { id: "upper-arch", claim: { en: "Liver, gallbladder and stomach", es: "Hígado, vesícula y estómago" }, short: { en: "Stomach", es: "Estómago" }, nerves: ["medial-plantar", "lateral-plantar"] },
  { id: "lower-arch", claim: { en: "Intestines", es: "Intestinos" }, short: { en: "Intestines", es: "Intestinos" }, nerves: ["medial-plantar", "lateral-plantar"] },
  { id: "heel", claim: { en: "Pelvis, hips and lower back", es: "Pelvis, caderas y zona lumbar" }, short: { en: "Pelvis", es: "Pelvis" }, nerves: ["calcaneal"] },
  { id: "inner-edge", claim: { en: "The spine", es: "La columna" }, short: { en: "Spine", es: "Columna" }, nerves: ["saphenous", "medial-plantar"] }
];

export const FOOT_COPY = {
  mode: { en: "Show", es: "Mostrar" },
  zones: { en: "Zones", es: "Zonas" },
  modes: {
    chart: { en: "What the chart says", es: "Lo que dice el mapa" },
    nerves: { en: "What the nerves say", es: "Lo que dicen los nervios" }
  },
  chartSays: { en: "The chart says this spot is linked to", es: "El mapa dice que este punto está ligado a" },
  nervesSay: { en: "The skin here is supplied by", es: "La piel de aquí la inerva" },
  enters: { en: "enters the spinal cord at {roots}", es: "entra en la médula espinal en {roots}" },
  summary: {
    en: "Every nerve from the sole enters the spinal cord between L3 and S2, in the low back. None runs to the neck, the lungs or the stomach. A foot massage can be relaxing; it can't reach those organs.",
    es: "Todos los nervios de la planta entran en la médula entre L3 y S2, en la zona lumbar. Ninguno va al cuello, los pulmones o el estómago. Un masaje de pies puede relajar; no puede llegar a esos órganos."
  },
  neckNote: {
    en: "The chart's 'neck' is wired to the low back, L4-L5, like the rest of the big toe.",
    es: "El 'cuello' del mapa está conectado a la zona lumbar, L4-L5, como el resto del dedo gordo."
  },
  chartCaveat: { en: "A typical chart: charts differ in the details.", es: "Un mapa típico: los mapas difieren en los detalles." },
  figure: { en: "Sole of the right foot, toes up", es: "Planta del pie derecho, dedos hacia arriba" },
  evidence: {
    en: "A systematic review found no convincing evidence that reflexology treats any medical condition.",
    es: "Una revisión sistemática no encontró evidencia convincente de que la reflexología trate ninguna enfermedad."
  }
} as const;

export const FOOT_SOURCES: readonly SourceId[] = ["ernst2009", "standring2020"];
