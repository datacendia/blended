"use client";

import { useRef, useState } from "react";
import { SourceList } from "@/components/ui/SourceList";
import { fill } from "@/lib/copy";
import {
  BALANCE_COPY,
  BALANCE_SOURCES,
  BALANCE_TEXT,
  balanceState,
  comForShare,
  convexHull,
  footLoads,
  footNames,
  polygonArea,
  STANCES,
  type Pt,
  type Stance
} from "@/lib/diagrams/balance";
import type { Locale } from "@/lib/i18n";
import { Choice } from "./Choice";

const STATE_STYLE = { steady: "bg-good/15 text-good", edge: "bg-warn/15 text-warn", step: "bg-bad/10 text-bad" } as const;
const DOT = { steady: "rgb(var(--good))", edge: "rgb(var(--warn))", step: "rgb(var(--bad))" } as const;
const clamp = (n: number) => Math.max(20, Math.min(220, n));
const ORDER = Object.keys(STANCES) as Stance[];
const area = (s: Stance) => polygonArea(convexHull(STANCES[s].feet.flat()));
const BY_AREA = [...ORDER].sort((a, b) => area(b) - area(a));
const MAX_AREA = area(BY_AREA[0]!);
const points = (poly: readonly Pt[]) => poly.map((p) => p.join(",")).join(" ");

/**
 * Drag the centre of mass (or use the two sliders, which are the keyboard
 * route) and the base of support tells you whether you'd stay up, and how
 * the weight splits between the feet. The weight-shift buttons move it
 * along the line between the feet, the way tai chi shifts weight from one
 * leg to the other.
 */
