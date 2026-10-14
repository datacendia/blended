import type { L } from "./i18n";
import { ROOTS } from "./roots";
import type { SourceId } from "./sources";

/**
 * The nervous-system poster on clinic walls, as data that can be checked.
 *
 * Those posters draw a line from each vertebra to an organ. The anatomy under
 * them is real but only half the story:
 *   - Sympathetic ("fight or flight") fibres leave the cord from T1 to L2
 *     only, then stop at relay stations (ganglia) outside the spine.
 *   - Parasympathetic ("rest and digest") fibres leave from the brainstem,
 *     mostly in the vagus, which never passes through the spine at all, and
 *     from S2-S4 for the bladder, the end of the bowel and the sexual organs.
 *   - Nothing for the organs leaves the neck (C1-C8) or L3-S1.
 *
 * Levels are spinal nerves, not vertebrae, and textbooks differ by a level or
 * two on each range; the page says so. __tests__/organs.test.ts pins the
 * rules above so a range can't drift outside T1-L2 by accident.
 */
export const SEGMENTS: readonly string[] = ROOTS.map((r) => r.id);

/** Where sympathetic fibres leave the cord. */
export const SYMPATHETIC_OUTFLOW = { from: "T1", to: "L2" } as const;
/** Where sacral parasympathetic fibres leave the cord. */
export const SACRAL_OUTFLOW = { from: "S2", to: "S4" } as const;

export type RelayId =
  | "superior-cervical"
  | "cervical-thoracic"
  | "chain"
  | "coeliac"
  | "superior-mesenteric"
  | "aorticorenal"
  | "inferior-mesenteric"
  | "none";

export const RELAYS: Record<RelayId, { name: L; prevertebral: boolean }> = {
  "superior-cervical": {
    name: { en: "Superior cervical ganglion, at the top of the chain in the neck", es: "Ganglio cervical superior, en la parte alta de la cadena, en el cuello" },
    prevertebral: false
  },
  "cervical-thoracic": {
    name: { en: "Cervical and upper thoracic ganglia of the chain", es: "Ganglios cervicales y torácicos altos de la cadena" },
    prevertebral: false
  },
  chain: {
    name: { en: "Ganglia of the sympathetic chain, beside the spine", es: "Ganglios de la cadena simpática, junto a la columna" },
    prevertebral: false
  },
  coeliac: {
    name: { en: "Coeliac ganglion, reached by the greater splanchnic nerve", es: "Ganglio celíaco, al que llega el nervio esplácnico mayor" },
    prevertebral: true
  },
  "superior-mesenteric": {
    name: { en: "Superior mesenteric ganglion", es: "Ganglio mesentérico superior" },
    prevertebral: true
  },
  aorticorenal: {
    name: { en: "Aorticorenal and renal ganglia", es: "Ganglios aorticorrenales y renales" },
    prevertebral: true
  },
  "inferior-mesenteric": {
    name: { en: "Inferior mesenteric ganglion and hypogastric plexus", es: "Ganglio mesentérico inferior y plexo hipogástrico" },
    prevertebral: true
  },
  none: {
    name: { en: "No relay: the fibres run straight to the gland", es: "Sin relevo: las fibras van directas a la glándula" },
    prevertebral: false
  }
};

export type ParaNerve = "III" | "VII" | "IX" | "X" | "pelvic";

export const PARA_NERVE: Record<ParaNerve, L> = {
  III: { en: "Oculomotor nerve (III)", es: "Nervio oculomotor (III)" },
  VII: { en: "Facial nerve (VII)", es: "Nervio facial (VII)" },
  IX: { en: "Glossopharyngeal nerve (IX)", es: "Nervio glosofaríngeo (IX)" },
  X: { en: "Vagus nerve (X)", es: "Nervio vago (X)" },
  pelvic: { en: "Pelvic splanchnic nerves (S2-S4)", es: "Nervios esplácnicos pélvicos (S2-S4)" }
};

export interface Organ {
  id: string;
  name: L;
  /** Label inside the figure, where space is tight. */
  short: L;
  sympathetic: { from: string; to: string; relay: RelayId; effect: L };
  parasympathetic: { nerves: ParaNerve[]; effect: L } | null;
  note?: L;
}

