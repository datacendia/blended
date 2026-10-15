import type { L } from "../i18n";
import type { SourceId } from "../sources";

/**
 * What yoga poses and Pilates exercises ask of the neck, sorted into six
 * kinds of demand. Two of them, tipping the head back and turning it toward
 * the sore side, narrow the opening a neck root leaves through (the same
 * finding the vertebra page draws). The advice is RootAtlas's cautious
 * reading for someone with a trapped nerve, and the page says so.
 */
export type Demand = "neutral" | "extension" | "rotation" | "forced-flexion" | "axial" | "head-lift";
export type Advice = "avoid" | "modify" | "fine";

export const DEMANDS: Record<Demand, { name: L; text: L; sources: SourceId[] }> = {
  neutral: {
    name: { en: "Neck relaxed", es: "Cuello relajado" },
    text: { en: "The neck rests in its middle position with little load.", es: "El cuello descansa en su posición media con poca carga." },
    sources: []
  },
  extension: {
    name: { en: "Head tipped back", es: "Cabeza hacia atrás" },
    text: {
      en: "Tipping the head back narrows the opening each neck root leaves through, which can bring on arm symptoms.",
      es: "Inclinar la cabeza hacia atrás estrecha la abertura por la que sale cada raíz cervical, lo que puede provocar síntomas en el brazo."
    },
    sources: ["yoo1992"]
  },
  rotation: {
    name: { en: "Head turned", es: "Cabeza girada" },
    text: {
      en: "Turning the head toward the sore side narrows that side's opening; turning away widens it.",
      es: "Girar la cabeza hacia el lado que duele estrecha la abertura de ese lado; girarla hacia el otro lado la agranda."
    },
    sources: ["yoo1992"]
  },
  "forced-flexion": {
    name: { en: "Neck bent fully forward under load", es: "Cuello flexionado al máximo con carga" },
    text: {
      en: "The neck is bent as far forward as it goes, with the weight of the body above it.",
      es: "El cuello se flexiona hacia delante al máximo, con el peso del cuerpo encima."
    },
    sources: []
  },
  axial: {
    name: { en: "Weight through the head", es: "Peso sobre la cabeza" },
    text: { en: "Part of your body weight passes down through the head and neck.", es: "Parte del peso del cuerpo pasa por la cabeza y el cuello." },
    sources: []
  },
  "head-lift": {
    name: { en: "Head held off the floor", es: "Cabeza levantada del suelo" },
    text: {
      en: "The muscles at the front of the neck hold the head's weight. Bending forward doesn't narrow the root's opening, but the effort can be hard on a sore neck.",
      es: "Los músculos de la parte delantera del cuello sostienen el peso de la cabeza. Flexionar no estrecha la abertura de la raíz, pero el esfuerzo puede costarle a un cuello dolorido."
    },
    sources: ["yoo1992"]
  }
};

export interface Pose {
  id: string;
  set: "yoga" | "pilates";
  name: L;
  demand: Demand;
  advice: Advice;
  why: L;
  instead: L;
}

