import type { L } from "./i18n";

/**
 * Every phrase the interface shows, in both languages. Components never carry
 * their own strings: if it is on screen, it is here, and the bilingual test
 * reads it.
 */
export const BRAND = "RootAtlas";

export const COPY = {
  meta: {
    title: { en: "RootAtlas — understand your spine, check your care", es: "RootAtlas — entiende tu columna, revisa tu tratamiento" },
    description: {
      en: "An interactive guide to the spine and nerve roots for people seeing a chiropractor, physiotherapist or osteopath — with a posture-report decoder and a tracker that tells you whether treatment is working.",
      es: "Una guía interactiva de la columna y las raíces nerviosas para quienes acuden a un quiropráctico, fisioterapeuta u osteópata, con un decodificador de informes posturales y un seguimiento que te dice si el tratamiento funciona."
    }
  },
  nav: {
    home: { en: "Home", es: "Inicio" },
    spine: { en: "Spine", es: "Columna" },
    map: { en: "Where it hurts", es: "Dónde duele" },
    report: { en: "Posture report", es: "Informe postural" },
    tracker: { en: "Is it working?", es: "¿Funciona?" },
    flags: { en: "Warning signs", es: "Señales de alarma" },
    clinicians: { en: "Who to see", es: "A quién acudir" },
    evidence: { en: "What works", es: "Qué funciona" },
    about: { en: "About", es: "Acerca de" },
    menu: { en: "Menu", es: "Menú" },
    language: { en: "Español", es: "English" },
    skip: { en: "Skip to content", es: "Saltar al contenido" }
  },
  common: {
    tagline: { en: "Your spine, your nerves, your evidence.", es: "Tu columna, tus nervios, tu evidencia." },
    disclaimer: {
      en: "Education and self-tracking, not a diagnosis. If anything on the warning-signs list applies to you, get medical help.",
      es: "Educación y autoseguimiento, no un diagnóstico. Si te aplica algo de la lista de señales de alarma, busca ayuda médica."
    },
    privacy: { en: "Nothing you enter leaves this device. No account, no server.", es: "Nada de lo que escribes sale de este dispositivo. Sin cuenta, sin servidor." },
    sources: { en: "Sources", es: "Fuentes" },
    clear: { en: "Clear", es: "Borrar" },
    remove: { en: "Remove", es: "Quitar" },
    save: { en: "Save", es: "Guardar" },
    right: { en: "Right", es: "Derecha" },
    left: { en: "Left", es: "Izquierda" },
    yourRight: { en: "Your right", es: "Tu derecha" },
    yourLeft: { en: "Your left", es: "Tu izquierda" },
    open: { en: "Open", es: "Abrir" },
    seeWarnings: { en: "See all warning signs", es: "Ver todas las señales de alarma" },
    reviewed: {
      en: "Evidence summaries last reviewed October 2026. Pending review by a licensed clinician before public launch.",
      es: "Resúmenes de evidencia revisados por última vez en octubre de 2026. Pendientes de revisión por un profesional sanitario colegiado antes del lanzamiento público."
    },
    footerBuilt: { en: "Built from one patient's real questions. Open about its sources and its limits.", es: "Creado a partir de las preguntas reales de un paciente. Transparente sobre sus fuentes y sus límites." }
  },
  home: {
    eyebrow: { en: "For anyone in chiropractic, physio or osteopathic care", es: "Para quien está en tratamiento quiropráctico, de fisioterapia u osteopatía" },
    title: { en: "Know what's trapped. Read your report. Prove it's working.", es: "Entiende qué está atrapado. Lee tu informe. Comprueba si funciona." },
    lead: {
      en: "Clinics hand you a poster, a posture scan full of numbers and a package of sessions. RootAtlas turns that into three answers you can check yourself — and questions worth asking.",
      es: "Las clínicas te dan un póster, un escáner postural lleno de números y un paquete de sesiones. RootAtlas lo convierte en tres respuestas que puedes comprobar tú mismo, y en preguntas que vale la pena hacer."
    },
    ctaMap: { en: "Start with where it hurts", es: "Empieza por dónde duele" },
    ctaTracker: { en: "Track if it's working", es: "Sigue si funciona" },
    storyTitle: { en: "Built from one real case", es: "Creado a partir de un caso real" },
    story: {
      en: "A trapped nerve in the neck. Eighteen chiropractic adjustments paid upfront: S/ 1,550, about S/ 86 a session. A five-page posture report. And three questions nobody answered clearly:",
      es: "Un nervio atrapado en el cuello. Dieciocho ajustes quiroprácticos pagados por adelantado: S/ 1,550, unos S/ 86 por sesión. Un informe postural de cinco páginas. Y tres preguntas que nadie respondió con claridad:"
    },
    q1: { en: "Which nerve, exactly — and how would anyone know?", es: "¿Qué nervio exactamente, y cómo se sabe?" },
    q2: { en: "Do these posture numbers mean anything?", es: "¿Significan algo estos números de postura?" },
    q3: { en: "After six sessions, is this working — or just costing?", es: "Después de seis sesiones, ¿esto funciona o solo cuesta?" },
    toolsTitle: { en: "Tools", es: "Herramientas" },
    toolSpine: { en: "Tap any vertebra from C1 to the tailbone: which nerve roots leave there, what they supply, and what the poster on the wall got right.", es: "Toca cualquier vértebra de C1 al cóccix: qué raíces salen ahí, qué inervan y qué acertó el póster de la pared." },
    toolMap: { en: "Tap where you feel pain, numbness or tingling. See which nerve roots usually serve that area, and what a proper exam checks.", es: "Toca dónde sientes dolor, adormecimiento u hormigueo. Mira qué raíces suelen inervar esa zona y qué revisa una buena exploración." },
    toolReport: { en: "Enter your posture scan. RootAtlas checks it against itself — the left and right photos measure the same body — and tells you its real margin of error.", es: "Introduce tu escáner postural. RootAtlas lo contrasta consigo mismo (las fotos izquierda y derecha miden el mismo cuerpo) y te dice su margen de error real." },
    toolTracker: { en: "Score pain and function weekly. RootAtlas measures change against published thresholds, works out what each point of improvement cost, and flags when to ask questions.", es: "Puntúa dolor y función cada semana. RootAtlas mide el cambio frente a umbrales publicados, calcula cuánto costó cada punto de mejoría y avisa cuándo preguntar." },
    toolFlags: { en: "The signs that mean stop tracking and get medical help — with why each one matters.", es: "Los signos que significan dejar de registrar y buscar ayuda médica, y por qué importa cada uno." },
    toolEvidence: { en: "Manipulation, exercise, traction, collars, surgery, X-rays: what the research actually supports, with sources.", es: "Manipulación, ejercicio, tracción, collarín, cirugía, radiografías: lo que la investigación respalda de verdad, con fuentes." },
    toolClinicians: { en: "Chiropractor, physio, osteopath, physiatrist, neurologist: who can diagnose, who can order a scan, and what to ask each.", es: "Quiropráctico, fisioterapeuta, osteópata, fisiatra, neurólogo: quién puede diagnosticar, quién puede pedir una resonancia y qué preguntar a cada uno." },
    privacyTitle: { en: "Private by construction", es: "Privado por diseño" },
    privacyBody: {
      en: "There is no account and no server. Your scores and reports live in this browser only. Export them to a file whenever you like; delete them with one button.",
      es: "No hay cuenta ni servidor. Tus puntuaciones e informes viven solo en este navegador. Expórtalos a un archivo cuando quieras; bórralos con un botón."
    }
  },
  spine: {
    title: { en: "The spine, level by level", es: "La columna, nivel por nivel" },
    lead: {
      en: "Tap a vertebra or a nerve-root dot. Seven neck vertebrae but eight neck nerve roots — so the numbering shifts at C8, and a 'C5-C6 disc' usually means the C6 root.",
      es: "Toca una vértebra o un punto de raíz nerviosa. Siete vértebras cervicales pero ocho raíces cervicales: por eso la numeración cambia en C8, y un 'disco C5-C6' suele significar la raíz C6."
    },
    whole: { en: "Whole spine", es: "Toda la columna" },
    front: { en: "Front of body", es: "Parte delantera" },
    back: { en: "Back", es: "Espalda" },
    rootDot: { en: "Nerve root exit", es: "Salida de raíz nerviosa" },
    pick: { en: "Tap a vertebra or nerve root to see what's there.", es: "Toca una vértebra o una raíz nerviosa para ver qué hay." },
    facts: { en: "Facts", es: "Datos" },
    rootsHere: { en: "Nerve roots at this level", es: "Raíces nerviosas en este nivel" },
    leavesAbove: { en: "Leaves above it", es: "Sale por encima" },
    leavesBelow: { en: "Leaves below it", es: "Sale por debajo" },
    discBelow: { en: "Disc below", es: "Disco inferior" },
    discAffects: { en: "a bulge here usually affects the {root} root", es: "una hernia aquí suele afectar a la raíz {root}" },
    autonomic: { en: "Automatic (autonomic) wiring from this level", es: "Conexiones automáticas (autonómicas) de este nivel" },
    sympathetic: { en: "Sympathetic ('fight or flight')", es: "Simpático ('lucha o huida')" },
    parasympathetic: { en: "Parasympathetic ('rest and digest')", es: "Parasimpático ('reposo y digestión')" },
    wiringCaveat: {
      en: "This wiring is real anatomy — it is what the nervous-system poster on many clinic walls shows. But there is no good evidence that adjusting a vertebra changes how these organs work.",
      es: "Estas conexiones son anatomía real; es lo que muestra el póster del sistema nervioso en las paredes de muchas clínicas. Pero no hay buena evidencia de que ajustar una vértebra cambie cómo funcionan estos órganos."
    },
    rootTitle: { en: "{root} nerve root", es: "Raíz nerviosa {root}" },
    exitsBetween: { en: "Leaves the spine between {a} and {b}", es: "Sale de la columna entre {a} y {b}" },
    skull: { en: "the skull", es: "el cráneo" },
    sacrumName: { en: "the sacrum", es: "el sacro" },
    sacralExit: { en: "Leaves through the openings in the sacrum", es: "Sale por los orificios del sacro" },
    sensory: { en: "Feeling (skin)", es: "Sensibilidad (piel)" },
    motor: { en: "Movement (muscles)", es: "Movimiento (músculos)" },
    reflex: { en: "Reflex", es: "Reflejo" },
    noReflex: { en: "No reliable reflex", es: "Sin reflejo fiable" },
    typicalDisc: { en: "Usual culprit", es: "Causa habitual" },
    areas: { en: "Areas on the body map", es: "Zonas en el mapa corporal" },
    openMap: { en: "Open the body map", es: "Abrir el mapa corporal" },
    backToVertebra: { en: "Back to {v}", es: "Volver a {v}" },
    zoom: { en: "Zoom", es: "Zoom" },
    short: {
      cervical: { en: "Cervical", es: "Cervical" },
      thoracic: { en: "Thoracic", es: "Dorsal" },
      lumbar: { en: "Lumbar", es: "Lumbar" },
      sacral: { en: "Sacrum", es: "Sacro" },
      coccyx: { en: "Coccyx", es: "Cóccix" },
      pelvis: { en: "Sacrum & coccyx", es: "Sacro y cóccix" }
    }
  },
  map: {
    title: { en: "Where do you feel it?", es: "¿Dónde lo sientes?" },
    lead: {
      en: "Tap every area where you feel symptoms, on the side you feel them. RootAtlas shows which nerve roots usually serve those areas. Different maps disagree at the edges and people vary — this is a starting point for a conversation, not a diagnosis.",
      es: "Toca cada zona donde sientes síntomas, en el lado donde los sientes. RootAtlas muestra qué raíces nerviosas suelen inervar esas zonas. Los mapas difieren en los bordes y cada persona es distinta: es un punto de partida para conversar, no un diagnóstico."
    },
    viewFront: { en: "Front", es: "Delante" },
    viewBack: { en: "Back", es: "Detrás" },
    viewHand: { en: "Hand", es: "Mano" },
    whichHand: { en: "Which hand?", es: "¿Qué mano?" },
    handHint: { en: "Palm up, as you look at your own hand.", es: "Palma hacia arriba, como miras tu propia mano." },
    symptomsLabel: { en: "What do you feel?", es: "¿Qué sientes?" },
    selected: { en: "Selected areas", es: "Zonas seleccionadas" },
    none: { en: "Nothing selected yet. Tap the body.", es: "Aún no hay nada seleccionado. Toca el cuerpo." },
    results: { en: "Nerve roots that usually serve these areas", es: "Raíces nerviosas que suelen inervar estas zonas" },
    noMatch: { en: "These areas don't point to a spinal nerve root.", es: "Estas zonas no apuntan a una raíz nerviosa espinal." },
    pickSymptom: { en: "Choose at least one symptom to see matches.", es: "Elige al menos un síntoma para ver coincidencias." },
    fit: {
      strong: { en: "Strong fit", es: "Encaja bien" },
      fits: { en: "Fits", es: "Encaja" },
      weak: { en: "Partial", es: "Parcial" }
    },
    matchedBy: { en: "Matched by", es: "Coincide por" },
    seeSpine: { en: "See it on the spine", es: "Verla en la columna" },
    examTitle: { en: "Did your clinician check these?", es: "¿Te revisaron esto?" },
    advice: { en: "Read this first", es: "Lee esto primero" },
    list: { en: "Pick from a list instead", es: "Elegir de una lista" },
    hover: { en: "Tap an area", es: "Toca una zona" },
    centre: { en: "Middle", es: "Centro" }
  },
  report: {
    title: { en: "Decode your posture report", es: "Decodifica tu informe postural" },
    lead: {
      en: "Photo-based posture scans measure landmarks on four photos. The left and right side photos measure the same head, shoulders, hips and knees moments apart — so how much they disagree is the scan's real margin of error. RootAtlas uses that to tell you which numbers mean something.",
      es: "Los escáneres posturales con fotos miden puntos sobre cuatro fotografías. Las fotos laterales izquierda y derecha miden la misma cabeza, hombros, caderas y rodillas con segundos de diferencia: lo que discrepan es el margen de error real del escáner. RootAtlas lo usa para decirte qué números significan algo."
    },
    loadSample: { en: "Load the sample report", es: "Cargar el informe de ejemplo" },
    sampleNote: {
      en: "The sample is a real PostureScreen report from a Lima clinic (September 2026), anonymised, given to a patient with a trapped nerve in the neck.",
      es: "El ejemplo es un informe real de PostureScreen de una clínica de Lima (septiembre de 2026), anonimizado, entregado a un paciente con un nervio atrapado en el cuello."
    },
    blank: { en: "Start blank", es: "Empezar en blanco" },
    date: { en: "Scan date", es: "Fecha del escáner" },
    numbersTitle: { en: "The numbers on the report", es: "Los números del informe" },
    rightView: { en: "Right side photo", es: "Foto lateral derecha" },
    leftView: { en: "Left side photo", es: "Foto lateral izquierda" },
    anteriorView: { en: "Front photo", es: "Foto anterior (de frente)" },
    posteriorView: { en: "Back photo", es: "Foto posterior (de espaldas)" },
    printedAverage: { en: "'Averaged lateral' table (if printed)", es: "Tabla de 'desplazamientos laterales promediados' (si aparece)" },
    headWeight: { en: "Effective head weight (if printed)", es: "Peso efectivo de la cabeza (si aparece)" },
    effectiveKg: { en: "Effective (kg)", es: "Efectivo (kg)" },
    baselineKg: { en: "Instead of (kg)", es: "En lugar de (kg)" },
    translation: { en: "Shift (cm)", es: "Traslación (cm)" },
    angulation: { en: "Tilt (°)", es: "Angulación (°)" },
    forward: { en: "forward", es: "hacia delante" },
    backward: { en: "backward", es: "hacia atrás" },
    flexed: { en: "flexed", es: "flexionado" },
    extended: { en: "extended", es: "extendido" },
    toRight: { en: "to the right", es: "a la derecha" },
    toLeft: { en: "to the left", es: "a la izquierda" },
    segment: { en: "Body part", es: "Región" },
    direction: { en: "direction", es: "dirección" },
    findings: { en: "What the report says about itself", es: "Lo que el informe dice de sí mismo" },
    noise: { en: "This scan's own margin of error", es: "Margen de error propio de este escáner" },
    noiseBody: {
      en: "The typical gap between two photos of the same body part. A change on a re-scan smaller than this can't be told apart from camera position and stance.",
      es: "La diferencia típica entre dos fotos de la misma parte del cuerpo. Un cambio en un nuevo escáner menor que esto no se distingue de la posición de la cámara y la postura del momento."
    },
    totals: { en: "Side-photo totals", es: "Totales de las fotos laterales" },
    totalsBody: {
      en: "Totals add up the size of every shift, whichever way it points. They are an index, not a distance — and here the two side photos of the same person disagree by {pct}%.",
      es: "Los totales suman el tamaño de cada desplazamiento, sin importar la dirección. Son un índice, no una distancia, y aquí las dos fotos laterales de la misma persona discrepan un {pct}%."
    },
    pairsTitle: { en: "Photo against photo", es: "Foto contra foto" },
    pairLateral: { en: "Right vs left side photo", es: "Lateral derecha vs izquierda" },
    pairFrontal: { en: "Front vs back photo", es: "Anterior vs posterior" },
    gap: { en: "Gap", es: "Diferencia" },
    agreement: {
      good: { en: "Agree", es: "Coinciden" },
      fair: { en: "Loose", es: "Holgado" },
      poor: { en: "Disagree", es: "No coinciden" }
    },
    opposite: { en: "Opposite directions", es: "Direcciones opuestas" },
    averagingTitle: { en: "How the 'average' was worked out", es: "Cómo se calculó el 'promedio'" },
    averagingIssue: {
      en: "{segment}: the two side photos point opposite ways ({r} and {l}), but the printed average of {printed} cm adds their sizes together. Keeping direction, the average is {signed}.",
      es: "{segment}: las dos fotos laterales apuntan en direcciones opuestas ({r} y {l}), pero el promedio impreso de {printed} cm suma sus tamaños. Respetando la dirección, el promedio es {signed}."
    },
    averagingOk: { en: "The printed averages are consistent with the two photos.", es: "Los promedios impresos son coherentes con las dos fotos." },
    headTitle: { en: "The 'effective head weight'", es: "El 'peso efectivo de la cabeza'" },
    headBody: {
      en: "The report says your head 'weighs' {eff} kg instead of {base} kg — {ratio}×. That is a lever calculation from a model: the further forward the head sits, the harder the neck muscles work. It is not a measurement, and the widely shared figures behind it come from a computer model.",
      es: "El informe dice que tu cabeza 'pesa' {eff} kg en lugar de {base} kg ({ratio}×). Es un cálculo de palanca de un modelo: cuanto más adelantada está la cabeza, más trabajan los músculos del cuello. No es una medición, y las cifras populares en que se basa vienen de un modelo por ordenador."
    },
    meaningTitle: { en: "What each number describes", es: "Qué describe cada número" },
    sideAverage: { en: "Side-photo average, direction kept", es: "Promedio de las fotos laterales, con dirección" },
    questionsTitle: { en: "Questions to ask about this report", es: "Preguntas sobre este informe" },
    questions: [
      { en: "Which of these numbers explains my symptoms, and how?", es: "¿Cuál de estos números explica mis síntomas, y cómo?" },
      { en: "The two side photos disagree by several centimetres. How do you decide which one to treat?", es: "Las dos fotos laterales discrepan varios centímetros. ¿Cómo decides cuál tratar?" },
      { en: "How big a change on the re-scan would you count as real?", es: "¿Qué tamaño de cambio en el próximo escáner considerarías real?" },
      { en: "What would we do differently if the numbers improve but my arm doesn't?", es: "¿Qué haríamos diferente si los números mejoran pero mi brazo no?" }
    ],
    limits: {
      en: "A posture photo cannot show discs, joints or nerve roots, and landmarks placed over clothing are estimates of fabric and skin, not bone. Your symptoms and what you can do are better measures of a trapped nerve — that's what the tracker is for.",
      es: "Una foto postural no muestra discos, articulaciones ni raíces nerviosas, y los puntos colocados sobre la ropa estiman tela y piel, no hueso. Tus síntomas y lo que puedes hacer miden mejor un nervio atrapado; para eso está el seguimiento."
    },
    saveScan: { en: "Save this scan", es: "Guardar este escáner" },
    saved: { en: "Saved scans", es: "Escáneres guardados" },
    compareTitle: { en: "First scan vs latest", es: "Primer escáner vs el último" },
    before: { en: "First", es: "Primero" },
    after: { en: "Latest", es: "Último" },
    change: { en: "Closer to neutral by", es: "Más cerca de neutro en" },
    beyond: { en: "Bigger than the noise", es: "Mayor que el ruido" },
    within: { en: "Within the noise", es: "Dentro del ruido" },
    needTwo: { en: "Save a second scan to compare.", es: "Guarda un segundo escáner para comparar." }
  },
  tracker: {
    title: { en: "Is it working?", es: "¿Está funcionando?" },
    lead: {
      en: "Posture numbers don't tell you whether a trapped nerve is getting better. Pain and what you can do do. Score both once a week; RootAtlas compares the change with the size of change research says people actually notice.",
      es: "Los números de postura no te dicen si un nervio atrapado mejora. El dolor y lo que puedes hacer, sí. Puntúa ambos una vez por semana; RootAtlas compara el cambio con el tamaño de cambio que la investigación dice que la gente realmente nota."
    },
    planTitle: { en: "Your plan", es: "Tu plan" },
    condition: { en: "Problem", es: "Problema" },
    clinician: { en: "Seeing", es: "Acudes a" },
    sessions: { en: "Sessions bought", es: "Sesiones compradas" },
    price: { en: "Total paid", es: "Total pagado" },
    currency: { en: "Currency", es: "Moneda" },
    start: { en: "Plan started", es: "Inicio del plan" },
    since: { en: "Symptoms since", es: "Síntomas desde" },
    activitiesTitle: { en: "Three things your problem makes hard", es: "Tres cosas que tu problema te dificulta" },
    activitiesHint: {
      en: "Name them once. Each check-in, score how well you can do each: 0 = can't at all, 10 = as before the problem. (Patient-Specific Functional Scale.)",
      es: "Nómbralas una vez. En cada registro, puntúa qué tan bien puedes hacer cada una: 0 = nada, 10 = como antes del problema. (Escala Funcional Específica del Paciente.)"
    },
    activityPlaceholder: { en: "e.g. Sleeping through the night", es: "p. ej., Dormir toda la noche" },
    checkInTitle: { en: "New check-in", es: "Nuevo registro" },
    date: { en: "Date", es: "Fecha" },
    sessionsUsed: { en: "Sessions done so far", es: "Sesiones hechas hasta ahora" },
    limbPain: { en: "Arm or leg pain, last 24 h (0-10)", es: "Dolor en brazo o pierna, últimas 24 h (0-10)" },
    axialPain: { en: "Neck or back pain, last 24 h (0-10)", es: "Dolor de cuello o espalda, últimas 24 h (0-10)" },
    activity: { en: "Activity {n}", es: "Actividad {n}" },
    numbness: { en: "Numbness or tingling", es: "Adormecimiento u hormigueo" },
    numbNone: { en: "None", es: "Nada" },
    numbSome: { en: "Sometimes", es: "A veces" },
    numbConstant: { en: "Constant", es: "Constante" },
    flagsTitle: { en: "Since the last check-in, have you had any of these?", es: "Desde el último registro, ¿has tenido alguno de estos?" },
    note: { en: "Note (optional)", es: "Nota (opcional)" },
    add: { en: "Add check-in", es: "Añadir registro" },
    checkpoints: { en: "What to do now", es: "Qué hacer ahora" },
    progressTitle: { en: "Progress", es: "Progreso" },
    painLimb: { en: "Arm/leg pain", es: "Dolor de brazo/pierna" },
    painAxial: { en: "Neck/back pain", es: "Dolor de cuello/espalda" },
    functionLabel: { en: "Function (average of your three)", es: "Función (promedio de tus tres)" },
    meaningfulAt: { en: "Meaningful change: {n} points", es: "Cambio significativo: {n} puntos" },
    target: { en: "Meaningful", es: "Significativo" },
    functionShort: { en: "Function", es: "Función" },
    verdict: {
      "need-data": { en: "Need at least two check-ins", es: "Se necesitan al menos dos registros" },
      worse: { en: "Meaningfully worse", es: "Significativamente peor" },
      meaningful: { en: "Meaningful improvement", es: "Mejoría significativa" },
      some: { en: "Some improvement, not yet meaningful", es: "Algo de mejoría, aún no significativa" },
      "no-change": { en: "No change", es: "Sin cambios" }
    },
    valueTitle: { en: "What it's costing", es: "Lo que está costando" },
    perSession: { en: "Per session", es: "Por sesión" },
    spent: { en: "Used so far", es: "Usado hasta ahora" },
    remaining: { en: "Prepaid, not yet used", es: "Prepagado, aún sin usar" },
    perPoint: { en: "Per point of pain improvement", es: "Por punto de mejoría del dolor" },
    perPointNone: { en: "No improvement yet to divide by", es: "Aún no hay mejoría que dividir" },
    sessionsLeft: { en: "{n} sessions left", es: "Quedan {n} sesiones" },
    noPrice: { en: "Add sessions bought and total paid to see costs.", es: "Añade sesiones compradas y total pagado para ver los costes." },
    history: { en: "Check-ins", es: "Registros" },
    chartTitle: { en: "Scores over time", es: "Puntuaciones en el tiempo" },
    lowerBetter: { en: "lower is better", es: "menos es mejor" },
    higherBetter: { en: "higher is better", es: "más es mejor" },
    loadExample: { en: "Load an example", es: "Cargar un ejemplo" },
    exampleNote: {
      en: "The example uses the real plan (18 sessions, S/ 1,550) with illustrative scores, to show what the checkpoints say after six sessions with little change.",
      es: "El ejemplo usa el plan real (18 sesiones, S/ 1,550) con puntuaciones ilustrativas, para mostrar qué dicen los puntos de control tras seis sesiones con poco cambio."
    },
    export: { en: "Export file", es: "Exportar archivo" },
    import: { en: "Import file", es: "Importar archivo" },
    importFailed: { en: "That file isn't a RootAtlas export, or it has been changed. Nothing was replaced.", es: "Ese archivo no es una exportación de RootAtlas, o ha sido modificado. No se reemplazó nada." },
    print: { en: "Print for my clinician", es: "Imprimir para mi terapeuta" },
    deleteAll: { en: "Delete all my data", es: "Borrar todos mis datos" },
    confirmDelete: { en: "Delete every check-in and saved scan from this device?", es: "¿Borrar todos los registros y escáneres guardados de este dispositivo?" },
    storageOff: {
      en: "This browser isn't letting RootAtlas save. Everything works, but will be forgotten when you close the page — export a file to keep it.",
      es: "Este navegador no permite guardar a RootAtlas. Todo funciona, pero se olvidará al cerrar la página; exporta un archivo para conservarlo."
    },
    mcidSource: { en: "Thresholds", es: "Umbrales" },
    summaryTitle: { en: "RootAtlas summary", es: "Resumen de RootAtlas" }
  },
  flags: {
    title: { en: "Warning signs", es: "Señales de alarma" },
    lead: {
      en: "Most neck and back problems are not dangerous. These are the exceptions. Tick anything that applies to you now; RootAtlas tells you how fast to act. When in doubt, get checked — a false alarm costs far less than a missed one.",
      es: "La mayoría de los problemas de cuello y espalda no son peligrosos. Estas son las excepciones. Marca lo que te aplique ahora; RootAtlas te dice con qué rapidez actuar. Ante la duda, consulta: una falsa alarma cuesta mucho menos que una pasada por alto."
    },
    levels: {
      emergency: { en: "Emergency", es: "Emergencia" },
      urgent: { en: "Within a day or two", es: "En uno o dos días" },
      soon: { en: "In the coming weeks", es: "En las próximas semanas" }
    },
    none: { en: "Nothing ticked. Keep this page in mind if things change.", es: "Nada marcado. Recuerda esta página si algo cambia." },
    why: { en: "Why", es: "Por qué" },
    beforeManipulation: {
      en: "Before any neck manipulation, a clinician should ask you about dizziness, headaches, vision, speech and recent neck injury. If nobody asked, say so.",
      es: "Antes de cualquier manipulación cervical, un profesional debería preguntarte por mareos, dolores de cabeza, visión, habla y lesiones recientes del cuello. Si nadie te preguntó, dilo."
    }
  },
  clinicians: {
    title: { en: "Who to see for what", es: "A quién acudir para qué" },
    lead: {
      en: "Different professions can do different things. Knowing which one can diagnose, prescribe or order a scan saves time and money.",
      es: "Cada profesión puede hacer cosas distintas. Saber quién puede diagnosticar, recetar o pedir una prueba ahorra tiempo y dinero."
    },
    prescribe: { en: "Prescribes", es: "Receta" },
    imaging: { en: "Orders scans", es: "Pide pruebas de imagen" },
    goodFor: { en: "A good first stop for", es: "Buena primera opción para" },
    watchFor: { en: "Watch for", es: "Atención a" },
    yes: { en: "Yes", es: "Sí" },
    no: { en: "No", es: "No" },
    questionsTitle: { en: "Questions to ask any clinician", es: "Preguntas para cualquier profesional" }
  },
  evidence: {
    title: { en: "What works for neck pain and a trapped nerve", es: "Qué funciona para el dolor de cuello y el nervio atrapado" },
    lead: {
      en: "Plain-language verdicts from guidelines and systematic reviews. Most manual therapy lands on 'may help': small, mostly short-term effects. That is not nothing — but it is not a reason to prepay for months.",
      es: "Veredictos en lenguaje claro a partir de guías y revisiones sistemáticas. La mayoría de la terapia manual queda en 'puede ayudar': efectos pequeños y sobre todo a corto plazo. No es nada, pero tampoco es razón para pagar meses por adelantado."
    },
    harms: { en: "Harms", es: "Riesgos" }
  },
  about: {
    title: { en: "About RootAtlas", es: "Acerca de RootAtlas" },
    whatTitle: { en: "What it is", es: "Qué es" },
    what: {
      en: "An interactive guide to the spine and nerve roots, a posture-report checker, and a treatment tracker, for people seeing a chiropractor, physiotherapist, osteopath or doctor for spine problems.",
      es: "Una guía interactiva de la columna y las raíces nerviosas, un verificador de informes posturales y un seguimiento del tratamiento, para quienes acuden a un quiropráctico, fisioterapeuta, osteópata o médico por problemas de columna."
    },
    notTitle: { en: "What it is not", es: "Qué no es" },
    not: {
      en: "It does not diagnose, and it does not replace an examination. It says 'commonly associated with', never 'you have'. If anything on the warning-signs page applies, get medical help.",
      es: "No diagnostica ni sustituye una exploración. Dice 'se asocia con frecuencia a', nunca 'tienes'. Si te aplica algo de la página de señales de alarma, busca ayuda médica."
    },
    privacyTitle: { en: "Your data", es: "Tus datos" },
    privacy: {
      en: "RootAtlas is a set of static pages. There is no server, account, analytics or tracking script. What you type is stored only in this browser (localStorage) and can be exported or deleted at any time.",
      es: "RootAtlas es un conjunto de páginas estáticas. No hay servidor, cuenta, analítica ni scripts de seguimiento. Lo que escribes se guarda solo en este navegador (localStorage) y puedes exportarlo o borrarlo en cualquier momento."
    },
    evidenceTitle: { en: "How evidence is chosen", es: "Cómo se elige la evidencia" },
    evidence: {
      en: "Clinical guidelines and systematic reviews first; single trials only where they are the best available. Every claim names its source so you can check it. Where the research is weak, RootAtlas says so — including about treatments people pay for.",
      es: "Primero guías clínicas y revisiones sistemáticas; ensayos individuales solo cuando son lo mejor disponible. Cada afirmación cita su fuente para que puedas comprobarla. Cuando la investigación es débil, RootAtlas lo dice, incluso sobre tratamientos por los que la gente paga."
    },
    allSources: { en: "All sources", es: "Todas las fuentes" }
  }
} as const;

export type Copy = typeof COPY;

/** Fill {placeholders} in a translated string. */
export function fill(text: string, values: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

// Compile-time guard: every COPY leaf must be an L (or a list of L). A bare
// string anywhere makes `Check<Copy>` include `false`, and this line stops
// building — so a half-translated phrase can't ship.
type Check<T> = T extends L
  ? true
  : T extends readonly L[]
    ? true
    : T extends string | number | boolean
      ? false
      : { [K in keyof T]: Check<T[K]> }[keyof T];
const allLeavesAreTranslated: Check<Copy> extends true ? true : never = true;
void allLeavesAreTranslated;