export const ORGANS: readonly Organ[] = [
  {
    id: "eye",
    name: { en: "Eye (pupil and eyelid)", es: "Ojo (pupila y párpado)" },
    short: { en: "Eye", es: "Ojo" },
    sympathetic: {
      from: "T1",
      to: "T2",
      relay: "superior-cervical",
      effect: { en: "Widens the pupil and lifts the upper eyelid slightly.", es: "Dilata la pupila y eleva un poco el párpado superior." }
    },
    parasympathetic: {
      nerves: ["III"],
      effect: { en: "Narrows the pupil and focuses the lens for near vision.", es: "Contrae la pupila y enfoca el cristalino para ver de cerca." }
    },
    note: {
      en: "The fibres climb the chain from the chest to the neck before reaching the eye. Damage anywhere along that path gives a small pupil and a drooping eyelid on one side (Horner's syndrome): a reason to see a doctor.",
      es: "Las fibras suben por la cadena desde el tórax hasta el cuello antes de llegar al ojo. Una lesión en cualquier punto de ese camino da una pupila pequeña y un párpado caído en un lado (síndrome de Horner): motivo para ver a un médico."
    }
  },
  {
    id: "glands",
    name: { en: "Tear and salivary glands", es: "Glándulas lagrimales y salivales" },
    short: { en: "Tears & saliva", es: "Lágrimas y saliva" },
    sympathetic: {
      from: "T1",
      to: "T2",
      relay: "superior-cervical",
      effect: { en: "Narrows the glands' blood vessels; saliva becomes scant and thick.", es: "Estrecha los vasos de las glándulas; la saliva se vuelve escasa y espesa." }
    },
    parasympathetic: {
      nerves: ["VII", "IX"],
      effect: { en: "Tears, and plenty of watery saliva.", es: "Lágrimas y abundante saliva acuosa." }
    }
  },
  {
    id: "heart",
    name: { en: "Heart", es: "Corazón" },
    short: { en: "Heart", es: "Corazón" },
    sympathetic: {
      from: "T1",
      to: "T4",
      relay: "cervical-thoracic",
      effect: { en: "Faster, stronger heartbeat.", es: "Latido más rápido y más fuerte." }
    },
    parasympathetic: {
      nerves: ["X"],
      effect: { en: "Slows the heart.", es: "Hace más lento el corazón." }
    }
  },
  {
    id: "lungs",
    name: { en: "Lungs and airways", es: "Pulmones y vías respiratorias" },
    short: { en: "Lungs", es: "Pulmones" },
    sympathetic: {
      from: "T2",
      to: "T5",
      relay: "chain",
      effect: { en: "Opens the airways, mostly through adrenaline carried in the blood.", es: "Abre las vías respiratorias, sobre todo mediante la adrenalina que lleva la sangre." }
    },
    parasympathetic: {
      nerves: ["X"],
      effect: { en: "Narrows the airways and increases mucus.", es: "Estrecha las vías respiratorias y aumenta el moco." }
    }
  },
  {
    id: "stomach",
    name: { en: "Stomach", es: "Estómago" },
    short: { en: "Stomach", es: "Estómago" },
    sympathetic: {
      from: "T6",
      to: "T9",
      relay: "coeliac",
      effect: { en: "Slows the stomach's movement and emptying.", es: "Enlentece el movimiento y el vaciado del estómago." }
    },
    parasympathetic: {
      nerves: ["X"],
      effect: { en: "Increases acid, enzymes and movement.", es: "Aumenta el ácido, las enzimas y el movimiento." }
    }
  },
  {
    id: "liver",
    name: { en: "Liver and gallbladder", es: "Hígado y vesícula biliar" },
    short: { en: "Liver & gallbladder", es: "Hígado y vesícula" },
    sympathetic: {
      from: "T7",
      to: "T9",
      relay: "coeliac",
      effect: { en: "Releases stored sugar into the blood.", es: "Libera a la sangre el azúcar almacenado." }
    },
    parasympathetic: {
      nerves: ["X"],
      effect: {
        en: "Supports digestion. Gut hormones do most of the work of emptying the gallbladder.",
        es: "Apoya la digestión. Las hormonas intestinales hacen la mayor parte del trabajo de vaciar la vesícula."
      }
    }
  },
  {
    id: "pancreas",
    name: { en: "Pancreas", es: "Páncreas" },
    short: { en: "Pancreas", es: "Páncreas" },
    sympathetic: {
      from: "T6",
      to: "T10",
      relay: "coeliac",
      effect: { en: "Reduces digestive enzymes and insulin release.", es: "Reduce las enzimas digestivas y la liberación de insulina." }
    },
    parasympathetic: {
      nerves: ["X"],
      effect: { en: "Increases digestive enzymes and insulin release.", es: "Aumenta las enzimas digestivas y la liberación de insulina." }
    }
  },
  {
    id: "adrenal",
    name: { en: "Adrenal glands", es: "Glándulas suprarrenales" },
    short: { en: "Adrenal glands", es: "Suprarrenales" },
    sympathetic: {
      from: "T8",
      to: "L1",
      relay: "none",
      effect: {
        en: "Releases adrenaline into the blood. The gland's inner part is itself a modified relay, so the fibres reach it without stopping.",
        es: "Libera adrenalina a la sangre. La parte interna de la glándula es en sí un relevo modificado, así que las fibras llegan sin detenerse."
      }
    },
    parasympathetic: null
  },
  {
    id: "kidneys",
    name: { en: "Kidneys", es: "Riñones" },
    short: { en: "Kidneys", es: "Riñones" },
    sympathetic: {
      from: "T10",
      to: "L1",
      relay: "aorticorenal",
      effect: {
        en: "Narrows the kidney's blood vessels and releases renin, which raises blood pressure.",
        es: "Estrecha los vasos del riñón y libera renina, que eleva la presión arterial."
      }
    },
    parasympathetic: null
  },
  {
    id: "small-intestine",
    name: { en: "Small intestine", es: "Intestino delgado" },
    short: { en: "Small intestine", es: "Intestino delgado" },
    sympathetic: {
      from: "T9",
      to: "T11",
      relay: "superior-mesenteric",
      effect: { en: "Slows movement and secretions.", es: "Enlentece el movimiento y las secreciones." }
    },
    parasympathetic: {
      nerves: ["X"],
      effect: { en: "Speeds movement and secretions.", es: "Acelera el movimiento y las secreciones." }
    }
  },
  {
    id: "colon-upper",
    name: { en: "Large intestine, first half", es: "Intestino grueso, primera mitad" },
    short: { en: "Colon, first half", es: "Colon, 1.ª mitad" },
    sympathetic: {
      from: "T10",
      to: "T12",
      relay: "superior-mesenteric",
      effect: { en: "Slows movement.", es: "Enlentece el movimiento." }
    },
    parasympathetic: {
      nerves: ["X"],
      effect: { en: "Speeds movement.", es: "Acelera el movimiento." }
    },
    note: {
      en: "The vagus reaches about two-thirds of the way along the large intestine. After that, the sacral nerves take over.",
      es: "El vago llega hasta unos dos tercios del intestino grueso. A partir de ahí toman el relevo los nervios sacros."
    }
  },
  {
    id: "colon-lower",
    name: { en: "Large intestine, second half, and rectum", es: "Intestino grueso, segunda mitad, y recto" },
    short: { en: "Lower colon & rectum", es: "Colon final y recto" },
    sympathetic: {
      from: "L1",
      to: "L2",
      relay: "inferior-mesenteric",
      effect: { en: "Slows movement and closes the inner anal sphincter.", es: "Enlentece el movimiento y cierra el esfínter anal interno." }
    },
    parasympathetic: {
      nerves: ["pelvic"],
      effect: { en: "Moves stool along and helps the bowel empty.", es: "Hace avanzar las heces y ayuda a vaciar el intestino." }
    }
  },
  {
    id: "bladder",
    name: { en: "Bladder", es: "Vejiga" },
    short: { en: "Bladder", es: "Vejiga" },
    sympathetic: {
      from: "L1",
      to: "L2",
      relay: "inferior-mesenteric",
      effect: { en: "Relaxes the bladder wall and closes its outlet, so it can fill.", es: "Relaja la pared de la vejiga y cierra su salida, para que pueda llenarse." }
    },
    parasympathetic: {
      nerves: ["pelvic"],
      effect: { en: "Squeezes the bladder to empty it.", es: "Contrae la vejiga para vaciarla." }
    },
    note: {
      en: "S2-S4 also carry feeling from the saddle area. Numbness there with new bladder trouble is an emergency.",
      es: "S2-S4 también llevan la sensibilidad de la zona de la silla de montar. Adormecimiento ahí con problemas nuevos de vejiga es una emergencia."
    }
  },
  {
    id: "sexual",
    name: { en: "Sexual organs", es: "Órganos sexuales" },
    short: { en: "Sexual organs", es: "Órganos sexuales" },
    sympathetic: {
      from: "L1",
      to: "L2",
      relay: "inferior-mesenteric",
      effect: { en: "Ejaculation and the contractions of orgasm.", es: "Eyaculación y las contracciones del orgasmo." }
    },
    parasympathetic: {
      nerves: ["pelvic"],
      effect: { en: "Arousal: erection and lubrication.", es: "Excitación: erección y lubricación." }
    }
  },
  {
    id: "skin",
    name: { en: "Skin: sweat glands, blood vessels and goosebumps", es: "Piel: glándulas del sudor, vasos y piel de gallina" },
    short: { en: "Skin & vessels", es: "Piel y vasos" },
    sympathetic: {
      from: "T1",
      to: "L2",
      relay: "chain",
      effect: {
        en: "Sweating, narrowing of skin blood vessels and goosebumps all over the body. From the chain, fibres rejoin every spinal nerve, from the neck to the tailbone.",
        es: "Sudor, estrechamiento de los vasos de la piel y piel de gallina en todo el cuerpo. Desde la cadena, las fibras vuelven a todos los nervios espinales, del cuello al cóccix."
      }
    },
    parasympathetic: null
  }
];

