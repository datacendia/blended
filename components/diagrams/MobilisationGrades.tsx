"use client";

import { useState } from "react";
import { SourceList } from "@/components/ui/SourceList";
import {
  GRADES,
  gradeSpan,
  JOINT_STATES,
  MOBILISATION_COPY,
  MOBILISATION_SOURCES,
  REGIONS,
  type Grade,
  type JointState,
  type SpineRegion
} from "@/lib/diagrams/mobilisation";
import type { Locale } from "@/lib/i18n";
import { Choice } from "./Choice";
import { HALO } from "./shapes";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Two figures. Maitland's movement diagram: range along the bottom,
 * resistance up the side, the resistance curve from R1 to the limit, and
 * every grade as a double-headed arrow underneath, the picked one moving.
 * Beside it, one small joint at the back of the spine seen from the side,
 * sloped as it is in the chosen region, its upper surface gliding over the
 * lower one through the picked grade's span. With reduced motion the spans
 * are drawn instead of animated.
 */
const X0 = 46;
const X1 = 290;
const xr = (f: number) => X0 + (X1 - X0) * (f / 1.1);
const BASE = 150;
const TOP = 30;
const ROW0 = 174;
const ROW = 14;

export function MobilisationGrades({ locale }: { locale: Locale }) {
  const c = MOBILISATION_COPY;
  const reduced = useReducedMotion();
  const [id, setId] = useState<Grade>("III");
  const [state, setState] = useState<JointState>("normal");
  const [region, setRegion] = useState<SpineRegion>("neck");
  const g = GRADES.find((x) => x.id === id)!;
  const js = JOINT_STATES[state];
  const span = gradeSpan(id, state);
  const L = xr(js.limit);
  const R1 = xr(js.r1);
  const manip = g.fast;
  const dur = manip ? "2.4s" : span.to - span.from > 0.3 ? "2.2s" : "0.9s";
  // Where the joint surfaces are for a position along the range; past R1 the capsule is under stretch.
  const glide = (f: number) => (f - 0.5) * 22;
  const stretched = span.to >= js.r1;
  const r = REGIONS[region];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
      <div className="min-w-0 space-y-3">
        <Choice label={c.grade[locale]} value={id} onChange={setId} options={GRADES.map((x) => ({ id: x.id, name: x.id }))} />
        <Choice label={c.state[locale]} value={state} onChange={setState} options={(["normal", "stiff", "painful"] as const).map((s) => ({ id: s, name: c.states[s][locale] }))} />
        <figure className="m-0 rounded-2xl border border-line bg-surface p-3">
          <svg viewBox="0 0 320 262" className="block h-auto w-full" role="img" aria-label={`${c.figure[locale]}: ${c.grade[locale]} ${g.id}, ${c.states[state][locale]}`}>
            {/* Past the limit */}
            <rect x={L} y={TOP - 6} width={xr(js.limit + 0.08) - L} height={BASE - TOP + 6} fill="rgb(var(--bad) / 0.08)" />
            {/* Axes */}
            <path d={`M${X0} ${TOP - 8}V${BASE}H${X1 + 8}`} fill="none" stroke="rgb(var(--ink-3))" strokeWidth={1} />
            <text x={X0 - 6} y={(TOP + BASE) / 2} fontSize={9} textAnchor="middle" transform={`rotate(-90 ${X0 - 6} ${(TOP + BASE) / 2})`} fill="rgb(var(--ink-3))">
              {c.resistance[locale]}
            </text>
            {state === "stiff" && (
              <g>
                <line x1={xr(1)} y1={TOP} x2={xr(1)} y2={BASE} stroke="rgb(var(--ink-3) / 0.6)" strokeDasharray="2 3" />
                <text x={xr(1) - 3} y={TOP + 2} fontSize={7.5} textAnchor="end" transform={`rotate(-90 ${xr(1) - 3} ${TOP + 2})`} fill="rgb(var(--ink-3))">
                  {c.normalEnd[locale]}
                </text>
              </g>
            )}
            {/* R1, the resistance curve and the limit */}
            <path d={`M${R1} ${BASE}C${R1 + (L - R1) * 0.55} ${BASE} ${L - 14} ${BASE - 40} ${L} ${TOP}`} fill="none" stroke="rgb(var(--ink))" strokeWidth={2} />
            <line x1={L} y1={TOP - 8} x2={L} y2={BASE} stroke="rgb(var(--ink-2))" strokeWidth={1.4} strokeDasharray="4 2" />
            <circle cx={R1} cy={BASE} r={3} fill="rgb(var(--ink))" />
            <text x={R1} y={BASE - 7} fontSize={9} textAnchor="middle" fontWeight={600} {...HALO}>
              R1
            </text>
            <text x={L} y={TOP - 11} fontSize={9} textAnchor="middle" fontWeight={600} {...HALO}>
              L
            </text>
            {js.pain !== null && (
              <g>
                <path d={`M${xr(js.pain)} ${BASE}C${xr(js.pain) + 30} ${BASE} ${L - 50} ${BASE - 40} ${L - 20} ${TOP + 30}`} fill="none" stroke="rgb(var(--bad))" strokeWidth={2} strokeDasharray="5 3" />
                <text x={L - 22} y={TOP + 24} fontSize={9} textAnchor="end" fill="rgb(var(--bad))" fontWeight={600}>
                  {c.pain[locale]}
                </text>
              </g>
            )}
            <text x={xr(js.limit + 0.04)} y={BASE - 6} fontSize={7} textAnchor="middle" transform={`rotate(-90 ${xr(js.limit + 0.04)} ${BASE - 6})`} fill="rgb(var(--bad))">
              {c.beyond[locale]}
            </text>
            <text x={X0} y={BASE + 12} fontSize={8} textAnchor="middle" fill="rgb(var(--ink-3))">
              {c.start[locale]}
            </text>

            {/* Every grade as an arrow under the axis; the picked one moves */}
            {GRADES.map((x, i) => {
              const s = gradeSpan(x.id, state);
              const y = ROW0 + i * ROW;
              const on = x.id === id;
              const colour = on ? (x.fast ? "rgb(var(--bad))" : "rgb(var(--accent))") : "rgb(var(--ink-3) / 0.7)";
              const a = xr(s.from);
              const b = xr(s.to);
              return (
                <g key={x.id} onClick={() => setId(x.id)} className="cursor-pointer">
                  <rect x={0} y={y - ROW / 2} width={320} height={ROW} fill="transparent" />
                  <text x={X0 - 12} y={y + 3} fontSize={9} textAnchor="middle" fontWeight={on ? 700 : 500} fill={on ? "rgb(var(--ink))" : "rgb(var(--ink-3))"}>
                    {x.id}
                  </text>
                  <line x1={a + 3} y1={y} x2={b - 3} y2={y} stroke={colour} strokeWidth={on ? 2.4 : 1.3} />
                  <path d={`M${a} ${y}l5 -3.5v7z`} fill={colour} />
                  <path d={`M${b} ${y}l-5 -3.5v7z`} fill={colour} />
                  {on && (
                    <circle cx={a} cy={y} r={4.5} fill={colour} stroke="rgb(var(--surface))" strokeWidth={1.5}>
                      {!reduced && (
                        <animate
                          key={`${x.id}-${state}`}
                          attributeName="cx"
                          values={x.fast ? `${xr(s.from - 0.05)};${xr(s.from - 0.05)};${b};${xr(s.from - 0.05)}` : `${a};${b};${a}`}
                          keyTimes={x.fast ? "0;0.7;0.75;1" : "0;0.5;1"}
                          dur={dur}
                          repeatCount="indefinite"
                        />
                      )}
                    </circle>
                  )}
                </g>
              );
            })}
            <text x={(X0 + X1) / 2} y={ROW0 + 5 * ROW + 6} fontSize={9} textAnchor="middle" fill="rgb(var(--ink-3))">
              {c.range[locale]} →
            </text>
          </svg>
          <figcaption className="mt-2 px-1 text-xs text-ink-2">
            <span className="font-semibold">{c.r1[locale]}</span> · <span className="font-semibold">{c.limit[locale]}</span>. {c.stateText[state][locale]}
          </figcaption>
        </figure>
      </div>

      <div className="min-w-0 space-y-4">
        <figure className="m-0 space-y-2 rounded-2xl border border-line bg-surface p-3">
          <Choice label={c.region[locale]} value={region} onChange={setRegion} options={(["neck", "mid-back", "low-back"] as const).map((x) => ({ id: x, name: REGIONS[x].name[locale] }))} />
          <svg viewBox="0 0 240 150" className="mx-auto block h-auto w-full max-w-[360px]" role="img" aria-label={`${c.joint[locale]}: ${r.name[locale]}`}>
            <g transform={`rotate(${-r.angle} 120 75) translate(120 75) scale(0.58) translate(-120 -75)`}>
              {/* Lower bone, its cartilage, and the capsule */}
              <path d="M34 80H206Q216 80 216 92V128Q216 140 204 140H48Q24 140 24 116V92Q24 80 34 80Z" fill="rgb(var(--bone))" stroke="rgb(var(--ink-3))" strokeWidth={0.8} />
              <line x1={40} y1={80} x2={200} y2={80} stroke="rgb(var(--disc))" strokeWidth={2.5} />
              {reduced && (
                <path d={`M${40 + glide(span.from)} 70H${200 + glide(span.from)}`} stroke="rgb(var(--ink-3) / 0.6)" strokeWidth={1} strokeDasharray="3 2" />
              )}
              <g transform={`translate(${glide(reduced ? span.to : span.from)} 0)`}>
                {!reduced && (
                  <animateTransform
                    key={`${id}-${state}-${region}`}
                    attributeName="transform"
                    type="translate"
                    values={manip ? `${glide(span.from - 0.05)} 0;${glide(span.from - 0.05)} 0;${glide(span.to)} -3;${glide(span.from - 0.05)} 0` : `${glide(span.from)} 0;${glide(span.to)} 0;${glide(span.from)} 0`}
                    keyTimes={manip ? "0;0.7;0.75;1" : "0;0.5;1"}
                    dur={dur}
                    repeatCount="indefinite"
                  />
                )}
                <path d="M36 10H192Q216 10 216 34V58Q216 70 206 70H34Q24 70 24 58V22Q24 10 36 10Z" fill="rgb(var(--bone))" stroke="rgb(var(--ink-3))" strokeWidth={0.8} />
                <line x1={40} y1={70} x2={200} y2={70} stroke="rgb(var(--disc))" strokeWidth={2.5} />
              </g>
              <g fill="none" stroke={stretched ? "rgb(var(--warn))" : "rgb(var(--ink-3))"} strokeWidth={stretched ? 2.2 : 1.4}>
                <path d="M30 64Q14 75 30 86" />
                <path d="M210 64Q226 75 210 86" />
              </g>
              {manip && (
                <circle cx={120} cy={75} r={4} fill="rgb(var(--surface))" stroke="rgb(var(--ink-2))">
                  {!reduced && <animate attributeName="opacity" values="0;0;1;0.6" keyTimes="0;0.72;0.76;1" dur={dur} repeatCount="indefinite" />}
                </circle>
              )}
            </g>
            <text x={6} y={14} fontSize={8.5} {...HALO} fill="rgb(var(--ink-2))">
              {r.angle >= 80 ? "≈ 90°" : `≈ ${r.angle}°`}
            </text>
            <text x={234} y={144} fontSize={8} textAnchor="end" {...HALO} fill={stretched ? "rgb(var(--warn))" : "rgb(var(--ink-3))"}>
              {c.capsule[locale]}
            </text>
            {manip && (
              <text x={234} y={14} fontSize={8} textAnchor="end" {...HALO} fill="rgb(var(--ink-2))">
                ○ {c.gas[locale]}
              </text>
            )}
          </svg>
          <figcaption className="px-1 text-xs text-ink-2">{r.text[locale]}</figcaption>
        </figure>

        <article className="space-y-3 rounded-2xl border border-line bg-surface p-5" aria-live="polite">
          <div className="flex flex-wrap items-baseline gap-2">
            <h4 className="text-lg font-semibold">
              {c.grade[locale]} {g.id}
            </h4>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${manip ? "bg-bad/10 text-bad" : "bg-accent/10 text-accent"}`}>
              {manip ? c.manipulation[locale] : c.mobilisation[locale]}
            </span>
          </div>
          <p className="leading-relaxed text-ink-2">{g.text[locale]}</p>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="rounded-xl bg-raised p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.purpose[g.purpose][locale]}</dt>
              <dd className="mt-0.5 text-ink-2">{c.purposeText[g.purpose][locale]}</dd>
            </div>
            <div className="rounded-xl bg-raised p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.feel[locale]}</dt>
              <dd className="mt-0.5">{g.feel[locale]}</dd>
            </div>
          </dl>
          <p className="rounded-xl border-l-4 border-warn bg-warn/5 p-3 text-sm">{c.evidence[locale]}</p>
          <SourceList ids={MOBILISATION_SOURCES} locale={locale} />
        </article>
      </div>
    </div>
  );
}
