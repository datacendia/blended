import type { L } from "../i18n";
import type { SourceId } from "../sources";
import { opening, OPENING, type Opening } from "../vertebra";

/**
 * The common operations for a trapped nerve in the neck, each shown by what
 * it does to the opening in the side view. The starting point is the same
 * disc herniation as on the vertebra page.
 *
 * The geometry follows each operation's aim, not measured results: removing
 * the disc from the front takes the bulge away; a spacer restores the disc's
 * height; shaving the facet joint from behind moves the back wall of the
 * opening. Outcomes and risks are for the surgeon to give, for the person.
 */
export type SurgeryOption = "wait" | "acdf" | "disc-replacement" | "foraminotomy";

export interface SurgeryInfo {
  id: SurgeryOption;
  name: L;
  what: L;
  keeps: L;
  approach: L;
  sources: SourceId[];
}

export const SURGERY_OPTIONS: readonly SurgeryInfo[] = [
  {
    id: "wait",
    name: { en: "Non-surgical care", es: "Tratamiento no quirúrgico" },
    what: {
      en: "The bulge stays for now. Most herniations improve over weeks to months, and in one trial pain at a year was similar after surgery, physiotherapy or a collar.",
      es: "La protrusión se queda por ahora. La mayoría de las hernias mejoran en semanas o meses, y en un ensayo el dolor al año fue similar tras cirugía, fisioterapia o collarín."
    },
    keeps: { en: "Everything: no operation, no recovery time.", es: "Todo: sin operación ni tiempo de recuperación." },
    approach: { en: "None", es: "Ninguno" },
    sources: ["wong2014", "persson1997"]
  },
  {
    id: "acdf",
    name: { en: "Discectomy and fusion from the front (ACDF)", es: "Discectomía y fusión por delante (ACDF)" },
    what: {
      en: "Through a small cut at the front of the neck, the disc and the bulge are removed and a spacer (cage) is put in its place to restore the height. A plate often holds the two vertebrae while they grow together over months.",
      es: "Por un pequeño corte en la parte delantera del cuello se retiran el disco y la protrusión, y se coloca un espaciador (caja) en su lugar para recuperar la altura. A menudo una placa sujeta las dos vértebras mientras se fusionan durante meses."
    },
    keeps: {
      en: "Loses movement at that one level, since the two vertebrae fuse into one.",
      es: "Se pierde el movimiento en ese nivel, porque las dos vértebras se fusionan en una."
    },
    approach: { en: "Front of the neck", es: "Parte delantera del cuello" },
    sources: ["bono2011"]
  },
  {
    id: "disc-replacement",
    name: { en: "Artificial disc replacement", es: "Reemplazo por disco artificial" },
    what: {
      en: "As with fusion, the disc and the bulge are removed from the front, but an artificial disc goes in instead of a spacer, so the level keeps moving.",
      es: "Como en la fusión, se retiran el disco y la protrusión por delante, pero se coloca un disco artificial en lugar de un espaciador, así que el nivel conserva el movimiento."
    },
    keeps: { en: "Keeps movement at that level. Not suitable for everyone.", es: "Conserva el movimiento en ese nivel. No es apto para todos." },
    approach: { en: "Front of the neck", es: "Parte delantera del cuello" },
    sources: ["bono2011"]
  },
  {
    id: "foraminotomy",
    name: { en: "Foraminotomy from the back", es: "Foraminotomía por detrás" },
    what: {
      en: "Through the back of the neck, part of the facet joint is shaved away to widen the opening. The disc stays; sometimes a loose fragment is removed through the same opening.",
      es: "Por la parte posterior del cuello se rebaja parte de la articulación facetaria para ensanchar la abertura. El disco se queda; a veces se retira un fragmento suelto por la misma vía."
    },
    keeps: { en: "Keeps the disc and the movement at that level.", es: "Conserva el disco y el movimiento en ese nivel." },
    approach: { en: "Back of the neck", es: "Parte posterior del cuello" },
    sources: ["bono2011"]
  }
];

/** How far a foraminotomy moves the back wall of the opening, in figure units. */
const FORAMINOTOMY_CUT = 18;

export function surgeryOpening(option: SurgeryOption): Opening {
  const before = opening("herniation", "neutral");
  if (option === "wait") return before;
  if (option === "foraminotomy") {
    const back = before.back + FORAMINOTOMY_CUT;
    return { ...before, back, room: back - before.front, state: "free" };
  }
  // From the front: the bulge goes and the disc space is held open.
  const front = OPENING.front;
  const room = before.back - front;
  return { ...before, front, room, drop: -3, state: "free" };
}

export const SURGERY_COPY = {
  option: { en: "Option", es: "Opción" },
  approach: { en: "Approach", es: "Abordaje" },
  keeps: { en: "Movement", es: "Movimiento" },
  figure: { en: "Side view of two neck vertebrae after", es: "Vista lateral de dos vértebras cervicales tras" },
  ask: {
    en: "Your own chances of improvement, recovery time and risks depend on you and the level involved: ask the surgeon for numbers, and what is likely if you wait.",
    es: "Tus probabilidades de mejorar, el tiempo de recuperación y los riesgos dependen de ti y del nivel afectado: pide números al cirujano, y qué es probable si esperas."
  }
} as const;
