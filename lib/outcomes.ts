import type { L, Locale } from "./i18n";
import type { SourceId } from "./sources";
import { flagById, type FlagLevel } from "./redflags";

/**
 * "Is it working?" — the tracker's engine.
 *
 * Posture numbers don't tell you whether a trapped nerve is getting better;
 * how much it hurts and what you can do do. So the tracker measures the two
 * things clinical trials use — pain on a 0-10 scale and the Patient-Specific
 * Functional Scale — and judges change against published minimal clinically
 * important differences (MCID), not against hope.
 */
export type Condition = "neck-arm" | "neck" | "back-leg" | "back" | "other";
export type Currency = "PEN" | "USD" | "EUR" | "GBP";

export const CONDITIONS: readonly { id: Condition; label: L; limb: boolean }[] = [
  { id: "neck-arm", limb: true, label: { en: "Neck with arm pain, numbness or tingling", es: "Cuello con dolor, adormecimiento u hormigueo en el brazo" } },
  { id: "neck", limb: false, label: { en: "Neck pain only", es: "Solo dolor de cuello" } },
  { id: "back-leg", limb: true, label: { en: "Low back with leg pain (sciatica)", es: "Zona lumbar con dolor en la pierna (ciática)" } },
  { id: "back", limb: false, label: { en: "Low back pain only", es: "Solo dolor lumbar" } },
  { id: "other", limb: false, label: { en: "Something else", es: "Otra cosa" } }
];

export interface Mcid {
  pain: number;
  function: number;
  sources: SourceId[];
}

/**
 * Neck-arm uses the values measured in people with cervical radiculopathy
 * (Young 2010). Everything else uses the general 2-point thresholds; they are
 * deliberately not lowered to make progress look easier to reach.
 */
export function mcidFor(condition: Condition): Mcid {
  if (condition === "neck-arm") return { pain: 2.2, function: 2.0, sources: ["young2010"] };
  return { pain: 2.0, function: 2.0, sources: ["farrar2001", "stratford1995"] };
}

export interface Plan {
  condition: Condition;
  clinician: string;
  sessionsPurchased: number | null;
  totalPrice: number | null;
  currency: Currency;
  startDate: string;
  symptomsSince: string | null;
}

export interface CheckIn {
  id: string;
  date: string;
  sessionsUsed: number;
  /** 0-10. Arm or leg pain — the main outcome when a nerve root is involved. */
  limbPain: number | null;
  /** 0-10. Neck or back pain. */
  axialPain: number | null;
  /** 0-10 per activity, 10 = able to do it as before. Up to three. */
  activities: (number | null)[];
  numbness: "none" | "sometimes" | "constant";
  flags: string[];
  note?: string;
}

export interface TrackerState {
  version: 1;
  plan: Plan;
  activityNames: string[];
  checkIns: CheckIn[];
}

export const EMPTY_STATE: TrackerState = {
  version: 1,
  plan: {
    condition: "neck-arm",
    clinician: "chiropractor",
    sessionsPurchased: null,
    totalPrice: null,
    currency: "PEN",
    startDate: "",
    symptomsSince: null
  },
  activityNames: ["", "", ""],
  checkIns: []
};

/**
 * The case this project started from: neck-arm nerve pain, 18 chiropractic
 * adjustments bought upfront for S/ 1,550. The check-in numbers are
 * illustrative, not anyone's real scores — the example exists to show what the
 * checkpoints say after six sessions with little change.
 */
export function exampleState(locale: Locale): TrackerState {
  return {
  version: 1,
  plan: {
    condition: "neck-arm",
    clinician: "chiropractor",
    sessionsPurchased: 18,
    totalPrice: 1550,
    currency: "PEN",
    startDate: "2026-09-16",
    symptomsSince: "2026-07-20"
  },
  activityNames:
    locale === "es"
      ? ["Dormir toda la noche", "Trabajar una hora en la laptop", "Cargar las compras"]
      : ["Sleeping through the night", "Working at the laptop for an hour", "Carrying shopping"],
  checkIns: [
    { id: "ex1", date: "2026-09-16", sessionsUsed: 0, limbPain: 7, axialPain: 6, activities: [3, 4, 5], numbness: "constant", flags: [] },
    { id: "ex2", date: "2026-09-23", sessionsUsed: 3, limbPain: 6, axialPain: 4, activities: [4, 4, 5], numbness: "constant", flags: [] },
    { id: "ex3", date: "2026-10-07", sessionsUsed: 6, limbPain: 6, axialPain: 4, activities: [4, 5, 5], numbness: "sometimes", flags: [] }
  ]
  };
}

