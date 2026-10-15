import type { L } from "../i18n";

/**
 * Which interactive diagram each guide shows. Every profession gets the care
 * pathway (where it sits in the usual order of care) plus one diagram of what
 * that profession actually does; every practice gets one of its own.
 *
 * Kept in lib/ so a test can check that no guide is left with text only.
 * components/guide/GuideDiagrams.tsx maps each id to its component, typed so
 * an id without a component doesn't compile.
 */
export type DiagramId =
  | "care-pathway"
  | "red-flags"
  | "neck-or-arm"
  | "nerve-glide"
  | "mobilisation-grades"
  | "surgery-options"
  | "neck-muscles"
  | "balance"
  | "neck-load-yoga"
  | "neck-load-pilates"
  | "head-lever"
  | "needle-depth"
  | "cupping-skin"
  | "twist-and-root"
  | "foot-map"
  | "dilution";

export const DIAGRAM_INFO: Record<DiagramId, { title: L; intro: L }> = {
  "care-pathway": {
    title: { en: "Where this fits in your care", es: "Dónde encaja en tu atención" },
    intro: {
      en: "The usual order of care for a trapped nerve or neck pain. Move the slider and tick what applies: the map shows which step you're likely at.",
      es: "El orden habitual de atención para un nervio atrapado o dolor de cuello. Mueve el control y marca lo que aplica: el mapa muestra en qué paso es probable que estés."
    }
  },
  "red-flags": {
    title: { en: "The questions a GP should ask first", es: "Las preguntas que el médico debería hacer primero" },
    intro: {
      en: "Tick anything that applies to you now. These are the warning signs a good first visit checks for.",
      es: "Marca lo que te aplique ahora. Son las señales de alarma que revisa una buena primera visita."
    }
  },
  "neck-or-arm": {
    title: { en: "Is it the neck, or a nerve further down?", es: "¿Es el cuello o un nervio más abajo?" },
    intro: {
      en: "A trapped nerve in the neck and a nerve squeezed at the wrist or elbow can feel alike. Pick one to see where each is usually felt, and the clues that tell them apart.",
      es: "Un nervio atrapado en el cuello y un nervio comprimido en la muñeca o el codo pueden sentirse parecido. Elige uno para ver dónde suele notarse cada uno y las pistas que los distinguen."
    }
  },
  "nerve-glide": {
    title: { en: "Nerve gliding: slider or tensioner?", es: "Deslizamiento neural: ¿deslizador o tensor?" },
    intro: {
      en: "Physios move the nerve from the neck to the hand by positioning the head and arm. Change both and watch what happens to the nerve.",
      es: "Los fisioterapeutas mueven el nervio del cuello a la mano colocando la cabeza y el brazo. Cambia ambos y mira qué le pasa al nervio."
    }
  },
  "mobilisation-grades": {
    title: { en: "Mobilisation or manipulation?", es: "¿Movilización o manipulación?" },
    intro: {
      en: "Hands-on joint treatment is graded from I to V by where in the joint's range it works and how big the movement is. Pick a grade.",
      es: "El tratamiento articular manual se gradúa del I al V según en qué parte del recorrido de la articulación trabaja y lo amplio que es el movimiento. Elige un grado."
    }
  },
  "surgery-options": {
    title: { en: "What each operation does to the opening", es: "Qué hace cada operación con la abertura" },
    intro: {
      en: "The same side view as the vertebra page, with a disc pressing on the root. Pick an option to see how it makes room.",
      es: "La misma vista lateral de la página de la vértebra, con un disco que comprime la raíz. Elige una opción para ver cómo hace espacio."
    }
  },
  "neck-muscles": {
    title: { en: "The neck muscles a massage works on", es: "Los músculos del cuello que trabaja un masaje" },
    intro: {
      en: "Eighteen muscles from the back, side and front, each numbered. Tap one to see what it attaches to, what it does, how firm a massage can be, and where its pain is often felt. The pressure guide colours the whole chart by how firm is safe.",
      es: "Dieciocho músculos vistos de espalda, de lado y de frente, cada uno numerado. Toca uno para ver dónde se inserta, qué hace, qué presión admite el masaje y dónde se suele sentir su dolor. La guía de presión colorea todo el mapa según la presión segura."
    }
  },
  balance: {
    title: { en: "Why tai chi trains balance", es: "Por qué el taichí entrena el equilibrio" },
    intro: {
      en: "Seen from above: you stay upright while your centre of mass is over the area between your feet. Pick a stance and drag the dot, or use the sliders.",
      es: "Visto desde arriba: te mantienes en pie mientras tu centro de masa está sobre el área entre tus pies. Elige una postura y arrastra el punto, o usa los controles."
    }
  },
  "neck-load-yoga": {
    title: { en: "What each pose asks of your neck", es: "Qué le pide cada postura a tu cuello" },
    intro: {
      en: "Pick a pose to see what it does to the neck, and what to do instead if you have a trapped nerve.",
      es: "Elige una postura para ver qué le hace al cuello y qué hacer en su lugar si tienes un nervio atrapado."
    }
  },
  "neck-load-pilates": {
    title: { en: "What each exercise asks of your neck", es: "Qué le pide cada ejercicio a tu cuello" },
    intro: {
      en: "Pick an exercise to see what it does to the neck, and what to do instead if you have a trapped nerve.",
      es: "Elige un ejercicio para ver qué le hace al cuello y qué hacer en su lugar si tienes un nervio atrapado."
    }
  },
  "head-lever": {
    title: { en: "The head-forward lever", es: "La palanca de la cabeza adelantada" },
    intro: {
      en: "The 'effective head weight' printed on posture reports comes from this kind of model. Tilt the head and see the model's numbers, and what they don't tell you.",
      es: "El 'peso efectivo de la cabeza' que imprimen los informes posturales viene de este tipo de modelo. Inclina la cabeza y mira las cifras del modelo, y lo que no te dicen."
    }
  },
  "needle-depth": {
    title: { en: "How deep is too deep over the upper back?", es: "¿Cuánta profundidad es demasiada en la parte alta de la espalda?" },
    intro: {
      en: "Pick a needling site on the back to see what lies under it, then choose a build and an angle and push the needle in. Over the lung, only the pleura is left once the ribs are reached.",
      es: "Elige un punto de punción en la espalda para ver qué hay debajo; luego elige una complexión y un ángulo e introduce la aguja. Sobre el pulmón, al llegar a las costillas solo queda la pleura."
    }
  },
  "cupping-skin": {
    title: { en: "Where cupping marks come from", es: "De dónde salen las marcas de las ventosas" },
    intro: {
      en: "A slice through the skin under a cup, and the marks the cups leave on the back. Change the suction and the time, place the cups, then move the days on to watch the marks fade.",
      es: "Un corte de la piel bajo una ventosa, y las marcas que dejan las ventosas en la espalda. Cambia la succión y el tiempo, coloca las ventosas y avanza los días para ver cómo se borran las marcas."
    }
  },
  "twist-and-root": {
    title: { en: "What twisting does to a trapped nerve", es: "Qué le hace la torsión a un nervio atrapado" },
    intro: {
      en: "A trapped nerve isn't out of place, so it can't be put back. Turning and tipping the head back makes the opening smaller, not larger.",
      es: "Un nervio atrapado no está fuera de sitio, así que no se puede acomodar. Girar e inclinar la cabeza hacia atrás achica la abertura, no la agranda."
    }
  },
  "foot-map": {
    title: { en: "The reflexology chart, checked", es: "El mapa de reflexología, revisado" },
    intro: {
      en: "Tap a zone of the sole to compare what a typical reflexology chart says with the nerves that actually carry feeling from that skin.",
      es: "Toca una zona de la planta para comparar lo que dice un mapa típico de reflexología con los nervios que de verdad llevan la sensibilidad de esa piel."
    }
  },
  dilution: {
    title: { en: "How much is left in a homeopathic remedy?", es: "¿Cuánto queda en un remedio homeopático?" },
    intro: {
      en: "Each 'C' means diluting 1 part in 100. Pick a strength and see how much of the original substance you'd expect to remain.",
      es: "Cada 'C' significa diluir 1 parte en 100. Elige una potencia y mira cuánto de la sustancia original cabe esperar que quede."
    }
  }
};

/** Diagrams per guide, in the order they appear. */
export const GUIDE_DIAGRAMS: Record<string, DiagramId[]> = {
  gp: ["care-pathway", "red-flags"],
  physiatrist: ["care-pathway", "neck-or-arm"],
  physio: ["care-pathway", "nerve-glide"],
  chiropractor: ["care-pathway", "mobilisation-grades"],
  osteopath: ["care-pathway", "mobilisation-grades"],
  neurologist: ["care-pathway", "neck-or-arm"],
  surgeon: ["care-pathway", "surgery-options"],
  massage: ["care-pathway", "neck-muscles"],
  "tai-chi": ["balance"],
  yoga: ["neck-load-yoga"],
  pilates: ["neck-load-pilates"],
  alexander: ["head-lever"],
  acupuncture: ["needle-depth"],
  "dry-needling": ["needle-depth"],
  cupping: ["cupping-skin"],
  huesero: ["twist-and-root"],
  reflexology: ["foot-map"],
  homeopathy: ["dilution"]
};
