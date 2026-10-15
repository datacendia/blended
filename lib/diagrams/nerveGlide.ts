import type { L } from "../i18n";
import type { SourceId } from "../sources";

/**
 * Nerve gliding, as physios teach it for a trapped nerve in the neck. Three
 * nerves carry the arm's feeling and strength from the neck to the hand, and
 * each is pulled tight by a different set of joint positions:
 *
 * - the median nerve runs in front of the elbow and wrist: a straight elbow,
 *   palm up and the wrist bent back pull on it;
 * - the radial nerve runs in front of the outer elbow and over the back of
 *   the wrist: a straight elbow, palm down and the wrist bent forward;
 * - the ulnar nerve runs behind the inner elbow (the "funny bone"): a bent
 *   elbow, palm down and the wrist bent back.
 *
 * Tilting the head away and pressing the shoulder down and out pull on all
 * three, from the neck end. Pull both ends at once and it is a "tensioner":
 * stronger, and more likely to flare a sensitive nerve. Pull one end while the
 * other is let off and the nerve slides with much less stretch: a "slider",
 * the usual gentler start. These are the positions the standard upper-limb
 * nerve tests use (Butler 2000).
 */
export type NerveId = "median" | "radial" | "ulnar";
export type HeadTilt = "toward" | "neutral" | "away";
export type ShoulderPos = "relaxed" | "down-out";
export type ElbowPos = "bent" | "straight";
export type ForearmPos = "up" | "down";
export type WristPos = "back" | "neutral" | "forward";
export type GlideKind = "tensioner" | "slider" | "slack" | "partial";

export interface Pose {
  head: HeadTilt;
  shoulder: ShoulderPos;
  elbow: ElbowPos;
  forearm: ForearmPos;
  wrist: WristPos;
}
export type Joint = keyof Pose;
export const JOINTS: readonly Joint[] = ["head", "shoulder", "elbow", "forearm", "wrist"];

type Effect = -1 | 0 | 1;
const HEAD: Record<HeadTilt, Effect> = { toward: -1, neutral: 0, away: 1 };
const SHOULDER: Record<ShoulderPos, Effect> = { relaxed: 0, "down-out": 1 };

/** How each position at the hand end pulls (1), lets off (-1) or leaves (0) each nerve. */
const DISTAL: Record<NerveId, { elbow: Record<ElbowPos, Effect>; forearm: Record<ForearmPos, Effect>; wrist: Record<WristPos, Effect> }> = {
  median: { elbow: { straight: 1, bent: -1 }, forearm: { up: 1, down: 0 }, wrist: { back: 1, neutral: 0, forward: -1 } },
  radial: { elbow: { straight: 1, bent: -1 }, forearm: { up: 0, down: 1 }, wrist: { back: -1, neutral: 0, forward: 1 } },
  ulnar: { elbow: { straight: -1, bent: 1 }, forearm: { up: 0, down: 1 }, wrist: { back: 1, neutral: 0, forward: -1 } }
};

/** What one joint's position does to one nerve. */
export function effect(nerve: NerveId, pose: Pose, joint: Joint): Effect {
  if (joint === "head") return HEAD[pose.head];
  if (joint === "shoulder") return SHOULDER[pose.shoulder];
  if (joint === "elbow") return DISTAL[nerve].elbow[pose.elbow];
  if (joint === "forearm") return DISTAL[nerve].forearm[pose.forearm];
  return DISTAL[nerve].wrist[pose.wrist];
}

/** The pull at the neck end and at the hand end. */
export function ends(nerve: NerveId, pose: Pose): { neck: number; hand: number } {
  return {
    neck: effect(nerve, pose, "head") + effect(nerve, pose, "shoulder"),
    hand: effect(nerve, pose, "elbow") + effect(nerve, pose, "forearm") + effect(nerve, pose, "wrist")
  };
}

/** From -4 (everything slack) to 5 (everything pulled). */
export function nerveTension(nerve: NerveId, pose: Pose): number {
  const e = ends(nerve, pose);
  return e.neck + e.hand;
}
export const TENSION_RANGE = { min: -4, max: 5 } as const;

export function glideKind(nerve: NerveId, pose: Pose): GlideKind {
  const { neck, hand } = ends(nerve, pose);
  if (neck > 0 && hand > 0) return "tensioner";
  if ((neck > 0 && hand < 0) || (neck < 0 && hand > 0)) return "slider";
  if (neck <= 0 && hand <= 0 && neck + hand <= -2) return "slack";
  return "partial";
}

