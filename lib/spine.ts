import type { L } from "./i18n";

export type SpineRegion = "cervical" | "thoracic" | "lumbar" | "sacral" | "coccyx";

export interface Vertebra {
  id: string;
  region: SpineRegion;
  /** Common name, when it has one (Atlas, Axis, Vertebra prominens). */
  name?: L;
  facts: L[];
}

export const REGION_INFO: Record<SpineRegion, { name: L; count: L; curve: L }> = {
  cervical: {
    name: { en: "Cervical spine (neck)", es: "Columna cervical (cuello)" },
    count: { en: "7 vertebrae, 8 nerve roots", es: "7 vértebras, 8 raíces nerviosas" },
    curve: { en: "Curves forward (lordosis).", es: "Se curva hacia delante (lordosis)." }
  },
  thoracic: {
    name: { en: "Thoracic spine (upper and mid back)", es: "Columna dorsal (espalda alta y media)" },
    count: { en: "12 vertebrae, each carrying a pair of ribs", es: "12 vértebras, cada una con un par de costillas" },
    curve: { en: "Curves backward (kyphosis).", es: "Se curva hacia atrás (cifosis)." }
  },
  lumbar: {
    name: { en: "Lumbar spine (low back)", es: "Columna lumbar (espalda baja)" },
    count: { en: "5 vertebrae, the largest in the spine", es: "5 vértebras, las más grandes de la columna" },
    curve: { en: "Curves forward (lordosis).", es: "Se curva hacia delante (lordosis)." }
  },
  sacral: {
    name: { en: "Sacrum", es: "Sacro" },
    count: { en: "5 vertebrae fused into one bone", es: "5 vértebras fusionadas en un solo hueso" },
    curve: { en: "Curves backward, forming the back of the pelvis.", es: "Se curva hacia atrás y forma la parte posterior de la pelvis." }
  },
  coccyx: {
    name: { en: "Coccyx (tailbone)", es: "Cóccix (coxis)" },
    count: { en: "3-5 small vertebrae fused, usually 4", es: "3-5 vértebras pequeñas fusionadas, normalmente 4" },
    curve: { en: "Continues the sacral curve.", es: "Continúa la curva del sacro." }
  }
};

const typicalCervical: L = {
  en: "Has small holes in its side wings (transverse foramina) that carry the vertebral arteries up to the brain.",
  es: "Tiene pequeños orificios en sus alas laterales (forámenes transversos) por donde suben las arterias vertebrales al cerebro."
};

const ribs: L = {
  en: "Joins a pair of ribs, which is why the mid back moves less than the neck or low back.",
  es: "Se articula con un par de costillas; por eso la espalda media se mueve menos que el cuello o la zona lumbar."
};

function cervical(n: number, extra: L[] = []): Vertebra {
  return { id: `C${n}`, region: "cervical", facts: [typicalCervical, ...extra] };
}

function thoracic(n: number, extra: L[] = []): Vertebra {
  return { id: `T${n}`, region: "thoracic", facts: [ribs, ...extra] };
}

function lumbar(n: number, extra: L[] = []): Vertebra {
  return {
    id: `L${n}`,
    region: "lumbar",
    facts: [
      {
        en: "Carries most of the upper body's weight, so the body is thick and kidney-shaped.",
        es: "Soporta la mayor parte del peso del tronco, por eso su cuerpo es grueso y con forma de riñón."
      },
      ...extra
    ]
  };
}

