import type { L } from "./i18n";

/**
 * Warning signs that mean "stop tracking and get medical help".
 *
 * The list errs towards sending people to a doctor. A false alarm costs a
 * consultation; a missed spinal cord compression or artery dissection costs
 * far more. Every flag says why it matters, because a bare instruction is
 * easier to talk yourself out of.
 */
export type FlagLevel = "emergency" | "urgent" | "soon";

export interface RedFlag {
  id: string;
  level: FlagLevel;
  text: L;
  why: L;
}

export const RED_FLAGS: readonly RedFlag[] = [
  {
    id: "stroke-signs",
    level: "emergency",
    text: {
      en: "Sudden dizziness or vertigo, double vision, slurred speech, trouble swallowing, facial numbness, loss of balance or sudden falls — especially with new neck pain or headache, or after neck manipulation.",
      es: "Mareo o vértigo repentino, visión doble, habla arrastrada, dificultad para tragar, adormecimiento de la cara, pérdida de equilibrio o caídas repentinas, sobre todo con dolor de cuello o de cabeza nuevo, o tras una manipulación cervical."
    },
    why: {
      en: "These can be signs of a stroke or a tear in a neck artery (cervical artery dissection). Minutes matter.",
      es: "Pueden ser signos de un ictus o de un desgarro en una arteria del cuello (disección arterial cervical). Los minutos cuentan."
    }
  },
  {
    id: "eyelid-pupil",
    level: "emergency",
    text: {
      en: "A new drooping eyelid or one pupil smaller than the other, with neck pain or headache.",
      es: "Un párpado caído nuevo o una pupila más pequeña que la otra, con dolor de cuello o de cabeza."
    },
    why: {
      en: "A neck artery problem can affect the nerves to the eye (Horner's syndrome).",
      es: "Un problema en una arteria del cuello puede afectar a los nervios del ojo (síndrome de Horner)."
    }
  },
  {
    id: "thunderclap",
    level: "emergency",
    text: { en: "A sudden, severe headache — the worst you have ever had.", es: "Un dolor de cabeza repentino e intenso, el peor de tu vida." },
    why: { en: "Can signal bleeding in or around the brain.", es: "Puede indicar un sangrado en o alrededor del cerebro." }
  },
  {
    id: "saddle",
    level: "emergency",
    text: {
      en: "Numbness between the legs, around the genitals or buttocks (the 'saddle' area).",
      es: "Adormecimiento entre las piernas, alrededor de los genitales o los glúteos (la zona del 'sillín')."
    },
    why: {
      en: "Possible cauda equina syndrome: the nerves to the bladder and bowel are being squeezed. Delay can make damage permanent.",
      es: "Posible síndrome de cola de caballo: se están comprimiendo los nervios de la vejiga y el intestino. El retraso puede hacer el daño permanente."
    }
  },
  {
    id: "bladder-bowel",
    level: "emergency",
    text: {
      en: "New trouble passing urine, or loss of bladder or bowel control.",
      es: "Dificultad nueva para orinar, o pérdida de control de la vejiga o el intestino."
    },
    why: { en: "Same concern as saddle numbness: cauda equina or spinal cord compression.", es: "La misma preocupación que el adormecimiento en sillín: compresión de la cola de caballo o de la médula." }
  },
  {
    id: "both-legs",
    level: "emergency",
    text: { en: "Weakness or numbness spreading in both legs.", es: "Debilidad o adormecimiento que se extiende en ambas piernas." },
    why: { en: "One trapped root affects one side. Both sides points to the spinal cord or cauda equina.", es: "Una raíz atrapada afecta a un lado. Ambos lados apunta a la médula o a la cola de caballo." }
  },
  {
    id: "trauma",
    level: "emergency",
    text: {
      en: "Neck or back pain after a significant fall, crash or blow — especially if over 65, or with numbness or weakness.",
      es: "Dolor de cuello o espalda tras una caída, choque o golpe importante, sobre todo si tienes más de 65 años o hay adormecimiento o debilidad."
    },
    why: { en: "Fractures need imaging before anyone moves the spine.", es: "Las fracturas requieren imagen antes de que nadie mueva la columna." }
  },
  {
    id: "chest",
    level: "emergency",
    text: { en: "Chest pain or pressure, or shortness of breath.", es: "Dolor u opresión en el pecho, o falta de aire." },
    why: { en: "Heart and lung problems can be felt in the upper back, neck, jaw and arm.", es: "Los problemas de corazón y pulmón se pueden sentir en la espalda alta, el cuello, la mandíbula y el brazo." }
  },
  {
    id: "progressive-weakness",
    level: "urgent",
    text: {
      en: "Weakness that is getting worse: dropping things, a weakening grip, a foot that slaps or catches when walking.",
      es: "Debilidad que empeora: se te caen las cosas, pierdes fuerza al agarrar, el pie golpea o se engancha al caminar."
    },
    why: {
      en: "A nerve losing motor function needs a doctor's assessment and sometimes a scan or surgical opinion, not more of the same.",
      es: "Un nervio que pierde función motora necesita una valoración médica y a veces una resonancia u opinión quirúrgica, no más de lo mismo."
    }
  },
  {
    id: "myelopathy",
    level: "urgent",
    text: {
      en: "Clumsy hands (buttons, writing, picking up coins), new unsteadiness when walking, or electric shocks down the spine when you bend your neck.",
      es: "Manos torpes (botones, escribir, recoger monedas), inestabilidad nueva al caminar, o descargas eléctricas por la columna al flexionar el cuello."
    },
    why: {
      en: "Signs that the spinal cord itself may be compressed in the neck (cervical myelopathy). Neck manipulation should not happen until a doctor has assessed this.",
      es: "Signos de que la propia médula espinal podría estar comprimida en el cuello (mielopatía cervical). No debe haber manipulación cervical hasta que un médico lo valore."
    }
  },
  {
    id: "fever",
    level: "urgent",
    text: { en: "Fever, chills or feeling generally unwell with your spine pain.", es: "Fiebre, escalofríos o malestar general junto con el dolor de columna." },
    why: { en: "Infection in or near the spine is rare but serious.", es: "Una infección en la columna o cerca es rara pero grave." }
  },
  {
    id: "cancer-weight",
    level: "urgent",
    text: { en: "A history of cancer, or weight loss you can't explain.", es: "Antecedente de cáncer, o pérdida de peso sin explicación." },
    why: { en: "Back or neck pain can occasionally be the first sign of cancer spreading to bone.", es: "El dolor de espalda o cuello puede ser ocasionalmente el primer signo de un cáncer que se extiende al hueso." }
  },
  {
    id: "night-pain",
    level: "urgent",
    text: { en: "Constant pain at night that no position eases.", es: "Dolor constante por la noche que no alivia ninguna postura." },
    why: { en: "Mechanical pain changes with position; pain that never does needs investigating.", es: "El dolor mecánico cambia con la postura; el que nunca cambia hay que estudiarlo." }
  },
  {
    id: "immune",
    level: "urgent",
    text: {
      en: "Injected drug use, a weakened immune system, or a recent spinal procedure or infection.",
      es: "Consumo de drogas inyectadas, sistema inmunitario debilitado, o un procedimiento o infección reciente en la columna."
    },
    why: { en: "Raises the risk of spinal infection.", es: "Aumenta el riesgo de infección en la columna." }
  },
  {
    id: "osteoporosis",
    level: "urgent",
    text: {
      en: "Osteoporosis or long-term steroid use, with new pain after a minor strain or fall.",
      es: "Osteoporosis o uso prolongado de corticoides, con dolor nuevo tras un esfuerzo o caída leve."
    },
    why: {
      en: "A fragility fracture is possible — and forceful manipulation is a bad idea on fragile bone.",
      es: "Es posible una fractura por fragilidad, y una manipulación con fuerza es mala idea sobre hueso frágil."
    }
  },
  {
    id: "six-weeks",
    level: "soon",
    text: {
      en: "Arm or leg pain, numbness or tingling lasting more than six weeks without clear improvement.",
      es: "Dolor, adormecimiento u hormigueo en el brazo o la pierna que dura más de seis semanas sin mejoría clara."
    },
    why: {
      en: "Worth a medical assessment to confirm the diagnosis and decide whether a scan is needed.",
      es: "Merece una valoración médica para confirmar el diagnóstico y decidir si hace falta una resonancia."
    }
  },
  {
    id: "first-over-50",
    level: "soon",
    text: { en: "A first-ever episode of significant spine pain after age 50, with no clear cause.", es: "Un primer episodio de dolor de columna importante después de los 50 años, sin causa clara." },
    why: { en: "New pain later in life has a slightly higher chance of a non-mechanical cause.", es: "El dolor nuevo a edades mayores tiene algo más de probabilidad de una causa no mecánica." }
  }
];

