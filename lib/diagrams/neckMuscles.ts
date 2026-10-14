import type { L } from "../i18n";
import type { SourceId } from "../sources";

/**
 * The muscles a neck massage works on, seen from the side (facing right),
 * and the two places where firm pressure doesn't belong: the front of the
 * neck over the carotid artery, and the side of the neck where the nerves to
 * the arm come out between the scalene muscles.
 */
export type MuscleId = "upper-trapezius" | "levator-scapulae" | "splenius" | "suboccipitals" | "scalenes" | "scm";

export interface Muscle {
  id: MuscleId;
  name: L;
  d: string;
  does: L;
  felt: L;
  massage: L;
  caution: boolean;
}

export const MUSCLES: readonly Muscle[] = [
  {
    id: "upper-trapezius",
    name: { en: "Upper trapezius", es: "Trapecio superior" },
    d: "M106 98C100 130 92 170 62 206L142 206C126 182 122 142 122 104Z",
    does: { en: "Shrugs and steadies the shoulder blade, and helps tilt and turn the head.", es: "Eleva y estabiliza la escápula, y ayuda a inclinar y girar la cabeza." },
    felt: { en: "Along the top of the shoulder and up the back of the neck: the classic 'knot' area.", es: "A lo largo de la parte superior del hombro y la parte posterior del cuello: la zona típica de los 'nudos'." },
    massage: { en: "The usual focus of a neck massage. Firm pressure is generally fine here.", es: "El foco habitual de un masaje de cuello. Aquí la presión firme suele estar bien." },
    caution: false
  },
  {
    id: "levator-scapulae",
    name: { en: "Levator scapulae", es: "Elevador de la escápula" },
    d: "M142 110C136 150 120 186 100 208L114 210C132 188 148 152 154 112Z",
    does: { en: "Lifts the shoulder blade and helps tilt the neck to the side.", es: "Eleva la escápula y ayuda a inclinar el cuello hacia un lado." },
    felt: { en: "Where the neck meets the shoulder blade. Tightness can limit turning the head.", es: "Donde el cuello se une a la escápula. La tensión puede limitar el giro de la cabeza." },
    massage: { en: "Often tender; firm pressure is generally fine.", es: "Suele estar sensible; la presión firme suele estar bien." },
    caution: false
  },
  {
    id: "splenius",
    name: { en: "Splenius capitis", es: "Esplenio de la cabeza" },
    d: "M128 96C124 122 118 152 112 184L122 186C128 154 134 124 140 98Z",
    does: { en: "Turns the head and tips it back.", es: "Gira la cabeza y la inclina hacia atrás." },
    felt: { en: "Back of the neck, sometimes up into the back of the head.", es: "Parte posterior del cuello, a veces hasta la parte posterior de la cabeza." },
    massage: { en: "Lies under the trapezius and is worked through it.", es: "Está debajo del trapecio y se trabaja a través de él." },
    caution: false
  },
  {
    id: "suboccipitals",
    name: { en: "Suboccipital muscles", es: "Músculos suboccipitales" },
    d: "M106 94Q118 88 130 96Q120 106 106 104Z",
    does: { en: "Small muscles under the skull that fine-tune head position.", es: "Músculos pequeños bajo el cráneo que ajustan la posición de la cabeza." },
    felt: { en: "At the base of the skull.", es: "En la base del cráneo." },
    massage: { en: "Gentle, sustained pressure is enough here.", es: "Aquí basta con una presión suave y mantenida." },
    caution: false
  },
  {
    id: "scalenes",
    name: { en: "Scalenes", es: "Escalenos" },
    d: "M154 120C158 150 164 182 168 210L182 210C178 182 170 150 164 118Z",
    does: { en: "Tilt the neck and lift the top ribs when you breathe hard.", es: "Inclinan el cuello y elevan las primeras costillas al respirar con fuerza." },
    felt: { en: "Side of the neck, sometimes with symptoms in the arm.", es: "Lateral del cuello, a veces con síntomas en el brazo." },
    massage: {
      en: "The nerves to the arm come out between two of these muscles. Firm pressure here can set off tingling down the arm: gentle only, and stop if the arm reacts.",
      es: "Los nervios del brazo salen entre dos de estos músculos. La presión firme aquí puede provocar hormigueo en el brazo: solo suave, y para si el brazo reacciona."
    },
    caution: true
  },
  {
    id: "scm",
    name: { en: "Sternocleidomastoid", es: "Esternocleidomastoideo" },
    d: "M128 100C150 140 176 178 192 210L206 206C190 172 160 132 140 96Z",
    does: { en: "Turns the head to the opposite side and bends it forward.", es: "Gira la cabeza hacia el lado contrario y la flexiona hacia delante." },
    felt: { en: "Front and side of the neck.", es: "Parte delantera y lateral del cuello." },
    massage: {
      en: "The carotid artery runs just in front of and beneath it. No deep or prolonged pressure on the front of the neck.",
      es: "La arteria carótida pasa justo por delante y por debajo. Nada de presión profunda ni prolongada en la parte delantera del cuello."
    },
    caution: true
  }
];

export const NECK_MUSCLE_COPY = {
  muscles: { en: "Muscles", es: "Músculos" },
  does: { en: "What it does", es: "Qué hace" },
  felt: { en: "Where tightness is felt", es: "Dónde se nota la tensión" },
  massage: { en: "For the massage", es: "Para el masaje" },
  carotid: { en: "Carotid artery", es: "Arteria carótida" },
  plexus: { en: "Nerves to the arm", es: "Nervios del brazo" },
  avoid: { en: "No firm pressure", es: "Sin presión firme" },
  figure: { en: "Side view of the head, neck and shoulder with the neck muscles", es: "Vista lateral de la cabeza, el cuello y el hombro con los músculos del cuello" },
  evidence: {
    en: "Massage often feels good, but trials for neck pain are small and mixed: a Cochrane review couldn't recommend it either way.",
    es: "El masaje suele sentar bien, pero los ensayos para el dolor de cuello son pequeños y dispares: una revisión Cochrane no pudo recomendarlo ni desaconsejarlo."
  }
} as const;

export const NECK_MUSCLE_SOURCES: readonly SourceId[] = ["standring2020", "patel2012"];