/** Which way a slider moves the nerve: toward the end that is being pulled. */
export function slideToward(nerve: NerveId, pose: Pose): "neck" | "hand" | null {
  if (glideKind(nerve, pose) !== "slider") return null;
  return ends(nerve, pose).neck > 0 ? "neck" : "hand";
}

/** The standard test position for each nerve (upper-limb neurodynamic tests 1, 2b and 3). */
export const TEST_POSE: Record<NerveId, Pose> = {
  median: { head: "away", shoulder: "down-out", elbow: "straight", forearm: "up", wrist: "back" },
  radial: { head: "away", shoulder: "down-out", elbow: "straight", forearm: "down", wrist: "forward" },
  ulnar: { head: "away", shoulder: "down-out", elbow: "bent", forearm: "down", wrist: "back" }
};

/** A slider for each nerve: the hand end pulled while the head tilts toward the arm. */
export const SLIDER_POSE: Record<NerveId, Pose> = {
  median: { head: "toward", shoulder: "relaxed", elbow: "straight", forearm: "up", wrist: "back" },
  radial: { head: "toward", shoulder: "relaxed", elbow: "straight", forearm: "down", wrist: "forward" },
  ulnar: { head: "toward", shoulder: "relaxed", elbow: "bent", forearm: "down", wrist: "back" }
};

/** The position that gives each nerve the most slack. No one position slackens all three: the ulnar wants the elbow straight. */
export const REST_POSE: Record<NerveId, Pose> = {
  median: { head: "toward", shoulder: "relaxed", elbow: "bent", forearm: "down", wrist: "forward" },
  radial: { head: "toward", shoulder: "relaxed", elbow: "bent", forearm: "up", wrist: "back" },
  ulnar: { head: "toward", shoulder: "relaxed", elbow: "straight", forearm: "up", wrist: "forward" }
};

export const NERVES: Record<NerveId, { name: L; roots: string; route: L; supplies: L; test: L }> = {
  median: {
    name: { en: "Median nerve", es: "Nervio mediano" },
    roots: "C6-T1",
    route: {
      en: "Down the inside of the upper arm, across the front of the elbow, down the middle of the forearm and through the carpal tunnel at the wrist.",
      es: "Baja por la cara interna del brazo, cruza por delante del codo, baja por el centro del antebrazo y pasa por el túnel carpiano de la muñeca."
    },
    supplies: { en: "Feeling in the thumb, index, middle and half the ring finger; the thumb's pinch.", es: "La sensibilidad del pulgar, índice, medio y la mitad del anular; la pinza del pulgar." },
    test: { en: "Upper-limb nerve test 1", es: "Prueba neural del miembro superior 1" }
  },
  radial: {
    name: { en: "Radial nerve", es: "Nervio radial" },
    roots: "C5-T1",
    route: {
      en: "Spirals round the back of the upper-arm bone, crosses in front of the outer elbow, and runs to the back of the hand on the thumb side.",
      es: "Rodea por detrás el hueso del brazo, cruza por delante de la cara externa del codo y llega al dorso de la mano del lado del pulgar."
    },
    supplies: { en: "Straightening the elbow, wrist and fingers; feeling on the back of the hand, thumb side.", es: "Extender el codo, la muñeca y los dedos; la sensibilidad del dorso de la mano, lado del pulgar." },
    test: { en: "Upper-limb nerve test 2b", es: "Prueba neural del miembro superior 2b" }
  },
  ulnar: {
    name: { en: "Ulnar nerve", es: "Nervio cubital" },
    roots: "C8-T1",
    route: {
      en: "Down the inside of the upper arm, behind the inner elbow (the 'funny bone'), and down the little-finger side of the forearm.",
      es: "Baja por la cara interna del brazo, pasa por detrás de la cara interna del codo (el 'hueso de la risa') y baja por el lado del meñique del antebrazo."
    },
    supplies: { en: "Feeling in the little finger and half the ring finger; most of the hand's small muscles.", es: "La sensibilidad del meñique y la mitad del anular; la mayoría de los músculos pequeños de la mano." },
    test: { en: "Upper-limb nerve test 3", es: "Prueba neural del miembro superior 3" }
  }
};

