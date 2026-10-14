import type { L } from "./i18n";
import type { SourceId } from "./sources";

/**
 * One vertebra, part by part: the inset on the "Columna vertebral" poster,
 * made tappable. Neck, mid-back and low-back vertebrae are built differently
 * for different jobs, so every part can say how it differs by region.
 *
 * Then the side view: how a root actually gets trapped in the opening it
 * leaves through, and why looking up and turning toward the sore side makes
 * arm pain worse while looking down often eases it.
 */
export type VertebraKind = "cervical" | "thoracic" | "lumbar";

export const VERTEBRA_KINDS: readonly VertebraKind[] = ["cervical", "thoracic", "lumbar"];

export const KIND_INFO: Record<VertebraKind, { example: string; summary: L }> = {
  cervical: {
    example: "C5",
    summary: {
      en: "Small and light, built for movement. Holes in the side wings carry arteries up to the brain.",
      es: "Pequeña y ligera, hecha para moverse. Los orificios de sus alas laterales llevan arterias hacia el cerebro."
    }
  },
  thoracic: {
    example: "T6",
    summary: {
      en: "Locked to a pair of ribs: built to protect the chest more than to move.",
      es: "Unida a un par de costillas: hecha más para proteger el tórax que para moverse."
    }
  },
  lumbar: {
    example: "L4",
    summary: {
      en: "Big and heavy, built to carry load. The spinal cord has already ended, so the canal holds a bundle of roots.",
      es: "Grande y pesada, hecha para soportar carga. La médula ya ha terminado, así que el canal contiene un haz de raíces."
    }
  }
};

export type PartId =
  | "body"
  | "canal"
  | "cord"
  | "root"
  | "pedicle"
  | "facet"
  | "lamina"
  | "spinous"
  | "transverse"
  | "transverseForamen"
  | "ribFacet";

export interface Part {
  id: PartId;
  name: L;
  /** A different name in one region (the lumbar canal holds the cauda equina, not the cord). */
  nameByKind?: Partial<Record<VertebraKind, L>>;
  role: L;
  byKind?: Partial<Record<VertebraKind, L>>;
  matters?: L;
  kinds: readonly VertebraKind[];
  sources: SourceId[];
}

const ALL = VERTEBRA_KINDS;

