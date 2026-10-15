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
  /** Which way the surgeon goes in, for the view from above. */
  route: "front" | "back" | null;
  removed: L;
  implant: L;
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
    route: null,
    removed: { en: "Nothing", es: "Nada" },
    implant: { en: "None", es: "Ninguno" },
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
    route: "front",
    removed: { en: "The whole disc, with the bulge", es: "Todo el disco, con la protrusión" },
    implant: { en: "A spacer (cage), often with a plate", es: "Un espaciador (caja), a menudo con una placa" },
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
    route: "front",
    removed: { en: "The whole disc, with the bulge", es: "Todo el disco, con la protrusión" },
    implant: { en: "An artificial disc", es: "Un disco artificial" },
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
    route: "back",
    removed: { en: "Part of the facet joint, sometimes a loose fragment", es: "Parte de la articulación facetaria, a veces un fragmento suelto" },
    implant: { en: "None", es: "Ninguno" },
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

/* ---------- The neck seen from above, at the level of the disc ---------- */

export type AxialId =
  | "trachea"
  | "oesophagus"
  | "thyroid"
  | "straps"
  | "scm"
  | "carotid"
  | "voice-nerve"
  | "longus"
  | "disc"
  | "cord"
  | "root"
  | "vertebral-artery"
  | "facet"
  | "back-muscles";

/**
 * Drawn as radiology shows it: the front of the neck at the top, the
 * person's right on the viewer's left. The trapped root is on the person's
 * right. Shapes are schematic; the order and neighbours of the structures
 * are what the figure is for.
 */