export const POSES: readonly Pose[] = [
  {
    id: "headstand",
    set: "yoga",
    name: { en: "Headstand", es: "Postura sobre la cabeza" },
    demand: "axial",
    advice: "avoid",
    why: { en: "You balance part of your body weight on your head.", es: "Equilibras parte de tu peso sobre la cabeza." },
    instead: { en: "Legs up the wall gives an inversion with no weight on the neck.", es: "Piernas apoyadas en la pared: una inversión sin peso sobre el cuello." }
  },
  {
    id: "shoulder-stand",
    set: "yoga",
    name: { en: "Shoulder stand", es: "Postura sobre los hombros" },
    demand: "forced-flexion",
    advice: "avoid",
    why: { en: "Body weight rests on the shoulders with the neck bent sharply forward.", es: "El peso del cuerpo descansa sobre los hombros con el cuello muy flexionado." },
    instead: { en: "Legs up the wall, or a supported bridge.", es: "Piernas en la pared, o un puente con apoyo." }
  },
  {
    id: "plough",
    set: "yoga",
    name: { en: "Plough", es: "Arado" },
    demand: "forced-flexion",
    advice: "avoid",
    why: { en: "The neck is bent fully forward under the weight of the hips and legs.", es: "El cuello se flexiona al máximo bajo el peso de las caderas y las piernas." },
    instead: { en: "Lie on your back and hug your knees to your chest.", es: "Túmbate boca arriba y abraza las rodillas contra el pecho." }
  },
  {
    id: "wheel",
    set: "yoga",
    name: { en: "Wheel (full backbend)", es: "Rueda (extensión completa)" },
    demand: "extension",
    advice: "avoid",
    why: { en: "A full backbend with the head hanging back.", es: "Una extensión completa con la cabeza colgando hacia atrás." },
    instead: { en: "Bridge, with the head still and the eyes on the ceiling.", es: "Puente, con la cabeza quieta y la mirada al techo." }
  },
  {
    id: "camel",
    set: "yoga",
    name: { en: "Camel", es: "Camello" },
    demand: "extension",
    advice: "modify",
    why: { en: "Letting the head drop back adds full neck extension.", es: "Dejar caer la cabeza hacia atrás añade una extensión completa del cuello." },
    instead: { en: "Hands on your lower back, chin slightly tucked, lift through the chest.", es: "Manos en la zona lumbar, mentón ligeramente recogido, eleva el pecho." }
  },
  {
    id: "cobra",
    set: "yoga",
    name: { en: "Cobra", es: "Cobra" },
    demand: "extension",
    advice: "modify",
    why: { en: "Lifting the chest is fine; tipping the head back is the part to avoid.", es: "Elevar el pecho está bien; inclinar la cabeza hacia atrás es lo que hay que evitar." },
    instead: { en: "Low cobra, eyes on the mat, neck long.", es: "Cobra baja, mirada a la esterilla, cuello largo." }
  },
  {
    id: "warrior-2",
    set: "yoga",
    name: { en: "Warrior II", es: "Guerrero II" },
    demand: "rotation",
    advice: "modify",
    why: { en: "The head turns to look over the front hand.", es: "La cabeza gira para mirar por encima de la mano delantera." },
    instead: { en: "Keep facing forward, or turn only as far as is comfortable.", es: "Mira al frente, o gira solo hasta donde estés cómodo." }
  },
  {
    id: "seated-twist",
    set: "yoga",
    name: { en: "Seated twist", es: "Torsión sentada" },
    demand: "rotation",
    advice: "modify",
    why: { en: "The head is often turned to the end of its range.", es: "La cabeza suele girarse hasta el final de su recorrido." },
    instead: { en: "Twist through the chest and keep the head in line with the breastbone.", es: "Gira desde el pecho y mantén la cabeza alineada con el esternón." }
  },
  {
    id: "downward-dog",
    set: "yoga",
    name: { en: "Downward dog", es: "Perro boca abajo" },
    demand: "neutral",
    advice: "fine",
    why: { en: "The head hangs between the arms; little load if you let it relax.", es: "La cabeza cuelga entre los brazos; poca carga si la dejas relajada." },
    instead: { en: "Let the neck go loose; bend the knees if the shoulders strain.", es: "Suelta el cuello; dobla las rodillas si los hombros se tensan." }
  },
  {
    id: "child",
    set: "yoga",
    name: { en: "Child's pose", es: "Postura del niño" },
    demand: "neutral",
    advice: "fine",
    why: { en: "Forehead resting, neck relaxed.", es: "Frente apoyada, cuello relajado." },
    instead: { en: "A cushion under the forehead if it doesn't reach the floor.", es: "Un cojín bajo la frente si no llega al suelo." }
  },
  {
    id: "yoga-bridge",
    set: "yoga",
    name: { en: "Bridge", es: "Puente" },
    demand: "neutral",
    advice: "fine",
    why: { en: "Weight on the shoulders and feet, head still on the mat.", es: "Peso sobre los hombros y los pies, cabeza quieta en la esterilla." },
    instead: { en: "Don't turn your head while you're up.", es: "No gires la cabeza mientras estás arriba." }
  },
  {
    id: "hundred",
    set: "pilates",
    name: { en: "The Hundred", es: "El Cien" },
    demand: "head-lift",
    advice: "modify",
    why: { en: "Head and shoulders stay off the mat for a hundred breaths.", es: "La cabeza y los hombros se mantienen levantados durante cien respiraciones." },
    instead: { en: "Keep the head down, resting on a folded towel.", es: "Mantén la cabeza apoyada sobre una toalla doblada." }
  },
  {
    id: "chest-lift",
    set: "pilates",
    name: { en: "Chest lift", es: "Elevación del pecho" },
    demand: "head-lift",
    advice: "modify",
    why: { en: "Lifting the head and shoulders loads the front of the neck.", es: "Levantar la cabeza y los hombros carga la parte delantera del cuello." },
    instead: { en: "Hands behind the head to take its weight, or head down.", es: "Manos detrás de la cabeza para sostener su peso, o cabeza apoyada." }
  },
  {
    id: "roll-up",
    set: "pilates",
    name: { en: "Roll-up", es: "Roll-up (enrollarse)" },
    demand: "head-lift",
    advice: "modify",
    why: { en: "Rolling up starts by lifting the head.", es: "Enrollarse empieza levantando la cabeza." },
    instead: { en: "Start from a raised back support, or leave it out.", es: "Empieza desde un respaldo elevado, o sáltalo." }
  },
  {
    id: "single-leg-stretch",
    set: "pilates",
    name: { en: "Single-leg stretch", es: "Estiramiento de una pierna" },
    demand: "head-lift",
    advice: "modify",
    why: { en: "Head and shoulders are held up throughout.", es: "La cabeza y los hombros se mantienen levantados todo el rato." },
    instead: { en: "Do the leg work with the head down.", es: "Haz el trabajo de piernas con la cabeza apoyada." }
  },
  {
    id: "swan",
    set: "pilates",
    name: { en: "Swan", es: "Cisne" },
    demand: "extension",
    advice: "modify",
    why: { en: "The chest and head lift into a backbend.", es: "El pecho y la cabeza se elevan en extensión." },
    instead: { en: "A small lift, eyes on the mat, neck long.", es: "Una elevación pequeña, mirada a la colchoneta, cuello largo." }
  },
  {
    id: "swimming",
    set: "pilates",
    name: { en: "Swimming", es: "Natación" },
    demand: "extension",
    advice: "modify",
    why: { en: "The head is lifted while arms and legs flutter.", es: "La cabeza se mantiene levantada mientras brazos y piernas aletean." },
    instead: { en: "Forehead down on a towel; move only the arms and legs.", es: "Frente apoyada en una toalla; mueve solo brazos y piernas." }
  },
  {
    id: "rolling-like-a-ball",
    set: "pilates",
    name: { en: "Rolling like a ball", es: "Rodar como una pelota" },
    demand: "forced-flexion",
    advice: "avoid",
    why: { en: "Rolling too far back puts weight on the bent neck.", es: "Rodar demasiado hacia atrás pone peso sobre el cuello flexionado." },
    instead: { en: "Leave it out, or roll only as far as the shoulder blades.", es: "Sáltalo, o rueda solo hasta las escápulas." }
  },
  {
    id: "pilates-bridge",
    set: "pilates",
    name: { en: "Bridge (shoulder bridge)", es: "Puente de hombros" },
    demand: "neutral",
    advice: "fine",
    why: { en: "Head still on the mat, weight on the shoulders and feet.", es: "Cabeza quieta en la colchoneta, peso sobre los hombros y los pies." },
    instead: { en: "Keep the head still while you're up.", es: "Mantén la cabeza quieta mientras estás arriba." }
  },
  {
    id: "side-kick",
    set: "pilates",
    name: { en: "Side-lying leg series", es: "Serie de piernas de lado" },
    demand: "neutral",
    advice: "fine",
    why: { en: "Lying on your side with the head resting on your arm.", es: "Tumbado de lado con la cabeza apoyada en el brazo." },
    instead: { en: "A pillow under the head keeps the neck level.", es: "Una almohada bajo la cabeza mantiene el cuello recto." }
  }
];

