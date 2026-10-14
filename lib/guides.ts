import { CLINICIANS } from "./clinicians";
import type { L } from "./i18n";
import { PRACTICES } from "./practices";
import type { SourceId } from "./sources";

/**
 * One guide per profession on the "Who to see" page: what a good first visit
 * looks like, the signs of good and poor care, what they use (linked to the
 * evidence board's verdicts rather than restating them), what to ask, and
 * how to check they are who they say they are.
 *
 * Registration rules differ by country and change, so the guides name only
 * registers RootAtlas is confident exist (the Colegio Médico del Perú and its
 * specialist register, the Colegio Tecnólogo Médico del Perú, the UK's
 * statutory registers) and otherwise tell people to ask, then look it up.
 * They never claim a profession is or isn't regulated in Peru where that
 * couldn't be confirmed.
 */
export interface Guide {
  /** Matches an entry in CLINICIANS. */
  id: string;
  role: L;
  firstVisit: L[];
  goodSigns: L[];
  warningSigns: L[];
  /** Treatment ids on the evidence board. */
  uses: string[];
  questions: L[];
  training: L;
  check: L;
  sources: SourceId[];
}

const CMP_CHECK: L = {
  en: "In Peru, every doctor has a CMP number (Colegio Médico del Perú) and specialists also have an RNE number (national register of specialists). Both can be looked up on the CMP's website. Elsewhere, use the national medical register.",
  es: "En Perú, todo médico tiene un número de colegiatura del CMP (Colegio Médico del Perú) y los especialistas, además, un número de RNE (Registro Nacional de Especialistas). Ambos se pueden consultar en la web del CMP. En otros países, usa el registro médico nacional."
};

