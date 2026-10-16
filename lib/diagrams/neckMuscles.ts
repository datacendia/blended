import type { L } from "../i18n";
import { regionById } from "../regions";
import type { SourceId } from "../sources";

/**
 * The muscles a neck and shoulder massage works on, as an anatomy chart:
 * three views, each muscle numbered and tappable. The back view is drawn the
 * way atlases draw it, the surface layer on the person's left and the layer
 * underneath on their right, so both can be seen at once.
 *
 * Each muscle carries what a massage needs to know (how firm, and why) and
 * where its pain is commonly felt. Those pain maps come from the trigger
 * point manual and are shown on the body-map figures, so they can be compared
 * with the nerve-root patterns the rest of the site uses: a tight scalene and
 * a trapped C6 root can put pain in the same places.
 */
export type NeckView = "back" | "side" | "front";
export type Pressure = "firm" | "gentle" | "avoid";
export type MuscleGroup = "back" | "neck" | "chest";
export type MuscleId =
  | "upper-trapezius"
  | "middle-trapezius"
  | "lower-trapezius"
  | "levator-scapulae"
  | "rhomboids"
  | "supraspinatus"
  | "infraspinatus"
  | "splenius"
  | "semispinalis"
  | "suboccipitals"
  | "scm"
  | "anterior-scalene"
  | "middle-scalene"
  | "posterior-scalene"
  | "platysma"
  | "infrahyoids"
  | "longus-colli"
  | "pectoralis-minor";

export interface MuscleView {
  /** One path per side drawn in this view. */
  d: readonly string[];
  /** Where the number sits. */
  at: readonly [number, number];
  /**
   * Fibre direction for each path, in degrees from vertical (positive leans
   * like "/", negative like "\\"). Drawn as fine lines, the way atlas plates
   * show which way a muscle pulls.
   */
  fibres?: readonly number[];
  /** Too deep to see in this view: drawn as a dashed outline. */
  hidden?: boolean;
}

export interface Muscle {
  n: number;
  id: MuscleId;
  name: L;
  group: MuscleGroup;
  views: Partial<Record<NeckView, MuscleView>>;
  attaches: L;
  does: L;
  nerve: L;
  pressure: Pressure;
  massage: L;
  /** Where its pain is commonly felt, or null when the manual gives no map. */
  felt: L | null;
  /** The same, as body-map regions. */
  refers: readonly string[];
}

export const NECK_BOX = { width: 300, height: 300 } as const;

/* ---------- Figures: outline and bones ---------- */

export const FIGURES: Record<NeckView, { body: readonly string[]; head: string; bones: readonly string[]; under?: readonly string[]; lines: readonly string[] }> = {
  back: {
    head: "M110 50A40 46 0 1 1 190 50A40 46 0 1 1 110 50Z",
    body: [
      "M130 90C130 106 126 116 114 122C96 130 72 132 58 140C44 148 38 164 38 184L36 314H64L66 204L76 198L78 314H222L224 198L234 204L236 314H264L262 184C262 164 256 148 242 140C228 132 204 130 186 122C174 116 170 106 170 90Z",
      "M102 56A6 12 0 1 1 114 56A6 12 0 1 1 102 56Z",
      "M186 56A6 12 0 1 1 198 56A6 12 0 1 1 186 56Z"
    ],
    // The deeper side's shoulder blade, with the ridge (spine of the scapula)
    // that ends at the acromion. On the surface side it lies under the
    // trapezius, so only its outline is drawn.
    bones: ["M186 142C200 144 214 146 226 148L238 164C226 190 214 216 202 240C192 214 186 180 186 142Z", "M186 166C206 160 226 152 246 142L248 147C228 156 208 164 188 172Z"],
    under: ["M114 142C100 144 86 146 74 148L62 164C74 190 86 216 98 240C108 214 114 180 114 142Z", "M114 166C94 160 74 152 54 142"],
    lines: []
  },
  side: {
    head: "M104 98C98 86 96 72 98 58C102 30 126 12 154 12C178 12 194 28 196 50L198 58C204 66 208 72 210 80C206 82 202 84 200 86C202 88 203 91 200 93C202 96 202 99 199 101C200 106 200 110 196 116C190 122 182 124 172 122C162 120 152 116 144 110C136 106 126 102 114 100Z",
    body: [
      "M110 100C108 120 104 140 98 156C90 172 80 186 76 204L72 314H216L214 228C212 210 206 198 196 192C190 168 184 144 178 122C170 122 160 120 150 114Z",
      "M133 68A7 11 0 1 1 147 68A7 11 0 1 1 133 68Z"
    ],
    // Collarbone, from the breastbone back to the acromion.
    bones: ["M196 192C180 188 160 186 142 188C134 189 128 188 122 184L124 180C130 183 136 184 142 183C160 181 180 183 198 187Z"],
    // Jaw line, eye and the line of the lips.
    lines: ["M196 114C184 118 170 118 160 114C154 110 150 102 148 92", "M180 55Q185 52 190 55Q185 58 180 55Z", "M192 93H200"]
  },
  front: {
    head: "M114 56C114 26 130 10 150 10C170 10 186 26 186 56C186 76 180 92 168 100C162 104 156 106 150 106C144 106 138 104 132 100C120 92 114 76 114 56Z",
    body: [
      "M130 92C130 120 130 148 128 164C112 170 88 172 70 178C54 184 44 198 40 216L36 314H264L260 216C256 198 246 184 230 178C212 172 188 170 172 164C170 148 170 120 170 92Z",
      "M104 58A6 12 0 1 1 116 58A6 12 0 1 1 104 58Z",
      "M184 58A6 12 0 1 1 196 58A6 12 0 1 1 184 58Z"
    ],
    // Collarbones, breastbone and the hyoid bone above the voice box.
    bones: [
      "M146 186C130 180 112 182 96 182C84 182 74 180 66 178L66 184C76 186 86 188 96 188C112 188 130 186 146 192Z",
      "M154 186C170 180 188 182 204 182C216 182 226 180 234 178L234 184C224 186 214 188 204 188C188 188 170 186 154 192Z",
      "M145 194H155L154 272H146Z",
      "M138 117Q150 121 162 117L162 120Q150 124 138 120Z"
    ],
    // Eyes, nose, mouth, and the voice box (Adam's apple) and windpipe rings.
    lines: [
      "M131 52Q136 49 141 52Q136 55 131 52Z",
      "M159 52Q164 49 169 52Q164 55 159 52Z",
      "M150 58L146 72Q150 75 154 72",
      "M141 86Q150 90 159 86",
      "M143 125H157L153 138L150 141L147 138Z"
    ]
  }
};

