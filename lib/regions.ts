import type { L } from "./i18n";
import { rootById } from "./roots";

/**
 * Body regions a person can tap, and the nerve roots that usually supply them.
 *
 * This maps skin areas (dermatomes) to roots. Dermatome maps disagree with each
 * other at the edges and overlap in real people, so every result is phrased as
 * "commonly associated with", never as a diagnosis. Numbness and tingling map
 * far more precisely than pain, which is often referred — the scoring reflects
 * that rather than pretending a sore shoulder blade names a root.
 */
export type MapView = "front" | "back" | "hand";
export type Side = "L" | "R" | "C";
export type Symptom = "pain" | "numbness" | "tingling" | "weakness";

export const SYMPTOMS: readonly { id: Symptom; label: L }[] = [
  { id: "pain", label: { en: "Pain", es: "Dolor" } },
  { id: "numbness", label: { en: "Numbness", es: "Adormecimiento" } },
  { id: "tingling", label: { en: "Tingling / pins and needles", es: "Hormigueo" } },
  { id: "weakness", label: { en: "Weakness", es: "Debilidad" } }
];

export interface BodyRegion {
  id: string;
  view: MapView;
  label: L;
  /** [rootId, weight]: 1 = the usual root for this area, 0.5 = often shares it. */
  roots: readonly (readonly [string, number])[];
  /** Pain here is usually referred or local, not a dermatome. */
  referred?: boolean;
  /** Not supplied by a spinal root at all. */
  notSpinal?: boolean;
  emergency?: boolean;
  limb?: "arm" | "leg";
  note?: L;
}

