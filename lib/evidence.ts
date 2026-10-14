import type { L } from "./i18n";
import type { SourceId } from "./sources";

/**
 * What the research says about common treatments for neck pain and a trapped
 * nerve in the neck, graded in plain words.
 *
 * Verdicts are deliberately coarse. "May help" covers most of manual therapy
 * because that is what the evidence supports: small, mostly short-term effects
 * at low-to-moderate certainty. Each entry names its sources; a test rejects
 * an entry without one. These summaries need review by a licensed clinician
 * before public launch — the About page says so.
 */
export type Verdict = "supported" | "may-help" | "unclear" | "not-supported";

export const VERDICT_LABEL: Record<Verdict, L> = {
  supported: { en: "Supported", es: "Respaldado" },
  "may-help": { en: "May help", es: "Puede ayudar" },
  unclear: { en: "Unclear", es: "Incierto" },
  "not-supported": { en: "Not supported", es: "Sin respaldo" }
};

export interface Treatment {
  id: string;
  name: L;
  verdict: Verdict;
  summary: L;
  harms: L;
  sources: SourceId[];
}

export const TREATMENTS: readonly Treatment[] = [
  {
    id: "time",
    name: { en: "Time (the natural course)", es: "El tiempo (evolución natural)" },
    verdict: "supported",
    summary: {
      en: "Most trapped nerves in the neck improve substantially over weeks to months, whatever the treatment. That is good news — and the reason improvement during care is not, on its own, proof the care caused it.",
      es: "La mayoría de los nervios atrapados en el cuello mejoran de forma importante en semanas o meses, sea cual sea el tratamiento. Es una buena noticia, y la razón por la que mejorar durante un tratamiento no demuestra, por sí solo, que el tratamiento lo causó."
    },
    harms: { en: "None, unless warning signs are ignored while waiting.", es: "Ninguno, salvo que se ignoren señales de alarma mientras se espera." },
    sources: ["wong2014", "radhakrishnan1994"]
  },
  {
    id: "education",
    name: { en: "Advice to stay active and understand the problem", es: "Consejo para mantenerse activo y entender el problema" },
    verdict: "supported",
    summary: {
      en: "Recommended in guidelines as part of every plan. Understanding that nerve pain usually settles reduces fear and helps people keep moving.",
      es: "Recomendado en las guías como parte de todo plan. Entender que el dolor nervioso suele mejorar reduce el miedo y ayuda a seguir moviéndose."
    },
    harms: { en: "None.", es: "Ninguno." },
    sources: ["blanpied2017"]
  },
  {
    id: "exercise",
    name: { en: "Exercise (neck, shoulder-blade and upper-back strengthening and mobility)", es: "Ejercicio (fortalecimiento y movilidad de cuello, escápula y espalda alta)" },
    verdict: "supported",
    summary: {
      en: "The most consistently supported active treatment for neck pain, with moderate-certainty evidence. Works best combined with manual therapy and education.",
      es: "El tratamiento activo con respaldo más consistente para el dolor de cuello, con evidencia de certeza moderada. Funciona mejor combinado con terapia manual y educación."
    },
    harms: { en: "Temporary soreness.", es: "Molestias pasajeras." },
    sources: ["gross2015ex", "blanpied2017"]
  },
  {
    id: "manipulation",
    name: { en: "Neck manipulation ('adjustments', high-velocity thrust)", es: "Manipulación cervical ('ajustes', impulso de alta velocidad)" },
    verdict: "may-help",
    summary: {
      en: "For neck pain, small and mostly short-term benefits at low-to-moderate certainty, similar to mobilisation and exercise. For a trapped nerve specifically, guidelines find insufficient evidence for or against it. Upper-back (thoracic) manipulation is an alternative some guidelines include for neck pain.",
      es: "Para el dolor de cuello, beneficios pequeños y sobre todo a corto plazo con certeza baja o moderada, similares a la movilización y el ejercicio. Para un nervio atrapado en concreto, las guías encuentran evidencia insuficiente a favor o en contra. La manipulación de la espalda alta (torácica) es una alternativa que algunas guías incluyen para el dolor de cuello."
    },
    harms: {
      en: "Common: soreness and headache for a day or two. Rare but serious: neck manipulation is associated with cervical artery dissection and stroke; whether it causes them is debated, because people with an early dissection often seek care for the neck pain it produces. Either way, you should be told and screened first.",
      es: "Frecuentes: molestias y dolor de cabeza durante uno o dos días. Raros pero graves: la manipulación cervical se asocia con disección de arteria cervical e ictus; si los causa está en debate, porque quien tiene una disección inicial suele buscar ayuda por el dolor de cuello que produce. En cualquier caso, deben informarte y evaluarte antes."
    },
    sources: ["gross2015manip", "bono2011", "blanpied2017", "biller2014", "cassidy2008"]
  },
  {
    id: "mobilisation",
    name: { en: "Mobilisation (gentle, non-thrust joint movement)", es: "Movilización (movimiento articular suave, sin impulso)" },
    verdict: "may-help",
    summary: {
      en: "Similar small, short-term effects to manipulation for neck pain, without the high-velocity thrust.",
      es: "Efectos pequeños y a corto plazo similares a la manipulación para el dolor de cuello, sin el impulso de alta velocidad."
    },
    harms: { en: "Mild, temporary soreness.", es: "Molestias leves y pasajeras." },
    sources: ["gross2015manip"]
  },
  {
    id: "neural",
    name: { en: "Nerve gliding (neural mobilisation)", es: "Deslizamiento neural (movilización neural)" },
    verdict: "may-help",
    summary: {
      en: "Gentle movements that slide the nerve through its path. Some evidence of reduced pain in neck-arm and back-leg conditions, at low certainty.",
      es: "Movimientos suaves que deslizan el nervio por su recorrido. Alguna evidencia de reducción del dolor en problemas de cuello-brazo y espalda-pierna, con certeza baja."
    },
    harms: { en: "Can flare symptoms if done too hard; should be guided at first.", es: "Puede aumentar los síntomas si se hace con demasiada intensidad; al principio conviene que lo guíen." },
    sources: ["basson2017"]
  },
  {
    id: "traction",
    name: { en: "Cervical traction", es: "Tracción cervical" },
    verdict: "may-help",
    summary: {
      en: "Mechanical intermittent traction is recommended in a physiotherapy guideline for longer-lasting neck pain with arm pain, combined with exercise and manual therapy. On its own the evidence is insufficient.",
      es: "Una guía de fisioterapia recomienda la tracción mecánica intermitente para el dolor de cuello con dolor de brazo de más duración, combinada con ejercicio y terapia manual. Por sí sola, la evidencia es insuficiente."
    },
    harms: { en: "Usually minor; stop if arm symptoms worsen.", es: "Generalmente leves; detenla si empeoran los síntomas del brazo." },
    sources: ["blanpied2017", "bono2011"]
  },
  {
    id: "collar",
    name: { en: "Soft collar, short term", es: "Collarín blando, a corto plazo" },
    verdict: "may-help",
    summary: {
      en: "In recent-onset nerve pain, a few weeks of a semi-hard collar (or physiotherapy) reduced arm pain faster than waiting in the first six weeks. Long-term immobilisation is not recommended.",
      es: "En el dolor nervioso de inicio reciente, unas semanas de collarín semirrígido (o fisioterapia) redujeron el dolor de brazo más rápido que esperar durante las primeras seis semanas. No se recomienda inmovilizar a largo plazo."
    },
    harms: { en: "Stiffness and weakness if worn for long.", es: "Rigidez y debilidad si se usa mucho tiempo." },
    sources: ["kuijper2009"]
  },
  {
    id: "surgery",
    name: { en: "Surgery", es: "Cirugía" },
    verdict: "may-help",
    summary: {
      en: "For progressive weakness, spinal cord compression, or severe pain that persists despite good non-surgical care, surgery relieves symptoms faster. In one trial, pain at one year was similar after surgery, physiotherapy or a collar.",
      es: "Ante debilidad progresiva, compresión de la médula o dolor intenso que persiste pese a un buen tratamiento no quirúrgico, la cirugía alivia los síntomas más rápido. En un ensayo, el dolor al año fue similar tras cirugía, fisioterapia o collarín."
    },
    harms: { en: "Surgical risks; ask your surgeon for yours.", es: "Riesgos quirúrgicos; pregunta al cirujano por los tuyos." },
    sources: ["persson1997", "bono2011"]
  },
  {
    id: "injection",
    name: { en: "Epidural steroid injection", es: "Infiltración epidural de corticoides" },
    verdict: "unclear",
    summary: {
      en: "Can give short-term relief to some people with nerve-root pain; evidence for lasting benefit is limited. A doctor's decision.",
      es: "Puede aliviar a corto plazo a algunas personas con dolor de raíz nerviosa; la evidencia de beneficio duradero es limitada. Es una decisión médica."
    },
    harms: {
      en: "Rare but serious neurological complications have been reported, which led to a regulatory warning.",
      es: "Se han descrito complicaciones neurológicas raras pero graves, que motivaron una advertencia regulatoria."
    },
    sources: ["fda2014"]
  },
  {
    id: "posture",
    name: { en: "Correcting posture measured from photos", es: "Corregir la postura medida con fotos" },
    verdict: "unclear",
    summary: {
      en: "Forward head posture is associated with neck pain in adults, but association is not cause, and changing a posture number has not been shown to fix a trapped nerve. The famous 'your head weighs 27 kg' figures come from a computer model, not measurements.",
      es: "La cabeza adelantada se asocia con dolor de cuello en adultos, pero asociación no es causa, y no se ha demostrado que cambiar un número de postura cure un nervio atrapado. Las famosas cifras de 'tu cabeza pesa 27 kg' vienen de un modelo por ordenador, no de mediciones."
    },
    harms: { en: "Cost and time, if it replaces treatments that work.", es: "Coste y tiempo, si sustituye a tratamientos que funcionan." },
    sources: ["mahmoud2019", "hansraj2014"]
  },
  {
    id: "routine-xray",
    name: { en: "Routine X-rays to track the spine", es: "Radiografías de rutina para seguir la columna" },
    verdict: "not-supported",
    summary: {
      en: "Imaging is for suspected serious problems or persistent nerve deficits, not for tracking alignment. Even the American Chiropractic Association advises against early imaging for back pain without warning signs.",
      es: "Las imágenes son para sospecha de problemas graves o déficits nerviosos persistentes, no para seguir la alineación. Incluso la Asociación Americana de Quiropráctica desaconseja las imágenes tempranas para el dolor de espalda sin señales de alarma."
    },
    harms: { en: "Radiation and cost, and findings that worry without changing care.", es: "Radiación y coste, y hallazgos que preocupan sin cambiar el tratamiento." },
    sources: ["aca-choosingwisely"]
  },
  {
    id: "non-msk",
    name: { en: "Adjustments for organs, immunity, blood pressure or 'wellness'", es: "Ajustes para órganos, inmunidad, presión arterial o 'bienestar'" },
    verdict: "not-supported",
    summary: {
      en: "The nerves from the spine to the organs are real anatomy — but a systematic review led by chiropractic researchers found no evidence that spinal manipulation prevents or treats non-musculoskeletal conditions.",
      es: "Los nervios de la columna a los órganos son anatomía real, pero una revisión sistemática dirigida por investigadores quiroprácticos no encontró evidencia de que la manipulación vertebral prevenga o trate problemas no musculoesqueléticos."
    },
    harms: { en: "Cost, and delay in getting the right care.", es: "Coste, y retraso en recibir la atención adecuada." },
    sources: ["cote2021"]
  }
];
