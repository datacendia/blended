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
 * The second covers movement, traditional and alternative practices. Each
 * one's own explanation (qi, meridians, trigger points, 'like cures like') is
 * labelled as the practice's own, and kept separate from what trials have
 * measured — which is sometimes useful, just not for the reason given.
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

export type PracticeGroup = "active" | "passive";

export interface Practice {
  id: string;
  /** Active: you learn it and keep doing it. Passive: it is done to you, or taken. */
  group: PracticeGroup;
  name: L;
  origin: L;
  /** What it involves in a session. */
  practice: L;
  /** The practice's own explanation, labelled as such on the page. */
  tradition: L;
  research: L;
  /** Verdict per use, in the same scale as the evidence board. */
  findings: { use: L; verdict: Verdict }[];
  goodFor: L;
  safety: L;
  whoDelivers: L;
  /** What a good first session or class includes: a checklist on the guide page. */
  firstSession: L[];
  goodSigns: L[];
  warningSigns: L[];
  questions: L[];
  /** What it means for someone with a trapped nerve in the neck. */
  neck: L;
  training: L;
  check: L;
  sources: SourceId[];
}

/**
 * Practices people are offered alongside, or instead of, the hands-on
 * professions. The list covers what someone in Lima is likely to meet,
 * including the huesero, and runs from well supported to not supported at
 * all. Including a practice is not an endorsement; leaving out one with no
 * evidence would just leave people to hear only the sales pitch.
 */