export const VERTEBRAE: readonly Vertebra[] = [
  {
    id: "C1",
    region: "cervical",
    name: { en: "Atlas", es: "Atlas" },
    facts: [
      {
        en: "A ring with no body: it holds up the skull, as Atlas held up the sky.",
        es: "Un anillo sin cuerpo vertebral: sostiene el cráneo, como Atlas sostenía el cielo."
      },
      {
        en: "The skull-atlas joint does much of the 'yes' nodding movement.",
        es: "La articulación cráneo-atlas realiza gran parte del movimiento de asentir ('sí')."
      }
    ]
  },
  {
    id: "C2",
    region: "cervical",
    name: { en: "Axis", es: "Axis" },
    facts: [
      {
        en: "Has an upward peg (the dens) that the atlas pivots around.",
        es: "Tiene una apófisis hacia arriba (la apófisis odontoides) alrededor de la cual gira el atlas."
      },
      {
        en: "About half of the neck's turning ('no') happens between C1 and C2.",
        es: "Cerca de la mitad del giro del cuello ('no') ocurre entre C1 y C2."
      }
    ]
  },
  cervical(3),
  cervical(4),
  cervical(5, [
    {
      en: "C5-C6 is one of the two most mobile levels of the lower neck and a common site of disc wear.",
      es: "C5-C6 es uno de los dos niveles más móviles del cuello bajo y un sitio frecuente de desgaste discal."
    }
  ]),
  cervical(6, [
    {
      en: "The vertebral artery usually enters the spine here, at C6.",
      es: "La arteria vertebral suele entrar en la columna aquí, en C6."
    },
    {
      en: "C6-C7 is the most common level for a trapped nerve in the neck (the C7 root).",
      es: "C6-C7 es el nivel más frecuente de nervio atrapado en el cuello (la raíz C7)."
    }
  ]),
  {
    id: "C7",
    region: "cervical",
    name: { en: "Vertebra prominens", es: "Vértebra prominente" },
    facts: [
      {
        en: "The bump you can feel at the base of the neck when you bend your head forward.",
        es: "El bulto que se palpa en la base del cuello al inclinar la cabeza hacia delante."
      },
      {
        en: "The C8 root leaves below it: seven cervical vertebrae, eight cervical roots.",
        es: "La raíz C8 sale por debajo: siete vértebras cervicales, ocho raíces cervicales."
      }
    ]
  },
  thoracic(1, [
    {
      en: "Carries the first rib. The body's sympathetic ('fight or flight') outflow starts here and runs to L2.",
      es: "Lleva la primera costilla. La salida simpática ('lucha o huida') empieza aquí y llega hasta L2."
    }
  ]),
  thoracic(2),
  thoracic(3, [
    {
      en: "Roughly level with the spine of the shoulder blade.",
      es: "Aproximadamente a la altura de la espina de la escápula."
    }
  ]),
  thoracic(4),
  thoracic(5),
  thoracic(6),
  thoracic(7, [
    {
      en: "Roughly level with the bottom tip of the shoulder blade.",
      es: "Aproximadamente a la altura de la punta inferior de la escápula."
    }
  ]),
  thoracic(8),
  thoracic(9),
  thoracic(10),
  thoracic(11, [
    { en: "Carries a 'floating' rib that doesn't reach the breastbone.", es: "Lleva una costilla 'flotante' que no llega al esternón." }
  ]),
  thoracic(12, [
    {
      en: "The transition from the stiff mid back to the mobile low back.",
      es: "La transición entre la espalda media rígida y la zona lumbar móvil."
    }
  ]),
  lumbar(1, [
    {
      en: "The spinal cord usually ends around L1-L2. Below that, the canal holds a bundle of roots: the cauda equina ('horse's tail').",
      es: "La médula espinal suele terminar alrededor de L1-L2. Por debajo, el canal contiene un haz de raíces: la cola de caballo."
    }
  ]),
  lumbar(2),
  lumbar(3),
  lumbar(4, [
    {
      en: "A line across the tops of the hip bones usually crosses near L4.",
      es: "Una línea entre las crestas de las caderas suele cruzar cerca de L4."
    },
    {
      en: "L4-L5 and L5-S1 account for the large majority of low-back disc herniations.",
      es: "L4-L5 y L5-S1 concentran la gran mayoría de las hernias discales lumbares."
    }
  ]),
  lumbar(5, [
    {
      en: "The largest vertebra, and the most common site of a stress fracture of the arch (spondylolysis).",
      es: "La vértebra más grande y el sitio más frecuente de fractura por estrés del arco (espondilólisis)."
    }
  ]),
  {
    id: "sacrum",
    region: "sacral",
    facts: [
      {
        en: "Five vertebrae fused into a wedge that locks into the pelvis at the sacroiliac joints.",
        es: "Cinco vértebras fusionadas en una cuña que encaja en la pelvis por las articulaciones sacroilíacas."
      },
      {
        en: "Roots S2-S4 run the bladder, bowel and sexual function (the sacral part of the parasympathetic system).",
        es: "Las raíces S2-S4 controlan la vejiga, el intestino y la función sexual (la parte sacra del sistema parasimpático)."
      }
    ]
  },
  {
    id: "coccyx",
    region: "coccyx",
    facts: [
      {
        en: "The tailbone: usually four tiny fused vertebrae. Pain here after a fall or long sitting is called coccydynia.",
        es: "El cóccix: normalmente cuatro vértebras diminutas fusionadas. El dolor aquí tras una caída o estar mucho sentado se llama coccigodinia."
      }
    ]
  }
];