export function sortedCheckIns(state: TrackerState): CheckIn[] {
  return [...state.checkIns].sort((a, b) => a.date.localeCompare(b.date) || a.sessionsUsed - b.sessionsUsed);
}

function average(values: (number | null)[]): number | null {
  const real = values.filter((v): v is number => typeof v === "number");
  return real.length ? real.reduce((s, v) => s + v, 0) / real.length : null;
}

export type Verdict = "need-data" | "worse" | "meaningful" | "some" | "no-change";

export interface Progress {
  verdict: Verdict;
  /** The pain measure that matters for this condition. */
  painLabel: "limb" | "axial";
  painBefore: number | null;
  painNow: number | null;
  /** Positive = better. */
  painChange: number | null;
  painChangePct: number | null;
  functionBefore: number | null;
  functionNow: number | null;
  /** Positive = better. */
  functionChange: number | null;
  mcid: Mcid;
  sessionsUsed: number;
  days: number;
}

export function progress(state: TrackerState): Progress {
  const mcid = mcidFor(state.plan.condition);
  const limb = CONDITIONS.find((c) => c.id === state.plan.condition)?.limb ?? false;
  const list = sortedCheckIns(state);
  const first = list[0];
  const last = list[list.length - 1];

  // For a trapped nerve, arm (or leg) pain is the outcome that tracks the
  // nerve; neck pain often settles first and flatters the result.
  const painLabel: Progress["painLabel"] = limb && first?.limbPain != null ? "limb" : "axial";
  const pick = (c: CheckIn | undefined) => (c ? (painLabel === "limb" ? c.limbPain : c.axialPain) : null);

  const painBefore = pick(first);
  const painNow = pick(last);
  const functionBefore = first ? average(first.activities) : null;
  const functionNow = last ? average(last.activities) : null;
  const painChange = painBefore !== null && painNow !== null ? round1(painBefore - painNow) : null;
  const functionChange = functionBefore !== null && functionNow !== null ? round1(functionNow - functionBefore) : null;
  const painChangePct = painChange !== null && painBefore ? Math.round((painChange / painBefore) * 100) : null;

  const sessionsUsed = last?.sessionsUsed ?? 0;
  const days = first && last ? daysBetween(first.date, last.date) : 0;

  let verdict: Verdict = "need-data";
  if (list.length >= 2 && (painChange !== null || functionChange !== null)) {
    const worse = (painChange ?? 0) <= -mcid.pain || (functionChange ?? 0) <= -mcid.function;
    const meaningful = (painChange ?? 0) >= mcid.pain || (functionChange ?? 0) >= mcid.function;
    const some = (painChange ?? 0) > 0 || (functionChange ?? 0) > 0;
    verdict = worse ? "worse" : meaningful ? "meaningful" : some ? "some" : "no-change";
  }

  return {
    verdict, painLabel, painBefore, painNow, painChange, painChangePct,
    functionBefore: functionBefore === null ? null : round1(functionBefore),
    functionNow: functionNow === null ? null : round1(functionNow),
    functionChange, mcid, sessionsUsed, days
  };
}

export interface Value {
  costPerSession: number | null;
  spent: number | null;
  remaining: number | null;
  sessionsLeft: number | null;
  /** Money spent per point of pain improvement; null when there is none to divide by. */
  costPerPainPoint: number | null;
}

