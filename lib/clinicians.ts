import type { L } from "./i18n";

/**
 * Who does what. The point is not to rank professions but to make the
 * differences visible: who can diagnose, who can prescribe or order a scan,
 * and what each is a sensible first stop for. Titles differ by country; the
 * Spanish uses the names used in Peru (e.g. "tecnólogo médico en terapia
 * física" for a physiotherapist).
 */
export interface Clinician {
  id: string;
  name: L;
  what: L;
  canPrescribe: boolean;
  canOrderImaging: L;
  goodFor: L;
  watchFor: L;
}

export const CLINICIANS: readonly Clinician[] = [
  {
    id: "gp",
    name: { en: "GP / family doctor", es: "Médico general / de familia" },
    what: {
      en: "Medical doctor. Diagnoses, rules out serious causes, prescribes and refers.",
      es: "Médico. Diagnostica, descarta causas graves, receta y deriva."
    },
    canPrescribe: true,
    canOrderImaging: { en: "Yes", es: "Sí" },
    goodFor: {
      en: "A first assessment when anything on the warning-signs list applies, when you have other health conditions, or when you need pain medication.",
      es: "Una primera valoración si aplica algo de la lista de señales de alarma, si tienes otras enfermedades o si necesitas medicación para el dolor."
    },
    watchFor: {
      en: "Short appointments; ask for a proper neurological exam if you have arm or leg symptoms.",
      es: "Citas cortas; pide una exploración neurológica completa si tienes síntomas en brazo o pierna."
    }
  },
  {
    id: "physiatrist",
    name: { en: "Physiatrist (rehabilitation physician)", es: "Médico fisiatra (medicina física y rehabilitación)" },
    what: {
      en: "Medical doctor specialised in function and non-surgical spine care. Can diagnose, order nerve tests and scans, prescribe and do injections in some settings.",
      es: "Médico especializado en función y tratamiento no quirúrgico de la columna. Puede diagnosticar, pedir pruebas nerviosas y resonancias, recetar y en algunos centros hacer infiltraciones."
    },
    canPrescribe: true,
    canOrderImaging: { en: "Yes, including nerve conduction / EMG", es: "Sí, incluida electromiografía" },
    goodFor: {
      en: "A trapped nerve that is not settling, or when you want a medical diagnosis before or alongside manual therapy.",
      es: "Un nervio atrapado que no mejora, o cuando quieres un diagnóstico médico antes o junto a la terapia manual."
    },
    watchFor: { en: "Availability varies by country and insurer.", es: "La disponibilidad varía según el país y el seguro." }
  },
  {
    id: "physio",
    name: { en: "Physiotherapist", es: "Fisioterapeuta (tecnólogo médico en terapia física)" },
    what: {
      en: "Assesses movement and nerve function; treats with exercise, education, manual therapy, traction and nerve-gliding techniques.",
      es: "Evalúa el movimiento y la función nerviosa; trata con ejercicio, educación, terapia manual, tracción y técnicas de deslizamiento neural."
    },
    canPrescribe: false,
    canOrderImaging: { en: "Varies by country", es: "Depende del país" },
    goodFor: {
      en: "Most neck and back pain, with or without arm or leg symptoms — exercise-based care has the most consistent evidence.",
      es: "La mayoría de dolores de cuello y espalda, con o sin síntomas en brazo o pierna: el tratamiento basado en ejercicio tiene la evidencia más consistente."
    },
    watchFor: {
      en: "Sessions that are only machines (ultrasound, TENS, heat) with no exercise plan.",
      es: "Sesiones que son solo aparatos (ultrasonido, TENS, calor) sin un plan de ejercicios."
    }
  },
  {
    id: "chiropractor",
    name: { en: "Chiropractor", es: "Quiropráctico" },
    what: {
      en: "Focuses on the spine; treats mainly with manipulation ('adjustments'), mobilisation and, in many practices, exercise and advice.",
      es: "Se centra en la columna; trata principalmente con manipulación ('ajustes'), movilización y, en muchas consultas, ejercicio y consejos."
    },
    canPrescribe: false,
    canOrderImaging: { en: "Often X-rays; varies by country", es: "A menudo radiografías; depende del país" },
    goodFor: {
      en: "Neck or back pain without warning signs, as part of a plan that includes exercise and has a clear review point.",
      es: "Dolor de cuello o espalda sin señales de alarma, dentro de un plan que incluya ejercicio y tenga un punto de revisión claro."
    },
    watchFor: {
      en: "Large prepaid packages before any trial of care; routine repeat X-rays; claims that adjustments treat organs or immunity; 'maintenance' care for life. Regulation varies widely by country — ask where they trained.",
      es: "Paquetes grandes prepagados antes de una prueba de tratamiento; radiografías repetidas de rutina; afirmaciones de que los ajustes tratan órganos o la inmunidad; 'mantenimiento' de por vida. La regulación varía mucho según el país: pregunta dónde se formó."
    }
  },
  {
    id: "osteopath",
    name: { en: "Osteopath", es: "Osteópata" },
    what: {
      en: "Manual therapy (mobilisation, manipulation, soft tissue) plus exercise and advice. In the US, 'DO' osteopathic physicians are fully licensed doctors — a different role.",
      es: "Terapia manual (movilización, manipulación, tejidos blandos) más ejercicio y consejos. En EE. UU., los médicos osteópatas (DO) son médicos con licencia completa: un papel distinto."
    },
    canPrescribe: false,
    canOrderImaging: { en: "Varies by country", es: "Depende del país" },
    goodFor: {
      en: "Similar to a chiropractor or manual-therapy physiotherapist for pain without warning signs.",
      es: "Similar a un quiropráctico o fisioterapeuta de terapia manual para dolor sin señales de alarma."
    },
    watchFor: {
      en: "Cranial or visceral techniques claimed to treat non-musculoskeletal conditions lack good evidence.",
      es: "Las técnicas craneales o viscerales que dicen tratar problemas no musculoesqueléticos carecen de buena evidencia."
    }
  },
  {
    id: "neurologist",
    name: { en: "Neurologist", es: "Neurólogo" },
    what: {
      en: "Medical doctor specialised in the nervous system. Confirms where a nerve problem is and rules out mimics (e.g. carpal tunnel, nerve disease).",
      es: "Médico especializado en el sistema nervioso. Confirma dónde está el problema nervioso y descarta imitadores (p. ej., túnel carpiano, neuropatías)."
    },
    canPrescribe: true,
    canOrderImaging: { en: "Yes, including EMG", es: "Sí, incluida electromiografía" },
    goodFor: {
      en: "Weakness, unusual numbness patterns, both-sided symptoms, or when the diagnosis is uncertain.",
      es: "Debilidad, patrones raros de adormecimiento, síntomas en ambos lados, o cuando el diagnóstico no está claro."
    },
    watchFor: { en: "Usually needs a referral in insured systems.", es: "Suele requerir derivación en sistemas con seguro." }
  },
  {
    id: "surgeon",
    name: { en: "Spine surgeon (neurosurgeon or orthopaedic)", es: "Cirujano de columna (neurocirujano o traumatólogo)" },
    what: {
      en: "Decides whether surgery would help, and does it.",
      es: "Decide si la cirugía ayudaría y la realiza."
    },
    canPrescribe: true,
    canOrderImaging: { en: "Yes", es: "Sí" },
    goodFor: {
      en: "Progressive weakness, spinal cord compression, or severe nerve pain that hasn't improved after months of good non-surgical care.",
      es: "Debilidad progresiva, compresión de la médula, o dolor nervioso intenso que no ha mejorado tras meses de buen tratamiento no quirúrgico."
    },
    watchFor: { en: "Ask what happens if you wait, as well as what happens if you operate.", es: "Pregunta qué pasa si esperas, además de qué pasa si te operas." }
  },
  {
    id: "massage",
    name: { en: "Massage therapist", es: "Masoterapeuta" },
    what: { en: "Soft-tissue treatment for comfort and muscle tension.", es: "Tratamiento de tejidos blandos para el confort y la tensión muscular." },
    canPrescribe: false,
    canOrderImaging: { en: "No", es: "No" },
    goodFor: { en: "Short-term relief alongside an active plan.", es: "Alivio a corto plazo junto a un plan activo." },
    watchFor: { en: "Not a diagnosis; won't free a trapped nerve on its own.", es: "No es un diagnóstico; por sí solo no libera un nervio atrapado." }
  }
];