/** What leaves the cord at levels with no organ wiring, or something worth knowing besides. */
export const SEGMENT_NOTES: readonly { segments: string[]; text: L }[] = [
  {
    segments: ["C1", "C2", "C6", "C7", "C8"],
    text: {
      en: "Neck, shoulders, arms and hands. No organ wiring leaves the spinal cord in the neck.",
      es: "Cuello, hombros, brazos y manos. Ninguna conexión a órganos sale de la médula en el cuello."
    }
  },
  {
    segments: ["C3", "C4", "C5"],
    text: {
      en: "Neck and shoulders, and the diaphragm, your main breathing muscle (through the phrenic nerve). That is a muscle, not autonomic wiring: no organ wiring leaves the spinal cord in the neck.",
      es: "Cuello y hombros, y el diafragma, tu principal músculo respiratorio (por el nervio frénico). Es un músculo, no una conexión autonómica: ninguna conexión a órganos sale de la médula en el cuello."
    }
  },
  {
    segments: ["L3", "L4", "L5", "S1"],
    text: {
      en: "Hips, legs and feet. No organ wiring leaves the spinal cord here.",
      es: "Caderas, piernas y pies. Ninguna conexión a órganos sale de la médula aquí."
    }
  },
  {
    segments: ["S2", "S3", "S4"],
    text: {
      en: "Also feeling in the saddle area and control of the pelvic floor. Numbness there with new bladder or bowel trouble is an emergency.",
      es: "También la sensibilidad de la zona de la silla de montar y el control del suelo pélvico. Adormecimiento ahí con problemas nuevos de vejiga o intestino es una emergencia."
    }
  },
  {
    segments: ["S5"],
    text: {
      en: "Skin around the anus. No organ wiring.",
      es: "Piel alrededor del ano. Sin conexiones a órganos."
    }
  }
];

