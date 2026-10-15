import type { L } from "../i18n";
import type { SourceId } from "../sources";

/**
 * Why cupping leaves round marks. Suction lifts the skin into the cup and
 * the small blood vessels just under it break, so blood leaks into the skin:
 * a bruise. Stronger suction and longer cups mean more of them break. The
 * scale is a schematic of that direction, not a dose.
 */
export type Suction = "light" | "medium" | "strong";
export type MarkLevel = "none" | "pink" | "red" | "purple";

const SUCTION: Record<Suction, number> = { light: 1, medium: 2, strong: 3 };

/** Minutes the cup stays on: the slider's range. */
export const MINUTES = { min: 1, max: 15 } as const;

/** 0 to 1: how many of the drawn vessels have broken. */
export function bruising(suction: Suction, minutes: number): number {
  const t = Math.max(0, Math.min(1, (minutes - MINUTES.min) / (MINUTES.max - MINUTES.min)));
  return Math.min(1, (SUCTION[suction] / 3) * (0.25 + 0.75 * t));
}

export function markLevel(b: number): MarkLevel {
  if (b < 0.15) return "none";
  if (b < 0.4) return "pink";
  if (b < 0.7) return "red";
  return "purple";
}

/**
 * Roughly how many days each mark takes to fade, read off the descriptions
 * below: about a day for pink, several days for red, a week or more for dark
 * purple. Only the order and rough size are meant; people vary.
 */
export const FADE_DAYS: Record<MarkLevel, number> = { none: 0, pink: 1.5, red: 5, purple: 10 };
export const DAYS_MAX = 14;

/** 1 when the cups have just come off, falling to 0 once the mark has faded. */
export function markStrength(level: MarkLevel, days: number): number {
  if (level === "none") return 0;
  return Math.max(0, Math.min(1, 1 - days / FADE_DAYS[level]));
}

export const MARK_LEVELS: readonly MarkLevel[] = ["none", "pink", "red", "purple"];
export const MARK_NAME: Record<MarkLevel, L> = {
  none: { en: "No mark", es: "Sin marca" },
  pink: { en: "Pink", es: "Rosada" },
  red: { en: "Red", es: "Roja" },
  purple: { en: "Dark purple", es: "Morada oscura" }
};

export type CupSiteId = "shoulder-top" | "upper-back" | "blades" | "mid-back" | "low-back";

/** Where cups commonly go on the back, drawn on the person's right and mirrored to the left. */
export const CUP_SITES: readonly { id: CupSiteId; name: L; under: L; at: readonly [number, number] }[] = [
  {
    id: "shoulder-top",
    name: { en: "Top of the shoulders", es: "Parte superior de los hombros" },
    under: { en: "Upper trapezius", es: "Trapecio superior" },
    at: [204, 60]
  },
  {
    id: "upper-back",
    name: { en: "Between the shoulder blades", es: "Entre las escápulas" },
    under: { en: "Rhomboids and the long back muscles", es: "Romboides y músculos largos de la espalda" },
    at: [172, 96]
  },
  {
    id: "blades",
    name: { en: "Over the shoulder blades", es: "Sobre las escápulas" },
    under: { en: "Infraspinatus, over the flat of the shoulder blade", es: "Infraespinoso, sobre la parte plana de la escápula" },
    at: [218, 112]
  },
  {
    id: "mid-back",
    name: { en: "Middle of the back", es: "Mitad de la espalda" },
    under: { en: "The long back muscles beside the spine", es: "Los músculos largos junto a la columna" },
    at: [174, 158]
  },
  {
    id: "low-back",
    name: { en: "Low back", es: "Zona lumbar" },
    under: { en: "The long back muscles of the low back", es: "Los músculos largos de la zona lumbar" },
    at: [176, 228]
  }
];

export const MARK_TEXT: Record<MarkLevel, L> = {
  none: { en: "Little or no mark: few vessels have broken.", es: "Poca o ninguna marca: se han roto pocos vasos." },
  pink: { en: "A faint pink ring that fades within a day or so.", es: "Un anillo rosado tenue que se va en un día o así." },
  red: { en: "A red circle: blood has leaked from broken vessels. It fades over several days.", es: "Un círculo rojo: ha salido sangre de vasos rotos. Se va en varios días." },
  purple: {
    en: "A dark purple circle: many vessels have broken. It's a bruise, and it can take a week or more to fade.",
    es: "Un círculo morado oscuro: se han roto muchos vasos. Es un moretón, y puede tardar una semana o más en irse."
  }
};

export const CUPPING_COPY = {
  suction: { en: "Suction", es: "Succión" },
  suctions: {
    light: { en: "Light", es: "Suave" },
    medium: { en: "Medium", es: "Media" },
    strong: { en: "Strong", es: "Fuerte" }
  },
  minutes: { en: "Time with the cup on: {n} min", es: "Tiempo con la ventosa: {n} min" },
  wet: { en: "Wet cupping (small cuts first)", es: "Ventosa húmeda (pequeños cortes antes)" },
  epidermis: { en: "Outer skin", es: "Epidermis" },
  dermis: { en: "Inner skin", es: "Dermis" },
  fat: { en: "Fat", es: "Grasa" },
  fascia: { en: "Fascia", es: "Fascia" },
  muscle: { en: "Muscle", es: "Músculo" },
  cup: { en: "Cup", es: "Ventosa" },
  petechiae: { en: "Pinpoint bleeds", es: "Puntos de sangrado" },
  bruise: { en: "Blood spread in the skin: a bruise", es: "Sangre extendida en la piel: un moretón" },
  after: { en: "After the cups come off", es: "Después de quitar las ventosas" },
  days: { en: "Days later: {n}", es: "Días después: {n}" },
  justOff: { en: "Just taken off", es: "Recién quitadas" },
  sitesHint: { en: "Tap a spot to add or remove its pair of cups.", es: "Toca un punto para poner o quitar su par de ventosas." },
  back: { en: "Back with cupping marks", es: "Espalda con marcas de ventosas" },
  scale: { en: "The mark scale", es: "La escala de marcas" },
  fadeNote: {
    en: "Fading follows the same course as any bruise: the darker the mark, the longer it lasts.",
    es: "Se borra igual que cualquier moretón: cuanto más oscura la marca, más dura."
  },
  under: { en: "Under the cup", es: "Bajo la ventosa" },
  figure: { en: "Slice through the skin under a cup", es: "Corte de la piel bajo una ventosa" },
  toxins: {
    en: "The colour is blood from broken vessels, not toxins being drawn out. How dark it gets says how much suction and time there was, not how 'stagnant' you were.",
    es: "El color es sangre de vasos rotos, no toxinas que salen. Lo oscura que sea depende de cuánta succión y tiempo hubo, no de lo 'estancado' que estuvieras."
  },
  wetNote: {
    en: "Wet cupping draws blood through the cuts: it needs sterile, single-use blades, and it can cause infection.",
    es: "La ventosa húmeda saca sangre por los cortes: necesita cuchillas estériles de un solo uso, y puede causar infección."
  },
  evidence: {
    en: "Many small trials report less pain, but most are low quality, so whether cupping works is still unclear.",
    es: "Muchos ensayos pequeños describen menos dolor, pero la mayoría son de baja calidad, así que aún no está claro si las ventosas funcionan."
  }
} as const;

export const CUPPING_SOURCES: readonly SourceId[] = ["cao2012", "standring2020"];