export function flagById(id: string): RedFlag | undefined {
  return RED_FLAGS.find((f) => f.id === id);
}

const RANK: Record<FlagLevel, number> = { soon: 1, urgent: 2, emergency: 3 };

/** The most serious level among the ticked flags, or null for none. */
export function triage(ids: readonly string[]): FlagLevel | null {
  let best: FlagLevel | null = null;
  for (const id of ids) {
    const level = flagById(id)?.level;
    if (level && (!best || RANK[level] > RANK[best])) best = level;
  }
  return best;
}

export const TRIAGE_ACTION: Record<FlagLevel, { title: L; body: L }> = {
  emergency: {
    title: { en: "Get emergency help now", es: "Busca ayuda de emergencia ahora" },
    body: {
      en: "Call your local emergency number or go to the nearest emergency department. Peru: SAMU 106. Most of Europe: 112. US and Canada: 911. UK: 999. Do not drive yourself if you have stroke-like symptoms.",
      es: "Llama al número de emergencias local o acude a urgencias más cercanas. Perú: SAMU 106. Gran parte de Europa: 112. EE. UU. y Canadá: 911. Reino Unido: 999. No conduzcas si tienes síntomas parecidos a un ictus."
    }
  },
  urgent: {
    title: { en: "See a doctor within a day or two", es: "Consulta a un médico en uno o dos días" },
    body: {
      en: "Book a medical doctor (GP, physiatrist, neurologist or an emergency department if you can't get seen) and pause manual treatment of the spine until you have.",
      es: "Pide cita con un médico (medicina general, fisiatría, neurología, o urgencias si no consigues cita) y suspende el tratamiento manual de la columna hasta entonces."
    }
  },
  soon: {
    title: { en: "Book a medical review", es: "Pide una revisión médica" },
    body: {
      en: "Not an emergency, but worth a doctor's assessment in the coming weeks — bring your tracker summary.",
      es: "No es una emergencia, pero merece una valoración médica en las próximas semanas; lleva el resumen de tu seguimiento."
    }
  }
};