export type PosterVerdict = "partly" | "false" | "unsupported";

export const POSTER_VERDICT: Record<PosterVerdict, L> = {
  partly: { en: "Partly true", es: "Parcialmente cierto" },
  false: { en: "Not how it works", es: "No funciona así" },
  unsupported: { en: "No evidence", es: "Sin evidencia" }
};

/** What the wall poster implies, checked against anatomy and trials. */
export const POSTER_CHECKS: readonly { claim: L; verdict: PosterVerdict; why: L; sources: SourceId[] }[] = [
  {
    claim: { en: "The spinal cord is wired to the organs.", es: "La médula espinal está conectada a los órganos." },
    verdict: "partly",
    why: {
      en: "True for the 'fight or flight' half, which leaves the cord from T1 to L2 only. Nothing for the organs leaves the neck (C1-C8) or L3-S1.",
      es: "Es cierto para la mitad de 'lucha o huida', que sale de la médula solo de D1 a L2. Nada para los órganos sale del cuello (C1-C8) ni de L3-S1."
    },
    sources: ["standring2020"]
  },
  {
    claim: { en: "Each vertebra controls one organ.", es: "Cada vértebra controla un órgano." },
    verdict: "false",
    why: {
      en: "Each organ gets fibres from several levels, and they stop at relay stations (ganglia) outside the spine before reaching it. Most levels serve several organs.",
      es: "Cada órgano recibe fibras de varios niveles, y estas se detienen en estaciones de relevo (ganglios) fuera de la columna antes de llegar. La mayoría de los niveles sirven a varios órganos."
    },
    sources: ["standring2020"]
  },
  {
    claim: { en: "The spine is the organs' control line.", es: "La columna es la línea de control de los órganos." },
    verdict: "false",
    why: {
      en: "The 'rest and digest' half for the head, chest and most of the gut runs in cranial nerves, mainly the vagus, straight from the brainstem. It never passes through the spine. Only the bladder, the end of the bowel and the sexual organs get theirs from the sacrum (S2-S4).",
      es: "La mitad de 'reposo y digestión' de la cabeza, el tórax y la mayor parte del intestino va por nervios craneales, sobre todo el vago, directamente desde el tronco encefálico. Nunca pasa por la columna. Solo la vejiga, el final del intestino y los órganos sexuales la reciben del sacro (S2-S4)."
    },
    sources: ["standring2020"]
  },
  {
    claim: { en: "Adjusting a vertebra improves the organ it is wired to.", es: "Ajustar una vértebra mejora el órgano al que está conectada." },
    verdict: "unsupported",
    why: {
      en: "A global review led by chiropractic researchers found no evidence that spinal manipulation prevents or treats organ or other non-musculoskeletal conditions.",
      es: "Una revisión mundial dirigida por investigadores quiroprácticos no encontró evidencia de que la manipulación vertebral prevenga o trate problemas de órganos u otros no musculoesqueléticos."
    },
    sources: ["cote2021"]
  }
];

