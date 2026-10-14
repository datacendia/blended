import type { PartId, VertebraKind } from "./vertebra";

/**
 * Outlines for the vertebra seen from above, front at the top, in a 320×300
 * box. Schematic, not to scale: the proportions follow the textbook shapes
 * (a small wide cervical body with a big triangular canal, a heart-shaped
 * thoracic body with a small round canal, a large kidney-shaped lumbar body)
 * so the three read as different bones at a glance.
 *
 * Paired parts are drawn for the right side only and mirrored, so the two
 * sides can't drift apart.
 */
export const TOP_VIEW = { width: 320, height: 300, mirror: "matrix(-1 0 0 1 320 0)" } as const;

export interface Shape {
  part: PartId;
  d: string;
  /** Drawn on both sides. */
  paired?: boolean;
  /** Drawn as a hole: page colour, dashed edge. */
  hole?: boolean;
}

export interface TopView {
  /** The part of the 320×300 box this vertebra fills, so each one is drawn as large as it can be. */
  box: { x: number; y: number; w: number; h: number };
  /** Bone first, then holes, then what runs through them. */
  shapes: Shape[];
  /** The cord or the bundle of roots, inside the canal. */
  contents: { kind: "cord"; cx: number; cy: number; rx: number; ry: number } | { kind: "cauda"; dots: [number, number][] };
  /** The exiting root, right side, as a stroke. */
  root: string;
  /** Background context that isn't a tappable part (the rib). */
  context?: string;
  artery?: { cx: number; cy: number; r: number };
}

const circle = (cx: number, cy: number, r: number) => `M${cx + r} ${cy}A${r} ${r} 0 1 0 ${cx - r} ${cy}A${r} ${r} 0 1 0 ${cx + r} ${cy}Z`;
const ellipse = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx + rx} ${cy}A${rx} ${ry} 0 1 0 ${cx - rx} ${cy}A${rx} ${ry} 0 1 0 ${cx + rx} ${cy}Z`;

export const TOP_VIEWS: Record<VertebraKind, TopView> = {
  cervical: {
    box: { x: 24, y: 6, w: 272, h: 240 },
    shapes: [
      // Transverse process with its foramen cut out (even-odd fill).
      { part: "transverse", paired: true, d: `M200 66C222 60 248 62 264 72C272 78 272 90 264 96L252 100C248 110 238 116 226 114L212 110L200 98Z${circle(229, 86, 9)}` },
      { part: "pedicle", paired: true, d: "M194 98L214 110L208 128L190 116Z" },
      { part: "facet", paired: true, d: "M206 124C214 116 236 118 242 130C248 144 238 158 226 160C212 162 202 152 202 140C202 134 203 129 206 124Z" },
      { part: "lamina", paired: true, d: "M216 154C208 168 190 180 172 188L164 176C180 170 196 160 206 148Z" },
      { part: "spinous", d: "M148 180L172 180C174 192 177 203 181 215C182 220 176 222 173 218L160 201L147 218C144 222 138 220 139 215C143 203 146 192 148 180Z" },
      {
        part: "body",
        d: "M118 62C118 50 130 42 160 42C190 42 202 50 202 62L202 92C202 102 196 108 186 108C176 108 170 104 160 104C150 104 144 108 134 108C124 108 118 102 118 92Z"
      },
      { part: "canal", hole: true, d: "M121 114C140 109 180 109 199 114C209 117 209 125 203 133L170 172C165 178 155 178 150 172L117 133C111 125 111 117 121 114Z" },
      { part: "transverseForamen", paired: true, d: circle(229, 86, 8.5), hole: true }
    ],
    contents: { kind: "cord", cx: 160, cy: 136, rx: 24, ry: 14 },
    root: "M182 132C196 126 206 118 222 112C238 106 258 104 288 108",
    artery: { cx: 229, cy: 86, r: 5 }
  },
  thoracic: {
    box: { x: 0, y: 6, w: 320, h: 290 },
    shapes: [
      { part: "transverse", paired: true, d: "M196 126C214 130 236 142 254 154C264 160 262 176 250 178C232 176 212 166 196 154Z" },
      { part: "pedicle", paired: true, d: "M184 106L198 110L198 132L182 126Z" },
      { part: "facet", paired: true, d: "M186 132C192 127 204 129 207 137C210 146 201 151 192 149C185 147 183 139 186 132Z" },
      { part: "lamina", paired: true, d: "M206 150C200 164 184 178 168 184L162 172C176 166 188 156 192 146Z" },
      { part: "spinous", d: "M151 176L169 176C169 200 167 232 164 264C163 270 157 270 156 264C153 232 151 200 151 176Z" },
      {
        part: "body",
        d: "M160 42C187 42 205 57 205 82C205 100 195 112 179 114C171 115 165 110 160 110C155 110 149 115 141 114C125 112 115 100 115 82C115 57 133 42 160 42Z"
      },
      { part: "ribFacet", paired: true, d: `${ellipse(199, 104, 6, 5)}${ellipse(251, 168, 6, 5)}` },
      { part: "canal", hole: true, d: circle(160, 140, 22) }
    ],
    contents: { kind: "cord", cx: 160, cy: 140, rx: 13, ry: 10 },
    root: "M172 136C186 130 196 124 210 124C228 126 242 136 262 150",
    context: "M204 104C222 120 240 146 254 164C268 180 290 178 304 152C312 134 316 112 318 92"
  },
  lumbar: {
    box: { x: 16, y: 4, w: 288, h: 256 },
    shapes: [
      { part: "transverse", paired: true, d: "M204 116C230 113 262 111 290 113C297 114 297 125 290 126C262 128 232 130 204 132Z" },
      { part: "pedicle", paired: true, d: "M188 104L210 110L206 134L188 128Z" },
      { part: "facet", paired: true, d: "M196 140C200 131 214 129 221 137C228 148 223 165 212 171C205 175 199 168 201 160C203 152 200 146 196 140Z" },
      { part: "lamina", paired: true, d: "M206 160C200 172 186 180 170 186L164 174C178 170 188 162 194 150Z" },
      { part: "spinous", d: "M149 178L171 178L173 232C173 238 166 242 160 242C154 242 147 238 147 232Z" },
      {
        part: "body",
        d: "M160 38C200 38 222 52 222 76C222 95 210 108 192 110C180 111 170 103 160 103C150 103 140 111 128 110C110 108 98 95 98 76C98 52 120 38 160 38Z"
      },
      { part: "canal", hole: true, d: "M124 115C144 110 176 110 196 115C204 117 204 126 198 134L170 168C165 174 155 174 150 168L122 134C116 126 116 117 124 115Z" }
    ],
    contents: {
      kind: "cauda",
      dots: [
        [146, 126], [156, 124], [166, 124], [176, 126],
        [142, 136], [152, 134], [162, 134], [172, 134], [180, 136],
        [150, 145], [160, 144], [170, 145],
        [155, 154], [165, 154], [160, 162]
      ]
    },
    root: "M180 128C192 122 202 116 216 110C232 104 252 100 280 98"
  }
};