/**
 * Neighbouring muscles drawn for orientation only: not numbered, not in the
 * key, labelled in small type.
 */
export const CONTEXT: Record<NeckView, readonly { d: string; name: L; at: readonly [number, number] }[]> = {
  back: [
    { d: "M60 140C48 146 40 160 38 178C38 190 42 200 48 208C56 196 64 180 70 162C72 154 68 146 60 140Z", name: { en: "Deltoid", es: "Deltoides" }, at: [50, 176] },
    { d: "M240 140C252 146 260 160 262 178C262 190 258 200 252 208C244 196 236 180 230 162C228 154 232 146 240 140Z", name: { en: "Deltoid", es: "Deltoides" }, at: [250, 176] },
    { d: "M148 222C132 228 112 236 98 240C90 242 84 240 78 236V314H148Z", name: { en: "Latissimus dorsi", es: "Dorsal ancho" }, at: [112, 280] },
    { d: "M152 186C158 192 164 198 168 206C170 238 170 276 170 314H152Z", name: { en: "Erector spinae", es: "Erector de la columna" }, at: [184, 284] }
  ],
  side: [
    { d: "M120 186C108 190 102 204 104 222C108 240 118 256 128 262C140 252 150 236 156 214C158 202 156 194 150 190C140 188 130 186 120 186Z", name: { en: "Deltoid", es: "Deltoides" }, at: [128, 236] },
    { d: "M158 196C170 196 184 196 196 196C204 210 210 230 210 252C196 256 176 252 160 240C156 226 156 210 158 196Z", name: { en: "Pectoralis major", es: "Pectoral mayor" }, at: [186, 238] }
  ],
  front: [
    { d: "M68 178C56 182 46 192 42 208C40 224 44 240 50 252C58 240 66 222 70 204C72 194 72 184 68 178Z", name: { en: "Deltoid", es: "Deltoides" }, at: [52, 222] },
    { d: "M232 178C244 182 254 192 258 208C260 224 256 240 250 252C242 240 234 222 230 204C228 194 228 184 232 178Z", name: { en: "Deltoid", es: "Deltoides" }, at: [248, 222] },
    { d: "M146 196C128 192 100 190 72 188C66 200 64 214 66 226C80 246 104 262 130 268C140 270 146 264 146 254Z", name: { en: "Pectoralis major", es: "Pectoral mayor" }, at: [112, 254] }
  ]
};

/** Bony landmarks named in the back view, so levels can be read off it. */
export const SPINE_MARKS: readonly { label: string; y: number }[] = [
  { label: "C7", y: 128 },
  { label: "T4", y: 166 },
  { label: "T8", y: 206 },
  { label: "T12", y: 246 }
];

/* ---------- The muscles ---------- */