/** The questions worth asking any clinician on the first visit. */
export const UNIVERSAL_QUESTIONS: readonly L[] = [
  { en: "What do you think is causing my symptoms, and how sure are you?", es: "¿Qué crees que causa mis síntomas y qué tan seguro estás?" },
  { en: "Which nerve root do you think is involved, and what in your exam showed that?", es: "¿Qué raíz nerviosa crees que está implicada y qué lo mostró en tu exploración?" },
  { en: "What will we measure to know this is working, and by when?", es: "¿Qué mediremos para saber que esto funciona, y para cuándo?" },
  { en: "What will we do if I'm not meaningfully better by then?", es: "¿Qué haremos si para entonces no he mejorado de forma significativa?" },
  { en: "What are the risks of this treatment for me, specifically?", es: "¿Cuáles son los riesgos de este tratamiento para mí, en concreto?" },
  { en: "What can I do myself between sessions?", es: "¿Qué puedo hacer yo entre sesiones?" },
  { en: "Why this number of sessions? Can I pay per session, and what happens to unused sessions?", es: "¿Por qué este número de sesiones? ¿Puedo pagar por sesión y qué pasa con las sesiones no usadas?" },
  { en: "Do I need a scan? Why, or why not?", es: "¿Necesito una resonancia? ¿Por qué sí o por qué no?" }
];
