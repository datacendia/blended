import type { L } from "../i18n";
import { MEDICAL_REVIEW_DAYS, TRIAL_DAYS, TRIAL_SESSIONS } from "../outcomes";
import type { SourceId } from "../sources";

/**
 * The usual order of care for neck pain with or without a trapped nerve,
 * drawn as a map every profession guide shares, with the reader's own
 * position on it.
 *
 * The rules are deliberately few. Warning signs jump straight to a doctor.
 * Most trapped nerves improve a lot in the first weeks, so that is the time
 * for first-line care. Past MEDICAL_REVIEW_DAYS (the same threshold the
 * tracker uses) without clear improvement, a medical review is due. A
 * surgeon comes in for severe pain that months of good care haven't eased,
 * which the reader says, rather than a week count RootAtlas would have to
 * invent.
 */
export type Stage = "warning" | "first" | "review" | "surgery";

export const REVIEW_WEEKS = MEDICAL_REVIEW_DAYS / 7;
/** The tracker's trial checkpoint, in weeks: the same TRIAL_DAYS it uses. */
export const TRIAL_WEEKS = TRIAL_DAYS / 7;
/** The timeline's span. Past this, everything is "months". */
export const TIMELINE_WEEKS = 26;

export const PATHWAY_STAGES: readonly { id: Stage; title: L; when: L; who: readonly string[]; now: L; happens: readonly L[] }[] = [
  {
    id: "warning",
    title: { en: "Warning signs", es: "Señales de alarma" },
    when: { en: "At any point", es: "En cualquier momento" },
    who: ["gp"],
    now: {
      en: "Stop here and get medical help now: see the warning-signs page for how fast. Hands-on treatment waits until a doctor has checked you.",
      es: "Detente aquí y busca ayuda médica ya: mira la página de señales de alarma para saber con qué rapidez. El tratamiento manual espera hasta que te revise un médico."
    },
    happens: [
      { en: "A doctor checks you the same day or sooner, depending on the sign.", es: "Un médico te revisa el mismo día o antes, según la señal." },
      { en: "Hands-on treatment of the neck waits until then.", es: "El tratamiento manual del cuello espera hasta entonces." }
    ]
  },
  {
    id: "first",
    title: { en: "First weeks", es: "Primeras semanas" },
    when: { en: "From the start", es: "Desde el principio" },
    who: ["gp", "physio", "chiropractor", "osteopath", "massage"],
    now: {
      en: "First-line care: advice to keep moving, exercise, and hands-on treatment if you want it. Most trapped nerves improve a lot in this window, whatever the treatment.",
      es: "Atención de primera línea: consejo para seguir moviéndote, ejercicio y tratamiento manual si lo quieres. La mayoría de los nervios atrapados mejoran mucho en este periodo, sea cual sea el tratamiento."
    },
    happens: [
      { en: "A history and an examination, including strength, reflexes and feeling in the arm.", es: "Una historia clínica y una exploración, incluidas la fuerza, los reflejos y la sensibilidad del brazo." },
      { en: "Advice to stay active, and exercise.", es: "Consejo para mantenerte activo, y ejercicio." },
      { en: "Hands-on treatment if you want it.", es: "Tratamiento manual si lo quieres." },
      {
        en: "Scoring pain and function each week, so a checkpoint can say whether it is working.",
        es: "Puntuar el dolor y la función cada semana, para que un control pueda decir si funciona."
      }
    ]
  },
  {
    id: "review",
    title: { en: "Medical review", es: "Revisión médica" },
    when: { en: "Around 6 weeks, if not clearly better", es: "Hacia las 6 semanas, si no hay una mejoría clara" },
    who: ["physiatrist", "neurologist"],
    now: {
      en: "Six weeks without clear improvement is the usual point for a doctor to re-examine you, confirm which nerve is involved and decide whether a scan or nerve test would change anything.",
      es: "Seis semanas sin una mejoría clara es el momento habitual para que un médico te vuelva a explorar, confirme qué nervio está afectado y decida si una resonancia o una prueba nerviosa cambiaría algo."
    },
    happens: [
      { en: "A doctor re-examines you and confirms which nerve is involved.", es: "Un médico vuelve a explorarte y confirma qué nervio está afectado." },
      { en: "Other causes are ruled out, such as a nerve squeezed at the wrist or elbow.", es: "Se descartan otras causas, como un nervio comprimido en la muñeca o el codo." },
      { en: "An MRI or nerve tests, only if the result would change the plan.", es: "Una resonancia o pruebas nerviosas, solo si el resultado cambiaría el plan." }
    ]
  },
  {
    id: "surgery",
    title: { en: "Surgical opinion", es: "Opinión quirúrgica" },
    when: { en: "Months of severe pain despite good care", es: "Meses de dolor intenso pese a una buena atención" },
    who: ["surgeon"],
    now: {
      en: "A surgeon's opinion is reasonable: ask what happens if you wait as well as what surgery would do. In one trial, pain at a year was similar after surgery, physiotherapy or a collar.",
      es: "Es razonable pedir la opinión de un cirujano: pregunta qué pasa si esperas además de qué haría la cirugía. En un ensayo, el dolor al año fue similar tras cirugía, fisioterapia o collarín."
    },
    happens: [
      { en: "A surgeon looks at the examination and the scan together.", es: "Un cirujano valora la exploración y la resonancia juntas." },
      { en: "Ask what is likely if you wait, as well as what the operation would do.", es: "Pregunta qué es probable si esperas, además de qué haría la operación." },
      { en: "Ask about recovery and risks for your level.", es: "Pregunta por la recuperación y los riesgos para tu nivel." }
    ]
  }
];

