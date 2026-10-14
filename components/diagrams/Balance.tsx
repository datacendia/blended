"use client";

import { useRef, useState } from "react";
import { SourceList } from "@/components/ui/SourceList";
import { BALANCE_COPY, BALANCE_SOURCES, BALANCE_TEXT, balanceState, convexHull, STANCES, type Pt, type Stance } from "@/lib/diagrams/balance";
import type { Locale } from "@/lib/i18n";
import { Choice } from "./Choice";

const STATE_STYLE = { steady: "bg-good/15 text-good", edge: "bg-warn/15 text-warn", step: "bg-bad/10 text-bad" } as const;
const DOT = { steady: "rgb(var(--good))", edge: "rgb(var(--warn))", step: "rgb(var(--bad))" } as const;
const clamp = (n: number) => Math.max(20, Math.min(220, n));

/**
 * Drag the centre of mass (or use the two sliders, which are the keyboard
 * route) and the base of support tells you whether you'd stay up.
 */
export function Balance({ locale }: { locale: Locale }) {
  const c = BALANCE_COPY;
  const svg = useRef<SVGSVGElement>(null);
  const [stance, setStance] = useState<Stance>("together");
  const [com, setCom] = useState<Pt>([120, 120]);
  const [dragging, setDragging] = useState(false);
  const base = convexHull(STANCES[stance].feet.flat());
  const state = balanceState(com, base);
  const info = BALANCE_TEXT[state];

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
        <Choice label={c.stance[locale]} value={stance} onChange={setStance} options={(Object.keys(STANCES) as Stance[]).map((id) => ({ id, name: STANCES[id].name[locale] }))} />
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
            <polygon points={base.map((p) => p.join(",")).join(" ")} fill="rgb(var(--accent) / 0.14)" stroke="rgb(var(--accent))" strokeDasharray="5 4" strokeWidth={1.5} />
            {STANCES[stance].feet.map((f, i) => (
              <polygon key={i} points={f.map((p) => p.join(",")).join(" ")} fill="rgb(var(--ink-3) / 0.35)" stroke="rgb(var(--ink-3))" strokeLinejoin="round" />
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
          </figcaption>
        </figure>
        <label className="block text-sm">
          {c.forward[locale]}
          <input type="range" min={20} max={220} value={240 - com[1]} onChange={(e) => setCom([com[0], 240 - Number(e.target.value)])} className="mt-1 block w-full accent-accent" />
        </label>
        <label className="block text-sm">
          {c.side[locale]}
          <input type="range" min={20} max={220} value={com[0]} onChange={(e) => setCom([Number(e.target.value), com[1]])} className="mt-1 block w-full accent-accent" />
        </label>
      </div>
      <article className="min-w-0 space-y-3 rounded-2xl border border-line bg-surface p-5" aria-live="polite">
        <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${STATE_STYLE[state]}`}>{info.name[locale]}</span>
        <p className="leading-relaxed text-ink-2">{info.text[locale]}</p>
        <p className="rounded-xl bg-raised p-3 text-sm">{c.evidence[locale]}</p>
        <SourceList ids={BALANCE_SOURCES} locale={locale} />
      </article>
    </div>
  );
}