export const PARTS: readonly Part[] = [
  {
    id: "body",
    name: { en: "Vertebral body", es: "Cuerpo vertebral" },
    role: {
      en: "The weight-bearing block at the front. A disc sits between one body and the next.",
      es: "El bloque que soporta el peso, en la parte delantera. Entre un cuerpo y el siguiente hay un disco."
    },
    byKind: {
      cervical: {
        en: "Small and wide, with raised lips on its upper edges (uncinate processes) that guide movement.",
        es: "Pequeño y ancho, con bordes elevados en su parte superior (apófisis unciformes) que guían el movimiento."
      },
      thoracic: {
        en: "Heart-shaped, with small joint surfaces at its back corners for the head of a rib.",
        es: "En forma de corazón, con pequeñas superficies articulares en sus esquinas posteriores para la cabeza de una costilla."
      },
      lumbar: {
        en: "The largest bodies in the spine, kidney-shaped, because they carry the most weight.",
        es: "Los cuerpos más grandes de la columna, con forma de riñón, porque soportan más peso."
      }
    },
    matters: {
      en: "Disc bulges and wear at the edges of the bodies are common with age and often cause no pain: in a study of over 1,200 people with no symptoms, most neck MRIs showed disc bulges. A scan finding is not proof of a cause.",
      es: "Las protrusiones discales y el desgaste en los bordes de los cuerpos son frecuentes con la edad y a menudo no duelen: en un estudio de más de 1,200 personas sin síntomas, la mayoría de las resonancias cervicales mostraban protrusiones. Un hallazgo en la resonancia no prueba la causa."
    },
    kinds: ALL,
    sources: ["nakashima2015"]
  },
  {
    id: "canal",
    name: { en: "Spinal canal (vertebral foramen)", es: "Canal vertebral (agujero vertebral)" },
    role: {
      en: "The opening behind the body. Stacked up, these openings form the canal that protects the spinal cord.",
      es: "La abertura detrás del cuerpo. Apiladas, estas aberturas forman el canal que protege la médula espinal."
    },
    byKind: {
      cervical: {
        en: "Wide and triangular: the cord is thickest here, where the nerves for the arms join it.",
        es: "Ancho y triangular: la médula es más gruesa aquí, donde se le unen los nervios de los brazos."
      },
      thoracic: { en: "Small and round, with little spare room around the cord.", es: "Pequeño y redondo, con poco espacio libre alrededor de la médula." },
      lumbar: { en: "Triangular. Below L1-L2 it holds nerve roots, not the cord.", es: "Triangular. Por debajo de L1-L2 contiene raíces nerviosas, no la médula." }
    },
    matters: {
      en: "Narrowing of the canal (stenosis) can press on the cord in the neck: clumsy hands, trouble with buttons or unsteady walking are reasons to see a doctor soon. In the low back it more often causes leg pain on walking that eases when you sit or lean forward.",
      es: "El estrechamiento del canal (estenosis) puede comprimir la médula en el cuello: manos torpes, dificultad con los botones o caminar inestable son motivos para ver pronto a un médico. En la zona lumbar suele causar dolor de piernas al caminar que mejora al sentarse o inclinarse hacia delante."
    },
    kinds: ALL,
    sources: ["standring2020"]
  },
  {
    id: "cord",
    name: { en: "Spinal cord", es: "Médula espinal" },
    nameByKind: { lumbar: { en: "Cauda equina", es: "Cola de caballo" } },
    role: { en: "What runs through the canal.", es: "Lo que recorre el canal." },
    byKind: {
      cervical: {
        en: "The spinal cord itself, carrying every signal between the brain and the body below the neck.",
        es: "La médula espinal en sí, que lleva todas las señales entre el cerebro y el cuerpo por debajo del cuello."
      },
      thoracic: {
        en: "The spinal cord, carrying signals for the trunk and legs. The grey butterfly in the middle is where nerve cells sit.",
        es: "La médula espinal, que lleva las señales del tronco y las piernas. La mariposa gris del centro es donde están las neuronas."
      },
      lumbar: {
        en: "The cord has already ended, around L1-L2. Below that the canal holds the cauda equina ('horse's tail'): the roots for the legs, bladder and bowel. Pressure on the whole bundle at once is an emergency: numbness between the legs, new bladder or bowel trouble, or weakness in both legs.",
        es: "La médula ya ha terminado, alrededor de L1-L2. Por debajo, el canal contiene la cola de caballo: las raíces de las piernas, la vejiga y el intestino. La compresión de todo el haz a la vez es una emergencia: adormecimiento entre las piernas, problemas nuevos de vejiga o intestino, o debilidad en ambas piernas."
      }
    },
    kinds: ALL,
    sources: ["standring2020"]
  },
  {
    id: "root",
    name: { en: "Nerve root", es: "Raíz nerviosa" },
    role: {
      en: "Leaves the canal sideways, through the opening between two vertebrae (the intervertebral foramen), and becomes a spinal nerve.",
      es: "Sale del canal hacia un lado, por la abertura entre dos vértebras (el agujero de conjunción), y se convierte en un nervio espinal."
    },
    byKind: {
      cervical: {
        en: "In the neck, a root is named for the vertebra below it: the C6 root leaves between C5 and C6. It runs out in a gutter on top of the side wing, behind the artery.",
        es: "En el cuello, una raíz lleva el nombre de la vértebra de debajo: la raíz C6 sale entre C5 y C6. Sale por un canal sobre el ala lateral, por detrás de la arteria."
      },
      thoracic: {
        en: "Runs out under its rib as an intercostal nerve, wrapping round the chest.",
        es: "Sale bajo su costilla como nervio intercostal y rodea el tórax."
      },
      lumbar: {
        en: "Leaves below its own vertebra: the L4 root leaves between L4 and L5. A typical L4-L5 disc bulge catches the L5 root, which is on its way to the next opening down.",
        es: "Sale por debajo de su propia vértebra: la raíz L4 sale entre L4 y L5. Una protrusión típica del disco L4-L5 atrapa la raíz L5, que va de camino a la abertura siguiente."
      }
    },
    matters: {
      en: "This side opening is where a nerve gets trapped: by a disc bulging from the front, by thickened joints and bone spurs from behind, or both. The side view below shows how.",
      es: "Esta abertura lateral es donde se atrapa un nervio: por un disco que protruye desde delante, por articulaciones engrosadas y osteofitos desde atrás, o por ambos. La vista lateral de abajo muestra cómo."
    },
    kinds: ALL,
    sources: ["bono2011"]
  },
  {
    id: "pedicle",
    name: { en: "Pedicle", es: "Pedículo" },
    role: { en: "The two short pillars that join the body to the arch behind it.", es: "Los dos pilares cortos que unen el cuerpo al arco que tiene detrás." },
    matters: {
      en: "The notches above and below each pedicle form the top and bottom of the side openings where the roots leave.",
      es: "Las escotaduras por encima y por debajo de cada pedículo forman el techo y el suelo de las aberturas laterales por donde salen las raíces."
    },
    kinds: ALL,
    sources: ["standring2020"]
  },
  {
    id: "facet",
    name: { en: "Facet joints (articular processes)", es: "Articulaciones facetarias (apófisis articulares)" },
    role: {
      en: "Two pairs of small joints at the back that link each vertebra to the ones above and below. They guide and limit movement.",
      es: "Dos pares de pequeñas articulaciones en la parte posterior que unen cada vértebra con la de arriba y la de abajo. Guían y limitan el movimiento."
    },
    byKind: {
      cervical: { en: "Angled like roof tiles, so the neck can bend, tilt and turn.", es: "Inclinadas como tejas, para que el cuello pueda flexionarse, inclinarse y girar." },
      thoracic: { en: "Nearly upright, suited to turning, while the ribs limit bending.", es: "Casi verticales, aptas para girar, mientras las costillas limitan la flexión." },
      lumbar: {
        en: "Curved and facing each other: they allow bending forward and back but limit twisting.",
        es: "Curvas y enfrentadas: permiten flexionarse hacia delante y hacia atrás pero limitan la torsión."
      }
    },
    matters: {
      en: "With age these joints can thicken and narrow the side opening from behind. The 'pop' of a manipulation is gas forming in a joint's fluid, as when knuckles crack. It is not the sound of a bone going back into place.",
      es: "Con la edad estas articulaciones pueden engrosarse y estrechar la abertura lateral desde atrás. El 'chasquido' de una manipulación es gas que se forma en el líquido de la articulación, como al hacer sonar los nudillos. No es el sonido de un hueso que vuelve a su sitio."
    },
    kinds: ALL,
    sources: ["kawchuk2015", "standring2020"]
  },
  {
    id: "lamina",
    name: { en: "Lamina", es: "Lámina" },
    role: { en: "The flat plates that close the canal from behind and meet in the middle.", es: "Las placas planas que cierran el canal por detrás y se unen en el centro." },
    matters: {
      en: "A laminectomy removes part of the laminae to give squeezed nerves more room.",
      es: "Una laminectomía retira parte de las láminas para dar más espacio a los nervios comprimidos."
    },
    kinds: ALL,
    sources: ["standring2020"]
  },
  {
    id: "spinous",
    name: { en: "Spinous process", es: "Apófisis espinosa" },
    role: {
      en: "The bony ridge you can feel down the middle of your back, where muscles and ligaments attach.",
      es: "La cresta ósea que se palpa en el centro de la espalda, donde se insertan músculos y ligamentos."
    },
    byKind: {
      cervical: {
        en: "Short and often forked (bifid) from C3 to C6. C7's is long: the bump at the base of the neck.",
        es: "Corta y a menudo bífida de C3 a C6. La de C7 es larga: el bulto en la base del cuello."
      },
      thoracic: {
        en: "Long and sloping down, overlapping the one below like roof tiles, so its tip sits level with the next vertebra down.",
        es: "Larga e inclinada hacia abajo, superpuesta a la de debajo como tejas, de modo que su punta queda a la altura de la vértebra siguiente."
      },
      lumbar: { en: "Short, thick and square, pointing straight back.", es: "Corta, gruesa y cuadrada, dirigida hacia atrás." }
    },
    kinds: ALL,
    sources: ["standring2020"]
  },
  {
    id: "transverse",
    name: { en: "Transverse process", es: "Apófisis transversa" },
    role: { en: "The side wings, where muscles and ligaments attach.", es: "Las alas laterales, donde se insertan músculos y ligamentos." },
    byKind: {
      cervical: {
        en: "Short, with a hole for the vertebral artery and a gutter on top that the nerve root runs along.",
        es: "Corta, con un orificio para la arteria vertebral y un canal por encima por donde discurre la raíz nerviosa."
      },
      thoracic: { en: "Strong and angled back; the knob of the rib rests on its tip.", es: "Fuerte e inclinada hacia atrás; el tubérculo de la costilla se apoya en su punta." },
      lumbar: { en: "Long and thin, anchoring the deep back muscles.", es: "Larga y delgada, ancla los músculos profundos de la espalda." }
    },
    kinds: ALL,
    sources: ["standring2020"]
  },
  {
    id: "transverseForamen",
    name: { en: "Vertebral artery and its opening", es: "Arteria vertebral y su orificio" },
    role: {
      en: "Holes in the side wings of the neck vertebrae, usually from C6 up, carry the vertebral arteries to the back of the brain.",
      es: "Los orificios de las alas laterales de las vértebras cervicales, normalmente de C6 hacia arriba, llevan las arterias vertebrales a la parte posterior del cerebro."
    },
    matters: {
      en: "The artery runs through bones that move, which is why neck manipulation carries a rare risk of artery injury. An association with stroke is established; whether manipulation causes it is not. Ask about it before any neck manipulation.",
      es: "La arteria pasa por huesos que se mueven; por eso la manipulación cervical conlleva un riesgo raro de lesión arterial. La asociación con el ictus está establecida; que la manipulación lo cause, no. Pregunta por ello antes de cualquier manipulación cervical."
    },
    kinds: ["cervical"],
    sources: ["biller2014", "cassidy2008"]
  },
  {
    id: "ribFacet",
    name: { en: "Rib joints", es: "Articulaciones costales" },
    role: {
      en: "Small joint surfaces on the body and on the tip of the side wing, where a rib attaches.",
      es: "Pequeñas superficies articulares en el cuerpo y en la punta del ala lateral, donde se une una costilla."
    },
    matters: {
      en: "Pain from these joints can wrap around the chest. New chest pain still needs a doctor first.",
      es: "El dolor de estas articulaciones puede rodear el tórax. Un dolor torácico nuevo necesita primero un médico."
    },
    kinds: ["thoracic"],
    sources: ["standring2020"]
  }
];

