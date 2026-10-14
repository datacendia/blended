"use client";

import Link from "next/link";
import { useState } from "react";
import { SourceList } from "@/components/ui/SourceList";
import { fill } from "@/lib/copy";
import { HEAD_ANGLES, HEAD_LEVER_COPY, HEAD_LEVER_SOURCES, modelLoad } from "@/lib/diagrams/headLever";
import { formatNumber, type Locale } from "@/lib/i18n";
import { href } from "@/lib/nav";

/**
 * Seated, side view, facing right. The neck pivots at its base; the head's
 * centre swings forward and the horizontal distance from the pivot (the
 * lever arm) is drawn as it grows. Beside it, the model's five figures as
 * bars, the current one picked out. The slider only stops at the angles the
 * model reported, so nothing is interpolated.
 */
const PIVOT = { x: 96, y: 150 };
const NECK = 34;
const HEAD_R = 24;

export function HeadLever({ locale }: { locale: Locale }) {
  const c = HEAD_LEVER_COPY;
  const [i, setI] = useState(0);
  const { deg } = HEAD_ANGLES[i]!;
  const kg = modelLoad(deg);
  const a = (deg * Math.PI) / 180;
  const neckTop = { x: PIVOT.x + NECK * Math.sin(a), y: PIVOT.y - NECK * Math.cos(a) };
  const headC = { x: PIVOT.x + (NECK + HEAD_R) * Math.sin(a) + 8 * Math.cos(a), y: PIVOT.y - (NECK + HEAD_R) * Math.cos(a) + 8 * Math.sin(a) };
  const max = HEAD_ANGLES[HEAD_ANGLES.length - 1]!.kg;
  const upright = HEAD_ANGLES[0]!;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <div className="min-w-0 space-y-3">
        <label className="block text-sm font-medium tnum">
          {fill(c.angle[locale], { deg })}
          <input type="range" min={0} max={HEAD_ANGLES.length - 1} step={1} value={i} onChange={(e) => setI(Number(e.target.value))} className="mt-1 block w-full accent-accent" />
        </label>
        <figure className="m-0 rounded-2xl border border-line bg-surface p-3">
          <svg viewBox="0 0 320 200" className="block h-auto w-full" role="img" aria-label={`${c.figure[locale]}: ${deg}°`}>
            {/* Seated torso */}
            <rect x={60} y={150} width={70} height={46} rx={20} fill="rgb(var(--ink-3) / 0.22)" />
            <path d={`M${PIVOT.x} ${PIVOT.y}L${neckTop.x} ${neckTop.y}`} stroke="rgb(var(--bone))" strokeWidth={14} strokeLinecap="round" />
            <path d={`M${PIVOT.x} ${PIVOT.y}L${neckTop.x} ${neckTop.y}`} stroke="rgb(var(--ink-3) / 0.6)" strokeWidth={14} strokeLinecap="round" fill="none" strokeOpacity={0.35} />
            <circle cx={headC.x} cy={headC.y} r={HEAD_R} fill="rgb(var(--ink-3) / 0.22)" />
            <circle cx={headC.x + 12 * Math.cos(a)} cy={headC.y - 4 + 12 * Math.sin(a)} r={2.6} fill="rgb(var(--ink-2))" />
            {/* Lever arm: horizontal distance from the pivot to the head's centre */}
            <line x1={PIVOT.x} y1={PIVOT.y} x2={PIVOT.x} y2={headC.y} stroke="rgb(var(--ink-3))" strokeDasharray="3 3" />
            <line x1={PIVOT.x} y1={headC.y} x2={headC.x} y2={headC.y} stroke="rgb(var(--warn))" strokeWidth={2.4} />
            <circle cx={headC.x} cy={headC.y} r={3} fill="rgb(var(--warn))" />
            <text x={(PIVOT.x + headC.x) / 2} y={headC.y - 6} fontSize={10} textAnchor="middle" fill="rgb(var(--warn))">
              {deg > 0 ? c.lever[locale] : ""}
            </text>
            <circle cx={PIVOT.x} cy={PIVOT.y} r={4} fill="rgb(var(--ink-2))" />
            <text x={PIVOT.x - 8} y={PIVOT.y + 4} fontSize={10} textAnchor="end" fill="rgb(var(--ink-3))">{c.pivot[locale]}</text>

            {/* The model's figures */}
            {HEAD_ANGLES.map((h, j) => {
              const barH = (h.kg / max) * 120;
              const x = 196 + j * 24;
              const on = j === i;
              return (
                <g key={h.deg}>
                  <rect x={x} y={170 - barH} width={16} height={barH} rx={3} fill={on ? "rgb(var(--warn))" : "rgb(var(--ink-3) / 0.3)"} />
                  <text x={x + 8} y={184} fontSize={9} textAnchor="middle" fill="rgb(var(--ink-3))">{h.deg}°</text>
                </g>
              );
            })}
          </svg>
        </figure>
      </div>
      <article className="min-w-0 space-y-3 rounded-2xl border border-line bg-surface p-5" aria-live="polite">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.model[locale]}</p>
        <p className="tnum text-3xl font-semibold">
          {deg === 0 && upright.range ? `${formatNumber(upright.range[0], locale)}-${formatNumber(upright.range[1], locale)}` : formatNumber(kg, locale)} kg
        </p>
        {deg > 0 && <p className="tnum text-sm text-ink-2">{fill(c.times[locale], { x: formatNumber(kg / upright.kg, locale) })}</p>}
        <p className="leading-relaxed text-ink-2">{c.why[locale]}</p>
        <p className="rounded-xl border-l-4 border-warn bg-warn/5 p-3 text-sm">{c.caveat[locale]}</p>
        <p className="text-sm">{c.alexander[locale]}</p>
        <Link className="inline-block text-sm text-accent underline underline-offset-2" href={href(locale, "report")}>
          {c.report[locale]}
        </Link>
        <SourceList ids={HEAD_LEVER_SOURCES} locale={locale} />
      </article>
    </div>
  );
}