export const PRACTICES: readonly Practice[] = [
  {
    id: "tai-chi",
    group: "active",
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
    whoDelivers: {
      en: "Tai chi instructors, in parks, community centres and gyms",
      es: "Instructores de taichí, en parques, centros comunales y gimnasios"
    },
    firstSession: [
      { en: "Asks about your health, your neck and any balance problems.", es: "Pregunta por tu salud, tu cuello y cualquier problema de equilibrio." },
      { en: "Starts with a few simple movements, not a whole sequence.", es: "Empieza con unos pocos movimientos sencillos, no con una secuencia entera." },
      { en: "Lets you go at your own pace and range, and sit if you need to.", es: "Te deja ir a tu ritmo y con tu rango de movimiento, y sentarte si lo necesitas." }
    ],
    goodSigns: [
      { en: "Shows you how to make each movement easier.", es: "Te enseña a hacer cada movimiento más fácil." },
      { en: "Encourages regular practice: the trials that showed benefit ran for weeks to months.", es: "Anima a practicar con regularidad: los ensayos que mostraron beneficio duraron semanas o meses." }
    ],
    warningSigns: [
      { en: "Claims that tai chi cures a trapped nerve or replaces medical care.", es: "Afirmaciones de que el taichí cura un nervio atrapado o sustituye la atención médica." },
      { en: "Pressure to push through sharp or spreading arm pain.", es: "Presión para seguir pese a un dolor de brazo agudo o que se extiende." }
    ],
    questions: [
      { en: "How do you adapt classes for people with neck or back pain?", es: "¿Cómo adaptas las clases para personas con dolor de cuello o espalda?" },
      { en: "How often should I practise at home?", es: "¿Con qué frecuencia debo practicar en casa?" },
      { en: "Can I try a class before paying for a block?", es: "¿Puedo probar una clase antes de pagar un paquete?" }
    ],
    neck: {
      en: "Generally safe. Keep head turns small and slow, and stop any movement that sends pain, tingling or numbness down the arm.",
      es: "En general es seguro. Haz los giros de cabeza pequeños y lentos, y detén cualquier movimiento que provoque dolor, hormigueo o adormecimiento en el brazo."
    },
    training: {
      en: "Not regulated by law in most countries. Instructors range from lifelong practitioners to weekend-course graduates.",
      es: "No está regulado por ley en la mayoría de los países. Los instructores van desde practicantes de toda la vida hasta graduados de cursos de fin de semana."
    },
    check: {
      en: "Ask how long they have taught, and whether they have taught people with pain or balance problems.",
      es: "Pregunta cuánto tiempo lleva enseñando y si ha enseñado a personas con dolor o problemas de equilibrio."
    },
    sources: ["sherrington2019", "hall2011"]
  },
  {
    id: "yoga",
    group: "active",
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
    whoDelivers: {
      en: "Yoga teachers in studios, gyms and online",
      es: "Profesores de yoga en estudios, gimnasios y en línea"
    },
    firstSession: [
      { en: "Asks about injuries and your neck before class starts.", es: "Pregunta por lesiones y por tu cuello antes de empezar la clase." },
      { en: "Offers easier versions and props: blocks, straps, a wall.", es: "Ofrece versiones más fáciles y apoyos: bloques, cinturones, una pared." },
      { en: "No pressure to reach the full pose.", es: "Ninguna presión para llegar a la postura completa." }
    ],
    goodSigns: [
      { en: "Gives alternatives to poses that load the neck.", es: "Da alternativas a las posturas que cargan el cuello." },
      { en: "A class small enough for the teacher to see you.", es: "Una clase lo bastante pequeña para que el profesor te vea." },
      { en: "Encourages a short practice at home.", es: "Anima a una práctica corta en casa." }
    ],
    warningSigns: [
      { en: "Headstands, shoulder stands or plough pose offered to someone with neck symptoms.", es: "Posturas sobre la cabeza, sobre los hombros o del arado ofrecidas a alguien con síntomas en el cuello." },
      { en: "Hands-on adjustments that push you deeper into a pose without asking.", es: "Ajustes con las manos que te llevan más lejos en una postura sin preguntar." },
      { en: "Claims that yoga cures disc or nerve problems.", es: "Afirmaciones de que el yoga cura problemas de disco o de nervios." }
    ],
    questions: [
      { en: "Which poses should I skip with a trapped nerve in my neck?", es: "¿Qué posturas debo evitar con un nervio atrapado en el cuello?" },
      { en: "Do you teach a gentle or therapeutic class?", es: "¿Das alguna clase suave o terapéutica?" },
      { en: "Do you give hands-on adjustments, and can I opt out?", es: "¿Haces ajustes con las manos? ¿Puedo pedir que no me los hagas?" }
    ],
    neck: {
      en: "Avoid headstands, shoulder stands, plough and deep backbends that tip the head back. Stop anything that sets off arm symptoms.",
      es: "Evita las posturas sobre la cabeza, sobre los hombros, el arado y las extensiones profundas que llevan la cabeza hacia atrás. Detén todo lo que provoque síntomas en el brazo."
    },
    training: {
      en: "Not regulated by law in most countries. Teacher training ranges from a few weeks to several years; 200 hours is a common minimum.",
      es: "No está regulado por ley en la mayoría de los países. La formación de profesores va de unas semanas a varios años; 200 horas es un mínimo habitual."
    },
    check: {
      en: "Ask about their training hours and their experience with people with neck problems. A registration with a yoga association shows hours trained, not skill with injuries.",
      es: "Pregunta por sus horas de formación y su experiencia con personas con problemas de cuello. Estar registrado en una asociación de yoga muestra horas de formación, no habilidad con lesiones."
    },
    sources: ["wieland2017"]
  },
  {
    id: "pilates",
    group: "active",
    name: { en: "Pilates", es: "Pilates" },
    origin: { en: "Germany and the US · developed by Joseph Pilates in the early 20th century", es: "Alemania y EE. UU. · creado por Joseph Pilates a principios del siglo XX" },
    practice: {
      en: "Controlled exercises on a mat or on spring-loaded machines (the 'reformer'), focusing on posture, breathing and control of the trunk.",
      es: "Ejercicios controlados en colchoneta o en máquinas con muelles (el 'reformer'), centrados en la postura, la respiración y el control del tronco."
    },
    tradition: {
      en: "Controlling a deep-trunk 'powerhouse' is the key to good movement and health.",
      es: "Controlar un 'centro de fuerza' profundo del tronco es la clave del buen movimiento y la salud."
    },
    research: {
      en: "For chronic low back pain, Pilates does better than minimal care for pain and disability, at low-to-moderate certainty, but no better than other exercise. Choose it if it's the exercise you'll keep doing.",
      es: "Para el dolor lumbar crónico, el pilates funciona mejor que una atención mínima para el dolor y la discapacidad, con certeza baja a moderada, pero no mejor que otros ejercicios. Elígelo si es el ejercicio que vas a mantener."
    },
    findings: [{ use: { en: "Chronic low back pain", es: "Dolor lumbar crónico" }, verdict: "may-help" }],
    goodFor: {
      en: "People who like structured, guided exercise; long-term back pain.",
      es: "Quienes prefieren un ejercicio estructurado y guiado; dolor lumbar persistente."
    },
    safety: {
      en: "Low risk. Tell the instructor about your neck: some exercises lift the head against gravity.",
      es: "Riesgo bajo. Cuéntale al instructor lo de tu cuello: algunos ejercicios levantan la cabeza contra la gravedad."
    },
    whoDelivers: {
      en: "Pilates instructors; some physios use Pilates-based exercise ('clinical Pilates')",
      es: "Instructores de pilates; algunos fisioterapeutas usan ejercicios basados en pilates ('pilates clínico')"
    },
    firstSession: [
      { en: "Asks about your health and your pain.", es: "Pregunta por tu salud y tu dolor." },
      { en: "Teaches breathing and basic control before harder exercises.", es: "Enseña la respiración y el control básico antes de los ejercicios más exigentes." },
      { en: "Shows you how to support your head in exercises that lift it.", es: "Te enseña a apoyar la cabeza en los ejercicios que la levantan." }
    ],
    goodSigns: [
      { en: "Progresses gradually.", es: "Progresa de forma gradual." },
      { en: "Small classes or one-to-one sessions at the start.", es: "Clases pequeñas o sesiones individuales al principio." }
    ],
    warningSigns: [
      { en: "Claims that a weak 'core' is the cause of all back and neck pain.", es: "Afirmaciones de que un 'core' débil es la causa de todo dolor de espalda y cuello." },
      { en: "A long, expensive package before you know whether you like it.", es: "Un paquete largo y caro antes de saber si te gusta." }
    ],
    questions: [
      { en: "Which exercises lift or load my neck, and how can we change them?", es: "¿Qué ejercicios levantan o cargan mi cuello y cómo podemos modificarlos?" },
      { en: "Mat or machines: what's the difference for me?", es: "Colchoneta o máquinas: ¿qué diferencia hay para mí?" },
      { en: "Can I try a class before buying a package?", es: "¿Puedo probar una clase antes de comprar un paquete?" }
    ],
    neck: {
      en: "Many mat exercises lift the head off the floor, which loads the neck. Ask for versions with the head down or supported, and stop if arm symptoms appear.",
      es: "Muchos ejercicios en colchoneta levantan la cabeza del suelo, lo que carga el cuello. Pide versiones con la cabeza apoyada y detente si aparecen síntomas en el brazo."
    },
    training: {
      en: "Not regulated by law. Certification courses range from a weekend to a year or more.",
      es: "No está regulado por ley. Los cursos de certificación van de un fin de semana a un año o más."
    },
    check: {
      en: "Ask about their certification and how long it took. Physios who teach Pilates are also registered as physios (in Peru, with the Colegio Tecnólogo Médico del Perú).",
      es: "Pregunta por su certificación y cuánto duró. Los fisioterapeutas que enseñan pilates también están colegiados como fisioterapeutas (en Perú, en el Colegio Tecnólogo Médico del Perú)."
    },
    sources: ["yamato2015"]
  },
  {
    id: "alexander",
    group: "active",
    name: { en: "Alexander technique", es: "Técnica Alexander" },
    origin: { en: "Australia and the UK · developed by the actor F. M. Alexander in the 1890s", es: "Australia y Reino Unido · creada por el actor F. M. Alexander en la década de 1890" },
    practice: {
      en: "One-to-one lessons in noticing and changing habits of posture and movement: how you sit, stand, turn your head and use a phone.",
      es: "Clases individuales para notar y cambiar hábitos de postura y movimiento: cómo te sientas, te pones de pie, giras la cabeza y usas el móvil."
    },
    tradition: {
      en: "Good 'use' of the body, especially the relationship between the head, neck and back, improves how everything else works.",
      es: "Un buen 'uso' del cuerpo, sobre todo la relación entre cabeza, cuello y espalda, mejora el funcionamiento de todo lo demás."
    },
    research: {
      en: "In a large UK trial for chronic neck pain, 20 one-to-one lessons reduced pain at one year compared with usual care, about as much as 12 acupuncture sessions did. In a trial for recurrent back pain, 24 lessons helped, and 6 lessons followed by exercise gave about 70% of that benefit.",
      es: "En un gran ensayo británico sobre dolor de cuello crónico, 20 clases individuales redujeron el dolor al año frente a la atención habitual, más o menos lo mismo que 12 sesiones de acupuntura. En un ensayo sobre dolor lumbar recurrente, 24 clases ayudaron, y 6 clases seguidas de ejercicio dieron cerca del 70% de ese beneficio."
    },
    findings: [
      { use: { en: "Chronic neck pain", es: "Dolor de cuello crónico" }, verdict: "may-help" },
      { use: { en: "Recurrent back pain", es: "Dolor lumbar recurrente" }, verdict: "may-help" }
    ],
    goodFor: {
      en: "Long-term neck pain, especially when the way you sit, work or use screens seems to play a part.",
      es: "Dolor de cuello persistente, sobre todo cuando parece influir cómo te sientas, trabajas o usas pantallas."
    },
    safety: {
      en: "Very low risk: lessons are gentle and mostly spoken, with light touch.",
      es: "Riesgo muy bajo: las clases son suaves, sobre todo habladas, con un contacto ligero."
    },
    whoDelivers: {
      en: "Alexander technique teachers, usually one-to-one; rare in many cities",
      es: "Profesores de técnica Alexander, normalmente en clases individuales; escasos en muchas ciudades"
    },
    firstSession: [
      { en: "Asks about your pain and what you do all day.", es: "Pregunta por tu dolor y por lo que haces durante el día." },
      { en: "Works on everyday movements: sitting, standing, turning your head.", es: "Trabaja movimientos cotidianos: sentarse, ponerse de pie, girar la cabeza." },
      { en: "Uses light touch and explanation, never manipulation.", es: "Usa un contacto ligero y explicaciones, nunca manipulación." }
    ],
    goodSigns: [
      { en: "You learn things you can use at your desk and on your phone.", es: "Aprendes cosas que puedes aplicar en tu escritorio y con el móvil." },
      { en: "A clear number of lessons, like the 20 in the neck-pain trial.", es: "Un número claro de clases, como las 20 del ensayo de dolor de cuello." }
    ],
    warningSigns: [
      { en: "Claims that it cures conditions beyond pain and posture.", es: "Afirmaciones de que cura problemas más allá del dolor y la postura." },
      { en: "Open-ended lessons with no review.", es: "Clases sin fin y sin revisión." }
    ],
    questions: [
      { en: "How many lessons do you suggest, and why?", es: "¿Cuántas clases sugieres y por qué?" },
      { en: "What will I practise between lessons?", es: "¿Qué practicaré entre clases?" },
      { en: "Have you worked with people with neck pain?", es: "¿Has trabajado con personas con dolor de cuello?" }
    ],
    neck: {
      en: "Suitable with a trapped nerve: there is no forceful movement. It won't free the nerve, but it may help long-term neck pain.",
      es: "Apta con un nervio atrapado: no hay movimientos bruscos. No liberará el nervio, pero puede ayudar con el dolor de cuello persistente."
    },
    training: {
      en: "Recognised teachers train for about three years. It is not regulated by law.",
      es: "Los profesores reconocidos se forman durante unos tres años. No está regulada por ley."
    },
    check: {
      en: "In the UK, the Society of Teachers of the Alexander Technique (STAT) keeps a register. Elsewhere, ask where and for how long they trained.",
      es: "En el Reino Unido, la Society of Teachers of the Alexander Technique (STAT) mantiene un registro. En otros países, pregunta dónde y durante cuánto tiempo se formó."
    },
    sources: ["macpherson2015", "little2008"]
  },
  {
    id: "acupuncture",
    group: "passive",
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
      en: "For chronic pain, including neck and back pain, acupuncture beats both sham needling and no acupuncture in trials, but its lead over sham is small. In a UK trial for chronic neck pain, 12 sessions reduced pain at one year compared with usual care. Trials support a modest effect on pain; they do not test the traditional explanation.",
      es: "Para el dolor crónico, incluido el de cuello y espalda, la acupuntura supera tanto a la acupuntura simulada como a no recibirla, pero su ventaja sobre la simulada es pequeña. En un ensayo británico sobre dolor de cuello crónico, 12 sesiones redujeron el dolor al año frente a la atención habitual. Los ensayos respaldan un efecto modesto sobre el dolor; no ponen a prueba la explicación tradicional."
    },
    findings: [
      { use: { en: "Chronic neck pain", es: "Dolor de cuello crónico" }, verdict: "may-help" },
      { use: { en: "Chronic pain generally", es: "Dolor crónico en general" }, verdict: "may-help" }
    ],
    goodFor: {
      en: "Short-term relief of chronic pain, alongside an active plan.",
      es: "Alivio a corto plazo del dolor crónico, junto a un plan activo."
    },
    safety: {
      en: "Serious harm is rare. The most important rare risk is a punctured lung from needles over the upper back, shoulders or chest, so needling there must be shallow and skilled.",
      es: "Los daños graves son raros. El riesgo raro más importante es una perforación del pulmón por agujas en la parte alta de la espalda, los hombros o el tórax, así que la punción ahí debe ser superficial y experta."
    },
    whoDelivers: {
      en: "Licensed acupuncturists, doctors trained in acupuncture, and some physios",
      es: "Acupuntores habilitados, médicos formados en acupuntura y algunos fisioterapeutas"
    },
    firstSession: [
      { en: "A health history, including bleeding problems, blood thinners and pregnancy.", es: "Una historia de salud que incluya problemas de coagulación, anticoagulantes y embarazo." },
      { en: "Sterile, single-use needles, opened in front of you.", es: "Agujas estériles de un solo uso, abiertas delante de ti." },
      { en: "An explanation of where the needles go and how many sessions to try.", es: "Una explicación de dónde irán las agujas y cuántas sesiones probar." }
    ],
    goodSigns: [
      { en: "A set trial, such as the 12 sessions in the neck-pain trial, with a review.", es: "Una prueba con límite, como las 12 sesiones del ensayo de dolor de cuello, con una revisión." },
      { en: "Used alongside exercise, not instead of it.", es: "Se usa junto al ejercicio, no en su lugar." }
    ],
    warningSigns: [
      { en: "Reused needles, or needles not opened in front of you.", es: "Agujas reutilizadas, o agujas que no se abren delante de ti." },
      { en: "Deep needling over the upper back or chest without explanation.", es: "Punción profunda en la parte alta de la espalda o el tórax sin explicación." },
      { en: "Claims that it cures conditions beyond pain.", es: "Afirmaciones de que cura problemas más allá del dolor." },
      { en: "Herbal remedies sold alongside it without telling your doctor.", es: "Remedios de hierbas vendidos a la vez sin avisar a tu médico." }
    ],
    questions: [
      { en: "How many sessions should we try before deciding whether it's working?", es: "¿Cuántas sesiones deberíamos probar antes de decidir si funciona?" },
      { en: "Are your needles sterile and single-use?", es: "¿Tus agujas son estériles y de un solo uso?" },
      { en: "Will you needle near my neck or upper back, and how deep?", es: "¿Pondrás agujas cerca de mi cuello o en la parte alta de la espalda, y a qué profundidad?" }
    ],
    neck: {
      en: "Tell them about your trapped nerve and any blood thinners. Needling around the neck and shoulders is common; ask how they avoid the lung over the upper back.",
      es: "Cuéntales lo de tu nervio atrapado y si tomas anticoagulantes. La punción alrededor del cuello y los hombros es habitual; pregunta cómo evitan el pulmón en la parte alta de la espalda."
    },
    training: {
      en: "Varies by country: in some, only doctors or licensed acupuncturists may practise; in others, it is unregulated.",
      es: "Varía según el país: en algunos solo pueden ejercerla médicos o acupuntores habilitados; en otros no está regulada."
    },
    check: {
      en: "Ask about training and licence, and look them up where a register exists. Doctors who practise acupuncture are still registered as doctors (in Peru, with the CMP).",
      es: "Pregunta por su formación y habilitación, y búscalos donde exista un registro. Los médicos que practican acupuntura siguen colegiados como médicos (en Perú, en el CMP)."
    },
    sources: ["vickers2018", "macpherson2015", "white2004"]
  },
  {
    id: "dry-needling",
    group: "passive",
    name: { en: "Dry needling", es: "Punción seca" },
    origin: { en: "Western medicine · grew out of trigger-point injections in the late 20th century", es: "Medicina occidental · surgió de las infiltraciones en puntos gatillo a finales del siglo XX" },
    practice: {
      en: "A physio or doctor pushes a thin, acupuncture-type needle into a tight, tender spot in a muscle, often until the muscle twitches.",
      es: "Un fisioterapeuta o médico introduce una aguja fina, como de acupuntura, en un punto tenso y doloroso de un músculo, a menudo hasta que el músculo da un espasmo."
    },
    tradition: {
      en: "Tight spots in muscle ('trigger points') cause pain that is felt elsewhere, and needling them releases it.",
      es: "Los puntos tensos del músculo ('puntos gatillo') causan dolor que se siente en otro sitio, y pincharlos lo libera."
    },
    research: {
      en: "In trials run by physios, dry needling reduced muscle pain more than no treatment or sham needling, from straight after treatment up to 12 weeks, at very low to moderate certainty.",
      es: "En ensayos realizados por fisioterapeutas, la punción seca redujo el dolor muscular más que no tratar o que la punción simulada, desde justo después del tratamiento hasta 12 semanas, con certeza muy baja a moderada."
    },
    findings: [{ use: { en: "Muscle pain, short term", es: "Dolor muscular, a corto plazo" }, verdict: "may-help" }],
    goodFor: {
      en: "Short-term relief of tight, tender muscles, as one part of an exercise-based plan.",
      es: "Alivio a corto plazo de músculos tensos y doloridos, como una parte de un plan basado en ejercicio."
    },
    safety: {
      en: "Soreness and bruising are common. As with acupuncture, needling over the upper back and chest carries a rare risk of a punctured lung.",
      es: "Las molestias y los moretones son frecuentes. Como en la acupuntura, la punción en la parte alta de la espalda y el tórax conlleva un riesgo raro de perforar el pulmón."
    },
    whoDelivers: {
      en: "Physios (tecnólogos médicos in Peru) and doctors with extra training",
      es: "Fisioterapeutas (tecnólogos médicos en Perú) y médicos con formación adicional"
    },
    firstSession: [
      { en: "An assessment first, not needles on arrival.", es: "Primero una valoración, no agujas nada más llegar." },
      { en: "An explanation of the risks, and your consent.", es: "Una explicación de los riesgos y tu consentimiento." },
      { en: "Exercises to go with it.", es: "Ejercicios para acompañarla." }
    ],
    goodSigns: [
      { en: "Part of an exercise plan, not the whole plan.", es: "Forma parte de un plan de ejercicio, no es todo el plan." },
      { en: "A small number of sessions, then a review.", es: "Pocas sesiones y luego una revisión." }
    ],
    warningSigns: [
      { en: "Needling as the whole treatment, every session.", es: "La punción como todo el tratamiento, en cada sesión." },
      { en: "Deep needling over the upper back or chest without explanation.", es: "Punción profunda en la parte alta de la espalda o el tórax sin explicación." }
    ],
    questions: [
      { en: "What is the needling for, and what will we do alongside it?", es: "¿Para qué es la punción y qué haremos junto a ella?" },
      { en: "Where will you needle, and how do you avoid the lung?", es: "¿Dónde pondrás las agujas y cómo evitas el pulmón?" },
      { en: "How many sessions before we review?", es: "¿Cuántas sesiones antes de revisar?" }
    ],
    neck: {
      en: "It treats muscle, not the nerve root. It may ease the tight neck and shoulder muscles that often come with a trapped nerve.",
      es: "Trata el músculo, no la raíz nerviosa. Puede aliviar la tensión de los músculos del cuello y el hombro que suele acompañar a un nervio atrapado."
    },
    training: {
      en: "Usually a postgraduate course for physios or doctors. Rules on who may do it differ by country.",
      es: "Normalmente un curso de posgrado para fisioterapeutas o médicos. Las normas sobre quién puede hacerla varían según el país."
    },
    check: {
      en: "Check their registration as a physio (in Peru, the Colegio Tecnólogo Médico del Perú) or doctor (the CMP), and ask about their dry-needling course.",
      es: "Comprueba su colegiatura como fisioterapeuta (en Perú, el Colegio Tecnólogo Médico del Perú) o como médico (el CMP), y pregunta por su curso de punción seca."
    },
    sources: ["gattie2017", "white2004"]
  },
  {
    id: "cupping",
    group: "passive",
    name: { en: "Cupping", es: "Ventosas" },
    origin: { en: "China, the Middle East (hijama) and elsewhere · an ancient folk treatment", es: "China, Oriente Medio (hijama) y otros lugares · un antiguo tratamiento popular" },
    practice: {
      en: "Cups placed on the skin create suction, by heat or a pump, and pull the skin up for a few minutes. 'Wet' cupping also makes small cuts to draw blood.",
      es: "Se colocan copas sobre la piel que hacen succión, con calor o una bomba, y levantan la piel durante unos minutos. Las ventosas 'húmedas' además hacen pequeños cortes para sacar sangre."
    },
    tradition: {
      en: "Draws out stagnation, toxins or 'bad blood', and restores the flow of qi.",
      es: "Extrae el estancamiento, las toxinas o la 'mala sangre', y restablece el flujo del qi."
    },
    research: {
      en: "Many small trials report benefit for pain, including neck pain, but most are of low quality, so reviews can't say whether it works. The round marks are bruises, not drawn-out toxins.",
      es: "Muchos ensayos pequeños describen beneficio para el dolor, incluido el de cuello, pero la mayoría son de baja calidad, así que las revisiones no pueden decir si funciona. Las marcas redondas son moretones, no toxinas extraídas."
    },
    findings: [{ use: { en: "Neck and back pain", es: "Dolor de cuello y espalda" }, verdict: "unclear" }],
    goodFor: {
      en: "People who find it relaxing, as an extra rather than a replacement for an active plan.",
      es: "Quienes la encuentran relajante, como un extra y no como sustituto de un plan activo."
    },
    safety: {
      en: "Expect round bruises for days. Fire cupping can burn; wet cupping can cause infection and needs sterile, single-use blades.",
      es: "Espera moretones redondos durante días. Las ventosas con fuego pueden quemar; las húmedas pueden causar infección y necesitan cuchillas estériles de un solo uso."
    },
    whoDelivers: {
      en: "Acupuncturists, traditional healers, massage therapists and some physios",
      es: "Acupuntores, curanderos tradicionales, masoterapeutas y algunos fisioterapeutas"
    },
    firstSession: [
      { en: "Asks about blood thinners and skin conditions.", es: "Pregunta por anticoagulantes y problemas de piel." },
      { en: "Clean cups, and sterile single-use blades for wet cupping.", es: "Copas limpias, y cuchillas estériles de un solo uso para las ventosas húmedas." },
      { en: "Explains the marks you'll have afterwards.", es: "Explica las marcas que tendrás después." }
    ],
    goodSigns: [{ en: "Offered as one part of a plan, not the whole of it.", es: "Se ofrece como una parte del plan, no como todo el plan." }],
    warningSigns: [
      { en: "Claims that it removes toxins.", es: "Afirmaciones de que elimina toxinas." },
      { en: "Wet cupping without sterile, single-use blades.", es: "Ventosas húmedas sin cuchillas estériles de un solo uso." },
      { en: "Cupping over broken or infected skin.", es: "Ventosas sobre piel lesionada o infectada." }
    ],
    questions: [
      { en: "Dry or wet cupping, and why?", es: "¿Ventosas secas o húmedas, y por qué?" },
      { en: "How do you keep the equipment clean?", es: "¿Cómo mantienes limpio el material?" },
      { en: "How will we know whether it's helping?", es: "¿Cómo sabremos si está ayudando?" }
    ],
    neck: {
      en: "Cupping on the neck and shoulders is common. It can't reach a trapped nerve root; treat it as relaxation, not treatment.",
      es: "Las ventosas en el cuello y los hombros son habituales. No llegan a una raíz nerviosa atrapada; tómalas como relajación, no como tratamiento."
    },
    training: {
      en: "Not regulated as a separate skill in most countries.",
      es: "No está regulada como técnica independiente en la mayoría de los países."
    },
    check: {
      en: "Ask who trained them and how they sterilise equipment. If a registered professional offers it, check their registration.",
      es: "Pregunta quién le formó y cómo esteriliza el material. Si lo ofrece un profesional colegiado, comprueba su colegiatura."
    },
    sources: ["cao2012"]
  },
  {
    id: "huesero",
    group: "passive",
    name: { en: "Huesero / sobador (traditional bone-setter)", es: "Huesero / sobador" },
    origin: { en: "Peru and the Andes · a folk healing tradition handed down in families", es: "Perú y los Andes · una tradición de curación popular que se transmite en las familias" },
    practice: {
      en: "Rubbing with oils or ointments, then pulling and twisting to 'set' joints, bones or nerves said to be out of place, often after sprains, falls or back pain.",
      es: "Frotar con aceites o pomadas y luego jalar y torcer para 'acomodar' articulaciones, huesos o nervios que estarían fuera de sitio, a menudo tras torceduras, caídas o dolor de espalda."
    },
    tradition: {
      en: "Bones, joints or nerves slip out of place, and skilled hands put them back.",
      es: "Los huesos, las articulaciones o los nervios se zafan, y unas manos expertas los acomodan."
    },
    research: {
      en: "RootAtlas found no controlled trials of traditional bone-setting for neck or back pain. Forceful neck manipulation carries a rare risk of artery injury whoever does it, and pulling on an undiagnosed fracture can make it worse.",
      es: "RootAtlas no encontró ensayos controlados sobre el acomodo tradicional de huesos para el dolor de cuello o espalda. La manipulación cervical brusca conlleva un riesgo raro de lesión arterial, la haga quien la haga, y jalar una fractura no diagnosticada puede empeorarla."
    },
    findings: [{ use: { en: "Neck or back pain: not studied", es: "Dolor de cuello o espalda: sin estudios" }, verdict: "unclear" }],
    goodFor: {
      en: "Comfort from rubbing and massage. Not a substitute for an examination after a fall or injury.",
      es: "El alivio de las frotaciones y el masaje. No sustituye una exploración tras una caída o lesión."
    },
    safety: {
      en: "After a fall, an accident or sudden severe pain, see a doctor first: a fracture or torn ligament needs a diagnosis, not setting. Don't let anyone forcefully twist your neck if you have arm symptoms.",
      es: "Tras una caída, un accidente o un dolor intenso repentino, ve primero al médico: una fractura o un ligamento roto necesitan un diagnóstico, no un acomodo. No dejes que nadie te tuerza el cuello con fuerza si tienes síntomas en el brazo."
    },
    whoDelivers: {
      en: "Traditional healers, usually trained within the family, in neighbourhoods and markets across Peru",
      es: "Curanderos tradicionales, normalmente formados en la familia, en barrios y mercados de todo el Perú"
    },
    firstSession: [
      { en: "Asks how the problem started, and sends you to a doctor if it followed a fall or accident.", es: "Pregunta cómo empezó el problema y te manda al médico si fue tras una caída o un accidente." },
      { en: "Gentle rubbing rather than forceful twisting.", es: "Frotaciones suaves en lugar de torceduras bruscas." },
      { en: "Tells you to see a doctor if you aren't better soon.", es: "Te dice que vayas al médico si no mejoras pronto." }
    ],
    goodSigns: [
      { en: "Gentle, and stops if it hurts more.", es: "Es suave y para si duele más." },
      { en: "Knows the limits of what they do.", es: "Conoce los límites de lo que hace." }
    ],
    warningSigns: [
      { en: "Forceful twisting or 'cracking' of the neck.", es: "Torcer o 'tronar' el cuello con fuerza." },
      { en: "Setting a swollen, misshapen or very painful limb after a fall, without an X-ray.", es: "Acomodar un miembro hinchado, deformado o muy doloroso tras una caída, sin una radiografía." },
      { en: "Saying a nerve is 'out of place' and will be put back.", es: "Decir que un nervio está 'zafado' y que lo va a acomodar." }
    ],
    questions: [
      { en: "What exactly will you do to my neck?", es: "¿Qué me vas a hacer exactamente en el cuello?" },
      { en: "Will you avoid twisting it?", es: "¿Evitarás torcerlo?" },
      { en: "When should I see a doctor instead?", es: "¿Cuándo debería ir mejor al médico?" }
    ],
    neck: {
      en: "Gentle rubbing is unlikely to hurt, but avoid forceful twisting of the neck. The nerve isn't 'out of place': it is pressed on or inflamed where it leaves the spine, and pulling can't put it back.",
      es: "Es poco probable que las frotaciones suaves hagan daño, pero evita que te tuerzan el cuello con fuerza. El nervio no está 'zafado': está comprimido o inflamado donde sale de la columna, y jalar no lo devuelve a su sitio."
    },
    training: {
      en: "No formal training or registration: the skills are passed down in families or learned as an apprentice.",
      es: "Sin formación formal ni registro: el oficio se transmite en las familias o se aprende como aprendiz."
    },
    check: {
      en: "There is no register to look up. Ask about their experience, and keep to gentle treatment.",
      es: "No hay ningún registro que consultar. Pregunta por su experiencia y quédate con un tratamiento suave."
    },
    sources: ["biller2014"]
  },
  {
    id: "reflexology",
    group: "passive",
    name: { en: "Reflexology", es: "Reflexología" },
    origin: { en: "United States · developed in the early 20th century from 'zone therapy'", es: "Estados Unidos · creada a principios del siglo XX a partir de la 'terapia zonal'" },
    practice: {
      en: "Pressure applied to specific points on the feet, hands or ears.",
      es: "Presión sobre puntos concretos de los pies, las manos o las orejas."
    },
    tradition: {
      en: "Each area of the foot corresponds to an organ or body part, so pressing it treats that part.",
      es: "Cada zona del pie corresponde a un órgano o parte del cuerpo, así que presionarla trata esa parte."
    },
    research: {
      en: "A systematic review of trials found no convincing evidence that reflexology treats any medical condition. It can feel relaxing, like any foot massage.",
      es: "Una revisión sistemática de ensayos no encontró evidencia convincente de que la reflexología trate ninguna enfermedad. Puede resultar relajante, como cualquier masaje de pies."
    },
    findings: [{ use: { en: "Treating pain or illness", es: "Tratar el dolor o una enfermedad" }, verdict: "not-supported" }],
    goodFor: { en: "Relaxation, if you enjoy it.", es: "Relajación, si la disfrutas." },
    safety: {
      en: "Harmless in itself. The risk is relying on it instead of treatment that works.",
      es: "Inofensiva en sí. El riesgo es confiar en ella en lugar de en un tratamiento que funciona."
    },
    whoDelivers: { en: "Reflexologists; often offered in spas and massage centres", es: "Reflexólogos; a menudo se ofrece en spas y centros de masajes" },
    firstSession: [
      { en: "Asks about your health and warning signs.", es: "Pregunta por tu salud y por señales de alarma." },
      { en: "Doesn't claim to diagnose you from your feet.", es: "No dice diagnosticarte a partir de los pies." }
    ],
    goodSigns: [{ en: "Presents it as relaxation, not treatment.", es: "La presenta como relajación, no como tratamiento." }],
    warningSigns: [
      { en: "Diagnosing illness from your feet.", es: "Diagnosticar enfermedades a partir de los pies." },
      { en: "Advice to stop or delay medical treatment.", es: "Consejos para dejar o retrasar un tratamiento médico." }
    ],
    questions: [
      { en: "What do you expect this to do for my neck?", es: "¿Qué esperas que haga esto por mi cuello?" },
      { en: "What should I do if my symptoms get worse?", es: "¿Qué debo hacer si mis síntomas empeoran?" }
    ],
    neck: {
      en: "Pressing a 'neck point' on the foot can't reach a trapped nerve in the neck.",
      es: "Presionar un 'punto del cuello' en el pie no puede llegar a un nervio atrapado en el cuello."
    },
    training: { en: "Courses vary; not regulated in most countries.", es: "Los cursos varían; no está regulada en la mayoría de los países." },
    check: { en: "Ask about training, and treat it as a relaxing extra.", es: "Pregunta por su formación y tómala como un extra relajante." },
    sources: ["ernst2009"]
  },
  {
    id: "homeopathy",
    group: "passive",
    name: { en: "Homeopathy", es: "Homeopatía" },
    origin: { en: "Germany · founded by Samuel Hahnemann in the 1790s", es: "Alemania · fundada por Samuel Hahnemann en la década de 1790" },
    practice: {
      en: "Remedies made by diluting a substance over and over, often until none of the original is left, taken as pills or drops.",
      es: "Remedios hechos diluyendo una sustancia una y otra vez, a menudo hasta que no queda nada de la original, tomados en pastillas o gotas."
    },
    tradition: {
      en: "'Like cures like', and diluting a remedy makes it stronger.",
      es: "'Lo similar cura lo similar', y diluir un remedio lo hace más potente."
    },
    research: {
      en: "Australia's national medical research council reviewed the evidence in 2015 and found no health condition for which homeopathy reliably works.",
      es: "El consejo nacional de investigación médica de Australia revisó la evidencia en 2015 y no encontró ninguna enfermedad para la que la homeopatía funcione de forma fiable."
    },
    findings: [{ use: { en: "Any health condition", es: "Cualquier problema de salud" }, verdict: "not-supported" }],
    goodFor: { en: "Nothing it has been shown to treat.", es: "Nada para lo que se haya demostrado que funcione." },
    safety: {
      en: "The pills are usually harmless. The risk is delay: using them instead of care that works, or despite warning signs.",
      es: "Las pastillas suelen ser inofensivas. El riesgo es el retraso: usarlas en lugar de un tratamiento que funciona, o pese a señales de alarma."
    },
    whoDelivers: { en: "Homeopaths, some doctors and pharmacies", es: "Homeópatas, algunos médicos y farmacias" },
    firstSession: [
      { en: "Asks about your health and warning signs.", es: "Pregunta por tu salud y por señales de alarma." },
      { en: "Doesn't advise stopping anything your doctor prescribed.", es: "No aconseja dejar nada de lo que te recetó tu médico." }
    ],
    goodSigns: [{ en: "Encourages you to keep seeing your doctor.", es: "Te anima a seguir viendo a tu médico." }],
    warningSigns: [
      { en: "Advice to stop or avoid prescribed medicines or vaccines.", es: "Consejos para dejar o evitar medicamentos recetados o vacunas." },
      { en: "Remedies offered for warning signs such as weakness or spreading numbness.", es: "Remedios ofrecidos ante señales de alarma como debilidad o adormecimiento que se extiende." }
    ],
    questions: [
      { en: "What evidence is there that this works for neck pain?", es: "¿Qué evidencia hay de que esto funcione para el dolor de cuello?" },
      { en: "What should I do if my symptoms get worse?", es: "¿Qué debo hacer si mis síntomas empeoran?" }
    ],
    neck: {
      en: "There is no evidence that it helps a trapped nerve. Don't let it delay an examination if you have weakness or worsening numbness.",
      es: "No hay evidencia de que ayude a un nervio atrapado. No dejes que retrase una exploración si tienes debilidad o un adormecimiento que empeora."
    },
    training: { en: "Courses vary; some homeopaths are also doctors.", es: "Los cursos varían; algunos homeópatas también son médicos." },
    check: {
      en: "If they say they are a doctor, check their registration (in Peru, with the CMP).",
      es: "Si dicen que son médicos, comprueba su colegiatura (en Perú, en el CMP)."
    },
    sources: ["nhmrc2015"]
  }
];

export function practiceById(id: string): Practice | undefined {
  return PRACTICES.find((p) => p.id === id);
}