export function partsFor(kind: VertebraKind): Part[] {
  return PARTS.filter((p) => p.kinds.includes(kind));
}

export function partName(part: Part, kind: VertebraKind): L {
  return part.nameByKind?.[kind] ?? part.name;
}

/* ---------- How a root gets trapped: the side view ---------- */

export type Cause = "none" | "herniation" | "narrowing";
export type NeckPosition = "down" | "neutral" | "up-turn";
export type RoomState = "free" | "touching" | "squeezed";

export const CAUSES: readonly { id: Cause; name: L; text: L; sources: SourceId[] }[] = [
  {
    id: "none",
    name: { en: "Healthy", es: "Sano" },
    text: {
      en: "The root has room to slide as you move. The opening is bounded by the disc and bodies in front, a pedicle above and below, and a facet joint behind.",
      es: "La raíz tiene espacio para deslizarse al moverte. La abertura está limitada por el disco y los cuerpos delante, un pedículo arriba y otro abajo, y una articulación facetaria detrás."
    },
    sources: ["standring2020"]
  },
  {
    id: "herniation",
    name: { en: "Disc herniation", es: "Hernia de disco" },
    text: {
      en: "Soft disc material pushes out backwards and to the side, pressing on the root and inflaming it. Most people improve a lot over weeks to months. Bulges also show up on most neck MRIs of people with no symptoms, so a scan alone doesn't prove which one is the cause.",
      es: "Material blando del disco sale hacia atrás y hacia un lado, comprime la raíz y la inflama. La mayoría de las personas mejora mucho en semanas o meses. Las protrusiones también aparecen en la mayoría de las resonancias cervicales de personas sin síntomas, así que una resonancia sola no prueba cuál es la causa."
    },
    sources: ["wong2014", "nakashima2015"]
  },
  {
    id: "narrowing",
    name: { en: "Bony narrowing", es: "Estrechamiento óseo" },
    text: {
      en: "With age the disc loses height and the joints around the opening thicken and grow bone spurs, closing it from the front and the back (spondylosis). Symptoms often come on gradually and come and go.",
      es: "Con la edad el disco pierde altura y las articulaciones alrededor de la abertura se engrosan y forman osteofitos, que la cierran por delante y por detrás (espondilosis). Los síntomas suelen aparecer poco a poco e ir y venir."
    },
    sources: ["bono2011"]
  }
];