/** Sources for the wiring itself, shown under the figure. */
export const WIRING_SOURCES: readonly SourceId[] = ["standring2020"];

export function segmentIndex(id: string): number {
  return SEGMENTS.indexOf(id);
}

/** Every segment from `from` to `to`, inclusive, top to bottom. */
export function segmentsBetween(from: string, to: string): string[] {
  const a = segmentIndex(from);
  const b = segmentIndex(to);
  if (a < 0 || b < 0 || b < a) throw new Error(`Bad segment range ${from}-${to}`);
  return SEGMENTS.slice(a, b + 1);
}

export function organById(id: string): Organ | undefined {
  return ORGANS.find((o) => o.id === id);
}

export function hasSacralSupply(organ: Organ): boolean {
  return organ.parasympathetic?.nerves.includes("pelvic") ?? false;
}

export function hasCranialSupply(organ: Organ): boolean {
  return organ.parasympathetic?.nerves.some((n) => n !== "pelvic") ?? false;
}

export interface SegmentLink {
  organ: Organ;
  system: "sympathetic" | "parasympathetic";
}

/** Organ wiring that leaves the cord at one segment. */
export function organsAt(segment: string): SegmentLink[] {
  const sacral = segmentsBetween(SACRAL_OUTFLOW.from, SACRAL_OUTFLOW.to).includes(segment);
  return ORGANS.flatMap((organ): SegmentLink[] => {
    const links: SegmentLink[] = [];
    if (segmentsBetween(organ.sympathetic.from, organ.sympathetic.to).includes(segment)) links.push({ organ, system: "sympathetic" });
    if (sacral && hasSacralSupply(organ)) links.push({ organ, system: "parasympathetic" });
    return links;
  });
}

export function segmentNote(segment: string): L | undefined {
  return SEGMENT_NOTES.find((n) => n.segments.includes(segment))?.text;
}