export function Balance({ locale }: { locale: Locale }) {
  const c = BALANCE_COPY;
  const svg = useRef<SVGSVGElement>(null);
  const [stance, setStance] = useState<Stance>("together");
  const [com, setCom] = useState<Pt>([120, 120]);
  const [dragging, setDragging] = useState(false);
  const st = STANCES[stance];
  const base = convexHull(st.feet.flat());
  const state = balanceState(com, base);
  const info = BALANCE_TEXT[state];
  const loads = footLoads(com, stance);
  const names = footNames(stance);
  const ratio = area(stance) / area("together");

  const pickStance = (s: Stance) => {
    setStance(s);
    setCom(comForShare(s, s === "empty" ? 0.1 : s === "tai-chi" ? 0.7 : 0.5));
  };

  const moveTo = (e: React.PointerEvent<SVGSVGElement>) => {
    const el = svg.current;
    const ctm = el?.getScreenCTM();
    if (!el || !ctm) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    setCom([clamp(p.x), clamp(p.y)]);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <div className="min-w-0 space-y-3">
        <Choice label={c.stance[locale]} value={stance} onChange={pickStance} options={ORDER.map((id) => ({ id, name: STANCES[id].name[locale] }))} />
        <figure className="m-0 rounded-2xl border border-line bg-surface p-3">
          <svg
            ref={svg}
            viewBox="0 0 240 240"
            className="mx-auto block h-auto w-full max-w-[360px] touch-none select-none"
            role="img"
            aria-label={`${c.figure[locale]}: ${info.name[locale]}`}
            onPointerDown={(e) => {
              setDragging(true);
              e.currentTarget.setPointerCapture(e.pointerId);
              moveTo(e);
            }}
            onPointerMove={(e) => dragging && moveTo(e)}
            onPointerUp={() => setDragging(false)}
            onPointerCancel={() => setDragging(false)}
          >
            <text x={120} y={14} textAnchor="middle" fontSize={10} fill="rgb(var(--ink-3))" letterSpacing="0.08em">
              ↑ {c.front[locale].toUpperCase()}
            </text>
            <polygon points={points(base)} fill="rgb(var(--accent) / 0.14)" stroke="rgb(var(--accent))" strokeDasharray="5 4" strokeWidth={1.5} />
            {st.outline.map((f, i) => (
              <polygon key={`o${i}`} points={points(f)} fill="rgb(var(--ink-3) / 0.12)" stroke="rgb(var(--ink-3) / 0.6)" strokeDasharray="2 2" strokeLinejoin="round" />
            ))}
            {st.feet.map((f, i) => (
              <g key={i}>
                <polygon points={points(f)} fill={`rgb(var(--ink-3) / ${(0.2 + 0.5 * (loads[i] ?? 0)).toFixed(2)})`} stroke="rgb(var(--ink-3))" strokeLinejoin="round" />
                <text x={f.reduce((a, p) => a + p[0], 0) / f.length} y={f.reduce((a, p) => a + p[1], 0) / f.length + 3.5} textAnchor="middle" fontSize={10} fontWeight={700} fill="rgb(var(--ink))" className="tnum">
                  {Math.round((loads[i] ?? 0) * 100)}%
                </text>
              </g>
            ))}
            <line x1={com[0]} y1={com[1] - 14} x2={com[0]} y2={com[1] + 14} stroke={DOT[state]} strokeWidth={1.4} />
            <line x1={com[0] - 14} y1={com[1]} x2={com[0] + 14} y2={com[1]} stroke={DOT[state]} strokeWidth={1.4} />
            <circle cx={com[0]} cy={com[1]} r={8} fill={DOT[state]} stroke="rgb(var(--surface))" strokeWidth={2} className="cursor-grab" />
          </svg>
          <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 px-1 text-xs text-ink-2">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-4 rounded-sm border border-dashed border-accent bg-accent/15" aria-hidden="true" />
              {c.base[locale]}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-ink-2" aria-hidden="true" />
              {c.com[locale]}
            </span>
            <span className="tnum font-medium text-ink">{fill(c.area[locale], { x: ratio.toFixed(1) })}</span>
          </figcaption>
        </figure>
        {st.feet.length === 2 && (
          <div role="group" aria-label={c.shift[locale]} className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.shift[locale]}</p>
            <div className="flex flex-wrap gap-2 text-sm">
              {[
                { share: 0.9, label: `${c.feetNames[names[0]!][locale]} · 90%` },
                { share: 0.5, label: c.even[locale] },
                { share: 0.1, label: `${c.feetNames[names[1]!][locale]} · 90%` }
              ].map((b) => (
                <button key={b.share} type="button" onClick={() => setCom(comForShare(stance, b.share))} className="rounded-full border border-line bg-surface px-3 py-1 hover:border-accent">
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        )}
        <label className="block text-sm">
          {c.forward[locale]}
          <input type="range" min={20} max={220} value={240 - com[1]} onChange={(e) => setCom([com[0], 240 - Number(e.target.value)])} className="mt-1 block w-full accent-accent" />
        </label>
        <label className="block text-sm">
          {c.side[locale]}
          <input type="range" min={20} max={220} value={com[0]} onChange={(e) => setCom([Number(e.target.value), com[1]])} className="mt-1 block w-full accent-accent" />
        </label>
      </div>

      <div className="min-w-0 space-y-4">
        <article className="space-y-3 rounded-2xl border border-line bg-surface p-5" aria-live="polite">
          <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${STATE_STYLE[state]}`}>{info.name[locale]}</span>
          <p className="leading-relaxed text-ink-2">{info.text[locale]}</p>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.loads[locale]}</p>
            <ul className="mt-1.5 space-y-1.5">
              {st.feet.map((_, i) => (
                <li key={i} className="grid grid-cols-[7rem_minmax(0,1fr)_3rem] items-center gap-2 text-sm">
                  <span>{st.feet.length === 1 ? c.oneFoot[locale] : c.feetNames[names[i]!][locale]}</span>
                  <span className="h-2.5 overflow-hidden rounded-full bg-raised" aria-hidden="true">
                    <span className="block h-full rounded-full bg-accent" style={{ width: `${(loads[i] ?? 0) * 100}%` }} />
                  </span>
                  <span className="tnum text-right">{Math.round((loads[i] ?? 0) * 100)}%</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="rounded-xl bg-raised p-3 text-sm">
            <span className="font-semibold">{st.name[locale]}.</span> {st.note[locale]}
          </p>
          <p className="text-sm text-ink-3">{c.evidence[locale]}</p>
          <SourceList ids={BALANCE_SOURCES} locale={locale} />
        </article>
        <section className="rounded-2xl border border-line bg-surface p-4" aria-labelledby="stance-bars">
          <h5 id="stance-bars" className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-3">
            {c.stances[locale]}
          </h5>
          <ol className="space-y-1">
            {BY_AREA.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  aria-pressed={s === stance}
                  onClick={() => pickStance(s)}
                  className={`grid w-full grid-cols-[7.5rem_minmax(0,1fr)_2.5rem] items-center gap-2 rounded-md px-1.5 py-0.5 text-left text-sm ${s === stance ? "bg-raised font-semibold" : "hover:bg-raised"}`}
                >
                  <span className="truncate">{STANCES[s].name[locale]}</span>
                  <span className="h-2 rounded-full bg-accent" style={{ width: `${(area(s) / MAX_AREA) * 100}%`, opacity: s === stance ? 1 : 0.45 }} aria-hidden="true" />
                  <span className="tnum text-right text-xs text-ink-3">{(area(s) / area("together")).toFixed(1)}×</span>
                </button>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