export const POSITIONS: readonly { id: NeckPosition; name: L; text: L; sources: SourceId[] }[] = [
  {
    id: "down",
    name: { en: "Looking down", es: "Mirando hacia abajo" },
    text: { en: "Bending the head forward makes the opening a little bigger.", es: "Inclinar la cabeza hacia delante agranda un poco la abertura." },
    sources: ["yoo1992"]
  },
  {
    id: "neutral",
    name: { en: "Head level", es: "Cabeza recta" },
    text: { en: "Head level, looking straight ahead.", es: "Cabeza recta, mirando al frente." },
    sources: []
  },
  {
    id: "up-turn",
    name: { en: "Looking up, turned to that side", es: "Mirando arriba, girado hacia ese lado" },
    text: {
      en: "Looking up and turning toward the sore side makes the opening smaller. That is why the movement can bring on arm pain, and why clinicians use it as a test (Spurling's test). It is a clinician's test: don't press down on your own head to try it.",
      es: "Mirar hacia arriba y girar hacia el lado que duele achica la abertura. Por eso ese movimiento puede provocar dolor en el brazo, y por eso los profesionales lo usan como prueba (prueba de Spurling). Es una prueba para el profesional: no te presiones la cabeza para probarla."
    },
    sources: ["yoo1992", "wainner2003"]
  }
];