export const ADVICE_LABEL: Record<Advice, L> = {
  avoid: { en: "Avoid with a trapped nerve", es: "Evitar con un nervio atrapado" },
  modify: { en: "Change it", es: "Modificar" },
  fine: { en: "Usually fine", es: "Suele estar bien" }
};

export const NECK_LOAD_COPY = {
  closeUp: { en: "The neck, close up", es: "El cuello, de cerca" },
  gallery: { en: "Every pose", es: "Todas las posturas" },
  instead: { en: "Instead", es: "En su lugar" },
  why: { en: "Why", es: "Por qué" },
  figure: { en: "The head and neck in this pose", es: "La cabeza y el cuello en esta postura" },
  weight: { en: "body weight", es: "peso del cuerpo" },
  headWeight: { en: "weight of the head", es: "peso de la cabeza" },
  narrows: { en: "opening narrows", es: "la abertura se estrecha" },
  caveat: {
    en: "RootAtlas's cautious reading for a trapped nerve in the neck, not a rule. Tell your teacher, and stop anything that brings on arm symptoms.",
    es: "La lectura prudente de RootAtlas para un nervio atrapado en el cuello, no una regla. Avísale al profesor y detén todo lo que provoque síntomas en el brazo."
  }
} as const;

/* ---------- Whole-body pose figures ---------- */