export const MUSCLES: readonly Muscle[] = [
  {
    n: 1,
    id: "upper-trapezius",
    name: { en: "Upper trapezius", es: "Trapecio superior" },
    group: "back",
    views: {
      back: { d: ["M148 84C140 85 134 87 130 90C130 104 127 114 116 121C98 130 76 134 60 141L66 148C96 140 124 132 148 128Z"], at: [124, 124], fibres: [54] },
      side: { d: ["M104 96C108 96 112 97 116 99C116 130 118 160 126 188C112 190 96 194 82 200C88 184 96 170 100 154C104 136 106 116 104 96Z"], at: [109, 150], fibres: [-12] }
    },
    attaches: {
      en: "Base of the skull and the ligament down the back of the neck → outer third of the collarbone.",
      es: "Base del cráneo y el ligamento de la nuca → tercio externo de la clavícula."
    },
    does: { en: "Shrugs the shoulder, and tips the head back and to the side.", es: "Eleva el hombro, e inclina la cabeza hacia atrás y hacia un lado." },
    nerve: { en: "Accessory nerve (cranial nerve XI); C3-C4 carry feeling from it.", es: "Nervio accesorio (par craneal XI); C3-C4 llevan su sensibilidad." },
    pressure: "firm",
    massage: { en: "The usual focus of a neck massage. Firm pressure is generally fine.", es: "El foco habitual de un masaje de cuello. La presión firme suele estar bien." },
    felt: {
      en: "Up the side and back of the neck to behind the ear and the temple.",
      es: "Por el lateral y la parte posterior del cuello hasta detrás de la oreja y la sien."
    },
    refers: ["back-of-neck", "neck-front", "occiput", "face"]
  },
  {
    n: 2,
    id: "middle-trapezius",
    name: { en: "Middle trapezius", es: "Trapecio medio" },
    group: "back",
    views: { back: { d: ["M148 128C122 132 94 140 66 148C82 154 100 162 116 170C126 166 138 161 148 158Z"], at: [100, 150], fibres: [88] } },
    attaches: {
      en: "Spines of C7-T3 → the bony tip of the shoulder (acromion) and the ridge of the shoulder blade.",
      es: "Apófisis espinosas de C7-D3 → la punta ósea del hombro (acromion) y la espina de la escápula."
    },
    does: { en: "Pulls the shoulder blades back toward the spine.", es: "Lleva las escápulas hacia atrás, hacia la columna." },
    nerve: { en: "Accessory nerve (cranial nerve XI); C3-C4 carry feeling from it.", es: "Nervio accesorio (par craneal XI); C3-C4 llevan su sensibilidad." },
    pressure: "firm",
    massage: { en: "Ribs and shoulder blade lie beneath it. Firm pressure is generally fine.", es: "Debajo están las costillas y la escápula. La presión firme suele estar bien." },
    felt: { en: "Between the shoulder blades, close to the spine.", es: "Entre las escápulas, cerca de la columna." },
    refers: ["shoulder-blade"]
  },
  {
    n: 3,
    id: "lower-trapezius",
    name: { en: "Lower trapezius", es: "Trapecio inferior" },
    group: "back",
    views: { back: { d: ["M148 158C138 161 126 166 116 170C118 176 122 182 126 190C134 210 142 236 148 262Z"], at: [138, 198], fibres: [-27] } },
    attaches: { en: "Spines of T4-T12 → the inner end of the shoulder blade's ridge.", es: "Apófisis espinosas de D4-D12 → el extremo interno de la espina de la escápula." },
    does: {
      en: "Pulls the shoulder blade down, and helps it rotate when you raise your arm.",
      es: "Lleva la escápula hacia abajo, y ayuda a rotarla al levantar el brazo."
    },
    nerve: { en: "Accessory nerve (cranial nerve XI); C3-C4 carry feeling from it.", es: "Nervio accesorio (par craneal XI); C3-C4 llevan su sensibilidad." },
    pressure: "firm",
    massage: { en: "Over the ribs beside the spine. Firm pressure is generally fine.", es: "Sobre las costillas junto a la columna. La presión firme suele estar bien." },
    felt: {
      en: "Up into the back of the neck, the top of the shoulder and between the shoulder blades.",
      es: "Hacia la nuca, la parte superior del hombro y entre las escápulas."
    },
    refers: ["back-of-neck", "upper-trapezius", "shoulder-blade"]
  },
  {
    n: 4,
    id: "levator-scapulae",
    name: { en: "Levator scapulae", es: "Elevador de la escápula" },
    group: "back",
    views: {
      back: { d: ["M174 92C178 91 182 92 184 94C188 112 192 130 192 146C192 152 190 158 188 162C186 150 184 140 182 130C180 118 176 104 174 92Z"], at: [184, 120], fibres: [-10] },
      side: { d: ["M134 110C138 110 142 111 146 113C140 140 130 166 118 190L110 188C120 164 128 138 134 110Z"], at: [127, 150], fibres: [25] }
    },
    attaches: {
      en: "Sides of the top four neck vertebrae (C1-C4) → the upper inner corner of the shoulder blade.",
      es: "Laterales de las cuatro primeras vértebras cervicales (C1-C4) → el ángulo superior interno de la escápula."
    },
    does: { en: "Lifts the shoulder blade, and tilts the neck to the same side.", es: "Eleva la escápula, e inclina el cuello hacia el mismo lado." },
    nerve: { en: "Branches of C3-C4, and the dorsal scapular nerve (C5).", es: "Ramas de C3-C4, y el nervio dorsal de la escápula (C5)." },
    pressure: "firm",
    massage: {
      en: "Often tender where it meets the shoulder blade. Firm pressure is generally fine.",
      es: "Suele estar sensible donde se une a la escápula. La presión firme suele estar bien."
    },
    felt: {
      en: "The angle where the neck meets the shoulder, and down the inner edge of the shoulder blade.",
      es: "El ángulo entre el cuello y el hombro, y a lo largo del borde interno de la escápula."
    },
    refers: ["upper-trapezius", "back-of-neck", "shoulder-blade"]
  },
  {
    n: 5,
    id: "rhomboids",
    name: { en: "Rhomboids", es: "Romboides" },
    group: "back",
    views: { back: { d: ["M152 128C164 136 176 144 186 150C186 180 192 212 202 240C186 222 168 202 152 184Z"], at: [170, 168], fibres: [-44] } },
    attaches: { en: "Spines of C7-T5 → the inner edge of the shoulder blade.", es: "Apófisis espinosas de C7-D5 → el borde interno de la escápula." },
    does: { en: "Pull the shoulder blade in toward the spine and slightly up.", es: "Llevan la escápula hacia la columna y algo hacia arriba." },
    nerve: { en: "Dorsal scapular nerve (C4-C5).", es: "Nervio dorsal de la escápula (C4-C5)." },
    pressure: "firm",
    massage: { en: "Worked through the trapezius. Firm pressure is generally fine.", es: "Se trabajan a través del trapecio. La presión firme suele estar bien." },
    felt: { en: "Along the inner edge of the shoulder blade.", es: "A lo largo del borde interno de la escápula." },
    refers: ["shoulder-blade"]
  },
  {
    n: 6,
    id: "supraspinatus",
    name: { en: "Supraspinatus", es: "Supraespinoso" },
    group: "back",
    views: { back: { d: ["M186 144C200 145 214 147 226 149C234 148 240 146 246 142C226 152 206 160 186 166Z"], at: [214, 152], fibres: [80] } },
    attaches: {
      en: "The hollow above the shoulder blade's ridge → the top of the upper-arm bone, passing under the acromion.",
      es: "La fosa por encima de la espina de la escápula → la parte superior del húmero, pasando bajo el acromion."
    },
    does: {
      en: "Starts lifting the arm out to the side, and keeps the ball of the shoulder in its socket.",
      es: "Inicia la elevación lateral del brazo y mantiene la cabeza del húmero en su cavidad."
    },
    nerve: { en: "Suprascapular nerve (C5-C6).", es: "Nervio supraescapular (C5-C6)." },
    pressure: "firm",
    massage: { en: "Under the trapezius, in a hollow of bone. Firm pressure is generally fine.", es: "Bajo el trapecio, en una fosa ósea. La presión firme suele estar bien." },
    felt: {
      en: "Deep in the shoulder and down the outside of the upper arm, sometimes to the elbow.",
      es: "En la profundidad del hombro y por la cara externa del brazo, a veces hasta el codo."
    },
    refers: ["shoulder-top", "outer-upper-arm"]
  },
  {
    n: 7,
    id: "infraspinatus",
    name: { en: "Infraspinatus", es: "Infraespinoso" },
    group: "back",
    views: {
      back: {
        d: ["M188 172C208 164 228 156 248 147C246 156 242 164 238 170C228 192 214 216 202 238C194 218 190 196 188 172Z", "M116 172C100 166 84 158 66 150C68 162 72 170 74 178C82 196 92 214 100 230C104 214 110 196 120 184Z"],
        at: [214, 190],
        fibres: [39, -39]
      }
    },
    attaches: {
      en: "The hollow below the shoulder blade's ridge → the back of the top of the upper-arm bone.",
      es: "La fosa por debajo de la espina de la escápula → la parte posterior de la cabeza del húmero."
    },
    does: { en: "Turns the arm outward and steadies the shoulder joint.", es: "Rota el brazo hacia fuera y estabiliza la articulación del hombro." },
    nerve: { en: "Suprascapular nerve (C5-C6).", es: "Nervio supraescapular (C5-C6)." },
    pressure: "firm",
    massage: { en: "Over the flat of the shoulder blade, so firm pressure is generally fine. Often tender.", es: "Sobre la parte plana de la escápula, así que la presión firme suele estar bien. Suele estar sensible." },
    felt: {
      en: "Deep in the front of the shoulder and down the front and outside of the arm, sometimes into the thumb side of the forearm.",
      es: "En la profundidad de la parte delantera del hombro y por la cara anterior y externa del brazo, a veces hasta el antebrazo del lado del pulgar."
    },
    refers: ["shoulder-top", "outer-upper-arm", "outer-forearm"]
  },
  {
    n: 8,
    id: "splenius",
    name: { en: "Splenius capitis", es: "Esplenio de la cabeza" },
    group: "back",
    views: {
      back: { d: ["M152 120L152 156C162 146 172 128 180 110C184 102 188 94 190 88L180 86C174 98 166 108 152 120Z"], at: [159, 138], fibres: [28] },
      side: { d: ["M118 100C124 99 130 100 136 102C132 114 126 126 120 136C118 124 118 112 118 100Z"], at: [124, 112], fibres: [23] }
    },
    attaches: {
      en: "The ligament down the back of the neck and the spines of C7-T3 → the bony bump behind the ear (mastoid).",
      es: "El ligamento de la nuca y las apófisis espinosas de C7-D3 → el relieve óseo detrás de la oreja (mastoides)."
    },
    does: { en: "Tips the head back and turns it to the same side.", es: "Inclina la cabeza hacia atrás y la gira hacia el mismo lado." },
    nerve: { en: "Back branches of the middle neck nerves.", es: "Ramas posteriores de los nervios cervicales medios." },
    pressure: "firm",
    massage: { en: "Lies under the trapezius and is worked through it.", es: "Está debajo del trapecio y se trabaja a través de él." },
    felt: { en: "Toward the top of the head.", es: "Hacia la parte superior de la cabeza." },
    refers: ["occiput"]
  },
  {
    n: 9,
    id: "semispinalis",
    name: { en: "Semispinalis capitis", es: "Semiespinoso de la cabeza" },
    group: "back",
    views: { back: { d: ["M152 100C158 101 164 101 168 100C168 120 164 142 158 166L152 166Z"], at: [157, 108], fibres: [0] } },
    attaches: {
      en: "The upper back and lower neck vertebrae → the base of the skull.",
      es: "Las vértebras dorsales altas y cervicales bajas → la base del cráneo."
    },
    does: { en: "The main muscle that tips the head back and holds it up.", es: "El músculo principal que inclina la cabeza hacia atrás y la sostiene." },
    nerve: { en: "Back branches of the neck nerves.", es: "Ramas posteriores de los nervios cervicales." },
    pressure: "firm",
    massage: { en: "Under the trapezius and splenius, beside the spine; worked through them.", es: "Bajo el trapecio y el esplenio, junto a la columna; se trabaja a través de ellos." },
    felt: { en: "A band around the side of the head toward the temple.", es: "Una banda alrededor del lateral de la cabeza hacia la sien." },
    refers: ["occiput", "face"]
  },
  {
    n: 10,
    id: "suboccipitals",
    name: { en: "Suboccipital muscles", es: "Músculos suboccipitales" },
    group: "back",
    views: { back: { d: ["M152 88C160 86 166 86 172 87L170 95C166 99 160 101 154 101Z"], at: [162, 93], fibres: [-50] } },
    attaches: {
      en: "Four small muscles between the top two vertebrae (C1, C2) and the skull.",
      es: "Cuatro músculos pequeños entre las dos primeras vértebras (C1, C2) y el cráneo."
    },
    does: { en: "Fine-tune nodding and turning of the head.", es: "Ajustan con precisión el asentir y el girar de la cabeza." },
    nerve: { en: "Suboccipital nerve (C1).", es: "Nervio suboccipital (C1)." },
    pressure: "gentle",
    massage: {
      en: "Deep under the base of the skull. The vertebral artery runs beneath them on its way into the skull: gentle, sustained pressure is enough.",
      es: "En la profundidad bajo la base del cráneo. La arteria vertebral pasa por debajo de ellos camino del cráneo: basta con una presión suave y mantenida."
    },
    felt: { en: "Deep in the head, from the base of the skull toward the eye.", es: "En la profundidad de la cabeza, desde la base del cráneo hacia el ojo." },
    refers: ["occiput", "face"]
  },
  {
    n: 11,
    id: "scm",
    name: { en: "Sternocleidomastoid", es: "Esternocleidomastoideo" },
    group: "neck",
    views: {
      side: { d: ["M130 92C136 91 142 92 146 94C162 124 180 156 198 190L172 196C166 172 156 150 146 132C140 120 134 106 130 92Z"], at: [160, 140], fibres: [-27] },
      front: {
        d: [
          "M112 82C116 82 120 82 124 84C130 120 138 154 148 186L140 190C136 182 132 178 128 176C126 180 124 184 122 188L114 186C116 176 118 166 118 156C116 130 114 106 112 82Z",
          "M188 82C184 82 180 82 176 84C170 120 162 154 152 186L160 190C164 182 168 178 172 176C174 180 176 184 178 188L186 186C184 176 182 166 182 156C184 130 186 106 188 82Z"
        ],
        at: [175, 132],
        fibres: [-13, 13]
      }
    },
    attaches: {
      en: "Breastbone and the inner end of the collarbone → the bony bump behind the ear (mastoid).",
      es: "Esternón y extremo interno de la clavícula → el relieve óseo detrás de la oreja (mastoides)."
    },
    does: {
      en: "Turns the face to the other side and tilts the head to its own side; both together bend the neck forward.",
      es: "Gira la cara hacia el lado contrario e inclina la cabeza hacia su lado; los dos juntos flexionan el cuello."
    },
    nerve: { en: "Accessory nerve (cranial nerve XI); C2-C3 carry feeling from it.", es: "Nervio accesorio (par craneal XI); C2-C3 llevan su sensibilidad." },
    pressure: "gentle",
    massage: {
      en: "Worked by gently holding it between finger and thumb. The carotid artery runs just in front of and beneath it: no deep or prolonged pressure on the front of the neck.",
      es: "Se trabaja sujetándolo con suavidad entre el pulgar y los dedos. La arteria carótida pasa justo por delante y por debajo: nada de presión profunda ni prolongada en la parte delantera del cuello."
    },
    felt: { en: "Around the eye, the forehead and the cheek, and behind the ear.", es: "Alrededor del ojo, la frente y la mejilla, y detrás de la oreja." },
    refers: ["face", "occiput", "neck-front"]
  },
  {
    n: 12,
    id: "anterior-scalene",
    name: { en: "Anterior scalene", es: "Escaleno anterior" },
    group: "neck",
    views: {
      side: { d: ["M152 122L160 122C162 146 164 170 166 194L156 194C154 170 152 146 152 122Z"], at: [159, 178], fibres: [-4] },
      front: { d: ["M176 122C179 122 182 122 184 123C186 146 188 168 190 192L182 192C180 168 178 146 176 122Z"], at: [186, 168], fibres: [-6] }
    },
    attaches: { en: "Sides of C3-C6 → the first rib.", es: "Laterales de C3-C6 → la primera costilla." },
    does: {
      en: "Tilts the neck to the side, and lifts the first rib when you breathe hard.",
      es: "Inclina el cuello hacia un lado, y eleva la primera costilla al respirar con fuerza."
    },
    nerve: { en: "Front branches of C4-C6.", es: "Ramas anteriores de C4-C6." },
    pressure: "gentle",
    massage: {
      en: "The nerves to the arm come out between this muscle and the middle scalene. Firm pressure here can set off tingling down the arm: gentle only, and stop if the arm reacts.",
      es: "Los nervios del brazo salen entre este músculo y el escaleno medio. La presión firme aquí puede provocar hormigueo en el brazo: solo suave, y para si el brazo reacciona."
    },
    felt: {
      en: "The chest, the front and back of the upper arm, the thumb side of the forearm into the thumb and index finger, and the inner edge of the shoulder blade.",
      es: "El pecho, la cara anterior y posterior del brazo, el antebrazo del lado del pulgar hasta el pulgar y el índice, y el borde interno de la escápula."
    },
    refers: ["upper-chest", "chest", "outer-upper-arm", "back-upper-arm", "outer-forearm", "thumb", "index", "shoulder-blade"]
  },
  {
    n: 13,
    id: "middle-scalene",
    name: { en: "Middle scalene", es: "Escaleno medio" },
    group: "neck",
    views: {
      side: { d: ["M142 120C146 120 150 120 152 121C152 146 150 170 148 194L136 194C138 170 140 146 142 120Z"], at: [145, 162], fibres: [4] },
      front: { d: ["M186 118C189 118 192 118 194 120C198 144 202 168 206 192L196 192C192 168 190 144 186 118Z"], at: [195, 150], fibres: [-12] }
    },
    attaches: { en: "Sides of C2-C7 → the first rib, behind the anterior scalene.", es: "Laterales de C2-C7 → la primera costilla, por detrás del escaleno anterior." },
    does: {
      en: "Tilts the neck to the side, and lifts the first rib when you breathe hard.",
      es: "Inclina el cuello hacia un lado, y eleva la primera costilla al respirar con fuerza."
    },
    nerve: { en: "Front branches of C3-C8.", es: "Ramas anteriores de C3-C8." },
    pressure: "gentle",
    massage: {
      en: "The nerves to the arm run along its front edge. Gentle only, and stop if the arm tingles.",
      es: "Los nervios del brazo pasan por su borde anterior. Solo suave, y para si el brazo hormiguea."
    },
    felt: {
      en: "The chest, the front and back of the upper arm, the thumb side of the forearm into the thumb and index finger, and the inner edge of the shoulder blade.",
      es: "El pecho, la cara anterior y posterior del brazo, el antebrazo del lado del pulgar hasta el pulgar y el índice, y el borde interno de la escápula."
    },
    refers: ["upper-chest", "chest", "outer-upper-arm", "back-upper-arm", "outer-forearm", "thumb", "index", "shoulder-blade"]
  },
  {
    n: 14,
    id: "posterior-scalene",
    name: { en: "Posterior scalene", es: "Escaleno posterior" },
    group: "neck",
    views: {
      side: { d: ["M134 128C137 128 140 128 142 128C140 150 136 172 130 194L122 194C126 172 130 150 134 128Z"], at: [128, 180], fibres: [8] },
      front: { d: ["M196 126L202 128C208 150 214 170 220 192L212 192C206 172 200 150 196 126Z"], at: [211, 176], fibres: [-16] }
    },
    attaches: { en: "Sides of C4-C6 → the second rib.", es: "Laterales de C4-C6 → la segunda costilla." },
    does: { en: "Tilts the neck to the side, and lifts the second rib when you breathe hard.", es: "Inclina el cuello hacia un lado, y eleva la segunda costilla al respirar con fuerza." },
    nerve: { en: "Front branches of C6-C8.", es: "Ramas anteriores de C6-C8." },
    pressure: "gentle",
    massage: { en: "Close to the nerves to the arm: gentle only.", es: "Cerca de los nervios del brazo: solo suave." },
    felt: {
      en: "The chest, the front and back of the upper arm, the thumb side of the forearm into the thumb and index finger, and the inner edge of the shoulder blade.",
      es: "El pecho, la cara anterior y posterior del brazo, el antebrazo del lado del pulgar hasta el pulgar y el índice, y el borde interno de la escápula."
    },
    refers: ["upper-chest", "chest", "outer-upper-arm", "back-upper-arm", "outer-forearm", "thumb", "index", "shoulder-blade"]
  },
  {
    n: 15,
    id: "platysma",
    name: { en: "Platysma", es: "Platisma" },
    group: "neck",
    views: {
      side: { d: ["M150 112C166 118 184 120 198 116C202 150 208 184 214 220C200 224 184 226 168 224C166 190 160 150 150 112Z"], at: [192, 208] },
      front: { d: ["M114 92C124 100 136 106 146 108C146 136 146 160 146 186C128 200 104 216 84 230C80 214 76 200 74 190C90 164 104 128 114 92Z"], at: [100, 204] }
    },
    attaches: {
      en: "A thin sheet in the skin, from the upper chest → the jaw and the corners of the mouth.",
      es: "Una lámina fina en la piel, desde la parte alta del pecho → la mandíbula y las comisuras de la boca."
    },
    does: { en: "Tightens the skin of the neck and pulls the corners of the mouth down.", es: "Tensa la piel del cuello y baja las comisuras de la boca." },
    nerve: { en: "Facial nerve (cranial nerve VII).", es: "Nervio facial (par craneal VII)." },
    pressure: "gentle",
    massage: { en: "So thin it sits in the skin: light strokes only.", es: "Tan fino que está en la piel: solo roces suaves." },
    felt: null,
    refers: []
  },
  {
    n: 16,
    id: "infrahyoids",
    name: { en: "Infrahyoid (strap) muscles", es: "Músculos infrahioideos" },
    group: "neck",
    views: {
      side: { d: ["M168 124C172 123 176 122 180 122C184 146 188 168 194 190L188 192C182 170 176 148 168 124Z"], at: [179, 136], fibres: [-14] },
      front: { d: ["M140 118H149V186H141C140 162 140 140 140 118Z", "M160 118H151V186H159C160 162 160 140 160 118Z"], at: [150, 142], fibres: [0, 0] }
    },
    attaches: {
      en: "The hyoid bone and voice box → the breastbone and shoulder blade (four thin muscles).",
      es: "El hueso hioides y la laringe → el esternón y la escápula (cuatro músculos finos)."
    },
    does: { en: "Pull the hyoid bone and voice box down when you swallow and speak.", es: "Bajan el hioides y la laringe al tragar y al hablar." },
    nerve: { en: "Ansa cervicalis (C1-C3).", es: "Asa cervical (C1-C3)." },
    pressure: "avoid",
    massage: {
      en: "Over the windpipe and thyroid gland, between the carotid arteries: not for massage.",
      es: "Sobre la tráquea y la glándula tiroides, entre las arterias carótidas: no son para masaje."
    },
    felt: null,
    refers: []
  },
  {
    n: 17,
    id: "longus-colli",
    name: { en: "Longus colli", es: "Largo del cuello" },
    group: "neck",
    views: { front: { d: ["M144 108L156 108L158 206L142 206Z"], at: [150, 200], hidden: true } },
    attaches: { en: "Along the front of the vertebrae, from T3 up to C1.", es: "Por delante de las vértebras, desde D3 hasta C1." },
    does: { en: "Bends the neck forward and holds its curve from the front.", es: "Flexiona el cuello y sostiene su curva desde delante." },
    nerve: { en: "Front branches of C2-C6.", es: "Ramas anteriores de C2-C6." },
    pressure: "avoid",
    massage: {
      en: "Lies behind the windpipe and gullet, against the spine: it can't be reached safely by massage.",
      es: "Está detrás de la tráquea y el esófago, pegado a la columna: no se puede alcanzar con seguridad con un masaje."
    },
    felt: null,
    refers: []
  },
  {
    n: 18,
    id: "pectoralis-minor",
    name: { en: "Pectoralis minor", es: "Pectoral menor" },
    group: "chest",
    views: { front: { d: ["M176 236C178 246 182 256 186 264L200 262C206 240 212 220 220 202L212 198C200 210 188 222 176 236Z"], at: [194, 238], fibres: [35] } },
    attaches: {
      en: "Ribs 3-5 → the coracoid, a hook of bone at the front of the shoulder blade.",
      es: "Costillas 3-5 → la apófisis coracoides, un gancho óseo en la parte delantera de la escápula."
    },
    does: { en: "Draws the shoulder blade forward and down.", es: "Lleva la escápula hacia delante y hacia abajo." },
    nerve: { en: "Medial pectoral nerve (C8-T1).", es: "Nervio pectoral medial (C8-D1)." },
    pressure: "gentle",
    massage: {
      en: "Worked through the chest muscle in front of it. The nerves and blood vessels to the arm run under it: stop if the arm tingles or goes numb.",
      es: "Se trabaja a través del pectoral mayor que lo cubre. Los nervios y vasos del brazo pasan por debajo: para si el brazo hormiguea o se adormece."
    },
    felt: {
      en: "The front of the shoulder and the chest, and down the inner arm to the middle, ring and little fingers.",
      es: "La parte delantera del hombro y el pecho, y por la cara interna del brazo hasta los dedos medio, anular y meñique."
    },
    refers: ["upper-chest", "chest", "inner-upper-arm", "inner-forearm", "middle", "ring", "little"]
  }
];

