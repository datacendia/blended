import type { L } from "../i18n";
import { MEDICAL_REVIEW_DAYS } from "../outcomes";
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

export const PATHWAY_STAGES: readonly { id: Stage; title: L; when: L; who: readonly string[]; now: L }[] = [
  {
    id: "warning",
    title: { en: "Warning signs", es: "Señales de alarma" },
    when: { en: "At any point", es: "En cualquier momento" },
    who: ["gp"],
    now: {
      en: "Stop here and get medical help now: see the warning-signs page for how fast. Hands-on treatment waits until a doctor has checked you.",
      es: "Detente aquí y busca ayuda médica ya: mira la página de señales de alarma para saber con qué rapidez. El tratamiento manual espera hasta que te revise un médico."
    }
  },
  {
    id: "first",
    title: { en: "First weeks", es: "Primeras semanas" },
    when: { en: "From the start", es: "Desde el principio" },
    who: ["gp", "physio", "chiropractor", "osteopath", "massage"],
    now: {
      en: "First-line care: advice to keep moving, exercise, and hands-on treatment if you want it. Most trapped nerves improve a lot in this window, whatever the treatment.",
      es: "Atención de primera línea: consejo para seguir moviéndote, ejercicio y tratamiento manual si lo quieres. La mayoría de los nervios atrapados mejoran mucho en este periodo, sea cual sea el tratamiento."
    }
  },
  {
    id: "review",
    title: { en: "Medical review", es: "Revisión médica" },
    when: { en: "Around 6 weeks, if not clearly better", es: "Hacia las 6 semanas, si no hay una mejoría clara" },
    who: ["physiatrist", "neurologist"],
    now: {
      en: "Six weeks without clear improvement is the usual point for a doctor to re-examine you, confirm which nerve is involved and decide whether a scan or nerve test would change anything.",
      es: "Seis semanas sin una mejoría clara es el momento habitual para que un médico te vuelva a explorar, confirme qué nervio está afectado y decida si una resonancia o una prueba nerviosa cambiaría algo."
    }
  },
  {
    id: "surgery",
    title: { en: "Surgical opinion", es: "Opinión quirúrgica" },
    when: { en: "Months of severe pain despite good care", es: "Meses de dolor intenso pese a una buena atención" },
    who: ["surgeon"],
    now: {
      en: "A surgeon's opinion is reasonable: ask what happens if you wait as well as what surgery would do. In one trial, pain at a year was similar after surgery, physiotherapy or a collar.",
      es: "Es razonable pedir la opinión de un cirujano: pregunta qué pasa si esperas además de qué haría la cirugía. En un ensayo, el dolor al año fue similar tras cirugía, fisioterapia o collarín."
    }
  }
];

export const PATHWAY_SOURCES: readonly SourceId[] = ["wong2014", "blanpied2017", "bono2011", "persson1997"];

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
  figure: { en: "Map of the usual order of care", es: "Mapa del orden habitual de atención" }
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