export type Pt = readonly [number, number];

/**
 * A side-view pictogram of each pose in a 120×100 box, ground at y=92.
 * The neck runs from the base of the skull to the shoulders, so it can be
 * coloured on its own; the spine runs from the shoulders to the hips; limbs
 * are polylines from the shoulder or hip.
 */
export interface PoseFigure {
  head: Pt;
  neck: readonly [Pt, Pt];
  spine: readonly Pt[];
  limbs: readonly (readonly Pt[])[];
}

export const GROUND_Y = 92;

export const FIGURES: Record<string, PoseFigure> = {
  headstand: {
    head: [60, 85],
    neck: [[60, 78], [60, 72]],
    spine: [[60, 72], [60, 42]],
    limbs: [[[60, 72], [46, 90], [56, 92]], [[60, 72], [74, 90], [64, 92]], [[60, 42], [59, 22], [59, 4]], [[60, 42], [62, 22], [62, 4]]]
  },
  "shoulder-stand": {
    head: [24, 85],
    neck: [[31, 87], [40, 86]],
    spine: [[40, 86], [42, 52]],
    limbs: [[[40, 86], [56, 90], [50, 66]], [[42, 52], [43, 30], [44, 8]], [[42, 52], [45, 30], [46, 8]]]
  },
  plough: {
    head: [78, 85],
    neck: [[71, 87], [62, 86]],
    spine: [[62, 86], [60, 54]],
    limbs: [[[62, 86], [46, 90], [30, 92]], [[60, 54], [82, 56], [104, 90]], [[60, 54], [84, 58], [106, 90]]]
  },
  wheel: {
    head: [36, 74],
    neck: [[39, 67], [44, 58]],
    spine: [[44, 58], [58, 45], [74, 50]],
    limbs: [[[44, 58], [36, 76], [30, 92]], [[74, 50], [88, 66], [92, 92]], [[74, 50], [86, 68], [88, 92]]]
  },
  camel: {
    head: [30, 26],
    neck: [[36, 30], [46, 34]],
    spine: [[46, 34], [56, 46], [62, 62]],
    limbs: [[[46, 34], [40, 60], [36, 88]], [[62, 62], [62, 92], [34, 92]]]
  },
  cobra: {
    head: [27, 40],
    neck: [[30, 47], [34, 58]],
    spine: [[34, 58], [46, 72], [64, 88]],
    limbs: [[[34, 58], [36, 76], [36, 92]], [[64, 88], [88, 90], [112, 92]]]
  },
  "warrior-2": {
    head: [61, 13],
    neck: [[61, 20], [60, 27]],
    spine: [[60, 27], [60, 56]],
    limbs: [[[60, 30], [84, 30], [106, 30]], [[60, 30], [36, 30], [14, 30]], [[60, 56], [84, 64], [84, 92]], [[60, 56], [38, 72], [22, 92]]]
  },
  "seated-twist": {
    head: [42, 44],
    neck: [[42, 51], [42, 58]],
    spine: [[42, 58], [40, 88]],
    limbs: [[[42, 62], [58, 68], [64, 72]], [[42, 62], [30, 76], [24, 92]], [[40, 88], [70, 90], [102, 92]], [[40, 88], [62, 70], [66, 92]]]
  },
  "downward-dog": {
    head: [33, 79],
    neck: [[36, 72], [40, 64]],
    spine: [[40, 64], [64, 40]],
    limbs: [[[40, 64], [32, 78], [24, 92]], [[64, 40], [80, 66], [96, 92]], [[64, 40], [82, 66], [99, 92]]]
  },
  child: {
    head: [33, 85],
    neck: [[40, 86], [46, 84]],
    spine: [[46, 84], [66, 76], [88, 80]],
    limbs: [[[46, 84], [28, 90], [10, 92]], [[88, 80], [68, 92], [100, 92]]]
  },
  "yoga-bridge": {
    head: [18, 85],
    neck: [[25, 87], [34, 87]],
    spine: [[34, 87], [50, 72], [66, 62]],
    limbs: [[[34, 87], [56, 92], [74, 92]], [[66, 62], [84, 58], [92, 92]]]
  },
  hundred: {
    head: [25, 62],
    neck: [[29, 68], [36, 74]],
    spine: [[36, 74], [48, 82], [64, 86]],
    limbs: [[[36, 74], [52, 76], [70, 76]], [[64, 86], [84, 66], [104, 48]], [[64, 86], [85, 68], [106, 51]]]
  },
  "chest-lift": {
    head: [27, 64],
    neck: [[31, 70], [38, 76]],
    spine: [[38, 76], [50, 84], [66, 88]],
    limbs: [[[38, 76], [26, 72], [22, 62]], [[66, 88], [84, 66], [98, 92]]]
  },
  "roll-up": {
    head: [74, 62],
    neck: [[68, 58], [62, 56]],
    spine: [[62, 56], [48, 66], [40, 88]],
    limbs: [[[62, 56], [80, 66], [98, 76]], [[40, 88], [70, 90], [102, 92]]]
  },
  "single-leg-stretch": {
    head: [27, 62],
    neck: [[31, 68], [38, 74]],
    spine: [[38, 74], [50, 82], [66, 86]],
    limbs: [[[38, 74], [50, 66], [60, 62]], [[66, 86], [56, 64], [70, 58]], [[66, 86], [86, 70], [106, 56]]]
  },
  swan: {
    head: [24, 51],
    neck: [[28, 58], [34, 66]],
    spine: [[34, 66], [48, 78], [66, 88]],
    limbs: [[[34, 66], [34, 80], [36, 92]], [[66, 88], [90, 90], [112, 92]]]
  },
  swimming: {
    head: [25, 74],
    neck: [[31, 78], [38, 82]],
    spine: [[38, 82], [68, 84]],
    limbs: [[[38, 82], [22, 76], [6, 70]], [[38, 82], [22, 86], [8, 88]], [[68, 84], [90, 80], [112, 76]], [[68, 84], [90, 88], [110, 90]]]
  },
  "rolling-like-a-ball": {
    head: [70, 55],
    neck: [[63, 53], [56, 54]],
    spine: [[56, 54], [46, 68], [54, 86]],
    limbs: [[[56, 56], [68, 66], [78, 74]], [[54, 86], [72, 64], [80, 80]]]
  },
  "pilates-bridge": {
    head: [18, 85],
    neck: [[25, 87], [34, 87]],
    spine: [[34, 87], [50, 76], [66, 68]],
    limbs: [[[34, 87], [56, 92], [74, 92]], [[66, 68], [84, 62], [92, 92]]]
  },
  "side-kick": {
    head: [20, 60],
    neck: [[24, 67], [30, 84]],
    spine: [[30, 84], [60, 88]],
    limbs: [[[30, 84], [22, 74], [20, 66]], [[60, 88], [84, 89], [108, 89]], [[60, 86], [80, 74], [98, 64]]]
  }
};