export const AXIAL: readonly { id: AxialId; n: number; name: L; note: L; at: readonly [number, number]; sources: SourceId[] }[] = [
  {
    id: "trachea",
    n: 1,
    name: { en: "Windpipe (trachea)", es: "Tráquea" },
    note: { en: "Moved gently toward the middle in surgery from the front.", es: "Se desplaza con cuidado hacia el centro en la cirugía por delante." },
    at: [150, 50],
    sources: ["standring2020"]
  },
  {
    id: "oesophagus",
    n: 2,
    name: { en: "Gullet (oesophagus)", es: "Esófago" },
    note: {
      en: "Moved aside with the windpipe. Trouble swallowing for a while is the most common problem after surgery from the front.",
      es: "Se desplaza junto con la tráquea. La dificultad para tragar durante un tiempo es el problema más frecuente tras la cirugía por delante."
    },
    at: [156, 82],
    sources: ["standring2020", "fountas2007"]
  },
  {
    id: "thyroid",
    n: 3,
    name: { en: "Thyroid gland", es: "Glándula tiroides" },
    note: { en: "Wraps the front and sides of the windpipe; the route passes beside it.", es: "Rodea la parte delantera y los lados de la tráquea; la vía pasa a su lado." },
    at: [176, 58],
    sources: ["standring2020"]
  },
  {
    id: "straps",
    n: 4,
    name: { en: "Strap muscles", es: "Músculos infrahioideos" },
    note: { en: "Thin muscles over the windpipe, moved aside to reach the spine.", es: "Músculos finos sobre la tráquea, que se apartan para llegar a la columna." },
    at: [150, 26],
    sources: ["standring2020"]
  },
  {
    id: "scm",
    n: 5,
    name: { en: "Sternocleidomastoid", es: "Esternocleidomastoideo" },
    note: { en: "The large muscle at the side of the neck. The cut for surgery from the front runs along its front edge.", es: "El músculo grande del lateral del cuello. El corte para la cirugía por delante sigue su borde anterior." },
    at: [66, 74],
    sources: ["standring2020"]
  },
  {
    id: "carotid",
    n: 6,
    name: { en: "Carotid artery and jugular vein", es: "Arteria carótida y vena yugular" },
    note: {
      en: "With the vagus nerve, they run in one sheath. The route from the front passes between this sheath and the windpipe, keeping the sheath to the outside.",
      es: "Junto con el nervio vago, van en una misma vaina. La vía por delante pasa entre esta vaina y la tráquea, dejando la vaina hacia fuera."
    },
    at: [92, 96],
    sources: ["standring2020"]
  },
  {
    id: "voice-nerve",
    n: 7,
    name: { en: "Nerve to the voice box", es: "Nervio laríngeo recurrente" },
    note: {
      en: "Runs in the groove between the windpipe and the gullet. Stretching it can make the voice hoarse, a less common problem after surgery from the front.",
      es: "Va por el surco entre la tráquea y el esófago. Estirarlo puede volver ronca la voz, un problema menos frecuente tras la cirugía por delante."
    },
    at: [136, 74],
    sources: ["standring2020", "fountas2007"]
  },
  {
    id: "longus",
    n: 8,
    name: { en: "Longus colli", es: "Largo del cuello" },
    note: { en: "Lies on the front of the spine and is moved aside to reach the disc.", es: "Está sobre la parte delantera de la columna y se aparta para llegar al disco." },
    at: [126, 106],
    sources: ["standring2020"]
  },
  {
    id: "disc",
    n: 9,
    name: { en: "Disc, with the bulge", es: "Disco, con la protrusión" },
    note: { en: "Taken out whole in surgery from the front. From the back it stays, apart from any loose fragment.", es: "Se retira entero en la cirugía por delante. Por detrás se queda, salvo algún fragmento suelto." },
    at: [150, 124],
    sources: ["bono2011"]
  },
  {
    id: "cord",
    n: 10,
    name: { en: "Spinal cord", es: "Médula espinal" },
    note: { en: "In the canal behind the disc. Surgeons work around it, never through it.", es: "En el canal detrás del disco. Los cirujanos trabajan a su alrededor, nunca a través." },
    at: [150, 160],
    sources: ["standring2020"]
  },
  {
    id: "root",
    n: 11,
    name: { en: "The trapped nerve root", es: "La raíz nerviosa atrapada" },
    note: { en: "Leaves the cord through its opening toward the arm. Every option aims to give it room.", es: "Sale de la médula por su abertura hacia el brazo. Todas las opciones buscan darle espacio." },
    at: [104, 148],
    sources: ["standring2020"]
  },
  {
    id: "vertebral-artery",
    n: 12,
    name: { en: "Vertebral artery", es: "Arteria vertebral" },
    note: { en: "Runs up through a hole in the side of each vertebra, just in front of the nerve root.", es: "Sube por un orificio en el lateral de cada vértebra, justo delante de la raíz nerviosa." },
    at: [98, 124],
    sources: ["standring2020"]
  },
  {
    id: "facet",
    n: 13,
    name: { en: "Facet joint", es: "Articulación facetaria" },
    note: { en: "Forms the back wall of the root's opening. A foraminotomy shaves part of it away.", es: "Forma la pared posterior de la abertura de la raíz. La foraminotomía rebaja parte de ella." },
    at: [112, 176],
    sources: ["standring2020"]
  },
  {
    id: "back-muscles",
    n: 14,
    name: { en: "Back of the neck muscles", es: "Músculos de la nuca" },
    note: {
      en: "Surgery from the back goes through these instead, away from the windpipe, the gullet and the carotid artery.",
      es: "La cirugía por detrás pasa a través de ellos, lejos de la tráquea, el esófago y la carótida."
    },
    at: [114, 212],
    sources: ["standring2020"]
  }
];

export const COMPARE_ROWS = ["approach", "removed", "implant", "keeps"] as const;

export const SURGERY_COPY = {
  option: { en: "Option", es: "Opción" },
  above: { en: "The route in, seen from above", es: "La vía de entrada, vista desde arriba" },
  aboveFigure: { en: "Cross-section of the neck at the level of the disc, front at the top", es: "Corte transversal del cuello a la altura del disco, la parte delantera arriba" },
  front: { en: "Front", es: "Delante" },
  back: { en: "Back", es: "Detrás" },
  personRight: { en: "Person's right", es: "Derecha de la persona" },
  tapPart: { en: "Tap a numbered part", es: "Toca una parte numerada" },
  compare: { en: "The options side by side", es: "Las opciones lado a lado" },
  removed: { en: "Removed", es: "Se retira" },
  implant: { en: "Put in", es: "Se coloca" },
  approach: { en: "Approach", es: "Abordaje" },
  keeps: { en: "Movement", es: "Movimiento" },
  figure: { en: "Side view of two neck vertebrae after", es: "Vista lateral de dos vértebras cervicales tras" },
  ask: {
    en: "Your own chances of improvement, recovery time and risks depend on you and the level involved: ask the surgeon for numbers, and what is likely if you wait.",
    es: "Tus probabilidades de mejorar, el tiempo de recuperación y los riesgos dependen de ti y del nivel afectado: pide números al cirujano, y qué es probable si esperas."
  }
} as const;