export const REGIONS: readonly BodyRegion[] = [
  // ── Front ──────────────────────────────────────────────────────────────
  {
    id: "face", view: "front", roots: [], notSpinal: true,
    label: { en: "Face", es: "Cara" },
    note: {
      en: "The face is supplied by a cranial nerve (the trigeminal), not a spinal root. Sudden facial numbness is a stroke warning sign.",
      es: "La cara depende de un nervio craneal (el trigémino), no de una raíz espinal. Un adormecimiento repentino de la cara es un signo de alarma de ictus."
    }
  },
  { id: "neck-front", view: "front", roots: [["C3", 1], ["C2", 0.5]], label: { en: "Front and side of neck", es: "Parte delantera y lateral del cuello" } },
  { id: "shoulder-top", view: "front", roots: [["C4", 1]], label: { en: "Top of the shoulder", es: "Parte superior del hombro" } },
  { id: "upper-chest", view: "front", roots: [["T2", 1], ["T3", 0.5], ["C4", 0.5]], label: { en: "Upper chest", es: "Parte alta del pecho" } },
  {
    id: "chest", view: "front", roots: [["T4", 1], ["T3", 0.5], ["T5", 0.5]],
    label: { en: "Chest (nipple level)", es: "Pecho (altura del pezón)" },
    note: {
      en: "Chest pain or pressure is a heart problem until proven otherwise. Get it checked first.",
      es: "El dolor u opresión en el pecho es un problema cardiaco hasta que se demuestre lo contrario. Revísalo primero."
    }
  },
  { id: "upper-abdomen", view: "front", roots: [["T7", 1], ["T8", 1], ["T6", 0.5], ["T9", 0.5]], label: { en: "Upper abdomen", es: "Abdomen alto" } },
  { id: "navel", view: "front", roots: [["T10", 1], ["T9", 0.5], ["T11", 0.5]], label: { en: "Belly-button band", es: "Franja del ombligo" } },
  { id: "lower-abdomen", view: "front", roots: [["T11", 1], ["T12", 1]], label: { en: "Lower abdomen", es: "Abdomen bajo" } },
  { id: "groin", view: "front", roots: [["L1", 1], ["T12", 0.5]], label: { en: "Groin", es: "Ingle" } },
  { id: "outer-upper-arm", view: "front", limb: "arm", roots: [["C5", 1]], label: { en: "Outer upper arm", es: "Cara externa del brazo" } },
  { id: "inner-upper-arm", view: "front", limb: "arm", roots: [["T1", 1], ["T2", 1]], label: { en: "Inner upper arm and armpit", es: "Cara interna del brazo y axila" } },
  { id: "outer-forearm", view: "front", limb: "arm", roots: [["C6", 1], ["C5", 0.5]], label: { en: "Outer (thumb-side) forearm", es: "Antebrazo, lado del pulgar" } },
  { id: "inner-forearm", view: "front", limb: "arm", roots: [["C8", 1], ["T1", 1]], label: { en: "Inner (little-finger-side) forearm", es: "Antebrazo, lado del meñique" } },
  {
    id: "hand", view: "front", limb: "arm", roots: [["C6", 0.5], ["C7", 0.5], ["C8", 0.5]],
    label: { en: "Hand", es: "Mano" },
    note: { en: "Open the hand view: which fingers matters more than anything else here.", es: "Abre la vista de la mano: qué dedos es lo que más importa aquí." }
  },
  { id: "upper-thigh", view: "front", limb: "leg", roots: [["L2", 1], ["L1", 0.5]], label: { en: "Upper front thigh", es: "Parte alta delantera del muslo" } },
  { id: "lower-thigh", view: "front", limb: "leg", roots: [["L3", 1], ["L2", 0.5], ["L4", 0.5]], label: { en: "Lower thigh and inner knee", es: "Parte baja del muslo y cara interna de la rodilla" } },
  { id: "inner-shin", view: "front", limb: "leg", roots: [["L4", 1]], label: { en: "Inner shin and ankle", es: "Cara interna de la pierna y tobillo" } },
  { id: "outer-shin", view: "front", limb: "leg", roots: [["L5", 1]], label: { en: "Outer shin", es: "Cara externa de la pierna" } },
  { id: "foot-top", view: "front", limb: "leg", roots: [["L5", 1], ["L4", 0.5]], label: { en: "Top of foot and big toe", es: "Dorso del pie y dedo gordo" } },
  { id: "outer-foot", view: "front", limb: "leg", roots: [["S1", 1]], label: { en: "Outer foot and little toe", es: "Borde externo del pie y dedo pequeño" } },

  // ── Back ───────────────────────────────────────────────────────────────
  { id: "occiput", view: "back", roots: [["C2", 1]], label: { en: "Back of the head", es: "Nuca y parte posterior de la cabeza" } },
  { id: "back-of-neck", view: "back", roots: [["C3", 1], ["C4", 0.5]], label: { en: "Back of the neck", es: "Parte posterior del cuello" } },
  { id: "upper-trapezius", view: "back", roots: [["C4", 1], ["C5", 0.5]], label: { en: "Between neck and shoulder", es: "Entre el cuello y el hombro" } },
  {
    id: "shoulder-blade", view: "back", referred: true, roots: [["C7", 1], ["C6", 0.5], ["C8", 0.5]],
    label: { en: "Shoulder blade", es: "Omóplato (escápula)" },
    note: {
      en: "Pain along or between the shoulder blades is often referred from a lower-neck root or joint — many people with a trapped neck nerve feel it here before the arm.",
      es: "El dolor en o entre los omóplatos suele ser referido desde una raíz o articulación del cuello bajo: muchas personas con un nervio atrapado en el cuello lo sienten aquí antes que en el brazo."
    }
  },
  { id: "back-upper-arm", view: "back", limb: "arm", roots: [["C5", 0.5], ["C7", 0.5]], label: { en: "Back of the upper arm", es: "Parte posterior del brazo" } },
  { id: "back-forearm", view: "back", limb: "arm", roots: [["C7", 1], ["C6", 0.5], ["C8", 0.5]], label: { en: "Back of the forearm", es: "Parte posterior del antebrazo" } },
  {
    id: "mid-back", view: "back", referred: true, roots: [["T5", 0.5], ["T6", 0.5], ["T7", 0.5]],
    label: { en: "Mid back", es: "Espalda media" },
    note: {
      en: "Mid-back pain usually comes from joints and muscles rather than a nerve root.",
      es: "El dolor de espalda media suele venir de articulaciones y músculos, no de una raíz nerviosa."
    }
  },
  {
    id: "low-back", view: "back", referred: true, roots: [],
    label: { en: "Low back", es: "Zona lumbar" },
    note: {
      en: "Low-back pain on its own is not a nerve-root sign. Leg symptoms below the knee are what point to a root (sciatica).",
      es: "El dolor lumbar por sí solo no es un signo de raíz nerviosa. Lo que apunta a una raíz son los síntomas en la pierna por debajo de la rodilla (ciática)."
    }
  },
  {
    id: "buttock", view: "back", referred: true, roots: [["S1", 0.5], ["L5", 0.5], ["S2", 0.5]],
    label: { en: "Buttock", es: "Glúteo" },
    note: {
      en: "Buttock pain can come from the low-back joints, the sacroiliac joint, the hip or a nerve root.",
      es: "El dolor de glúteo puede venir de las articulaciones lumbares, la articulación sacroilíaca, la cadera o una raíz nerviosa."
    }
  },
  { id: "back-thigh", view: "back", limb: "leg", roots: [["S2", 1], ["S1", 0.5]], label: { en: "Back of the thigh", es: "Parte posterior del muslo" } },
  { id: "calf", view: "back", limb: "leg", roots: [["S1", 1], ["S2", 0.5]], label: { en: "Calf", es: "Pantorrilla" } },
  { id: "heel", view: "back", limb: "leg", roots: [["S1", 1]], label: { en: "Heel and sole", es: "Talón y planta" } },
  {
    id: "saddle", view: "back", emergency: true, roots: [["S3", 1], ["S4", 1], ["S5", 0.5]],
    label: { en: "Saddle area (between the legs)", es: "Zona del sillín (entre las piernas)" },
    note: {
      en: "New numbness here, especially with bladder or bowel changes, is an emergency: go to an emergency department now.",
      es: "Un adormecimiento nuevo aquí, sobre todo con cambios en la vejiga o el intestino, es una emergencia: acude a urgencias ahora."
    }
  },

  // ── Hand (palm up, as you look at your own hand) ───────────────────────
  { id: "thumb", view: "hand", limb: "arm", roots: [["C6", 1]], label: { en: "Thumb", es: "Pulgar" } },
  { id: "index", view: "hand", limb: "arm", roots: [["C6", 1], ["C7", 0.5]], label: { en: "Index finger", es: "Índice" } },
  { id: "middle", view: "hand", limb: "arm", roots: [["C7", 1]], label: { en: "Middle finger", es: "Dedo medio" } },
  { id: "ring", view: "hand", limb: "arm", roots: [["C8", 1], ["C7", 0.5]], label: { en: "Ring finger", es: "Anular" } },
  { id: "little", view: "hand", limb: "arm", roots: [["C8", 1]], label: { en: "Little finger", es: "Meñique" } },
  { id: "palm-thumb-side", view: "hand", limb: "arm", roots: [["C6", 1]], label: { en: "Palm, thumb side", es: "Palma, lado del pulgar" } },
  { id: "palm-centre", view: "hand", limb: "arm", roots: [["C7", 1], ["C6", 0.5]], label: { en: "Centre of palm", es: "Centro de la palma" } },
  { id: "palm-little-side", view: "hand", limb: "arm", roots: [["C8", 1]], label: { en: "Palm, little-finger side", es: "Palma, lado del meñique" } }
];

