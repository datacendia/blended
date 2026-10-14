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
  skin: { en: "Skin", es: "Piel" },
  vessels: { en: "Small blood vessels", es: "Vasos sanguíneos pequeños" },
  muscle: { en: "Muscle", es: "Músculo" },
  cup: { en: "Cup", es: "Ventosa" },
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

export const CUPPING_SOURCES: readonly SourceId[] = ["cao2012"];