export const GLIDE_TEXT: Record<GlideKind, { name: L; text: L }> = {
  tensioner: {
    name: { en: "Tensioner: both ends pulled", es: "Tensor: ambos extremos estirados" },
    text: {
      en: "The nerve is stretched from the neck end and the hand end at once. A stronger exercise that can flare a sensitive nerve, so physios usually save it for later, if at all.",
      es: "El nervio se estira a la vez desde el cuello y desde la mano. Un ejercicio más fuerte que puede irritar un nervio sensible, así que los fisioterapeutas suelen dejarlo para más adelante, si acaso."
    }
  },
  slider: {
    name: { en: "Slider: one end loosens as the other tightens", es: "Deslizador: un extremo se afloja mientras el otro se tensa" },
    text: {
      en: "One end takes up the slack the other lets go, so the nerve glides along its path with much less stretch. This is the usual gentler starting point.",
      es: "Un extremo recoge lo que el otro suelta, así que el nervio se desliza por su recorrido con mucho menos estiramiento. Es el punto de partida habitual, más suave."
    }
  },
  slack: {
    name: { en: "Slack", es: "Holgado" },
    text: {
      en: "Neither end is pulling, so this nerve has slack. Many people find a position like this eases arm symptoms, like resting the hand on the head.",
      es: "Ningún extremo tira, así que este nervio tiene holgura. Muchas personas notan que una postura así alivia los síntomas del brazo, como apoyar la mano sobre la cabeza."
    }
  },
  partial: {
    name: { en: "One end pulled", es: "Un extremo estirado" },
    text: {
      en: "One end pulls and the other is neither slack nor stretched: some tension on the nerve.",
      es: "Un extremo tira y el otro ni está suelto ni estirado: algo de tensión en el nervio."
    }
  }
};

export const GLIDE_COPY = {
  nerve: { en: "Nerve", es: "Nervio" },
  joints: {
    head: { en: "Head", es: "Cabeza" },
    shoulder: { en: "Shoulder", es: "Hombro" },
    elbow: { en: "Elbow", es: "Codo" },
    forearm: { en: "Forearm", es: "Antebrazo" },
    wrist: { en: "Wrist", es: "Muñeca" }
  },
  positions: {
    head: {
      toward: { en: "Tilted toward the arm", es: "Inclinada hacia el brazo" },
      neutral: { en: "Upright", es: "Recta" },
      away: { en: "Tilted away", es: "Inclinada al otro lado" }
    },
    shoulder: {
      relaxed: { en: "Relaxed", es: "Relajado" },
      "down-out": { en: "Down and out to the side", es: "Bajo y hacia un lado" }
    },
    elbow: {
      bent: { en: "Bent", es: "Doblado" },
      straight: { en: "Straight", es: "Estirado" }
    },
    forearm: {
      up: { en: "Palm up", es: "Palma arriba" },
      down: { en: "Palm down", es: "Palma abajo" }
    },
    wrist: {
      back: { en: "Bent back", es: "Hacia atrás" },
      neutral: { en: "Level", es: "Recta" },
      forward: { en: "Bent forward", es: "Hacia delante" }
    }
  },
  effects: {
    tight: { en: "pulls", es: "tensa" },
    loose: { en: "lets off", es: "afloja" },
    none: { en: "no effect", es: "sin efecto" }
  },
  presets: { en: "Try", es: "Prueba" },
  testPose: { en: "The test position", es: "La posición de prueba" },
  sliderPose: { en: "A slider", es: "Un deslizador" },
  restPose: { en: "Most slack", es: "Máxima holgura" },
  breakdown: { en: "What each joint does to this nerve", es: "Qué hace cada articulación a este nervio" },
  roots: { en: "Roots", es: "Raíces" },
  route: { en: "Route", es: "Recorrido" },
  supplies: { en: "Supplies", es: "Inerva" },
  tension: { en: "Tension on the nerve", es: "Tensión en el nervio" },
  neckEnd: { en: "neck end", es: "extremo del cuello" },
  handEnd: { en: "hand end", es: "extremo de la mano" },
  slides: { en: "slides toward the {end}", es: "se desliza hacia el {end}" },
  figure: { en: "Front view of the upper body with the arm and its three nerves", es: "Vista frontal del tronco con el brazo y sus tres nervios" },
  caution: {
    en: "Learn these from a physio before trying them. Stop if symptoms spread further down the arm or last after you stop.",
    es: "Apréndelos con un fisioterapeuta antes de probarlos. Detente si los síntomas bajan más por el brazo o duran después de parar."
  }
} as const;

export const GLIDE_SOURCES: readonly SourceId[] = ["butler2000", "coppieters2008", "basson2017", "blanpied2017", "standring2020"];
