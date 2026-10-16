import type { L } from "../i18n";
import type { SourceId } from "../sources";

/**
 * The grades of hands-on joint treatment, as physios, chiropractors and
 * osteopaths use them, drawn on Maitland's movement diagram: the joint's
 * range along the bottom, the resistance the hands feel going up. R1 is where
 * resistance is first felt; L is the limit of the range that day.
 *
 * Grades are placed relative to that limit, so a stiff joint's grade IV is
 * nearer the start of the normal range than a supple one's. Grade V goes a
 * touch past the limit, quickly, which is what makes it a manipulation rather
 * than a mobilisation.
 */
export type Grade = "I" | "II" | "III" | "IV" | "V";
export type JointState = "normal" | "stiff" | "painful";
export type SpineRegion = "neck" | "mid-back" | "low-back";

export interface GradeInfo {
  id: Grade;
  /** Where the movement starts and ends, as a share of the available range (1 is the limit). */
  from: number;
  to: number;
  fast: boolean;
  purpose: "pain" | "stiffness" | "manipulation";
  text: L;
  feel: L;
}

export const GRADES: readonly GradeInfo[] = [
  {
    id: "I",
    from: 0.04,
    to: 0.18,
    fast: false,
    purpose: "pain",
    text: { en: "Small, gentle movements at the start of the range.", es: "Movimientos pequeños y suaves al inicio del recorrido." },
    feel: { en: "A light, rhythmic rocking. Nothing should hurt.", es: "Un balanceo ligero y rítmico. Nada debería doler." }
  },
  {
    id: "II",
    from: 0.12,
    to: 0.56,
    fast: false,
    purpose: "pain",
    text: { en: "Large, slow movements within the range, stopping short of where resistance starts.", es: "Movimientos amplios y lentos dentro del recorrido, sin llegar a donde empieza la resistencia." },
    feel: { en: "Bigger, smooth movements, still without a stretch.", es: "Movimientos más amplios y suaves, todavía sin estiramiento." }
  },
  {
    id: "III",
    from: 0.35,
    to: 0.98,
    fast: false,
    purpose: "stiffness",
    text: { en: "Large movements up to the limit, into the resistance.", es: "Movimientos amplios hasta el límite, entrando en la resistencia." },
    feel: { en: "A firm stretch at the end of each movement.", es: "Un estiramiento firme al final de cada movimiento." }
  },
  {
    id: "IV",
    from: 0.86,
    to: 0.98,
    fast: false,
    purpose: "stiffness",
    text: { en: "Small movements right at the limit.", es: "Movimientos pequeños justo en el límite." },
    feel: { en: "Small, firm pushes into the stiff end of the range.", es: "Empujes pequeños y firmes en el extremo rígido del recorrido." }
  },
  {
    id: "V",
    from: 0.97,
    to: 1.06,
    fast: true,
    purpose: "manipulation",
    text: {
      en: "Manipulation: one quick, small thrust just past the limit, often with a pop. The pop is gas forming in the joint's fluid, not a bone going back into place.",
      es: "Manipulación: un empuje rápido y pequeño justo más allá del límite, a menudo con un chasquido. El chasquido es gas que se forma en el líquido de la articulación, no un hueso que vuelve a su sitio."
    },
    feel: { en: "One fast push, over before you can resist it.", es: "Un empuje rápido, que termina antes de que puedas resistirte." }
  }
];

/**
 * Where resistance starts (R1), where the range ends today (the limit), and
 * where pain starts if it does, all as shares of the normal range. Shapes,
 * not measurements.
 */
export const JOINT_STATES: Record<JointState, { r1: number; limit: number; pain: number | null }> = {
  normal: { r1: 0.62, limit: 1, pain: null },
  stiff: { r1: 0.3, limit: 0.72, pain: null },
  painful: { r1: 0.62, limit: 1, pain: 0.38 }
};

/** A grade's movement for a joint in this state, as shares of the normal range. Grade II always stops short of R1. */
export function gradeSpan(grade: Grade, state: JointState): { from: number; to: number } {
  const g = GRADES.find((x) => x.id === grade)!;
  const { r1, limit } = JOINT_STATES[state];
  const to = grade === "II" ? Math.min(g.to, r1 / limit - 0.05) : g.to;
  return { from: g.from * limit, to: to * limit };
}

