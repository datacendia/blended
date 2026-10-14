import type { L } from "../i18n";
import type { SourceId } from "../sources";

/**
 * The grades of hands-on joint treatment, as physios, chiropractors and
 * osteopaths use them. Positions are fractions of the joint's available
 * range: 0 is where the movement starts, 1 is where stiffness stops it.
 * Grade V goes a touch past that point, quickly, which is what makes it a
 * manipulation rather than a mobilisation.
 */
export type Grade = "I" | "II" | "III" | "IV" | "V";

export const GRADES: readonly { id: Grade; from: number; to: number; fast: boolean; text: L }[] = [
  {
    id: "I",
    from: 0.04,
    to: 0.2,
    fast: false,
    text: { en: "Small, gentle movements at the start of the range. Mostly used to ease pain.", es: "Movimientos pequeños y suaves al inicio del recorrido. Se usan sobre todo para aliviar el dolor." }
  },
  {
    id: "II",
    from: 0.12,
    to: 0.72,
    fast: false,
    text: { en: "Large, slow movements within the range, stopping short of stiffness.", es: "Movimientos amplios y lentos dentro del recorrido, sin llegar a la rigidez." }
  },
  {
    id: "III",
    from: 0.35,
    to: 0.98,
    fast: false,
    text: { en: "Large movements up to the limit, into the stiffness.", es: "Movimientos amplios hasta el límite, entrando en la rigidez." }
  },
  {
    id: "IV",
    from: 0.84,
    to: 0.98,
    fast: false,
    text: { en: "Small movements right at the limit.", es: "Movimientos pequeños justo en el límite." }
  },
  {
    id: "V",
    from: 0.97,
    to: 1.05,
    fast: true,
    text: {
      en: "Manipulation: one quick, small thrust just past the limit, often with a pop. The pop is gas forming in the joint's fluid, not a bone going back into place.",
      es: "Manipulación: un empuje rápido y pequeño justo más allá del límite, a menudo con un chasquido. El chasquido es gas que se forma en el líquido de la articulación, no un hueso que vuelve a su sitio."
    }
  }
];

export const MOBILISATION_COPY = {
  grade: { en: "Grade", es: "Grado" },
  start: { en: "Start of range", es: "Inicio del recorrido" },
  limit: { en: "Stiffness", es: "Rigidez" },
  mobilisation: { en: "Mobilisation (I-IV)", es: "Movilización (I-IV)" },
  manipulation: { en: "Manipulation (V)", es: "Manipulación (V)" },
  joint: { en: "The joint", es: "La articulación" },
  gas: { en: "gas bubble", es: "burbuja de gas" },
  figure: { en: "Range of a joint's movement with the grade's movement marked", es: "Recorrido de una articulación con el movimiento del grado marcado" },
  evidence: {
    en: "For neck pain, mobilisation and manipulation give similar small, mostly short-term effects. The rare risk of artery injury is linked to neck manipulation, the thrust, so it's fair to ask for mobilisation instead.",
    es: "Para el dolor de cuello, la movilización y la manipulación dan efectos pequeños similares, sobre todo a corto plazo. El riesgo raro de lesión arterial se asocia a la manipulación cervical, el empuje, así que es razonable pedir movilización en su lugar."
  }
} as const;

export const MOBILISATION_SOURCES: readonly SourceId[] = ["gross2015manip", "kawchuk2015", "biller2014"];