export function value(state: TrackerState, p: Progress = progress(state)): Value {
  const { sessionsPurchased, totalPrice } = state.plan;
  if (!sessionsPurchased || !totalPrice) {
    return { costPerSession: null, spent: null, remaining: null, sessionsLeft: null, costPerPainPoint: null };
  }
  const costPerSession = round2(totalPrice / sessionsPurchased);
  const used = Math.min(p.sessionsUsed, sessionsPurchased);
  // From the total, not the rounded per-session price, so 18 of 18 sessions
  // costs exactly what was paid.
  const spent = round2((totalPrice * used) / sessionsPurchased);
  return {
    costPerSession,
    spent,
    remaining: round2(totalPrice - spent),
    sessionsLeft: sessionsPurchased - used,
    costPerPainPoint: p.painChange && p.painChange > 0 ? round2(spent / p.painChange) : null
  };
}

export type CheckpointLevel = "emergency" | "urgent" | "act" | "info" | "good";

export interface Checkpoint {
  id: string;
  level: CheckpointLevel;
  title: L;
  body: L;
}

/**
 * When to stop and ask. Six sessions or four weeks is the trial-of-care window
 * RootAtlas uses: many guidelines recommend reassessing after a short trial
 * (typically 2-4 weeks) and changing course if there is no meaningful change.
 * Both numbers are named here so the threshold is a decision, not an accident.
 */
export const TRIAL_SESSIONS = 6;
export const TRIAL_DAYS = 28;
/** Persistent nerve-root symptoms past ~6 weeks are a usual point for medical review. */
export const MEDICAL_REVIEW_DAYS = 42;