/** The angle of the small joints at the back of each vertebra, seen from the side (degrees from horizontal). */
export const REGIONS: Record<SpineRegion, { name: L; angle: number; text: L }> = {
  neck: {
    name: { en: "Neck", es: "Cuello" },
    angle: 45,
    text: {
      en: "The neck's small joints slope at about 45°, so they glide easily: the neck turns and tilts further than the rest of the spine.",
      es: "Las pequeñas articulaciones del cuello tienen una inclinación de unos 45°, así que se deslizan con facilidad: el cuello gira e inclina más que el resto de la columna."
    }
  },
  "mid-back": {
    name: { en: "Mid back", es: "Espalda media" },
    angle: 60,
    text: {
      en: "In the mid back they stand steeper, at about 60°, and the ribs add their own joints: turning is possible, bending back less so.",
      es: "En la espalda media están más empinadas, a unos 60°, y las costillas añaden sus propias articulaciones: girar es posible, extender menos."
    }
  },
  "low-back": {
    name: { en: "Low back", es: "Zona lumbar" },
    angle: 88,
    text: {
      en: "In the low back they stand almost upright and face each other, which allows bending but blocks most turning.",
      es: "En la zona lumbar están casi verticales y enfrentadas, lo que permite flexionar pero bloquea casi todo el giro."
    }
  }
};

export const MOBILISATION_COPY = {
  grade: { en: "Grade", es: "Grado" },
  state: { en: "The joint today", es: "La articulación hoy" },
  states: {
    normal: { en: "Supple", es: "Flexible" },
    stiff: { en: "Stiff", es: "Rígida" },
    painful: { en: "Painful", es: "Dolorosa" }
  },
  stateText: {
    normal: {
      en: "Resistance is first felt partway through the range (R1) and builds to the limit (L).",
      es: "La resistencia se nota a mitad del recorrido (R1) y aumenta hasta el límite (L)."
    },
    stiff: {
      en: "The limit comes early and resistance starts sooner. Every grade moves with it: grades III and IV work into that stiffness.",
      es: "El límite llega antes y la resistencia empieza antes. Todos los grados se desplazan con él: los grados III y IV trabajan esa rigidez."
    },
    painful: {
      en: "Pain starts before resistance does. Grades I and II, short of the pain, are the usual choice.",
      es: "El dolor empieza antes que la resistencia. Los grados I y II, sin llegar al dolor, son la opción habitual."
    }
  },
  region: { en: "Where on the spine", es: "Dónde en la columna" },
  range: { en: "Range of movement", es: "Recorrido del movimiento" },
  resistance: { en: "Resistance", es: "Resistencia" },
  pain: { en: "Pain", es: "Dolor" },
  start: { en: "Start", es: "Inicio" },
  beyond: { en: "Past the limit", es: "Más allá del límite" },
  normalEnd: { en: "Normal end of range", es: "Final normal del recorrido" },
  r1: { en: "R1: resistance first felt", es: "R1: primera resistencia" },
  limit: { en: "L: limit today", es: "L: límite de hoy" },
  purpose: {
    pain: { en: "Mostly used to ease pain", es: "Se usa sobre todo para aliviar el dolor" },
    stiffness: { en: "Mostly used for stiffness", es: "Se usa sobre todo para la rigidez" },
    manipulation: { en: "Manipulation", es: "Manipulación" }
  },
  purposeText: {
    pain: {
      en: "They stay short of the resistance, so the joint moves without being stretched.",
      es: "No llegan a la resistencia, así que la articulación se mueve sin estirarse."
    },
    stiffness: {
      en: "They work into the resistance, stretching the stiff part of the range.",
      es: "Trabajan dentro de la resistencia, estirando la parte rígida del recorrido."
    },
    manipulation: { en: "A single thrust rather than a rhythm: done once, not repeated.", es: "Un único empuje en lugar de un ritmo: se hace una vez, no se repite." }
  },
  feel: { en: "What it feels like", es: "Cómo se siente" },
  mobilisation: { en: "Mobilisation (I-IV)", es: "Movilización (I-IV)" },
  manipulation: { en: "Manipulation (V)", es: "Manipulación (V)" },
  joint: { en: "One of the small joints at the back of the spine, from the side", es: "Una de las pequeñas articulaciones de la parte posterior de la columna, de lado" },
  capsule: { en: "Joint capsule", es: "Cápsula articular" },
  gas: { en: "gas bubble", es: "burbuja de gas" },
  figure: { en: "Movement diagram: the joint's range, the resistance and the grade's movement", es: "Diagrama de movimiento: el recorrido de la articulación, la resistencia y el movimiento del grado" },
  evidence: {
    en: "For neck pain, mobilisation and manipulation give similar small, mostly short-term effects. The rare risk of artery injury is linked to neck manipulation, the thrust, so it's fair to ask for mobilisation instead.",
    es: "Para el dolor de cuello, la movilización y la manipulación dan efectos pequeños similares, sobre todo a corto plazo. El riesgo raro de lesión arterial se asocia a la manipulación cervical, el empuje, así que es razonable pedir movilización en su lugar."
  }
} as const;

export const MOBILISATION_SOURCES: readonly SourceId[] = ["maitland2005", "gross2015manip", "kawchuk2015", "biller2014", "standring2020"];