export function regionById(id: string): BodyRegion | undefined {
  return REGIONS.find((r) => r.id === id);
}

/** A tapped area: region id plus which side of the body. */
export interface Pick {
  region: string;
  side: Side;
}

export function pickKey(p: Pick): string {
  return `${p.region}|${p.side}`;
}

export function parsePickKey(key: string): Pick | undefined {
  const [region, side] = key.split("|");
  if (!region || (side !== "L" && side !== "R" && side !== "C")) return undefined;
  return { region, side };
}

export interface RootMatch {
  rootId: string;
  score: number;
  regions: string[];
  fit: "strong" | "fits" | "weak";
}

/**
 * Rank roots by how well the tapped areas fit their usual territory.
 *
 * Pain alone is discounted to 0.6: a dermatome describes where skin sensation
 * comes from, and pain is the symptom most often felt away from its source.
 * Weakness doesn't change the ranking (it maps to muscles, not skin) — it
 * changes the advice instead.
 */
export function matchRoots(picks: readonly Pick[], symptoms: readonly Symptom[]): RootMatch[] {
  const sensory = symptoms.includes("numbness") || symptoms.includes("tingling");
  const factor = sensory ? 1 : 0.6;
  const totals = new Map<string, { score: number; regions: Set<string> }>();
  const seen = new Set<string>();

  for (const pick of picks) {
    // Both sides of the same region describe one territory, not two.
    if (seen.has(pick.region)) continue;
    seen.add(pick.region);
    const region = regionById(pick.region);
    if (!region) continue;
    for (const [rootId, weight] of region.roots) {
      const entry = totals.get(rootId) ?? { score: 0, regions: new Set<string>() };
      entry.score += weight * factor;
      entry.regions.add(region.id);
      totals.set(rootId, entry);
    }
  }

  return [...totals.entries()]
    .map(([rootId, { score, regions }]) => ({
      rootId,
      score: Math.round(score * 100) / 100,
      regions: [...regions],
      fit: score >= 1.5 ? ("strong" as const) : score >= 0.9 ? ("fits" as const) : ("weak" as const)
    }))
    .sort((a, b) => b.score - a.score || rootOrder(a.rootId) - rootOrder(b.rootId));
}

