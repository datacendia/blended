import type { L } from "../i18n";
import type { SourceId } from "../sources";

/**
 * Neck root or a nerve further down the arm? The three neck roots that most
 * often cause hand symptoms, beside the two nerve entrapments most often
 * mistaken for them. Shading uses the body map's own regions, so the
 * patterns line up with what a person taps there.
 *
 * The anatomical tell-tales are the useful part. Carpal tunnel spares the
 * forearm and usually the skin at the base of the thumb (that branch leaves
 * the nerve before the tunnel). An ulnar nerve squeezed at the elbow spares
 * the inner forearm (supplied by a separate branch from higher up), which a
 * C8 root does not.
 */
export type MimicId = "c5" | "c6" | "c7" | "c8" | "carpal" | "ulnar";
export type ClueRow = "neck" | "neck-moves" | "forearm" | "night" | "elbow-bent" | "weakness" | "reflex" | "confirm";
/** A cell of the clue table: usually, sometimes, no, or a short answer in words. */
export type Cell = "yes" | "some" | "no" | L;

export interface Mimic {
  id: MimicId;
  name: L;
  where: L;
  kind: "root" | "peripheral";
  weights: Record<string, number>;
  clues: L[];
  confirm: L;
  sources: SourceId[];
  table: Record<ClueRow, Cell>;
}

const ROOT_CLUE: L = {
  en: "Neck pain, often spreading to the shoulder blade. Looking up or turning toward that side tends to bring it on.",
  es: "Dolor de cuello, que a menudo se extiende a la escápula. Mirar hacia arriba o girar hacia ese lado suele provocarlo."
};

const ROOT_CONFIRM: L = {
  en: "A neurological exam of the arm, with the neck tests; an MRI or nerve tests if the picture is unclear or isn't settling.",
  es: "Una exploración neurológica del brazo, con las pruebas del cuello; resonancia o pruebas nerviosas si el cuadro no está claro o no mejora."
};

const ROOT_CONFIRM_SHORT: L = { en: "Examination; MRI if unclear", es: "Exploración; resonancia si no está claro" };
const NERVE_TEST_SHORT: L = { en: "Nerve conduction tests", es: "Pruebas de conducción nerviosa" };