/**
 * The autonomic wiring the "nervous system" wall poster shows, stated
 * correctly: sympathetic fibres leave from T1-L2 only; parasympathetic fibres
 * leave from the brainstem (cranial nerves, mainly the vagus) and S2-S4.
 */
export interface AutonomicLink {
  from: string[];
  system: "sympathetic" | "parasympathetic";
  via: L;
  targets: L;
}

export const AUTONOMIC: readonly AutonomicLink[] = [
  {
    from: ["T1", "T2", "T3", "T4", "T5"],
    system: "sympathetic",
    via: { en: "Sympathetic chain (cervical and upper thoracic ganglia)", es: "Cadena simpática (ganglios cervicales y torácicos altos)" },
    targets: { en: "Eye (pupil), face sweat glands, heart, lungs and airways.", es: "Ojo (pupila), glándulas sudoríparas de la cara, corazón, pulmones y vías respiratorias." }
  },
  {
    from: ["T5", "T6", "T7", "T8", "T9"],
    system: "sympathetic",
    via: { en: "Greater splanchnic nerve to the coeliac ganglion", es: "Nervio esplácnico mayor hacia el ganglio celíaco" },
    targets: { en: "Stomach, liver, gallbladder, pancreas, spleen.", es: "Estómago, hígado, vesícula biliar, páncreas, bazo." }
  },
  {
    from: ["T10", "T11", "T12"],
    system: "sympathetic",
    via: { en: "Lesser and least splanchnic nerves to the superior mesenteric and renal ganglia", es: "Nervios esplácnicos menor e imo hacia los ganglios mesentérico superior y renal" },
    targets: { en: "Small intestine, first half of the large intestine, kidneys, adrenal glands.", es: "Intestino delgado, primera mitad del intestino grueso, riñones, glándulas suprarrenales." }
  },
  {
    from: ["L1", "L2"],
    system: "sympathetic",
    via: { en: "Lumbar splanchnic nerves to the inferior mesenteric ganglion", es: "Nervios esplácnicos lumbares hacia el ganglio mesentérico inferior" },
    targets: { en: "Second half of the large intestine, rectum, bladder, sexual organs.", es: "Segunda mitad del intestino grueso, recto, vejiga, órganos sexuales." }
  },
  {
    from: ["sacrum"],
    system: "parasympathetic",
    via: { en: "Pelvic splanchnic nerves (S2-S4)", es: "Nervios esplácnicos pélvicos (S2-S4)" },
    targets: { en: "Bladder emptying, rectum, sexual organs.", es: "Vaciado de la vejiga, recto, órganos sexuales." }
  },
  {
    from: ["C1"],
    system: "parasympathetic",
    via: {
      en: "Not the spine: cranial nerves from the brainstem (III, VII, IX and the vagus, X)",
      es: "No es la columna: nervios craneales del tronco encefálico (III, VII, IX y el vago, X)"
    },
    targets: {
      en: "Tear and salivary glands, pupil, heart rate, lungs, and the gut as far as the middle of the large intestine.",
      es: "Glándulas lagrimales y salivales, pupila, frecuencia cardiaca, pulmones y el intestino hasta la mitad del intestino grueso."
    }
  }
];

export function vertebraById(id: string): Vertebra | undefined {
  return VERTEBRAE.find((v) => v.id === id);
}

export function autonomicFor(vertebraId: string): AutonomicLink[] {
  return AUTONOMIC.filter((a) => a.from.includes(vertebraId));
}

/** The vertebra directly below, or undefined at the coccyx. */
export function nextVertebra(id: string): Vertebra | undefined {
  const i = VERTEBRAE.findIndex((v) => v.id === id);
  return i >= 0 ? VERTEBRAE[i + 1] : undefined;
}