function rootOrder(id: string): number {
  const order = ["C", "T", "L", "S"];
  const letter = order.indexOf(id[0] ?? "");
  return letter * 100 + Number(id.slice(1));
}

export type AdviceLevel = "emergency" | "urgent" | "note";

export interface Advice {
  id: string;
  level: AdviceLevel;
  text: L;
}

export function mapAdvice(picks: readonly Pick[], symptoms: readonly Symptom[]): Advice[] {
  const advice: Advice[] = [];
  const regions = picks.map((p) => regionById(p.region)).filter((r): r is BodyRegion => Boolean(r));

  if (regions.some((r) => r.emergency) && (symptoms.includes("numbness") || symptoms.includes("tingling"))) {
    advice.push({
      id: "saddle",
      level: "emergency",
      text: {
        en: "Numbness in the saddle area can mean the nerves to the bladder and bowel are being compressed (cauda equina syndrome). Go to an emergency department now.",
        es: "El adormecimiento en la zona del sillín puede significar que se están comprimiendo los nervios de la vejiga y el intestino (síndrome de cola de caballo). Acude a urgencias ahora."
      }
    });
  }

  const limbSides = (limb: "arm" | "leg") =>
    new Set(picks.filter((p) => regionById(p.region)?.limb === limb && p.side !== "C").map((p) => p.side));
  const bothArms = limbSides("arm").size === 2;
  const bothLegs = limbSides("leg").size === 2;
  if (bothArms || bothLegs) {
    advice.push({
      id: "bilateral",
      level: "urgent",
      text: {
        en: `Symptoms in both ${bothArms ? "arms" : "legs"} are not the usual pattern of one trapped root. They can mean the spinal cord${bothLegs ? " or cauda equina" : ""} is involved. See a doctor promptly; if it came on suddenly or with bladder or bowel changes, go to an emergency department.`,
        es: `Los síntomas en ${bothArms ? "ambos brazos" : "ambas piernas"} no son el patrón habitual de una sola raíz atrapada. Pueden significar que está implicada la médula espinal${bothLegs ? " o la cola de caballo" : ""}. Consulta a un médico pronto; si empezó de golpe o con cambios en la vejiga o el intestino, acude a urgencias.`
      }
    });
  }

  if (symptoms.includes("weakness")) {
    advice.push({
      id: "weakness",
      level: "urgent",
      text: {
        en: "Weakness means the nerve's motor fibres are affected. It needs a proper neurological examination soon — and urgently if it is getting worse.",
        es: "La debilidad significa que las fibras motoras del nervio están afectadas. Necesita una exploración neurológica adecuada pronto, y con urgencia si está empeorando."
      }
    });
  }

  if (picks.length > 0 && symptoms.length > 0 && !symptoms.some((s) => s !== "pain")) {
    advice.push({
      id: "pain-only",
      level: "note",
      text: {
        en: "Pain alone maps less precisely than numbness or tingling, so these matches are weaker.",
        es: "El dolor por sí solo se localiza con menos precisión que el adormecimiento o el hormigueo, así que estas coincidencias son más débiles."
      }
    });
  }

  for (const region of regions) {
    if (region.note && !advice.some((a) => a.id === `region-${region.id}`)) {
      advice.push({ id: `region-${region.id}`, level: region.emergency ? "urgent" : "note", text: region.note });
    }
  }

  return advice;
}

/** Which exam checklist fits the strongest match. */
export function examFor(matches: readonly RootMatch[]): "cervical" | "lumbar" | null {
  const top = matches[0];
  if (!top) return null;
  const region = rootById(top.rootId)?.region;
  if (region === "cervical" || top.rootId === "T1") return "cervical";
  if (region === "lumbar" || region === "sacral") return "lumbar";
  return null;
}