export const PATHWAY_SOURCES: readonly SourceId[] = ["wong2014", "blanpied2017", "bono2011", "persson1997"];

/** Points on the timeline, all from named thresholds. The surgical opinion has no week: it depends on the person, not the calendar. */
export const MILESTONES: readonly { id: "start" | "trial" | "review" | "months"; week: number; label: L }[] = [
  { id: "start", week: 0, label: { en: "Start: first-line care", es: "Inicio: atención de primera línea" } },
  {
    id: "trial",
    week: TRIAL_WEEKS,
    label: {
      en: `Trial checkpoint (${TRIAL_SESSIONS} sessions or ${TRIAL_DAYS} days): is it making a real difference?`,
      es: `Control de prueba (${TRIAL_SESSIONS} sesiones o ${TRIAL_DAYS} días): ¿está marcando una diferencia real?`
    }
  },
  { id: "review", week: REVIEW_WEEKS, label: { en: "Medical review, if not clearly better", es: "Revisión médica, si no hay mejoría clara" } },
  {
    id: "months",
    week: 12,
    label: { en: "Months on, with severe pain despite care: a surgical opinion", es: "Meses después, con dolor intenso pese a la atención: una opinión quirúrgica" }
  }
];

export const PATHWAY_COPY = {
  weeks: { en: "Weeks since symptoms started: {n}", es: "Semanas desde que empezaron los síntomas: {n}" },
  better: { en: "Clearly better than at the start", es: "Claramente mejor que al principio" },
  warning: {
    en: "Any warning sign, including weakness that's getting worse or clumsy hands",
    es: "Alguna señal de alarma, incluida debilidad que empeora o manos torpes"
  },
  severe: {
    en: "Severe arm pain that months of good care haven't eased",
    es: "Dolor de brazo intenso que meses de buena atención no han aliviado"
  },
  youAreHere: { en: "This guide", es: "Esta guía" },
  likelyNow: { en: "Likely step now", es: "Paso probable ahora" },
  seeWarnings: { en: "Open the warning signs", es: "Abrir las señales de alarma" },
  figure: { en: "Map of the usual order of care", es: "Mapa del orden habitual de atención" },
  timeline: { en: "The first six months", es: "Los primeros seis meses" },
  timelineFigure: { en: "Timeline of the first 26 weeks with the checkpoints", es: "Línea de tiempo de las primeras 26 semanas con los controles" },
  weekShort: { en: "wk", es: "sem" },
  anyTime: { en: "Warning signs: at any time", es: "Señales de alarma: en cualquier momento" },
  you: { en: "You", es: "Tú" },
  happens: { en: "What happens at this step", es: "Qué pasa en este paso" },
  naturalCourse: {
    en: "Most trapped nerves in the neck improve a lot over weeks to months, whatever the treatment, so the early weeks are for good first-line care and keeping score.",
    es: "La mayoría de los nervios atrapados en el cuello mejoran mucho en semanas o meses, sea cual sea el tratamiento, así que las primeras semanas son para una buena atención de primera línea y llevar la cuenta."
  },
  openTracker: { en: "Keep score in the tracker", es: "Lleva la cuenta en el seguimiento" }
} as const;

export interface PathwayInput {
  weeks: number;
  better: boolean;
  warning: boolean;
  severeAfterCare: boolean;
}

/** The step the reader is most likely at. Warning signs win over everything. */
export function likelyStage({ weeks, better, warning, severeAfterCare }: PathwayInput): Stage {
  if (warning) return "warning";
  if (severeAfterCare) return "surgery";
  if (weeks >= REVIEW_WEEKS && !better) return "review";
  return "first";
}
