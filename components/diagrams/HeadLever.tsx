"use client";

import Link from "next/link";
import { useState } from "react";
import { SourceList } from "@/components/ui/SourceList";
import { fill } from "@/lib/copy";
import { HEAD_ANGLES, HEAD_LEVER_COPY, HEAD_LEVER_SOURCES, modelLoad } from "@/lib/diagrams/headLever";
import { formatNumber, type Locale } from "@/lib/i18n";
import { href } from "@/lib/nav";
import { HALO } from "./shapes";

/**
 * Seated, side view, facing right, holding a phone in the lap. The neck
 * pivots at its base; the head's centre swings forward and the horizontal
 * distance from the pivot (the lever arm) is drawn as it grows. The muscles
 * at the back of the neck thicken and darken with the model's figure. Beside
 * it, the model's five figures as labelled bars. The slider only stops at
 * the angles the model reported, so nothing is interpolated.
 */
const PIVOT = { x: 100, y: 96 };
const NECK = 26;
const HEAD_R = 20;
const BODY = "rgb(var(--ink-3) / 0.28)";

export function HeadLever({ locale }: { locale: Locale }) {
  const c = HEAD_LEVER_COPY;
  const [i, setI] = useState(0);
  const { deg } = HEAD_ANGLES[i]!;
  const kg = modelLoad(deg);
  const max = HEAD_ANGLES[HEAD_ANGLES.length - 1]!.kg;
  const upright = HEAD_ANGLES[0]!;
  const a = (deg * Math.PI) / 180;
  // Rotate a point given in the upright head's frame (x forward, y down) about the pivot.
  const rot = (x: number, y: number) => ({ x: PIVOT.x + x * Math.cos(a) - y * Math.sin(a), y: PIVOT.y + x * Math.sin(a) + y * Math.cos(a) });
  const neckTop = rot(0, -NECK);
  const headC = rot(6, -NECK - HEAD_R + 2);
  const eye = rot(18, -NECK - HEAD_R);
  const skullBack = rot(-14, -NECK - 6);
  const share = kg / max;
  const muscle = `rgb(var(--muscle) / ${(0.3 + 0.6 * share).toFixed(2)})`;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
      <div className="min-w-0 space-y-3">
        <label className="tnum block text-sm font-medium">
          {fill(c.angle[locale], { deg })}
          <input type="range" min={0} max={HEAD_ANGLES.length - 1} step={1} value={i} onChange={(e) => setI(Number(e.target.value))} className="mt-1 block w-full accent-accent" />
        </label>
        <figure className="m-0 rounded-2xl border border-line bg-surface p-3">
          <svg viewBox="0 0 340 232" className="block h-auto w-full" role="img" aria-label={`${c.figure[locale]}: ${deg}°, ${formatNumber(kg, locale)} kg`}>
            {/* Chair */}
            <g stroke="rgb(var(--ink-3) / 0.6)" strokeWidth={4} strokeLinecap="round" fill="none">
              <path d="M44 96V178H128" />
              <path d="M52 178V226M120 178V226" />
            </g>
            {/* Body: torso, thigh and shin, arm with the phone */}
            <g stroke={BODY} strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d={`M80 168L${PIVOT.x - 4} ${PIVOT.y + 8}`} strokeWidth={36} />
              <path d="M80 170L146 172L150 222" strokeWidth={20} />
              <path d={`M${PIVOT.x} ${PIVOT.y + 14}L112 146L146 132`} strokeWidth={11} />
            </g>
            <rect x={142} y={122} width={7} height={18} rx={1.5} transform="rotate(-30 145 131)" fill="rgb(var(--ink-2))" />
            {/* The muscles at the back of the neck, working harder as the head tips */}
            <path d={`M${skullBack.x} ${skullBack.y}Q${PIVOT.x - 16} ${PIVOT.y - 4} ${PIVOT.x - 14} ${PIVOT.y + 18}`} fill="none" stroke={muscle} strokeWidth={5 + 6 * share} strokeLinecap="round" />
            {/* Neck and head */}
            <path d={`M${PIVOT.x} ${PIVOT.y}L${neckTop.x} ${neckTop.y}`} stroke="rgb(var(--bone))" strokeWidth={12} strokeLinecap="round" />
            <circle cx={headC.x} cy={headC.y} r={HEAD_R} fill={BODY} />
            <circle cx={eye.x} cy={eye.y + 4} r={2.4} fill="rgb(var(--ink-2))" />
            {/* Lever arm: horizontal distance from the pivot to the head's centre */}
            <line x1={PIVOT.x} y1={PIVOT.y} x2={PIVOT.x} y2={headC.y} stroke="rgb(var(--ink-3))" strokeDasharray="3 3" />
            <line x1={PIVOT.x} y1={headC.y} x2={headC.x} y2={headC.y} stroke="rgb(var(--warn))" strokeWidth={2.4} />
            <circle cx={headC.x} cy={headC.y} r={3} fill="rgb(var(--warn))" />
            {deg > 0 && (
              <text x={(PIVOT.x + headC.x) / 2} y={headC.y - 6} fontSize={9} textAnchor="middle" {...HALO} fill="rgb(var(--warn))">
                {c.lever[locale]}
              </text>
            )}
            <circle cx={PIVOT.x} cy={PIVOT.y} r={3.5} fill="rgb(var(--ink-2))" />
            <text x={PIVOT.x + 8} y={PIVOT.y + 4} fontSize={9} {...HALO} fill="rgb(var(--ink-3))">
              {c.pivot[locale]}
            </text>

            {/* The model's figures, each labelled */}
            {HEAD_ANGLES.map((h, j) => {
              const barH = (h.kg / max) * 130;
              const x = 210 + j * 25;
              const on = j === i;
              return (
                <g key={h.deg} onClick={() => setI(j)} className="cursor-pointer">
                  <rect x={x} y={196 - barH} width={17} height={barH} rx={3} fill={on ? "rgb(var(--warn))" : "rgb(var(--ink-3) / 0.3)"} />
                  <text x={x + 8.5} y={190 - barH} fontSize={8.5} textAnchor="middle" fontWeight={on ? 700 : 500} fill={on ? "rgb(var(--ink))" : "rgb(var(--ink-3))"} className="tnum">
                    {formatNumber(h.kg, locale)}
                  </text>
                  <text x={x + 8.5} y={210} fontSize={9} textAnchor="middle" fill="rgb(var(--ink-3))">
                    {h.deg}°
                  </text>
                </g>
              );
            })}
            <text x={272} y={226} fontSize={8} textAnchor="middle" fill="rgb(var(--ink-3))">
              kg
            </text>
          </svg>
          <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 px-1 text-xs text-ink-2">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1 w-4 rounded-full bg-warn" aria-hidden="true" />
              {c.lever[locale]}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-4 rounded-full" style={{ background: "rgb(var(--muscle) / 0.7)" }} aria-hidden="true" />
              {c.muscles[locale]}
            </span>
            <span className="text-ink-3">{c.stops[locale]}</span>
          </figcaption>
        </figure>
      </div>
      <article className="min-w-0 space-y-3 rounded-2xl border border-line bg-surface p-5" aria-live="polite">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.model[locale]}</p>
        <p className="tnum text-3xl font-semibold">
          {deg === 0 && upright.range ? `${formatNumber(upright.range[0], locale)}-${formatNumber(upright.range[1], locale)}` : formatNumber(kg, locale)} kg
        </p>
        {deg > 0 && <p className="tnum text-sm text-ink-2">{fill(c.times[locale], { x: formatNumber(kg / upright.kg, locale) })}</p>}
        <div>
          <p className="mb-1 text-xs text-ink-3">
            {c.squares[locale]} · {c.uprightShare[locale]}
          </p>
          <div className="flex max-w-[16rem] flex-wrap gap-[3px]" aria-hidden="true">
            {Array.from({ length: Math.round(kg) }, (_, k) => (
              <span key={k} className={`h-3.5 w-3.5 rounded-[3px] ${k < upright.kg ? "border border-ink-2 bg-warn/40" : "bg-warn"}`} />
            ))}
          </div>
        </div>
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
