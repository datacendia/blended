"use client";

import { useState } from "react";
import { SourceList } from "@/components/ui/SourceList";
import { COPY } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { CAUSES, opening, OPENING, POSITIONS, ROOM_LABEL, type Cause, type NeckPosition, type RoomState } from "@/lib/vertebra";

/**
 * Two neck vertebrae from the side, front on the left, with the root seen
 * end-on in the opening between them. Pick what narrows the opening and how
 * the head is held; the root goes from yellow to amber to red as the room
 * runs out. The geometry comes from `opening()` in lib/vertebra, which the
 * tests pin, so the picture can't contradict the text.
 */
const ROOT_FILL: Record<RoomState, string> = {
  free: "rgb(var(--nerve))",
  touching: "rgb(var(--warn))",
  squeezed: "rgb(var(--bad))"
};

const STATE_STYLE: Record<RoomState, string> = {
  free: "bg-good/15 text-good",
  touching: "bg-warn/15 text-warn",
  squeezed: "bg-bad/10 text-bad"
};

const BONE = "rgb(var(--bone))";
const EDGE = "rgb(var(--ink-3))";

export function NerveSqueeze({ locale }: { locale: Locale }) {
  const c = COPY.vertebra;
  const [cause, setCause] = useState<Cause>("herniation");
  const [position, setPosition] = useState<NeckPosition>("neutral");
  const o = opening(cause, position);
  const b = o.back;
  const discTop = 88 + o.drop;
  const discBottom = 126;
  const discMid = (discTop + discBottom) / 2;
  const r = OPENING.root / 2;
  const squash = Math.min(1, o.room / OPENING.root);
  const rootX = (o.front + o.back) / 2;
  const rootY = 104 + o.drop / 2;
  const causeInfo = CAUSES.find((x) => x.id === cause)!;
  const positionInfo = POSITIONS.find((x) => x.id === position)!;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <div className="min-w-0 space-y-3">
        <Choice label={c.causeLabel[locale]} options={CAUSES.map((x) => ({ id: x.id, name: x.name[locale] }))} value={cause} onChange={setCause} />
        <Choice label={c.positionLabel[locale]} options={POSITIONS.map((x) => ({ id: x.id, name: x.name[locale] }))} value={position} onChange={setPosition} />
        <figure className="m-0 rounded-2xl border border-line bg-surface p-3">
          <svg viewBox="0 0 340 214" className="block h-auto w-full" role="img" aria-label={`${c.sideFigure[locale]}: ${ROOM_LABEL[o.state][locale]}`}>
            <text x={30} y={14} fontSize={11} fill="rgb(var(--ink-3))" letterSpacing="0.08em">
              {c.front[locale].toUpperCase()}
            </text>
            <text x={314} y={14} textAnchor="end" fontSize={11} fill="rgb(var(--ink-3))" letterSpacing="0.08em">
              {c.back[locale].toUpperCase()}
            </text>

            {/* Disc, drawn first so the bodies overlap its edges */}
            <rect x={32} y={84} width={106} height={46} rx={6} fill="rgb(var(--disc) / 0.55)" stroke="rgb(var(--disc))" />
            <ellipse cx={84} cy={discMid} rx={28} ry={Math.max(4, (discBottom - discTop) * 0.26)} fill="rgb(var(--disc))" />
            {cause === "herniation" && (
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
              {cause === "narrowing" && <path d={`M126 128L${o.front} 121L140 142Z`} />}
            </g>

            {/* Upper vertebra: drops when the disc loses height, tilts with the head */}
            <g fill={BONE} stroke={EDGE} strokeWidth={1.2} transform={`translate(0 ${o.drop}) rotate(${o.tilt} 84 104)`}>
              <path d={`M${b + 52} 36C250 40 288 58 306 76C310 82 304 88 298 86C276 76 246 68 ${b + 52} 66Z`} />
              <path d={`M${b + 30} 30H${b + 56}V140Q${b + 56} 152 ${b + 44} 152Q${b + 30} 152 ${b + 30} 140Z`} />
              <path d={`M138 30H${b + 32}V60C${b + 8} 70 152 70 138 62Z`} />
              <rect x={30} y={22} width={110} height={66} rx={8} />
              {cause === "narrowing" && <path d={`M126 86L${o.front} 93L140 72Z`} />}
            </g>

            {/* The root, end-on */}
            <ellipse
              cx={rootX}
              cy={rootY}
              rx={r * squash}
              ry={Math.min(r * 1.5, r / squash)}
              fill={ROOT_FILL[o.state]}
              stroke="rgb(var(--ink-2))"
              strokeWidth={1.4}
            />
          </svg>
          <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 px-1 text-xs text-ink-2">
            <Swatch className="bg-bone" label={c.legendBone[locale]} />
            <Swatch className="bg-disc" label={c.legendDisc[locale]} />
            <Swatch className="rounded-full bg-nerve" label={c.legendRoot[locale]} />
          </figcaption>
        </figure>
      </div>

      <article className="min-w-0 space-y-3 rounded-2xl border border-line bg-surface p-5" aria-live="polite">
        <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${STATE_STYLE[o.state]}`}>{ROOM_LABEL[o.state][locale]}</span>
        <h3 className="text-lg font-semibold">{causeInfo.name[locale]}</h3>
        <p className="leading-relaxed text-ink-2">{causeInfo.text[locale]}</p>
        <h3 className="pt-1 font-semibold">{positionInfo.name[locale]}</h3>
        <p className="leading-relaxed text-ink-2">{positionInfo.text[locale]}</p>
        <SourceList ids={[...new Set([...causeInfo.sources, ...positionInfo.sources])]} locale={locale} />
        <p className="border-t border-line pt-3 text-sm text-ink-3">{c.picture[locale]}</p>
      </article>
    </div>
  );
}

function Choice<T extends string>({ label, options, value, onChange }: { label: string; options: { id: T; name: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div role="group" aria-label={label}>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            aria-pressed={opt.id === value}
            onClick={() => onChange(opt.id)}
            className={`rounded-full border px-3 py-1 text-sm ${opt.id === value ? "border-accent bg-accent font-medium text-accent-ink" : "border-line bg-surface hover:border-accent"}`}
          >
            {opt.name}
          </button>
        ))}
      </div>
    </div>
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
