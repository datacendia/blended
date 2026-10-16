import type { L } from "../i18n";
import type { SourceId } from "../sources";

/**
 * The model behind the "effective head weight" on posture reports. A
 * frequently quoted computer model estimated the load on the neck as the
 * head tilts forward: about 4.5-5.4 kg upright, rising to 27 kg at 60°.
 * They are model outputs for a static posture, not measurements, which is
 * how the posture-report page treats them too.
 */
export const HEAD_ANGLES: readonly { deg: number; kg: number; range?: readonly [number, number] }[] = [
  { deg: 0, kg: 5, range: [4.5, 5.4] },
  { deg: 15, kg: 12.2 },
  { deg: 30, kg: 18.1 },
  { deg: 45, kg: 22.2 },
  { deg: 60, kg: 27.2 }
];

export function modelLoad(deg: number): number {
  const exact = HEAD_ANGLES.find((a) => a.deg === deg);
  if (!exact) throw new Error(`The model gives no figure for ${deg}°`);
  return exact.kg;
}

export const HEAD_LEVER_COPY = {
  angle: { en: "Head tilted forward: {deg}°", es: "Cabeza inclinada hacia delante: {deg}°" },
  model: { en: "The model's load on the neck", es: "La carga sobre el cuello según el modelo" },
  times: { en: "{x}× the upright figure", es: "{x}× la cifra en posición erguida" },
  lever: { en: "lever", es: "palanca" },
  pivot: { en: "pivot", es: "pivote" },
  figure: { en: "The head tilting forward on the neck, with the lever arm drawn", es: "La cabeza inclinándose hacia delante sobre el cuello, con el brazo de palanca dibujado" },
  why: {
    en: "The further forward the head's weight sits from the pivot at the base of the neck, the harder the muscles at the back of the neck work to hold it. That part is plain mechanics.",
    es: "Cuanto más adelante queda el peso de la cabeza respecto al pivote de la base del cuello, más trabajan los músculos de la nuca para sostenerla. Esa parte es mecánica básica."
  },
  caveat: {
    en: "The kilograms come from a computer model of a posture held still, not from measuring anyone's neck. They show the direction of the effect, not the load in your neck.",
    es: "Los kilos vienen de un modelo por ordenador de una postura mantenida quieta, no de medir el cuello de nadie. Muestran la dirección del efecto, no la carga en tu cuello."
  },
  alexander: {
    en: "Alexander lessons work on the habits behind long stretches in positions like these. The neck-pain trial measured pain, not head angles.",
    es: "Las clases de técnica Alexander trabajan los hábitos que llevan a pasar mucho tiempo en posturas así. El ensayo de dolor de cuello midió el dolor, no los ángulos de la cabeza."
  },
  report: { en: "See how the posture report uses this number", es: "Ver cómo usa este número el informe postural" },
  muscles: { en: "Muscles at the back of the neck", es: "Músculos de la nuca" },
  squares: { en: "One square per kilogram", es: "Un cuadrado por kilogramo" },
  uprightShare: { en: "Outlined: the upright figure", es: "Con borde: la cifra en posición erguida" },
  stops: { en: "The slider stops only at the five angles the model reported.", es: "El control solo se detiene en los cinco ángulos que dio el modelo." }
} as const;

export const HEAD_LEVER_SOURCES: readonly SourceId[] = ["hansraj2014", "macpherson2015"];
