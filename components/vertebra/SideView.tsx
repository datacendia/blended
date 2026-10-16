import { COPY } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { OPENING, type Opening, type RoomState } from "@/lib/vertebra";

/**
 * Two neck vertebrae from the side, front on the left, with the root seen
 * end-on in the opening between them. The geometry comes from an `Opening`
 * (lib/vertebra), which the tests pin, so the picture can't contradict the
 * text. Shared by the vertebra page, the surgeon guide and the huesero guide.
 */
export const ROOT_FILL: Record<RoomState, string> = {
  free: "rgb(var(--nerve))",
  touching: "rgb(var(--warn))",
  squeezed: "rgb(var(--bad))"
};

export const STATE_STYLE: Record<RoomState, string> = {
  free: "bg-good/15 text-good",
  touching: "bg-warn/15 text-warn",
  squeezed: "bg-bad/10 text-bad"
};

const BONE = "rgb(var(--bone))";
const EDGE = "rgb(var(--ink-3))";

export interface SideViewProps {
  o: Opening;
  /** Disc material pushed into the opening. */
  bulge?: boolean;
  /** Bone spurs at the back corners of the bodies. */
  spurs?: boolean;
  /** What fills the disc space after an operation. */
  implant?: "cage" | "disc";
  /** A plate and screws across the front of the two bodies. */
  plate?: boolean;
  /** Where the facet joint's front edge was before bone was removed from behind. */
  removedFrom?: number;
  label: string;
  locale: Locale;
}

export function SideView({ o, bulge, spurs, implant, plate, removedFrom, label, locale }: SideViewProps) {
  const c = COPY.vertebra;
  const b = o.back;
  const discTop = 88 + o.drop;
  const discBottom = 126;
  const discMid = (discTop + discBottom) / 2;
  const r = OPENING.root / 2;
  const squash = Math.min(1, o.room / OPENING.root);
  const rootX = (o.front + o.back) / 2;
  const rootY = 104 + o.drop / 2;

  return (
    <figure className="m-0 rounded-2xl border border-line bg-surface p-3">
      <svg viewBox="0 0 340 214" className="block h-auto w-full" role="img" aria-label={label}>
        <defs>
          <pattern id="cage-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="rgb(var(--ink-3) / 0.18)" />
            <rect width="2" height="6" fill="rgb(var(--ink-3) / 0.6)" />
          </pattern>
        </defs>
        <text x={30} y={14} fontSize={11} fill="rgb(var(--ink-3))" letterSpacing="0.08em">
          {c.front[locale].toUpperCase()}
        </text>
        <text x={314} y={14} textAnchor="end" fontSize={11} fill="rgb(var(--ink-3))" letterSpacing="0.08em">
          {c.back[locale].toUpperCase()}
        </text>

        {/* Disc space, drawn first so the bodies overlap its edges */}
        {implant === "cage" ? (
          <rect x={44} y={discTop - 2} width={86} height={discBottom - discTop + 4} rx={3} fill="url(#cage-hatch)" stroke="rgb(var(--ink-3))" />
        ) : implant === "disc" ? (
          <g stroke="rgb(var(--ink-3))">
            <rect x={40} y={discTop} width={94} height={5} fill="rgb(var(--ink-3) / 0.5)" />
            <rect x={40} y={discBottom - 5} width={94} height={5} fill="rgb(var(--ink-3) / 0.5)" />
            <ellipse cx={87} cy={discMid} rx={30} ry={Math.max(4, (discBottom - discTop) / 2 - 6)} fill="rgb(var(--disc) / 0.7)" />
          </g>
        ) : (
          <>
            <rect x={32} y={84} width={106} height={46} rx={6} fill="rgb(var(--disc) / 0.55)" stroke="rgb(var(--disc))" />
            <ellipse cx={84} cy={discMid} rx={28} ry={Math.max(4, (discBottom - discTop) * 0.26)} fill="rgb(var(--disc))" />
          </>
        )}
        {bulge && (
          <path
            d={`M136 ${discTop + 4}C${o.front + 2} ${discTop + 2} ${o.front} ${discMid - 8} ${o.front} ${discMid}C${o.front} ${discMid + 8} ${o.front + 2} ${discBottom - 2} 136 ${discBottom - 4}Z`}
            fill="rgb(var(--disc))"
            stroke="rgb(var(--ink-3) / 0.6)"
          />
        )}

        {/* Lower vertebra: fixed */}
        <g fill={BONE} stroke={EDGE} strokeWidth={1.2}>
          <path d={`M${b + 26} 140C250 146 288 162 306 180C310 186 304 192 298 190C276 180 246 172 ${b + 26} 172Z`} />
          <path d={`M138 158C152 148 ${b - 8} 148 ${b + 4} 152V186H138Z`} />
          <rect x={30} y={126} width={110} height={66} rx={8} />
          <path d={`M${b} 186V100Q${b} 86 ${b + 12} 86H${b + 18}Q${b + 30} 86 ${b + 30} 100V186Z`} />
          {spurs && <path d={`M126 128L${o.front} 121L140 142Z`} />}
        </g>
        {removedFrom !== undefined && (
          <path d={`M${removedFrom} 186V100Q${removedFrom} 86 ${removedFrom + 12} 86H${b}`} fill="none" stroke={EDGE} strokeDasharray="3 3" />
        )}

        {/* Upper vertebra: drops when the disc loses height, tilts with the head */}
        <g fill={BONE} stroke={EDGE} strokeWidth={1.2} transform={`translate(0 ${o.drop}) rotate(${o.tilt} 84 104)`}>
          <path d={`M${b + 52} 36C250 40 288 58 306 76C310 82 304 88 298 86C276 76 246 68 ${b + 52} 66Z`} />
          <path d={`M${b + 30} 30H${b + 56}V140Q${b + 56} 152 ${b + 44} 152Q${b + 30} 152 ${b + 30} 140Z`} />
          <path d={`M138 30H${b + 32}V60C${b + 8} 70 152 70 138 62Z`} />
          <rect x={30} y={22} width={110} height={66} rx={8} />
          {spurs && <path d={`M126 86L${o.front} 93L140 72Z`} />}
        </g>

        {plate && (
          <g>
            <rect x={20} y={36} width={9} height={142} rx={3} fill="rgb(var(--ink-3) / 0.7)" />
            <path d="M29 56H62M29 160H62" stroke="rgb(var(--ink-3))" strokeWidth={3} strokeLinecap="round" />
          </g>
        )}

        {/* The root, end-on */}
        <ellipse cx={rootX} cy={rootY} rx={r * squash} ry={Math.min(r * 1.5, r / squash)} fill={ROOT_FILL[o.state]} stroke="rgb(var(--ink-2))" strokeWidth={1.4} />
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 px-1 text-xs text-ink-2">
        <Swatch className="bg-bone" label={c.legendBone[locale]} />
        <Swatch className="bg-disc" label={c.legendDisc[locale]} />
        <Swatch className="rounded-full bg-nerve" label={c.legendRoot[locale]} />
      </figcaption>
    </figure>
  );
}

function Swatch({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`inline-block h-2.5 w-2.5 border border-ink-3/60 ${className}`} aria-hidden="true" />
      {label}
    </span>
  );
}
