import type { L } from "./i18n";
import type { SourceId } from "./sources";

/**
 * What a thorough examination for a suspected trapped nerve includes.
 *
 * Shown to patients as a checklist, not a self-test: several of these tests
 * deliberately provoke symptoms and belong in a clinician's hands. The value
 * to a patient is knowing whether they were actually examined, or just
 * photographed and adjusted.
 */
export interface ExamItem {
  id: string;
  text: L;
}

export interface Exam {
  id: "cervical" | "lumbar";
  title: L;
  items: readonly ExamItem[];
  note: L;
  sources: SourceId[];
}

export const EXAMS: Record<Exam["id"], Exam> = {
  cervical: {
    id: "cervical",
    title: { en: "A thorough neck-and-arm nerve exam includes", es: "Una exploración completa de nervios de cuello y brazo incluye" },
    items: [
      { id: "strength", text: { en: "Strength tested muscle by muscle: shoulder, elbow, wrist, grip, finger spreading", es: "Fuerza evaluada músculo a músculo: hombro, codo, muñeca, agarre, separación de dedos" } },
      { id: "reflexes", text: { en: "Reflexes: biceps, brachioradialis, triceps", es: "Reflejos: bicipital, braquiorradial, tricipital" } },
      { id: "sensation", text: { en: "Sensation checked finger by finger and along the forearm", es: "Sensibilidad evaluada dedo a dedo y a lo largo del antebrazo" } },
      { id: "spurling", text: { en: "Spurling's test (neck tilted and gently loaded)", es: "Prueba de Spurling (cuello inclinado con carga suave)" } },
      { id: "distraction", text: { en: "Distraction test (head gently lifted to see if arm symptoms ease)", es: "Prueba de distracción (se eleva suavemente la cabeza para ver si alivian los síntomas del brazo)" } },
      { id: "ultt", text: { en: "Upper-limb nerve tension test", es: "Prueba de tensión neural del miembro superior" } },
      { id: "rotation", text: { en: "Neck rotation measured on both sides", es: "Rotación del cuello medida a ambos lados" } },
      { id: "cord", text: { en: "Spinal cord screen: Hoffmann's sign, walking and balance, hand dexterity", es: "Cribado de médula: signo de Hoffmann, marcha y equilibrio, destreza manual" } },
      { id: "screening", text: { en: "Questions about dizziness, headaches and other warning signs before any neck manipulation", es: "Preguntas sobre mareos, dolores de cabeza y otras señales de alarma antes de cualquier manipulación cervical" } }
    ],
    note: {
      en: "Four of these form a validated cluster: Spurling's, distraction, the upper-limb tension test and neck rotation under 60° toward the painful side. With three positive, a trapped nerve becomes substantially more likely; with all four, very likely.",
      es: "Cuatro de ellas forman un grupo validado: Spurling, distracción, tensión neural del miembro superior y rotación cervical menor de 60° hacia el lado doloroso. Con tres positivas, un nervio atrapado se vuelve bastante más probable; con las cuatro, muy probable."
    },
    sources: ["wainner2003"]
  },
  lumbar: {
    id: "lumbar",
    title: { en: "A thorough back-and-leg nerve exam includes", es: "Una exploración completa de nervios de espalda y pierna incluye" },
    items: [
      { id: "slr", text: { en: "Straight-leg raise and/or slump test", es: "Elevación de pierna recta y/o prueba de slump" } },
      { id: "walk", text: { en: "Heel walking and toe walking", es: "Caminar sobre talones y sobre puntillas" } },
      { id: "strength", text: { en: "Strength of hip, knee, ankle and big toe", es: "Fuerza de cadera, rodilla, tobillo y dedo gordo" } },
      { id: "reflexes", text: { en: "Reflexes: knee and ankle", es: "Reflejos: rotuliano y aquíleo" } },
      { id: "sensation", text: { en: "Sensation across the leg and foot", es: "Sensibilidad en la pierna y el pie" } },
      { id: "saddle", text: { en: "Questions about saddle numbness and bladder or bowel changes", es: "Preguntas sobre adormecimiento en sillín y cambios en vejiga o intestino" } },
      { id: "hip", text: { en: "A hip examination (hip problems often mimic back pain)", es: "Una exploración de cadera (los problemas de cadera a menudo imitan el dolor lumbar)" } }
    ],
    note: {
      en: "If none of this happened before treatment started, ask why.",
      es: "Si nada de esto ocurrió antes de empezar el tratamiento, pregunta por qué."
    },
    sources: []
  }
};

/**
 * A safe self-observation to mention to a clinician — not a test to perform.
 * Resting the hand on the head often eases arm pain from a neck root.
 */
export const SHOULDER_ABDUCTION_RELIEF: L = {
  en: "Something worth noticing and telling your clinician: does resting your hand on top of your head ease the arm symptoms? Relief in that position (the 'shoulder abduction relief sign') is associated with a neck nerve root.",
  es: "Algo que vale la pena observar y contar a tu terapeuta: ¿se alivian los síntomas del brazo al apoyar la mano sobre la cabeza? El alivio en esa postura (el 'signo de alivio por abducción del hombro') se asocia con una raíz nerviosa del cuello."
};
