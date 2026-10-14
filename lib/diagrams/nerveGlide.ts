import type { L } from "../i18n";
import type { SourceId } from "../sources";

/**
 * Nerve gliding, as physios teach it for a trapped nerve in the neck. The
 * nerve to the hand runs from the neck, under the collarbone, down the inner
 * arm and across the front of the elbow and wrist. Tilting the head away and
 * straightening the elbow and wrist both pull on it.
 *
 * Pull both ends at once and it is a "tensioner": stronger, and more likely
 * to flare a sensitive nerve. Pull one end while the other is let off and the
 * nerve slides with little stretch: a "slider", the usual gentler start.
 * Slacken both and it is the position many people find eases arm symptoms.
 */
export type HeadTilt = "toward" | "neutral" | "away";
export type ArmPos = "bent" | "straight";
export type GlideKind = "tensioner" | "slider" | "slack" | "partial";

const HEAD: Record<HeadTilt, number> = { toward: -1, neutral: 0, away: 1 };
const ARM: Record<ArmPos, number> = { bent: -1, straight: 1 };

/** -2 (both ends slack) to 2 (both ends pulled). */
export function nerveTension(head: HeadTilt, arm: ArmPos): number {
  return HEAD[head] + ARM[arm];
}

export function glideKind(head: HeadTilt, arm: ArmPos): GlideKind {
  const t = nerveTension(head, arm);
  if (t === 2) return "tensioner";
  if (t === -2) return "slack";
  if (t === 0) return "slider";
  return "partial";
}

export const GLIDE_TEXT: Record<GlideKind, { name: L; text: L }> = {
  tensioner: {
    name: { en: "Tensioner: both ends pulled", es: "Tensor: ambos extremos estirados" },
    text: {
      en: "Head tilted away and the arm straight: the nerve is stretched from both ends. A stronger exercise that can flare a sensitive nerve, so physios usually save it for later, if at all.",
      es: "Cabeza inclinada hacia el otro lado y brazo estirado: el nervio se estira desde ambos extremos. Un ejercicio más fuerte que puede irritar un nervio sensible, así que los fisioterapeutas suelen dejarlo para más adelante, si acaso."
    }
  },
  slider: {
    name: { en: "Slider: one end loosens as the other tightens", es: "Deslizador: un extremo se afloja mientras el otro se tensa" },
    text: {
      en: "One end takes up the slack the other lets go, so the nerve glides along its path without being stretched. This is the usual gentler starting point.",
      es: "Un extremo recoge lo que el otro suelta, así que el nervio se desliza por su recorrido sin estirarse. Es el punto de partida habitual, más suave."
    }
  },
  slack: {
    name: { en: "Both ends slack", es: "Ambos extremos sueltos" },
    text: {
      en: "Head tilted toward the arm and the elbow bent: the nerve has the most slack. Many people find a position like this eases arm symptoms, like resting the hand on the head.",
      es: "Cabeza inclinada hacia el brazo y codo doblado: el nervio tiene la máxima holgura. Muchas personas notan que una postura así alivia los síntomas del brazo, como apoyar la mano sobre la cabeza."
    }
  },
  partial: {
    name: { en: "One end pulled", es: "Un extremo estirado" },
    text: {
      en: "One end is pulled and the other is neither slack nor stretched: some tension on the nerve.",
      es: "Un extremo está estirado y el otro ni suelto ni estirado: algo de tensión en el nervio."
    }
  }
};

export const GLIDE_COPY = {
  head: { en: "Head", es: "Cabeza" },
  arm: { en: "Elbow and wrist", es: "Codo y muñeca" },
  headTilt: {
    toward: { en: "Tilted toward the arm", es: "Inclinada hacia el brazo" },
    neutral: { en: "Upright", es: "Recta" },
    away: { en: "Tilted away", es: "Inclinada hacia el otro lado" }
  },
  armPos: {
    bent: { en: "Bent", es: "Doblados" },
    straight: { en: "Straight, wrist back", es: "Estirados, muñeca hacia atrás" }
  },
  tension: { en: "Tension on the nerve", es: "Tensión en el nervio" },
  nerve: { en: "The nerve to the hand", es: "El nervio hacia la mano" },
  figure: { en: "Front view of the upper body with the arm out to the side and the nerve drawn along it", es: "Vista frontal del tronco con el brazo hacia un lado y el nervio dibujado a lo largo" },
  caution: {
    en: "Learn these from a physio before trying them. Stop if symptoms spread further down the arm or last after you stop.",
    es: "Apréndelos con un fisioterapeuta antes de probarlos. Detente si los síntomas bajan más por el brazo o duran después de parar."
  }
} as const;

export const GLIDE_SOURCES: readonly SourceId[] = ["basson2017", "blanpied2017"];