export const ROOM_LABEL: Record<RoomState, L> = {
  free: { en: "Room to spare", es: "Espacio de sobra" },
  touching: { en: "Little room left", es: "Queda poco espacio" },
  squeezed: { en: "Root squeezed", es: "Raíz comprimida" }
};

/**
 * The opening in the side view, in figure units. The root is 26 wide; the
 * healthy opening 56. Each cause takes room from the front (disc) or back
 * (facet joint), and the head position adds or removes a little. The numbers
 * are a picture of the direction of each effect, not measurements: a scan is
 * the only way to see a particular opening.
 */
export const OPENING = { front: 140, back: 196, root: 26 } as const;

const INTRUSION: Record<Cause, { front: number; back: number; drop: number }> = {
  none: { front: 0, back: 0, drop: 0 },
  herniation: { front: 22, back: 0, drop: 0 },
  narrowing: { front: 12, back: 10, drop: 10 }
};

/** Positive closes the opening from behind; negative opens it. */
const POSITION_SHIFT: Record<NeckPosition, { back: number; tilt: number }> = {
  down: { back: -6, tilt: -4 },
  neutral: { back: 0, tilt: 0 },
  "up-turn": { back: 8, tilt: 4 }
};

/** Below this much room per unit of root, the root is touched; at about its own width, squeezed. */
const TOUCHING_BELOW = 1.4;
const SQUEEZED_AT = 1.05;

export interface Opening {
  front: number;
  back: number;
  room: number;
  drop: number;
  tilt: number;
  state: RoomState;
}

export function opening(cause: Cause, position: NeckPosition): Opening {
  const intrusion = INTRUSION[cause];
  const shift = POSITION_SHIFT[position];
  const front = OPENING.front + intrusion.front;
  const back = OPENING.back - intrusion.back - shift.back;
  const room = back - front;
  const state: RoomState = room <= OPENING.root * SQUEEZED_AT ? "squeezed" : room < OPENING.root * TOUCHING_BELOW ? "touching" : "free";
  return { front, back, room, drop: intrusion.drop, tilt: shift.tilt, state };
}