/**
 * Painted deepest first, so a muscle that lies over another covers it. The
 * picked muscle is painted last of all, so it can always be seen whole.
 */
export const PAINT_ORDER: readonly MuscleId[] = [
  "suboccipitals",
  "longus-colli",
  "semispinalis",
  "splenius",
  "anterior-scalene",
  "middle-scalene",
  "posterior-scalene",
  "levator-scapulae",
  "rhomboids",
  "supraspinatus",
  "infraspinatus",
  "pectoralis-minor",
  "infrahyoids",
  "lower-trapezius",
  "middle-trapezius",
  "upper-trapezius",
  "scm",
  "platysma"
];

export function muscleById(id: string): Muscle | undefined {
  return MUSCLES.find((m) => m.id === id);
}

/** The roots that carry arm and neck feeling: C1 to T1. */
const NECK_ROOTS = ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "T1"];

/**
 * The neck roots that the body map gives full weight in any of the areas a
 * muscle's pain is mapped to: the trapped-nerve patterns it can be mistaken
 * for. Chest roots are left out, since the question is "is it my neck?".
 */
export function lookalikeRoots(m: Muscle): string[] {
  const roots = new Set<string>();
  for (const id of m.refers) for (const [root, weight] of regionById(id)?.roots ?? []) if (weight >= 1 && NECK_ROOTS.includes(root)) roots.add(root);
  return NECK_ROOTS.filter((r) => roots.has(r));
}

