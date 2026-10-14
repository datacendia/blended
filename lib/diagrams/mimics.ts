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
export type MimicId = "c6" | "c7" | "c8" | "carpal" | "ulnar";

export interface Mimic {
  id: MimicId;
  name: L;
  where: L;
  kind: "root" | "peripheral";
  weights: Record<string, number>;
  clues: L[];
  confirm: L;
  sources: SourceId[];
}

const ROOT_CLUE: L = {
  en: "Neck pain, often spreading to the shoulder blade. Looking up or turning toward that side tends to bring it on.",
  es: "Dolor de cuello, que a menudo se extiende a la escápula. Mirar hacia arriba o girar hacia ese lado suele provocarlo."
};

const ROOT_CONFIRM: L = {
  en: "A neurological exam of the arm, with the neck tests; an MRI or nerve tests if the picture is unclear or isn't settling.",
  es: "Una exploración neurológica del brazo, con las pruebas del cuello; resonancia o pruebas nerviosas si el cuadro no está claro o no mejora."
};

export const MIMICS: readonly Mimic[] = [
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
    sources: ["wainner2003", "standring2020"]
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
    sources: ["radhakrishnan1994", "wainner2003"]
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
    sources: ["standring2020", "wainner2003"]
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
    sources: ["padua2016", "standring2020"]
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
    sources: ["standring2020"]
  }
];

export const MIMIC_COPY = {
  roots: { en: "Neck roots", es: "Raíces del cuello" },
  peripheral: { en: "Further down the arm", es: "Más abajo en el brazo" },
  clues: { en: "Clues", es: "Pistas" },
  confirm: { en: "How it's confirmed", es: "Cómo se confirma" },
  usual: { en: "Usually felt here", es: "Se suele notar aquí" },
  partial: { en: "Partly, or not always", es: "En parte, o no siempre" },
  referred: { en: "Pain felt here, without numbness", es: "Dolor que se siente aquí, sin adormecimiento" },
  openMap: { en: "Tap your own symptoms on the body map", es: "Marca tus propios síntomas en el mapa corporal" }
} as const;
