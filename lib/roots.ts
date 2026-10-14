import type { L } from "./i18n";

/**
 * Spinal nerve roots: where each leaves the spine and what it serves.
 *
 * The rule a lot of patient material gets wrong: there are 7 cervical
 * vertebrae but 8 cervical roots. C1-C7 leave ABOVE the vertebra with the same
 * number; C8 leaves between C7 and T1; from T1 down, every root leaves BELOW
 * its own vertebra. So "C5-C6 disc" points at the C6 root, not C5.
 *
 * `exitAfter` is the vertebra the root passes just beneath — "skull" for C1.
 */
export type RootRegion = "cervical" | "thoracic" | "lumbar" | "sacral";

export interface Root {
  id: string;
  region: RootRegion;
  /** The vertebra (or skull) directly above the root's exit. */
  exitAfter: string;
  /** The vertebra directly below the root's exit; "sacrum" for sacral roots. */
  exitBefore: string;
  sensory: L;
  motor: L;
  /** The reflex a clinician uses for this root, or null when none is reliable. */
  reflex: L | null;
  /** Disc level most often responsible when this root is compressed. */
  typicalDisc?: L;
  note?: L;
}

export const ROOTS: readonly Root[] = [
  {
    id: "C1",
    region: "cervical",
    exitAfter: "skull",
    exitBefore: "C1",
    sensory: { en: "Usually no skin area of its own.", es: "Normalmente no tiene una zona de piel propia." },
    motor: { en: "Small muscles under the skull that fine-tune head position.", es: "Músculos pequeños bajo el cráneo que ajustan la posición de la cabeza." },
    reflex: null
  },
  {
    id: "C2",
    region: "cervical",
    exitAfter: "C1",
    exitBefore: "C2",
    sensory: { en: "Back of the head, up towards the crown.", es: "Parte de atrás de la cabeza, hacia la coronilla." },
    motor: { en: "Helps bend and straighten the neck.", es: "Ayuda a flexionar y extender el cuello." },
    reflex: null,
    note: {
      en: "Irritation around C2 is a recognised source of headache at the back of the head (cervicogenic headache).",
      es: "La irritación alrededor de C2 es una causa reconocida de dolor de cabeza en la nuca (cefalea cervicogénica)."
    }
  },
  {
    id: "C3",
    region: "cervical",
    exitAfter: "C2",
    exitBefore: "C3",
    sensory: { en: "Upper and side of the neck, towards the angle of the jaw.", es: "Parte alta y lateral del cuello, hacia el ángulo de la mandíbula." },
    motor: { en: "Side-bending of the neck; contributes to the diaphragm (C3-C5).", es: "Inclinación lateral del cuello; participa en el diafragma (C3-C5)." },
    reflex: null
  },
  {
    id: "C4",
    region: "cervical",
    exitAfter: "C3",
    exitBefore: "C4",
    sensory: { en: "Base of the neck and the tops of the shoulders, like a cape.", es: "Base del cuello y parte superior de los hombros, como una capa." },
    motor: { en: "Shoulder shrug; the diaphragm (C3-C5 keep breathing going).", es: "Elevar los hombros; el diafragma (C3-C5 mantienen la respiración)." },
    reflex: null
  },
  {
    id: "C5",
    region: "cervical",
    exitAfter: "C4",
    exitBefore: "C5",
    sensory: { en: "Outer upper arm, over the shoulder muscle (deltoid).", es: "Cara externa del brazo, sobre el músculo del hombro (deltoides)." },
    motor: { en: "Lifting the arm out to the side; bending the elbow.", es: "Separar el brazo hacia el lado; flexionar el codo." },
    reflex: { en: "Biceps reflex (C5-C6).", es: "Reflejo bicipital (C5-C6)." },
    typicalDisc: { en: "C4-C5 disc", es: "Disco C4-C5" }
  },
  {
    id: "C6",
    region: "cervical",
    exitAfter: "C5",
    exitBefore: "C6",
    sensory: { en: "Outer forearm, thumb and index finger.", es: "Cara externa del antebrazo, pulgar e índice." },
    motor: { en: "Bending the wrist back (extension); bending the elbow.", es: "Llevar la muñeca hacia atrás (extensión); flexionar el codo." },
    reflex: { en: "Brachioradialis reflex (also biceps).", es: "Reflejo braquiorradial (también bicipital)." },
    typicalDisc: { en: "C5-C6 disc", es: "Disco C5-C6" },
    note: {
      en: "The second most commonly affected cervical root.",
      es: "La segunda raíz cervical más afectada."
    }
  },
  {
    id: "C7",
    region: "cervical",
    exitAfter: "C6",
    exitBefore: "C7",
    sensory: { en: "Middle finger, and the back of the forearm and hand.", es: "Dedo medio, y dorso del antebrazo y la mano." },
    motor: { en: "Straightening the elbow (triceps); bending the wrist forward; straightening the fingers.", es: "Extender el codo (tríceps); flexionar la muñeca; extender los dedos." },
    reflex: { en: "Triceps reflex.", es: "Reflejo tricipital." },
    typicalDisc: { en: "C6-C7 disc", es: "Disco C6-C7" },
    note: {
      en: "The most commonly affected cervical root.",
      es: "La raíz cervical afectada con más frecuencia."
    }
  },
  {
    id: "C8",
    region: "cervical",
    exitAfter: "C7",
    exitBefore: "T1",
    sensory: { en: "Little and ring fingers, inner edge of the hand and lower forearm.", es: "Meñique y anular, borde interno de la mano y parte baja del antebrazo." },
    motor: { en: "Gripping (finger bending); straightening the thumb.", es: "Agarrar (flexión de los dedos); extender el pulgar." },
    reflex: null,
    typicalDisc: { en: "C7-T1 disc", es: "Disco C7-D1" },
    note: {
      en: "The eighth cervical root has no vertebra of its own: it exits below C7.",
      es: "La octava raíz cervical no tiene vértebra propia: sale por debajo de C7."
    }
  },
  {
    id: "T1",
    region: "thoracic",
    exitAfter: "T1",
    exitBefore: "T2",
    sensory: { en: "Inner forearm near the elbow.", es: "Cara interna del antebrazo, cerca del codo." },
    motor: { en: "Small hand muscles: spreading and closing the fingers.", es: "Músculos pequeños de la mano: separar y juntar los dedos." },
    reflex: null,
    note: {
      en: "T1 carries nerve fibres to the eye. A drooping eyelid or small pupil on one side with arm pain needs a doctor promptly.",
      es: "D1 lleva fibras nerviosas al ojo. Un párpado caído o una pupila pequeña de un lado con dolor de brazo requiere un médico pronto."
    }
  },
  {
    id: "T2",
    region: "thoracic",
    exitAfter: "T2",
    exitBefore: "T3",
    sensory: { en: "Armpit, inner upper arm and upper chest.", es: "Axila, cara interna del brazo y parte alta del pecho." },
    motor: { en: "Muscles between the ribs.", es: "Músculos entre las costillas." },
    reflex: null
  },
  ...thoracicBand(3, { en: "Upper chest, below the collarbone line.", es: "Parte alta del pecho, debajo de la clavícula." }),
  ...thoracicBand(4, { en: "A band around the chest at nipple level.", es: "Una franja alrededor del pecho a la altura del pezón." }),
  ...thoracicBand(5, { en: "A band just below the nipple line.", es: "Una franja justo debajo de la línea del pezón." }),
  ...thoracicBand(6, { en: "A band at the bottom of the breastbone.", es: "Una franja a la altura del final del esternón." }),
  ...thoracicBand(7, { en: "A band over the upper abdomen.", es: "Una franja sobre la parte alta del abdomen." }),
  ...thoracicBand(8, { en: "A band over the upper abdomen, below the ribs.", es: "Una franja sobre el abdomen alto, debajo de las costillas." }),
  ...thoracicBand(9, { en: "A band above the belly button.", es: "Una franja por encima del ombligo." }),
  ...thoracicBand(10, { en: "A band at the level of the belly button.", es: "Una franja a la altura del ombligo." }),
  ...thoracicBand(11, { en: "A band below the belly button.", es: "Una franja por debajo del ombligo." }),
  ...thoracicBand(12, { en: "Lower abdomen, just above the groin crease.", es: "Abdomen bajo, justo encima del pliegue de la ingle." }),
  {
    id: "L1",
    region: "lumbar",
    exitAfter: "L1",
    exitBefore: "L2",
    sensory: { en: "Groin.", es: "Ingle." },
    motor: { en: "Helps lift the thigh (hip flexion).", es: "Ayuda a levantar el muslo (flexión de cadera)." },
    reflex: null
  },
  {
    id: "L2",
    region: "lumbar",
    exitAfter: "L2",
    exitBefore: "L3",
    sensory: { en: "Upper front and inner thigh.", es: "Parte alta delantera e interna del muslo." },
    motor: { en: "Lifting the thigh; bringing the legs together.", es: "Levantar el muslo; juntar las piernas." },
    reflex: null
  },
  {
    id: "L3",
    region: "lumbar",
    exitAfter: "L3",
    exitBefore: "L4",
    sensory: { en: "Lower front thigh down to the inner knee.", es: "Parte baja delantera del muslo hasta la cara interna de la rodilla." },
    motor: { en: "Straightening the knee (quadriceps); bringing the legs together.", es: "Extender la rodilla (cuádriceps); juntar las piernas." },
    reflex: { en: "Knee reflex (L3-L4).", es: "Reflejo rotuliano (L3-L4)." },
    typicalDisc: { en: "L2-L3 disc", es: "Disco L2-L3" }
  },
  {
    id: "L4",
    region: "lumbar",
    exitAfter: "L4",
    exitBefore: "L5",
    sensory: { en: "Inner lower leg to the inner ankle.", es: "Cara interna de la pierna hasta el tobillo interno." },
    motor: { en: "Pulling the foot up (ankle dorsiflexion); straightening the knee.", es: "Subir el pie (dorsiflexión del tobillo); extender la rodilla." },
    reflex: { en: "Knee reflex.", es: "Reflejo rotuliano." },
    typicalDisc: { en: "L3-L4 disc (or a far-lateral L4-L5 disc)", es: "Disco L3-L4 (o un disco L4-L5 muy lateral)" }
  },
  {
    id: "L5",
    region: "lumbar",
    exitAfter: "L5",
    exitBefore: "sacrum",
    sensory: { en: "Outer lower leg, top of the foot and the big toe.", es: "Cara externa de la pierna, dorso del pie y dedo gordo." },
    motor: { en: "Lifting the big toe; pulling the foot up; holding the pelvis level when walking (hip abduction).", es: "Levantar el dedo gordo; subir el pie; mantener la pelvis nivelada al caminar (abducción de cadera)." },
    reflex: null,
    typicalDisc: { en: "L4-L5 disc", es: "Disco L4-L5" },
    note: {
      en: "In the low back the usual disc bulge catches the root travelling down to the next level, so an L4-L5 disc usually affects L5.",
      es: "En la zona lumbar la hernia habitual atrapa la raíz que baja al siguiente nivel, por eso un disco L4-L5 suele afectar a L5."
    }
  },
  {
    id: "S1",
    region: "sacral",
    exitAfter: "sacrum",
    exitBefore: "sacrum",
    sensory: { en: "Outer foot, little toe, sole and heel.", es: "Borde externo del pie, dedo pequeño, planta y talón." },
    motor: { en: "Pushing up onto tiptoe (calf); turning the sole outward; hip extension.", es: "Ponerse de puntillas (pantorrilla); girar la planta hacia fuera; extensión de cadera." },
    reflex: { en: "Ankle reflex (Achilles).", es: "Reflejo aquíleo." },
    typicalDisc: { en: "L5-S1 disc", es: "Disco L5-S1" }
  },
  {
    id: "S2",
    region: "sacral",
    exitAfter: "sacrum",
    exitBefore: "sacrum",
    sensory: { en: "A strip down the back of the thigh and calf.", es: "Una franja por detrás del muslo y la pantorrilla." },
    motor: { en: "Toe bending; bladder and bowel control (S2-S4).", es: "Flexión de los dedos; control de vejiga e intestino (S2-S4)." },
    reflex: null
  },
  {
    id: "S3",
    region: "sacral",
    exitAfter: "sacrum",
    exitBefore: "sacrum",
    sensory: { en: "Inner buttocks and the saddle area.", es: "Parte interna de los glúteos y la zona del sillín." },
    motor: { en: "Bladder, bowel and sexual function (S2-S4).", es: "Función de vejiga, intestino y sexual (S2-S4)." },
    reflex: null,
    note: {
      en: "New numbness in the saddle area with bladder or bowel changes is an emergency (possible cauda equina syndrome).",
      es: "Un adormecimiento nuevo en la zona del sillín con cambios en la vejiga o el intestino es una emergencia (posible síndrome de cola de caballo)."
    }
  },
  {
    id: "S4",
    region: "sacral",
    exitAfter: "sacrum",
    exitBefore: "sacrum",
    sensory: { en: "Saddle area and perineum.", es: "Zona del sillín y periné." },
    motor: { en: "Bladder, bowel and sexual function (S2-S4).", es: "Función de vejiga, intestino y sexual (S2-S4)." },
    reflex: null
  },
  {
    id: "S5",
    region: "sacral",
    exitAfter: "sacrum",
    exitBefore: "coccyx",
    sensory: { en: "Skin immediately around the anus.", es: "Piel alrededor del ano." },
    motor: { en: "Anal sphincter (with S2-S4).", es: "Esfínter anal (junto con S2-S4)." },
    reflex: null
  }
];