export const MUSCLE_GROUPS: Record<MuscleGroup, L> = {
  back: { en: "Back of the neck and shoulder blades", es: "Nuca y escápulas" },
  neck: { en: "Side and front of the neck", es: "Lateral y parte delantera del cuello" },
  chest: { en: "Chest", es: "Pecho" }
};

export const PRESSURE: Record<Pressure, { name: L; icon: string }> = {
  firm: { name: { en: "Firm pressure is fine", es: "Presión firme: bien" }, icon: "✓" },
  gentle: { name: { en: "Gentle only", es: "Solo suave" }, icon: "!" },
  avoid: { name: { en: "No pressure", es: "Sin presión" }, icon: "✕" }
};

export const NECK_MUSCLE_COPY = {
  view: { en: "View", es: "Vista" },
  views: {
    back: { en: "Back", es: "Espalda" },
    side: { en: "Side", es: "Lateral" },
    front: { en: "Front", es: "Frente" }
  },
  mode: { en: "Show", es: "Mostrar" },
  modes: {
    muscles: { en: "Muscles", es: "Músculos" },
    pressure: { en: "Pressure guide", es: "Guía de presión" }
  },
  surface: { en: "Surface", es: "Superficie" },
  deeper: { en: "Deeper", es: "Más profundo" },
  hidden: { en: "Dashed: too deep to see from here", es: "Discontinuo: demasiado profundo para verse desde aquí" },
  key: { en: "Key: tap any muscle", es: "Leyenda: toca cualquier músculo" },
  attaches: { en: "Attaches", es: "Se inserta" },
  does: { en: "What it does", es: "Qué hace" },
  nerve: { en: "Nerve supply", es: "Inervación" },
  massage: { en: "For the massage", es: "Para el masaje" },
  felt: { en: "Where its pain is often felt", es: "Dónde se suele sentir su dolor" },
  noMap: { en: "The trigger point manual gives no pain map for this muscle.", es: "El manual de puntos gatillo no da un mapa de dolor para este músculo." },
  figureLegend: { en: "Where pain from this muscle is often felt", es: "Dónde se suele sentir el dolor de este músculo" },
  lookalike: {
    en: "On the body map, the same areas belong to these nerve roots. A trapped root there can feel like this muscle, and the other way round:",
    es: "En el mapa del cuerpo, las mismas zonas corresponden a estas raíces nerviosas. Una raíz atrapada ahí puede sentirse como este músculo, y al revés:"
  },
  exam: {
    en: "That's why an examination for arm pain checks the nerve (strength, reflexes and feeling), not only the muscle.",
    es: "Por eso la exploración del dolor de brazo revisa el nervio (fuerza, reflejos y sensibilidad), no solo el músculo."
  },
  mapCaveat: {
    en: "These pain maps come from one clinical manual. Examiners often disagree on where trigger points are, and the theory behind them is disputed. Read them as where people often feel it, not as a diagnosis.",
    es: "Estos mapas de dolor vienen de un manual clínico. Los examinadores a menudo no coinciden en dónde están los puntos gatillo, y la teoría que los explica está en discusión. Léelos como dónde se suele sentir, no como un diagnóstico."
  },
  carotid: { en: "Carotid artery", es: "Arteria carótida" },
  plexus: { en: "Nerves to the arm", es: "Nervios del brazo" },
  windpipe: { en: "Windpipe and thyroid", es: "Tráquea y tiroides" },
  figure: { en: "Neck and shoulder muscles", es: "Músculos del cuello y el hombro" },
  evidence: {
    en: "Massage often feels good, but trials for neck pain are small and mixed: a Cochrane review couldn't recommend it either way.",
    es: "El masaje suele sentar bien, pero los ensayos para el dolor de cuello son pequeños y dispares: una revisión Cochrane no pudo recomendarlo ni desaconsejarlo."
  }
} as const;

export const NECK_MUSCLE_SOURCES: readonly SourceId[] = ["standring2020", "patel2012"];
export const MUSCLE_MAP_SOURCES: readonly SourceId[] = ["simons1999", "lucas2009", "quintner2015", "blanpied2017"];
