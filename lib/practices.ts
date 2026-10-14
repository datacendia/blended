import type { Verdict } from "./evidence";
import type { L } from "./i18n";
import type { SourceId } from "./sources";

/**
 * Two comparisons for the "Who to see" page.
 *
 * The first sets the three hands-on professions side by side in the same
 * four columns, so the differences are visible rather than described. Each
 * profession's own philosophy is stated as that profession's view; what the
 * research shows sits in its own column with sources, so a belief is never
 * presented as a finding.
 *
 * The second covers movement and traditional practices. Their traditional
 * explanations (qi, meridians, energy channels) are labelled as tradition,
 * and kept separate from what trials have measured — which is often useful,
 * just not for the reason the tradition gives.
 */
export interface HandsOnTherapy {
  id: string;
  /** Matches an entry in CLINICIANS, so the page can link the two. */
  clinicianId: string;
  name: L;
  philosophy: L;
  methods: L;
  bestFor: L;
  evidence: L;
  sources: SourceId[];
}

export const HANDS_ON: readonly HandsOnTherapy[] = [
  {
    id: "physio",
    clinicianId: "physio",
    name: { en: "Physiotherapist", es: "Fisioterapeuta" },
    philosophy: {
      en: "Restores movement, strength and function after injury, surgery or pain. Built on exercise science and clinical trials.",
      es: "Recupera el movimiento, la fuerza y la función tras una lesión, una cirugía o el dolor. Se basa en la ciencia del ejercicio y en ensayos clínicos."
    },
    methods: {
      en: "Active rehabilitation, targeted strengthening, gait and balance training, joint mobilisation, nerve gliding and a home exercise programme.",
      es: "Rehabilitación activa, fortalecimiento dirigido, entrenamiento de la marcha y el equilibrio, movilización articular, deslizamiento neural y un programa de ejercicios en casa."
    },
    bestFor: {
      en: "Recovery after surgery, sports injuries and sprains, long-term rehabilitation, and most neck and back pain, including a trapped nerve.",
      es: "Recuperación tras una cirugía, lesiones deportivas y esguinces, rehabilitación a largo plazo, y la mayoría de los dolores de cuello y espalda, incluido un nervio atrapado."
    },
    evidence: {
      en: "Exercise-based care has the most consistent evidence for neck pain, and is part of every guideline plan.",
      es: "El tratamiento basado en ejercicio tiene la evidencia más consistente para el dolor de cuello y forma parte de todos los planes de las guías."
    },
    sources: ["gross2015ex", "blanpied2017"]
  },
  {
    id: "chiropractor",
    clinicianId: "chiropractor",
    name: { en: "Chiropractor", es: "Quiropráctico" },
    philosophy: {
      en: "Focuses on the spine, the nervous system and how the joints of the neck and back move.",
      es: "Se centra en la columna, el sistema nervioso y cómo se mueven las articulaciones del cuello y la espalda."
    },
    methods: {
      en: "Spinal manipulation (high-velocity, low-amplitude 'adjustments', often with a pop), mobilisation, soft-tissue work and, in many clinics, exercise and advice.",
      es: "Manipulación vertebral ('ajustes' de alta velocidad y baja amplitud, a menudo con un chasquido), movilización, trabajo de tejidos blandos y, en muchas consultas, ejercicio y consejos."
    },
    bestFor: {
      en: "Neck or back pain and stiffness without warning signs, as part of a plan that includes exercise and has a clear review point.",
      es: "Dolor y rigidez de cuello o espalda sin señales de alarma, dentro de un plan que incluya ejercicio y tenga un punto de revisión claro."
    },
    evidence: {
      en: "Manipulation gives small, mostly short-term relief for neck pain, similar to mobilisation and exercise. For a trapped nerve, guidelines find the evidence insufficient either way. Claims that adjustments improve organs or general health are not supported.",
      es: "La manipulación da un alivio pequeño y sobre todo a corto plazo para el dolor de cuello, similar a la movilización y el ejercicio. Para un nervio atrapado, las guías encuentran la evidencia insuficiente en ambos sentidos. Las afirmaciones de que los ajustes mejoran los órganos o la salud general no tienen respaldo."
    },
    sources: ["gross2015manip", "bono2011", "cote2021"]
  },
  {
    id: "osteopath",
    clinicianId: "osteopath",
    name: { en: "Osteopath", es: "Osteópata" },
    philosophy: {
      en: "Treats the body as an interconnected whole: pain in one place may be linked to strain or restricted movement somewhere else.",
      es: "Trata el cuerpo como un todo interconectado: el dolor en un sitio puede estar ligado a tensión o movimiento restringido en otro."
    },
    methods: {
      en: "Gentle hands-on techniques (soft-tissue and myofascial release, rhythmic joint mobilisation and manipulation) plus exercise and lifestyle advice. Some also use cranial or visceral techniques.",
      es: "Técnicas manuales suaves (liberación de tejidos blandos y miofascial, movilización articular rítmica y manipulación) más ejercicio y consejos de estilo de vida. Algunos también usan técnicas craneales o viscerales."
    },
    bestFor: {
      en: "Back and neck pain without warning signs, recurring aches, and pain linked to posture, work or stress.",
      es: "Dolor de espalda y cuello sin señales de alarma, molestias recurrentes y dolor ligado a la postura, el trabajo o el estrés."
    },
    evidence: {
      en: "For neck and back pain, manual therapy gives similar small effects whoever delivers it. Cranial and visceral techniques lack good evidence.",
      es: "Para el dolor de cuello y espalda, la terapia manual da efectos pequeños similares sea quien sea quien la aplique. Las técnicas craneales y viscerales carecen de buena evidencia."
    },
    sources: ["gross2015manip", "cote2021"]
  }
];