function thoracicBand(n: number, sensory: L): Root[] {
  return [
    {
      id: `T${n}`,
      region: "thoracic",
      exitAfter: `T${n}`,
      exitBefore: n === 12 ? "L1" : `T${n + 1}`,
      sensory,
      motor: n >= 7
        ? { en: "Muscles between the ribs and of the abdominal wall.", es: "Músculos entre las costillas y de la pared abdominal." }
        : { en: "Muscles between the ribs.", es: "Músculos entre las costillas." },
      reflex: null,
      note: {
        en: "Band-like pain here can come from the spine, but also from shingles, the heart, lungs or abdomen — don't assume it is the back.",
        es: "Un dolor en franja aquí puede venir de la columna, pero también del herpes zóster, el corazón, los pulmones o el abdomen: no asumas que es la espalda."
      }
    }
  ];
}

export function rootById(id: string): Root | undefined {
  return ROOTS.find((r) => r.id === id);
}

/** Roots that leave the spine directly above (between it and the one above) a vertebra. */
export function rootsExitingAbove(vertebraId: string): Root[] {
  return ROOTS.filter((r) => r.exitBefore === vertebraId && r.region !== "sacral");
}

/** Roots that leave the spine directly below a vertebra. */
export function rootsExitingBelow(vertebraId: string): Root[] {
  if (vertebraId === "sacrum") return ROOTS.filter((r) => r.region === "sacral");
  return ROOTS.filter((r) => r.exitAfter === vertebraId && r.region !== "sacral");
}

/**
 * The root a typical (posterolateral) disc bulge at `upper`-`lower` presses on.
 * Neck: the root exiting at that level, numbered after the lower vertebra.
 * Low back: the root travelling past to exit one level lower — also numbered
 * after the lower vertebra. Same arithmetic, different anatomy, which is why
 * it is spelled out rather than derived.
 */
export function rootForDisc(upper: string, lower: string): string | undefined {
  const map: Record<string, string> = {
    "C2-C3": "C3", "C3-C4": "C4", "C4-C5": "C5", "C5-C6": "C6", "C6-C7": "C7", "C7-T1": "C8",
    "L1-L2": "L2", "L2-L3": "L3", "L3-L4": "L4", "L4-L5": "L5", "L5-sacrum": "S1"
  };
  return map[`${upper}-${lower}`];
}
