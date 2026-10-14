"use client";

import { useState } from "react";
import { SourceList } from "@/components/ui/SourceList";
import { GRADES, MOBILISATION_COPY, MOBILISATION_SOURCES, type Grade } from "@/lib/diagrams/mobilisation";
import type { Locale } from "@/lib/i18n";
import { Choice } from "./Choice";
import { useReducedMotion } from "./useReducedMotion";

/**
 * A joint's range as a track, the grade's movement as a dot oscillating over
 * its part of the track, and the joint itself beside it: for grade V the
 * surfaces part and a gas bubble appears. With reduced motion the dot's span
 * is drawn as a band instead.
 */
const X0 = 30;
const X1 = 290;
const at = (f: number) => X0 + (X1 - X0) * (f / 1.08);

export function MobilisationGrades({ locale }: { locale: Locale }) {
  const c = MOBILISATION_COPY;
  const reduced = useReducedMotion();
  const [id, setId] = useState<Grade>("III");
  const g = GRADES.find((x) => x.id === id)!;
  const limit = at(1);
  const manip = g.id === "V";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <div className="min-w-0 space-y-3">
        <Choice label={c.grade[locale]} value={id} onChange={setId} options={GRADES.map((x) => ({ id: x.id, name: x.id }))} />
        <figure className="m-0 rounded-2xl border border-line bg-surface p-3">
          <svg viewBox="0 0 320 190" className="block h-auto w-full" role="img" aria-label={`${c.figure[locale]}: ${c.grade[locale]} ${g.id}`}>
            {/* Range track */}
            <rect x={X0} y={44} width={limit - X0} height={10} rx={5} fill="rgb(var(--accent) / 0.18)" />
            <rect x={limit} y={44} width={X1 - limit} height={10} rx={5} fill="rgb(var(--warn) / 0.25)" />
            <line x1={limit} y1={34} x2={limit} y2={64} stroke="rgb(var(--ink-2))" strokeWidth={2} />
            <text x={X0} y={28} fontSize={10} fill="rgb(var(--ink-3))">{c.start[locale]}</text>
            <text x={limit} y={28} fontSize={10} textAnchor="middle" fill="rgb(var(--ink-3))">{c.limit[locale]}</text>
            {/* The grade's span, and the movement within it */}
            <rect x={at(g.from)} y={66} width={at(g.to) - at(g.from)} height={6} rx={3} fill={manip ? "rgb(var(--bad))" : "rgb(var(--accent))"} />
            <circle cx={at(g.from)} cy={49} r={8} fill={manip ? "rgb(var(--bad))" : "rgb(var(--accent))"} stroke="rgb(var(--surface))" strokeWidth={2}>
              {!reduced && (
                <animate
                  key={g.id}
                  attributeName="cx"
                  values={manip ? `${at(0.9)};${at(0.9)};${at(g.to)};${at(0.9)}` : `${at(g.from)};${at(g.to)};${at(g.from)}`}
                  keyTimes={manip ? "0;0.7;0.75;1" : "0;0.5;1"}
                  dur={manip ? "2.4s" : g.to - g.from > 0.3 ? "2.2s" : "0.9s"}
                  repeatCount="indefinite"
                />
              )}
            </circle>
            <text x={160} y={96} fontSize={10.5} textAnchor="middle" fill="rgb(var(--ink-2))">
              {manip ? c.manipulation[locale] : c.mobilisation[locale]}
            </text>

            {/* The joint: two bone ends and the space between them */}
            <text x={160} y={118} fontSize={10} textAnchor="middle" fill="rgb(var(--ink-3))">{c.joint[locale]}</text>
            <path d={`M70 128H146Q156 128 156 140V${manip ? 140 : 142}Q156 152 146 152H70Z`} fill="rgb(var(--bone))" stroke="rgb(var(--ink-3))" />
            <path d={`M250 128H${manip ? 176 : 172}Q${manip ? 166 : 162} 128 ${manip ? 166 : 162} 140Q${manip ? 166 : 162} 152 ${manip ? 176 : 172} 152H250Z`} fill="rgb(var(--bone))" stroke="rgb(var(--ink-3))" />
            {manip && (
              <g>
                <circle cx={161} cy={140} r={4.5} fill="rgb(var(--surface))" stroke="rgb(var(--ink-2))" />
                <text x={161} y={172} fontSize={10} textAnchor="middle" fill="rgb(var(--ink-2))">{c.gas[locale]}</text>
              </g>
            )}
          </svg>
        </figure>
      </div>
      <article className="min-w-0 space-y-3 rounded-2xl border border-line bg-surface p-5" aria-live="polite">
        <h4 className="text-lg font-semibold">
          {c.grade[locale]} {g.id}
        </h4>
        <p className="leading-relaxed text-ink-2">{g.text[locale]}</p>
        <p className="rounded-xl bg-raised p-3 text-sm">{c.evidence[locale]}</p>
        <SourceList ids={MOBILISATION_SOURCES} locale={locale} />
      </article>
    </div>
  );
}