export const MIMICS: readonly Mimic[] = [
  {
    id: "c5",
    name: { en: "C5 root (neck)", es: "Raíz C5 (cuello)" },
    where: { en: "Squeezed where it leaves the spine, between C4 and C5", es: "Comprimida donde sale de la columna, entre C4 y C5" },
    kind: "root",
    weights: { "outer-upper-arm": 1, "shoulder-top": 0.5, "shoulder-blade": 0.5 },
    clues: [
      ROOT_CLUE,
      { en: "The outer upper arm and shoulder, not the hand.", es: "La cara externa del brazo y el hombro, no la mano." },
      { en: "May weaken lifting the arm out to the side and reduce the biceps reflex.", es: "Puede debilitar la elevación lateral del brazo y disminuir el reflejo bicipital." }
    ],
    confirm: ROOT_CONFIRM,
    sources: ["wainner2003", "standring2020"],
    table: {
      neck: "yes",
      "neck-moves": "yes",
      forearm: "no",
      night: "no",
      "elbow-bent": "no",
      weakness: { en: "Lifting the arm out to the side", es: "Elevar el brazo hacia un lado" },
      reflex: { en: "Biceps", es: "Bicipital" },
      confirm: ROOT_CONFIRM_SHORT
    }
  },
  {
    id: "c6",
    name: { en: "C6 root (neck)", es: "Raíz C6 (cuello)" },
    where: { en: "Squeezed where it leaves the spine, between C5 and C6", es: "Comprimida donde sale de la columna, entre C5 y C6" },
    kind: "root",
    weights: { thumb: 1, index: 1, "palm-thumb-side": 1, "outer-forearm": 1, "shoulder-blade": 0.5 },
    clues: [
      ROOT_CLUE,
      { en: "The thumb-side forearm is affected too.", es: "También se afecta el antebrazo del lado del pulgar." },
      { en: "May weaken bending the elbow and reduce the biceps reflex.", es: "Puede debilitar la flexión del codo y disminuir el reflejo bicipital." }
    ],
    confirm: ROOT_CONFIRM,
    sources: ["wainner2003", "standring2020"],
    table: {
      neck: "yes",
      "neck-moves": "yes",
      forearm: "yes",
      night: "no",
      "elbow-bent": "no",
      weakness: { en: "Bending the elbow; lifting the wrist", es: "Flexionar el codo; levantar la muñeca" },
      reflex: { en: "Biceps, brachioradialis", es: "Bicipital, estilorradial" },
      confirm: ROOT_CONFIRM_SHORT
    }
  },
  {
    id: "c7",
    name: { en: "C7 root (neck)", es: "Raíz C7 (cuello)" },
    where: { en: "Squeezed between C6 and C7, the most common level", es: "Comprimida entre C6 y C7, el nivel más frecuente" },
    kind: "root",
    weights: { middle: 1, index: 0.5, "palm-centre": 1, "back-forearm": 1, "shoulder-blade": 0.5 },
    clues: [
      ROOT_CLUE,
      { en: "The back of the forearm is affected too.", es: "También se afecta la parte posterior del antebrazo." },
      { en: "May weaken straightening the elbow and reduce the triceps reflex.", es: "Puede debilitar la extensión del codo y disminuir el reflejo tricipital." }
    ],
    confirm: ROOT_CONFIRM,
    sources: ["radhakrishnan1994", "wainner2003"],
    table: {
      neck: "yes",
      "neck-moves": "yes",
      forearm: "yes",
      night: "no",
      "elbow-bent": "no",
      weakness: { en: "Straightening the elbow", es: "Extender el codo" },
      reflex: { en: "Triceps", es: "Tricipital" },
      confirm: ROOT_CONFIRM_SHORT
    }
  },
  {
    id: "c8",
    name: { en: "C8 root (neck)", es: "Raíz C8 (cuello)" },
    where: { en: "Squeezed between C7 and T1", es: "Comprimida entre C7 y D1" },
    kind: "root",
    weights: { little: 1, ring: 1, "palm-little-side": 1, "inner-forearm": 1, "shoulder-blade": 0.5 },
    clues: [
      ROOT_CLUE,
      { en: "The inner (little-finger side) forearm is affected too: an ulnar nerve problem at the elbow spares it.", es: "También se afecta el antebrazo del lado del meñique: un problema del nervio cubital en el codo lo respeta." },
      { en: "May weaken finger grip.", es: "Puede debilitar el agarre de los dedos." }
    ],
    confirm: ROOT_CONFIRM,
    sources: ["standring2020", "wainner2003"],
    table: {
      neck: "yes",
      "neck-moves": "yes",
      forearm: "yes",
      night: "no",
      "elbow-bent": "no",
      weakness: { en: "Finger grip", es: "El agarre de los dedos" },
      reflex: "no",
      confirm: ROOT_CONFIRM_SHORT
    }
  },
  {
    id: "carpal",
    name: { en: "Carpal tunnel (median nerve at the wrist)", es: "Túnel carpiano (nervio mediano en la muñeca)" },
    where: { en: "Squeezed in the tunnel at the front of the wrist", es: "Comprimido en el túnel de la parte delantera de la muñeca" },
    kind: "peripheral",
    weights: { thumb: 1, index: 1, middle: 1, ring: 0.5 },
    clues: [
      { en: "Thumb, index, middle and half of the ring finger. The forearm and neck feel normal.", es: "Pulgar, índice, medio y la mitad del anular. El antebrazo y el cuello se sienten normales." },
      { en: "The skin at the base of the thumb is usually spared: its branch leaves the nerve before the tunnel.", es: "La piel de la base del pulgar suele estar respetada: su rama sale del nervio antes del túnel." },
      { en: "Often worse at night, eased by shaking the hand.", es: "A menudo peor por la noche, y mejora al sacudir la mano." }
    ],
    confirm: { en: "Nerve conduction tests show slowing across the wrist.", es: "Las pruebas de conducción nerviosa muestran enlentecimiento a través de la muñeca." },
    sources: ["padua2016", "standring2020"],
    table: {
      neck: "no",
      "neck-moves": "no",
      forearm: "no",
      night: "yes",
      "elbow-bent": "no",
      weakness: { en: "Thumb pinch, if long-standing", es: "La pinza del pulgar, si es de larga evolución" },
      reflex: "no",
      confirm: NERVE_TEST_SHORT
    }
  },
  {
    id: "ulnar",
    name: { en: "Ulnar nerve at the elbow", es: "Nervio cubital en el codo" },
    where: { en: "Squeezed behind the inner elbow (the 'funny bone')", es: "Comprimido detrás de la cara interna del codo (el 'hueso de la risa')" },
    kind: "peripheral",
    weights: { little: 1, ring: 0.5, "palm-little-side": 1 },
    clues: [
      { en: "Little finger and half of the ring finger. The inner forearm feels normal, unlike a C8 root.", es: "Meñique y la mitad del anular. El antebrazo del lado del meñique se siente normal, a diferencia de una raíz C8." },
      { en: "Keeping the elbow bent or leaning on it tends to bring it on; neck movement doesn't.", es: "Mantener el codo doblado o apoyarse en él suele provocarlo; mover el cuello, no." }
    ],
    confirm: { en: "Nerve conduction tests show slowing across the elbow.", es: "Las pruebas de conducción nerviosa muestran enlentecimiento a través del codo." },
    sources: ["standring2020"],
    table: {
      neck: "no",
      "neck-moves": "no",
      forearm: "no",
      night: "no",
      "elbow-bent": "yes",
      weakness: { en: "Spreading the fingers; grip", es: "Separar los dedos; el agarre" },
      reflex: "no",
      confirm: NERVE_TEST_SHORT
    }
  }
];