export interface Practice {
  id: string;
  name: L;
  origin: L;
  /** What it involves in a session. */
  practice: L;
  /** The tradition's own explanation, labelled as such on the page. */
  tradition: L;
  research: L;
  /** Verdict per use, in the same scale as the evidence board. */
  findings: { use: L; verdict: Verdict }[];
  goodFor: L;
  safety: L;
  sources: SourceId[];
}

export const PRACTICES: readonly Practice[] = [
  {
    id: "tai-chi",
    name: { en: "Tai chi", es: "Taichí" },
    origin: { en: "China · a martial art practised as slow 'moving meditation'", es: "China · un arte marcial practicado como 'meditación en movimiento' lenta" },
    practice: {
      en: "Slow, continuous sequences of weight-shifting movements, with relaxed breathing and attention on balance.",
      es: "Secuencias lentas y continuas de movimientos que trasladan el peso, con respiración relajada y atención en el equilibrio."
    },
    tradition: {
      en: "Cultivates the flow of qi (vital energy) and the balance of yin and yang.",
      es: "Cultiva el flujo del qi (energía vital) y el equilibrio entre el yin y el yang."
    },
    research: {
      en: "Strong evidence that it reduces falls in older adults living at home. In a trial of people with persistent low back pain, ten weeks of tai chi reduced pain and disability.",
      es: "Evidencia sólida de que reduce las caídas en personas mayores que viven en casa. En un ensayo con personas con dolor lumbar persistente, diez semanas de taichí redujeron el dolor y la discapacidad."
    },
    findings: [
      { use: { en: "Preventing falls", es: "Prevenir caídas" }, verdict: "supported" },
      { use: { en: "Long-term low back pain", es: "Dolor lumbar persistente" }, verdict: "may-help" }
    ],
    goodFor: {
      en: "Balance, fall prevention, long-term back pain, and staying active at any age.",
      es: "Equilibrio, prevención de caídas, dolor lumbar persistente y mantenerse activo a cualquier edad."
    },
    safety: {
      en: "Very low risk. Classes can be adapted for people who need to sit.",
      es: "Riesgo muy bajo. Las clases pueden adaptarse para quien necesite estar sentado."
    },
    sources: ["sherrington2019", "hall2011"]
  },
  {
    id: "yoga",
    name: { en: "Yoga", es: "Yoga" },
    origin: { en: "India · postures, breathing and meditation", es: "India · posturas, respiración y meditación" },
    practice: {
      en: "Held and flowing postures (asanas), stretching and breath control, to build strength, flexibility and relaxation.",
      es: "Posturas estáticas y en movimiento (asanas), estiramientos y control de la respiración, para ganar fuerza, flexibilidad y relajación."
    },
    tradition: {
      en: "Unites body, breath and mind; traditional texts describe energy channels (nadis) and centres (chakras).",
      es: "Une cuerpo, respiración y mente; los textos tradicionales describen canales de energía (nadis) y centros (chakras)."
    },
    research: {
      en: "For chronic low back pain, yoga gives small-to-moderate improvements in function, much like other exercise, at low-to-moderate certainty.",
      es: "Para el dolor lumbar crónico, el yoga da mejoras pequeñas a moderadas en la función, parecidas a las de otros ejercicios, con certeza baja a moderada."
    },
    findings: [{ use: { en: "Chronic low back pain", es: "Dolor lumbar crónico" }, verdict: "may-help" }],
    goodFor: {
      en: "Flexibility, strength and relaxation; long-term back pain for people who enjoy it.",
      es: "Flexibilidad, fuerza y relajación; dolor lumbar persistente en quienes lo disfrutan."
    },
    safety: {
      en: "Tell the teacher about your neck. Skip poses that load the neck (headstands, shoulder stands) or bring on arm symptoms.",
      es: "Cuéntale al profesor lo de tu cuello. Evita las posturas que cargan el cuello (sobre la cabeza, sobre los hombros) o que provocan síntomas en el brazo."
    },
    sources: ["wieland2017"]
  },
  {
    id: "acupuncture",
    name: { en: "Acupuncture", es: "Acupuntura" },
    origin: { en: "China · part of Traditional Chinese Medicine", es: "China · parte de la Medicina Tradicional China" },
    practice: {
      en: "Thin, sterile needles inserted at specific points, sometimes with heat or a mild electrical current, often alongside bodywork.",
      es: "Agujas finas y estériles en puntos concretos, a veces con calor o una corriente eléctrica suave, a menudo junto con trabajo corporal."
    },
    tradition: {
      en: "Needles at points along meridians rebalance the flow of qi and regulate pain.",
      es: "Las agujas en puntos de los meridianos reequilibran el flujo del qi y regulan el dolor."
    },
    research: {
      en: "For chronic pain, including neck and back pain, acupuncture beats both sham needling and no acupuncture in trials, but its lead over sham is small. Trials support a modest effect on pain; they do not test the traditional explanation.",
      es: "Para el dolor crónico, incluido el de cuello y espalda, la acupuntura supera tanto a la acupuntura simulada como a no recibirla, pero su ventaja sobre la simulada es pequeña. Los ensayos respaldan un efecto modesto sobre el dolor; no ponen a prueba la explicación tradicional."
    },
    findings: [{ use: { en: "Chronic neck and back pain", es: "Dolor crónico de cuello y espalda" }, verdict: "may-help" }],
    goodFor: {
      en: "Short-term relief of chronic pain, alongside an active plan.",
      es: "Alivio a corto plazo del dolor crónico, junto a un plan activo."
    },
    safety: {
      en: "Use a licensed practitioner with sterile, single-use needles.",
      es: "Acude a un profesional habilitado que use agujas estériles de un solo uso."
    },
    sources: ["vickers2018"]
  }
];