export function checkpoints(state: TrackerState, today: string): Checkpoint[] {
  const out: Checkpoint[] = [];
  const list = sortedCheckIns(state);
  const last = list[list.length - 1];
  const p = progress(state);
  const v = value(state, p);

  const levels = new Set<FlagLevel>((last?.flags ?? []).map((id) => flagById(id)?.level).filter((l): l is FlagLevel => Boolean(l)));
  if (levels.has("emergency")) {
    out.push({
      id: "flag-emergency",
      level: "emergency",
      title: { en: "Your last check-in includes an emergency warning sign", es: "Tu último registro incluye un signo de alarma de emergencia" },
      body: {
        en: "Do not wait for your next appointment. Call emergency services or go to an emergency department now. See the warning-signs page for what each sign means.",
        es: "No esperes a tu próxima cita. Llama a emergencias o acude a urgencias ahora. Consulta la página de señales de alarma para saber qué significa cada signo."
      }
    });
  } else if (levels.has("urgent")) {
    out.push({
      id: "flag-urgent",
      level: "urgent",
      title: { en: "Your last check-in includes a warning sign", es: "Tu último registro incluye un signo de alarma" },
      body: {
        en: "See a doctor promptly (within a day or two), and tell your clinician before any further manual treatment.",
        es: "Consulta a un médico pronto (en uno o dos días) y avisa a tu terapeuta antes de cualquier otro tratamiento manual."
      }
    });
  }

  if (p.verdict === "worse") {
    out.push({
      id: "worse",
      level: "act",
      title: { en: "You are meaningfully worse than when you started", es: "Estás significativamente peor que al empezar" },
      body: {
        en: "Tell your clinician before the next session and ask whether the plan should change. Getting worse during care is information, not something to push through.",
        es: "Díselo a tu terapeuta antes de la próxima sesión y pregunta si el plan debe cambiar. Empeorar durante el tratamiento es información, no algo que haya que aguantar."
      }
    });
  }

  const inTrialWindow = p.sessionsUsed >= TRIAL_SESSIONS || p.days >= TRIAL_DAYS;
  if (inTrialWindow && (p.verdict === "some" || p.verdict === "no-change")) {
    out.push({
      id: "trial",
      level: "act",
      title: {
        en: `Checkpoint: ${p.sessionsUsed} sessions, ${p.days} days, no meaningful change yet`,
        es: `Punto de control: ${p.sessionsUsed} sesiones, ${p.days} días, aún sin cambio significativo`
      },
      body: {
        en: `A meaningful change for this problem is about ${p.mcid.pain} points of pain or ${p.mcid.function} points of function. Ask your clinician: what is the working diagnosis, why isn't it changing, and what will we do differently? Asking for a second opinion (a physiotherapist, or a doctor such as a physiatrist or neurologist) is reasonable at this point.`,
        es: `Un cambio significativo para este problema es de unos ${p.mcid.pain} puntos de dolor o ${p.mcid.function} puntos de función. Pregunta a tu terapeuta: ¿cuál es el diagnóstico de trabajo, por qué no cambia y qué haremos diferente? Pedir una segunda opinión (un fisioterapeuta o un médico como un fisiatra o neurólogo) es razonable en este punto.`
      }
    });
  }

  if (p.verdict === "meaningful") {
    out.push({
      id: "meaningful",
      level: "good",
      title: { en: "You have reached a meaningful improvement", es: "Has alcanzado una mejoría significativa" },
      body: {
        en: "Ask for a self-management plan and a clear end point: what you can do yourself, what would bring you back, and whether you still need every remaining session. Most nerve-root problems keep improving with time.",
        es: "Pide un plan de autocuidado y un final claro: qué puedes hacer por tu cuenta, qué te haría volver y si todavía necesitas todas las sesiones restantes. La mayoría de los problemas de raíz nerviosa siguen mejorando con el tiempo."
      }
    });
  }

  const purchased = state.plan.sessionsPurchased;
  if (purchased && v.sessionsLeft !== null && inTrialWindow && p.verdict !== "meaningful" && v.sessionsLeft > purchased / 3) {
    out.push({
      id: "prepaid",
      level: "info",
      title: {
        en: `${v.sessionsLeft} of ${purchased} prepaid sessions left`,
        es: `Quedan ${v.sessionsLeft} de ${purchased} sesiones prepagadas`
      },
      body: {
        en: "Ask now, in writing, what happens to unused sessions if the plan changes — refund, credit or transfer to another treatment. It is a normal question, and easier to ask before they are used.",
        es: "Pregunta ahora, por escrito, qué pasa con las sesiones no usadas si cambia el plan: reembolso, crédito o cambio a otro tratamiento. Es una pregunta normal y es más fácil hacerla antes de usarlas."
      }
    });
  }

  const limb = CONDITIONS.find((c) => c.id === state.plan.condition)?.limb ?? false;
  if (limb && state.plan.symptomsSince && p.verdict !== "meaningful" && daysBetween(state.plan.symptomsSince, today) >= MEDICAL_REVIEW_DAYS) {
    out.push({
      id: "medical-review",
      level: "info",
      title: { en: "Nerve symptoms for more than six weeks", es: "Síntomas nerviosos durante más de seis semanas" },
      body: {
        en: "Arm or leg symptoms lasting beyond about six weeks without meaningful improvement are a usual point for a medical assessment (a GP, physiatrist or neurologist). Whether you need a scan is their decision — not something to settle with an X-ray at a manual-therapy clinic.",
        es: "Los síntomas en el brazo o la pierna que duran más de unas seis semanas sin mejoría significativa son un momento habitual para una valoración médica (médico de familia, fisiatra o neurólogo). Si necesitas una resonancia lo decide el médico, no una radiografía en una clínica de terapia manual."
      }
    });
  }

  if (list.length < 2) {
    out.push({
      id: "need-data",
      level: "info",
      title: { en: "Add a baseline and a follow-up", es: "Añade una línea base y un seguimiento" },
      body: {
        en: "Record a check-in before (or at) your first session, then once a week. Two points make a direction; three make a trend.",
        es: "Registra un control antes de (o en) tu primera sesión, y luego una vez por semana. Dos puntos marcan una dirección; tres, una tendencia."
      }
    });
  }

  return out;
}

export function daysBetween(from: string, to: string): number {
  const a = Date.parse(`${from}T00:00:00Z`);
  const b = Date.parse(`${to}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.round((b - a) / 86_400_000);
}

export function formatMoney(amount: number, currency: Currency, locale: Locale): string {
  const n = new Intl.NumberFormat(locale === "es" ? "es-PE" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  const symbol: Record<Currency, string> = { PEN: "S/", USD: "US$", EUR: "€", GBP: "£" };
  return `${symbol[currency]} ${n}`;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