export const CLUE_ROWS: readonly { id: ClueRow; name: L }[] = [
  { id: "neck", name: { en: "Neck pain, often to the shoulder blade", es: "Dolor de cuello, a menudo hacia la escápula" } },
  { id: "neck-moves", name: { en: "Looking up or turning toward that side brings it on", es: "Mirar hacia arriba o girar hacia ese lado lo provoca" } },
  { id: "forearm", name: { en: "Forearm feeling affected", es: "Afecta la sensibilidad del antebrazo" } },
  { id: "night", name: { en: "Worse at night, eased by shaking the hand", es: "Peor por la noche, mejora al sacudir la mano" } },
  { id: "elbow-bent", name: { en: "Keeping the elbow bent brings it on", es: "Mantener el codo doblado lo provoca" } },
  { id: "weakness", name: { en: "Weakness, if any, in", es: "Debilidad, si la hay, en" } },
  { id: "reflex", name: { en: "Reflex that may be reduced", es: "Reflejo que puede disminuir" } },
  { id: "confirm", name: { en: "Confirmed by", es: "Se confirma con" } }
];

/** Body-map regions shaded for one pattern and not the other: the places that tell them apart. */
export function differences(a: Mimic, b: Mimic): { onlyA: string[]; onlyB: string[]; both: string[] } {
  const ra = Object.keys(a.weights);
  const rb = Object.keys(b.weights);
  return { onlyA: ra.filter((r) => !rb.includes(r)), onlyB: rb.filter((r) => !ra.includes(r)), both: ra.filter((r) => rb.includes(r)) };
}

export const MIMIC_COPY = {
  roots: { en: "Neck roots", es: "Raíces del cuello" },
  peripheral: { en: "Further down the arm", es: "Más abajo en el brazo" },
  clues: { en: "Clues", es: "Pistas" },
  confirm: { en: "How it's confirmed", es: "Cómo se confirma" },
  usual: { en: "Usually felt here", es: "Se suele notar aquí" },
  partial: { en: "Partly, or not always", es: "En parte, o no siempre" },
  referred: { en: "Pain felt here, without numbness", es: "Dolor que se siente aquí, sin adormecimiento" },
  openMap: { en: "Tap your own symptoms on the body map", es: "Marca tus propios síntomas en el mapa corporal" },
  mode: { en: "Show", es: "Mostrar" },
  modes: {
    one: { en: "One pattern", es: "Un patrón" },
    compare: { en: "Compare two", es: "Comparar dos" }
  },
  first: { en: "First", es: "Primero" },
  second: { en: "Second", es: "Segundo" },
  only: { en: "Only {name}", es: "Solo {name}" },
  both: { en: "Both", es: "Ambos" },
  tells: { en: "Where they differ", es: "Dónde se diferencian" },
  same: { en: "They share every shaded area: the other clues have to tell them apart.", es: "Comparten todas las zonas sombreadas: las demás pistas deben diferenciarlos." },
  table: { en: "The clues side by side", es: "Las pistas lado a lado" },
  yes: { en: "Usually", es: "Suele" },
  some: { en: "Sometimes", es: "A veces" },
  no: { en: "No", es: "No" },
  notDiagnosis: {
    en: "These are the patterns clinicians look for, not a way to diagnose yourself. A mix of clues, or anything getting worse, needs an examination.",
    es: "Son los patrones que buscan los clínicos, no una forma de diagnosticarte. Una mezcla de pistas, o algo que empeora, necesita una exploración."
  }
} as const;