export const GUIDES: readonly Guide[] = [
  {
    id: "gp",
    role: {
      en: "Your first stop for anything new, severe or unexplained. A GP takes a history, examines you, looks for warning signs, can prescribe pain relief, and refers you on: to physiotherapy, a physiatrist, a neurologist or a surgeon.",
      es: "Tu primera parada ante algo nuevo, intenso o sin explicación. El médico general te pregunta, te explora, busca señales de alarma, puede recetar analgésicos y te deriva: a fisioterapia, a un fisiatra, a un neurólogo o a un cirujano."
    },
    firstVisit: [
      { en: "Questions about warning signs: fever, weight loss, a history of cancer, bladder or bowel changes, weakness.", es: "Preguntas sobre señales de alarma: fiebre, pérdida de peso, antecedentes de cáncer, cambios en la vejiga o el intestino, debilidad." },
      { en: "A check of the nerves in the affected arm or leg: strength, reflexes and feeling, compared side to side.", es: "Una revisión de los nervios del brazo o la pierna afectados: fuerza, reflejos y sensibilidad, comparando ambos lados." },
      { en: "A plain explanation of what they think is going on, and what would change the plan.", es: "Una explicación clara de lo que creen que pasa y de qué cambiaría el plan." },
      { en: "Advice to keep moving, and a referral for exercise-based care if it isn't settling.", es: "Consejo para seguir moviéndote y una derivación a un tratamiento basado en ejercicio si no mejora." }
    ],
    goodSigns: [
      { en: "Explains that most trapped nerves settle with time, and why.", es: "Explica que la mayoría de los nervios atrapados mejoran con el tiempo, y por qué." },
      { en: "Examines both arms or legs, not just the painful one.", es: "Explora ambos brazos o piernas, no solo el que duele." },
      { en: "Tells you when to come back, and what would make them want a scan.", es: "Te dice cuándo volver y qué le haría pedir una resonancia." }
    ],
    warningSigns: [
      { en: "A scan in the first weeks with no warning signs: it rarely changes the plan, and normal age changes on the report can worry you for nothing.", es: "Una resonancia en las primeras semanas sin señales de alarma: rara vez cambia el plan, y los cambios normales de la edad en el informe pueden preocuparte sin motivo." },
      { en: "Medication as the whole plan, with no advice on movement or exercise.", es: "La medicación como todo el plan, sin consejos sobre movimiento o ejercicio." },
      { en: "No examination of the arm or leg when that is where your symptoms are.", es: "Ninguna exploración del brazo o la pierna cuando ahí están tus síntomas." }
    ],
    uses: ["time", "education", "exercise", "routine-xray"],
    questions: [
      { en: "Is there anything in my history or exam that worries you?", es: "¿Hay algo en mis antecedentes o en la exploración que te preocupe?" },
      { en: "Should I see a physiotherapist, and can you refer me?", es: "¿Debería ver a un fisioterapeuta? ¿Puedes derivarme?" },
      { en: "What would make you want a scan, and when should I come back?", es: "¿Qué te haría pedir una resonancia y cuándo debo volver?" },
      { en: "Is neck manipulation safe for me, given my history?", es: "¿Es segura para mí la manipulación cervical, con mis antecedentes?" }
    ],
    training: { en: "A medical degree and a licence to practise medicine.", es: "Título de médico y licencia para ejercer la medicina." },
    check: CMP_CHECK,
    sources: ["wong2014", "blanpied2017", "aca-choosingwisely", "nakashima2015"]
  },
  {
    id: "physiatrist",
    role: {
      en: "A doctor specialised in physical medicine and rehabilitation: diagnosing and treating spine, nerve and muscle problems without surgery. Can order scans and nerve tests, prescribe, and in some settings give injections.",
      es: "Un médico especializado en medicina física y rehabilitación: diagnostica y trata problemas de columna, nervios y músculos sin cirugía. Puede pedir resonancias y pruebas nerviosas, recetar y, en algunos centros, poner infiltraciones."
    },
    firstVisit: [
      { en: "A full neurological exam, and a look at how you move.", es: "Una exploración neurológica completa y una valoración de cómo te mueves." },
      { en: "Your scans, if you have them, checked against your symptoms and exam: do they actually match?", es: "Tus resonancias, si las tienes, contrastadas con tus síntomas y la exploración: ¿de verdad coinciden?" },
      { en: "Nerve tests (EMG and nerve conduction) only if the diagnosis is unclear or there is weakness.", es: "Pruebas nerviosas (electromiografía) solo si el diagnóstico no está claro o hay debilidad." },
      { en: "A plan built around what you want to be able to do again.", es: "Un plan construido en torno a lo que quieres volver a poder hacer." }
    ],
    goodSigns: [
      { en: "Treats you, not the scan: findings that don't match your symptoms are explained, not acted on.", es: "Te trata a ti, no a la resonancia: los hallazgos que no coinciden con tus síntomas se explican, no se tratan." },
      { en: "Makes exercise the core of the plan.", es: "Hace del ejercicio el centro del plan." },
      { en: "Explains what an injection could and couldn't do before offering one.", es: "Explica lo que una infiltración puede y no puede hacer antes de ofrecerla." }
    ],
    warningSigns: [
      { en: "An injection before a fair trial of exercise, with no clear reason.", es: "Una infiltración antes de probar bien el ejercicio, sin una razón clara." },
      { en: "Repeated injections that give no lasting benefit.", es: "Infiltraciones repetidas que no dan un beneficio duradero." }
    ],
    uses: ["exercise", "neural", "education", "injection"],
    questions: [
      { en: "Do my scan findings match my symptoms and your exam?", es: "¿Coinciden los hallazgos de mi resonancia con mis síntomas y tu exploración?" },
      { en: "Would a nerve test change what we do?", es: "¿Una prueba nerviosa cambiaría lo que hacemos?" },
      { en: "If you suggest an injection: what is the goal, how long might it last, and what are the risks?", es: "Si propones una infiltración: ¿cuál es el objetivo, cuánto podría durar y qué riesgos tiene?" }
    ],
    training: { en: "A medical degree plus specialist training (residency) in physical medicine and rehabilitation.", es: "Título de médico más formación de especialista (residentado) en medicina física y rehabilitación." },
    check: CMP_CHECK,
    sources: ["blanpied2017", "nakashima2015", "fda2014"]
  },
  {
    id: "physio",
    role: {
      en: "Assesses how you move, how strong you are and how your nerves are working, then treats mainly with exercise, education and hands-on techniques. In Peru the title is 'tecnólogo médico en terapia física y rehabilitación'.",
      es: "Evalúa cómo te mueves, tu fuerza y cómo funcionan tus nervios, y trata sobre todo con ejercicio, educación y técnicas manuales. En Perú el título es 'tecnólogo médico en terapia física y rehabilitación'."
    },
    firstVisit: [
      { en: "A history that includes the warning-sign questions.", es: "Una historia que incluya las preguntas de señales de alarma." },
      { en: "A movement and nerve exam, including the tests for a trapped nerve in the neck.", es: "Una exploración del movimiento y de los nervios, incluidas las pruebas de nervio atrapado en el cuello." },
      { en: "A home exercise programme from the first session.", es: "Un programa de ejercicios en casa desde la primera sesión." },
      { en: "A goal you can measure, and a date to review it.", es: "Un objetivo medible y una fecha para revisarlo." }
    ],
    goodSigns: [
      { en: "You leave each session knowing what to do at home.", es: "Sales de cada sesión sabiendo qué hacer en casa." },
      { en: "Your exercises get harder as you improve.", es: "Tus ejercicios se vuelven más exigentes a medida que mejoras." },
      { en: "Progress is measured and the numbers are shared with you.", es: "El progreso se mide y te comparten los números." },
      { en: "There is a plan to discharge you.", es: "Hay un plan para darte de alta." }
    ],
    warningSigns: [
      { en: "Sessions that are mostly machines (ultrasound, TENS, heat, laser) with no exercise.", es: "Sesiones que son sobre todo aparatos (ultrasonido, TENS, calor, láser) sin ejercicio." },
      { en: "Many sessions booked with no review point.", es: "Muchas sesiones reservadas sin un punto de revisión." },
      { en: "Nothing for you to do between sessions.", es: "Nada que hacer por tu cuenta entre sesiones." }
    ],
    uses: ["exercise", "education", "mobilisation", "neural", "traction", "manipulation"],
    questions: [
      { en: "Which exercises should I do at home, how often, and how will we progress them?", es: "¿Qué ejercicios debo hacer en casa, con qué frecuencia y cómo los iremos progresando?" },
      { en: "How will we measure whether I'm improving?", es: "¿Cómo mediremos si estoy mejorando?" },
      { en: "When do you expect to discharge me?", es: "¿Cuándo prevés darme de alta?" }
    ],
    training: {
      en: "A university degree in physiotherapy. In Peru: a licentiate in medical technology, specialising in physical therapy and rehabilitation.",
      es: "Título universitario en fisioterapia. En Perú: licenciatura en tecnología médica, en la especialidad de terapia física y rehabilitación."
    },
    check: {
      en: "In Peru, check their registration with the Colegio Tecnólogo Médico del Perú. In the UK, the HCPC register. Elsewhere, the national physiotherapy register.",
      es: "En Perú, comprueba su colegiatura en el Colegio Tecnólogo Médico del Perú. En el Reino Unido, el registro del HCPC. En otros países, el registro nacional de fisioterapia."
    },
    sources: ["gross2015ex", "blanpied2017", "basson2017"]
  },
  {
    id: "chiropractor",
    role: {
      en: "Focuses on the spine and joints, treating mainly with spinal manipulation ('adjustments'), often with mobilisation, soft-tissue work, exercise and advice. Styles vary widely: some clinics are exercise-led and evidence-based; others sell long courses of adjustments and lifelong 'maintenance'.",
      es: "Se centra en la columna y las articulaciones y trata sobre todo con manipulación vertebral ('ajustes'), a menudo junto con movilización, trabajo de tejidos blandos, ejercicio y consejos. Los estilos varían mucho: algunas consultas se basan en el ejercicio y la evidencia; otras venden series largas de ajustes y 'mantenimiento' de por vida."
    },
    firstVisit: [
      { en: "A full history with the warning-sign questions. Before any neck manipulation: questions about dizziness, headache, vision or speech changes.", es: "Una historia completa con las preguntas de señales de alarma. Antes de cualquier manipulación cervical: preguntas sobre mareos, dolor de cabeza y cambios en la visión o el habla." },
      { en: "A neurological exam of the arm or leg: strength, reflexes and feeling.", es: "Una exploración neurológica del brazo o la pierna: fuerza, reflejos y sensibilidad." },
      { en: "An explanation of the risks of neck manipulation and the alternatives, then your consent.", es: "Una explicación de los riesgos de la manipulación cervical y de las alternativas, y luego tu consentimiento." },
      { en: "A short trial of care with a clear review point, rather than a large package up front.", es: "Una prueba de tratamiento corta con un punto de revisión claro, en lugar de un paquete grande por adelantado." },
      { en: "Exercises or advice to keep you moving.", es: "Ejercicios o consejos para que sigas moviéndote." }
    ],
    goodSigns: [
      { en: "Includes exercise and things you can do yourself.", es: "Incluye ejercicio y cosas que puedes hacer tú." },
      { en: "Measures your symptoms and what you can do, not just posture or X-rays.", es: "Mide tus síntomas y lo que puedes hacer, no solo la postura o las radiografías." },
      { en: "Refers you on if you're not improving.", es: "Te deriva si no mejoras." }
    ],
    warningSigns: [
      { en: "A large prepaid package at the first visit, before any trial of care.", es: "Un paquete prepagado grande en la primera visita, antes de cualquier prueba de tratamiento." },
      { en: "X-rays for everyone, or repeat X-rays to 'track progress'.", es: "Radiografías para todos, o radiografías repetidas para 'seguir el progreso'." },
      { en: "Claims that adjustments treat organs, immunity or general health.", es: "Afirmaciones de que los ajustes tratan órganos, la inmunidad o la salud general." },
      { en: "Being told you'll need adjustments for life before you've had a trial of care.", es: "Que te digan que necesitarás ajustes de por vida antes de haber probado el tratamiento." },
      { en: "Posture scans offered as proof of progress while your symptoms aren't improving.", es: "Escáneres posturales presentados como prueba de progreso mientras tus síntomas no mejoran." }
    ],
    uses: ["manipulation", "mobilisation", "exercise", "posture", "routine-xray", "non-msk"],
    questions: [
      { en: "What is the risk of neck manipulation for me, and could we use mobilisation or exercise instead?", es: "¿Qué riesgo tiene para mí la manipulación cervical? ¿Podríamos usar movilización o ejercicio en su lugar?" },
      { en: "Can I pay per visit instead of a package? What happens to sessions I don't use?", es: "¿Puedo pagar por visita en lugar de un paquete? ¿Qué pasa con las sesiones que no use?" },
      { en: "What will we measure to know it's working, and when will we review it?", es: "¿Qué mediremos para saber que funciona y cuándo lo revisaremos?" },
      { en: "Why do I need an X-ray? What would it change?", es: "¿Por qué necesito una radiografía? ¿Qué cambiaría?" }
    ],
    training: {
      en: "Where chiropractic is regulated, a dedicated degree, typically four to five years full-time. Chiropractors are not medical doctors and can't prescribe. Where it isn't regulated, training varies a great deal.",
      es: "Donde la quiropráctica está regulada, una carrera específica, normalmente de cuatro a cinco años a tiempo completo. Los quiroprácticos no son médicos y no pueden recetar. Donde no está regulada, la formación varía muchísimo."
    },
    check: {
      en: "Ask where and for how long they trained, and which body they are registered with; then look that register up yourself. In the UK: the General Chiropractic Council. In the US: the state licensing board.",
      es: "Pregunta dónde y durante cuánto tiempo se formó y en qué organismo está registrado; luego consulta ese registro tú mismo. En el Reino Unido: el General Chiropractic Council. En EE. UU.: la junta de licencias del estado."
    },
    sources: ["gross2015manip", "biller2014", "aca-choosingwisely", "cote2021"]
  },
  {
    id: "osteopath",
    role: {
      en: "Uses hands-on techniques (soft-tissue work, stretching, mobilisation and manipulation) plus exercise and lifestyle advice, with a whole-body view of how one area affects another. In the US, a 'DO' is a fully licensed physician: a different job.",
      es: "Usa técnicas manuales (trabajo de tejidos blandos, estiramientos, movilización y manipulación) más ejercicio y consejos de estilo de vida, con una visión de todo el cuerpo sobre cómo una zona afecta a otra. En EE. UU., un 'DO' es un médico con licencia completa: otro trabajo distinto."
    },
    firstVisit: [
      { en: "A history with the warning-sign questions, and an exam that includes the nerves of the arm or leg.", es: "Una historia con las preguntas de señales de alarma y una exploración que incluya los nervios del brazo o la pierna." },
      { en: "An explanation of the techniques they plan to use, their risks, and your consent.", es: "Una explicación de las técnicas que piensa usar, sus riesgos y tu consentimiento." },
      { en: "Exercises or advice for between sessions.", es: "Ejercicios o consejos para entre sesiones." },
      { en: "A number of sessions after which you'll decide together whether it's working.", es: "Un número de sesiones tras el cual decidiréis juntos si funciona." }
    ],
    goodSigns: [
      { en: "Gives you exercises and advice, not only hands-on treatment.", es: "Te da ejercicios y consejos, no solo tratamiento manual." },
      { en: "Explains findings in plain terms and checks that you're improving.", es: "Explica los hallazgos con palabras claras y comprueba que mejoras." }
    ],
    warningSigns: [
      { en: "Cranial or visceral techniques offered for organ, hormone or children's conditions such as colic or asthma.", es: "Técnicas craneales o viscerales ofrecidas para problemas de órganos, hormonales o de niños, como cólicos o asma." },
      { en: "Long courses of treatment with no measured change.", es: "Tratamientos largos sin ningún cambio medido." }
    ],
    uses: ["mobilisation", "manipulation", "massage", "exercise", "non-msk"],
    questions: [
      { en: "Which techniques will you use on my neck, and what are their risks?", es: "¿Qué técnicas usarás en mi cuello y qué riesgos tienen?" },
      { en: "What should I be doing between sessions?", es: "¿Qué debería hacer entre sesiones?" },
      { en: "How many sessions before we decide whether it's working?", es: "¿Cuántas sesiones antes de decidir si funciona?" }
    ],
    training: {
      en: "In the UK, a degree of usually four years and statutory registration. In many countries osteopathy isn't regulated, so training varies widely.",
      es: "En el Reino Unido, una carrera de normalmente cuatro años y registro obligatorio por ley. En muchos países la osteopatía no está regulada, así que la formación varía mucho."
    },
    check: {
      en: "UK: the General Osteopathic Council register. US: DOs are licensed by state medical boards. Elsewhere, ask about training and registration, then look the register up yourself.",
      es: "Reino Unido: el registro del General Osteopathic Council. EE. UU.: los DO tienen licencia de las juntas médicas estatales. En otros países, pregunta por su formación y registro y luego consulta ese registro tú mismo."
    },
    sources: ["gross2015manip", "cote2021"]
  },
  {
    id: "neurologist",
    role: {
      en: "A doctor specialised in the brain, spinal cord and nerves. For neck or back problems, most useful when the nerve picture is unclear: weakness, numbness that doesn't fit one root, symptoms on both sides, or a possible nerve disease.",
      es: "Un médico especializado en el cerebro, la médula y los nervios. En problemas de cuello o espalda, es más útil cuando el cuadro nervioso no está claro: debilidad, un adormecimiento que no encaja con una raíz, síntomas en ambos lados o una posible enfermedad nerviosa."
    },
    firstVisit: [
      { en: "A detailed neurological exam: reflexes, strength muscle by muscle, and sensation.", es: "Una exploración neurológica detallada: reflejos, fuerza músculo por músculo y sensibilidad." },
      { en: "A search for mimics, such as carpal tunnel syndrome or a nerve trapped at the elbow.", es: "La búsqueda de imitadores, como el síndrome del túnel carpiano o un nervio atrapado en el codo." },
      { en: "Nerve tests (EMG and nerve conduction) and an MRI when the exam calls for them.", es: "Pruebas nerviosas (electromiografía) y una resonancia cuando la exploración lo justifique." }
    ],
    goodSigns: [
      { en: "Tells you whether the problem is in the neck, further down the arm, or both.", es: "Te dice si el problema está en el cuello, más abajo en el brazo, o en ambos." },
      { en: "Explains in plain words what any nerve test showed.", es: "Explica con palabras claras lo que mostró cualquier prueba nerviosa." }
    ],
    warningSigns: [
      { en: "Get seen urgently if weakness is getting worse, if both hands become clumsy, or if walking becomes unsteady: these can mean the spinal cord is involved.", es: "Pide atención urgente si la debilidad empeora, si ambas manos se vuelven torpes o si caminar se vuelve inestable: puede significar que la médula está afectada." }
    ],
    uses: ["time", "education"],
    questions: [
      { en: "Is this coming from my neck, from a nerve in my arm, or both?", es: "¿Esto viene de mi cuello, de un nervio del brazo o de ambos?" },
      { en: "Do I need a nerve test, and what would it change?", es: "¿Necesito una prueba nerviosa y qué cambiaría?" },
      { en: "Is there any sign that the spinal cord is involved?", es: "¿Hay alguna señal de que la médula esté afectada?" }
    ],
    training: { en: "A medical degree plus specialist training in neurology.", es: "Título de médico más formación de especialista en neurología." },
    check: CMP_CHECK,
    sources: ["wainner2003", "standring2020"]
  },
  {
    id: "surgeon",
    role: {
      en: "A neurosurgeon or orthopaedic surgeon who specialises in the spine. Decides whether surgery would help, and does it. Most trapped nerves never need surgery.",
      es: "Un neurocirujano o traumatólogo especializado en la columna. Decide si la cirugía ayudaría y la realiza. La mayoría de los nervios atrapados nunca necesitan cirugía."
    },
    firstVisit: [
      { en: "Your symptoms and exam matched to the MRI: surgery treats the level that explains your symptoms, not every finding on the scan.", es: "Tus síntomas y la exploración contrastados con la resonancia: la cirugía trata el nivel que explica tus síntomas, no cada hallazgo de la imagen." },
      { en: "The non-surgical options, and what is likely if you wait.", es: "Las opciones no quirúrgicas y lo que probablemente pase si esperas." },
      { en: "The specific operation, your chances of improvement, the recovery time and the risks.", es: "La operación concreta, tus probabilidades de mejorar, el tiempo de recuperación y los riesgos." }
    ],
    goodSigns: [
      { en: "Is comfortable advising you not to have surgery.", es: "Está cómodo aconsejándote no operarte." },
      { en: "Gives you numbers: the chance of improvement and the chance of complications.", es: "Te da números: la probabilidad de mejorar y la de complicaciones." },
      { en: "Is happy for you to get a second opinion.", es: "Le parece bien que pidas una segunda opinión." }
    ],
    warningSigns: [
      { en: "Surgery offered when your scan shows changes but your symptoms and exam don't match them.", es: "Te ofrecen cirugía cuando la resonancia muestra cambios pero tus síntomas y la exploración no coinciden con ellos." },
      { en: "Pressure to decide quickly when there is no worsening weakness and no sign of cord compression.", es: "Presión para decidir rápido cuando no hay debilidad que empeore ni signos de compresión medular." }
    ],
    uses: ["surgery", "injection", "time"],
    questions: [
      { en: "What is likely to happen if I wait three months?", es: "¿Qué es probable que pase si espero tres meses?" },
      { en: "Which level would you operate on, and how sure are you that it's the cause?", es: "¿En qué nivel operarías y qué tan seguro estás de que es la causa?" },
      { en: "What are my chances of improvement in arm pain, neck pain and weakness, and of complications?", es: "¿Qué probabilidades tengo de mejorar el dolor de brazo, el de cuello y la debilidad, y de tener complicaciones?" },
      { en: "How long is the recovery, and when could I work again?", es: "¿Cuánto dura la recuperación y cuándo podría volver a trabajar?" }
    ],
    training: {
      en: "A medical degree plus a residency in neurosurgery or orthopaedics, often with further training in spine surgery.",
      es: "Título de médico más residentado en neurocirugía o traumatología, a menudo con formación adicional en cirugía de columna."
    },
    check: CMP_CHECK,
    sources: ["persson1997", "bono2011", "nakashima2015"]
  },
  {
    id: "massage",
    role: {
      en: "Treats muscles and soft tissue with massage, for comfort, relaxation and short-term relief of tension. Not a diagnosis, and not a treatment for the nerve itself.",
      es: "Trata músculos y tejidos blandos con masaje, para el confort, la relajación y el alivio a corto plazo de la tensión. No es un diagnóstico ni un tratamiento del nervio en sí."
    },
    firstVisit: [
      { en: "Questions about your health and warning signs before starting.", es: "Preguntas sobre tu salud y señales de alarma antes de empezar." },
      { en: "Checking how much pressure is comfortable, and adjusting.", es: "Comprobar cuánta presión te resulta cómoda y ajustarla." },
      { en: "No deep pressure on the front and sides of the neck.", es: "Nada de presión profunda en la parte delantera y los lados del cuello." }
    ],
    goodSigns: [
      { en: "Works alongside your exercise plan rather than replacing it.", es: "Acompaña tu plan de ejercicio en lugar de sustituirlo." },
      { en: "Tells you to see a clinician if numbness, weakness or pain is spreading.", es: "Te dice que veas a un profesional si el adormecimiento, la debilidad o el dolor se extienden." }
    ],
    warningSigns: [
      { en: "Claims to 'release' or 'put back' a trapped nerve.", es: "Afirma 'liberar' o 'recolocar' un nervio atrapado." },
      { en: "Gives you a diagnosis.", es: "Te da un diagnóstico." }
    ],
    uses: ["massage"],
    questions: [
      { en: "Have you worked with people who have a trapped nerve?", es: "¿Has trabajado con personas con un nervio atrapado?" },
      { en: "What should I tell you if my arm symptoms change during the session?", es: "¿Qué debo decirte si mis síntomas del brazo cambian durante la sesión?" }
    ],
    training: {
      en: "From short courses to diplomas. In many countries the job isn't regulated.",
      es: "Desde cursos cortos hasta diplomas. En muchos países el oficio no está regulado."
    },
    check: {
      en: "Ask about their training and whether they belong to a professional body; where there is a register, look them up.",
      es: "Pregunta por su formación y si pertenece a una asociación profesional; si existe un registro, búscalo."
    },
    sources: ["patel2012"]
  }
];

export function guideById(id: string): Guide | undefined {
  return GUIDES.find((g) => g.id === id);
}

/**
 * Every page under /who-to-see/<id>/: the professions, then the practices
 * (acupuncture, tai chi, the huesero...). One list so the static build, the
 * single-file router and the "other guides" links can't disagree.
 */
export const GUIDE_PAGES: readonly { id: string; name: L; kind: "clinician" | "practice" }[] = [
  ...CLINICIANS.map((c) => ({ id: c.id, name: c.name, kind: "clinician" as const })),
  ...PRACTICES.map((p) => ({ id: p.id, name: p.name, kind: "practice" as const }))
];

export function guidePage(id: string): (typeof GUIDE_PAGES)[number] | undefined {
  return GUIDE_PAGES.find((g) => g.id === id);
}
